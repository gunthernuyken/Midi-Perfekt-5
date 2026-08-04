# MIDI-Import (MIDI PERFECT 5)

**Stand: gebaut und eingebunden.** `python3 werkstatt/build.py` erzeugt
`MIDI PERFECT 5.html` (388 KB, ID-Abgleich vollständig). Die Import-Karte
sitzt im Bereich **Export & Setups**: Drop-Zone bzw. Dateiwahl, Review mit
Kernschleife/Gesamtverlauf-Umschalter, Akkord-Chips (gestrichelt gelb =
unsicher), editierbarem Token-Feld, „In Song übernehmen" und „Feel
übernehmen". End-to-End getestet (Headless-Chromium, echtes Unplugged-
MIDI über den File-Input): Übernehmen setzt Taktart → Tempo → Tonart
(Kopplung keyPc/blKey/blTo greift) → Progression via `applySeq()` und
wechselt in den Song-Bereich; die Engine loggt
`Progression: 8 Takte · Bm F#7 Amaj Emaj Gmaj Dmaj Em F#7`.
`swing` ist auf die Engine-Skala umgerechnet (100 = Offbeat auf der
dritten Triole), nicht mehr die rohe Offbeat-Position.

`import.js` liest ein Standard-MIDI-File und reduziert es auf das, was die
Engine versteht: **Akkordfolge, Tonart, Taktart, Tempo, Feel.** Es werden
Parameter importiert, nie Noten — die Hülle greift weiterhin nicht in die
Notenerzeugung ein. `parseToken`/`applySeq` bleiben unangetastet; der
Importer erzeugt exakt den Token-String, den `chordInput` ohnehin erwartet.

## API

```js
var r = MP5IMP.importFile(arrayBufferOderUint8Array);
```

| Feld | Inhalt | Ziel in der Engine |
|---|---|---|
| `tokens` | z. B. `Bm F#7 Amaj E7 Gmaj Dmaj Em F#7` | `#chordInput` + `applySeq()` |
| `defBars` | häufigste Taktzahl pro Akkord | `#barsPerChord` (vor `applySeq` setzen) |
| `keyPc`, `keyMode` | 0–11, `ionian`/`aeolian` | `#keyPc`, `#keyMode` |
| `meter` | `4/4`, `3/4` oder `6/8` | `setMeter(meter)` |
| `bpm` | Median der Tempo-Map | `#bpm` (+ `bpmVal`, `input`-Event) |
| `swing` | 0 oder 55–75 (%) | `#swing` — nur als **Vorschlag** anzeigen |
| `energy`, `complexity` | grobe Dichte-Schätzung | `#energy`, `#cplx` — nur als Vorschlag |
| `seq` | `[{root,type,bars,conf,split}]` | Review-Kacheln |
| `coreTokens`, `coreSeq`, `coreCount` | häufigste wiederkehrende Runde (Strophe/Chorus), `null` wenn keine | **Empfohlener Import** bei ganzen Songs |
| `source` | `text` (Akkordsymbole in der Datei) oder `analysis` | Anzeige |
| `warnings` | Klartext | Protokoll (`log(...,'w')`) |

Bei ganzen Songs (Intro/Solo/Outro) ist `tokens` der komplette Verlauf —
für einen Begleit-Loop meist zu viel. `coreTokens` ist dann das richtige
Angebot: die Review-UI zeigt beides, Kern vorausgewählt.

`conf` ist der Erkennungs-Score des Akkords, `split:true` heißt: im Takt lag
ein Akkordwechsel in Taktmitte — die Engine ist takt-granular, übernommen
wurde der Downbeat-Akkord.

## Einbindung (Bereich Export & Setups → „Import")

1. `<input type="file" accept=".mid,.midi">` plus Drop-Zone; `FileReader`
   → `readAsArrayBuffer` → `MP5IMP.importFile`.
2. Ergebnis als **Review-Zeile** rendern: Akkord-Kacheln (Label wie
   `chordToken`), Takte darunter, Kacheln mit `conf < 0.35` oder
   `split` optisch markiert. Klick auf eine Kachel öffnet die normale
   Korrektur (Root/Typ-Auswahl wie im Song-Bereich).
3. Knopf **„Übernehmen"** schreibt erst dann: `barsPerChord`, `chordInput`,
   `applySeq()`, `keyPc`/`keyMode`, `setMeter`, `bpm`. Swing/Energy/
   Complexity als vorgeschlagene Werte daneben, Übernahme per Klick —
   nie stillschweigend, sie verstellen das Spielgefühl.
4. Alle `warnings` ins Protokoll.

## Was die Analyse tut (Kurzfassung)

