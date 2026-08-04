
/* ============================================================
   0b · ZWEISPRACHIGKEIT (DE / EN)

   Das Wörterbuch wird über die deutsche Zeichenkette adressiert, nicht über
   Schlüssel. Damit bleibt das Markup unangetastet — kein einziges data-i18n —
   und dynamisch gebaute Bereiche (Lanes, Style-Listen, Presets, Takt-Blöcke)
   laufen automatisch über denselben Weg, sobald ein MutationObserver sie sieht.
   Fehlt eine Übersetzung, bleibt der deutsche Text stehen. Nichts kann brechen,
   nur unübersetzt bleiben.
   ============================================================ */
var LS_LANG='midiperfect4.lang', i18nBusy=false, i18nObs=null;
var LANG=(function(){try{var v=localStorage.getItem(LS_LANG);return v==='en'?'en':'de';}catch(e){return 'de';}})();

/* Lange Hilfetexte am Stück, sonst entsteht aus den <b>-Fragmenten
   englischer Kauderwelsch mit deutscher Wortstellung. */
var I18N_HTML={
 hintBlues:'<b style="color:#22cc88">Swing:</b> 100 % is a full triplet feel. Blues shuffle sits at <b>62&ndash;68</b>, slow blues 12/8 at <b>95&ndash;100</b>, funk blues at 12&ndash;20. Drum patterns on a triplet grid (Blues Shuffle, Jazz Ride, Purdie) are already written as triplets and are deliberately <i>not</i> shifted again by the swing slider &ndash; that would produce a double shuffle.<br><b style="color:#22cc88">Chorus dynamics</b> send the expression CC on every melodic and harmonic channel. On a tonewheel organ (Blue3, B-3X) you can point it at a drawbar CC instead; Kontakt instruments usually want CC11, EZbass and EZkeys CC7. The hi-hat moves to the ride from the configured chorus onward, and to the bell in the peak chorus.',
 hintSync:'<b style="color:#ffcc00">&#9888; Cubase cannot slave to MIDI Clock.</b> As a sync source it accepts only MIDI&nbsp;Timecode, ASIO&nbsp;Positioning or VST&nbsp;System&nbsp;Link &ndash; see Project Synchronisation Setup &rarr; Sources. The clock switch and the clock burst are therefore meant for <b>hardware</b> (drum machines, grooveboxes, loopers). <b>The tempo has to be set to the same value in Cubase by hand.</b><br><b>Play/Record setup (this one works):</b> Transport &rarr; Project Synchronisation Setup &rarr; Machine Control &rarr; <b>MMC Slave Active</b>, MIDI input = IAC Driver Bus 1, MMC device ID identical (127 = all). Record starts with Record Strobe + Deferred Play. MMC needs the browser SysEx permission &ndash; see the log for status.<br><b>Count-in</b> lets Cubase roll before the first note arrives &ndash; useful when recording.<br><b style="color:#22cc88">Clock slave (Cubase sets the beat):</b> this is the direction that actually works with Cubase. In Cubase under Project Synchronisation Setup &rarr; <b>Destinations</b> enable <b>MIDI Clock Out to the IAC bus</b>, switch <b>SLAVE</b> on here and pick the same bus as clock input. One IAC bus carries both directions at once &ndash; a second bus is tidier but not required. From then on Cubase\'s transport starts and stops this page, tempo and position come from Cubase, and the BPM slider follows automatically. Clock output and slave are mutually exclusive.',
 hintSuffix:'Suffixes: <b>m &middot; 7 &middot; maj7 &middot; m7 &middot; 6 &middot; m6 &middot; 9 &middot; m9 &middot; maj9 &middot; 13 &middot; dim &middot; dim7 &middot; m7b5 &middot; aug &middot; 7#9 &middot; 7b9 &middot; sus4 &middot; sus2</b> &nbsp;|&nbsp; Example: <code>Gm7:2 C7 Fmaj7:2</code>'
};

var I18N={
/* --- Kopf, Kommandoleiste ------------------------------------ */
'Multi-Lane Generator · Drums + 137 Styles · Band-Presets · Infinity Mutation · SMF Export · MIDI Clock & MMC → Cubase':
 'Multi-lane generator · drums + 137 styles · band presets · infinity mutation · SMF export · MIDI Clock & MMC → Cubase',
'Lane':'Lane','Solo':'Solo','Styles':'Styles',
'Reroll aller nicht gesperrten Lanes (R)':'Reroll every unlocked lane (R)',
'Alle nicht gesperrten Lanes neu würfeln':'Reroll every unlocked lane',
/* --- MIDI Connection ----------------------------------------- */
'Lanes senden auf eigenen Kanälen':'Each lane sends on its own channel',
'Initialisiere…':'Initialising…',
'Alle Lanes auf':'All lanes to',
'→ einen Kanal legen':'→ one single channel',
'→ ab Startkanal fortlaufend verteilen':'→ spread from start channel',
'Eine Cubase-Spur pro Kanal = getrennte Instrumente. Nur eine Spur? Dann alles auf einen Kanal legen.':
 'One DAW track per channel = separate instruments. Only one track? Then put everything on one channel.',
'Routing (manuell):':'Routing (manual):','(aus)':'(off)',
'🎸 GM-Standardsounds pro Lane setzen':'🎸 Set GM default sounds per lane',
'⊘ Sound-Zuweisung abschalten':'⊘ Disable sound assignment',
'↻ Lane-Zustand zurücksetzen':'↻ Reset lane state',
'Gespeicherten Lane-Zustand verwerfen und Werkseinstellung laden':'Discard the stored lane state and load factory settings',
'Program Change landet im Export und wird beim Play gesendet. Aus = dein Instrument behält seinen Sound.':
 'Program change is written to the export and sent on play. Off = your instrument keeps its own sound.',
'○ Kanalsperre':'○ Channel lock','● Kanalsperre':'● Channel lock',
'○ MIDI-Monitor':'○ MIDI monitor','● MIDI-Monitor':'● MIDI monitor',
'↻ Monitor leeren':'↻ Clear monitor',
'Blockt JEDE MIDI-Nachricht auf Kanälen, die keiner eingeschalteten Lane gehören – inkl. Program Change und All-Notes-Off':
 'Blocks EVERY MIDI message on channels that belong to no active lane — including program change and all-notes-off',
'Protokolliert jede gesendete MIDI-Nachricht mit Kanal':'Logs every outgoing MIDI message with its channel',
'Kanalsperre an = es verlässt garantiert nichts das Programm auf einem fremden Kanal. Kommt in Cubase trotzdem etwas an, liegt es nicht an dieser Seite.':
 'Channel lock on = nothing can leave this page on a foreign channel. If the DAW still receives something, it is provably not this page.',
/* --- Transport ------------------------------------------------ */
'▶ Transport & Makros':'▶ Transport & macros',
'Energy = Dichte/Drive · Complexity = Harmonik/Chromatik':'Energy = density/drive · complexity = harmony/chromaticism',
'∞ Infinite':'∞ Infinite','● INFINITY OFF':'● INFINITY OFF','● INFINITY ON':'● INFINITY ON',
'Mutation / Loop %':'Mutation / loop %',
'Bei jedem Loop-Durchlauf mutieren nicht gesperrte Takte. Gesperrte Lanes und Takte bleiben eingefroren.':
 'Unlocked bars mutate on every loop pass. Locked lanes and bars stay frozen.',
/* --- Blues-Werkstatt ------------------------------------------ */
'🎸 Blues-Werkstatt':'🎸 Blues workshop',
'Form & Turnaround · Transposition · Groove · Tempofelder · Chorus-Dynamik':
 'Form & turnaround · transposition · groove · tempo fields · chorus dynamics',
'Tonart':'Key','Taktart':'Meter','Form':'Form','Zieltonart':'Target key',
'Turnaround (Takt 11–12)':'Turnaround (bars 11–12)',
'ohne (I bleibt stehen)':'none (I stays)',
'V7 (Standard)':'V7 (standard)',
'VI7 → V7 (Jazz)':'VI7 → V7 (jazz)',
'bVI7 → V7 (chromatisch)':'bVI7 → V7 (chromatic)',
'12-Bar Slow (9er-Voicings)':'12-bar slow (9th voicings)',
'Jazz-Blues (12)':'Jazz blues (12)','Minor-Blues (12)':'Minor blues (12)',
'8-Bar Blues':'8-bar blues','16-Bar Slow Blues':'16-bar slow blues','12-Bar Standard':'12-bar standard',
'○ Quick-Change':'○ Quick change','● Quick-Change':'● Quick change',
'Takt 2 wird zur IV-Stufe – der Klassiker gegen den 4-Takte-Leerlauf am Anfang':
 'Bar 2 becomes the IV chord — the classic cure for four idle bars at the start',
'Progression bauen':'Build progression',
'Schreibt die Form in die Akkordzeile und übernimmt sie sofort.':'Writes the form into the chord line and applies it immediately.',
'− Halbton':'− semitone','+ Halbton':'+ semitone','→ transponieren':'→ transpose',
'↻ Übungs-Zirkel weiter':'↻ Next practice key',
'G → C → F → Bb → Eb → A → D → E – die Tonarten, die man als Gitarrist sonst nie übt':
 'G → C → F → Bb → Eb → A → D → E — the keys guitarists otherwise never practise',
'Transponiert die komplette Progression samt Suffixen und zieht die Tonart der Harmonie-Engine mit. Locks bleiben erhalten.':
 'Transposes the whole progression including suffixes and pulls the harmony engine key along. Locks are preserved.',
'● Groove-Kopplung':'● Groove link','○ Groove-Kopplung':'○ Groove link',
'DRUMS, BASS und CHORDS ziehen zwingend denselben Swing-Wert':'DRUMS, BASS and CHORDS are forced onto the same swing value',
'Backbeat 2 & 4':'Backbeat 2 & 4',
'● Turnaround-Fill':'● Turnaround fill','○ Turnaround-Fill':'○ Turnaround fill',
'Erzwingt einen Fill im letzten Takt der Form':'Forces a fill in the last bar of the form',
'Swing und Velocity-Streuung stehen pro Lane weiter unten. Bei aktiver Kopplung folgen Drums, Bass und Chords dem globalen Swing-Regler.':
 'Swing and velocity spread are per lane, further down. While the link is active, drums, bass and chords follow the global swing slider.',
'Tempofelder – ein Klick setzt Styles, Swing und Tempo. Jeder weitere Klick geht 5 BPM weiter durch den Bereich.':
 'Tempo fields — one click sets styles, swing and tempo. Each further click steps 5 BPM through the range.',
'Slow Blues 12/8':'Slow blues 12/8','Rock-Blues gerade':'Rock blues straight','Funk-Blues':'Funk blues',
'○ Chorus-Dynamik':'○ Chorus dynamics','● Chorus-Dynamik':'● Chorus dynamics',
'Baut die Dynamik über mehrere Durchläufe auf und wieder ab':'Builds the dynamics up and back down across several passes',
'Bogen über':'Arc across','Ride ab Chorus':'Ride from chorus','nie':'never',
'2 Chorusse':'2 choruses','3 Chorusse':'3 choruses','4 Chorusse':'4 choruses',
'6 Chorusse':'6 choruses','8 Chorusse':'8 choruses',
'Velocity-Hub':'Velocity range','Aus.':'Off.',
/* --- DAW Sync -------------------------------------------------- */
'MMC = Transport (Play/Rec) · MIDI Clock nur für Hardware, NICHT für Cubase':
 'MMC = transport (play/rec) · MIDI Clock for hardware only, NOT for Cubase',
'● CLOCK OFF':'● CLOCK OFF','● CLOCK ON':'● CLOCK ON','● SLAVE OFF':'● SLAVE OFF','✓ SLAVE AN':'✓ SLAVE ON',
'Clock-Eingang':'Clock input','— kein Eingang —':'— no input —',
'Sync-Ausgang':'Sync output','= Haupt-Output':'= main output',
'Transportbefehl':'Transport command','Start (von vorn)':'Start (from top)','Continue (ab Cursor)':'Continue (from cursor)',
'Cubase bei PLAY':'Cubase on PLAY','nichts senden':'send nothing',
'Count-In':'Count-in','ohne':'none','1 Takt':'1 bar','2 Takte':'2 bars','4 Takte':'4 bars',
'Bei STOP':'On STOP','Cubase mitstoppen':'stop Cubase too','weiterlaufen lassen':'let it keep running',
'⏱ Clock-Burst (4 Takte)':'⏱ Clock burst (4 bars)',
'Sendet MIDI Clock (F8) im aktuellen Tempo plus Start/Stop. Cubase kann MIDI Clock nicht empfangen – nur für Hardware.':
 'Sends MIDI Clock (F8) at the current tempo plus start/stop. Cubase cannot receive MIDI Clock — hardware only.',
'Der Generator folgt der MIDI Clock einer DAW oder Hardware. Tempo, Start, Stop und Position kommen dann von dort.':
 'The generator follows the MIDI Clock of a DAW or hardware. Tempo, start, stop and position then come from there.',
'Nur für Hardware-Sequencer/Drumcomputer. Cubase ignoriert MIDI Clock.':
 'For hardware sequencers and drum machines only. Cubase ignores MIDI Clock.',
'Slave aus.':'Slave off.',
/* --- Progression ----------------------------------------------- */
'Klick auf einen Takt = Lock (🔒) gegen Mutation':'Click a bar = lock (🔒) against mutation',
'Preset':'Preset','— wählen —':'— choose —',
'12-Bar Blues in A':'12-bar blues in A','Quick-Change Blues in C':'Quick-change blues in C',
'Rhythm Changes A (2 Tkt/Akk)':'Rhythm changes A (2 bars/chord)',
'Coltrane Changes (kurz)':'Coltrane changes (short)',
'Bars / Chord':'Bars / chord','Default Type':'Default type',
'✖ Leeren':'✖ Clear',
'Progression komplett leeren – Locks und Mutationen werden zurückgesetzt':
 'Clear the progression completely — locks and mutations are reset',
'| Beispiel:':'| Example:',
/* --- Harmonie-Engine -------------------------------------------- */
'🎓 Harmonie-Engine':'🎓 Harmony engine',
'Quintenzirkel · Stufen · Vorschläge · Reharmonisierung':'Circle of fifths · degrees · suggestions · reharmonisation',
'Modus':'Mode',
'Ionisch (Dur)':'Ionian (major)','Äolisch (Moll)':'Aeolian (minor)','Dorisch':'Dorian',
'Mixolydisch':'Mixolydian','Lydisch':'Lydian','Phrygisch':'Phrygian','Harmonisch Moll':'Harmonic minor',
'🔍 Tonart erkennen':'🔍 Detect key','Leitereigen:':'Diatonic:',
'Stufen anhängen':'Append degrees','— Klick hängt den Akkord hinten an':'— a click appends the chord at the end',
'● Septakkorde':'● Seventh chords','○ Septakkorde':'○ Seventh chords','aus = Dreiklänge':'off = triads',
'💡 Nächster Akkord':'💡 Next chord',
'— gewichtet nach Funktionsharmonik, orange = chromatisch':'— weighted by functional harmony, orange = chromatic',
'chromatisch':'chromatic',
'Reharmonisierung':'Reharmonisation','Tritonus-Sub':'Tritone sub','Sekundär-Dominanten':'Secondary dominants',
'ii-V einfügen':'Insert ii-V','Durchgangs-Verminderte':'Passing diminished','↶ Undo':'↶ Undo',
'Operationen arbeiten auf der aktuellen Progression und erhalten die Gesamt-Taktzahl.':
 'Operations work on the current progression and preserve the total bar count.',
'Genre':'Genre','Länge':'Length',
'8 Takte':'8 bars','12 Takte':'12 bars','16 Takte':'16 bars','32 Takte':'32 bars',
'✦ Progression generieren':'✦ Generate progression',
'Erzeugt eine neue Akkordfolge in der gewählten Tonart und schreibt sie ins Feld oben.':
 'Generates a new chord sequence in the chosen key and writes it into the field above.',
/* --- Lanes ------------------------------------------------------ */
'Jede Lane = eigener MIDI-Kanal = eigene Cubase-Spur':'Each lane = its own MIDI channel = its own DAW track',
'Band-Preset (setzt alle Styles)':'Band preset (sets all styles)',
'♫ Band laden':'♫ Load band','🎲 Alle Styles würfeln':'🎲 Randomise all styles',
'✓ Tempo/Swing übernehmen':'✓ Adopt tempo/swing','● Tempo/Swing übernehmen':'● Adopt tempo/swing',
'● Lane On/Off übernehmen':'● Adopt lane on/off','○ Lane On/Off übernehmen':'○ Adopt lane on/off',
'Tempo und Swing des Presets mit übernehmen':'Adopt the preset tempo and swing as well',
'Wenn aus, bleiben deine ON/OFF-Einstellungen der Lanes beim Laden eines Presets erhalten':
 'When off, your lane on/off settings survive loading a preset',
'Presets setzen Style, Lane-On/Off und optional Tempo & Swing.':'Presets set style, lane on/off and optionally tempo & swing.',
'Ballade':'Ballad','Modal / Vamp':'Modal / vamp',
'○ OFF':'○ OFF','● ON':'● ON','◎ SOLO':'◎ SOLO','Nur diese Lane sendet':'Only this lane sends',
'🔓 frei':'🔓 free','frei':'free','🔒 LOCKED':'🔒 LOCKED',
'🎲 Reroll':'🎲 Reroll','🎮 Style würfeln':'🎮 Randomise style',
'Kanal':'Channel','Oktave':'Octave','Velocity':'Velocity','Density %':'Density %',
'Swing (gekoppelt)':'Swing (linked)','Swing':'Swing','Vel-Streuung ±':'Vel. spread ±',
'Fill alle':'Fill every','aus':'off','Rate':'Rate','Gate %':'Gate %','Oktaven':'Octaves',
'Drum-Kit (Program Change)':'Drum kit (program change)','Sound (Program Change)':'Sound (program change)',
'— aus (Kit des Instruments) —':'— off (instrument keeps its kit) —',
'— aus (Instrument behält seinen Sound) —':'— off (instrument keeps its sound) —',
/* --- Style-Namen, soweit deutsch -------------------------------- */
'Rock 8tel':'Rock 8ths','Rock 16tel Hats':'Rock 16th hats','Pop (Kick auf 3+)':'Pop (kick on 3+)',
'Punk / Fast 8tel':'Punk / fast 8ths','Ballade (Cross-Stick)':'Ballad (cross-stick)',
'Train Beat 16tel':'Train beat 16ths','Funk 16tel Tight':'Funk 16ths tight',
'Trap 32tel-Rolls':'Trap 32nd rolls','Amen Break (2 Takte)':'Amen break (2 bars)',
'Halbe Noten':'Half notes','Arpeggio 8tel':'Arpeggio 8ths','Dezimen (Ballad)':'Tenths (ballad)',
'Bebop Walk (chromatisch)':'Bebop walk (chromatic)','Driving 8tel':'Driving 8ths',
'Metal 16tel Pedal':'Metal 16th pedal','Funk Slap 16tel':'Funk slap 16ths','Disco Oktaven':'Disco octaves',
'Synthwave 16tel':'Synthwave 16ths','Trap 808 (lang, sparsam)':'Trap 808 (long, sparse)',
'Gitarren-Strumming 16tel':'Guitar strumming 16ths','Pop Ganze + Halbe':'Pop whole + half notes',
'Rock 8tel Power':'Rock 8th power','Funk 16tel':'Funk 16ths','Neo-Soul 16tel lose':'Neo-soul 16ths loose',
'Tremolo 16tel':'Tremolo 16ths','Disco 16tel Stabs':'Disco 16th stabs','Synth-Puls 8tel':'Synth pulse 8ths',
'Trance 16tel Gate':'Trance 16th gate','Up/Down (Ecken doppelt)':'Up/down (corners doubled)',
'Pinky Up (Top-Ton)':'Pinky up (top note)','Staircase (3 vor, 1 zurück)':'Staircase (3 up, 1 back)',
'Paare (2er-Gruppen)':'Pairs (groups of two)','Gebrochene Terzen':'Broken thirds',
'Trance Oktav-Sprung':'Trance octave jump','Polyrhythmus 3:4':'Polyrhythm 3:4',
'Pedal + Wechselton':'Pedal + alternating note','Gated 16tel Chord':'Gated 16th chord',
'Random mit Lücken':'Random with gaps','Motif Engine (entwickelnd)':'Motif engine (developing)',
'Sequenz (Motiv transponiert)':'Sequence (motif transposed)','Riff (1-Takt-Hook)':'Riff (one-bar hook)',
'Akkordton-Linie':'Chord-tone line','Choral / Hymne':'Chorale / hymn','Pop Hook 16tel':'Pop hook 16ths',
'EDM Lead (repetitiv)':'EDM lead (repetitive)','Latin Montuno-Linie':'Latin montuno line',
'Country Root-Five + Walkup':'Country root-five + walkup','Swing Comping (rootless)':'Swing comping (rootless)',
'Big-Band Hits (Anticipation)':'Big-band hits (anticipation)','Reggae Skank (Offbeat)':'Reggae skank (offbeat)',
'Jazz Ride (Swing)':'Jazz ride (swing)','Jazz Up-Tempo + Comping':'Jazz up-tempo + comping',
'Jazz Trio (Swing)':'Jazz trio (swing)',
/* --- Optgroup-Beschriftungen ------------------------------------ */
'Ruhig':'Calm','Elektronisch':'Electronic','Klassisch':'Classic','Muster':'Patterns',
'Entwicklung':'Development','Latin / Karibik':'Latin / Caribbean','Reggae / Karibik':'Reggae / Caribbean',
/* --- Export, Keyboard ------------------------------------------- */
'Type-1 SMF, eine Spur pro Lane':'Type-1 SMF, one track per lane',
'Wiederholungen':'Repetitions','1x Progression':'1× progression',
'Variation pro Durchlauf':'Variation per pass','aus (identisch)':'off (identical)','an (mutiert)':'on (mutated)',
'Humanize im Export':'Humanize in export','nein (clean)':'no (clean)','ja':'yes',
'⬇ .MID exportieren':'⬇ Export .MID',
'Danach in Cubase per Drag & Drop ins Projekt ziehen.':'Then drag and drop it into your DAW project.',
'= n Takte, Enter = Apply)':'= n bars, Enter = Apply)',
'Akkorde (Leerzeichen-getrennt,':'Chords (space separated,',
'gesperrt (kein SysEx)':'blocked (no SysEx)','verfügbar':'available',
'Clock aus.':'Clock off.',

'● Arrangement-Bogen':'● Arrangement arc','○ Arrangement-Bogen':'○ Arrangement arc',
'Dünn anfangen und schichtweise aufbauen statt nur lauter werden':'Start thin and add layers instead of merely getting louder',
'BUILD 2026-07-31-M · Arrangement-Bogen · Zweisprachig DE/EN':'BUILD 2026-07-31-M · arrangement arc · bilingual DE/EN',
'Farbe = Lane':'Colour = lane','⬇ Diese Seite speichern':'⬇ Save this page'
};

/* Log-Meldungen laufen alle durch log(); deshalb wird hier zentral übersetzt
   statt an 75 Aufrufstellen. Reihenfolge zählt: erste Regel gewinnt. */
var I18N_LOG=[
 [/^MIDI PERFECT 4 bereit · SPACE = Play\/Stop · R = Reroll · D = Styles würfeln$/,'MIDI PERFECT 2 ready · SPACE = play/stop · R = reroll · D = randomise styles'],
 [/^Blues-Werkstatt aktiv · Groove-Kopplung an · Backbeat (\d+) · Turnaround-Fill an$/,'Blues workshop active · groove link on · backbeat $1 · turnaround fill on'],
 [/^Styles gesamt: (.*?) · Drum-Patterns: (\d+) · Band-Presets: (\d+)$/,'Styles total: $1 · drum patterns: $2 · band presets: $3'],
 [/^Lane-Werkseinstellung geladen: (.*)$/,'Lane factory settings loaded: $1'],
 [/^Lane-Zustand aus letzter Sitzung wiederhergestellt: (.*)$/,'Lane state restored from the last session: $1'],
 [/^Progression: (\d+) Takte · (.*)$/,'Progression: $1 bars · $2'],
 [/^Unbekannt: (.*)$/,'Unknown: $1'],
 [/^Keine MIDI-Outputs – IAC-Treiber aktivieren!$/,'No MIDI outputs — enable the IAC driver!'],
 [/^MIDI-Zugriff erteilt \(inkl\. SysEx\/MMC\)$/,'MIDI access granted (incl. SysEx/MMC)'],
 [/^MIDI-Zugriff erteilt \(ohne SysEx – MMC gesperrt\)$/,'MIDI access granted (without SysEx — MMC blocked)'],
 [/^MIDI bereit: (.*)$/,'MIDI ready: $1'],
 [/^Reroll: alle nicht gesperrten Lanes \((\d+)\)$/,'Reroll: every unlocked lane ($1)'],
 [/^Reroll: (\w+) \((\d+)\)$/,'Reroll: $1 ($2)'],
 [/^SOLO: nur (\w+) &rarr; Ch(\d+) · alles andere sendet nichts$/,'SOLO: only $1 &rarr; Ch$2 · nothing else sends'],
 [/^Solo aufgehoben – alle Lanes an$/,'Solo cleared — all lanes on'],
 [/^(\w+) Style: (.*)$/,'$1 style: $2'],
 [/^(\w+) Sound: aus$/,'$1 sound: off'],
 [/^(\w+) Sound: (.*)$/,'$1 sound: $2'],
 [/^(\w+) Swing: global \((\d+) %\)$/,'$1 swing: global ($2 %)'],
 [/^(\w+) Swing: (\d+) %$/,'$1 swing: $2 %'],
 [/^(\w+) AN → Ch(\d+)$/,'$1 ON → Ch$2'],
 [/^(\w+) aus$/,'$1 off'],
 [/^Transponiert nach (.*) \(([+-]?\d+) Halbtöne\)$/,'Transposed to $1 ($2 semitones)'],
 [/^Blues-Form: (.*?) in (.*?)( \+ Quick-Change)? · Turnaround: (.*)$/,'Blues form: $1 in $2$3 · turnaround: $4'],
 [/^Tempofeld (.*?): (\d+) BPM \(Bereich (.*?)\) · Swing (\d+) % · Backbeat (\d+)$/,'Tempo field $1: $2 BPM (range $3) · swing $4 % · backbeat $5'],
 [/^Chorus-Dynamik AN – Bogen über (\d+) Durchläufe, Ride ab Chorus (\d+), Expression CC(\d+)$/,'Chorus dynamics ON — arc across $1 passes, ride from chorus $2, expression CC$3'],
 [/^Chorus-Dynamik AUS$/,'Chorus dynamics OFF'],
 [/^Turnaround-Fill an – letzter Takt der Form bekommt immer einen Fill$/,'Turnaround fill on — the last bar of the form always gets a fill'],
 [/^Turnaround-Fill aus$/,'Turnaround fill off'],
 [/^Groove-Kopplung AN – DRUMS, BASS und CHORDS ziehen denselben Swing \((\d+) %\)$/,'Groove link ON — DRUMS, BASS and CHORDS share the same swing ($1 %)'],
 [/^Groove-Kopplung AUS – jede Lane schwingt für sich\. Bass und Drums nur bewusst auseinanderziehen\.$/,'Groove link OFF — every lane swings on its own. Only pull bass and drums apart deliberately.'],
 [/^Kanalsperre AN – es geht nur noch auf (.*?) etwas raus$/,'Channel lock ON — only $1 can send now'],
 [/^Kanalsperre AUS$/,'Channel lock OFF'],
 [/^GM-Sounds gesetzt: (.*)$/,'GM sounds set: $1'],
 [/^Sound-Zuweisung abgeschaltet(.*)$/,'Sound assignment disabled$1'],
 [/^Alle Lanes auf Kanal (\d+)$/,'All lanes to channel $1'],
 [/^Kanäle ab Ch(\d+) verteilt: (.*?) · DRUMS bleibt auf Ch 10$/,'Channels spread from Ch$1: $2 · DRUMS stays on Ch 10'],
 [/^Band-Presets schalten Lanes ein\/aus$/,'Band presets switch lanes on and off'],
 [/^Band-Presets lassen deine Lane-Schaltung in Ruhe$/,'Band presets leave your lane switching alone'],
 [/^Count-In: (\d+) Takt\(e\) Vorlauf – Cubase läuft, Noten folgen danach\.$/,'Count-in: $1 bar(s) lead — Cubase rolls, notes follow.'],
 [/^SLAVE: Transport steht bereit und wartet auf das Start-Signal der DAW\.$/,'SLAVE: transport is armed and waiting for the DAW start signal.'],
 [/^Zeitbasis resynchronisiert \(Clock-Slave\)$/,'Time base resynchronised (clock slave)'],
 [/^Bereits in (.*)$/,'Already in $1'],
 [/^Progression steht bereits in (.*)$/,'The progression is already in $1'],
 [/^Keine Progression zum Transponieren$/,'No progression to transpose'],
 [/^Fertig$/,'Done'],
 [/^Takte:? (\d+)/,'Bars: $1']
];
function trLog(m){
  if(LANG!=='en')return m;
  for(var i=0;i<I18N_LOG.length;i++){
    if(I18N_LOG[i][0].test(m))return m.replace(I18N_LOG[i][0],I18N_LOG[i][1]);
  }
  return m;
}

/* Gemusterte Beschriftungen, die sich nicht als feste Liste lohnen. */
var I18N_PAT=[
 [/^Kanal (\d+)$/,'Channel $1'],
 [/^(\d+) Takte$/,'$1 bars'],
 [/^(\d+) Chorusse$/,'$1 choruses'],
 [/^Bar (\d+)$/,'Bar $1'],
 [/^Bar (\d+)-(\d+)$/,'Bars $1-$2'],
 [/^Test &rarr; Ch (\d+)$/,'Test &rarr; Ch $1'],
 [/^Style \((\d+)\)$/,'Style ($1)'],
 [/^global \((\d+) %\)$/,'global ($1 %)'],
 [/^(\w+) · Klick = an\/aus · Shift\+Klick = Solo · Taste (\d+)$/,'$1 · click = on/off · Shift+click = solo · key $2'],
 [/^Clock aus\. · MMC: verfügbar · Cubase bei PLAY: (.*)$/,'Clock off. · MMC: available · Cubase on PLAY: $1'],
 [/^Clock aus\. · MMC: gesperrt \(kein SysEx\) · Cubase bei PLAY: (.*)$/,'Clock off. · MMC: blocked (no SysEx) · Cubase on PLAY: $1'],
 [/^Clock AN · (\d+) BPM · Port: (.*?) · MMC: verfügbar · Cubase bei PLAY: (.*)$/,'Clock ON · $1 BPM · port: $2 · MMC: available · Cubase on PLAY: $3'],
 [/^Clock AN · (\d+) BPM · Port: (.*?) · MMC: gesperrt \(kein SysEx\) · Cubase bei PLAY: (.*)$/,'Clock ON · $1 BPM · port: $2 · MMC: blocked (no SysEx) · Cubase on PLAY: $3'],
 [/^SLAVE = (.*?) · wartet auf Start · (.*)$/,'SLAVE = $1 · waiting for start · $2'],
 [/^SLAVE = (.*)$/,'SLAVE = $1']
];
function trText(t){
  if(LANG!=='en')return t;
  if(I18N[t])return I18N[t];
  for(var i=0;i<I18N_PAT.length;i++)if(I18N_PAT[i][0].test(t))return t.replace(I18N_PAT[i][0],I18N_PAT[i][1]);
  return t;
}
function i18nNode(root){
  var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null,false),n;
  while(n=w.nextNode()){
    var pn=n.parentNode&&n.parentNode.nodeName;
    if(pn==='SCRIPT'||pn==='STYLE')continue;
    if(n.__de===undefined)n.__de=n.nodeValue;
    var raw=n.__de, t=raw.trim();
    if(!t){continue;}
    /* Bereits geschriebene Log-Zeilen laufen durch dieselben Regeln wie neue,
       sonst steht die Historie nach dem Umschalten zweisprachig da. */
    var inLog=false, p=n.parentNode;
    while(p&&p!==document.body){ if(p.id==='log'||p.id==='mlog'){inLog=true;break;} p=p.parentNode; }
    var tr=inLog?(LANG==='en'?trLog(t):t):trText(t);
    var want=(tr===t)?raw:raw.slice(0,raw.indexOf(t))+tr+raw.slice(raw.indexOf(t)+t.length);
    if(n.nodeValue!==want)n.nodeValue=want;
  }
  var all=(root.querySelectorAll?root.querySelectorAll('[title],[placeholder],optgroup'):[]);
  for(var i=0;i<all.length;i++){
    var e=all[i];
    if(e.hasAttribute('title')){
      if(e.__dtitle===undefined)e.__dtitle=e.getAttribute('title');
      e.setAttribute('title',trText(e.__dtitle));
    }
    if(e.hasAttribute('placeholder')){
      if(e.__dph===undefined)e.__dph=e.getAttribute('placeholder');
      e.setAttribute('placeholder',trText(e.__dph));
    }
    if(e.nodeName==='OPTGROUP'){
      if(e.__dlabel===undefined)e.__dlabel=e.getAttribute('label');
      e.setAttribute('label',trText(e.__dlabel));
    }
  }
}
function applyLang(){
  if(i18nBusy)return;
  i18nBusy=true;
  try{
    for(var id in I18N_HTML){
      var el=document.getElementById(id); if(!el)continue;
      if(el.__dhtml===undefined)el.__dhtml=el.innerHTML;
      var want=(LANG==='en')?I18N_HTML[id]:el.__dhtml;
      if(el.innerHTML!==want)el.innerHTML=want;
    }
    i18nNode(document.body);
    document.documentElement.lang=LANG;
    var b=document.getElementById('langTgl');
    if(b)b.innerHTML=(LANG==='en')?'<b>EN</b> · DE':'<b>DE</b> · EN';
  }finally{ i18nBusy=false; }
}
function setLang(l){
  LANG=(l==='en')?'en':'de';
  try{localStorage.setItem(LS_LANG,LANG);}catch(e){}
  applyLang();
}
function initI18n(){
  applyLang();
  /* Dynamisch nachgebaute Bereiche (Lanes, Style-Listen, Takt-Blöcke, Presets)
     laufen ohne Zutun der Baufunktionen mit. */
  i18nObs=new MutationObserver(function(muts){
    if(i18nBusy||LANG!=='en')return;
    i18nBusy=true;
    try{
      for(var i=0;i<muts.length;i++){
        var ns=muts[i].addedNodes;
        for(var j=0;j<ns.length;j++){
          if(ns[j].nodeType===1)i18nNode(ns[j]);
          else if(ns[j].nodeType===3){
            var n=ns[j];
            if(n.__de===undefined)n.__de=n.nodeValue;
            var t=n.__de.trim(); if(!t)continue;
            var tr=trText(t); if(tr!==t)n.nodeValue=n.__de.replace(t,tr);
          }
        }
      }
    }finally{ i18nBusy=false; }
  });
  i18nObs.observe(document.body,{childList:true,subtree:true});
}

/* ============================================================
   0 · KONSTANTEN / UTILS
   ============================================================ */
