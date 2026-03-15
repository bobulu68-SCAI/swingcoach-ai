import { useState, useRef, useEffect, useCallback } from 'react'
import Head from 'next/head'
import ReactMarkdown from 'react-markdown'
import {
  SHOT_TYPES, GRIP_TYPES, PRO_GOLFERS, GRIPS, SHOTS,
  SKILL_LEVELS, FREE_ANALYSES_PER_MONTH, DAILY_TIPS
} from '../components/constants'

// ── Types ──────────────────────────────────────────────────────────────────
interface Session {
  id: string
  date: number
  shotType: string
  gripType: string
  proEmulate?: string
  result: string
  score: number
}

interface ChatMsg { text: string; isUser: boolean }

type Tab = 'home' | 'analyze' | 'learn' | 'progress' | 'profile'
type LearnSection = null | 'grips' | 'shots' | 'pros' | 'beginner' | 'rules' | 'chat'

// ── Helpers ────────────────────────────────────────────────────────────────
function getStorage<T>(key: string, def: T): T {
  if (typeof window === 'undefined') return def
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? def } catch { return def }
}
function setStorage(key: string, val: unknown) {
  if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(val))
}

function getMonthKey() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth()}`
}

// ══════════════════════════════════════════════════════════════════════════
export default function App() {
  const [tab, setTab] = useState<Tab>('home')
  const [learnSection, setLearnSection] = useState<LearnSection>(null)
  const [activeResult, setActiveResult] = useState<Session | null>(null)

  // Profile
  const [userName, setUserName] = useState('Golfer')
  const [skillLevel, setSkillLevel] = useState('Beginner')
  const [isPremium, setIsPremium] = useState(false)
  const [analysisCount, setAnalysisCount] = useState(0)
  const [analysisMonth, setAnalysisMonth] = useState('')

  // Sessions
  const [sessions, setSessions] = useState<Session[]>([])

  // Load from storage
  useEffect(() => {
    setUserName(getStorage('sc_name', 'Golfer'))
    setSkillLevel(getStorage('sc_skill', 'Beginner'))
    setIsPremium(getStorage('sc_premium', false))
    setSessions(getStorage('sc_sessions', []))
    const month = getStorage('sc_month', '')
    const count = getStorage('sc_count', 0)
    if (month !== getMonthKey()) {
      setAnalysisCount(0)
      setStorage('sc_count', 0)
      setStorage('sc_month', getMonthKey())
    } else {
      setAnalysisCount(count)
    }
    setAnalysisMonth(getMonthKey())
  }, [])

  const canAnalyze = isPremium || analysisCount < FREE_ANALYSES_PER_MONTH
  const remaining = isPremium ? 999 : Math.max(0, FREE_ANALYSES_PER_MONTH - analysisCount)

  function saveSession(s: Session) {
    const updated = [s, ...sessions].slice(0, 50)
    setSessions(updated)
    setStorage('sc_sessions', updated)
    const newCount = analysisCount + 1
    setAnalysisCount(newCount)
    setStorage('sc_count', newCount)
    setStorage('sc_month', getMonthKey())
  }

  function viewResult(s: Session) {
    setActiveResult(s)
    setTab('analyze')
  }

  const tip = DAILY_TIPS[new Date().getDate() % DAILY_TIPS.length]

  // ── Result View ────────────────────────────────────────────────────────
  if (activeResult) {
    return (
      <div className="app-shell">
        <Head><title>Coaching Results — SwingCoach AI</title></Head>
        <ResultView
          session={activeResult}
          sessions={sessions}
          setSessions={setSessions}
          onBack={() => setActiveResult(null)}
        />
      </div>
    )
  }

  // ── Learn sub-pages ────────────────────────────────────────────────────
  if (learnSection) {
    return (
      <div className="app-shell">
        <Head><title>Learn — SwingCoach AI</title></Head>
        <div className="page-content">
          <button onClick={() => setLearnSection(null)}
            style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', marginBottom: 12 }}>
            ← Back
          </button>
          {learnSection === 'grips'   && <GripGuide />}
          {learnSection === 'shots'   && <ShotLibrary />}
          {learnSection === 'pros'    && <ProComparison onAnalyze={(pro) => { setLearnSection(null); setTab('analyze') }} />}
          {learnSection === 'beginner'&& <BeginnerCourse />}
          {learnSection === 'rules'   && <RulesPage />}
          {learnSection === 'chat'    && <AskCoach skillLevel={skillLevel} />}
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <Head>
        <title>SwingCoach AI — Golf Coaching for Everyone</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      <div className="page-content">
        {tab === 'home'     && <HomeTab name={userName} tip={tip} remaining={remaining} isPremium={isPremium} sessions={sessions} onNavigate={setTab} onViewResult={viewResult} />}
        {tab === 'analyze'  && <AnalyzeTab canAnalyze={canAnalyze} remaining={remaining} isPremium={isPremium} onSave={saveSession} onUpgrade={() => setTab('profile')} />}
        {tab === 'learn'    && <LearnTab onSelect={setLearnSection} />}
        {tab === 'progress' && <ProgressTab sessions={sessions} onView={viewResult} />}
        {tab === 'profile'  && <ProfileTab name={userName} skillLevel={skillLevel} isPremium={isPremium} remaining={remaining}
          onSaveName={(n) => { setUserName(n); setStorage('sc_name', n) }}
          onSaveSkill={(s) => { setSkillLevel(s); setStorage('sc_skill', s) }}
          onUpgrade={() => { setIsPremium(true); setStorage('sc_premium', true) }}
        />}
      </div>

      <nav className="bottom-nav">
        {([
          ['home',    '🏠', 'Home'],
          ['analyze', '📹', 'Analyze'],
          ['learn',   '📚', 'Learn'],
          ['progress','📈', 'Progress'],
          ['profile', '👤', 'Profile'],
        ] as [Tab, string, string][]).map(([id, icon, label]) => (
          <button key={id} className={`nav-item ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>
            <span className="nav-icon">{icon}</span>
            {label}
          </button>
        ))}
      </nav>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// HOME TAB
