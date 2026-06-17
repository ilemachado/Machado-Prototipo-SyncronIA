/* global React, TVChrome, Icon, RestartBtn, ModalScrim, COVERS,
   SplashScreen, WifiList, WifiPassword, PlatformsScreen, CreateProfile,
   DetectingScreen, ActiveProfileScreen, HomeScreen,
   DetailScreen, DecideForMeScreen, VoiceListenScreen, VoiceSaidScreen, VoiceResultsScreen,
   PlaybackScreen, UpNextModal, EndOfSession,
   ProfileMenu, PersonalizeProfileScreen, AccountSettingsScreen, PETS */
const { useState, useEffect, useRef } = React;

/* ═══════════════════════════════════════════════════════════════
   FLUJO UNIFICADO · una sola experiencia continua
   Configuración inicial → Inicio (hub) → Bifurcación → Sesión → Cierre
═══════════════════════════════════════════════════════════════ */

const CONTENT = {
  bear: {
    key: 'bear',
    title: 'The Bear', rating: '8.6', year: '2022', genre: 'Drama', tone: 'Comedy',
    duration: '44 min', platform: 'Apple TV+', season: 'Temp. 2', episode: 'Ep 7 · "Forks"',
    synopsis: 'Carmy y su equipo transforman el restaurante familiar mientras enfrentan duelos personales. Richie viaja a un restaurante de alta cocina para reaprender qué significa el servicio.',
    cover: 'The Bear · Cover art', img: COVERS.bear,
    meta: 'S2 · Ep 7 · Forks · Apple TV+',
  },
  severance: {
    key: 'severance',
    title: 'Severance', rating: '8.7', year: '2022', genre: 'Sci-Fi', tone: 'Thriller',
    duration: '41 min', platform: 'Apple TV+', season: 'Temp. 1', episode: 'Episodio 1',
    synopsis: 'Mark lidera un equipo en Lumon Industries, donde los empleados se someten a un procedimiento que divide quirúrgicamente sus recuerdos entre el trabajo y la vida personal.',
    cover: 'Severance · Cover art', img: COVERS.severance,
    meta: 'S1 · Ep 1 · 41 min · Apple TV+',
  },
  tedlasso: {
    key: 'tedlasso',
    title: 'Ted Lasso', rating: '8.8', year: '2020', genre: 'Comedia', tone: 'Feel-good',
    duration: '28 min', platform: 'Apple TV+', season: 'Temp. 1', episode: 'Episodio 1',
    synopsis: 'Un entrenador de fútbol americano universitario es contratado para dirigir un equipo de fútbol inglés, pese a no tener experiencia. Su optimismo desarma a todos a su alrededor.',
    cover: 'Ted Lasso · Cover art', img: COVERS.tedlasso,
    meta: 'S1 · Ep 1 · 28 min · Apple TV+',
  },
};

const NEXT_OF = { bear: 'severance', severance: 'bear', tedlasso: 'bear' };

function upNextData(key) {
  const c = CONTENT[NEXT_OF[key]] || CONTENT.severance;
  return {
    title: c.title,
    meta: c.meta,
    img: c.img,
    badge: '92% match',
    genre: `${c.genre} · ${c.tone}`,
    why: 'Encaja con tu mood relax y queda tiempo disponible para un episodio completo',
  };
}

/* ─── Phase rail (3 fases de la experiencia, sin cortar el flujo) ─── */
const PHASES = [
  { id: 'setup',   n: '01', label: 'Configuración inicial', jump: 'splash' },
  { id: 'hub',     n: '02', label: 'Inicio · Bifurcación',  jump: 'home' },
  { id: 'session', n: '03', label: 'Sesión · Continuidad',  jump: 'playback' },
];

const STEP_PHASE = {
  splash: 'setup', wifi: 'setup', 'wifi-pass': 'setup', apps: 'setup',
  profile: 'setup', detecting: 'setup', active: 'setup',
  home: 'hub', detail: 'hub', decide: 'hub',
  'voice-listen': 'hub', 'voice-said': 'hub', 'voice-result': 'hub',
  personalize: 'hub', settings: 'hub',
  playback: 'session', next: 'session', end: 'session',
};

