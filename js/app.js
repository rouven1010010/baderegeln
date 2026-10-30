import { RULES, ruleKey, sceneKey, allKeys, textFor } from './rules.js';
import { sceneSVG, seppSVG } from './scenes.js';
import * as store from './storage.js';
import { say, sayText, stop, unlockAudio, germanVoices, onVoicesChanged, playBlob } from './speech.js';
import * as recorder from './recorder.js';
import { sfx, unlock } from './sound.js';

const app = document.getElementById('app');
const $ = (sel, el = app) => el.querySelector(sel);
const $$ = (sel, el = app) => [...el.querySelectorAll(sel)];
const shuffle = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const activeRules = () => RULES.filter((r) => r.core || store.settings().extras.includes(r.id));
const sceneDone = (id, i) => !!store.progress().scenes[`${id}.${i}`];
const hasSticker = (id) => !!store.progress().stickers[id];
const stickerCount = () => activeRules().filter((r) => hasSticker(r.id)).length;
const allDone = () => activeRules().every((r) => hasSticker(r.id));

function render(html, cls = '') {
  stop();
  app.className = `screen ${cls}`;
  app.innerHTML = html;
}

const homeBtn = '<button class="round-btn" data-home aria-label="Start">🏠</button>';
function bindHome() {
  $$('[data-home]').forEach((b) => b.addEventListener('click', () => { sfx.tap(); home(); }));
}

function seppReact(cls) {
  const s = $('.sepp');
  if (!s) return;
  s.classList.remove('jump', 'think');
  void s.getBoundingClientRect();
  s.classList.add(cls);
  setTimeout(() => s.classList.remove(cls), 1500);
}

function confetti() {
  const box = document.createElement('div');
  box.className = 'confetti';
  const items = ['⭐', '💧', '🫧', '🌟', '🐠', '🎉'];
  for (let i = 0; i < 36; i++) {
    const s = document.createElement('span');
    s.textContent = pick(items);
    s.style.left = `${Math.random() * 100}%`;
    s.style.animationDuration = `${1.8 + Math.random() * 1.6}s`;
    s.style.animationDelay = `${Math.random() * 0.6}s`;
    box.appendChild(s);
  }
  document.body.appendChild(box);
  setTimeout(() => box.remove(), 4200);
}

function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2600);
}

// ---------- Start ----------
function splash() {
  render(`<div class="splash">${seppSVG()}<h1 class="title">Baderegeln mit Sepp</h1><button class="play-btn" aria-label="Los geht's">▶️</button></div>`);
  $('.play-btn').addEventListener('click', () => {
    unlock();
    unlockAudio();
    home();
    say('hallo');
  });
}

function home() {
  const n = stickerCount(), total = activeRules().length;
  render(`
    <div class="bar"><span></span><button class="gear" aria-label="Elternbereich (3 Sekunden halten)">⚙️</button></div>
    <div class="home-main">
      ${seppSVG('home-sepp')}
      <div class="menu">
        <button class="menu-btn book" data-go="book" aria-label="Regel-Buch">📖</button>
        <button class="menu-btn quiz" data-go="quiz" aria-label="Quiz">👍👎</button>
        <button class="menu-btn stars" data-go="stickers" aria-label="Sticker">⭐<span class="badge-count">${n}/${total}</span></button>
      </div>
    </div>`, 'home');
  $('.home-sepp').addEventListener('click', () => { seppReact('jump'); say('hallo'); });
  $$('[data-go]').forEach((b) => b.addEventListener('click', () => {
    sfx.tap();
    ({ book: () => book(0), quiz, stickers })[b.dataset.go]();
  }));
  bindGear($('.gear'));
}

