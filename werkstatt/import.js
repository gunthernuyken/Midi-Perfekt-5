/* ============================================================
   MIDI PERFECT 5 · IMPORTER  (werkstatt/import.js)
   SMF einlesen -> Akkordfolge, Tonart, Taktart, Tempo, Feel.
   Reines Analyse-Frontend: erzeugt den Token-String fuer
   chordInput (parseToken/applySeq der Engine bleiben unberuehrt)
   plus Vorschlagswerte. Importiert werden PARAMETER, nie Noten.
   ES5, IIFE, exportiert nur MP5IMP.
   ============================================================ */
var MP5IMP=(function(){
'use strict';
/* ---------- 0 · Vokabular: exakt die Typen der Engine ---------- */
/* Intervallschablonen relativ zum Grundton. Nur was die Engine in
   SUF/TYPESUF kennt — der Importer darf nichts erfinden, was
   parseToken() hinterher ablehnt. */
var TPL={
 maj:[0,4,7], min:[0,3,7], '7':[0,4,7,10], maj7:[0,4,7,11], m7:[0,3,7,10],
 '6':[0,4,7,9], m6:[0,3,7,9], '9':[0,2,4,7,10], m9:[0,2,3,7,10], maj9:[0,2,4,7,11],
 '13':[0,4,7,9,10], dim:[0,3,6], dim7:[0,3,6,9], m7b5:[0,3,6,10], aug:[0,4,8],
 '7#9':[0,3,4,7,10], '7b9':[0,1,4,7,10], sus4:[0,5,7], '7sus4':[0,5,7,10], sus2:[0,2,7]};
/* Kandidaten der ersten Reihe: was Begleit-Praxis traegt. Erweiterte
   Typen (9/13/#9/b9) nur bei starker Evidenz zulassen, sonst raten
   sie sich aus Melodietoenen zusammen. */
var CORE=['maj','min','7','maj7','m7','6','m6','m7b5','dim','dim7','aug','sus4','sus2'];
var EXT=['9','m9','maj9','13','7#9','7b9','7sus4'];
var TYPESUF={maj:'maj',min:'m','7':'7',maj7:'maj7',m7:'m7','6':'6',m6:'m6','9':'9',m9:'m9',
 maj9:'maj9','13':'13',dim:'dim',dim7:'dim7',m7b5:'m7b5',aug:'aug','7#9':'7#9','7b9':'7b9',
 sus4:'sus4','7sus4':'7sus4',sus2:'sus2'};
/* Text-Event-Abkuerzung: dieselben Schreibweisen wie SUF der Engine */
var SUF={'':'maj','m':'min','min':'min','-':'min','maj':'maj','major':'maj','7':'7','maj7':'maj7',
 'M7':'maj7','ma7':'maj7','m7':'m7','-7':'m7','min7':'m7','6':'6','m6':'m6','min6':'m6','9':'9',
 'm9':'m9','min9':'m9','maj9':'maj9','13':'13','dim':'dim','o':'dim','dim7':'dim7','o7':'dim7',
 'm7b5':'m7b5','h7':'m7b5','aug':'aug','+':'aug','7#9':'7#9','7+9':'7#9','7b9':'7b9','7-9':'7b9',
 'sus4':'sus4','sus':'sus4','7sus4':'7sus4','sus2':'sus2'};
var NMAP={'C':0,'C#':1,'DB':1,'D':2,'D#':3,'EB':3,'E':4,'F':5,'F#':6,'GB':6,'G':7,'G#':8,'AB':8,
 'A':9,'A#':10,'BB':10,'B':11,'H':11};
var SHARPN=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
var FLATN =['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
var FLATKEYS={5:1,10:1,3:1,8:1,1:1,6:1};
/* Krumhansl-Kessler-Profile fuer die Tonartschaetzung */
var KMAJ=[6.35,2.23,3.48,2.33,4.38,4.09,2.52,5.19,2.39,3.66,2.29,2.88];
var KMIN=[6.33,2.68,3.52,5.38,2.60,3.53,2.54,4.75,3.98,2.69,3.34,3.17];
/* ---------- 1 · SMF-Reader (Format 0 und 1) ---------- */
function readVar(u8,p){
  var v=0,b;
  do{ b=u8[p.i++]; v=(v<<7)|(b&0x7f); }while(b&0x80);
  return v;
}
function parse(u8){
  if(u8 instanceof ArrayBuffer)u8=new Uint8Array(u8);
  function str4(o){return String.fromCharCode(u8[o],u8[o+1],u8[o+2],u8[o+3]);}
  function u16(o){return (u8[o]<<8)|u8[o+1];}
  function u32(o){return (u8[o]<<24)|(u8[o+1]<<16)|(u8[o+2]<<8)|u8[o+3];}
  if(str4(0)!=='MThd')throw new Error('Kein SMF: MThd fehlt');
  var format=u16(8), ntrks=u16(10), division=u16(12);
  var smf={format:format,ntrks:ntrks,ppq:480,smpte:false,notes:[],tempi:[],timesigs:[],texts:[],warnings:[]};
  if(division&0x8000){ smf.smpte=true; smf.warnings.push('SMPTE-Division – Zeiten nur naeherungsweise, PPQ 480 angenommen.'); }
  else smf.ppq=division||480;
  var off=14;
  for(var t=0;t<ntrks;t++){
    if(off+8>u8.length)break;
    if(str4(off)!=='MTrk'){ off+=8+u32(off+4); continue; }
    var len=u32(off+4), end=off+8+len, p={i:off+8}, tick=0, run=0;
    var open={}; /* key ch*128+pitch -> {t,v} , fuer Note-Dauern */
    while(p.i<end){
      tick+=readVar(u8,p);
      var st=u8[p.i];
      if(st<0x80){ st=run; } else { p.i++; run=st; }
      var type=st&0xf0, ch=st&0x0f;
      if(type===0x90||type===0x80){
        var pitch=u8[p.i++], vel=u8[p.i++];
        var key=ch*128+pitch;
        if(type===0x90&&vel>0){
          if(open[key])closeNote(smf,open,key,ch,pitch,tick);
          open[key]={t:tick,v:vel};
        }else closeNote(smf,open,key,ch,pitch,tick);
      }
      else if(type===0xA0||type===0xB0||type===0xE0)p.i+=2;
      else if(type===0xC0||type===0xD0)p.i+=1;
      else if(st===0xFF){
        var mt=u8[p.i++], ml=readVar(u8,p), mo=p.i; p.i+=ml;
        if(mt===0x51&&ml===3)smf.tempi.push({t:tick,us:(u8[mo]<<16)|(u8[mo+1]<<8)|u8[mo+2]});
        else if(mt===0x58&&ml>=2)smf.timesigs.push({t:tick,num:u8[mo],den:1<<u8[mo+1]});
        else if(mt===0x01||mt===0x05||mt===0x06){
          var s=''; for(var k=mo;k<mo+ml;k++)s+=String.fromCharCode(u8[k]);
          smf.texts.push({t:tick,s:s});
        }
      }
      else if(st===0xF0||st===0xF7){ var sl=readVar(u8,p); p.i+=sl; }
      else break; /* kaputter Strom: Spur abbrechen statt Endlosschleife */
    }
    /* haengende Note-Ons am Spurende schliessen */
    for(var kk in open)if(open.hasOwnProperty(kk))
      closeNote(smf,open,kk,Math.floor(kk/128),kk%128,tick);
    off=end;
  }
  smf.notes.sort(function(a,b){return a.t-b.t||a.p-b.p;});
  return smf;
}
function closeNote(smf,open,key,ch,pitch,tick){
  var o=open[key]; if(!o)return;
  delete open[key];
  var d=tick-o.t; if(d<=0)d=1;
  smf.notes.push({t:o.t,d:d,ch:ch,p:pitch,v:o.v});
}
/* ---------- 2 · Taktart, Tempo, Raster ---------- */
var METERMAP={'4/4':'4/4','3/4':'3/4','6/8':'6/8','2/4':'4/4','2/2':'4/4','12/8':'6/8','6/4':'3/4'};
function pickMeter(smf){
  var ts=smf.timesigs.length?smf.timesigs[0]:{num:4,den:4};
  var id=ts.num+'/'+ts.den, mapped=METERMAP[id]||'4/4';
  var warn=null;
  if(!METERMAP[id])warn='Taktart '+id+' nicht unterstuetzt – als 4/4 importiert.';
  else if(mapped!==id)warn='Taktart '+id+' – auf '+mapped+' abgebildet.';
  if(smf.timesigs.length>1)warn=(warn?warn+' ':'')+'Taktartwechsel im Song werden nicht uebernommen (erste gilt).';
  /* Taktlaenge in Ticks: auf Basis der ECHTEN Taktart der Datei,
     damit die Taktgrenzen stimmen, auch wenn wir auf 4/4 mappen */
  var barTicks=Math.round(smf.ppq*4*ts.num/ts.den);
  return {id:mapped,fileId:id,barTicks:barTicks,warn:warn};
}
function pickTempo(smf){
  if(!smf.tempi.length)return 120;
  var us=smf.tempi.map(function(e){return e.us;}).sort(function(a,b){return a-b;});
  var med=us[Math.floor(us.length/2)];
  return Math.round(60000000/med);
}
/* ---------- 3 · Gewichtete Pitch-Class-Profile pro Segment ---------- */
/* Segment = halber Takt. Gewicht = Ueberlappungsdauer x Velocity-Faktor;
   die tiefste Stimme zaehlt doppelt (Bass traegt den Grundton, das
   entschaerft Durchgangsnoten der Melodie ohne Melodie-Detektion). */
function buildSegments(smf,barTicks){
  var half=barTicks/2, lastEnd=0, i, n;
  for(i=0;i<smf.notes.length;i++){n=smf.notes[i];if(n.t+n.d>lastEnd)lastEnd=n.t+n.d;}
  var nSeg=Math.max(1,Math.ceil(lastEnd/half)), segs=[], s;
  for(i=0;i<nSeg;i++)segs.push({w:[0,0,0,0,0,0,0,0,0,0,0,0],chm:[0,0,0,0,0,0,0,0,0,0,0,0],total:0,bassP:999,bassW:0,onsets:0});
  for(i=0;i<smf.notes.length;i++){
    n=smf.notes[i];
    if(n.ch===9)continue; /* Drums nie in die Harmonik */
    var s0=Math.floor(n.t/half), s1=Math.min(nSeg-1,Math.floor((n.t+n.d-1)/half));
    for(s=s0;s<=s1;s++){
      var a=Math.max(n.t,s*half), b=Math.min(n.t+n.d,(s+1)*half), ov=b-a;
      if(ov<=0)continue;
      var w=ov*(0.5+n.v/127);
      /* Anschlag im Segment zaehlt mehr als reines Liegen */
      if(s===s0)w*=1.5;
      /* Harmonik wohnt in der Mittellage: hohe Lagen (Melodie) daempfen,
         statt eine fehleranfaellige Melodie-Detektion zu bauen */
      if(n.p>=74)w*=0.35; else if(n.p>=67)w*=0.7;
      segs[s].w[n.p%12]+=w; segs[s].chm[n.p%12]|=(1<<n.ch);
      if(s===s0)segs[s].onsets++;
      if(n.p<60){ if(!segs[s].low)segs[s].low={}; segs[s].low[n.p]=(segs[s].low[n.p]||0)+w; }
    }
  }
  for(i=0;i<nSeg;i++){
    s=segs[i];
    /* Ein Ton, den nur EIN Kanal spielt, ist Stimme, nicht Harmonik –
       daempfen statt Melodie zu detektieren. Bei Ein-Kanal-Dateien
       trifft es alle gleich, die Verhaeltnisse bleiben unveraendert. */
    for(var k=0;k<12;k++){
      var m=s.chm[k];
      if(m&&!(m&(m-1)))s.w[k]*=0.6; /* genau ein Bit gesetzt */
    }
    s.total=0;
    for(k=0;k<12;k++)s.total+=s.w[k];
    /* Bass = tiefste Note mit ECHTEM Gewicht. Nur "tiefste Tonhoehe"
       reicht nicht: der Ausklang des Vortakt-Basses leckt ein paar
       Ticks herein und wuerde sonst Root-Bonus und Doppelung kapern. */
    if(s.low){
      var bp=999,bw=0,p;
      for(p in s.low)if(s.low.hasOwnProperty(p)&&s.low[p]>=0.05*s.total&&+p<bp){bp=+p;bw=s.low[p];}
      if(bp===999)for(p in s.low)if(s.low.hasOwnProperty(p)&&+p<bp){bp=+p;bw=s.low[p];}
      s.bassP=bp; s.bassW=bw;
      s.w[bp%12]+=bw; s.total+=bw; /* Bass doppelt */
    }
  }
  return segs;
}
/* ---------- 4 · Tonart (Krumhansl) ---------- */
function detectKey(segs){
  var h=[0,0,0,0,0,0,0,0,0,0,0,0], i, k;
  for(i=0;i<segs.length;i++)for(k=0;k<12;k++)h[k]+=segs[i].w[k];
  /* Krumhansl entscheidet Paralleltonarten (Am/C) nicht zuverlaessig –
     der erste Akkord des Stuecks bricht das Patt: er ist fast immer
     die Tonika oder steht ihr nahe. */
  var first=null;
  for(i=0;i<segs.length;i++)if(segs[i].total>0){ first=candidates(segs[i],null,1)[0]; break; }
  var best={score:-1e9,pc:0,mode:'ionian'};
  for(var pc=0;pc<12;pc++){
    var sM=0,sm=0;
    for(k=0;k<12;k++){ sM+=h[(pc+k)%12]*KMAJ[k]; sm+=h[(pc+k)%12]*KMIN[k]; }
    if(first&&first.root===pc){
      if(isMinorType(first.type))sm*=1.06; else sM*=1.06;
    }
    if(sM>best.score)best={score:sM,pc:pc,mode:'ionian'};
    if(sm>best.score)best={score:sm,pc:pc,mode:'aeolian'};
  }
  return best;
}
function isMinorType(t){return t==='min'||t==='m7'||t==='m6'||t==='m9'||t==='m7b5'||t==='dim'||t==='dim7';}
function scaleSet(keyPc,mode){
  var iv=(mode==='aeolian')?[0,2,3,5,7,8,10]:[0,2,4,5,7,9,11], s={}, i;
  for(i=0;i<7;i++)s[(keyPc+iv[i])%12]=1;
  if(mode==='aeolian')s[(keyPc+11)%12]=1; /* harmonisch Moll: Leitton fuer V7 */
  return s;
}
/* ---------- 5 · Akkord-Kandidaten pro Segment ---------- */
function scoreChord(seg,root,type,scale){
  var tpl=TPL[type], inW=0, i, has={},third=-1;
  for(i=0;i<tpl.length;i++){ var pc=(root+tpl[i])%12; has[pc]=1; inW+=seg.w[pc];
    if(tpl[i]===3||tpl[i]===4)third=pc; }
  var outW=seg.total-inW;
  var sc=(inW-0.65*outW)/(seg.total||1);
  /* Terz muss klingen, sonst raten wir Dur/Moll aus der Quinte */
  if(third>=0&&seg.w[third]<=0)sc-=0.35;
  /* Grundton im Bass ist das staerkste Signal, das wir haben */
  if(seg.bassP<999){
    var bpc=seg.bassP%12;
    if(bpc===root)sc+=0.22; else if(!has[bpc])sc-=0.10;
  }
  /* Jeder Ton jenseits des Dreiklangs muss vergleichbar mit den
     Dreiklangstoenen klingen, sonst raten wir 6er/9er aus
     Melodietoenen zusammen. Referenz sind die Kerntoene selbst –
     das ist skalenfrei und haengt nicht an der Gesamtmasse. */
  if(tpl.length>3){
    /* Referenz: Terz und Quinte – NICHT der Grundton, der ist durch
       die Bass-Doppelung immer aufgeblaeht */
    var base=(seg.w[(root+tpl[1])%12]+seg.w[(root+tpl[2])%12])/2;
    for(i=3;i<tpl.length;i++){
      if(seg.w[(root+tpl[i])%12]<0.5*base)sc-=0.22;
    }
  }
  /* Sparsamkeit: grosse Schablonen minimal bestrafen */
  sc-=0.015*tpl.length;
  /* sus ist in Charts fast nie der benannte Akkord, sondern eine
     Verzierung der Begleitung – nur nehmen, wenn wirklich nichts
     anderes passt (arpeggierte Akustik-Texturen haben oft schwache
     Terzen, das darf nicht reichen) */
  if(type==='sus2'||type==='sus4'||type==='7sus4')sc-=0.10;
  /* Diatonik-Bonus (klein – Sekundaerdominanten muessen gewinnen koennen) */
  if(scale){
    var dia=true;
    for(i=0;i<Math.min(3,tpl.length);i++)if(!scale[(root+tpl[i])%12]){dia=false;break;}
    if(dia)sc+=0.04;
  }
  return sc;
}
function candidates(seg,scale,K){
  var out=[], r, i, types=CORE, t;
  if(seg.total<=0)return [{root:-1,type:'maj',sc:0}]; /* Stille */
  for(r=0;r<12;r++){
    if(seg.w[r]<=0&&(seg.bassP===999||seg.bassP%12!==r))continue; /* Grundton muss vorkommen */
    /* Nur die Kern-Typen: 9/13/#9-Farben behauptet die Analyse nie
       selbst – Melodietoene "belegen" sie sonst staendig. Ueber
       Text-Events und Handeingabe bleiben sie erreichbar. */
    for(i=0;i<types.length;i++)out.push({root:r,type:types[i],sc:scoreChord(seg,r,types[i],scale)});
  }
  out.sort(function(a,b){return b.sc-a.sc;});
  return out.slice(0,K||8);
}
/* ---------- 6 · Viterbi ueber die Segmente ---------- */
/* Zustaende: Top-K Kandidaten. Wechselstrafe haelt die harmonische
   Rhythmik ruhig; mitten im Takt kostet ein Wechsel mehr als auf der
   Taktgrenze. */
function viterbi(segs,scale){
  var K=8, states=[], i, j, k;
  for(i=0;i<segs.length;i++)states.push(candidates(segs[i],scale,K));
  var SW_BAR=0.10, SW_MID=0.30;
  var dp=[], bk=[];
  for(i=0;i<segs.length;i++){ dp.push([]); bk.push([]); }
  for(j=0;j<states[0].length;j++){ dp[0][j]=states[0][j].sc; bk[0][j]=-1; }
  for(i=1;i<segs.length;i++){
    var pen=(i%2===0)?SW_BAR:SW_MID;
    for(j=0;j<states[i].length;j++){
      var best=-1e9, bi=-1, st=states[i][j];
      for(k=0;k<states[i-1].length;k++){
        var pv=states[i-1][k];
        var tr=(pv.root===st.root&&pv.type===st.type)?0:-pen;
        var v=dp[i-1][k]+tr;
        if(v>best){best=v;bi=k;}
      }
      dp[i][j]=best+st.sc; bk[i][j]=bi;
    }
  }
  var last=segs.length-1, bj=0, bv=-1e9;
  for(j=0;j<states[last].length;j++)if(dp[last][j]>bv){bv=dp[last][j];bj=j;}
  var path=[];
  for(i=last;i>=0;i--){ path[i]=states[i][bj]; bj=bk[i][bj]; if(bj<0&&i>0)bj=0; }
  return path;
}
/* ---------- 7 · Segmente -> Takte -> Sequenz ---------- */
/* Der Viterbi liefert den GRUNDTON-Verlauf. Der Akkord-TYP wird hier
   auf Taktebene neu entschieden: beide Halbtakt-Profile zusammengelegt,
   bester Typ fuer den gesetzten Grundton. Das mittelt Melodie-Rauschen
   weg, das in einem einzelnen Halbtakt einen 6er/maj7 vortaeuscht. */
function mergeSegs(a,b){
  var m={w:[0,0,0,0,0,0,0,0,0,0,0,0],total:0,bassP:Math.min(a.bassP,b?b.bassP:999),bassW:0}, k;
  for(k=0;k<12;k++){ m.w[k]=a.w[k]+(b?b.w[k]:0); m.total+=m.w[k]; }
  return m;
}
function bestType(seg,root,scale){
  var bi=0, bs=-1e9, b2=-1e9, i, s;
  for(i=0;i<CORE.length;i++){
    s=scoreChord(seg,root,CORE[i],scale);
    if(s>bs){b2=bs;bs=s;bi=i;} else if(s>b2)b2=s;
  }
  return {type:CORE[bi],sc:bs,margin:bs-b2};
}
function toBars(path,segs,scale){
  var bars=[], i;
  for(i=0;i<path.length;i+=2){
    var a=path[i], b=(i+1<path.length)?path[i+1]:null;
    var pick=a, warn=false;
    if(b&&b.root!==a.root&&b.root>=0&&a.root>=0){
      /* Engine ist takt-granular: zwei Akkorde im Takt kann sie nicht.
         Der gewichtigere gewinnt, der Takt wird als unsicher markiert. */
      var wa=segs[i].total, wb=segs[i+1].total;
      if(wb>wa*1.4)pick=b;
      warn=true;
    }
    if(pick.root<0){ /* Stille: letzten Akkord halten */
      if(bars.length){ var pv=bars[bars.length-1];
        bars.push({root:pv.root,type:pv.type,conf:0,split:false,weight:0}); }
      continue;
    }
    var merged=mergeSegs(segs[i],(i+1<segs.length)?segs[i+1]:null);
    var bt=bestType(merged,pick.root,scale);
    bars.push({root:pick.root,type:bt.type,conf:warn?Math.min(a.sc,b?b.sc:a.sc):bt.sc,split:warn,
      weight:merged.total,margin:bt.margin});
  }
  /* Auslauf abschneiden: Takte, die nur noch vom Ausklang der letzten
     Note leben, sind kein Akkord */
  var med=bars.map(function(b){return b.weight;}).sort(function(a,b){return a-b;})[Math.floor(bars.length/2)]||0;
  while(bars.length>1&&bars[bars.length-1].weight<0.15*med)bars.pop();
  return bars;
}
function toSeq(bars){
  var seq=[], i;
  for(i=0;i<bars.length;i++){
    var b=bars[i], last=seq.length?seq[seq.length-1]:null;
    if(last&&last.root===b.root&&last.type===b.type){ last.bars++; last.conf=Math.min(last.conf,b.conf); }
    else seq.push({root:b.root,type:b.type,bars:1,conf:b.conf,split:b.split});
  }
  return seq;
}
/* Vokabular-Glaettung: Ein Song benutzt pro Grundton ein konsistentes
   Vokabular – F#7 flackert in echten Dateien je Takt zwischen F#7 und
   F#maj, weil die Septime mal klingt und mal nicht. Sichere Takte
   (hohe Marge) bilden das Vokabular, unsichere und sus-Takte werden
   darauf gezogen. Klassen bleiben getrennt: Em wird NIE zu E7 (Hotel
   California hat beide!), nur maj<->7er-Farben bzw. m<->m7 gleichen
   sich an. sus (Terz fehlt = Klasse unklar) darf die Klasse wechseln. */
function classOf(t){
  if(t==='sus2'||t==='sus4'||t==='7sus4')return 's';
  return isMinorType(t)?'m':'M';
}
function smoothVocab(bars){
  var hist={}, i, b, k;
  for(i=0;i<bars.length;i++){
    b=bars[i];
    if(b.margin===undefined||b.margin>=0.12){
      k=b.root+classOf(b.type);
      if(!hist[k])hist[k]={};
      hist[k][b.type]=(hist[k][b.type]||0)+1;
    }
  }
  function majority(key){
    var h=hist[key], best=null, n=0, t;
    if(!h)return null;
    for(t in h)if(h.hasOwnProperty(t)&&h[t]>n){n=h[t];best=t;}
    return n>=2?best:null;
  }
  var changed=0;
  for(i=0;i<bars.length;i++){
    b=bars[i];
    if(b.margin===undefined)continue;
    var cls=classOf(b.type), m=null;
    if(cls==='s'){ /* sus: staerkere Klasse dieses Grundtons uebernehmen */
      var mM=majority(b.root+'M'), mm=majority(b.root+'m');
      var nM=hist[b.root+'M'], nm=hist[b.root+'m'];
      var cM=0,cm=0,t;
      if(nM)for(t in nM)if(nM.hasOwnProperty(t))cM+=nM[t];
      if(nm)for(t in nm)if(nm.hasOwnProperty(t))cm+=nm[t];
      m=(cM>=cm)?mM:mm;
    }else if(b.margin<0.12)m=majority(b.root+cls);
    if(m&&m!==b.type){b.type=m;changed++;}
  }
  return changed;
}
/* Kernschleife: Bei ganzen Songs (Intro/Strophe/Refrain/Solo) greift
   globales Falten nicht. Stattdessen: haeufigste 8er/12er/16er-Runde
   ueber die Grundtoene suchen und als Kernprogression anbieten. */
function coreLoop(bars,keyPc){
  /* Phasen-Anker statt freiem Fenster: Kandidaten beginnen nur dort,
     wo der Tonika-Grundton NEU einsetzt (Strophen tun das fast immer).
     Das fixiert die Phase und verhindert die Artefakt-Fenster, die
     ueber zwei Strophen hinweg zaehlen. */
  if(keyPc===undefined)return null;
  var n=bars.length, anchors=[], i, j;
  for(i=0;i<n;i++)if(bars[i].root===keyPc&&(i===0||bars[i-1].root!==keyPc))anchors.push(i);
  if(anchors.length<3)return null;
  var Ls=[4,8,12,16], best=null, li, L;
  for(li=0;li<Ls.length;li++){
    L=Ls[li];
    var cnt={};
    for(i=0;i<anchors.length;i++){
      var a=anchors[i];
      if(a+L>n)continue;
      /* Fenster, in denen ein WEITERER Anker liegt, ueberspannen einen
         Phrasenbeginn (Strophe + Anfang der naechsten) – ungueltig */
      if(i+1<anchors.length&&anchors[i+1]<a+L)continue;
      var k=[];
      for(j=0;j<L;j++)k.push(bars[a+j].root);
      k=k.join(',');
      cnt[k]=(cnt[k]||0)+1;
    }
    var bk=null, bn=0, kk;
    for(kk in cnt)if(cnt.hasOwnProperty(kk)&&cnt[kk]>bn){bn=cnt[kk];bk=kk;}
    if(bn<3)continue;
    /* Abdeckung (Anzahl x Laenge) entscheidet; bei Gleichstand haelt
       das strikte > die kuerzere Periode aus der aufsteigenden Liste */
    if(!best||bn*L>best.n*best.L)best={key:bk,n:bn,L:L};
  }
  if(!best)return null;
  /* Typen je Position: Mehrheit ueber alle Anker-Vorkommen */
  var roots=best.key.split(',').map(Number), starts=[];
  for(i=0;i<anchors.length;i++){
    var a2=anchors[i];
    if(a2+best.L>n)continue;
    var ok=true;
    for(j=0;j<best.L&&ok;j++)if(bars[a2+j].root!==roots[j])ok=false;
    if(ok)starts.push(a2);
  }
  if(!starts.length)return null;
  var out=[];
  for(j=0;j<best.L;j++){
    var h={}, bt=null, bn2=0;
    for(i=0;i<starts.length;i++){
      var t=bars[starts[i]+j].type;
      h[t]=(h[t]||0)+1;
      if(h[t]>bn2){bn2=h[t];bt=t;}
    }
    out.push({root:roots[j],type:bt,conf:1,split:false,weight:1,margin:1});
  }
  return {bars:out,count:starts.length,len:best.L};
}
/* Wiederholungen zusammenfalten: 2x dieselbe 8-Takt-Runde ist EINE
   Progression. Der Loop der Engine wiederholt selbst. */
function foldRepeats(bars){
  var n=bars.length, L, i;
  function eq(a,b){return a.root===b.root&&a.type===b.type;}
  /* kleinste Periode zuerst – sonst wird 4x Runde als 2x Doppelrunde
     erkannt und nur halb gefaltet */
  for(L=2;L<=Math.floor(n/2);L++){
    if(n%L)continue;
    var ok=true;
    for(i=L;i<n&&ok;i++)if(!eq(bars[i],bars[i%L]))ok=false;
    if(ok)return bars.slice(0,L);
  }
  return bars;
}
/* ---------- 8 · Text-Event-Abkuerzung ---------- */
var CHORD_RE=/^([A-Ha-h])([#b]?)((?:maj7|maj9|maj|major|min7|min9|min6|min|m7b5|m7|m9|m6|m|dim7|dim|aug|sus2|sus4|7sus4|7#9|7\+9|7b9|7-9|13|M7|ma7|o7|o|h7|9|7|6|\+|-7|-)?)$/;
function chordFromText(s){
  s=s.replace(/[\s ]+/g,'');
  var m=s.match(CHORD_RE); if(!m)return null;
  var root=NMAP[(m[1].toUpperCase()+m[2].toLowerCase()).toUpperCase()];
  if(root===undefined)return null;
  var type=SUF[m[3]]; if(type===undefined)type=SUF[m[3].toLowerCase()];
  if(type===undefined)return null;
  return {root:root,type:type};
}
function textChords(smf,barTicks,nBars){
  var hits=[], i;
  for(i=0;i<smf.texts.length;i++){
    var c=chordFromText(smf.texts[i].s);
    if(c)hits.push({t:smf.texts[i].t,root:c.root,type:c.type});
  }
  if(hits.length<4)return null; /* zu wenig, um ein Chord-Track zu sein */
  var bars=[], b, covered=0;
  for(b=0;b<nBars;b++)bars.push(null);
  for(i=0;i<hits.length;i++){
    b=Math.round(hits[i].t/barTicks);
    if(b>=0&&b<nBars&&!bars[b]){bars[b]={root:hits[i].root,type:hits[i].type,conf:1,split:false};covered++;}
  }
  /* Duenn gestreute Symbole (z. B. nur in Strophe 1) taugen nicht als
     alleinige Quelle – dann lieber Notenanalyse */
  if(covered<0.6*nBars)return null;
  var last=null;
  for(b=0;b<nBars;b++){ if(bars[b])last=bars[b]; else if(last)bars[b]={root:last.root,type:last.type,conf:1,split:false}; }
  while(bars.length&&!bars[0])bars.shift();
  return bars.length?bars:null;
}
/* ---------- 9 · Feel: Swing, Energy, Complexity ---------- */
function detectSwing(smf,ppq){
  /* Lage der Offbeat-Achtel: 50 % = gerade, 66 % = triolisch.
     Nur Anschlaege abseits der Viertel betrachten. */
  var pos=[], i, n;
  for(i=0;i<smf.notes.length;i++){
    n=smf.notes[i];
    var r=n.t%ppq;
    if(r>ppq*0.30&&r<ppq*0.85)pos.push(r/ppq);
  }
  if(pos.length<8)return 0;
  pos.sort(function(a,b){return a-b;});
  var med=pos[Math.floor(pos.length/2)];
  var pct=Math.round(med*100);
  if(pct<=54)return 0; /* unter 54 % ist das Timing-Streuung, kein Swing */
  /* Umrechnung auf die Engine-Skala: dort ist 100 = Offbeat auf der
     dritten Triole (Position 66,7 %), 0 = gerade (50 %) */
  return Math.max(0,Math.min(100,Math.round((pct-50)*6)));
}
function detectDensity(smf,barTicks){
  var lastEnd=0, i, n, cnt=0, vsum=0;
  for(i=0;i<smf.notes.length;i++){
    n=smf.notes[i]; cnt++; vsum+=n.v;
    if(n.t+n.d>lastEnd)lastEnd=n.t+n.d;
  }
  var nBars=Math.max(1,lastEnd/barTicks);
  var perBar=cnt/nBars, vAvg=cnt?vsum/cnt:64;
  /* grobe, ehrliche Heuristik: 8 Noten/Takt ~ 40, 40/Takt ~ 90 */
  var energy=Math.max(10,Math.min(95,Math.round(perBar*1.6+vAvg*0.25)));
  var complexity=Math.max(10,Math.min(90,Math.round(perBar*1.2)));
  return {energy:energy,complexity:complexity};
}
/* ---------- 10 · Token-Ausgabe ---------- */
function pcName(pc,flats){pc=((pc%12)+12)%12;return flats?FLATN[pc]:SHARPN[pc];}
function tokens(seq,keyPc,defBars){
  var flats=!!FLATKEYS[keyPc], out=[], i;
  for(i=0;i<seq.length;i++){
    var c=seq[i], t=pcName(c.root,flats)+(TYPESUF[c.type]||'');
    if(c.bars!==defBars)t+=':'+c.bars;
    out.push(t);
  }
  return out.join(' ');
}
/* defBars ist fest 1: jeder mehrtaktige Akkord traegt sein :n explizit.
   Damit ist der Token-String unabhaengig davon, was im barsPerChord-
   Dropdown der App gerade steht — die UI setzt es beim Uebernehmen auf 1. */
/* ---------- 11 · Gesamtlauf ---------- */
function analyze(smf){
  var warnings=smf.warnings.slice();
  var meter=pickMeter(smf); if(meter.warn)warnings.push(meter.warn);
  var bpm=pickTempo(smf);
  var segs=buildSegments(smf,meter.barTicks);
  var key=detectKey(segs);
  var scale=scaleSet(key.pc,key.mode);
  var nBars=Math.ceil(segs.length/2);
  var source='analysis', bars=textChords(smf,meter.barTicks,nBars);
  if(bars){ source='text';
    warnings.push('Akkordsymbole aus Text-Events uebernommen ('+bars.length+' Takte).');
  }else{
    var path=viterbi(segs,scale);
    bars=toBars(path,segs,scale);
    var sm=smoothVocab(bars);
    if(sm)warnings.push(sm+' unsichere Takte an das Akkord-Vokabular des Songs angeglichen.');
  }
  var core=coreLoop(bars,key.pc);
  var folded=foldRepeats(bars);
  if(folded.length<bars.length)
    warnings.push((bars.length/folded.length)+'x Wiederholung erkannt – auf '+folded.length+' Takte gefaltet (Loop wiederholt selbst).');
  var seq=toSeq(folded);
  var splits=0, low=0, i;
  for(i=0;i<seq.length;i++){ if(seq[i].split)splits++; if(seq[i].conf<0.35)low++; }
  if(splits)warnings.push(splits+' Takt(e) mit Akkordwechsel in Taktmitte – Engine ist takt-granular, Downbeat-Akkord uebernommen.');
  if(low)warnings.push(low+' Akkord(e) mit niedriger Konfidenz – vor dem Uebernehmen pruefen.');
  var defBars=1;
  var feel=detectDensity(smf,meter.barTicks);
  return {
    source:source, bpm:bpm, meter:meter.id, meterFile:meter.fileId,
    keyPc:key.pc, keyMode:key.mode, keyName:pcName(key.pc,!!FLATKEYS[key.pc])+(key.mode==='aeolian'?'m':''),
    swing:detectSwing(smf,smf.ppq), energy:feel.energy, complexity:feel.complexity,
    barsTotal:bars.length, seq:seq, defBars:defBars,
    tokens:tokens(seq,key.pc,defBars),
    coreSeq:core?toSeq(core.bars):null,
    coreTokens:core?tokens(toSeq(core.bars),key.pc,1):null,
    coreCount:core?core.count:0,
    warnings:warnings };
}
function importFile(buf){ return analyze(parse(buf)); }
return {parse:parse,analyze:analyze,importFile:importFile,_tpl:TPL,
 _segs:buildSegments,_score:scoreChord,_cand:candidates,_meter:pickMeter};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=MP5IMP;
