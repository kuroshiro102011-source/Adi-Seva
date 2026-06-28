import { useState } from 'react'
 
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
 
const s = {
  app: {
    minHeight: '100vh',
    background: '#080c14',
    color: '#f1f5f9',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 48px',
    borderBottom: '1px solid #1e293b',
    background: 'rgba(8,12,20,0.95)',
    backdropFilter: 'blur(10px)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#22d3ee',
    letterSpacing: '-0.5px',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  emailText: {
    fontSize: '13px',
    color: '#64748b',
  },
  toggleBtn: {
    padding: '6px 14px',
    borderRadius: '20px',
    border: '1px solid #334155',
    background: 'transparent',
    color: '#94a3b8',
    fontSize: '12px',
    cursor: 'pointer',
  },
  avatar: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '700',
  },
  landingWrap: {
    maxWidth: '680px',
    margin: '0 auto',
    padding: '64px 24px',
  },
  h1: {
    fontSize: '42px',
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: '8px',
    letterSpacing: '-1px',
    background: 'linear-gradient(135deg, #f1f5f9, #94a3b8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    textAlign: 'center',
    color: '#64748b',
    marginBottom: '48px',
    fontSize: '15px',
  },
  categoryBtn: (color) => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '24px 32px',
    borderRadius: '16px',
    border: '1px solid #1e293b',
    background: '#0f172a',
    color: '#f1f5f9',
    cursor: 'pointer',
    marginBottom: '12px',
    transition: 'all 0.2s ease',
    textAlign: 'left',
  }),
  categoryIcon: {
    fontSize: '32px',
    minWidth: '40px',
  },
  categoryLabel: {
    fontSize: '18px',
    fontWeight: '600',
    flex: 1,
  },
  arrow: {
    color: '#334155',
    fontSize: '18px',
  },
  // Loading overlay
  overlay: {
    position: 'fixed',
    inset: 0,
    background: '#080c14',
    zIndex: 200,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
  },
  // Report screen
  reportWrap: {
    maxWidth: '680px',
    margin: '0 auto',
    padding: '40px 24px',
  },
  profileCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '16px 20px',
    borderRadius: '14px',
    background: '#0f172a',
    border: '1px solid #1e293b',
    marginBottom: '32px',
  },
  profileAvatar: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '14px',
    flexShrink: 0,
  },
  profileName: {
    fontWeight: '600',
    fontSize: '15px',
  },
  profileAddr: {
    color: '#64748b',
    fontSize: '13px',
    marginTop: '2px',
  },
  verifiedBadge: {
    marginLeft: 'auto',
    fontSize: '12px',
    color: '#22c55e',
    border: '1px solid #22c55e',
    padding: '4px 10px',
    borderRadius: '20px',
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: '700',
    marginBottom: '20px',
  },
  triageGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
    marginBottom: '24px',
  },
  triageCard: (selected) => ({
    padding: '20px',
    borderRadius: '14px',
    border: selected ? '1px solid #22d3ee' : '1px solid #1e293b',
    background: selected ? '#0c2233' : '#0f172a',
    cursor: 'pointer',
    transition: 'all 0.15s',
  }),
  triageCardTitle: {
    fontWeight: '600',
    fontSize: '15px',
    marginBottom: '4px',
  },
  triageCardSub: {
    color: '#64748b',
    fontSize: '13px',
  },
  aiSection: {
    marginBottom: '24px',
  },
  textarea: {
    width: '100%',
    padding: '16px',
    borderRadius: '12px',
    background: '#0f172a',
    border: '1px solid #1e293b',
    color: '#f1f5f9',
    fontSize: '14px',
    resize: 'none',
    height: '110px',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    marginBottom: '10px',
  },
  aiBtn: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
    border: 'none',
    borderRadius: '10px',
    color: 'white',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  aiResult: {
    marginTop: '12px',
    padding: '16px',
    borderRadius: '12px',
    background: '#0c1a2e',
    border: '1px solid #1e3a5f',
    fontSize: '13px',
    lineHeight: '1.6',
  },
  mapBox: {
    borderRadius: '14px',
    border: '1px solid #1e293b',
    background: '#0f172a',
    height: '220px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
  },
  mapText: {
    color: '#475569',
    fontSize: '15px',
    marginTop: '8px',
  },
  btnRow: {
    display: 'flex',
    gap: '12px',
  },
  backBtn: {
    flex: 1,
    padding: '14px',
    borderRadius: '12px',
    border: '1px solid #1e293b',
    background: 'transparent',
    color: '#94a3b8',
    fontSize: '15px',
    cursor: 'pointer',
  },
  submitBtn: {
    flex: 2,
    padding: '14px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
    color: 'white',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  // Map screen
  mapScreenWrap: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '40px 24px',
  },
  mapScreenBox: {
    borderRadius: '16px',
    border: '1px solid #1e293b',
    background: '#0f172a',
    height: '420px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '24px',
    position: 'relative',
    overflow: 'hidden',
  },
  pin: (color, x, y) => ({
    position: 'absolute',
    left: `${x}%`,
    top: `${y}%`,
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    background: color,
    border: '2px solid white',
    boxShadow: `0 0 12px ${color}`,
    cursor: 'pointer',
    transform: 'translate(-50%, -50%)',
  }),
  pinLabel: (x, y) => ({
    position: 'absolute',
    left: `${x}%`,
    top: `${y + 4}%`,
    fontSize: '11px',
    color: '#94a3b8',
    transform: 'translateX(-50%)',
    whiteSpace: 'nowrap',
  }),
  sidebar: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '12px',
    marginBottom: '24px',
  },
  issueCard: (color) => ({
    padding: '16px',
    borderRadius: '12px',
    background: '#0f172a',
    border: `1px solid ${color}33`,
  }),
  issueDot: (color) => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: color,
    display: 'inline-block',
    marginRight: '8px',
  }),
  issueTitle: {
    fontSize: '13px',
    fontWeight: '600',
    marginBottom: '4px',
  },
  issueSub: {
    fontSize: '11px',
    color: '#64748b',
    marginBottom: '10px',
  },
  verifyBtn: {
    fontSize: '11px',
    padding: '5px 10px',
    borderRadius: '8px',
    border: '1px solid #334155',
    background: 'transparent',
    color: '#94a3b8',
    cursor: 'pointer',
  },
}
 
