// ============================================================
//  data.js — Static game data: fish, locations, upgrades, rods
// ============================================================

const FISH_DB = {
  river:[
    {id:'bluegill',    name:'Bluegill',        rarity:'common',   baseVal:4,   minW:.08,maxW:.4,  xp:2,  silhouette:'round',    pc:'#4a9e6a',sc:'#f5c842',glow:null},
    {id:'minnow',      name:'Crimson Minnow',   rarity:'common',   baseVal:6,   minW:.04,maxW:.25, xp:2,  silhouette:'small',    pc:'#e05050',sc:'#f8c0a0',glow:null},
    {id:'roach',       name:'Golden Roach',     rarity:'common',   baseVal:10,  minW:.1, maxW:.8,  xp:3,  silhouette:'standard', pc:'#d4a030',sc:'#e8c870',glow:null},
    {id:'trout',       name:'River Trout',      rarity:'common',   baseVal:14,  minW:.2, maxW:1.4, xp:5,  silhouette:'stream',   pc:'#6a9a50',sc:'#c8e090',glow:null},
    {id:'catfish',     name:'Catfish',          rarity:'uncommon', baseVal:30,  minW:.5, maxW:3,   xp:12, silhouette:'whisker',  pc:'#605848',sc:'#a09070',glow:null},
    {id:'carp',        name:'River Carp',       rarity:'uncommon', baseVal:40,  minW:.8, maxW:3.5, xp:14, silhouette:'heavy',    pc:'#b87030',sc:'#e8c060',glow:null},
    {id:'bass',        name:'Largemouth Bass',  rarity:'rare',     baseVal:70,  minW:.6, maxW:3,   xp:20, silhouette:'bass',     pc:'#3a6030',sc:'#c8d890',glow:'rgba(80,180,80,.5)'},
    {id:'pike',        name:'Redfin Pike',      rarity:'rare',     baseVal:90,  minW:1,  maxW:4.5, xp:28, silhouette:'predator', pc:'#506a30',sc:'#e04040',glow:'rgba(220,60,60,.5)'},
    {id:'koi',         name:'Sacred Koi',       rarity:'legendary',baseVal:600, minW:3,  maxW:14,  xp:220,silhouette:'koi',      pc:'#e06820',sc:'#fff',   glow:'rgba(255,180,80,.8)'},
    {id:'void_koi',    name:'Void Koi',         rarity:'legendary',baseVal:1200,minW:5,  maxW:20,  xp:400,silhouette:'koi',      pc:'#3a10a0',sc:'#c080ff',glow:'rgba(160,80,255,.9)'},
  ],
  lake:[
    {id:'perch',       name:'Yellow Perch',     rarity:'common',   baseVal:15,  minW:.1, maxW:.9,  xp:6,  silhouette:'perch',    pc:'#d4a820',sc:'#606820',glow:null},
    {id:'sunfish',     name:'Sunfish',          rarity:'common',   baseVal:12,  minW:.08,maxW:.5,  xp:4,  silhouette:'round',    pc:'#e09030',sc:'#6090d0',glow:null},
    {id:'walleye',     name:'Walleye',          rarity:'uncommon', baseVal:60,  minW:.8, maxW:4,   xp:25, silhouette:'predator', pc:'#a08050',sc:'#d4c090',glow:null},
    {id:'bullhead',    name:'Bullhead',         rarity:'uncommon', baseVal:50,  minW:.4, maxW:2.5, xp:18, silhouette:'whisker',  pc:'#504030',sc:'#908060',glow:null},
    {id:'muskie',      name:'Muskellunge',      rarity:'rare',     baseVal:180, minW:2,  maxW:10,  xp:70, silhouette:'predator', pc:'#4a7040',sc:'#c0c870',glow:'rgba(100,200,100,.5)'},
    {id:'peacock',     name:'Peacock Bass',     rarity:'rare',     baseVal:140, minW:1,  maxW:6,   xp:50, silhouette:'bass',     pc:'#208040',sc:'#f0d020',glow:'rgba(50,200,80,.5)'},
    {id:'sturgeon',    name:'Lake Sturgeon',    rarity:'epic',     baseVal:380, minW:8,  maxW:28,  xp:160,silhouette:'ancient',  pc:'#606870',sc:'#a0b0c0',glow:'rgba(160,180,220,.6)'},
    {id:'arapaima',    name:'Arapaima',         rarity:'epic',     baseVal:500, minW:15, maxW:60,  xp:200,silhouette:'ancient',  pc:'#304050',sc:'#60c0a0',glow:'rgba(80,200,160,.6)'},
    {id:'lake_levia',  name:'Lake Leviathan',   rarity:'legendary',baseVal:2000,minW:50, maxW:200, xp:500,silhouette:'whale',    pc:'#102040',sc:'#204080',glow:'rgba(40,100,220,.85)'},
  ],
  ocean:[
    {id:'mackerel',    name:'Mackerel',         rarity:'common',   baseVal:18,  minW:.3, maxW:1.2, xp:7,  silhouette:'stream',   pc:'#2060a0',sc:'#80c0e0',glow:null},
    {id:'snapper',     name:'Red Snapper',      rarity:'uncommon', baseVal:70,  minW:.8, maxW:5,   xp:28, silhouette:'standard', pc:'#c03030',sc:'#f0c0a0',glow:null},
    {id:'grouper',     name:'Giant Grouper',    rarity:'uncommon', baseVal:100, minW:2,  maxW:12,  xp:40, silhouette:'heavy',    pc:'#606040',sc:'#908060',glow:null},
    {id:'tuna',        name:'Bluefin Tuna',     rarity:'rare',     baseVal:350, minW:40, maxW:180, xp:140,silhouette:'tuna',     pc:'#1a3060',sc:'#8090c0',glow:'rgba(80,120,220,.55)'},
    {id:'sword',       name:'Swordfish',        rarity:'rare',     baseVal:450, minW:30, maxW:140, xp:180,silhouette:'sword',    pc:'#1a2840',sc:'#8090b0',glow:'rgba(60,100,200,.55)'},
    {id:'sailfish',    name:'Sailfish',         rarity:'epic',     baseVal:700, minW:25, maxW:100, xp:200,silhouette:'sail',     pc:'#1040a0',sc:'#60e0ff',glow:'rgba(80,200,255,.7)'},
    {id:'phoenix',     name:'Phoenix Fish',     rarity:'epic',     baseVal:900, minW:10, maxW:40,  xp:240,silhouette:'standard', pc:'#e05010',sc:'#ffd040',glow:'rgba(255,120,20,.8)'},
    {id:'oarfish',     name:'Giant Oarfish',    rarity:'legendary',baseVal:2500,minW:80, maxW:250, xp:550,silhouette:'eel',      pc:'#708090',sc:'#c0d0e0',glow:'rgba(180,210,240,.7)'},
    {id:'thunder_w',   name:'Thunder Whale',    rarity:'legendary',baseVal:5000,minW:200,maxW:800, xp:800,silhouette:'whale',    pc:'#1a1a60',sc:'#60a0ff',glow:'rgba(100,160,255,.9)'},
  ],
  secret:[
    {id:'glow_specter',name:'Glowfin Specter',  rarity:'epic',     baseVal:900, minW:4,  maxW:18,  xp:210,silhouette:'ghost',    pc:'#20e0c0',sc:'#80fff0',glow:'rgba(0,230,200,.8)'},
    {id:'fire_eel',    name:'Fire Eel',         rarity:'epic',     baseVal:1100,minW:6,  maxW:22,  xp:260,silhouette:'eel',      pc:'#e03000',sc:'#ff9000',glow:'rgba(255,100,0,.85)'},
    {id:'moonfish',    name:'Moonfish',         rarity:'epic',     baseVal:1400,minW:8,  maxW:30,  xp:300,silhouette:'round',    pc:'#e0e8ff',sc:'#8090ff',glow:'rgba(200,210,255,.8)'},
    {id:'crystal_eel', name:'Crystal Eel',      rarity:'legendary',baseVal:3500,minW:10, maxW:30,  xp:650,silhouette:'eel',      pc:'#80d0ff',sc:'#ffffff',glow:'rgba(120,220,255,.95)'},
    {id:'void_whale',  name:'Void Whale',       rarity:'legendary',baseVal:9999,minW:400,maxW:1000,xp:1100,silhouette:'whale',   pc:'#180830',sc:'#6820c0',glow:'rgba(120,30,220,1)'},
    {id:'cosmic_oct',  name:'Cosmic Octopus',   rarity:'legendary',baseVal:7500,minW:30, maxW:120, xp:900,silhouette:'octopus',  pc:'#200850',sc:'#a040ff',glow:'rgba(160,60,255,.95)'},
  ],
};

