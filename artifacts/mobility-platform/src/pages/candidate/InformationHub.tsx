import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Globe, Building2, Plane, FileText, HelpCircle, ExternalLink,
  Search, Phone, Mail, MapPin, ChevronDown, ChevronUp, AlertCircle,
  Landmark, Shield, BookOpen, Users, Info
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

const GOV_LINKS = [
  {
    category: 'Germany — Official',
    color: '#3B82F6',
    links: [
      { title: 'Make it in Germany', desc: 'Official German government portal for skilled workers', url: 'https://www.make-it-in-germany.com', type: 'Portal' },
      { title: 'Federal Employment Agency (BA)', desc: 'Job search, labour market info, skill recognition', url: 'https://www.arbeitsagentur.de', type: 'Government' },
      { title: 'BAMF — Federal Office for Migration', desc: 'Immigration, integration, asylum information', url: 'https://www.bamf.de', type: 'Government' },
      { title: 'Anerkennung in Deutschland', desc: 'Official recognition of foreign qualifications', url: 'https://www.anerkennung-in-deutschland.de', type: 'Recognition' },
    ],
  },
  {
    category: 'India — Official',
    color: '#F97316',
    links: [
      { title: 'Ministry of External Affairs', desc: 'Passport, emigration clearance, overseas citizen services', url: 'https://www.mea.gov.in', type: 'Government' },
      { title: 'Protector General of Emigrants', desc: 'Official emigration registration and clearance', url: 'https://emigrate.gov.in', type: 'Government' },
      { title: 'NSDC International', desc: 'Skill development and international placement facilitation', url: 'https://nsdcinternational.in', type: 'Skills' },
      { title: 'MSDE — Ministry of Skill Dev.', desc: 'National skill framework and certifications', url: 'https://www.msde.gov.in', type: 'Skills' },
    ],
  },
  {
    category: 'Bilateral & Support',
    color: ACCENT,
    links: [
      { title: 'GIZ — German Development Agency', desc: 'Indo-German skills and mobility programmes', url: 'https://www.giz.de', type: 'Bilateral' },
      { title: 'Indo-German Chamber of Commerce', desc: 'Business, trade, and workforce connections', url: 'https://www.indo-german.com', type: 'Trade' },
      { title: 'Goethe-Institut India', desc: 'German language exams (Goethe-Zertifikat)', url: 'https://www.goethe.de/ins/in/en/index.html', type: 'Language' },
      { title: 'IHK — German Chambers of Commerce', desc: 'Vocational qualification recognition and exams', url: 'https://www.ihk.de', type: 'Certification' },
    ],
  },
];

const CONSULATES = [
  { city: 'New Delhi', role: 'Embassy', address: '6/50-G Shantipath, Chanakyapuri, New Delhi 110 021', phone: '+91-11-4419 9199', email: 'info@new-delhi.diplo.de', visa: true },
  { city: 'Mumbai', role: 'Consulate General', address: 'Hoechst House, 10th Floor, Nariman Point, Mumbai 400 021', phone: '+91-22-2283 2422', email: 'info@mumbai.diplo.de', visa: true },
  { city: 'Chennai', role: 'Consulate General', address: '9 Boat Club Road, Chennai 600 028', phone: '+91-44-4219 7700', email: 'info@chennai.diplo.de', visa: true },
  { city: 'Bengaluru', role: 'Consulate General', address: '6/6 Lavelle Road, Bengaluru 560 001', phone: '+91-80-4140 8300', email: 'info@bengaluru.diplo.de', visa: false },
  { city: 'Kolkata', role: 'Consulate General', address: '1 Hastings Park Road, Alipore, Kolkata 700 027', phone: '+91-33-2479 1141', email: 'info@kolkata.diplo.de', visa: false },
  { city: 'Hyderabad', role: 'Honorary Consulate', address: 'Barkatpura, Hyderabad 500 027', phone: '+91-40-2758 4244', email: 'info@hyderabad.diplo.de', visa: false },
];

