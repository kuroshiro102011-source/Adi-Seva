import { useState, useEffect } from 'react'

const user = {
  name: 'Alex Dev',
  address: '12, Innovation Lane, Chennai',
  email: 'alex.dev@gmail.com',
  avatar: 'AD'
}

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

// ===================== LUX - MAINE COON CAT SVG =====================
function LuxSVG({ mood = 'idle', level = 1, sparkle = false }) {
  const accessories = {
    bow: level >= 2,
    headset: level >= 3,
    cape: level >= 4,
    glow: level >= 5,
  }

  const eyes = {
    idle: <><ellipse cx="36" cy="52" rx="5" ry="4" fill="#1a1a2e"/><ellipse cx="64" cy="52" rx="5" ry="4" fill="#1a1a2e"/><ellipse cx="37" cy="51" rx="1.5" ry="1.5" fill="white"/><ellipse cx="65" cy="51" rx="1.5" ry="1.5" fill="white"/></>,
    investigate: <><ellipse cx="36" cy="52" rx="5" ry="3" fill="#1a1a2e"/><ellipse cx="64" cy="52" rx="5" ry="3" fill="#1a1a2e"/><ellipse cx="37" cy="51" rx="1.5" ry="1" fill="white"/><ellipse cx="65" cy="51" rx="1.5" ry="1" fill="white"/><line x1="28" y1="46" x2="44" y2="48" stroke="#4a3000" strokeWidth="2.5" strokeLinecap="round"/><line x1="56" y1="48" x2="72" y2="46" stroke="#4a3000" strokeWidth="2.5" strokeLinecap="round"/></>,
    clumsy: <><circle cx="36" cy="52" r="6" fill="#1a1a2e"/><circle cx="64" cy="52" r="6" fill="#1a1a2e"/><ellipse cx="38" cy="50" rx="2" ry="2" fill="white"/><ellipse cx="66" cy="50" rx="2" ry="2" fill="white"/><line x1="28" y1="48" x2="44" y2="50" stroke="#4a3000" strokeWidth="2" strokeLinecap="round"/><line x1="56" y1="50" x2="72" y2="48" stroke="#4a3000" strokeWidth="2" strokeLinecap="round"/></>,
    victory: <><path d="M31 52 Q36 46 41 52" stroke="#1a1a2e" strokeWidth="2.5" fill="none" strokeLinecap="round"/><path d="M59 52 Q64 46 69 52" stroke="#1a1a2e" strokeWidth="2.5" fill="none" strokeLinecap="round"/><ellipse cx="38" cy="50" rx="1.5" ry="1" fill="#1a1a2e"/><ellipse cx="66" cy="50" rx="1.5" ry="1" fill="#1a1a2e"/></>,
  }

  const mouth = {
    idle: <path d="M45 63 Q50 66 55 63" stroke="#c47a5a" strokeWidth="2" fill="none" strokeLinecap="round"/>,
    investigate: <path d="M45 64 Q50 62 55 64" stroke="#c47a5a" strokeWidth="2" fill="none" strokeLinecap="round"/>,
    clumsy: <><path d="M44 65 Q50 70 56 65" stroke="#c47a5a" strokeWidth="2" fill="none" strokeLinecap="round"/><ellipse cx="50" cy="67" rx="4" ry="2" fill="#e8a090" opacity="0.5"/></>,
    victory: <path d="M43 63 Q50 70 57 63" stroke="#c47a5a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>,
  }

  const bodyAnim = {
    idle: '',
    investigate: 'luxInvestigate',
    clumsy: 'luxClumsy',
    victory: 'luxVictory',
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <style>{`
        @keyframes luxInvestigate { 0%,100%{transform:rotate(-5deg) translateY(0)} 50%{transform:rotate(5deg) translateY(-8px)} }
        @keyframes luxClumsy { 0%{transform:rotate(0deg)} 20%{transform:rotate(-15deg) translateX(-10px)} 40%{transform:rotate(15deg) translateX(10px)} 60%{transform:rotate(-8deg)} 80%{transform:rotate(8deg)} 100%{transform:rotate(0deg)} }
        @keyframes luxVictory { 0%,100%{transform:translateY(0) scale(1)} 25%{transform:translateY(-15px) scale(1.05)} 50%{transform:translateY(-5px) scale(1.02)} 75%{transform:translateY(-12px) scale(1.04)} }
        @keyframes sparkleFloat { 0%{transform:translate(0,0) scale(0);opacity:1} 100%{transform:translate(var(--tx),var(--ty)) scale(1);opacity:0} }
        @keyframes tailWag { 0%,100%{transform:rotate(0deg)} 50%{transform:rotate(20deg)} }
        @keyframes earTwitch { 0%,90%,100%{transform:rotate(0deg)} 95%{transform:rotate(-10deg)} }
      `}</style>

      <svg width="120" height="160" viewBox="0 0 100 160" style={{ animation: bodyAnim[mood] ? `${bodyAnim[mood]} 1s ease-in-out infinite` : '', filter: accessories.glow ? 'drop-shadow(0 0 12px #22d3ee)' : '' }}>
        {/* Cape */}
        {accessories.cape && <path d="M25 90 Q10 120 20 145 Q50 155 80 145 Q90 120 75 90" fill="#6d28d9" opacity="0.9"/>}
        
        {/* Fluffy tail */}
        <path d="M65 130 Q90 120 95 100 Q100 80 85 75" stroke="#d4813a" strokeWidth="12" fill="none" strokeLinecap="round" style={{ animation: 'tailWag 2s ease-in-out infinite', transformOrigin: '65px 130px' }}/>
        <path d="M65 130 Q90 120 95 100 Q100 80 85 75" stroke="#f4a460" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.6"/>

        {/* Body */}
        <ellipse cx="50" cy="110" rx="30" ry="32" fill="#d4813a"/>
        <ellipse cx="50" cy="105" rx="22" ry="24" fill="#f4a460" opacity="0.5"/>

        {/* Neck fluff */}
        <ellipse cx="50" cy="85" rx="22" ry="12" fill="#e8923e"/>
        <ellipse cx="50" cy="82" rx="18" ry="10" fill="#f4b060" opacity="0.6"/>

        {/* Head */}
        <ellipse cx="50" cy="55" rx="26" ry="24" fill="#d4813a"/>
        
        {/* Cheek fluff */}
        <ellipse cx="22" cy="58" rx="10" ry="8" fill="#e8923e" opacity="0.7"/>
        <ellipse cx="78" cy="58" rx="10" ry="8" fill="#e8923e" opacity="0.7"/>

        {/* Ears */}
        <polygon points="20,38 28,20 38,38" fill="#d4813a" style={{ animation: 'earTwitch 3s ease-in-out infinite', transformOrigin: '29px 38px' }}/>
        <polygon points="62,38 72,20 80,38" fill="#d4813a" style={{ animation: 'earTwitch 3s ease-in-out infinite 0.5s', transformOrigin: '71px 38px' }}/>
        <polygon points="23,38 28,25 35,38" fill="#f4a0a0" opacity="0.7"/>
        <polygon points="65,38 72,25 77,38" fill="#f4a0a0" opacity="0.7"/>

        {/* Face markings */}
        <path d="M35 45 Q50 40 65 45" stroke="#c47a30" strokeWidth="1.5" fill="none" opacity="0.4"/>

        {/* Eyes */}
        {eyes[mood]}

        {/* Nose */}
        <polygon points="50,58 47,61 53,61" fill="#e8647a"/>
        
        {/* Whiskers */}
        <line x1="15" y1="60" x2="38" y2="62" stroke="#f4d090" strokeWidth="1.2" opacity="0.8"/>
        <line x1="15" y1="64" x2="38" y2="64" stroke="#f4d090" strokeWidth="1.2" opacity="0.8"/>
        <line x1="62" y1="62" x2="85" y2="60" stroke="#f4d090" strokeWidth="1.2" opacity="0.8"/>
        <line x1="62" y1="64" x2="85" y2="64" stroke="#f4d090" strokeWidth="1.2" opacity="0.8"/>

        {/* Mouth */}
        {mouth[mood]}

        {/* Blush when victory */}
        {mood === 'victory' && <><ellipse cx="30" cy="60" rx="7" ry="4" fill="#ff9999" opacity="0.4"/><ellipse cx="70" cy="60" rx="7" ry="4" fill="#ff9999" opacity="0.4"/></>}

        {/* Bow (level 2+) */}
        {accessories.bow && <g transform="translate(50, 78)"><path d="M-12,-5 Q-6,0 0,0 Q-6,0 -12,5 Z" fill="#ff6b9d"/><path d="M12,-5 Q6,0 0,0 Q6,0 12,5 Z" fill="#ff6b9d"/><circle cx="0" cy="0" r="3" fill="#ff4d8d"/></g>}

        {/* Headset (level 3+) */}
        {accessories.headset && <g><path d="M24 45 Q50 25 76 45" stroke="#334155" strokeWidth="3" fill="none"/><rect x="18" y="43" width="10" height="8" rx="3" fill="#1e293b"/><rect x="72" y="43" width="10" height="8" rx="3" fill="#1e293b"/><rect x="22" y="46" width="4" height="4" rx="1" fill="#22d3ee"/><rect x="74" y="46" width="4" height="4" rx="1" fill="#22d3ee"/></g>}

        {/* Paws */}
        <ellipse cx="32" cy="138" rx="10" ry="7" fill="#d4813a"/>
        <ellipse cx="68" cy="138" rx="10" ry="7" fill="#d4813a"/>

        {/* Victory star eyes overlay */}
        {mood === 'victory' && <><text x="29" y="56" fontSize="12" textAnchor="middle">⭐</text><text x="71" y="56" fontSize="12" textAnchor="middle">⭐</text></>}
      </svg>

      {/* Sparkles */}
      {(sparkle || mood === 'victory') && [...Array(6)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: `${20 + Math.random() * 60}%`,
          left: `${10 + Math.random() * 80}%`,
          fontSize: '14px',
          animation: `sparkleFloat ${0.8 + i * 0.2}s ease-out forwards`,
          '--tx': `${(Math.random() - 0.5) * 60}px`,
          '--ty': `${-20 - Math.random() * 40}px`,
          animationDelay: `${i * 0.1}s`,
        }}>✨</div>
      ))}
    </div>
  )
}

