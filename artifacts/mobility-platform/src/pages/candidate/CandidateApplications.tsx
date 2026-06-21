import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building, MapPin, Calendar, Search, Briefcase, Euro, Clock, Star, CheckCircle, Filter } from 'lucide-react';
import { format } from 'date-fns';

const CARD = '#1A0B3B';
const CARD2 = '#130828';
const ACCENT = '#A855F7';
const SUCCESS = '#00C853';
const BORDER = 'rgba(168,85,247,0.15)';
const TEXT2 = '#C4B5FD';

const CATEGORIES = [
  { id: 'all', label: 'All Jobs', emoji: '🌍' },
  { id: 'automotive', label: 'Automotive', emoji: '🚗' },
  { id: 'nursing', label: 'Nursing & Care', emoji: '🏥' },
  { id: 'electrician', label: 'Electrician', emoji: '⚡' },
  { id: 'plumber', label: 'Plumber', emoji: '🔧' },
  { id: 'construction', label: 'Construction', emoji: '🏗️' },
  { id: 'hospitality', label: 'Hospitality', emoji: '🏨' },
  { id: 'it', label: 'IT / Software', emoji: '💻' },
  { id: 'barber', label: 'Hair & Beauty', emoji: '✂️' },
  { id: 'driver', label: 'Logistics & Driving', emoji: '🚛' },
  { id: 'agri', label: 'Agriculture', emoji: '🌾' },
];

const JOBS = [
  { id: 1, title: 'Kfz-Mechatroniker (Automotive Mechanic)', company: 'Robert Bosch GmbH', city: 'Stuttgart', state: 'Baden-Württemberg', salary: '€38,000–€46,000', category: 'automotive', matchScore: 92, posted: '2 days ago', type: 'Full-time', language: 'B1', description: 'Join Germany\'s leading automotive supplier. Work on next-gen EV systems, diagnostics, and high-voltage components. IHK recognised qualification required.', urgent: true, spots: 5 },
  { id: 2, title: 'Altenpfleger / Altenpflegerin (Care Worker)', company: 'BerlinCare Altenpflege GmbH', city: 'Berlin', state: 'Berlin', salary: '€32,000–€42,000', category: 'nursing', matchScore: 88, posted: '1 day ago', type: 'Full-time', language: 'B2', description: 'Senior care facility in Berlin seeking compassionate care workers. Housing assistance provided. Relocation bonus available.', urgent: false, spots: 12 },
  { id: 3, title: 'Elektriker / Elektrotechniker', company: 'Siemens AG', city: 'Munich', state: 'Bavaria', salary: '€40,000–€52,000', category: 'electrician', matchScore: 85, posted: '3 days ago', type: 'Full-time', language: 'B1', description: 'Work on industrial automation, smart building systems, and power distribution. German electrical certification required.', urgent: false, spots: 8 },
  { id: 4, title: 'Installateur und Heizungsbauer (Plumber)', company: 'Vaillant Group', city: 'Remscheid', state: 'NRW', salary: '€34,000–€44,000', category: 'plumber', matchScore: 79, posted: '5 days ago', type: 'Full-time', language: 'A2', description: 'Install and maintain heating, ventilation and plumbing systems in residential and commercial properties.', urgent: false, spots: 4 },
  { id: 5, title: 'Koch / Köchin (Chef de Partie)', company: 'Marriott Frankfurt', city: 'Frankfurt', state: 'Hesse', salary: '€28,000–€36,000', category: 'hospitality', matchScore: 74, posted: '1 week ago', type: 'Full-time', language: 'A2', description: 'Join our international team. Specialise in European cuisine. On-the-job German language support provided.', urgent: false, spots: 3 },
  { id: 6, title: 'Friseur / Friseurin (Hair Stylist)', company: 'Klier Hair Group', city: 'Hamburg', state: 'Hamburg', salary: '€24,000–€30,000', category: 'barber', matchScore: 70, posted: '4 days ago', type: 'Full-time', language: 'A2', description: 'Work in a modern salon chain across Germany. Cutting, colouring, styling. Customer interaction in German.', urgent: false, spots: 20 },
  { id: 7, title: 'Berufskraftfahrer (Truck Driver)', company: 'DHL Supply Chain', city: 'Cologne', state: 'NRW', salary: '€32,000–€40,000', category: 'driver', matchScore: 76, posted: '2 days ago', type: 'Full-time', language: 'B1', description: 'Long-haul and distribution routes across Europe. EU driving licence required. German language for documentation.', urgent: true, spots: 30 },
  { id: 8, title: 'Maurer / Bauhelfer (Construction Worker)', company: 'STRABAG SE', city: 'Düsseldorf', state: 'NRW', salary: '€30,000–€38,000', category: 'construction', matchScore: 68, posted: '6 days ago', type: 'Full-time', language: 'A1', description: 'Residential and commercial construction projects. No prior German required — on-site training provided.', urgent: false, spots: 50 },
  { id: 9, title: 'Softwareentwickler (Backend Developer)', company: 'SAP SE', city: 'Walldorf', state: 'Baden-Württemberg', salary: '€55,000–€75,000', category: 'it', matchScore: 88, posted: '1 day ago', type: 'Full-time', language: 'B1', description: 'Build enterprise solutions at the world\'s leading ERP company. Java, Spring Boot, Cloud expertise valued.', urgent: false, spots: 15 },
  { id: 10, title: 'Krankenpfleger / Krankenschwester (Nurse)', company: 'Charité Universitätsmedizin Berlin', city: 'Berlin', state: 'Berlin', salary: '€36,000–€48,000', category: 'nursing', matchScore: 95, posted: '3 hours ago', type: 'Full-time', language: 'B2', description: 'Work at Europe\'s largest university hospital. ICU, general ward, and specialised nursing positions available.', urgent: true, spots: 25 },
];

