// Alle Regeln und vorzulesenden Sätze. Jeder Satz hat einen festen Schlüssel,
// damit Eltern ihn einzeln mit eigener Stimme aufnehmen können.
//
// Szene: ok = true  -> so ist es richtig (Daumen hoch)
//        ok = false -> so ist es falsch  (Daumen runter)

export const RULES = [
  // ---- Seepferdchen-Kernregeln ----
  {
    id: 'essen', core: true, icon: '🍎',
    rule: 'Geh nicht mit vollem Bauch ins Wasser. Und auch nicht, wenn du ganz großen Hunger hast.',
    scenes: [
      { ok: false, text: 'Ben hat gerade ganz viel gegessen und springt sofort ins Wasser.' },
      { ok: true, text: 'Mia isst in Ruhe einen Apfel und wartet noch ein bisschen, bevor sie schwimmen geht.' },
    ],
  },
  {
    id: 'duschen', core: true, icon: '🚿',
    rule: 'Dusch dich, bevor du ins Wasser gehst.',
    scenes: [
      { ok: true, text: 'Lina duscht sich, bevor sie ins Becken geht.' },
      { ok: false, text: 'Tom ist ganz verschwitzt und springt ohne Duschen ins Becken.' },
    ],
  },
  {
    id: 'rennen', core: true, icon: '🐢',
    rule: 'Renn nicht am Beckenrand. Dort ist es nass und rutschig!',
    scenes: [
      { ok: false, text: 'Emil rennt am nassen Beckenrand.' },
      { ok: true, text: 'Lea geht langsam am Beckenrand entlang.' },
    ],
  },
  {
    id: 'schubsen', core: true, icon: '🤝',
    rule: 'Schubs niemanden ins Wasser und tauch niemanden unter.',
    scenes: [
      { ok: false, text: 'Ben schubst Mia ins Wasser.' },
      { ok: true, text: 'Ben und Mia spielen friedlich zusammen mit dem Ball.' },
    ],
  },
  {
    id: 'springen', core: true, icon: '🤸',
    rule: 'Spring nur ins Wasser, wenn es tief genug ist und niemand unter dir schwimmt.',
    scenes: [
      { ok: false, text: 'Lina springt ins Wasser, obwohl dort gerade ein Kind schwimmt.' },
      { ok: true, text: 'Tom schaut zuerst, ob das Wasser frei ist. Dann springt er.' },
    ],
  },
  {
    id: 'tiefe', core: true, icon: '📏',
    rule: 'Wenn du noch nicht schwimmen kannst, geh nur bis zum Bauch ins Wasser.',
    scenes: [
      { ok: true, text: 'Emil steht im Wasser. Es geht ihm nur bis zum Bauch.' },
      { ok: false, text: 'Lea kann noch nicht schwimmen und geht ganz tief ins Wasser.' },
    ],
  },
  {
    id: 'hilfe', core: true, icon: '🆘',
    rule: 'Ruf nie zum Spaß um Hilfe. Aber wenn jemand wirklich Hilfe braucht, hol schnell einen Erwachsenen.',
    scenes: [
      { ok: false, text: 'Tom ruft nur zum Spaß um Hilfe. Der Bademeister erschrickt.' },
      { ok: true, text: 'Mia sieht ein Kind, das Hilfe braucht, und holt schnell den Bademeister.' },
    ],
  },
  {
    id: 'luftmatratze', core: true, icon: '🦆',
    rule: 'Luftmatratzen und Gummitiere sind keine Schwimmhilfen. Spiel damit nur dort, wo du stehen kannst.',
    scenes: [
      { ok: false, text: 'Ben treibt mit der Luftmatratze weit raus ins tiefe Wasser.' },
      { ok: true, text: 'Lina spielt mit ihrer Gummiente dort, wo sie stehen kann.' },
    ],
  },
  {
    id: 'frieren', core: true, icon: '🥶',
    rule: 'Wenn du frierst oder zitterst, geh sofort raus aus dem Wasser.',
    scenes: [
      { ok: false, text: 'Emil friert und zittert, aber er bleibt trotzdem im Wasser.' },
      { ok: true, text: 'Lea friert. Sie geht raus und kuschelt sich in ihr Handtuch.' },
    ],
  },
  {
    id: 'gewitter', core: true, icon: '⛈️',
    rule: 'Bei Gewitter geh sofort raus aus dem Wasser. Und hör immer auf den Bademeister!',
    scenes: [
      { ok: false, text: 'Es donnert und blitzt, aber Tom schwimmt einfach weiter.' },
      { ok: true, text: 'Es gewittert. Der Bademeister pfeift, und Mia geht sofort aus dem Wasser.' },
    ],
  },

  // ---- Zusatzregeln (im Elternbereich zuschaltbar) ----
  {
    id: 'sonne', core: false, icon: '🧢',
    rule: 'Schütz dich vor der Sonne: mit Sonnencreme, T-Shirt und Mütze.',
    scenes: [
      { ok: true, text: 'Ben hat eine Mütze, ein T-Shirt und Sonnencreme.' },
      { ok: false, text: 'Lina ist ohne Schutz in der Sonne und bekommt einen Sonnenbrand.' },
    ],
  },
  {
    id: 'allein', core: false, icon: '👀',
    rule: 'Geh nie allein baden. Ein Erwachsener muss immer aufpassen.',
    scenes: [
      { ok: false, text: 'Tom geht ganz allein ans Wasser. Niemand passt auf ihn auf.' },
      { ok: true, text: 'Mia badet, und ihre Mama passt auf sie auf.' },
    ],
  },
  {
    id: 'unbekannt', core: false, icon: '🪨',
    rule: 'Spring nie in Wasser, das du nicht kennst. Darin können Steine oder Äste versteckt sein.',
    scenes: [
      { ok: false, text: 'Emil springt in einen See. Im Wasser ist ein großer Stein versteckt.' },
      { ok: true, text: 'Lea badet nur dort, wo es erlaubt ist und wo sie das Wasser kennt.' },
    ],
  },
  {
    id: 'boote', core: false, icon: '⛵',
    rule: 'Schwimm nicht zu Booten, Bojen oder Stegen.',
    scenes: [
      { ok: false, text: 'Ben schwimmt ganz nah an ein Boot heran.' },
      { ok: true, text: 'Lina bleibt nah am Ufer, weit weg vom Boot.' },
    ],
  },
  {
    id: 'muell', core: false, icon: '🗑️',
    rule: 'Wirf deinen Müll in den Mülleimer.',
    scenes: [
      { ok: false, text: 'Tom lässt sein Papier einfach auf dem Boden liegen.' },
      { ok: true, text: 'Mia wirft ihren Müll in den Mülleimer.' },
    ],
  },
  {
    id: 'schilf', core: false, icon: '🌾',
    rule: 'Bade nicht im Schilf und nicht in Flüssen, die schnell fließen.',
    scenes: [
      { ok: false, text: 'Emil badet im Schilf. Dort kann man sich mit den Beinen verheddern.' },
      { ok: true, text: 'Lea badet an einem ruhigen Strand.' },
    ],
  },
];

