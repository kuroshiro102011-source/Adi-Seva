import { useState, useEffect } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'

// TODO: paste your free Gemini key from https://aistudio.google.com
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''

const categories = [
  { id: 'drainage', icon: '💧', label: 'Drainage', color: '#3b82f6' },
  { id: 'streetlight', icon: '💡', label: 'Street Light', color: '#f59e0b' },
  { id: 'waterleak', icon: '🚰', label: 'Water Leak', color: '#06b6d4' },
  { id: 'powergrid', icon: '⚡', label: 'Power Grid', color: '#eab308' },
  { id: 'other', icon: '⚠️', label: 'Other Issues', color: '#a855f7' },
]

const LEVELS = [
  { level: 1, name: 'Rookie Citizen', xpRequired: 0, color: '#94a3b8' },
  { level: 2, name: 'Community Scout', xpRequired: 100, color: '#22d3ee' },
  { level: 3, name: 'Civic Guardian', xpRequired: 250, color: '#a855f7' },
  { level: 4, name: 'City Hero', xpRequired: 500, color: '#f59e0b' },
  { level: 5, name: 'Nagrik Champion', xpRequired: 1000, color: '#22c55e' },
]

function getLevel(xp) {
  let current = LEVELS[0]
  for (const l of LEVELS) {
    if (xp >= l.xpRequired) current = l
  }
  return current
}

function getNextLevel(xp) {
  for (const l of LEVELS) {
    if (xp < l.xpRequired) return l
  }
  return null
}

// ===================== KURO - BLACK MAINE COON CAT SVG =====================
function KuroSVG({ mood = 'idle', level = 1, sparkle = false }) {
  const accessories = {
    bow: level >= 2,
    headset: level >= 3,
    cape: level >= 4,
    glow: level >= 5,
  }

  const eyes = {
    idle: (
      <>
        {/* Dual colored eyes: outer gold ring, inner purple */}
        <ellipse cx="36" cy="52" rx="6" ry="5.5" fill="#f5a623"/>
        <ellipse cx="64" cy="52" rx="6" ry="5.5" fill="#f5a623"/>
        <ellipse cx="36" cy="52" rx="4" ry="4" fill="#7c3aed"/>
        <ellipse cx="64" cy="52" rx="4" ry="4" fill="#7c3aed"/>
        <ellipse cx="36" cy="52" rx="2" ry="2.5" fill="#1a0a2e"/>
        <ellipse cx="64" cy="52" rx="2" ry="2.5" fill="#1a0a2e"/>
        <ellipse cx="35" cy="51" rx="1" ry="1" fill="white" opacity="0.9"/>
        <ellipse cx="63" cy="51" rx="1" ry="1" fill="white" opacity="0.9"/>
        {/* Gold shimmer ring */}
        <ellipse cx="36" cy="52" rx="6" ry="5.5" fill="none" stroke="#ffd700" strokeWidth="0.5" opacity="0.6"/>
        <ellipse cx="64" cy="52" rx="6" ry="5.5" fill="none" stroke="#ffd700" strokeWidth="0.5" opacity="0.6"/>
      </>
    ),
    investigate: (
      <>
        <ellipse cx="36" cy="52" rx="6" ry="4" fill="#f5a623"/>
        <ellipse cx="64" cy="52" rx="6" ry="4" fill="#f5a623"/>
        <ellipse cx="36" cy="52" rx="4" ry="2.5" fill="#7c3aed"/>
        <ellipse cx="64" cy="52" rx="4" ry="2.5" fill="#7c3aed"/>
        <ellipse cx="36" cy="52" rx="1.5" ry="1.5" fill="#1a0a2e"/>
        <ellipse cx="64" cy="52" rx="1.5" ry="1.5" fill="#1a0a2e"/>
        <ellipse cx="35" cy="51" rx="0.8" ry="0.8" fill="white" opacity="0.9"/>
        <ellipse cx="63" cy="51" rx="0.8" ry="0.8" fill="white" opacity="0.9"/>
        {/* Furrowed brows */}
        <line x1="28" y1="44" x2="44" y2="47" stroke="#2d1b69" strokeWidth="2.5" strokeLinecap="round"/>
        <line x1="56" y1="47" x2="72" y2="44" stroke="#2d1b69" strokeWidth="2.5" strokeLinecap="round"/>
      </>
    ),
    clumsy: (
      <>
        <ellipse cx="36" cy="52" rx="7" ry="7" fill="#f5a623"/>
        <ellipse cx="64" cy="52" rx="7" ry="7" fill="#f5a623"/>
        <ellipse cx="36" cy="52" rx="5" ry="5" fill="#7c3aed"/>
        <ellipse cx="64" cy="52" rx="5" ry="5" fill="#7c3aed"/>
        <ellipse cx="36" cy="52" rx="3" ry="3.5" fill="#1a0a2e"/>
        <ellipse cx="64" cy="52" rx="3" ry="3.5" fill="#1a0a2e"/>
        <ellipse cx="34.5" cy="50.5" rx="1.2" ry="1.2" fill="white" opacity="0.9"/>
        <ellipse cx="62.5" cy="50.5" rx="1.2" ry="1.2" fill="white" opacity="0.9"/>
      </>
    ),
    victory: (
      <>
        {/* Happy curved eyes */}
        <path d="M30 52 Q36 45 42 52" stroke="#f5a623" strokeWidth="2.5" fill="#f5a623" opacity="0.3"/>
        <path d="M30 52 Q36 45 42 52" stroke="#f5a623" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M58 52 Q64 45 70 52" stroke="#f5a623" strokeWidth="2.5" fill="#f5a623" opacity="0.3"/>
        <path d="M58 52 Q64 45 70 52" stroke="#f5a623" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        {/* Sparkle in eyes */}
        <text x="36" y="53" fontSize="8" textAnchor="middle" fill="#ffd700">✦</text>
        <text x="64" y="53" fontSize="8" textAnchor="middle" fill="#ffd700">✦</text>
      </>
    ),
  }

  const mouth = {
    idle: <path d="M46 63 Q50 67 54 63" stroke="#9d4e6f" strokeWidth="1.8" fill="none" strokeLinecap="round"/>,
    investigate: <path d="M46 64 Q50 61 54 64" stroke="#9d4e6f" strokeWidth="1.8" fill="none" strokeLinecap="round"/>,
    clumsy: <><path d="M44 65 Q50 71 56 65" stroke="#9d4e6f" strokeWidth="2" fill="none" strokeLinecap="round"/><ellipse cx="50" cy="68" rx="4" ry="2" fill="#c46e8a" opacity="0.5"/></>,
    victory: <path d="M43 63 Q50 70 57 63" stroke="#9d4e6f" strokeWidth="2.5" fill="none" strokeLinecap="round"/>,
  }

  const bodyAnim = {
    idle: '',
    investigate: 'kuroInvestigate',
    clumsy: 'kuroClumsy',
    victory: 'kuroVictory',
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <style>{`
        @keyframes kuroInvestigate { 0%,100%{transform:rotate(-4deg) translateY(0)} 50%{transform:rotate(4deg) translateY(-10px)} }
        @keyframes kuroClumsy { 0%{transform:rotate(0deg)} 20%{transform:rotate(-18deg) translateX(-12px)} 40%{transform:rotate(18deg) translateX(12px)} 60%{transform:rotate(-8deg)} 80%{transform:rotate(8deg)} 100%{transform:rotate(0deg)} }
        @keyframes kuroVictory { 0%,100%{transform:translateY(0) scale(1)} 25%{transform:translateY(-18px) scale(1.06)} 50%{transform:translateY(-6px) scale(1.02)} 75%{transform:translateY(-14px) scale(1.05)} }
        @keyframes tailWagKuro { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(25deg)} }
        @keyframes earTwitchKuro { 0%,88%,100%{transform:rotate(0deg)} 94%{transform:rotate(-12deg)} }
        @keyframes furGlow { 0%,100%{filter:drop-shadow(0 0 4px #7c3aed44)} 50%{filter:drop-shadow(0 0 10px #7c3aed88)} }
        @keyframes sparkleFloat { 0%{transform:translate(0,0) scale(0);opacity:1} 100%{transform:translate(var(--tx),var(--ty)) scale(1.2);opacity:0} }
      `}</style>

      <svg width="120" height="160" viewBox="0 0 100 160"
        style={{
          animation: bodyAnim[mood] ? `${bodyAnim[mood]} 1s ease-in-out infinite` : 'furGlow 3s ease-in-out infinite',
          filter: accessories.glow ? 'drop-shadow(0 0 16px #7c3aed)' : ''
        }}>

        {/* Cape */}
        {accessories.cape && <path d="M22 88 Q8 122 18 148 Q50 160 82 148 Q92 122 78 88" fill="#4c1d95" opacity="0.95"/>}
        {accessories.cape && <path d="M22 88 Q8 122 18 148 Q50 160 82 148 Q92 122 78 88" fill="none" stroke="#7c3aed" strokeWidth="1" opacity="0.6"/>}

        {/* Fluffy tail - dark with silver tips */}
        <path d="M62 132 Q88 118 92 96 Q96 76 82 70" stroke="#1a1a2e" strokeWidth="14" fill="none" strokeLinecap="round"/>
        <path d="M62 132 Q88 118 92 96 Q96 76 82 70" stroke="#2d2d4e" strokeWidth="9" fill="none" strokeLinecap="round" opacity="0.8"/>
        <path d="M62 132 Q88 118 92 96 Q96 76 82 70" stroke="#9ca3af" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.3"/>
        {/* Tail tip silver */}
        <ellipse cx="82" cy="70" rx="6" ry="5" fill="#e2e8f0" opacity="0.4" transform="rotate(-20 82 70)"/>

        {/* Body - jet black with subtle blue sheen */}
        <ellipse cx="50" cy="112" rx="30" ry="32" fill="#0f0f1a"/>
        <ellipse cx="50" cy="108" rx="22" ry="24" fill="#1e1e3a" opacity="0.6"/>
        {/* Chest fluff - lighter */}
        <ellipse cx="50" cy="102" rx="14" ry="16" fill="#2d2d4e" opacity="0.5"/>

        {/* Neck fluff - very fluffy for Maine Coon */}
        <ellipse cx="50" cy="84" rx="24" ry="14" fill="#161626"/>
        <ellipse cx="50" cy="80" rx="20" ry="11" fill="#2d2d4e" opacity="0.5"/>
        {/* Silver neck tips */}
        <ellipse cx="35" cy="82" rx="6" ry="4" fill="#94a3b8" opacity="0.2" transform="rotate(-20 35 82)"/>
        <ellipse cx="65" cy="82" rx="6" ry="4" fill="#94a3b8" opacity="0.2" transform="rotate(20 65 82)"/>

        {/* Head - round Maine Coon */}
        <ellipse cx="50" cy="53" rx="27" ry="25" fill="#0f0f1a"/>

        {/* Cheek fluff - signature Maine Coon */}
        <ellipse cx="20" cy="58" rx="12" ry="9" fill="#161626" opacity="0.9"/>
        <ellipse cx="80" cy="58" rx="12" ry="9" fill="#161626" opacity="0.9"/>
        {/* Silver cheek tips */}
        <ellipse cx="16" cy="60" rx="6" ry="4" fill="#94a3b8" opacity="0.25"/>
        <ellipse cx="84" cy="60" rx="6" ry="4" fill="#94a3b8" opacity="0.25"/>

        {/* Ears - tall Maine Coon with lynx tips */}
        <polygon points="18,38 26,16 38,38" fill="#0f0f1a" style={{ animation: 'earTwitchKuro 3.5s ease-in-out infinite', transformOrigin: '28px 38px' }}/>
        <polygon points="62,38 74,16 82,38" fill="#0f0f1a" style={{ animation: 'earTwitchKuro 3.5s ease-in-out infinite 0.6s', transformOrigin: '72px 38px' }}/>
        {/* Inner ear */}
        <polygon points="22,38 27,22 35,38" fill="#2d1b4e" opacity="0.7"/>
        <polygon points="65,38 73,22 79,38" fill="#2d1b4e" opacity="0.7"/>
        {/* Lynx ear tips */}
        <line x1="26" y1="16" x2="24" y2="10" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
        <line x1="74" y1="16" x2="76" y2="10" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>

        {/* Forehead marking - subtle purple shimmer */}
        <path d="M42 38 Q50 34 58 38" stroke="#7c3aed" strokeWidth="1" fill="none" opacity="0.4"/>

        {/* Eyes */}
        {eyes[mood]}

        {/* Nose - small pink */}
        <polygon points="50,60 47,63 53,63" fill="#c084a0"/>

        {/* Whiskers - silver/white */}
        <line x1="10" y1="61" x2="36" y2="63" stroke="#e2e8f0" strokeWidth="1" opacity="0.7"/>
        <line x1="10" y1="65" x2="36" y2="65" stroke="#e2e8f0" strokeWidth="1" opacity="0.7"/>
        <line x1="14" y1="69" x2="36" y2="67" stroke="#e2e8f0" strokeWidth="1" opacity="0.5"/>
        <line x1="64" y1="63" x2="90" y2="61" stroke="#e2e8f0" strokeWidth="1" opacity="0.7"/>
        <line x1="64" y1="65" x2="90" y2="65" stroke="#e2e8f0" strokeWidth="1" opacity="0.7"/>
        <line x1="64" y1="67" x2="86" y2="69" stroke="#e2e8f0" strokeWidth="1" opacity="0.5"/>

        {/* Mouth */}
        {mouth[mood]}

        {/* Blush victory */}
        {mood === 'victory' && <><ellipse cx="28" cy="60" rx="8" ry="5" fill="#c084fc" opacity="0.3"/><ellipse cx="72" cy="60" rx="8" ry="5" fill="#c084fc" opacity="0.3"/></>}

        {/* Bow (level 2+) - purple bow tie */}
        {accessories.bow && (
          <g transform="translate(50, 80)">
            <path d="M-12,-5 Q-6,0 0,0 Q-6,0 -12,5 Z" fill="#7c3aed"/>
            <path d="M12,-5 Q6,0 0,0 Q6,0 12,5 Z" fill="#7c3aed"/>
            <circle cx="0" cy="0" r="3" fill="#a855f7"/>
            <circle cx="0" cy="0" r="1.5" fill="#ffd700"/>
          </g>
        )}

        {/* Headset (level 3+) */}
        {accessories.headset && (
          <g>
            <path d="M23 43 Q50 23 77 43" stroke="#1e1b4b" strokeWidth="3" fill="none"/>
            <rect x="17" y="41" width="10" height="8" rx="3" fill="#1e1b4b"/>
            <rect x="73" y="41" width="10" height="8" rx="3" fill="#1e1b4b"/>
            <rect x="21" y="44" width="4" height="4" rx="1" fill="#7c3aed"/>
            <rect x="75" y="44" width="4" height="4" rx="1" fill="#7c3aed"/>
          </g>
        )}

        {/* Paws */}
        <ellipse cx="32" cy="140" rx="11" ry="7" fill="#0f0f1a"/>
        <ellipse cx="68" cy="140" rx="11" ry="7" fill="#0f0f1a"/>
        {/* Silver paw tips */}
        <ellipse cx="32" cy="143" rx="9" ry="3" fill="#2d2d4e" opacity="0.5"/>
        <ellipse cx="68" cy="143" rx="9" ry="3" fill="#2d2d4e" opacity="0.5"/>

        {/* Purple aura glow at base */}
        <ellipse cx="50" cy="148" rx="25" ry="5" fill="#7c3aed" opacity="0.12"/>
      </svg>

      {/* Sparkles */}
      {(sparkle || mood === 'victory') && [...Array(8)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: `${15 + Math.random() * 65}%`,
          left: `${5 + Math.random() * 85}%`,
          fontSize: i % 2 === 0 ? '12px' : '10px',
          animation: `sparkleFloat ${0.7 + i * 0.15}s ease-out forwards`,
          '--tx': `${(Math.random() - 0.5) * 70}px`,
          '--ty': `${-25 - Math.random() * 45}px`,
          animationDelay: `${i * 0.08}s`,
          pointerEvents: 'none',
        }}>{i % 3 === 0 ? '✨' : i % 3 === 1 ? '⭐' : '💫'}</div>
      ))}
    </div>
  )
}

