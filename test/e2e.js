/* End-to-End: gebaute MIDI PERFECT 5.html im Headless-Chromium,
   echtes MIDI ueber den File-Input, Uebernehmen, Engine-Zustand pruefen. */
var {chromium}=require('playwright');
var path=require('path');
var MIDI='/mnt/user-data/uploads/Steinberg/Hotel-California-(Unplugged).mid';
var HTML=path.resolve(__dirname,'..','MIDI PERFECT 5.html');
(async function(){
  var browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
  var page=await browser.newPage({viewport:{width:1440,height:900}});
  var errors=[];
  page.on('pageerror',function(e){errors.push('pageerror: '+e.message);});
  page.on('console',function(m){if(m.type()==='error')errors.push('console: '+m.text());});
  await page.goto('file://'+HTML);
  await page.waitForTimeout(800);
  // Bereich Export oeffnen und Datei setzen
  await page.evaluate(function(){window.MP3.showView('export');});
  await page.setInputFiles('#impFile',MIDI);
  await page.waitForSelector('#impReview:not([hidden])',{timeout:5000});
  var review=await page.evaluate(function(){
    return {
      info:document.getElementById('impInfo').textContent,
      core:document.getElementById('impUseCore').textContent,
      tokens:document.getElementById('impTokens').value,
      chips:document.querySelectorAll('#impChips .imp-chip').length,
      warnChips:document.querySelectorAll('#impChips .imp-chip--warn').length
    };
  });
  console.log('REVIEW:',JSON.stringify(review,null,1));
  // Uebernehmen
  await page.click('#impApply');
  await page.waitForTimeout(400);
  var state=await page.evaluate(function(){
    return {
      view:location.hash,
      chordInput:document.getElementById('chordInput').value,
      bpm:document.getElementById('bpm').value,
      keyPc:document.getElementById('keyPc').value,
      keyMode:document.getElementById('keyMode').value,
      meter:document.getElementById('meterSel').value,
      blKey:document.getElementById('blKey')?document.getElementById('blKey').value:null,
      logTail:(document.getElementById('log')||{textContent:''}).textContent.slice(-500)
    };
  });
  console.log('STATE:',JSON.stringify(state,null,1));
  // Feel uebernehmen
  await page.evaluate(function(){window.MP3.showView('export');});
  await page.click('#impFeel');
  var feel=await page.evaluate(function(){
    return {swing:document.getElementById('swing').value,
            energy:document.getElementById('energy').value,
            cplx:document.getElementById('cplx').value};
  });
  console.log('FEEL:',JSON.stringify(feel));
  // Umschalten auf kompletten Verlauf
  await page.click('#impUseFull');
  var full=await page.evaluate(function(){return document.getElementById('impTokens').value.split(' ').length;});
  console.log('FULL tokens:',full);
  console.log('ERRORS:',errors.length?errors.join('\n'):'keine');
  await browser.close();
  process.exit(errors.length?1:0);
})().catch(function(e){console.error('E2E FAIL:',e.message);process.exit(1);});
