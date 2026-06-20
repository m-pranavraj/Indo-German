import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { MapPin, Briefcase, GraduationCap, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useGetCandidate } from '@workspace/api-client-react';

interface CandidateProfileCardProps {
  candidateId: number;
  open: boolean;
  onClose: () => void;
  contextRole?: string;
  vacancyId?: number;
}

// Demo data fallback
const demoCandidates: Record<number, any> = {
  1: {
    id: 1,
    name: 'Arjun Sharma',
    occupation: 'Automotive Mechanic',
    district: 'Pune',
    state: 'Maharashtra',
    languageLevel: 'B1',
    education: 'ITI Diploma',
    experienceYears: 4,
    readinessScore: 78,
    stage: 'employer_matching',
    passportStatus: 'Valid',
    recognitionStatus: 'in_progress',
    visaStatus: 'not_started',
    activeApplications: 2,
    certifications: [
      { name: 'Goethe-Zertifikat B1', type: 'language', status: 'obtained' },
      { name: 'ITI Auto Mechanic', type: 'trade', status: 'obtained' }
    ],
    fitScore: 85
  },
  2: {
    id: 2,
    name: 'Priya Nair',
    occupation: 'Registered Nurse',
    district: 'Kochi',
    state: 'Kerala',
    languageLevel: 'B2',
    education: 'BSc Nursing',
    experienceYears: 3,
    readinessScore: 91,
    stage: 'visa_readiness',
    passportStatus: 'Valid',
    recognitionStatus: 'completed',
    visaStatus: 'in_progress',
    activeApplications: 1,
    certifications: [
      { name: 'Goethe-Zertifikat B2', type: 'language', status: 'obtained' },
      { name: 'Nursing License', type: 'trade', status: 'obtained' }
    ],
    fitScore: 92
  },
  3: {
    id: 3,
    name: 'Ravi Kumar',
    occupation: 'Electrician',
    district: 'Hyderabad',
    state: 'Telangana',
    languageLevel: 'A2',
    education: 'ITI Certificate',
    experienceYears: 5,
    readinessScore: 52,
    stage: 'language_training',
    passportStatus: 'Pending',
    recognitionStatus: 'not_started',
    visaStatus: 'not_started',
    activeApplications: 0,
    certifications: [
      { name: 'Goethe-Zertifikat A1', type: 'language', status: 'obtained' }
    ],
    fitScore: 45
  }
};

export function CandidateProfileCard({ candidateId, open, onClose, contextRole, vacancyId }: CandidateProfileCardProps) {
  const { data: apiCandidate, isLoading } = useGetCandidate(candidateId, { query: { enabled: open && !!candidateId, queryKey: ['candidate', candidateId] } });
  
  const candidate = apiCandidate || demoCandidates[candidateId] || demoCandidates[1];

  if (!candidate) return null;

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto bg-slate-50 p-0 border-l border-slate-200">
        <div className="bg-navy p-6 text-white">
          <div className="flex items-start justify-between">
            <div className="flex gap-4 items-center">
              <Avatar className="h-16 w-16 border-2 border-white/20">
                <AvatarFallback className="bg-navy-mid text-white text-xl">
                  {candidate.name?.charAt(0) || 'C'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-bold">{candidate.name}</h2>
                <p className="text-slate-300 font-medium">{candidate.occupation || 'Skilled Worker'}</p>
                <div className="flex items-center gap-1 text-sm text-slate-400 mt-1">
                  <MapPin className="w-3 h-3" />
                  <span>{candidate.district}, {candidate.state}</span>
                </div>
              </div>
            </div>
            {contextRole === 'employer' && candidate.fitScore && (
              <div className="bg-white/10 rounded-lg p-2 text-center border border-white/20">
                <div className={`text-xl font-bold ${candidate.fitScore >= 80 ? 'text-emerald-400' : candidate.fitScore >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
                  {candidate.fitScore}%
                </div>
                <div className="text-[10px] uppercase tracking-wider text-slate-300">Fit Score</div>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
            <div>
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">Readiness Score</div>
              <div className="text-3xl font-bold text-navy mt-1">{candidate.readinessScore || 0}/100</div>
            </div>
            <div className="w-16 h-16 relative flex items-center justify-center">
              <svg className="transform -rotate-90 w-16 h-16">
                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-100" />
                <circle 
                  cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent"
                  strokeDasharray={2 * Math.PI * 28} 
                  strokeDashoffset={(2 * Math.PI * 28) - ((candidate.readinessScore || 0) / 100) * (2 * Math.PI * 28)}
                  strokeLinecap="round"
                  className={candidate.readinessScore >= 80 ? 'text-emerald-500' : candidate.readinessScore >= 60 ? 'text-amber-500' : 'text-red-500'}
                />
              </svg>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-navy uppercase tracking-wider">Key Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-slate-400" />
                <div>
                  <div className="text-xs text-slate-500">Experience</div>
                  <div className="font-medium text-sm">{candidate.experienceYears || 0} Years</div>
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="w-5 h-5 flex items-center justify-center bg-amber-100 text-amber-700 font-bold text-xs rounded">
                  {candidate.languageLevel || 'A1'}
                </div>
                <div>
                  <div className="text-xs text-slate-500">German</div>
                  <div className="font-medium text-sm">Level {candidate.languageLevel || 'A1'}</div>
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
                <GraduationCap className="w-5 h-5 text-slate-400" />
                <div>
                  <div className="text-xs text-slate-500">Education</div>
                  <div className="font-medium text-sm truncate">{candidate.education || 'Diploma'}</div>
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-center gap-3">
                <FileText className="w-5 h-5 text-slate-400" />
                <div>
                  <div className="text-xs text-slate-500">Passport</div>
                  <div className="font-medium text-sm">{candidate.passportStatus || 'Unknown'}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-navy uppercase tracking-wider">Certifications</h3>
            <div className="space-y-2">
              {candidate.certifications?.map((cert: any, i: number) => (
                <div key={i} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {cert.status === 'obtained' ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Clock className="w-4 h-4 text-amber-500" />}
                    <span className="text-sm font-medium">{cert.name}</span>
                  </div>
                  <Badge variant="outline" className="text-[10px]">{cert.type}</Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-col gap-2">
            {contextRole === 'employer' && (
              <>
                <Button className="w-full bg-navy hover:bg-navy-dark">Shortlist Candidate</Button>
                <Button variant="outline" className="w-full border-navy text-navy">Schedule Interview</Button>
              </>
            )}
            {contextRole === 'facilitator' && (
              <>
                <Button className="w-full bg-navy hover:bg-navy-dark">Update Stage</Button>
                <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50">Raise Welfare Alert</Button>
              </>
            )}
            {contextRole === 'admin' && (
              <Button className="w-full bg-navy hover:bg-navy-dark">View Full File</Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
