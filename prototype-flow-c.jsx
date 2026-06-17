/* global React, TVChrome, Poster, Icon, FlowRail, RestartBtn, ModalScrim, HomeScreen, DetailScreen, PlaybackScreen */
const { useState, useEffect } = React;

/* ═══════════════════════════════════════════════════
   FLOW C · Detalle → Reproducción → Continuidad → Fin
═══════════════════════════════════════════════════ */

const FLOW_C_STEPS = [
  { id: 'home',     label: 'Inicio' },
  { id: 'detail',   label: 'Detalle' },
  { id: 'playback', label: 'Reproducción' },
  { id: 'next',     label: 'A continuación' },
  { id: 'end',      label: 'Fin de sesión' },
];

function FlowC() {
  const [step, setStep] = useState('home');
  const reset = () => setStep('home');

  return (
    <div className="col" style={{ height: '100%' }}>
      <FlowRail label="Flujo C" steps={FLOW_C_STEPS} current={step} onJump={setStep} />
      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
        <TVChrome profileInitial={step === 'end' ? null : 'EL'} hideStatus={step === 'end'}>
          {step === 'home' && (
            <HomeScreen
              name="Elena"
              onDetailBear={() => setStep('detail')}
              onDetailSeverance={() => setStep('detail')}
              onDecideForMe={() => setStep('detail')}
            />
          )}
          {step === 'detail' && (
            <DetailScreen
              data={{
                title: 'The Bear',
                rating: '8.6',
                year: '2022',
                genre: 'Drama',
                tone: 'Comedy',
                duration: '44 min',
                platform: 'Apple TV+',
                season: 'Temp. 2',
                episode: 'Ep 3 · "Forks"',
                synopsis: 'Carmy y su equipo transforman el restaurante familiar mientras enfrentan duelos personales. Richie viaja a un restaurante de alta cocina para reaprender qué significa el servicio.',
                cover: 'The Bear · Cover art',
              }}
              onBack={() => setStep('home')}
              onPlay={() => setStep('playback')}
            />
          )}
          {step === 'playback' && (
            <PlaybackScreen
              title="The Bear"
              meta="S2 · Ep 3 · Forks · Apple TV+"
              onBack={() => setStep('home')}
              onEnd={() => setStep('next')}
            />
          )}
          {step === 'next' && (
            <>
              <PlaybackScreen
                title="The Bear"
                meta="S2 · Ep 3 · Finalizado"
                onBack={() => setStep('home')}
                minimal
              />
              <UpNextModal
                onCancel={() => setStep('end')}
                onContinue={() => setStep('playback')}
              />
            </>
          )}
          {step === 'end' && <EndOfSession />}
        </TVChrome>
        <RestartBtn onClick={reset} />
      </div>
    </div>
  );
}

