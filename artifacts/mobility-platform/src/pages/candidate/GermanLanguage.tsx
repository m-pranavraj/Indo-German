import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Globe, CheckCircle2, Lock, Play, Mic, BookOpen, Award,
  ChevronRight, RotateCcw, Volume2, Star, Zap, Target
} from 'lucide-react';

const BG = '#0F0520';
const CARD = '#1A0B3B';
const CARD2 = '#130828';
const ACCENT = '#A855F7';
const SUCCESS = '#00C853';
const TEXT2 = '#C4B5FD';
const BORDER = 'rgba(168,85,247,0.15)';
const GOLD = '#FBBF24';

const LEVELS = [
  {
    code: 'A1', name: 'Beginner', color: '#3B82F6', progress: 100, passed: true,
    description: 'Basic phrases and expressions. Introduce yourself.',
    topics: ['Greetings & farewells', 'Numbers & dates', 'Family & home', 'Shopping & food', 'Colours & objects'],
    examDate: '2023-10-14', score: 92,
  },
  {
    code: 'A2', name: 'Elementary', color: '#8B5CF6', progress: 100, passed: true,
    description: 'Everyday expressions, routine matters, simple background.',
    topics: ['Workplace small talk', 'Directions & transport', 'Health & body', 'Hobbies & leisure', 'Phone & email basics'],
    examDate: '2024-02-22', score: 85,
  },
  {
    code: 'B1', name: 'Intermediate', color: ACCENT, progress: 64, passed: false,
    description: 'Understand main points of clear standard speech on familiar topics.',
    topics: ['Professional correspondence', 'Medical German', 'Workplace rights', 'German bureaucracy', 'Reading contracts'],
    examDate: null, score: null,
  },
  {
    code: 'B2', name: 'Upper‑Intermediate', color: '#EC4899', progress: 0, passed: false,
    description: 'Interact fluently with native speakers without strain.',
    topics: ['Advanced workplace German', 'Negotiations', 'German media & news', 'Legal & technical texts', 'Presentations'],
    examDate: null, score: null,
  },
  {
    code: 'C1', name: 'Advanced', color: GOLD, progress: 0, passed: false,
    description: 'Flexible, effective language for social, academic, professional purposes.',
    topics: ['Academic writing', 'Complex negotiations', 'Cultural nuances', 'Idiomatic expressions', 'Specialised vocabulary'],
    examDate: null, score: null,
  },
];

const QUIZ_QUESTIONS = [
  {
    q: 'How do you say "Good morning" in German?',
    options: ['Guten Abend', 'Guten Morgen', 'Auf Wiedersehen', 'Danke schön'],
    answer: 1,
    tip: '"Guten Morgen" is used from roughly 5 am until noon in Germany.',
  },
  {
    q: 'Which sentence means "I work in a hospital"?',
    options: ['Ich arbeite im Krankenhaus.', 'Ich wohne in Berlin.', 'Ich lerne Deutsch.', 'Ich heiße Arjun.'],
    answer: 0,
    tip: '"Krankenhaus" = hospital. "Arbeite" is the first-person conjugation of "arbeiten" (to work).',
  },
  {
    q: 'What does "Entschuldigung" mean?',
    options: ['Thank you', 'Goodbye', 'Excuse me / Sorry', 'Please'],
    answer: 2,
    tip: '"Entschuldigung" is used both to get attention and to apologise.',
  },
  {
    q: 'How do you say "I need help" in German?',
    options: ['Ich brauche Hilfe.', 'Ich verstehe nicht.', 'Wo ist die Toilette?', 'Wie viel kostet das?'],
    answer: 0,
    tip: '"Brauchen" means "to need". Very useful in healthcare and workplace settings.',
  },
  {
    q: 'What is the German word for "workplace"?',
    options: ['Krankenhaus', 'Arbeitsplatz', 'Bahnhof', 'Schule'],
    answer: 1,
    tip: '"Arbeitsplatz" literally means "work-place". "Arbeit" = work, "Platz" = place.',
  },
];

