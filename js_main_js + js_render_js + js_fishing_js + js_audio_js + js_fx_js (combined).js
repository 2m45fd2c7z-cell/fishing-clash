// ============================================================
//  audio.js — SFX + Background music engine (Web Audio API)
// ============================================================

let AC=null, masterGain=null, musicScheduler=null, currentTrack=null;
let bgmEnabled=false, sfxEnabled=true;
const _sfxLP={};
function sfxDebounce(id,ms=80){const n=Date.now();if(_sfxLP[id]&&n-_sfxLP[id]<ms)return false;_sfxLP[id]=n;return true;}
function ensureAC(){
  if(AC)return true;
  try{AC=new(window.AudioContext||window.webkitAudioContext)();masterGain=AC.createGain();masterGain.gain.value=0.3;masterGain.connect(AC.destination);return true;}
  catch{return false;}
}
function _tone(freq,t,dur,type='sine',vol=0.18,det=0,fi=0.008){
  if(!AC)return;
  const o=AC.createOscillator(),g=AC.createGain();
  o.type=type;o.frequency.value=freq;o.detune.value=det;
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+fi);
  g.gain.setValueAtTime(vol,t+dur*.6);g.gain.linearRampToValueAtTime(0,t+dur);
  o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+dur+.02);
}
function _noise(t,dur,vol,hp=3000){
  if(!AC)return;
  const len=Math.ceil(AC.sampleRate*dur),buf=AC.createBuffer(1,len,AC.sampleRate),d=buf.getChannelData(0);
  for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*(1-i/len);
  const src=AC.createBufferSource(),g=AC.createGain(),f=AC.createBiquadFilter();
  f.type='highpass';f.frequency.value=hp;src.buffer=buf;g.gain.value=vol;
  g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);
  src.connect(f);f.connect(g);g.connect(masterGain);src.start(t);src.stop(t+dur+.01);
}
function _thud(t,sf,ef,dur,vol){
  if(!AC)return;
  const o=AC.createOscillator(),g=AC.createGain();
  o.type='sine';o.frequency.setValueAtTime(sf,t);o.frequency.exponentialRampToValueAtTime(ef,t+dur);
  g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+dur+.02);
  o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+dur+.04);
}

function sfxTap(){if(!sfxEnabled||!ensureAC()||!sfxDebounce('tap',60))return;const t=AC.currentTime;_tone(1200,t,.055,'sine',.14);_tone(1800,t+.01,.035,'sine',.07);}
function sfxTab(){if(!sfxEnabled||!ensureAC()||!sfxDebounce('tab',120))return;const t=AC.currentTime;_tone(600,t,.07,'sine',.12);_tone(900,t+.04,.07,'sine',.10);}
function sfxError(){if(!sfxEnabled||!ensureAC()||!sfxDebounce('error',200))return;const t=AC.currentTime;[180,160,140].forEach((f,i)=>_tone(f,t+i*.07,.06,'sawtooth',.16));}
function sfxPurchase(){if(!sfxEnabled||!ensureAC())return;const t=AC.currentTime;_thud(t,220,80,.08,.28);[[523,.02],[659,.07],[784,.12],[1047,.17]].forEach(([f,o])=>_tone(f,t+o,.14,'triangle',.16));_tone(2093,t+.22,.1,'sine',.1);}
function sfxEquip(){if(!sfxEnabled||!ensureAC())return;const t=AC.currentTime;_noise(t,.08,.18,4000);_tone(440,t,.05,'sine',.12);_tone(880,t+.06,.12,'triangle',.15);_tone(1320,t+.1,.08,'sine',.09);}
function sfxCast(){if(!sfxEnabled||!ensureAC()||!sfxDebounce('cast',300))return;const t=AC.currentTime;_noise(t,.22,.20,2000);const o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.setValueAtTime(800,t);o.frequency.exponentialRampToValueAtTime(200,t+.22);g.gain.setValueAtTime(.14,t);g.gain.exponentialRampToValueAtTime(.001,t+.22);o.connect(g);g.connect(masterGain);o.start(t);o.stop(t+.24);}
function sfxSplash(){if(!sfxEnabled||!ensureAC()||!sfxDebounce('splash',200))return;const t=AC.currentTime;_noise(t,.15,.25,1500);_thud(t,300,80,.12,.22);_noise(t+.06,.08,.12,4000);}
function playBiteSFX(){if(!sfxEnabled||!ensureAC())return;const t=AC.currentTime;_tone(1047,t,.07,'triangle',.20);_tone(1319,t+.07,.07,'triangle',.18);_tone(1047,t+.14,.10,'triangle',.22);_tone(220,t,.04,'sawtooth',.10);}
function playCatchSFX(){if(!sfxEnabled||!ensureAC())return;const t=AC.currentTime;_thud(t,280,70,.08,.32);[[523,.02],[659,.07],[784,.12],[1047,.18],[1319,.24]].forEach(([f,o])=>_tone(f,t+o,.16,'triangle',.17));_tone(2093,t+.30,.12,'sine',.12);}
function sfxRareCatch(){if(!sfxEnabled||!ensureAC())return;const t=AC.currentTime;_thud(t,250,65,.10,.35);[[523,0],[659,.05],[784,.10],[988,.15],[1244,.20],[1568,.26],[1976,.32]].forEach(([f,o])=>_tone(f,t+o,.18,'triangle',.18));[1047,1319,1568].forEach((f,i)=>_tone(f,t+.38+i*.04,.20,'sine',.12));_noise(t,.1,.18,6000);}
function sfxLegendaryCatch(){if(!sfxEnabled||!ensureAC())return;const t=AC.currentTime;_thud(t,140,35,.25,.55);_noise(t,.18,.35,1500);[[261,.04],[330,.09],[415,.14],[523,.19],[659,.24],[830,.29],[1047,.34],[1319,.39],[1568,.44]].forEach(([f,o])=>_tone(f,t+o,.22,'triangle',.20));[523,659,784,1047].forEach((f,i)=>_tone(f,t+.52+i*.02,.35,'sine',.16));[2093,2637,3136].forEach((f,i)=>_tone(f,t+.78+i*.06,.15,'sine',.10));}
function sfxFishEscaped(){if(!sfxEnabled||!ensureAC()||!sfxDebounce('escaped',500))return;const t=AC.currentTime;_noise(t,.12,.20,800);[[400,.02],[320,.07],[250,.12],[180,.18]].forEach(([f,o])=>_tone(f,t+o,.08,'sawtooth',.13));}
function sfxLevelUp(){if(!sfxEnabled||!ensureAC())return;const t=AC.currentTime;_thud(t,200,60,.12,.40);[[523,.03],[659,.08],[784,.13],[1047,.18],[1319,.23],[1568,.28],[2093,.34],[1568,.42],[2093,.50]].forEach(([f,o])=>_tone(f,t+o,.18,'triangle',.18));[523,659,784,1047,1319].forEach((f,i)=>_tone(f,t+.55+i*.03,.25,'sine',.14));}
function sfxForRarity(r){if(r==='legendary')sfxLegendaryCatch();else if(r==='epic'||r==='rare')sfxRareCatch();else playCatchSFX();}