const mockIssues = [
  { id: 1, label: 'Water Leak', loc: 'Anna Nagar', x: 28, y: 35, color: '#ef4444', votes: 3, status: 'unverified' },
  { id: 2, label: 'Power Outage', loc: 'T. Nagar', x: 55, y: 55, color: '#ef4444', votes: 7, status: 'unverified' },
  { id: 3, label: 'Drainage Fixed', loc: 'Adyar', x: 70, y: 30, color: '#22c55e', votes: 12, status: 'resolved' },
  { id: 4, label: 'Street Light', loc: 'Velachery', x: 42, y: 68, color: '#ef4444', votes: 2, status: 'unverified' },
]
 
// Water drop animation component
function WaterAnimation() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} style={{
            width: '12px',
            borderRadius: '50% 50% 40% 40%',
            background: 'linear-gradient(180deg, #7dd3fc, #0ea5e9)',
            animation: 'dropFall 1.2s ease-in-out infinite',
            animationDelay: `${i * 0.2}s`,
            height: `${24 + i * 8}px`,
            boxShadow: '0 0 16px #0ea5e933',
          }} />
        ))}
      </div>
      <p style={{ color: '#38bdf8', fontSize: '16px', fontWeight: '600', marginTop: '20px' }}>
        Analyzing water infrastructure...
      </p>
      <style>{`
        @keyframes dropFall {
          0%, 100% { transform: translateY(0) scaleY(1); opacity: 0.7; }
          50% { transform: translateY(-20px) scaleY(1.15); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
 
function LightningAnimation() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div style={{ display: 'flex', gap: '20px' }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            fontSize: '52px',
            animation: 'zapPulse 0.8s ease-in-out infinite',
            animationDelay: `${i * 0.18}s`,
            filter: 'drop-shadow(0 0 12px #facc15)',
          }}>⚡</div>
        ))}
      </div>
      <p style={{ color: '#fbbf24', fontSize: '16px', fontWeight: '600', marginTop: '20px' }}>
        Scanning power grid...
      </p>
      <style>{`
        @keyframes zapPulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.3); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
 
