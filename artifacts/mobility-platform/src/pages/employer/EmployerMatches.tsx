import React from 'react';
import { useGetVacancyMatches } from '@workspace/api-client-react';
import { useParams, Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, UserCircle, Briefcase, GraduationCap, MapPin, Award } from 'lucide-react';

const mockMatches = [
  { candidateId: 1, name: 'Aarav Patel', occupation: 'Software Engineer', germanLanguageLevel: 'B1', fitScore: 92, stage: 'employer_matching', readinessScore: 85, district: 'Ernakulam', experienceYears: 5 },
  { candidateId: 2, name: 'Priya Sharma', occupation: 'Software Engineer', germanLanguageLevel: 'B2', fitScore: 88, stage: 'employer_matching', readinessScore: 90, district: 'Bengaluru', experienceYears: 3 },
  { candidateId: 3, name: 'Rahul Kumar', occupation: 'Software Engineer', germanLanguageLevel: 'A2', fitScore: 75, stage: 'language_training', readinessScore: 65, district: 'Pune', experienceYears: 4 },
];

export function EmployerMatches() {
  const params = useParams();
  const vacancyId = parseInt(params.id || '101');
  
  // Note: we're ignoring errors in mock mode
  const { data: matchesData } = useGetVacancyMatches(vacancyId, { query: { enabled: !!vacancyId, queryKey: ['matches', vacancyId] } });
  const matches = matchesData || mockMatches;

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-4">
          <Link href="/employer/vacancies" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Vacancies
          </Link>
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Candidate Matches</h1>
        <p className="text-purple-300 mt-1">Smart-ranked Indian talent for your vacancy based on readiness and fit.</p>
      </div>

      <div className="grid gap-4">
        {matches.map((match, index) => (
          <Card key={match.candidateId} className="border-purple-900 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                
                {/* Match Score & Avatar */}
                <div className="flex flex-col items-center justify-center shrink-0 w-32 border-r border-purple-900/50 pr-6">
                  <div className="relative">
                    <svg className="transform -rotate-90 w-24 h-24">
                      <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
                      <circle 
                        cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent"
                        strokeDasharray={251.2} strokeDashoffset={251.2 - (match.fitScore / 100) * 251.2}
                        strokeLinecap="round"
                        className={match.fitScore >= 80 ? 'text-green-500' : match.fitScore >= 60 ? 'text-purple-400' : 'text-blue-500'}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-white">{match.fitScore}%</span>
                      <span className="text-[10px] text-purple-300 uppercase font-medium">Fit Score</span>
                    </div>
                  </div>
                </div>

                {/* Candidate Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        {match.name}
                        <Badge variant="outline" className="bg-purple-950/60 text-purple-300 font-normal">ID: {match.candidateId}</Badge>
                      </h3>
                      <p className="text-purple-300 font-medium mt-1">{match.occupation}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="bg-white">View Profile</Button>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white">Shortlist & Contact</Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6">
                    <div>
                      <div className="flex items-center gap-1.5 text-purple-300 text-sm mb-1"><MapPin className="w-4 h-4" /> Location</div>
                      <p className="font-medium text-white">{match.district || 'India'}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-purple-300 text-sm mb-1"><Briefcase className="w-4 h-4" /> Experience</div>
                      <p className="font-medium text-white">{match.experienceYears} Years</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-purple-300 text-sm mb-1"><GraduationCap className="w-4 h-4" /> German Level</div>
                      <p className="font-medium text-white">
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700">{match.germanLanguageLevel || 'None'}</Badge>
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-purple-300 text-sm mb-1"><Award className="w-4 h-4" /> Germany Ready</div>
                      <div className="flex items-center gap-2">
                        <Progress value={match.readinessScore} className="h-2 w-16" indicatorClassName="bg-green-500" />
                        <span className="font-medium text-white">{match.readinessScore}/100</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