function stopMusic(){if(musicScheduler){clearInterval(musicScheduler);musicScheduler=null;}currentTrack=null;}
const IDO=[261.63,293.66,329.63,369.99,415.30,440.00,493.88,523.25,587.33,659.25,739.99,830.61,880.00,987.77,1046.50];
const IDO_LO=[65.41,73.42,82.41,92.50,103.83,110.00,123.47,130.81,146.83,164.81,185.00,207.65];
function _dr(type,t,vol=.18){
  if(type==='kick'){_thud(t,180,42,.14,vol*1.4);_noise(t,.06,vol*.35,800);}
  else if(type==='snare')_noise(t,.09,vol,3000);
  else if(type==='hat')_noise(t,.04,vol*.45,9000);
  else if(type==='conga')_thud(t,260,120,.08,vol*.85);
}
function playFishingMusic(){
  if(!bgmEnabled||!ensureAC()||currentTrack==='fishing')return;
  stopMusic();currentTrack='fishing';
  const BPM=132,b=60/BPM,loop=b*16;
  const MEL=[[7,0],[9,.25],[10,.5],[12,.75],[10,1],[9,1.25],[7,1.5],[5,2],[7,2.5],[9,3],[10,3.5],[10,4],[12,4.33],[9,5],[7,5.5],[10,6],[9,6.25],[7,7],[5,7.5],[7,8],[9,8.25],[10,8.5],[12,8.75],[13,9],[12,9.5],[10,9.75],[9,10],[10,10.5],[12,11],[9,11.75],[12,12],[13,12.25],[10,13],[9,13.25],[7,13.5],[10,14],[9,14.5],[7,15],[5,15.5],[7,15.75]];
  const BASS=[[0,0],[2,.25],[0,.5],[3,1],[0,1.5],[2,2],[0,4],[3,4.75],[2,6],[4,6.5],[0,8],[4,8.75],[5,9],[2,10],[0,12],[3,12.5],[4,13],[2,14],[5,15]];
  let ls=AC.currentTime+.05;
  function sch(t){MEL.forEach(([i,o])=>{const o2=AC.createOscillator(),g=AC.createGain();o2.type='square';o2.frequency.value=IDO[i];o2.detune.value=5;g.gain.setValueAtTime(0,t+o*b);g.gain.linearRampToValueAtTime(.09,t+o*b+.008);g.gain.linearRampToValueAtTime(0,t+o*b+b*.28);o2.connect(g);g.connect(masterGain);o2.start(t+o*b);o2.stop(t+o*b+b*.3);});BASS.forEach(([i,o])=>{const o2=AC.createOscillator(),g=AC.createGain();o2.type='sawtooth';o2.frequency.value=IDO_LO[i];g.gain.setValueAtTime(.08,t+o*b);g.gain.exponentialRampToValueAtTime(.001,t+o*b+b*.32);o2.connect(g);g.connect(masterGain);o2.start(t+o*b);o2.stop(t+o*b+b*.34);});for(let k=0;k<16;k++){const kt=t+k*b;_dr('kick',kt,.18);if(k%2===0)_dr('kick',kt+b*.75,.10);if(k%4===1||k%4===3)_dr('snare',kt,.12);_dr('hat',kt,.06);_dr('hat',kt+b*.5,.06);if(k%4===0)_dr('conga',kt+b*.5,.09);}}
  sch(ls);musicScheduler=setInterval(()=>{if(currentTrack!=='fishing')return;ls+=loop;sch(ls);},loop*1000-80);
}
function playHomeMusic(){
  if(!bgmEnabled||!ensureAC()||currentTrack==='home')return;
  stopMusic();currentTrack='home';
  const BPM=120,b=60/BPM,loop=b*16;
  const MEL=[[7,0],[9,.5],[10,1],[9,1.5],[7,2],[5,2.5],[4,3],[5,3.5],[5,4],[7,4.5],[9,5],[10,5.5],[9,6],[7,6.5],[5,7],[4,7.25],[5,7.5],[7,8],[9,8.33],[10,8.67],[12,9],[10,9.5],[9,9.75],[7,10]];
  const BASS=[[0,0],[2,1],[3,2],[0,4],[3,5],[0,6],[2,8],[3,9],[4,10],[2,12],[0,12.5],[2,13],[0,15]];
  let ls=AC.currentTime+.05;
  function sch(t){MEL.forEach(([i,o])=>{const o2=AC.createOscillator(),g=AC.createGain();o2.type='triangle';o2.frequency.value=IDO[i];g.gain.setValueAtTime(0,t+o*b);g.gain.linearRampToValueAtTime(.11,t+o*b+.008);g.gain.linearRampToValueAtTime(0,t+o*b+b*.42);o2.connect(g);g.connect(masterGain);o2.start(t+o*b);o2.stop(t+o*b+b*.44);});BASS.forEach(([i,o])=>{const o2=AC.createOscillator(),g=AC.createGain();o2.type='sine';o2.frequency.value=IDO_LO[i];g.gain.setValueAtTime(.09,t+o*b);g.gain.exponentialRampToValueAtTime(.001,t+o*b+b*.5);o2.connect(g);g.connect(masterGain);o2.start(t+o*b);o2.stop(t+o*b+b*.52);});for(let k=0;k<16;k++){const kt=t+k*b;if(k%4===0)_dr('kick',kt,.15);if(k%4===2)_dr('snare',kt,.10);_dr('hat',kt+b*.25,.05);if(k%2===1)_dr('conga',kt+b*.5,.08);}}
  sch(ls);musicScheduler=setInterval(()=>{if(currentTrack!=='home')return;ls+=loop;sch(ls);},loop*1000-80);
}
function playMusicForScreen(scr){if(!bgmEnabled)return;if(scr==='fishing')playFishingMusic();else playHomeMusic();}

function buildAudioPanel(){
  const panel=document.createElement('div');panel.id='audio-panel';
  panel.style.cssText='position:absolute;bottom:88px;right:10px;z-index:150;display:flex;flex-direction:column;gap:5px;align-items:flex-end;display:none;';
  const btnCSS='width:42px;height:22px;border-radius:11px;border:1px solid rgba(0,212,255,.35);background:rgba(10,25,50,.88);font-size:9px;font-family:var(--font-hud,monospace);font-weight:700;letter-spacing:.5px;cursor:pointer;color:rgba(255,255,255,.5);transition:all .2s;display:flex;align-items:center;justify-content:center;';
  const bgmBtn=document.createElement('button');bgmBtn.id='bgm-toggle';bgmBtn.style.cssText=btnCSS;bgmBtn.textContent='BGM';
  const sfxBtn=document.createElement('button');sfxBtn.id='sfx-toggle';sfxBtn.style.cssText=btnCSS;sfxBtn.textContent='SFX';
  function updBGM(){bgmBtn.style.background=bgmEnabled?'linear-gradient(135deg,rgba(0,140,255,.65),rgba(0,200,120,.5))':'rgba(10,25,50,.88)';bgmBtn.style.color=bgmEnabled?'#fff':'rgba(255,255,255,.4)';bgmBtn.style.borderColor=bgmEnabled?'var(--neon-blue)':'rgba(0,212,255,.25)';}
  function updSFX(){sfxBtn.style.background=sfxEnabled?'linear-gradient(135deg,rgba(0,200,120,.65),rgba(0,140,255,.5))':'rgba(10,25,50,.88)';sfxBtn.style.color=sfxEnabled?'#fff':'rgba(255,255,255,.4)';sfxBtn.style.borderColor=sfxEnabled?'var(--neon-green)':'rgba(0,212,255,.25)';}
  bgmBtn.addEventListener('click',()=>{bgmEnabled=!bgmEnabled;updBGM();if(bgmEnabled){if(!AC)ensureAC();playMusicForScreen(S.activeScreen);}else{stopMusic();}sfxTap();});
  sfxBtn.addEventListener('click',()=>{sfxEnabled=!sfxEnabled;updSFX();if(sfxEnabled)sfxTap();});
  updBGM();updSFX();
  panel.appendChild(bgmBtn);panel.appendChild(sfxBtn);
  document.getElementById('game-root').appendChild(panel);
}

// ============================================================
//  fx.js — Particles, rod visuals, rarity flash & aura
// ============================================================

const fxCanvas=document.getElementById('fx-canvas');
const fxCtx=fxCanvas.getContext('2d');
let fxParticles=[],fxRunning=false;