// ===================== SHIRO - WHITE LABRADOR (REDESIGNED) =====================
function ShiroSVG({ mood = 'idle', level = 1, sparkle = false }) {
  const accessories = {
    bow: level >= 2,
    headset: level >= 3,
    cape: level >= 4,
    glow: level >= 5,
  }

  const eyes = {
    idle: (
      <>
        <ellipse cx="36" cy="50" rx="6.5" ry="6" fill="#7a4a1e"/>
        <ellipse cx="64" cy="50" rx="6.5" ry="6" fill="#7a4a1e"/>
        <ellipse cx="36" cy="50" rx="4.5" ry="4.5" fill="#c8822a"/>
        <ellipse cx="64" cy="50" rx="4.5" ry="4.5" fill="#c8822a"/>
        <ellipse cx="36" cy="50" rx="2.5" ry="3" fill="#1a0a00"/>
        <ellipse cx="64" cy="50" rx="2.5" ry="3" fill="#1a0a00"/>
        <ellipse cx="34.2" cy="48.2" rx="1.8" ry="1.5" fill="white" opacity="0.95"/>
        <ellipse cx="62.2" cy="48.2" rx="1.8" ry="1.5" fill="white" opacity="0.95"/>
        <ellipse cx="37.5" cy="52" rx="0.7" ry="0.6" fill="white" opacity="0.5"/>
        <ellipse cx="65.5" cy="52" rx="0.7" ry="0.6" fill="white" opacity="0.5"/>
      </>
    ),
    investigate: (
      <>
        <ellipse cx="36" cy="50" rx="6.5" ry="5" fill="#7a4a1e"/>
        <ellipse cx="64" cy="50" rx="6.5" ry="5" fill="#7a4a1e"/>
        <ellipse cx="36" cy="50" rx="4" ry="3.5" fill="#c8822a"/>
        <ellipse cx="64" cy="50" rx="4" ry="3.5" fill="#c8822a"/>
        <ellipse cx="36" cy="50" rx="2" ry="2.2" fill="#1a0a00"/>
        <ellipse cx="64" cy="50" rx="2" ry="2.2" fill="#1a0a00"/>
        <ellipse cx="34" cy="48.5" rx="1.5" ry="1.2" fill="white" opacity="0.95"/>
        <ellipse cx="62" cy="48.5" rx="1.5" ry="1.2" fill="white" opacity="0.95"/>
        <path d="M27 43 Q36 46 44 45" stroke="#d4b896" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <path d="M56 45 Q64 46 73 43" stroke="#d4b896" strokeWidth="3" fill="none" strokeLinecap="round"/>
      </>
    ),
    clumsy: (
      <>
        <ellipse cx="36" cy="50" rx="8" ry="8" fill="#7a4a1e"/>
        <ellipse cx="64" cy="50" rx="8" ry="8" fill="#7a4a1e"/>
        <ellipse cx="36" cy="50" rx="5.5" ry="5.5" fill="#c8822a"/>
        <ellipse cx="64" cy="50" rx="5.5" ry="5.5" fill="#c8822a"/>
        <ellipse cx="36" cy="50" rx="3.5" ry="4" fill="#1a0a00"/>
        <ellipse cx="64" cy="50" rx="3.5" ry="4" fill="#1a0a00"/>
        <ellipse cx="33.5" cy="47.5" rx="2" ry="1.8" fill="white" opacity="0.95"/>
        <ellipse cx="61.5" cy="47.5" rx="2" ry="1.8" fill="white" opacity="0.95"/>
        {/* X marks for dizzy */}
        <line x1="30" y1="44" x2="34" y2="48" stroke="#ef4444" strokeWidth="1.5" opacity="0.7"/>
        <line x1="34" y1="44" x2="30" y2="48" stroke="#ef4444" strokeWidth="1.5" opacity="0.7"/>
        <line x1="58" y1="44" x2="62" y2="48" stroke="#ef4444" strokeWidth="1.5" opacity="0.7"/>
        <line x1="62" y1="44" x2="58" y2="48" stroke="#ef4444" strokeWidth="1.5" opacity="0.7"/>
      </>
    ),
    victory: (
      <>
        <path d="M29 50 Q36 42 43 50" stroke="#c8822a" strokeWidth="3" fill="#c8822a" opacity="0.2"/>
        <path d="M29 50 Q36 42 43 50" stroke="#c8822a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M57 50 Q64 42 71 50" stroke="#c8822a" strokeWidth="3" fill="#c8822a" opacity="0.2"/>
        <path d="M57 50 Q64 42 71 50" stroke="#c8822a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <text x="36" y="51" fontSize="9" textAnchor="middle" fill="#ffd700">✦</text>
        <text x="64" y="51" fontSize="9" textAnchor="middle" fill="#ffd700">✦</text>
      </>
    ),
  }

  const mouth = {
    idle: <><path d="M42 68 Q50 74 58 68" stroke="#e8a0a0" strokeWidth="2" fill="none" strokeLinecap="round"/><ellipse cx="50" cy="72" rx="7" ry="4" fill="#ffb3b3" opacity="0.6"/></>,
    investigate: <path d="M44 66 Q50 63 56 66" stroke="#e8a0a0" strokeWidth="2" fill="none" strokeLinecap="round"/>,
    clumsy: <><path d="M41 68 Q50 77 59 68" stroke="#e8a0a0" strokeWidth="2.5" fill="none" strokeLinecap="round"/><ellipse cx="50" cy="73" rx="8" ry="5" fill="#ffb3b3" opacity="0.7"/></>,
    victory: <><path d="M39 66 Q50 77 61 66" stroke="#e8a0a0" strokeWidth="2.5" fill="none" strokeLinecap="round"/><ellipse cx="50" cy="72" rx="9" ry="5" fill="#ffb3b3" opacity="0.85"/></>,
  }

  const bodyAnim = {
    idle: '',
    investigate: 'shiroInvestigate',
    clumsy: 'shiroClumsy',
    victory: 'shiroVictory',
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <style>{`
        @keyframes shiroInvestigate { 0%,100%{transform:rotate(3deg) translateY(0)} 50%{transform:rotate(-3deg) translateY(-8px)} }
        @keyframes shiroClumsy { 0%{transform:rotate(0) scale(1)} 15%{transform:rotate(-22deg) scale(0.94)} 30%{transform:rotate(22deg) scale(1.06)} 45%{transform:rotate(-10deg)} 60%{transform:rotate(10deg)} 100%{transform:rotate(0) scale(1)} }
        @keyframes shiroVictory { 0%,100%{transform:translateY(0) rotate(0)} 30%{transform:translateY(-20px) rotate(-6deg)} 60%{transform:translateY(-8px) rotate(6deg)} 80%{transform:translateY(-16px) rotate(-3deg)} }
        @keyframes tailWagShiro { 0%,100%{transform:rotate(-30deg)} 50%{transform:rotate(30deg)} }
        @keyframes shineGlow { 0%,100%{filter:drop-shadow(0 0 5px #ffffff33)} 50%{filter:drop-shadow(0 0 12px #ffffff66)} }
        @keyframes sparkleFloat { 0%{transform:translate(0,0) scale(0);opacity:1} 100%{transform:translate(var(--tx),var(--ty)) scale(1.2);opacity:0} }
      `}</style>

      <svg width="120" height="170" viewBox="0 0 100 170"
        style={{
          animation: bodyAnim[mood] ? `${bodyAnim[mood]} 1s ease-in-out infinite` : 'shineGlow 3s ease-in-out infinite',
          filter: accessories.glow ? 'drop-shadow(0 0 18px #ffffff)' : ''
        }}>

        {/* Cape */}
        {accessories.cape && <path d="M22 92 Q8 126 18 152 Q50 164 82 152 Q92 126 78 92" fill="#b91c1c" opacity="0.95"/>}

        {/* Tail - happy wagging lab tail, thick at base */}
        <path d="M68 130 Q86 108 88 86 Q90 68 80 62" stroke="#f0ece4" strokeWidth="10" fill="none" strokeLinecap="round"
          style={{ animation: 'tailWagShiro 0.45s ease-in-out infinite', transformOrigin: '68px 130px' }}/>
        <path d="M68 130 Q86 108 88 86 Q90 68 80 62" stroke="#e8e0d0" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.5"/>

        {/* Body - solid white lab body, more rectangular/stocky */}
        <rect x="22" y="96" width="56" height="52" rx="16" fill="#f4f0e8"/>
        <ellipse cx="50" cy="96" rx="28" ry="12" fill="#f4f0e8"/>
        <ellipse cx="50" cy="148" rx="28" ry="10" fill="#f4f0e8"/>
        {/* Body highlight */}
        <ellipse cx="38" cy="108" rx="8" ry="14" fill="white" opacity="0.4" transform="rotate(-10 38 108)"/>

        {/* Collar */}
        <rect x="28" y="88" width="44" height="9" rx="4.5" fill="#1e3a5f"/>
        <rect x="30" y="89.5" width="40" height="6" rx="3" fill="#3b82f6" opacity="0.8"/>
        <circle cx="50" cy="93" r="3.5" fill="#fbbf24"/>
        <text x="50" y="95" fontSize="4" textAnchor="middle" fill="#78350f">S</text>

        {/* Neck - thick lab neck */}
        <ellipse cx="50" cy="88" rx="20" ry="10" fill="#f4f0e8"/>

        {/* HEAD - proper broad Labrador head */}
        {/* Back of head */}
        <ellipse cx="50" cy="50" rx="28" ry="26" fill="#f0ece4"/>
        {/* Forehead dome */}
        <ellipse cx="50" cy="42" rx="24" ry="20" fill="#f4f0e8"/>
        {/* Head highlight */}
        <ellipse cx="40" cy="36" rx="10" ry="7" fill="white" opacity="0.4" transform="rotate(-20 40 36)"/>

        {/* Muzzle - prominent lab muzzle, square and wide */}
        <rect x="32" y="58" width="36" height="22" rx="10" fill="#e8e0cc"/>
        <ellipse cx="50" cy="58" rx="18" ry="8" fill="#ede8dc"/>
        {/* Muzzle highlight */}
        <ellipse cx="42" cy="60" rx="5" ry="3" fill="white" opacity="0.3"/>

        {/* Floppy ears - wide flat lab ears */}
        <ellipse cx="18" cy="52" rx="12" ry="18" fill="#ddd0b8" transform="rotate(-10 18 52)"/>
        <ellipse cx="82" cy="52" rx="12" ry="18" fill="#ddd0b8" transform="rotate(10 82 52)"/>
        <ellipse cx="18" cy="52" rx="8" ry="14" fill="#c8bca0" opacity="0.5" transform="rotate(-10 18 52)"/>
        <ellipse cx="82" cy="52" rx="8" ry="14" fill="#c8bca0" opacity="0.5" transform="rotate(10 82 52)"/>

        {/* Eyes */}
        {eyes[mood]}

        {/* Nose - wide lab nose */}
        <ellipse cx="50" cy="63" rx="8" ry="6" fill="#1a1a1a"/>
        <ellipse cx="50" cy="61" rx="5" ry="3.5" fill="#333" opacity="0.5"/>
        <ellipse cx="47" cy="61" rx="2" ry="1.4" fill="white" opacity="0.4"/>
        {/* Nose nostrils */}
        <ellipse cx="46" cy="64" rx="2" ry="1.5" fill="#111" opacity="0.6"/>
        <ellipse cx="54" cy="64" rx="2" ry="1.5" fill="#111" opacity="0.6"/>

        {/* Mouth */}
        {mouth[mood]}

        {/* Blush */}
        {mood === 'victory' && <><ellipse cx="26" cy="60" rx="9" ry="5" fill="#fca5a5" opacity="0.4"/><ellipse cx="74" cy="60" rx="9" ry="5" fill="#fca5a5" opacity="0.4"/></>}

        {/* Bow on collar (level 2+) */}
        {accessories.bow && (
          <g transform="translate(50, 94)">
            <path d="M-11,-4 Q-5.5,0 0,0 Q-5.5,0 -11,4 Z" fill="#3b82f6"/>
            <path d="M11,-4 Q5.5,0 0,0 Q5.5,0 11,4 Z" fill="#3b82f6"/>
            <circle cx="0" cy="0" r="2.5" fill="#60a5fa"/>
            <circle cx="0" cy="0" r="1.2" fill="white" opacity="0.8"/>
          </g>
        )}

        {/* Headset (level 3+) */}
        {accessories.headset && (
          <g>
            <path d="M21 38 Q50 18 79 38" stroke="#374151" strokeWidth="3" fill="none"/>
            <rect x="15" y="36" width="10" height="9" rx="3" fill="#1f2937"/>
            <rect x="75" y="36" width="10" height="9" rx="3" fill="#1f2937"/>
            <rect x="19" y="39" width="4" height="4" rx="1" fill="#f59e0b"/>
            <rect x="77" y="39" width="4" height="4" rx="1" fill="#f59e0b"/>
          </g>
        )}

        {/* Legs - stubby lab legs */}
        <rect x="28" y="142" width="18" height="20" rx="8" fill="#f0ece4"/>
        <rect x="54" y="142" width="18" height="20" rx="8" fill="#f0ece4"/>
        {/* Paws */}
        <ellipse cx="37" cy="162" rx="10" ry="7" fill="#e8e0cc"/>
        <ellipse cx="63" cy="162" rx="10" ry="7" fill="#e8e0cc"/>
        {/* Paw pads */}
        <ellipse cx="37" cy="165" rx="7" ry="3.5" fill="#e8c8b0" opacity="0.7"/>
        <ellipse cx="63" cy="165" rx="7" ry="3.5" fill="#e8c8b0" opacity="0.7"/>

        {/* White aura */}
        <ellipse cx="50" cy="166" rx="26" ry="4" fill="white" opacity="0.08"/>
      </svg>

      {/* Sparkles */}
      {(sparkle || mood === 'victory') && [...Array(8)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: `${15 + Math.random() * 65}%`,
          left: `${5 + Math.random() * 85}%`,
          fontSize: i % 2 === 0 ? '12px' : '10px',
          animation: `sparkleFloat ${0.7 + i * 0.15}s ease-out forwards`,
          '--tx': `${(Math.random() - 0.5) * 70}px`,
          '--ty': `${-25 - Math.random() * 45}px`,
          animationDelay: `${i * 0.08}s`,
          pointerEvents: 'none',
        }}>{i % 3 === 0 ? '✨' : i % 3 === 1 ? '⭐' : '💫'}</div>
      ))}
    </div>
  )
}
// ===================== IDLE SCENE - KURO PLAYS WITH YARN =====================
function KuroIdleScene({ level = 1 }) {
  const [yarnPhase, setYarnPhase] = useState(0)
  // 0: yarn rolls in, 1: Kuro bats it, 2: chases, 3: proud, then repeat

  useEffect(() => {
    const cycle = () => {
      setYarnPhase(p => (p + 1) % 4)
    }
    const timings = [1200, 1000, 1200, 1000]
    let elapsed = 0
    const timeouts = timings.map((t, i) => {
      elapsed += t
      return setTimeout(cycle, elapsed)
    })
    const loop = setTimeout(() => setYarnPhase(0), elapsed + 400)
    return () => { timeouts.forEach(clearTimeout); clearTimeout(loop) }
  }, [yarnPhase === 3 ? yarnPhase : -1])

  const accessories = { bow: level >= 2, headset: level >= 3, cape: level >= 4, glow: level >= 5 }

  return (
    <div style={{ position: 'relative', display: 'inline-block', width: '130px', height: '170px' }}>
      <style>{`
        @keyframes yarnRollIn { 0%{transform:translateX(60px)} 100%{transform:translateX(0)} }
        @keyframes yarnBounce { 0%,100%{transform:translateY(0) rotate(0)} 50%{transform:translateY(-8px) rotate(180deg)} }
        @keyframes yarnRoll { 0%{transform:rotate(0)} 100%{transform:rotate(720deg)} }
        @keyframes kuroBat { 0%,100%{transform:rotate(0deg)} 30%{transform:rotate(-25deg) translateX(8px)} 60%{transform:rotate(-35deg) translateX(12px)} }
        @keyframes kuroChase { 0%,100%{transform:translateX(0)} 50%{transform:translateX(15px)} }
        @keyframes kuroPride { 0%,100%{transform:translateY(0) rotate(0)} 25%{transform:translateY(-10px) rotate(-3deg)} 75%{transform:translateY(-6px) rotate(3deg)} }
        @keyframes tailIdleKuro { 0%,100%{transform:rotate(-5deg)} 50%{transform:rotate(15deg)} }
        @keyframes earTwitchKuro { 0%,85%,100%{transform:rotate(0)} 92%{transform:rotate(-12deg)} }
        @keyframes yarnString { 0%{stroke-dashoffset:100} 100%{stroke-dashoffset:0} }
        @keyframes furGlowKuro { 0%,100%{filter:drop-shadow(0 0 3px #7c3aed33)} 50%{filter:drop-shadow(0 0 8px #7c3aed66)} }
        @keyframes sparkleFloat { 0%{transform:translate(0,0) scale(0);opacity:1} 100%{transform:translate(var(--tx),var(--ty)) scale(1.2);opacity:0} }
      `}</style>

      {/* Yarn ball */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: yarnPhase === 0 ? undefined : yarnPhase === 1 ? '55px' : yarnPhase === 2 ? '75px' : '60px',
        animation: yarnPhase === 0 ? 'yarnRollIn 1.2s cubic-bezier(0.25,0.46,0.45,0.94) forwards' : 'none',
        transform: yarnPhase === 0 ? 'translateX(60px)' : 'none',
        zIndex: 2,
      }}>
        <svg width="28" height="28" viewBox="0 0 28 28">
          <circle cx="14" cy="14" r="12" fill="#ec4899"/>
          <circle cx="14" cy="14" r="12" fill="none" stroke="#f9a8d4" strokeWidth="1.5" opacity="0.6"/>
          {/* Yarn wind lines */}
          <path d="M4 10 Q14 6 24 10" stroke="#f9a8d4" strokeWidth="1.2" fill="none" opacity="0.7"
            style={{ animation: 'yarnRoll 0.6s linear infinite' }}/>
          <path d="M3 14 Q14 18 25 14" stroke="#f9a8d4" strokeWidth="1.2" fill="none" opacity="0.7"/>
          <path d="M5 18 Q14 14 23 18" stroke="#be185d" strokeWidth="1" fill="none" opacity="0.5"/>
          {/* Yarn end string */}
          {yarnPhase >= 1 && (
            <line x1="14" y1="2" x2="14" y2="-15" stroke="#f9a8d4" strokeWidth="1"
              strokeDasharray="100" strokeDashoffset="0" opacity="0.7"/>
          )}
        </svg>
      </div>

      {/* Kuro SVG - front view idle */}
      <svg width="100" height="160" viewBox="0 0 100 160"
        style={{
          position: 'absolute', left: '10px', bottom: '10px',
          animation: yarnPhase === 1 ? 'kuroBat 0.5s ease-in-out' :
                     yarnPhase === 2 ? 'kuroChase 0.6s ease-in-out infinite' :
                     yarnPhase === 3 ? 'kuroPride 0.8s ease-in-out infinite' : '',
          filter: accessories.glow ? 'drop-shadow(0 0 12px #7c3aed)' : 'drop-shadow(0 0 4px #7c3aed33)',
        }}>

        {/* Cape */}
        {accessories.cape && <path d="M25 90 Q10 120 20 145 Q50 155 80 145 Q90 120 75 90" fill="#4c1d95" opacity="0.95"/>}

        {/* Tail */}
        <path d="M65 130 Q90 118 94 98 Q98 78 84 72" stroke="#1a1a2e" strokeWidth="13" fill="none" strokeLinecap="round"
          style={{ animation: 'tailIdleKuro 2s ease-in-out infinite', transformOrigin: '65px 130px' }}/>
        <path d="M65 130 Q90 118 94 98 Q98 78 84 72" stroke="#2d2d4e" strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.7"/>
        <path d="M65 130 Q90 118 94 98 Q98 78 84 72" stroke="#9ca3af" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.25"/>

        {/* Paw reaching out when batting */}
        {yarnPhase === 1 && (
          <path d="M62 95 Q75 88 82 82" stroke="#0f0f1a" strokeWidth="8" fill="none" strokeLinecap="round"
            style={{ animation: 'kuroBat 0.5s ease-in-out' }}/>
        )}

        {/* Body */}
        <ellipse cx="50" cy="112" rx="30" ry="32" fill="#0f0f1a"/>
        <ellipse cx="50" cy="106" rx="22" ry="24" fill="#1e1e3a" opacity="0.5"/>
        <ellipse cx="50" cy="100" rx="14" ry="16" fill="#2d2d4e" opacity="0.3"/>

        {/* Neck fluff */}
        <ellipse cx="50" cy="85" rx="24" ry="14" fill="#161626"/>
        <ellipse cx="50" cy="81" rx="19" ry="10" fill="#2d2d4e" opacity="0.4"/>

        {/* Head */}
        <ellipse cx="50" cy="54" rx="27" ry="25" fill="#0f0f1a"/>
        <ellipse cx="20" cy="58" rx="12" ry="9" fill="#161626" opacity="0.9"/>
        <ellipse cx="80" cy="58" rx="12" ry="9" fill="#161626" opacity="0.9"/>
        <ellipse cx="16" cy="60" rx="6" ry="4" fill="#94a3b8" opacity="0.2"/>
        <ellipse cx="84" cy="60" rx="6" ry="4" fill="#94a3b8" opacity="0.2"/>

        {/* Ears */}
        <polygon points="18,38 26,16 38,38" fill="#0f0f1a"
          style={{ animation: 'earTwitchKuro 3s ease-in-out infinite', transformOrigin: '28px 38px' }}/>
        <polygon points="62,38 74,16 82,38" fill="#0f0f1a"
          style={{ animation: 'earTwitchKuro 3s ease-in-out infinite 0.5s', transformOrigin: '72px 38px' }}/>
        <polygon points="22,38 27,22 35,38" fill="#2d1b4e" opacity="0.7"/>
        <polygon points="65,38 73,22 79,38" fill="#2d1b4e" opacity="0.7"/>
        <line x1="26" y1="16" x2="24" y2="10" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
        <line x1="74" y1="16" x2="76" y2="10" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>

        {/* Eyes - change with phase */}
        {yarnPhase === 3 ? (
          // Proud squint
          <>
            <path d="M30 52 Q36 46 42 52" stroke="#f5a623" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M58 52 Q64 46 70 52" stroke="#f5a623" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <ellipse cx="36" cy="50" rx="6" ry="2" fill="#f5a623" opacity="0.2"/>
            <ellipse cx="64" cy="50" rx="6" ry="2" fill="#f5a623" opacity="0.2"/>
          </>
        ) : yarnPhase === 2 ? (
          // Focused chase eyes
          <>
            <ellipse cx="36" cy="52" rx="6" ry="5.5" fill="#f5a623"/>
            <ellipse cx="64" cy="52" rx="6" ry="5.5" fill="#f5a623"/>
            <ellipse cx="36" cy="52" rx="4" ry="4" fill="#7c3aed"/>
            <ellipse cx="64" cy="52" rx="4" ry="4" fill="#7c3aed"/>
            <ellipse cx="36" cy="52" rx="2.5" ry="3" fill="#1a0a2e"/>
            <ellipse cx="64" cy="52" rx="2.5" ry="3" fill="#1a0a2e"/>
            <ellipse cx="34.5" cy="50.5" rx="1" ry="1" fill="white" opacity="0.9"/>
            <ellipse cx="62.5" cy="50.5" rx="1" ry="1" fill="white" opacity="0.9"/>
            <line x1="28" y1="44" x2="44" y2="47" stroke="#2d1b69" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="56" y1="47" x2="72" y2="44" stroke="#2d1b69" strokeWidth="2.5" strokeLinecap="round"/>
          </>
        ) : (
          // Idle / batting eyes
          <>
            <ellipse cx="36" cy="52" rx="6" ry="5.5" fill="#f5a623"/>
            <ellipse cx="64" cy="52" rx="6" ry="5.5" fill="#f5a623"/>
            <ellipse cx="36" cy="52" rx="4" ry="4" fill="#7c3aed"/>
            <ellipse cx="64" cy="52" rx="4" ry="4" fill="#7c3aed"/>
            <ellipse cx="36" cy="52" rx="2" ry="2.5" fill="#1a0a2e"/>
            <ellipse cx="64" cy="52" rx="2" ry="2.5" fill="#1a0a2e"/>
            <ellipse cx="35" cy="51" rx="1" ry="1" fill="white" opacity="0.9"/>
            <ellipse cx="63" cy="51" rx="1" ry="1" fill="white" opacity="0.9"/>
            <ellipse cx="36" cy="52" rx="6" ry="5.5" fill="none" stroke="#ffd700" strokeWidth="0.5" opacity="0.5"/>
            <ellipse cx="64" cy="52" rx="6" ry="5.5" fill="none" stroke="#ffd700" strokeWidth="0.5" opacity="0.5"/>
          </>
        )}

        {/* Nose */}
        <polygon points="50,60 47,63 53,63" fill="#c084a0"/>

        {/* Whiskers */}
        <line x1="10" y1="61" x2="36" y2="63" stroke="#e2e8f0" strokeWidth="1" opacity="0.6"/>
        <line x1="10" y1="65" x2="36" y2="65" stroke="#e2e8f0" strokeWidth="1" opacity="0.6"/>
        <line x1="64" y1="63" x2="90" y2="61" stroke="#e2e8f0" strokeWidth="1" opacity="0.6"/>
        <line x1="64" y1="65" x2="90" y2="65" stroke="#e2e8f0" strokeWidth="1" opacity="0.6"/>

        {/* Mouth */}
        {yarnPhase === 3
          ? <path d="M43 63 Q50 70 57 63" stroke="#9d4e6f" strokeWidth="2" fill="none" strokeLinecap="round"/>
          : <path d="M46 63 Q50 67 54 63" stroke="#9d4e6f" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
        }

        {/* Bow */}
        {accessories.bow && (
          <g transform="translate(50, 78)">
            <path d="M-12,-5 Q-6,0 0,0 Q-6,0 -12,5 Z" fill="#7c3aed"/>
            <path d="M12,-5 Q6,0 0,0 Q6,0 12,5 Z" fill="#7c3aed"/>
            <circle cx="0" cy="0" r="3" fill="#a855f7"/>
            <circle cx="0" cy="0" r="1.5" fill="#ffd700"/>
          </g>
        )}

        {/* Headset */}
        {accessories.headset && (
          <g>
            <path d="M24 45 Q50 25 76 45" stroke="#1e1b4b" strokeWidth="3" fill="none"/>
            <rect x="18" y="43" width="10" height="8" rx="3" fill="#1e1b4b"/>
            <rect x="72" y="43" width="10" height="8" rx="3" fill="#1e1b4b"/>
            <rect x="22" y="46" width="4" height="4" rx="1" fill="#7c3aed"/>
            <rect x="74" y="46" width="4" height="4" rx="1" fill="#7c3aed"/>
          </g>
        )}

        {/* Paws */}
        <ellipse cx="32" cy="140" rx="11" ry="7" fill="#0f0f1a"/>
        <ellipse cx="68" cy="140" rx="11" ry="7" fill="#0f0f1a"/>

        {/* Pride sparkles */}
        {yarnPhase === 3 && ['✨','⭐','💫'].map((s, i) => (
          <text key={i} x={25+i*25} y={30} fontSize="12" textAnchor="middle"
            style={{ animation: `sparkleFloat 1s ease-out infinite`, animationDelay: `${i*0.3}s`,
              '--tx': `${(i-1)*20}px`, '--ty': '-20px' }}>
            {s}
          </text>
        ))}

        {/* Purple aura */}
        <ellipse cx="50" cy="148" rx="25" ry="5" fill="#7c3aed" opacity="0.1"/>
      </svg>
    </div>
  )
}

