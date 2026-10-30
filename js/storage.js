// Einstellungen und Fortschritt in localStorage, Sprachaufnahmen in IndexedDB.
// Alles bleibt auf dem Gerät.

const LS_KEY = 'baderegeln.v1';

const DEFAULTS = {
  settings: {
    name: '',
    voiceMode: 'tts',      // 'parent' | 'tts' | 'none'
    voiceURI: '',
    rate: 0.9,
    pitch: 1.1,
    sfxVolume: 0.6,
    extras: [],            // ids der eingeschalteten Zusatzregeln
  },
  progress: {
    scenes: {},            // 'regelId.index' -> true, wenn richtig beantwortet
    stickers: {},          // regelId -> Zeitstempel
    certificateDate: null,
  },
};

let state = load();

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
    return {
      settings: { ...DEFAULTS.settings, ...(raw.settings || {}) },
      progress: { ...structuredClone(DEFAULTS.progress), ...(raw.progress || {}) },
    };
  } catch {
    return structuredClone(DEFAULTS);
  }
}

export function save() {
  try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch { /* Speicher voll oder gesperrt */ }
}

export const settings = () => state.settings;
export const progress = () => state.progress;

export function setSetting(key, value) {
  state.settings[key] = value;
  save();
}

export function resetProgress() {
  state.progress = structuredClone(DEFAULTS.progress);
  save();
}

// ---------- IndexedDB für Audio ----------
let dbPromise;
function db() {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open('baderegeln', 1);
      req.onupgradeneeded = () => req.result.createObjectStore('audio');
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  return dbPromise;
}

function tx(mode, fn) {
  return db().then((d) => new Promise((resolve, reject) => {
    const t = d.transaction('audio', mode);
    const store = t.objectStore('audio');
    const req = fn(store);
    t.oncomplete = () => resolve(req && req.result);
    t.onerror = () => reject(t.error);
  }));
}

export const getAudio = (key) => tx('readonly', (s) => s.get(key)).catch(() => undefined);
export const putAudio = (key, blob) => tx('readwrite', (s) => s.put(blob, key));
export const deleteAudio = (key) => tx('readwrite', (s) => s.delete(key));
export const audioKeys = () => tx('readonly', (s) => s.getAllKeys()).catch(() => []);
const clearAudio = () => tx('readwrite', (s) => s.clear());

// ---------- Sichern / Laden ----------
const blobToB64 = (blob) => new Promise((resolve) => {
  const r = new FileReader();
  r.onload = () => resolve(String(r.result).split(',')[1]);
  r.readAsDataURL(blob);
});

const b64ToBlob = (b64, type) => {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type });
};

export async function exportAll() {
  const audio = {};
  for (const key of await audioKeys()) {
    const blob = await getAudio(key);
    if (blob) audio[key] = { type: blob.type, data: await blobToB64(blob) };
  }
  const data = { app: 'baderegeln', version: 1, exported: new Date().toISOString(), ...state, audio };
  return new Blob([JSON.stringify(data)], { type: 'application/json' });
}

export async function importAll(file) {
  const data = JSON.parse(await file.text());
  if (data.app !== 'baderegeln') throw new Error('Das ist keine Baderegeln-Sicherung.');
  state = {
    settings: { ...DEFAULTS.settings, ...(data.settings || {}) },
    progress: { ...structuredClone(DEFAULTS.progress), ...(data.progress || {}) },
  };
  save();
  await clearAudio();
  for (const [key, a] of Object.entries(data.audio || {})) {
    await putAudio(key, b64ToBlob(a.data, a.type));
  }
}