function resizeFXCanvas(){const r=document.getElementById('game-root');fxCanvas.width=r.offsetWidth;fxCanvas.height=r.offsetHeight;}
function spawnParticles(x,y,color,count,opts={}){
  const{speed=2.5,spread=Math.PI*2,life=45,size=3,gravity=.06,glow=true}=opts;
  for(let i=0;i<count;i++){const a=(Math.random()-.5)*spread-Math.PI/2,spd=speed*(.5+Math.random());fxParticles.push({x,y,vx:Math.cos(a)*spd,vy:Math.sin(a)*spd-speed*.3,life,maxLife:life,size:size*(.6+Math.random()*.8),color,gravity,glow,alpha:1});}
  if(!fxRunning)fxLoop();
}
function fxLoop(){
  fxRunning=true;fxCtx.clearRect(0,0,fxCanvas.width,fxCanvas.height);
  fxParticles=fxParticles.filter(p=>p.life>0);
  if(!fxParticles.length){fxRunning=false;return;}
  fxParticles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=p.gravity;p.vx*=.97;p.life--;p.alpha=p.life/p.maxLife;fxCtx.save();fxCtx.globalAlpha=p.alpha;if(p.glow){fxCtx.shadowBlur=p.size*3;fxCtx.shadowColor=p.color;}fxCtx.fillStyle=p.color;fxCtx.beginPath();fxCtx.arc(p.x,p.y,p.size,0,Math.PI*2);fxCtx.fill();fxCtx.restore();});
  requestAnimationFrame(fxLoop);
}
function spawnRarityAura(bx,by,rarity){
  const cfg={rare:{color:'rgba(59,130,246,.6)',count:2,size:'120px',h:'40px',dur:'.8s'},epic:{color:'rgba(168,85,247,.65)',count:3,size:'160px',h:'52px',dur:'1s'},legendary:{color:'rgba(255,215,0,.75)',count:4,size:'220px',h:'72px',dur:'1.2s'}};
  const c=cfg[rarity];if(!c)return;
  const scene=document.getElementById('fishing-scene');
  for(let i=0;i<c.count;i++)setTimeout(()=>{const ring=document.createElement('div');ring.className='rarity-aura';ring.style.cssText=`left:${bx}px;top:${by}px;border:2px solid ${c.color};--aura-size:${c.size};--aura-h:${c.h};--aura-dur:${c.dur};animation-delay:${i*.18}s`;scene.appendChild(ring);setTimeout(()=>ring.remove(),1500);},i*60);
}
function triggerRarityFlash(rarity){
  if(rarity==='common')return;
  const el=document.getElementById('rarity-flash');if(!el)return;
  el.className=`show ${rarity}`;
  if(rarity==='legendary'){document.getElementById('game-root').classList.add('shake');setTimeout(()=>document.getElementById('game-root').classList.remove('shake'),600);}
  setTimeout(()=>{el.className='';},1000);
}
function playCastFX(bx,by){
  const v=getCurrentRodVisual(),rod=document.getElementById('fm-rod');
  if(rod){rod.classList.remove('rod-equipped-idle');rod.classList.add('rod-casting');setTimeout(()=>{rod.classList.remove('rod-casting');if(v.idleAnim)rod.classList.add('rod-equipped-idle');},600);}
  if(v.particleColor)spawnParticles(bx,by+8,v.particleColor,10,{speed:2.2,life:35,size:2.5,spread:Math.PI});
}
function playBiteFX(bx,by){
  const v=getCurrentRodVisual(),rod=document.getElementById('fm-rod');
  if(rod){rod.classList.remove('rod-equipped-idle','rod-casting');rod.classList.add('rod-bending');}
  if(v.particleColor){spawnParticles(bx,by,v.particleColor,14,{speed:3,life:40,size:3,spread:Math.PI*.8});spawnParticles(bx,by,'#fff',6,{speed:2,life:25,size:1.5,spread:Math.PI*.6,glow:false});}
}
function playRarityFX(rarity,bx,by){
  if(rarity==='common')return;
  triggerRarityFlash(rarity);spawnRarityAura(bx,by,rarity);
  const v=getCurrentRodVisual(),rod=document.getElementById('fm-rod');
  if(rarity==='rare'){spawnParticles(bx,by,'#3b82f6',20,{speed:3,life:50,size:3,spread:Math.PI*1.4});spawnParticles(bx,by,'#93c5fd',10,{speed:4,life:35,size:1.8,spread:Math.PI*2});}
  else if(rarity==='epic'){spawnParticles(bx,by,'#a855f7',35,{speed:4,life:60,size:3.5,spread:Math.PI*2});spawnParticles(bx,by,'#ddd6fe',15,{speed:5,life:40,size:2,spread:Math.PI*2});if(rod){rod.classList.add('rod-bending');setTimeout(()=>{rod.classList.remove('rod-bending');if(v.idleAnim)rod.classList.add('rod-equipped-idle');},1200);}}
  else if(rarity==='legendary'){spawnParticles(bx,by,'#ffd700',55,{speed:5.5,life:75,size:4,spread:Math.PI*2,gravity:.05});spawnParticles(bx,by,'#fff7aa',25,{speed:7,life:55,size:2.5,spread:Math.PI*2,gravity:.03});spawnParticles(bx,by,'#fff',15,{speed:8,life:40,size:1.5,spread:Math.PI*2,gravity:.02});if(rod){rod.classList.add('rod-bending');setTimeout(()=>{rod.classList.remove('rod-bending');if(v.idleAnim)rod.classList.add('rod-equipped-idle');},1800);}}
}
function applyRodVisuals(){
  const v=getCurrentRodVisual(),rod=document.getElementById('fm-rod');if(!rod)return;
  rod.style.background=`linear-gradient(180deg,${v.rodGradient[0]},${v.rodGradient[1]})`;
  rod.style.width=v.rodWidth+'px';rod.style.boxShadow=`0 0 8px ${v.glowColor},0 0 2px ${v.glowColor}`;rod.style.setProperty('--rod-fx-color',v.glowColor);
  const tg=document.getElementById('rod-tip-glow');if(tg){tg.style.background=v.glowColor;tg.style.boxShadow=`0 0 14px ${v.glowColor},0 0 28px ${v.glowColor}`;}
  const lp=document.getElementById('line-path');if(lp){lp.style.stroke=v.lineColor;lp.style.strokeWidth=v.lineWidth;}
  if(v.idleAnim)rod.classList.add('rod-equipped-idle');else rod.classList.remove('rod-equipped-idle');
}
function resetRodVisuals(){
  const v=getCurrentRodVisual(),rod=document.getElementById('fm-rod');if(!rod)return;
  rod.classList.remove('rod-casting','rod-bending');
  if(v.idleAnim)rod.classList.add('rod-equipped-idle');else rod.classList.remove('rod-equipped-idle');
}

// ============================================================
//  render.js — HUD, home, inventory, shop, profile card,
//              location bar, catch result, nav, water
// ============================================================

// ── Water canvas ─────────────────────────────────────────
const waterCanvas=document.getElementById('water-canvas');
const waterCtx=waterCanvas.getContext('2d');
let waves=[],ripples=[],wt=0;

function resizeCanvas(){
  const wa=document.getElementById('water-area');
  waterCanvas.width=wa.offsetWidth;waterCanvas.height=wa.offsetHeight;
  waves=[];
  for(let i=0;i<7;i++)waves.push({y:waterCanvas.height*(.04+i*.08),amp:7-i*.6,freq:.011+i*.002,ph:Math.random()*Math.PI*2,spd:.013+i*.002,al:.16-i*.015});
}
function drawWater(){
  wt++;waterCtx.clearRect(0,0,waterCanvas.width,waterCanvas.height);
  const g=waterCtx.createLinearGradient(0,0,0,waterCanvas.height);
  g.addColorStop(0,'#2a8cc8');g.addColorStop(.25,'#1e6ea8');g.addColorStop(.6,'#164e80');g.addColorStop(1,'#0e2f50');
  waterCtx.fillStyle=g;waterCtx.fillRect(0,0,waterCanvas.width,waterCanvas.height);
  waves.forEach((w,idx)=>{w.ph+=w.spd;waterCtx.beginPath();waterCtx.moveTo(0,w.y);for(let x=0;x<=waterCanvas.width;x+=4)waterCtx.lineTo(x,w.y+Math.sin(x*w.freq+w.ph)*w.amp);waterCtx.strokeStyle=`rgba(0,175,255,${w.al+Math.sin(wt*.001+idx)*.022})`;waterCtx.lineWidth=1.2;waterCtx.stroke();});
  ripples=ripples.filter(r=>r.life>0);
  ripples.forEach(r=>{r.rad+=1.6;r.life--;waterCtx.beginPath();waterCtx.ellipse(r.x,r.y,r.rad,r.rad*.34,0,0,Math.PI*2);waterCtx.strokeStyle=`rgba(0,215,255,${r.life/r.max*.5})`;waterCtx.lineWidth=1.5;waterCtx.stroke();});
  requestAnimationFrame(drawWater);
}
function addRipple(x,y){for(let i=0;i<3;i++)ripples.push({x,y,rad:i*9,life:55-i*10,max:55-i*10});}

function makeStars(){
  const sky=document.getElementById('sky');
  for(let i=0;i<28;i++){const s=document.createElement('div');s.className='star';const sz=Math.random()*2+.5;s.style.cssText=`width:${sz}px;height:${sz}px;left:${Math.random()*100}%;top:${15+Math.random()*65}%;--dur:${2+Math.random()*3}s;--delay:${Math.random()*3}s`;sky.appendChild(s);}
  const cd=[{left:-18,top:10,w:70,h:26,dur:38,delay:0},{left:20,top:4,w:90,h:32,dur:52,delay:-18},{left:55,top:14,w:55,h:20,dur:44,delay:-8},{left:72,top:5,w:80,h:28,dur:60,delay:-32}];
  cd.forEach(c=>{const cloud=document.createElement('div');cloud.className='cloud';cloud.style.cssText=`left:${c.left}%;top:${c.top}%;--cd:${c.dur}s;animation-delay:${c.delay}s`;const body=document.createElement('div');body.className='cloud-body';body.style.cssText=`width:${c.w}px;height:${c.h}px;position:relative`;[{l:10,t:-12,s:32},{l:28,t:-18,s:40},{l:52,t:-14,s:36},{l:72,t:-8,s:26}].forEach(p=>{const puff=document.createElement('div');puff.className='cloud-puff';puff.style.cssText=`width:${p.s}px;height:${p.s}px;left:${p.l}px;top:${p.t}px`;body.appendChild(puff);});cloud.appendChild(body);sky.appendChild(cloud);});
}

// ── HUD ──────────────────────────────────────────────────
function updateHUD(){
  const dev=currentUser&&isDeveloperAccount(currentUser.username);
  document.getElementById('hud-coins').textContent=dev?'∞':fmt(S.coins);
  document.getElementById('hud-gems').textContent=dev?'∞':S.gems;
  document.getElementById('hud-nrg').textContent=`${S.energy}/${S.maxEnergy}`;
  document.getElementById('hud-level').textContent=S.level;
}

// ── Profile card ─────────────────────────────────────────
function renderProfileCard(){
  if(!currentUser)return;
  const slot=document.getElementById('profile-card-slot');if(!slot)return;
  const isDev=isDeveloperAccount(currentUser.username);
  const avatar=isDev?'⚡':currentUser.type==='guest'?'👤':'🎣';
  const nameStyle=isDev?`color:${DEV_ACCOUNT.displayColor};text-shadow:0 0 12px rgba(255,215,0,.65);font-weight:900`:'';
  const badgeHtml=isDev?`<div class="profile-badge dev">${DEV_ACCOUNT.badgeText} · ${DEV_ACCOUNT.role}</div>`:currentUser.type==='guest'?`<div class="profile-badge guest">👤 GUEST ACCOUNT</div>`:`<div class="profile-badge member">✅ MEMBER</div>`;
  const upgradeBtn=(!isDev&&currentUser.type==='guest')?`<button class="pbtn upgrade" id="profile-upgrade-btn">UPGRADE</button>`:'';
  const coinsD=isDev?'∞':fmt(S.coins),gemsD=isDev?'∞':String(S.gems);
  const avatarStyle=isDev?`background:linear-gradient(135deg,#ffd700,#ff8c00);box-shadow:0 0 22px rgba(255,215,0,.6);border-color:rgba(255,215,0,.6)`:'';
  slot.innerHTML=`<div class="profile-card ${isDev?'dev-card':''}"><div class="profile-avatar" style="${avatarStyle}">${avatar}</div><div class="profile-info"><div class="profile-name" style="${nameStyle}">${currentUser.username}</div>${badgeHtml}<div class="psr"><span class="ps lv">⭐LV${S.level}</span><span class="ps gold">🪙${coinsD}</span><span class="ps gem">💎${gemsD}</span></div></div><div class="profile-btns">${upgradeBtn}<button class="pbtn logout" id="profile-logout-btn">LOGOUT</button></div></div>`;
  document.getElementById('profile-logout-btn').addEventListener('click',doLogout);
  const ub=document.getElementById('profile-upgrade-btn');if(ub)ub.addEventListener('click',openUpgradeModal);
}