// ===================== IDLE SCENE - SHIRO WITH BALL =====================
function ShiroIdleScene({ level = 1 }) {
  const [ballPhase, setBallPhase] = useState(0)
  // 0: idle wagging, 1: ball drops on head, 2: confused look, 3: shakes head, back to 0

  useEffect(() => {
    const timings = [2000, 800, 1000, 600]
    let elapsed = 0
    const timeouts = timings.map((_, i) => {
      elapsed += timings[i]
      return setTimeout(() => setBallPhase(i + 1 < 4 ? i + 1 : 0), elapsed)
    })
    return () => timeouts.forEach(clearTimeout)
  }, [ballPhase === 3 ? ballPhase : -1])

  const accessories = { bow: level >= 2, headset: level >= 3, cape: level >= 4, glow: level >= 5 }

  return (
    <div style={{ position: 'relative', display: 'inline-block', width: '130px', height: '190px' }}>
      <style>{`
        @keyframes ballDrop { 0%{transform:translateY(-60px);opacity:0} 60%{transform:translateY(0px);opacity:1} 75%{transform:translateY(-8px)} 100%{transform:translateY(0)} }
        @keyframes ballBounceOnHead { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes shiroConfused { 0%,100%{transform:rotate(0)} 25%{transform:rotate(-10deg)} 75%{transform:rotate(10deg)} }
        @keyframes shiroShake { 0%,100%{transform:rotate(0) translateX(0)} 20%{transform:rotate(-8deg) translateX(-4px)} 40%{transform:rotate(8deg) translateX(4px)} 60%{transform:rotate(-5deg) translateX(-2px)} 80%{transform:rotate(5deg) translateX(2px)} }
        @keyframes shiroTailHappy { 0%,100%{transform:rotate(-30deg)} 50%{transform:rotate(30deg)} }
        @keyframes shiroTailSlow { 0%,100%{transform:rotate(-10deg)} 50%{transform:rotate(10deg)} }
        @keyframes shiroEarFlop { 0%,100%{transform:rotate(0) scaleY(1)} 50%{transform:rotate(-8deg) scaleY(0.92)} }
        @keyframes questionMark { 0%{transform:scale(0) translateY(5px);opacity:0} 30%{transform:scale(1.2) translateY(0);opacity:1} 100%{transform:scale(1) translateY(-5px);opacity:0.8} }
        @keyframes sparkleFloat { 0%{transform:translate(0,0) scale(0);opacity:1} 100%{transform:translate(var(--tx),var(--ty)) scale(1.2);opacity:0} }
      `}</style>

      {/* Ball */}
      {ballPhase >= 1 && ballPhase <= 3 && (
        <div style={{
          position: 'absolute',
          top: ballPhase === 1 ? undefined : '18px',
          left: '52px',
          animation: ballPhase === 1 ? 'ballDrop 0.6s cubic-bezier(0.22,1,0.36,1) forwards' :
                     'ballBounceOnHead 0.5s ease-in-out infinite',
          zIndex: 3,
        }}>
          <svg width="22" height="22" viewBox="0 0 22 22">
            <circle cx="11" cy="11" r="10" fill="#ef4444"/>
            <path d="M4 8 Q11 4 18 8" stroke="#fca5a5" strokeWidth="1.5" fill="none" opacity="0.7"/>
            <path d="M2 12 Q11 16 20 12" stroke="#dc2626" strokeWidth="1" fill="none" opacity="0.5"/>
            <circle cx="7" cy="7" r="2" fill="#fca5a5" opacity="0.4"/>
          </svg>
        </div>
      )}

      {/* Question mark when confused */}
      {ballPhase === 2 && (
        <div style={{
          position: 'absolute', top: '5px', right: '15px',
          fontSize: '20px', fontWeight: '900', color: '#f59e0b',
          animation: 'questionMark 0.8s ease-out forwards',
          zIndex: 4,
        }}>?</div>
      )}

      {/* Shiro SVG */}
      <svg width="110" height="175" viewBox="0 0 100 160"
        style={{
          position: 'absolute', left: '10px', bottom: '5px',
          animation: ballPhase === 2 ? 'shiroConfused 0.8s ease-in-out infinite' :
                     ballPhase === 3 ? 'shiroShake 0.5s ease-in-out' : '',
          filter: accessories.glow ? 'drop-shadow(0 0 18px #ffffff)' : 'drop-shadow(0 0 5px #ffffff22)',
        }}>

        {/* Cape */}
        {accessories.cape && <path d="M22 92 Q8 126 18 152 Q50 164 82 152 Q92 126 78 92" fill="#b91c1c" opacity="0.95"/>}

        {/* Tail */}
        <path d="M68 128 Q88 108 88 84 Q88 66 78 60" stroke="#f0ece4" strokeWidth="10" fill="none" strokeLinecap="round"
          style={{
            animation: ballPhase === 0 ? 'shiroTailHappy 0.4s ease-in-out infinite' : 'shiroTailSlow 1s ease-in-out infinite',
            transformOrigin: '68px 128px'
          }}/>
        <path d="M68 128 Q88 108 88 84 Q88 66 78 60" stroke="#e8e0d0" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.5"/>

        {/* Body */}
        <rect x="22" y="94" width="56" height="50" rx="16" fill="#f4f0e8"/>
        <ellipse cx="50" cy="94" rx="28" ry="11" fill="#f4f0e8"/>
        <ellipse cx="50" cy="144" rx="28" ry="9" fill="#f4f0e8"/>
        <ellipse cx="38" cy="106" rx="7" ry="12" fill="white" opacity="0.35" transform="rotate(-10 38 106)"/>

        {/* Collar */}
        <rect x="28" y="86" width="44" height="9" rx="4.5" fill="#1e3a5f"/>
        <rect x="30" y="87.5" width="40" height="6" rx="3" fill="#3b82f6" opacity="0.8"/>
        <circle cx="50" cy="91" r="3" fill="#fbbf24"/>

        {/* Neck */}
        <ellipse cx="50" cy="86" rx="21" ry="10" fill="#f4f0e8"/>

        {/* Head */}
        <ellipse cx="50" cy="50" rx="28" ry="26" fill="#f4f0e8"/>
        <ellipse cx="40" cy="36" rx="10" ry="7" fill="white" opacity="0.4" transform="rotate(-20 40 36)"/>

        {/* Muzzle */}
        <rect x="32" y="57" width="36" height="22" rx="10" fill="#e8e0cc"/>
        <ellipse cx="50" cy="57" rx="18" ry="8" fill="#ede8dc"/>
        <ellipse cx="42" cy="59" rx="5" ry="3" fill="white" opacity="0.25"/>

        {/* Floppy ears */}
        <ellipse cx="18" cy="51" rx="12" ry="18" fill="#ddd0b8" transform="rotate(-10 18 51)"
          style={{ animation: 'shiroEarFlop 2s ease-in-out infinite', transformOrigin: '18px 36px' }}/>
        <ellipse cx="82" cy="51" rx="12" ry="18" fill="#ddd0b8" transform="rotate(10 82 51)"
          style={{ animation: 'shiroEarFlop 2s ease-in-out infinite 0.5s', transformOrigin: '82px 36px' }}/>
        <ellipse cx="18" cy="51" rx="8" ry="13" fill="#c8bca0" opacity="0.5" transform="rotate(-10 18 51)"/>
        <ellipse cx="82" cy="51" rx="8" ry="13" fill="#c8bca0" opacity="0.5" transform="rotate(10 82 51)"/>

        {/* Eyes */}
        {ballPhase === 2 ? (
          // Confused eyes - one raised
          <>
            <ellipse cx="36" cy="48" rx="6.5" ry="6" fill="#7a4a1e"/>
            <ellipse cx="64" cy="50" rx="6.5" ry="5" fill="#7a4a1e"/>
            <ellipse cx="36" cy="48" rx="4.5" ry="4.5" fill="#c8822a"/>
            <ellipse cx="64" cy="50" rx="4.5" ry="3.5" fill="#c8822a"/>
            <ellipse cx="36" cy="48" rx="2.5" ry="3" fill="#1a0a00"/>
            <ellipse cx="64" cy="50" rx="2.5" ry="2.5" fill="#1a0a00"/>
            <ellipse cx="34.2" cy="46.2" rx="1.8" ry="1.5" fill="white" opacity="0.95"/>
            <ellipse cx="62.2" cy="48.2" rx="1.8" ry="1.5" fill="white" opacity="0.95"/>
            {/* Confused brow */}
            <path d="M58 43 Q64 41 70 44" stroke="#d4b896" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          </>
        ) : ballPhase === 3 ? (
          // Shaking - squinting
          <>
            <path d="M30 48 Q36 43 42 48" stroke="#7a4a1e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M58 48 Q64 43 70 48" stroke="#7a4a1e" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
          </>
        ) : (
          // Happy idle
          <>
            <ellipse cx="36" cy="49" rx="6.5" ry="6" fill="#7a4a1e"/>
            <ellipse cx="64" cy="49" rx="6.5" ry="6" fill="#7a4a1e"/>
            <ellipse cx="36" cy="49" rx="4.5" ry="4.5" fill="#c8822a"/>
            <ellipse cx="64" cy="49" rx="4.5" ry="4.5" fill="#c8822a"/>
            <ellipse cx="36" cy="49" rx="2.5" ry="3" fill="#1a0a00"/>
            <ellipse cx="64" cy="49" rx="2.5" ry="3" fill="#1a0a00"/>
            <ellipse cx="34.2" cy="47.2" rx="1.8" ry="1.5" fill="white" opacity="0.95"/>
            <ellipse cx="62.2" cy="47.2" rx="1.8" ry="1.5" fill="white" opacity="0.95"/>
            <ellipse cx="37.5" cy="51" rx="0.7" ry="0.6" fill="white" opacity="0.5"/>
            <ellipse cx="65.5" cy="51" rx="0.7" ry="0.6" fill="white" opacity="0.5"/>
          </>
        )}

        {/* Nose */}
        <ellipse cx="50" cy="62" rx="7.5" ry="5.5" fill="#1a1a1a"/>
        <ellipse cx="50" cy="60" rx="4.5" ry="3" fill="#333" opacity="0.5"/>
        <ellipse cx="47" cy="60" rx="1.8" ry="1.2" fill="white" opacity="0.35"/>
        <ellipse cx="46" cy="63.5" rx="2" ry="1.5" fill="#111" opacity="0.6"/>
        <ellipse cx="54" cy="63.5" rx="2" ry="1.5" fill="#111" opacity="0.6"/>

        {/* Mouth */}
        {ballPhase === 2
          ? <path d="M44 70 Q50 66 56 70" stroke="#e8a0a0" strokeWidth="2" fill="none" strokeLinecap="round"/>
          : <path d="M42 69 Q50 75 58 69" stroke="#e8a0a0" strokeWidth="2" fill="none" strokeLinecap="round"/>
        }
        {ballPhase !== 2 && <ellipse cx="50" cy="72" rx="7" ry="4" fill="#ffb3b3" opacity="0.55"/>}

        {/* Happy blush */}
        {ballPhase === 0 && <>
          <ellipse cx="26" cy="58" rx="8" ry="4.5" fill="#fca5a5" opacity="0.3"/>
          <ellipse cx="74" cy="58" rx="8" ry="4.5" fill="#fca5a5" opacity="0.3"/>
        </>}

        {/* Bow */}
        {accessories.bow && (
          <g transform="translate(50, 90)">
            <path d="M-11,-4 Q-5.5,0 0,0 Q-5.5,0 -11,4 Z" fill="#3b82f6"/>
            <path d="M11,-4 Q5.5,0 0,0 Q5.5,0 11,4 Z" fill="#3b82f6"/>
            <circle cx="0" cy="0" r="2.5" fill="#60a5fa"/>
            <circle cx="0" cy="0" r="1.2" fill="white" opacity="0.8"/>
          </g>
        )}

        {/* Headset */}
        {accessories.headset && (
          <g>
            <path d="M21 37 Q50 17 79 37" stroke="#374151" strokeWidth="3" fill="none"/>
            <rect x="15" y="35" width="10" height="9" rx="3" fill="#1f2937"/>
            <rect x="75" y="35" width="10" height="9" rx="3" fill="#1f2937"/>
            <rect x="19" y="38" width="4" height="4" rx="1" fill="#f59e0b"/>
            <rect x="77" y="38" width="4" height="4" rx="1" fill="#f59e0b"/>
          </g>
        )}

        {/* Legs */}
        <rect x="28" y="140" width="18" height="20" rx="8" fill="#f0ece4"/>
        <rect x="54" y="140" width="18" height="20" rx="8" fill="#f0ece4"/>
        <ellipse cx="37" cy="160" rx="10" ry="6" fill="#e8e0cc"/>
        <ellipse cx="63" cy="160" rx="10" ry="6" fill="#e8e0cc"/>
        <ellipse cx="37" cy="163" rx="7" ry="3" fill="#e8c8b0" opacity="0.6"/>
        <ellipse cx="63" cy="163" rx="7" ry="3" fill="#e8c8b0" opacity="0.6"/>

        {/* White aura */}
        <ellipse cx="50" cy="163" rx="26" ry="4" fill="white" opacity="0.07"/>
      </svg>
    </div>
  )
}
// ===================== WALKING LOADING SCREEN =====================
// Side-view walking animation with scene-specific props

