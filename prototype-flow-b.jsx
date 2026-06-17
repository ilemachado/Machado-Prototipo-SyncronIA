/* global React, TVChrome, Poster, Icon, FlowRail, RestartBtn, ModalScrim, HomeScreen */
const { useState, useEffect, useRef } = React;

/* ═══════════════════════════════════════════════════
   FLOW B · Bifurcación · "Decidí por mí" + Voz
═══════════════════════════════════════════════════ */

const FLOW_B_STEPS = [
  { id: 'home',         label: 'Inicio' },
  { id: 'detail-sev',   label: 'Detalle' },
  { id: 'decide',       label: 'Decidí por mí' },
  { id: 'voice-listen', label: 'Voz · Escuchando' },
  { id: 'voice-said',   label: 'Voz · Dijiste' },
  { id: 'voice-result', label: 'Voz · Resultados' },
  { id: 'playback',     label: 'Reproducción' },
];

function FlowB() {
  const [step, setStep] = useState('home');
  const reset = () => setStep('home');

  return (
    <div className="col" style={{ height: '100%' }}>
      <FlowRail label="Flujo B" steps={FLOW_B_STEPS} current={step} onJump={setStep} />
      <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
        <TVChrome profileInitial="EL">
          {step === 'home' && (
            <HomeScreen
              name="Elena"
              onDetailBear={() => setStep('playback')}
              onDetailSeverance={() => setStep('detail-sev')}
              onDecideForMe={() => setStep('decide')}
              onVoice={() => setStep('voice-listen')}
            />
          )}
          {step === 'detail-sev' && (
            <DetailScreen
              data={{
                title: 'Severance',
                rating: '8.7',
                year: '2022',
                genre: 'Sci-Fi',
                tone: 'Thriller',
                duration: '41 min',
                platform: 'Apple TV+',
                season: 'Temp. 1',
                episode: 'Episodio 1',
                synopsis: 'Mark lidera un equipo en Lumon Industries, donde los empleados se someten a un procedimiento que divide quirúrgicamente sus recuerdos entre el trabajo y la vida personal.',
                cover: 'Severance · Cover art',
              }}
              onBack={() => setStep('home')}
              onPlay={() => setStep('playback')}
            />
          )}
          {step === 'decide' && (
            <DecideForMeScreen onDone={() => setStep('playback')} />
          )}
          {step === 'voice-listen' && (
            <VoiceListenScreen onCaptured={() => setStep('voice-said')} onCancel={() => setStep('home')} />
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
              onPlay={() => setStep('playback')}
            />
          )}
          {step === 'playback' && (
            <PlaybackScreen
              title="The Bear"
              meta="S2 · Ep 3 · Forks"
              onBack={() => setStep('home')}
              minimal
            />
          )}
        </TVChrome>
        <RestartBtn onClick={reset} />
      </div>
    </div>
  );
}

