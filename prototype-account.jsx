/* global React, Icon, Poster, PLATFORMS */
const { useState, useEffect } = React;

/* ═══════════════════════════════════════════════════════════════
   CUENTA · Personalizar perfil + Configuración + menú de perfil
═══════════════════════════════════════════════════════════════ */

/* Avatares tipo Netflix — mascotas sobre tiles de color */
const PETS = [
  { id: 'dog',     emoji: '🐶', bg: '#E8743B' },
  { id: 'cat',     emoji: '🐱', bg: '#4F8EF7' },
  { id: 'fox',     emoji: '🦊', bg: '#E0533D' },
  { id: 'panda',   emoji: '🐼', bg: '#3A3F50' },
  { id: 'koala',   emoji: '🐨', bg: '#7C8DA6' },
  { id: 'lion',    emoji: '🦁', bg: '#D99A2B' },
  { id: 'frog',    emoji: '🐸', bg: '#4FA86A' },
  { id: 'penguin', emoji: '🐧', bg: '#2C3E50' },
  { id: 'rabbit',  emoji: '🐰', bg: '#C77DA0' },
  { id: 'tiger',   emoji: '🐯', bg: '#E0822B' },
];

const GENRES = ['Drama', 'Comedia', 'Sci-Fi', 'Thriller', 'Documental', 'Animación', 'Acción', 'Romance'];

/* ─── Menú desplegable de perfil (anclado arriba a la derecha) ─── */
function ProfileMenu({ name, petEmoji, initials, onPersonalize, onSettings, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{ position: 'absolute', inset: 0, zIndex: 90 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          top: 8,
          right: 24,
          width: 320,
          background: 'rgba(22,24,31,0.98)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 16,
          boxShadow: '0 24px 70px rgba(0,0,0,0.55)',
          padding: 14,
        }}
      >
        {/* header */}
        <div className="row gap-12" style={{ alignItems: 'center', padding: '6px 8px 14px' }}>
          <div
            style={{
              width: 48, height: 48, borderRadius: '50%',
              background: petEmoji ? 'rgba(255,255,255,0.06)' : 'var(--neon-dim)',
              border: '1.5px solid rgba(200,241,53,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: petEmoji ? 26 : 16,
              fontFamily: 'var(--f-display)', fontWeight: 800, color: 'var(--neon)',
            }}
          >
            {petEmoji || initials}
          </div>
          <div className="col gap-2">
            <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--t1)' }}>{name}</div>
            <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.12em', color: 'var(--neon)', textTransform: 'uppercase' }}>
              ◆ Perfil activo
            </div>
          </div>
        </div>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '0 -14px 10px' }} />

        {/* options */}
        <button className="menu-row" onClick={onPersonalize}>
          <span className="menu-ico"><Icon.User size={18} /></span>
          <div className="flex-1 col" style={{ gap: 2, textAlign: 'left' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--t1)' }}>Personalizar perfil</span>
            <span style={{ fontSize: 11, color: 'var(--t3)' }}>Avatar, nombre y preferencias</span>
          </div>
          <Icon.Chevron size={16} />
        </button>

        <button className="menu-row" onClick={onSettings}>
          <span className="menu-ico"><Icon.Settings size={18} /></span>
          <div className="flex-1 col" style={{ gap: 2, textAlign: 'left' }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--t1)' }}>Configuración</span>
            <span style={{ fontSize: 11, color: 'var(--t3)' }}>Plataformas, privacidad y cuenta</span>
          </div>
          <Icon.Chevron size={16} />
        </button>

        <button className="menu-row" onClick={onClose}>
          <span className="menu-ico"><Icon.Refresh size={16} /></span>
          <span className="flex-1" style={{ fontSize: 14, fontWeight: 600, color: 'var(--t2)', textAlign: 'left' }}>
            Cambiar de perfil
          </span>
          <Icon.Chevron size={16} />
        </button>
      </div>
    </div>
  );
}

