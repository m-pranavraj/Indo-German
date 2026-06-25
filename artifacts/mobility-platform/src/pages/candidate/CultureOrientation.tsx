import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users, Clock, MessageSquare, Building2, Heart, Coffee,
  CheckCircle2, ChevronDown, ChevronUp, AlertCircle, Star,
  Utensils, Train, Home, Landmark, Info
} from 'lucide-react';

const BG = '#0F0520';
const CARD = '#1A0B3B';
const CARD2 = '#130828';
const ACCENT = '#A855F7';
const SUCCESS = '#00C853';
const TEXT2 = '#C4B5FD';
const BORDER = 'rgba(168,85,247,0.15)';
const GOLD = '#FBBF24';
const WARN = '#F59E0B';

const CULTURE_MODULES = [
  {
    id: 'workplace',
    icon: <Building2 className="w-5 h-5" />,
    title: 'Workplace Culture',
    color: '#3B82F6',
    completed: true,
    lessons: [
      { title: 'Punctuality — a non-negotiable', body: 'Germans expect you to be on time — arriving 5 minutes early is the norm. Being late without notice is considered disrespectful. If you are delayed, call ahead immediately. This applies to meetings, shifts, and appointments alike.' },
      { title: 'Hierarchy & direct communication', body: 'German workplaces have clear hierarchy. Address supervisors by their last name (Herr Müller, Frau Schmidt) unless told otherwise. Feedback is direct and constructive — do not mistake bluntness for rudeness.' },
      { title: 'Work-life separation', body: 'After-hours messages are typically not expected to be answered. Germans strongly separate work and personal life. Holiday entitlement (Urlaub) is taken seriously — usually 24–30 days per year.' },
      { title: 'Dress code', body: 'Dress professionally and conservatively for most sectors. Healthcare requires uniforms; office environments favour smart-casual. Ask HR about the dress code on your first day.' },
    ],
  },
  {
    id: 'communication',
    icon: <MessageSquare className="w-5 h-5" />,
    title: 'Communication Style',
    color: ACCENT,
    completed: true,
    lessons: [
      { title: 'Direct ≠ rude', body: 'Germans say what they mean. If your work is not good enough, you will hear it clearly. Do not interpret directness as hostility. Equally, when praised, it is genuine.' },
      { title: 'Formal vs informal address', body: '"Sie" (formal you) is used with strangers, supervisors, and older colleagues. "Du" (informal) is only used when explicitly offered. Using "Du" without invitation is a social faux pas.' },
      { title: 'Email and written communication', body: 'Emails should have a clear subject, formal greeting, concise body, and a polite closing (Mit freundlichen Grüßen). Avoid emojis in professional email. Keep messages factual and structured.' },
      { title: 'Meeting etiquette', body: 'Come prepared with an agenda or clear talking points. Interrupting speakers is frowned upon. Decisions made in meetings are usually final — come ready to commit.' },
    ],
  },
  {
    id: 'social',
    icon: <Users className="w-5 h-5" />,
    title: 'Social Life & Etiquette',
    color: '#EC4899',
    completed: false,
    lessons: [
      { title: 'Greetings & introductions', body: 'A firm handshake is the standard greeting in professional settings. In casual settings, friends may hug or do a light cheek kiss. Always wait to be introduced — do not assume informality.' },
      { title: 'Personal space', body: 'Germans value personal space. Standing too close is uncomfortable. Avoid touching people you do not know well. Eye contact during conversation is expected and shows respect.' },
      { title: 'Neighbours & community', body: 'Silence hours (Ruhezeiten) are typically 10 pm–7 am and between 1–3 pm. Loud music or drilling during these times can lead to complaints. Recycling bins and waste separation rules are strictly followed.' },
      { title: 'Invitations & socialising', body: 'If invited to a German home, bring a small gift (wine, flowers — not red roses). Arrive on time. Complimenting the food is appreciated. Splitting bills equally at restaurants is common.' },
    ],
  },
  {
    id: 'daily-life',
    icon: <Coffee className="w-5 h-5" />,
    title: 'Daily Life in Germany',
    color: SUCCESS,
    completed: false,
    lessons: [
      { title: 'Banking & finances', body: 'Open a Girokonto (current account) as soon as possible — you need it for salary and rent. Girocard (EC card) is widely used; carry some cash as many small shops do not accept cards. Schufa credit score matters for rentals.' },
      { title: 'Public transport', body: 'Germany has an excellent public transport network. Get a Deutschlandticket (€49/month) for unlimited regional travel. Always validate your ticket before boarding or face a €60 fine.' },
      { title: 'Healthcare (Krankenversicherung)', body: 'Health insurance is mandatory. Your employer will register you with a statutory insurer (gesetzliche Krankenkasse). Carry your Krankenversicherungskarte (health card) at all times. Dentist and specialist visits require a referral from your GP (Hausarzt).' },
      { title: 'Shopping & Sundays', body: 'Most shops close on Sundays (Ladenschlussgesetz). Plan your grocery shopping accordingly. Drugstores, petrol stations, and bakeries at train stations may stay open. Supermarkets close between 8–10 pm on weekdays.' },
    ],
  },
  {
    id: 'rights',
    icon: <Heart className="w-5 h-5" />,
    title: 'Worker Rights & Welfare',
    color: GOLD,
    completed: false,
    lessons: [
      { title: 'Employment contract (Arbeitsvertrag)', body: 'Always get a signed contract before starting work. It must include: working hours, salary, probation period (Probezeit, usually 3–6 months), holiday entitlement, and notice period.' },
      { title: 'Minimum wage (Mindestlohn)', body: 'As of 2025 the statutory minimum wage is €12.82/hour. Ensure your contract does not pay below this. Sector-specific collective agreements (Tarifverträge) often pay more.' },
      { title: 'Trade unions (Gewerkschaften)', body: 'You have the right to join a trade union. Unions negotiate wages and conditions. IG Metall (metalworkers), ver.di (services), and IG BCE (chemicals) are the largest. Membership is voluntary and confidential.' },
      { title: 'Sick leave (Krankschreibung)', body: 'If you are sick for more than 3 days, visit a doctor and get a Krankschreibung (sick note) by the 4th day at the latest. Submit this to your employer. You continue to receive full pay for up to 6 weeks.' },
    ],
  },
];