// ── Navigation ───────────────────────────────────────────
function goScreen(name){
  S.activeScreen=name;
  document.querySelectorAll('.overlay-screen').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  const cb=document.getElementById('cast-btn');
  if(name==='fishing'){
    cb.style.display=(S.phase==='idle'&&!autoFishingEnabled)?'block':'none';
    document.getElementById('nav-fishing').classList.add('active');
    playMusicForScreen('fishing');
  }else{
    if(autoFishingEnabled)stopAutoFishing();
    document.getElementById('screen-'+name).classList.add('active');
    cb.style.display='none';
    const nb=document.getElementById('nav-'+name);if(nb)nb.classList.add('active');
    if(name==='home')renderHome();
    if(name==='inventory')renderInv();
    if(name==='shop')renderShop('upgrades');
    playMusicForScreen('home');
  }
  updateAFPanel();
}

// ── Home ─────────────────────────────────────────────────
function renderHome(){
  renderProfileCard();
  document.getElementById('st-total').textContent=S.stats.caught;
  document.getElementById('st-earned').textContent=fmt(S.stats.earned);
  document.getElementById('st-best').textContent=S.stats.bestW>0?S.stats.bestW+'kg':'—';
  document.getElementById('st-loc').textContent=LOCS.find(l=>l.id===S.loc)?.name||'River';
  document.getElementById('xp-lv').textContent=S.level;
  document.getElementById('xp-nums').textContent=`${S.xp}/${S.xpNext}`;
  document.getElementById('xp-bar').style.width=(S.xp/S.xpNext*100)+'%';
  const rl=document.getElementById('recent-list');
  if(!S.recent.length){rl.innerHTML='<div style="color:rgba(255,255,255,.3);font-size:12px;text-align:center;padding:22px">No catches yet — go fishing!</div>';return;}
  rl.innerHTML=S.recent.slice(0,6).map(f=>`<div class="ri"><div class="ri-icon">${f.icon||'🐟'}</div><div class="ri-info"><div class="ri-name">${f.name}</div><div class="ri-sub" style="color:${RC[f.rarity]}">${f.rarity.toUpperCase()} · ${f.weight}kg</div></div><div class="ri-val">${fmt(f.sellVal)}🪙</div></div>`).join('');
}

// ── Location bar ─────────────────────────────────────────
function renderLocBar(){
  const bar=document.getElementById('location-bar');if(!bar)return;
  bar.innerHTML=LOCS.map(l=>{const ok=l.unlocked||S.level>=l.req;return`<div class="loc-chip ${S.loc===l.id?'active':''} ${!ok?'locked':''}" data-locid="${l.id}" data-req="${l.req}"><span class="lci">${l.icon}</span><span class="lcn">${l.name}</span>${!ok?'<span class="lck">🔒</span>':''}</div>`;}).join('');
  bar.querySelectorAll('.loc-chip').forEach(chip=>{chip.addEventListener('click',()=>{const id=chip.dataset.locid;const ok=LOCS.find(l=>l.id===id)?.unlocked||S.level>=parseInt(chip.dataset.req);if(!ok){showToast('Reach Lv.'+chip.dataset.req+' to unlock!');return;}if(S.phase!=='idle')return;S.loc=id;renderLocBar();showToast('📍 '+LOCS.find(l=>l.id===id).name);});});
}

// ── Inventory ────────────────────────────────────────────
let invF='all';
function renderInv(){
  const g=document.getElementById('inv-grid');
  const list=invF==='all'?S.inv:S.inv.filter(f=>f.rarity===invF);
  if(!list.length){g.innerHTML='<div style="grid-column:1/-1;color:rgba(255,255,255,.3);font-size:12px;text-align:center;padding:32px">No fish here</div>';return;}
  g.innerHTML=list.map(f=>`<div class="inv-card" data-uid="${f.uid}"><div class="inv-rbar" style="background:${RC[f.rarity]}"></div><div class="inv-fi">${f.icon||'🐟'}</div><div class="inv-fn">${f.name}</div><div class="inv-fw">${f.weight}kg</div><div class="inv-fv">${fmt(f.sellVal)}🪙</div></div>`).join('');
  g.querySelectorAll('.inv-card').forEach(card=>{card.addEventListener('click',()=>sellFish(parseInt(card.dataset.uid)));});
}
function sellFish(uid){const i=S.inv.findIndex(f=>f.uid===uid);if(i<0)return;const f=S.inv[i];S.coins+=f.sellVal;S.inv.splice(i,1);showToast(`💰 Sold ${f.name} for ${f.sellVal}`);updateHUD();renderInv();autoSave();}
function sellAllFish(){if(!S.inv.length){showToast('Inventory empty!');return;}const tot=S.inv.reduce((s,f)=>s+f.sellVal,0);S.coins+=tot;S.inv=[];showToast(`💰 Sold all for ${fmt(tot)} coins!`);updateHUD();renderInv();autoSave();}

// ── Shop ─────────────────────────────────────────────────
let shopTabName='upgrades';
function upCost(u){return Math.floor(u.baseCost*Math.pow(u.mult,S.upg[u.id]));}
function renderShop(tab){
  shopTabName=tab;
  document.querySelectorAll('.st').forEach(t=>t.classList.remove('on'));
  document.getElementById('st-'+tab)?.classList.add('on');
  const c=document.getElementById('shop-content');
  if(tab==='upgrades'){
    c.innerHTML=UPGRADES.map(u=>{const lv=S.upg[u.id],cost=upCost(u),maxed=lv>=u.maxLvl;const dots=Array.from({length:u.maxLvl},(_,i)=>`<div class="ld ${i<lv?'on':''}"></div>`).join('');return`<div class="upg-card"><div class="upg-icon">${u.icon}</div><div class="upg-info"><div class="upg-name">${u.name}</div><div class="upg-desc">${u.desc}</div><div class="lvl-dots">${dots}</div></div><button class="upg-btn ${maxed?'maxed':''}" data-upgid="${u.id}">${maxed?'<span class="upg-cost">MAX</span>':`<span class="upg-cost">${fmt(cost)}</span><span class="upg-clabel">🪙 COINS</span>`}</button></div>`;}).join('');
    c.querySelectorAll('.upg-btn:not(.maxed)').forEach(btn=>{btn.addEventListener('click',()=>buyUpg(btn.dataset.upgid));});
  } else if(tab==='rods'){
    c.innerHTML=`<div class="rods-section-title">✨ EXCLUSIVE RODS</div>`+EXCLUSIVE_RODS.map(rod=>{
      const owned=S.ownedRods.includes(rod.id),equipped=S.equippedRod===rod.id,isDev=currentUser&&isDeveloperAccount(currentUser.username);
      const chips=Object.entries(rod.bonuses).filter(([,v])=>v>0).map(([k,v])=>{const labs={biteChanceBonus:'🎣 Bite',tensionControlBonus:'📏 Tension',catchSuccessBonus:'✅ Catch',rareFishChanceBonus:'💎 Rarity',weightBonus:'⚖️ Weight',incomeBonus:'💰 Income'};return`<span class="rod-bonus-chip ${['rareFishChanceBonus','incomeBonus'].includes(k)?'highlight':''}">${labs[k]||k} +${Math.round(v*100)}%</span>`;}).join('');
      const action=equipped?`<button class="rod-action-btn equipped-btn" style="--rod-color:${rod.color}" disabled>✓ EQUIPPED</button>`:(owned||isDev)?`<button class="rod-action-btn equip-btn" data-rodid="${rod.id}">EQUIP</button>`:`<button class="rod-action-btn buy-btn" data-rodid="${rod.id}">BUY</button>`;
      const price=(owned||equipped)?`<div class="rod-equipped-badge">✓ OWNED</div>`:`<div class="rod-price"><span>💎</span><span>${rod.priceGems.toLocaleString()}</span><span class="rod-price-label"> gems</span></div>`;
      return`<div class="rod-card ${owned?'owned':''} ${equipped?'equipped':''} ${rod.rarity==='Mythic'?'mythic':''}" style="--rod-color:${rod.color};--rod-glow:${rod.glowColor}"><div class="rod-card-top"><div class="rod-icon-wrap">${rod.icon}</div><div class="rod-info"><div class="rod-name">${rod.name}</div><div class="rod-tier-row"><span class="rod-rarity">${rod.rarity}</span><span class="rod-tier-num">TIER ${rod.tier}</span></div><div class="rod-desc">${rod.desc}</div></div></div><div class="rod-bonuses">${chips}</div><div class="rod-card-bottom">${price}${action}</div></div>`;
    }).join('');
    c.querySelectorAll('.buy-btn').forEach(btn=>btn.addEventListener('click',()=>buyRod(btn.dataset.rodid)));
    c.querySelectorAll('.equip-btn').forEach(btn=>btn.addEventListener('click',()=>equipRod(btn.dataset.rodid)));
  } else if(tab==='premium'){
    const afOwned=S.autoFishingUnlocked;
    const afCard=afOwned?`<div class="upg-card"><div class="upg-icon">🤖</div><div class="upg-info"><div class="upg-name">Auto Fishing</div><div class="upg-desc">Automatically repeats the fishing loop.</div><div style="font-size:9px;color:var(--neon-green);font-family:var(--font-hud);margin-top:4px;letter-spacing:1px">✓ UNLOCKED</div></div><div class="upg-btn maxed"><span class="upg-cost" style="font-size:10px">OWNED</span></div></div>`:`<div class="upg-card"><div class="upg-icon">🤖</div><div class="upg-info"><div class="upg-name">Auto Fishing</div><div class="upg-desc">Automatically repeats the fishing loop forever.</div></div><button class="upg-btn" id="btn-buy-autofishing" style="background:linear-gradient(135deg,rgba(0,180,100,.75),rgba(0,140,80,.55));border-color:rgba(0,210,120,.5)"><span class="upg-cost">2500</span><span class="upg-clabel">💎 GEMS</span></button></div>`;
    c.innerHTML=`${afCard}<div class="upg-card"><div class="upg-icon">⚡</div><div class="upg-info"><div class="upg-name">Energy Refill</div><div class="upg-desc">Restore full energy</div></div><button class="upg-btn" id="btn-refill" style="background:linear-gradient(135deg,rgba(150,0,255,.7),rgba(80,0,200,.5));border-color:rgba(150,0,255,.5)"><span class="upg-cost">5</span><span class="upg-clabel">💎 GEMS</span></button></div><div class="upg-card"><div class="upg-icon">💰</div><div class="upg-info"><div class="upg-name">Coin Pack</div><div class="upg-desc">+500 coins instantly</div></div><button class="upg-btn" id="btn-coinpack" style="background:linear-gradient(135deg,rgba(150,0,255,.7),rgba(80,0,200,.5));border-color:rgba(150,0,255,.5)"><span class="upg-cost">10</span><span class="upg-clabel">💎 GEMS</span></button></div>`;
    const afBtn=document.getElementById('btn-buy-autofishing');if(afBtn)afBtn.addEventListener('click',buyAutoFishing);
    document.getElementById('btn-refill').addEventListener('click',()=>{if(S.gems<5){showToast('Need 5 gems!');return;}S.gems-=5;S.energy=S.maxEnergy;showToast('⚡ Refilled!');updateHUD();autoSave();});
    document.getElementById('btn-coinpack').addEventListener('click',()=>{if(S.gems<10){showToast('Need 10 gems!');return;}S.gems-=10;S.coins+=500;showToast('💰 +500 Coins!');updateHUD();autoSave();});
  } else {
    c.innerHTML=LOCS.filter(l=>!l.unlocked&&S.level<l.req).map(l=>`<div class="upg-card"><div class="upg-icon">${l.icon}</div><div class="upg-info"><div class="upg-name">${l.name}</div><div class="upg-desc">Unlock at Level ${l.req}</div><div style="font-size:10px;color:rgba(255,255,255,.35);margin-top:3px">Your level: ${S.level}/${l.req}</div></div><div style="font-family:var(--font-hud);font-size:12px;color:rgba(255,255,255,.35)">🔒</div></div>`).join('')||'<div style="color:rgba(255,255,255,.3);font-size:12px;text-align:center;padding:32px">All areas unlocked!</div>';
  }
}