// ══════════════════════════════════════════════════════════════════════════
function HomeTab({ name, tip, remaining, isPremium, sessions, onNavigate, onViewResult }:
  { name: string; tip: string; remaining: number; isPremium: boolean; sessions: Session[]; onNavigate: (t: Tab) => void; onViewResult: (s: Session) => void }) {
  return (
    <>
      <div className="hero-banner">
        <h2>Welcome back, {name}! 👋</h2>
        <p>{isPremium ? '✨ Premium — Unlimited analyses' : `${remaining} free analyses remaining this month`}</p>
        <button className="btn btn-gold" style={{ width: 'auto', padding: '10px 22px' }} onClick={() => onNavigate('analyze')}>
          📹 Analyze My Swing
        </button>
      </div>

      <p className="section-title">Quick Actions</p>
      <div className="quick-grid">
        {[
          { icon: '📹', label: 'Analyze Swing', sub: 'AI coaching', tab: 'analyze' as Tab },
          { icon: '📚', label: 'Learn Golf', sub: 'Grips, shots, rules', tab: 'learn' as Tab },
          { icon: '🏆', label: 'Emulate Pros', sub: 'Tiger, Rory & more', tab: 'learn' as Tab },
          { icon: '📈', label: 'My Progress', sub: 'Track improvement', tab: 'progress' as Tab },
        ].map(({ icon, label, sub, tab }) => (
          <button key={label} className="quick-card" onClick={() => onNavigate(tab)}>
            <div className="icon">{icon}</div>
            <div className="label">{label}</div>
            <div className="sub">{sub}</div>
          </button>
        ))}
      </div>

      <div className="tip-box">{tip}</div>

      {sessions.length > 0 && (
        <>
          <p className="section-title">Recent Sessions</p>
          {sessions.slice(0, 3).map(s => (
            <div key={s.id} className="card" style={{ cursor: 'pointer' }} onClick={() => onViewResult(s)}>
              <div className="flex-row flex-space">
                <div>
                  <div className="font-bold text-sm">{s.shotType}</div>
                  <div className="text-xs text-muted">{s.gripType} • {new Date(s.date).toLocaleDateString()}</div>
                  {s.proEmulate && <div className="text-xs text-gold">Emulating: {s.proEmulate}</div>}
                </div>
                <span style={{ fontSize: 20 }}>›</span>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// ANALYZE TAB
// ══════════════════════════════════════════════════════════════════════════
function AnalyzeTab({ canAnalyze, remaining, isPremium, onSave, onUpgrade }:
  { canAnalyze: boolean; remaining: number; isPremium: boolean; onSave: (s: Session) => void; onUpgrade: () => void }) {

  const [shotType, setShotType] = useState(SHOT_TYPES[0])
  const [gripType, setGripType] = useState(GRIP_TYPES[0])
  const [proEmulate, setProEmulate] = useState('None')
  const [mode, setMode] = useState<'select' | 'camera' | 'upload' | 'analyzing' | 'result'>('select')
  const [status, setStatus] = useState('')
  const [result, setResult] = useState('')
  const [recording, setRecording] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const framesRef = useRef<string[]>([])
  const captureTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function startCamera() {
    if (!canAnalyze) { onUpgrade(); return }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
      setMode('camera')
    } catch {
      alert('Camera access denied. Please allow camera access in your browser settings.')
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach(t => t.stop())
    if (captureTimerRef.current) clearInterval(captureTimerRef.current)
    setRecording(false)
  }

  function startRecording() {
    framesRef.current = []
    setRecording(true)
    const canvas = document.createElement('canvas')
    canvas.width = 320; canvas.height = 240
    const ctx = canvas.getContext('2d')!
    captureTimerRef.current = setInterval(() => {
      if (framesRef.current.length < 6 && videoRef.current) {
        ctx.drawImage(videoRef.current, 0, 0, 320, 240)
        framesRef.current.push(canvas.toDataURL('image/jpeg', 0.6))
      } else if (framesRef.current.length >= 6) {
        stopRecordingAndAnalyze()
      }
    }, 800)
  }

  function stopRecordingAndAnalyze() {
    if (captureTimerRef.current) clearInterval(captureTimerRef.current)
    setRecording(false)
    stopCamera()
    const frames = framesRef.current
    if (frames.length === 0) { setMode('select'); return }
    analyzeFrames(frames)
  }

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!canAnalyze) { onUpgrade(); return }
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('video/') && !file.type.startsWith('image/')) {
      alert('Please upload a video or image of your swing.')
      return
    }
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (ev) => analyzeFrames([ev.target?.result as string])
      reader.readAsDataURL(file)
    } else {
      extractVideoFrames(file)
    }
  }

  function extractVideoFrames(file: File) {
    setMode('analyzing')
    setStatus('📽️ Extracting frames from video...')
    const video = document.createElement('video')
    video.src = URL.createObjectURL(file)
    video.muted = true
    const canvas = document.createElement('canvas')
    canvas.width = 320; canvas.height = 240
    const ctx = canvas.getContext('2d')!
    const frames: string[] = []

    video.onloadedmetadata = () => {
      const duration = video.duration
      const times = [0, duration * 0.2, duration * 0.4, duration * 0.6, duration * 0.8, duration * 0.95]
      let i = 0
      function capture() {
        if (i >= times.length) { analyzeFrames(frames); return }
        video.currentTime = times[i]
        video.onseeked = () => {
          ctx.drawImage(video, 0, 0, 320, 240)
          frames.push(canvas.toDataURL('image/jpeg', 0.6))
          i++; capture()
        }
      }
      video.play().then(() => { video.pause(); capture() })
    }
    video.onerror = () => { setStatus('Could not read video file. Try uploading an image instead.') }
  }

  async function analyzeFrames(frames: string[]) {
    setMode('analyzing')
    setStatus('🤖 Analyzing your swing with AI...')

    // Build a textual description from frame data and metadata
    const frameLabels = ['Address/Setup', 'Early Backswing', 'Top of Backswing', 'Transition', 'Impact', 'Follow-Through']
    const poseDesc = frames.map((_, i) =>
      `Frame ${i + 1} (${frameLabels[i] || 'Swing position'}): Video frame captured for analysis.`
    ).join('\n') + `\n\n${frames.length} frames analyzed from the swing sequence.`

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          poseDescription: poseDesc,
          shotType,
          gripType,
          proEmulate: proEmulate !== 'None' ? proEmulate : null,
        }),
      })
      const data = await res.json()
      const text = data.result

      const session: Session = {
        id: Date.now().toString(),
        date: Date.now(),
        shotType,
        gripType,
        proEmulate: proEmulate !== 'None' ? proEmulate : undefined,
        result: text,
        score: 0,
      }
      onSave(session)
      setResult(text)
      setMode('result')
    } catch {
      setStatus('Connection error. Please check your internet and try again.')
    }
  }

  // Camera full-screen view
  if (mode === 'camera') {
    return (
      <div className="camera-container">
        <video ref={videoRef} autoPlay playsInline muted className="camera-video" />
        <div className="camera-controls">
          <p style={{ color: 'white', textAlign: 'center', fontSize: 13, opacity: 0.85 }}>
            {recording ? '🔴 Recording... capturing your swing automatically' : 'Position your FULL BODY in frame, then tap record'}
          </p>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'center' }}>
            <button className="btn btn-outline" style={{ width: 'auto', color: 'white', borderColor: 'white' }}
              onClick={() => { stopCamera(); setMode('select') }}>Cancel</button>
            <button className="record-btn" onClick={recording ? stopRecordingAndAnalyze : startRecording}>
              {recording ? '⏹' : '⏺'}
            </button>
            <div style={{ width: 80 }} />
          </div>
        </div>
      </div>
    )
  }

  if (mode === 'analyzing') {
    return (
      <div style={{ paddingTop: 60, textAlign: 'center' }}>
        <div className="loading-spinner" style={{ marginBottom: 20 }} />
        <div className="status-bar">{status}</div>
        <p className="text-muted text-sm">This takes about 10-20 seconds...</p>
      </div>
    )
  }

  if (mode === 'result') {
    return (
      <div>
        <button onClick={() => setMode('select')}
          style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', marginBottom: 16 }}>
          ← New Analysis
        </button>
        <div className="flex-row flex-space mb-12">
          <span className="tag tag-green">{shotType}</span>
          <span className="tag tag-blue">{gripType}</span>
          {proEmulate !== 'None' && <span className="tag tag-gold">Emulating: {proEmulate}</span>}
        </div>
        <div className="card coaching-content">
          <ReactMarkdown>{result}</ReactMarkdown>
        </div>
        <button className="btn btn-outline mt-8"
          onClick={() => {
            navigator.share?.({ title: 'My SwingCoach AI Results', text: result })
              .catch(() => navigator.clipboard?.writeText(result))
          }}>
          📤 Share These Tips
        </button>
      </div>
    )
  }

  // Select mode
  return (
    <>
      <div className="page-header">
        <div>
          <h1>🏌️ Analyze</h1>
          <p className="page-subtitle">Set up your shot, then record or upload</p>
        </div>
      </div>

      {!canAnalyze && (
        <div className="card card-green" style={{ marginBottom: 16 }}>
          <p className="font-bold mb-4">🔒 Free limit reached</p>
          <p className="text-sm" style={{ opacity: 0.9, marginBottom: 12 }}>
            You've used your {FREE_ANALYSES_PER_MONTH} free analyses this month.
            Upgrade for unlimited coaching.
          </p>
          <button className="btn btn-gold" onClick={onUpgrade}>Upgrade — $6.99/month</button>
        </div>
      )}

      <div className="card">
        <p className="section-title mb-8">Shot Setup</p>
        <div className="form-group">
          <label className="form-label">Shot Type</label>
          <select value={shotType} onChange={e => setShotType(e.target.value)}>
            {SHOT_TYPES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Grip Type</label>
          <select value={gripType} onChange={e => setGripType(e.target.value)}>
            {GRIP_TYPES.map(g => <option key={g}>{g}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Emulate a Pro (optional)</label>
          <select value={proEmulate} onChange={e => setProEmulate(e.target.value)}>
            <option>None</option>
            {PRO_GOLFERS.map(p => <option key={p.name}>{p.name}</option>)}
          </select>
        </div>
      </div>

      <button className="btn btn-primary mb-8" onClick={startCamera} disabled={!canAnalyze}>
        📹 Live Camera Analysis
      </button>
      <button className="btn btn-outline mb-8" onClick={() => { if (!canAnalyze) { onUpgrade(); return }; fileInputRef.current?.click() }} disabled={!canAnalyze}>
        🎬 Upload Video or Photo
      </button>
      <input ref={fileInputRef} type="file" accept="video/*,image/*" style={{ display: 'none' }} onChange={handleUpload} />

      <div className="tip-box">
        📸 <strong>Best results:</strong> Film from the side or behind. Make sure your full body is visible. Good lighting helps a lot!
        {!isPremium && <span className="text-muted" style={{ display: 'block', marginTop: 4 }}>{remaining} free {remaining === 1 ? 'analysis' : 'analyses'} remaining this month.</span>}
      </div>
    </>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// RESULT VIEW
// ══════════════════════════════════════════════════════════════════════════
function ResultView({ session, sessions, setSessions, onBack }:
  { session: Session; sessions: Session[]; setSessions: (s: Session[]) => void; onBack: () => void }) {
  const [score, setScore] = useState(session.score)

  function updateScore(val: number) {
    setScore(val)
    const updated = sessions.map(s => s.id === session.id ? { ...s, score: val } : s)
    setSessions(updated)
    setStorage('sc_sessions', updated)
  }

  return (
    <div className="page-content">
      <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', marginBottom: 16 }}>
        ← Back
      </button>
      <div className="flex-row mb-12" style={{ flexWrap: 'wrap', gap: 6 }}>
        <span className="tag tag-green">{session.shotType}</span>
        <span className="tag tag-blue">{session.gripType}</span>
        {session.proEmulate && <span className="tag tag-gold">Emulating: {session.proEmulate}</span>}
        <span className="text-xs text-muted" style={{ marginLeft: 'auto' }}>{new Date(session.date).toLocaleDateString()}</span>
      </div>
      <div className="card coaching-content mb-12">
        <ReactMarkdown>{session.result}</ReactMarkdown>
      </div>
      <div className="card">
        <p className="text-sm font-bold mb-8">How did this swing feel? {score}/100</p>
        <input type="range" min={0} max={100} value={score} onChange={e => updateScore(Number(e.target.value))} />
      </div>
      <button className="btn btn-outline mt-8"
        onClick={() => navigator.share?.({ title: 'SwingCoach AI Results', text: session.result }).catch(() => {})}>
        📤 Share These Tips
      </button>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// LEARN TAB
// ══════════════════════════════════════════════════════════════════════════
function LearnTab({ onSelect }: { onSelect: (s: LearnSection) => void }) {
  const items = [
    { id: 'grips' as LearnSection,   icon: '🤲', label: 'Grip Guide',       sub: '6 grip types with tutorials' },
    { id: 'shots' as LearnSection,   icon: '🏌️', label: 'Shot Library',     sub: '10 shots, step-by-step' },
    { id: 'pros' as LearnSection,    icon: '🏆', label: 'Emulate the Pros',  sub: 'Tiger, Rory, Annika & more' },
    { id: 'beginner' as LearnSection,icon: '🌱', label: "Beginner's Course", sub: '6 lessons from zero to course' },
    { id: 'rules' as LearnSection,   icon: '📋', label: 'Rules of Golf',     sub: 'Common rules & penalties' },
    { id: 'chat' as LearnSection,    icon: '🤖', label: 'Ask AI Coach',      sub: 'Chat with your personal coach', highlight: true },
  ]
  return (
    <>
      <div className="page-header"><h1>📚 Golf Academy</h1></div>
      {items.map(({ id, icon, label, sub, highlight }) => (
        <div key={String(id)} className={`card ${highlight ? 'card-green' : ''}`}
          style={{ cursor: 'pointer' }} onClick={() => onSelect(id)}>
          <div className="flex-row flex-space">
            <div className="flex-row" style={{ gap: 14 }}>
              <span style={{ fontSize: 32 }}>{icon}</span>
              <div>
                <div className={`font-bold text-sm ${highlight ? '' : ''}`}>{label}</div>
                <div className={`text-xs ${highlight ? '' : 'text-muted'}`} style={{ opacity: highlight ? 0.85 : 1 }}>{sub}</div>
              </div>
            </div>
            <span style={{ fontSize: 20 }}>›</span>
          </div>
        </div>
      ))}
    </>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// GRIP GUIDE
// ══════════════════════════════════════════════════════════════════════════
function GripGuide() {
  const [active, setActive] = useState(0)
  const grip = GRIPS[active]
  return (
    <>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--green-deep)', marginBottom: 14 }}>🤲 Grip Guide</h1>
      <div className="grip-tabs">
        {GRIPS.map((g, i) => (
          <button key={g.name} className={`grip-tab ${active === i ? 'active' : ''}`} onClick={() => setActive(i)}>
            {g.emoji} {g.name.split(' ')[0]}
          </button>
        ))}
      </div>
      <div className="card">
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--green-deep)', marginBottom: 6 }}>
          {grip.emoji} {grip.name}
        </h2>
        <div className="tip-box mb-8"><strong>Who is this for?</strong><br />{grip.whoFor}</div>
        <p className="section-title">How to grip:</p>
        <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>{grip.howTo}</pre>
        <p style={{ fontSize: 13, marginBottom: 4 }}>{grip.pros}</p>
        <p style={{ fontSize: 13, color: 'var(--gray-mid)', marginBottom: 8 }}>{grip.cons}</p>
        <p style={{ fontSize: 12, color: 'var(--gold)', marginBottom: 14 }}>🏆 Famous users: {grip.users}</p>
        <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(grip.youtube)}`}
          target="_blank" rel="noreferrer" className="btn btn-primary" style={{ textDecoration: 'none', display: 'flex' }}>
          ▶ Watch Tutorial on YouTube
        </a>
      </div>
    </>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// SHOT LIBRARY
// ══════════════════════════════════════════════════════════════════════════
function ShotLibrary() {
  const [expanded, setExpanded] = useState<number | null>(null)
  return (
    <>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--green-deep)', marginBottom: 6 }}>🏌️ Shot Library</h1>
      <p className="text-muted text-sm mb-12">Tap any shot to see full instructions</p>
      {SHOTS.map((shot, i) => (
        <div key={shot.name} className="card" style={{ cursor: 'pointer' }}>
          <div className="expandable-header" onClick={() => setExpanded(expanded === i ? null : i)}>
            <div>
              <div className="font-bold">{shot.emoji} {shot.name}</div>
              <div className="text-xs text-gold">{shot.club}</div>
              <div className="text-xs text-muted">{shot.when}</div>
            </div>
            <span style={{ fontSize: 18 }}>{expanded === i ? '▲' : '▼'}</span>
          </div>
          {expanded === i && (
            <div style={{ marginTop: 12 }}>
              <div className="divider" />
              <p className="text-sm font-bold text-green mb-4">✅ Key Tips:</p>
              <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--font-body)', fontSize: 13, lineHeight: 1.6, marginBottom: 10 }}>{shot.tips}</pre>
              <p style={{ fontSize: 13, color: 'var(--gray-mid)', marginBottom: 12 }}>⚠️ Common mistakes: {shot.mistakes}</p>
              <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(shot.youtube)}`}
                target="_blank" rel="noreferrer" className="btn btn-primary" style={{ textDecoration: 'none', display: 'flex' }}>
                ▶ Watch on YouTube
              </a>
            </div>
          )}
        </div>
      ))}
    </>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// PRO COMPARISON
// ══════════════════════════════════════════════════════════════════════════
function ProComparison({ onAnalyze }: { onAnalyze: (pro: string) => void }) {
  return (
    <>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--green-deep)', marginBottom: 6 }}>🏆 Emulate the Pros</h1>
      <p className="text-muted text-sm mb-12">Choose a pro, then analyze your swing to see how you compare</p>
      {PRO_GOLFERS.map(pro => (
        <div key={pro.name} className="pro-card">
          <div className="pro-name">{pro.name}</div>
          <div className="pro-style">{pro.style}</div>
          <div className="pro-desc">{pro.desc}</div>
          <div className="pro-actions">
            <a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(pro.name + ' swing slow motion')}`}
              target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ textDecoration: 'none' }}>
              ▶ Watch
            </a>
            <button className="btn btn-primary btn-sm" onClick={() => onAnalyze(pro.name)}>
              Analyze My Swing Like This
            </button>
          </div>
        </div>
      ))}
    </>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// BEGINNER COURSE
// ══════════════════════════════════════════════════════════════════════════
function BeginnerCourse() {
  const [active, setActive] = useState(0)
  const lessons = [
    { title: '⛳ What is Golf?', content: `Golf is a sport where players use clubs to hit a ball into a series of holes in as few strokes as possible.\n\nA standard course has 18 holes. Each hole has a "par" — the expected number of strokes.\n• Par 3: Short hole\n• Par 4: Medium hole\n• Par 5: Long hole\n\nScoring terms:\n• Ace: 1 stroke (amazing!)\n• Eagle: 2 under par\n• Birdie: 1 under par\n• Par: Expected strokes\n• Bogey: 1 over par\n\nFor beginners — just finishing each hole is a win! Don't worry about your score at first.` },
    { title: '🏷️ Equipment', content: `You don't need to spend a fortune!\n\nSTARTER SET (buy used, $50-150):\n• Driver — tee shots\n• 7-iron — versatile mid-range\n• 9-iron — shorter shots\n• Pitching wedge — near the green\n• Putter — on the green\n\nBUDGET TIPS:\n• Play It Again Sports, eBay, Facebook Marketplace\n• Walmart/Target starter sets ($100-200) work fine\n• Don't buy expensive clubs until 6+ months in\n\nOTHER GEAR:\n• Golf balls (buy recycled to start)\n• Golf glove (worn on left hand for right-handers)\n• Tees (a few dozen)\n• Ball marker (a coin works!)` },
    { title: '📐 Setup & Address', content: `Before you swing, your setup determines everything.\n\nGRIP:\n• Hold in fingers, not palm\n• Pressure: imagine holding toothpaste without squeezing\n• See the Grip Guide for your grip type!\n\nSTANCE:\n• Feet shoulder-width apart\n• Toes pointed out slightly\n• Knees slightly bent (like sitting on a barstool)\n• Bend from hips, not waist\n• Back relatively straight\n\nBALL POSITION:\n• Driver: off front heel\n• Mid-irons: center of stance\n• Short irons: slightly back of center\n\nALIGNMENT:\n• Feet, hips, shoulders parallel to target line\n• Pick a spot 2-3 feet ahead of ball to aim at` },
    { title: '🔄 The Basic Swing', content: `Think of the golf swing in 5 parts:\n\n1. TAKEAWAY\n   Move club, hands, and shoulders as one unit\n   Keep club low to ground for first foot\n\n2. BACKSWING\n   Rotate shoulders away from target\n   Weight shifts to back foot\n   Left arm relatively straight\n\n3. DOWNSWING\n   Start with HIPS rotating (not hands!)\n   Let club drop naturally\n   Keep head still\n\n4. IMPACT\n   Hands slightly ahead of ball\n   Weight transfers to front foot\n\n5. FOLLOW-THROUGH\n   Belt buckle faces target\n   Weight on front foot\n   Hold your finish!\n\n#1 TIP: Swing at 70% power. Slower = straighter and farther!` },
    { title: '🏟️ Etiquette', content: `Golf has a code of conduct. Learn it and you'll be welcomed anywhere.\n\nON THE COURSE:\n• Keep up with the group ahead\n• Let faster groups play through\n• Don't talk during someone's swing\n• Be quiet when someone putts\n\nCARING FOR THE COURSE:\n• Fix your ball marks on the green\n• Rake bunkers after exiting\n• Replace or fill your divots\n• Don't drag feet on greens\n\nSAFETY:\n• Yell "FORE!" if ball might hit someone\n• Never hit until group ahead is out of range\n• Stand to the side, never behind a swinger\n\nDRESS CODE:\n• Most courses require collared shirts\n• No jeans on most courses` },
    { title: '🧠 Mental Game', content: `Golf is 90% mental once you have the basics.\n\nPRE-SHOT ROUTINE (every pro has one):\n• Stand behind ball, pick target, visualize shot\n• Take 1-2 practice swings\n• Address ball the same way every time\n• Trust your swing and commit\n\nDEALING WITH BAD SHOTS:\n• Every golfer hits bad shots — even Tiger\n• Give yourself 10 seconds to be frustrated\n• Then let it go completely\n• The next shot is all that matters\n\nCOURSE MANAGEMENT:\n• Play to fat part of green, not every flag\n• Avoid trouble even if it means less distance\n• Bogey is FINE. Two in a row is still fine.\n• Avoid the big numbers (triples, quads)\n\nMOST IMPORTANT:\nHave fun. Golf is a game. A kid who loves it and practices with joy will always beat someone who treats it as a burden.\n\nYou belong on the golf course. 🏌️` },
  ]
  const lesson = lessons[active]
  return (
    <>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--green-deep)', marginBottom: 16 }}>🌱 Beginner's Course</h1>
      <div className="chip-row">
        {lessons.map((l, i) => (
          <button key={i} className={`chip ${active === i ? 'active' : ''}`} onClick={() => setActive(i)}>
            {l.title.split(' ')[0]}
          </button>
        ))}
      </div>
      <div className="card">
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 12 }}>{lesson.title}</h2>
        <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.7 }}>{lesson.content}</pre>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
        {active > 0 && <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setActive(active - 1)}>← Previous</button>}
        {active < lessons.length - 1 && <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setActive(active + 1)}>Next Lesson →</button>}
      </div>
    </>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// RULES PAGE