var PPQ = 480, Q = PPQ, E8 = PPQ / 2, S16 = PPQ / 4, T8 = PPQ / 3;
/* Taktarten (werkstatt/METER-ANALYSE.md): EIN Objekt beantwortet alle offenen
   Fragen - Taktlaenge, Zaehlzeit, Puls, Swing-Einheit, Backbeat-Positionen,
   Arrangement-Schwerpunkte und das SMF-Time-Signature-Event. MIDI Clock
   uebertraegt keine Taktart; in der DAW muss sie von Hand mitgezogen werden. */
var METERS={
 '4/4':{id:'4/4',barTicks:1920,beats:4,beatTicks:480,pulses:4,pulseTicks:480,
        swingUnit:480,backbeats:[480,1440],arrOn:[0,960],smf:[0x04,0x02,0x18,0x08]},
 '3/4':{id:'3/4',barTicks:1440,beats:3,beatTicks:480,pulses:3,pulseTicks:480,
        swingUnit:480,backbeats:[480],arrOn:[0],smf:[0x03,0x02,0x18,0x08]},
 '6/8':{id:'6/8',barTicks:1440,beats:6,beatTicks:240,pulses:2,pulseTicks:720,
        swingUnit:720,backbeats:[720],arrOn:[0,720],smf:[0x06,0x03,0x24,0x08]}
};
var METER=METERS['4/4'];
var BAR=METER.barTicks;

function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};}
function hash32(){var h=2166136261>>>0;for(var i=0;i<arguments.length;i++){h^=(arguments[i]>>>0);h=Math.imul(h,16777619)>>>0;}return h>>>0;}
function clamp(v,a,b){return v<a?a:(v>b?b:v);}
function pick(rng,arr){return arr[Math.floor(rng()*arr.length)];}
function chance(rng,p){return rng()<p;}

var NMAP={'C':0,'C#':1,'DB':1,'D':2,'D#':3,'EB':3,'E':4,'F':5,'F#':6,'GB':6,'G':7,'G#':8,'AB':8,'A':9,'A#':10,'BB':10,'B':11};
var PCNAME=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

var CHORDS={
  maj:[0,4,7], min:[0,3,7], '7':[0,4,7,10], maj7:[0,4,7,11], m7:[0,3,7,10],
  '6':[0,4,7,9], m6:[0,3,7,9], '9':[0,4,7,10,14], m9:[0,3,7,10,14], maj9:[0,4,7,11,14],
  '13':[0,4,7,10,14,21], dim:[0,3,6], dim7:[0,3,6,9], m7b5:[0,3,6,10], aug:[0,4,8],
  '7#9':[0,4,7,10,15], '7b9':[0,4,7,10,13], sus4:[0,5,7], '7sus4':[0,5,7,10], sus2:[0,2,7]
};
var SCALES={
  maj:[0,2,4,5,7,9,11], maj7:[0,2,4,5,7,9,11], maj9:[0,2,4,5,7,9,11], '6':[0,2,4,5,7,9,11],
  '7':[0,2,4,5,7,9,10], '9':[0,2,4,5,7,9,10], '13':[0,2,4,5,7,9,10],
  sus4:[0,2,5,7,9,11], '7sus4':[0,2,5,7,9,10], sus2:[0,2,4,5,7,9,10],
  min:[0,2,3,5,7,9,10], m7:[0,2,3,5,7,9,10], m9:[0,2,3,5,7,9,10], m6:[0,2,3,5,7,9,10],
  m7b5:[0,1,3,5,6,8,10], dim:[0,2,3,5,6,8,9], dim7:[0,2,3,5,6,8,9,11],
  aug:[0,2,4,6,8,10], '7#9':[0,3,4,6,7,9,10], '7b9':[0,1,4,5,6,8,10]
};
function scaleOf(t){return SCALES[t]||SCALES['7'];}
function ivOf(t){return CHORDS[t]||CHORDS['7'];}
function isMinor(t){return t==='min'||t==='m7'||t==='m9'||t==='m6'||t==='m7b5'||t==='dim'||t==='dim7';}
function thirdOf(t){return isMinor(t)?3:(t==='sus4'?5:(t==='sus2'?2:4));}
function fifthOf(t){return (t==='dim'||t==='dim7'||t==='m7b5')?6:(t==='aug'?8:7);}
function seventhOf(t){return (t==='maj7'||t==='maj9')?11:(t==='dim7'?9:(t==='6'||t==='m6')?9:10);}

var SUF={'':null,'m':'min','min':'min','-':'min','maj':'maj','major':'maj','7':'7','maj7':'maj7','M7':'maj7','ma7':'maj7',
 'm7':'m7','-7':'m7','min7':'m7','6':'6','m6':'m6','min6':'m6','9':'9','m9':'m9','min9':'m9','maj9':'maj9','13':'13',
 'dim':'dim','o':'dim','dim7':'dim7','o7':'dim7','m7b5':'m7b5','ø':'m7b5','h7':'m7b5','aug':'aug','+':'aug',
 '7#9':'7#9','7+9':'7#9','7b9':'7b9','7-9':'7b9','sus4':'sus4','sus':'sus4','7sus4':'7sus4','sus2':'sus2'};

/* ============================================================
   1 · LANES
   ============================================================ */
var GM=('Acoustic Grand Piano,Bright Acoustic Piano,Electric Grand Piano,Honky-tonk Piano,Electric Piano 1,Electric Piano 2,Harpsichord,Clavi,'+
'Celesta,Glockenspiel,Music Box,Vibraphone,Marimba,Xylophone,Tubular Bells,Dulcimer,'+
'Drawbar Organ,Percussive Organ,Rock Organ,Church Organ,Reed Organ,Accordion,Harmonica,Tango Accordion,'+
'Acoustic Guitar (nylon),Acoustic Guitar (steel),Electric Guitar (jazz),Electric Guitar (clean),Electric Guitar (muted),Overdriven Guitar,Distortion Guitar,Guitar Harmonics,'+
'Acoustic Bass,Electric Bass (finger),Electric Bass (pick),Fretless Bass,Slap Bass 1,Slap Bass 2,Synth Bass 1,Synth Bass 2,'+
'Violin,Viola,Cello,Contrabass,Tremolo Strings,Pizzicato Strings,Orchestral Harp,Timpani,'+
'String Ensemble 1,String Ensemble 2,Synth Strings 1,Synth Strings 2,Choir Aahs,Voice Oohs,Synth Voice,Orchestra Hit,'+
'Trumpet,Trombone,Tuba,Muted Trumpet,French Horn,Brass Section,Synth Brass 1,Synth Brass 2,'+
'Soprano Sax,Alto Sax,Tenor Sax,Baritone Sax,Oboe,English Horn,Bassoon,Clarinet,'+
'Piccolo,Flute,Recorder,Pan Flute,Blown Bottle,Shakuhachi,Whistle,Ocarina,'+
'Lead 1 (square),Lead 2 (sawtooth),Lead 3 (calliope),Lead 4 (chiff),Lead 5 (charang),Lead 6 (voice),Lead 7 (fifths),Lead 8 (bass+lead),'+
'Pad 1 (new age),Pad 2 (warm),Pad 3 (polysynth),Pad 4 (choir),Pad 5 (bowed),Pad 6 (metallic),Pad 7 (halo),Pad 8 (sweep),'+
'FX 1 (rain),FX 2 (soundtrack),FX 3 (crystal),FX 4 (atmosphere),FX 5 (brightness),FX 6 (goblins),FX 7 (echoes),FX 8 (sci-fi),'+
'Sitar,Banjo,Shamisen,Koto,Kalimba,Bag pipe,Fiddle,Shanai,'+
'Tinkle Bell,Agogo,Steel Drums,Woodblock,Taiko Drum,Melodic Tom,Synth Drum,Reverse Cymbal,'+
'Guitar Fret Noise,Breath Noise,Seashore,Bird Tweet,Telephone Ring,Helicopter,Applause,Gunshot').split(',');
var GM_DEFAULT={bass:33,chords:0,arp:27,melody:56,drums:0};   // E-Bass, Flügel, Clean-Gitarre, Trompete, Standard-Kit

/* swing: -1 = folgt dem globalen Regler, sonst eigener Wert 0-100
   vspread: Velocity-Streuung +/- in Schritten, deterministisch aus dem Lane-Seed */
var LANES=[
 {id:'drums', name:'DRUMS',  color:'#ff44aa', on:false, ch:9, oct:2, vel:100,dens:70, style:'rock8', lock:false, seed:2468, prog:-1, fill:4, swing:-1, vspread:7},
 {id:'bass',  name:'BASS',   color:'#ff6622', on:true,  ch:0, oct:2, vel:94, dens:70, style:'walking', lock:false, seed:1234, prog:-1, swing:-1, vspread:12},
 {id:'chords',name:'CHORDS', color:'#4488ff', on:true,  ch:1, oct:3, vel:76, dens:60, style:'compSwing', lock:false, seed:5678, prog:-1, swing:-1, vspread:12},
 {id:'arp',   name:'ARP',    color:'#22cc88', on:false, ch:2, oct:4, vel:70, dens:60, style:'updown', lock:false, seed:9012, rate:'E8', arpOct:2, gate:70, prog:-1, swing:-1, vspread:8},
 {id:'melody',name:'MELODY', color:'#ffcc00', on:true,  ch:3, oct:4, vel:98, dens:55, style:'motif', lock:false, seed:3456, prog:-1, swing:-1, vspread:8}
];
/* [value, Label, Gruppe] – Gruppe erzeugt <optgroup> in der Style-Auswahl */
var LANE_STYLES={
 bass:[
  ['walking','Walking Bass','Jazz'],['bebopWalk','Bebop Walk (chromatisch)','Jazz'],['twoFeel','2-Feel (Half Time)','Jazz'],
  ['halfNotes','Halbe Noten','Jazz'],['arp8','Arpeggio 8tel','Jazz'],
  ['shuffle','Blues Shuffle','Blues / Roots'],['boogie','Boogie Woogie','Blues / Roots'],['tresillo','Tresillo / New Orleans','Blues / Roots'],
  ['country','Country Root-Five + Walkup','Blues / Roots'],['tenths','Dezimen (Ballad)','Blues / Roots'],
  ['rootFive','Root/Five Rock','Rock / Metal'],['octaves','Oktaven','Rock / Metal'],['drivingE8','Driving 8tel','Rock / Metal'],
  ['metal16','Metal 16tel Pedal','Rock / Metal'],['gallop','Gallop (8+16+16)','Rock / Metal'],['pedal','Pedal Pulse','Rock / Metal'],
  ['motown','Motown / Jamerson','Funk / Soul'],['funkSlap','Funk Slap 16tel','Funk / Soul'],['neoSoul','Neo-Soul Syncopation','Funk / Soul'],
  ['discoOct','Disco Oktaven','Funk / Soul'],['clave','Son-Clave Bass','Funk / Soul'],
  ['bossa','Bossa Nova','Latin / Karibik'],['samba','Samba Surdo','Latin / Karibik'],['tumbao','Tumbao (Salsa)','Latin / Karibik'],
  ['reggae','Reggae One-Drop','Latin / Karibik'],['dub','Dub / Deep Roots','Latin / Karibik'],
  ['houseOff','House Offbeat','Elektronisch'],['synth16','Synthwave 16tel','Elektronisch'],['trapSlide','Trap 808 (lang, sparsam)','Elektronisch'],
  ['sub','Sub / One-Note','Elektronisch'],
  ['waltz','Walzer (1 + 3)','3/4'],['waltzRun','Walzer Walkup','3/4'],
  ['ballad68','6/8 Ballade (2 Pulse)','6/8'],['blues68','Slow Blues 6/8','6/8'],['jig','Jig 8tel-Lauf','6/8']],
 chords:[
  ['compSwing','Swing Comping (rootless)','Jazz'],['charleston','Charleston','Jazz'],['shells','Shell Voicings 1-3-7','Jazz'],
  ['bigBand','Big-Band Hits (Anticipation)','Jazz'],['quartal','Quartal Modal','Jazz'],['push','Anticipation / Push','Jazz'],
  ['blockBeats','Block Chords 1-2-3-4','Pop / Rock'],['pad','Pad / Sustain','Pop / Rock'],['pop4','Pop Ganze + Halbe','Pop / Rock'],
  ['rockPower','Rock 8tel Power','Pop / Rock'],['strum','Gitarren-Strumming 16tel','Pop / Rock'],['broken','Broken Chords','Pop / Rock'],
  ['funk16','Funk 16tel','Funk / Soul'],['stabs','Offbeat Stabs','Funk / Soul'],['neoSoulComp','Neo-Soul 16tel lose','Funk / Soul'],
  ['gospel128','Gospel 12/8','Funk / Soul'],['tremolo','Tremolo 16tel','Funk / Soul'],['discoStab','Disco 16tel Stabs','Funk / Soul'],
  ['bossaComp','Bossa Comping','Latin / Karibik'],['montuno','Montuno (Salsa)','Latin / Karibik'],
  ['waltzComp','Walzer-Comping (2+3)','3/4'],['jazzWaltzComp','Jazz-Walzer Comping','3/4'],
  ['comp68','6/8 Comping (2 Pulse)','6/8'],['swell68','6/8 Pad','6/8'],
  ['reggaeSkank','Reggae Skank (Offbeat)','Latin / Karibik'],['skaUp','Ska Double Skank','Latin / Karibik'],
  ['housePluck','House Offbeat Pluck','Elektronisch'],['synthPulse','Synth-Puls 8tel','Elektronisch'],
  ['trance16','Trance 16tel Gate','Elektronisch'],['cine','Cinematic Swell','Elektronisch']],
 arp:[
  ['up','Up','Klassisch'],['down','Down','Klassisch'],['updown','Up/Down','Klassisch'],['downup','Down/Up','Klassisch'],
  ['upDown2','Up/Down (Ecken doppelt)','Klassisch'],['converge','Converge','Klassisch'],['diverge','Diverge','Klassisch'],
  ['thumb','Thumb (Bass + Up)','Muster'],['thumbUpDown','Thumb Up/Down','Muster'],['pinkyUp','Pinky Up (Top-Ton)','Muster'],
  ['staircase','Staircase (3 vor, 1 zurück)','Muster'],['skip3','Skip 3','Muster'],['pairs','Paare (2er-Gruppen)','Muster'],
  ['broken3','Gebrochene Terzen','Muster'],['cascade','Cascade','Muster'],
  ['trance','Trance Oktav-Sprung','Elektronisch'],['poly3','Polyrhythmus 3:4','Elektronisch'],['pedalAlt','Pedal + Wechselton','Elektronisch'],
  ['gate16','Gated 16tel Chord','Elektronisch'],['random','Random Walk','Elektronisch'],['randomGap','Random mit Lücken','Elektronisch']],
 melody:[
  ['motif','Motif Engine (entwickelnd)','Entwicklung'],['sequence','Sequenz (Motiv transponiert)','Entwicklung'],
  ['call','Call &amp; Response','Entwicklung'],['riff','Riff (1-Takt-Hook)','Entwicklung'],
  ['bebop','Bebop Line','Jazz'],['guideTones','Guide Tones (3 &amp; 7)','Jazz'],['chordTones','Akkordton-Linie','Jazz'],
  ['blues','Blues / Blue Notes','Blues / Roots'],['pentatonic','Pentatonic Hooks','Blues / Roots'],['country','Country Sixths','Blues / Roots'],
  ['ballad','Sparse Ballad','Ruhig'],['ambient','Ambient Long Tones','Ruhig'],['hymn','Choral / Hymne','Ruhig'],
  ['popHook','Pop Hook 16tel','Modern'],['edmLead','EDM Lead (repetitiv)','Modern'],['funkStabs','Funk Stabs','Modern'],
  ['latin','Latin Montuno-Linie','Modern']],
 drums:[]   /* wird aus DRUMPAT erzeugt */
};

/* ============================================================
   1b · DRUM-BIBLIOTHEK (GM-Notennummern, Maskengrid)
   Maske: X = Akzent, x = normal, o = Ghost/leise, - = Pause
   grid = Schritte pro Takt (16 = 16tel, 12 = 8tel-Triolen, 24 = 16tel-Triolen)
   Maskenlänge > grid  =>  mehrtaktiges Pattern
   ============================================================ */
var DK={kick:36,kick2:35,snare:38,snare2:40,rim:37,clap:39,hhC:42,hhP:44,hhO:46,
        ride:51,bell:53,crash:49,crash2:57,splash:55,t1:50,t2:48,t3:47,t4:45,t5:43,t6:41,
        tamb:54,cow:56,congaH:63,congaM:62,congaL:64,bongoH:60,bongoL:61,claves:75,maracas:70,
        agogoH:67,agogoL:68,cabasa:69,timbaleH:65,shaker:70,vibraslap:58};
var DRUMPAT={
 rock8:{name:'Rock 8tel',g:'Rock / Pop',grid:16,rows:[[DK.kick,'X-------X-------'],[DK.snare,'----X-------X---'],[DK.hhC,'x-x-x-x-x-x-x-x-']],
   meters:{'3/4':{grid:12,rows:[[DK.kick,'X-----x-----'],[DK.snare,'----X---X---'],[DK.hhC,'x-x-x-x-x-x-']]},
           '6/8':{grid:12,rows:[[DK.kick,'X-----x-----'],[DK.snare,'------X-----'],[DK.hhC,'x-x-x-x-x-x-']]}}},
 rock16:{name:'Rock 16tel Hats',g:'Rock / Pop',grid:16,rows:[[DK.kick,'X-----X-X-------'],[DK.snare,'----X-------X---'],[DK.hhC,'XxxxXxxxXxxxXxxx']]},
 rockHalf:{name:'Halftime Rock',g:'Rock / Pop',grid:16,rows:[[DK.kick,'X-------X-x-----'],[DK.snare,'--------X-------'],[DK.hhC,'x-x-x-x-x-x-x-x-']]},
 pop:{name:'Pop (Kick auf 3+)',g:'Rock / Pop',grid:16,rows:[[DK.kick,'X---------X-----'],[DK.snare,'----X-------X---'],[DK.hhC,'x-x-x-x-x-x-x-x-'],[DK.tamb,'----x-------x---']]},
 punk:{name:'Punk / Fast 8tel',g:'Rock / Pop',grid:16,rows:[[DK.kick,'X---X---X---X---'],[DK.snare,'----X-------X---'],[DK.hhC,'XxXxXxXxXxXxXxXx']]},
 metal:{name:'Metal Doublebass',g:'Rock / Pop',grid:16,rows:[[DK.kick,'XxxxXxxxXxxxXxxx'],[DK.snare,'----X-------X---'],[DK.ride,'x-x-x-x-x-x-x-x-'],[DK.crash,'X---------------']]},
 stadium:{name:'Stadium / Four-Floor Rock',g:'Rock / Pop',grid:16,rows:[[DK.kick,'X---X---X---X---'],[DK.snare,'----X-------X---'],[DK.hhO,'--x---x---x---x-'],[DK.crash,'X---------------']]},
 ballad:{name:'Ballade (Cross-Stick)',g:'Ruhig',grid:16,rows:[[DK.kick,'X-------x-------'],[DK.rim,'----x-------x---'],[DK.hhC,'x-o-x-o-x-o-x-o-']],
   meters:{'3/4':{grid:12,rows:[[DK.kick,'X-----------'],[DK.rim,'--------x---'],[DK.hhC,'x-o-x-o-x-o-']]},
           '6/8':{grid:12,rows:[[DK.kick,'X-----------'],[DK.rim,'------x-----'],[DK.hhC,'x-o-x-x-o-x-']]}}},
 cine:{name:'Cinematic Toms',g:'Ruhig',grid:16,rows:[[DK.t4,'X---x---X---x---'],[DK.t2,'--x---x---x---x-'],[DK.snare,'--------X-------'],[DK.crash,'X---------------']]},
 shuffle:{name:'Blues Shuffle',g:'Blues / Swing',grid:12,rows:[[DK.kick,'X-----X-----'],[DK.snare,'---X-----X--'],[DK.hhC,'x-xx-xx-xx-x']]},
 halfShuffle:{name:'Purdie Halftime Shuffle',g:'Blues / Swing',grid:12,rows:[[DK.kick,'X-----x---x-'],[DK.snare,'o-oX-oo-oX-o'],[DK.hhC,'x-xx-xx-xx-x']]},
 jazzRide:{name:'Jazz Ride (Swing)',g:'Blues / Swing',grid:12,rows:[[DK.ride,'X--x-xX--x-x'],[DK.hhP,'---x-----x--'],[DK.kick,'o-----o-----'],[DK.snare,'------o---o-']],
   meters:{'3/4':{grid:12,rows:[[DK.ride,'X---x-x-x-x-'],[DK.hhP,'----x---x---'],[DK.kick,'o-----------'],[DK.snare,'------o---o-']]},
           '6/8':{grid:12,rows:[[DK.ride,'X-x-x-X-x-x-'],[DK.hhP,'------x-----'],[DK.kick,'o-----------']]}}},
 jazzUp:{name:'Jazz Up-Tempo + Comping',g:'Blues / Swing',grid:12,rows:[[DK.ride,'X--x-xX--x-x'],[DK.hhP,'---x-----x--'],[DK.snare,'--o--x---o-x'],[DK.kick,'o----x------']]},
 jazzBrush:{name:'Brushes 4/4',g:'Blues / Swing',grid:12,rows:[[DK.snare2,'x--x-xx--x-x'],[DK.hhP,'---x-----x--'],[DK.kick,'o-----o-----']]},
 train:{name:'Train Beat 16tel',g:'Blues / Swing',grid:16,rows:[[DK.snare,'XoooXoooXoooXooo'],[DK.kick,'X---X---X---X---'],[DK.hhC,'--x---x---x---x-']]},
 motown:{name:'Motown Backbeat',g:'Funk / Soul',grid:16,rows:[[DK.kick,'X---X---X-x-X---'],[DK.snare,'----X-------X---'],[DK.ride,'x-x-x-x-x-x-x-x-'],[DK.tamb,'x-x-x-x-x-x-x-x-']]},
 funk1:{name:'Funky Drummer',g:'Funk / Soul',grid:16,rows:[[DK.kick,'X-x---X---x-X---'],[DK.snare,'--o-X--o-oX-o-X-'],[DK.hhC,'XxxxXxxXxxxXxxxx']]},
 funk2:{name:'Funk 16tel Tight',g:'Funk / Soul',grid:16,rows:[[DK.kick,'X--x--X---X--x--'],[DK.snare,'----X---o---X---'],[DK.hhC,'XxxxXxxxXxxxXxxx'],[DK.hhO,'------------x---']]},
 gospel:{name:'Gospel Pocket',g:'Funk / Soul',grid:16,rows:[[DK.kick,'X--x-x--X-x---x-'],[DK.snare,'----X-o-o-o-X-o-'],[DK.hhC,'XxxxXxxxXxxxXxxx']]},
 neosoul:{name:'Neo-Soul Loose',g:'Funk / Soul',grid:16,rows:[[DK.kick,'X-----x---X-----'],[DK.snare,'----X--o----X-o-'],[DK.hhC,'x-xxx-x-x-xxx-x-']]},
 disco:{name:'Disco Four-Floor',g:'Funk / Soul',grid:16,rows:[[DK.kick,'X---X---X---X---'],[DK.snare,'----X-------X---'],[DK.hhC,'x-x-x-x-x-x-x-x-'],[DK.hhO,'--x---x---x---x-']]},
 bossa:{name:'Bossa Nova',g:'Latin',grid:16,rows:[[DK.kick,'X--x--X-X--x--X-'],[DK.rim,'--x---x---x-x---'],[DK.hhC,'x-x-x-x-x-x-x-x-']]},
 samba:{name:'Samba',g:'Latin',grid:16,rows:[[DK.kick,'X--x-x-XX--x-x-X'],[DK.rim,'--x---x---x---x-'],[DK.hhC,'xoxoxoxoxoxoxoxo'],[DK.agogoH,'x---x---x---x---']]},
 chacha:{name:'Cha-Cha',g:'Latin',grid:16,rows:[[DK.kick,'X---X---X---X---'],[DK.congaH,'--x-x---x-x-x---'],[DK.claves,'x--x--x---x-x---'],[DK.cow,'x---x---x---x---']]},
 mambo:{name:'Mambo / Salsa',g:'Latin',grid:16,rows:[[DK.congaL,'X--x--X---x--X--'],[DK.congaH,'--x-x---x-x---x-'],[DK.claves,'x--x--x---x-x---'],[DK.timbaleH,'----x-------x---']]},
 afrobeat:{name:'Afrobeat',g:'Latin',grid:16,rows:[[DK.kick,'X--x--X---x-X---'],[DK.snare,'----o-X---o-X-o-'],[DK.hhC,'x-xxx-x-x-xxx-x-'],[DK.cow,'x---x---x---x---']]},
 reggaeOne:{name:'Reggae One-Drop',g:'Reggae / Karibik',grid:16,rows:[[DK.kick,'--------X-------'],[DK.snare,'--------X-------'],[DK.hhC,'x-x-x-x-x-x-x-x-'],[DK.rim,'----o-------o---']]},
 steppers:{name:'Reggae Steppers',g:'Reggae / Karibik',grid:16,rows:[[DK.kick,'X---X---X---X---'],[DK.rim,'--------X-------'],[DK.hhC,'x-x-x-x-x-x-x-x-']]},
 ska:{name:'Ska Offbeat',g:'Reggae / Karibik',grid:16,rows:[[DK.kick,'X-------X-------'],[DK.snare,'----X-------X---'],[DK.hhC,'--x---x---x---x-'],[DK.hhO,'--x---x---x---x-']]},
 dembow:{name:'Reggaeton Dembow',g:'Reggae / Karibik',grid:16,rows:[[DK.kick,'X-----x-X-----x-'],[DK.snare,'---x--x----x--x-'],[DK.hhC,'x-x-x-x-x-x-x-x-']]},
 boombap:{name:'Boom Bap',g:'HipHop / Trap',grid:16,rows:[[DK.kick,'X-----X---X-----'],[DK.snare,'----X-------X---'],[DK.hhC,'x-x-x-x-x-x-x-x-'],[DK.hhO,'--------------x-']]},
 lofi:{name:'Lo-Fi Dusty',g:'HipHop / Trap',grid:16,rows:[[DK.kick,'X------x--X-----'],[DK.snare,'----X-------X---'],[DK.hhC,'x-oxx-o-x-oxx-o-']]},
 trap:{name:'Trap 808',g:'HipHop / Trap',grid:16,rows:[[DK.kick,'X-----X---X---x-'],[DK.clap,'--------X-------'],[DK.hhC,'xxxxxxxxxxxxxxxx'],[DK.hhO,'------------x---']]},
 trapRoll:{name:'Trap 32tel-Rolls',g:'HipHop / Trap',grid:32,rows:[[DK.kick,'X-----------X-----------X-------'],[DK.clap,'----------------X---------------'],[DK.hhC,'x-x-x-x-x-xxxxx-x-x-x-x-xxxxxxxx']]},
 drill:{name:'UK Drill',g:'HipHop / Trap',grid:16,rows:[[DK.kick,'X---x-----X-x---'],[DK.clap,'--------X-------'],[DK.hhC,'x-xx-x-xx-x-x-xx'],[DK.rim,'------x-----x---']]},
 house:{name:'House Four-Floor',g:'Elektronisch',grid:16,rows:[[DK.kick,'X---X---X---X---'],[DK.clap,'----X-------X---'],[DK.hhC,'--x---x---x---x-'],[DK.shaker,'x-x-x-x-x-x-x-x-']]},
 techHouse:{name:'Tech House',g:'Elektronisch',grid:16,rows:[[DK.kick,'X---X---X---X---'],[DK.clap,'----X-------X---'],[DK.hhO,'--x---x---x---x-'],[DK.rim,'x-xx--x-x-xx--x-']]},
 techno:{name:'Techno Straight',g:'Elektronisch',grid:16,rows:[[DK.kick,'X---X---X---X---'],[DK.hhC,'xxxxxxxxxxxxxxxx'],[DK.hhO,'--x---x---x---x-'],[DK.rim,'----x-------x---']]},
 trance:{name:'Trance',g:'Elektronisch',grid:16,rows:[[DK.kick,'X---X---X---X---'],[DK.clap,'----X-------X---'],[DK.hhO,'--x---x---x---x-'],[DK.crash,'X---------------']]},
 breakbeat:{name:'Breakbeat / Big Beat',g:'Elektronisch',grid:16,rows:[[DK.kick,'X---x-X---x-X---'],[DK.snare,'----X-------X-x-'],[DK.hhC,'x-x-x-x-x-x-x-x-']]},
 amen:{name:'Amen Break (2 Takte)',g:'Elektronisch',grid:16,rows:[
   [DK.kick,'X-x-------X-x---X-x-------x-----'],
   [DK.snare,'----X--o-oX---X-----X--o-oX---o-'],
   [DK.hhC,'x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-x-'],
   [DK.crash,'--------------------------------']]},
 dnb:{name:'Drum & Bass',g:'Elektronisch',grid:16,rows:[[DK.kick,'X-----X---------'],[DK.snare,'----X-------X---'],[DK.hhC,'x-x-x-x-x-x-x-x-'],[DK.ride,'----------------']]},
 dubstep:{name:'Dubstep Halftime',g:'Elektronisch',grid:16,rows:[[DK.kick,'X-------------x-'],[DK.snare,'--------X-------'],[DK.hhC,'--x---x---x---x-']]},
 /* --- 3/4: eigene Patterns (only) --- */
 waltz:{name:'Walzer',g:'3/4',only:'3/4',grid:12,rows:[[DK.kick,'X-----------'],[DK.snare,'----x---x---'],[DK.hhC,'x---x---x---']]},
 jazzWaltz:{name:'Jazz-Walzer (Ride)',g:'3/4',only:'3/4',grid:12,rows:[[DK.ride,'X---x-x-x-x-'],[DK.hhP,'----x---x---'],[DK.kick,'o-----------'],[DK.snare,'------o---o-']]},
 rockWaltz:{name:'Rock-Walzer',g:'3/4',only:'3/4',grid:12,rows:[[DK.kick,'X-----x-----'],[DK.snare,'----X---X---'],[DK.hhC,'x-x-x-x-x-x-']]},
 countryWaltz:{name:'Country-Walzer',g:'3/4',only:'3/4',grid:12,rows:[[DK.kick,'X-----------'],[DK.rim,'----x---x---'],[DK.hhC,'x-xx-xx-xx-x']]},
 balladWaltz:{name:'Walzer-Ballade (Cross-Stick)',g:'3/4',only:'3/4',grid:12,rows:[[DK.kick,'X-----------'],[DK.rim,'--------x---'],[DK.hhC,'x-o-x-o-x-o-']]},
 brushWaltz:{name:'Walzer Brushes',g:'3/4',only:'3/4',grid:12,rows:[[DK.snare2,'X--x--x--x--'],[DK.hhP,'----x---x---'],[DK.kick,'o-----------']]},
 folkWaltz:{name:'Folk-Walzer',g:'3/4',only:'3/4',grid:12,rows:[[DK.kick,'X-----------'],[DK.tamb,'----x---x---'],[DK.hhC,'x-x-x-x-x-x-']]},
 tomWaltz:{name:'Tom-Walzer (Cinematic)',g:'3/4',only:'3/4',grid:12,rows:[[DK.t4,'X-----x-----'],[DK.t2,'--x-----x---'],[DK.crash,'X-----------']]},
 /* --- 6/8: eigene Patterns (only) --- */
 blues68:{name:'Slow Blues 6/8',g:'6/8',only:'6/8',grid:12,rows:[[DK.kick,'X-----------'],[DK.snare,'------X-----'],[DK.hhC,'x-x-x-x-x-x-']]},
 rock68:{name:'Rock 6/8',g:'6/8',only:'6/8',grid:12,rows:[[DK.kick,'X-----x-----'],[DK.snare,'------X-----'],[DK.hhC,'x-x-x-x-x-x-']]},
 ballad68:{name:'6/8 Ballade',g:'6/8',only:'6/8',grid:12,rows:[[DK.kick,'X-----------'],[DK.rim,'------x-----'],[DK.hhC,'x-o-x-x-o-x-']]},
 jig:{name:'Jig (Irish)',g:'6/8',only:'6/8',grid:12,rows:[[DK.kick,'X-----x-----'],[DK.snare,'----x-----x-'],[DK.hhC,'x-x-x-x-x-x-']]},
 afro68:{name:'Bembe 12/8-Bell',g:'6/8',only:'6/8',grid:12,rows:[[DK.cow,'X-x-xx-x-x-x'],[DK.kick,'X-----x-----'],[DK.congaH,'--x---x---x-'],[DK.shaker,'x-x-x-x-x-x-']]},
 gospel68:{name:'Gospel 6/8',g:'6/8',only:'6/8',grid:12,rows:[[DK.kick,'X-----x-----'],[DK.snare,'------X-----'],[DK.hhC,'x-x-x-x-x-x-'],[DK.tamb,'------x-----']]},
 doowop68:{name:'Doo-Wop 6/8 (Ride)',g:'6/8',only:'6/8',grid:12,rows:[[DK.ride,'X-x-x-x-x-x-'],[DK.kick,'X-----------'],[DK.snare,'------o-----']]}
};
var DRUMFILLS=[
 [[DK.snare,'x-xx-x-x'],[DK.t1,'-------x']],
 [[DK.snare,'X-o-X-o-'],[DK.t2,'--x---x-'],[DK.t4,'------x-']],
 [[DK.snare,'xxxxxxxx']],
 [[DK.snare,'X---x-x-'],[DK.t1,'--x-----'],[DK.t2,'----x---'],[DK.t4,'------x-']],
 [[DK.t1,'x-x-----'],[DK.t2,'----x-x-'],[DK.t4,'------xx']],
 [[DK.snare,'x-x-xx-x'],[DK.t4,'-------X']],
 [[DK.snare,'--x-x-xx'],[DK.kick,'x-------']],
 [[DK.snare,'XxxXxxXx']]
];
var DRUMFILLS34=[
 [[DK.snare,'x-xx']],
 [[DK.snare,'xxxx']],
 [[DK.snare,'X-o-'],[DK.t2,'--x-'],[DK.t4,'---x']],
 [[DK.t1,'x---'],[DK.t2,'-x--'],[DK.t4,'--xx']]
];
var DRUMFILLS68=[
 [[DK.snare,'x-xx-x']],
 [[DK.snare,'xxxxxx']],
 [[DK.snare,'X--x--'],[DK.t2,'--x---'],[DK.t4,'-----x']],
 [[DK.t1,'x-x---'],[DK.t2,'---x--'],[DK.t4,'----xx']]
];
/* Welche Styles es in welcher Taktart gibt. 4/4: alles ausser den
   taktart-eigenen (STYLE_ONLY). 3/4 und 6/8: Whitelist - eine Auswahl,
   die 43 Eintraege zeigt, von denen 15 Muell produzieren, ist schlechter
   als eine mit 12 richtigen (METER-ANALYSE). */
var STYLE_ONLY={waltz:'3/4',waltzRun:'3/4',waltzComp:'3/4',jazzWaltzComp:'3/4',
  ballad68:'6/8',blues68:'6/8',jig:'6/8',comp68:'6/8',swell68:'6/8'};