function buyUpg(id){const u=UPGRADES.find(x=>x.id===id);if(!u)return;const lv=S.upg[id];if(lv>=u.maxLvl){showToast('Already max!');sfxError();return;}const cost=upCost(u);if(S.coins<cost){showToast(`Need ${fmt(cost)} coins!`);sfxError();return;}S.coins-=cost;S.upg[id]++;sfxPurchase();showToast(`✅ ${u.name} → Lv.${S.upg[id]}`);updateHUD();renderShop(shopTabName);autoSave();}
function buyRod(rodId){const rod=EXCLUSIVE_RODS.find(r=>r.id===rodId);if(!rod)return;if(S.ownedRods.includes(rodId)){showToast('Already owned!');sfxError();return;}if(S.gems<rod.priceGems){showToast(`Need 💎${rod.priceGems}!`);sfxError();return;}S.gems-=rod.priceGems;S.ownedRods.push(rodId);sfxPurchase();showToast(`🎉 ${rod.name} purchased!`);updateHUD();autoSave();renderShop('rods');}
function equipRod(rodId){const rod=EXCLUSIVE_RODS.find(r=>r.id===rodId);if(!rod)return;const isDev=currentUser&&isDeveloperAccount(currentUser.username);if(!isDev&&!S.ownedRods.includes(rodId)){showToast("You don't own this rod!");sfxError();return;}S.equippedRod=rodId;sfxEquip();showToast(`🎣 ${rod.name} equipped!`);applyRodVisuals();autoSave();renderShop('rods');}
function buyAutoFishing(){if(S.autoFishingUnlocked){showToast('Already unlocked!');sfxError();return;}if(S.gems<2500){showToast('Need 💎2500!');sfxError();return;}S.gems-=2500;S.autoFishingUnlocked=true;sfxPurchase();showToast('🤖 Auto Fishing unlocked!');updateHUD();autoSave();renderShop('premium');updateAFPanel();}

// ── Catch result screen ──────────────────────────────────
function showCatchResult(fish){
  const rd=RARITY_DISPLAY[fish.rarity]||RARITY_DISPLAY.common;
  const glow=fish.glow||rd.glow;
  const cr=document.getElementById('catch-result');
  cr.style.setProperty('--cr-glow',glow);
  document.getElementById('cr-rarity-bg').style.setProperty('--cr-glow',glow);
  document.getElementById('cr-title').textContent=rd.title;
  document.getElementById('cr-title').style.textShadow=`0 0 18px ${glow}`;
  document.getElementById('cr-name').textContent=fish.name;
  const badge=document.getElementById('cr-rarity-badge');
  badge.textContent=rd.label;badge.style.color=rd.color;badge.style.borderColor=glow;badge.style.textShadow=`0 0 8px ${glow}`;
  document.getElementById('cr-wt').textContent=fish.weight+' kg';
  document.getElementById('cr-val').textContent=fish.sellVal+' 🪙';
  document.getElementById('cr-xp').textContent='+'+fish.xp;
  const heroSlot=document.getElementById('cr-fish-hero');
  if(heroSlot){heroSlot.style.filter=glow?`drop-shadow(0 0 18px ${glow}) drop-shadow(0 0 36px ${glow})`:'none';renderFishInline(fish.id,heroSlot,280);heroSlot.style.animation='none';void heroSlot.offsetHeight;heroSlot.style.animation='crFishBounce .7s cubic-bezier(.36,.07,.19,.97) both';}
  cr.classList.add('on');
}

// ============================================================
//  fishing.js — Cast, bite, minigame, auto fishing
// ============================================================

let biteTimer=null,mgInterval=null,holding=false;
let fzPos=50,fzDir=1,curPos=50,tension=50,mgFish=null;
let uidCounter=1;
let autoFishingEnabled=false,autoFishTimeout=null,autoFishCatchTimer=null;

function updateLine(bx,by){
  const root=document.getElementById('game-root'),rr=root.getBoundingClientRect();
  const rodEl=document.getElementById('fm-rod'),rrod=rodEl.getBoundingClientRect();
  const tx=rrod.right-rr.left,ty=rrod.top-rr.top;
  const p=document.getElementById('line-path');
  if(bx!=null){const mx=(tx+bx)/2,my=Math.max(ty,by)+18;p.setAttribute('d',`M${tx},${ty} Q${mx},${my} ${bx},${by}`);}
  else p.setAttribute('d','');
}

function castLine(){
  try{
    if(S.phase!=='idle')return;
    if(S.energy<=0){showToast('⚡ Out of energy!');return;}
    S.energy=Math.max(0,S.energy-1);updateHUD();S.phase='waiting';
    const root=document.getElementById('game-root'),rr=root.getBoundingClientRect();
    const wa=document.getElementById('water-area'),wr=wa.getBoundingClientRect();
    const bx=rr.width*(.28+Math.random()*.44);
    const by=(wr.top-rr.top)+wr.height*(.08+Math.random()*.28);
    const bob=document.getElementById('bobber');
    bob.style.left=bx+'px';bob.style.top=by+'px';bob.style.display='block';bob.className='bobbing';
    updateLine(bx,by);addRipple(bx,by-(wr.top-rr.top));sfxCast();playCastFX(bx,by);
    document.getElementById('cast-btn').style.display='none';
    document.getElementById('rod-tip-glow').style.opacity='1';
    const rod=getEquippedRodBonuses();
    const wait=Math.max(600,(4200-S.upg.rod_luck*600-rod.biteChanceBonus*2000)-Math.random()*1600);
    biteTimer=setTimeout(()=>triggerBite(bx,by),wait);
  }catch(e){console.error('castLine',e);S.phase='idle';}
}

