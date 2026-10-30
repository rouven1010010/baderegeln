// Mikrofonaufnahme für die Elternstimme.

let stream = null;
let rec = null;
let chunks = [];

const TYPES = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/aac', 'audio/ogg'];

export const supported = () => !!(navigator.mediaDevices && window.MediaRecorder);

export async function start() {
  if (!stream) stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
  const mimeType = TYPES.find((t) => MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t));
  rec = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
  chunks = [];
  rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
  rec.start();
}

export function stopRec() {
  return new Promise((resolve) => {
    if (!rec || rec.state === 'inactive') return resolve(null);
    rec.onstop = () => resolve(new Blob(chunks, { type: rec.mimeType || 'audio/mp4' }));
    rec.stop();
  });
}

export const isRecording = () => !!rec && rec.state === 'recording';

// Mikrofon freigeben, wenn der Elternbereich geschlossen wird
export function release() {
  if (stream) stream.getTracks().forEach((t) => t.stop());
  stream = null;
  rec = null;
}
