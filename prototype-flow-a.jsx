/* global React, TVChrome, Poster, Icon, FlowRail, RestartBtn */
const { useState, useEffect, useRef } = React;

/* ═══════════════════════════════════════════════════
   FLOW A · Configuración inicial → Detección → Inicio
═══════════════════════════════════════════════════ */

const FLOW_A_STEPS = [
  { id: 'splash',    label: 'Bienvenida' },
  { id: 'wifi',      label: 'WiFi' },
  { id: 'wifi-pass', label: 'Contraseña' },
  { id: 'apps',      label: 'Plataformas' },
  { id: 'profile',   label: 'Crear perfil' },
  { id: 'detecting', label: 'Detectando' },
  { id: 'active',    label: 'Perfil activo' },
  { id: 'home',      label: 'Inicio' },
];

function FlowA() {
  const [step, setStep] = useState('splash');
  const [profileName, setProfileName] = useState('Elena');
  const [avatar, setAvatar] = useState(0);
  const [apps, setApps] = useState(['netflix', 'apple']);
  const [selectedWifi, setSelectedWifi] = useState(null);
  const [password, setPassword] = useState('');

  // Auto-advance from detecting screen
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
  };

  return (
    <div className="col" style={{ height: '100%' }}>
      <FlowRail label="Flujo A" steps={FLOW_A_STEPS} current={step} onJump={setStep} />
      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
        <TVChrome profileInitial={step === 'home' ? 'EL' : null}>
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
          {step === 'home' && <HomeScreen name={profileName} apps={apps} embedded="A" />}
        </TVChrome>
        <RestartBtn onClick={reset} />
      </div>
    </div>
  );
}