// ══════════════════════════════════════════════════════════════════════════
function RulesPage() {
  return (
    <>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--green-deep)', marginBottom: 16 }}>📋 Rules of Golf</h1>
      {[
        { title: 'Out of Bounds (White Stakes)', content: 'Ball goes OB = stroke and distance penalty (1 stroke + re-hit from original spot). Or use local drop rule near where it went OB for 2 penalty strokes.' },
        { title: 'Water Hazards', content: 'Yellow stakes: 1 stroke penalty, drop behind hazard keeping entry point between you and flag.\n\nRed stakes: 1 stroke penalty, drop within 2 club lengths of where ball entered.' },
        { title: 'Lost Ball', content: 'You have 3 minutes to search. If not found: stroke and distance (re-hit from original spot).\n\nPro tip: Always hit a provisional ball if your shot might be lost!' },
        { title: 'Unplayable Lie', content: 'Declare it unplayable (1 stroke penalty). Options: drop within 2 club lengths, drop behind keeping point between you and hole, or re-hit from original spot.' },
        { title: '🎉 Free Relief (No Penalty!)', content: 'You get FREE drops from: cart paths, sprinkler heads, temporary water/puddles, ground under repair, and animal holes. Drop within 1 club length of nearest relief point, no closer to hole.' },
        { title: 'On the Green', content: 'Mark your ball before lifting. Clean it when you lift. Repair ball marks. Don\'t step on another player\'s putting line. Flag can stay in or come out — your choice!' },
        { title: 'Common Penalties', content: 'Hitting wrong ball: 2 strokes\nPlaying from wrong place: 2 strokes\nImproving your lie: 2 strokes\nGrounding club in bunker: 2 strokes' },
        { title: '🌱 Beginner Strategy', content: 'Set a max of double-par per hole and pick up. Count ALL strokes including penalties. Be honest with yourself — golf is a game of honor and you\'re only competing against yourself at this stage.' },
      ].map(({ title, content }) => (
        <div key={title} className="card mb-8">
          <p className="font-bold text-green mb-8">{title}</p>
          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'var(--font-body)', fontSize: 13, lineHeight: 1.6, color: 'var(--charcoal)' }}>{content}</pre>
        </div>
      ))}
    </>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// ASK COACH
