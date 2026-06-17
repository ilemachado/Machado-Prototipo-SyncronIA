/* global React */
const { useState, useEffect, useRef, useMemo } = React;

/* ═══════════════════════════════════════════════════
   SHARED TV UI PRIMITIVES
═══════════════════════════════════════════════════ */

function TVChrome({ children, time = '22:14', profileInitial, profileAvatar, hideStatus = false, onProfileClick }) {
  const clickable = !!onProfileClick;
  return (
    <div className="tv">
      {!hideStatus && (
        <div className="tv-statusbar">
          <div className="sb-time">
            <span className="sb-dot"></span>
            <span>{time} · Miércoles</span>
          </div>
          <div className="sb-mark">SYNCRON<span>IA</span></div>
          {profileInitial ? (
            <button
              className={`sb-profile ${clickable ? 'is-clickable' : ''}`}
              onClick={onProfileClick}
              style={{ background: 'none', border: 'none', padding: 0, cursor: clickable ? 'pointer' : 'default' }}
            >
              <span style={{ fontSize: 10, letterSpacing: '0.14em', color: 'var(--t3)' }}>
                Perfil
              </span>
              <span className="tv-profile-pill">
                {profileAvatar ? <span style={{ fontSize: 16 }}>{profileAvatar}</span> : profileInitial}
              </span>
            </button>
          ) : (
            <div className="sb-profile">
              <span style={{ fontSize: 10, letterSpacing: '0.14em', color: 'var(--t4)' }}>
                Sin perfil
              </span>
            </div>
          )}
        </div>
      )}
      <div className="tv-stage">{children}</div>
    </div>
  );
}

/* ─── Poster · real image with placeholder fallback ─── */
function Poster({ title, src, img, style, className = '', children, imgStyle }) {
  return (
    <div className={`poster ${className}`} style={style}>
      {img ? (
        <img
          src={img}
          alt={title || src || ''}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', ...imgStyle }}
        />
      ) : (
        <>
          <svg className="poster-svg" viewBox="0 0 64 64" fill="none">
            <circle cx="22" cy="24" r="10" stroke="currentColor" strokeWidth="2" />
            <path
              d="M4 60 L24 36 L42 54 L54 42 L60 48 L60 60 Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          <div className="poster-label">{src || title}</div>
        </>
      )}
      {children}
    </div>
  );
}