// ---------- Bilderbuch ----------
function book(index) {
  const rules = activeRules();
  index = (index + rules.length) % rules.length;
  const r = rules[index];
  // Richtiges Bild zuerst
  const order = r.scenes.map((s, i) => ({ ...s, i })).sort((a, b) => Number(b.ok) - Number(a.ok));
  render(`
    <div class="bar">${homeBtn}<div class="dots">${rules.map((_, i) => `<span class="dot ${i === index ? 'on' : ''}"></span>`).join('')}</div><button class="round-btn" data-speak aria-label="Nochmal vorlesen">🔊</button></div>
    <div class="book-page">
      ${order.map((s) => `<figure class="card ${s.ok ? 'good' : 'bad'}" data-i="${s.i}">${sceneSVG(r.id, s.i)}<span class="mark">${s.ok ? '👍' : '👎'}</span></figure>`).join('')}
    </div>
    <div class="nav">
      <button class="round-btn" data-prev aria-label="Zurück">⬅️</button>
      <div class="rule-icon">${r.icon}</div>
      <button class="round-btn" data-next aria-label="Weiter">➡️</button>
    </div>`, 'book');
  bindHome();
  const intro = index === 0 && !book.introDone ? ['buch.intro'] : [];
  book.introDone = true;
  say([...intro, ruleKey(r.id)]);
  $('[data-speak]').addEventListener('click', () => say(ruleKey(r.id)));
  $('[data-prev]').addEventListener('click', () => { sfx.tap(); book(index - 1); });
  $('[data-next]').addEventListener('click', () => { sfx.tap(); book(index + 1); });
  $$('.card').forEach((c) => c.addEventListener('click', () => {
    c.classList.remove('tapped');
    void c.offsetWidth;
    c.classList.add('tapped');
    say(sceneKey(r.id, Number(c.dataset.i)));
  }));
  swipe($('.book-page'), () => book(index + 1), () => book(index - 1));
}

function swipe(el, onLeft, onRight) {
  let x0 = null;
  el.addEventListener('pointerdown', (e) => { x0 = e.clientX; });
  el.addEventListener('pointerup', (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0;
    x0 = null;
    if (Math.abs(dx) > 70) { sfx.tap(); (dx < 0 ? onLeft : onRight)(); }
  });
}

// ---------- Quiz ----------
const ROUND = 5;

function buildRound() {
  const pool = activeRules().flatMap((r) => r.scenes.map((s, i) => ({ id: r.id, i, ok: s.ok })));
  const open = shuffle(pool.filter((p) => !sceneDone(p.id, p.i)));
  const done = shuffle(pool.filter((p) => sceneDone(p.id, p.i)));
  return shuffle([...open, ...done].slice(0, ROUND));
}

function quiz() {
  const q = { items: buildRound(), pos: 0, results: [], retried: new Set() };
  quizStep(q, true);
}

function quizStep(q, first = false) {
  const item = q.items[q.pos];
  render(`
    <div class="bar">${homeBtn}<div class="dots">${q.items.map((_, i) => `<span class="dot ${q.results[i] || (i === q.pos ? 'on' : '')}"></span>`).join('')}</div><button class="round-btn" data-speak aria-label="Nochmal vorlesen">🔊</button></div>
    <div class="quiz-main">
      <figure class="card">${sceneSVG(item.id, item.i)}</figure>
      <div class="answers">
        <button class="answer yes" data-a="1" aria-label="Richtig">👍</button>
        <button class="answer no" data-a="0" aria-label="Falsch">👎</button>
        <button class="next-btn hidden" aria-label="Weiter">➡️</button>
      </div>
    </div>
    ${seppSVG('quiz-sepp')}`, 'quiz');
  bindHome();
  const question = [sceneKey(item.id, item.i), 'quiz.frage'];
  say(first ? ['quiz.intro', ...question] : question);
  $('[data-speak]').addEventListener('click', () => say(question));
  $$('.answer').forEach((b) => b.addEventListener('click', () => answer(q, item, b.dataset.a === '1')));
}