function triggerBite(bx,by){
  S.phase='biting';
  const bob=document.getElementById('bobber');
  bob.className='biting';bob.style.top=(parseFloat(bob.style.top)+14)+'px';
  updateLine(bx,parseFloat(bob.style.top));
  const wa=document.getElementById('water-area'),rr=document.getElementById('game-root').getBoundingClientRect();
  addRipple(bx,parseFloat(bob.style.top)-(wa.getBoundingClientRect().top-rr.top));
  playBiteFX(bx,parseFloat(bob.style.top));sfxSplash();playBiteSFX();
  document.getElementById('bite-indicator').style.display='flex';
  biteTimer=setTimeout(()=>missedBite(),3000);
}
function tapBite(){if(S.phase!=='biting')return;clearTimeout(biteTimer);document.getElementById('bite-indicator').style.display='none';startMG();}
function missedBite(){document.getElementById('bite-indicator').style.display='none';sfxFishEscaped();resetFishing();showToast('🐟 It got away...');}

function startMG(){
  try{
    S.phase='minigame';
    const pool=FISH_DB[S.loc]||FISH_DB.river,luck=S.upg.rod_luck,rod=getEquippedRodBonuses();
    const rb=rod.rareFishChanceBonus*100,roll=Math.random()*100;
    let bucket;
    if(roll<2+luck+rb*.5)bucket=pool.filter(f=>f.rarity==='legendary');
    else if(roll<8+luck*3+rb*1.2)bucket=pool.filter(f=>f.rarity==='epic');
    else if(roll<25+luck*5+rb*2)bucket=pool.filter(f=>f.rarity==='rare');
    else bucket=pool.filter(f=>f.rarity==='common');
    if(!bucket.length)bucket=pool;
    const tmpl=bucket[Math.floor(Math.random()*bucket.length)];
    const wm=1+rod.weightBonus;
    const w=tmpl.minW+Math.random()*(tmpl.maxW*wm-tmpl.minW);
    const bVal=Math.floor(tmpl.baseVal*(.8+w/(tmpl.maxW*wm)*.4));
    mgFish={...tmpl,weight:parseFloat(w.toFixed(2)),sellVal:Math.floor(bVal*(1+rod.incomeBonus)),uid:uidCounter++,icon:'🐟'};
    const bob=document.getElementById('bobber');
    if(tmpl.rarity!=='common')setTimeout(()=>playRarityFX(tmpl.rarity,parseFloat(bob.style.left),parseFloat(bob.style.top)),120);
    document.getElementById('mg-icon').textContent=tmpl.icon||'🐟';
    document.getElementById('mg-name').textContent=tmpl.name;
    document.getElementById('mg-weight').textContent=mgFish.weight+' kg';
    const badge=document.getElementById('mg-badge');badge.textContent=tmpl.rarity.toUpperCase();badge.style.background=RC[tmpl.rarity]+'33';badge.style.color=RC[tmpl.rarity];
    fzPos=50;fzDir=1;curPos=50;tension=50;holding=false;
    document.getElementById('minigame-overlay').classList.add('on');updateTensionUI();
    const diff=(LOCS.find(l=>l.id===S.loc)||LOCS[0]).diff;
    const spd=.38+diff*.28+(tmpl.rarity==='legendary'?.5:0)+(tmpl.rarity==='epic'?.28:0);
    mgInterval=setInterval(()=>tickMG(spd),30);
  }catch(e){console.error('startMG',e);resetFishing();}
}

function tickMG(spd){
  fzPos+=fzDir*spd*(.75+Math.random()*.5);
  if(fzPos>84||fzPos<16){fzDir*=-1;if(Math.random()<.28)fzDir*=-1;}
  fzPos=Math.max(5,Math.min(95,fzPos));
  const rod=getEquippedRodBonuses(),str=1+S.upg.rod_str*.2;
  const zoneW=9+rod.tensionControlBonus*25;
  const curSpd=1.15*str*(1+rod.catchSuccessBonus*.8);
  if(holding)curPos=Math.min(100,curPos+curSpd);else curPos=Math.max(0,curPos-.75);
  const inZone=Math.abs(curPos-fzPos)<zoneW;
  const tDrain=1.6+rod.catchSuccessBonus*2.5;
  const tGainH=2.4*(1-rod.tensionControlBonus*.6);
  const tGainD=.85*(1-rod.tensionControlBonus*.4);
  if(inZone)tension=Math.max(0,tension-tDrain);else tension=Math.min(100,tension+(holding?tGainH:tGainD));
  if(tension>=100){clearInterval(mgInterval);document.getElementById('minigame-overlay').classList.remove('on');resetFishing();showToast('💥 Line snapped!');return;}
  if(tension<=0){clearInterval(mgInterval);document.getElementById('minigame-overlay').classList.remove('on');doCatch();return;}
  updateTensionUI();
}
function updateTensionUI(){
  const fill=document.getElementById('tension-fill'),cur=document.getElementById('t-cursor'),fz=document.getElementById('fish-zone'),pct=document.getElementById('t-pct');
  fill.style.width=tension+'%';
  const col=tension<30?'var(--neon-green)':tension<68?'#fbbf24':'var(--neon-red)';
  fill.style.background=col;pct.style.color=col;pct.textContent=Math.round(tension)+'%';
  cur.style.left=`calc(${curPos}% - 2px)`;fz.style.left=`calc(${fzPos-9}%)`;fz.style.width='18%';
}

function doCatch(){
  try{
    S.phase='caught';const f=mgFish;
    S.stats.caught++;S.stats.earned+=f.sellVal;
    if(f.weight>S.stats.bestW){S.stats.bestW=f.weight;S.stats.bestN=f.name;}
    S.xp+=f.xp;let leveled=false;
    while(S.xp>=S.xpNext){S.xp-=S.xpNext;S.level++;S.xpNext=Math.floor(100*Math.pow(1.4,S.level-1));showToast(`🎉 Level Up! LV.${S.level}`);checkUnlocks();leveled=true;}
    S.recent.unshift({...f});if(S.recent.length>10)S.recent.pop();
    showCatchResult(f);if(leveled)setTimeout(sfxLevelUp,350);sfxForRarity(f.rarity);updateHUD();autoSave();
  }catch(e){console.error('doCatch',e);resetFishing();}
}

function resetFishing(){
  S.phase='idle';clearTimeout(biteTimer);clearInterval(mgInterval);
  const bob=document.getElementById('bobber');bob.style.display='none';bob.className='';
  document.getElementById('rod-tip-glow').style.opacity='0';
  document.getElementById('bite-indicator').style.display='none';
  updateLine(null,null);resetRodVisuals();
  if(S.activeScreen==='fishing')document.getElementById('cast-btn').style.display='block';
}

function checkUnlocks(){LOCS.forEach(l=>{if(!l.unlocked&&S.level>=l.req){l.unlocked=true;showToast(`🗺️ ${l.name} unlocked!`);}});renderLocBar();autoSave();}