// Fish SVG silhouette paths (VAR_PC = primary color, VAR_SC = secondary color)
const FISH_SHAPES = {
  standard:`<ellipse cx="55" cy="32" rx="38" ry="18" fill="VAR_PC"/><path d="M90,32 L110,18 L115,32 L110,46 Z" fill="VAR_SC"/><ellipse cx="30" cy="30" rx="12" ry="9" fill="VAR_SC" opacity=".4"/><circle cx="24" cy="28" r="4" fill="#fff" opacity=".9"/><circle cx="25" cy="28" r="2" fill="#111"/><path d="M40,22 Q55,14 70,22" stroke="VAR_SC" stroke-width="2" fill="none" opacity=".5"/><path d="M55,50 Q65,58 75,50" stroke="VAR_SC" stroke-width="2" fill="none" opacity=".4"/>`,
  small:`<ellipse cx="42" cy="26" rx="26" ry="13" fill="VAR_PC"/><path d="M65,26 L82,16 L86,26 L82,36 Z" fill="VAR_SC"/><circle cx="22" cy="24" r="3.5" fill="#fff" opacity=".9"/><circle cx="23" cy="24" r="2" fill="#111"/><path d="M30,18 Q40,12 52,18" stroke="VAR_SC" stroke-width="1.5" fill="none" opacity=".5"/>`,
  round:`<ellipse cx="50" cy="36" rx="34" ry="26" fill="VAR_PC"/><path d="M82,36 L100,24 L104,36 L100,48 Z" fill="VAR_SC"/><ellipse cx="30" cy="32" rx="10" ry="8" fill="VAR_SC" opacity=".35"/><circle cx="24" cy="30" r="4.5" fill="#fff" opacity=".9"/><circle cx="25" cy="30" r="2.5" fill="#111"/><path d="M35,20 Q50,10 65,20" stroke="VAR_SC" stroke-width="2.5" fill="none" opacity=".5"/><path d="M40,52 Q55,62 70,52" stroke="VAR_SC" stroke-width="2.5" fill="none" opacity=".5"/>`,
  stream:`<path d="M18,32 Q35,18 70,26 Q90,30 100,32 Q90,34 70,38 Q35,46 18,32 Z" fill="VAR_PC"/><path d="M100,32 L118,20 L122,32 L118,44 Z" fill="VAR_SC"/><circle cx="22" cy="29" r="3.5" fill="#fff" opacity=".9"/><circle cx="23" cy="29" r="2" fill="#111"/>`,
  heavy:`<path d="M22,34 Q25,16 60,14 Q90,16 100,28 Q106,34 100,40 Q90,52 60,54 Q25,52 22,34 Z" fill="VAR_PC"/><path d="M100,34 L118,22 L122,34 L118,46 Z" fill="VAR_SC"/><circle cx="28" cy="30" r="5" fill="#fff" opacity=".9"/><circle cx="29" cy="30" r="2.8" fill="#111"/>`,
  whisker:`<path d="M20,34 Q24,18 55,16 Q80,18 95,28 Q102,34 95,40 Q80,50 55,52 Q24,50 20,34 Z" fill="VAR_PC"/><path d="M95,34 L112,24 L116,34 L112,44 Z" fill="VAR_SC"/><path d="M22,30 Q14,24 8,18" stroke="VAR_SC" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M22,34 Q12,32 4,32" stroke="VAR_SC" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M22,38 Q14,44 8,50" stroke="VAR_SC" stroke-width="1.5" fill="none" stroke-linecap="round"/><circle cx="24" cy="32" r="4.5" fill="#fff" opacity=".9"/><circle cx="25" cy="32" r="2.5" fill="#111"/>`,
  bass:`<path d="M20,34 Q22,16 58,14 Q90,16 102,28 Q108,34 102,40 Q90,52 58,54 Q22,52 20,34 Z" fill="VAR_PC"/><path d="M102,34 L120,22 L124,34 L120,46 Z" fill="VAR_SC"/><path d="M20,34 Q30,28 40,34 Q30,40 20,34" fill="VAR_SC" opacity=".5"/><path d="M45,14 Q70,8 92,20" stroke="VAR_SC" stroke-width="3" fill="none" opacity=".6"/><circle cx="26" cy="30" r="5" fill="#fff" opacity=".9"/><circle cx="27" cy="30" r="2.8" fill="#111"/>`,
  predator:`<path d="M16,34 Q18,14 60,12 Q95,14 108,28 Q114,34 108,40 Q95,54 60,56 Q18,54 16,34 Z" fill="VAR_PC"/><path d="M108,34 L128,20 L133,34 L128,48 Z" fill="VAR_SC"/><path d="M16,26 L8,14 M16,34 L4,34 M16,42 L8,54" stroke="VAR_SC" stroke-width="2" stroke-linecap="round" fill="none" opacity=".8"/><circle cx="22" cy="30" r="5.5" fill="#fff" opacity=".9"/><circle cx="23.5" cy="30" r="3" fill="#111"/>`,
  koi:`<path d="M20,34 Q22,14 55,12 Q82,14 95,28 Q100,34 95,40 Q82,54 55,56 Q22,54 20,34 Z" fill="VAR_PC"/><path d="M95,34 L115,20 L120,34 L115,48 Z" fill="VAR_SC"/><ellipse cx="50" cy="22" rx="18" ry="8" fill="VAR_SC" opacity=".55"/><ellipse cx="60" cy="46" rx="14" ry="6" fill="VAR_SC" opacity=".45"/><circle cx="24" cy="30" r="5" fill="#fff" opacity=".95"/><circle cx="25" cy="30" r="3" fill="#111"/>`,
  ancient:`<path d="M18,34 Q20,12 58,10 Q95,12 110,28 Q116,34 110,40 Q95,56 58,58 Q20,56 18,34 Z" fill="VAR_PC"/><path d="M110,34 L132,20 L137,34 L132,48 Z" fill="VAR_SC"/><path d="M35,10 L35,6 M55,10 L55,4 M75,10 L75,6 M95,14 L98,10" stroke="VAR_SC" stroke-width="2.5" stroke-linecap="round" fill="none"/><circle cx="24" cy="30" r="5.5" fill="#fff" opacity=".9"/><circle cx="25.5" cy="30" r="3" fill="#111"/>`,
  tuna:`<path d="M18,34 Q20,16 62,14 Q94,16 108,28 Q114,34 108,40 Q94,52 62,54 Q20,52 18,34 Z" fill="VAR_PC"/><path d="M108,34 L132,18 L138,34 L132,50 Z" fill="VAR_SC"/><path d="M90,14 L104,8 M90,54 L104,60" stroke="VAR_SC" stroke-width="2.5" stroke-linecap="round" fill="none"/><circle cx="24" cy="30" r="5" fill="#fff" opacity=".9"/><circle cx="25" cy="30" r="3" fill="#111"/>`,
  sword:`<path d="M28,34 Q30,18 65,16 Q95,18 108,28 Q113,34 108,40 Q95,50 65,52 Q30,50 28,34 Z" fill="VAR_PC"/><path d="M108,34 L128,22 L132,34 L128,46 Z" fill="VAR_SC"/><path d="M28,34 L2,32" stroke="VAR_PC" stroke-width="5" stroke-linecap="round" fill="none"/><circle cx="32" cy="30" r="5" fill="#fff" opacity=".9"/><circle cx="33" cy="30" r="2.8" fill="#111"/>`,
  sail:`<path d="M20,36 Q22,20 58,18 Q88,20 102,32 Q107,36 102,42 Q88,54 58,56 Q22,54 20,36 Z" fill="VAR_PC"/><path d="M102,36 L122,24 L127,36 L122,48 Z" fill="VAR_SC"/><path d="M38,18 Q42,4 55,14 Q68,4 72,18" fill="VAR_SC" opacity=".8"/><circle cx="26" cy="32" r="5" fill="#fff" opacity=".9"/><circle cx="27" cy="32" r="2.8" fill="#111"/>`,
  eel:`<path d="M16,34 Q20,28 40,28 Q60,22 80,26 Q100,30 115,36 Q100,42 80,42 Q60,46 40,40 Q20,40 16,34 Z" fill="VAR_PC"/><path d="M115,36 L130,26 L134,36 L130,46 Z" fill="VAR_SC"/><path d="M16,34 L4,28" stroke="VAR_PC" stroke-width="4" fill="none"/><circle cx="20" cy="32" r="4" fill="#fff" opacity=".9"/><circle cx="21" cy="32" r="2.2" fill="#111"/>`,
  whale:`<path d="M14,40 Q16,16 65,12 Q100,14 118,32 Q125,40 118,48 Q100,64 65,68 Q16,64 14,40 Z" fill="VAR_PC"/><path d="M118,40 L140,28 L146,40 L140,52 Z" fill="VAR_SC"/><path d="M60,12 L74,2 L80,14 M75,12 L86,4 L90,14" fill="VAR_SC" opacity=".7"/><circle cx="22" cy="34" r="6.5" fill="#fff" opacity=".9"/><circle cx="23.5" cy="34" r="3.5" fill="#111"/>`,
  ghost:`<path d="M18,34 Q20,16 55,14 Q88,16 100,28 Q106,34 100,40 Q88,52 55,54 Q20,52 18,34 Z" fill="VAR_PC" opacity=".85"/><path d="M100,34 L120,22 L124,34 L120,46 Z" fill="VAR_SC"/><circle cx="24" cy="30" r="5" fill="VAR_SC" opacity=".9"/><circle cx="25" cy="30" r="2.5" fill="#fff" opacity=".7"/>`,
  perch:`<path d="M20,34 Q22,18 55,16 Q84,18 96,28 Q101,34 96,40 Q84,50 55,52 Q22,50 20,34 Z" fill="VAR_PC"/><path d="M96,34 L114,22 L118,34 L114,46 Z" fill="VAR_SC"/><path d="M40,16 L40,10 M52,15 L52,8 M64,16 L64,10 M76,18 L76,12" stroke="VAR_SC" stroke-width="2" stroke-linecap="round"/><circle cx="25" cy="30" r="4.5" fill="#fff" opacity=".9"/><circle cx="26" cy="30" r="2.5" fill="#111"/>`,
  octopus:`<ellipse cx="58" cy="38" rx="32" ry="26" fill="VAR_PC"/><circle cx="44" cy="30" r="6" fill="#fff" opacity=".9"/><circle cx="45" cy="30" r="3.5" fill="#111"/><circle cx="72" cy="30" r="6" fill="#fff" opacity=".9"/><circle cx="73" cy="30" r="3.5" fill="#111"/><path d="M30,56 Q20,70 18,80" stroke="VAR_PC" stroke-width="5" stroke-linecap="round" fill="none"/><path d="M55,64 Q55,78 50,88" stroke="VAR_PC" stroke-width="4" stroke-linecap="round" fill="none"/><path d="M82,56 Q90,70 90,80" stroke="VAR_PC" stroke-width="4.5" stroke-linecap="round" fill="none"/>`,
};