function WalkingLoadingScreen({ category, companion }) {
  const [phase, setPhase] = useState(0)
  // phases: 0=walking in, 1=clumsy interaction, 2=victory

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1200)
    const t2 = setTimeout(() => setPhase(2), 2200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const isKuro = companion === 'kuro'
  const name = isKuro ? 'Kuro' : 'Shiro'
  const accent = {
    drainage: '#3b82f6', streetlight: '#f59e0b',
    waterleak: '#06b6d4', powergrid: '#eab308', other: '#a855f7'
  }[category?.id] || '#22d3ee'

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#060a12', zIndex: 200,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes sparkleFloat { 0%{transform:translate(0,0) scale(0);opacity:1} 100%{transform:translate(var(--tx),var(--ty)) scale(1.2);opacity:0} }
        @keyframes walkIn { 0%{transform:translateX(-180px)} 100%{transform:translateX(0px)} }
        @keyframes bodyBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes legSwingFront { 0%,100%{transform:rotate(-25deg)} 50%{transform:rotate(25deg)} }
        @keyframes legSwingBack { 0%,100%{transform:rotate(25deg)} 50%{transform:rotate(-25deg)} }
        @keyframes tailWalkKuro { 0%,100%{transform:rotate(-10deg)} 50%{transform:rotate(20deg)} }
        @keyframes tailWalkShiro { 0%,100%{transform:rotate(-30deg)} 50%{transform:rotate(30deg)} }
        @keyframes earBounce { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(-8deg)} }

        /* Clumsy animations */
        @keyframes fallInHole { 0%{transform:translateY(0) rotate(0)} 40%{transform:translateY(20px) rotate(-30deg)} 70%{transform:translateY(40px) rotate(-60deg) scaleY(0.3)} 100%{transform:translateY(40px) rotate(-60deg) scaleY(0.3)} }
        @keyframes getZapped { 0%{transform:rotate(0) scale(1)} 10%{transform:rotate(-15deg) scale(1.1)} 20%{transform:rotate(15deg) scale(1.15)} 30%{transform:rotate(-20deg) scale(1.1)} 40%{transform:rotate(20deg) scale(1.2)} 50%{transform:rotate(-10deg) scale(1.1)} 60%{transform:rotate(10deg) scale(1.05)} 100%{transform:rotate(0) scale(1)} }
        @keyframes slip { 0%{transform:rotate(0) translateX(0)} 30%{transform:rotate(20deg) translateX(10px)} 60%{transform:rotate(45deg) translateX(20px) translateY(15px)} 80%{transform:rotate(30deg) translateX(15px) translateY(10px)} 100%{transform:rotate(45deg) translateX(20px) translateY(15px)} }
        @keyframes powerShake { 0%,100%{transform:translateX(0) scale(1)} 10%{transform:translateX(-8px) scale(1.05)} 20%{transform:translateX(8px) scale(1.1)} 30%{transform:translateX(-6px) scale(1.08)} 40%{transform:translateX(6px) scale(1.12)} 50%{transform:translateX(-4px) scale(1.1)} 60%{transform:translateX(4px) scale(1.08)} 70%{transform:translateX(-2px) scale(1.05)} 80%{transform:translateX(2px) scale(1.02)} }
        @keyframes confusedSpin { 0%{transform:rotate(0)} 25%{transform:rotate(-15deg)} 50%{transform:rotate(15deg)} 75%{transform:rotate(-10deg)} 100%{transform:rotate(0)} }

        /* Victory */
        @keyframes victoryJump { 0%,100%{transform:translateY(0) scale(1)} 30%{transform:translateY(-30px) scale(1.1)} 60%{transform:translateY(-15px) scale(1.05)} 80%{transform:translateY(-25px) scale(1.08)} }

        /* Scene props */
        @keyframes bulbFlicker { 0%,100%{opacity:1;filter:drop-shadow(0 0 8px #fbbf24)} 25%{opacity:0.3} 50%{opacity:0.8} 75%{opacity:0.2} }
        @keyframes waterRipple { 0%,100%{transform:scaleX(1)} 50%{transform:scaleX(1.15)} }
        @keyframes wireZap { 0%,100%{stroke:#eab308;filter:drop-shadow(0 0 3px #eab308)} 50%{stroke:#ffffff;filter:drop-shadow(0 0 12px #ffffff)} }
        @keyframes groundShake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-3px)} 75%{transform:translateX(3px)} }
        @keyframes popIn { 0%{transform:scale(0) translateY(10px);opacity:0} 100%{transform:scale(1) translateY(0);opacity:1} }
        @keyframes dotBounce { 0%,80%,100%{transform:scale(0.6);opacity:0.4} 40%{transform:scale(1);opacity:1} }
      `}</style>

      {/* Soft accent glow */}
      <div style={{
        position: 'absolute', width: '300px', height: '300px', borderRadius: '50%',
        background: `radial-gradient(circle, ${accent}18 0%, transparent 70%)`,
        top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
      }}/>

      {/* SCENE CONTAINER */}
      <div style={{
        position: 'relative', width: '320px', height: '200px',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      }}>

        {/* Ground line */}
        <div style={{
          position: 'absolute', bottom: '30px', left: 0, right: 0,
          height: '2px', background: `${accent}33`,
          animation: phase === 1 && category?.id === 'powergrid' ? 'groundShake 0.1s linear infinite' : 'none',
        }}/>

        {/* ===== SCENE PROPS ===== */}

        {/* DRAINAGE: Manhole */}
        {category?.id === 'drainage' && (
          <div style={{ position: 'absolute', right: '60px', bottom: '28px', animation: 'popIn 0.3s ease-out' }}>
            <svg width="60" height="30" viewBox="0 0 60 30">
              <ellipse cx="30" cy="15" rx="28" ry="12" fill="#1e293b" stroke={accent} strokeWidth="2"/>
              <ellipse cx="30" cy="12" rx="22" ry="9" fill="#0a0f1a" stroke={accent} strokeWidth="1" opacity="0.8"/>
              {/* Grid pattern */}
              <line x1="30" y1="3" x2="30" y2="21" stroke={accent} strokeWidth="1" opacity="0.4"/>
              <line x1="10" y1="12" x2="50" y2="12" stroke={accent} strokeWidth="1" opacity="0.4"/>
              <text x="30" y="17" fontSize="10" textAnchor="middle" fill={accent} opacity="0.6">⚠</text>
            </svg>
            {/* Water dripping from hole */}
            {phase >= 1 && [0,1,2].map(i => (
              <div key={i} style={{
                position: 'absolute', top: '20px', left: `${18+i*10}px`,
                width: '4px', height: '8px', borderRadius: '50%',
                background: accent, opacity: 0.6,
                animation: `dotBounce 0.8s ease-in-out infinite`,
                animationDelay: `${i*0.2}s`,
              }}/>
            ))}
          </div>
        )}

        {/* STREETLIGHT: Lamp post */}
        {category?.id === 'streetlight' && (
          <div style={{ position: 'absolute', right: '50px', bottom: '30px', animation: 'popIn 0.3s ease-out' }}>
            <svg width="50" height="120" viewBox="0 0 50 120">
              {/* Pole */}
              <rect x="22" y="30" width="6" height="90" fill="#334155"/>
              {/* Arm */}
              <path d="M25 30 Q25 10 40 8" stroke="#334155" strokeWidth="5" fill="none"/>
              {/* Bulb housing */}
              <rect x="32" y="2" width="16" height="10" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1"/>
              {/* Bulb */}
              <ellipse cx="40" cy="7" rx="5" ry="4"
                fill={phase >= 1 ? '#fbbf24' : '#475569'}
                style={{ animation: phase === 1 ? 'bulbFlicker 0.3s linear infinite' : 'none' }}/>
              {phase >= 2 && <ellipse cx="40" cy="7" rx="8" ry="6" fill="#fbbf24" opacity="0.3"/>}
            </svg>
          </div>
        )}

        {/* WATERLEAK: Puddle */}
        {category?.id === 'waterleak' && (
          <div style={{ position: 'absolute', right: '40px', bottom: '28px', animation: 'popIn 0.3s ease-out' }}>
            <svg width="80" height="30" viewBox="0 0 80 30">
              <ellipse cx="40" cy="18" rx="35" ry="10" fill={accent} opacity="0.2"
                style={{ animation: 'waterRipple 1s ease-in-out infinite' }}/>
              <ellipse cx="40" cy="16" rx="28" ry="7" fill={accent} opacity="0.35"
                style={{ animation: 'waterRipple 0.8s ease-in-out infinite reverse' }}/>
              {/* Drip from above */}
              {[0,1,2].map(i => (
                <ellipse key={i} cx={25+i*15} cy={2+i*3} rx="2" ry="3" fill={accent} opacity="0.6"/>
              ))}
            </svg>
          </div>
        )}

        {/* POWERGRID: Electrical box + wires */}
        {category?.id === 'powergrid' && (
          <div style={{ position: 'absolute', right: '40px', bottom: '30px', animation: 'popIn 0.3s ease-out' }}>
            <svg width="70" height="80" viewBox="0 0 70 80">
              {/* Pole */}
              <rect x="30" y="20" width="8" height="60" fill="#334155"/>
              {/* Box */}
              <rect x="18" y="10" width="32" height="22" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="1.5"/>
              <text x="34" y="25" fontSize="12" textAnchor="middle" fill="#eab308">⚡</text>
              {/* Hanging wire */}
              <path d="M10 15 Q20 25 34 20" stroke="#eab308" strokeWidth="2" fill="none"
                style={{ animation: phase >= 1 ? 'wireZap 0.2s linear infinite' : 'none' }}/>
              {/* Sparks */}
              {phase === 1 && [0,1,2,3].map(i => (
                <text key={i} x={8+i*6} y={12+i*4} fontSize="8" fill="#fbbf24"
                  style={{ animation: `dotBounce 0.4s ease-in-out infinite`, animationDelay: `${i*0.1}s` }}>
                  ✦
                </text>
              ))}
            </svg>
          </div>
        )}

        {/* OTHER: Question marks */}
        {category?.id === 'other' && (
          <div style={{ position: 'absolute', right: '30px', bottom: '40px' }}>
            {['?', '!', '?'].map((c, i) => (
              <div key={i} style={{
                position: 'absolute',
                left: `${i * 22}px`, top: `${-i * 15}px`,
                fontSize: '24px', fontWeight: '900',
                color: accent, opacity: 0.6,
                animation: `dotBounce 1s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}>{c}</div>
            ))}
          </div>
        )}

        {/* ===== CHARACTER ===== */}
        <div style={{
          position: 'absolute',
          bottom: '28px',
          left: phase === 0 ? undefined : '60px',
          animation: phase === 0 ? 'walkIn 1.0s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards' : 'none',
          // After walking in, position at left:60px
          transform: phase === 0 ? 'translateX(-180px)' : 'translateX(0)',
        }}>
          {isKuro
            ? <KuroSideView phase={phase} categoryId={category?.id} />
            : <ShiroSideView phase={phase} categoryId={category?.id} />
          }
        </div>

        {/* Victory sparkles */}
        {phase === 2 && [...Array(10)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: `${10 + Math.random() * 70}%`,
            left: `${10 + Math.random() * 80}%`,
            fontSize: '14px',
            animation: `sparkleFloat ${0.6 + i * 0.12}s ease-out forwards`,
            '--tx': `${(Math.random() - 0.5) * 80}px`,
            '--ty': `${-30 - Math.random() * 50}px`,
            animationDelay: `${i * 0.06}s`,
            pointerEvents: 'none',
          }}>{['✨','⭐','💫','🌟'][i % 4]}</div>
        ))}
      </div>

      {/* Text */}
      <div style={{ textAlign: 'center', marginTop: '16px', zIndex: 1 }}>
        <p style={{ color: accent, fontSize: '15px', fontWeight: '600', margin: '0 0 4px' }}>
          {phase === 0 && `${name} is on the way...`}
          {phase === 1 && {
            drainage: `Whoops! Fell into the manhole! 😵`,
            streetlight: `ZAP! That bulb is alive! ⚡`,
            waterleak: `Slipped in the puddle! 💦`,
            powergrid: `Live wire! ABORT! 😱`,
            other: `What's going on here?! 🤔`,
          }[category?.id]}
          {phase === 2 && `Issue reported! ${name} got it! 🏆`}
        </p>
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '8px' }}>
          {[0,1,2].map(i => (
            <div key={i} style={{
              width: '6px', height: '6px', borderRadius: '50%',
              background: phase === 2 ? '#22c55e' : accent,
              opacity: phase === 2 ? 1 : 0.7,
              animation: phase < 2 ? `dotBounce 1.2s ease-in-out infinite` : 'none',
              animationDelay: `${i * 0.18}s`,
              transition: 'background 0.3s',
            }}/>
          ))}
        </div>
      </div>
    </div>
  )
}