// ── Auto fishing ─────────────────────────────────────────
function updateAFPanel(){
  const panel=document.getElementById('auto-fish-panel');if(!panel)return;
  if(S.activeScreen!=='fishing'){panel.classList.remove('visible');panel.innerHTML='';return;}
  panel.classList.add('visible');
  if(!S.autoFishingUnlocked){
    panel.innerHTML=`<div class="af-locked-card" id="af-goto-shop"><span class="af-locked-icon">🤖</span><div class="af-locked-info"><div class="af-locked-title">AUTO FISHING</div><div class="af-locked-sub">Premium feature — unlock in Shop</div></div><div class="af-locked-btn">💎 UNLOCK</div></div>`;
    document.getElementById('af-goto-shop').addEventListener('click',()=>{goScreen('shop');setTimeout(()=>renderShop('premium'),80);});
  }else{
    const on=autoFishingEnabled;
    const st=on?(S.phase==='waiting'?'🎣 CASTING...':S.phase==='biting'?'🐟 FISH ON!':S.phase==='caught'?'✅ CATCHING...':'⚙️ AUTO ACTIVE'):'TAP TO ENABLE';
    panel.innerHTML=`<div class="af-toggle-card ${on?'af-on':''}" id="af-toggle-btn"><span class="af-toggle-icon">${on?'🟢':'🤖'}</span><div class="af-toggle-info"><div class="af-toggle-title">AUTO FISHING ${on?'ON':'OFF'}</div><div class="af-status-text" id="af-status-text">${st}</div></div><div class="af-pill"><div class="af-pill-dot"></div></div></div>`;
    document.getElementById('af-toggle-btn').addEventListener('click',toggleAutoFishing);
    document.getElementById('af-toggle-btn').addEventListener('touchend',e=>{e.preventDefault();toggleAutoFishing();},{passive:false});
  }
}
function setAFStatus(t){const el=document.getElementById('af-status-text');if(el)el.textContent=t;}
function toggleAutoFishing(){if(!S.autoFishingUnlocked)return;autoFishingEnabled?stopAutoFishing():startAutoFishing();}
function startAutoFishing(){
  if(autoFishingEnabled||S.activeScreen!=='fishing')return;
  autoFishingEnabled=true;
  const cb=document.getElementById('cast-btn');if(cb)cb.style.display='none';
  updateAFPanel();scheduleAutoFishCast(300);
}
function stopAutoFishing(){
  autoFishingEnabled=false;clearTimeout(autoFishTimeout);clearTimeout(autoFishCatchTimer);autoFishTimeout=autoFishCatchTimer=null;
  if(S.phase!=='idle'&&S.phase!=='caught'){clearTimeout(biteTimer);clearInterval(mgInterval);document.getElementById('minigame-overlay').classList.remove('on');document.getElementById('bite-indicator').style.display='none';document.getElementById('catch-result').classList.remove('on');}
  resetFishing();updateAFPanel();
}
function scheduleAutoFishCast(delay){
  if(!autoFishingEnabled)return;clearTimeout(autoFishTimeout);
  autoFishTimeout=setTimeout(()=>{if(!autoFishingEnabled||S.activeScreen!=='fishing')return;if(S.phase!=='idle'){scheduleAutoFishCast(500);return;}if(S.energy<=0){setAFStatus('⚡ NO ENERGY...');scheduleAutoFishCast(4000);return;}autoFishLoop();},delay);
}
function autoFishLoop(){
  if(!autoFishingEnabled||S.activeScreen!=='fishing'||S.phase!=='idle'){scheduleAutoFishCast(600);return;}
  S.energy=Math.max(0,S.energy-1);updateHUD();S.phase='waiting';setAFStatus('🎣 CASTING...');
  const root=document.getElementById('game-root'),rr=root.getBoundingClientRect();
  const wa=document.getElementById('water-area'),wr=wa.getBoundingClientRect();
  const bx=rr.width*(.28+Math.random()*.44),by=(wr.top-rr.top)+wr.height*(.08+Math.random()*.28);
  const bob=document.getElementById('bobber');bob.style.left=bx+'px';bob.style.top=by+'px';bob.style.display='block';bob.className='bobbing';
  updateLine(bx,by);addRipple(bx,by-(wr.top-rr.top));document.getElementById('rod-tip-glow').style.opacity='1';
  const rod=getEquippedRodBonuses();
  const wait=Math.max(800,(4200-S.upg.rod_luck*600-rod.biteChanceBonus*2000)-Math.random()*1600)*1.15;
  autoFishTimeout=setTimeout(()=>{
    if(!autoFishingEnabled||S.activeScreen!=='fishing'){resetFishing();return;}
    S.phase='biting';bob.className='biting';bob.style.top=(parseFloat(bob.style.top)+14)+'px';
    updateLine(bx,parseFloat(bob.style.top));addRipple(bx,parseFloat(bob.style.top)-(wr.top-rr.top));
    playBiteSFX();setAFStatus('🐟 FISH ON! REELING...');
    const pool=FISH_DB[S.loc]||FISH_DB.river,luck=S.upg.rod_luck,rb=rod.rareFishChanceBonus*100*.85,roll=Math.random()*100;
    let bucket;
    if(roll<2+luck+rb*.5)bucket=pool.filter(f=>f.rarity==='legendary');
    else if(roll<8+luck*3+rb*1.2)bucket=pool.filter(f=>f.rarity==='epic');
    else if(roll<25+luck*5+rb*2)bucket=pool.filter(f=>f.rarity==='rare');
    else bucket=pool.filter(f=>f.rarity==='common');
    if(!bucket.length)bucket=pool;
    const tmpl=bucket[Math.floor(Math.random()*bucket.length)];
    const catchChance=Math.min(.97,.82+rod.catchSuccessBonus*.8+S.upg.rod_str*.03);
    const success=Math.random()<catchChance;
    autoFishTimeout=setTimeout(()=>{
      if(!autoFishingEnabled||S.activeScreen!=='fishing'){resetFishing();return;}
      bob.style.display='none';bob.className='';document.getElementById('rod-tip-glow').style.opacity='0';document.getElementById('bite-indicator').style.display='none';updateLine(null,null);
      if(!success){S.phase='idle';setAFStatus('💨 ESCAPED...');autoSave();scheduleAutoFishCast(1400);return;}
      const wm=1+rod.weightBonus,w=tmpl.minW+Math.random()*(tmpl.maxW*wm-tmpl.minW);
      const bVal=Math.floor(tmpl.baseVal*(.8+w/(tmpl.maxW*wm)*.4));
      const caught={...tmpl,weight:parseFloat(w.toFixed(2)),sellVal:Math.floor(bVal*(1+rod.incomeBonus)),uid:uidCounter++,icon:'🐟'};
      S.phase='caught';S.stats.caught++;S.stats.earned+=caught.sellVal;
      if(caught.weight>S.stats.bestW){S.stats.bestW=caught.weight;S.stats.bestN=caught.name;}
      S.xp+=caught.xp;
      while(S.xp>=S.xpNext){S.xp-=S.xpNext;S.level++;S.xpNext=Math.floor(100*Math.pow(1.4,S.level-1));showToast(`🎉 LV.${S.level}`);checkUnlocks();}
      S.recent.unshift({...caught});if(S.recent.length>10)S.recent.pop();S.inv.push({...caught});
      showCatchResult(caught);updateHUD();playCatchSFX();autoSave();setAFStatus(`✅ ${caught.name}`);
      autoFishCatchTimer=setTimeout(()=>{document.getElementById('catch-result').classList.remove('on');S.phase='idle';if(autoFishingEnabled&&S.activeScreen==='fishing'){updateAFPanel();scheduleAutoFishCast(900);}},1600);
    },900);
  },wait);
}

// ============================================================
//  main.js — Auth, boot, event bindings
// ============================================================

let authTab='login';
function switchAuthTab(tab){
  authTab=tab;
  document.getElementById('tab-login').classList.toggle('active',tab==='login');
  document.getElementById('tab-register').classList.toggle('active',tab==='register');
  const fl=document.getElementById('form-login'),fr=document.getElementById('form-register');
  fl.style.display=tab==='login'?'flex':'none';fl.style.flexDirection='column';
  fr.style.display=tab==='register'?'flex':'none';fr.style.flexDirection='column';
  document.getElementById('login-msg').textContent='';document.getElementById('reg-msg').textContent='';
}
function setAuthMsg(id,text,isOk=false){const el=document.getElementById(id);if(!el)return;el.className='auth-msg'+(isOk?' ok':'');el.textContent=text;}
function setAuthLoading(btnId,loading,label){const btn=document.getElementById(btnId);if(!btn)return;btn.disabled=loading;btn.textContent=loading?'⏳ Please wait...':label;}

async function doRegister(){
  const u=document.getElementById('reg-user').value.trim(),e=document.getElementById('reg-email').value.trim(),p=document.getElementById('reg-pass').value;
  setAuthMsg('reg-msg','');
  if(!u||u.length<3){setAuthMsg('reg-msg','Username must be 3+ characters');return;}
  if(u.length>20){setAuthMsg('reg-msg','Username too long (max 20)');return;}
  if(!/^[a-zA-Z0-9_]+$/.test(u)){setAuthMsg('reg-msg','Letters, numbers, underscores only');return;}
  if(!e||!e.includes('@')){setAuthMsg('reg-msg','Valid email required');return;}
  if(!p||p.length<6){setAuthMsg('reg-msg','Password must be 6+ characters');return;}
  setAuthLoading('btn-register',true,'✨ CREATE ACCOUNT');
  try{
    const taken=await supaUsernameExists(u);if(taken){setAuthMsg('reg-msg','Username already taken');return;}
    const sr=await supaSignUp(e,p);if(!sr.ok){setAuthMsg('reg-msg',sr.data?.error_description||'Registration failed');return;}
    const si=await supaSignIn(e,p);if(!si.ok||!si.data?.access_token){setAuthMsg('reg-msg','✅ Account created! Check email to confirm, then log in.',true);return;}
    storeSession(si.data);const jwt=si.data.access_token,uid=si.data.user?.id;
    await supaUpsertProfile(uid,u,'member',jwt);
    setAuthMsg('reg-msg',`✅ Welcome, ${u}! 🎣`,true);
    setTimeout(()=>loginUserCloud(u,'member',e,uid),700);
  }catch{setAuthMsg('reg-msg','Registration error — try again.');}
  finally{setAuthLoading('btn-register',false,'✨ CREATE ACCOUNT');}
}

async function doLogin(){
  const e=document.getElementById('login-user').value.trim(),p=document.getElementById('login-pass').value;
  setAuthMsg('login-msg','');if(!e){setAuthMsg('login-msg','Enter your email');return;}if(!p){setAuthMsg('login-msg','Enter your password');return;}
  setAuthLoading('btn-login',true,'🎮 PLAY NOW');
  try{
    const res=await supaSignIn(e,p);if(!res.ok||!res.data?.access_token){setAuthMsg('login-msg',res.data?.error_description||'Invalid email or password');return;}
    storeSession(res.data);const jwt=res.data.access_token,uid=res.data.user?.id;
    const profile=await supaLoadProfile(uid,jwt);const username=profile?.username||('user_'+uid.slice(0,8)),type=profile?.account_type||'member';
    setAuthMsg('login-msg',isDeveloperAccount(username)?`⚡ Welcome, Developer ${username}!`:`Welcome back, ${username}! 🎣`,true);
    setTimeout(()=>loginUserCloud(username,type,e,uid),600);
  }catch{setAuthMsg('login-msg','Login error — try again.');}
  finally{setAuthLoading('btn-login',false,'🎮 PLAY NOW');}
}

