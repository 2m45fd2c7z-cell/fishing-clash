# 🎣 Fishing Clash — Idle Catch RPG

Single-page fishing RPG dengan sistem auth Supabase, cloud save, dan audio engine.

## Struktur Folder

```
fishing-clash/
├── index.html          ← markup utama + entry point
├── css/
│   └── style.css       ← semua styling (scene, UI, animasi)
├── js/
│   ├── data.js         ← FISH_DB, LOCS, UPGRADES, EXCLUSIVE_RODS, ROD_VISUALS
│   ├── state.js        ← game state (S), save/load, Supabase auth
│   └── game.js         ← audio, FX, render, fishing logic, main boot
└── README.md
```

## Setup

### 1. Jalankan Lokal
Tidak perlu server — cukup buka `index.html` di browser.

### 2. Supabase (Cloud Save)
Sudah dikonfigurasi dengan project:
- **URL:** `https://zdibfbadgjlgekcpzhsv.supabase.co`
- **Key:** sudah tertanam di `js/state.js`

Tabel yang dibutuhkan di Supabase:
```sql
-- player_profiles
create table player_profiles (
  user_id uuid primary key references auth.users(id),
  username text unique not null,
  account_type text default 'member',
  updated_at timestamptz default now()
);

-- player_saves
create table player_saves (
  user_id uuid primary key references auth.users(id),
  save_data jsonb,
  updated_at timestamptz default now()
);

-- RLS: enable dan buat policy untuk authenticated users
alter table player_profiles enable row level security;
alter table player_saves enable row level security;

create policy "Users manage own profile" on player_profiles
  for all using (auth.uid() = user_id);

create policy "Users manage own save" on player_saves
  for all using (auth.uid() = user_id);
```

### 3. Deploy ke Hosting
Upload semua file ke hosting statis (Netlify, Vercel, GitHub Pages, dll).

## Fitur
- 🎣 Manual fishing + minigame tension bar
- 🤖 Auto fishing (premium, 2500 gems)
- 🐟 40+ jenis ikan (Common → Legendary)
- 🎣 10 exclusive rods dengan bonus stats
- 🗺️ 4 lokasi (River, Lake, Ocean, Secret)
- ⚙️ 5 upgrade paths
- 🔐 Auth: Register / Login / Guest
- ☁️ Cloud save via Supabase
- 🎵 SFX engine + background music
- ⚡ Dev account (username: `armen`)

## Dev Account
Login dengan username `armen` untuk akses:
- Unlimited coins & gems
- Semua upgrade max
- Semua lokasi unlocked
- Semua rod owned + Poseidon equipped
- Auto fishing unlocked

## Tech Stack
- Vanilla HTML/CSS/JS (zero dependencies)
- Supabase (auth + database)
- Web Audio API (procedural SFX + music)
- Canvas API (water animation + particles)
- SVG (fish silhouettes, scene)