/* ─── 01 · SPLASH ─── */
function SplashScreen({ onStart }) {
  return (
    <div className="screen screen-center">
      <div className="tv-glow-floor"></div>
      <div className="h-eyebrow muted" style={{ marginBottom: 8 }}>◆ Chromecast · Primera vez</div>
      <h1 className="h-title xl" style={{ fontSize: 132, letterSpacing: '0.04em' }}>
        SYNCRON<span style={{ color: 'var(--neon)' }}>IA</span>
      </h1>
      <p className="h-sub" style={{ maxWidth: 520, fontSize: 18 }}>
        Experiencia inteligente de contenido.<br />
        El sistema se adapta a vos.
      </p>
      <div style={{ marginTop: 32 }}>
        <button className="btn btn-primary btn-xl" onClick={onStart}>
          Empecemos
          <Icon.ArrowR size={18} />
        </button>
      </div>
      <div style={{ position: 'absolute', bottom: 16, fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--t4)' }}>
        TOMA UN MINUTO · CONFIGURACIÓN ÚNICA
      </div>
    </div>
  );
}

/* ─── 02 · WIFI LIST ─── */
const WIFI_NETWORKS = [
  { id: 'home-5g',  name: 'Home WiFi 5G',     bars: 4, locked: true, signal: '−42 dBm · 5 GHz' },
  { id: 'home-2g',  name: 'Home WiFi 2.4G',   bars: 3, locked: true, signal: '−58 dBm · 2.4 GHz' },
  { id: 'guest',    name: 'Guest Network',    bars: 3, locked: false, signal: '−60 dBm · Abierta' },
  { id: 'vecino',   name: 'Red_vecino',       bars: 2, locked: true, signal: '−72 dBm · 2.4 GHz' },
  { id: 'invitados', name: 'Invitados',       bars: 1, locked: true, signal: '−81 dBm · Débil' },
];

function WifiBars({ bars }) {
  return (
    <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', height: 14 }}>
      {[1, 2, 3, 4].map((b) => (
        <div
          key={b}
          style={{
            width: 3,
            height: 4 + b * 2.5,
            background: b <= bars ? 'currentColor' : 'rgba(255,255,255,0.12)',
            borderRadius: 1,
          }}
        />
      ))}
    </div>
  );
}

function WifiList({ onSelect }) {
  return (
    <div className="screen col gap-32" style={{ width: 760, alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="h-eyebrow muted" style={{ marginBottom: 10 }}>◆ Paso 01/04</div>
        <h2 className="h-title md">Configurar WiFi</h2>
        <p className="h-sub" style={{ marginTop: 8 }}>Seleccioná tu red para continuar</p>
      </div>

      <div className="col gap-10" style={{ width: '100%' }}>
        {WIFI_NETWORKS.map((n) => (
          <button key={n.id} className="list-item-btn" onClick={() => onSelect(n.id)}>
            <span style={{ color: 'var(--t2)', display: 'inline-flex' }}>
              <Icon.Wifi size={22} />
            </span>
            <div className="flex-1 col gap-4">
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--t1)' }}>{n.name}</div>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.12em', color: 'var(--t3)' }}>
                {n.signal}
              </div>
            </div>
            <span style={{ color: 'var(--t3)' }}><WifiBars bars={n.bars} /></span>
            {n.locked && <span style={{ color: 'var(--t3)' }}><Icon.Lock size={14} /></span>}
            <span style={{ color: 'var(--t4)' }}><Icon.Chevron /></span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─── 03 · WIFI PASSWORD ─── */
function WifiPassword({ network, password, setPassword, onBack, onConnect }) {
  const net = WIFI_NETWORKS.find((n) => n.id === network) || WIFI_NETWORKS[0];
  const inputRef = useRef();
  useEffect(() => {
    const t = setTimeout(() => {
      // simulate password typing
      const target = 'casa·2024';
      let i = 0;
      const it = setInterval(() => {
        i++;
        if (i > target.length) { clearInterval(it); return; }
        setPassword(target.slice(0, i));
      }, 90);
      return () => clearInterval(it);
    }, 400);
    return () => clearTimeout(t);
  // eslint-disable-next-line
  }, [network]);

  return (
    <div className="screen col gap-24" style={{ width: 640, alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="h-eyebrow muted" style={{ marginBottom: 10 }}>◆ Conectando a</div>
        <h2 className="h-title md">{net.name}</h2>
      </div>

      <div className="list-item-btn active" style={{ pointerEvents: 'none' }}>
        <span style={{ color: 'var(--neon)', display: 'inline-flex' }}><Icon.Wifi size={22} /></span>
        <div className="flex-1 col gap-4">
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--neon)' }}>{net.name}</div>
          <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.12em', color: 'var(--neon)' }}>
            Seleccionada · {net.signal}
          </div>
        </div>
        <Icon.Check size={16} />
      </div>

      <div className="col gap-8" style={{ width: '100%' }}>
        <label style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--t3)', textTransform: 'uppercase' }}>
          Contraseña
        </label>
        <div className="input-field focused" ref={inputRef}>
          <span style={{ color: 'var(--t3)' }}><Icon.Lock size={16} /></span>
          <span style={{ fontFamily: 'var(--f-mono)', fontSize: 18, letterSpacing: 4, color: 'var(--t1)', flex: 1 }}>
            {'•'.repeat(password.length)}
          </span>
          <span className="input-cursor" />
        </div>
        <div style={{ fontFamily: 'var(--f-mono)', fontSize: 9, letterSpacing: '0.14em', color: 'var(--t4)', textTransform: 'uppercase' }}>
          WPA2 · Cifrado de extremo a extremo
        </div>
      </div>

      <div className="row gap-12" style={{ marginTop: 8 }}>
        <button className="btn btn-ghost btn-lg" onClick={onBack}>Cancelar</button>
        <button
          className="btn btn-primary btn-lg"
          disabled={password.length < 4}
          style={{ opacity: password.length < 4 ? 0.4 : 1 }}
          onClick={onConnect}
        >
          Conectar
          <Icon.ArrowR size={16} />
        </button>
      </div>
    </div>
  );
}

/* ─── 04 · PLATFORMS GRID ─── */
const PLATFORMS = [
  { id: 'netflix',  name: 'Netflix',     color: '#000000', logo: 'assets/logo-netflix.png' },
  { id: 'disney',   name: 'Disney+',     color: '#0A1A4A', logo: 'assets/logo-disney.jpg' },
  { id: 'apple',    name: 'Apple TV+',   color: '#000000', logo: 'assets/logo-appletv.jpg' },
  { id: 'prime',    name: 'Prime Video', color: '#1399C6', logo: 'assets/logo-prime.webp' },
  { id: 'max',      name: 'MAX',         color: '#0A0A0F', logo: 'assets/logo-max.png' },
  { id: 'param',    name: 'Paramount+',  color: '#1C5FB0', logo: 'assets/logo-paramount.webp' },
  { id: 'youtube',  name: 'YouTube',     color: '#FFFFFF', logo: 'assets/logo-youtube.webp' },
  { id: 'spotify',  name: 'Spotify',     color: '#000000', logo: 'assets/logo-spotify.jpg' },
];

function PlatformsScreen({ apps, toggle, onContinue, onBack }) {
  return (
    <div className="screen col gap-24" style={{ width: 840, alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="h-eyebrow muted" style={{ marginBottom: 10 }}>◆ Paso 02/04</div>
        <h2 className="h-title md">Selecciona tus plataformas</h2>
        <p className="h-sub" style={{ marginTop: 8 }}>El sistema solo va a sugerir contenido de tus apps activas</p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 14,
          width: '100%',
        }}
      >
        {PLATFORMS.map((p) => {
          const on = apps.includes(p.id);
          return (
            <button
              key={p.id}
              onClick={() => toggle(p.id)}
              className={`card ${on ? 'focus' : ''}`}
              style={{
                aspectRatio: '1.4',
                padding: 12,
                background: on ? 'var(--neon-dim)' : 'rgba(255,255,255,0.03)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 10,
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 16,
                  background: p.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <img
                  src={p.logo}
                  alt={p.name}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 8 }}
                />
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: on ? 'var(--neon)' : 'var(--t1)' }}>{p.name}</div>
              {on && (
                <div
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: 'var(--neon)',
                    color: '#0B0C0E',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Icon.Check size={14} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="row gap-12" style={{ marginTop: 8 }}>
        <button className="btn btn-ghost btn-lg" onClick={onBack}>Atrás</button>
        <button
          className="btn btn-primary btn-lg"
          onClick={onContinue}
          disabled={apps.length === 0}
          style={{ opacity: apps.length === 0 ? 0.4 : 1 }}
        >
          {`Continuar con ${apps.length} ${apps.length === 1 ? 'plataforma' : 'plataformas'}`}
          <Icon.ArrowR size={16} />
        </button>
      </div>
    </div>
  );
}

/* ─── 05 · CREATE PROFILE ─── */
const AVATARS = ['EL', 'MA', 'KDS', '+'];

function CreateProfile({ name, setName, avatar, setAvatar, onBack, onContinue }) {
  return (
    <div className="screen col gap-32" style={{ width: 640, alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="h-eyebrow muted" style={{ marginBottom: 10 }}>◆ Paso 03/04</div>
        <h2 className="h-title md">Crear perfil</h2>
        <p className="h-sub" style={{ marginTop: 8 }}>Personalizá tu experiencia</p>
      </div>

      <div className="col gap-8" style={{ width: '100%' }}>
        <label style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--t3)', textTransform: 'uppercase' }}>
          Nombre del perfil
        </label>
        <div className="input-field focused">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontFamily: 'var(--f-body)',
              fontSize: 18,
              color: 'var(--t1)',
            }}
          />
        </div>
      </div>

      <div className="col gap-12" style={{ width: '100%' }}>
        <label style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--t3)', textTransform: 'uppercase' }}>
          Elegí tu avatar
        </label>
        <div className="row gap-12">
          {AVATARS.map((a, i) => (
            <button
              key={i}
              onClick={() => setAvatar(i)}
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: avatar === i ? 'var(--neon-dim)' : 'rgba(255,255,255,0.04)',
                border: avatar === i ? '2px solid var(--neon)' : '1.5px solid rgba(255,255,255,0.1)',
                color: avatar === i ? 'var(--neon)' : 'var(--t2)',
                fontFamily: 'var(--f-display)',
                fontWeight: 800,
                fontSize: 18,
                letterSpacing: '0.04em',
                boxShadow: avatar === i ? '0 0 28px var(--neon-glow)' : 'none',
                transition: 'all .2s ease',
              }}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <div className="row gap-12" style={{ marginTop: 8 }}>
        <button className="btn btn-ghost btn-lg" onClick={onBack}>Atrás</button>
        <button className="btn btn-primary btn-lg" onClick={onContinue} disabled={!name}>
          Finalizar
          <Icon.Check size={16} />
        </button>
      </div>
    </div>
  );
}

/* ─── 06 · DETECTING CONTEXT ─── */
function DetectingScreen() {
  const lines = [
    'Analizando hora del día · 22:14',
    'Tipo de día · Miércoles · Semana',
    'Tiempo disponible estimado · 45 min',
    'Mood inferido · Relax nocturno',
    'Perfil detectado · Elena',
  ];
  const [n, setN] = useState(0);
  useEffect(() => {
    const it = setInterval(() => setN((x) => (x + 1 <= lines.length ? x + 1 : x)), 520);
    return () => clearInterval(it);
  // eslint-disable-next-line
  }, []);

  return (
    <div className="screen screen-center">
      <div className="tv-glow-floor"></div>
      <div className="spark-spin" style={{ color: 'var(--neon)', marginBottom: 8 }}>
        <Icon.Spark size={64} />
      </div>
      <div className="h-eyebrow" style={{ marginBottom: 6 }}>◆ IA activa · Leyendo contexto</div>
      <h2 className="h-title md" style={{ fontSize: 40 }}>Detectando tu momento</h2>

      <div
        className="col gap-8"
        style={{
          minWidth: 460,
          marginTop: 18,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 'var(--r-lg)',
          padding: '14px 18px',
          textAlign: 'left',
        }}
      >
        {lines.map((l, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              opacity: i < n ? 1 : 0.25,
              transition: 'opacity .4s ease',
              fontFamily: 'var(--f-mono)',
              fontSize: 12,
              color: i < n ? 'var(--t1)' : 'var(--t3)',
              letterSpacing: '0.06em',
            }}
          >
            <span style={{ color: i < n ? 'var(--neon)' : 'var(--t4)' }}>
              {i < n ? <Icon.Check size={14} /> : '•'}
            </span>
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── 07 · PERFIL ACTIVO ─── */
function ActiveProfileScreen({ name, avatar, onContinue }) {
  useEffect(() => {
    const t = setTimeout(onContinue, 2400);
    return () => clearTimeout(t);
  }, [onContinue]);

  return (
    <div className="screen screen-center">
      <div className="tv-glow-floor"></div>
      <div className="h-eyebrow" style={{ marginBottom: 4 }}>◆ Detectado automáticamente · Sin selección manual</div>
      <h2 className="h-title md" style={{ fontSize: 32 }}>Perfil activo</h2>

      <div
        style={{
          width: 132,
          height: 132,
          borderRadius: '50%',
          background: 'var(--neon-dim)',
          border: '2px solid var(--neon)',
          color: 'var(--neon)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--f-display)',
          fontWeight: 900,
          fontSize: 44,
          marginTop: 16,
          boxShadow: '0 0 60px var(--neon-glow)',
        }}
      >
        {AVATARS[avatar] || 'EL'}
      </div>
      <h1 className="h-title" style={{ fontSize: 56, marginTop: -4 }}>{name}</h1>

      <div className="row gap-10" style={{ marginTop: 12, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 720 }}>
        <span className="chip">⏱ 22:14 hs</span>
        <span className="chip">📅 Miércoles</span>
        <span className="chip">🌙 Relax</span>
        <span className="chip">~45 min</span>
        <span className="chip neon">◆ IA calibrada</span>
      </div>

      <div style={{ marginTop: 28, fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.18em', color: 'var(--t4)' }}>
        Preparando recomendaciones...
      </div>
    </div>
  );
}

/* ─── 08 · HOME (rendered by FlowB but accessible at end of Flow A) ─── */
function HomeScreen({ name = 'Elena', apps = [], embedded, onDetailBear, onPlayBear, onDetailSeverance, onDecideForMe, onVoice }) {
  return (
    <div className="screen col gap-24" style={{ height: '100%', width: '100%', maxWidth: 1100, justifyContent: 'center' }}>
      <div className="row" style={{ alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div className="col gap-8">
          <div className="h-eyebrow">◆ Esto es para vos esta noche</div>
          <h1 className="h-title" style={{ fontSize: 56, whiteSpace: 'nowrap' }}>Buenas noches, {name}</h1>
          <div className="row gap-8" style={{ flexWrap: 'wrap', marginTop: 4 }}>
            <span className="chip">⏱ 22:14</span>
            <span className="chip">~45 min</span>
            <span className="chip">🌙 Relax</span>
          </div>
        </div>
      </div>

      <div className="row gap-20" style={{ alignItems: 'stretch' }}>
        {/* HERO */}
        <button
          onClick={onDetailBear}
          className="card focus"
          style={{
            flex: '0 0 540px',
            display: 'flex',
            flexDirection: 'column',
            padding: 0,
            textAlign: 'left',
            cursor: onDetailBear ? 'pointer' : 'default',
          }}
        >
          <div style={{ position: 'relative' }}>
            <Poster
              img={COVERS.bear}
              src="The Bear · Cover art"
              imgStyle={{ objectPosition: 'center 30%' }}
              style={{ width: '100%', height: 240, borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none' }}
            />
            <div
              role="button"
              onClick={(e) => { e.stopPropagation(); (onPlayBear || onDetailBear) && (onPlayBear || onDetailBear)(); }}
              title="Reproducir"
              style={{
                position: 'absolute',
                right: 18,
                bottom: 18,
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'var(--neon)',
                color: '#0B0C0E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 24px var(--neon-glow)',
                cursor: 'pointer',
                zIndex: 3,
              }}
            >
              <Icon.Play size={22} />
            </div>
          </div>
          <div style={{ padding: '14px 18px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="badge badge-neon"><span className="badge-dot"></span>Top match</span>
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--t3)', textTransform: 'uppercase' }}>
                97% afinidad
              </span>
            </div>
            <div className="h-title md" style={{ fontSize: 30 }}>The Bear</div>
            <div className="h-meta">S2 · Ep 7 · "Forks" · Drama · 44 min · Apple TV+</div>
          </div>
        </button>

        {/* ALTERNATIVES + ACTIONS */}
        <div className="col gap-10 flex-1">
          <div className="h-meta">Alternativas</div>

          <button
            onClick={onDetailSeverance}
            className="card"
            style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 12, textAlign: 'left' }}
          >
            <Poster img={COVERS.severance} src="Severance" style={{ width: 64, height: 64, borderRadius: 10 }} />
            <div className="flex-1 col gap-2" style={{ minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--t1)' }}>Severance</div>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--t3)', textTransform: 'uppercase' }}>
                Sci-Fi · 41 min · 91%
              </div>
            </div>
            <Icon.Play size={20} />
          </button>

          <button
            className="card"
            style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 12, textAlign: 'left' }}
          >
            <Poster img={COVERS.tedlasso} src="Ted Lasso" imgStyle={{ objectPosition: 'center 20%' }} style={{ width: 64, height: 64, borderRadius: 10 }} />
            <div className="flex-1 col gap-2" style={{ minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--t1)' }}>Ted Lasso</div>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--t3)', textTransform: 'uppercase' }}>
                Comedia · 28 min · 88%
              </div>
            </div>
            <Icon.Play size={20} />
          </button>

          <button
            className="card"
            style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 12, textAlign: 'left' }}
          >
            <Poster img={COVERS.abbott} src="Abbott Elementary" style={{ width: 64, height: 64, borderRadius: 10 }} />
            <div className="flex-1 col gap-2" style={{ minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--t1)' }}>Abbott Elementary</div>
              <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--t3)', textTransform: 'uppercase' }}>
                Comedia · 22 min · 84%
              </div>
            </div>
            <Icon.Play size={20} />
          </button>

          {/* CTAs */}
          <div className="col gap-8" style={{ marginTop: 8 }}>
            <button className="btn btn-primary btn-lg" onClick={onDecideForMe} disabled={!onDecideForMe} style={{ width: '100%' }}>
              <Icon.Spark size={18} /> Decidí por mí
            </button>
            <button className="btn btn-secondary btn-lg" onClick={onVoice} disabled={!onVoice} style={{ width: '100%' }}>
              <Icon.Mic size={18} /> Buscar por voz
            </button>
          </div>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 0, left: 0, fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.16em', color: 'var(--t4)', textTransform: 'uppercase' }}>
        {embedded === 'A' && '◆ Final del onboarding · Inicio listo'}
      </div>
    </div>
  );
}

Object.assign(window, {
  FlowA,
  HomeScreen,
  FLOW_A_STEPS,
  SplashScreen,
  WifiList,
  WifiPassword,
  PlatformsScreen,
  CreateProfile,
  DetectingScreen,
  ActiveProfileScreen,
  WIFI_NETWORKS,
  PLATFORMS,
  AVATARS,
});
