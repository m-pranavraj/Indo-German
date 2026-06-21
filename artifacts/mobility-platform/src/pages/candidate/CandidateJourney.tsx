import React from 'react';
import { useGetMyJourney } from '@workspace/api-client-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, Clock, Lock } from 'lucide-react';

const mockJourney = {
  candidateId: 1,
  currentStage: 'language_training',
  stages: [
    { id: 'discovery', name: 'Discovery & Profile Creation', status: 'completed', order: 1, details: 'Initial profile created and assessed.', completedAt: '2023-01-15T10:00:00Z' },
    { id: 'registration', name: 'Platform Registration', status: 'completed', order: 2, details: 'Verified email and identity.', completedAt: '2023-01-16T14:30:00Z' },
    { id: 'eligibility', name: 'Eligibility Assessment', status: 'completed', order: 3, details: 'Passed initial background and occupation check.', completedAt: '2023-01-20T09:15:00Z' },
    { id: 'language_training', name: 'Language Training', status: 'active', order: 4, details: 'Currently enrolled in B1 German course.' },
    { id: 'qualification_recognition', name: 'Qualification Recognition', status: 'pending', order: 5, details: 'Awaiting submission of educational documents.' },
    { id: 'document_vault', name: 'Document Vault Completion', status: 'pending', order: 6, details: 'Upload remaining required documents.' },
    { id: 'employer_matching', name: 'Employer Matching', status: 'locked', order: 7 },
    { id: 'interview_offer', name: 'Interview & Offer', status: 'locked', order: 8 },
    { id: 'visa_readiness', name: 'Visa Readiness', status: 'locked', order: 9 },
    { id: 'post_arrival', name: 'Post-Arrival Support', status: 'locked', order: 10 },
  ]
};

export function CandidateJourney() {
  const { data: journeyData, isLoading } = useGetMyJourney();
  const journey = journeyData || mockJourney;

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'completed': return <CheckCircle2 className="w-6 h-6 text-green-500" />;
      case 'active': return <Circle className="w-6 h-6 text-purple-400 fill-amber-100" />;
      case 'pending': return <Clock className="w-6 h-6 text-purple-400" />;
      case 'locked': return <Lock className="w-6 h-6 text-slate-300" />;
      default: return <Circle className="w-6 h-6 text-slate-300" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'completed': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'active': return <Badge variant="outline" className="bg-purple-900/20 text-purple-400 border-purple-600/40">In Progress</Badge>;
      case 'pending': return <Badge variant="outline" className="bg-purple-900/30 text-purple-300 border-purple-900">Pending</Badge>;
      case 'locked': return <Badge variant="outline" className="bg-purple-950/60 text-purple-400 border-purple-900">Locked</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Detailed Journey</h1>
        <p className="text-purple-300 mt-1">Track your progress through the migration corridor pathway.</p>
      </div>

      <div className="space-y-4">
        {journey.stages.map((stage, index) => {
          const isLast = index === journey.stages.length - 1;
          const isActive = stage.status === 'active';
          
          return (
            <div key={stage.id} className="flex relative">
              {/* Vertical line connecting nodes */}
              {!isLast && (
                <div className={`absolute left-[1.3rem] top-10 bottom-[-1rem] w-0.5 ${stage.status === 'completed' ? 'bg-green-400' : 'bg-slate-200'}`}></div>
              )}
              
              <div className="mr-6 relative z-10 mt-1">
                <div className="bg-white rounded-full">
                  {getStatusIcon(stage.status)}
                </div>
              </div>
              
              <Card className={`flex-1 mb-4 border-purple-900 shadow-sm transition-all ${isActive ? 'ring-2 ring-amber-400 border-purple-600/40' : ''}`}>
                <CardHeader className="py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg text-white">{stage.order}. {stage.name}</CardTitle>
                      {stage.completedAt && (
                        <CardDescription className="text-xs mt-1">Completed on {new Date(stage.completedAt).toLocaleDateString()}</CardDescription>
                      )}
                    </div>
                    {getStatusBadge(stage.status)}
                  </div>
                </CardHeader>
                {stage.details && (
                  <CardContent className="py-0 pb-4 text-sm text-purple-300">
                    {stage.details}
                  </CardContent>
                )}
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