function doGuest(){
  let gId;try{gId=localStorage.getItem('fc_guest_id');}catch{}
  if(!gId||gId==='armen'){gId='Guest_'+Math.random().toString(36).slice(2,7).toUpperCase();try{localStorage.setItem('fc_guest_id',gId);}catch{}}
  try{const raw=localStorage.getItem('fc_save_guest_'+gId);if(raw)applySaveData(JSON.parse(raw));}catch{}
  currentUser={username:gId,type:'guest',email:'',userId:null};enterGame();
}

async function loginUserCloud(username,type,email,userId){
  try{
    currentUser={username,type,email,userId};const jwt=getJWT();
    let loaded=false;
    if(userId&&jwt){const cs=await supaLoadSave(userId,jwt);if(cs){applySaveData(cs);loaded=true;}}
    if(!loaded){try{const raw=localStorage.getItem('fc_save_local');if(raw)applySaveData(JSON.parse(raw));}catch{}}
    if(isDeveloperAccount(username)){applyDevPerks();}
    enterGame();
  }catch(e){console.error('loginUserCloud',e);}
}

function enterGame(){
  document.getElementById('auth-screen').classList.add('hidden');
  document.getElementById('bottom-nav').style.display='';
  document.getElementById('top-hud').style.display='';
  const ap=document.getElementById('audio-panel');if(ap)ap.style.display='flex';
  document.getElementById('save-indicator').style.display='';
  initGame();
}

async function doLogout(){
  if(autoFishingEnabled)stopAutoFishing();autoSave(true);
  const jwt=getJWT();if(jwt)try{await supaSignOut(jwt);}catch{}
  if(currentUser?.type==='guest'){try{localStorage.setItem('fc_save_guest_'+currentUser.username,JSON.stringify(buildSavePayload()));}catch{}}
  clearStoredSession();currentUser=null;resetState();
  document.getElementById('auth-screen').classList.remove('hidden');
  document.getElementById('bottom-nav').style.display='none';
  document.getElementById('top-hud').style.display='none';
  const ap=document.getElementById('audio-panel');if(ap)ap.style.display='none';
  document.getElementById('save-indicator').style.display='none';
  document.getElementById('auto-fish-panel').innerHTML='';
  document.getElementById('auto-fish-panel').classList.remove('visible');
  document.getElementById('login-user').value='';document.getElementById('login-pass').value='';
  document.getElementById('login-msg').textContent='';switchAuthTab('login');stopMusic();
}

async function doUpgradeAccount(){
  const u=document.getElementById('up-user').value.trim(),p=document.getElementById('up-pass').value,e=document.getElementById('up-email')?.value.trim()||'',msg=document.getElementById('up-msg');
  msg.className='um-msg';
  if(!u||u.length<3){msg.textContent='Username must be 3+ characters';return;}
  if(!/^[a-zA-Z0-9_]+$/.test(u)){msg.textContent='Letters, numbers, underscores only';return;}
  if(!e||!e.includes('@')){msg.textContent='Valid email required';return;}
  if(!p||p.length<6){msg.textContent='Password must be 6+ characters';return;}
  const btn=document.getElementById('btn-upgrade-account');if(btn){btn.disabled=true;btn.textContent='⏳ Creating...';}
  try{
    const taken=await supaUsernameExists(u);if(taken){msg.textContent='Username already taken';return;}
    const sr=await supaSignUp(e,p);if(!sr.ok){msg.textContent=sr.data?.error_description||'Registration failed';return;}
    const si=await supaSignIn(e,p);if(!si.ok||!si.data?.access_token){msg.className='um-msg ok';msg.textContent='✅ Account created! Check email to confirm.';return;}
    storeSession(si.data);const jwt=si.data.access_token,uid=si.data.user?.id;
    await supaUpsertProfile(uid,u,'member',jwt);await supaUpsertSave(uid,buildSavePayload(),jwt);
    try{localStorage.removeItem('fc_save_guest_'+currentUser.username);localStorage.removeItem('fc_guest_id');}catch{}
    currentUser={username:u,type:'member',email:e,userId:uid};
    msg.className='um-msg ok';msg.textContent=`✅ Welcome, ${u}!`;
    setTimeout(()=>{closeUpgradeModal();renderProfileCard();showToast(`🎉 Account upgraded! Hello, ${u}!`);},900);
  }catch{msg.textContent='Error — try again.';}
  finally{if(btn){btn.disabled=false;btn.textContent='💾 SAVE MY ACCOUNT';}}
}
function openUpgradeModal(){document.getElementById('upgrade-modal').classList.add('show');['up-user','up-email','up-pass'].forEach(id=>{document.getElementById(id).value='';});document.getElementById('up-msg').textContent='';}
function closeUpgradeModal(){document.getElementById('upgrade-modal').classList.remove('show');}

// ── Init game ────────────────────────────────────────────
function initGame(){
  renderLocBar();updateHUD();renderShop('upgrades');goScreen('fishing');updateAFPanel();applyRodVisuals();
}

// ── Event bindings ───────────────────────────────────────
function bindEvents(){
  document.getElementById('tab-login').addEventListener('click',()=>switchAuthTab('login'));
  document.getElementById('tab-register').addEventListener('click',()=>switchAuthTab('register'));
  document.getElementById('btn-login').addEventListener('click',doLogin);
  document.getElementById('btn-register').addEventListener('click',doRegister);
  document.getElementById('btn-guest').addEventListener('click',doGuest);
  ['login-user','login-pass'].forEach(id=>document.getElementById(id).addEventListener('keydown',e=>{if(e.key==='Enter')doLogin();}));
  ['reg-user','reg-email','reg-pass'].forEach(id=>document.getElementById(id).addEventListener('keydown',e=>{if(e.key==='Enter')doRegister();}));
  document.getElementById('btn-upgrade-account').addEventListener('click',doUpgradeAccount);
  document.getElementById('btn-close-upgrade').addEventListener('click',closeUpgradeModal);
  document.getElementById('nav-home').addEventListener('click',()=>{sfxTab();goScreen('home');});
  document.getElementById('nav-fishing').addEventListener('click',()=>{sfxTab();goScreen('fishing');});
  document.getElementById('nav-inventory').addEventListener('click',()=>{sfxTab();goScreen('inventory');});
  document.getElementById('nav-shop').addEventListener('click',()=>{sfxTab();goScreen('shop');});
  document.getElementById('st-upgrades').addEventListener('click',()=>renderShop('upgrades'));
  document.getElementById('st-rods').addEventListener('click',()=>renderShop('rods'));
  document.getElementById('st-premium').addEventListener('click',()=>renderShop('premium'));
  document.getElementById('st-unlocks').addEventListener('click',()=>renderShop('unlocks'));
  document.querySelectorAll('.fc').forEach(c=>c.addEventListener('click',()=>{document.querySelectorAll('.fc').forEach(x=>x.classList.remove('on'));c.classList.add('on');invF=c.dataset.f;renderInv();}));
  document.getElementById('btn-sell-all').addEventListener('click',sellAllFish);
  document.getElementById('cast-btn').addEventListener('click',e=>{e.stopPropagation();castLine();});
  document.getElementById('bite-indicator').addEventListener('click',tapBite);
  document.getElementById('bobber').addEventListener('click',tapBite);
  document.getElementById('water-area').addEventListener('click',()=>{if(S.phase==='idle')castLine();else if(S.phase==='biting')tapBite();});
  const hb=document.getElementById('hold-btn');
  hb.addEventListener('touchstart',e=>{e.preventDefault();holding=true;},{passive:false});
  hb.addEventListener('touchend',e=>{e.preventDefault();holding=false;},{passive:false});
  hb.addEventListener('mousedown',()=>holding=true);hb.addEventListener('mouseup',()=>holding=false);hb.addEventListener('mouseleave',()=>holding=false);
  document.getElementById('cr-sell').addEventListener('click',()=>{if(!mgFish)return;S.coins+=mgFish.sellVal;showToast(`💰 Sold for ${mgFish.sellVal}!`);document.getElementById('catch-result').classList.remove('on');resetFishing();updateHUD();autoSave();sfxTap();});
  document.getElementById('cr-keep').addEventListener('click',()=>{if(!mgFish)return;S.inv.push({...mgFish});showToast(`🎒 ${mgFish.name} kept!`);document.getElementById('catch-result').classList.remove('on');resetFishing();updateHUD();autoSave();sfxTap();});
  // Energy regen + auto upgrade
  setInterval(()=>{if(S.upg.auto>0&&S.phase==='idle'&&S.energy>0&&S.activeScreen==='fishing'){castLine();setTimeout(()=>{if(S.phase==='biting')tapBite();},1200);}if(S.energy<S.maxEnergy){S.energy=Math.min(S.maxEnergy,S.energy+1);updateHUD();}},8000);
}

// ── Boot ─────────────────────────────────────────────────
window.addEventListener('load',async()=>{
  resizeCanvas();resizeFXCanvas();makeStars();drawWater();
  bindEvents();buildAudioPanel();
  const firstClick=()=>{if(AC)return;ensureAC();if(AC){const b=AC.createBuffer(1,1,AC.sampleRate),s=AC.createBufferSource();s.buffer=b;s.connect(AC.destination);s.start(0);}};
  document.addEventListener('touchstart',firstClick,{once:true});
  document.addEventListener('click',firstClick,{once:true});
  const restored=await checkSession();
  if(restored)enterGame();
});
window.addEventListener('resize',()=>{resizeCanvas();resizeFXCanvas();renderLocBar();});