var METER_ALLOW={
 '3/4':{
  bass:['waltz','waltzRun','walking','country','pedal','rootFive','octaves','arp8','tenths','sub'],
  chords:['waltzComp','jazzWaltzComp','pad','shells','push','broken','strum','tremolo','blockBeats','cine','quartal'],
  melody:['guideTones','ambient']},
 '6/8':{
  bass:['ballad68','blues68','jig','walking','pedal','octaves','rootFive','arp8','sub'],
  chords:['comp68','swell68','pad','shells','broken','tremolo','cine','quartal'],
  melody:['guideTones','ambient']}
};
function styleAllowed(laneId,sid){
  if(laneId==='drums'){
    var P=DRUMPAT[sid]; if(!P)return false;
    if(P.only)return P.only===METER.id;
    if(METER.id==='4/4')return true;
    return !!(P.meters&&P.meters[METER.id]);
  }
  if(STYLE_ONLY[sid])return STYLE_ONLY[sid]===METER.id;
  var al=METER_ALLOW[METER.id]; if(!al)return true;
  var list=al[laneId]; if(!list)return true;
  return list.indexOf(sid)>=0;
}
function meterDefaultStyle(laneId){
  var d={'3/4':{drums:'waltz',bass:'waltz',chords:'waltzComp',melody:'guideTones'},
         '6/8':{drums:'blues68',bass:'ballad68',chords:'comp68',melody:'guideTones'},
         '4/4':{drums:'rock8',bass:'rootFive',chords:'pad',melody:'guideTones'}}[METER.id];
  return d?d[laneId]:null;
}
function drumPatFor(P){
  if(!P)return null;
  if(P.only)return P.only===METER.id?P:null;
  if(METER.id==='4/4')return P;
  var v=P.meters&&P.meters[METER.id];
  return v?{name:P.name,g:P.g,grid:v.grid,rows:v.rows}:null;
}
var DRUMKITS=[[0,'Standard Kit'],[8,'Room Kit'],[16,'Power Kit'],[24,'Electronic Kit'],[25,'TR-808 Kit'],[32,'Jazz Kit'],[40,'Brush Kit'],[48,'Orchestra Kit']];
(function(){
  var arr=[];
  for(var k in DRUMPAT)if(DRUMPAT.hasOwnProperty(k))arr.push([k,DRUMPAT[k].name,DRUMPAT[k].g]);
  LANE_STYLES.drums=arr;
})();

/* Band-Presets: setzen Styles aller Lanes, Lane-On/Off, Tempo und Swing */
var BANDS={
 jazzTrio:['Jazz Trio (Swing)',{drums:'jazzRide',bass:'walking',chords:'compSwing',arp:'updown',melody:'bebop'},{on:{drums:1,bass:1,chords:1,arp:0,melody:1},bpm:132,swing:62}],
 jazzBallad:['Jazz Ballad',{drums:'jazzBrush',bass:'twoFeel',chords:'shells',arp:'up',melody:'guideTones'},{on:{drums:1,bass:1,chords:1,arp:0,melody:1},bpm:72,swing:58}],
 bigBand:['Big Band',{drums:'jazzUp',bass:'walking',chords:'bigBand',arp:'up',melody:'bebop'},{on:{drums:1,bass:1,chords:1,arp:0,melody:1},bpm:160,swing:60}],
 blues:['Blues Shuffle',{drums:'shuffle',bass:'shuffle',chords:'charleston',arp:'up',melody:'blues'},{on:{drums:1,bass:1,chords:1,arp:0,melody:1},bpm:104,swing:64}],
 boogie:['Boogie Woogie',{drums:'train',bass:'boogie',chords:'tremolo',arp:'up',melody:'blues'},{on:{drums:1,bass:1,chords:1,arp:0,melody:1},bpm:150,swing:60}],
 rock:['Rock Band',{drums:'rock8',bass:'rootFive',chords:'rockPower',arp:'up',melody:'pentatonic'},{on:{drums:1,bass:1,chords:1,arp:0,melody:1},bpm:124,swing:0}],
 metal:['Metal',{drums:'metal',bass:'metal16',chords:'rockPower',arp:'trance',melody:'pentatonic'},{on:{drums:1,bass:1,chords:1,arp:0,melody:1},bpm:150,swing:0}],
 pop:['Pop',{drums:'pop',bass:'drivingE8',chords:'pop4',arp:'up',melody:'popHook'},{on:{drums:1,bass:1,chords:1,arp:1,melody:1},bpm:110,swing:0}],
 ballad:['Ballade',{drums:'ballad',bass:'tenths',chords:'pad',arp:'up',melody:'ballad'},{on:{drums:1,bass:1,chords:1,arp:0,melody:1},bpm:70,swing:0}],
 funk:['Funk',{drums:'funk1',bass:'funkSlap',chords:'funk16',arp:'gate16',melody:'funkStabs'},{on:{drums:1,bass:1,chords:1,arp:0,melody:1},bpm:100,swing:12}],
 motown:['Motown / Soul',{drums:'motown',bass:'motown',chords:'blockBeats',arp:'up',melody:'pentatonic'},{on:{drums:1,bass:1,chords:1,arp:0,melody:1},bpm:120,swing:14}],
 neosoul:['Neo-Soul',{drums:'neosoul',bass:'neoSoul',chords:'neoSoulComp',arp:'broken3',melody:'guideTones'},{on:{drums:1,bass:1,chords:1,arp:0,melody:1},bpm:84,swing:22}],
 gospel:['Gospel',{drums:'gospel',bass:'motown',chords:'gospel128',arp:'up',melody:'hymn'},{on:{drums:1,bass:1,chords:1,arp:0,melody:1},bpm:76,swing:30}],
 disco:['Disco',{drums:'disco',bass:'discoOct',chords:'discoStab',arp:'up',melody:'popHook'},{on:{drums:1,bass:1,chords:1,arp:1,melody:1},bpm:120,swing:0}],
 bossa:['Bossa Nova',{drums:'bossa',bass:'bossa',chords:'bossaComp',arp:'up',melody:'guideTones'},{on:{drums:1,bass:1,chords:1,arp:0,melody:1},bpm:132,swing:0}],
 samba:['Samba',{drums:'samba',bass:'samba',chords:'bossaComp',arp:'up',melody:'latin'},{on:{drums:1,bass:1,chords:1,arp:0,melody:1},bpm:150,swing:0}],
 salsa:['Salsa / Mambo',{drums:'mambo',bass:'tumbao',chords:'montuno',arp:'pairs',melody:'latin'},{on:{drums:1,bass:1,chords:1,arp:0,melody:1},bpm:180,swing:0}],
 reggae:['Reggae',{drums:'reggaeOne',bass:'reggae',chords:'reggaeSkank',arp:'up',melody:'pentatonic'},{on:{drums:1,bass:1,chords:1,arp:0,melody:1},bpm:76,swing:0}],
 dub:['Dub',{drums:'steppers',bass:'dub',chords:'reggaeSkank',arp:'pedalAlt',melody:'ambient'},{on:{drums:1,bass:1,chords:1,arp:0,melody:0},bpm:72,swing:0}],
 hiphop:['Boom Bap HipHop',{drums:'boombap',bass:'sub',chords:'neoSoulComp',arp:'broken3',melody:'ambient'},{on:{drums:1,bass:1,chords:1,arp:0,melody:0},bpm:90,swing:26}],
 trap:['Trap',{drums:'trapRoll',bass:'trapSlide',chords:'cine',arp:'trance',melody:'ambient'},{on:{drums:1,bass:1,chords:1,arp:0,melody:0},bpm:140,swing:0}],
 house:['House',{drums:'house',bass:'houseOff',chords:'housePluck',arp:'gate16',melody:'edmLead'},{on:{drums:1,bass:1,chords:1,arp:1,melody:0},bpm:124,swing:0}],
 techno:['Techno',{drums:'techno',bass:'synth16',chords:'trance16',arp:'poly3',melody:'edmLead'},{on:{drums:1,bass:1,chords:1,arp:1,melody:0},bpm:130,swing:0}],
 trance:['Trance',{drums:'trance',bass:'synth16',chords:'trance16',arp:'trance',melody:'edmLead'},{on:{drums:1,bass:1,chords:1,arp:1,melody:1},bpm:138,swing:0}],
 dnb:['Drum & Bass',{drums:'dnb',bass:'sub',chords:'pad',arp:'poly3',melody:'ambient'},{on:{drums:1,bass:1,chords:1,arp:1,melody:0},bpm:174,swing:0}],
 synthwave:['Synthwave',{drums:'stadium',bass:'synth16',chords:'synthPulse',arp:'trance',melody:'edmLead'},{on:{drums:1,bass:1,chords:1,arp:1,melody:1},bpm:118,swing:0}],
 cinematic:['Cinematic',{drums:'cine',bass:'pedal',chords:'cine',arp:'cascade',melody:'ambient'},{on:{drums:1,bass:1,chords:1,arp:1,melody:1},bpm:92,swing:0}],
 country:['Country',{drums:'train',bass:'country',chords:'strum',arp:'up',melody:'country'},{on:{drums:1,bass:1,chords:1,arp:0,melody:1},bpm:118,swing:16}],
 modal:['Modal / Vamp',{drums:'jazzRide',bass:'pedal',chords:'quartal',arp:'staircase',melody:'motif'},{on:{drums:1,bass:1,chords:1,arp:1,melody:1},bpm:126,swing:56}]
};
var RATES={'Q':[480,'1/4'],'E8':[240,'1/8'],'T8':[160,'1/8T'],'S16':[120,'1/16'],'T16':[80,'1/16T']};

/* ============================================================
   2 · PROGRESSION
   ============================================================ */
var PRESETS={
 'blues12_A':  ['12-Bar Blues in A',      'A7 D7 A7 A7 D7 D7 A7 A7 E7 D7 A7 E7','7'],
 'blues12_qc': ['Quick-Change Blues in C','C7 F7 C7 C7 F7 F7 C7 C7 G7 F7 C7 G7','7'],
 'jazzblues_F':['Jazz Blues in F',        'F7 Bb7 F7 F7 Bb7 Bdim7 F7 D7 Gm7 C7 F7 C7','7'],
 'minorblues_A':['Minor Blues in Am',     'Am7 Am7 Am7 Am7 Dm7 Dm7 Am7 Am7 Fmaj7 E7b9 Am7 E7b9','m7'],
 'rhythm_A':   ['Rhythm Changes A (2 Tkt/Akk)','Bb Gm7 Cm7 F7 Bb Gm7 Cm7 F7 Fm7 Bb7 Ebmaj7 Ab7 Bb G7 Cm7 F7','maj'],
 'ii_V_I':     ['ii-V-I (C)',             'Dm7:2 G7:2 Cmaj7:4','maj7'],
 'coltrane':   ['Coltrane Changes (kurz)','Bmaj7 D7 Gmaj7 Bb7 Ebmaj7:2 Am7 D7 Gmaj7 Bb7 Ebmaj7:2','maj7'],
 'pop_1564':   ['Pop I-V-vi-IV',          'C:2 G:2 Am:2 F:2','maj'],
 'andalusian': ['Andalusian Cadence',     'Am:2 G:2 F:2 E:2','maj'],
 'neosoul':    ['Neo-Soul Loop',          'Fmaj9:2 Em9:2 Dm9:2 Cmaj9:2','maj7'],
 'gospel':     ['Gospel 2-5-1',           'Cmaj7 A7b9 Dm7 G7 Cmaj7 A7b9 Dm7 G7','maj7'],
 'doo_wop':    ['Doo-Wop 50s',            'C Am F G','maj'],
 'modal_so':   ['Modal (So What)',        'Dm9:8 Ebm9:4 Dm9:4','m7'],
 'trap_min':   ['Trap Minor Loop',        'Cm9:2 Abmaj9:2 Ebmaj9:2 Bbmaj:2','min']
};

var gSeq=[];      // [{root,type,bars,label}]
var gBars=[];     // pro Takt: {root,type,label,ci}
var barLock=[];   // pro Takt: bool
var barVar=[];    // pro Takt: Mutations-Index

