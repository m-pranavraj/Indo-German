import React from 'react';
import { useListRecognitionCases } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, Clock, ChevronRight, FileText } from 'lucide-react';

const mockCases = [
  {
    id: 1,
    candidateId: 1,
    indianQualification: 'B.Tech in Computer Science',
    germanProfession: 'Softwareentwickler',
    regulatedStatus: 'non_regulated',
    recognitionAuthority: 'ZAB (Zentralstelle für ausländisches Bildungswesen)',
    status: 'documents_pending',
    documentsRequired: ['Degree Certificate', 'Transcripts (All semesters)', 'Passport Copy'],
    createdAt: '2023-04-01T10:00:00Z'
  }
];

const statusFlow = [
  { id: 'not_required', name: 'Not Required' },
  { id: 'eligibility_check_pending', name: 'Eligibility Check' },
  { id: 'documents_pending', name: 'Documents Pending' },
  { id: 'application_ready', name: 'Application Ready' },
  { id: 'submitted', name: 'Submitted' },
  { id: 'authority_review', name: 'Under Review' },
  { id: 'partial_recognition', name: 'Partial Recognition' },
  { id: 'full_recognition', name: 'Full Recognition' },
  { id: 'rejected', name: 'Rejected' },
  { id: 'bridge_course_required', name: 'Bridge Course' }
];

export function CandidateRecognition() {
  const { data: casesData } = useListRecognitionCases();
  const cases = casesData || mockCases;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Qualification Recognition</h1>
        <p className="text-slate-500 mt-1">Track the equivalence assessment of your Indian qualifications in Germany.</p>
      </div>

      {cases.map(recognitionCase => {
        const currentStatusIndex = statusFlow.findIndex(s => s.id === recognitionCase.status);
        
        return (
          <Card key={recognitionCase.id} className="border-slate-200 shadow-sm">
            <CardHeader className="border-b border-slate-100 bg-slate-50">
              <div className="flex justify-between items-start">
                <div>
                  <CardDescription className="uppercase tracking-wider font-medium text-amber-600 mb-1">Recognition Case #{recognitionCase.id}</CardDescription>
                  <CardTitle className="text-xl">{recognitionCase.indianQualification}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm text-slate-500">Target Profession:</span>
                    <Badge variant="outline" className="bg-white">{recognitionCase.germanProfession}</Badge>
                    <Badge variant="secondary" className="capitalize">{recognitionCase.regulatedStatus?.replace('_', ' ')}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 mb-1">Authority</p>
                  <p className="text-sm font-medium text-slate-700">{recognitionCase.recognitionAuthority || 'Pending Assignment'}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-8 overflow-x-auto pb-4">
                <div className="flex items-center min-w-max">
                  {statusFlow.map((status, idx) => {
                    const isCompleted = idx < currentStatusIndex;
                    const isActive = idx === currentStatusIndex;
                    
                    if (status.id === 'rejected' && recognitionCase.status !== 'rejected') return null;
                    if (status.id === 'bridge_course_required' && recognitionCase.status !== 'bridge_course_required') return null;
                    if (status.id === 'not_required' && recognitionCase.status !== 'not_required') return null;

                    return (
                      <React.Fragment key={status.id}>
                        <div className="flex flex-col items-center w-32 relative">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 bg-white ${
                            isCompleted ? 'border-amber-500 text-amber-500' :
                            isActive ? 'border-amber-600 bg-amber-50 text-amber-600 ring-4 ring-amber-100' :
                            'border-slate-200 text-slate-300'
                          }`}>
                            {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : 
                             isActive ? <Clock className="w-4 h-4" /> : 
                             <Circle className="w-4 h-4" />}
                          </div>
                          <span className={`text-[10px] mt-2 font-medium text-center ${isActive ? 'text-amber-700' : 'text-slate-500'}`}>
                            {status.name}
                          </span>
                        </div>
                        {idx < statusFlow.length - 1 && (statusFlow[idx+1].id !== 'rejected' && statusFlow[idx+1].id !== 'bridge_course_required') && (
                          <div className={`h-0.5 w-12 -ml-4 -mr-4 z-0 ${isCompleted ? 'bg-amber-500' : 'bg-slate-200'} mt-[-20px]`} />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {recognitionCase.documentsRequired && recognitionCase.documentsRequired.length > 0 && (
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                  <h4 className="font-semibold text-amber-900 flex items-center gap-2 mb-3">
                    <FileText className="w-4 h-4" /> Documents Required for Next Step
                  </h4>
                  <ul className="space-y-2">
                    {recognitionCase.documentsRequired.map((doc, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-amber-800">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">Go to Document Vault</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
