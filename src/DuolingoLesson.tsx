import { useEffect, useState } from 'react'
import { Check, Heart, Play, RotateCcw, Sparkles, Volume2, X, Zap } from 'lucide-react'

export interface DuolingoLessonProps {
  startingXp: number
  onClose: () => void
  onFinish: () => void
}

type LessonStep = 1 | 2 | 3
type AnswerState = 'idle' | 'correct' | 'incorrect'

interface Answer {
  id: string
  label: string
  detail: string
}

const answers: Answer[] = [
  { id: 'a', label: 'It measures the echo time', detail: 'Correct answer' },
  { id: 'b', label: 'It senses light intensity', detail: 'Like a photoresistor' },
  { id: 'c', label: 'It reads air temperature', detail: 'Like a thermometer' },
  { id: 'd', label: 'It detects magnetic fields', detail: 'Like a compass' },
]

export default function DuolingoLesson({ startingXp, onClose, onFinish }: DuolingoLessonProps) {
  const [step, setStep] = useState<LessonStep>(1)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [answerState, setAnswerState] = useState<AnswerState>('idle')
  const [soundOn, setSoundOn] = useState(true)

  const progress = step === 1 ? 33 : step === 2 ? 66 : 100
  const selected = answers.find((answer) => answer.id === selectedAnswer)

  useEffect(() => {
    if (answerState === 'correct' && soundOn) {
      // A tiny, dependency-free success cue. Browsers may ignore it until user interaction.
      const AudioContext = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof window.AudioContext }).webkitAudioContext
      if (!AudioContext) return
      const context = new AudioContext()
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.frequency.setValueAtTime(660, context.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(880, context.currentTime + 0.12)
      gain.gain.setValueAtTime(0.06, context.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.18)
      oscillator.connect(gain).connect(context.destination)
      oscillator.start()
      oscillator.stop(context.currentTime + 0.18)
      return () => { void context.close() }
    }
  }, [answerState, soundOn])

  const checkAnswer = () => {
    if (!selectedAnswer) return
    setAnswerState(selectedAnswer === 'a' ? 'correct' : 'incorrect')
  }

  const continueFromFeedback = () => {
    if (answerState === 'correct') setStep(3)
    else {
      setSelectedAnswer(null)
      setAnswerState('idle')
    }
  }

  const restart = () => {
    setStep(1)
    setSelectedAnswer(null)
    setAnswerState('idle')
  }

  return (
    <section className="duo-lesson" aria-label="Ultrasonic sensor lesson">
      <style>{lessonStyles}</style>
      <div className="duo-shell">
        <header className="duo-header">
          <button className="duo-icon-button" onClick={onClose} aria-label="Exit lesson"><X size={25} /></button>
          <div className="duo-progress" aria-label={`${progress}% lesson complete`}><span style={{ width: `${progress}%` }} /></div>
          <div className="duo-xp"><Heart size={21} fill="#FF4B4B" /> <strong>{startingXp + (step === 3 ? 50 : 0)}</strong></div>
        </header>

        <main className="duo-content">
          {step === 1 && <div className="duo-stage duo-video-stage">
            <div className="duo-step-label"><span>LESSON 4</span><b>ULTRASONIC SENSOR</b></div>
            <h1>Teach your robot<br /><em>to see distance.</em></h1>
            <p className="duo-intro">Watch how an ultrasonic sensor sends sound waves and turns the returning echo into a distance measurement.</p>
            <div className="duo-video" role="img" aria-label="Video preview illustrating ultrasonic sensor sound waves">
              <div className="duo-video-grid" />
              <div className="duo-sensor"><i /><i /><span>HC-SR04</span></div>
              <div className="duo-wave duo-wave-one" /><div className="duo-wave duo-wave-two" /><div className="duo-wave duo-wave-three" />
              <button className="duo-play" aria-label="Play lesson video"><Play size={29} fill="currentColor" /></button>
              <div className="duo-video-caption"><span>03:24</span><b>How ultrasonic distance sensing works</b></div>
            </div>
          </div>}

          {step === 2 && <div className="duo-stage duo-quiz-stage">
            <div className="duo-step-label"><span>QUICK CHECK</span><b>1 OF 1</b></div>
            <h1>How does an ultrasonic<br />sensor find distance?</h1>
            <p className="duo-question-help">Choose the best answer based on the video.</p>
            <div className="duo-answers">
              {answers.map((answer) => <button key={answer.id} onClick={() => answerState === 'idle' && setSelectedAnswer(answer.id)} className={`duo-answer ${selectedAnswer === answer.id ? 'is-selected' : ''} ${answerState !== 'idle' && answer.id === 'a' ? 'is-correct' : ''} ${answerState === 'incorrect' && selectedAnswer === answer.id ? 'is-wrong' : ''}`}>
                <span>{answer.id.toUpperCase()}</span><div><b>{answer.label}</b><small>{answer.detail}</small></div>
              </button>)}
            </div>
          </div>}

          {step === 3 && <div className="duo-stage duo-complete-stage">
            <div className="duo-confetti">✦　·　✦　·　✦</div>
            <div className="duo-trophy"><Sparkles size={44} /></div>
            <div className="duo-step-label"><span>LESSON COMPLETE</span><b>GREAT JOB!</b></div>
            <h1>You learned how<br /><em>robots measure space.</em></h1>
            <div className="duo-rewards"><div><Zap size={24} fill="currentColor" /><strong>+50 XP</strong><small>Lesson reward</small></div><div><span className="duo-flame">🔥</span><strong>Streak maintained</strong><small>5 days strong</small></div></div>
            <p className="duo-complete-copy">Next, you’ll use the HC-SR04 to make your Arduino react when something gets too close.</p>
          </div>}
        </main>

        <footer className={`duo-footer ${answerState !== 'idle' ? `duo-feedback ${answerState}` : ''}`}>
          {step === 1 && <button className="duo-primary" onClick={() => setStep(2)}>Continue <span>→</span></button>}
          {step === 2 && answerState === 'idle' && <button className="duo-primary" disabled={!selectedAnswer} onClick={checkAnswer}>Check</button>}
          {step === 2 && answerState === 'correct' && <div className="duo-feedback-inner"><div className="duo-feedback-icon"><Check size={27} /></div><div><h2>Nice work!</h2><p>You’ve got it — echo time reveals distance.</p></div><button className="duo-primary" onClick={continueFromFeedback}>Continue</button></div>}
          {step === 2 && answerState === 'incorrect' && <div className="duo-feedback-inner"><div className="duo-feedback-icon"><X size={27} /></div><div><h2>Not quite</h2><p>The correct answer is: <b>it measures the echo time.</b></p></div><button className="duo-primary" onClick={continueFromFeedback}>Understood</button></div>}
          {step === 3 && <div className="duo-footer-actions"><button className="duo-secondary" onClick={restart}><RotateCcw size={18} /> Review</button><button className="duo-primary" onClick={onFinish}>Finish lesson <span>→</span></button></div>}
        </footer>
      </div>
      <button className="duo-sound" onClick={() => setSoundOn(!soundOn)} aria-label={soundOn ? 'Turn sound off' : 'Turn sound on'}><Volume2 size={19} /><span>{soundOn ? 'Sound on' : 'Sound off'}</span></button>
    </section>
  )
}