// Render fish SVG inline into a container div
function renderFishInline(fishId, container, size) {
  if (!container) return;
  const allFish = Object.values(FISH_DB).flat();
  const fish = allFish.find(f => f.id === fishId) || { silhouette:'standard', pc:'#4a9e6a', sc:'#f5c842', rarity:'common', glow:null };
  const shape = FISH_SHAPES[fish.silhouette] || FISH_SHAPES.standard;
  let svgContent = shape.replaceAll('VAR_PC', fish.pc).replaceAll('VAR_SC', fish.sc);
  const isLarge = ['whale','octopus'].includes(fish.silhouette);
  const vbW = isLarge ? 155 : 140, vbH = isLarge ? 95 : 68;
  let defs = '', sparkles = '', epicRing = '';
  if (fish.glow) {
    defs = `<defs><filter id="fg_${fishId}" x="-35%" y="-35%" width="170%" height="170%"><feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur"/><feFlood flood-color="${fish.glow}" flood-opacity="0.9" result="color"/><feComposite in="color" in2="blur" operator="in" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>`;
    if (['legendary','mythic'].includes(fish.rarity)) {
      for (let i=0;i<8;i++) {
        const sx=Math.min(15+Math.abs(Math.sin(i*1.1)*55)+i*14, vbW-8);
        const sy=Math.min(8+Math.abs(Math.cos(i*1.4)*22)+i*7, vbH-8);
        const sr=1.2+(i%3)*.6;
        sparkles+=`<circle cx="${sx}" cy="${sy}" r="${sr}" fill="${fish.glow}"><animate attributeName="opacity" values="0.2;1;0.2" dur="${1.1+i*.25}s" repeatCount="indefinite" begin="${i*.18}s"/></circle>`;
      }
    }
    if (fish.rarity==='epic') {
      const cx=Math.round(vbW*.44), cy=Math.round(vbH*.5);
      epicRing=`<ellipse cx="${cx}" cy="${cy}" rx="${Math.round(vbW*.38)}" ry="${Math.round(vbH*.42)}" fill="none" stroke="${fish.glow}" stroke-width="2.5" opacity="0.55"><animate attributeName="rx" values="${Math.round(vbW*.38)};${Math.round(vbW*.46)};${Math.round(vbW*.38)}" dur="1.6s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.55;0.1;0.55" dur="1.6s" repeatCount="indefinite"/></ellipse>`;
    }
  }
  const fa = fish.glow ? `filter="url(#fg_${fishId})"` : '';
  const w = size||260, h = Math.round(w*(vbH/vbW));
  container.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${vbW} ${vbH}" width="${w}" height="${h}" style="overflow:visible;display:block;margin:auto;">${defs}<g ${fa}>${epicRing}${svgContent}${sparkles}</g></svg>`;
}