const VISA_TYPES = [
  {
    type: 'Skilled Worker Visa (§18a AufenthG)',
    color: '#3B82F6',
    forWhom: 'University graduates with a job offer',
    requirements: ['Recognised university degree', 'Concrete job offer', 'B1 German (recommended)', 'Proof of accommodation'],
    processingTime: '1–3 months',
    validity: '4 years (renewable)',
    popular: false,
  },
  {
    type: 'Skilled Worker Visa — Vocational (§18a)',
    color: ACCENT,
    forWhom: 'Vocational / ITI / polytechnic graduates with offer',
    requirements: ['Recognised vocational qualification (FOSA/IHK)', 'Job offer', 'A2–B1 German', 'Valid passport'],
    processingTime: '2–4 months',
    validity: '4 years (renewable)',
    popular: true,
  },
  {
    type: 'Job-Seeker Visa (§20 AufenthG)',
    color: SUCCESS,
    forWhom: 'Qualified professionals looking for jobs in Germany',
    requirements: ['University or vocational degree', 'Sufficient funds (€5,000+)', 'Health insurance', 'No job offer needed upfront'],
    processingTime: '3–6 weeks',
    validity: '6 months (non-renewable)',
    popular: false,
  },
  {
    type: 'EU Blue Card (§18g AufenthG)',
    color: GOLD,
    forWhom: 'University graduates in shortage occupations with salary ≥ €45,300',
    requirements: ['University degree (4+ years)', 'Job offer with qualifying salary', 'Recognised degree', 'Health insurance'],
    processingTime: '1–2 months',
    validity: '4 years',
    popular: false,
  },
];

const FAQS = [
  { q: 'Do I need a job offer before applying for a German visa?', a: 'It depends on the visa type. The Job-Seeker Visa allows you to go to Germany first and look for work (for up to 6 months). The Skilled Worker Visa and EU Blue Card require a job offer. Most candidates on this platform aim for the Skilled Worker Visa after securing a job offer.' },
  { q: 'How long does qualification recognition (Anerkennung) take?', a: 'For regulated professions (nurses, engineers, teachers), recognition takes 3–6 months through the competent authority. For non-regulated professions, the statement of equivalence (Anerkennungsberatung) can take 4–12 weeks. Start early — recognition is often required before a visa is issued.' },
  { q: 'What is FOSA and who needs it?', a: 'FOSA (Foreign Skills Approval) is the central recognition office for foreign vocational qualifications in Germany. If you have an ITI or polytechnic diploma, FOSA assesses whether it is equivalent to a German Ausbildung. This is mandatory for the vocational skilled worker visa.' },
  { q: 'Can my family come with me to Germany?', a: 'Yes. Spouses and minor children can apply for family reunification (Familiennachzug) once you have a valid residence permit. Spouses must usually demonstrate A1 German language proficiency. The process typically takes 3–6 months after you receive your own visa.' },
  { q: 'What documents do I need to bring to the consulate?', a: 'Core documents: valid passport, biometric photos, visa application form, job offer or employment contract, proof of qualification recognition, proof of health insurance, proof of accommodation in Germany, and visa fee payment (approx €75). Specific requirements vary by consulate and visa type.' },
  { q: 'Is health insurance compulsory from Day 1 in Germany?', a: 'Yes. Health insurance (Krankenversicherung) is mandatory for all residents. Your employer will automatically register you with a statutory health insurer (gesetzliche Krankenkasse). For the visa application, you need proof of health insurance coverage for the period until your employment begins.' },
  { q: 'What if my German qualification recognition is partially equivalent?', a: 'A partial equivalence notice means you need to complete additional qualification measures (Anpassungsqualifizierung) — typically a supervised practical period or additional exam. Your facilitator on this platform can help guide you through this process.' },
  { q: 'Can I switch jobs after arriving in Germany on a skilled worker visa?', a: 'Generally yes, but during the first 2 years your visa is linked to your approved occupation and employer. After 2 years, you have more flexibility. Always inform your local immigration authority (Ausländerbehörde) before switching employers within the first 2 years.' },
];

