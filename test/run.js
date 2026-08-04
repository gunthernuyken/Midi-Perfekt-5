/* Test-Harness: Importer gegen Soll fahren. node run.js */
var fs=require('fs');
var IMP=require('../werkstatt/import.js');
var CASES=[
 {file:'hotel.mid',      wantTokens:'Bm F#7 Amaj E7 Gmaj Dmaj Em F#7', wantKey:'Bm', wantMeter:'4/4', wantBpm:74},
 {file:'hotel_text.mid', wantTokens:'Bm F#7 Amaj E7 Gmaj Dmaj Em F#7', wantKey:'Bm', wantMeter:'4/4', wantBpm:74, wantSource:'text'},
 {file:'hotel_fmt0.mid', wantTokens:'Bm F#7 Amaj E7 Gmaj Dmaj Em F#7', wantKey:'Bm', wantMeter:'4/4', wantBpm:74},
 {file:'waltz.mid',      wantTokens:'Am Fmaj Cmaj Gmaj',               wantKey:'Am', wantMeter:'3/4', wantBpm:140},
 {file:'hotel_human.mid',wantTokens:'Bm F#7 Amaj E7 Gmaj Dmaj Em F#7', wantKey:'Bm', wantMeter:'4/4', wantBpm:74},
 {file:'hotel_swing.mid',wantTokens:'Bm F#7 Amaj E7 Gmaj Dmaj Em F#7', wantKey:'Bm', wantMeter:'4/4', wantBpm:74, wantSwingMin:60}
];
var fail=0;
CASES.forEach(function(c){
  var buf=fs.readFileSync(__dirname+'/'+c.file);
  var u8=new Uint8Array(buf);
  var r=IMP.importFile(u8);
  var probs=[];
  if(r.tokens!==c.wantTokens)probs.push('tokens: "'+r.tokens+'" != "'+c.wantTokens+'"');
  if(r.keyName!==c.wantKey)probs.push('key: '+r.keyName+' != '+c.wantKey);
  if(r.meter!==c.wantMeter)probs.push('meter: '+r.meter+' != '+c.wantMeter);
  if(Math.abs(r.bpm-c.wantBpm)>1)probs.push('bpm: '+r.bpm+' != '+c.wantBpm);
  if(c.wantSource&&r.source!==c.wantSource)probs.push('source: '+r.source+' != '+c.wantSource);
  if(c.wantSwingMin&&r.swing<c.wantSwingMin)probs.push('swing: '+r.swing+' < '+c.wantSwingMin);
  console.log((probs.length?'FAIL':'PASS')+' '+c.file);
  console.log('  tokens='+r.tokens+'  key='+r.keyName+'  meter='+r.meter+'  bpm='+r.bpm+
              '  swing='+r.swing+'  energy='+r.energy+'  cplx='+r.complexity+'  src='+r.source);
  if(r.warnings.length)console.log('  warn: '+r.warnings.join(' | '));
  probs.forEach(function(p){console.log('  !! '+p);});
  if(probs.length)fail++;
});
process.exit(fail?1:0);