// ══════════════════════════════════════════════════════════════════════════
function AskCoach({ skillLevel }: { skillLevel: string }) {
  const [messages, setMessages] = useState<ChatMsg[]>([
    { text: "Hi! I'm your AI golf coach 🏌️ Ask me anything — grips, stance, swing tips, rules, course strategy, mental game... I'm here to help!", isUser: false }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  const quickQs = ['How do I stop slicing?', 'Best grip for beginners?', 'How do I get more distance?', 'How to hit a bunker shot?', 'How to read a green?', 'What should I practice first?']

  async function sendMsg(question: string) {
    if (!question.trim() || loading) return
    setInput('')
    setMessages(prev => [...prev, { text: question, isUser: true }, { text: '...', isUser: false }])
    setLoading(true)
    try {
      const res = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, skillLevel }),
      })
      const data = await res.json()
      setMessages(prev => [...prev.slice(0, -1), { text: data.result, isUser: false }])
    } catch {
      setMessages(prev => [...prev.slice(0, -1), { text: 'Connection error. Please try again.', isUser: false }])
    }
    setLoading(false)
  }

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--green-deep)', marginBottom: 10 }}>🤖 Ask AI Coach</h1>
      <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 8, marginBottom: 10, scrollbarWidth: 'none' }}>
        {quickQs.map(q => <button key={q} className="chip" style={{ flexShrink: 0 }} onClick={() => sendMsg(q)}>{q}</button>)}
      </div>
      <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
        {messages.map((m, i) => (
          <div key={i} className={`chat-bubble ${m.isUser ? 'user' : 'coach'}`}>
            {m.text === '...' ? <span style={{ opacity: 0.5 }}>Thinking... 🤔</span> : m.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div style={{ display: 'flex', gap: 8, paddingTop: 10, borderTop: '1px solid var(--gray-light)' }}>
        <input type="text" value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMsg(input)}
          placeholder="Ask anything about golf..."
          style={{ flex: 1, fontSize: 15 }} />
        <button className="btn btn-primary" style={{ width: 48, padding: 0, flexShrink: 0 }}
          onClick={() => sendMsg(input)} disabled={loading}>→</button>
      </div>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// PROGRESS TAB
// ══════════════════════════════════════════════════════════════════════════
function ProgressTab({ sessions, onView }: { sessions: Session[]; onView: (s: Session) => void }) {
  const thisMonth = sessions.filter(s => {
    const d = new Date(s.date)
    const n = new Date()
    return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear()
  }).length

  const shotCounts = sessions.reduce((acc, s) => {
    acc[s.shotType] = (acc[s.shotType] || 0) + 1; return acc
  }, {} as Record<string, number>)

  const topShots = Object.entries(shotCounts).sort((a, b) => b[1] - a[1]).slice(0, 3)

  return (
    <>
      <div className="page-header"><h1>📈 Progress</h1></div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
        <div className="card card-green" style={{ textAlign: 'center', padding: '16px 12px' }}>
          <div style={{ fontSize: 32, fontWeight: 900 }}>{sessions.length}</div>
          <div style={{ fontSize: 12, opacity: 0.85 }}>Total Sessions</div>
        </div>
        <div className="card card-gold" style={{ textAlign: 'center', padding: '16px 12px' }}>
          <div style={{ fontSize: 32, fontWeight: 900 }}>{thisMonth}</div>
          <div style={{ fontSize: 12, opacity: 0.85 }}>This Month</div>
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🏌️</div>
          <p className="font-bold mb-4">No sessions yet!</p>
          <p className="text-muted text-sm">Analyze your first swing to start tracking your progress.</p>
        </div>
      ) : (
        <>
          {topShots.length > 0 && (
            <div className="card mb-8">
              <p className="section-title mb-8">Most Practiced</p>
              {topShots.map(([shot, count]) => (
                <div key={shot} className="flex-row flex-space text-sm" style={{ marginBottom: 6 }}>
                  <span>{shot}</span>
                  <span className="tag tag-green">{count}×</span>
                </div>
              ))}
            </div>
          )}
          <p className="section-title mb-8">Session History</p>
          {sessions.map(s => (
            <div key={s.id} className="card" style={{ cursor: 'pointer', marginBottom: 8 }} onClick={() => onView(s)}>
              <div className="flex-row flex-space">
                <div>
                  <div className="font-bold text-sm">{s.shotType}</div>
                  <div className="text-xs text-muted">{s.gripType} • {new Date(s.date).toLocaleDateString()}</div>
                  {s.proEmulate && <div className="text-xs text-gold">Emulating: {s.proEmulate}</div>}
                  {s.score > 0 && <div className="text-xs text-green">Feel: {s.score}/100</div>}
                </div>
                <span style={{ fontSize: 20 }}>›</span>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  )
}

// ══════════════════════════════════════════════════════════════════════════
// PROFILE TAB
// ══════════════════════════════════════════════════════════════════════════
function ProfileTab({ name, skillLevel, isPremium, remaining, onSaveName, onSaveSkill, onUpgrade }:
  { name: string; skillLevel: string; isPremium: boolean; remaining: number; onSaveName: (n: string) => void; onSaveSkill: (s: string) => void; onUpgrade: () => void }) {
  const [nameVal, setNameVal] = useState(name)
  const [skill, setSkill] = useState(skillLevel)
  const [saved, setSaved] = useState(false)

  function save() {
    onSaveName(nameVal)
    onSaveSkill(skill)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <>
      <div className="page-header"><h1>👤 Profile</h1></div>

      <div className="card mb-8">
        <p className="section-title mb-12">Your Info</p>
        <div className="form-group">
          <label className="form-label">Your Name</label>
          <input type="text" value={nameVal} onChange={e => setNameVal(e.target.value)} placeholder="Golfer" />
        </div>
        <div className="form-group">
          <label className="form-label">Skill Level</label>
          <select value={skill} onChange={e => setSkill(e.target.value)}>
            {SKILL_LEVELS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <button className="btn btn-primary" onClick={save}>
          {saved ? '✅ Saved!' : 'Save Profile'}
        </button>
      </div>

      <div className={`card mb-8 ${isPremium ? 'card-green' : ''}`}>
        <p className={`font-bold mb-4 ${isPremium ? '' : 'text-green'}`}>
          {isPremium ? '✨ Premium Active' : '🆓 Free Plan'}
        </p>
        <p className="text-sm mb-8" style={{ opacity: isPremium ? 0.9 : 1 }}>
          {isPremium
            ? 'Unlimited AI analyses • Pro comparisons • Full progress tracking'
            : `${remaining} free ${remaining === 1 ? 'analysis' : 'analyses'} remaining this month`}
        </p>
        {!isPremium && (
          <>
            <div className="tip-box mb-12" style={{ background: '#e8f5e9' }}>
              <strong>What you get with Premium:</strong><br />
              ✅ Unlimited AI swing analyses<br />
              ✅ Compare to any pro golfer<br />
              ✅ Full progress tracking<br />
              ✅ Priority coaching tips<br /><br />
              Your support keeps the FREE tier alive for kids and beginners worldwide 🌍
            </div>
            <button className="btn btn-primary mb-8" onClick={onUpgrade}>
              ⭐ Upgrade — $6.99/month
            </button>
            <button className="btn btn-gold" onClick={onUpgrade}>
              🏆 Best Value — $49.99/year (Save 40%!)
            </button>
          </>
        )}
      </div>

      <div className="card">
        <p className="section-title mb-8">About SwingCoach AI</p>
        <p className="text-sm text-muted" style={{ lineHeight: 1.6 }}>
          Built to make golf accessible to everyone — especially kids who didn't grow up with access to expensive lessons or private courses. Every premium subscription helps keep the free tier alive.
        </p>
      </div>
    </>
  )
}