function PhaseRail({ step, onJump }) {
  const phase = STEP_PHASE[step];
  return (
    <div className="flow-rail">
      <span className="lbl">SyncronIA</span>
      <span className="sep">·</span>
      {PHASES.map((p, i) => (
        <React.Fragment key={p.id}>
          {i > 0 && <span className="sep">›</span>}
          <button
            className={`step ${phase === p.id ? 'on' : ''}`}
            onClick={() => onJump(p.jump)}
          >
            {p.n} · {p.label}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}

const SETUP_STEPS = ['splash', 'wifi', 'wifi-pass', 'apps', 'profile', 'detecting'];

function FlowUnified() {
  const [step, setStep] = useState('splash');

  // onboarding state
  const [profileName, setProfileName] = useState('Elena');
  const [avatar, setAvatar] = useState(0);
  const [apps, setApps] = useState(['netflix', 'apple']);
  const [selectedWifi, setSelectedWifi] = useState(null);
  const [password, setPassword] = useState('');

  // account / profile state
  const [petId, setPetId] = useState('dog');
  const [hasPet, setHasPet] = useState(false);       // becomes true after personalizar
  const [prefs, setPrefs] = useState(['Drama', 'Comedia', 'Sci-Fi']);
  const [privacy, setPrivacy] = useState(['usage', 'history', 'autodetect']);
  const [menuOpen, setMenuOpen] = useState(false);

  // session state
  const [detail, setDetail] = useState('bear');
  const [nowPlaying, setNowPlaying] = useState('bear');

  // auto-advance the "detecting" screen → perfil activo
  useEffect(() => {
    if (step === 'detecting') {
      const t = setTimeout(() => setStep('active'), 3200);
      return () => clearTimeout(t);
    }
  }, [step]);

  const reset = () => {
    setStep('splash');
    setProfileName('Elena');
    setAvatar(0);
    setApps(['netflix', 'apple']);
    setSelectedWifi(null);
    setPassword('');
    setPetId('dog');
    setHasPet(false);
    setPrefs(['Drama', 'Comedia', 'Sci-Fi']);
    setPrivacy(['usage', 'history', 'autodetect']);
    setMenuOpen(false);
    setDetail('bear');
    setNowPlaying('bear');
  };

  const openDetail = (key) => { setDetail(key); setStep('detail'); };
  const play = (key) => { setNowPlaying(key); setStep('playback'); };

  const togglePref = (g) =>
    setPrefs((p) => (p.includes(g) ? p.filter((x) => x !== g) : [...p, g]));
  const togglePlatform = (id) =>
    id && setApps((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const togglePrivacy = (id) =>
    setPrivacy((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const profileStep = !SETUP_STEPS.includes(step) && step !== 'end';
  const initials = (profileName || 'EL').trim().slice(0, 2).toUpperCase() || 'EL';
  const petEmoji = hasPet ? (PETS.find((p) => p.id === petId) || {}).emoji : null;
  // profile pill is clickable only on the main hub-ish screens
  const pillClickable = ['home', 'detail', 'playback'].includes(step);

  return (
    <div className="col" style={{ height: '100%' }}>
      <PhaseRail step={step} onJump={setStep} />
      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
        <TVChrome
          profileInitial={profileStep ? initials : null}
          profileAvatar={profileStep ? petEmoji : null}
          hideStatus={step === 'end' || step === 'playback' || step === 'next'}
          onProfileClick={pillClickable ? () => setMenuOpen(true) : null}
        >
          {/* ─────────── FASE 1 · Configuración inicial ─────────── */}
          {step === 'splash' && <SplashScreen onStart={() => setStep('wifi')} />}

          {step === 'wifi' && (
            <WifiList
              selected={selectedWifi}
              onSelect={(id) => { setSelectedWifi(id); setStep('wifi-pass'); }}
            />
          )}

          {step === 'wifi-pass' && (
            <WifiPassword
              network={selectedWifi}
              password={password}
              setPassword={setPassword}
              onBack={() => setStep('wifi')}
              onConnect={() => setStep('apps')}
            />
          )}

          {step === 'apps' && (
            <PlatformsScreen
              apps={apps}
              toggle={(id) =>
                setApps((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
              }
              onContinue={() => setStep('profile')}
              onBack={() => setStep('wifi')}
            />
          )}

          {step === 'profile' && (
            <CreateProfile
              name={profileName}
              setName={setProfileName}
              avatar={avatar}
              setAvatar={setAvatar}
              onContinue={() => setStep('detecting')}
              onBack={() => setStep('apps')}
            />
          )}

          {step === 'detecting' && <DetectingScreen />}

          {step === 'active' && (
            <ActiveProfileScreen
              name={profileName}
              avatar={avatar}
              onContinue={() => setStep('home')}
            />
          )}

          {/* ─────────── FASE 2 · Inicio (hub) + bifurcación ─────────── */}
          {step === 'home' && (
            <HomeScreen
              name={profileName}
              apps={apps}
              onDetailBear={() => openDetail('bear')}
              onPlayBear={() => play('bear')}
              onDetailSeverance={() => openDetail('severance')}
              onDecideForMe={() => setStep('decide')}
              onVoice={() => setStep('voice-listen')}
            />
          )}

          {step === 'detail' && (
            <DetailScreen
              data={CONTENT[detail]}
              onBack={() => setStep('home')}
              onPlay={() => play(detail)}
            />
          )}

          {step === 'decide' && (
            <DecideForMeScreen onDone={() => play('bear')} />
          )}

          {step === 'voice-listen' && (
            <VoiceListenScreen
              onCaptured={() => setStep('voice-said')}
              onCancel={() => setStep('home')}
            />
          )}

          {step === 'voice-said' && (
            <VoiceSaidScreen
              onConfirm={() => setStep('voice-result')}
              onRetry={() => setStep('voice-listen')}
            />
          )}

          {step === 'voice-result' && (
            <VoiceResultsScreen
              onBack={() => setStep('home')}
              onPlay={() => play('tedlasso')}
            />
          )}

          {/* ─────────── Cuenta · perfil + configuración ─────────── */}
          {step === 'personalize' && (
            <PersonalizeProfileScreen
              name={profileName}
              setName={setProfileName}
              petId={petId}
              setPetId={(id) => { setPetId(id); setHasPet(true); }}
              prefs={prefs}
              togglePref={togglePref}
              onBack={() => setStep('home')}
              onSave={() => { setHasPet(true); setStep('home'); }}
            />
          )}

          {step === 'settings' && (
            <AccountSettingsScreen
              apps={apps}
              togglePlatform={togglePlatform}
              privacy={privacy}
              togglePrivacy={togglePrivacy}
              onBack={() => setStep('home')}
              onSave={() => setStep('home')}
            />
          )}

          {/* ─────────── FASE 3 · Sesión + continuidad + cierre ─────────── */}
          {step === 'playback' && (
            <PlaybackScreen
              title={CONTENT[nowPlaying].title}
              meta={CONTENT[nowPlaying].meta}
              img={CONTENT[nowPlaying].img}
              onBack={() => setStep('home')}
              onEnd={() => setStep('next')}
            />
          )}

          {step === 'next' && (
            <>
              <PlaybackScreen
                title={CONTENT[nowPlaying].title}
                meta={`${CONTENT[nowPlaying].season} · Finalizado`}
                img={CONTENT[nowPlaying].img}
                onBack={() => setStep('home')}
                minimal
              />
              <UpNextModal
                data={upNextData(nowPlaying)}
                onCancel={() => setStep('end')}
                onContinue={() => play(NEXT_OF[nowPlaying] || 'severance')}
              />
            </>
          )}

          {step === 'end' && (
            <EndOfSession
              name={profileName}
              watched={`${CONTENT[nowPlaying].title} ${CONTENT[nowPlaying].season}`}
              onRestart={reset}
            />
          )}

          {/* ─────────── Menú de perfil (overlay) ─────────── */}
          {menuOpen && (
            <ProfileMenu
              name={profileName}
              petEmoji={petEmoji}
              initials={initials}
              onPersonalize={() => { setMenuOpen(false); setStep('personalize'); }}
              onSettings={() => { setMenuOpen(false); setStep('settings'); }}
              onClose={() => setMenuOpen(false)}
            />
          )}
        </TVChrome>
        <RestartBtn onClick={reset} label="Reiniciar experiencia" />
      </div>
    </div>
  );
}

Object.assign(window, { FlowUnified });
