import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Sparkles, Download, Clock, IndianRupee, Euro, CheckCircle2, ChevronRight, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const MOCK_ROADMAP = {
  occupation: "Automotive Mechanic",
  durationMonths: 14,
  estimatedArrival: "September 2025",
  costINR: 125000,
  costEUR: 1400,
  phases: [
    { id: 1, title: "Language Foundation (A1-A2)", duration: "4 months", costINR: 35000, costEUR: 390, status: "completed", actionItems: ["Enroll in A1 class", "Pass A1 exam", "Enroll in A2 class"] },
    { id: 2, title: "Advanced Language (B1)", duration: "3 months", costINR: 25000, costEUR: 280, status: "active", actionItems: ["Complete B1 coursework", "Take B1 certification exam"] },
    { id: 3, title: "Qualification Recognition", duration: "2-4 months", costINR: 40000, costEUR: 450, status: "pending", actionItems: ["Translate documents", "Submit to IHK FOSA", "Receive partial/full recognition"] },
    { id: 4, title: "Employer Matching & Interviews", duration: "1-2 months", costINR: 0, costEUR: 0, status: "pending", actionItems: ["Build German-style resume", "Apply to matched vacancies", "Interview prep"] },
    { id: 5, title: "Visa Processing", duration: "1-2 months", costINR: 25000, costEUR: 280, status: "pending", actionItems: ["Gather contract & recognition", "Submit visa application", "Biometrics"] },
  ]
};

export function CandidateRoadmap() {
  const { user } = useAuth();
  const { toast } = useToast();
  const roadmap = MOCK_ROADMAP;

  const handleDownload = () => {
    toast({
      title: "PDF Generation",
      description: "PDF generation is available in the Pro plan.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy tracking-tight flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-gold" />
            AI Journey Roadmap
          </h1>
          <p className="text-purple-300 mt-1">Your personalized path to working in Germany as a {roadmap.occupation}</p>
        </div>
        <Button onClick={handleDownload} variant="outline" className="border-navy text-navy hover:bg-purple-900/30">
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-navy text-white border-none shadow-md">
          <CardContent className="p-6">
            <div className="text-slate-300 text-sm font-medium mb-1">Total Duration</div>
            <div className="text-3xl font-bold flex items-center gap-2">
              <Clock className="w-6 h-6 text-gold" />
              {roadmap.durationMonths} Months
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-purple-900 shadow-sm">
          <CardContent className="p-6">
            <div className="text-purple-300 text-sm font-medium mb-1">Estimated Arrival</div>
            <div className="text-2xl font-bold text-navy">{roadmap.estimatedArrival}</div>
          </CardContent>
        </Card>
        <Card className="bg-white border-purple-900 shadow-sm">
          <CardContent className="p-6">
            <div className="text-purple-300 text-sm font-medium mb-1">Total Cost (INR)</div>
            <div className="text-2xl font-bold text-navy flex items-center gap-1">
              <IndianRupee className="w-5 h-5 text-purple-400" />
              {roadmap.costINR.toLocaleString('en-IN')}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white border-purple-900 shadow-sm">
          <CardContent className="p-6">
            <div className="text-purple-300 text-sm font-medium mb-1">Total Cost (EUR)</div>
            <div className="text-2xl font-bold text-navy flex items-center gap-1">
              <Euro className="w-5 h-5 text-purple-400" />
              {roadmap.costEUR.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-navy">Phase Timeline</h2>
          <div className="space-y-4">
            {roadmap.phases.map((phase) => (
              <Card key={phase.id} className={`border-l-4 shadow-sm ${phase.status === 'completed' ? 'border-l-emerald-500 bg-emerald-50/30' : phase.status === 'active' ? 'border-l-gold bg-purple-900/20/30' : 'border-l-slate-300'}`}>
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${phase.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : phase.status === 'active' ? 'bg-gold text-navy' : 'bg-purple-900/30 text-purple-300'}`}>
                        {phase.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : phase.status === 'active' ? <Activity className="w-4 h-4" /> : phase.id}
                      </div>
                      <h3 className={`font-bold text-lg ${phase.status === 'pending' ? 'text-purple-300' : 'text-navy'}`}>
                        {phase.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-white">
                        <Clock className="w-3 h-3 mr-1" /> {phase.duration}
                      </Badge>
                      <Badge variant="outline" className="bg-white">
                        ₹{phase.costINR.toLocaleString('en-IN')}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="ml-11">
                    <ul className="space-y-2">
                      {phase.actionItems.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-purple-300">
                          <ChevronRight className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-bold text-navy">Financing Options</h2>
          <Card className="border border-purple-900 shadow-sm bg-white">
            <CardHeader className="pb-3 border-b border-purple-900/50">
              <CardTitle className="text-md">NSFDC Skill Loan</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-3">
              <p className="text-sm text-purple-300 mb-3">Concessional loan for eligible candidates covering training and certification costs.</p>
              <Button variant="outline" size="sm" className="w-full text-navy border-purple-900">Check Eligibility</Button>
            </CardContent>
          </Card>
          
          <Card className="border border-purple-900 shadow-sm bg-white">
            <CardHeader className="pb-3 border-b border-purple-900/50">
              <CardTitle className="text-md">NIESBUD Grant</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-3">
              <p className="text-sm text-purple-300 mb-3">Partial reimbursement for German language B1 certification upon passing.</p>
              <Button variant="outline" size="sm" className="w-full text-navy border-purple-900">Apply for Grant</Button>
            </CardContent>
          </Card>

          <Card className="border border-purple-900 shadow-sm bg-white">
            <CardHeader className="pb-3 border-b border-purple-900/50">
              <CardTitle className="text-md">Employer Advance</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-3">
              <p className="text-sm text-purple-300 mb-3">Many employers cover recognition and visa costs after making a job offer.</p>
              <div className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded inline-block">Available post-match</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