/* ─── Icons (Stroke 1.5px) ─── */
const Icon = {
  Wifi: (p) => (
    <svg width={p.size || 22} height={p.size || 22} viewBox="0 0 28 28" fill="none"
         stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5a15 15 0 0 1 22 0" />
      <path d="M6.5 13a10 10 0 0 1 15 0" />
      <path d="M10 16.5a5 5 0 0 1 8 0" />
      <circle cx="14" cy="21" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  Lock: (p) => (
    <svg width={p.size || 14} height={p.size || 14} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  ),
  Check: (p) => (
    <svg width={p.size || 16} height={p.size || 16} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12l5 5 9-11" />
    </svg>
  ),
  Chevron: (p) => (
    <svg width={p.size || 16} height={p.size || 16} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 6l6 6-6 6" />
    </svg>
  ),
  Play: (p) => (
    <svg width={p.size || 18} height={p.size || 18} viewBox="0 0 24 24" fill="currentColor">
      <path d="M7 4.5v15l13-7.5z" />
    </svg>
  ),
  Pause: (p) => (
    <svg width={p.size || 18} height={p.size || 18} viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4.5" width="4" height="15" rx="1" />
      <rect x="14" y="4.5" width="4" height="15" rx="1" />
    </svg>
  ),
  SkipFwd: (p) => (
    <svg width={p.size || 18} height={p.size || 18} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 5v14l10-7z" />
      <rect x="16" y="5" width="3" height="14" rx="1" />
    </svg>
  ),
  SkipBack: (p) => (
    <svg width={p.size || 18} height={p.size || 18} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 5v14L10 12z" />
      <rect x="5" y="5" width="3" height="14" rx="1" />
    </svg>
  ),
  Mic: (p) => (
    <svg width={p.size || 28} height={p.size || 28} viewBox="0 0 28 28" fill="none"
         stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="10" y="4" width="8" height="13" rx="4" />
      <path d="M6 16a8 8 0 0 0 16 0" />
      <line x1="14" y1="24" x2="14" y2="20" />
    </svg>
  ),
  Spark: (p) => (
    <svg width={p.size || 22} height={p.size || 22} viewBox="0 0 28 28" fill="none">
      <path d="M14 4 L15.5 12 L23 14 L15.5 16 L14 24 L12.5 16 L5 14 L12.5 12 Z"
            fill="currentColor" opacity="0.95" />
      <path d="M22 5 L22.8 8.2 L26 9 L22.8 9.8 L22 13 L21.2 9.8 L18 9 L21.2 8.2 Z"
            fill="currentColor" opacity="0.55" />
    </svg>
  ),
  Volume: (p) => (
    <svg width={p.size || 18} height={p.size || 18} viewBox="0 0 28 28" fill="none"
         stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="6,11 11,11 16,7 16,21 11,17 6,17" />
      <path d="M19 11.5a5 5 0 0 1 0 5" />
      <path d="M21.5 9a9 9 0 0 1 0 10" />
    </svg>
  ),
  Settings: (p) => (
    <svg width={p.size || 18} height={p.size || 18} viewBox="0 0 28 28" fill="none"
         stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="14" cy="14" r="3.5" />
      <path d="M14 4v3M14 21v3M4 14h3M21 14h3M6.5 6.5l2 2M19.5 19.5l2 2M6.5 21.5l2-2M19.5 8.5l2-2" />
    </svg>
  ),
  Sub: (p) => (
    <svg width={p.size || 18} height={p.size || 18} viewBox="0 0 28 28" fill="none"
         stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="6" width="20" height="16" rx="3" />
      <path d="M8 16h4M14 16h6M8 12h4M14 12h6" />
    </svg>
  ),
  Close: (p) => (
    <svg width={p.size || 18} height={p.size || 18} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  ),
  ArrowR: (p) => (
    <svg width={p.size || 18} height={p.size || 18} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M14 6l6 6-6 6" />
    </svg>
  ),
  Refresh: (p) => (
    <svg width={p.size || 14} height={p.size || 14} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  ),
  User: (p) => (
    <svg width={p.size || 18} height={p.size || 18} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  ),
  Edit: (p) => (
    <svg width={p.size || 16} height={p.size || 16} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20h4L19 9l-4-4L4 16z" />
      <path d="M14 6l4 4" />
    </svg>
  ),
  Plus: (p) => (
    <svg width={p.size || 16} height={p.size || 16} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Shield: (p) => (
    <svg width={p.size || 18} height={p.size || 18} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  Bell: (p) => (
    <svg width={p.size || 18} height={p.size || 18} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  ),
  Trash: (p) => (
    <svg width={p.size || 16} height={p.size || 16} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13h10l1-13" />
    </svg>
  ),
  Globe: (p) => (
    <svg width={p.size || 18} height={p.size || 18} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
    </svg>
  ),
  Chip: (p) => (
    <svg width={p.size || 18} height={p.size || 18} viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="7" y="7" width="10" height="10" rx="2" />
      <path d="M10 3v2M14 3v2M10 19v2M14 19v2M3 10h2M3 14h2M19 10h2M19 14h2" />
    </svg>
  ),
};

/* ─── Flow rail (top of artboard, jump-to-step indicator) ─── */
function FlowRail({ label, steps, current, onJump }) {
  return (
    <div className="flow-rail">
      <span className="lbl">{label}</span>
      <span className="sep">·</span>
      {steps.map((s, i) => (
        <React.Fragment key={s.id}>
          {i > 0 && <span className="sep">›</span>}
          <button
            className={`step ${current === s.id ? 'on' : ''}`}
            onClick={() => onJump(s.id)}
          >
            {String(i + 1).padStart(2, '0')} · {s.label}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}

/* ─── Restart button (overlays bottom-right of TV) ─── */
function RestartBtn({ onClick, label = 'Reiniciar flujo' }) {
  return (
    <button className="restart-btn" onClick={onClick}>
      <Icon.Refresh size={12} />
      <span>{label}</span>
    </button>
  );
}

/* ─── Modal scrim (used for "A continuación") ─── */
function ModalScrim({ children, onClose }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 80,
        background: 'rgba(11,12,14,0.78)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'screenFade 280ms ease both',
      }}
    >
      {children}
    </div>
  );
}

/* ─── Shared cover image map (real assets) ─── */
const COVERS = {
  bear: 'assets/the-bear.webp',
  severance: 'assets/severance.jpg',
  tedlasso: 'assets/tedlasso.jpg',
  abbott: 'assets/abbott.jpg',
  goodplace: 'assets/thegoodplace.png',
};

Object.assign(window, {
  TVChrome,
  Poster,
  Icon,
  FlowRail,
  RestartBtn,
  ModalScrim,
  COVERS,
});
