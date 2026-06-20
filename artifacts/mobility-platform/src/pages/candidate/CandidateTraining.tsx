import React, { useState } from 'react';
import { useListCourses, useListEnrollments } from '@workspace/api-client-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ExternalLink, CheckCircle2, Clock, Play, Award, BookOpen, Scissors, Globe, Wrench } from 'lucide-react';

const CARD = '#1A0B3B';
const CARD2 = '#130828';
const ACCENT = '#A855F7';
const SUCCESS = '#00C853';
const PURPLE = '#C084FC';
const BORDER = 'rgba(168,85,247,0.15)';
const TEXT2 = '#C4B5FD';

const ACADEMY_URL = 'https://academy.koutuhal.in/account/login';

const FEATURED_COURSES = [
  {
    id: 'barber',
    title: 'Professional Barbering & Hair Styling',
    subtitle: 'Friseur / Friseurin — Germany Ready',
    provider: 'Koutuhal Academy',
    duration: '12 weeks',
    level: 'Beginner → Advanced',
    language: 'A1+ German',
    salary: '€22,000–€30,000/yr',
    spots: 20,
    enrolled: 847,
    rating: 4.8,
    badge: 'High Demand 🇩🇪',
    badgeColor: ACCENT,
    icon: <Scissors className="w-8 h-8" />,
    color: '#EC4899',
    gradient: 'linear-gradient(135deg, #4A0030 0%, #7B1050 50%, #4A0030 100%)',
    skills: ['Hair cutting & styling', 'Beard & shaving techniques', 'German salon standards', 'Customer interaction (A1)', 'Colour & treatment'],
    modules: 8,
    certificate: 'IHK-aligned Barbering Certificate',
    illustration: (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="w-6 h-6 rounded-full" style={{ background: '#EC4899', opacity: 0.3 + (i % 4) * 0.2 }} />
            ))}
          </div>
        </div>
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'rgba(236,72,153,0.2)', border: '2px solid rgba(236,72,153,0.5)' }}>
            <Scissors className="w-10 h-10" style={{ color: '#EC4899' }} />
          </div>
          <div className="text-xs font-bold text-center" style={{ color: '#EC4899' }}>FRISEUR</div>
        </div>
      </div>
    ),
  },
  {
    id: 'german',
    title: 'German Language — A1 to B2 Complete',
    subtitle: 'Deutsche Sprache für Berufseinsteiger',
    provider: 'Koutuhal Academy',
    duration: '24 weeks',
    level: 'A1 → B2 (CEFR)',
    language: 'Hindi / English',
    salary: 'Unlocks all German jobs',
    spots: 200,
    enrolled: 3241,
    rating: 4.9,
    badge: 'Most Popular ⭐',
    badgeColor: ACCENT,
    icon: <Globe className="w-8 h-8" />,
    color: ACCENT,
    gradient: 'linear-gradient(135deg, #3A2000 0%, #6B3A00 50%, #3A2000 100%)',
    skills: ['Speaking & pronunciation', 'Grammar fundamentals', 'Workplace German', 'Goethe exam prep', 'Reading & writing'],
    modules: 24,
    certificate: 'Goethe-Zertifikat Prep Certificate',
    illustration: (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center opacity-15">
          {['Hallo', 'Danke', 'Bitte', 'Guten Morgen', 'Arbeit', 'Deutsch'].map((word, i) => (
            <span key={i} className="absolute text-xs font-bold" style={{ color: ACCENT, top: `${15 + (i * 14)}%`, left: `${10 + (i % 3) * 30}%`, opacity: 0.4 + (i % 3) * 0.2 }}>{word}</span>
          ))}
        </div>
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'rgba(168,85,247,0.2)', border: '2px solid rgba(168,85,247,0.5)' }}>
            <Globe className="w-10 h-10" style={{ color: ACCENT }} />
          </div>
          <div className="flex gap-1">
            {['A1', 'A2', 'B1', 'B2'].map((l, i) => (
              <span key={l} className="text-[10px] font-black px-1.5 py-0.5 rounded" style={{ background: i < 2 ? ACCENT : 'rgba(168,85,247,0.3)', color: '#0F0520' }}>{l}</span>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'automotive',
    title: 'Kfz-Mechatroniker (Automotive Technician)',
    subtitle: 'Germany\'s #1 Most Hired Trade',
    provider: 'Koutuhal Academy',
    duration: '16 weeks',
    level: 'Intermediate',
    language: 'B1 German Recommended',
    salary: '€36,000–€48,000/yr',
    spots: 35,
    enrolled: 1523,
    rating: 4.7,
    badge: '🚗 Top Salary',
    badgeColor: SUCCESS,
    icon: <Wrench className="w-8 h-8" />,
    color: SUCCESS,
    gradient: 'linear-gradient(135deg, #00250F 0%, #004A1E 50%, #00250F 100%)',
    skills: ['Engine diagnostics (OBD2)', 'EV & high-voltage systems', 'IHK FOSA recognition', 'German workshop standards', 'Safety compliance'],
    modules: 16,
    certificate: 'Kfz-Mechatroniker Competency Certificate',
    illustration: (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="absolute inset-0 opacity-10 flex items-center justify-center">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="absolute w-16 h-16 rounded-full border-2" style={{ borderColor: SUCCESS, transform: `rotate(${i * 45}deg) translateX(40px)`, opacity: 0.3 }} />
          ))}
        </div>
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,200,83,0.2)', border: '2px solid rgba(0,200,83,0.5)' }}>
            <Wrench className="w-10 h-10" style={{ color: SUCCESS }} />
          </div>
          <div className="text-xs font-bold text-center" style={{ color: SUCCESS }}>KFZ-MECHATRONIKER</div>
        </div>
      </div>
    ),
  },
];