const lessonStyles = `
  .duo-lesson{--green:#58CC02;--green-dark:#46a302;--blue:#1CB0F6;--red:#FF4B4B;min-height:calc(100vh - 70px);margin:-42px -48px -55px;background:#fff;color:#3c3c3c;font-family:Nunito,ui-rounded,"Arial Rounded MT Bold",system-ui,sans-serif;display:grid;place-items:center;position:relative;overflow:hidden}.duo-shell{width:min(780px,100%);min-height:calc(100vh - 70px);display:flex;flex-direction:column}.duo-header{height:86px;padding:0 28px;display:flex;align-items:center;gap:20px;border-bottom:2px solid #f1f3f5}.duo-icon-button{border:0;background:transparent;color:#aeb5ba;display:grid;place-items:center;cursor:pointer}.duo-icon-button:hover{color:#777}.duo-progress{height:16px;background:#e5e5e5;border-radius:999px;flex:1;overflow:hidden}.duo-progress span{height:100%;display:block;background:var(--green);border-radius:inherit;transition:width .45s cubic-bezier(.2,.9,.3,1)}.duo-xp{display:flex;align-items:center;gap:7px;color:#ff4b4b;font-size:17px}.duo-content{flex:1;display:flex;justify-content:center;padding:48px 28px 30px}.duo-stage{width:min(620px,100%)}.duo-step-label{font-size:12px;letter-spacing:.9px;font-weight:900;display:flex;gap:10px;color:#8b9499}.duo-step-label span{color:var(--blue)}.duo-stage h1{font-size:clamp(32px,5vw,46px);line-height:1.07;letter-spacing:-1.8px;margin:16px 0 13px;font-weight:900}.duo-stage h1 em{color:var(--green);font-style:normal}.duo-intro,.duo-question-help,.duo-complete-copy{font-size:17px;line-height:1.5;color:#777f84;max-width:590px;margin:0}.duo-video{height:300px;margin-top:32px;border-radius:24px;overflow:hidden;background:linear-gradient(135deg,#1cb0f6,#087fbe);position:relative;box-shadow:inset 0 -6px rgba(0,0,0,.12)}.duo-video-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.1) 1px,transparent 1px);background-size:32px 32px}.duo-sensor{position:absolute;left:72px;top:102px;width:145px;height:96px;border-radius:13px;background:#63c681;border-bottom:7px solid #368a52;box-shadow:0 13px 0 rgba(0,0,0,.12);display:flex;gap:13px;align-items:center;justify-content:center}.duo-sensor i{width:41px;height:41px;background:#354b5b;border:6px solid #dcebf0;border-radius:50%;box-shadow:inset 0 0 0 4px #667b88}.duo-sensor span{position:absolute;bottom:8px;color:#e1f7df;font-size:10px;font-weight:900;letter-spacing:.6px}.duo-wave{position:absolute;border:5px solid rgba(255,255,255,.78);border-left:0;border-bottom:0;border-radius:0 100% 0 0;transform:rotate(45deg)}.duo-wave-one{width:64px;height:64px;left:239px;top:114px}.duo-wave-two{width:112px;height:112px;left:230px;top:89px}.duo-wave-three{width:164px;height:164px;left:215px;top:62px}.duo-play{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:68px;height:68px;border:0;border-bottom:5px solid #d0d5d7;border-radius:50%;background:#fff;color:var(--blue);display:grid;place-items:center;cursor:pointer}.duo-play:active{transform:translate(-50%,calc(-50% + 4px));border-bottom-width:1px}.duo-video-caption{position:absolute;bottom:0;inset-inline:0;padding:17px 20px;background:linear-gradient(transparent,rgba(0,0,0,.55));color:#fff;display:flex;gap:12px;align-items:end;font-size:13px}.duo-video-caption span{font-weight:900;color:#d9f3ff}.duo-answers{display:grid;gap:12px;margin-top:30px}.duo-answer{min-height:74px;border:2px solid #e5e5e5;border-bottom:5px solid #d5d5d5;border-radius:18px;background:#fff;padding:13px 16px;text-align:left;display:flex;gap:15px;align-items:center;cursor:pointer;transition:.15s}.duo-answer:hover{background:#f7fbfd;border-color:#a9e0f9}.duo-answer:active{transform:translateY(3px);border-bottom-width:2px}.duo-answer>span{width:36px;height:36px;border-radius:12px;background:#f0f2f3;color:#8a9398;display:grid;place-items:center;font-size:13px;font-weight:900}.duo-answer b,.duo-answer small{display:block}.duo-answer b{font-size:16px}.duo-answer small{font-size:12px;color:#92999d;margin-top:2px}.duo-answer.is-selected{border-color:var(--blue);border-bottom-color:#1492cc;background:#edf9ff}.duo-answer.is-selected>span{background:var(--blue);color:#fff}.duo-answer.is-correct{border-color:var(--green);border-bottom-color:#46a302;background:#effbe8}.duo-answer.is-wrong{border-color:var(--red);border-bottom-color:#db3b3b;background:#fff1f1}.duo-footer{min-height:110px;border-top:2px solid #f1f3f5;padding:22px 28px;display:flex;justify-content:flex-end;align-items:center}.duo-primary,.duo-secondary{border:0;border-radius:16px;min-height:52px;padding:0 27px;font:900 16px inherit;cursor:pointer;transition:.15s;display:inline-flex;align-items:center;justify-content:center;gap:10px}.duo-primary{background:var(--green);color:#fff;border-bottom:5px solid var(--green-dark);min-width:156px}.duo-primary:hover{filter:brightness(1.04)}.duo-primary:active{transform:translateY(4px);border-bottom-width:1px}.duo-primary:disabled{background:#e5e5e5;border-bottom-color:#cfcfcf;color:#a7aaab;cursor:not-allowed}.duo-feedback{padding-block:17px;min-height:126px;animation:duoSlideUp .28s ease-out}.duo-feedback.correct{background:#eaf9df;border-top-color:#d4f1bd}.duo-feedback.incorrect{background:#ffebeb;border-top-color:#ffd5d5}.duo-feedback-inner{width:min(780px,100%);margin:auto;display:flex;align-items:center;gap:14px}.duo-feedback-inner>div:nth-child(2){flex:1}.duo-feedback-icon{width:48px;height:48px;border-radius:15px;display:grid;place-items:center}.correct .duo-feedback-icon{background:var(--green);color:#fff}.incorrect .duo-feedback-icon{background:var(--red);color:#fff}.duo-feedback h2{font-size:19px;margin:0}.duo-feedback p{margin:2px 0 0;color:#687568;font-size:14px}.incorrect .duo-feedback p{color:#987171}.duo-feedback .duo-primary{min-width:auto}.correct .duo-primary{background:var(--green)}.incorrect .duo-primary{background:var(--red);border-bottom-color:#dc3636}.duo-complete-stage{text-align:center;max-width:570px}.duo-confetti{color:#ffc800;font-size:22px;letter-spacing:7px;animation:duoFloat 2s ease-in-out infinite}.duo-trophy{margin:22px auto;width:104px;height:104px;border-radius:50%;display:grid;place-items:center;background:#fff3c4;color:#ffb600;border:7px solid #ffe89a;box-shadow:0 7px 0 #f8d96b}.duo-complete-stage .duo-step-label{justify-content:center}.duo-complete-stage h1{margin-top:16px}.duo-rewards{display:grid;grid-template-columns:1fr 1fr;gap:13px;margin:29px 0 20px;text-align:left}.duo-rewards>div{background:#f5fbf1;border:2px solid #dcefd1;border-radius:19px;padding:17px;display:grid;grid-template-columns:auto 1fr;column-gap:10px;align-items:center;color:var(--green)}.duo-rewards>div:nth-child(2){background:#fff6df;border-color:#ffe6a2;color:#e49a00}.duo-rewards strong,.duo-rewards small{display:block}.duo-rewards strong{font-size:17px}.duo-rewards small{font-size:12px;color:#879184;margin-top:2px}.duo-flame{font-size:24px}.duo-complete-copy{margin-inline:auto}.duo-footer-actions{display:flex;gap:12px;width:100%;justify-content:flex-end}.duo-secondary{background:#fff;border:2px solid #e2e2e2;border-bottom:5px solid #d5d5d5;color:#6e777b}.duo-secondary:active{transform:translateY(3px);border-bottom-width:2px}.duo-sound{position:absolute;right:24px;bottom:20px;border:0;background:transparent;color:#9ba2a5;display:flex;gap:7px;align-items:center;font:800 12px inherit;cursor:pointer}.duo-sound:hover{color:var(--blue)}@keyframes duoSlideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}@keyframes duoFloat{50%{transform:translateY(-7px)}}@media(max-width:760px){.duo-lesson{margin:-30px -18px -50px;min-height:100vh}.duo-shell{min-height:100vh}.duo-header{height:73px;padding:0 18px;gap:13px}.duo-content{padding:34px 19px 20px}.duo-video{height:245px}.duo-sensor{transform:scale(.74);transform-origin:left center;left:36px}.duo-wave{transform:rotate(45deg) scale(.72);transform-origin:left top}.duo-wave-one{left:175px;top:105px}.duo-wave-two{left:166px;top:86px}.duo-wave-three{left:156px;top:66px}.duo-stage h1{font-size:34px}.duo-intro,.duo-question-help{font-size:15px}.duo-footer{padding:16px 19px;min-height:86px}.duo-footer .duo-primary{width:100%}.duo-feedback{padding:13px 19px}.duo-feedback-inner{gap:10px;align-items:flex-start}.duo-feedback-icon{flex:0 0 43px;width:43px;height:43px}.duo-feedback h2{font-size:17px}.duo-feedback p{font-size:12px}.duo-feedback .duo-primary{width:auto;min-width:96px;padding:0 12px;font-size:13px;align-self:center}.duo-rewards{grid-template-columns:1fr}.duo-footer-actions{gap:8px}.duo-footer-actions>*{min-width:0!important;padding-inline:16px}.duo-sound{display:none}}
`