// ===================== VEX - LABRADOR DOG SVG =====================
function VexSVG({ mood = 'idle', level = 1, sparkle = false }) {
  const accessories = {
    bow: level >= 2,
    headset: level >= 3,
    cape: level >= 4,
    glow: level >= 5,
  }

  const eyes = {
    idle: <><ellipse cx="36" cy="52" rx="6" ry="5" fill="#3d1a00"/><ellipse cx="64" cy="52" rx="6" ry="5" fill="#3d1a00"/><ellipse cx="37" cy="50" rx="2" ry="2" fill="white"/><ellipse cx="65" cy="50" rx="2" ry="2" fill="white"/></>,
    investigate: <><ellipse cx="36" cy="52" rx="6" ry="4" fill="#3d1a00"/><ellipse cx="64" cy="52" rx="6" ry="4" fill="#3d1a00"/><ellipse cx="37" cy="51" rx="2" ry="1.5" fill="white"/><ellipse cx="65" cy="51" rx="2" ry="1.5" fill="white"/><line x1="27" y1="45" x2="44" y2="48" stroke="#3d1a00" strokeWidth="3" strokeLinecap="round"/><line x1="56" y1="48" x2="73" y2="45" stroke="#3d1a00" strokeWidth="3" strokeLinecap="round"/></>,
    clumsy: <><circle cx="36" cy="52" r="7" fill="#3d1a00"/><circle cx="64" cy="52" r="7" fill="#3d1a00"/><ellipse cx="38" cy="50" rx="2.5" ry="2.5" fill="white"/><ellipse cx="66" cy="50" rx="2.5" ry="2.5" fill="white"/></>,
    victory: <><path d="M30 52 Q36 45 42 52" stroke="#3d1a00" strokeWidth="3" fill="none" strokeLinecap="round"/><path d="M58 52 Q64 45 70 52" stroke="#3d1a00" strokeWidth="3" fill="none" strokeLinecap="round"/></>,
  }

  const mouth = {
    idle: <><path d="M42 66 Q50 70 58 66" stroke="#8b4513" strokeWidth="2" fill="none" strokeLinecap="round"/><ellipse cx="50" cy="70" rx="6" ry="3" fill="#e87070" opacity="0.7"/></>,
    investigate: <path d="M44 65 Q50 62 56 65" stroke="#8b4513" strokeWidth="2" fill="none" strokeLinecap="round"/>,
    clumsy: <><path d="M42 67 Q50 74 58 67" stroke="#8b4513" strokeWidth="2.5" fill="none" strokeLinecap="round"/><ellipse cx="50" cy="71" rx="7" ry="4" fill="#e87070" opacity="0.8"/><path d="M46 71 Q50 75 54 71" fill="#e87070"/></>,
    victory: <><path d="M40 65 Q50 74 60 65" stroke="#8b4513" strokeWidth="2.5" fill="none" strokeLinecap="round"/><ellipse cx="50" cy="70" rx="8" ry="5" fill="#e87070" opacity="0.9"/></>,
  }

  const bodyAnim = {
    idle: '',
    investigate: 'vexInvestigate',
    clumsy: 'vexClumsy',
    victory: 'vexVictory',
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <style>{`
        @keyframes vexInvestigate { 0%,100%{transform:rotate(3deg) translateY(0)} 50%{transform:rotate(-3deg) translateY(-6px)} }
        @keyframes vexClumsy { 0%{transform:rotate(0) scale(1)} 15%{transform:rotate(-20deg) scale(0.95)} 30%{transform:rotate(20deg) scale(1.05)} 45%{transform:rotate(-10deg)} 60%{transform:rotate(10deg)} 100%{transform:rotate(0) scale(1)} }
        @keyframes vexVictory { 0%,100%{transform:translateY(0) rotate(0)} 30%{transform:translateY(-18px) rotate(-5deg)} 60%{transform:translateY(-8px) rotate(5deg)} 80%{transform:translateY(-15px) rotate(-3deg)} }
        @keyframes tailWagDog { 0%,100%{transform:rotate(-20deg)} 50%{transform:rotate(20deg)} }
      `}</style>

      <svg width="120" height="160" viewBox="0 0 100 160" style={{ animation: bodyAnim[mood] ? `${bodyAnim[mood]} 1s ease-in-out infinite` : '', filter: accessories.glow ? 'drop-shadow(0 0 12px #f59e0b)' : '' }}>
        
        {/* Cape */}
        {accessories.cape && <path d="M25 90 Q10 120 20 145 Q50 158 80 145 Q90 120 75 90" fill="#991b1b" opacity="0.9"/>}

        {/* Tail */}
        <path d="M72 125 Q92 110 90 90 Q88 75 78 72" stroke="#c8860a" strokeWidth="10" fill="none" strokeLinecap="round" style={{ animation: 'tailWagDog 0.6s ease-in-out infinite', transformOrigin: '72px 125px' }}/>

        {/* Body */}
        <ellipse cx="50" cy="112" rx="28" ry="30" fill="#c8860a"/>
        <ellipse cx="50" cy="108" rx="20" ry="22" fill="#e8a020" opacity="0.4"/>

        {/* Collar band */}
        <rect x="30" y="84" width="40" height="8" rx="4" fill="#1e3a5f"/>
        <rect x="32" y="85" width="36" height="6" rx="3" fill="#2563eb" opacity="0.7"/>
        <circle cx="50" cy="88" r="3" fill="#fbbf24"/>

        {/* Neck */}
        <ellipse cx="50" cy="86" rx="20" ry="10" fill="#c8860a"/>

        {/* Head - Labrador has broader head */}
        <ellipse cx="50" cy="53" rx="28" ry="26" fill="#c8860a"/>
        
        {/* Snout */}
        <ellipse cx="50" cy="64" rx="14" ry="10" fill="#b87008"/>
        <ellipse cx="50" cy="62" rx="12" ry="8" fill="#d4920e" opacity="0.5"/>

        {/* Ears - floppy lab ears */}
        <ellipse cx="20" cy="55" rx="10" ry="16" fill="#b07008" transform="rotate(-15 20 55)"/>
        <ellipse cx="80" cy="55" rx="10" ry="16" fill="#b07008" transform="rotate(15 80 55)"/>

        {/* Eyes */}
        {eyes[mood]}

        {/* Nose */}
        <ellipse cx="50" cy="61" rx="7" ry="5" fill="#1a1a1a"/>
        <ellipse cx="48" cy="59" rx="2" ry="1.5" fill="#555" opacity="0.7"/>

        {/* Mouth */}
        {mouth[mood]}

        {/* Blush */}
        {mood === 'victory' && <><ellipse cx="28" cy="60" rx="8" ry="5" fill="#ff9999" opacity="0.4"/><ellipse cx="72" cy="60" rx="8" ry="5" fill="#ff9999" opacity="0.4"/></>}

        {/* Bow on collar (level 2+) */}
        {accessories.bow && <g transform="translate(50, 88)"><path d="M-10,-4 Q-5,0 0,0 Q-5,0 -10,4 Z" fill="#ff6b9d"/><path d="M10,-4 Q5,0 0,0 Q5,0 10,4 Z" fill="#ff6b9d"/><circle cx="0" cy="0" r="2.5" fill="#ff4d8d"/></g>}

        {/* Headset (level 3+) */}
        {accessories.headset && <g><path d="M22 42 Q50 22 78 42" stroke="#334155" strokeWidth="3" fill="none"/><rect x="16" y="40" width="10" height="8" rx="3" fill="#1e293b"/><rect x="74" y="40" width="10" height="8" rx="3" fill="#1e293b"/><rect x="20" y="43" width="4" height="4" rx="1" fill="#f59e0b"/><rect x="76" y="43" width="4" height="4" rx="1" fill="#f59e0b"/></g>}

        {/* Paws */}
        <ellipse cx="34" cy="138" rx="11" ry="8" fill="#c8860a"/>
        <ellipse cx="66" cy="138" rx="11" ry="8" fill="#c8860a"/>

        {/* Toe lines */}
        <line x1="30" y1="140" x2="30" y2="143" stroke="#b07008" strokeWidth="1.5"/>
        <line x1="34" y1="141" x2="34" y2="144" stroke="#b07008" strokeWidth="1.5"/>
        <line x1="38" y1="140" x2="38" y2="143" stroke="#b07008" strokeWidth="1.5"/>

        {/* Victory star eyes */}
        {mood === 'victory' && <><text x="29" y="56" fontSize="12" textAnchor="middle">⭐</text><text x="71" y="56" fontSize="12" textAnchor="middle">⭐</text></>}
      </svg>

      {/* Sparkles */}
      {(sparkle || mood === 'victory') && [...Array(6)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: `${20 + Math.random() * 60}%`,
          left: `${10 + Math.random() * 80}%`,
          fontSize: '14px',
          animation: `sparkleFloat ${0.8 + i * 0.2}s ease-out forwards`,
          '--tx': `${(Math.random() - 0.5) * 60}px`,
          '--ty': `${-20 - Math.random() * 40}px`,
          animationDelay: `${i * 0.1}s`,
          pointerEvents: 'none',
        }}>✨</div>
      ))}
    </div>
  )
}