const DID_YOU_KNOW = [
  { flag: '🇩🇪', fact: 'Germany has over 1,500 types of beer and as many varieties of bread.', category: 'Culture' },
  { flag: '⏰', fact: 'Trains in Germany are among the most punctual in Europe. If a train is more than 60 minutes late, you are entitled to a refund.', category: 'Daily Life' },
  { flag: '♻️', fact: 'Germany has one of the best recycling rates in the world. Separate your waste into Restmüll, Papier, Glas, and Gelber Sack.', category: 'Environment' },
  { flag: '🏋️', fact: 'Fitness clubs (Fitnessstudio) are extremely popular. Many employers offer gym subsidies as a job perk.', category: 'Lifestyle' },
  { flag: '📅', fact: 'Public holidays vary by federal state. Bavaria has 13, while many states have 10–11. Check your state\'s Feiertage.', category: 'Work' },
  { flag: '🚗', fact: 'Some sections of the German Autobahn have no speed limit — but these are reducing. Always check signs.', category: 'Transport' },
];

const CHECKLIST = [
  { item: 'Understand German workplace punctuality norms', done: true },
  { item: 'Learn formal vs informal address (Sie / Du)', done: true },
  { item: 'Know the Ruhezeiten (quiet hours) rules', done: false },
  { item: 'Set up a German bank account (Girokonto)', done: false },
  { item: 'Register your Anmeldung at the local Bürgeramt', done: false },
  { item: 'Get your health insurance card (Krankenkassenkarte)', done: false },
  { item: 'Understand your Arbeitsvertrag (employment contract)', done: false },
  { item: 'Know how to get a Krankschreibung if sick', done: false },
];

