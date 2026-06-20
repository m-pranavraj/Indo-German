import React, { useState } from 'react';
import { useListVisaCases, useUpdateVisaChecklistItem } from '@workspace/api-client-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { MapPin, Plane, ShieldCheck, FileText, Calendar, AlertCircle, CheckCircle2, ExternalLink, Clock, Euro } from 'lucide-react';
import { format } from 'date-fns';

const CARD = '#1A0B3B';
const CARD2 = '#130828';
const ACCENT = '#A855F7';
const SUCCESS = '#00C853';
const BORDER = 'rgba(168,85,247,0.15)';
const TEXT2 = '#C4B5FD';

const mockVisaCase = {
  id: 1,
  candidateId: 1,
  status: 'checklist_in_progress',
  pathwayType: 'EU Blue Card',
  checklistProgress: 4,
  checklistTotal: 8,
  travelDate: null,
  arrivalConfirmed: false,
  createdAt: '2024-01-15T10:00:00Z',
};

const initialChecklist = [
  { id: 1, item: 'Valid Passport', description: 'At least 6 months validity from planned travel date. Biometric passport preferred.', completed: true, required: true, icon: '🛂', link: 'https://passport.gov.in' },
  { id: 2, item: 'Employment Contract', description: 'Signed offer letter / employment contract from verified German employer on platform', completed: true, required: true, icon: '📝', link: null },
  { id: 3, item: 'ZAB Statement of Comparability', description: 'Full qualification recognition — Statement of Comparability (Zeugnisbewertung)', completed: true, required: true, icon: '🎓', link: 'https://www.kmk.org/zab' },
  { id: 4, item: 'Erklärung zum Beschäftigungsverhältnis', description: 'Declaration of Employment filled and signed by German employer', completed: true, required: true, icon: '✍️', link: null },
  { id: 5, item: 'Health Insurance', description: 'Travel/incoming health insurance for first 3 months. German Krankenversicherung follows after arrival.', completed: false, required: true, icon: '🏥', link: null },
  { id: 6, item: 'Visa Application Form (Videx)', description: 'Completed online Videx form from the German Embassy website', completed: false, required: true, icon: '📋', link: 'https://videx.diplo.de' },
  { id: 7, item: 'Biometric Photos', description: '3 recent biometric passport photos (35×45mm, white background, no glasses)', completed: false, required: true, icon: '📸', link: null },
  { id: 8, item: 'VFS / Consulate Appointment', description: 'Appointment booked at nearest German Consulate / VFS Global centre', completed: false, required: true, icon: '🗓️', link: 'https://www.vfsglobal.com/germany/india' },
];

const visaTypes = [
  { type: 'EU Blue Card', code: '§18b', desc: 'University degree + €43,992+ salary', color: ACCENT, months: '2–3' },
  { type: 'Skilled Worker Visa', code: '§18a', desc: 'Recognised vocational qualification', color: '#818CF8', months: '2–4' },
  { type: 'Recognition Visa', code: '§17b', desc: 'For completing recognition process in DE', color: '#C084FC', months: '1–2' },
  { type: 'Job Seeker Visa', code: '§20', desc: 'Look for work in Germany for 6 months', color: '#10B981', months: '1–2' },
];

const embassies = [
  { city: 'New Delhi', address: 'Chanakyapuri, New Delhi 110021', phone: '+91-11-4419-9199', slots: 'Limited' },
  { city: 'Mumbai', address: 'Hoechst House, Nariman Point', phone: '+91-22-2283-2422', slots: 'Available' },
  { city: 'Chennai', address: 'Ethiraj Salai, Egmore', phone: '+91-44-4241-6699', slots: 'Available' },
  { city: 'Kolkata', address: '1 Hastings Park Road', phone: '+91-33-2479-1141', slots: 'Limited' },
  { city: 'Bangalore', address: 'Prestige Palladium Bayan', phone: '+91-80-4168-0000', slots: 'Available' },
];