function answer(q, item, saidOk) {
  const right = saidOk === item.ok;
  $$('.answer').forEach((b) => {
    b.disabled = true;
    if ((b.dataset.a === '1') === item.ok) b.classList.add('correct');
  });
  const card = $('.card');
  card.classList.add(item.ok ? 'good' : 'bad');
  card.insertAdjacentHTML('beforeend', `<span class="mark">${item.ok ? '👍' : '👎'}</span>`);
  const fb = document.createElement('div');
  fb.className = 'feedback';
  fb.textContent = right ? '✅' : '🤔';
  card.appendChild(fb);
  setTimeout(() => fb.remove(), 1200);

  const speech = [];
  let newSticker = null;
  if (right) {
    sfx.right();
    seppReact('jump');
    q.results[q.pos] = q.results[q.pos] || 'good';
    const p = store.progress();
    p.scenes[`${item.id}.${item.i}`] = true;
    const rule = RULES.find((r) => r.id === item.id);
    if (!hasSticker(item.id) && rule.scenes.every((_, i) => sceneDone(item.id, i))) {
      p.stickers[item.id] = Date.now();
      newSticker = rule;
    }
    store.save();
    speech.push(pick(['lob.1', 'lob.2', 'lob.3']), ruleKey(item.id));
    if (newSticker) speech.push('sticker.neu');
  } else {
    sfx.wrong();
    seppReact('think');
    q.results[q.pos] = 'bad';
    const key = `${item.id}.${item.i}`;
    if (!q.retried.has(key)) {
      q.retried.add(key);
      q.items.push(item);
    }
    speech.push(pick(['trost.1', 'trost.2']), ruleKey(item.id));
  }
  $$('.dot')[q.pos].className = `dot ${q.results[q.pos]}`;
  say(speech);

  const next = $('.next-btn');
  const showNext = () => {
    $$('.answer:not(.correct)').forEach((b) => b.classList.add('hidden'));
    next.classList.remove('hidden');
  };
  if (newSticker) {
    setTimeout(() => stickerPopup(newSticker, showNext), 900);
  } else {
    setTimeout(showNext, 600);
  }
  next.addEventListener('click', () => {
    sfx.tap();
    q.pos++;
    if (q.pos < q.items.length) quizStep(q);
    else roundEnd();
  });
}

function stickerPopup(rule, then) {
  sfx.sticker();
  confetti();
  const pop = document.createElement('div');
  pop.className = 'sticker-pop';
  pop.innerHTML = `<div class="sticker got ${rule.core ? '' : 'bonus'}">${rule.icon}</div>`;
  const close = () => { pop.remove(); then(); };
  pop.addEventListener('click', close);
  document.body.appendChild(pop);
  setTimeout(() => pop.isConnected && close(), 3500);
}

function roundEnd() {
  const done = allDone();
  const firstTime = done && !store.progress().certificateDate;
  if (firstTime) { store.progress().certificateDate = Date.now(); store.save(); }
  render(`
    <div class="bar">${homeBtn}<span></span></div>
    <div class="round-end">
      ${seppSVG('jump')}
      <div class="row">
        <button class="big-btn" data-again aria-label="Nochmal">🔁</button>
        <button class="big-btn" data-stickers aria-label="Sticker">⭐</button>
        ${done ? '<button class="big-btn gold" data-cert aria-label="Urkunde">🏆</button>' : ''}
      </div>
    </div>`, 'quiz');
  bindHome();
  sfx.fanfare();
  confetti();
  say(firstTime ? ['runde.ende', 'urkunde'] : 'runde.ende');
  $('[data-again]').addEventListener('click', () => { sfx.tap(); quiz(); });
  $('[data-stickers]').addEventListener('click', () => { sfx.tap(); stickers(); });
  if (done) $('[data-cert]').addEventListener('click', () => { sfx.tap(); certificate(); });
}

// ---------- Sticker ----------
function stickers() {
  const rules = activeRules();
  render(`
    <div class="bar">${homeBtn}<div class="dots"><b style="color:#fff;font-size:28px">⭐ ${stickerCount()} / ${rules.length}</b></div><span style="width:68px"></span></div>
    <div class="sticker-wall">
      ${rules.map((r) => hasSticker(r.id)
        ? `<button class="sticker got ${r.core ? '' : 'bonus'}" data-id="${r.id}" aria-label="Sticker">${r.icon}</button>`
        : '<div class="sticker">?</div>').join('')}
    </div>
    ${allDone() ? '<div class="cert-cta"><button class="big-btn gold" data-cert aria-label="Urkunde">🏆</button></div>' : ''}`, 'stickers');
  bindHome();
  say(allDone() ? 'urkunde' : 'sticker.intro');
  $$('.sticker.got').forEach((b) => b.addEventListener('click', () => {
    b.classList.remove('new');
    void b.offsetWidth;
    b.classList.add('new');
    say(ruleKey(b.dataset.id));
  }));
  const c = $('[data-cert]');
  if (c) c.addEventListener('click', () => { sfx.tap(); certificate(); });
}