/* ─── A CONTINUACIÓN — modal scrim with next recommendation ─── */
function UpNextModal({ onCancel, onContinue, data }) {
  const d = data || {
    title: 'Severance',
    meta: 'S1 · Ep 1 · 41 min · Apple TV+',
    badge: '92% match',
    genre: 'Sci-Fi · Thriller',
    why: 'Encaja con tu mood relax y queda tiempo disponible para un episodio completo',
  };
  const [count, setCount] = useState(10);
  useEffect(() => {
    if (count <= 0) { onContinue(); return; }
    const t = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  // eslint-disable-next-line
  }, [count]);

  return (
    <ModalScrim>
      <div
        className="col gap-20"
        style={{
          width: 720,
          padding: 32,
          background: 'rgba(22,24,31,0.96)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 20,
          boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
          position: 'relative',
        }}
      >
        <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div className="col gap-6">
            <div className="h-eyebrow">◆ Continuidad inteligente · IA sugiere</div>
            <h2 className="h-title md" style={{ fontSize: 30 }}>A continuación</h2>
          </div>
          <div
            style={{
              fontFamily: 'var(--f-mono)',
              fontSize: 11,
              letterSpacing: '0.18em',
              color: 'var(--t3)',
              textTransform: 'uppercase',
              textAlign: 'right',
            }}
          >
            Reproduciendo en<br />
            <span style={{ color: 'var(--neon)', fontSize: 22, letterSpacing: 0 }}>00:{String(count).padStart(2, '0')}</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 18,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14,
            padding: 16,
          }}
        >
          <Poster img={d.img} src={d.title} style={{ width: 120, height: 120, borderRadius: 10 }} />
          <div className="col gap-6 flex-1">
            <div className="row gap-8" style={{ alignItems: 'center' }}>
              <span className="badge badge-neon"><span className="badge-dot"></span>{d.badge}</span>
              <span style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.14em', color: 'var(--t3)' }}>
                {d.genre}
              </span>
            </div>
            <div className="h-title md" style={{ fontSize: 26 }}>{d.title}</div>
            <div className="h-meta">{d.meta}</div>
            <div style={{ fontSize: 13, color: 'var(--t2)', lineHeight: 1.5, marginTop: 4 }}>
              {d.why}
            </div>
          </div>
        </div>

        <div className="progress">
          <i style={{ width: `${((10 - count) / 10) * 100}%`, transition: 'width .5s linear' }} />
        </div>

        <div className="row gap-10" style={{ justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost btn-lg" onClick={onCancel}>
            <Icon.Close size={14} /> Es suficiente por hoy
          </button>
          <button className="btn btn-primary btn-lg" onClick={onContinue}>
            <Icon.Play size={16} /> Reproducir ahora
          </button>
        </div>
      </div>
    </ModalScrim>
  );
}

/* ─── FIN DE SESIÓN ─── */
function EndOfSession({ name = 'Elena', watched = 'The Bear S2E3', onRestart }) {
  const stats = [
    { num: '46 min', label: 'Tiempo activo', sub: `01 episodio · ${watched}` },
    { num: '92%',    label: 'Match · IA',    sub: 'Acertó tu mood relax' },
    { num: '0',      label: 'Skips',         sub: 'Sesión completa sin pausas largas' },
    { num: '+',      label: 'Aprendizaje',   sub: 'Modelo actualizado para mañana' },
  ];

  return (
    <div className="screen screen-center" style={{ paddingTop: 0 }}>
      <div className="tv-glow-floor" style={{ bottom: -200, height: 320 }} />
      <div className="scrim" />

      <div className="h-eyebrow muted" style={{ marginBottom: 4 }}>◆ 23:00 · Cierre de sesión</div>
      <h1 className="h-title" style={{ fontSize: 92, marginBottom: 4, whiteSpace: 'nowrap' }}>Hasta mañana,</h1>
      <h1 className="h-title" style={{ fontSize: 92, color: 'var(--neon)', textShadow: '0 0 40px var(--neon-glow)', whiteSpace: 'nowrap' }}>{name}</h1>

      <p className="h-sub" style={{ maxWidth: 600, marginTop: 12 }}>
        Aprendí de tu sesión. La próxima vez te voy a entender un poco mejor.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 12,
          marginTop: 32,
          width: 880,
        }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 14,
              padding: '18px 18px 16px',
              textAlign: 'left',
            }}
          >
            <div className="h-title" style={{ fontSize: 36, color: 'var(--neon)' }}>{s.num}</div>
            <div className="h-meta" style={{ marginTop: 4 }}>{s.label}</div>
            <div style={{ fontSize: 12, color: 'var(--t3)', marginTop: 8, lineHeight: 1.4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {onRestart ? (
        <button className="btn btn-secondary btn-md" style={{ marginTop: 28 }} onClick={onRestart}>
          <Icon.Refresh size={14} /> Ver la experiencia de nuevo
        </button>
      ) : (
        <div
          style={{
            marginTop: 28,
            fontFamily: 'var(--f-mono)',
            fontSize: 10,
            letterSpacing: '0.18em',
            color: 'var(--t4)',
            textTransform: 'uppercase',
          }}
        >
          TV en standby en 5… 4… 3…
        </div>
      )}
    </div>
  );
}

Object.assign(window, {
  FlowC,
  FLOW_C_STEPS,
  UpNextModal,
  EndOfSession,
});