// ── Locations ────────────────────────────────────────────
const LOCS = [
  {id:'river', name:'River', icon:'🏞️',unlocked:true, req:1,  diff:1},
  {id:'lake',  name:'Lake',  icon:'🏔️',unlocked:false,req:5,  diff:2},
  {id:'ocean', name:'Ocean', icon:'🌊',unlocked:false,req:12, diff:3},
  {id:'secret',name:'Secret',icon:'🌌',unlocked:false,req:20, diff:4},
];

// ── Upgrades ─────────────────────────────────────────────
const UPGRADES = [
  {id:'rod_str', name:'Rod Strength',icon:'🎣',desc:'Less line break chance',  maxLvl:5,baseCost:50, mult:2.2},
  {id:'rod_spd', name:'Reel Speed',  icon:'⚙️',desc:'Cursor moves faster',     maxLvl:5,baseCost:80, mult:2.5},
  {id:'rod_luck',name:'Lucky Bait',  icon:'🪱',desc:'Better fish rarity',       maxLvl:5,baseCost:120,mult:3.0},
  {id:'hook_sz', name:'Hook Size',   icon:'🪝',desc:'Catch bigger fish',        maxLvl:5,baseCost:200,mult:2.8},
  {id:'auto',    name:'Auto Fishing',icon:'🤖',desc:'Catch fish automatically', maxLvl:1,baseCost:1500,mult:1},
];