function parseToken(tok){
  tok=tok.trim(); if(!tok)return null;
  var bars=null, ci=tok.indexOf(':');
  if(ci>0){ bars=parseInt(tok.slice(ci+1),10); tok=tok.slice(0,ci); if(!(bars>0))bars=null; }
  var m=tok.match(/^([A-Ga-g])([#b]?)(.*)$/); if(!m)return null;
  var root=NMAP[(m[1].toUpperCase()+m[2].toLowerCase()).toUpperCase()];
  if(root===undefined)return null;
  var raw=m[3].trim(), key=raw, type=null;
  if(SUF.hasOwnProperty(key))type=SUF[key];
  else if(SUF.hasOwnProperty(key.toLowerCase()))type=SUF[key.toLowerCase()];
  else return null;
  if(type===null)type=document.getElementById('defType').value;
  return {root:root,type:type,label:tok,bars:bars,suf:raw};
}
function applySeq(){
  var raw=document.getElementById('chordInput').value.trim();
  var defBars=parseInt(document.getElementById('barsPerChord').value,10);
  var parts=raw.split(/\s+/), res=[], errs=[];
  for(var i=0;i<parts.length;i++){
    if(!parts[i])continue;
    var c=parseToken(parts[i]);
    if(c){ if(c.bars===null)c.bars=defBars; res.push(c);} else errs.push(parts[i]);
  }
  var errEl=document.getElementById('seqErr');
  if(errs.length){errEl.textContent='Unbekannt: '+errs.join(', ');errEl.style.display='block';}else errEl.style.display='none';
  if(!res.length)return;
  gSeq=res;
  gBars=[];
  for(var s=0;s<gSeq.length;s++)for(var b=0;b<gSeq[s].bars;b++)
    gBars.push({root:gSeq[s].root,type:gSeq[s].type,label:gSeq[s].label,ci:s});
  var oldLock=barLock.slice();
  barLock=[]; barVar=[];
  for(var k=0;k<gBars.length;k++){barLock.push(oldLock[k]||false);barVar.push(0);}
  buildCDisp();
  if(document.getElementById('sugRow'))buildSuggestions();
  reloadFromCurrent();
  log('Progression: '+gBars.length+' Takte · '+gSeq.map(function(c){return c.label;}).join(' '),'i');
}
function buildCDisp(){
  var cd=document.getElementById('cdisp'); if(!cd)return; cd.innerHTML='';
  var kp=curKey(), km=curMode(), bar=1;
  for(var i=0;i<gSeq.length;i++){
    var c=gSeq[i], nx=gSeq[(i+1)%gSeq.length], first=bar-1;
    var an=analyze(c,nx,kp,km);
    var el=document.createElement('div');
    el.className='cb'+(an.secondary?' sec':''); el.id='cblock'+i;
    el.innerHTML='<div class="lkicon">&#128274;</div><div class="bn">Takt '+bar+(c.bars>1?'-'+(bar+c.bars-1):'')+
      '</div><div class="cn">'+prettyLabel(c)+'</div><div class="rn">'+an.rn+'</div>';
    (function(f,n,e){e.onclick=function(){
      var nowLocked=!barLock[f];
      for(var x=f;x<f+n;x++)barLock[x]=nowLocked;
      e.classList.toggle('lk',nowLocked);
    };})(first,c.bars,el);
    if(barLock[first])el.classList.add('lk');
    cd.appendChild(el); bar+=c.bars;
  }
}

/* ============================================================
   2b · HARMONIE-ENGINE
   ============================================================ */
var MODES={
  ionian:[0,2,4,5,7,9,11], dorian:[0,2,3,5,7,9,10], phrygian:[0,1,3,5,7,8,10],
  lydian:[0,2,4,6,7,9,11], mixolydian:[0,2,4,5,7,9,10], aeolian:[0,2,3,5,7,8,10],
  harmonicMinor:[0,2,3,5,7,8,11]
};
var DIA3={
  ionian:['maj','min','min','maj','maj','min','dim'],
  dorian:['min','min','maj','maj','min','dim','maj'],
  phrygian:['min','maj','maj','min','dim','maj','min'],
  lydian:['maj','maj','min','dim','maj','min','min'],
  mixolydian:['maj','min','dim','maj','min','min','maj'],
  aeolian:['min','dim','maj','min','min','maj','maj'],
  harmonicMinor:['min','dim','aug','min','maj','maj','dim']
};
var DIA7={
  ionian:['maj7','m7','m7','maj7','7','m7','m7b5'],
  dorian:['m7','m7','maj7','7','m7','m7b5','maj7'],
  phrygian:['m7','maj7','7','m7','m7b5','maj7','m7'],
  lydian:['maj7','7','m7','m7b5','maj7','m7','m7'],
  mixolydian:['7','m7','m7b5','maj7','m7','m7','maj7'],
  aeolian:['m7','m7b5','maj7','m7','m7','maj7','7'],
  harmonicMinor:['min','m7b5','aug','m7','7','maj7','dim7']
};
/* Funktionsharmonik: Zeile = aktuelle Stufe, Spalte = Folgestufe (I ii iii IV V vi vii) */
var FUNC=[
 [ 4,18, 8,20,22,16, 6],
 [ 6, 3, 4, 8,45, 6,14],
 [ 8, 8, 3,22,10,25, 4],
 [22,16, 5, 5,28,10, 8],
 [45, 6, 6, 8, 4,22, 3],
 [10,32, 6,18,10, 4, 6],
 [42, 4, 8, 6,14, 8, 4]
];
var TYPESUF={maj:'maj',min:'m','7':'7',maj7:'maj7',m7:'m7','6':'6',m6:'m6','9':'9',m9:'m9',maj9:'maj9',
 '13':'13',dim:'dim',dim7:'dim7',m7b5:'m7b5',aug:'aug','7#9':'7#9','7b9':'7b9',sus4:'sus4','7sus4':'7sus4',sus2:'sus2'};
var FLATKEYS={5:1,10:1,3:1,8:1,1:1,6:1};
var SHARPN=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
var FLATN =['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
var COF=[0,7,2,9,4,11,6,1,8,3,10,5];

function curKey(){var e=document.getElementById('keyPc');return e?parseInt(e.value,10):0;}
function curMode(){var e=document.getElementById('keyMode');return e?e.value:'ionian';}
function useFlats(){return !!FLATKEYS[curKey()];}
function pcName(pc){pc=((pc%12)+12)%12;return useFlats()?FLATN[pc]:SHARPN[pc];}
function chordToken(root,type,bars,defBars){
  var t=pcName(root)+(TYPESUF[type]||'7');
  if(bars&&defBars&&bars!==defBars)t+=':'+bars;
  return t;
}
function prettyLabel(c){
  var s=c.label.replace(/:\d+$/,'');
  if(c.type==='maj')s=s.replace(/maj$/,'');
  return s;
}
function degChord(keyPc,mode,deg,sevenths){
  var sc=MODES[mode]||MODES.ionian;
  return {root:(keyPc+sc[deg])%12, type:(sevenths?DIA7:DIA3)[mode][deg]};
}
/* Stufennotation folgt der Konvention: immer relativ zur Dur-Tonleiter des Grundtons.
   In a-Moll heißt C also bIII, nicht III – unabhängig vom eingestellten Modus. */
function degreeOf(rootPc,keyPc){
  var sc=MODES.ionian, iv=((rootPc-keyPc)%12+12)%12;
  var idx=sc.indexOf(iv);
  if(idx>=0)return {deg:idx,acc:''};
  if(iv===6)return {deg:3,acc:'#'};        // Tritonus konventionell als #IV, nicht bV
  var up=sc.indexOf((iv+1)%12);
  if(up>=0)return {deg:up,acc:'b'};
  var dn=sc.indexOf((iv+11)%12);
  if(dn>=0)return {deg:dn,acc:'#'};
  return {deg:0,acc:'?'};
}
var ROM=['I','II','III','IV','V','VI','VII'];
function romanOf(rootPc,type,keyPc,mode){
  var d=degreeOf(rootPc,keyPc), r=ROM[d.deg], suf='';
  if(type==='dim'){r=r.toLowerCase();suf='°';}
  else if(type==='dim7'){r=r.toLowerCase();suf='°7';}
  else if(type==='m7b5'){r=r.toLowerCase();suf='ø7';}
  else if(type==='aug')suf='+';
  else if(type==='min')r=r.toLowerCase();
  else if(type==='m7'||type==='m9'||type==='m6'){r=r.toLowerCase();suf=type==='m6'?'6':(type==='m9'?'9':'7');}
  else if(type==='maj7')suf='Δ';
  else if(type==='maj9')suf='Δ9';
  else if(type==='7')suf='7';
  else if(type==='9')suf='9';
  else if(type==='13')suf='13';
  else if(type==='7b9')suf='7♭9';
  else if(type==='7#9')suf='7♯9';
  else if(type==='6')suf='6';
  else if(type==='sus4')suf='sus4';
  else if(type==='sus2')suf='sus2';
  return d.acc+r+suf;
}
var DOMTYPES={'7':1,'9':1,'13':1,'7b9':1,'7#9':1};
function analyze(c,next,keyPc,mode){
  var rn=romanOf(c.root,c.type,keyPc,mode), sec=false;
  if(DOMTYPES[c.type]&&next&&next.root!==c.root){
    var resolvesTo=(c.root+5)%12;
    var diaV=(keyPc+(MODES[mode]||MODES.ionian)[4])%12;
    var dn=degreeOf(next.root,keyPc);
    var tgt=dn.acc+(isMinor(next.type)?ROM[dn.deg].toLowerCase():ROM[dn.deg]);
    if(next.root===resolvesTo&&c.root!==diaV){ rn='V7/'+tgt; sec=true; }
    else if(next.root===(c.root+11)%12&&c.root!==diaV){ rn='subV7/'+tgt; sec=true; }
  }
  return {rn:rn,secondary:sec};
}
/* Tonarterkennung: bewertet die tatsächlichen Akkordtöne gegen jede Skala,
   gewichtet nach Taktdauer, plus Funktionsboni und Häufigkeits-Prior je Modus. */
var MODEPRIOR={ionian:16,aeolian:14,dorian:8,mixolydian:8,harmonicMinor:3,lydian:2,phrygian:1};
function detectKey(){
  if(!gSeq.length)return;
  var best=null, modes=Object.keys(MODEPRIOR);
  for(var k=0;k<12;k++)for(var m=0;m<modes.length;m++){
    var mode=modes[m], sc=MODES[mode], score=MODEPRIOR[mode];
    for(var i=0;i<gSeq.length;i++){
      var c=gSeq[i], w=c.bars, iv=((c.root-k)%12+12)%12;
      var tones=ivOf(c.type);
      for(var t=0;t<tones.length;t++)
        score+=(sc.indexOf((iv+tones[t])%12)>=0?2:-3)*w;
      var di=sc.indexOf(iv);
      if(di>=0){
        score+=2*w;
        if(di===0)score+=4*w;
        if(di===4)score+=1.5*w;
        var exp7=DIA7[mode][di],exp3=DIA3[mode][di];
        if(c.type===exp7||c.type===exp3)score+=2*w;
      }else score-=2*w;
      if(i===0&&iv===0)score+=8;
      if(i===gSeq.length-1&&iv===0)score+=5;
    }
    if(!best||score>best.score)best={score:score,k:k,m:mode};
  }
  document.getElementById('keyPc').value=best.k;
  document.getElementById('keyMode').value=best.m;
  refreshHarmony();
  log('Tonart erkannt: '+pcName(best.k)+' '+best.m+' (Score '+Math.round(best.score)+')','m');
}

/* --- Progression schreiben / Undo -------------------------- */
var undoStack=[];
function pushUndo(){
  undoStack.push(document.getElementById('chordInput').value);
  if(undoStack.length>40)undoStack.shift();
}
function setProgression(tokens,note){
  pushUndo();
  document.getElementById('chordInput').value=tokens.join(' ');
  applySeq();
  if(note)log(note,'m');
}
function seqTokens(){
  var defBars=parseInt(document.getElementById('barsPerChord').value,10);
  return gSeq.map(function(c){return chordToken(c.root,c.type,c.bars,defBars);});
}
function seqCopy(){return gSeq.map(function(c){return {root:c.root,type:c.type,bars:c.bars};});}
function writeSeq(arr,note){
  var defBars=parseInt(document.getElementById('barsPerChord').value,10);
  setProgression(arr.map(function(c){return chordToken(c.root,c.type,c.bars,defBars);}),note);
}
/* Fügt `ins` vor Index i ein und nimmt dafür einen Takt vom Nachbarn – Gesamtlänge bleibt gleich */
function insertStealing(arr,i,ins){
  if(arr[i].bars>1){arr[i].bars--;}
  else if(i>0&&arr[i-1].bars>1){arr[i-1].bars--;}
  else return false;
  ins.bars=1; arr.splice(i,0,ins); return true;
}
/* Kein Platz zum Einfügen? Dann Progression auf doppelte Länge dehnen statt aufzugeben. */
function needRoom(a){
  for(var i=0;i<a.length;i++)if(a[i].bars>1)return false;
  for(var j=0;j<a.length;j++)a[j].bars*=2;
  return true;
}

/* --- Reharmonisierungen ------------------------------------ */
function rhTritone(){
  var a=seqCopy(),n=0;
  for(var i=0;i<a.length;i++){
    var nx=a[(i+1)%a.length];
    if(DOMTYPES[a[i].type]&&nx.root===(a[i].root+5)%12){a[i].root=(a[i].root+6)%12;a[i].type='7';n++;}
  }
  if(!n)for(var j=0;j<a.length;j++)if(DOMTYPES[a[j].type]){a[j].root=(a[j].root+6)%12;a[j].type='7';n++;break;}
  if(!n){log('Keine auflösende Dominante gefunden.','w');return;}
  writeSeq(a,'Tritonus-Substitution: '+n+' Akkord(e) ersetzt');
}
/* Läuft eine Einfüge-Operation; liefert wie viele Kandidaten es gab und wie viele
   tatsächlich Platz fanden. Erst wenn Kandidaten da sind, aber kein Platz, wird gedehnt. */
function runInsert(core,name,noneMsg){
  var r=core(seqCopy());
  var stretched=false;
  if(!r.n&&r.cand){ var a2=seqCopy(); if(needRoom(a2)){ r=core(a2); stretched=true; } }
  if(!r.n){log(noneMsg,'w');return;}
  writeSeq(r.arr,name+': '+r.n+'x'+(stretched?' · Progression auf doppelte Länge gedehnt':''));
}
function coreSecDom(a){
  var n=0,cand=0,limit=Math.max(1,Math.floor(a.length/4));
  for(var i=a.length-1;i>0;i--){
    if(DOMTYPES[a[i].type])continue;
    if(a[i-1].root===(a[i].root+7)%12)continue;
    cand++;
    if(insertStealing(a,i,{root:(a[i].root+7)%12,type:'7'}))n++;
    if(n>=limit)break;
  }
  return {arr:a,n:n,cand:cand};
}
function coreIIV(a){
  var n=0,cand=0;
  for(var i=a.length-1;i>=0;i--){
    if(!DOMTYPES[a[i].type])continue;
    if(i>0&&a[i-1].root===(a[i].root+7)%12&&isMinor(a[i-1].type))continue;
    cand++;
    if(insertStealing(a,i,{root:(a[i].root+7)%12,type:'m7'}))n++;
  }
  return {arr:a,n:n,cand:cand};
}
function corePass(a){
  var n=0,cand=0;
  for(var i=a.length-1;i>0;i--){
    var d=((a[i].root-a[i-1].root)%12+12)%12;
    if(d!==2&&d!==10)continue;
    cand++;
    var pr=(d===2)?(a[i-1].root+1)%12:(a[i-1].root+11)%12;
    if(insertStealing(a,i,{root:pr,type:'dim7'}))n++;
  }
  return {arr:a,n:n,cand:cand};
}
function rhSecDom(){runInsert(coreSecDom,'Sekundär-Dominanten','Alle Akkorde sind bereits Dominanten – nichts einzufügen.');}
function rhIIV(){runInsert(coreIIV,'ii-V eingefügt','Keine Dominante ohne vorangehendes ii gefunden.');}
function rhPass(){runInsert(corePass,'Durchgangs-Verminderte','Keine Ganzton-Schritte zwischen Akkorden gefunden.');}
function rhModal(){
  var a=seqCopy(),kp=curKey(),n=0;
  for(var i=0;i<a.length;i++){
    var iv=((a[i].root-kp)%12+12)%12;
    if(iv===5&&!isMinor(a[i].type)){a[i].type='m7';n++;}            // IV -> iv
    else if(iv===9&&isMinor(a[i].type)){a[i].root=(kp+8)%12;a[i].type='maj7';n++;} // vi -> bVI
    else if(iv===11){a[i].root=(kp+10)%12;a[i].type='7';n++;}        // vii -> bVII7
    else if(iv===2&&isMinor(a[i].type)&&n===0){a[i].type='m7b5';n++;} // ii -> iiø
  }
  if(!n){log('Nichts zum Borgen gefunden.','w');return;}
  writeSeq(a,'Modal Interchange: '+n+' Akkord(e) aus Moll geborgt');
}
var EXT_UP={maj:'maj7',maj7:'maj9',maj9:'maj9',min:'m7',m7:'m9',m9:'m9','6':'maj7',m6:'m9','7':'9','9':'13','13':'13',
  sus4:'7sus4','7sus4':'7sus4',sus2:'sus4',dim:'dim7',dim7:'dim7',m7b5:'m7b5',aug:'aug','7b9':'7b9','7#9':'7#9'};
var EXT_DN={maj9:'maj7',maj7:'maj',maj:'maj',m9:'m7',m7:'min',min:'min','13':'9','9':'7','7':'7','6':'maj',m6:'min',
  sus4:'sus4','7sus4':'sus4',sus2:'sus2',dim7:'dim',dim:'dim',m7b5:'m7b5',aug:'aug','7b9':'7','7#9':'7'};
function rhExt(up){
  var a=seqCopy(),map=up?EXT_UP:EXT_DN,n=0;
  for(var i=0;i<a.length;i++){var t=map[a[i].type];if(t&&t!==a[i].type){a[i].type=t;n++;}}
  if(!n){log('Extensions bereits am '+(up?'Maximum':'Minimum')+'.','w');return;}
  writeSeq(a,'Extensions '+(up?'+':'−')+': '+n+' Akkord(e)');
}
function rhUndo(){
  if(!undoStack.length){log('Nichts zum Rückgängigmachen.','w');return;}
  document.getElementById('chordInput').value=undoStack.pop();
  applySeq(); log('Undo','m');
}

/* --- Progression-Generator --------------------------------- */
function weightedPick(rnd,weights){
  var s=0,i; for(i=0;i<weights.length;i++)s+=weights[i];
  var r=rnd*s;
  for(i=0;i<weights.length;i++){r-=weights[i];if(r<=0)return i;}
  return weights.length-1;
}
function genProgression(){
  var kp=curKey(), mode=curMode(), bars=parseInt(document.getElementById('genBars').value,10);
  var genre=document.getElementById('genGenre').value;
  var out=[],i;
  if(genre==='blues'){
    bars=Math.max(12,Math.round(bars/12)*12);   // Blues nur in 12-Takt-Vielfachen
    var form=[0,3,0,0,3,3,0,0,4,3,0,4];
    for(i=0;i<bars;i++){
      var r=(kp+MODES.mixolydian[form[i%12]])%12;
      out.push({root:r,type:(i%12===8||i%12===11)?'9':'7',bars:1});
    }
  }else if(genre==='modal'){
    var per=bars>=16?4:2, cnt=Math.max(2,Math.round(bars/per));
    var pool=[0,6,3,4];
    for(i=0;i<cnt;i++){
      var d=(i===0)?0:pool[1+Math.floor(Math.random()*(pool.length-1))];
      var c=degChord(kp,mode,d,true);
      c.type=(c.type==='m7')?'m9':(c.type==='maj7'?'maj9':c.type);
      c.bars=per; out.push(c);
    }
  }else if(genre==='cinematic'){
    var seqD=[0,5,2,6,0,3,5,4];
    var per2=bars>=16?2:1, cnt2=Math.max(4,Math.round(bars/per2));
    for(i=0;i<cnt2;i++){
      var cc=degChord(kp,'aeolian',seqD[i%seqD.length],false);
      cc.bars=per2; out.push(cc);
    }
  }else{
    var sevenths=(genre==='jazz'||genre==='neosoul');
    var per3=(genre==='neosoul')?2:1;
    var cnt3=Math.max(2,Math.round(bars/per3));
    var deg=0;
    for(i=0;i<cnt3;i++){
      var c2=degChord(kp,mode,deg,sevenths);
      if(genre==='neosoul'){
        if(c2.type==='m7')c2.type='m9'; else if(c2.type==='maj7')c2.type='maj9'; else if(c2.type==='7')c2.type='13';
      }
      if(genre==='pop'&&Math.random()<0.12&&c2.type==='maj')c2.type='sus4';
      c2.bars=per3; out.push(c2);
      // nächste Stufe wählen; am Ende Richtung Kadenz lenken
      var w=FUNC[deg].slice();
      var left=cnt3-i-1;
      if(left===2){w=[0,0,0,6,60,0,4];}          // vorletzte: Richtung V
      else if(left===1){w=[60,0,0,8,0,10,0];}    // letzte: Richtung I
      deg=weightedPick(Math.random(),w);
    }
    if(genre==='jazz'){
      // ii-V-Ketten verdichten: vor jedem V ein ii, wenn Platz
      for(var j=out.length-1;j>0;j--){
        if(!DOMTYPES[out[j].type])continue;
        if(out[j-1].root===(out[j].root+7)%12)continue;
        if(Math.random()<0.45&&out[j-1].bars>1){out[j-1].bars--;out.splice(j,0,{root:(out[j].root+7)%12,type:'m7',bars:1});}
      }
    }
  }
  // auf Ziel-Taktzahl trimmen
  var tot=0; for(i=0;i<out.length;i++)tot+=out[i].bars;
  while(tot>bars&&out.length){var last=out[out.length-1];if(last.bars>1){last.bars--;tot--;}else{out.pop();tot--;}}
  if(tot<bars&&out.length)out[out.length-1].bars+=bars-tot;
  document.getElementById('barsPerChord').value='1';
  writeSeq(out,'Generiert: '+genre+' in '+pcName(kp)+' '+mode+' · '+bars+' Takte');
}

/* --- Harmonie-UI ------------------------------------------- */
function buildCircle(){
  var box=document.getElementById('cof'); if(!box)return;
  var S=286,C=S/2,NS='http://www.w3.org/2000/svg';
  var svg=document.createElementNS(NS,'svg');
  svg.setAttribute('width',S);svg.setAttribute('height',S);svg.setAttribute('viewBox','0 0 '+S+' '+S);
  var kp=curKey(),mode=curMode(),sc=MODES[mode]||MODES.ionian;
  var dia={},diaMin={};
  for(var d=0;d<7;d++){
    var ch=degChord(kp,mode,d,true);
    if(isMinor(ch.type))diaMin[ch.root]=d; else dia[ch.root]=d;
  }
  function node(pc,r,rad,minor,idx){
    var ang=(idx*30-90)*Math.PI/180;
    var x=C+Math.cos(ang)*r, y=C+Math.sin(ang)*r;
    var g=document.createElementNS(NS,'g'); g.setAttribute('class','cofnode');
    var isT=(pc===kp)&&((minor&&(mode==='aeolian'||mode==='dorian'||mode==='phrygian'||mode==='harmonicMinor'))||(!minor&&!(mode==='aeolian'||mode==='dorian'||mode==='phrygian'||mode==='harmonicMinor')));
    var inKey=minor?(diaMin[pc]!==undefined):(dia[pc]!==undefined);
    var c=document.createElementNS(NS,'circle');
    c.setAttribute('cx',x);c.setAttribute('cy',y);c.setAttribute('r',rad);
    c.setAttribute('fill',isT?'#00d4ff':(inKey?'#1a4a8a':'#0f1e3a'));
    c.setAttribute('stroke',isT?'#00d4ff':(inKey?'#2a6ac0':'#22284a'));
    c.setAttribute('stroke-width',isT?3:1.5);
    if(isT)c.setAttribute('filter','url(#glow)');
    var t=document.createElementNS(NS,'text');
    t.setAttribute('x',x);t.setAttribute('y',y+4);t.setAttribute('text-anchor','middle');
    t.setAttribute('font-size',minor?10:12);t.setAttribute('font-family','Segoe UI,Arial');
    t.setAttribute('font-weight',isT?'bold':'normal');
    t.setAttribute('fill',isT?'#06121f':(inKey?'#dfe6ff':'#54607f'));
    var nm=(useFlats()?FLATN:SHARPN)[pc];
    t.textContent=minor?nm.toLowerCase()+'m':nm;
    g.appendChild(c);g.appendChild(t);
    g.onclick=function(){
      document.getElementById('keyPc').value=pc;
      document.getElementById('keyMode').value=minor?'aeolian':'ionian';
      refreshHarmony();
    };
    return g;
  }
  var defs=document.createElementNS(NS,'defs');
  defs.innerHTML='<filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
  svg.appendChild(defs);
  var ring=document.createElementNS(NS,'circle');
  ring.setAttribute('cx',C);ring.setAttribute('cy',C);ring.setAttribute('r',108);
  ring.setAttribute('fill','none');ring.setAttribute('stroke','#182448');ring.setAttribute('stroke-width',1);
  svg.appendChild(ring);
  for(var i=0;i<12;i++){
    svg.appendChild(node(COF[i],120,19,false,i));
    svg.appendChild(node((COF[i]+9)%12,78,16,true,i));
  }
  box.innerHTML=''; box.appendChild(svg);
}
function buildDegRow(){
  var row=document.getElementById('degRow'); if(!row)return;
  var kp=curKey(),mode=curMode();
  var sev=document.getElementById('sevTgl').classList.contains('on');
  row.innerHTML='';
  for(var d=0;d<7;d++){
    (function(dd){
      var c=degChord(kp,mode,dd,sev);
      var b=document.createElement('div');
      b.className='deg';
      b.innerHTML='<b>'+romanOf(c.root,c.type,kp,mode)+'</b>'+pcName(c.root)+(c.type==='maj'?'':TYPESUF[c.type]);
      b.onclick=function(){appendChord(c.root,c.type);};
      row.appendChild(b);
    })(d);
  }
  var dl=document.getElementById('diaList');
  if(dl){
    var h='';
    for(var e=0;e<7;e++){
      var cc=degChord(kp,mode,e,sev);
      h+='<span class="kchip'+(e===0?' t':'')+'">'+romanOf(cc.root,cc.type,kp,mode)+' · '+pcName(cc.root)+(cc.type==='maj'?'':TYPESUF[cc.type])+'</span>';
    }
    dl.innerHTML=h;
  }
}
function appendChord(root,type){
  var defBars=parseInt(document.getElementById('barsPerChord').value,10);
  pushUndo();
  var inp=document.getElementById('chordInput');
  inp.value=(inp.value.trim()+' '+chordToken(root,type,defBars,defBars)).trim();
  applySeq();
}
function buildSuggestions(){
  var row=document.getElementById('sugRow'); if(!row)return;
  row.innerHTML='';
  if(!gSeq.length){row.innerHTML='<span class="mini">Progression eingeben…</span>';return;}
  var kp=curKey(),mode=curMode(),sev=document.getElementById('sevTgl').classList.contains('on');
  var last=gSeq[gSeq.length-1];
  var d=degreeOf(last.root,kp);
  var sc0=MODES[mode]||MODES.ionian;
  var mDeg=sc0.indexOf(((last.root-kp)%12+12)%12);
  var w=(mDeg>=0)?FUNC[mDeg].slice():[30,18,8,20,26,16,6];
  var tot=0,i; for(i=0;i<7;i++)tot+=w[i];
  var items=[];
  for(i=0;i<7;i++){
    var c=degChord(kp,mode,i,sev);
    items.push({root:c.root,type:c.type,p:w[i]/tot,alt:false});
  }
  items.sort(function(a,b){return b.p-a.p;});
  items=items.slice(0,5);
  // chromatische Optionen
  var target=items[0];
  items.push({root:(target.root+7)%12,type:'7',p:0,alt:true,tag:'V7/'+ROM[degreeOf(target.root,kp,mode).deg]});
  items.push({root:(target.root+1)%12,type:'7',p:0,alt:true,tag:'subV7'});
  items.push({root:(kp+10)%12,type:'7',p:0,alt:true,tag:'♭VII7'});
  for(i=0;i<items.length;i++){
    (function(it){
      var b=document.createElement('div');
      b.className='sug'+(it.alt?' alt':'');
      b.innerHTML='<div class="sr">'+(it.tag||romanOf(it.root,it.type,kp,mode))+'</div>'+
                  '<div class="sc">'+pcName(it.root)+(it.type==='maj'?'':TYPESUF[it.type])+'</div>'+
                  '<div class="sp">'+(it.alt?'chromatisch':Math.round(it.p*100)+'%')+'</div>';
      b.onclick=function(){appendChord(it.root,it.type);};
      row.appendChild(b);
    })(items[i]);
  }
}
function refreshHarmony(){ buildCircle(); buildDegRow(); buildSuggestions(); buildCDisp(); }

/* ============================================================
   3 · VOICING / SCALE HELPER
   ============================================================ */
function scaleNote(rootMidi,scale,idx){
  var L=scale.length, oct=Math.floor(idx/L), i=((idx%L)+L)%L;
  return rootMidi+scale[i]+12*oct;
}
function dedupe(a){var s={},o=[];for(var i=0;i<a.length;i++){if(!s[a[i]]){s[a[i]]=1;o.push(a[i]);}}return o.sort(function(x,y){return x-y;});}
function scaleStep(sc,idx){var L=sc.length;return sc[((idx%L)+L)%L]+12*Math.floor(idx/L);}

/* Voicings werden ausschließlich aus den tatsächlichen Akkordtönen gebaut.
   Kein Ton wird erfunden – ein Dreiklang bekommt niemals eine Septime untergeschoben.
   Spannungstöne (9, 13) kommen nur dazu, wenn der Akkord überhaupt vierstimmig ist. */
function buildVoicing(rootMidi,type,mode,cplx,rng){
  var iv=ivOf(type).slice();
  var four=iv.length>3;
  var has7=four&&type!=='6'&&type!=='m6';          // 6-Akkorde: Sexte statt Septime
  var add9=has7&&cplx>55, add13=has7&&DOMTYPES[type]&&cplx>80;
  var notes;
  if(mode==='rootless'&&has7){
    notes=[iv[1],iv[3]];                            // Terz + Septime = der Kern
    notes.push(add9?14:iv[2]+12);                   // 9 oder Quinte oben drauf
    if(cplx>70)notes.push(add13?21:iv[1]+12);
  }else if(mode==='shell'&&four){
    notes=[0,iv[3],iv[1]+12];
  }else if(mode==='quartal'&&(has7&&!(type==='maj7'||type==='maj9'))){
    var sc=scaleOf(type); notes=[];
    for(var q=0;q<4;q++)notes.push(scaleStep(sc,q*3));
  }else if(mode==='spread'){
    notes=[0,iv[2],iv[1]+12];
    // Nur Dur-/Moll-Dreiklänge bekommen bei hoher Complexity eine add9-Farbe obendrauf
    if(four)notes.push(iv[3]+12); else if(cplx>60&&(type==='maj'||type==='min'))notes.push(26);
  }else if(mode==='drop2'&&iv.length>=3){
    notes=iv.slice(0,4); notes[notes.length-2]-=12;
  }else{
    notes=iv.slice(0,4);
    if(add9)notes.push(14);
  }
  var out=[];
  for(var i=0;i<notes.length;i++)out.push(rootMidi+notes[i]);
  return resolveClashes(dedupe(out),type);
}
/* Kleine None zwischen benachbarten Stimmen ist der klassische Härte-Erzeuger –
   raus damit, außer sie ist beim alterierten Dominantakkord gewollt. */
function resolveClashes(notes,type){
  if(type==='7b9'||type==='7#9')return notes;
  var out=[notes[0]];
  for(var i=1;i<notes.length;i++){
    var d=notes[i]-out[out.length-1];
    if(d===13||(d===1&&notes[i]<72))continue;
    out.push(notes[i]);
  }
  return out;
}
/* Verschiebt das komplette Voicing oktavweise, statt jeden Ton einzeln zu falten –
   die Struktur des Akkords bleibt dabei erhalten. */
function placeVoicing(notes,lo){
  if(!notes.length)return notes;
  var shift=0, base=notes[0];
  while(base+shift<lo)shift+=12;
  while(base+shift>=lo+12)shift-=12;
  var out=[];
  for(var i=0;i<notes.length;i++){var n=notes[i]+shift;if(n>=12&&n<=108)out.push(n);}
  return out;
}
function nearestChordTone(m,rootMidi,type){
  var iv=ivOf(type),best=m,bd=999;
  for(var o=-2;o<=2;o++)for(var i=0;i<iv.length;i++){
    var c=rootMidi+iv[i]+12*o,d=Math.abs(c-m);
    if(d<bd){bd=d;best=c;}
  }
  return best;
}

/* ============================================================
   4 · GENERATOREN (tick-basiert, deterministisch)
   ============================================================ */
function ctxNow(){
  return {
    energy:parseInt(document.getElementById('energy').value,10),
    cplx:parseInt(document.getElementById('cplx').value,10)
  };
}
function rngFor(lane,salt,barIdx){
  var bv=(barIdx>=0&&barIdx<barVar.length)?(barVar[barIdx]||0):0;
  return mulberry32(hash32(lane.seed,Math.imul(salt,2654435761),bv));
}

function genBass(lane,bars,ctx){
  var ev=[],en=ctx.energy/100,cx=ctx.cplx/100,dn=lane.dens/100;
  for(var bi=0;bi<bars.length;bi++){
    var b=bars[bi], nb=bars[(bi+1)%bars.length], rng=rngFor(lane,bi,bi);
    var base=12*(lane.oct+1)+b.root, nextBase=12*(lane.oct+1)+nb.root;
    var t0=bi*BAR, sc=scaleOf(b.type), th=thirdOf(b.type), f5=fifthOf(b.type), s7=seventhOf(b.type);
    var M6=sc[5];                       // Sexte aus der Akkordskala, nicht pauschal die große Sexte
    var V=lane.vel;
    function n(t,m,v,d){ if(m<12||m>108||t>=BAR)return; ev.push({t:t0+t,m:m,v:clamp(Math.round(v),25,127),d:Math.max(30,Math.round(d))}); }
    var st=lane.style;
    /* Taktart-eigene Figuren zuerst; alles andere faellt in die 4/4-Kette,
       deren Ereignisse ueber den Guard in n() am Taktende abgeschnitten
       werden (die Auswahl zeigt ohnehin nur Taugliches, siehe METER_ALLOW). */
    var mhandled=true;
    if(METER.id==='3/4'){
      if(st==='waltz'){ n(0,base,V,Q*1.7); if(chance(rng,0.6))n(2*Q,base+f5,V-14,Q*0.85); }
      else if(st==='waltzRun'){ n(0,base,V,Q*0.92); n(Q,base+(chance(rng,0.5)?th:f5),V-8,Q*0.9);
        var ap3=chance(rng,0.6)?nextBase-1:nextBase+2; n(2*Q,ap3,V-10,Q*0.9); }
      else if(st==='walking'){ n(0,base,V,Q*0.9); n(Q,base+(chance(rng,0.5)?th:f5),V-8,Q*0.88);
        var ap=chance(rng,0.5)?nextBase-1:nextBase+1; n(2*Q,ap,V-9,Q*0.88);
        if(cx>0.55&&chance(rng,0.4))n(2*Q+E8,ap+(ap<nextBase?1:-1),V-18,E8*0.8); }
      else if(st==='country'){ n(0,base,V,Q*0.9); n(Q,base+f5-12,V-9,Q*0.9); n(2*Q,base+f5-12,V-11,Q*0.88); }
      else mhandled=false;
    }else if(METER.id==='6/8'){
      if(st==='ballad68'){ n(0,base,V,720*0.95); n(720,base+(chance(rng,0.5)?f5:th),V-8,720*0.9); }
      else if(st==='blues68'){ n(0,base,V,720*0.9); n(720,base+f5,V-8,480*0.9);
        if(chance(rng,dn+0.3))n(1200,base+M6,V-14,240*0.85); }
      else if(st==='jig'){ var run=[0,f5,12,0,f5,12];
        for(var j8=0;j8<6;j8++){ if(j8%3&&rng()>dn+0.35)continue; n(j8*240,base+run[j8],V-(j8%3?10:0),240*0.85); } }
      else if(st==='walking'){ n(0,base,V,720*0.9); n(720,base+(chance(rng,0.5)?f5:th),V-8,480*0.9);
        var ap6=chance(rng,0.6)?nextBase-1:nextBase+1; n(1200,ap6,V-12,240*0.85); }
      else mhandled=false;
    }else mhandled=false;
    if(!mhandled)
    if(st==='walking'){
      var appr = chance(rng,0.5)? nextBase-1 : nextBase+1;
      if(cx<0.3)appr=base+f5;
      var b2 = chance(rng,0.5)? base+th : base+f5;
      var b3 = chance(rng,0.6)? base+f5 : base+s7;
      n(0,base,V,Q*0.88); n(Q,b2,V-8,Q*0.88); n(2*Q,b3,V-4,Q*0.88); n(3*Q,appr,V-10,Q*0.88);
      if(cx>0.55&&chance(rng,0.45))n(3*Q+E8,appr+(appr<nextBase?1:-1),V-18,E8*0.8);
      if(en>0.75&&chance(rng,0.3))n(Q+E8,base+scaleNote(0,sc,4),V-20,E8*0.7);
    }else if(st==='boogie'){
      var deg=[0,f5,M6,s7,12,s7,M6,f5];
      for(var i=0;i<8;i++){ if(i%2===1&&rng()>dn+0.25)continue; n(i*E8,base+deg[i],V-(i%2?10:0),E8*0.86); }
    }else if(st==='shuffle'){
      var tks=[0,2*T8,Q,Q+2*T8,2*Q,2*Q+2*T8,3*Q,3*Q+2*T8];
      var dg=[0,f5,0,M6,0,f5,0,s7];
      for(var i2=0;i2<8;i2++){ if(i2%2===1&&rng()>dn+0.3)continue; n(tks[i2],base+dg[i2],V-(i2%2?9:0),T8*0.85); }
    }else if(st==='rootFive'){
      for(var i3=0;i3<8;i3++)n(i3*E8,base+((i3%2)?f5:0),V-(i3%2?8:0),E8*0.85);
    }else if(st==='octaves'){
      for(var i4=0;i4<8;i4++)n(i4*E8,base+(i4%2?12:0),V-(i4%2?7:0),E8*0.84);
    }else if(st==='tresillo'){
      var tr=[0,360,720,960,1320,1680], dg2=[0,f5,0,0,M6,f5];
      for(var i5=0;i5<6;i5++){ if(i5>2&&rng()>dn+0.3)continue; n(tr[i5],base+dg2[i5],V-(i5%2?11:0),S16*2.4); }
    }else if(st==='tenths'){
      n(0,base-12,V,Q*1.6); n(E8,base+th,V-12,Q*1.2);
      n(2*Q,base-12,V-3,Q*1.6); n(2*Q+E8,base+f5,V-14,Q*1.2);
    }else if(st==='halfNotes'){
      n(0,base,V,2*Q*0.95); n(2*Q,base+f5,V-6,2*Q*0.95);
    }else if(st==='pedal'){
      var stp=(en>0.7)?S16:E8, cnt=BAR/stp;
      for(var i6=0;i6<cnt;i6++){ if(i6>0&&rng()>dn+0.35)continue; n(i6*stp,base,V-(i6%2?12:0),stp*0.8); }
    }else if(st==='bebopWalk'){
      var tgt=nextBase, ap=chance(rng,0.6)?tgt-1:tgt+1;
      n(0,base,V,Q*0.9);
      n(Q,base+(chance(rng,0.5)?th:f5),V-8,Q*0.9);
      n(2*Q,base+(chance(rng,0.5)?s7:M6),V-5,Q*0.86);
      n(3*Q,ap,V-9,E8*0.9);
      n(3*Q+E8,ap+(ap<tgt?1:-1),V-14,E8*0.85);
      if(chance(rng,0.35))n(2*Q+E8,base+scaleNote(0,sc,3),V-20,E8*0.6);
    }else if(st==='twoFeel'){
      n(0,base,V,2*Q*0.9); n(2*Q,base+f5,V-6,Q*1.6);
      if(chance(rng,0.5))n(3*Q+E8,nextBase-1,V-16,E8*0.8);
    }else if(st==='arp8'){
      var seqA=[0,th,f5,s7,12,s7,f5,th];
      for(var a1=0;a1<8;a1++){ if(a1%2===1&&rng()>dn+0.3)continue; n(a1*E8,base+seqA[a1],V-(a1%2?9:0),E8*0.88); }
    }else if(st==='country'){
      n(0,base,V,Q*0.9); n(Q,base+f5-12,V-8,Q*0.9); n(2*Q,base,V-3,Q*0.9);
      var wu=(nextBase>base)?nextBase-2:nextBase+2;
      n(3*Q,chance(rng,0.6)?wu:base+f5-12,V-8,Q*0.9);
    }else if(st==='drivingE8'){
      for(var d1=0;d1<8;d1++)n(d1*E8,base+((d1===5&&cx>0.5)?f5:0),V-(d1%2?6:0),E8*0.9);
    }else if(st==='metal16'){
      for(var m1=0;m1<16;m1++){
        if(m1%4!==0&&rng()>dn+0.45)continue;
        n(m1*S16,base+((m1===14&&cx>0.4)?s7-12:0),V-(m1%4?10:0),S16*0.88);
      }
    }else if(st==='gallop'){
      for(var g1=0;g1<4;g1++){
        n(g1*Q,base,V,E8*0.85);
        n(g1*Q+E8,base,V-12,S16*0.8);
        n(g1*Q+E8+S16,base+((g1===3&&cx>0.5)?f5:0),V-10,S16*0.8);
      }
    }else if(st==='motown'){
      var mt=[0,3,6,8,11,14], mg=[0,f5,12,th,f5,(chance(rng,0.5)?s7:M6)];
      for(var i9=0;i9<mt.length;i9++){
        if(i9>0&&rng()>dn+0.32)continue;
        n(mt[i9]*S16,base+mg[i9],V-(i9?9:0),S16*(i9%2?1.6:2.4));
      }
    }else if(st==='funkSlap'){
      n(0,base,V+4,S16*0.9);
      n(S16,base,25,S16*0.5);                       // Ghost
      if(chance(rng,dn+0.2))n(3*S16,base+12,V-6,S16*0.8);
      n(6*S16,base+12,V-2,S16*0.9);
      if(chance(rng,dn))n(8*S16,base+s7,V-12,S16*0.8);
      n(10*S16,base,V-4,S16*1.5);
      if(chance(rng,dn+0.15))n(13*S16,base+f5,V-10,S16*0.8);
      if(chance(rng,0.5))n(15*S16,nextBase-1,V-14,S16*0.8);
    }else if(st==='neoSoul'){
      n(0,base,V,Q*0.8);
      if(chance(rng,dn+0.2))n(3*S16,base+s7-12,V-18,S16*1.2);
      n(6*S16,base+f5,V-8,S16*2.2);
      if(chance(rng,dn))n(10*S16,base+th,V-12,S16*1.6);
      n(12*S16,base,V-6,S16*2.4);
      if(chance(rng,0.4))n(15*S16,nextBase-2,V-16,S16*0.9);
    }else if(st==='discoOct'){
      for(var o1=0;o1<8;o1++)n(o1*E8,base+(o1%2?12:0),V-(o1%2?8:0),E8*0.82);
      if(en>0.6&&chance(rng,0.5))n(7*E8+S16,base+12,V-16,S16*0.8);
    }else if(st==='clave'){
      var cl=[0,3,8,12,14], cg=[0,f5,0,th,f5];      // Son-Clave 3-2
      for(var c1=0;c1<cl.length;c1++)n(cl[c1]*S16,base+cg[c1],V-(c1%2?8:0),S16*2);
    }else if(st==='bossa'){
      n(0,base,V,Q*1.2); n(Q+E8,base+f5-12,V-8,Q*0.9);
      n(2*Q,base,V-3,Q*1.1); n(3*Q+E8,base+f5-12,V-9,Q*0.8);
    }else if(st==='samba'){
      n(0,base,V-14,E8*0.9); n(Q,base,V,Q*0.85);
      n(2*Q,base+f5-12,V-12,E8*0.9); n(3*Q-S16,base,V-16,S16*0.9); n(3*Q,base,V-2,Q*0.85);
    }else if(st==='tumbao'){
      n(Q+E8,base+f5-12,V,Q*0.85);
      n(3*Q,base,V-2,Q*0.9);
      if(chance(rng,dn))n(2*Q+E8,base+s7-12,V-16,E8*0.7);
    }else if(st==='reggae'){
      n(E8,base,V,Q*0.8); n(2*Q,base+f5-12,V-8,E8*0.8); n(3*Q,base+th,V-6,Q*0.9);
    }else if(st==='dub'){
      n(0,base-12,V,Q*1.9);
      if(chance(rng,dn+0.2))n(2*Q+E8,base+f5-24,V-10,Q*1.2);
    }else if(st==='houseOff'){
      for(var h1=0;h1<4;h1++)n(h1*Q+E8,base+((h1===3&&cx>0.5)?f5:0),V-(h1?4:0),E8*0.8);
    }else if(st==='synth16'){
      for(var s1=0;s1<16;s1++){
        if(s1%2===1&&rng()>dn+0.15)continue;
        var jump=(s1%8===6)?12:((s1%8===7&&cx>0.5)?f5:0);
        n(s1*S16,base+jump,V-(s1%2?11:0),S16*0.85);
      }
    }else if(st==='trapSlide'){
      n(0,base-12,V,Q*2.4);
      if(chance(rng,dn+0.2))n(6*S16,base-12+(cx>0.5?th:0),V-8,Q*1.2);
      if(chance(rng,0.45))n(12*S16,base-12+f5,V-12,Q*0.9);
    }else{ /* sub */
      n(0,base-12,V,BAR*0.96);
    }
  }
  return ev;
}

function genChords(lane,bars,ctx){
  var ev=[],en=ctx.energy/100,cx=ctx.cplx,dn=lane.dens/100;
  for(var bi=0;bi<bars.length;bi++){
    var b=bars[bi], rng=rngFor(lane,bi+7777,bi);
    var base=12*(lane.oct+1)+b.root, t0=bi*BAR, V=lane.vel, st=lane.style;
    var mode = st==='quartal'?'quartal' : (st==='compSwing'?'rootless' : (st==='pad'||st==='gospel128')?'spread' : (cx>65?'drop2':'close'));
    var vo=placeVoicing(buildVoicing(base,b.type,mode,cx,rng),12*(lane.oct+1)-3);
    function hit(t,vel,dur,voi){
      if(t>=BAR)return;
      var vv=voi||vo;
      for(var i=0;i<vv.length;i++){ if(vv[i]<12||vv[i]>108)continue;
        ev.push({t:t0+t,m:vv[i],v:clamp(Math.round(vel-i*2.5),25,127),d:Math.max(40,Math.round(dur))}); }
    }
    /* Taktart-eigene Comping-Figuren zuerst (siehe METER_ALLOW). */
    var chandled=true;
    if(METER.id==='3/4'){
      if(st==='waltzComp'){ if(chance(rng,0.35))hit(0,V-14,E8*0.7); hit(Q,V,E8*0.85); hit(2*Q,V-6,E8*0.8); }
      else if(st==='jazzWaltzComp'){ hit(0,V-6,Q*0.9); hit(Q+E8,V-2,E8*0.7);
        if(cx>55&&chance(rng,0.4))hit(2*Q+E8,V-12,E8*0.6); }
      else chandled=false;
    }else if(METER.id==='6/8'){
      if(st==='comp68'){ hit(0,V,720*0.9); hit(720,V-6,720*0.85);
        if(cx>55&&chance(rng,0.45))hit(1200,V-14,240*0.8); }
      else if(st==='swell68'){ hit(0,V-8,BAR*0.97); }
      else chandled=false;
    }else chandled=false;
    if(chandled){}
    else if(st==='pad'){ hit(0,V-6,BAR*0.97); }
    else if(st==='stabs'){ hit(E8+Q,V,E8*0.55); hit(3*Q+E8,V-4,E8*0.55); if(en>0.7&&chance(rng,0.5))hit(Q*2,V-12,E8*0.5); }
    else if(st==='charleston'){ hit(0,V,E8*0.7); hit(Q+E8,V-3,Q*0.9); }
    else if(st==='compSwing'){
      var slots=[E8,Q+E8,2*Q+E8,3*Q+E8,Q,3*Q], hits=Math.max(1,Math.round(1+dn*3));
      var used={};
      for(var h=0;h<hits;h++){ var s=slots[Math.floor(rng()*slots.length)]; if(used[s])continue; used[s]=1;
        hit(s,V-Math.round(rng()*10),chance(rng,0.4)?Q*0.9:E8*0.7); }
    }
    else if(st==='blockBeats'){ for(var i=0;i<4;i++){ if(i>0&&rng()>dn+0.35)continue; hit(i*Q,V-(i%2?6:0),Q*0.85); } }
    else if(st==='gospel128'){ hit(0,V,Q*1.2); hit(4*T8,V-6,Q*1.2); hit(8*T8,V-3,Q*1.2); if(cx>60)hit(11*T8,V-14,T8*0.8); }
    else if(st==='tremolo'){
      var alt=vo.slice(); alt.push(alt.shift()+12);
      for(var i7=0;i7<BAR/S16;i7++){ if(rng()>dn+0.4)continue; hit(i7*S16,V-(i7%2?10:0),S16*0.85,(i7%2)?alt:vo); }
    }
    else if(st==='push'){ hit(0,V,Q*1.7); hit(2*Q-E8,V-4,Q*1.9); }
    else if(st==='funk16'){
      var fk=[S16,3*S16,6*S16,9*S16,11*S16,14*S16];
      for(var i8=0;i8<fk.length;i8++){ if(rng()>dn+0.3)continue; hit(fk[i8],V-Math.round(rng()*14),S16*0.7); }
    }
    else if(st==='shells'){
      var sh=[base,base+thirdOf(b.type),base+seventhOf(b.type)];
      if(isMinor(b.type)&&b.type!=='dim')sh[2]=base+10;
      hit(0,V,Q*1.8,sh); hit(2*Q,V-6,Q*1.8,[sh[0]+12,sh[1],sh[2]]);
    }
    else if(st==='bigBand'){
      var bh=[[0,Q*0.6],[Q+E8,E8*0.5],[2*Q+E8,E8*0.5],[3*Q,Q*0.7]];
      for(var bg=0;bg<bh.length;bg++){ if(bg>0&&rng()>dn+0.35)continue; hit(bh[bg][0],V+(bg===0?4:-4),bh[bg][1]); }
      if(cx>55&&chance(rng,0.4))hit(3*Q+E8,V-8,E8*0.5);
    }
    else if(st==='pop4'){ hit(0,V-4,2*Q*0.97); hit(2*Q,V-8,2*Q*0.97); }
    else if(st==='rockPower'){
      for(var rp=0;rp<8;rp++){ if(rp%2===1&&rng()>dn+0.2)continue; hit(rp*E8,V-(rp%2?9:0),E8*0.9); }
    }
    else if(st==='strum'){
      var pat=[1,0,1,1,0,1,1,0,1,0,1,1,0,1,1,0], sp=9;
      for(var sg=0;sg<16;sg++){
        if(sg*S16>=BAR)break;
        if(!pat[sg])continue;
        if(sg%4!==0&&rng()>dn+0.25)continue;
        var down=(sg%4===0||sg%4===2), vv=V-(down?0:12)-Math.round(rng()*6);
        for(var q=0;q<vo.length;q++){
          var idx=down?q:(vo.length-1-q), m2=vo[idx];
          if(m2<12||m2>108)continue;
          ev.push({t:t0+sg*S16+q*sp,m:m2,v:clamp(Math.round(vv-q*2),25,127),d:Math.max(60,Math.round(S16*2.2))});
        }
      }
    }
    else if(st==='broken'){
      var bo=[0,2,1,2,0,2,1,2];
      for(var br=0;br<8;br++){
        if(br*E8>=BAR)break;
        if(br%2===1&&rng()>dn+0.25)continue;
        var mm=vo[bo[br]%vo.length];
        if(br===0&&vo.length)mm=vo[0];
        if(mm<12||mm>108)continue;
        ev.push({t:t0+br*E8,m:mm,v:clamp(Math.round(V-(br%2?10:0)),25,127),d:Math.max(60,Math.round(E8*0.9))});
      }
      if(vo[0]-12>=12)hit(0,V-14,Q*1.8,[vo[0]-12]);
    }
    else if(st==='neoSoulComp'){
      var ns=[0,3,6,10,13];
      for(var nn=0;nn<ns.length;nn++){ if(nn>0&&rng()>dn+0.25)continue; hit(ns[nn]*S16,V-Math.round(rng()*16),S16*(2.2+rng()*2)); }
    }
    else if(st==='discoStab'){
      var ds=[2,6,10,14];
      for(var dz=0;dz<ds.length;dz++){ if(rng()>dn+0.35)continue; hit(ds[dz]*S16,V,S16*0.6); }
      if(chance(rng,0.5))hit(0,V-10,S16*0.6);
    }
    else if(st==='bossaComp'){
      var bc=[[0,Q*0.7],[3*S16,S16*2.4],[6*S16,S16*2.2],[10*S16,S16*2.4],[14*S16,S16*1.8]];
      for(var bq=0;bq<bc.length;bq++){ if(bq>0&&rng()>dn+0.4)continue; hit(bc[bq][0],V-(bq?6:0),bc[bq][1]); }
    }
    else if(st==='montuno'){
      var mo=[0,1,2,2,1,0,1,2], mv=vo.slice();
      if(mv.length<3)mv=mv.concat(mv);
      for(var mn=0;mn<8;mn++){
        if(mn*E8>=BAR)break;
        if(mn%2===1&&rng()>dn+0.3)continue;
        var mm2=mv[mo[mn]%mv.length]+((mn>3)?12:0);
        if(mm2<12||mm2>108)continue;
        ev.push({t:t0+mn*E8,m:mm2,v:clamp(Math.round(V-(mn%2?8:0)),25,127),d:Math.max(50,Math.round(E8*0.7))});
      }
    }
    else if(st==='reggaeSkank'){
      for(var rk=0;rk<4;rk++){ if(rk>0&&rng()>dn+0.4)continue; hit(rk*Q+E8,V-(rk%2?5:0),E8*0.45); }
    }
    else if(st==='skaUp'){
      for(var sk=0;sk<8;sk++){ if(rng()>dn+0.35)continue; hit(sk*E8+S16,V-(sk%2?8:0),S16*0.5); }
    }
    else if(st==='housePluck'){
      for(var hp=0;hp<4;hp++)hit(hp*Q+E8,V-(hp%2?6:0),E8*0.55);
      if(cx>60&&chance(rng,0.5))hit(3*Q+3*S16,V-14,S16*0.5);
    }
    else if(st==='synthPulse'){
      for(var sp2=0;sp2<8;sp2++)hit(sp2*E8,V-(sp2%2?10:0)-Math.round(rng()*5),E8*0.78);
    }
    else if(st==='trance16'){
      var tg=[1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1];
      for(var tr2=0;tr2<16;tr2++){ if(!tg[tr2])continue; if(rng()>dn+0.4)continue; hit(tr2*S16,V-(tr2%4?10:0),S16*0.8); }
    }
    else if(st==='cine'){
      hit(0,V-16,BAR*0.99);
      var low=[vo[0]-12]; if(low[0]>=12)hit(0,V-4,BAR*0.99,low);
      if(en>0.6)hit(2*Q,V-2,2*Q*0.98);
    }
    else { /* quartal */ hit(0,V-4,Q*1.9); hit(2*Q+E8,V-8,Q*1.5); }
  }
  return ev;
}

function genArp(lane,bars,ctx){
  var ev=[],cx=ctx.cplx,dn=lane.dens/100;
  var step=RATES[lane.rate?lane.rate:'E8'][0];
  var gate=(lane.gate||70)/100;
  for(var bi=0;bi<bars.length;bi++){
    var b=bars[bi], rng=rngFor(lane,bi+31313,bi);
    var base=12*(lane.oct+1)+b.root, t0=bi*BAR, V=lane.vel;
    var iv=ivOf(b.type).slice(); if(cx>60&&iv.length===4&&b.type!=='6'&&b.type!=='m6')iv.push(14);
    var pool=[];
    for(var o=0;o<(lane.arpOct||2);o++)for(var i=0;i<iv.length;i++)pool.push(base+iv[i]+12*o);
    pool=dedupe(pool);
    var order=[];
    var st=lane.style, P=pool.length;
    if(st==='up')order=pool.slice();
    else if(st==='down')order=pool.slice().reverse();
    else if(st==='updown'){order=pool.slice().concat(pool.slice(1,P-1).reverse());}
    else if(st==='downup'){var r=pool.slice().reverse();order=r.concat(r.slice(1,r.length-1).reverse());}
    else if(st==='upDown2'){order=pool.slice().concat(pool.slice().reverse());}
    else if(st==='thumb'){for(var k=1;k<P;k++){order.push(pool[0]);order.push(pool[k]);}}
    else if(st==='thumbUpDown'){
      for(var k2=1;k2<P;k2++){order.push(pool[0]);order.push(pool[k2]);}
      for(var k3=P-2;k3>0;k3--){order.push(pool[0]);order.push(pool[k3]);}
    }
    else if(st==='pinkyUp'){for(var k4=0;k4<P-1;k4++){order.push(pool[k4]);order.push(pool[P-1]);}}
    else if(st==='converge'){var lo=0,hi=P-1;while(lo<=hi){order.push(pool[lo++]);if(lo<=hi)order.push(pool[hi--]);}}
    else if(st==='diverge'){
      var mid=Math.floor((P-1)/2), l2=mid, h2=mid+1;
      while(l2>=0||h2<P){ if(l2>=0)order.push(pool[l2--]); if(h2<P)order.push(pool[h2++]); }
    }
    else if(st==='staircase'){
      for(var s2=0;s2<P;s2++){ order.push(pool[s2%P]); order.push(pool[(s2+1)%P]); order.push(pool[(s2+2)%P]); order.push(pool[(s2+1)%P]); }
    }
    else if(st==='skip3'){for(var s3=0;s3<P*2;s3++)order.push(pool[(s3*2)%P]);}
    else if(st==='pairs'){for(var s4=0;s4<P;s4++){order.push(pool[s4]);order.push(pool[(s4+1)%P]);}}
    else if(st==='broken3'){for(var s5=0;s5<P;s5++){order.push(pool[s5]);order.push(pool[(s5+2)%P]);}}
    else if(st==='cascade'){
      for(var s6=P-1;s6>=0;s6--){order.push(pool[s6]);order.push(pool[Math.min(P-1,s6+2)]);order.push(pool[Math.max(0,s6-1)]);}
    }
    else if(st==='pedalAlt'){for(var s7=1;s7<P;s7++){order.push(pool[0]);order.push(pool[s7]);order.push(pool[0]);order.push(pool[P-s7]);}}
    else if(st==='trance'){for(var s8=0;s8<P;s8++){order.push(pool[s8]);order.push(pool[0]);}}
    else order=pool.slice();
    if(!order.length)continue;
    var stepEff=step, mask=null, accEvery=0;
    if(st==='poly3'){stepEff=Math.round(step*1.5);}
    else if(st==='gate16'){stepEff=S16;mask=[1,0,1,1,1,0,1,1,1,0,1,1,1,1,0,1];accEvery=4;}
    else if(st==='trance'){stepEff=S16;accEvery=4;}
    if(stepEff<40)stepEff=40;
    var cnt=Math.floor(BAR/stepEff);
    for(var s=0;s<cnt;s++){
      if(mask&&!mask[s%mask.length])continue;
      var gap=(st==='randomGap')?0.55:(dn+0.35);
      if(rng()>gap)continue;
      var m=(st==='random'||st==='randomGap')?pool[Math.floor(rng()*P)]:order[s%order.length];
      if(m<12||m>108)continue;
      var acc=(accEvery&&s%accEvery===0)?9:0;
      ev.push({t:t0+s*stepEff,m:m,v:clamp(Math.round(V+acc-(s%2?7:0)-Math.round(rng()*6)),25,127),d:Math.max(30,Math.round(stepEff*gate))});
    }
  }
  return ev;
}

/* --- Melodie: Motiv-Engine mit Entwicklung ------------------ */
var RCELLS=[
 [[0,E8],[E8,E8],[Q,Q],[2*Q,2*Q]],
 [[Q,E8],[Q+E8,E8],[2*Q,Q],[3*Q,Q]],
 [[0,T8],[T8,T8],[2*T8,T8],[Q,Q],[2*Q,E8],[2*Q+E8,Q+E8]],
 [[0,Q],[Q,E8],[Q+E8,E8],[2*Q,2*Q]],
 [[E8,S16],[E8+S16,S16],[Q,E8],[Q+E8,E8],[2*Q,Q],[3*Q,Q]],
 [[0,2*Q],[2*Q,Q],[3*Q,Q]],
 [[Q+E8,E8],[2*Q,E8],[2*Q+E8,E8],[3*Q,Q]],
 [[0,T8],[T8,T8],[2*T8,T8],[Q,T8],[Q+T8,T8],[Q+2*T8,T8],[2*Q,2*Q]],
 [[0,E8],[E8,S16],[E8+S16,S16],[Q,Q],[2*Q,E8],[3*Q,Q]]
];
var CONTOURS=[[0,1,2,1],[0,2,1,0],[0,-1,-2,-1],[0,1,-1,0],[0,3,2,0],[0,1,2,3],[0,-1,1,2],[0,2,4,2],[0,-2,-1,1]];

/* Eigenständige Melodie-Modelle: alles, was nicht auf der Motiv-Engine aufsetzt. */
var MEL_SPECIAL={guideTones:1,chordTones:1,ambient:1,hymn:1,edmLead:1,riff:1,funkStabs:1,latin:1,popHook:1};
function genMelodySpecial(lane,bars,ctx){
  var ev=[],en=ctx.energy/100,cx=ctx.cplx/100,dn=lane.dens/100,st=lane.style,V=lane.vel;
  var last=12*(lane.oct+1)+bars[0].root;
  function near(m){ while(m-last>11)m-=12; while(last-m>11)m+=12; return m; }
  function push(t,m,v,d){ if(m<24||m>105)return; ev.push({t:t,m:m,v:clamp(Math.round(v),25,127),d:Math.max(50,Math.round(d))}); last=m; }
  /* Riff / EDM-Lead / Pop-Hook: eine feste Figur, die über alle Akkorde läuft */
  var fig=null;
  if(st==='riff'||st==='edmLead'||st==='popHook'){
    var fr=rngFor(lane,777,-1);
    var grids={riff:[0,3,6,8,11,14],edmLead:[0,2,4,6,8,10,12,14],popHook:[0,2,3,6,8,10,11,14]};
    var gsel=grids[st], steps=[], degs=[], cur=0;
    for(var f=0;f<gsel.length;f++){
      if(f>0&&fr()>0.72)continue;
      steps.push(gsel[f]);
      cur=cur+Math.round((fr()-0.45)*4);
      cur=clamp(cur,-4,7);
      degs.push(cur);
    }
    if(!steps.length){steps=[0,4,8,12];degs=[0,2,1,0];}
    fig={steps:steps,degs:degs};
  }
  for(var bi=0;bi<bars.length;bi++){
    var b=bars[bi], nb=bars[(bi+1)%bars.length], rng=rngFor(lane,bi+44444,bi);
    var t0=bi*BAR, base=12*(lane.oct+1)+b.root, sc=scaleOf(b.type), iv=ivOf(b.type);
    var th=thirdOf(b.type), s7=seventhOf(b.type), f5=fifthOf(b.type);
    if(st==='guideTones'){
      var g1=near(base+th), g2=near(base+s7);
      if(bi%2===0){ push(t0,g1,V,2*Q*0.94); push(t0+2*Q,g2,V-8,2*Q*0.9); }
      else{ push(t0,g2,V-4,2*Q*0.9); push(t0+2*Q,g1,V-6,2*Q*0.94); }
      if(cx>0.6&&chance(rng,0.35))push(t0+3*Q+E8,near(12*(lane.oct+1)+nb.root+thirdOf(nb.type))-1,V-20,E8*0.7);
    }else if(st==='chordTones'){
      var pool2=[]; for(var p2=0;p2<iv.length;p2++)pool2.push(base+iv[p2]);
      if(cx>0.5)pool2.push(base+12);
      var upB=(bi%2===0);
      for(var c3=0;c3<8;c3++){
        if(rng()>dn+0.3)continue;
        var idx=upB?c3:(7-c3);
        push(t0+c3*E8,near(pool2[idx%pool2.length]),V-(c3%2?9:0),E8*0.85);
      }
    }else if(st==='ambient'){
      if(bi%2===0){
        var tone=[0,f5,scaleNote(0,sc,4)][Math.floor(rng()*3)];
        push(t0,near(base+12+tone),V-14,BAR*1.85);
      }else if(chance(rng,0.35)){
        push(t0+2*Q,near(base+12+th),V-24,2*Q*0.9);
      }
    }else if(st==='hymn'){
      var hd=[0,1,2,1];
      for(var h3=0;h3<4;h3++){
        if(h3>0&&rng()>dn+0.45)continue;
        var mh=nearestChordTone(near(scaleNote(base,sc,hd[h3]+(bi%2?1:0))),base,b.type);
        push(t0+h3*Q,mh,V-(h3%2?8:0),Q*0.92);
      }
    }else if(st==='funkStabs'){
      var fs=[0,3,6,10,14];
      for(var f2=0;f2<fs.length;f2++){
        if(rng()>dn+0.25)continue;
        var mf=near(base+[0,s7,12,f5,th][f2%5]);
        push(t0+fs[f2]*S16,mf,V-Math.round(rng()*12),S16*0.65);
      }
    }else if(st==='latin'){
      var lt=[0,3,6,8,11,14], ld=[0,2,4,2,1,0];
      for(var l3=0;l3<lt.length;l3++){
        if(l3>0&&rng()>dn+0.3)continue;
        push(t0+lt[l3]*S16,near(scaleNote(base,sc,ld[l3])),V-(l3%2?10:0),S16*1.8);
      }
    }else{ /* riff / edmLead / popHook */
      for(var q2=0;q2<fig.steps.length;q2++){
        if(q2>0&&rng()>dn+0.4)continue;
        var mq=scaleNote(base,sc,fig.degs[q2]);
        if(fig.steps[q2]%Q===0)mq=nearestChordTone(mq,base,b.type);
        var dur=(q2<fig.steps.length-1)?(fig.steps[q2+1]-fig.steps[q2])*S16:2*S16;
        push(t0+fig.steps[q2]*S16,near(mq),V-(fig.steps[q2]%Q?9:0)-Math.round(rng()*6),dur*0.85);
      }
    }
  }
  return ev;
}

function genMelody(lane,bars,ctx){
  var ev=[],en=ctx.energy/100,cx=ctx.cplx/100,dn=lane.dens/100;
  var st=lane.style;
  if(MEL_SPECIAL[st])return genMelodySpecial(lane,bars,ctx);
  var restP = clamp(0.55-dn*0.5-en*0.2,0.02,0.5);
  var lastPitch=12*(lane.oct+1)+bars[0].root;
  var phrases=Math.ceil(bars.length/4);
  for(var p=0;p<phrases;p++){
    var pr=rngFor(lane,p*4+55555,p*4);
    var cell=pick(pr,RCELLS), cont=pick(pr,CONTOURS);
    var altCell=pick(pr,RCELLS);
    for(var bb=0;bb<4;bb++){
      var bi=p*4+bb; if(bi>=bars.length)break;
      var b=bars[bi], rng=rngFor(lane,bi+55555,bi);
      var t0=bi*BAR, base=12*(lane.oct+1)+b.root, sc=scaleOf(b.type), V=lane.vel;
      var role=bb%4;
      var rc = (role===0)?cell : (role===1)?cell : (role===2)?altCell : cell;
      if(st==='ballad')rc=RCELLS[5];
      if(st==='bebop')rc=RCELLS[7];
      if(st==='call')rc=(bb%2===0)?RCELLS[2]:RCELLS[6];
      if(en>0.8&&role===3&&chance(rng,0.5))rc=RCELLS[4];
      var cn=cont.slice();
      if(role===1)cn=cn.map(function(x){return x+ (chance(rng,0.6)?1:-1);});
      if(role===2)cn=cn.map(function(x){return -x;});          // Inversion
      if(role===3)cn=cn.slice().reverse();                      // Krebs
      var startDeg=0;
      if(role===3)startDeg=chance(rng,0.6)?0:2;
      if(st==='sequence')startDeg+=((bb%4)*(p%2?-1:1));      // Motiv wandert stufenweise
      var chromP = (st==='bebop')?0.45:(st==='blues'?0.25:cx*0.3);
      var pool=sc;
      if(st==='pentatonic')pool=isMinor(b.type)?[0,3,5,7,10]:[0,2,4,7,9];
      if(st==='country')pool=isMinor(b.type)?[0,3,5,7,10]:[0,2,4,7,9];
      if(st==='sequence')pool=sc;
      if(st==='blues')pool=isMinor(b.type)?[0,3,5,6,7,10]:[0,3,4,5,6,7,9,10];
      var notes=[];
      for(var i=0;i<rc.length;i++){
        if(chance(rng,restP)&&i>0&&role!==3)continue;
        var deg=startDeg+cn[i%cn.length]+(i>=cn.length?Math.round((rng()-0.5)*3):0);
        var m=scaleNote(base,pool,deg);
        while(m-lastPitch>13)m-=12;
        while(lastPitch-m>13)m+=12;
        var onBeat=(rc[i][0]%Q===0);
        // Betonte Zählzeiten tragen die Harmonie: dort immer ein Akkordton.
        if(onBeat)m=nearestChordTone(m,base,b.type);
        if(role===3&&i===rc.length-1)m=nearestChordTone(lastPitch,base,b.type);
        if(m<24||m>105)continue;
        lastPitch=m;
        var vel=V-Math.round(rng()*12)+(onBeat?6:0);
        var dur=rc[i][1]*(0.72+rng()*0.24);
        if(role===3&&i===rc.length-1)dur=rc[i][1]*1.6;
        notes.push({t:t0+rc[i][0],m:m,v:clamp(Math.round(vel),25,127),
                    d:Math.max(50,Math.round(dur)),beat:onBeat,len:rc[i][1]});
      }
      // Chromatik nur als echte Approach-Note: kurz, unbetont, löst per Halbton zur Folgenote auf.
      for(var c2=0;c2<notes.length-1;c2++){
        if(notes[c2].beat||notes[c2].len>E8)continue;
        if(!chance(rng,chromP))continue;
        var nxt=notes[c2+1].m, cand=nxt+(notes[c2].m<nxt?-1:1);
        if(Math.abs(cand-notes[c2].m)<=2&&cand>=24&&cand<=105)notes[c2].m=cand;
      }
      for(var e2=0;e2<notes.length;e2++)ev.push(notes[e2]);
    }
  }
  return ev;
}

/* --- Drums: Maskengrid + Fills ------------------------------ */
var taFill=true;
function genDrums(lane,bars,ctx){
  var ev=[],en=ctx.energy/100,dn=lane.dens/100,V=lane.vel;
  var P0=DRUMPAT[lane.style]||DRUMPAT.rock8;
  var P=drumPatFor(P0)||drumPatFor(DRUMPAT[meterDefaultStyle('drums')])||P0;
  var grid=P.grid||16, step=BAR/grid, maxLen=0;
  for(var r0=0;r0<P.rows.length;r0++)if(P.rows[r0][1].length>maxLen)maxLen=P.rows[r0][1].length;
  var patBars=Math.max(1,Math.round(maxLen/grid));
  var fillEvery=lane.fill||0;
  for(var bi=0;bi<bars.length;bi++){
    var rng=rngFor(lane,bi+90210,bi), t0=bi*BAR, off=(bi%patBars)*grid;
    var fillFromStep=(METER.id==='3/4')?Math.round(grid*2/3):Math.round(grid/2);
    var isFill=fillEvery>0&&bars.length>1&&((bi+1)%fillEvery===0);
    /* Turnaround-Fill: der letzte Takt der Form wird immer markiert, sonst
       klingt Takt 12 wie Takt 4 und die Form verschwimmt beim Üben. */
    if(taFill&&bars.length>1&&bi===bars.length-1)isFill=true;
    var groupStart=(bi%(fillEvery>0?fillEvery:4)===0);
    for(var r=0;r<P.rows.length;r++){
      var note=P.rows[r][0], mask=P.rows[r][1];
      var essential=(note===DK.kick||note===DK.kick2||note===DK.snare||note===DK.snare2||note===DK.rim||note===DK.clap);
      for(var s=0;s<grid;s++){
        var c=mask.charAt((off+s)%mask.length);
        if(c!=='x'&&c!=='X'&&c!=='o')continue;
        if(isFill&&s>=fillFromStep&&note!==DK.kick&&note!==DK.kick2)continue; // Fill-Zone gehoert dem Fill
        if(!essential||c==='o'){ if(rng()>dn+0.3)continue; }
        var vel=(V+(c==='X'?14:(c==='o'?-42:0))-Math.round(rng()*7))*(0.82+en*0.28);
        ev.push({t:t0+s*step,m:note,v:clamp(Math.round(vel),18,127),d:Math.max(30,Math.round(step*0.8))});
      }
    }
    if(groupStart&&en>0.45)
      ev.push({t:t0,m:DK.crash,v:clamp(Math.round(V*0.92),30,127),d:Q});
    if(en>0.8&&!isFill&&METER.id==='4/4'&&chance(rng,0.35))
      ev.push({t:t0+(10+Math.floor(rng()*5))*S16,m:DK.kick,v:clamp(Math.round(V*0.78),25,127),d:S16});
    if(isFill){
      var FL=(METER.id==='3/4')?DRUMFILLS34:(METER.id==='6/8')?DRUMFILLS68:DRUMFILLS;
      var F=FL[Math.floor(rng()*FL.length)];
      var fillT0=(METER.id==='6/8')?720:2*Q;
      for(var fi=0;fi<F.length;fi++){
        var fn=F[fi][0], fm=F[fi][1];
        for(var fs=0;fs<fm.length;fs++){
          var fc=fm.charAt(fs);
          if(fc!=='x'&&fc!=='X'&&fc!=='o')continue;
          if(fc==='o'&&rng()>dn)continue;
          var fv=V+(fc==='X'?12:(fc==='o'?-38:-2))-Math.round(rng()*6);
          ev.push({t:t0+fillT0+fs*S16,m:fn,v:clamp(Math.round(fv),20,127),d:Math.round(S16*0.85)});
        }
      }
    }
  }
  return ev;
}

var GEN={drums:genDrums,bass:genBass,chords:genChords,arp:genArp,melody:genMelody};

/* ============================================================
   4b · GROOVE-ENGINE  (Swing pro Lane, Velocity-Streuung, Backbeat,
        Chorus-Dynamik)  – alles wird IN den Take gebacken, damit
        Wiedergabe und SMF-Export identisch klingen.
   ============================================================ */

/* Die Rhythmusgruppe darf nicht auseinanderlaufen: solange die Kopplung an ist,
   ziehen DRUMS, BASS und CHORDS zwingend denselben Swing-Wert. */
var grooveLock=true;
var GROOVE_GROUP={drums:1,bass:1,chords:1};
function globalSwing(){ var e=document.getElementById('swing'); return e?parseInt(e.value,10):0; }
function laneSwing(L){
  if(grooveLock&&GROOVE_GROUP[L.id])return globalSwing();
  return (L.swing===undefined||L.swing<0)?globalSwing():L.swing;
}
/* 100 % = volles Triolen-Feel (Offbeat sitzt auf der dritten Triole).
   Blues-Shuffle liegt bei 62-68, Slow Blues 12/8 bei 95-100. */
function applySwing(ev,amt){
  if(amt<=0)return ev;
  /* Swing-Einheit aus der Taktart: 4/4 und 3/4 swingen das Viertel,
     6/8 die punktierte Viertel (die Zaehlzeit). */
  var U=METER.swingUnit, Uh=U/2, Uq=U/4;
  var shift=Math.round((amt/100)*(Uh/3));
  if(shift<=0)return ev;
  for(var i=0;i<ev.length;i++){
    var r=((ev[i].t%U)+U)%U;
    if(r===Uh){ ev[i].t+=shift; ev[i].d=Math.max(30,Math.round(ev[i].d-shift*0.4)); }
    else if(r===Uq){ ev[i].t+=Math.round(shift*0.5); ev[i].d=Math.max(30,Math.round(ev[i].d-shift*0.25)); }
    else if(r===3*Uq){ ev[i].t+=Math.round(shift*(amt>60?0.85:0.5)); ev[i].d=Math.max(30,Math.round(ev[i].d-shift*0.25)); }
  }
  /* Die Note VOR dem verschobenen Offbeat darf nicht in ihn hineinlaufen. */
  ev.sort(function(a,b){return a.t-b.t;});
  for(var k=0;k<ev.length-1;k++){
    for(var j=k+1;j<ev.length;j++){
      if(ev[j].t>=ev[k].t+ev[k].d)break;
      if(ev[j].m===ev[k].m)ev[k].d=Math.max(30,ev[j].t-ev[k].t-8);
    }
  }
  return ev;
}

/* Velocity-Streuung: deterministisch aus dem Lane-Seed, damit ein Reroll
   reproduzierbar bleibt und der Export dasselbe liefert wie die Wiedergabe. */
function applyVelSpread(ev,L){
  var amt=L.vspread|0; if(amt<=0)return ev;
  var rng=mulberry32(hash32(L.seed,0x5EED1E,amt));
  for(var i=0;i<ev.length;i++)
    ev[i].v=clamp(ev[i].v+Math.round((rng()*2-1)*amt),12,127);
  return ev;
}

/* Betonung auf 2 und 4. Bei DRUMS bekommt sie die Snare, alles andere nur
   einen Bruchteil – ein gleichmäßig lauter Backbeat auf allen Lanes klingt
   nach Drumcomputer, nicht nach Band. */
var BACKBEAT_DRUMS={};
BACKBEAT_DRUMS[38]=1; BACKBEAT_DRUMS[40]=1; BACKBEAT_DRUMS[37]=1; BACKBEAT_DRUMS[39]=1;
function applyBackbeat(ev,L){
  var el=document.getElementById('bbeat'); if(!el)return ev;
  var amt=parseInt(el.value,10)||0; if(amt<=0)return ev;
  /* Der Akzent wird nicht nur draufgerechnet, sondern der Rest gleichzeitig
     leicht zurückgenommen. Sonst läuft die Snare in die 127er-Wand und der
     Backbeat verschwindet genau dann, wenn man ihn am deutlichsten will. */
  var up=amt*0.6, dn=amt*0.4, tol=S16*0.7;
  for(var i=0;i<ev.length;i++){
    var r=((ev[i].t%BAR)+BAR)%BAR;
    var on24=false;
    for(var b9=0;b9<METER.backbeats.length;b9++)if(Math.abs(r-METER.backbeats[b9])<=tol){on24=true;break;}
    if(on24){
      var k=(L.id==='drums')?(BACKBEAT_DRUMS[ev[i].m]?1:0.22):0.55;
      ev[i].v=clamp(Math.round(ev[i].v+up*k),12,127);
    }else{
      ev[i].v=clamp(Math.round(ev[i].v-dn*0.8),12,127);
    }
  }
  return ev;
}

/* Chorus-Dynamik: über CHORUS.len Durchläufe baut sich der Track auf und
   fällt danach wieder zurück. Ab der Hälfte des Bogens wandern die Hi-Hats
   auf das Ride, im Spitzen-Chorus kommt die Glocke dazu. */
var CHORUS={on:false,len:4,ride:2,cc:11,amp:10,build:true};
var gStageOverride=null;
function chorusStage(){
  if(!CHORUS.on)return 0;
  var n=Math.max(1,CHORUS.len);
  var s=(gStageOverride!==null)?gStageOverride:(sched.loop||0);
  return ((s%n)+n)%n;
}
function chorusF(st){ return CHORUS.len>1?st/(CHORUS.len-1):0; }
/* Arrangement-Bogen: der Chorus wird nicht nur lauter, sondern erst duenner
   und dann dichter. Ohne das hoert ein Zuhoerer den Wechsel schlicht nicht —
   eine reine Velocity-Rampe faellt im Bandkontext durch. Vier Stufen,
   unabhaengig davon ueber wie viele Durchlaeufe der Bogen gespannt ist:
     0  Grundgeruest  – Kick/Snare, Hi-Hat nur auf den Vierteln, Bass auf 1 und 3,
                        ein Akkord pro Takt. Klingt bewusst nach Intro.
     1  Achtel        – Hi-Hat durchgehend, Bass auf allen Vierteln, Akkorde 1 und 3
     2  volle Band    – alles da, Crash und offene Hi-Hat kommen dazu
     3  Spitze        – zusaetzlich Ride/Glocke aus der Chorus-Dynamik            */
var ARR_ESS={35:1,36:1,37:1,38:1,39:1,40:1};
function arrLevel(st){
  var n=Math.max(1,CHORUS.len);
  return Math.min(3,Math.floor(st*4/n));
}
function applyArrangement(ev,L,st){
  if(!CHORUS.on||!CHORUS.build)return ev;
  var lv=arrLevel(st);
  if(lv>=2&&L.id!=='drums')return ev;
  if(lv>=3)return ev;
  var out=[];
  for(var i=0;i<ev.length;i++){
    var e=ev[i], rb=((e.t%BAR)+BAR)%BAR;
    var onQ=(rb%METER.pulseTicks)===0, on13=(METER.arrOn.indexOf(rb)>=0), on1=(rb===0);
    var keep=true;
    if(L.id==='drums'){
      if(e.m===DK.crash||e.m===DK.crash2||e.m===DK.splash||e.m===DK.hhO)keep=(lv>=2);
      else if(e.m===DK.hhC||e.m===DK.ride||e.m===DK.bell)keep=(lv>=1)||onQ;
      else if(!ARR_ESS[e.m])keep=(lv>=2);
    }else if(L.id==='bass'){
      keep=(lv>=1)?onQ:on13;
    }else if(L.id==='chords'){
      keep=(lv>=1)?on13:on1;
    }else{
      keep=(lv>=1)||onQ;
    }
    if(keep)out.push(e);
  }
  return out;
}
function applyChorus(ev,L,st){
  if(!CHORUS.on)return ev;
  var f=chorusF(st), dv=Math.round(-CHORUS.amp*0.5+CHORUS.amp*1.5*f);
  var toRide=(st>=CHORUS.ride);
  for(var i=0;i<ev.length;i++){
    ev[i].v=clamp(ev[i].v+dv,12,127);
    if(L.id==='drums'&&toRide){
      if(ev[i].m===DK.hhC){
        /* Im Spitzen-Chorus nur die Viertel auf die Glocke – eine durchgehende
           Ride-Bell auf allen Achteln ist kein Drummer, das ist ein Wecker. */
        var pt=METER.pulseTicks, onQ=((((ev[i].t%pt)+pt)%pt)===0);
        ev[i].m=(f>0.85&&onQ)?DK.bell:DK.ride;
      }
      else if(ev[i].m===DK.hhO)ev[i].m=DK.crash2;
    }
  }
  return ev;
}
/* Expression-CC pro Chorus – bei einer Hammond legt man damit die Drawbars
   auf; die CC-Nummer ist frei wählbar, weil jedes Plugin anders mappt. */
function sendChorusCC(){
  if(!CHORUS.on||!midiOutput)return;
  var f=chorusF(chorusStage());
  var val=clamp(Math.round(64+58*f),0,127);
  for(var i=0;i<LANES.length;i++){
    var L=LANES[i]; if(!L.on||L.id==='drums')continue;
    sendAt([0xB0|L.ch,CHORUS.cc&127,val]);
  }
  var inf=document.getElementById('blChInfo');
  if(inf)inf.textContent='Chorus '+(chorusStage()+1)+'/'+CHORUS.len+' · CC'+CHORUS.cc+'='+val+
    (chorusStage()>=CHORUS.ride?' · Ride':' · Hi-Hat');
}

/* includeAll=true erzeugt auch ausgeschaltete Lanes. Der Scheduler nutzt das,
   damit sich Lanes im laufenden Betrieb ein- und ausschalten lassen. */
function buildTake(includeAll){
  var ctx=ctxNow(), st=chorusStage();
  var take={lanes:{},totalTicks:gBars.length*BAR};
  for(var i=0;i<LANES.length;i++){
    var L=LANES[i]; if(!L.on&&!includeAll)continue;
    var ev=GEN[L.id](L,gBars,ctx);
    applySwing(ev,laneSwing(L));
    applyVelSpread(ev,L);
    applyBackbeat(ev,L);
    ev=applyArrangement(ev,L,st);
    applyChorus(ev,L,st);
    ev.sort(function(a,b){return a.t-b.t;});
    take.lanes[L.id]=ev;
  }
  return take;
}

/* ============================================================
   5 · MUTATION / LOCK / REROLL
   ============================================================ */
function mutate(){
  var rate=parseInt(document.getElementById('mut').value,10)/100;
  var changed=0;
  for(var i=0;i<gBars.length;i++){
    if(barLock[i])continue;
    if(Math.random()<rate){barVar[i]=(barVar[i]+1+Math.floor(Math.random()*3))>>>0;changed++;}
  }
  for(var l=0;l<LANES.length;l++){
    var L=LANES[l];
    if(L.lock||!L.on)continue;
    if(Math.random()<rate*0.5)L.seed=(L.seed+1+Math.floor(Math.random()*97))>>>0;
  }
  return changed;
}
function reroll(laneId){
  var n=0;
  for(var i=0;i<LANES.length;i++){
    var L=LANES[i];
    if(laneId&&L.id!==laneId)continue;
    if(L.lock)continue;
    L.seed=(Math.random()*4294967295)>>>0; n++;
  }
  if(!laneId)for(var b=0;b<gBars.length;b++)if(!barLock[b])barVar[b]=(Math.random()*1000)>>>0;
  reloadFromCurrent();
  log('Reroll: '+(laneId?laneId:'alle nicht gesperrten Lanes')+' ('+n+')','m');
}

/* ============================================================
   6 · WEB MIDI
   ============================================================ */
var midiAccess=null,midiOutput=null;
function log(msg,cls){var l=document.getElementById('log');if(!l)return;msg=trLog(msg);
  l.innerHTML+='<span class="'+(cls||'i')+'">'+msg+'</span><br>';l.scrollTop=l.scrollHeight;}
function setStatus(s,m){document.getElementById('midiStatus').textContent=m;
  document.getElementById('midiDot').className='dot '+(s==='ok'?'g':s==='err'?'r':'y');}
function populateOutputs(){
  var sel=document.getElementById('midiOut'); sel.innerHTML='';
  if(!midiAccess){sel.innerHTML='<option>No MIDI</option>';return;}
  var outs=[]; midiAccess.outputs.forEach(function(o){outs.push(o);});
  if(!outs.length){sel.innerHTML='<option value="">Keine Outputs</option>';log('Keine MIDI-Outputs – IAC-Treiber aktivieren!','w');midiOutput=null;return;}
  for(var i=0;i<outs.length;i++){var op=document.createElement('option');op.value=outs[i].id;op.textContent=outs[i].name;sel.appendChild(op);}
  if(!midiOutput||!midiAccess.outputs.get(midiOutput.id))midiOutput=outs[0];
  sel.value=midiOutput.id;
  var sp=document.getElementById('syncPort');
  if(sp){
    var keep=sp.value, h='<option value="">= Haupt-Output</option>';
    for(var s2=0;s2<outs.length;s2++)h+='<option value="'+outs[s2].id+'">'+outs[s2].name+'</option>';
    sp.innerHTML=h;
    if(keep&&midiAccess.outputs.get(keep))sp.value=keep;
  }
  populateInputs();
  restoreSyncPorts();
  log('MIDI bereit: '+outs.map(function(o){return o.name;}).join(', '),'ok');
}
var gSysex=false;
function midiReady(a,sysex){
  midiAccess=a; gSysex=!!sysex;
  setStatus('ok','MIDI-Zugriff erteilt'+(sysex?' (inkl. SysEx/MMC)':' – ohne SysEx'));
  log('Web MIDI API bereit'+(sysex?' · SysEx frei → MMC möglich':' · ohne SysEx → MMC nicht möglich, MIDI Clock benutzen'),sysex?'ok':'w');
  populateOutputs();
  a.onstatechange=function(){populateOutputs();};
}
if(navigator.requestMIDIAccess){
  navigator.requestMIDIAccess({sysex:true}).then(function(a){midiReady(a,true);}).catch(function(){
    navigator.requestMIDIAccess({sysex:false}).then(function(a){midiReady(a,false);})
    .catch(function(e){setStatus('err','MIDI verweigert: '+e.message);log('MIDI-Fehler: '+e.message,'e');});
  });
}else{setStatus('err','Web MIDI nicht unterstützt');log('Chrome oder Edge verwenden','e');}

/* ============================================================
   7 · TRANSPORT (Timestamp-Scheduling)
   ============================================================ */
/* Lookahead-Scheduler: es wandern immer nur ~220 ms Musik in die MIDI-Queue.
   Dadurch greift STOP praktisch sofort, und Tempoänderungen wirken im laufenden Takt. */
var SCHED_TICK=20, LOOKAHEAD=220, LOOKAHEAD_FG=220, LOOKAHEAD_BG=600;
/* Tick-Quelle im Worker: Chrome drosselt setInterval in Hintergrund-Tabs auf
   >=1 s - genau dann, wenn die DAW den Fokus hat. Worker-Timer sind davon
   ausgenommen. Faellt die Worker-Erzeugung aus, greift setInterval als
   Rueckfallebene. */
var tickWorker=(function(){
  try{
    var s='var t=null;onmessage=function(e){clearInterval(t);t=null;if(e.data>0)t=setInterval(function(){postMessage(0);},e.data);};';
    return new Worker(URL.createObjectURL(new Blob([s],{type:'text/javascript'})));
  }catch(e){return null;}
})();
if(tickWorker)tickWorker.onmessage=function(){schedTick();};
try{window.__tickerMode=tickWorker?'worker':'interval';}catch(e){}
function startTicker(){
  if(tickWorker){tickWorker.postMessage(SCHED_TICK);return;}
  if(!startTicker.warned){startTicker.warned=1;log('Tick-Worker nicht verf\u00fcgbar \u2013 setInterval-R\u00fcckfall (Hintergrund-Tab kann ruckeln)','w');}
  sched.timer=setInterval(schedTick,SCHED_TICK);
}
function stopTicker(){
  if(tickWorker)tickWorker.postMessage(0);
  if(sched.timer){clearInterval(sched.timer);sched.timer=null;}
}
/* Im Hintergrund groesserer Vorlauf: dort bedient niemand Stop oder Tempo,
   aber die Queue uebersteht auch zaehe Momente des Hauptthreads. */
if(document.hidden)LOOKAHEAD=LOOKAHEAD_BG;
document.addEventListener('visibilitychange',function(){
  LOOKAHEAD=document.hidden?LOOKAHEAD_BG:LOOKAHEAD_FG;
});
var playing=false,stopReq=false,visTimers=[],usedCh={};
var sched={on:false,timer:null,ev:[],idx:0,tickRef:0,msRef:0,loop:0,loopMax:-1,loopTicks:0,active:[],clkTick:0};

function msPerTick(bpm){return (60000/bpm)/PPQ;}
/* Zentrale Sende-Schleuse: hier läuft JEDE Kanal-Nachricht durch (Noten, CC, Program
   Change, Panic). Kanalsperre und Monitor hängen genau hier – damit ist beweisbar,
   was das Programm wirklich rausschickt. */
var chGuard=false, monOn=false, monN=0;
var MSGN={128:'NoteOff',144:'NoteOn ',160:'PolyAT ',176:'CC     ',192:'PrgChg ',208:'ChanAT ',224:'PitchBd'};
function chAllowed(ch){
  if(!chGuard)return true;
  for(var i=0;i<LANES.length;i++)if(LANES[i].on&&LANES[i].ch===ch)return true;
  return false;
}
function monLine(ch,ty,b,blocked){
  if(!monOn)return;
  var el=document.getElementById('mlog'); if(!el)return;
  if(monN>300){el.innerHTML='';monN=0;}
  monN++;
  var d=(b.length>1?(' '+b[1]):'')+(b.length>2?(' v'+b[2]):'');
  el.innerHTML+='<span class="'+(blocked?'blk':'ok')+'">'+(blocked?'BLOCK ':'SEND  ')+
    'Ch'+(ch+1<10?' ':'')+(ch+1)+'  '+(MSGN[ty]||('0x'+ty.toString(16)))+d+'</span><br>';
  el.scrollTop=el.scrollHeight;
}
function bumpCh(ch){
  chCount[ch]++;
  var n=document.getElementById('chn'+ch); if(n)n.textContent=chCount[ch];
}
function sendAt(bytes,time){
  if(!midiOutput)return;
  var st=bytes[0];
  if(st<240){
    var ch=st&15, ty=st&240;
    if(!chAllowed(ch)){ monLine(ch,ty,bytes,true); return; }
    bumpCh(ch); monLine(ch,ty,bytes,false);
  }
  try{midiOutput.send(bytes,time);}catch(e){}
}

/* ------------------------------------------------------------
   7b · CUBASE SYNC – MIDI Clock (Tempo/Position) und MMC (Transport)
   Clock läuft im selben Tick-Raster wie der Sequencer: 24 Clocks pro Viertel,
   also alle PPQ/24 Ticks. Timestamps kommen aus der gleichen Rechnung wie die
   Noten, damit Tempoänderungen sofort und driftfrei bei Cubase ankommen.
   ------------------------------------------------------------ */
var CLKDIV=PPQ/24;
function gEl(id){return document.getElementById(id);}
function syncActive(){var e=gEl('syncTgl');return !!(e&&e.classList.contains('on'));}
function syncOut(){
  var s=gEl('syncPort');
  if(s&&s.value&&midiAccess){var o=midiAccess.outputs.get(s.value); if(o)return o;}
  return midiOutput;
}
function sendSync(bytes,time){
  var o=syncOut(); if(!o)return;
  try{ if(time===undefined)o.send(bytes); else o.send(bytes,time); }catch(e){}
}
/* ============================================================
   7c · MIDI-CLOCK-SLAVE
   Cubase kann sich nicht auf eingehende Clock synchronisieren, umgekehrt aber
   sehr wohl Clock ausgeben. Also dreht dieser Modus die Rollen um: die DAW hält
   die Zeit, der Generator hängt sich dran.

   Position kommt ausschließlich aus den eingehenden F8-Ticks (je PPQ/24 Ticks).
   Zwischen zwei Clocks wird linear interpoliert, damit der Lookahead-Scheduler
   unverändert weiterarbeiten kann. Das Tempo ergibt sich aus dem gleitenden
   Mittel der letzten 24 Clock-Abstände (= eine Viertel) – kurz genug für echte
   Tempoänderungen, lang genug gegen Jitter.
   ============================================================ */
var ext={on:false,input:null,running:false,hist:[],mpt:0,bpm:0,ticks:0,last:0,busy:false};
function extSlaving(){return ext.on&&!!ext.input;}
function curMpt(){
  if(extSlaving()&&ext.mpt>0)return ext.mpt;
  return msPerTick(parseInt(gEl('bpm').value,10));
}
function extInfo(msg,cls){
  var e=gEl('slaveInfo'); if(!e)return;
  e.innerHTML=msg; e.style.color=cls==='ok'?'#22cc88':cls==='w'?'#ffcc00':'#7b86a6';
}
function extStatus(){
  if(!ext.on){extInfo('Slave aus.');return;}
  if(!ext.input){extInfo('SLAVE an, aber kein Clock-Eingang gewählt.','w');return;}
  var stalled=ext.running&&ext.last&&(performance.now()-ext.last)>900;
  extInfo('SLAVE &larr; '+ext.input.name+' &middot; '+
          (stalled?'<b style="color:#ff4455">Clock abgerissen</b>':ext.running?'l&auml;uft':
             (playing?'<b style="color:#ffcc00">bereit &ndash; wartet auf DAW-Start</b>':'wartet auf Start'))+
          (ext.bpm?' &middot; '+ext.bpm.toFixed(1)+' BPM erkannt':' &middot; noch kein Clock-Signal')+
          ' &middot; '+ext.ticks+' Clocks','ok');
}
function extBpmDisplay(){
  if(!ext.bpm)return;
  var r=Math.round(ext.bpm), sl=gEl('bpm'), vd=gEl('bpmVal');
  if(sl&&parseInt(sl.value,10)!==r&&r>=20&&r<=400){ sl.value=String(r); if(vd)vd.textContent=String(r); }
}
function extAttach(){
  if(ext.input){try{ext.input.onmidimessage=null;}catch(e){}}
  ext.input=null; ext.running=false; ext.last=0; ext.hist=[]; ext.mpt=0; ext.bpm=0; ext.ticks=0;
  var sel=gEl('clkIn');
  if(!ext.on||!sel||!sel.value||!midiAccess){extStatus();return;}
  var i=midiAccess.inputs.get(sel.value);
  if(!i){extStatus();return;}
  ext.input=i;
  i.onmidimessage=extMessage;
  log('Clock-Slave h&ouml;rt auf '+i.name,'m');
  extStatus();
}
function extMessage(e){
  if(!ext.on)return;
  /* Bewusst performance.now() statt e.timeStamp: dessen Epoche ist je nach
     Chrome-Version nicht dieselbe wie die des Schedulers. Mischt man beide,
     driftet der Lookahead-Horizont um Größenordnungen ab – die Clock zählt
     dann sauber weiter, aber es geht keine einzige Note raus. Die Latenz des
     Handler-Aufrufs liegt unter einer Millisekunde und ist irrelevant, weil
     das Tempo ohnehin über 48 Clocks gemittelt wird. */
  var d=e.data, st=d[0], now=performance.now();
  if(st===0xF8)      extClock(now);
  else if(st===0xFA) extStart(0,now);
  else if(st===0xFB) extStart(-1,now);
  else if(st===0xFC) extStop();
  else if(st===0xF2) extSpp(((d[2]&127)<<7)|(d[1]&127));
}
function extClock(now){
  ext.ticks++; ext.last=now;
  /* Tempo aus der Gesamtspanne der letzten 96 Clocks, nicht aus Einzelabständen.
     Chrome liefert MIDI-Realtime-Bytes oft gebündelt: mehrere F8 im selben
     Eventloop-Durchlauf mit ~0 ms Abstand, danach eine große Lücke. Ein Mittel
     über Einzelabstände muss die Nullabstände wegfiltern und misst dann nur noch
     die Lücken – das Ergebnis war rund die Hälfte des echten Tempos. Über die
     Gesamtspanne geteilt durch die Anzahl stimmt es unabhängig von der Bündelung. */
  ext.hist.push(now);
  if(ext.hist.length>96)ext.hist.shift();
  if(ext.hist.length>=24){
    var span=ext.hist[ext.hist.length-1]-ext.hist[0], n=ext.hist.length-1;
    var perClock=span/n;
    if(perClock>0.3&&perClock<400){ ext.mpt=perClock/CLKDIV; ext.bpm=60000/(perClock*24); }
  }
  if(!ext.running||!sched.on)return;
  sched.tickRef+=CLKDIV;                      // Position kommt NUR aus der Clock
  sched.msRef=now;
  // Loop-Wechsel bleibt allein Sache von schedTick – sonst zieht ihn jeder von
  // beiden einmal ab und der Zeiger springt einen ganzen Durchlauf zu weit zurück.
}
function extStart(pos,now){
  ext.running=true;
  var t=(pos>=0)?pos:sched.tickRef;
  ext.busy=true;
  if(!playing){ gEl('btnPlay').click(); }
  ext.busy=false;
  sched.tickRef=t; sched.msRef=now||performance.now(); sched.idx=0;
  if(sched.loopTicks>0&&t>=sched.loopTicks)sched.tickRef=t%sched.loopTicks;
  while(sched.idx<sched.ev.length&&sched.ev[sched.idx].t<sched.tickRef)sched.idx++;
  log('Clock-Slave: '+(pos>=0?'START':'CONTINUE')+' von extern','p');
  extStatus();
}
function extStop(){
  ext.running=false;
  ext.busy=true;
  if(playing)stopTransport(false);
  ext.busy=false;
  log('Clock-Slave: STOP von extern','p');
  extStatus();
}
function extSpp(sixteenths){
  var t=sixteenths*S16;
  if(sched.loopTicks>0)t=t%sched.loopTicks;
  sched.tickRef=t; sched.msRef=performance.now(); sched.idx=0;
  while(sched.idx<sched.ev.length&&sched.ev[sched.idx].t<t)sched.idx++;
}
/* Das komplette DAW-Sync-Panel überlebt den Reload. MIDI-Ports werden über den
   NAMEN gespeichert, nicht über die ID: die ID vergibt der Browser pro Sitzung
   neu, der Name bleibt. Ist der Port beim nächsten Start nicht da, bleibt SLAVE
   aus und es steht eine Meldung im Log – lieber ehrlich stumm als heimlich am
   falschen Port hängen. */
var LS_SYNC='midiperfect4.sync.v2';
function optName(sel){
  if(!sel||!sel.value)return '';
  var o=sel.options[sel.selectedIndex];
  return o?o.textContent:'';
}
function saveSync(){
  try{
    localStorage.setItem(LS_SYNC,JSON.stringify({
      clock:gEl('syncTgl').classList.contains('on'),
      slave:!!ext.on,
      clkInName:optName(gEl('clkIn')),
      syncPortName:optName(gEl('syncPort')),
      syncStart:gEl('syncStart').value,
      cubAct:gEl('cubAct').value,
      mmcDev:gEl('mmcDev').value,
      countIn:gEl('countIn').value,
      cubStop:gEl('cubStop').value
    }));
  }catch(e){}
}
function readSync(){ try{return JSON.parse(localStorage.getItem(LS_SYNC)||'null');}catch(e){return null;} }
function loadSyncControls(){
  var st=readSync(); if(!st)return;
  var f=['syncStart','cubAct','mmcDev','countIn','cubStop'];
  for(var i=0;i<f.length;i++)if(st[f[i]]!==undefined&&st[f[i]]!==null&&gEl(f[i]))gEl(f[i]).value=st[f[i]];
}
function selByName(sel,name){
  if(!sel||!name)return false;
  for(var i=0;i<sel.options.length;i++)
    if(sel.options[i].value&&sel.options[i].textContent===name){ sel.selectedIndex=i; return true; }
  return false;
}
/* Werkseinstellung: SLAVE an, Clock-Eingang der erste IAC-Bus. Das ist der
   Normalbetrieb mit einer DAW; wer es anders will, schaltet es einmal um und
   der gespeicherte Zustand hat ab dann Vorrang. */
function defaultClockInput(){
  var sel=gEl('clkIn'); if(!sel)return -1;
  var best=-1, rank=99;
  for(var i=0;i<sel.options.length;i++){
    var o=sel.options[i]; if(!o.value)continue;
    var n=o.textContent.toLowerCase(), r=99;
    if(n.indexOf('iac')>=0&&n.indexOf('1')>=0)r=0;
    else if(n.indexOf('iac')>=0)r=1;
    if(r<rank){rank=r;best=i;}
  }
  return rank<99?best:-1;
}
function enableSlave(idx,why){
  var sel=gEl('clkIn'); sel.selectedIndex=idx;
  ext.on=true;
  var sb=gEl('slaveTgl'); sb.classList.add('on'); sb.innerHTML='&#9679; SLAVE AN';
  extAttach();
  log(why+': SLAVE &larr; '+sel.options[idx].textContent,'ok');
}
function restoreSyncPorts(){
  var st=readSync();
  if(!st){                                   // erster Start ohne gespeicherten Zustand
    var di=defaultClockInput();
    if(di>=0){ enableSlave(di,'Voreinstellung'); saveSync(); }
    else log('Voreinstellung SLAVE nicht m&ouml;glich &ndash; kein IAC-Eingang gefunden.','w');
    syncInfo(); extStatus(); return;
  }
  selByName(gEl('syncPort'),st.syncPortName);
  var okIn=selByName(gEl('clkIn'),st.clkInName);
  if(st.slave){
    if(okIn&&!ext.on){
      enableSlave(gEl('clkIn').selectedIndex,'DAW-Sync wiederhergestellt');
    }else if(!okIn){
      log('Gespeicherter Clock-Eingang &bdquo;'+st.clkInName+'&ldquo; ist nicht verf&uuml;gbar &ndash; SLAVE bleibt aus.','w');
    }
  }else if(st.clock&&!gEl('syncTgl').classList.contains('on')){
    var tg=gEl('syncTgl'); tg.classList.add('on'); tg.innerHTML='&#9679; CLOCK AN';
    log('DAW-Sync wiederhergestellt: Clock-Ausgang an','m');
  }
  syncInfo(); extStatus();
}
function populateInputs(){
  var sel=gEl('clkIn'); if(!sel||!midiAccess)return;
  var keep=sel.value, h='<option value="">&mdash; kein Eingang &mdash;</option>';
  midiAccess.inputs.forEach(function(i){h+='<option value="'+i.id+'">'+i.name+'</option>';});
  sel.innerHTML=h;
  if(keep&&midiAccess.inputs.get(keep))sel.value=keep;
}
function mmc(cmd,quiet){
  if(!gSysex){ if(!quiet)log('MMC nicht möglich – der Browser hat SysEx nicht freigegeben. Seite neu laden und Zugriff erlauben, oder MIDI Clock verwenden.','w'); return false; }
  var d=clamp(parseInt(gEl('mmcDev').value,10)||0,0,127);
  sendSync([0xF0,0x7F,d,0x06,cmd&127,0xF7]);
  return true;
}
/* MMC ist ein Befehlskanal, keine Clock – im Slave-Modus ist es genau das,
   was man will: der große PLAY-Button startet Cubase, Cubase schickt daraufhin
   sein FA zurück und beide laufen synchron los. Nur während der Generator selbst
   gerade auf ein externes FA/FC reagiert (ext.busy), wird nichts zurückgeschickt –
   sonst würde ein von Cubase kommendes Start/Stop sofort wieder an Cubase gehen. */
function cubaseStart(){
  if(ext.busy)return;
  var act=gEl('cubAct').value;
  if(act==='play'){ if(mmc(0x02))log('MMC Play &rarr; Cubase','p'); }
  else if(act==='rec'){
    if(mmc(0x06)){ setTimeout(function(){mmc(0x03,true);},18); log('MMC Record Strobe + Deferred Play &rarr; Cubase','p'); }
  }
}
function cubaseStopCmd(force){
  if(ext.busy)return;
  if(!force&&gEl('cubStop').value==='none')return;
  var act=gEl('cubAct').value;
  if(act==='rec')mmc(0x07,true);
  if(act!=='none'||force)mmc(0x01,true);
}
function clockStart(){
  if(extSlaving()||!syncActive())return;
  if(gEl('syncStart').value==='start'){ sendSync([0xF2,0x00,0x00]); sendSync([0xFA]); }
  else sendSync([0xFB]);
  log('MIDI Clock gestartet ('+gEl('bpm').value+' BPM) &rarr; '+(syncOut()?syncOut().name:'—'),'m');
}
function clockStop(){ if(!extSlaving()&&syncActive())sendSync([0xFC]); }
/* Clock bewusst mit kürzerem Vorlauf als die Noten (CLKAHEAD statt LOOKAHEAD):
   bei einer Tempoänderung stehen dann nur ~70 ms alte Clocks in der Queue,
   Cubase zieht das Tempo praktisch verzögerungsfrei nach. */
var CLKAHEAD=70;
function pumpClock(curTick,now,mpt){
  if(extSlaving()||!syncActive())return;
  var horizon=curTick+CLKAHEAD/mpt, guard=0;
  while(sched.clkTick<horizon&&guard++<600){
    sendSync([0xF8],now+(sched.clkTick-curTick)*mpt);
    sched.clkTick+=CLKDIV;
  }
}
/* Tempo-Handshake: kurzer Clock-Burst, damit Cubase im Sync-Modus das Tempo übernimmt. */
function clockPulse(barsN){
  var o=syncOut();
  if(!o){log('Kein MIDI-Output für Sync.','e');return;}
  var bpm=parseInt(gEl('bpm').value,10), mpt=msPerTick(bpm), now=performance.now()+80;
  sendSync([0xF2,0x00,0x00]);
  sendSync([0xFA],now);
  var n=Math.round(barsN*BAR/CLKDIV);
  for(var i=0;i<=n;i++)sendSync([0xF8],now+i*CLKDIV*mpt);
  sendSync([0xFC],now+n*CLKDIV*mpt+8);
  log('Tempo-Handshake: '+barsN+' Takte Clock @ '+bpm+' BPM &rarr; '+o.name,'m');
}
function syncInfo(){
  var i=gEl('syncInfo'); if(!i)return;
  var o=syncOut();
  i.textContent=(syncActive()?'Clock AN · '+gEl('bpm').value+' BPM · Port: '+(o?o.name:'—'):'Clock aus.')+
    ' · MMC: '+(gSysex?'verfügbar':'gesperrt (kein SysEx)')+
    ' · Cubase bei PLAY: '+gEl('cubAct').options[gEl('cubAct').selectedIndex].text;
}
function litKey(m,color){var e=document.getElementById('key'+m);if(!e)return;
  if(color){e.style.background=color;e.style.boxShadow='0 0 12px '+color;}
  else{e.style.background='';e.style.boxShadow='';}}

/* Kanal-Monitor: zeigt live, auf welchen Kanälen tatsächlich Noten rausgehen. */
var chCount=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
function buildChMon(){
  var box=document.getElementById('chmon'); if(!box)return;
  var h='';
  for(var i=0;i<16;i++)h+='<div class="chcell" id="chc'+i+'">'+(i+1)+'<span class="cnt" id="chn'+i+'">0</span></div>';
  box.innerHTML=h; updateChMon();
}
function updateChMon(){
  for(var i=0;i<16;i++){
    var cell=document.getElementById('chc'+i); if(!cell)continue;
    var owner=null;
    for(var l=0;l<LANES.length;l++)if(LANES[l].on&&LANES[l].ch===i){owner=LANES[l];break;}
    cell.style.borderColor=owner?owner.color:'';
    cell.style.color=owner?owner.color:'';
    cell.title=owner?owner.name:'frei';
  }
}
function flashCh(ch,color){
  var cell=document.getElementById('chc'+ch); if(!cell)return;
  cell.style.background=color||'#00d4ff';
  cell.style.color='#06121f';
  cell.style.boxShadow='0 0 10px '+(color||'#00d4ff');
  clearTimeout(cell._t);
  cell._t=setTimeout(function(){
    cell.style.background='';cell.style.boxShadow='';
    var own=null;for(var l=0;l<LANES.length;l++)if(LANES[l].on&&LANES[l].ch===ch){own=LANES[l];break;}
    cell.style.color=own?own.color:'';
  },160);
}
function resetChMon(){
  for(var i=0;i<16;i++){chCount[i]=0;var n=document.getElementById('chn'+i);if(n)n.textContent='0';}
}
/* Test-Ton: schickt einen kurzen Akkord auf genau den Kanal dieser Lane.
   Damit lässt sich in Cubase eindeutig zuordnen, welche Spur reagiert. */
function sendProgram(L){
  if(!midiOutput||L.prog<0)return;
  usedCh[L.ch]=1;
  sendAt([0xC0|L.ch,L.prog&127]);
}
function sendAllPrograms(){
  for(var i=0;i<LANES.length;i++)if(LANES[i].on&&LANES[i].prog>=0)sendProgram(LANES[i]);
}
function laneTest(L){
  if(!midiOutput){log('Kein MIDI-Output aktiv.','e');return;}
  var c=gSeq.length?gSeq[0]:{root:0,type:'maj'};
  var base=12*(L.oct+1)+c.root, iv=ivOf(c.type), notes;
  if(L.id==='drums')notes=[DK.kick,DK.snare,DK.hhC,DK.crash];
  else if(L.id==='bass')notes=[base,base+iv[2]];
  else if(L.id==='chords')notes=placeVoicing(buildVoicing(base,c.type,'close',40,Math.random),12*(L.oct+1)-3);
  else if(L.id==='arp')notes=iv.map(function(x){return base+x;});
  else notes=[base,base+iv[1],base+iv[2]];
  var now=performance.now(), stag=(L.id==='chords')?0:110;
  usedCh[L.ch]=1;
  sendProgram(L);
  for(var i=0;i<notes.length;i++){
    sendAt([0x90|L.ch,notes[i],104],now+i*stag);
    sendAt([0x80|L.ch,notes[i],0],now+i*stag+650);
  }
  flashCh(L.ch,L.color);
  log('TEST '+L.name+' &rarr; Kanal '+(L.ch+1)+' · '+notes.length+' Noten','p');
}
function setPrograms(on){
  for(var i=0;i<LANES.length;i++){
    var L=LANES[i];
    L.prog=on?GM_DEFAULT[L.id]:-1;
    var sel=document.getElementById(L.id+'-prog'); if(sel)sel.value=String(L.prog);
    if(on&&L.on)sendProgram(L);              // kein Program Change auf stummen Kanälen
  }
  saveLaneState();
  log(on?'GM-Sounds gesetzt: '+LANES.map(function(L){
        return L.name+'='+(L.id==='drums'?'Drum-Kit':GM[L.prog]);}).join(', ')
       :'Sound-Zuweisung abgeschaltet – Instrumente behalten ihre Sounds','m');
}
/* DRUMS bleibt bewusst auf Kanal 10 – GM-Drums liegen dort, alles andere wäre Unsinn.
   chMode merkt sich, welches Routing zuletzt gesetzt wurde, damit die Buttons einen
   sichtbaren Zustand haben. Wird ein Lane-Kanal von Hand geändert -> Zustand = custom. */
var chMode='';
function setChMode(m){
  chMode=m;
  var a=document.getElementById('btnAllCh'), b=document.getElementById('btnSpreadCh');
  if(a)a.classList.toggle('on',m==='single');
  if(b)b.classList.toggle('on',m==='spread');
  renderChMap();
}
/* Lane-Schnellschalter in der Kommandoleiste. Klick = an/aus, Shift+Klick = Solo. */
function buildTopLanes(){
  var box=document.getElementById('tbLanes'); if(!box)return;
  var h='';
  for(var i=0;i<LANES.length;i++){
    var L=LANES[i];
    h+='<button class="tbl'+(L.on?' on':'')+'" data-i="'+i+'" style="--lc:'+L.color+'" '+
       'title="'+L.name+' \u00b7 Klick = an/aus \u00b7 Shift+Klick = Solo \u00b7 Taste '+(i+1)+'">'+
       '<span class="tbd"></span>'+L.name+'<b>'+(L.ch+1)+'</b></button>';
  }
  box.innerHTML=h;
}
function toggleLane(i){
  if(i<0||i>=LANES.length)return;
  LANES[i].on=!LANES[i].on;
  buildLanes(); updateChMon(); renderChMap(); saveLaneState(); reloadSoon();
  log(LANES[i].name+' '+(LANES[i].on?'AN \u2192 Ch'+(LANES[i].ch+1):'aus'),'m');
}
function renderChMap(){
  buildTopLanes();
  var el=document.getElementById('chMap'); if(!el)return;
  var mode=chMode==='single'?'ein Kanal':chMode==='spread'?'fortlaufend':'manuell';
  var parts=LANES.map(function(L){
    return (L.on?'':'<span style="opacity:.45">')+L.name+'&rarr;<b>Ch'+(L.ch+1)+'</b>'+(L.on?'':' (aus)</span>');
  });
  var dup={},warn='';
  for(var i=0;i<LANES.length;i++){ if(!LANES[i].on)continue;
    if(dup[LANES[i].ch]){warn=' &nbsp;&#9888; Ch'+(LANES[i].ch+1)+' doppelt belegt';break;}
    dup[LANES[i].ch]=1; }
  el.innerHTML='Routing ('+mode+'): '+parts.join(' &middot; ')+warn;
}
function setAllChannels(spread){
  var base=parseInt(document.getElementById('allCh').value,10), step=0;
  for(var i=0;i<LANES.length;i++){
    if(LANES[i].id==='drums')continue;                 // GM-Drums bleiben auf Ch10
    var c;
    if(spread){
      do{ c=(base+step)%16; step++; }while(c===9);      // Ch10 beim Verteilen überspringen
    }else c=base;
    LANES[i].ch=c;
    var sel=document.getElementById(LANES[i].id+'-ch'); if(sel)sel.value=String(c);
    var tb=document.getElementById(LANES[i].id+'-test');
    if(tb)tb.innerHTML='&#128266; Test &rarr; Ch '+(c+1);
  }
  updateChMon(); setChMode(spread?'spread':'single'); saveLaneState();
  log((spread?'Kanäle ab Ch'+(base+1)+' verteilt: '+LANES.map(function(L){return L.name+'=Ch'+(L.ch+1);}).join(', ')
             :'Alle Lanes auf Kanal '+(base+1))+' · DRUMS bleibt auf Ch 10','m');
}
function loadLoopEvents(){
  var take=buildTake(true);
  sched.loopTicks=take.totalTicks;
  var ev=[];
  for(var li=0;li<LANES.length;li++){
    var L=LANES[li];
    // usedCh NICHT hier setzen: sonst schickt panic() All-Notes-Off/CC120 auch auf
    // Kanäle stummgeschalteter Lanes -> in Cubase erscheinen Daten auf Ch1 & Co.
    var le=take.lanes[L.id]||[];
    // refVel = die Velocity, mit der dieser Take erzeugt wurde. Beim Senden wird
    // auf den aktuellen Regler skaliert -> der Fader wirkt sofort statt erst im nächsten Loop.
    for(var i=0;i<le.length;i++)
      ev.push({t:le[i].t,d:le[i].d,m:le[i].m,v:le[i].v,li:li,refVel:L.vel||1});
  }
  ev.sort(function(a,b){return a.t-b.t;});
  sched.ev=ev; sched.idx=0;
}
/* Inhaltliche Änderungen (Style, Oktave, Density, Energy, Akkorde...) sofort übernehmen:
   Take neu bauen und den Zeiger auf die aktuelle Position vorspulen. Bereits klingende
   Noten behalten ihr eingereihtes Note-Off. */
var reloadTimer=null;
function reloadFromCurrent(){
  if(!sched.on)return;
  var cur=sched.tickRef;
  loadLoopEvents();
  if(sched.loopTicks>0&&cur>=sched.loopTicks){cur=cur%sched.loopTicks;sched.tickRef=cur;}
  while(sched.idx<sched.ev.length&&sched.ev[sched.idx].t<cur)sched.idx++;
}
function reloadSoon(){
  if(!sched.on)return;
  clearTimeout(reloadTimer);
  reloadTimer=setTimeout(reloadFromCurrent,130);
}
function schedTick(){
  if(!sched.on)return;
  var now=performance.now();
  var hum=parseInt(document.getElementById('human').value,10)/100;
  var mpt=curMpt();
  var slave=extSlaving();
  if(slave&&!ext.running)return;      // SLAVE wartet auf die DAW - erst das Start-Signal oeffnet den Hahn
  // Im Slave-Modus gehört sched.tickRef der Clock-Routine; hier wird zwischen zwei
  // Clocks nur interpoliert, damit der Lookahead weiterhin greift.
  var dt=now-sched.msRef;
  if(dt<0||dt>4000){                        // Zeitbasis auseinandergelaufen -> resynchronisieren
    sched.msRef=now; dt=0;
    if(slave)log('Zeitbasis resynchronisiert (Clock-Slave)','w');
  }
  var curTick=sched.tickRef+dt/mpt;
  if(!slave){ sched.tickRef=curTick; sched.msRef=now; }
  var horizon=curTick+LOOKAHEAD/mpt;
  pumpClock(curTick,now,mpt);              // MIDI Clock für Cubase im selben Zeitraster

  while(sched.idx<sched.ev.length&&sched.ev[sched.idx].t<horizon){
    var e=sched.ev[sched.idx++];
    var L=LANES[e.li];
    if(!L.on)continue;                       // Lane stummschalten wirkt sofort
    usedCh[L.ch]=1;                          // erst jetzt: Kanal geht wirklich raus
    var jt=(Math.random()-0.5)*hum*26;
    var onMs=now+(e.t-curTick)*mpt+jt;
    var offMs=onMs+e.d*mpt;
    var scale=L.vel/(e.refVel||1);           // Velocity-Regler als echter Fader
    var vel=clamp(Math.round(e.v*scale)+Math.round((Math.random()-0.5)*hum*26),1,127);
    sendAt([0x90|L.ch,e.m,vel],onMs);
    sendAt([0x80|L.ch,e.m,0],offMs);
    sched.active.push({ch:L.ch,m:e.m,off:offMs});
    if(!document.hidden)(function(m,col,ch,a,b,li,t){
      visTimers.push(setTimeout(function(){litKey(m,col,li);flashCh(ch,col);if(window.MP3TAB)MP3TAB.note(m,li,t);},Math.max(0,a-performance.now())));
      visTimers.push(setTimeout(function(){litKey(m,null,li);},Math.max(0,b-performance.now())));
    })(e.m,L.color,L.ch,onMs,offMs,e.li,e.t);
  }
  for(var a=sched.active.length-1;a>=0;a--)if(sched.active[a].off<now-50)sched.active.splice(a,1);

  // Laufende Position anzeigen
  var bi=Math.floor(curTick/BAR);
  if(!document.hidden&&bi>=0&&bi<gBars.length){
    var bc=document.getElementById('barCtr');
    var lbl=(sched.loop+1)+'.'+(bi+1);
    if(bc.textContent!==lbl){
      bc.textContent=lbl;
      document.getElementById('loopCtr').textContent='Loop '+(sched.loop+1)+
        (sched.loopMax>0?' / '+sched.loopMax:' / ∞')+'  ·  '+gBars[bi].label;
      var cbs=document.querySelectorAll('.cb');
      for(var k=0;k<cbs.length;k++)cbs[k].classList.remove('act');
      var cb=document.getElementById('cblock'+gBars[bi].ci); if(cb)cb.classList.add('act');
    }
    var beat=Math.floor((curTick%BAR)/METER.pulseTicks);
    for(var j=0;j<4;j++){var dd=document.getElementById('b'+j);if(dd)dd.classList.toggle('on',j===beat&&j<METER.pulses);}
  }

  // Loop-Wechsel
  if(sched.idx>=sched.ev.length&&curTick>=sched.loopTicks-LOOKAHEAD/mpt){
    sched.loop++;
    if(sched.loopMax>0&&sched.loop>=sched.loopMax){
      if(curTick>=sched.loopTicks){ stopTransport(true); return; }
      sched.loop--;                       // letzten Durchlauf ausklingen lassen
    }else{
      if(document.getElementById('infTgl').classList.contains('on')){
        var ch=mutate();
        document.getElementById('mtag').innerHTML='&#10022; MUTATE '+ch;
        setTimeout(function(){var m=document.getElementById('mtag');if(m)m.innerHTML='';},900);
      }
      if(slave){ sched.tickRef-=sched.loopTicks; }   // Clock-Routine behält die Zeitbasis
      else { sched.tickRef=curTick-sched.loopTicks; sched.msRef=now; }
      sched.clkTick-=sched.loopTicks;      // Clock läuft ohne Sprung weiter
      loadLoopEvents();                    // baut den Take im neuen Chorus-Stadium
      sendChorusCC();
    }
  }
}
function startTransport(){
  stopReq=false;
  usedCh={};
  sched.loopMax=parseInt(document.getElementById('loop').value,10);
  sched.loop=0; sched.active=[];
  loadLoopEvents();
  sendAllPrograms();                       // Sounds setzen, bevor die erste Note kommt
  sendChorusCC();                          // Startwert der Chorus-Dynamik
  var bpm0=parseInt(document.getElementById('bpm').value,10);
  var ci=extSlaving()?0:(parseInt(document.getElementById('countIn').value,10)||0);
  sched.tickRef=extSlaving()?0:-(ci*BAR+120/msPerTick(bpm0));
  sched.clkTick=Math.ceil(sched.tickRef/CLKDIV)*CLKDIV;
  sched.msRef=performance.now();
  sched.on=true;
  clockStart();                            // MIDI Clock + Start/Continue an Cubase
  cubaseStart();                           // optional MMC Play/Record
  if(ci)log('Count-In: '+ci+' Takt(e) Vorlauf – Cubase läuft, Noten folgen danach.','m');
  if(extSlaving()&&!ext.running)
    log('SLAVE: Transport steht bereit und wartet auf das Start-Signal der DAW.','w');
  syncInfo();
  startTicker();
}
/* Sofort-Stop: Queue leeren, alle klingenden Noten gezielt beenden, dann All-Notes-Off. */
function panic(){
  sched.on=false;
  stopTicker();
  for(var i=0;i<visTimers.length;i++)clearTimeout(visTimers[i]);
  visTimers=[];
  if(midiOutput){
    try{ if(midiOutput.clear)midiOutput.clear(); }catch(e){}
    for(var a=0;a<sched.active.length;a++)sendAt([0x80|sched.active[a].ch,sched.active[a].m,0]);
    for(var c in usedCh){
      sendAt([0xB0|parseInt(c,10),123,0]);
      sendAt([0xB0|parseInt(c,10),120,0]);
    }
  }
  sched.active=[]; sched.ev=[]; sched.idx=0;
  var ks=document.querySelectorAll('.kw,.kb');
  for(var k=0;k<ks.length;k++){ks[k].style.background='';ks[k].style.boxShadow='';}
}
function stopTransport(natural){
  panic();
  clockStop();                             // MIDI Clock Stop (0xFC)
  cubaseStopCmd(false);                    // optional MMC Stop / Record Exit
  syncInfo();
  var cbs=document.querySelectorAll('.cb');for(var i=0;i<cbs.length;i++)cbs[i].classList.remove('act');
  for(var j=0;j<4;j++){var d=document.getElementById('b'+j);if(d)d.classList.remove('on');}
  document.getElementById('barCtr').textContent='--';
  document.getElementById('loopCtr').textContent='--';
  document.getElementById('mtag').innerHTML='';
  playing=false;stopReq=false;
  document.getElementById('btnPlay').disabled=false;
  document.getElementById('btnStop').disabled=true;
  log(natural?'Fertig':'Stopped','w');
}

/* ============================================================
   8 · SMF EXPORT (Type 1)
   ============================================================ */
function vlq(v){var b=[v&0x7f];v>>=7;while(v>0){b.unshift((v&0x7f)|0x80);v>>=7;}return b;}
function str2b(s){var a=[];for(var i=0;i<s.length;i++)a.push(s.charCodeAt(i)&0xff);return a;}
function u32(v){return [(v>>>24)&255,(v>>>16)&255,(v>>>8)&255,v&255];}
function u16(v){return [(v>>>8)&255,v&255];}
function chunk(id,data){return str2b(id).concat(u32(data.length)).concat(data);}

function trackBytes(name,events,ch,prog){
  var evs=events.slice();
  for(var i=0;i<evs.length;i++)evs[i].t=Math.round(evs[i].t);
  evs.sort(function(a,b){return a.t-b.t||a.o-b.o;});
  // Überlappungs-Schutz: gleiche Tonhöhe darf nicht doppelt anliegen (sonst Hänger in Cubase)
  var on={},clean=[];
  for(var j=0;j<evs.length;j++){
    var e=evs[j];
    if(e.o){ if(on[e.m]){clean.push({t:e.t,m:e.m,v:0,o:0});} on[e.m]=1; clean.push(e); }
    else   { if(!on[e.m])continue; on[e.m]=0; clean.push(e); }
  }
  var last=clean.length?clean[clean.length-1].t:0;
  for(var p in on)if(on[p])clean.push({t:last,m:parseInt(p,10),v:0,o:0});
  clean.sort(function(a,b){return a.t-b.t||a.o-b.o;});
  var data=[0x00,0xFF,0x03].concat(vlq(name.length)).concat(str2b(name));
  data=data.concat([0x00,0xFF,0x20,0x01,ch&15]);        // MIDI Channel Prefix -> Kanal eindeutig
  if(prog!==undefined&&prog>=0)
    data=data.concat([0x00,0xC0|(ch&15),prog&127]);      // Program Change = Sound-Zuweisung
  var prev=0;
  for(var k=0;k<clean.length;k++){
    var c=clean[k], dt=Math.max(0,c.t-prev); prev=c.t;
    data=data.concat(vlq(dt)).concat([(c.o?0x90:0x80)|ch,c.m&127,c.v&127]);
  }
  data=data.concat([0x00,0xFF,0x2F,0x00]);
  return chunk('MTrk',data);
}
function buildExportTake(){
  var rep=parseInt(document.getElementById('expRep').value,10);
  var vary=document.getElementById('expVary').value==='1';
  var hum=document.getElementById('expHum').value==='1';
  var humAmt=parseInt(document.getElementById('human').value,10)/100;
  var savedVar=barVar.slice(), savedSeeds=LANES.map(function(L){return L.seed;});
  var out={};
  for(var i=0;i<LANES.length;i++)if(LANES[i].on)out[LANES[i].id]=[];
  var total=0;
  for(var r=0;r<rep;r++){
    gStageOverride=r;                      // Chorus-Bogen auch im Export durchziehen
    var take=buildTake();
    for(var li=0;li<LANES.length;li++){
      var L=LANES[li]; if(!L.on)continue;
      var ev=take.lanes[L.id]||[];
      for(var k=0;k<ev.length;k++){
        var e=ev[k];
        var t=e.t+r*take.totalTicks;
        var v=e.v, tt=t;
        if(hum){ v=clamp(v+Math.round((Math.random()-0.5)*humAmt*26),20,127);
                 tt=Math.max(0,t+Math.round((Math.random()-0.5)*humAmt*18)); }
        out[L.id].push({t:tt,m:e.m,v:v,o:1});
        out[L.id].push({t:tt+e.d,m:e.m,v:0,o:0});
      }
    }
    total+=take.totalTicks;
    if(vary&&r<rep-1)mutate();
  }
  gStageOverride=null;
  barVar=savedVar;
  for(var s=0;s<LANES.length;s++)LANES[s].seed=savedSeeds[s];
  return {lanes:out,totalTicks:total,rep:rep};
}
function midiBytes(){
  var bpm=parseInt(document.getElementById('bpm').value,10);
  var ex=buildExportTake();
  var tracks=[];
  var mpq=Math.round(60000000/bpm);
  var meta=[0x00,0xFF,0x51,0x03,(mpq>>16)&255,(mpq>>8)&255,mpq&255,
            0x00,0xFF,0x58,0x04,METER.smf[0],METER.smf[1],METER.smf[2],METER.smf[3],
            0x00,0xFF,0x03].concat(vlq(12)).concat(str2b('MIDI PERFECT'))
            .concat([0x00,0xFF,0x2F,0x00]);
  tracks.push(chunk('MTrk',meta));
  var nTracks=1;
  for(var i=0;i<LANES.length;i++){
    var L=LANES[i]; if(!L.on)continue;
    var ev=ex.lanes[L.id]||[]; if(!ev.length)continue;
    tracks.push(trackBytes(L.name,ev,L.ch,L.prog)); nTracks++;
  }
  var head=chunk('MThd',u16(1).concat(u16(nTracks)).concat(u16(PPQ)));
  var all=head;
  for(var t=0;t<tracks.length;t++)all=all.concat(tracks[t]);
  var name='MIDI_PERFECT_'+gSeq.map(function(c){return c.label;}).join('-').replace(/[^A-Za-z0-9#-]/g,'').slice(0,40)+'_'+bpm+'bpm.mid';
  var info=LANES.filter(function(L){return L.on;}).map(function(L){
    return L.name+'=Ch'+(L.ch+1)+(L.prog>=0?'/PC'+(L.prog+1):'');}).join(' · ');
  return {bytes:new Uint8Array(all),name:name,tracks:nTracks-1,bars:ex.totalTicks/BAR,info:info};
}
function exportMidi(){
  if(!gBars.length){log('Keine Progression!','e');return;}
  if(!LANES.some(function(L){return L.on;})){log('Alle Lanes aus – nichts zu exportieren.','e');return;}
  var r=midiBytes();
  var blob=new Blob([r.bytes],{type:'audio/midi'});
  var a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=r.name; a.click();
  setTimeout(function(){URL.revokeObjectURL(a.href);},4000);
  document.getElementById('expInfo').textContent=r.tracks+' Spuren · '+r.bars+' Takte · '+r.info;
  log('Export: '+r.name+' &rarr; '+r.tracks+' Spuren, '+r.bars+' Takte · '+r.info,'ok');
}
window.__mockOut=function(o){midiOutput=o;};
window.__mp2={buildTake:buildTake,midiBytes:midiBytes,applySeq:applySeq,mutate:mutate,reroll:reroll,
  CHORUS:CHORUS,setStage:function(s){gStageOverride=(s===null||s===undefined)?null:(s|0);},
  laneSwing:laneSwing,buildBlues:buildBluesProgression,transposeBy:transposeBy,
  LANES:LANES,PRESETS:PRESETS,getBars:function(){return gBars;},LANE_STYLES:LANE_STYLES,
  getSeq:function(){return gSeq;},romanOf:romanOf,degChord:degChord,detectKey:detectKey,
  buildVoicing:buildVoicing,placeVoicing:placeVoicing,ivOf:ivOf,scaleOf:scaleOf,sched:sched,
  laneTest:laneTest,setAllChannels:setAllChannels,setPrograms:setPrograms,GM:GM,
  startTransport:startTransport,stopTransport:stopTransport,
  genProgression:genProgression,refreshHarmony:refreshHarmony,analyze:analyze,curKey:curKey,curMode:curMode,
  reloadFromCurrent:reloadFromCurrent,
  DRUMPAT:DRUMPAT,DRUMFILLS:DRUMFILLS,BANDS:BANDS,applyBand:applyBand,clearProgression:clearProgression,
  randomStyle:randomStyle,randomAllStyles:randomAllStyles,styleLabel:styleLabel,
  sync:{mmc:function(c){return mmc(c,true);},clockPulse:clockPulse,active:syncActive,out:syncOut,CLKDIV:CLKDIV,
        sysex:function(v){if(v!==undefined)gSysex=!!v;return gSysex;}},
  reharm:{tritone:rhTritone,secdom:rhSecDom,iiv:rhIIV,modal:rhModal,pass:rhPass,
          extUp:function(){rhExt(true);},extDn:function(){rhExt(false);},undo:rhUndo},
  MODES:MODES,DIA7:DIA7,chordToken:chordToken};

/* ============================================================
   9 · UI-AUFBAU
   ============================================================ */
function buildPiano(){
  var p=document.getElementById('piano'); p.innerHTML='';
  var bS=[1,3,6,8,10], wi=0;
  for(var m=24;m<=108;m++){
    var s=m%12,isB=bS.indexOf(s)>=0,el=document.createElement('div');
    el.id='key'+m;
    if(isB){el.className='kb';el.style.left=((wi-1)*23+14)+'px';}
    else{el.className='kw';el.style.left=(wi*23)+'px';wi++;}
    p.appendChild(el);
  }
  p.style.width=(wi*23)+'px';
}
function chOptions(sel,val){
  var h='';
  for(var i=0;i<16;i++)h+='<option value="'+i+'"'+(i===val?' selected':'')+'>Ch '+(i+1)+'</option>';
  sel.innerHTML=h;
}
/* Lane-Zustand überlebt jetzt einen Reload. Vorher wurden beim Neuladen der Seite
   immer die Defaults gezogen (BASS/CHORDS/MELODY = ON) – genau das erzeugt
   scheinbar aus dem Nichts Daten auf Ch1, Ch2 und Ch4. */
var LS_KEY='midiperfect4.lanes.v1';
function saveLaneState(){
  try{
    var o={};
    for(var i=0;i<LANES.length;i++){var L=LANES[i];
      o[L.id]={on:L.on,ch:L.ch,prog:L.prog,style:L.style,oct:L.oct,vel:L.vel,dens:L.dens,lock:L.lock,fill:L.fill,
               swing:L.swing,vspread:L.vspread};}
    localStorage.setItem(LS_KEY,JSON.stringify(o));
  }catch(e){}
}
function loadLaneState(){
  try{
    var o=JSON.parse(localStorage.getItem(LS_KEY)||'null'); if(!o)return false;
    for(var i=0;i<LANES.length;i++){
      var L=LANES[i],st=o[L.id]; if(!st)continue;
      if(typeof st.on==='boolean')L.on=st.on;
      if(typeof st.ch==='number'&&st.ch>=0&&st.ch<16)L.ch=st.ch;
      if(typeof st.prog==='number')L.prog=st.prog;
      if(typeof st.oct==='number')L.oct=st.oct;
      if(typeof st.vel==='number')L.vel=st.vel;
      if(typeof st.dens==='number')L.dens=st.dens;
      if(typeof st.lock==='boolean')L.lock=st.lock;
      if(typeof st.fill==='number')L.fill=st.fill;
      if(typeof st.swing==='number')L.swing=clamp(st.swing,-1,100);
      if(typeof st.vspread==='number')L.vspread=clamp(st.vspread,0,24);
      if(typeof st.style==='string'&&LANE_STYLES[L.id].some(function(x){return x[0]===st.style;}))L.style=st.style;
    }
    return true;
  }catch(e){return false;}
}
function clearLaneState(){ try{localStorage.removeItem(LS_KEY);}catch(e){} }
/* SOLO: nur diese Lane sendet. Nochmal klicken = alle wieder an. */
function soloLane(id){
  var only=LANES.every(function(X){return X.on===(X.id===id);});
  for(var i=0;i<LANES.length;i++)LANES[i].on=only?true:(LANES[i].id===id);
  buildLanes(); updateChMon(); renderChMap(); saveLaneState(); reloadSoon();
  var L=LANES.filter(function(X){return X.id===id;})[0];
  log(only?'Solo aufgehoben – alle Lanes an':'SOLO: nur '+L.name+' &rarr; Ch'+(L.ch+1)+' · alles andere sendet nichts','m');
}
function buildLanes(){
  var box=document.getElementById('lanes'); box.innerHTML='';
  LANES.forEach(function(L){
    var d=document.createElement('div');
    d.className='lane'+(L.on?'':' off'); d.id='lane-'+L.id;
    d.style.borderLeftColor=L.color;
    var styleOpts='',lastG=null;
    LANE_STYLES[L.id].forEach(function(s){
      if(!styleAllowed(L.id,s[0]))return;
      var g=s[2]||'';
      if(g!==lastG){ if(lastG!==null)styleOpts+='</optgroup>'; styleOpts+='<optgroup label="'+g+'">'; lastG=g; }
      styleOpts+='<option value="'+s[0]+'"'+(s[0]===L.style?' selected':'')+'>'+s[1]+'</option>';
    });
    if(lastG!==null)styleOpts+='</optgroup>';
    var isDrum=(L.id==='drums');
    var progOpts=isDrum
      ? '<option value="-1"'+(L.prog<0?' selected':'')+'>— aus (Kit des Instruments) —</option>'+
        DRUMKITS.map(function(k){return '<option value="'+k[0]+'"'+(k[0]===L.prog?' selected':'')+'>'+k[1]+'</option>';}).join('')
      : '<option value="-1"'+(L.prog<0?' selected':'')+'>— aus (Instrument behält seinen Sound) —</option>'+
        GM.map(function(n,i){return '<option value="'+i+'"'+(i===L.prog?' selected':'')+'>'+(i+1)+' · '+n+'</option>';}).join('');
    var octField=isDrum
      ? '<div class="field"><label>Fill alle</label><select id="'+L.id+'-fill">'+
          [[0,'aus'],[2,'2 Takte'],[4,'4 Takte'],[8,'8 Takte']].map(function(f){
            return '<option value="'+f[0]+'"'+(f[0]===L.fill?' selected':'')+'>'+f[1]+'</option>';}).join('')+
        '</select></div>'
      : '<div class="field"><label>Oktave</label><select id="'+L.id+'-oct">'+
          [0,1,2,3,4,5,6].map(function(o){return '<option value="'+o+'"'+(o===L.oct?' selected':'')+'>C'+o+'</option>';}).join('')+
        '</select></div>';
    var locked=grooveLock&&GROOVE_GROUP[L.id];
    var swOpts='<option value="-1"'+((L.swing===undefined||L.swing<0)?' selected':'')+'>global ('+globalSwing()+' %)</option>'+
      [0,50,54,58,60,62,64,66,68,70,75,80,90,100].map(function(s){
        return '<option value="'+s+'"'+(L.swing===s?' selected':'')+'>'+s+' %</option>';}).join('');
    var arpExtra='';
    if(L.id==='arp'){
      var rOpts=Object.keys(RATES).map(function(k){
        return '<option value="'+k+'"'+(k===L.rate?' selected':'')+'>'+RATES[k][1]+'</option>';}).join('');
      arpExtra=
        '<div class="field"><label>Rate</label><select id="'+L.id+'-rate">'+rOpts+'</select></div>'+
        '<div class="field"><label>Oktaven</label><select id="'+L.id+'-arpOct">'+
          [1,2,3].map(function(o){return '<option value="'+o+'"'+(o===L.arpOct?' selected':'')+'>'+o+'</option>';}).join('')+
        '</select></div>'+
        '<div class="field"><label>Gate %</label><div class="sl"><input type="range" id="'+L.id+'-gate" min="10" max="100" value="'+L.gate+'"><span class="vd" id="'+L.id+'-gateV">'+L.gate+'</span></div></div>';
    }
    d.innerHTML=
      '<div class="lane-head">'+
        '<span class="chip'+(L.on?' on':'')+'" id="'+L.id+'-on">'+(L.on?'&#9679; ON':'&#9675; OFF')+'</span>'+
        '<span class="chip" id="'+L.id+'-solo" title="Nur diese Lane sendet">&#9678; SOLO</span>'+
        '<span class="lane-name" style="color:'+L.color+'">'+L.name+'</span>'+
        '<span class="chip lk'+(L.lock?' on':'')+'" id="'+L.id+'-lock">'+(L.lock?'&#128274; LOCKED':'&#128275; frei')+'</span>'+
        '<span class="chip" id="'+L.id+'-dice">&#127922; Reroll</span>'+
        '<span class="chip" id="'+L.id+'-sdice">&#127918; Style würfeln</span>'+
        '<span class="chip" id="'+L.id+'-test">&#128266; Test &rarr; Ch '+(L.ch+1)+'</span>'+
      '</div>'+
      '<div class="row" style="margin-bottom:0">'+
        '<div class="field" style="min-width:230px"><label>Style ('+LANE_STYLES[L.id].length+')</label><select id="'+L.id+'-style">'+styleOpts+'</select></div>'+
        '<div class="field"><label>Kanal</label><select id="'+L.id+'-ch"></select></div>'+
        '<div class="field" style="min-width:190px"><label>'+(isDrum?'Drum-Kit':'Sound')+' (Program Change)</label><select id="'+L.id+'-prog">'+progOpts+'</select></div>'+
        octField+
        '<div class="field"><label>Velocity</label><div class="sl"><input type="range" id="'+L.id+'-vel" min="30" max="127" value="'+L.vel+'"><span class="vd" id="'+L.id+'-velV">'+L.vel+'</span></div></div>'+
        '<div class="field"><label>Density %</label><div class="sl"><input type="range" id="'+L.id+'-dens" min="10" max="100" value="'+L.dens+'"><span class="vd" id="'+L.id+'-densV">'+L.dens+'</span></div></div>'+
        '<div class="field"><label>Swing'+(locked?' (gekoppelt)':'')+'</label><select id="'+L.id+'-swing"'+(locked?' disabled':'')+'>'+swOpts+'</select></div>'+
        '<div class="field"><label>Vel-Streuung &plusmn;</label><div class="sl"><input type="range" id="'+L.id+'-vspread" min="0" max="24" value="'+(L.vspread|0)+'"><span class="vd" id="'+L.id+'-vspreadV">'+(L.vspread|0)+'</span></div></div>'+
        arpExtra+
      '</div>';
    box.appendChild(d);
    chOptions(document.getElementById(L.id+'-ch'),L.ch);

    document.getElementById(L.id+'-on').onclick=function(){
      L.on=!L.on; this.classList.toggle('on',L.on);
      this.innerHTML=L.on?'&#9679; ON':'&#9675; OFF';
      d.classList.toggle('off',!L.on);
      updateChMon(); renderChMap(); saveLaneState();
    };
    document.getElementById(L.id+'-solo').onclick=function(){ soloLane(L.id); };
    document.getElementById(L.id+'-lock').onclick=function(){
      L.lock=!L.lock; this.classList.toggle('on',L.lock);
      this.innerHTML=L.lock?'&#128274; LOCKED':'&#128275; frei';
      saveLaneState();
    };
    document.getElementById(L.id+'-dice').onclick=function(){reroll(L.id);};
    document.getElementById(L.id+'-sdice').onclick=function(){randomStyle(L);};
    document.getElementById(L.id+'-test').onclick=function(){laneTest(L);};
    document.getElementById(L.id+'-style').onchange=function(){
      L.style=this.value;reloadFromCurrent();
      log(L.name+' Style: '+styleLabel(L.id,L.style),'m');
    };
    document.getElementById(L.id+'-ch').onchange=function(){
      L.ch=parseInt(this.value,10);
      document.getElementById(L.id+'-test').innerHTML='&#128266; Test &rarr; Ch '+(L.ch+1);
      updateChMon(); setChMode(''); saveLaneState();
    };
    if(isDrum){
      document.getElementById(L.id+'-fill').onchange=function(){L.fill=parseInt(this.value,10);reloadFromCurrent();};
    }else{
      document.getElementById(L.id+'-oct').onchange=function(){L.oct=parseInt(this.value,10);reloadFromCurrent();};
    }
    document.getElementById(L.id+'-prog').onchange=function(){
      L.prog=parseInt(this.value,10);
      if(L.prog>=0)sendProgram(L);
      log(L.name+' Sound: '+(L.prog<0?'aus':(isDrum?this.options[this.selectedIndex].text:(L.prog+1)+' · '+GM[L.prog])),'m');
    };
    ['vel','dens','vspread'].forEach(function(k){
      var el=document.getElementById(L.id+'-'+k);
      el.oninput=function(){
        L[k]=parseInt(this.value,10);
        document.getElementById(L.id+'-'+k+'V').textContent=this.value;
        if(k!=='vel')reloadSoon();       // Velocity braucht kein Reload, sie skaliert live
      };
    });
    document.getElementById(L.id+'-swing').onchange=function(){
      L.swing=parseInt(this.value,10); saveLaneState(); reloadFromCurrent();
      log(L.name+' Swing: '+(L.swing<0?'global ('+globalSwing()+' %)':L.swing+' %'),'m');
    };
    if(L.id==='arp'){
      document.getElementById(L.id+'-rate').onchange=function(){L.rate=this.value;reloadFromCurrent();};
      document.getElementById(L.id+'-arpOct').onchange=function(){L.arpOct=parseInt(this.value,10);reloadFromCurrent();};
      var g=document.getElementById(L.id+'-gate');
      g.oninput=function(){L.gate=parseInt(this.value,10);document.getElementById(L.id+'-gateV').textContent=this.value;reloadSoon();};
    }
  });
}
function buildPresets(){
  var sel=document.getElementById('progPreset');
  sel.innerHTML='<option value="">— wählen —</option>';   // verhindert Dubletten in gespeicherten Seiten
  Object.keys(PRESETS).forEach(function(k){
    var o=document.createElement('option'); o.value=k; o.textContent=PRESETS[k][0]; sel.appendChild(o);
  });
  sel.onchange=function(){
    if(!this.value)return;
    var P=PRESETS[this.value];
    document.getElementById('chordInput').value=P[1];
    if(P[2])document.getElementById('defType').value=P[2];
    barLock=[]; applySeq(); detectKey();
  };
}
/* --- Progression leeren ------------------------------------- */
function clearProgression(){
  if(playing)stopTransport(false);
  pushUndo();
  document.getElementById('chordInput').value='';
  gSeq=[]; gBars=[]; barLock=[]; barVar=[];
  document.getElementById('cdisp').innerHTML='';
  var er=document.getElementById('seqErr'); if(er)er.style.display='none';
  var pp=document.getElementById('progPreset'); if(pp)pp.value='';
  document.getElementById('barCtr').textContent='--';
  document.getElementById('loopCtr').textContent='--';
  buildSuggestions();
  document.getElementById('expInfo').textContent='Keine Progression – nichts zu exportieren.';
  log('Progression geleert · Undo stellt sie wieder her','w');
  document.getElementById('chordInput').focus();
}
/* --- Styles: Label, Zufall, Band-Presets --------------------- */
function styleLabel(laneId,val){
  var a=LANE_STYLES[laneId]||[];
  for(var i=0;i<a.length;i++)if(a[i][0]===val)return a[i][1];
  return val;
}
function randomStyle(L){
  var a=(LANE_STYLES[L.id]||[]).filter(function(x){return styleAllowed(L.id,x[0]);});
  if(!a.length)return;
  var v=L.style, guard=0;
  while(v===L.style&&guard++<20)v=a[Math.floor(Math.random()*a.length)][0];
  L.style=v;
  var sel=document.getElementById(L.id+'-style'); if(sel)sel.value=v;
  reloadFromCurrent();
  log(L.name+' Style: '+styleLabel(L.id,v),'m');
}
function randomAllStyles(){
  for(var i=0;i<LANES.length;i++)if(!LANES[i].lock)randomStyle(LANES[i]);
}
function buildBands(){
  var sel=document.getElementById('bandSel'); if(!sel)return;
  sel.innerHTML='<option value="">— wählen —</option>';
  Object.keys(BANDS).forEach(function(k){
    var o=document.createElement('option'); o.value=k; o.textContent=BANDS[k][0]; sel.appendChild(o);
  });
}
function applyBand(key){
  var B=BANDS[key]; if(!B)return;
  var st=B[1], meta=B[2]||{};
  var takeOn=document.getElementById('bandLanes').classList.contains('on');
  for(var i=0;i<LANES.length;i++){
    var L=LANES[i];
    if(L.lock)continue;
    if(st[L.id])L.style=st[L.id];
    if(takeOn&&meta.on&&meta.on[L.id]!==undefined)L.on=!!meta.on[L.id];
  }
  if(document.getElementById('bandTempo').classList.contains('on')){
    if(meta.bpm){document.getElementById('bpm').value=meta.bpm;document.getElementById('bpmVal').textContent=meta.bpm;}
    if(meta.swing!==undefined){document.getElementById('swing').value=meta.swing;document.getElementById('swingVal').textContent=meta.swing;}
  }
  buildLanes(); updateChMon(); renderChMap(); saveLaneState(); reloadFromCurrent(); syncInfo();
  document.getElementById('bandInfo').textContent=B[0]+': '+LANES.map(function(L){
    return L.name+'='+styleLabel(L.id,L.style)+(L.on?'':' (aus)');}).join(' · ');
  log('Band-Preset '+B[0]+(meta.bpm?' · '+meta.bpm+' BPM':'')+' geladen','m');
}

/* ============================================================
   10 · EVENTS
   ============================================================ */
['bpm','swing','human','energy','cplx','mut'].forEach(function(id){
  var el=document.getElementById(id);
  el.addEventListener('input',function(){
    document.getElementById(id+'Val').textContent=this.value;
    // BPM und Humanize wirken ohnehin live, Mutation erst beim nächsten Loop
    if(id==='swing'||id==='energy'||id==='cplx')reloadSoon();
  });
});
document.getElementById('midiOut').addEventListener('change',function(){
  if(midiAccess){midiOutput=midiAccess.outputs.get(this.value);log('Output: '+(midiOutput?midiOutput.name:'—'),'ok');}});
document.getElementById('btnApply').onclick=applySeq;
document.getElementById('btnClear').onclick=clearProgression;
document.getElementById('chordInput').addEventListener('keydown',function(e){if(e.key==='Enter')applySeq();});
document.getElementById('barsPerChord').onchange=applySeq;
document.getElementById('defType').onchange=applySeq;
document.getElementById('infTgl').onclick=function(){
  var on=this.classList.toggle('on');
  this.innerHTML=on?'&#9679; INFINITY AN':'&#9675; INFINITY AUS';
};
document.getElementById('btnDice').onclick=function(){reroll(null);};
/* --- Cubase Sync --- */
document.getElementById('syncTgl').onclick=function(){
  if(!this.classList.contains('on')&&extSlaving()){
    log('Clock-Ausgang nicht möglich, solange SLAVE an ist.','w'); return;
  }
  var on=this.classList.toggle('on');
  this.innerHTML=on?'&#9679; CLOCK AN':'&#9675; CLOCK AUS';
  if(!on&&playing)sendSync([0xFC]);
  if(on&&playing){                                   // im laufenden Betrieb sauber einklinken
    sched.clkTick=Math.ceil(sched.tickRef/CLKDIV)*CLKDIV;
    sendSync([0xFB]);
  }
  saveSync();
  log(on?'MIDI Clock aktiv – Cubase auf externe Sync stellen':'MIDI Clock aus','m');
  syncInfo();
};
document.getElementById('syncPort').onchange=syncInfo;
document.getElementById('slaveTgl').onclick=function(){
  ext.on=this.classList.toggle('on');
  this.innerHTML=ext.on?'&#9679; SLAVE AN':'&#9675; SLAVE AUS';
  if(ext.on){
    var st=document.getElementById('syncTgl');
    if(st.classList.contains('on')){ st.click(); log('Clock-Ausgang abgeschaltet – Slave und Master schließen sich aus.','w'); }
    if(playing)stopTransport(false);
  }
  extAttach(); syncInfo(); saveSync();
};
document.getElementById('clkIn').onchange=function(){ extAttach(); saveSync(); };
document.getElementById('panelSync').addEventListener('change',saveSync);
setInterval(function(){ if(ext.on){extStatus(); extBpmDisplay();} },400);
document.getElementById('cubAct').onchange=syncInfo;
document.getElementById('btnMmcPlay').onclick=function(){if(mmc(0x02))log('MMC Play gesendet','p');};
document.getElementById('btnMmcRec').onclick=function(){
  if(mmc(0x06)){setTimeout(function(){mmc(0x03,true);},18);log('MMC Record gesendet','p');}
};
document.getElementById('btnMmcStop').onclick=function(){if(mmc(0x01))log('MMC Stop gesendet','p');};
document.getElementById('btnClkPulse').onclick=function(){clockPulse(4);};
/* --- Band-Presets / Style-Würfel --- */
document.getElementById('btnBandApply').onclick=function(){
  var v=document.getElementById('bandSel').value;
  if(!v){log('Kein Band-Preset gewählt.','w');return;}
  applyBand(v);
};
document.getElementById('bandSel').onchange=function(){if(this.value)applyBand(this.value);};
document.getElementById('btnStyleDice').onclick=randomAllStyles;
document.getElementById('bandTempo').onclick=function(){
  var on=this.classList.toggle('on');
  this.innerHTML=(on?'&#9679;':'&#9675;')+' Tempo/Swing übernehmen';
};
/* --- Harmonie-Engine --- */
document.getElementById('keyPc').onchange=refreshHarmony;
document.getElementById('keyMode').onchange=refreshHarmony;
document.getElementById('btnDetect').onclick=detectKey;
document.getElementById('sevTgl').onclick=function(){
  var on=this.classList.toggle('on');
  this.innerHTML=(on?'&#9679;':'&#9675;')+' Septakkorde';
  buildDegRow(); buildSuggestions();
};
document.getElementById('rhTritone').onclick=rhTritone;
document.getElementById('rhSecDom').onclick=rhSecDom;
document.getElementById('rhIIV').onclick=rhIIV;
document.getElementById('rhModal').onclick=rhModal;
document.getElementById('rhPass').onclick=rhPass;
document.getElementById('rhExtUp').onclick=function(){rhExt(true);};
document.getElementById('rhExtDn').onclick=function(){rhExt(false);};
document.getElementById('rhUndo').onclick=rhUndo;
document.getElementById('btnGenProg').onclick=genProgression;
document.getElementById('btnExport').onclick=exportMidi;
document.getElementById('btnPlay').onclick=function(){
  if(playing)return;
  if(!midiOutput){log('Kein MIDI-Output – IAC-Treiber aktiv?','e');return;}
  if(!gBars.length){log('Keine Progression!','e');return;}
  var anyOn=LANES.some(function(L){return L.on;});
  if(!anyOn){log('Alle Lanes aus!','e');return;}
  playing=true;stopReq=false;resetChMon();
  this.disabled=true;document.getElementById('btnStop').disabled=false;
  log('PLAY · '+gBars.length+' Takte · '+document.getElementById('bpm').value+' BPM · Lanes: '+
      LANES.filter(function(L){return L.on;}).map(function(L){return L.name+'(Ch'+(L.ch+1)+')';}).join(', '),'p');
  startTransport();
};
document.getElementById('btnStop').onclick=function(){stopTransport(false);};
document.getElementById('btnSaveHtml').onclick=function(){
  var blob=new Blob(['<!DOCTYPE html>\n'+document.documentElement.outerHTML],{type:'text/html'});
  var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='MIDI PERFECT 2.html';a.click();
};
window.addEventListener('beforeunload',function(){panic();clockStop();cubaseStopCmd(false);});
document.addEventListener('keydown',function(e){
  if(e.target.tagName==='INPUT'||e.target.tagName==='SELECT')return;
  if(e.metaKey||e.ctrlKey||e.altKey)return;
  if(e.code==='Space'){e.preventDefault();
    if(playing)stopTransport(false);else document.getElementById('btnPlay').click();}
  if(/^Digit[1-9]$/.test(e.code)){
    var li=parseInt(e.code.slice(5),10)-1;
    if(li<LANES.length){e.preventDefault(); if(e.shiftKey)soloLane(LANES[li].id); else toggleLane(li);}
    return;
  }
  if(e.shiftKey)return;
  if(e.key==='r'||e.key==='R')reroll(null);
  if(e.key==='d'||e.key==='D')randomAllStyles();
});
document.getElementById('tbLanes').addEventListener('click',function(e){
  var b=e.target; while(b&&b!==this&&!b.classList.contains('tbl'))b=b.parentNode;
  if(!b||b===this)return;
  var i=parseInt(b.getAttribute('data-i'),10);
  if(e.shiftKey)soloLane(LANES[i].id); else toggleLane(i);
});

/* ============================================================
   10b · BLUES-WERKSTATT
   Formen als Stufen (Halbtonabstand zur Tonika + Akkordtyp), damit jede
   Form in jeder Tonart sofort verfügbar ist. 1 Akkord = 1 Takt.
   ============================================================ */
var BLUES_FORMS={
 std12:['12-Bar Standard',[[0,'7'],[0,'7'],[0,'7'],[0,'7'],[5,'7'],[5,'7'],[0,'7'],[0,'7'],[7,'7'],[5,'7'],[0,'7'],[0,'7']]],
 slow12:['12-Bar Slow (9er-Voicings)',[[0,'9'],[0,'9'],[0,'9'],[0,'9'],[5,'9'],[5,'9'],[0,'9'],[0,'9'],[7,'9'],[5,'9'],[0,'9'],[0,'9']]],
 jazz12:['Jazz-Blues (12)',[[0,'7'],[5,'7'],[0,'7'],[7,'m7'],[5,'7'],[6,'dim7'],[0,'7'],[9,'7'],[2,'m7'],[7,'7'],[0,'7'],[7,'7']]],
 minor12:['Minor-Blues (12)',[[0,'m7'],[0,'m7'],[0,'m7'],[0,'m7'],[5,'m7'],[5,'m7'],[0,'m7'],[0,'m7'],[8,'maj7'],[7,'7b9'],[0,'m7'],[7,'7b9']]],
 eight8:['8-Bar Blues',[[0,'7'],[7,'7'],[5,'7'],[5,'7'],[0,'7'],[7,'7'],[0,'7'],[7,'7']]],
 sixteen:['16-Bar Slow Blues',[[0,'7'],[0,'7'],[0,'7'],[0,'7'],[0,'7'],[0,'7'],[0,'7'],[0,'7'],[5,'7'],[5,'7'],[0,'7'],[0,'7'],[7,'7'],[5,'7'],[0,'7'],[0,'7']]]
};
/* Turnaround: [Label, Stufe vorletzter Takt oder null, Stufe letzter Takt] */
var BLUES_TA={
 none:['ohne (I bleibt stehen)',null,null],
 v:   ['V7 (Standard)',null,[7,'7']],
 vi_v:['VI7 &rarr; V7 (Jazz)',[9,'7'],[7,'7']],
 ii_v:['ii7 &rarr; V7',[2,'m7'],[7,'7']],
 dim: ['#IV&deg;7 &rarr; V7',[6,'dim7'],[7,'7']],
 bvi: ['bVI7 &rarr; V7 (chromatisch)',[8,'7'],[7,'7']]
};
var BLUESSUF={'7':'7','9':'9','m7':'m7','maj7':'maj7','dim7':'dim7','7b9':'7b9','min':'m','maj':'','m9':'m9','13':'13'};
var FLATSET={5:1,10:1,3:1,8:1,1:1,6:1};                 // F, Bb, Eb, Ab, Db, Gb
function nameIn(pc,keyPc){ pc=((pc%12)+12)%12; return FLATSET[((keyPc%12)+12)%12]?FLATN[pc]:SHARPN[pc]; }
function degToken(d,keyPc){ return nameIn(keyPc+d[0],keyPc)+(BLUESSUF[d[1]]!==undefined?BLUESSUF[d[1]]:d[1]); }

var blQuickChange=false;
function buildBluesProgression(){
  var keyPc=parseInt(document.getElementById('blKey').value,10);
  var fKey=document.getElementById('blForm').value;
  var taKey=document.getElementById('blTA').value;
  var F=BLUES_FORMS[fKey]; if(!F)return;
  var deg=F[1].map(function(d){return [d[0],d[1]];});
  if(blQuickChange&&deg.length>=5)deg[1]=[5,deg[4][1]];   // Takt 2 = IV, Typ wie Takt 5
  var TA=BLUES_TA[taKey];
  if(TA){
    if(TA[1]&&deg.length>=2)deg[deg.length-2]=[TA[1][0],TA[1][1]];
    if(TA[2])deg[deg.length-1]=[TA[2][0],TA[2][1]];
  }
  var toks=deg.map(function(d){return degToken(d,keyPc);});
  document.getElementById('chordInput').value=toks.join(' ');
  document.getElementById('barsPerChord').value='1';
  document.getElementById('keyPc').value=String(keyPc);
  document.getElementById('blTo').value=String(keyPc);
  applySeq();
  if(typeof refreshHarmony==='function')refreshHarmony();
  document.getElementById('blInfo').textContent=
    F[0]+' in '+nameIn(keyPc,keyPc)+' · '+deg.length+' Takte'+(blQuickChange?' · Quick-Change':'')+
    (taKey!=='none'?' · Turnaround '+taKey.toUpperCase():'');
  log('Blues-Form: '+F[0]+' in '+nameIn(keyPc,keyPc)+(blQuickChange?' + Quick-Change':'')+
      ' · Turnaround: '+BLUES_TA[taKey][0].replace(/&rarr;/g,'→').replace(/&deg;/g,'°'),'ok');
}
function seqToText(seq,keyPc){
  return seq.map(function(c){
    return nameIn(c.root,keyPc)+(c.suf||'')+(c.bars>1?':'+c.bars:'');
  }).join(' ');
}
function transposeBy(semi){
  if(!gSeq.length){log('Keine Progression zum Transponieren','w');return;}
  var nk=((curKey()+semi)%12+12)%12;
  var ns=gSeq.map(function(c){return {root:((c.root+semi)%12+12)%12,suf:c.suf||'',bars:c.bars};});
  document.getElementById('chordInput').value=seqToText(ns,nk);
  document.getElementById('keyPc').value=String(nk);
  document.getElementById('blKey').value=String(nk);
  document.getElementById('blTo').value=String(nk);
  applySeq();
  if(typeof refreshHarmony==='function')refreshHarmony();
  log('Transponiert nach '+nameIn(nk,nk)+' ('+(semi>0?'+':'')+semi+' Halbtöne)','ok');
}
/* Der Übungs-Zirkel geht bewusst über die Tonarten, die man auf der Gitarre
   sonst umgeht – nicht nur A und E. */
var PRACTICE_KEYS=[7,0,5,10,3,9,2,4];   // G C F Bb Eb A D E
function cycleKey(){
  var cur=curKey(), idx=PRACTICE_KEYS.indexOf(cur);
  var next=(idx<0)?PRACTICE_KEYS[0]:PRACTICE_KEYS[(idx+1)%PRACTICE_KEYS.length];
  var semi=((next-cur)%12+12)%12;
  if(!semi){ log('Bereits in '+nameIn(cur,cur),'i'); return; }
  transposeBy(semi);
}

/* --- Tempofelder -------------------------------------------- */
var TFIELDS=[
 {id:'slow',   label:'Slow Blues 12/8', lo:60,  hi:75,  step:3, swing:98, bbeat:14,
  styles:{drums:'shuffle',bass:'tenths',chords:'gospel128',melody:'blues'}},
 {id:'shuffle',label:'Shuffle',         lo:95,  hi:130, step:5, swing:65, bbeat:12,
  styles:{drums:'shuffle',bass:'shuffle',chords:'charleston',melody:'blues'}},
 {id:'rock',   label:'Rock-Blues gerade',lo:110,hi:140, step:5, swing:0,  bbeat:16,
  styles:{drums:'rock8',bass:'rootFive',chords:'rockPower',melody:'pentatonic'}},
 {id:'funk',   label:'Funk-Blues',      lo:100, hi:115, step:5, swing:16, bbeat:14,
  styles:{drums:'funk1',bass:'motown',chords:'funk16',melody:'funkStabs'}}
];
var tfPos={};
function setSlider(id,val){
  var el=document.getElementById(id); if(!el)return;
  el.value=String(val);
  var lab=document.getElementById(id+'Val'); if(lab)lab.textContent=String(val);
}
function applyTempoField(T){
  var cur=(tfPos[T.id]===undefined)?T.lo:(tfPos[T.id]+T.step);
  if(cur>T.hi)cur=T.lo;
  tfPos[T.id]=cur;
  setSlider('bpm',cur); setSlider('swing',T.swing); setSlider('bbeat',T.bbeat);
  for(var i=0;i<LANES.length;i++){
    var L=LANES[i], s=T.styles[L.id];
    if(s&&LANE_STYLES[L.id].some(function(x){return x[0]===s;}))L.style=s;
    /* Rhythmusgruppe an, MELODY aus: die Melodie spielst du selbst – eine
       mitlaufende Leadstimme nimmt genau den Raum weg, den man zum Üben braucht.
       ARP bleibt aus, programmierte Rhythmusgitarre verrät sich sofort. */
    L.on=(L.id==='drums'||L.id==='bass'||L.id==='chords');
    if(L.id==='drums'&&(!L.fill||L.fill>4))L.fill=4;
  }
  buildLanes(); updateChMon(); renderChMap(); saveLaneState(); refreshSwingLabels();
  if(typeof syncInfo==='function')syncInfo();
  reloadFromCurrent();
  var btns=document.querySelectorAll('#blTempo .rh');
  for(var b=0;b<btns.length;b++)btns[b].classList.toggle('on',btns[b].getAttribute('data-tf')===T.id);
  log('Tempofeld '+T.label+': '+cur+' BPM (Bereich '+T.lo+'–'+T.hi+') · Swing '+T.swing+' % · Backbeat '+T.bbeat,'ok');
}
function buildTempoFields(){
  var box=document.getElementById('blTempo'); if(!box)return;
  box.innerHTML=TFIELDS.map(function(T){
    return '<button class="rh" data-tf="'+T.id+'" title="'+T.lo+'–'+T.hi+' BPM · Swing '+T.swing+' %">'+
           T.label+' <b style="opacity:.65">'+T.lo+'–'+T.hi+'</b></button>';
  }).join('');
  box.onclick=function(e){
    var b=e.target.closest?e.target.closest('button[data-tf]'):null;
    if(!b)return;
    var id=b.getAttribute('data-tf');
    for(var i=0;i<TFIELDS.length;i++)if(TFIELDS[i].id===id)applyTempoField(TFIELDS[i]);
  };
}
function refreshSwingLabels(){
  for(var i=0;i<LANES.length;i++){
    var sel=document.getElementById(LANES[i].id+'-swing');
    if(sel&&sel.options.length)sel.options[0].textContent='global ('+globalSwing()+' %)';
  }
}


/* ============================================================
   10c · SETUP-SPEICHER

   Ein Setup ist der komplette Arbeitsstand – alles, was den Klang bestimmt,
   in einem JSON-Objekt. Bewusst NICHT enthalten: MIDI-Ports. Die gehören zur
   Maschine, nicht zum Stück; sie laufen weiter über LS_SYNC und werden über
   den Portnamen aufgelöst. Ein Setup, das auf einem anderen Rechner den
   falschen Port aufmacht, wäre schlimmer als eines, das gar keinen setzt.

   Zustand wird gesetzt, indem die vorhandenen Handler gefeuert werden, nicht
   indem deren Logik hier ein zweites Mal steht. Kommt später ein Regler dazu,
   reicht ein Eintrag in collectSetup/applySetup – die Nebenwirkungen (Reload
   des Takes, Log, abhängige Anzeigen) erledigt weiter der Original-Handler.
   ============================================================ */
var LS_SETUPS='midiperfect4.setups.v1';
var LS_SETUP_AUTO='midiperfect4.setup.auto';
var LS_SETUP_META='midiperfect4.setup.meta';
var SETUP_VER=1;

function suEl(id){return document.getElementById(id);}
function suVal(id){var e=suEl(id);return e?e.value:null;}
function suOn(id){var e=suEl(id);return !!(e&&e.classList.contains('on'));}
function suInfo(t){var e=suEl('suInfo');if(e)e.textContent=t;}

/* Wert setzen, Zahlenanzeige nachziehen, optional den Original-Handler feuern. */
function suPut(id,v,evt){
  if(v===undefined||v===null)return;
  var e=suEl(id); if(!e)return;
  e.value=String(v);
  var lab=suEl(id+'Val'); if(lab)lab.textContent=e.value;
  if(evt){try{e.dispatchEvent(new Event(evt,{bubbles:true}));}catch(err){}}
}
/* Chip nur dann klicken, wenn er wirklich falsch steht – sonst schaltet man ihn weg. */
function suToggle(id,want){
  if(want===undefined||want===null)return;
  var e=suEl(id); if(!e)return;
  if(e.classList.contains('on')===!!want)return;
  if(typeof e.onclick==='function')e.onclick.call(e,{target:e});
}
function suLaneState(){
  return LANES.map(function(L){
    return {id:L.id,on:L.on,ch:L.ch,prog:L.prog,style:L.style,oct:L.oct,vel:L.vel,dens:L.dens,
            lock:L.lock,fill:L.fill,swing:L.swing,vspread:L.vspread,seed:L.seed,
            rate:L.rate,arpOct:L.arpOct,gate:L.gate};
  });
}
function collectSetup(){
  return {
    v:SETUP_VER,
    ts:new Date().toISOString(),
    build:(suEl('buildTag')?suEl('buildTag').textContent:''),
    glob:{meter:METER.id,bpm:suVal('bpm'),swing:suVal('swing'),human:suVal('human'),energy:suVal('energy'),
          cplx:suVal('cplx'),mut:suVal('mut'),loop:suVal('loop'),inf:suOn('infTgl')},
    harm:{keyPc:suVal('keyPc'),keyMode:suVal('keyMode'),sev:suOn('sevTgl')},
    prog:{text:suVal('chordInput'),bars:suVal('barsPerChord'),defType:suVal('defType'),
          preset:suVal('progPreset'),lock:barLock.slice()},
    blues:{key:suVal('blKey'),form:suVal('blForm'),ta:suVal('blTA'),qc:suOn('blQC'),
           groove:suOn('blGroove'),bbeat:suVal('bbeat'),taFill:suOn('blTAFill'),
           chorus:{on:suOn('blChorus'),build:suOn('blArc'),len:suVal('blChLen'),
                   ride:suVal('blChRide'),cc:suVal('blChCC'),amp:suVal('blChAmp')}},
    lanes:suLaneState(),
    band:{sel:suVal('bandSel'),tempo:suOn('bandTempo'),lanes:suOn('bandLanes')},
    route:{allCh:suVal('allCh'),guard:suOn('chGuard')},
    exp:{rep:suVal('expRep'),vary:suVal('expVary'),hum:suVal('expHum')},
    sync:{start:suVal('syncStart'),cubAct:suVal('cubAct'),mmcDev:suVal('mmcDev'),
          countIn:suVal('countIn'),cubStop:suVal('cubStop')}
  };
}
function applySetup(S){
  if(!S||typeof S!=='object'||!S.glob)return false;
  if(typeof playing!=='undefined'&&playing)stopTransport(false);

  /* --- global --- */
  var g=S.glob;
  if(g.meter&&METERS[g.meter])setMeter(g.meter,true);
  ['bpm','swing','human','energy','cplx','mut','loop'].forEach(function(k){suPut(k,g[k]);});
  suToggle('infTgl',g.inf);

  /* --- Harmonie --- */
  var h=S.harm||{};
  suPut('keyPc',h.keyPc); suPut('keyMode',h.keyMode); suToggle('sevTgl',h.sev);

  /* --- Blues-Werkstatt: erst die Werte, dann die Schalter, die davon lesen --- */
  var b=S.blues||{}, c=b.chorus||{};
  suPut('blKey',b.key); suPut('blForm',b.form); suPut('blTA',b.ta);
  suPut('bbeat',b.bbeat,'input');
  suPut('blChLen',c.len,'change'); suPut('blChRide',c.ride,'change');
  suPut('blChCC',c.cc,'change');   suPut('blChAmp',c.amp,'input');
  suToggle('blQC',b.qc); suToggle('blGroove',b.groove); suToggle('blTAFill',b.taFill);
  suToggle('blArc',c.build); suToggle('blChorus',c.on);

  /* --- Lanes: erst das Modell, dann genau ein Neuaufbau der Oberfläche --- */
  if(S.lanes&&S.lanes.length){
    S.lanes.forEach(function(st){
      if(!st||!st.id)return;
      var L=null;
      for(var i=0;i<LANES.length;i++)if(LANES[i].id===st.id)L=LANES[i];
      if(!L)return;
      if(typeof st.on==='boolean')L.on=st.on;
      if(typeof st.lock==='boolean')L.lock=st.lock;
      if(typeof st.ch==='number'&&st.ch>=0&&st.ch<16)L.ch=st.ch;
      ['prog','oct','vel','dens','fill','seed','arpOct','gate'].forEach(function(k){
        if(typeof st[k]==='number')L[k]=st[k];});
      if(typeof st.swing==='number')L.swing=clamp(st.swing,-1,100);
      if(typeof st.vspread==='number')L.vspread=clamp(st.vspread,0,24);
      if(typeof st.rate==='string'&&RATES[st.rate])L.rate=st.rate;
      if(typeof st.style==='string'&&LANE_STYLES[L.id].some(function(x){return x[0]===st.style;}))L.style=st.style;
    });
  }
  buildLanes(); updateChMon(); renderChMap(); saveLaneState(); refreshSwingLabels();

  /* --- Band-Presets: nur die Schalter. Das Preset selbst wird NICHT erneut
         angewandt, sonst überschreibt es die gerade geladenen Lane-Styles. --- */
  var bd=S.band||{};
  suToggle('bandTempo',bd.tempo); suToggle('bandLanes',bd.lanes);
  var bs=suEl('bandSel'); if(bs&&bd.sel!==undefined&&bd.sel!==null)bs.value=bd.sel;

  /* --- Routing / Export --- */
  var r=S.route||{}, ex=S.exp||{};
  suPut('allCh',r.allCh); suToggle('chGuard',r.guard);
  suPut('expRep',ex.rep); suPut('expVary',ex.vary); suPut('expHum',ex.hum);

  /* --- Cubase-Optionen ohne Ports --- */
  var sy=S.sync||{};
  suPut('syncStart',sy.start); suPut('cubAct',sy.cubAct); suPut('mmcDev',sy.mmcDev);
  suPut('countIn',sy.countIn); suPut('cubStop',sy.cubStop);
  if(typeof saveSync==='function')saveSync();

  /* --- Progression zuletzt: applySeq baut Takte und Anzeige mit der neuen Tonart --- */
  var p=S.prog||{};
  if(typeof p.text==='string'){
    suEl('chordInput').value=p.text;
    suPut('barsPerChord',p.bars); suPut('defType',p.defType);
    var pp=suEl('progPreset'); if(pp)pp.value=p.preset||'';
    if(p.text.trim()){
      applySeq();
      if(p.lock&&p.lock.length){
        barLock=[]; for(var k=0;k<gBars.length;k++)barLock.push(!!p.lock[k]);
      }
    }else{
      gSeq=[];gBars=[];barLock=[];barVar=[];
      suEl('cdisp').innerHTML='';
    }
  }
  refreshHarmony(); syncInfo(); reloadFromCurrent();
  return true;
}

/* --- Ablage ------------------------------------------------- */
function readSetups(){
  try{var o=JSON.parse(localStorage.getItem(LS_SETUPS)||'{}');return (o&&typeof o==='object')?o:{};}
  catch(e){return {};}
}
function writeSetups(o){
  try{localStorage.setItem(LS_SETUPS,JSON.stringify(o));return true;}
  catch(e){log('Setup konnte nicht gespeichert werden – Speicher voll oder gesperrt.','e');return false;}
}
function setupMeta(){try{return JSON.parse(localStorage.getItem(LS_SETUP_META)||'{}')||{};}catch(e){return {};}}
function writeSetupMeta(m){try{localStorage.setItem(LS_SETUP_META,JSON.stringify(m));}catch(e){}}

function autoSetupName(){
  var k=''; try{k=nameIn(curKey(),curKey());}catch(e){}
  var d=new Date(), p=function(n){return (n<10?'0':'')+n;};
  return (k?k+' · ':'')+suVal('bpm')+' BPM · '+p(d.getDate())+'.'+p(d.getMonth()+1)+'. '+p(d.getHours())+':'+p(d.getMinutes());
}
function buildSetupList(sel){
  var box=suEl('suList'); if(!box)return;
  var o=readSetups(), keys=Object.keys(o).sort(function(a,b){
    return String(o[b].ts||'').localeCompare(String(o[a].ts||''));});
  box.innerHTML=keys.length?'':'<option value="">&mdash; keine gespeichert &mdash;</option>';
  keys.forEach(function(k){
    var op=document.createElement('option'), t=String(o[k].ts||'');
    op.value=k;
    op.textContent=k+(t.length>=10?'   ['+t.slice(8,10)+'.'+t.slice(5,7)+'.'+t.slice(2,4)+']':'');
    box.appendChild(op);
  });
  if(sel&&o[sel])box.value=sel;
  suInfo(keys.length?(keys.length+' Setup(s) gespeichert.'):'Noch kein Setup gespeichert.');
}
function saveSetup(name){
  name=String(name||'').trim();
  if(!name)name=autoSetupName();
  var o=readSetups(), existed=!!o[name];
  o[name]=collectSetup();
  if(!writeSetups(o))return;
  var m=setupMeta(); m.last=name; writeSetupMeta(m);
  if(suEl('suName'))suEl('suName').value=name;
  buildSetupList(name);
  log('Setup '+(existed?'überschrieben':'gespeichert')+': '+name,'ok');
}
function loadSetupByName(n){
  var o=readSetups();
  if(!o[n]){log('Setup nicht gefunden: '+n,'e');return false;}
  if(!applySetup(o[n])){log('Setup ist beschädigt: '+n,'e');return false;}
  if(suEl('suName'))suEl('suName').value=n;
  var m=setupMeta(); m.last=n; writeSetupMeta(m);
  log('Setup geladen: '+n,'ok');
  return true;
}
function suFileName(n){return String(n).replace(/[\\/:*?"<>|]+/g,'-').slice(0,80);}
function exportSetups(){
  var n=suVal('suList'), o=readSetups(), data, fn;
  if(n&&o[n]){ data={type:'midiperfect4.setup',name:n,setup:o[n]}; fn='MP2 Setup '+suFileName(n)+'.json'; }
  else { data={type:'midiperfect4.setups',setups:o}; fn='MP2 Setups.json'; }
  var blob=new Blob([JSON.stringify(data,null,1)],{type:'application/json'});
  var a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=fn; a.click();
  setTimeout(function(){URL.revokeObjectURL(a.href);},4000);
  log('Exportiert: '+fn,'ok');
}
function importSetups(file){
  var r=new FileReader();
  r.onload=function(){
    var d;
    try{ d=JSON.parse(String(r.result)); }
    catch(e){ log('Import fehlgeschlagen – keine gültige JSON-Datei.','e'); return; }
    var o=readSetups(), n=0, last='';
    function put(k,v){
      if(!v||typeof v!=='object'||!v.glob)return;
      k=String(k||'Import'); while(o[k])k=k+' (2)';
      o[k]=v; last=k; n++;
    }
    if(d&&d.setups&&typeof d.setups==='object'){ for(var k in d.setups)put(k,d.setups[k]); }
    else if(d&&d.setup){ put(d.name,d.setup); }
    else if(d&&d.glob){ put('Import',d); }
    if(!n){ log('Datei enthält kein MIDI-PERFECT-Setup.','e'); return; }
    if(!writeSetups(o))return;
    buildSetupList(last);
    log(n+' Setup(s) importiert · zuletzt: '+last,'ok');
  };
  r.readAsText(file);
}
/* Der Stand beim Schließen wird immer mitgeschrieben – einmal vergessen zu
   speichern soll keine halbe Stunde Arbeit kosten. */
window.addEventListener('beforeunload',function(){
  try{localStorage.setItem(LS_SETUP_AUTO,JSON.stringify(collectSetup()));}catch(e){}
});
function initSetups(){
  buildSetupList();
  var m=setupMeta();
  if(m.autoload&&suEl('suAuto')){ suEl('suAuto').classList.add('on'); suEl('suAuto').innerHTML='&#9679; Autoload'; }
  if(suEl('suName'))suEl('suName').value=m.last||'';
  suEl('btnSuSave').onclick=function(){saveSetup(suVal('suName'));};
  if(suEl('btnSuQuick'))suEl('btnSuQuick').onclick=function(){saveSetup(suVal('suName'));};
  suEl('btnSuLoad').onclick=function(){
    var n=suVal('suList'); if(!n){log('Kein Setup gewählt.','w');return;}
    loadSetupByName(n);
  };
  suEl('suList').ondblclick=function(){ if(this.value)loadSetupByName(this.value); };
  suEl('suList').onchange=function(){ if(this.value&&suEl('suName'))suEl('suName').value=this.value; };
  suEl('btnSuDel').onclick=function(){
    var n=suVal('suList'); if(!n){log('Kein Setup gewählt.','w');return;}
    if(!confirm('Setup „'+n+'“ wirklich löschen?'))return;
    var o=readSetups(); delete o[n]; writeSetups(o);
    var mm=setupMeta(); if(mm.last===n){delete mm.last;writeSetupMeta(mm);}
    buildSetupList(); log('Setup gelöscht: '+n,'w');
  };
  suEl('suAuto').onclick=function(){
    var on=this.classList.toggle('on');
    this.innerHTML=(on?'&#9679;':'&#9675;')+' Autoload';
    var mm=setupMeta(); mm.autoload=on; writeSetupMeta(mm);
    log(on?'Autoload an – beim Start wird „'+(mm.last||'—')+'“ geladen':'Autoload aus','m');
  };
  suEl('btnSuExport').onclick=exportSetups;
  suEl('btnSuImport').onclick=function(){suEl('suFile').click();};
  suEl('suFile').onchange=function(){ if(this.files&&this.files[0])importSetups(this.files[0]); this.value=''; };
  suEl('btnSuLast').onclick=function(){
    var raw=null; try{raw=localStorage.getItem(LS_SETUP_AUTO);}catch(e){}
    if(!raw){log('Kein automatischer Stand vorhanden.','w');return;}
    try{
      if(applySetup(JSON.parse(raw)))log('Stand vor dem Schließen wiederhergestellt','ok');
      else log('Automatischer Stand ist beschädigt.','e');
    }catch(e){log('Automatischer Stand ist beschädigt.','e');}
  };
  document.addEventListener('keydown',function(e){
    if(!(e.metaKey||e.ctrlKey))return;
    if(e.key!=='s'&&e.key!=='S')return;
    e.preventDefault(); saveSetup(suVal('suName'));
  });
  if(m.autoload&&m.last){
    if(readSetups()[m.last])loadSetupByName(m.last);
    else log('Autoload: Setup „'+m.last+'“ ist nicht mehr vorhanden','w');
  }
}
/* --- Zweisprachigkeit nachtragen ---------------------------- */
(function(){
  var add={
   '\ud83d\udcbe Setups':'\ud83d\udcbe Setups',
   '\ud83d\udcbe Setup speichern':'\ud83d\udcbe Save setup',
   'Kompletter Arbeitsstand in einem Namen':'The complete working state under one name',
   'z. B. Slow Blues in A':'e.g. slow blues in A',
   'Gespeicherte Setups':'Saved setups',
   '\u2014 keine gespeichert \u2014':'\u2014 none saved \u2014',
   '\u21a9 Laden':'\u21a9 Load',
   '\u2716 L\u00f6schen':'\u2716 Delete',
   '\u25cb Autoload':'\u25cb Autoload',
   '\u25cf Autoload':'\u25cf Autoload',
   '\u2b07 Als .json sichern':'\u2b07 Save as .json',
   '\u2b06 .json laden':'\u2b06 Load .json',
   '\u21bb Stand vor dem Schlie\u00dfen':'\u21bb State before closing',
   'Noch kein Setup gespeichert.':'No setup saved yet.',
   'Aktuellen Stand als Setup speichern (Cmd/Strg+S)':'Save the current state as a setup (Cmd/Ctrl+S)',
   'Beim Start automatisch das zuletzt gespeicherte Setup laden':'Load the last saved setup automatically on start',
   'Der Stand, wie er beim letzten Schlie\u00dfen der Seite war':'The state as it was when the page was last closed',
   'Gew\u00e4hltes Setup als Datei sichern \u2013 ohne Auswahl werden alle gesichert':'Save the selected setup to a file \u2013 with no selection all of them are saved'
  };
  for(var k in add)if(!I18N[k])I18N[k]=add[k];
  I18N_PAT.push([/^(\d+) Setup\(s\) gespeichert\.$/,'$1 setup(s) saved.']);
  I18N_LOG.push([/^Setup gespeichert: (.*)$/,'Setup saved: $1']);
  I18N_LOG.push([/^Setup \u00fcberschrieben: (.*)$/,'Setup overwritten: $1']);
  I18N_LOG.push([/^Setup geladen: (.*)$/,'Setup loaded: $1']);
  I18N_LOG.push([/^Setup gel\u00f6scht: (.*)$/,'Setup deleted: $1']);
  I18N_LOG.push([/^Setup nicht gefunden: (.*)$/,'Setup not found: $1']);
  I18N_LOG.push([/^Kein Setup gew\u00e4hlt\.$/,'No setup selected.']);
  I18N_LOG.push([/^(\d+) Setup\(s\) importiert \u00b7 zuletzt: (.*)$/,'$1 setup(s) imported \u00b7 last: $2']);
  I18N_LOG.push([/^Exportiert: (.*)$/,'Exported: $1']);
  I18N_LOG.push([/^Stand vor dem Schlie\u00dfen wiederhergestellt$/,'State before closing restored']);
  I18N_LOG.push([/^Kein automatischer Stand vorhanden\.$/,'No automatic state available.']);
  I18N_LOG.push([/^Autoload an \u2013 beim Start wird \u201e(.*)\u201c geladen$/,'Autoload on \u2013 \u201c$1\u201d will be loaded on start']);
  I18N_LOG.push([/^Autoload aus$/,'Autoload off']);
})();

/* ============================================================
   11 · INIT
   ============================================================ */
(function(){
  var sel=document.getElementById('allCh'),h='';
  for(var i=0;i<16;i++)h+='<option value="'+i+'"'+(i===0?' selected':'')+'>Kanal '+(i+1)+'</option>';
  sel.innerHTML=h;
})();
document.getElementById('btnGM').onclick=function(){setPrograms(true);};
document.getElementById('btnNoGM').onclick=function(){setPrograms(false);};
document.getElementById('bandLanes').onclick=function(){
  this.classList.toggle('on');
  var on=this.classList.contains('on');
  this.innerHTML=(on?'&#9679;':'&#9675;')+' Lane On/Off übernehmen';
  log(on?'Band-Presets schalten Lanes ein/aus':'Band-Presets lassen deine Lane-Schaltung in Ruhe','m');
};
document.getElementById('btnResetLanes').onclick=function(){
  clearLaneState();
  location.reload();
};
document.getElementById('lanes').addEventListener('change',saveLaneState);
document.getElementById('chGuard').onclick=function(){
  chGuard=!chGuard; this.classList.toggle('on',chGuard);
  this.innerHTML=(chGuard?'&#9679;':'&#9675;')+' Kanalsperre';
  log(chGuard?'Kanalsperre AN – es geht nur noch auf '+LANES.filter(function(L){return L.on;})
        .map(function(L){return 'Ch'+(L.ch+1);}).join(', ')+' etwas raus'
      :'Kanalsperre AUS','m');
};
document.getElementById('monTgl').onclick=function(){
  monOn=!monOn; this.classList.toggle('on',monOn);
  this.innerHTML=(monOn?'&#9679;':'&#9675;')+' MIDI-Monitor';
  document.getElementById('mlog').style.display=monOn?'block':'none';
};
document.getElementById('btnMonClear').onclick=function(){
  document.getElementById('mlog').innerHTML=''; monN=0; resetChMon();
};
document.getElementById('btnAllCh').onclick=function(){setAllChannels(false);};
document.getElementById('btnSpreadCh').onclick=function(){setAllChannels(true);};
(function(){
  var sel=document.getElementById('keyPc'),h='';
  for(var i=0;i<12;i++)h+='<option value="'+i+'"'+(i===9?' selected':'')+'>'+SHARPN[i]+(FLATN[i]!==SHARPN[i]?' / '+FLATN[i]:'')+'</option>';
  sel.innerHTML=h;
})();
buildPiano();
loadSyncControls();
var lsRestored=loadLaneState();
buildLanes();
buildChMon();
renderChMap();
buildPresets();
buildBands();
applySeq();
document.getElementById('keyMode').value='mixolydian';
refreshHarmony();
document.getElementById('bandTempo').classList.add('on');
document.getElementById('bandTempo').innerHTML='&#9679; Tempo/Swing übernehmen';
document.getElementById('bandLanes').classList.add('on');
document.getElementById('bandLanes').innerHTML='&#9679; Lane On/Off übernehmen';
log(lsRestored?'Lane-Zustand aus letzter Sitzung wiederhergestellt: '+
      LANES.map(function(L){return L.name+'='+(L.on?'ON Ch'+(L.ch+1):'off');}).join(' · ')
    :'Lane-Werkseinstellung geladen: '+
      LANES.map(function(L){return L.name+'='+(L.on?'ON Ch'+(L.ch+1):'off');}).join(' · '),'i');
syncInfo();
['bpm','swing'].forEach(function(id){document.getElementById(id).addEventListener('input',syncInfo);});
/* --- Blues-Werkstatt verdrahten ----------------------------- */
(function(){
  var kh='',th='';
  for(var i=0;i<12;i++){
    var nm=SHARPN[i]+(FLATN[i]!==SHARPN[i]?' / '+FLATN[i]:'');
    kh+='<option value="'+i+'"'+(i===9?' selected':'')+'>'+nm+'</option>';
    th+='<option value="'+i+'"'+(i===9?' selected':'')+'>'+nm+'</option>';
  }
  document.getElementById('blKey').innerHTML=kh;
  document.getElementById('blTo').innerHTML=th;
  document.getElementById('blForm').innerHTML=Object.keys(BLUES_FORMS).map(function(k){
    return '<option value="'+k+'"'+(k==='std12'?' selected':'')+'>'+BLUES_FORMS[k][0]+'</option>';}).join('');
  document.getElementById('blTA').innerHTML=Object.keys(BLUES_TA).map(function(k){
    return '<option value="'+k+'"'+(k==='v'?' selected':'')+'>'+BLUES_TA[k][0]+'</option>';}).join('');
})();
buildTempoFields();
document.getElementById('blBuild').onclick=buildBluesProgression;
document.getElementById('blQC').onclick=function(){
  blQuickChange=!blQuickChange;
  this.classList.toggle('on',blQuickChange);
  this.innerHTML=(blQuickChange?'&#9679;':'&#9675;')+' Quick-Change';
};
document.getElementById('blUp').onclick=function(){transposeBy(1);};
document.getElementById('blDown').onclick=function(){transposeBy(-1);};
document.getElementById('blToGo').onclick=function(){
  var t=parseInt(document.getElementById('blTo').value,10);
  var semi=((t-curKey())%12+12)%12;
  if(!semi){log('Progression steht bereits in '+nameIn(t,t),'i');return;}
  transposeBy(semi);
};
document.getElementById('blCycle').onclick=cycleKey;
document.getElementById('blGroove').onclick=function(){
  grooveLock=!grooveLock;
  this.classList.toggle('on',grooveLock);
  this.innerHTML=(grooveLock?'&#9679;':'&#9675;')+' Groove-Kopplung';
  buildLanes(); refreshSwingLabels(); reloadFromCurrent();
  log(grooveLock?'Groove-Kopplung AN – DRUMS, BASS und CHORDS ziehen denselben Swing ('+globalSwing()+' %)'
                :'Groove-Kopplung AUS – jede Lane schwingt für sich. Bass und Drums nur bewusst auseinanderziehen.','m');
};
document.getElementById('blTAFill').onclick=function(){
  taFill=!taFill;
  this.classList.toggle('on',taFill);
  this.innerHTML=(taFill?'&#9679;':'&#9675;')+' Turnaround-Fill';
  reloadFromCurrent();
  log(taFill?'Turnaround-Fill an – letzter Takt der Form bekommt immer einen Fill':'Turnaround-Fill aus','m');
};
document.getElementById('blChorus').onclick=function(){
  CHORUS.on=!CHORUS.on;
  this.classList.toggle('on',CHORUS.on);
  this.innerHTML=(CHORUS.on?'&#9679;':'&#9675;')+' Chorus-Dynamik';
  document.getElementById('blChInfo').textContent=CHORUS.on
    ?('Bogen über '+CHORUS.len+' Chorusse · Ride ab Chorus '+(CHORUS.ride+1)):'Aus.';
  reloadFromCurrent(); sendChorusCC();
  log(CHORUS.on?'Chorus-Dynamik AN – Bogen über '+CHORUS.len+' Durchläufe, Ride ab Chorus '+(CHORUS.ride+1)+
      ', Expression CC'+CHORUS.cc:'Chorus-Dynamik AUS','m');
};
document.getElementById('blArc').onclick=function(){
  CHORUS.build=!CHORUS.build;
  this.classList.toggle('on',CHORUS.build);
  this.innerHTML=(CHORUS.build?'&#9679;':'&#9675;')+' Arrangement-Bogen';
  reloadFromCurrent();
  log(CHORUS.build?'Arrangement-Bogen an – Stufe 0 nur Grundgerüst, dann schichtweise Aufbau'
                  :'Arrangement-Bogen aus – Chorus-Dynamik ändert nur Lautstärke und Becken','m');
};
document.getElementById('blChLen').onchange=function(){
  CHORUS.len=parseInt(this.value,10)||4; reloadFromCurrent(); sendChorusCC();
};
document.getElementById('blChRide').onchange=function(){
  CHORUS.ride=parseInt(this.value,10); reloadFromCurrent();
};
document.getElementById('blChCC').onchange=function(){
  CHORUS.cc=clamp(parseInt(this.value,10)||0,0,127); sendChorusCC();
};
document.getElementById('blChAmp').oninput=function(){
  CHORUS.amp=parseInt(this.value,10)||0;
  document.getElementById('blChAmpVal').textContent=this.value;
  reloadSoon();
};
document.getElementById('bbeat').oninput=function(){
  document.getElementById('bbeatVal').textContent=this.value;
  reloadSoon();
};
document.getElementById('swing').addEventListener('input',refreshSwingLabels);
refreshSwingLabels();
log('Blues-Werkstatt aktiv · Groove-Kopplung an · Backbeat 10 · Turnaround-Fill an','ok');
log('MIDI PERFECT 4 bereit · SPACE = Play/Stop · R = Reroll · D = Styles würfeln','ok');
log('Styles gesamt: '+LANES.map(function(L){return L.name+' '+LANE_STYLES[L.id].length;}).join(' · ')+
    ' · Drum-Patterns: '+LANE_STYLES.drums.length+' · Band-Presets: '+Object.keys(BANDS).length,'i');
initSetups();

/* --- Taktart ------------------------------------------------------------ */
var LS_METER='midiperfect3.meter';
function updateBeatDots(){
  for(var j=0;j<4;j++){var d=document.getElementById('b'+j);if(d)d.style.display=(j<METER.pulses)?'':'none';}
}
function setMeter(mid,quiet){
  var m=METERS[mid]||METERS['4/4'];
  var was=METER.id;
  METER=m; BAR=m.barTicks;
  var sel=gEl('meterSel'); if(sel&&sel.value!==m.id)sel.value=m.id;
  /* Styles pruefen: was es in der Taktart nicht gibt, faellt auf deren
     Standard - sichtbar im Protokoll, nicht heimlich. */
  for(var i=0;i<LANES.length;i++){
    var L=LANES[i];
    if(!styleAllowed(L.id,L.style)){
      var d=meterDefaultStyle(L.id);
      if(d&&styleAllowed(L.id,d)){ L.style=d; if(!quiet)log(L.name+': Style in '+m.id+' nicht verf\u00fcgbar \u2192 '+styleLabel(L.id,d),'w'); }
    }
  }
  buildLanes(); saveLaneState();
  updateBeatDots();
  if(playing){ stopTransport(false); if(!quiet)log('Taktartwechsel stoppt den Transport.','w'); }
  try{localStorage.setItem(LS_METER,m.id);}catch(e){}
  if(!quiet&&was!==m.id)
    log('Taktart '+m.id+' \u2013 MIDI Clock \u00fcbertr\u00e4gt keine Taktart, in Cubase von Hand mitziehen. SMF-Export tr\u00e4gt sie korrekt.','w');
  try{document.dispatchEvent(new CustomEvent('mp-meter'));}catch(e){}
}
(function(){
  var sel=gEl('meterSel');
  if(sel)sel.addEventListener('change',function(){setMeter(this.value);});
  var saved=null; try{saved=localStorage.getItem(LS_METER);}catch(e){}
  if(saved&&METERS[saved]&&saved!=='4/4')setMeter(saved,true);
  updateBeatDots();
})();

document.getElementById('langTgl').onclick=function(){ setLang(LANG==='en'?'de':'en'); };
initI18n();