// ===================== LOADING SCREEN =====================
function LoadingScreen({ category, companion }) {
  const [phase, setPhase] = useState(0) // 0=investigate, 1=clumsy, 2=victory
  
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800)
    const t2 = setTimeout(() => setPhase(2), 1800)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  const moods = ['investigate', 'clumsy', 'victory']
  const mood = moods[phase]
  const CompComponent = companion === 'lux' ? LuxSVG : VexSVG

  const messages = {
    investigate: {
      drainage: `${companion === 'lux' ? 'Lux' : 'Vex'} is sniffing the manhole... 🔍`,
      streetlight: `${companion === 'lux' ? 'Lux' : 'Vex'} is eyeing that flickering bulb... 👀`,
      waterleak: `${companion === 'lux' ? 'Lux' : 'Vex'} spotted something suspicious... 💧`,
      powergrid: `${companion === 'lux' ? 'Lux' : 'Vex'} is approaching the wire carefully... ⚡`,
      other: `${companion === 'lux' ? 'Lux' : 'Vex'} is on the case... 🔎`,
    },
    clumsy: {
      drainage: `Whoops! ${companion === 'lux' ? 'Lux' : 'Vex'} fell halfway in! 😵`,
      streetlight: `ZAP! Got zapped by the bulb! 😵‍💫`,
      waterleak: `Slipped in the puddle! 💦`,
      powergrid: `Fur standing on end! ⚡😱`,
      other: `This is more complicated than expected... 😅`,
    },
    victory: {
      drainage: `Issue logged! Nailed it! 🏆✨`,
      streetlight: `Reported! Let there be light! ✨💡`,
      waterleak: `Leak reported! Hero move! 🏆✨`,
      powergrid: `Grid issue flagged! Sparky! ⚡✨`,
      other: `Routed to the right team! 🏆✨`,
    },
  }

  const catColors = {
    drainage: '#3b82f6',
    streetlight: '#f59e0b',
    waterleak: '#06b6d4',
    powergrid: '#eab308',
    other: '#a855f7',
  }

  const bgColor = catColors[category?.id] || '#22d3ee'

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#080c14', zIndex: 200,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px'
    }}>
      <style>{`
        @keyframes sparkleFloat { 0%{transform:translate(0,0) scale(0);opacity:1} 100%{transform:translate(var(--tx),var(--ty)) scale(1.2);opacity:0} }
        @keyframes glowPulse { 0%,100%{box-shadow:0 0 20px ${bgColor}44} 50%{box-shadow:0 0 50px ${bgColor}88} }
      `}</style>

      <div style={{
        padding: '32px',
        borderRadius: '24px',
        border: `2px solid ${bgColor}44`,
        background: `${bgColor}11`,
        animation: 'glowPulse 2s ease-in-out infinite',
        minWidth: '200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
      }}>
        <CompComponent mood={mood} level={1} sparkle={phase === 2} />
        
        {/* Category icon interaction */}
        <div style={{ fontSize: '32px', marginTop: '-8px' }}>
          {phase === 0 && category?.icon}
          {phase === 1 && '😵'}
          {phase === 2 && '✅'}
        </div>
      </div>

      <p style={{
        color: bgColor,
        fontSize: '16px',
        fontWeight: '600',
        textAlign: 'center',
        maxWidth: '280px',
        transition: 'all 0.5s ease',
      }}>
        {messages[mood]?.[category?.id] || 'Analyzing...'}
      </p>

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: i <= phase ? bgColor : '#1e293b',
            transition: 'background 0.3s ease',
          }} />
        ))}
      </div>
    </div>
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
          { id: 'lux', name: 'Lux', type: 'Maine Coon Cat', desc: 'Graceful & precise', color: '#22d3ee' },
          { id: 'vex', name: 'Vex', type: 'Labrador', desc: 'Energetic & loyal', color: '#f59e0b' },
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
            <div style={{ animation: 'floatUp 3s ease-in-out infinite', animationDelay: c.id === 'vex' ? '1.5s' : '0s' }}>
              {c.id === 'lux' ? <LuxSVG mood="idle" level={1} /> : <VexSVG mood="idle" level={1} />}
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
  const CompComponent = companion === 'lux' ? LuxSVG : VexSVG
  const name = companion === 'lux' ? 'Lux' : 'Vex'

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
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `You are a civic issue routing AI for Indian municipalities. Analyze this issue and respond ONLY in JSON (no markdown):
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
          }]
        })
      })
      const data = await res.json()
      const text = data.content?.[0]?.text || ''
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
  const CompComponent = companion === 'lux' ? LuxSVG : VexSVG
  const companionName = companion === 'lux' ? 'Lux' : 'Vex'

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
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 32px', borderBottom: `1px solid ${borderColor}`, background: darkMode ? 'rgba(8,12,20,0.95)' : 'rgba(248,250,252,0.95)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <span style={{ fontSize: '18px', fontWeight: '800', color: '#22d3ee', letterSpacing: '-0.5px' }}>🏛️ Adi Seva</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Companion mini display */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 12px', borderRadius: '20px', border: `1px solid ${borderColor}`, background: cardBg }}>
            <div style={{ transform: 'scale(0.3)', transformOrigin: 'center', width: '30px', height: '30px', overflow: 'visible', marginLeft: '-10px', marginRight: '-10px' }}>
              <CompComponent mood="idle" level={level.level} />
            </div>
            <XPBar xp={xp} compact />
          </div>
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
          <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700' }}>AD</div>
        </div>
      </nav>

      {/* Loading */}
      {loading && <LoadingScreen category={selectedCategory} companion={companion} />}

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
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px' }}>AD</div>
            <div>
              <div style={{ fontWeight: '600' }}>{user.name}</div>
              <div style={{ color: '#64748b', fontSize: '13px' }}>{user.address}</div>
            </div>
            <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#22c55e', border: '1px solid #22c55e', padding: '4px 10px', borderRadius: '20px' }}>✓ Verified</span>
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
            <button onClick={handleAIRoute} disabled={aiLoading} style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', border: 'none', borderRadius: '10px', color: 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>
              {aiLoading ? '⏳ Analyzing...' : '✨ Let AI Route My Issue'}
            </button>

            {aiLoading && (
              <div style={{ marginTop: '12px', padding: '16px', borderRadius: '12px', background: darkMode ? '#0c1a2e' : '#f0f9ff', border: `1px solid ${darkMode ? '#1e3a5f' : '#bfdbfe'}` }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {[0,1,2].map(i => <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0ea5e9', animation: 'pulse 1s ease-in-out infinite', animationDelay: `${i*0.2}s` }} />)}
                  <span style={{ color: '#64748b', fontSize: '13px' }}>AI routing your issue...</span>
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
          <div style={{ borderRadius: '16px', border: `1px solid ${borderColor}`, background: darkMode ? '#0a1628' : '#e2e8f0', height: '400px', position: 'relative', overflow: 'hidden', marginBottom: '16px' }}>
            {[...Array(8)].map((_, i) => <div key={i} style={{ position: 'absolute', left: `${i*14}%`, top: 0, bottom: 0, width: '1px', background: '#22d3ee', opacity: 0.07 }} />)}
            {[...Array(6)].map((_, i) => <div key={i} style={{ position: 'absolute', top: `${i*18}%`, left: 0, right: 0, height: '1px', background: '#22d3ee', opacity: 0.07 }} />)}
            {mockMapIssues.map(issue => (
              <div key={issue.id}>
                <div title={issue.label} style={{ position: 'absolute', left: `${issue.x}%`, top: `${issue.y}%`, width: '14px', height: '14px', borderRadius: '50%', background: issue.color, border: '2px solid white', boxShadow: `0 0 12px ${issue.color}`, cursor: 'pointer', transform: 'translate(-50%,-50%)' }} />
                <div style={{ position: 'absolute', left: `${issue.x}%`, top: `${issue.y+5}%`, fontSize: '11px', color: '#94a3b8', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>{issue.loc}</div>
              </div>
            ))}
            <div style={{ position: 'absolute', top: '12px', left: '12px', fontSize: '12px', color: '#475569' }}>India</div>
            <div style={{ position: 'absolute', bottom: '12px', right: '12px', fontSize: '11px', color: '#475569' }}>Simulated • Google Maps API</div>
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
