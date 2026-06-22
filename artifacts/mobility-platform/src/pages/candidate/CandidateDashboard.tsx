import React from 'react';
import { useGetMyCandidateProfile, useGetMyReadinessScore, useGetMyJourney, useListApplications, useListInterviews, useListDocuments, useListVisaCases } from '@workspace/api-client-react';
import { CheckCircle2, ChevronRight, Clock, FileText, AlertCircle, Briefcase, MapPin, Zap } from 'lucide-react';
import { Link } from 'wouter';

const BG = '#0F0520';
const CARD = '#1A0B3B';
const CARD2 = '#160930';
const ACCENT = '#A855F7';
const ACCENT2 = '#C084FC';
const SUCCESS = '#00C853';
const DANGER = '#EF4444';
const BLUE = '#818CF8';
const BORDER = 'rgba(168,85,247,0.18)';
const TEXT = '#FFFFFF';
const TEXT2 = '#C4B5FD';

const mockReadiness = {
  total: 45,
  label: 'Training Required',
  nextActions: ['Complete A1 German Certification', 'Upload Education Documents']
};

const mockJourney = {
  currentStage: 'language_training',
  stages: [
    { id: 'discovery',                name: 'Discovery',          status: 'completed' },
    { id: 'registration',             name: 'Registration',       status: 'completed' },
    { id: 'eligibility',              name: 'Eligibility',        status: 'completed' },
    { id: 'language_training',        name: 'Language',           status: 'active' },
    { id: 'qualification_recognition',name: 'Recognition',        status: 'pending' },
    { id: 'document_vault',           name: 'Documents',          status: 'pending' },
    { id: 'employer_matching',        name: 'Employer',           status: 'locked' },
    { id: 'interview_offer',          name: 'Interview',          status: 'locked' },
    { id: 'visa_readiness',           name: 'Visa',               status: 'locked' },
    { id: 'post_arrival',             name: 'Arrival 🇩🇪',        status: 'locked' },
  ]
};

function GaugeCircle({ score }: { score: number }) {
  const radius = 58;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const color = score >= 80 ? SUCCESS : score < 30 ? DANGER : ACCENT;
  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width="144" height="144" className="transform -rotate-90">
        <circle cx="72" cy="72" r={radius} stroke="rgba(168,85,247,0.15)" strokeWidth="10" fill="none" />
        <circle cx="72" cy="72" r={radius} stroke={color} strokeWidth="10" fill="none"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease-out', filter: `drop-shadow(0 0 6px ${color})` }} />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-black text-white">{score}</span>
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: TEXT2 }}>Score</span>
      </div>
    </div>
  );
}

