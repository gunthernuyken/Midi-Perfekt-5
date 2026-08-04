# -*- coding: utf-8 -*-
"""Baut MIDI PERFECT 5 aus den Werkstatt-Quellen.

Basis ist die Werkstatt von Version 4 (engine.js als echte Quelldatei).
Neu in Version 5: der MIDI-Importer (import.js) als eigener Script-Block
zwischen Engine und Huelle — reine Analyse, exportiert nur MP5IMP. Die
Import-UI (Review, Uebernehmen) lebt in body.html/shell.js.

Pfade sind relativ zum Skript: python3 build.py baut ../MIDI PERFECT 5.html.
"""
import io, os, re, sys

VER   = '5'
HERE  = os.path.dirname(os.path.abspath(__file__))
DST   = os.path.join(HERE, os.pardir, 'MIDI PERFECT %s.html' % VER)
BUILD = 'BUILD 2026-08-02-A'

def src(name):
    return io.open(os.path.join(HERE, name), encoding='utf-8').read()

engine= src('engine.js')
css   = src('mp3.css')
compat= src('compat.css')
layout= src('layout.css')
body  = src('body.html')
shell = src('shell.js')
imp   = src('import.js')

def sub1(text, old, new, what):
    if text.count(old) != 1:
        raise SystemExit('%s: %d Treffer statt 1 fuer %r' % (what, text.count(old), old[:70]))
    return text.replace(old, new)

out = u'''<!DOCTYPE html>
<html lang="de"><head><meta charset="UTF-8">
<title>MIDI PERFECT 3</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
%s
%s
</style></head><body>
%s
<script>
"use strict";
%s</script>
<script>
%s
</script>
<script>
%s
</script>
</body></html>
''' % (css, compat + '\n' + layout, body, engine, imp, shell)

# Build-Kennung: sub1 statt replace - fehlt der Anker, bricht der Bau ab.
out = sub1(out,
    '<small id="buildTag">BUILD 2026-08-01-A</small>',
    '<small id="buildTag">%s</small>' % BUILD,
    'Build-Kennung')

# Versionsname und Speicher-Namensraum. Die Quellen tragen teils noch 3er-
# und 4er-Bezeichner — beide werden normalisiert. "MIDI PERFECT 2" bleibt:
# das sind historische Verweise auf die Herkunft der Engine.
for old in ('3', '4'):
    out = out.replace('MIDI PERFECT&nbsp;' + old, 'MIDI PERFECT&nbsp;' + VER)
    out = out.replace('MIDI PERFECT ' + old, 'MIDI PERFECT ' + VER)
    out = out.replace('midiperfect' + old + '.', 'midiperfect' + VER + '.')

io.open(DST, 'w', encoding='utf-8').write(out)

# --- Abgleich: kennt die Huelle jede ID, die die Engine anspricht? --------
used = set()
for pat in (r"getElementById\(\s*'([^']+)'", r"gEl\(\s*'([^']+)'", r"suEl\(\s*'([^']+)'",
            r"suVal\(\s*'([^']+)'", r"suOn\(\s*'([^']+)'", r"suPut\(\s*'([^']+)'",
            r"suToggle\(\s*'([^']+)'", r"querySelector\(\s*'#([\w-]+)"):
    used |= set(re.findall(pat, engine))
have = set(re.findall(r'\sid="([^"]+)"', body)) | set(re.findall(r'id="([^"]+)"', engine))
dynamic = {'b', 'cblock', 'chc', 'chn', 'key', 'tbb'}
missing = sorted(x for x in used if x not in have and x not in dynamic and not re.match(r'^b\d$', x))
extra_b = [x for x in ('b0','b1','b2','b3') if x not in have]

print('Datei: %s  (%d KB)' % (DST, len(out) // 1024))
print('Engine spricht %d IDs an.' % len(used))
if missing or extra_b:
    print('FEHLEND IM MARKUP: %s' % ', '.join(missing + extra_b))
    sys.exit(1)
print('ID-Abgleich: vollstaendig.')