// ---------- Urkunde ----------
function certificate(fromParent = false) {
  const name = store.settings().name.trim();
  const date = new Date(store.progress().certificateDate || Date.now()).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
  render(`
    <div class="bar">${homeBtn}<span></span><button class="round-btn" data-print aria-label="Drucken">🖨️</button></div>
    <div class="certificate">
      <div class="cert-inner">
        ${seppSVG()}
        <h1>Urkunde</h1>
        <p class="cert-name">${esc(name || 'Unser Wasser-Profi')}</p>
        <p class="cert-text">kennt alle Baderegeln und ist bereit fürs Seepferdchen!</p>
        <div class="cert-icons">${activeRules().map((r) => r.icon).join(' ')}</div>
        <div class="cert-foot"><span>📅 ${date}</span><span>✍️ Sepp, das Seepferdchen</span></div>
      </div>
    </div>`, 'cert');
  bindHome();
  $('[data-print]').addEventListener('click', () => window.print());
  if (!fromParent) { sfx.fanfare(); confetti(); say('urkunde'); }
}

// ---------- Eltern-Schutz ----------
function bindGear(gear) {
  let timer = null;
  const cancel = () => { clearTimeout(timer); timer = null; gear.classList.remove('holding'); };
  gear.addEventListener('contextmenu', (e) => e.preventDefault());
  gear.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    gear.classList.add('holding');
    timer = setTimeout(() => { cancel(); gate(); }, 3000);
  });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => gear.addEventListener(ev, cancel));
}

function gate() {
  stop();
  const a = 3 + Math.floor(Math.random() * 7), b = 3 + Math.floor(Math.random() * 7);
  const right = a * b;
  const opts = new Set([right]);
  while (opts.size < 4) {
    const v = right + pick([-1, 1]) * (1 + Math.floor(Math.random() * 9));
    if (v > 0) opts.add(v);
  }
  const m = document.createElement('div');
  m.className = 'modal';
  m.innerHTML = `<div class="modal-box"><h2>Elternbereich</h2><p>Bitte lösen:</p><div class="q">${a} × ${b} = ?</div>
    <div class="gate-options">${shuffle([...opts]).map((v) => `<button data-v="${v}">${v}</button>`).join('')}</div>
    <button class="link-btn" data-cancel>Abbrechen</button></div>`;
  document.body.appendChild(m);
  m.addEventListener('click', (e) => {
    const t = e.target.closest('button');
    if (e.target === m || (t && t.hasAttribute('data-cancel'))) return m.remove();
    if (!t) return;
    m.remove();
    if (Number(t.dataset.v) === right) parent();
  });
}