export function CandidateVisa() {
  const { data: visaCasesData } = useListVisaCases();
  const visaCase = visaCasesData && visaCasesData.length > 0 ? visaCasesData[0] : mockVisaCase;
  const updateItem = useUpdateVisaChecklistItem();

  const [checklist, setChecklist] = useState(initialChecklist);
  const [activeTab, setActiveTab] = useState<'checklist' | 'pathways' | 'embassies' | 'costs'>('checklist');

  const completedCount = checklist.filter(i => i.completed).length;
  const progressPercent = Math.round((completedCount / checklist.length) * 100);

  const handleToggle = (itemId: number, checked: boolean) => {
    setChecklist(prev => prev.map(i => i.id === itemId ? { ...i, completed: checked } : i));
    updateItem.mutate({ id: visaCase.id, itemId, data: { completed: checked } });
  };

  const statusMap: Record<string, { label: string; color: string }> = {
    checklist_in_progress: { label: 'Checklist In Progress', color: ACCENT },
    submitted: { label: 'Application Submitted', color: '#818CF8' },
    approved: { label: 'Visa Approved ✅', color: SUCCESS },
    rejected: { label: 'Visa Rejected', color: '#EF4444' },
    pending: { label: 'Pending Review', color: '#F59E0B' },
  };
  const statusCfg = statusMap[visaCase.status] || { label: visaCase.status, color: TEXT2 };

  const tabs = [
    { id: 'checklist', label: '📋 Document Checklist' },
    { id: 'pathways', label: '🛂 Visa Pathways' },
    { id: 'embassies', label: '🏛️ Consulates' },
    { id: 'costs', label: '💰 Costs & Timeline' },
  ] as const;

  return (
    <div className="space-y-6 min-h-screen" style={{ background: '#0F0520' }}>
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Visa Readiness Centre</h1>
        <p className="mt-1" style={{ color: TEXT2 }}>Complete your visa checklist, choose your pathway, and book your appointment.</p>
      </div>

      {/* Status Banner */}
      <div className="rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        style={{ background: 'linear-gradient(135deg,#130828,#1A0B3B)', border: `1px solid ${BORDER}` }}>
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl" style={{ background: 'rgba(168,85,247,0.15)' }}>
            <ShieldCheck className="w-6 h-6" style={{ color: ACCENT }} />
          </div>
          <div>
            <div className="text-sm font-medium mb-0.5" style={{ color: TEXT2 }}>Current Visa Status</div>
            <div className="text-xl font-bold text-white">{statusCfg.label}</div>
            <div className="text-sm mt-0.5" style={{ color: TEXT2 }}>Pathway: <span className="text-white font-medium">{visaCase.pathwayType || 'EU Blue Card'}</span></div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-3xl font-black" style={{ color: ACCENT }}>{progressPercent}%</div>
          <div className="text-sm" style={{ color: TEXT2 }}>Checklist complete</div>
          <div className="w-48 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div className="h-2 rounded-full transition-all" style={{ width: `${progressPercent}%`, background: progressPercent === 100 ? SUCCESS : ACCENT }} />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: activeTab === tab.id ? ACCENT : CARD2,
              color: activeTab === tab.id ? '#0F0520' : TEXT2,
              border: `1px solid ${activeTab === tab.id ? ACCENT : BORDER}`,
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── CHECKLIST TAB ── */}
      {activeTab === 'checklist' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {checklist.map(item => (
              <div key={item.id}
                className="flex items-start gap-4 p-4 rounded-xl border transition-all"
                style={{
                  background: item.completed ? 'rgba(0,200,83,0.05)' : CARD,
                  borderColor: item.completed ? 'rgba(0,200,83,0.2)' : BORDER,
                }}>
                <Checkbox
                  id={`item-${item.id}`}
                  checked={item.completed}
                  onCheckedChange={(checked) => handleToggle(item.id, !!checked)}
                  className="mt-0.5 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{item.icon}</span>
                    <label htmlFor={`item-${item.id}`}
                      className={`text-sm font-semibold cursor-pointer ${item.completed ? 'line-through' : ''}`}
                      style={{ color: item.completed ? TEXT2 : '#FFFFFF' }}>
                      {item.item}
                      {item.required && <span className="text-red-400 ml-1 no-underline">*</span>}
                    </label>
                    {item.completed && <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: SUCCESS }} />}
                  </div>
                  <p className="text-xs" style={{ color: TEXT2 }}>{item.description}</p>
                  {item.link && (
                    <a href={item.link} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs mt-1.5 hover:underline"
                      style={{ color: ACCENT }}>
                      <ExternalLink className="w-3 h-3" /> Apply / Download
                    </a>
                  )}
                </div>
              </div>
            ))}

            <div className="flex justify-end mt-4">
              <Button
                className="font-semibold"
                disabled={progressPercent < 100}
                style={{ background: progressPercent === 100 ? SUCCESS : '#27314F', color: progressPercent === 100 ? '#0F0520' : TEXT2 }}>
                {progressPercent === 100 ? '✅ Ready for Appointment' : `${checklist.length - completedCount} items remaining`}
              </Button>
            </div>
          </div>

          {/* Sidebar tips */}
          <div className="space-y-4">
            <div className="rounded-xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <h3 className="text-sm font-bold text-white mb-3">⏱️ Processing Timeline</h3>
              <div className="space-y-2 text-xs" style={{ color: TEXT2 }}>
                <div className="flex justify-between"><span>Document preparation</span><span className="text-white">2–4 weeks</span></div>
                <div className="flex justify-between"><span>Appointment wait time</span><span className="text-white">4–8 weeks</span></div>
                <div className="flex justify-between"><span>Visa decision</span><span className="text-white">4–8 weeks</span></div>
                <div className="flex justify-between font-semibold border-t pt-2" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                  <span style={{ color: ACCENT }}>Total estimate</span><span style={{ color: ACCENT }}>3–5 months</span>
                </div>
              </div>
            </div>
            <div className="rounded-xl p-4" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <h3 className="text-sm font-bold text-white mb-3">💡 Pro Tips</h3>
              <ul className="space-y-2 text-xs" style={{ color: TEXT2 }}>
                <li>• Book VFS appointment as early as possible — slots fill fast</li>
                <li>• Get all documents notarised and apostilled</li>
                <li>• Carry 2 sets of all document copies</li>
                <li>• Salary must meet minimum threshold for Blue Card</li>
                <li>• Show proof of accommodation in Germany</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ── PATHWAYS TAB ── */}
      {activeTab === 'pathways' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visaTypes.map((v, i) => (
            <div key={i} className="rounded-2xl p-5" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-xs font-mono mb-1" style={{ color: TEXT2 }}>{v.code}</div>
                  <h3 className="text-lg font-bold text-white">{v.type}</h3>
                </div>
                <div className="text-xs px-2 py-1 rounded-full" style={{ background: `${v.color}20`, color: v.color }}>
                  {v.months} months
                </div>
              </div>
              <p className="text-sm mb-4" style={{ color: TEXT2 }}>{v.desc}</p>
              <div className="h-1 rounded-full" style={{ background: `${v.color}30` }}>
                <div className="h-1 rounded-full w-3/4" style={{ background: v.color }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── EMBASSIES TAB ── */}
      {activeTab === 'embassies' && (
        <div className="space-y-3">
          {embassies.map((e, i) => (
            <div key={i} className="flex justify-between items-center p-4 rounded-xl" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: 'rgba(168,85,247,0.15)', color: ACCENT }}>
                  {e.city.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-white">{e.city}</div>
                  <div className="text-xs" style={{ color: TEXT2 }}>{e.address}</div>
                  <div className="text-xs mt-0.5" style={{ color: TEXT2 }}>{e.phone}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-xs px-2 py-1 rounded-full" style={{
                  background: e.slots === 'Available' ? 'rgba(0,200,83,0.15)' : 'rgba(168,85,247,0.15)',
                  color: e.slots === 'Available' ? SUCCESS : ACCENT
                }}>
                  {e.slots}
                </div>
                <a href="https://www.vfsglobal.com/germany/india" target="_blank" rel="noopener noreferrer">
                  <Button size="sm" className="text-xs" style={{ background: ACCENT, color: '#0F0520' }}>
                    Book Slot
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── COSTS TAB ── */}
      {activeTab === 'costs' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <h3 className="text-lg font-bold text-white mb-4">Visa Fees & Costs</h3>
            <div className="space-y-3">
              {[
                { label: 'National visa application fee', cost: '€75 (~₹6,800)', note: 'Paid at consulate' },
                { label: 'VFS service fee', cost: '~₹2,200', note: 'Per application' },
                { label: 'Document notarisation', cost: '₹2,000–₹8,000', note: 'Per document' },
                { label: 'Medical exam (if required)', cost: '₹3,000–₹6,000', note: 'Panel physician' },
                { label: 'Translation fees', cost: '₹500–₹2,000', note: 'Per document' },
                { label: 'Health insurance (3 months)', cost: '₹4,000–₹8,000', note: 'Incoming cover' },
                { label: 'ZAB recognition fee', cost: '€200 (~₹18,000)', note: 'One-time' },
              ].map((row, i) => (
                <div key={i} className="flex justify-between py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <div>
                    <div className="text-sm text-white">{row.label}</div>
                    <div className="text-xs" style={{ color: TEXT2 }}>{row.note}</div>
                  </div>
                  <div className="text-sm font-bold text-right" style={{ color: ACCENT }}>{row.cost}</div>
                </div>
              ))}
              <div className="flex justify-between pt-2 font-bold">
                <span className="text-white">Estimated Total</span>
                <span style={{ color: ACCENT }}>₹40,000–₹55,000</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl p-6" style={{ background: CARD, border: `1px solid ${BORDER}` }}>
            <h3 className="text-lg font-bold text-white mb-4">Timeline Breakdown</h3>
            <div className="space-y-4">
              {[
                { stage: 'Gather all documents', duration: '2–4 weeks', color: ACCENT },
                { stage: 'ZAB recognition process', duration: '8–12 weeks', color: '#818CF8' },
                { stage: 'VFS appointment wait', duration: '4–8 weeks', color: '#C084FC' },
                { stage: 'Visa processing by embassy', duration: '4–8 weeks', color: '#10B981' },
                { stage: 'Visa collection', duration: '1 week', color: SUCCESS },
              ].map((row, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-white">{row.stage}</span>
                    <span className="text-sm font-bold" style={{ color: row.color }}>{row.duration}</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div className="h-1.5 rounded-full" style={{ width: '60%', background: row.color }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-xl text-sm" style={{ background: 'rgba(168,85,247,0.1)', border: `1px solid rgba(168,85,247,0.2)` }}>
              <strong style={{ color: ACCENT }}>Total timeline:</strong>
              <span className="text-white ml-2">Approximately 4–6 months from document start to visa stamp</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