// Allgemeine Sätze, die überall vorkommen.
export const PHRASES = {
  'hallo': 'Hallo! Ich bin Sepp, das Seepferdchen. Komm, wir lernen zusammen die Baderegeln!',
  'buch.intro': 'Hier zeige ich dir die Baderegeln. Tippe auf ein Bild, dann erzähle ich dir, was passiert.',
  'quiz.intro': 'Schau dir die Bilder genau an!',
  'quiz.frage': 'Ist das richtig oder falsch?',
  'lob.1': 'Super, das stimmt!',
  'lob.2': 'Toll gemacht!',
  'lob.3': 'Ja, genau richtig!',
  'trost.1': 'Hmm, schau nochmal genau hin.',
  'trost.2': 'Fast! Pass auf, ich erkläre es dir.',
  'sticker.neu': 'Juhu! Du hast einen neuen Sticker bekommen!',
  'runde.ende': 'Die Runde ist geschafft! Du bist ein echter Wasser-Profi!',
  'sticker.intro': 'Das sind deine Sticker. Sammle alle, dann bekommst du eine Urkunde!',
  'urkunde': 'Hurra! Du kennst alle Baderegeln! Hier ist deine Urkunde.',
};

// Schlüssel der Sätze einer Regel
export const ruleKey = (id) => `r.${id}`;
export const sceneKey = (id, i) => `r.${id}.${i}`;

// Text zu einem Satzschlüssel
export function textFor(key) {
  if (PHRASES[key]) return PHRASES[key];
  const m = /^r\.([^.]+)(?:\.(\d))?$/.exec(key);
  if (!m) return '';
  const rule = RULES.find((r) => r.id === m[1]);
  if (!rule) return '';
  return m[2] === undefined ? rule.rule : rule.scenes[Number(m[2])].text;
}

// Alle Satzschlüssel für die gegebenen Regeln (für die Aufnahmeliste)
export function allKeys(rules) {
  const keys = Object.keys(PHRASES);
  for (const r of rules) {
    keys.push(ruleKey(r.id));
    r.scenes.forEach((_, i) => keys.push(sceneKey(r.id, i)));
  }
  return keys;
}