// ---------- Elternbereich ----------
async function parent() {
  const s = store.settings();
  const extras = RULES.filter((r) => !r.core);
  render(`
  <div class="parent">
    <header><h1>⚙️ Elternbereich</h1><button class="btn primary" data-close>Fertig</button></header>

    <section>
      <h2>Kind</h2>
      <label class="row">Name für die Urkunde: <input type="text" data-name maxlength="40" value="${esc(s.name)}" placeholder="z. B. Paul"></label>
    </section>

    <section>
      <h2>Regeln</h2>
      <p class="hint">Die 10 Seepferdchen-Regeln sind immer dabei. Zusatzregeln kannst du hier einschalten. Alle eingeschalteten Regeln zählen für die Urkunde.</p>
      ${extras.map((r) => `<label class="extra-rule"><input type="checkbox" data-extra="${r.id}" ${s.extras.includes(r.id) ? 'checked' : ''}><span class="ic">${r.icon}</span><span>${esc(r.rule)}</span></label>`).join('')}
    </section>

    <section>
      <h2>Sprachausgabe</h2>
      <div class="seg">
        ${[['parent', '👪 Elternstimme'], ['tts', '🤖 Computerstimme'], ['none', '🔇 Keine Stimme']].map(([v, l]) => `<label><input type="radio" name="voiceMode" value="${v}" ${s.voiceMode === v ? 'checked' : ''}>${l}</label>`).join('')}
      </div>
      <p class="hint" data-mode-hint></p>
      <div data-tts>
        <h2 style="margin-top:14px">Computerstimme</h2>
        <label class="row">Stimme: <select data-voice></select></label>
        <label class="row">Tempo <input type="range" min="0.6" max="1.3" step="0.05" data-rate value="${s.rate}"></label>
        <label class="row">Tonhöhe <input type="range" min="0.6" max="1.6" step="0.05" data-pitch value="${s.pitch}"></label>
        <button class="btn" data-test>▶️ Probe hören</button>
      </div>
    </section>

    <section data-rec-section>
      <h2>Elternstimme aufnehmen</h2>
      <p class="hint">Tippe ⏺️, sprich den Satz, tippe ⏹️. Mit ▶️ hörst du ihn an. Sätze ohne Aufnahme liest die Computerstimme vor. Die Aufnahmen bleiben nur auf diesem Gerät (siehe „Sichern“).</p>
      <div class="meter"><div data-meter></div></div>
      <p class="hint" data-count></p>
      <ul class="rec-list" data-rec-list></ul>
    </section>

    <section>
      <h2>Geräusche</h2>
      <label class="row">Lautstärke <input type="range" min="0" max="1" step="0.1" data-sfx value="${s.sfxVolume}"></label>
    </section>

    <section>
      <h2>Fortschritt</h2>
      <p class="hint">Sticker: ${stickerCount()} von ${activeRules().length}</p>
      <div class="row">
        <button class="btn" data-cert>🏆 Urkunde ansehen / drucken</button>
        <button class="btn danger" data-reset>Fortschritt zurücksetzen</button>
      </div>
    </section>

    <section>
      <h2>Sichern &amp; auf anderes Gerät übertragen</h2>
      <p class="hint">„Sichern“ erzeugt eine Datei mit Aufnahmen, Fortschritt und Einstellungen. Diese Datei auf dem anderen Gerät mit „Laden“ öffnen.</p>
      <div class="row">
        <button class="btn" data-export>💾 Sichern</button>
        <label class="btn" style="cursor:pointer">📂 Laden<input type="file" accept="application/json,.json" data-import hidden></label>
      </div>
    </section>
  </div>`, 'parent-screen');

  const close = () => { recorder.release(); home(); };
  $('[data-close]').addEventListener('click', close);
  $('[data-name]').addEventListener('input', (e) => store.setSetting('name', e.target.value));

  $$('[data-extra]').forEach((c) => c.addEventListener('change', () => {
    store.setSetting('extras', $$('[data-extra]').filter((x) => x.checked).map((x) => x.dataset.extra));
    renderRecList();
  }));

  const modeHint = {
    parent: 'Deine Aufnahmen werden abgespielt. Fehlt eine Aufnahme, springt die Computerstimme ein.',
    tts: 'Das Gerät liest alle Sätze vor.',
    none: 'Es gibt nur Bilder und Geräusche. Du erklärst die Regeln selbst.',
  };
  const updateMode = () => {
    const m = store.settings().voiceMode;
    $('[data-mode-hint]').textContent = modeHint[m];
    $('[data-tts]').classList.toggle('hidden', m === 'none');
    $('[data-rec-section]').classList.toggle('hidden', m !== 'parent');
  };
  $$('input[name=voiceMode]').forEach((r) => r.addEventListener('change', () => { store.setSetting('voiceMode', r.value); updateMode(); }));
  updateMode();

  const fillVoices = () => {
    const sel = $('[data-voice]');
    if (!sel) return;
    const voices = germanVoices();
    sel.innerHTML = voices.length
      ? voices.map((v) => `<option value="${esc(v.voiceURI)}" ${v.voiceURI === store.settings().voiceURI ? 'selected' : ''}>${esc(v.name)} (${esc(v.lang)})</option>`).join('')
      : '<option value="">Standardstimme</option>';
  };
  fillVoices();
  onVoicesChanged(fillVoices);
  $('[data-voice]').addEventListener('change', (e) => store.setSetting('voiceURI', e.target.value));
  $('[data-rate]').addEventListener('change', (e) => store.setSetting('rate', Number(e.target.value)));
  $('[data-pitch]').addEventListener('change', (e) => store.setSetting('pitch', Number(e.target.value)));
  $('[data-test]').addEventListener('click', () => sayText(textFor('hallo')));
  $('[data-sfx]').addEventListener('change', (e) => { store.setSetting('sfxVolume', Number(e.target.value)); sfx.right(); });

  $('[data-cert]').addEventListener('click', () => { recorder.release(); certificate(true); });
  $('[data-reset]').addEventListener('click', () => {
    if (confirm('Alle Sticker und den Quiz-Fortschritt löschen? Aufnahmen und Einstellungen bleiben erhalten.')) {
      store.resetProgress();
      toast('Fortschritt zurückgesetzt.');
      parent();
    }
  });

  $('[data-export]').addEventListener('click', async () => {
    const blob = await store.exportAll();
    const fname = `baderegeln-sicherung-${new Date().toISOString().slice(0, 10)}.json`;
    const file = new File([blob], fname, { type: 'application/json' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: 'Baderegeln-Sicherung' }); return; } catch (e) { if (e.name === 'AbortError') return; }
    }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = fname;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  });
  $('[data-import]').addEventListener('change', async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    try {
      await store.importAll(f);
      toast('Sicherung geladen ✔');
      parent();
    } catch (err) {
      toast(`Laden fehlgeschlagen: ${err.message}`);
    }
  });

  renderRecList();
}

