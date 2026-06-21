import React, { useState } from 'react';
import { useListCandidates } from '@workspace/api-client-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Briefcase, ChevronRight, Search, Filter } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const mockCandidates = [
  { id: 1, userId: 101, name: 'Aarav Patel', occupation: 'Software Engineer', stage: 'visa_readiness', readinessScore: 92, district: 'Ernakulam', experienceYears: 5, germanLanguageLevel: 'B1', createdAt: '2023-01-10T10:00:00Z' },
  { id: 2, userId: 102, name: 'Priya Sharma', occupation: 'Registered Nurse', stage: 'language_training', readinessScore: 45, district: 'Thiruvananthapuram', experienceYears: 3, germanLanguageLevel: 'A1', createdAt: '2023-02-15T10:00:00Z' },
  { id: 3, userId: 103, name: 'Rahul Kumar', occupation: 'Electrician', stage: 'qualification_recognition', readinessScore: 68, district: 'Thrissur', experienceYears: 8, germanLanguageLevel: 'A2', createdAt: '2023-03-20T10:00:00Z' },
];

export function FacilitatorCandidates() {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: candidatesData } = useListCandidates();
  
  const candidates = candidatesData || mockCandidates;
  
  const filteredCandidates = candidates.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.occupation || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Candidate Pipeline</h1>
        <p className="text-purple-300 mt-1">Manage and assist Indian candidates through the mobility corridor.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400" />
          <Input 
            placeholder="Search by name or occupation..." 
            className="pl-9 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="bg-white">
          <Filter className="w-4 h-4 mr-2" /> Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCandidates.map(candidate => (
          <Card key={candidate.id} className="border-purple-900 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">{candidate.name}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-purple-300 mt-1">
                    <Briefcase className="w-4 h-4 text-purple-400" /> {candidate.occupation || 'Not specified'}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1.5 bg-purple-950/60 px-2 py-1 rounded-md border border-purple-900/50">
                    <MapPin className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-xs font-medium text-purple-300">{candidate.district || 'India'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-purple-900/50">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-purple-300 uppercase tracking-wider font-medium">Stage</span>
                    <span className="text-purple-700 font-medium capitalize">{candidate.stage.replace(/_/g, ' ')}</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-purple-300 uppercase tracking-wider font-medium">Readiness</span>
                    <span className="text-white font-bold">{candidate.readinessScore}/100</span>
                  </div>
                  <Progress value={candidate.readinessScore} className="h-1.5 bg-purple-900/30" indicatorClassName={candidate.readinessScore >= 80 ? 'bg-green-500' : candidate.readinessScore >= 50 ? 'bg-purple-500' : 'bg-red-500'} />
                </div>
                
                <div className="flex items-center gap-2 pt-2">
                  <Badge variant="secondary" className="bg-purple-900/30 text-purple-300 hover:bg-slate-200 border-none text-xs">
                    German: {candidate.germanLanguageLevel || 'None'}
                  </Badge>
                  <Badge variant="secondary" className="bg-purple-900/30 text-purple-300 hover:bg-slate-200 border-none text-xs">
                    Exp: {candidate.experienceYears}y
                  </Badge>
                </div>
              </div>

              <div className="mt-6">
                <Button className="w-full bg-purple-950/60 hover:bg-purple-900/30 text-purple-200 border border-purple-900" variant="outline">
                  View Profile & Pathway <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