/* ─── DETAIL SCREEN ─── */
function DetailScreen({ data, onBack, onPlay }) {
  return (
    <div className="screen col gap-20" style={{ height: '100%', maxWidth: 1100, justifyContent: 'center' }}>
      <button
        onClick={onBack}
        style={{
          alignSelf: 'flex-start',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          fontFamily: 'var(--f-mono)',
          fontSize: 11,
          letterSpacing: '0.16em',
          color: 'var(--t3)',
          textTransform: 'uppercase',
        }}
      >
        ← Volver
      </button>

      <div className="row gap-32" style={{ alignItems: 'flex-start' }}>
        <Poster img={data.img} src={data.cover} imgStyle={{ objectPosition: 'center 25%' }} style={{ width: 280, height: 380, borderRadius: 16, flexShrink: 0 }} />

        <div className="col gap-16 flex-1" style={{ paddingTop: 8 }}>
          <div className="row gap-10" style={{ alignItems: 'center' }}>
            <span className="badge badge-neon"><span className="badge-dot"></span>Alta afinidad</span>
            <span style={{ fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--t3)', letterSpacing: '0.14em' }}>
              ★ {data.rating} · {data.year} · {data.genre} · {data.tone}
            </span>
          </div>

          <h1 className="h-title" style={{ fontSize: 76 }}>{data.title}</h1>

          <div className="row gap-8" style={{ flexWrap: 'wrap' }}>
            <span className="chip">{data.season}</span>
            <span className="chip">{data.episode}</span>
            <span className="chip">⏱ {data.duration}</span>
            <span className="chip">{data.platform}</span>
          </div>

          <p style={{ fontSize: 16, color: 'var(--t2)', lineHeight: 1.6, maxWidth: 600 }}>
            {data.synopsis}
          </p>

          <div className="row gap-10" style={{ marginTop: 6 }}>
            <button className="btn btn-primary btn-lg" onClick={onPlay}>
              <Icon.Play size={18} /> Reproducir
            </button>
            <button className="btn btn-secondary btn-lg">
              <Icon.Spark size={16} /> Por qué te lo sugiero
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── DECIDÍ POR MÍ — loading + transition ─── */
function DecideForMeScreen({ onDone }) {
  const [n, setN] = useState(0);
  const steps = [
    'Leyendo contexto · 22:14 · Miércoles',
    'Cruzando catálogos de 2 plataformas',
    'Filtrando por tiempo disponible · ~45 min',
    'Ranking por afinidad histórica',
    'Match encontrado · The Bear S2 E7',
  ];
  useEffect(() => {
    const it = setInterval(() => {
      setN((x) => {
        if (x >= steps.length) { clearInterval(it); setTimeout(onDone, 600); return x; }
        return x + 1;
      });
    }, 580);
    return () => clearInterval(it);
  // eslint-disable-next-line
  }, []);

  return (
    <div className="screen screen-center">
      <div className="tv-glow-floor"></div>

      <div
        style={{
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'radial-gradient(50% 50% at 50% 50%, rgba(200,241,53,0.28), rgba(200,241,53,0.06) 60%, transparent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <div className="spark-spin" style={{ color: 'var(--neon)' }}>
          <Icon.Spark size={72} />
        </div>
      </div>

      <div className="h-eyebrow" style={{ marginTop: 8 }}>◆ Modo IA · Selección automática</div>
      <h2 className="h-title md" style={{ fontSize: 40 }}>Decidí por mí</h2>
      <p className="h-sub" style={{ maxWidth: 480 }}>
        Eligiendo el contenido perfecto para vos en este momento
      </p>

      <div
        className="col gap-6"
        style={{
          minWidth: 460,
          marginTop: 6,
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 'var(--r-lg)',
          padding: '12px 16px',
          textAlign: 'left',
        }}
      >
        {steps.map((l, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              opacity: i < n ? 1 : 0.25,
              transition: 'opacity .4s ease',
              fontFamily: 'var(--f-mono)',
              fontSize: 11,
              color: i < n ? 'var(--t1)' : 'var(--t3)',
              letterSpacing: '0.06em',
            }}
          >
            <span style={{ color: i < n ? 'var(--neon)' : 'var(--t4)' }}>
              {i < n ? <Icon.Check size={12} /> : '•'}
            </span>
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── VOICE: Escuchando ─── */
function VoiceListenScreen({ onCaptured, onCancel }) {
  useEffect(() => {
    const t = setTimeout(onCaptured, 2600);
    return () => clearTimeout(t);
  }, [onCaptured]);

  return (
    <div className="screen screen-center">
      <div className="tv-glow-floor"></div>

      <div className="mic-orb">
        <div className="mic-core" style={{ color: '#0B0C0E' }}>
          <Icon.Mic size={32} />
        </div>
      </div>

      <h2 className="h-title md" style={{ fontSize: 44, marginTop: 8 }}>Escuchando…</h2>
      <p className="h-sub">Hablá ahora, te escucho</p>

      <div className="row gap-4" style={{ height: 28, alignItems: 'center', marginTop: 4 }}>
        {[5, 12, 8, 22, 18, 28, 16, 24, 10, 6].map((h, i) => (
          <div
            key={i}
            style={{
              width: 4,
              height: h,
              background: 'var(--neon)',
              borderRadius: 2,
              animation: `voiceBar 1s ${i * 0.08}s ease-in-out infinite alternate`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes voiceBar { from { transform: scaleY(0.4); } to { transform: scaleY(1.6); } }
      `}</style>

      <button className="btn btn-ghost btn-md" onClick={onCancel} style={{ marginTop: 16 }}>
        Cancelar
      </button>
    </div>
  );
}

/* ─── VOICE: Dijiste ─── */
function VoiceSaidScreen({ onConfirm, onRetry, instant = false }) {
  // simulated transcription with delay → auto-confirm
  const phrase = 'Algo liviano, máximo 30 min';
  const [shown, setShown] = useState(instant ? phrase : '');
  useEffect(() => {
    if (instant) return;
    let i = 0;
    const it = setInterval(() => {
      i++;
      setShown(phrase.slice(0, i));
      if (i >= phrase.length) { clearInterval(it); setTimeout(onConfirm, 1200); }
    }, 50);
    return () => clearInterval(it);
  // eslint-disable-next-line
  }, []);

  return (
    <div className="screen screen-center">
      <div className="tv-glow-floor"></div>

      <div className="h-eyebrow">◆ Te entendí</div>
      <h2 className="h-title md" style={{ fontSize: 28 }}>Dijiste...</h2>

      <div
        style={{
          fontFamily: 'var(--f-display)',
          fontSize: 60,
          fontWeight: 700,
          color: 'var(--t0)',
          letterSpacing: '-0.01em',
          maxWidth: 880,
          textAlign: 'center',
          lineHeight: 1.1,
          padding: '0 32px',
          minHeight: 130,
        }}
      >
        "{shown}<span style={{ color: 'var(--neon)', animation: 'blink 1s steps(2) infinite' }}>|</span>"
      </div>

      <div className="row gap-10" style={{ marginTop: 8 }}>
        <button className="btn btn-ghost btn-md" onClick={onRetry}>Intentar de nuevo</button>
      </div>
    </div>
  );
}

/* ─── VOICE: Resultados ─── */
function VoiceResultsScreen({ onBack, onPlay }) {
  const C = (typeof COVERS !== 'undefined') ? COVERS : {};
  const results = [
    { title: 'Ted Lasso', meta: 'Comedia · 28 min · 93% match', why: 'Tono ligero · Encaja en 30 min', img: C.tedlasso, pos: 'center 18%' },
    { title: 'Abbott Elementary', meta: 'Comedia · 22 min · 89% match', why: 'Mood relax · Sin tensión', img: C.abbott, pos: 'center 20%' },
    { title: 'The Good Place', meta: 'Comedia · 24 min · 86% match', why: 'Liviano, episódico', img: C.goodplace, pos: 'center' },
  ];

  return (
    <div className="screen col gap-20" style={{ height: '100%', maxWidth: 1080, justifyContent: 'center' }}>
      <div className="col gap-6">
        <div className="h-eyebrow">◆ Resultado de tu voz · 3 matches</div>
        <h2 className="h-title md" style={{ fontSize: 40 }}>Hago foco en lo liviano · &lt;30 min</h2>
        <div className="h-meta">"Algo liviano, máximo 30 min"</div>
      </div>

      <div className="col gap-10">
        {results.map((r, i) => (
          <button
            key={r.title}
            onClick={i === 0 ? onPlay : undefined}
            className={`card ${i === 0 ? 'focus' : ''}`}
            style={{ display: 'flex', alignItems: 'center', gap: 18, padding: 16, textAlign: 'left' }}
          >
            <div
              style={{
                fontFamily: 'var(--f-mono)',
                fontSize: 11,
                letterSpacing: '0.18em',
                color: i === 0 ? 'var(--neon)' : 'var(--t3)',
                width: 30,
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </div>
            <Poster img={r.img} src={r.title} imgStyle={{ objectPosition: r.pos }} style={{ width: 96, height: 96, borderRadius: 12 }} />
            <div className="flex-1 col gap-4">
              <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--t1)', fontFamily: 'var(--f-display)', textTransform: 'uppercase', letterSpacing: '0.01em' }}>
                {r.title}
              </div>
              <div className="h-meta">{r.meta}</div>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <span className="chip neon" style={{ padding: '4px 10px', fontSize: 10 }}>
                  <Icon.Spark size={11} /> {r.why}
                </span>
              </div>
            </div>
            {i === 0 ? (
              <div className="btn btn-primary btn-md" style={{ pointerEvents: 'none' }}>
                <Icon.Play size={14} /> Reproducir
              </div>
            ) : (
              <Icon.Play size={20} />
            )}
          </button>
        ))}
      </div>

      <div className="row gap-10">
        <button className="btn btn-ghost btn-md" onClick={onBack}>Volver al inicio</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   PLAYBACK (shared between flow B and C)
═══════════════════════════════════════════════════ */
function PlaybackScreen({ title = 'The Bear', meta = 'S2 · Ep 7 · Forks', img, onBack, onEnd, minimal = false }) {
  const [playing, setPlaying] = useState(true);
  const [t, setT] = useState(0);
  const total = 44 * 60;
  const [showControls, setShowControls] = useState(true);
  const lastActive = useRef(Date.now());
  const bump = () => { lastActive.current = Date.now(); setShowControls(true); };

  useEffect(() => {
    if (!playing) return;
    const it = setInterval(() => {
      setT((x) => {
        if (x + 18 >= total) {
          clearInterval(it);
          if (onEnd) setTimeout(() => onEnd(), 0);
          return total;
        }
        return x + 18;
      });
    }, 200);
    return () => clearInterval(it);
  }, [playing, total, onEnd]);

  useEffect(() => {
    const check = setInterval(() => {
      if (Date.now() - lastActive.current > 3500) {
        setShowControls((v) => (v ? false : v));
      }
    }, 500);
    return () => clearInterval(check);
  }, []);

  const fmt = (s) => {
    const m = Math.floor(s / 60);
    const ss = String(Math.floor(s % 60)).padStart(2, '0');
    return `${String(m).padStart(2, '0')}:${ss}`;
  };

  return (
    <div
      className="screen"
      onMouseMove={bump}
      onClick={bump}
      style={{ position: 'absolute', inset: '-56px 0 0 0', display: 'block', cursor: 'pointer' }}
    >
      {/* Full-bleed poster as 'video' */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <Poster
          img={img}
          src={`${title} · Reproducción`}
          style={{ width: '100%', height: '100%', borderRadius: 0, border: 'none' }}
        >
          {/* Center glow when playing */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(50% 50% at 50% 50%, rgba(200,241,53,0.10), transparent 70%)',
              pointerEvents: 'none',
            }}
          />
        </Poster>
        {/* dim overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} />
      </div>

      {/* CONTROLS */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: showControls ? 1 : 0,
          transition: 'opacity .3s ease',
          pointerEvents: showControls ? 'auto' : 'none',
        }}
      >
        {/* TOP BAR */}
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            padding: '20px 32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)',
            zIndex: 5,
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); onBack && onBack(); }}
            className="btn btn-secondary btn-md"
          >
            <Icon.Close size={14} /> Salir
          </button>
          <div className="row gap-8">
            <button className="btn-icon-circle btn">
              <Icon.Sub size={18} />
            </button>
            <button className="btn-icon-circle btn">
              <Icon.Settings size={18} />
            </button>
          </div>
        </div>

        {/* CENTER PLAY/PAUSE big */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 4,
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setPlaying((p) => !p); }}
            style={{
              width: 110,
              height: 110,
              borderRadius: '50%',
              background: 'rgba(200,241,53,0.95)',
              color: '#0B0C0E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 60px var(--neon-glow)',
              cursor: 'pointer',
            }}
          >
            {playing ? <Icon.Pause size={36} /> : <Icon.Play size={36} />}
          </button>
        </div>

        {/* BOTTOM BAR */}
        <div
          style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            padding: '24px 32px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)',
            zIndex: 5,
          }}
        >
          <div className="row" style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div className="col gap-4">
              <div className="h-eyebrow muted">{meta}</div>
              <div className="h-title md" style={{ fontSize: 32 }}>{title}</div>
            </div>
            <div className="row gap-8">
              <button className="btn-icon-circle btn" onClick={(e) => { e.stopPropagation(); setT(Math.max(0, t - 30)); }}>
                <Icon.SkipBack size={20} />
              </button>
              <button className="btn-icon-circle btn" onClick={(e) => { e.stopPropagation(); setT(Math.min(total, t + 30)); }}>
                <Icon.SkipFwd size={20} />
              </button>
              <button className="btn-icon-circle btn">
                <Icon.Volume size={20} />
              </button>
            </div>
          </div>

          <div className="progress">
            <i style={{ width: `${(t / total) * 100}%` }} />
          </div>
          <div className="row" style={{ justifyContent: 'space-between', fontFamily: 'var(--f-mono)', fontSize: 11, color: 'var(--t2)', letterSpacing: '0.06em' }}>
            <span>{fmt(t)}</span>
            <span>−{fmt(total - t)}</span>
          </div>

          {!minimal && (
            <div style={{ marginTop: 6 }}>
              <button
                className="btn btn-neon-ghost btn-sm"
                onClick={(e) => { e.stopPropagation(); setT(total - 30); }}
              >
                <Icon.SkipFwd size={12} /> Saltar al final
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  FlowB,
  FLOW_B_STEPS,
  PlaybackScreen,
  DetailScreen,
  DecideForMeScreen,
  VoiceListenScreen,
  VoiceSaidScreen,
  VoiceResultsScreen,
});