// ── Exclusive Rods ───────────────────────────────────────
const EXCLUSIVE_RODS = [
  {id:'coral_rod',   name:'Coral Rod',    tier:1,  rarity:'Rare',      icon:'🪸',color:'#22d3ee',glowColor:'rgba(34,211,238,.45)',   priceGems:100,  desc:'Beginner premium rod.',                  bonuses:{biteChanceBonus:.05,tensionControlBonus:.04,catchSuccessBonus:.04,rareFishChanceBonus:0,   weightBonus:0,   incomeBonus:0}},
  {id:'aqua_rod',    name:'Aqua Rod',     tier:2,  rarity:'Rare',      icon:'💧',color:'#38bdf8',glowColor:'rgba(56,189,248,.45)',    priceGems:250,  desc:'Flow-tuned rod.',                        bonuses:{biteChanceBonus:.08,tensionControlBonus:.06,catchSuccessBonus:.06,rareFishChanceBonus:.02, weightBonus:0,   incomeBonus:0}},
  {id:'pearl_rod',   name:'Pearl Rod',    tier:3,  rarity:'Epic',      icon:'🔮',color:'#c084fc',glowColor:'rgba(192,132,252,.45)',   priceGems:500,  desc:'Forged from deep-sea pearls.',           bonuses:{biteChanceBonus:.12,tensionControlBonus:.08,catchSuccessBonus:.08,rareFishChanceBonus:.03, weightBonus:0,   incomeBonus:0}},
  {id:'storm_rod',   name:'Storm Rod',    tier:4,  rarity:'Epic',      icon:'⚡',color:'#facc15',glowColor:'rgba(250,204,21,.45)',    priceGems:900,  desc:'Charged with storm energy.',             bonuses:{biteChanceBonus:.15,tensionControlBonus:.10,catchSuccessBonus:.10,rareFishChanceBonus:.04, weightBonus:.03, incomeBonus:0}},
  {id:'frost_rod',   name:'Frost Rod',    tier:5,  rarity:'Epic',      icon:'❄️',color:'#93c5fd',glowColor:'rgba(147,197,253,.45)',   priceGems:1400, desc:'Arctic-forged steady line.',             bonuses:{biteChanceBonus:.18,tensionControlBonus:.13,catchSuccessBonus:.12,rareFishChanceBonus:.05, weightBonus:.04, incomeBonus:0}},
  {id:'lava_rod',    name:'Lava Rod',     tier:6,  rarity:'Epic',      icon:'🌋',color:'#f97316',glowColor:'rgba(249,115,22,.45)',    priceGems:2000, desc:'Volcanic core reel force.',              bonuses:{biteChanceBonus:.22,tensionControlBonus:.16,catchSuccessBonus:.15,rareFishChanceBonus:.07, weightBonus:.05, incomeBonus:0}},
  {id:'phantom_rod', name:'Phantom Rod',  tier:7,  rarity:'Legendary', icon:'👻',color:'#a78bfa',glowColor:'rgba(167,139,250,.5)',    priceGems:2800, desc:'Spectral — fish don\'t run.',            bonuses:{biteChanceBonus:.26,tensionControlBonus:.20,catchSuccessBonus:.18,rareFishChanceBonus:.09, weightBonus:.06, incomeBonus:0}},
  {id:'dragon_rod',  name:'Dragon Rod',   tier:8,  rarity:'Legendary', icon:'🐉',color:'#ef4444',glowColor:'rgba(239,68,68,.5)',      priceGems:3800, desc:'Dragon-bone — legendaries submit.',      bonuses:{biteChanceBonus:.30,tensionControlBonus:.24,catchSuccessBonus:.22,rareFishChanceBonus:.11, weightBonus:.08, incomeBonus:0}},
  {id:'galaxy_rod',  name:'Galaxy Rod',   tier:9,  rarity:'Legendary', icon:'🌌',color:'#818cf8',glowColor:'rgba(129,140,248,.55)',   priceGems:5000, desc:'Cosmic energy warps tension.',           bonuses:{biteChanceBonus:.36,tensionControlBonus:.28,catchSuccessBonus:.26,rareFishChanceBonus:.14, weightBonus:.10, incomeBonus:0}},
  {id:'poseidon_rod',name:'Poseidon Rod', tier:10, rarity:'Mythic',    icon:'🔱',color:'#ffd700',glowColor:'rgba(255,215,0,.65)',     priceGems:7000, desc:'The god\'s own rod.',                    bonuses:{biteChanceBonus:.45,tensionControlBonus:.35,catchSuccessBonus:.35,rareFishChanceBonus:.18, weightBonus:.12, incomeBonus:.10}},
];

