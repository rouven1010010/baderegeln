// Sprachausgabe: Elternaufnahme, Computerstimme oder stumm.
import { settings, getAudio } from './storage.js';
import { textFor } from './rules.js';

const synth = window.speechSynthesis;
// Ein einziges Audio-Element, das beim ersten Tippen freigeschaltet wird (iOS)
const player = new Audio();
const SILENCE = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
let current = null;   // laufendes Audio-Element
let token = 0;        // jede neue Ausgabe bricht die vorige ab

export function unlockAudio() {
  player.src = SILENCE;
  player.play().catch(() => {});
}

export function germanVoices() {
  if (!synth) return [];
  const all = synth.getVoices();
  const de = all.filter((v) => v.lang && v.lang.toLowerCase().startsWith('de'));
  return de.length ? de : all;
}

export function onVoicesChanged(fn) {
  if (synth) synth.addEventListener('voiceschanged', fn);
}

export function stop() {
  token++;
  if (current) { current.pause(); current = null; }
  if (synth) synth.cancel();
}

function speakTTS(text, my) {
  return new Promise((resolve) => {
    if (!synth || !text) return resolve();
    const s = settings();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'de-DE';
    const voice = germanVoices().find((v) => v.voiceURI === s.voiceURI) || germanVoices()[0];
    if (voice) { u.voice = voice; u.lang = voice.lang; }
    u.rate = s.rate;
    u.pitch = s.pitch;
    // Manche Browser feuern 'end' nicht zuverlässig -> Sicherheits-Timeout
    const guard = setTimeout(resolve, 1500 + text.length * 120);
    u.onend = u.onerror = () => { clearTimeout(guard); resolve(); };
    if (my !== token) return resolve();
    synth.speak(u);
  });
}

export function playBlob(blob, my = token) {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(blob);
    const a = player;
    a.src = url;
    current = a;
    let finished = false;
    const done = () => {
      if (finished) return;
      finished = true;
      a.onended = a.onerror = null;
      URL.revokeObjectURL(url);
      if (current === a) current = null;
      resolve();
    };
    a.onended = a.onerror = done;
    if (my !== token) return done();
    a.play().catch(done);
  });
}

async function speakOne(key, my) {
  const mode = settings().voiceMode;
  if (mode === 'none' || my !== token) return;
  if (mode === 'parent') {
    const blob = await getAudio(key);
    if (my !== token) return;
    if (blob) return playBlob(blob, my);
  }
  return speakTTS(textFor(key), my);
}

// say('hallo') oder say(['lob.1', 'r.rennen'])
export async function say(keys) {
  stop();
  const my = token;
  for (const key of [].concat(keys)) {
    if (my !== token) return;
    await speakOne(key, my);
  }
}

// Vorschau der Computerstimme im Elternbereich
export function sayText(text) {
  stop();
  return speakTTS(text, token);
}
