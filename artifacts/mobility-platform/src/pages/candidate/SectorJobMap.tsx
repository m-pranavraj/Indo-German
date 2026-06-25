import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Heart, Hotel, Wrench, Car, FlaskConical, ShieldCheck,
  Cpu, ChevronRight, TrendingUp, Users, Euro, MapPin,
  Briefcase, Star, ExternalLink, BarChart3, Globe
} from 'lucide-react';

const BG = '#0F0520';
const CARD = '#1A0B3B';
const CARD2 = '#130828';
const ACCENT = '#A855F7';
const SUCCESS = '#00C853';
const TEXT2 = '#C4B5FD';
const BORDER = 'rgba(168,85,247,0.15)';
const GOLD = '#FBBF24';

const SECTORS = [
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: <Heart className="w-6 h-6" />,
    color: '#EC4899',
    demand: 'Very High',
    openJobs: '142,000+',
    avgSalary: '€34,000–€55,000',
    germanReq: 'B2 (regulated)',
    roles: [
      { title: 'Registered Nurse (Pflegefachkraft)', salary: '€38,000–€48,000', openings: 85000, recognition: 'Required (Berufsanerkennung)', city: 'Berlin, Munich, Hamburg' },
      { title: 'Nursing Assistant (Pflegehelferin)', salary: '€28,000–€34,000', openings: 32000, recognition: 'Not required', city: 'All states' },
      { title: 'Medical Assistant (MFA)', salary: '€26,000–€36,000', openings: 18000, recognition: 'Partial recognition', city: 'Nationwide' },
      { title: 'Physiotherapist', salary: '€34,000–€46,000', openings: 7000, recognition: 'Required', city: 'Bavaria, NRW' },
    ],
    highlights: ['Fastest-growing sector', 'High job security', 'Employer often pays for language training', 'Family reunification support'],
    trend: '+18% demand growth (2023–25)',
  },
  {
    id: 'hospitality',
    name: 'Hospitality',
    icon: <Hotel className="w-6 h-6" />,
    color: '#F97316',
    demand: 'High',
    openJobs: '62,000+',
    avgSalary: '€22,000–€38,000',
    germanReq: 'A2–B1',
    roles: [
      { title: 'Hotel Chef (Koch)', salary: '€28,000–€40,000', openings: 18000, recognition: 'Not required', city: 'Munich, Berlin, Frankfurt' },
      { title: 'Restaurant Server (Servicekraft)', salary: '€22,000–€30,000', openings: 24000, recognition: 'Not required', city: 'All cities' },
      { title: 'Hotel Receptionist', salary: '€24,000–€32,000', openings: 9000, recognition: 'Not required', city: 'Tourist regions' },
      { title: 'Housekeeping Supervisor', salary: '€26,000–€35,000', openings: 11000, recognition: 'Not required', city: 'Bavaria, Berlin' },
    ],
    highlights: ['Low language barrier for entry', 'Seasonal and permanent options', 'Tips can boost income', 'Fast track to B1 via immersion'],
    trend: '+11% post-COVID recovery',
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    icon: <Wrench className="w-6 h-6" />,
    color: '#6366F1',
    demand: 'High',
    openJobs: '98,000+',
    avgSalary: '€30,000–€52,000',
    germanReq: 'A2–B1',
    roles: [
      { title: 'CNC Machine Operator', salary: '€32,000–€46,000', openings: 22000, recognition: 'Partial', city: 'Baden-Württemberg, Bavaria' },
      { title: 'Welder (Schweißer)', salary: '€30,000–€44,000', openings: 18000, recognition: 'Certificate preferred', city: 'NRW, Saxony' },
      { title: 'Industrial Mechanic', salary: '€34,000–€50,000', openings: 29000, recognition: 'FOSA assessment', city: 'Nationwide' },
      { title: 'Quality Inspector', salary: '€32,000–€48,000', openings: 14000, recognition: 'Not required', city: 'Bavaria, Hesse' },
    ],
    highlights: ['Stable employment', 'Overtime pay is common', 'Apprenticeship upgrade paths', 'Strong union coverage (IG Metall)'],
    trend: '+9% due to re-shoring',
  },
  {
    id: 'automotive',
    name: 'Automotive',
    icon: <Car className="w-6 h-6" />,
    color: SUCCESS,
    demand: 'Very High',
    openJobs: '76,000+',
    avgSalary: '€36,000–€58,000',
    germanReq: 'B1 recommended',
    roles: [
      { title: 'Kfz-Mechatroniker (Auto Technician)', salary: '€38,000–€52,000', openings: 32000, recognition: 'IHK recognition', city: 'Bavaria, Baden-Württemberg' },
      { title: 'EV Battery Technician', salary: '€42,000–€58,000', openings: 8000, recognition: 'New role — minimal req.', city: 'Munich, Stuttgart' },
      { title: 'Body & Paint Specialist', salary: '€34,000–€46,000', openings: 14000, recognition: 'IHK preferred', city: 'Nationwide' },
      { title: 'Automotive Logistics Coord.', salary: '€32,000–€44,000', openings: 22000, recognition: 'Not required', city: 'NRW, Bavaria' },
    ],
    highlights: ['Germany is global auto hub', 'Bosch, VW, BMW, Mercedes all hiring', 'EV transition creating new roles', 'High salary ceiling'],
    trend: '+14% EV-driven demand',
  },
  {
    id: 'chemicals',
    name: 'Chemical & Pharma',
    icon: <FlaskConical className="w-6 h-6" />,
    color: GOLD,
    demand: 'Moderate-High',
    openJobs: '38,000+',
    avgSalary: '€38,000–€68,000',
    germanReq: 'B1–B2',
    roles: [
      { title: 'Lab Technician (Chemielaborant)', salary: '€34,000–€48,000', openings: 12000, recognition: 'FOSA assessment', city: 'Hesse, Rhine-Main' },
      { title: 'Process Operator (Chemikant)', salary: '€38,000–€52,000', openings: 14000, recognition: 'Required', city: 'Ludwigshafen, Leverkusen' },
      { title: 'Pharmaceutical Sales Rep', salary: '€50,000–€70,000', openings: 6000, recognition: 'Degree required', city: 'Berlin, Munich, Frankfurt' },
      { title: 'Quality Assurance Chemist', salary: '€42,000–€58,000', openings: 6000, recognition: 'Degree + registration', city: 'Nationwide' },
    ],
    highlights: ['BASF, Bayer, Merck all based in Germany', 'Strong collective bargaining (IG BCE)', 'Excellent benefits', 'Career growth pathway'],
    trend: '+7% stable demand',
  },
  {
    id: 'safety',
    name: 'Occupational Safety',
    icon: <ShieldCheck className="w-6 h-6" />,
    color: '#EF4444',
    demand: 'Moderate',
    openJobs: '22,000+',
    avgSalary: '€42,000–€65,000',
    germanReq: 'B2',
    roles: [
      { title: 'Safety Officer (Fachkraft für Arbeitssicherheit)', salary: '€46,000–€65,000', openings: 8000, recognition: 'Required', city: 'NRW, Bavaria' },
      { title: 'Fire Safety Inspector', salary: '€40,000–€56,000', openings: 6000, recognition: 'Required', city: 'Major cities' },
      { title: 'HSE Manager', salary: '€52,000–€72,000', openings: 5000, recognition: 'Degree required', city: 'Industrial regions' },
      { title: 'Construction Site Safety', salary: '€38,000–€52,000', openings: 3000, recognition: 'Certification needed', city: 'Berlin, Hamburg, Munich' },
    ],
    highlights: ['Strict German safety culture = premium roles', 'Government contracts', 'Steady demand', 'Required in all major industries'],
    trend: '+5% regulatory growth',
  },
  {
    id: 'it',
    name: 'IT & Technology',
    icon: <Cpu className="w-6 h-6" />,
    color: '#3B82F6',
    demand: 'Very High',
    openJobs: '198,000+',
    avgSalary: '€52,000–€90,000',
    germanReq: 'A2–B1 (English ok)',
    roles: [
      { title: 'Software Developer', salary: '€58,000–€90,000', openings: 68000, recognition: 'Not required', city: 'Berlin, Munich, Hamburg' },
      { title: 'Cloud / DevOps Engineer', salary: '€62,000–€92,000', openings: 22000, recognition: 'Not required', city: 'Berlin, Cologne' },
      { title: 'Data Analyst', salary: '€52,000–€76,000', openings: 28000, recognition: 'Not required', city: 'Frankfurt, Munich, Berlin' },
      { title: 'IT Support Technician', salary: '€38,000–€52,000', openings: 30000, recognition: 'Cert preferred', city: 'Nationwide' },
    ],
    highlights: ['English often sufficient', 'Remote work widely accepted', 'EU Blue Card eligible', 'Highest salary ceiling of all sectors'],
    trend: '+22% digital transformation',
  },
];

