import React from 'react';
import { useListRecognitionCases } from '@workspace/api-client-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

const mockCases = [
  { id: 1, candidateId: 101, candidateName: 'Aarav Patel', indianQualification: 'B.Tech in Computer Science', germanProfession: 'Softwareentwickler', regulatedStatus: 'non_regulated', recognitionAuthority: 'ZAB', status: 'documents_pending', createdAt: '2023-04-01T10:00:00Z' },
  { id: 2, candidateId: 102, candidateName: 'Priya Sharma', indianQualification: 'BSc Nursing', germanProfession: 'Pflegefachkraft', regulatedStatus: 'regulated', recognitionAuthority: 'Landesamt für Gesundheit', status: 'authority_review', createdAt: '2023-03-15T10:00:00Z' },
  { id: 3, candidateId: 103, candidateName: 'Rahul Kumar', indianQualification: 'ITI Electrician', germanProfession: 'Elektroniker', regulatedStatus: 'non_regulated', recognitionAuthority: 'IHK FOSA', status: 'full_recognition', createdAt: '2023-02-10T10:00:00Z' },
];

export function FacilitatorRecognition() {
  const { data: casesData } = useListRecognitionCases();
  const cases = casesData || mockCases;

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'documents_pending': return <Badge variant="outline" className="bg-purple-900/20 text-purple-400 border-purple-600/40">Awaiting Docs</Badge>;
      case 'application_ready': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Ready to Submit</Badge>;
      case 'authority_review': return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Under Review</Badge>;
      case 'full_recognition': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Full Recognition</Badge>;
      case 'partial_recognition': return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Partial</Badge>;
      default: return <Badge variant="outline" className="capitalize">{status.replace(/_/g, ' ')}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Qualification Recognition</h1>
        <p className="text-purple-300 mt-1">Manage equivalence assessment procedures for candidates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-purple-900 shadow-sm bg-purple-900/20/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-200">Awaiting Documents</p>
              <p className="text-2xl font-bold text-purple-200">{cases.filter(c => c.status === 'documents_pending').length}</p>
            </div>
            <FileText className="w-8 h-8 text-amber-200" />
          </CardContent>
        </Card>
        <Card className="border-purple-900 shadow-sm bg-purple-50/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-800">Under Review</p>
              <p className="text-2xl font-bold text-purple-900">{cases.filter(c => c.status === 'authority_review' || c.status === 'submitted').length}</p>
            </div>
            <FileText className="w-8 h-8 text-purple-200" />
          </CardContent>
        </Card>
        <Card className="border-purple-900 shadow-sm bg-green-50/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">Recognized</p>
              <p className="text-2xl font-bold text-green-900">{cases.filter(c => c.status === 'full_recognition' || c.status === 'partial_recognition').length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-200" />
          </CardContent>
        </Card>
      </div>

      <Card className="border-purple-900 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-purple-950/60">
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Indian Qualification</TableHead>
                <TableHead>Target German Profession</TableHead>
                <TableHead>Authority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cases.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="font-medium text-white">{c.candidateName}</div>
                    <div className="text-xs text-purple-300">ID: {c.candidateId}</div>
                  </TableCell>
                  <TableCell className="text-sm text-purple-200">{c.indianQualification}</TableCell>
                  <TableCell>
                    <div className="text-sm font-medium text-white">{c.germanProfession}</div>
                    <div className="text-xs text-purple-300 capitalize">{c.regulatedStatus?.replace('_', ' ')}</div>
                  </TableCell>
                  <TableCell className="text-sm text-purple-300">{c.recognitionAuthority || '-'}</TableCell>
                  <TableCell>{getStatusBadge(c.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">Manage Case</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
