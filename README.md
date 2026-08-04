# MIDI PERFECT 5

Multi-Lane MIDI-Generator in **einer** HTML-Datei. Doppelklick, läuft — kein
Build, kein Server, keine Abhängigkeit, kein CDN.

**Nur Chrome oder Edge.** Web MIDI ist in Safari und Firefox nicht
implementiert; ohne Web MIDI gibt es keine Klangausgabe.

Vorgänger: [midi-perfect-3](https://github.com/gunthernuyken/midi-perfect-3)
(Versionen 3 und 4, dort auch die vollständige Historie samt behobener
Fehler aus Version 2). Version 5 hat einen eigenen Speicher-Namensraum
(`midiperfect5.*`) — die älteren Versionen behalten ihre Setups; Transfer
per „.json sichern / laden" im Bereich Export & Setups.

## Neu in Version 5: MIDI-Import

`werkstatt/import.js` liest ein Standard-MIDI-File (Format 0 und 1) und
reduziert es auf das, was die Engine versteht: **Akkordfolge, Tonart,
Taktart, Tempo, Feel.** Es werden Parameter importiert, nie Noten — die
Hülle greift weiterhin nicht in die Notenerzeugung ein.

Die Import-Karte sitzt im Bereich **Export & Setups**: Drop-Zone bzw.
Dateiwahl, Review mit Kernschleife/Gesamtverlauf-Umschalter, Akkord-Chips
(gestrichelt gelb = unsicher erkannt oder Wechsel in Taktmitte),
editierbares Token-Feld, „In Song übernehmen" und „Feel übernehmen".
Bei ganzen Songs (Intro/Solo/Outro) erkennt der Importer die häufigste
wiederkehrende Runde (Strophe/Chorus) und bietet sie als **Kernschleife**
vorausgewählt an — für einen Begleit-Loop meist das Richtige.
Details und API: [werkstatt/IMPORT-INTEGRATION.md](werkstatt/IMPORT-INTEGRATION.md).

Aus Version 4 übernommen: **Taktarten 4/4, 3/4 und 6/8** mit eigenen
Drum-/Bass-/Chord-Stilen pro Taktart, korrekte SMF-Time-Signature und ein
mitrechnendes Tabulatur-Raster. Außerdem **Zweisprachigkeit DE/EN**,
umschaltbar oben rechts.

## Aufbau

| Zone | Verhalten |
|---|---|
| Transportleiste oben | scrollt nie weg — Play/Stop/Reroll, Takt-Zähler, Beat-Punkte, Lane-Schalter, Setup-Knopf |
| Seitenleiste links | sieben Bereiche, einklappbar auf reine Symbole |
| Inhalt | genau ein Bereich sichtbar, passt bei 1440 × 900 ohne Scrollen |
| Klaviatur + Tabulatur unten | auf allen Bereichen sichtbar, einklappbar, Lane-Filter je Anzeige |

### Die sieben Bereiche

1. **MIDI & Transport** — Ausgang, Kanal-Routing, Tempo/Swing/Humanize/Energy/Complexity, Loop, Infinity-Mutation, Protokoll
2. **Song** — Akkordfolge, Takt-Kacheln mit Sperre, Quintenzirkel, Stufen, Vorschläge, Reharmonisierung, Generator
3. **Blues-Werkstatt** — Form, Turnaround, Transposition, Tempofelder, Chorus-Bogen
4. **Lanes** — Band-Presets und die fünf Lanes
5. **Sync** — MIDI Clock, Slave, MMC, Cubase-Optionen
6. **Export & Setups** — SMF-Export, **MIDI-Import**, Setup-Verwaltung
7. **Monitor** — Kanal-Belegung, Protokoll, MIDI-Monitor

### Klaviatur & Tabulatur

Das Dock unten teilt sich in Klaviatur (kompakt links, scrollt intern) und
**Tabulatur** über die restliche Breite: 8 Takte im Achtel-Raster in
Standard-Stimmung (e B G D A E), Bundzahlen zeitgenau zum hörbaren Note-On,
laufender Takt hinterlegt, Playhead als leuchtende Linie. Über dem Raster
läuft die **Akkordzeile** mit Griffbildern (E-/A-Form-Barré, eigenes SVG
ohne externe Bibliothek); Klick öffnet das große Griffbild. Zwei Modi:
▦ Fenster (8 Takte füllen sich) und ⇄ Scroll (laufender Takt fest in der
Mitte). Beide zeichnen Kommendes gedimmt vor. Seit Build 2026-08-04 ist
das Dock doppelt so hoch — Bundzahlen und Akkordnamen in 16 px, die
Griffbilder in 1,5-facher Größe.

### Tastatur

| Taste | Wirkung |
|---|---|
| `Leertaste` | Play / Stop |
| `1` – `5` | Lane an/aus |
| `⇧1` – `⇧5` | Solo |
| `R` | Reroll aller nicht gesperrten Lanes |
| `D` | alle Styles würfeln |
| `⌥1` – `⌥7` | Bereich wechseln |
| `⌘S` / `Strg+S` | Setup speichern |

## Speicher

Eigener Namensraum `midiperfect5.*` — die Vorgängerversionen bleiben
vollständig unberührt und behalten ihre Setups, Lane-Zustände und
Sync-Einstellungen.

| Schlüssel | Inhalt |
|---|---|
| `midiperfect5.setups.v1` | benannte Setups |
| `midiperfect5.setup.auto` | Schnappschuss beim Schließen |
| `midiperfect5.setup.meta` | zuletzt gespeichert, Autoload |
| `midiperfect5.lanes.v1` | Lane-Zustand |
| `midiperfect5.sync.v2` | Clock/Slave/MMC |
| `midiperfect5.lang` | DE / EN |
| `midiperfect5.ui.v1` | Bereich, Seitenleiste, Klaviatur-Dock |

## Werkstatt

`werkstatt/` enthält die Quellen, aus denen `MIDI PERFECT 5.html`
zusammengesetzt wird. Für den Betrieb wird davon **nichts** gebraucht — die
ausgelieferte Datei steht für sich allein.

| Datei | Inhalt |
|---|---|
| `build.py` | setzt Engine, Importer und Hülle zusammen, prüft den ID-Abgleich (bricht ab, wenn die Hülle eine der 134 Element-IDs nicht bereitstellt) |
| `engine.js` | die komplette Klangerzeugung als echte Quelldatei (seit Version 4) |
| `import.js` | MIDI-Importer — reine Analyse, exportiert nur `MP5IMP` |
| `mp3.css` | Design-System: Tokens, Raster, Bedienelemente |
| `compat.css` | legt die Klassennamen der Engine auf diese Tokens |
| `layout.css` | Dichte-Korrekturen, jede mit gemessener Begründung |
| `body.html` | Markup der sieben Bereiche |
| `shell.js` | Router, Klappzustände, Reglerfüllung, Tonart-Kopplung, Import-UI |
| `IMPORT-INTEGRATION.md` | API und Einbindung des Importers |

Neu bauen: `python3 werkstatt/build.py` erzeugt `MIDI PERFECT 5.html`.

## Tests

`test/` fährt den Importer gegen Soll-MIDIs (`node run.js`; die MIDIs
erzeugt `python3 make_midis.py`) und `e2e.js` testet den kompletten
Import-Übernehmen-Weg in Headless-Chromium — echtes MIDI über den
File-Input bis zur Progression im Song-Bereich.

## Lizenz

MIT — siehe [LICENSE](LICENSE).
