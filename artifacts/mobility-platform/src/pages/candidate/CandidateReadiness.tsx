import React from 'react';
import { useGetMyReadinessScore } from '@workspace/api-client-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const mockReadiness = {
  total: 45,
  label: 'Training Required',
  components: {
    profileCompleteness: 80, // out of 100, but contributes 10%
    identityDocuments: 100, // contributes 15%
    passportValidity: 0, // contributes 10%
    qualificationSuitability: 60, // contributes 15%
    recognitionStatus: 0, // contributes 15%
    germanLanguageLevel: 25, // contributes 20%
    workExperience: 80, // contributes 10%
    employerJobMatch: 0 // contributes 5%
  },
  nextActions: [
    'Complete A1 German Certification', 
    'Upload Passport Copy',
    'Submit transcripts for Recognition'
  ]
};

const weights = {
  profileCompleteness: 10,
  identityDocuments: 15,
  passportValidity: 10,
  qualificationSuitability: 15,
  recognitionStatus: 15,
  germanLanguageLevel: 20,
  workExperience: 10,
  employerJobMatch: 5
};

const componentLabels: Record<string, string> = {
  profileCompleteness: 'Profile Completeness',
  identityDocuments: 'Identity Documents',
  passportValidity: 'Passport Validity',
  qualificationSuitability: 'Qualification Suitability',
  recognitionStatus: 'Recognition Status',
  germanLanguageLevel: 'German Language Level',
  workExperience: 'Work Experience',
  employerJobMatch: 'Employer Job Match'
};

export function CandidateReadiness() {
  const { data: readinessData } = useGetMyReadinessScore();
  const readiness = readinessData || mockReadiness;

  const getProgressColor = (value: number) => {
    if (value >= 80) return 'bg-green-500';
    if (value >= 50) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Readiness Score</h1>
        <p className="text-slate-500 mt-1">Detailed breakdown of your Germany readiness assessment.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card className="border-slate-200 shadow-sm bg-slate-900 text-white">
            <CardContent className="pt-6 flex flex-col items-center justify-center text-center">
              <span className="text-sm text-slate-400 font-medium uppercase tracking-wider mb-2">Overall Score</span>
              <span className="text-6xl font-bold text-amber-500 mb-4">{readiness.total}</span>
              <Badge variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                {readiness.label}
              </Badge>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm bg-amber-50/50 border-amber-200">
            <CardHeader>
              <CardTitle className="text-lg text-amber-900">Next Actions Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {readiness.nextActions?.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-amber-900">{action}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <Card className="md:col-span-2 border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Score Breakdown</CardTitle>
            <CardDescription>How your overall score is calculated based on 8 key components.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(readiness.components).map(([key, value]) => {
              const numValue = value as number;
              const weight = weights[key as keyof typeof weights];
              const contributedPoints = (numValue / 100) * weight;
              
              return (
                <div key={key}>
                  <div className="flex justify-between text-sm font-medium mb-1.5">
                    <span className="text-slate-700">{componentLabels[key]} <span className="text-slate-400 font-normal ml-1">({weight}%)</span></span>
                    <span className="text-slate-900">{numValue}% <span className="text-slate-400 font-normal ml-1">+{contributedPoints.toFixed(1)} pts</span></span>
                  </div>
                  <Progress value={numValue} className="h-2 bg-slate-100" indicatorClassName={getProgressColor(numValue)} />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