// ===== KURO SIDE VIEW =====
function KuroSideView({ phase, categoryId }) {
  const bodyAnim = {
    0: 'bodyBob 0.4s ease-in-out infinite',
    1: {
      drainage: 'fallInHole 0.8s ease-in forwards',
      streetlight: 'getZapped 0.6s ease-in-out infinite',
      waterleak: 'slip 0.8s ease-in forwards',
      powergrid: 'powerShake 0.15s linear infinite',
      other: 'confusedSpin 1s ease-in-out infinite',
    }[categoryId] || 'confusedSpin 1s ease-in-out infinite',
    2: 'victoryJump 0.6s ease-in-out infinite',
  }[phase]

  return (
    <svg width="80" height="100" viewBox="0 0 80 100" style={{ overflow: 'visible' }}>
      <style>{`
        @keyframes bodyBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
        @keyframes fallInHole { 0%{transform:translateY(0) rotate(0)} 50%{transform:translateY(20px) rotate(-20deg)} 100%{transform:translateY(45px) rotate(-40deg) scaleY(0.4)} }
        @keyframes getZapped { 0%{transform:rotate(0) scale(1)} 20%{transform:rotate(-15deg) scale(1.1)} 40%{transform:rotate(15deg) scale(1.15)} 60%{transform:rotate(-10deg) scale(1.1)} 80%{transform:rotate(10deg) scale(1.05)} 100%{transform:rotate(0) scale(1)} }
        @keyframes slip { 0%{transform:rotate(0)} 50%{transform:rotate(35deg) translateX(15px) translateY(10px)} 100%{transform:rotate(40deg) translateX(18px) translateY(14px)} }
        @keyframes powerShake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
        @keyframes confusedSpin { 0%,100%{transform:rotate(0)} 30%{transform:rotate(-12deg)} 70%{transform:rotate(12deg)} }
        @keyframes victoryJump { 0%,100%{transform:translateY(0) scale(1)} 40%{transform:translateY(-22px) scale(1.08)} 70%{transform:translateY(-10px) scale(1.04)} }
        @keyframes legSwingFront { 0%,100%{transform:rotate(-20deg)} 50%{transform:rotate(20deg)} }
        @keyframes legSwingBack { 0%,100%{transform:rotate(20deg)} 50%{transform:rotate(-20deg)} }
        @keyframes tailSwing { 0%,100%{transform:rotate(-15deg)} 50%{transform:rotate(25deg)} }
        @keyframes earFlap { 0%,100%{transform:rotate(0)} 50%{transform:rotate(-10deg)} }
      `}</style>

      <g style={{ animation: bodyAnim, transformOrigin: '40px 75px' }}>
        {/* Tail */}
        <path d="M15 65 Q5 50 8 35" stroke="#1a1a2e" strokeWidth="8" fill="none" strokeLinecap="round"
          style={{ animation: phase === 0 ? 'tailSwing 0.4s ease-in-out infinite' : 'none', transformOrigin: '15px 65px' }}/>
        <path d="M15 65 Q5 50 8 35" stroke="#2d2d4e" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.6"/>

        {/* Back leg */}
        <rect x="18" y="72" width="10" height="22" rx="5" fill="#0f0f1a"
          style={{ animation: phase === 0 ? 'legSwingBack 0.4s ease-in-out infinite' : 'none', transformOrigin: '23px 72px' }}/>
        <ellipse cx="23" cy="94" rx="7" ry="4" fill="#0f0f1a"/>

        {/* Body */}
        <ellipse cx="35" cy="68" rx="22" ry="18" fill="#0f0f1a"/>
        <ellipse cx="35" cy="65" rx="16" ry="13" fill="#1e1e3a" opacity="0.5"/>

        {/* Neck fluff */}
        <ellipse cx="50" cy="55" rx="14" ry="10" fill="#161626"/>

        {/* Front leg */}
        <rect x="44" y="72" width="10" height="22" rx="5" fill="#0f0f1a"
          style={{ animation: phase === 0 ? 'legSwingFront 0.4s ease-in-out infinite' : 'none', transformOrigin: '49px 72px' }}/>
        <ellipse cx="49" cy="94" rx="7" ry="4" fill="#0f0f1a"/>

        {/* Head */}
        <ellipse cx="55" cy="40" rx="18" ry="16" fill="#0f0f1a"/>

        {/* Ear */}
        <polygon points="48,28 53,14 60,28" fill="#0f0f1a"
          style={{ animation: phase === 0 ? 'earFlap 0.4s ease-in-out infinite' : 'none', transformOrigin: '54px 28px' }}/>
        <polygon points="50,28 53,18 58,28" fill="#2d1b4e" opacity="0.7"/>
        {/* Ear tip */}
        <line x1="53" y1="14" x2="51" y2="9" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>

        {/* Eyes - side view */}
        {phase < 2
          ? <ellipse cx="64" cy="38" rx="5" ry="4.5" fill="#f5a623"/>
          : <path d="M60 38 Q64 33 68 38" stroke="#f5a623" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        }
        {phase < 2 && <ellipse cx="64" cy="38" rx="3" ry="3" fill="#7c3aed"/>}
        {phase < 2 && <ellipse cx="64" cy="38" rx="1.5" ry="2" fill="#1a0a2e"/>}
        {phase < 2 && <ellipse cx="62.5" cy="36.5" rx="1" ry="0.9" fill="white" opacity="0.9"/>}

        {/* Nose */}
        <ellipse cx="71" cy="43" rx="4" ry="3" fill="#c084a0"/>

        {/* Whiskers */}
        <line x1="72" y1="42" x2="80" y2="40" stroke="#e2e8f0" strokeWidth="1" opacity="0.6"/>
        <line x1="72" y1="44" x2="80" y2="44" stroke="#e2e8f0" strokeWidth="1" opacity="0.6"/>

        {/* Mouth */}
        {phase === 2
          ? <path d="M67 47 Q70 51 73 47" stroke="#9d4e6f" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          : <path d="M68 47 Q70 45 72 47" stroke="#9d4e6f" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        }

        {/* Dizzy stars when clumsy */}
        {phase === 1 && ['⭐','💫','✦'].map((s, i) => (
          <text key={i} x={55+i*8} y={22+i*5} fontSize="10" fill="#ffd700" opacity="0.9"
            style={{ animation: `victoryJump 0.5s ease-in-out infinite`, animationDelay: `${i*0.15}s` }}>
            {s}
          </text>
        ))}

        {/* Victory effect */}
        {phase === 2 && <text x="65" y="20" fontSize="16" textAnchor="middle">🏆</text>}

        {/* Fur static spikes when zapped */}
        {phase === 1 && categoryId === 'powergrid' && [0,1,2,3,4].map(i => (
          <line key={i}
            x1={28+i*6} y1={52} x2={26+i*6} y2={44}
            stroke="#eab308" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
        ))}
      </g>
    </svg>
  )
}