const MY_APPLICATIONS = [
  { id: 1, title: 'Kfz-Mechatroniker', company: 'Robert Bosch GmbH', status: 'interview_scheduled', appliedAt: '2024-06-01T10:00:00Z' },
  { id: 2, title: 'Elektriker', company: 'Siemens AG', status: 'shortlisted', appliedAt: '2024-05-28T10:00:00Z' },
  { id: 3, title: 'Berufskraftfahrer', company: 'DHL Supply Chain', status: 'applied', appliedAt: '2024-06-05T10:00:00Z' },
];

const statusConfig: Record<string, { label: string; color: string }> = {
  applied: { label: 'Applied', color: '#818CF8' },
  shortlisted: { label: 'Shortlisted', color: '#C084FC' },
  interview_scheduled: { label: 'Interview Scheduled', color: ACCENT },
  offer_issued: { label: 'Offer Issued', color: SUCCESS },
  offer_rejected: { label: 'Offer Rejected', color: '#EF4444' },
};

export function CandidateApplications() {
  const [tab, setTab] = useState<'browse' | 'applied'>('browse');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [appliedJobs, setAppliedJobs] = useState<Set<number>>(new Set());
  const [savedJobs, setSavedJobs] = useState<Set<number>>(new Set());

  const filteredJobs = JOBS.filter(j => {
    const matchCat = category === 'all' || j.category === category;
    const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase()) || j.city.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleApply = (id: number) => {
    setAppliedJobs(prev => new Set([...prev, id]));
  };
  const handleSave = (id: number) => {
    setSavedJobs(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6 min-h-screen" style={{ background: '#0F0520' }}>
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Job Marketplace</h1>
        <p className="mt-1" style={{ color: TEXT2 }}>Browse verified German job openings matched to your profile. Apply directly.</p>
      </div>

      {/* Tab Toggle */}
      <div className="flex gap-2">
        {[
          { id: 'browse', label: '🔍 Browse Jobs' },
          { id: 'applied', label: `📋 My Applications (${MY_APPLICATIONS.length})` },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)}
            className="px-5 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: tab === t.id ? ACCENT : CARD2,
              color: tab === t.id ? '#0F0520' : TEXT2,
              border: `1px solid ${tab === t.id ? ACCENT : BORDER}`,
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'browse' && (
        <>
          {/* Search + Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: TEXT2 }} />
              <Input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search job title, company, or city…"
                className="pl-10 text-white placeholder:text-purple-300 border"
                style={{ background: CARD, borderColor: 'rgba(255,255,255,0.1)', height: 44 }}
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setCategory(cat.id)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap"
                  style={{
                    background: category === cat.id ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.04)',
                    color: category === cat.id ? ACCENT : TEXT2,
                    border: `1px solid ${category === cat.id ? ACCENT : 'rgba(255,255,255,0.08)'}`,
                  }}>
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <div className="text-sm" style={{ color: TEXT2 }}>
            <span className="font-semibold text-white">{filteredJobs.length}</span> jobs found
            {category !== 'all' && <span> in {CATEGORIES.find(c => c.id === category)?.label}</span>}
            {search && <span> for "{search}"</span>}
          </div>

          {/* Job Cards */}
          <div className="space-y-4">
            {filteredJobs.length === 0 && (
              <div className="text-center py-16 rounded-2xl" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <Briefcase className="w-12 h-12 mx-auto mb-3" style={{ color: TEXT2 }} />
                <div className="text-lg font-semibold text-white mb-1">No jobs found</div>
                <div className="text-sm" style={{ color: TEXT2 }}>Try a different search or category</div>
              </div>
            )}
            {filteredJobs.map(job => {
              const isApplied = appliedJobs.has(job.id);
              const isSaved = savedJobs.has(job.id);
              return (
                <div key={job.id}
                  className="rounded-2xl p-5 transition-all hover:border-[#A855F7]/40"
                  style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
                          style={{ background: 'rgba(168,85,247,0.15)', color: ACCENT }}>
                          {job.company.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-bold text-white leading-tight">{job.title}</h3>
                            {job.urgent && <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(239,68,68,0.2)', color: '#EF4444' }}>URGENT</span>}
                            {job.matchScore >= 85 && <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(0,200,83,0.2)', color: SUCCESS }}>Great Match</span>}
                          </div>
                          <div className="text-sm" style={{ color: TEXT2 }}>{job.company}</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 text-xs mb-3" style={{ color: TEXT2 }}>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.city}, {job.state}</span>
                        <span className="flex items-center gap-1"><Euro className="w-3 h-3" />{job.salary}/yr</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{job.posted}</span>
                        <span className="flex items-center gap-1">🇩🇪 German {job.language}+</span>
                        <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{job.spots} spots</span>
                      </div>

                      <p className="text-sm" style={{ color: TEXT2 }}>{job.description}</p>
                    </div>

                    <div className="flex flex-col items-end gap-3 flex-shrink-0">
                      {/* Match Score */}
                      <div className="text-center">
                        <div className="text-2xl font-black" style={{ color: job.matchScore >= 85 ? SUCCESS : job.matchScore >= 70 ? ACCENT : TEXT2 }}>
                          {job.matchScore}%
                        </div>
                        <div className="text-[10px]" style={{ color: TEXT2 }}>Match</div>
                      </div>

                      <button onClick={() => handleSave(job.id)} className="p-1.5 rounded-lg transition-all"
                        style={{ color: isSaved ? ACCENT : TEXT2, background: isSaved ? 'rgba(168,85,247,0.1)' : 'transparent' }}>
                        <Star className="w-4 h-4" fill={isSaved ? ACCENT : 'none'} />
                      </button>

                      {isApplied ? (
                        <div className="flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-semibold"
                          style={{ background: 'rgba(0,200,83,0.15)', color: SUCCESS }}>
                          <CheckCircle className="w-4 h-4" />
                          Applied!
                        </div>
                      ) : (
                        <button onClick={() => handleApply(job.id)}
                          className="px-5 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-95"
                          style={{ background: ACCENT, color: '#0F0520' }}>
                          Apply Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* My Applications Tab */}
      {tab === 'applied' && (
        <div className="space-y-3">
          {MY_APPLICATIONS.map(app => {
            const cfg = statusConfig[app.status] || { label: app.status, color: TEXT2 };
            return (
              <div key={app.id} className="flex justify-between items-center p-4 rounded-2xl" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold"
                    style={{ background: 'rgba(168,85,247,0.15)', color: ACCENT }}>
                    {app.company.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{app.title}</div>
                    <div className="text-sm" style={{ color: TEXT2 }}>{app.company}</div>
                    <div className="text-xs mt-0.5" style={{ color: TEXT2 }}>
                      Applied: {format(new Date(app.appliedAt), 'MMM d, yyyy')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{ background: `${cfg.color}20`, color: cfg.color }}>
                    {cfg.label}
                  </div>
                  {app.status === 'interview_scheduled' && (
                    <Button size="sm" className="text-xs" style={{ background: ACCENT, color: '#0F0520' }}>
                      View Interview
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