const DEMAND_COLOR: Record<string, string> = {
  'Very High': SUCCESS,
  'High': ACCENT,
  'Moderate-High': GOLD,
  'Moderate': '#F97316',
};

export function SectorJobMap() {
  const [activeSector, setActiveSector] = useState<string>('healthcare');

  const sector = SECTORS.find(s => s.id === activeSector)!;

  return (
    <div className="space-y-8 min-h-screen" style={{ background: BG }}>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <BarChart3 className="w-8 h-8" style={{ color: ACCENT }} />
          Sector-Wise Job Mapping
        </h1>
        <p className="mt-1" style={{ color: TEXT2 }}>
          Explore Germany's high-demand sectors · Live job volumes · Salary ranges · Recognition requirements
        </p>
      </div>

      {/* Sector Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        {SECTORS.map(s => (
          <button key={s.id}
            onClick={() => setActiveSector(s.id)}
            className="rounded-xl p-3 flex flex-col items-center gap-2 transition-all hover:scale-[1.03]"
            style={{
              background: activeSector === s.id ? `${s.color}20` : CARD,
              border: `2px solid ${activeSector === s.id ? s.color : BORDER}`,
              boxShadow: activeSector === s.id ? `0 0 20px ${s.color}30` : 'none',
            }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ color: s.color, background: `${s.color}15` }}>
              {s.icon}
            </div>
            <div className="text-xs font-semibold text-center leading-tight" style={{ color: activeSector === s.id ? s.color : TEXT2 }}>
              {s.name}
            </div>
            <div className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ background: `${DEMAND_COLOR[s.demand]}15`, color: DEMAND_COLOR[s.demand] }}>
              {s.demand}
            </div>
          </button>
        ))}
      </div>

      {/* Sector Detail */}
      <div className="space-y-6">
        {/* Sector Header */}
        <div className="rounded-2xl p-6" style={{ background: `linear-gradient(135deg, ${sector.color}15, ${CARD})`, border: `1px solid ${sector.color}40` }}>
          <div className="flex items-start gap-4 flex-wrap">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${sector.color}20`, color: sector.color, border: `2px solid ${sector.color}40` }}>
              {sector.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-white">{sector.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-bold px-2.5 py-0.5 rounded-full"
                  style={{ background: `${DEMAND_COLOR[sector.demand]}15`, color: DEMAND_COLOR[sector.demand] }}>
                  {sector.demand} Demand
                </span>
                <span className="text-xs" style={{ color: TEXT2 }}>{sector.trend}</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 w-full sm:w-auto">
              {[
                { label: 'Open Jobs', value: sector.openJobs, icon: <Briefcase className="w-4 h-4" /> },
                { label: 'Avg. Salary', value: sector.avgSalary, icon: <Euro className="w-4 h-4" /> },
                { label: 'German Req.', value: sector.germanReq, icon: <Globe className="w-4 h-4" /> },
              ].map(stat => (
                <div key={stat.label} className="rounded-xl p-3 text-center" style={{ background: CARD }}>
                  <div className="flex justify-center mb-1" style={{ color: sector.color }}>{stat.icon}</div>
                  <div className="text-sm font-bold text-white leading-tight">{stat.value}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: TEXT2 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Job Roles */}
          <div className="lg:col-span-2 space-y-3">
            <div className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: TEXT2 }}>Top Roles in Germany</div>
            {sector.roles.map((role, i) => (
              <div key={i} className="rounded-xl p-4 hover:scale-[1.01] transition-all"
                style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white text-sm">{role.title}</div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs" style={{ color: TEXT2 }}>
                      <span className="flex items-center gap-1">
                        <Euro className="w-3.5 h-3.5" />{role.salary}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />{role.openings.toLocaleString()} openings
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />{role.city}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                      role.recognition === 'Not required'
                        ? 'text-green-400'
                        : role.recognition.includes('Required')
                        ? 'text-purple-400'
                        : 'text-amber-400'
                    }`}
                      style={{
                        background: role.recognition === 'Not required'
                          ? 'rgba(0,200,83,0.1)'
                          : role.recognition.includes('Required')
                          ? 'rgba(168,85,247,0.1)'
                          : 'rgba(245,158,11,0.1)',
                      }}>
                      {role.recognition}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Highlights + CTA */}
          <div className="space-y-4">
            <div className="rounded-2xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <div className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: TEXT2 }}>Why this sector?</div>
              <ul className="space-y-2">
                {sector.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Star className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: sector.color }} />
                    <span style={{ color: TEXT2 }}>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Salary Range Visual */}
            <div className="rounded-2xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <div className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: TEXT2 }}>Salary Distribution</div>
              <div className="space-y-2">
                {sector.roles.map((r, i) => {
                  const min = parseInt(r.salary.match(/[\d,]+/)?.[0]?.replace(/,/g, '') || '0') / 1000;
                  const pct = Math.min(100, (min / 90) * 100);
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="truncate w-36" style={{ color: TEXT2 }}>{r.title.split('(')[0].trim()}</span>
                        <span className="font-semibold" style={{ color: sector.color }}>{r.salary.split('–')[0]}</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${pct}%`, background: sector.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <div className="rounded-2xl p-5 space-y-3" style={{ background: `${sector.color}10`, border: `1px solid ${sector.color}30` }}>
              <div className="font-bold text-white">Ready to apply?</div>
              <p className="text-xs" style={{ color: TEXT2 }}>Find matching {sector.name} jobs and start your application today.</p>
              <a href="/candidate/applications"
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
                style={{ background: sector.color, color: '#0F0520' }}>
                <Briefcase className="w-4 h-4" />
                Browse {sector.name} Jobs
                <ChevronRight className="w-4 h-4" />
              </a>
              <a href="https://www.make-it-in-germany.com" target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs font-medium hover:opacity-80 transition-opacity"
                style={{ color: sector.color }}>
                <ExternalLink className="w-3.5 h-3.5" /> View on Make it in Germany
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