// ── Rod visual config ────────────────────────────────────
const ROD_VISUALS = {
  default:      {rodGradient:['#d97706','#92400e'],rodWidth:3,  glowColor:'rgba(0,180,255,.8)', lineColor:'rgba(200,225,255,.55)',lineWidth:1.3,particleColor:null,   idleAnim:false},
  coral_rod:    {rodGradient:['#22d3ee','#0891b2'],rodWidth:3.5,glowColor:'rgba(34,211,238,.9)',lineColor:'rgba(34,211,238,.65)', lineWidth:1.5,particleColor:'#22d3ee',idleAnim:true},
  aqua_rod:     {rodGradient:['#38bdf8','#0284c7'],rodWidth:3.5,glowColor:'rgba(56,189,248,.9)',lineColor:'rgba(56,189,248,.7)',  lineWidth:1.6,particleColor:'#38bdf8',idleAnim:true},
  pearl_rod:    {rodGradient:['#e9d5ff','#c084fc'],rodWidth:4,  glowColor:'rgba(192,132,252,.95)',lineColor:'rgba(192,132,252,.75)',lineWidth:1.8,particleColor:'#c084fc',idleAnim:true},
  storm_rod:    {rodGradient:['#fde68a','#facc15'],rodWidth:4,  glowColor:'rgba(250,204,21,.95)',lineColor:'rgba(250,204,21,.7)', lineWidth:2,  particleColor:'#facc15',idleAnim:true},
  frost_rod:    {rodGradient:['#bfdbfe','#93c5fd'],rodWidth:4,  glowColor:'rgba(147,197,253,.95)',lineColor:'rgba(200,230,255,.8)',lineWidth:2,  particleColor:'#93c5fd',idleAnim:true},
  lava_rod:     {rodGradient:['#fdba74','#f97316'],rodWidth:4.5,glowColor:'rgba(249,115,22,.98)',lineColor:'rgba(249,115,22,.75)',lineWidth:2,  particleColor:'#f97316',idleAnim:true},
  phantom_rod:  {rodGradient:['#ddd6fe','#a78bfa'],rodWidth:4.5,glowColor:'rgba(167,139,250,1)', lineColor:'rgba(167,139,250,.8)',lineWidth:2.2,particleColor:'#a78bfa',idleAnim:true},
  dragon_rod:   {rodGradient:['#fca5a5','#ef4444'],rodWidth:5,  glowColor:'rgba(239,68,68,1)',   lineColor:'rgba(239,68,68,.8)', lineWidth:2.4,particleColor:'#ef4444',idleAnim:true},
  galaxy_rod:   {rodGradient:['#c7d2fe','#818cf8'],rodWidth:5,  glowColor:'rgba(129,140,248,1)', lineColor:'rgba(129,140,248,.85)',lineWidth:2.5,particleColor:'#818cf8',idleAnim:true},
  poseidon_rod: {rodGradient:['#fef9c3','#ffd700'],rodWidth:5.5,glowColor:'rgba(255,215,0,1)',   lineColor:'rgba(255,215,0,.9)', lineWidth:3,  particleColor:'#ffd700',idleAnim:true},
};