async function renderRecList() {
  const list = $('[data-rec-list]');
  if (!list) return;
  const recorded = new Set(await store.audioKeys());
  const rules = activeRules();
  const general = allKeys([]);
  const groups = [['Allgemein', general], ...rules.map((r) => [`${r.icon} ${r.core ? '' : 'Zusatz: '}${r.rule}`, allKeys([r]).filter((k) => !general.includes(k))])];
  const total = allKeys(rules);
  const done = total.filter((k) => recorded.has(k)).length;
  $('[data-count]').textContent = `${done} von ${total.length} Sätzen aufgenommen`;
  $('[data-meter]').style.width = `${(done / total.length) * 100}%`;

  if (!recorder.supported()) {
    list.innerHTML = '<li>Dieser Browser unterstützt keine Aufnahmen.</li>';
    return;
  }
  list.innerHTML = groups.map(([title, keys]) => `<li class="group">${esc(title.length > 60 ? title.slice(0, 58) + '…' : title)}</li>` +
    keys.map((k) => `<li data-key="${k}"><span class="state">${recorded.has(k) ? '✅' : '⚪'}</span><span class="txt">${esc(textFor(k))}</span>
      <button class="btn small rec" aria-label="Aufnehmen">⏺️</button>
      <button class="btn small play" aria-label="Anhören" ${recorded.has(k) ? '' : 'disabled'}>▶️</button>
      <button class="btn small del" aria-label="Löschen" ${recorded.has(k) ? '' : 'disabled'}>🗑️</button></li>`).join('')).join('');

  $$('li[data-key]', list).forEach((li) => {
    const key = li.dataset.key;
    const recBtn = $('.rec', li);
    recBtn.addEventListener('click', async () => {
      if (recBtn.classList.contains('on')) {
        const blob = await recorder.stopRec();
        recBtn.classList.remove('on');
        recBtn.textContent = '⏺️';
        if (blob && blob.size > 0) {
          await store.putAudio(key, blob);
          renderRecList();
        }
        return;
      }
      if (recorder.isRecording()) return toast('Bitte zuerst die laufende Aufnahme stoppen.');
      stop();
      try {
        await recorder.start();
        recBtn.classList.add('on');
        recBtn.textContent = '⏹️';
      } catch {
        toast('Kein Zugriff aufs Mikrofon. Bitte in den Browser-Einstellungen erlauben.');
      }
    });
    $('.play', li).addEventListener('click', async () => {
      stop();
      const blob = await store.getAudio(key);
      if (blob) playBlob(blob);
    });
    $('.del', li).addEventListener('click', async () => {
      await store.deleteAudio(key);
      renderRecList();
    });
  });
}

// ---------- Offline ----------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}

splash();