// ===== SHIRO SIDE VIEW =====
function ShiroSideView({ phase, categoryId }) {
  const bodyAnim = {
    0: 'bodyBobShiro 0.35s ease-in-out infinite',
    1: {
      drainage: 'fallInHole 0.8s ease-in forwards',
      streetlight: 'getZapped 0.5s ease-in-out infinite',
      waterleak: 'slip 0.8s ease-in forwards',
      powergrid: 'powerShake 0.12s linear infinite',
      other: 'confusedSpinShiro 1s ease-in-out infinite',
    }[categoryId] || 'confusedSpinShiro 1s ease-in-out infinite',
    2: 'victoryJumpShiro 0.5s ease-in-out infinite',
  }[phase]

  return (
    <svg width="90" height="100" viewBox="0 0 90 100" style={{ overflow: 'visible' }}>
      <style>{`
        @keyframes bodyBobShiro { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes confusedSpinShiro { 0%,100%{transform:rotate(0)} 30%{transform:rotate(-10deg)} 70%{transform:rotate(10deg)} }
        @keyframes victoryJumpShiro { 0%,100%{transform:translateY(0) scale(1)} 40%{transform:translateY(-25px) scale(1.1)} 70%{transform:translateY(-12px) scale(1.05)} }
        @keyframes labTailWag { 0%,100%{transform:rotate(-35deg)} 50%{transform:rotate(35deg)} }
        @keyframes labLegFront { 0%,100%{transform:rotate(-18deg)} 50%{transform:rotate(18deg)} }
        @keyframes labLegBack { 0%,100%{transform:rotate(18deg)} 50%{transform:rotate(-18deg)} }
        @keyframes labEarFlap { 0%,100%{transform:rotate(0deg) scaleY(1)} 50%{transform:rotate(-5deg) scaleY(0.95)} }
      `}</style>

      <g style={{ animation: bodyAnim, transformOrigin: '45px 78px' }}>
        {/* Tail - happy lab tail, held high */}
        <path d="M18 62 Q8 44 14 28" stroke="#f0ece4" strokeWidth="9" fill="none" strokeLinecap="round"
          style={{ animation: phase === 0 ? 'labTailWag 0.35s ease-in-out infinite' : phase === 2 ? 'labTailWag 0.2s ease-in-out infinite' : 'none', transformOrigin: '18px 62px' }}/>
        <path d="M18 62 Q8 44 14 28" stroke="#e8e0d0" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.5"/>

        {/* Back leg */}
        <rect x="20" y="74" width="12" height="20" rx="6" fill="#f0ece4"
          style={{ animation: phase === 0 ? 'labLegBack 0.35s ease-in-out infinite' : 'none', transformOrigin: '26px 74px' }}/>
        <ellipse cx="26" cy="94" rx="8" ry="5" fill="#e8e0cc"/>

        {/* Body - stocky lab body */}
        <rect x="18" y="56" width="46" height="28" rx="12" fill="#f4f0e8"/>
        <ellipse cx="41" cy="56" rx="23" ry="11" fill="#f4f0e8"/>
        <ellipse cx="41" cy="84" rx="23" ry="9" fill="#f4f0e8"/>
        {/* Body highlight */}
        <ellipse cx="30" cy="62" rx="7" ry="10" fill="white" opacity="0.35" transform="rotate(-10 30 62)"/>

        {/* Collar */}
        <rect x="50" y="52" width="18" height="7" rx="3.5" fill="#1e3a5f"/>
        <rect x="51" y="53" width="16" height="5" rx="2.5" fill="#3b82f6" opacity="0.8"/>
        <circle cx="59" cy="56" r="2.5" fill="#fbbf24"/>

        {/* Front leg */}
        <rect x="52" y="74" width="12" height="20" rx="6" fill="#f4f0e8"
          style={{ animation: phase === 0 ? 'labLegFront 0.35s ease-in-out infinite' : 'none', transformOrigin: '58px 74px' }}/>
        <ellipse cx="58" cy="94" rx="8" ry="5" fill="#e8e0cc"/>

        {/* Head - broad lab head */}
        <ellipse cx="68" cy="42" rx="18" ry="16" fill="#f4f0e8"/>
        {/* Head highlight */}
        <ellipse cx="62" cy="34" rx="7" ry="6" fill="white" opacity="0.4"/>

        {/* Floppy ear */}
        <ellipse cx="60" cy="40" rx="8" ry="14" fill="#ddd0b8" transform="rotate(10 60 40)"
          style={{ animation: phase === 0 ? 'labEarFlap 0.35s ease-in-out infinite' : 'none', transformOrigin: '60px 32px' }}/>
        <ellipse cx="60" cy="40" rx="5" ry="10" fill="#c8bca0" opacity="0.5" transform="rotate(10 60 40)"/>

        {/* Muzzle */}
        <rect x="72" y="44" width="16" height="12" rx="6" fill="#e8e0cc"/>
        <ellipse cx="80" cy="44" rx="8" ry="5" fill="#ede8dc"/>

        {/* Eye */}
        {phase < 2
          ? <ellipse cx="74" cy="38" rx="5.5" ry="5" fill="#7a4a1e"/>
          : <path d="M70 38 Q74 32 78 38" stroke="#c8822a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        }
        {phase < 2 && <ellipse cx="74" cy="38" rx="3.5" ry="3.5" fill="#c8822a"/>}
        {phase < 2 && <ellipse cx="74" cy="38" rx="2" ry="2.5" fill="#1a0a00"/>}
        {phase < 2 && <ellipse cx="72.5" cy="36.5" rx="1.3" ry="1.2" fill="white" opacity="0.95"/>}

        {/* Nose */}
        <ellipse cx="85" cy="49" rx="4.5" ry="3.5" fill="#1a1a1a"/>
        <ellipse cx="83.5" cy="47.5" rx="1.5" ry="1" fill="white" opacity="0.4"/>

        {/* Mouth */}
        {phase === 2
          ? <path d="M80 53 Q84 57 87 53" stroke="#e8a0a0" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          : <path d="M80 53 Q83 51 86 53" stroke="#e8a0a0" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        }

        {/* Dizzy stars */}
        {phase === 1 && ['⭐','💫','✦'].map((s, i) => (
          <text key={i} x={62+i*9} y={22+i*5} fontSize="11" fill="#ffd700" opacity="0.9"
            style={{ animation: `victoryJumpShiro 0.4s ease-in-out infinite`, animationDelay: `${i*0.15}s` }}>
            {s}
          </text>
        ))}

        {/* Victory */}
        {phase === 2 && <text x="72" y="18" fontSize="16" textAnchor="middle">🏆</text>}

        {/* Fur static */}
        {phase === 1 && categoryId === 'powergrid' && [0,1,2,3,4,5].map(i => (
          <line key={i}
            x1={22+i*5} y1={55} x2={20+i*5} y2={47}
            stroke="#eab308" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
        ))}
      </g>
    </svg>
  )
}
// ===================== COMPANION SELECT =====================
function CompanionSelect({ onSelect }) {
  const [hovered, setHovered] = useState(null)

  return (
    <div style={{
      minHeight: '100vh', background: '#080c14', color: '#f1f5f9',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', -apple-system, sans-serif", padding: '24px',
    }}>
      <style>{`@keyframes floatUp { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }`}</style>
      
      <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '8px', textAlign: 'center', letterSpacing: '-1px' }}>
        🏛️ Adi Seva
      </h1>
      <p style={{ color: '#64748b', marginBottom: '48px', textAlign: 'center', fontSize: '15px' }}>
        Choose your civic companion
      </p>

      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { id: 'kuro', name: 'Kuro', type: 'Black Maine Coon', desc: 'Dark, mysterious & precise', color: '#22d3ee' },
          { id: 'shiro', name: 'Shiro', type: 'White Labrador', desc: 'Bright, noble & loyal', color: '#f59e0b' },
        ].map(c => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            onMouseEnter={() => setHovered(c.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              padding: '32px 24px', borderRadius: '20px',
              border: `2px solid ${hovered === c.id ? c.color : '#1e293b'}`,
              background: hovered === c.id ? `${c.color}11` : '#0f172a',
              cursor: 'pointer', color: '#f1f5f9',
              transition: 'all 0.2s ease',
              transform: hovered === c.id ? 'translateY(-8px)' : 'translateY(0)',
              boxShadow: hovered === c.id ? `0 20px 40px ${c.color}22` : 'none',
              minWidth: '180px',
            }}
          >
            <div style={{ animation: 'floatUp 3s ease-in-out infinite', animationDelay: c.id === 'shiro' ? '1.5s' : '0s' }}>
              {c.id === 'kuro' ? <KuroIdleScene level={1} /> : <ShiroIdleScene level={1} />}
            </div>
            <p style={{ fontSize: '22px', fontWeight: '800', margin: '8px 0 4px', color: c.color }}>{c.name}</p>
            <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0 }}>{c.type}</p>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0' }}>{c.desc}</p>
          </button>
        ))}
      </div>

      <p style={{ color: '#334155', fontSize: '12px', marginTop: '32px' }}>
        Your companion guides you through every civic report ✨
      </p>
    </div>
  )
}

