#!/usr/bin/env python3
# Erzeugt Test-SMFs fuer den MP5-Importer. Kein mido noetig - rohe Bytes.
import struct, random
random.seed(42)
PPQ = 480
def vlq(n):
    out = [n & 0x7F]; n >>= 7
    while n: out.append(0x80 | (n & 0x7F)); n >>= 7
    return bytes(reversed(out))
def track(events):
    # events: list of (abstick, bytes)
    events = sorted(events, key=lambda e: e[0])
    data = b''; last = 0
    for t, ev in events:
        data += vlq(t - last) + ev; last = t
    data += vlq(0) + b'\xff\x2f\x00'
    return b'MTrk' + struct.pack('>I', len(data)) + data
def smf(tracks, fmt=1):
    return b'MThd' + struct.pack('>IHHH', 6, fmt, len(tracks), PPQ) + b''.join(tracks)
def note(ev, ch, p, v, t, d):
    ev.append((t, bytes([0x90 | ch, p, v])))
    ev.append((t + d, bytes([0x80 | ch, p, 0])))
def tempo_ts(bpm, num, den, texts=None):
    ev = [(0, b'\xff\x51\x03' + struct.pack('>I', int(60000000 / bpm))[1:]),
          (0, b'\xff\x58\x04' + bytes([num, {1:0,2:1,4:2,8:3}[den], 24, 8]))]
    if texts:
        for t, s in texts:
            b = s.encode('ascii')
            ev.append((t, b'\xff\x01' + vlq(len(b)) + b))
    return ev

NOTE = {'C':0,'C#':1,'D':2,'D#':3,'E':4,'F':5,'F#':6,'G':7,'G#':8,'A':9,'A#':10,'B':11}
TPL = {'maj':[0,4,7], 'min':[0,3,7], '7':[0,4,7,10], 'm7':[0,3,7,10], 'maj7':[0,4,7,11]}

# Hotel California Verse (h-Moll): Bm F#7 A E7 G D Em F#7
PROG = [('B','min'),('F#','7'),('A','maj'),('E','7'),('G','maj'),('D','maj'),('Em','_'),('F#','7')]
PROG = [('B','min'),('F#','7'),('A','maj'),('E','7'),('G','maj'),('D','maj'),('E','min'),('F#','7')]

def build_hotel(rounds=2, with_texts=False, fmt=1, straight=True):
    bar = PPQ * 4
    bass, pad, mel, dr = [], [], [], []
    texts = []
    NAMES = {'min':'m','7':'7','maj':'','m7':'m7','maj7':'maj7'}
    for r in range(rounds):
        for bi, (rn, ty) in enumerate(PROG):
            t0 = (r * len(PROG) + bi) * bar
            root = NOTE[rn]
            if with_texts:
                texts.append((t0, rn + NAMES[ty]))
            # Bass: Grundton-Achtel mit Quinte auf 3, gelegentlicher Durchgang
            bp = 36 + root if 36 + root < 45 else 24 + root + 12
            for e in range(8):
                p = bp
                if e in (4, 5): p = bp + 7
                if e == 7 and random.random() < 0.5: p = bp + (2 if random.random() < .5 else -1)
                note(bass, 1, p, 96 + random.randint(-8, 8), t0 + e * PPQ // 2, PPQ // 2 - 20)
            # Pad: Voicing ganztaktig (Root+Terz+Quinte+ggf.Septime), Mittellage
            for iv in TPL[ty]:
                note(pad, 2, 60 + (root + iv) % 12, 72 + random.randint(-6, 6), t0 + 10, bar - 40)
            # Anschlag-Wiederholung auf Schlag 3 (Gitarren-Feel)
            for iv in TPL[ty][:3]:
                note(pad, 2, 60 + (root + iv) % 12, 64, t0 + 2 * PPQ, PPQ - 30)
            # Melodie: noodelt in h-Moll-Pentatonik, ignoriert den Akkord teils
            pent = [71, 74, 76, 78, 81, 83, 86]
            t = t0
            while t < t0 + bar - PPQ // 4:
                d = random.choice([PPQ // 2, PPQ // 2, PPQ, PPQ // 4])
                p = random.choice(pent) + random.choice([0, 0, 0, 1, -1])  # auch Nicht-Skalentoene
                note(mel, 3, p, 80 + random.randint(-15, 10), t, d - 15)
                t += d
            # Drums ch10: Kick 1/3, Snare 2/4, HH-Achtel
            for e in range(8):
                off = e * PPQ // 2
                note(dr, 9, 42, 70, t0 + off, 60)  # HH
            for beat, p in ((0, 36), (1, 38), (2, 36), (3, 38)):
                note(dr, 9, p, 100, t0 + beat * PPQ, 80)
    t0ev = tempo_ts(74, 4, 4, texts if with_texts else None)
    if fmt == 0:
        allev = t0ev + bass + pad + mel + dr
        return smf([track(allev)], 0)
    return smf([track(t0ev), track(bass), track(pad), track(mel), track(dr)], 1)

def build_waltz():
    # 3/4-Test: Am F C G, 8 Takte x2
    prog = [('A','min'),('F','maj'),('C','maj'),('G','maj')] * 2
    bar = PPQ * 3
    bass, pad = [], []
    for r in range(2):
        for bi, (rn, ty) in enumerate(prog):
            t0 = (r * len(prog) + bi) * bar
            root = NOTE[rn]
            note(bass, 1, 36 + root, 100, t0, PPQ - 20)
            for b in (1, 2):
                for iv in TPL[ty]:
                    note(pad, 2, 60 + (root + iv) % 12, 70, t0 + b * PPQ, PPQ - 30)
    return smf([track(tempo_ts(140, 3, 4)), track(bass), track(pad)], 1)

def jitter(data_builder, amount=20, swing=False):
    # baut hotel neu und verschiebt alle Kanal-Events zufaellig / swingt Offbeats
    global _JIT, _SWING
    _JIT, _SWING = amount, swing
    try:
        return data_builder()
    finally:
        _JIT, _SWING = 0, False
_JIT, _SWING = 0, False
_orig_note = note
def note(ev, ch, p, v, t, d):  # noqa: F811
    if _SWING and ch != 0:
        r = t % PPQ
        if abs(r - PPQ // 2) < 30:  # Offbeat-Achtel nach hinten (2:1)
            t = t - r + int(PPQ * 2 / 3)
    if _JIT and ch != 0:
        t = max(0, t + random.randint(-_JIT, _JIT))
    _orig_note(ev, ch, p, v, t, d)

open('hotel.mid', 'wb').write(build_hotel(rounds=2))
open('hotel_human.mid', 'wb').write(jitter(lambda: build_hotel(rounds=2), amount=20))
open('hotel_swing.mid', 'wb').write(jitter(lambda: build_hotel(rounds=2), amount=0, swing=True))
open('hotel_text.mid', 'wb').write(build_hotel(rounds=2, with_texts=True))
open('hotel_fmt0.mid', 'wb').write(build_hotel(rounds=2, fmt=0))
open('waltz.mid', 'wb').write(build_waltz())
print('ok')
