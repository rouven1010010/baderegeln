// Kleine Geräuscheffekte, mit WebAudio erzeugt (keine Dateien nötig).
import { settings } from './storage.js';

let ctx = null;

// Muss einmal bei einer Berührung aufgerufen werden (iOS)
export function unlock() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) ctx = new AC();
  }
  if (ctx && ctx.state === 'suspended') ctx.resume();
}

function tone(freq, start, dur, type = 'sine', vol = 1) {
  const v = settings().sfxVolume * vol;
  if (!ctx || v <= 0) return;
  const t = ctx.currentTime + start;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.35 * v, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(ctx.destination);
  o.start(t);
  o.stop(t + dur + 0.05);
}

function splash(start = 0) {
  const v = settings().sfxVolume;
  if (!ctx || v <= 0) return;
  const len = ctx.sampleRate * 0.5;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const f = ctx.createBiquadFilter();
  f.type = 'lowpass';
  f.frequency.value = 1400;
  const g = ctx.createGain();
  g.gain.value = 0.5 * v;
  src.connect(f).connect(g).connect(ctx.destination);
  src.start(ctx.currentTime + start);
}

export const sfx = {
  tap: () => tone(660, 0, 0.08, 'triangle', 0.5),
  right: () => { tone(523, 0, 0.15); tone(659, 0.1, 0.15); tone(784, 0.2, 0.3); },
  wrong: () => { tone(330, 0, 0.18, 'triangle', 0.6); tone(294, 0.16, 0.25, 'triangle', 0.6); },
  sticker: () => { [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.12, 0.25, 'triangle')); tone(1047, 0.5, 0.5); },
  splash: () => splash(),
  fanfare: () => { [392, 523, 659, 784, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.14, 0.3, 'square', 0.4)); },
};