// ===================== XP BAR =====================
function XPBar({ xp, compact = false }) {
  const level = getLevel(xp)
  const nextLevel = getNextLevel(xp)
  const progress = nextLevel
    ? ((xp - level.xpRequired) / (nextLevel.xpRequired - level.xpRequired)) * 100
    : 100

  if (compact) return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '11px', color: level.color, fontWeight: '700' }}>Lv.{level.level}</span>
      <div style={{ width: '80px', height: '4px', background: '#1e293b', borderRadius: '2px' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: level.color, borderRadius: '2px', transition: 'width 0.5s ease' }} />
      </div>
      <span style={{ fontSize: '11px', color: '#64748b' }}>{xp}xp</span>
    </div>
  )

  return (
    <div style={{ padding: '16px', borderRadius: '12px', background: '#0f172a', border: '1px solid #1e293b' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontWeight: '700', color: level.color }}>Level {level.level} — {level.name}</span>
        <span style={{ fontSize: '13px', color: '#64748b' }}>{xp} XP</span>
      </div>
      <div style={{ height: '8px', background: '#1e293b', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: `linear-gradient(90deg, ${level.color}, ${level.color}88)`, borderRadius: '4px', transition: 'width 0.8s ease' }} />
      </div>
      {nextLevel && <div style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>{nextLevel.xpRequired - xp} XP to {nextLevel.name}</div>}
    </div>
  )
}

// ===================== DASHBOARD SCREEN =====================
function DashboardScreen({ companion, xp, reports, darkMode }) {
  const level = getLevel(xp)
  const CompComponent = companion === 'kuro' ? KuroSVG : ShiroSVG
  const name = companion === 'kuro' ? 'Kuro' : 'Shiro'

  const mockIssues = [
    { id: 1, label: 'Water Leak', loc: 'Anna Nagar', votes: 3, status: 'unverified' },
    { id: 2, label: 'Power Outage', loc: 'T. Nagar', votes: 7, status: 'unverified' },
    { id: 3, label: 'Drainage Fixed', loc: 'Adyar', votes: 12, status: 'resolved' },
  ]

  const cardBg = darkMode ? '#0f172a' : '#ffffff'
  const borderColor = darkMode ? '#1e293b' : '#e2e8f0'

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 24px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '24px' }}>
        🎮 Civic Dashboard
      </h2>

      {/* Companion card */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '200px', padding: '24px', borderRadius: '16px', background: cardBg, border: `1px solid ${borderColor}`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <CompComponent mood={xp > 0 ? 'victory' : 'idle'} level={level.level} sparkle={xp > 0} />
          <p style={{ fontWeight: '700', fontSize: '18px', color: level.color }}>{name}</p>
          <XPBar xp={xp} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', width: '100%' }}>
            <div style={{ textAlign: 'center', padding: '8px', borderRadius: '8px', background: darkMode ? '#0a0f1a' : '#f8fafc' }}>
              <p style={{ fontSize: '22px', fontWeight: '800', color: '#22d3ee', margin: 0 }}>{reports}</p>
              <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>Reports</p>
            </div>
            <div style={{ textAlign: 'center', padding: '8px', borderRadius: '8px', background: darkMode ? '#0a0f1a' : '#f8fafc' }}>
              <p style={{ fontSize: '22px', fontWeight: '800', color: level.color, margin: 0 }}>Lv.{level.level}</p>
              <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>Level</p>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div style={{ flex: '1', minWidth: '200px', padding: '24px', borderRadius: '16px', background: cardBg, border: `1px solid ${borderColor}` }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>🏆 Top Citizens</h3>
          {[
            { rank: 1, name: 'Priya R.', xp: 1240, badge: '👑' },
            { rank: 2, name: 'Arjun K.', xp: 980, badge: '🥈' },
            { rank: 3, name: 'Meera S.', xp: 760, badge: '🥉' },
            { rank: '?', name: 'You', xp: xp, badge: '⭐' },
          ].map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0', borderBottom: i < 3 ? `1px solid ${borderColor}` : 'none' }}>
              <span style={{ fontSize: '18px' }}>{p.badge}</span>
              <span style={{ flex: 1, fontSize: '14px', fontWeight: p.name === 'You' ? '700' : '400', color: p.name === 'You' ? '#22d3ee' : 'inherit' }}>{p.name}</span>
              <span style={{ fontSize: '13px', color: '#64748b' }}>{p.xp} XP</span>
            </div>
          ))}
        </div>
      </div>

      {/* Predictive alert */}
      <div style={{ padding: '16px 20px', borderRadius: '12px', background: '#1a0a2e', border: '1px solid #6d28d9', marginBottom: '24px' }}>
        <p style={{ margin: 0, fontSize: '13px', color: '#c084fc' }}>
          🤖 <strong>Predictive Alert:</strong> High cluster density of aging water pipes flagged across Zone 4 based on report escalation frequency. Municipal action recommended.
        </p>
      </div>

      {/* Recent reports */}
      <div style={{ padding: '24px', borderRadius: '16px', background: cardBg, border: `1px solid ${borderColor}` }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>📋 Community Reports</h3>
        {mockIssues.map(issue => (
          <div key={issue.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: `1px solid ${borderColor}` }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: issue.status === 'resolved' ? '#22c55e' : '#ef4444', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: '600', fontSize: '14px' }}>{issue.label}</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>{issue.loc} · {issue.votes} votes</p>
            </div>
            {issue.status === 'resolved'
              ? <span style={{ fontSize: '12px', color: '#22c55e' }}>✓ Resolved</span>
              : <button style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '8px', border: '1px solid #334155', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}>👍 Verify</button>
            }
          </div>
        ))}
      </div>
    </div>
  )
}

// ===================== MAP SCREEN =====================
const mockMapIssues = [
  { id: 1, label: 'Water Leak', loc: 'Anna Nagar', x: 28, y: 35, color: '#ef4444', votes: 3, status: 'unverified' },
  { id: 2, label: 'Power Outage', loc: 'T. Nagar', x: 55, y: 55, color: '#ef4444', votes: 7, status: 'unverified' },
  { id: 3, label: 'Drainage Fixed', loc: 'Adyar', x: 70, y: 30, color: '#22c55e', votes: 12, status: 'resolved' },
  { id: 4, label: 'Street Light', loc: 'Velachery', x: 42, y: 68, color: '#ef4444', votes: 2, status: 'unverified' },
]