/* ─── Pantalla · Personalizar perfil ─── */
function PersonalizeProfileScreen({
  name, setName, petId, setPetId, prefs, togglePref, onBack, onSave,
}) {
  const selected = PETS.find((p) => p.id === petId) || PETS[0];

  return (
    <div className="screen col" style={{ height: '100%', width: '100%', maxWidth: 1080, justifyContent: 'center', gap: 18 }}>
      <button onClick={onBack} className="back-link">← Volver al inicio</button>

      <div className="col gap-4">
        <div className="h-eyebrow">◆ Tu perfil · Elena</div>
        <h1 className="h-title md" style={{ fontSize: 38 }}>Personalizar perfil</h1>
      </div>

      <div className="row gap-32" style={{ alignItems: 'flex-start' }}>
        {/* left — preview + name */}
        <div className="col gap-16" style={{ flex: '0 0 240px' }}>
          <div
            style={{
              width: 240, height: 240, borderRadius: 20,
              background: selected.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 120,
              boxShadow: '0 14px 50px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08) inset',
            }}
          >
            {selected.emoji}
          </div>
          <div className="col gap-8">
            <label className="field-label">Nombre del perfil</label>
            <div className="input-field focused" style={{ height: 50 }}>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontFamily: 'var(--f-body)', fontSize: 17, color: 'var(--t1)' }}
              />
              <Icon.Edit size={16} />
            </div>
          </div>
        </div>

        {/* right — avatar grid + prefs */}
        <div className="col gap-18 flex-1">
          <div className="col gap-10">
            <label className="field-label">Elegí tu avatar</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
              {PETS.map((p) => {
                const on = p.id === petId;
                return (
                  <button
                    key={p.id}
                    onClick={() => setPetId(p.id)}
                    style={{
                      aspectRatio: '1', borderRadius: 14, background: p.bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 34,
                      border: on ? '2.5px solid var(--neon)' : '2.5px solid transparent',
                      boxShadow: on ? '0 0 0 3px var(--neon-dim), 0 0 24px var(--neon-glow)' : 'none',
                      transform: on ? 'scale(1.04)' : 'none',
                      transition: 'all .15s ease',
                      position: 'relative',
                    }}
                  >
                    {p.emoji}
                    {on && (
                      <span style={{ position: 'absolute', top: 5, right: 5, width: 18, height: 18, borderRadius: '50%', background: 'var(--neon)', color: '#0B0C0E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon.Check size={11} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="col gap-10">
            <label className="field-label">Preferencias · géneros favoritos</label>
            <div className="row" style={{ flexWrap: 'wrap', gap: 8 }}>
              {GENRES.map((g) => {
                const on = prefs.includes(g);
                return (
                  <button
                    key={g}
                    onClick={() => togglePref(g)}
                    className={`pref-chip ${on ? 'on' : ''}`}
                  >
                    {on && <Icon.Check size={13} />}
                    {g}
                  </button>
                );
              })}
            </div>
            <div style={{ fontFamily: 'var(--f-mono)', fontSize: 10, letterSpacing: '0.12em', color: 'var(--t4)', textTransform: 'uppercase', marginTop: 2 }}>
              ◆ La IA usa estas preferencias para afinar tus recomendaciones
            </div>
          </div>
        </div>
      </div>

      <div className="row gap-12" style={{ justifyContent: 'flex-end' }}>
        <button className="btn btn-ghost btn-lg" onClick={onBack}>Cancelar</button>
        <button className="btn btn-primary btn-lg" onClick={onSave}>
          <Icon.Check size={16} /> Guardar cambios
        </button>
      </div>
    </div>
  );
}

/* ─── Pantalla · Configuración de la cuenta ─── */
function AccountSettingsScreen({ apps, togglePlatform, privacy, togglePrivacy, onBack, onSave }) {
  const platforms = (typeof PLATFORMS !== 'undefined' ? PLATFORMS : []);
  const privacyItems = [
    { id: 'usage', label: 'Compartir datos de uso', sub: 'Mejora las recomendaciones de la IA' },
    { id: 'history', label: 'Guardar historial de reproducción', sub: 'Para retomar y sugerir continuidad' },
    { id: 'autodetect', label: 'Detección automática de contexto', sub: 'Hora, mood y tiempo disponible' },
  ];

  return (
    <div className="screen col" style={{ height: '100%', width: '100%', maxWidth: 1080, justifyContent: 'center', gap: 16 }}>
      <button onClick={onBack} className="back-link">← Volver al inicio</button>

      <div className="col gap-4">
        <div className="h-eyebrow">◆ Cuenta · Elena</div>
        <h1 className="h-title md" style={{ fontSize: 38 }}>Configuración</h1>
      </div>

      <div className="row gap-24" style={{ alignItems: 'flex-start' }}>
        {/* PLATAFORMAS */}
        <div className="settings-card flex-1">
          <div className="row gap-10" style={{ alignItems: 'center', marginBottom: 14 }}>
            <span style={{ color: 'var(--neon)' }}><Icon.Chip size={18} /></span>
            <div className="h-meta" style={{ color: 'var(--t1)' }}>Plataformas conectadas</div>
            <span className="flex-1" />
            <span className="chip neon" style={{ fontSize: 10 }}>{apps.length} activas</span>
          </div>

          <div className="col gap-8" style={{ maxHeight: 320, overflow: 'hidden' }}>
            {platforms.slice(0, 6).map((p) => {
              const on = apps.includes(p.id);
              return (
                <div key={p.id} className="platform-row">
                  <div style={{ width: 38, height: 38, borderRadius: 9, background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0, opacity: on ? 1 : 0.5 }}>
                    <img src={p.logo} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 5 }} />
                  </div>
                  <span className="flex-1" style={{ fontSize: 14, fontWeight: 600, color: on ? 'var(--t1)' : 'var(--t3)' }}>{p.name}</span>
                  <Toggle on={on} onClick={() => togglePlatform(p.id)} />
                </div>
              );
            })}
          </div>

          <button className="add-platform" onClick={() => togglePlatform(platforms[6]?.id)}>
            <Icon.Plus size={16} /> Agregar plataforma
          </button>
        </div>

        {/* PRIVACIDAD + GENERAL */}
        <div className="col gap-16" style={{ flex: '0 0 420px' }}>
          <div className="settings-card">
            <div className="row gap-10" style={{ alignItems: 'center', marginBottom: 12 }}>
              <span style={{ color: 'var(--neon)' }}><Icon.Shield size={18} /></span>
              <div className="h-meta" style={{ color: 'var(--t1)' }}>Privacidad</div>
            </div>
            <div className="col gap-10">
              {privacyItems.map((it) => (
                <div key={it.id} className="privacy-row">
                  <div className="flex-1 col gap-2">
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--t1)' }}>{it.label}</span>
                    <span style={{ fontSize: 11, color: 'var(--t3)' }}>{it.sub}</span>
                  </div>
                  <Toggle on={privacy.includes(it.id)} onClick={() => togglePrivacy(it.id)} />
                </div>
              ))}
            </div>
          </div>

          <div className="settings-card">
            <div className="row gap-10" style={{ alignItems: 'center', marginBottom: 12 }}>
              <span style={{ color: 'var(--neon)' }}><Icon.Globe size={18} /></span>
              <div className="h-meta" style={{ color: 'var(--t1)' }}>General</div>
            </div>
            <div className="col gap-8">
              <div className="general-row"><span className="flex-1">Idioma</span><span className="gen-val">Español <Icon.Chevron size={14} /></span></div>
              <div className="general-row"><span className="flex-1">Calidad de reproducción</span><span className="gen-val">Auto · 4K <Icon.Chevron size={14} /></span></div>
              <div className="general-row"><span className="flex-1">Notificaciones</span><Toggle on onClick={() => {}} /></div>
            </div>
          </div>
        </div>
      </div>

      <div className="row gap-12" style={{ justifyContent: 'flex-end' }}>
        <button className="btn btn-ghost btn-lg" onClick={onBack}>Cancelar</button>
        <button className="btn btn-primary btn-lg" onClick={onSave}>
          <Icon.Check size={16} /> Guardar
        </button>
      </div>
    </div>
  );
}

/* ─── Toggle switch ─── */
function Toggle({ on, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: 46, height: 26, borderRadius: 100, flexShrink: 0,
        background: on ? 'var(--neon)' : 'rgba(255,255,255,0.12)',
        border: on ? 'none' : '1px solid rgba(255,255,255,0.14)',
        position: 'relative', transition: 'background .2s ease', cursor: 'pointer',
      }}
    >
      <span
        style={{
          position: 'absolute', top: 3, left: on ? 23 : 3,
          width: 20, height: 20, borderRadius: '50%',
          background: on ? '#0B0C0E' : '#EDF0F7',
          transition: 'left .2s ease',
          boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }}
      />
    </button>
  );
}

Object.assign(window, {
  ProfileMenu,
  PersonalizeProfileScreen,
  AccountSettingsScreen,
  PETS,
  GENRES,
});