const DAILY_WORDS = [
  { de: 'die Arbeit', en: 'work / job', example: 'Meine Arbeit beginnt um 8 Uhr.' },
  { de: 'der Kollege', en: 'colleague (m)', example: 'Mein Kollege heißt Thomas.' },
  { de: 'die Pause', en: 'break / pause', example: 'Ich mache jetzt Pause.' },
  { de: 'der Urlaub', en: 'holiday / vacation', example: 'Ich habe zwei Wochen Urlaub.' },
  { de: 'das Gehalt', en: 'salary', example: 'Mein Gehalt ist 2.800 Euro.' },
  { de: 'die Ausbildung', en: 'vocational training', example: 'Meine Ausbildung dauert 3 Jahre.' },
];

export function GermanLanguage() {
  const [activeLevel, setActiveLevel] = useState(2); // B1 active
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [flippedWord, setFlippedWord] = useState<number | null>(null);

  const currentQ = QUIZ_QUESTIONS[quizIndex];

  const handleAnswer = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    if (idx === currentQ.answer) setQuizScore(s => s + 1);
  };

  const nextQuestion = () => {
    if (quizIndex < QUIZ_QUESTIONS.length - 1) {
      setQuizIndex(i => i + 1);
      setSelectedOption(null);
    } else {
      setQuizDone(true);
    }
  };

  const restartQuiz = () => {
    setQuizIndex(0);
    setSelectedOption(null);
    setQuizScore(0);
    setQuizDone(false);
  };

  const level = LEVELS[activeLevel];

  return (
    <div className="space-y-8 min-h-screen" style={{ background: BG }}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Globe className="w-8 h-8" style={{ color: ACCENT }} />
            German Language Module
          </h1>
          <p className="mt-1" style={{ color: TEXT2 }}>Track your CEFR progress · Practice daily · Prepare for Goethe exams</p>
        </div>
        <div className="text-right hidden md:block">
          <div className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: TEXT2 }}>Current Level</div>
          <div className="text-3xl font-black" style={{ color: ACCENT }}>B1</div>
          <div className="text-xs" style={{ color: TEXT2 }}>In Progress</div>
        </div>
      </div>

      {/* CEFR Progress Strip */}
      <div className="rounded-2xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
        <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: TEXT2 }}>CEFR Level Pathway</div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {LEVELS.map((lvl, i) => (
            <button
              key={lvl.code}
              onClick={() => setActiveLevel(i)}
              className="flex-1 min-w-[90px] rounded-xl p-3 text-left transition-all"
              style={{
                background: activeLevel === i ? `${lvl.color}20` : CARD2,
                border: `2px solid ${activeLevel === i ? lvl.color : 'transparent'}`,
                boxShadow: activeLevel === i ? `0 0 16px ${lvl.color}30` : 'none',
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-black" style={{ color: lvl.color }}>{lvl.code}</span>
                {lvl.passed ? (
                  <CheckCircle2 className="w-4 h-4" style={{ color: SUCCESS }} />
                ) : i === 2 ? (
                  <Play className="w-4 h-4" style={{ color: lvl.color }} />
                ) : (
                  <Lock className="w-4 h-4" style={{ color: TEXT2, opacity: 0.5 }} />
                )}
              </div>
              <div className="text-[10px] font-semibold mb-2 truncate" style={{ color: activeLevel === i ? lvl.color : TEXT2 }}>{lvl.name}</div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div className="h-full rounded-full" style={{ width: `${lvl.progress}%`, background: lvl.color }} />
              </div>
              <div className="text-[10px] mt-1" style={{ color: TEXT2 }}>{lvl.progress}%</div>
            </button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6 gap-1" style={{ background: CARD2, border: `1px solid ${BORDER}` }}>
          <TabsTrigger value="overview">📊 Level Overview</TabsTrigger>
          <TabsTrigger value="quiz">🧠 Quick Quiz</TabsTrigger>
          <TabsTrigger value="vocab">📖 Vocab Cards</TabsTrigger>
        </TabsList>

        {/* ── Level Overview ── */}
        <TabsContent value="overview" className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Current Level Detail */}
            <div className="rounded-2xl p-6 space-y-4" style={{ background: CARD, border: `1px solid ${level.color}30` }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl"
                  style={{ background: `${level.color}20`, color: level.color, border: `2px solid ${level.color}40` }}>
                  {level.code}
                </div>
                <div>
                  <div className="font-bold text-white text-lg">{level.name}</div>
                  <div className="text-xs" style={{ color: TEXT2 }}>{level.description}</div>
                </div>
              </div>

              {/* Progress */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-white">Module Progress</span>
                  <span style={{ color: level.color }}>{level.progress}%</span>
                </div>
                <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${level.progress}%`, background: `linear-gradient(90deg, ${level.color}, ${level.color}aa)` }} />
                </div>
              </div>

              {level.passed && (
                <div className="flex items-center gap-3 rounded-xl p-3" style={{ background: 'rgba(0,200,83,0.1)', border: '1px solid rgba(0,200,83,0.25)' }}>
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: SUCCESS }} />
                  <div>
                    <div className="text-sm font-semibold" style={{ color: SUCCESS }}>Passed ✓</div>
                    <div className="text-xs" style={{ color: TEXT2 }}>Exam: {level.examDate} · Score: {level.score}%</div>
                  </div>
                </div>
              )}

              {/* Topics */}
              <div>
                <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: TEXT2 }}>Topics Covered</div>
                <ul className="space-y-2">
                  {level.topics.map((t, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: level.color }} />
                      <span style={{ color: level.passed || level.progress > 0 ? 'white' : TEXT2 }}>{t}</span>
                      {level.passed && <CheckCircle2 className="w-3.5 h-3.5 ml-auto" style={{ color: SUCCESS }} />}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Stats + Exam Panel */}
            <div className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Levels Done', value: '2 / 5', color: SUCCESS, icon: <Award className="w-5 h-5" /> },
                  { label: 'Best Score', value: '92%', color: GOLD, icon: <Star className="w-5 h-5" /> },
                  { label: 'Study Streak', value: '14 days', color: ACCENT, icon: <Zap className="w-5 h-5" /> },
                ].map(stat => (
                  <div key={stat.label} className="rounded-xl p-4 text-center" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                    <div style={{ color: stat.color }} className="flex justify-center mb-2">{stat.icon}</div>
                    <div className="text-xl font-black" style={{ color: stat.color }}>{stat.value}</div>
                    <div className="text-[10px] mt-0.5" style={{ color: TEXT2 }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Goethe Exam Prep */}
              <div className="rounded-2xl p-5 space-y-3" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-5 h-5" style={{ color: ACCENT }} />
                  <div className="font-bold text-white">Goethe Exam Prep — B1</div>
                </div>
                <p className="text-sm" style={{ color: TEXT2 }}>The Goethe‑Zertifikat B1 is required for many German work visas. Your estimated readiness:</p>
                <div className="space-y-2">
                  {[
                    { section: 'Reading (Lesen)', score: 72 },
                    { section: 'Writing (Schreiben)', score: 58 },
                    { section: 'Listening (Hören)', score: 65 },
                    { section: 'Speaking (Sprechen)', score: 70 },
                  ].map(sec => (
                    <div key={sec.section}>
                      <div className="flex justify-between text-xs mb-1">
                        <span style={{ color: TEXT2 }}>{sec.section}</span>
                        <span className="font-semibold" style={{ color: sec.score >= 70 ? SUCCESS : ACCENT }}>{sec.score}%</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full" style={{ width: `${sec.score}%`, background: sec.score >= 70 ? SUCCESS : ACCENT }} />
                      </div>
                    </div>
                  ))}
                </div>
                <a href="https://academy.koutuhal.in/account/login" target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold mt-2 hover:opacity-90 transition-opacity"
                  style={{ background: ACCENT, color: '#0F0520' }}>
                  <BookOpen className="w-4 h-4" /> Continue B1 Prep
                </a>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── Quick Quiz ── */}
        <TabsContent value="quiz">
          <div className="max-w-2xl mx-auto">
            {!quizDone ? (
              <div className="rounded-2xl p-7 space-y-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-xs mb-2" style={{ color: TEXT2 }}>
                    <span>Question {quizIndex + 1} of {QUIZ_QUESTIONS.length}</span>
                    <span>{quizScore} correct so far</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${((quizIndex) / QUIZ_QUESTIONS.length) * 100}%`, background: ACCENT }} />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white">{currentQ.q}</h3>

                <div className="space-y-3">
                  {currentQ.options.map((opt, i) => {
                    let borderColor = BORDER;
                    let bg = CARD2;
                    let textColor = TEXT2;
                    if (selectedOption !== null) {
                      if (i === currentQ.answer) { borderColor = SUCCESS; bg = 'rgba(0,200,83,0.1)'; textColor = SUCCESS; }
                      else if (i === selectedOption) { borderColor = '#EF4444'; bg = 'rgba(239,68,68,0.1)'; textColor = '#EF4444'; }
                    }
                    return (
                      <button key={i} onClick={() => handleAnswer(i)}
                        className="w-full text-left px-5 py-3.5 rounded-xl text-sm font-medium transition-all"
                        style={{ background: bg, border: `2px solid ${borderColor}`, color: textColor }}>
                        <span className="mr-3 font-bold">{String.fromCharCode(65 + i)}.</span>{opt}
                      </button>
                    );
                  })}
                </div>

                {selectedOption !== null && (
                  <div className="rounded-xl p-4 text-sm" style={{ background: 'rgba(168,85,247,0.08)', border: `1px solid ${BORDER}` }}>
                    <span className="font-bold" style={{ color: ACCENT }}>💡 Tip: </span>
                    <span style={{ color: TEXT2 }}>{currentQ.tip}</span>
                  </div>
                )}

                {selectedOption !== null && (
                  <button onClick={nextQuestion}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
                    style={{ background: ACCENT, color: '#0F0520' }}>
                    {quizIndex < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'Finish Quiz'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              <div className="rounded-2xl p-10 text-center space-y-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <div className="text-7xl font-black" style={{ color: quizScore >= 4 ? SUCCESS : quizScore >= 3 ? GOLD : ACCENT }}>
                  {quizScore}/{QUIZ_QUESTIONS.length}
                </div>
                <div className="text-2xl font-bold text-white">
                  {quizScore === 5 ? '🏆 Perfect Score!' : quizScore >= 3 ? '🎉 Well Done!' : '📚 Keep Practising'}
                </div>
                <p className="text-sm" style={{ color: TEXT2 }}>
                  {quizScore >= 4 ? 'Excellent German comprehension. You\'re on track for B1!' : 'Review the vocab cards and try again to improve your score.'}
                </p>
                <button onClick={restartQuiz}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold hover:opacity-90"
                  style={{ background: ACCENT, color: '#0F0520' }}>
                  <RotateCcw className="w-4 h-4" /> Try Again
                </button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* ── Vocab Cards ── */}
        <TabsContent value="vocab">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <Volume2 className="w-4 h-4" style={{ color: ACCENT }} />
              <span className="text-sm font-semibold" style={{ color: TEXT2 }}>Today's Workplace Vocabulary — tap to flip</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {DAILY_WORDS.map((word, i) => (
                <button key={i} onClick={() => setFlippedWord(flippedWord === i ? null : i)}
                  className="rounded-2xl p-6 text-left transition-all hover:scale-[1.02]"
                  style={{
                    background: flippedWord === i ? `linear-gradient(135deg, ${ACCENT}20, rgba(168,85,247,0.05))` : CARD,
                    border: `2px solid ${flippedWord === i ? ACCENT : BORDER}`,
                    minHeight: 140,
                  }}>
                  {flippedWord !== i ? (
                    <div className="flex flex-col h-full justify-between">
                      <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: TEXT2 }}>German</div>
                      <div className="text-2xl font-black text-white">{word.de}</div>
                      <div className="text-xs mt-3" style={{ color: TEXT2 }}>Tap to reveal →</div>
                    </div>
                  ) : (
                    <div className="flex flex-col h-full justify-between">
                      <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: ACCENT }}>English</div>
                      <div className="text-xl font-bold text-white">{word.en}</div>
                      <div className="text-xs mt-2 italic" style={{ color: TEXT2 }}>{word.example}</div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Streak card */}
            <div className="rounded-2xl p-5 flex items-center gap-5 mt-4"
              style={{ background: 'linear-gradient(135deg, #1A0B3B, #130828)', border: `1px solid ${BORDER}` }}>
              <div className="text-5xl font-black" style={{ color: GOLD }}>🔥</div>
              <div>
                <div className="text-lg font-bold text-white">14-Day Study Streak</div>
                <div className="text-sm" style={{ color: TEXT2 }}>Keep going! Review 5 new words daily to maintain your streak and reach B1 faster.</div>
              </div>
              <a href="https://academy.koutuhal.in/account/login" target="_blank" rel="noopener noreferrer"
                className="ml-auto flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
                style={{ background: GOLD, color: '#0F0520' }}>
                Full Lessons →
              </a>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
