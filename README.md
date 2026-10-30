# Baderegeln mit Sepp 🐴🌊

Eine kleine Lern-App für Kinder ab etwa 4 Jahren, die fürs **Seepferdchen** die Baderegeln lernen, ganz ohne Lesen. Sepp, das Seepferdchen, erklärt mit Bildern und Stimme:

- 📖 **Regel-Buch:** Zu jeder Regel gibt es ein richtiges 👍 und ein falsches 👎 Bild. Wenn man auf ein Bild tippt, wird es vorgelesen.
- 👍👎 **Quiz:** „Ist das richtig oder falsch?“ Eine Runde hat 5 Bilder, und Fehler werden freundlich erklärt.
- ⭐ **Sticker und Urkunde:** Für jede Regel, die sitzt, gibt es einen Sticker. Wer alle Sticker hat, bekommt eine Urkunde mit Namen, die man auch ausdrucken kann.

Die App läuft offline, speichert alles nur auf dem Gerät und sammelt keine Daten.

## Installieren (Tablet / Handy)

1. Die Web-Adresse der App im Browser öffnen.
2. **iPhone/iPad (Safari):** Teilen-Symbol → „Zum Home-Bildschirm“.
   **Android (Chrome):** Menü ⋮ → „App installieren“ oder „Zum Startbildschirm hinzufügen“.
3. Die App einmal mit Internet starten. Danach funktioniert sie auch offline.

## Elternbereich

Das Zahnrad ⚙️ oben rechts auf dem Startbildschirm **3 Sekunden gedrückt halten** und dann die Rechenaufgabe lösen.

- **Name** für die Urkunde.
- **Zusatzregeln** einschalten: Sonne, nie allein baden, unbekannte Gewässer, Boote, Müll und Schilf. Alle eingeschalteten Regeln zählen für die Urkunde.
- **Sprachausgabe:** Elternstimme, Computerstimme (Stimme, Tempo und Tonhöhe einstellbar) oder keine Stimme.
- **Elternstimme aufnehmen:** Jeden Satz einzeln aufnehmen. Was noch fehlt, liest die Computerstimme vor.
- **Sichern / Laden:** Aufnahmen, Fortschritt und Einstellungen als Datei auf ein anderes Gerät übertragen.
- Fortschritt zurücksetzen und Urkunde drucken.

> Tipp: Aufnahmen vom iPhone/iPad laufen auch auf Android. Umgekehrt (Android → Apple) kann es bei älteren iOS-Versionen hapern. Im Zweifel auf dem Apple-Gerät aufnehmen.

## Entwicklung

Die App besteht aus reinem HTML, CSS und JavaScript ohne Build-Schritt. Lokal starten:

```bash
python -m http.server 8765
```

Dann `http://localhost:8765` öffnen.

- Regeltexte stehen in `js/rules.js`, die Bilder in `js/scenes.js`.
- **Nach jeder Änderung** `VERSION` in `sw.js` hochzählen, damit installierte Apps das Update laden.