function GearAnimation() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {[52, 36, 52].map((size, i) => (
          <div key={i} style={{
            fontSize: `${size}px`,
            animation: `spin${i % 2 === 0 ? 'CW' : 'CCW'} 2s linear infinite`,
            filter: 'drop-shadow(0 0 8px #a855f7)',
          }}>⚙️</div>
        ))}
      </div>
      <p style={{ color: '#c084fc', fontSize: '16px', fontWeight: '600', marginTop: '20px' }}>
        Running diagnostics...
      </p>
      <style>{`
        @keyframes spinCW { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes spinCCW { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }
      `}</style>
    </div>
  )
}
 
export default function App() {
  const [screen, setScreen] = useState('landing')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [selectedTriage, setSelectedTriage] = useState(null)
  const [aiText, setAiText] = useState('')
  const [aiResult, setAiResult] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [pinDropped, setPinDropped] = useState(false)
  const [hoveredCat, setHoveredCat] = useState(null)
 
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
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `You are a civic issue routing AI for Chennai Municipal Corporation. Analyze this issue report and respond in JSON only (no markdown):
{
  "severity": "LOW | MEDIUM | HIGH | CRITICAL",
  "department": "department name",
  "summary": "one sentence summary",
  "emergency_number": "Chennai municipal helpline number",
  "estimated_response": "time estimate",
  "priority_bypass": true/false
}
 
Issue: "${aiText}"
Category: "${selectedCategory?.label}"`
          }]
        })
      })
      const data = await res.json()
      const text = data.content?.[0]?.text || ''
      const clean = text.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)
      setAiResult(parsed)
    } catch (e) {
      setAiResult({
        severity: 'MEDIUM',
        department: 'Chennai Municipal Corporation',
        summary: 'Issue logged and routed to relevant department.',
        emergency_number: '044-25384444',
        estimated_response: '24-48 hours',
        priority_bypass: false
      })
    }
    setAiLoading(false)
  }
 
  const severityColor = { LOW: '#22c55e', MEDIUM: '#f59e0b', HIGH: '#f97316', CRITICAL: '#ef4444' }
 
  const bgColor = darkMode ? '#080c14' : '#f8fafc'
  const textColor = darkMode ? '#f1f5f9' : '#0f172a'
  const cardBg = darkMode ? '#0f172a' : '#ffffff'
  const borderColor = darkMode ? '#1e293b' : '#e2e8f0'
 
  return (
    <div style={{ ...s.app, background: bgColor, color: textColor }}>
 
      {/* Navbar */}
      <nav style={{ ...s.nav, background: darkMode ? 'rgba(8,12,20,0.95)' : 'rgba(248,250,252,0.95)', borderBottom: `1px solid ${borderColor}` }}>
        <span style={s.logo}>🏙️ Adi Seva</span>
        <div style={s.navRight}>
          <span style={{ ...s.emailText, color: darkMode ? '#64748b' : '#94a3b8' }}>{user.email}</span>
          <button style={{ ...s.toggleBtn, borderColor, color: darkMode ? '#94a3b8' : '#64748b' }} onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
          <div style={s.avatar}>{user.avatar}</div>
        </div>
      </nav>
 
      {/* Loading Overlay */}
      {loading && (
        <div style={s.overlay}>
          {(selectedCategory?.id === 'waterleak' || selectedCategory?.id === 'drainage') && <WaterAnimation />}
          {(selectedCategory?.id === 'powergrid' || selectedCategory?.id === 'streetlight') && <LightningAnimation />}
          {selectedCategory?.id === 'other' && <GearAnimation />}
        </div>
      )}
 
      {/* Landing Screen */}
      {screen === 'landing' && !loading && (
        <div style={s.landingWrap}>
          <h1 style={{ ...s.h1, WebkitTextFillColor: darkMode ? 'transparent' : textColor }}>Report a Civic Issue</h1>
          <p style={s.subtitle}>Select a category to file a report instantly</p>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat)}
              onMouseEnter={() => setHoveredCat(cat.id)}
              onMouseLeave={() => setHoveredCat(null)}
              style={{
                ...s.categoryBtn(cat.color),
                background: hoveredCat === cat.id ? (darkMode ? '#141e30' : '#f1f5f9') : (darkMode ? '#0f172a' : '#ffffff'),
                border: `1px solid ${hoveredCat === cat.id ? cat.color : borderColor}`,
                transform: hoveredCat === cat.id ? 'translateX(6px)' : 'translateX(0)',
                boxShadow: hoveredCat === cat.id ? `0 0 20px ${cat.color}22` : 'none',
                color: textColor,
              }}
            >
              <span style={s.categoryIcon}>{cat.icon}</span>
              <span style={s.categoryLabel}>{cat.label}</span>
              <span style={{ ...s.arrow, color: hoveredCat === cat.id ? cat.color : '#334155' }}>→</span>
            </button>
          ))}
        </div>
      )}
 
      {/* Report Screen */}
      {screen === 'report' && !loading && (
        <div style={s.reportWrap}>
          <div style={{ ...s.profileCard, background: cardBg, borderColor }}>
            <div style={s.profileAvatar}>{user.avatar}</div>
            <div>
              <div style={s.profileName}>{user.name}</div>
              <div style={s.profileAddr}>{user.address}</div>
            </div>
            <span style={s.verifiedBadge}>✓ Verified</span>
          </div>
 
          <h2 style={s.sectionTitle}>{selectedCategory?.icon} Reporting: {selectedCategory?.label}</h2>
 
          <div style={s.triageGrid}>
            {['Major Issue', 'Minor Issue'].map((label, i) => (
              <div
                key={label}
                onClick={() => setSelectedTriage(i)}
                style={{
                  ...s.triageCard(selectedTriage === i),
                  background: selectedTriage === i ? (darkMode ? '#0c2233' : '#eff6ff') : cardBg,
                  borderColor: selectedTriage === i ? '#22d3ee' : borderColor,
                  cursor: 'pointer',
                }}
              >
                <div style={s.triageCardTitle}>{label}</div>
                <div style={s.triageCardSub}>{i === 0 ? 'Urgent attention needed' : 'Non-emergency report'}</div>
              </div>
            ))}
          </div>
 
          <div style={s.aiSection}>
            <textarea
              style={{ ...s.textarea, background: cardBg, borderColor, color: textColor }}
              placeholder="Describe your issue in detail..."
              value={aiText}
              onChange={e => setAiText(e.target.value)}
            />
            <button style={s.aiBtn} onClick={handleAIRoute} disabled={aiLoading}>
              {aiLoading ? '⏳ Analyzing...' : '✨ Let AI Route My Issue'}
            </button>
 
            {aiLoading && (
              <div style={{ ...s.aiResult, background: darkMode ? '#0c1a2e' : '#f0f9ff' }}>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: '#0ea5e9',
                      animation: 'pulse 1s ease-in-out infinite',
                      animationDelay: `${i * 0.2}s`
                    }} />
                  ))}
                  <span style={{ color: '#64748b', fontSize: '13px' }}>Gemini AI routing your issue...</span>
                </div>
                <style>{`@keyframes pulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.2)} }`}</style>
              </div>
            )}
 
            {aiResult && (
              <div style={{ ...s.aiResult, background: darkMode ? '#0c1a2e' : '#f0f9ff', borderColor: darkMode ? '#1e3a5f' : '#bfdbfe' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', padding: '3px 10px', borderRadius: '20px', background: severityColor[aiResult.severity] + '22', color: severityColor[aiResult.severity] }}>
                    {aiResult.severity}
                  </span>
                  {aiResult.priority_bypass && (
                    <span style={{ fontSize: '11px', color: '#ef4444', fontWeight: '600' }}>🚨 PRIORITY BYPASS ACTIVATED</span>
                  )}
                </div>
                <p style={{ marginBottom: '6px' }}><strong>Department:</strong> {aiResult.department}</p>
                <p style={{ marginBottom: '6px', color: '#94a3b8' }}>{aiResult.summary}</p>
                <p style={{ marginBottom: '6px' }}><strong>Response Time:</strong> {aiResult.estimated_response}</p>
                <p style={{ color: '#22c55e' }}>📞 Emergency: {aiResult.emergency_number}</p>
              </div>
            )}
          </div>
 
          <div
            style={{ ...s.mapBox, background: cardBg, borderColor: pinDropped ? '#22c55e' : borderColor, cursor: 'crosshair' }}
            onClick={() => setPinDropped(true)}
          >
            <div style={{ fontSize: '32px' }}>{pinDropped ? '📍' : '🗺️'}</div>
            <div style={s.mapText}>{pinDropped ? 'Pin dropped! Location marked.' : 'Click to drop a pin on the map'}</div>
            {pinDropped && (
              <div style={{ position: 'absolute', bottom: '12px', right: '16px', fontSize: '11px', color: '#22c55e' }}>
                ✓ 12.9716° N, 80.2458° E
              </div>
            )}
          </div>
 
          <div style={s.btnRow}>
            <button style={s.backBtn} onClick={() => setScreen('landing')}>← Back</button>
            <button style={s.submitBtn} onClick={() => setScreen('map')}>Submit Report →</button>
          </div>
        </div>
      )}
 
      {/* Map Screen */}
      {screen === 'map' && (
        <div style={s.mapScreenWrap}>
          <h2 style={{ ...s.sectionTitle, marginBottom: '24px' }}>🗺️ Live Community Map — Chennai</h2>
 
          <div style={{ ...s.mapScreenBox, background: darkMode ? '#0a1628' : '#e2e8f0', borderColor }}>
            {/* Fake map grid */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.07 }}>
              {[...Array(8)].map((_, i) => (
                <div key={i} style={{ position: 'absolute', left: `${i * 14}%`, top: 0, bottom: 0, width: '1px', background: '#22d3ee' }} />
              ))}
              {[...Array(6)].map((_, i) => (
                <div key={i} style={{ position: 'absolute', top: `${i * 18}%`, left: 0, right: 0, height: '1px', background: '#22d3ee' }} />
              ))}
            </div>
            {mockIssues.map(issue => (
              <div key={issue.id}>
                <div style={s.pin(issue.color, issue.x, issue.y)} title={issue.label} />
                <div style={s.pinLabel(issue.x, issue.y)}>{issue.loc}</div>
              </div>
            ))}
            <div style={{ position: 'absolute', top: '12px', left: '12px', fontSize: '12px', color: '#475569' }}>
              Chennai, Tamil Nadu
            </div>
            <div style={{ position: 'absolute', bottom: '12px', right: '12px', fontSize: '11px', color: '#475569' }}>
              Simulated • Google Maps API
            </div>
          </div>
 
          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', fontSize: '13px' }}>
            <span><span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', marginRight: '6px' }} />Unverified</span>
            <span><span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', marginRight: '6px' }} />Resolved</span>
          </div>
 
          <div style={s.sidebar}>
            {mockIssues.map(issue => (
              <div key={issue.id} style={s.issueCard(issue.color)}>
                <div style={{ marginBottom: '6px' }}>
                  <span style={s.issueDot(issue.color)} />
                  <span style={s.issueTitle}>{issue.label}</span>
                </div>
                <div style={s.issueSub}>{issue.loc} · {issue.votes} votes</div>
                {issue.status === 'unverified' && (
                  <button style={s.verifyBtn}>👍 Verify</button>
                )}
                {issue.status === 'resolved' && (
                  <span style={{ fontSize: '11px', color: '#22c55e' }}>✓ Resolved</span>
                )}
              </div>
            ))}
          </div>
 
          <button style={s.backBtn} onClick={() => setScreen('landing')}>← Back to Home</button>
        </div>
      )}
 
    </div>
  )
}
 