// ── Rarity colors ────────────────────────────────────────
const RC = {common:'#9ca3af',uncommon:'#4ade80',rare:'#3b82f6',epic:'#a855f7',legendary:'#f59e0b',mythic:'#e040fb'};

const RARITY_DISPLAY = {
  common:    {label:'COMMON',    glow:'rgba(160,180,200,.6)',  color:'#9ca3af', title:'CAUGHT!'},
  uncommon:  {label:'UNCOMMON',  glow:'rgba(80,200,80,.65)',   color:'#4ade80', title:'NICE CATCH!'},
  rare:      {label:'RARE',      glow:'rgba(60,130,255,.75)',  color:'#3b82f6', title:'RARE CATCH!'},
  epic:      {label:'EPIC',      glow:'rgba(180,80,255,.8)',   color:'#a855f7', title:'EPIC CATCH!'},
  legendary: {label:'LEGENDARY', glow:'rgba(255,200,0,.9)',    color:'#f59e0b', title:'LEGENDARY!'},
  mythic:    {label:'MYTHIC',    glow:'rgba(220,80,255,1)',    color:'#e040fb', title:'MYTHIC!!!'},
};

// ── Dev account config ───────────────────────────────────
const DEV_ACCOUNT = {
  username:'armen', role:'Developer', displayColor:'#ffd700',
  badgeText:'⚡ DEV', maxLevel:99, maxXP:999999,
};
function isDeveloperAccount(u) {
  return typeof u==='string' && u.trim().toLowerCase()==='armen';
}

// ── Helpers ──────────────────────────────────────────────
function fmt(n){if(n>=1e6)return(n/1e6).toFixed(1)+'M';if(n>=1e3)return(n/1e3).toFixed(1)+'K';return n;}
function getCurrentRodVisual(){const r=S.equippedRod;return(r&&ROD_VISUALS[r])?ROD_VISUALS[r]:ROD_VISUALS.default;}
function getEquippedRodBonuses(){
  const r=EXCLUSIVE_RODS.find(x=>x.id===S.equippedRod);
  return r?r.bonuses:{biteChanceBonus:0,tensionControlBonus:0,catchSuccessBonus:0,rareFishChanceBonus:0,weightBonus:0,incomeBonus:0};
}