export function CultureOrientation() {
  const [expandedModule, setExpandedModule] = useState<string | null>('workplace');
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const [checklist, setChecklist] = useState(CHECKLIST.map(c => ({ ...c })));

  const toggleCheck = (i: number) => {
    setChecklist(prev => prev.map((c, idx) => idx === i ? { ...c, done: !c.done } : c));
  };

  const doneCount = checklist.filter(c => c.done).length;

  return (
    <div className="space-y-8 min-h-screen" style={{ background: BG }}>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <Landmark className="w-8 h-8" style={{ color: ACCENT }} />
          Culture Orientation Module
        </h1>
        <p className="mt-1" style={{ color: TEXT2 }}>
          Understand German workplace culture, social etiquette, and daily life — be ready from Day 1.
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Modules Completed', value: '2 / 5', color: SUCCESS },
          { label: 'Lessons Read', value: '8 / 20', color: ACCENT },
          { label: 'Checklist Done', value: `${doneCount} / ${checklist.length}`, color: GOLD },
          { label: 'Culture Score', value: '62%', color: '#3B82F6' },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <div className="text-2xl font-black mb-1" style={{ color: s.color }}>{s.value}</div>
            <div className="text-[11px]" style={{ color: TEXT2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <Tabs defaultValue="modules" className="w-full">
        <TabsList className="mb-6 gap-1" style={{ background: CARD2, border: `1px solid ${BORDER}` }}>
          <TabsTrigger value="modules">📚 Modules</TabsTrigger>
          <TabsTrigger value="checklist">✅ Arrival Checklist</TabsTrigger>
          <TabsTrigger value="did-you-know">💡 Did You Know?</TabsTrigger>
        </TabsList>

        {/* ── Modules ── */}
        <TabsContent value="modules" className="space-y-4">
          {CULTURE_MODULES.map(mod => (
            <div key={mod.id} className="rounded-2xl overflow-hidden"
              style={{ background: CARD, border: `2px solid ${expandedModule === mod.id ? mod.color + '50' : BORDER}` }}>
              {/* Module Header */}
              <button
                className="w-full flex items-center gap-4 p-5 text-left"
                onClick={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${mod.color}20`, color: mod.color }}>
                  {mod.icon}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-white flex items-center gap-2">
                    {mod.title}
                    {mod.completed && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(0,200,83,0.15)', color: SUCCESS }}>COMPLETED</span>
                    )}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: TEXT2 }}>{mod.lessons.length} lessons</div>
                </div>
                <div style={{ color: TEXT2 }}>
                  {expandedModule === mod.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {/* Expanded Lessons */}
              {expandedModule === mod.id && (
                <div className="border-t px-5 pb-5 pt-3 space-y-2" style={{ borderColor: `${mod.color}20` }}>
                  {mod.lessons.map((lesson, li) => {
                    const lkey = `${mod.id}-${li}`;
                    return (
                      <div key={li} className="rounded-xl overflow-hidden"
                        style={{ background: CARD2, border: `1px solid ${expandedLesson === lkey ? mod.color + '40' : 'transparent'}` }}>
                        <button
                          className="w-full flex items-center gap-3 p-4 text-left"
                          onClick={() => setExpandedLesson(expandedLesson === lkey ? null : lkey)}
                        >
                          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: mod.color }} />
                          <span className="text-sm font-semibold text-white flex-1">{lesson.title}</span>
                          {mod.completed && <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: SUCCESS }} />}
                          {expandedLesson === lkey
                            ? <ChevronUp className="w-4 h-4 flex-shrink-0" style={{ color: TEXT2 }} />
                            : <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: TEXT2 }} />}
                        </button>
                        {expandedLesson === lkey && (
                          <div className="px-4 pb-4">
                            <p className="text-sm leading-relaxed" style={{ color: TEXT2 }}>{lesson.body}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </TabsContent>

        {/* ── Arrival Checklist ── */}
        <TabsContent value="checklist">
          <div className="max-w-2xl space-y-4">
            <div className="rounded-2xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <div className="flex items-center justify-between mb-4">
                <div className="font-bold text-white text-lg">Pre-Arrival & First-Week Checklist</div>
                <div className="text-sm font-bold" style={{ color: GOLD }}>{doneCount}/{checklist.length} done</div>
              </div>
              <div className="h-2 rounded-full overflow-hidden mb-5" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${(doneCount / checklist.length) * 100}%`, background: SUCCESS }} />
              </div>
              <div className="space-y-2">
                {checklist.map((item, i) => (
                  <button key={i} onClick={() => toggleCheck(i)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all hover:opacity-90"
                    style={{ background: item.done ? 'rgba(0,200,83,0.08)' : CARD2, border: `1px solid ${item.done ? 'rgba(0,200,83,0.25)' : BORDER}` }}>
                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${item.done ? '' : ''}`}
                      style={{ borderColor: item.done ? SUCCESS : TEXT2, background: item.done ? SUCCESS : 'transparent' }}>
                      {item.done && <CheckCircle2 className="w-3 h-3 text-[#0F0520]" />}
                    </div>
                    <span className={`text-sm ${item.done ? 'line-through' : ''}`}
                      style={{ color: item.done ? TEXT2 : 'white' }}>{item.item}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-4 flex items-start gap-3" style={{ background: 'rgba(245,158,11,0.08)', border: `1px solid rgba(245,158,11,0.2)` }}>
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: WARN }} />
              <div>
                <div className="text-sm font-semibold mb-1" style={{ color: WARN }}>Important: Anmeldung (Registration)</div>
                <div className="text-sm" style={{ color: TEXT2 }}>
                  You must register your German address at the local Bürgeramt within 14 days of arrival. You need a completed Anmeldungsformular and your Wohnungsgeberbestätigung from your landlord. Failure to register can affect your tax number and health insurance.
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── Did You Know ── */}
        <TabsContent value="did-you-know">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DID_YOU_KNOW.map((item, i) => (
              <div key={i} className="rounded-2xl p-5 space-y-3 hover:scale-[1.02] transition-transform cursor-default"
                style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{item.flag}</span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(168,85,247,0.12)', color: ACCENT }}>{item.category}</span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: TEXT2 }}>{item.fact}</p>
              </div>
            ))}

            {/* Video placeholder */}
            <div className="rounded-2xl p-5 sm:col-span-2 lg:col-span-3"
              style={{ background: 'linear-gradient(135deg, #1A0B3B, #130828)', border: `1px solid ${BORDER}` }}>
              <div className="flex items-center gap-3 mb-3">
                <Star className="w-5 h-5" style={{ color: GOLD }} />
                <div className="font-bold text-white">Pro tip from successful migrants</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'Priya N.', role: 'Nurse · Berlin', tip: '"Learn at least A2 before you arrive. Your colleagues will appreciate even basic German and it builds trust immediately."', country: '🇮🇳→🇩🇪' },
                  { name: 'Arjun S.', role: 'Mechanic · Munich', tip: '"Don\'t be afraid of directness. When my supervisor pointed out my mistake I was upset — but it was how I improved fast."', country: '🇮🇳→🇩🇪' },
                  { name: 'Ravi K.', role: 'Electrician · Hamburg', tip: '"Punctuality changed my life here. I was always 10–15 min early and within 3 months I got promoted to team lead."', country: '🇮🇳→🇩🇪' },
                ].map((tip, i) => (
                  <div key={i} className="rounded-xl p-4" style={{ background: CARD }}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                        style={{ background: 'rgba(168,85,247,0.2)', color: ACCENT }}>{tip.name[0]}</div>
                      <div>
                        <div className="text-sm font-semibold text-white">{tip.name} <span style={{ color: TEXT2 }}>{tip.country}</span></div>
                        <div className="text-[11px]" style={{ color: TEXT2 }}>{tip.role}</div>
                      </div>
                    </div>
                    <p className="text-xs italic leading-relaxed" style={{ color: TEXT2 }}>"{tip.tip}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
