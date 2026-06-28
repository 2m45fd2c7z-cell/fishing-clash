// ============================================================
//  state.js — Game state, Supabase auth, cloud save/load
// ============================================================

// ── Mutable game state ───────────────────────────────────
const S = {
  coins:0, gems:15, energy:50, maxEnergy:50,
  level:1, xp:0, xpNext:100,
  loc:'river',
  upg:{rod_str:0,rod_spd:0,rod_luck:0,hook_sz:0,auto:0},
  inv:[], recent:[],
  stats:{caught:0,earned:0,bestW:0,bestN:'—'},
  phase:'idle',
  activeScreen:'fishing',
  ownedRods:[],
  equippedRod:null,
  autoFishingUnlocked:false,
};

// ── Supabase config ──────────────────────────────────────
const SUPA_URL = 'https://zdibfbadgjlgekcpzhsv.supabase.co';
const SUPA_KEY = 'sb_publishable_98wladmBpy6-cRQHpTB3Dw_g3ehxS9x';

async function supaFetch(path, method='GET', body=null, jwt=null) {
  const headers = {
    'apikey': SUPA_KEY,
    'Authorization': `Bearer ${jwt||SUPA_KEY}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  if (method==='PATCH') headers['Prefer']='return=representation';
  else if (method==='POST'&&path.startsWith('/rest/v1/')) headers['Prefer']='resolution=merge-duplicates,return=representation';
  const opts={method,headers};
  if (body!==null) opts.body=JSON.stringify(body);
  try {
    const r=await fetch(SUPA_URL+path,opts);
    let data=null;
    try{const t=await r.text();data=t?JSON.parse(t):null;}catch{}
    return{ok:r.ok,status:r.status,data};
  } catch(e){return{ok:false,status:0,data:null};}
}

async function supaSignUp(email,password){return supaFetch('/auth/v1/signup','POST',{email,password});}
async function supaSignIn(email,password){return supaFetch('/auth/v1/token?grant_type=password','POST',{email,password});}
async function supaSignOut(jwt){return supaFetch('/auth/v1/logout','POST',null,jwt);}
async function supaRefresh(rt){return supaFetch('/auth/v1/token?grant_type=refresh_token','POST',{refresh_token:rt});}

async function supaUpsertSave(uid,payload,jwt){
  const mp=`/rest/v1/player_saves?user_id=eq.${uid}`;
  const pr=await supaFetch(mp,'PATCH',{save_data:payload,updated_at:new Date().toISOString()},jwt);
  if(pr.ok&&(pr.status===204||(Array.isArray(pr.data)&&!pr.data.length)))
    return supaFetch('/rest/v1/player_saves','POST',{user_id:uid,save_data:payload,updated_at:new Date().toISOString()},jwt);
  return pr;
}
async function supaLoadSave(uid,jwt){
  const r=await supaFetch(`/rest/v1/player_saves?user_id=eq.${uid}&select=save_data`,'GET',null,jwt);
  if(r.ok&&Array.isArray(r.data)&&r.data.length>0)return r.data[0].save_data;
  return null;
}
async function supaUpsertProfile(uid,username,type,jwt){
  const mp=`/rest/v1/player_profiles?user_id=eq.${uid}`;
  const pr=await supaFetch(mp,'PATCH',{username,account_type:type,updated_at:new Date().toISOString()},jwt);
  if(pr.ok&&(pr.status===204||(Array.isArray(pr.data)&&!pr.data.length)))
    return supaFetch('/rest/v1/player_profiles','POST',{user_id:uid,username,account_type:type,updated_at:new Date().toISOString()},jwt);
  return pr;
}
async function supaLoadProfile(uid,jwt){
  const r=await supaFetch(`/rest/v1/player_profiles?user_id=eq.${uid}&select=username,account_type`,'GET',null,jwt);
  if(r.ok&&Array.isArray(r.data)&&r.data.length>0)return r.data[0];
  return null;
}
async function supaUsernameExists(username){
  const r=await supaFetch(`/rest/v1/player_profiles?username=eq.${encodeURIComponent(username)}&select=user_id&limit=1`,'GET',null,null);
  if(!r.ok)return false;
  return Array.isArray(r.data)&&r.data.length>0;
}

// ── Session ──────────────────────────────────────────────
const SESSION_KEY='fc_supa_session_v1';
let _session=null;
function storeSession(s){_session=s;try{localStorage.setItem(SESSION_KEY,JSON.stringify(s));}catch{}}
function clearStoredSession(){_session=null;try{localStorage.removeItem(SESSION_KEY);}catch{}}
function loadStoredSession(){try{const r=localStorage.getItem(SESSION_KEY);if(r){_session=JSON.parse(r);return true;}}catch{}return false;}
function getJWT(){return _session?.access_token||null;}
function getUserId(){return _session?.user?.id||null;}
let currentUser=null;

// ── Save/load ────────────────────────────────────────────
function buildSavePayload(){
  return {
    v:3,savedAt:Date.now(),
    coins:S.coins,gems:S.gems,energy:S.energy,
    level:S.level,xp:S.xp,xpNext:S.xpNext,
    loc:S.loc,upg:{...S.upg},
    inv:S.inv.map(f=>({...f})),
    recent:S.recent.slice(0,10),
    stats:{...S.stats},
    locUnlocks:LOCS.reduce((o,l)=>{o[l.id]=l.unlocked;return o;},{}),
    ownedRods:[...S.ownedRods],
    equippedRod:S.equippedRod,
    autoFishingUnlocked:S.autoFishingUnlocked,
  };
}
function applySaveData(d){
  if(!d||d.v<1)return;
  S.coins=d.coins??0;S.gems=d.gems??15;S.energy=d.energy??50;
  S.level=d.level??1;S.xp=d.xp??0;S.xpNext=d.xpNext??100;
  S.loc=d.loc??'river';
  S.upg={rod_str:0,rod_spd:0,rod_luck:0,hook_sz:0,auto:0,...(d.upg||{})};
  S.inv=(d.inv||[]).map(f=>({...f}));
  S.recent=(d.recent||[]).slice(0,10);
  S.stats={caught:0,earned:0,bestW:0,bestN:'—',...(d.stats||{})};
  if(d.locUnlocks)LOCS.forEach(l=>{if(d.locUnlocks[l.id]!==undefined)l.unlocked=d.locUnlocks[l.id];});
  S.ownedRods=Array.isArray(d.ownedRods)?[...d.ownedRods]:[];
  S.equippedRod=d.equippedRod||null;
  S.autoFishingUnlocked=d.autoFishingUnlocked===true;
}
function resetState(){
  S.coins=0;S.gems=15;S.energy=50;S.maxEnergy=50;
  S.level=1;S.xp=0;S.xpNext=100;S.loc='river';
  S.upg={rod_str:0,rod_spd:0,rod_luck:0,hook_sz:0,auto:0};
  S.inv=[];S.recent=[];
  S.stats={caught:0,earned:0,bestW:0,bestN:'—'};
  S.phase='idle';S.ownedRods=[];S.equippedRod=null;S.autoFishingUnlocked=false;
  LOCS.forEach((l,i)=>{l.unlocked=i===0;});
}
function applyDevPerks(){
  S.coins=999_999_999;S.gems=999_999;S.energy=S.maxEnergy;
  S.level=DEV_ACCOUNT.maxLevel;S.xp=DEV_ACCOUNT.maxXP;S.xpNext=999999;
  UPGRADES.forEach(u=>{S.upg[u.id]=u.maxLvl;});
  LOCS.forEach(l=>{l.unlocked=true;});
  S.ownedRods=EXCLUSIVE_RODS.map(r=>r.id);
  S.equippedRod='poseidon_rod';
  S.autoFishingUnlocked=true;
}

// ── Save indicator ───────────────────────────────────────
let saveDebounce=null,saveIndicatorTimer=null;
function showSaveIndicator(state){
  const el=document.getElementById('save-indicator');
  const txt=document.getElementById('save-text');
  if(!el)return;
  clearTimeout(saveIndicatorTimer);
  el.style.display='flex';
  el.className='show'+(state==='error'?' err':'');
  const spin=el.querySelector('.save-spin');
  if(state==='saving'){spin.style.display='inline-block';txt.textContent='SAVING';}
  else if(state==='ok'){spin.style.display='none';txt.textContent='✓ SAVED';saveIndicatorTimer=setTimeout(()=>{el.className='';},2000);}
  else{spin.style.display='none';txt.textContent='⚠ FAILED';saveIndicatorTimer=setTimeout(()=>{el.className='';},4000);}
}
function autoSave(immediate=false){
  if(!currentUser)return;
  if(saveDebounce)clearTimeout(saveDebounce);
  saveDebounce=setTimeout(async()=>{
    const payload=buildSavePayload();
    try{localStorage.setItem('fc_save_local',JSON.stringify(payload));}catch{}
    if(currentUser.type==='guest'){showSaveIndicator('ok');return;}
    const jwt=getJWT(),uid=getUserId();
    if(!jwt||!uid){showSaveIndicator('error');return;}
    showSaveIndicator('saving');
    const res=await supaUpsertSave(uid,payload,jwt);
    showSaveIndicator(res.ok?'ok':'error');
  }, immediate?0:1400);
}

window.addEventListener('beforeunload',()=>autoSave(true));
window.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')autoSave(true);});
window.addEventListener('pagehide',()=>autoSave(true));

// ── Session restore ──────────────────────────────────────
async function checkSession(){
  if(!loadStoredSession()||!_session)return false;
  if(_session.refresh_token){
    const res=await supaRefresh(_session.refresh_token);
    if(res.ok&&res.data?.access_token)storeSession({..._session,...res.data,user:res.data.user||_session.user});
    else{clearStoredSession();return false;}
  }
  const jwt=getJWT(),uid=getUserId();
  if(!jwt||!uid){clearStoredSession();return false;}
  try{
    const profile=await supaLoadProfile(uid,jwt);
    const username=profile?.username||('user_'+uid.slice(0,8));
    const type=profile?.account_type||'member';
    currentUser={username,type,email:_session.user?.email||'',userId:uid};
    const cloudSave=await supaLoadSave(uid,jwt);
    if(cloudSave)applySaveData(cloudSave);
    else{try{const loc=localStorage.getItem('fc_save_local');if(loc)applySaveData(JSON.parse(loc));}catch{}}
    if(isDeveloperAccount(username)){applyDevPerks();}
    return true;
  }catch{clearStoredSession();return false;}
}

// ── Toast ────────────────────────────────────────────────
let toastT;
function showToast(msg){
  const t=document.getElementById('toast');
  t.textContent=msg;t.classList.add('show');
  clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),2500);
}