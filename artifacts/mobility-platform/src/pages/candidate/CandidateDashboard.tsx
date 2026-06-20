import React from 'react';
import { useGetMyCandidateProfile, useGetMyReadinessScore, useGetMyJourney, useListApplications, useListInterviews, useListDocuments, useListVisaCases } from '@workspace/api-client-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ChevronRight, Clock, FileText, AlertCircle, Briefcase, MapPin } from 'lucide-react';
import { Link } from 'wouter';

// Mock data for when API is loading/empty
const mockReadiness = {
  total: 45,
  label: 'Training Required',
  nextActions: ['Complete A1 German Certification', 'Upload Education Documents']
};

const mockJourney = {
  currentStage: 'language_training',
  stages: [
    { id: 'discovery', name: 'Discovery', status: 'completed' },
    { id: 'registration', name: 'Registration', status: 'completed' },
    { id: 'eligibility', name: 'Eligibility', status: 'completed' },
    { id: 'language_training', name: 'Language Training', status: 'active' },
    { id: 'qualification_recognition', name: 'Qualification Recognition', status: 'pending' },
    { id: 'document_vault', name: 'Document Vault', status: 'pending' },
    { id: 'employer_matching', name: 'Employer Matching', status: 'locked' },
    { id: 'interview_offer', name: 'Interview & Offer', status: 'locked' },
    { id: 'visa_readiness', name: 'Visa Readiness', status: 'locked' },
    { id: 'post_arrival', name: 'Post-Arrival', status: 'locked' },
  ]
};

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

  const renderGauge = (score: number) => {
    // A simple SVG circular gauge
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;
    
    let color = 'text-amber-500';
    if (score >= 80) color = 'text-green-500';
    else if (score < 30) color = 'text-red-500';

    return (
      <div className="relative flex flex-col items-center justify-center">
        <svg className="transform -rotate-90 w-40 h-40">
          <circle cx="80" cy="80" r={radius} stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
          <circle 
            cx="80" cy="80" r={radius} stroke="currentColor" strokeWidth="12" fill="transparent"
            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`${color} transition-all duration-1000 ease-out`}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-slate-800">{score}</span>
          <span className="text-xs text-slate-500 uppercase tracking-widest">Score</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Germany Journey</h1>
          <p className="text-slate-500 mt-1">Welcome back, {profile?.name || 'Candidate'}. Here's your current progress.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Readiness Score Card */}
        <Card className="md:col-span-1 border-slate-200 shadow-sm flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Germany Readiness</CardTitle>
            <CardDescription>Your overall profile score</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center py-6">
            {renderGauge(readiness.total)}
            <Badge variant="outline" className={`mt-6 px-3 py-1 text-sm ${readiness.total >= 80 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
              {readiness.label}
            </Badge>
          </CardContent>
        </Card>

        {/* Next Actions */}
        <Card className="md:col-span-2 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Next Actions Required</CardTitle>
            <CardDescription>Complete these tasks to increase your score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {readiness.nextActions && readiness.nextActions.length > 0 ? (
                readiness.nextActions.map((action, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 rounded-lg border border-amber-200 bg-amber-50/50">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-amber-900">{action}</p>
                    </div>
                    <Button size="sm" variant="outline" className="shrink-0 bg-white hover:bg-amber-100 hover:text-amber-900 border-amber-200">
                      Take Action
                    </Button>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-3 p-4 rounded-lg border border-green-200 bg-green-50">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <p className="text-sm font-medium text-green-800">You're all caught up on immediate tasks.</p>
                </div>
              )}
            </div>
            
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg border border-slate-100 bg-slate-50 flex flex-col items-center text-center">
                <Briefcase className="w-6 h-6 text-blue-500 mb-2" />
                <span className="text-2xl font-bold text-slate-800">{applications?.length || 0}</span>
                <span className="text-xs text-slate-500 font-medium">Active Apps</span>
              </div>
              <div className="p-4 rounded-lg border border-slate-100 bg-slate-50 flex flex-col items-center text-center">
                <Clock className="w-6 h-6 text-purple-500 mb-2" />
                <span className="text-2xl font-bold text-slate-800">{interviews?.length || 0}</span>
                <span className="text-xs text-slate-500 font-medium">Interviews</span>
              </div>
              <div className="p-4 rounded-lg border border-slate-100 bg-slate-50 flex flex-col items-center text-center">
                <FileText className="w-6 h-6 text-teal-500 mb-2" />
                <span className="text-2xl font-bold text-slate-800">{documents?.filter(d => d.verificationStatus === 'verified').length || 0}</span>
                <span className="text-xs text-slate-500 font-medium">Verified Docs</span>
              </div>
              <div className="p-4 rounded-lg border border-slate-100 bg-slate-50 flex flex-col items-center text-center">
                <MapPin className="w-6 h-6 text-red-500 mb-2" />
                <span className="text-2xl font-bold text-slate-800">{visaCases?.length ? 'Active' : 'None'}</span>
                <span className="text-xs text-slate-500 font-medium">Visa Status</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Journey Timeline */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-lg">Migration Pathway</CardTitle>
            <CardDescription>Your progression through the 9 stages</CardDescription>
          </div>
          <Link href="/candidate/journey" className="text-sm font-medium text-amber-600 hover:text-amber-700 flex items-center">
            View Details <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-5 left-4 right-4 h-0.5 bg-slate-200 z-0"></div>
            <div className="absolute top-5 left-4 h-0.5 bg-amber-500 z-0 transition-all duration-1000" style={{ width: `${(journey.stages.findIndex(s => s.status === 'active') / (journey.stages.length - 1)) * 100}%` }}></div>
            
            <div className="relative z-10 flex justify-between">
              {journey.stages.map((stage, idx) => {
                const isCompleted = stage.status === 'completed';
                const isActive = stage.status === 'active';
                const isLocked = stage.status === 'locked';
                
                return (
                  <div key={stage.id} className="flex flex-col items-center w-24">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-3 transition-colors ${
                      isCompleted ? 'bg-amber-500 border-amber-500 text-white' : 
                      isActive ? 'bg-white border-amber-500 text-amber-600 shadow-[0_0_0_4px_rgba(245,158,11,0.2)]' : 
                      'bg-slate-50 border-slate-200 text-slate-400'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <span className="text-sm font-bold">{idx + 1}</span>}
                    </div>
                    <span className={`text-[10px] text-center font-medium leading-tight ${isActive ? 'text-amber-700 font-bold' : isLocked ? 'text-slate-400' : 'text-slate-700'}`}>
                      {stage.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