// ===================== MAIN APP =====================
export default function App() {
  const [screen, setScreen] = useState('companion')
  const [companion, setCompanion] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [selectedTriage, setSelectedTriage] = useState(null)
  const [aiText, setAiText] = useState('')
  const [aiResult, setAiResult] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [pinDropped, setPinDropped] = useState(false)
  const [hoveredCat, setHoveredCat] = useState(null)
  const [xp, setXp] = useState(0)
  const [reports, setReports] = useState(0)
  const [showXpGain, setShowXpGain] = useState(null)
  const [prevLevel, setPrevLevel] = useState(1)

  // Real signed-in Google user (null until they sign in)
  const [user, setUser] = useState(null)

  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential)
      setUser({
        name: decoded.name,
        email: decoded.email,
        avatar: decoded.picture,
      })
    } catch (e) {
      console.error('Failed to decode Google credential', e)
    }
  }

  const addXp = (amount, label) => {
    setXp(prev => {
      const newXp = prev + amount
      const newLevel = getLevel(newXp).level
      if (newLevel > getLevel(prev).level) setPrevLevel(newLevel)
      return newXp
    })
    setShowXpGain(label)
    setTimeout(() => setShowXpGain(null), 2000)
  }

  const handleCompanionSelect = (c) => {
    setCompanion(c)
    setScreen('landing')
  }

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat)
    setSelectedTriage(null)
    setAiResult(null)
    setPinDropped(false)
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setScreen('report')
    }, 2500)
  }

  const handleAIRoute = async () => {
    if (!aiText.trim()) return
    setAiLoading(true)
    setAiResult(null)
    addXp(25, '+25 XP — AI Route!')
    try {
      const prompt = `You are a civic issue routing AI for Indian municipalities. Analyze this issue and respond ONLY in JSON (no markdown):
{
  "severity": "LOW | MEDIUM | HIGH | CRITICAL",
  "department": "department name",
  "summary": "one sentence summary",
  "emergency_number": "relevant municipal helpline",
  "estimated_response": "time estimate",
  "priority_bypass": true/false
}
Issue: "${aiText}"
Category: "${selectedCategory?.label}"
City: "Chennai, Tamil Nadu"`

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      )
      const data = await res.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      const clean = text.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)
      setAiResult(parsed)
    } catch (e) {
      setAiResult({ severity: 'MEDIUM', department: 'Municipal Corporation', summary: 'Issue logged and routed.', emergency_number: '1800-XXX-XXXX', estimated_response: '24-48 hours', priority_bypass: false })
    }
    setAiLoading(false)
  }

  const handleSubmit = () => {
    setReports(r => r + 1)
    addXp(50, '+50 XP — Report Filed!')
    setScreen('map')
  }

  const bgColor = darkMode ? '#080c14' : '#f8fafc'
  const textColor = darkMode ? '#f1f5f9' : '#0f172a'
  const cardBg = darkMode ? '#0f172a' : '#ffffff'
  const borderColor = darkMode ? '#1e293b' : '#e2e8f0'
  const severityColor = { LOW: '#22c55e', MEDIUM: '#f59e0b', HIGH: '#f97316', CRITICAL: '#ef4444' }
  const level = getLevel(xp)
  const CompComponent = companion === 'kuro' ? KuroSVG : ShiroSVG
  const companionName = companion === 'kuro' ? 'Kuro' : 'Shiro'

  if (screen === 'companion') return <CompanionSelect onSelect={handleCompanionSelect} />

  return (
    <div style={{ minHeight: '100vh', background: bgColor, color: textColor, fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <style>{`
        @keyframes xpPop { 0%{transform:translateY(0);opacity:1} 100%{transform:translateY(-40px);opacity:0} }
        @keyframes sparkleFloat { 0%{transform:translate(0,0) scale(0);opacity:1} 100%{transform:translate(var(--tx),var(--ty)) scale(1.2);opacity:0} }
      `}</style>

      {/* XP gain notification */}
      {showXpGain && (
        <div style={{ position: 'fixed', top: '80px', right: '24px', zIndex: 999, background: '#22c55e', color: 'white', padding: '8px 16px', borderRadius: '20px', fontWeight: '700', fontSize: '14px', animation: 'xpPop 2s ease-out forwards' }}>
          {showXpGain}
        </div>
      )}

      {/* Navbar */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 32px', borderBottom: `1px solid ${borderColor}`, background: darkMode ? 'rgba(8,12,20,0.97)' : 'rgba(248,250,252,0.97)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 100 }}>
        {/* LEFT: Logo + Chibi companion */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Mini chibi next to logo */}
          <div style={{ width: '44px', height: '44px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ transform: 'scale(0.28)', transformOrigin: 'center bottom', position: 'absolute', bottom: '-8px' }}>
              <CompComponent mood="idle" level={level.level} />
            </div>
          </div>
          <div>
            <span style={{ fontSize: '18px', fontWeight: '800', color: '#22d3ee', letterSpacing: '-0.5px', display: 'block', lineHeight: 1 }}>🏛️ Adi Seva</span>
            <span style={{ fontSize: '10px', color: '#475569', letterSpacing: '0.5px' }}>{companionName} · Lv.{level.level} {level.name}</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* XP bar in center */}
          <XPBar xp={xp} compact />
          <div style={{ display: 'flex', gap: '8px' }}>
            {['landing', 'map', 'dashboard'].map(s => (
              <button key={s} onClick={() => setScreen(s)} style={{ padding: '6px 12px', borderRadius: '8px', border: `1px solid ${screen === s ? '#22d3ee' : borderColor}`, background: screen === s ? '#22d3ee22' : 'transparent', color: screen === s ? '#22d3ee' : textColor, fontSize: '12px', cursor: 'pointer', fontWeight: screen === s ? '700' : '400' }}>
                {s === 'landing' ? '🏠' : s === 'map' ? '🗺️' : '🎮'}
              </button>
            ))}
          </div>
          <button onClick={() => setDarkMode(!darkMode)} style={{ padding: '6px 12px', borderRadius: '20px', border: `1px solid ${borderColor}`, background: 'transparent', color: textColor, fontSize: '12px', cursor: 'pointer' }}>
            {darkMode ? '☀️' : '🌙'}
          </button>

          {/* Google Sign-In / Avatar */}
          {user ? (
            <div title={`${user.name} (${user.email})`} style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', border: '2px solid #22d3ee' }}>
              <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ) : (
            <div style={{ transform: 'scale(0.85)' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => console.log('Login Failed')}
                theme="filled_black"
                size="medium"
                shape="pill"
              />
            </div>
          )}
        </div>
      </nav>

      {/* Loading */}
      {loading && <WalkingLoadingScreen category={selectedCategory} companion={companion} />}

      {/* Landing */}
      {screen === 'landing' && !loading && (
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '64px 24px' }}>
          <h1 style={{ fontSize: '40px', fontWeight: '800', textAlign: 'center', marginBottom: '8px', letterSpacing: '-1px', background: 'linear-gradient(135deg, #f1f5f9, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: darkMode ? 'transparent' : textColor }}>
            Report a Civic Issue
          </h1>
          <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '48px', fontSize: '15px' }}>
            {companionName} is ready to help you file a report
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => handleCategoryClick(cat)} onMouseEnter={() => setHoveredCat(cat.id)} onMouseLeave={() => setHoveredCat(null)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '20px', padding: '24px 32px', borderRadius: '16px', border: `1px solid ${hoveredCat === cat.id ? cat.color : borderColor}`, background: hoveredCat === cat.id ? (darkMode ? '#141e30' : '#f1f5f9') : cardBg, color: textColor, cursor: 'pointer', transition: 'all 0.2s ease', transform: hoveredCat === cat.id ? 'translateX(6px)' : 'translateX(0)', boxShadow: hoveredCat === cat.id ? `0 0 20px ${cat.color}22` : 'none', textAlign: 'left' }}>
                <span style={{ fontSize: '32px' }}>{cat.icon}</span>
                <span style={{ fontSize: '18px', fontWeight: '600', flex: 1 }}>{cat.label}</span>
                <span style={{ color: hoveredCat === cat.id ? cat.color : '#334155' }}>→</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Report */}
      {screen === 'report' && !loading && (
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px', borderRadius: '14px', background: cardBg, border: `1px solid ${borderColor}`, marginBottom: '28px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
              {user?.avatar
                ? <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px' }}>AD</div>
              }
            </div>
            <div>
              <div style={{ fontWeight: '600' }}>{user?.name || 'Guest Citizen'}</div>
              <div style={{ color: '#64748b', fontSize: '13px' }}>{user?.email || 'Sign in with Google to verify your identity'}</div>
            </div>
            {user
              ? <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#22c55e', border: '1px solid #22c55e', padding: '4px 10px', borderRadius: '20px' }}>✓ Verified</span>
              : <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#f59e0b', border: '1px solid #f59e0b', padding: '4px 10px', borderRadius: '20px' }}>⚠ Not signed in</span>
            }
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '20px' }}>{selectedCategory?.icon} Reporting: {selectedCategory?.label}</h2>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            {['Major Issue', 'Minor Issue'].map((label, i) => (
              <div key={label} onClick={() => { setSelectedTriage(i); addXp(10, '+10 XP') }} style={{ padding: '20px', borderRadius: '14px', border: `1px solid ${selectedTriage === i ? '#22d3ee' : borderColor}`, background: selectedTriage === i ? (darkMode ? '#0c2233' : '#eff6ff') : cardBg, cursor: 'pointer', transition: 'all 0.15s' }}>
                <div style={{ fontWeight: '600', fontSize: '15px', marginBottom: '4px' }}>{label}</div>
                <div style={{ color: '#64748b', fontSize: '13px' }}>{i === 0 ? 'Urgent attention needed' : 'Non-emergency report'}</div>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '24px' }}>
            <textarea value={aiText} onChange={e => setAiText(e.target.value)} placeholder="Describe your issue in detail..." style={{ width: '100%', padding: '16px', borderRadius: '12px', background: cardBg, border: `1px solid ${borderColor}`, color: textColor, fontSize: '14px', resize: 'none', height: '110px', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', marginBottom: '10px' }} />
            <button onClick={handleAIRoute} disabled={aiLoading} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #4285F4, #9b72cb)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
              {aiLoading ? '⏳ Analyzing...' : '✨ Let Gemini Route My Issue'}
            </button>

            {aiLoading && (
              <div style={{ marginTop: '12px', padding: '16px', borderRadius: '12px', background: darkMode ? '#0c1a2e' : '#f0f9ff', border: `1px solid ${darkMode ? '#1e3a5f' : '#bfdbfe'}` }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {[0,1,2].map(i => <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4285F4', animation: 'pulse 1s ease-in-out infinite', animationDelay: `${i*0.2}s` }} />)}
                  <span style={{ color: '#64748b', fontSize: '13px' }}>Gemini is routing your issue...</span>
                </div>
                <style>{`@keyframes pulse{0%,100%{opacity:0.3;transform:scale(0.8)}50%{opacity:1;transform:scale(1.2)}}`}</style>
              </div>
            )}

            {aiResult && (
              <div style={{ marginTop: '12px', padding: '16px', borderRadius: '12px', background: darkMode ? '#0c1a2e' : '#f0f9ff', border: `1px solid ${darkMode ? '#1e3a5f' : '#bfdbfe'}`, fontSize: '13px', lineHeight: '1.6' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', background: `${severityColor[aiResult.severity]}22`, color: severityColor[aiResult.severity] }}>{aiResult.severity}</span>
                  {aiResult.priority_bypass && <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: '600' }}>🚨 PRIORITY BYPASS</span>}
                </div>
                <p style={{ margin: '0 0 6px' }}><strong>Dept:</strong> {aiResult.department}</p>
                <p style={{ margin: '0 0 6px', color: '#94a3b8' }}>{aiResult.summary}</p>
                <p style={{ margin: '0 0 6px' }}><strong>Response:</strong> {aiResult.estimated_response}</p>
                <p style={{ margin: 0, color: '#22c55e' }}>📞 {aiResult.emergency_number}</p>
              </div>
            )}
          </div>

          <div onClick={() => { setPinDropped(true); addXp(5, '+5 XP') }} style={{ borderRadius: '14px', border: `1px solid ${pinDropped ? '#22c55e' : borderColor}`, background: cardBg, height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', cursor: 'crosshair', position: 'relative' }}>
            <div style={{ fontSize: '32px' }}>{pinDropped ? '📍' : '🗺️'}</div>
            <div style={{ color: '#475569', fontSize: '14px', marginTop: '8px' }}>{pinDropped ? 'Pin dropped! Location marked.' : 'Click to drop a pin on the map'}</div>
            {pinDropped && <div style={{ position: 'absolute', bottom: '12px', right: '16px', fontSize: '11px', color: '#22c55e' }}>✓ Location saved</div>}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={() => setScreen('landing')} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: `1px solid ${borderColor}`, background: 'transparent', color: textColor, fontSize: '15px', cursor: 'pointer' }}>← Back</button>
            <button onClick={handleSubmit} style={{ flex: 2, padding: '14px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', color: 'white', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}>Submit Report →</button>
          </div>
        </div>
      )}

      {/* Map */}
      {screen === 'map' && (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '24px' }}>🗺️ Live Community Map</h2>
          <div style={{ borderRadius: '16px', border: `1px solid ${borderColor}`, overflow: 'hidden', marginBottom: '16px' }}>
            <iframe
              title="Google Map"
              width="100%"
              height="400"
              style={{ border: 0, display: 'block' }}
              loading="lazy"
              src="https://maps.google.com/maps?q=Chennai,Tamil+Nadu&output=embed"
            />
          </div>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', fontSize: '13px' }}>
            <span><span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', marginRight: '6px' }}/>Unverified</span>
            <span><span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', marginRight: '6px' }}/>Resolved</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '24px' }}>
            {mockMapIssues.map(issue => (
              <div key={issue.id} style={{ padding: '16px', borderRadius: '12px', background: cardBg, border: `1px solid ${issue.color}33` }}>
                <div style={{ marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: issue.color, display: 'inline-block', flexShrink: 0 }}/>
                  <span style={{ fontWeight: '600', fontSize: '13px' }}>{issue.label}</span>
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '10px' }}>{issue.loc} · {issue.votes} votes</div>
                {issue.status === 'unverified'
                  ? <button onClick={() => addXp(10, '+10 XP — Verified!')} style={{ fontSize: '11px', padding: '5px 10px', borderRadius: '8px', border: '1px solid #334155', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }}>👍 Verify</button>
                  : <span style={{ fontSize: '11px', color: '#22c55e' }}>✓ Resolved</span>
                }
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dashboard */}
      {screen === 'dashboard' && <DashboardScreen companion={companion} xp={xp} reports={reports} darkMode={darkMode} />}
    </div>
  )
}