export function CandidateDashboard() {
  const { data: profile } = useGetMyCandidateProfile();
  const { data: readinessData } = useGetMyReadinessScore();
  const { data: journeyData } = useGetMyJourney();
  const { data: applications } = useListApplications();
  const { data: interviews } = useListInterviews();
  const { data: documents } = useListDocuments();
  const { data: visaCases } = useListVisaCases();

  const readiness = readinessData || mockReadiness;
  const journey = journeyData || mockJourney;
  const score = readiness.total;
  const scoreColor = score >= 80 ? SUCCESS : score < 30 ? DANGER : ACCENT;

  const stats = [
    { icon: <Briefcase className="w-5 h-5" />, val: applications?.length ?? 3,  label: 'Active Apps',   color: BLUE },
    { icon: <Clock      className="w-5 h-5" />, val: interviews?.length  ?? 2,  label: 'Interviews',    color: ACCENT },
    { icon: <FileText   className="w-5 h-5" />, val: (documents?.filter(d => d.verificationStatus === 'verified').length) ?? 7, label: 'Verified Docs', color: SUCCESS },
    { icon: <MapPin     className="w-5 h-5" />, val: visaCases?.length ? 'Active' : '–',               label: 'Visa Status',   color: '#E879F9' },
  ];

  const activeIdx = journey.stages.findIndex(s => s.status === 'active');
  const progressPct = activeIdx >= 0 ? (activeIdx / (journey.stages.length - 1)) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">My Germany Journey</h1>
        <p className="mt-1 text-sm" style={{ color: TEXT2 }}>
          Welcome back, {profile?.name || 'Candidate'}. Here's your current progress.
        </p>
      </div>

      {/* Top grid: Gauge + Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Readiness gauge */}
        <div className="rounded-2xl p-6 flex flex-col items-center justify-center gap-4"
          style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div className="text-sm font-bold text-white text-center">Germany Readiness</div>
          <p className="text-xs text-center" style={{ color: TEXT2 }}>Your overall profile score</p>
          <GaugeCircle score={score} />
          <span className="px-4 py-1.5 rounded-full text-xs font-bold border"
            style={{ background: `${scoreColor}15`, borderColor: `${scoreColor}40`, color: scoreColor }}>
            {readiness.label}
          </span>
        </div>

        {/* Next Actions */}
        <div className="md:col-span-2 rounded-2xl p-6 space-y-4"
          style={{ background: CARD, border: `1px solid ${BORDER}` }}>
          <div>
            <div className="font-bold text-white mb-0.5">Next Actions Required</div>
            <div className="text-xs" style={{ color: TEXT2 }}>Complete these tasks to increase your score</div>
          </div>

          <div className="space-y-3">
            {readiness.nextActions && readiness.nextActions.length > 0 ? (
              readiness.nextActions.map((action, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: 'rgba(168,85,247,0.07)', border: '1px solid rgba(168,85,247,0.2)' }}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: ACCENT }} />
                  <p className="flex-1 text-sm font-medium text-white">{action}</p>
                  <button className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:opacity-90"
                    style={{ background: 'rgba(168,85,247,0.2)', color: ACCENT, border: '1px solid rgba(168,85,247,0.35)' }}>
                    Act →
                  </button>
                </div>
              ))
            ) : (
              <div className="flex items-center gap-3 p-3 rounded-xl"
                style={{ background: 'rgba(0,200,83,0.08)', border: '1px solid rgba(0,200,83,0.25)' }}>
                <CheckCircle2 className="w-4 h-4" style={{ color: SUCCESS }} />
                <p className="text-sm font-medium text-white">You're all caught up on immediate tasks.</p>
              </div>
            )}
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {stats.map((s, i) => (
              <div key={i} className="rounded-xl p-3 flex flex-col items-center text-center gap-1"
                style={{ background: CARD2, border: `1px solid ${BORDER}` }}>
                <span style={{ color: s.color }}>{s.icon}</span>
                <span className="text-xl font-black text-white">{s.val}</span>
                <span className="text-[11px] font-medium" style={{ color: TEXT2 }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Journey Timeline */}
      <div className="rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="font-bold text-white">Migration Pathway</div>
            <div className="text-xs mt-0.5" style={{ color: TEXT2 }}>Your progression through the 10 stages</div>
          </div>
          <Link href="/candidate/journey">
            <span className="flex items-center gap-1 text-sm font-semibold cursor-pointer hover:opacity-80" style={{ color: ACCENT }}>
              View Details <ChevronRight className="w-4 h-4" />
            </span>
          </Link>
        </div>

        <div className="relative">
          {/* Track */}
          <div className="absolute top-5 left-5 right-5 h-0.5 z-0" style={{ background: 'rgba(168,85,247,0.15)' }} />
          {/* Progress fill */}
          <div className="absolute top-5 left-5 h-0.5 z-0 transition-all duration-1000"
            style={{ width: `calc(${progressPct}% - 0px)`, background: `linear-gradient(90deg, #7C3AED, ${ACCENT})` }} />

          <div className="relative z-10 flex justify-between">
            {journey.stages.map((stage, idx) => {
              const done   = stage.status === 'completed';
              const active = stage.status === 'active';
              const locked = stage.status === 'locked';
              return (
                <div key={stage.id} className="flex flex-col items-center" style={{ width: `${100 / journey.stages.length}%` }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 transition-all"
                    style={{
                      background:   done ? ACCENT   : active ? CARD : CARD2,
                      borderColor:  done ? ACCENT   : active ? ACCENT : 'rgba(168,85,247,0.2)',
                      boxShadow:    active ? `0 0 0 4px rgba(168,85,247,0.2), 0 0 12px rgba(168,85,247,0.3)` : 'none',
                      color:        done ? '#fff'   : active ? ACCENT : 'rgba(168,85,247,0.35)',
                    }}>
                    {done
                      ? <CheckCircle2 className="w-5 h-5" />
                      : <span className="text-xs font-bold">{idx + 1}</span>
                    }
                  </div>
                  <span className="text-[9px] text-center font-medium leading-tight px-0.5"
                    style={{ color: done ? ACCENT2 : active ? ACCENT : 'rgba(168,85,247,0.35)' }}>
                    {stage.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'AI Roadmap',   href: '/candidate/roadmap',      icon: <Zap className="w-4 h-4" />,         color: '#E879F9' },
          { label: 'AI Resume',    href: '/candidate/resume',       icon: <FileText className="w-4 h-4" />,    color: ACCENT },
          { label: 'Training',     href: '/candidate/training',     icon: <CheckCircle2 className="w-4 h-4" />, color: SUCCESS },
          { label: 'Visa Guide',   href: '/candidate/visa',         icon: <MapPin className="w-4 h-4" />,      color: BLUE },
        ].map((q, i) => (
          <Link key={i} href={q.href}>
            <div className="rounded-2xl p-4 flex items-center gap-3 cursor-pointer transition-all hover:scale-[1.02] hover:opacity-90"
              style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `${q.color}18`, color: q.color }}>
                {q.icon}
              </div>
              <span className="text-sm font-semibold text-white">{q.label}</span>
              <ChevronRight className="w-3 h-3 ml-auto flex-shrink-0" style={{ color: TEXT2 }} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