export function InformationHub() {
  const [search, setSearch] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openVisa, setOpenVisa] = useState<number | null>(null);

  const filteredFaqs = FAQS.filter(f =>
    f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 min-h-screen" style={{ background: BG }}>
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <Info className="w-8 h-8" style={{ color: ACCENT }} />
          Information Hub
        </h1>
        <p className="mt-1" style={{ color: TEXT2 }}>
          Official government links · Embassy contacts · Visa guides · Recognition requirements · FAQs
        </p>
      </div>

      {/* Quick links bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Embassy Contacts', icon: <Building2 className="w-5 h-5" />, color: '#3B82F6', tab: 'consulates' },
          { label: 'Visa Guides', icon: <Plane className="w-5 h-5" />, color: ACCENT, tab: 'visa' },
          { label: 'Gov Websites', icon: <Landmark className="w-5 h-5" />, color: SUCCESS, tab: 'links' },
          { label: 'FAQs', icon: <HelpCircle className="w-5 h-5" />, color: GOLD, tab: 'faq' },
        ].map(item => (
          <div key={item.label} className="rounded-xl p-4 flex items-center gap-3 cursor-default hover:opacity-90 transition-opacity"
            style={{ background: CARD, border: `1px solid ${item.color}25` }}>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: `${item.color}15`, color: item.color }}>{item.icon}</div>
            <span className="text-sm font-semibold text-white">{item.label}</span>
          </div>
        ))}
      </div>

      <Tabs defaultValue="links" className="w-full">
        <TabsList className="mb-6 gap-1" style={{ background: CARD2, border: `1px solid ${BORDER}` }}>
          <TabsTrigger value="links">🌐 Gov Websites</TabsTrigger>
          <TabsTrigger value="consulates">🏛️ Embassies</TabsTrigger>
          <TabsTrigger value="visa">✈️ Visa Types</TabsTrigger>
          <TabsTrigger value="faq">❓ FAQs</TabsTrigger>
        </TabsList>

        {/* ── Gov Links ── */}
        <TabsContent value="links" className="space-y-6">
          {GOV_LINKS.map(group => (
            <div key={group.category}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full" style={{ background: group.color }} />
                <div className="text-sm font-bold uppercase tracking-widest" style={{ color: group.color }}>{group.category}</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {group.links.map(link => (
                  <a key={link.title} href={link.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-start gap-4 p-4 rounded-xl group hover:scale-[1.01] transition-all"
                    style={{ background: CARD, border: `1px solid ${BORDER}`, textDecoration: 'none' }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${group.color}15`, color: group.color }}>
                      <Globe className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white text-sm flex items-center gap-2">
                        {link.title}
                        <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: group.color }} />
                      </div>
                      <div className="text-xs mt-0.5 truncate" style={{ color: TEXT2 }}>{link.desc}</div>
                      <span className="text-[10px] mt-1.5 inline-block px-2 py-0.5 rounded-full font-bold"
                        style={{ background: `${group.color}15`, color: group.color }}>{link.type}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        {/* ── Consulates ── */}
        <TabsContent value="consulates" className="space-y-4">
          <div className="rounded-xl p-4 flex items-start gap-3 mb-2"
            style={{ background: 'rgba(245,158,11,0.08)', border: `1px solid rgba(245,158,11,0.2)` }}>
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: WARN }} />
            <div className="text-sm" style={{ color: TEXT2 }}>
              <span className="font-semibold" style={{ color: WARN }}>Visa appointment tip: </span>
              Book your visa appointment as early as possible — slots fill up 2–3 months in advance. Only New Delhi, Mumbai, and Chennai issue National (D) visas for skilled workers.
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CONSULATES.map(c => (
              <div key={c.city} className="rounded-2xl p-5 space-y-3"
                style={{ background: CARD, border: `1px solid ${c.visa ? 'rgba(168,85,247,0.3)' : BORDER}` }}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-white text-lg">{c.city}</div>
                    <div className="text-xs" style={{ color: TEXT2 }}>{c.role}</div>
                  </div>
                  {c.visa && (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                      style={{ background: 'rgba(168,85,247,0.15)', color: ACCENT }}>Issues Work Visas</span>
                  )}
                </div>
                <div className="space-y-1.5 text-sm">
                  <div className="flex items-start gap-2" style={{ color: TEXT2 }}>
                    <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{c.address}</span>
                  </div>
                  <div className="flex items-center gap-2" style={{ color: TEXT2 }}>
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <a href={`tel:${c.phone}`} className="hover:text-white transition-colors">{c.phone}</a>
                  </div>
                  <div className="flex items-center gap-2" style={{ color: TEXT2 }}>
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    <a href={`mailto:${c.email}`} className="hover:text-white transition-colors text-xs">{c.email}</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ── Visa Types ── */}
        <TabsContent value="visa" className="space-y-4">
          {VISA_TYPES.map((v, i) => (
            <div key={i} className="rounded-2xl overflow-hidden"
              style={{ background: CARD, border: `2px solid ${openVisa === i ? v.color + '60' : BORDER}` }}>
              <button className="w-full flex items-center gap-4 p-5 text-left"
                onClick={() => setOpenVisa(openVisa === i ? null : i)}>
                <div className="w-3 h-12 rounded-full flex-shrink-0" style={{ background: v.color }} />
                <div className="flex-1">
                  <div className="font-bold text-white flex items-center gap-2 flex-wrap">
                    {v.type}
                    {v.popular && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: `${v.color}20`, color: v.color }}>MOST COMMON</span>
                    )}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: TEXT2 }}>{v.forWhom}</div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right hidden sm:block">
                    <div className="text-[10px] uppercase tracking-widest mb-0.5" style={{ color: TEXT2 }}>Processing</div>
                    <div className="text-xs font-semibold" style={{ color: v.color }}>{v.processingTime}</div>
                  </div>
                  {openVisa === i ? <ChevronUp className="w-5 h-5" style={{ color: TEXT2 }} /> : <ChevronDown className="w-5 h-5" style={{ color: TEXT2 }} />}
                </div>
              </button>

              {openVisa === i && (
                <div className="px-6 pb-6 pt-2 border-t" style={{ borderColor: `${v.color}20` }}>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div className="rounded-xl p-3" style={{ background: CARD2 }}>
                      <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: TEXT2 }}>Processing Time</div>
                      <div className="font-bold" style={{ color: v.color }}>{v.processingTime}</div>
                    </div>
                    <div className="rounded-xl p-3" style={{ background: CARD2 }}>
                      <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: TEXT2 }}>Validity</div>
                      <div className="font-bold text-white">{v.validity}</div>
                    </div>
                    <div className="rounded-xl p-3" style={{ background: CARD2 }}>
                      <div className="text-[10px] uppercase tracking-widest mb-1" style={{ color: TEXT2 }}>Visa Fee</div>
                      <div className="font-bold text-white">€75</div>
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: TEXT2 }}>Key Requirements</div>
                    <ul className="space-y-2">
                      {v.requirements.map((r, ri) => (
                        <li key={ri} className="flex items-center gap-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: v.color }} />
                          <span style={{ color: TEXT2 }}>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <a href="https://www.make-it-in-germany.com/en/visa-residence/types" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                    style={{ background: `${v.color}20`, color: v.color, border: `1px solid ${v.color}40` }}>
                    <ExternalLink className="w-3.5 h-3.5" /> Official Visa Guide
                  </a>
                </div>
              )}
            </div>
          ))}
        </TabsContent>

        {/* ── FAQ ── */}
        <TabsContent value="faq" className="space-y-3">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: TEXT2 }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search FAQs — visa, recognition, family, documents…"
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder:text-purple-400/50 outline-none focus:ring-2 focus:ring-purple-500/40"
              style={{ background: CARD, border: `1px solid ${BORDER}` }}
            />
          </div>

          {filteredFaqs.length === 0 && (
            <div className="text-center py-10" style={{ color: TEXT2 }}>No matching FAQs. Try a different search term.</div>
          )}

          {filteredFaqs.map((faq, i) => {
            const originalIdx = FAQS.indexOf(faq);
            return (
              <div key={i} className="rounded-2xl overflow-hidden"
                style={{ background: CARD, border: `1px solid ${openFaq === originalIdx ? ACCENT + '40' : BORDER}` }}>
                <button className="w-full flex items-start gap-4 p-5 text-left"
                  onClick={() => setOpenFaq(openFaq === originalIdx ? null : originalIdx)}>
                  <HelpCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: ACCENT }} />
                  <div className="flex-1 text-sm font-semibold text-white">{faq.q}</div>
                  {openFaq === originalIdx
                    ? <ChevronUp className="w-5 h-5 flex-shrink-0" style={{ color: TEXT2 }} />
                    : <ChevronDown className="w-5 h-5 flex-shrink-0" style={{ color: TEXT2 }} />}
                </button>
                {openFaq === originalIdx && (
                  <div className="px-5 pb-5 border-t" style={{ borderColor: 'rgba(168,85,247,0.1)' }}>
                    <p className="text-sm leading-relaxed pt-3" style={{ color: TEXT2 }}>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}