1. **SMF-Reader**: Format 0/1, Running Status, Tempo-Map,
   Time-Signature, Text-/Marker-/Lyric-Events, hängende Note-Ons werden
   am Spurende geschlossen. SMPTE-Division: Warnung, PPQ 480 angenommen.
2. **Abkürzung**: Stehen Akkordsymbole als Text-Events in der Datei
   (Karaoke-MIDIs) und decken sie ≥ 60 % der Takte, werden sie direkt
   übernommen (`source:'text'`).
3. **Profil**: Pitch-Class-Gewichte pro Halbtakt — Dauer × Velocity,
   Anschlag × 1,5, hohe Lagen gedämpft (Melodie), Töne mit nur einem
   stützenden Kanal gedämpft (Stimme ≠ Harmonik), tiefste Note **mit
   echtem Gewicht** doppelt (Ausklang-Leck des Vortakt-Basses zählt nicht).
4. **Tonart**: Krumhansl-Kessler; Paralleltonarten-Patt (Am/C) bricht der
   erste Akkord des Stücks.
5. **Viterbi** über die Halbtakte entscheidet den **Grundton-Verlauf**
   (Wechselstrafe, in Taktmitte höher als an der Taktgrenze). Der
   **Akkord-Typ** wird danach je Takt aus dem zusammengelegten
   Taktprofil bestimmt — das mittelt Melodie-Rauschen weg.
   Kandidaten sind nur die Kern-Typen; 9/13/#9-Farben behauptet die
   Analyse nie selbst (über Text-Events und Handeingabe erreichbar).
6. **Nachlauf**: Ausklang-Resttakte abschneiden; **Vokabular-Glättung**
   (ein Song benutzt pro Grundton ein konsistentes Vokabular — sichere
   Takte bilden es, unsichere und sus-Takte werden darauf gezogen;
   Klassen bleiben getrennt: Em wird nie zu E7); kleinste
   Wiederholungsperiode falten (2× dieselbe Runde = eine Progression —
   der Loop wiederholt selbst); **Kernschleifen-Suche** für ganze
   Songs: Kandidatenfenster (4/8/12/16 Takte) starten nur an
   Tonika-Ankern (Takt, in dem der Tonika-Grundton neu einsetzt),
   Fenster mit innenliegendem zweiten Anker sind ungültig, Abdeckung
   (Anzahl × Länge) entscheidet. sus-Typen tragen in der Analyse eine
   Strafe — arpeggierte Akustik-Texturen haben oft schwache Terzen,
   das darf nicht für sus4 reichen.
7. **Feel**: Swing aus dem Offbeat-Achtel-Histogramm (Median-Lage 50 % =
   gerade, 67 % = triolisch), Energy/Complexity aus Notendichte und
   Velocity.

## Grenzen — bewusst

- **Takt-granular.** Zwei Akkorde im selben Takt kann das Song-Modell
  nicht; der Downbeat-Akkord gewinnt, der Takt wird markiert.
- **Keine Slash-Chords.** Bass ≠ Root wird auf den Root normalisiert —
  für einen Begleitassistenten richtig, steht aber im Protokoll nicht
  einzeln (nur implizit über `conf`).
- **Eine Taktart pro Song.** Wechsel: erste gilt, Warnung.
- **Erkennung ist Vorschlag.** Realistisch 90–95 % auf sauberem
  Material; deshalb Review-Pflicht vor `applySeq`, kein Blind-Import.

## Tests

`test/make_midis.py` erzeugt sechs SMFs (Hotel-California-Progression
Bm F#7 A E7 G D Em F#7 mit Bass/Pad/Melodie/Drums; Format 0; mit
Text-Events; humanisiert ±20 Ticks; geshuffelt; 3/4-Walzer).
`node test/run.js` prüft Tokens, Tonart, Taktart, Tempo, Swing — alle
sechs grün. Die Test-Melodie noodelt absichtlich chromatisch (±1 Halbton
auf Pentatonik): wer die übersteht, übersteht Consumer-MIDIs.

**Abnahme am echten Material** — `Hotel-California-(Unplugged).mid`
(Format 1, 12 Spuren, 6.307 Noten, 105 Takte, keine Text-Events):
Tonart Bm, 4/4, 85 BPM; Kernschleife 7× gefunden:
`Bm F#7 Amaj Emaj Gmaj Dmaj Em F#7` — die Strophe. (`Emaj` statt `E7`:
die Unplugged-Gitarren spielen die Septime kaum — vertretbar, per
Review-Klick korrigierbar.) Der Gesamtverlauf `tokens` bildet Intro,
Strophen, Refrains und die Bridge-Abweichungen einzeln ab.