const mockEnrollments = [
  { id: 1, batchName: 'German A1 Intensive - Batch 2024-02', languageLevel: 'A1', status: 'attending', attendancePercent: 88, assessmentScore: null, certificateIssued: false, enrolledAt: '2024-03-15T10:00:00Z', progress: 68 },
  { id: 2, batchName: 'A2 Fast Track - Morning Batch', languageLevel: 'A2', status: 'passed', attendancePercent: 95, assessmentScore: 88, certificateIssued: true, enrolledAt: '2023-09-10T10:00:00Z', progress: 100 },
];

export function CandidateTraining() {
  const { data: enrollmentsData } = useListEnrollments();
  const enrollments = enrollmentsData || mockEnrollments;
  const [enrolledCourses, setEnrolledCourses] = useState<Set<string>>(new Set());

  const handleEnroll = (courseId: string) => {
    setEnrolledCourses(prev => new Set([...prev, courseId]));
  };

  return (
    <div className="space-y-8 min-h-screen" style={{ background: '#0F0520' }}>
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Training & Courses</h1>
        <p className="mt-1" style={{ color: TEXT2 }}>Skill up for Germany — certified courses designed for the Indo-German corridor.</p>
      </div>

      <Tabs defaultValue="featured" className="w-full">
        <TabsList className="mb-6 gap-1" style={{ background: CARD2, border: `1px solid ${BORDER}` }}>
          <TabsTrigger value="featured" className="data-[state=active]:text-[#0F0520]" style={{ '--tw-bg-opacity': 1 } as any}>🎓 Featured Courses</TabsTrigger>
          <TabsTrigger value="my-learning">📚 My Learning</TabsTrigger>
        </TabsList>

        {/* ── Featured Courses ── */}
        <TabsContent value="featured" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {FEATURED_COURSES.map(course => {
              const isEnrolled = enrolledCourses.has(course.id);
              return (
                <div
                  key={course.id}
                  className="rounded-2xl overflow-hidden flex flex-col transition-all hover:scale-[1.02] hover:shadow-2xl"
                  style={{ background: CARD, border: `1px solid rgba(255,255,255,0.08)`, boxShadow: `0 4px 30px rgba(0,0,0,0.3)` }}
                >
                  {/* Course Visual Header */}
                  <div className="relative h-44 overflow-hidden" style={{ background: course.gradient }}>
                    <div className="absolute inset-0">
                      {course.illustration}
                    </div>
                    {/* Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: `${course.badgeColor}20`, color: course.badgeColor, border: `1px solid ${course.badgeColor}40` }}>
                        {course.badge}
                      </span>
                    </div>
                    {/* Provider */}
                    <div className="absolute bottom-3 right-3 text-xs px-2 py-1 rounded-full font-medium" style={{ background: 'rgba(0,0,0,0.5)', color: '#fff', backdropFilter: 'blur(4px)' }}>
                      {course.provider}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-white text-base leading-tight mb-1">{course.title}</h3>
                    <p className="text-xs mb-3" style={{ color: course.color }}>{course.subtitle}</p>

                    {/* Stats row */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {[
                        { label: 'Duration', value: course.duration, icon: <Clock className="w-3 h-3" /> },
                        { label: 'Level', value: course.level, icon: <Award className="w-3 h-3" /> },
                        { label: 'Language', value: course.language, icon: <Globe className="w-3 h-3" /> },
                        { label: 'Salary Range', value: course.salary, icon: <BookOpen className="w-3 h-3" /> },
                      ].map(stat => (
                        <div key={stat.label} className="rounded-lg p-2" style={{ background: CARD2 }}>
                          <div className="flex items-center gap-1 mb-0.5" style={{ color: TEXT2 }}>
                            {stat.icon}
                            <span className="text-[10px]">{stat.label}</span>
                          </div>
                          <div className="text-xs font-semibold text-white truncate">{stat.value}</div>
                        </div>
                      ))}
                    </div>

                    {/* Skills */}
                    <div className="mb-4 flex-1">
                      <div className="text-xs font-medium mb-2" style={{ color: TEXT2 }}>What you'll learn:</div>
                      <ul className="space-y-1">
                        {course.skills.slice(0, 3).map((skill, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs" style={{ color: TEXT2 }}>
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: course.color }} />
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Enrollment stats */}
                    <div className="flex items-center gap-3 mb-4 text-xs" style={{ color: TEXT2 }}>
                      <span>⭐ {course.rating}</span>
                      <span>👥 {course.enrolled.toLocaleString()} enrolled</span>
                      <span style={{ color: course.spots <= 10 ? '#EF4444' : SUCCESS }}>{course.spots} spots left</span>
                    </div>

                    {/* Certificate */}
                    <div className="text-xs mb-4 px-3 py-2 rounded-lg" style={{ background: 'rgba(168,85,247,0.07)', border: '1px solid rgba(168,85,247,0.15)', color: ACCENT }}>
                      🏆 {course.certificate}
                    </div>

                    {/* CTAs */}
                    <div className="flex gap-2">
                      <a
                        href={ACADEMY_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-95"
                        style={{ background: course.color === ACCENT ? ACCENT : course.color, color: '#0F0520' }}
                      >
                        <ExternalLink className="w-4 h-4" />
                        Go to Course
                      </a>
                      {!isEnrolled ? (
                        <button
                          onClick={() => handleEnroll(course.id)}
                          className="px-3 py-2.5 rounded-xl text-xs font-medium transition-all"
                          style={{ background: CARD2, color: TEXT2, border: `1px solid ${BORDER}` }}
                        >
                          Enrol
                        </button>
                      ) : (
                        <div className="px-3 py-2.5 rounded-xl flex items-center" style={{ background: 'rgba(0,200,83,0.1)', color: SUCCESS }}>
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Browse more on Academy */}
          <div className="rounded-2xl p-6 text-center" style={{ background: 'linear-gradient(135deg,#130828,#1A0B3B)', border: `1px solid ${BORDER}` }}>
            <div className="text-lg font-bold text-white mb-2">Explore 50+ More Courses</div>
            <p className="text-sm mb-4" style={{ color: TEXT2 }}>Full catalog of Germany-ready skill courses on Koutuhal Academy — carpentry, plumbing, nursing assistants, IT, hospitality & more.</p>
            <a
              href={ACADEMY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90"
              style={{ background: ACCENT, color: '#0F0520' }}
            >
              <Play className="w-4 h-4" />
              Browse All Courses on Koutuhal Academy
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </TabsContent>

        {/* ── My Learning ── */}
        <TabsContent value="my-learning" className="space-y-4">
          {enrollments.length === 0 && (
            <div className="text-center py-16 rounded-2xl" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <BookOpen className="w-12 h-12 mx-auto mb-3" style={{ color: TEXT2 }} />
              <div className="text-lg font-semibold text-white mb-1">No courses yet</div>
              <div className="text-sm mb-4" style={{ color: TEXT2 }}>Enrol in a featured course to start your learning journey</div>
              <a href={ACADEMY_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold"
                style={{ background: ACCENT, color: '#0F0520' }}>
                Browse Courses <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
          {enrollments.map((enrollment: any) => (
            <div key={enrollment.id} className="rounded-2xl overflow-hidden" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <div className="flex flex-col md:flex-row">
                <div className="text-white p-6 flex flex-col justify-center items-center min-w-[160px]"
                  style={{ background: 'linear-gradient(135deg,#0F0520,#130828)' }}>
                  <span className="text-4xl font-black mb-2" style={{ color: ACCENT }}>{enrollment.languageLevel}</span>
                  <div className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ background: enrollment.status === 'passed' ? 'rgba(0,200,83,0.2)' : 'rgba(168,85,247,0.2)', color: enrollment.status === 'passed' ? SUCCESS : ACCENT }}>
                    {enrollment.status === 'passed' ? 'COMPLETED' : 'IN PROGRESS'}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{enrollment.batchName}</h3>
                    <div className="flex gap-4 text-sm" style={{ color: TEXT2 }}>
                      <span>Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}</span>
                      {enrollment.certificateIssued && (
                        <span className="flex items-center gap-1 font-medium" style={{ color: SUCCESS }}>
                          <CheckCircle2 className="w-4 h-4" /> Certificate Issued
                        </span>
                      )}
                    </div>
                  </div>
                  {enrollment.status === 'attending' && (
                    <div className="mt-4">
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-medium text-white">Attendance</span>
                        <span style={{ color: TEXT2 }}>{enrollment.attendancePercent}%</span>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <div className="h-2 rounded-full transition-all" style={{ width: `${enrollment.attendancePercent}%`, background: enrollment.attendancePercent >= 80 ? SUCCESS : ACCENT }} />
                      </div>
                    </div>
                  )}
                  {enrollment.status === 'passed' && (
                    <div className="mt-4 flex gap-6 items-end">
                      <div>
                        <p className="text-xs" style={{ color: TEXT2 }}>Final Score</p>
                        <p className="text-2xl font-black" style={{ color: SUCCESS }}>{enrollment.assessmentScore}%</p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: TEXT2 }}>Attendance</p>
                        <p className="text-2xl font-black text-white">{enrollment.attendancePercent}%</p>
                      </div>
                      <div className="ml-auto">
                        <a href={ACADEMY_URL} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
                          style={{ background: SUCCESS, color: '#0F0520' }}>
                          <Award className="w-4 h-4" /> View Certificate
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
