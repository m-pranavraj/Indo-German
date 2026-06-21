import React from 'react';
import { useListDocuments, useVerifyDocument } from '@workspace/api-client-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Download, Check, X } from 'lucide-react';
import { format } from 'date-fns';

const mockDocs = [
  { id: 1, candidateId: 101, type: 'passport', name: 'Passport Copy.pdf', verificationStatus: 'pending', uploadedAt: '2023-06-15T10:00:00Z' },
  { id: 2, candidateId: 102, type: 'education_certificate', name: 'Degree.pdf', verificationStatus: 'under_review', uploadedAt: '2023-06-14T10:00:00Z' },
  { id: 3, candidateId: 101, type: 'language_certificate', name: 'B1_Zertifikat.pdf', verificationStatus: 'verified', uploadedAt: '2023-06-10T10:00:00Z' },
];

export function AdminDocuments() {
  const { data: documentsData, refetch } = useListDocuments();
  const verifyDoc = useVerifyDocument();
  
  // Show pending first
  const documents = (documentsData || mockDocs).sort((a, b) => {
    if (a.verificationStatus === 'pending' || a.verificationStatus === 'under_review') return -1;
    return 1;
  });

  const handleVerify = (id: number, status: 'verified' | 'rejected') => {
    verifyDoc.mutate({
      id,
      data: { status, reviewerNotes: status === 'verified' ? 'Looks good' : 'Invalid document' }
    }, {
      onSuccess: () => refetch()
    });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'verified': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Verified</Badge>;
      case 'under_review': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Under Review</Badge>;
      case 'pending': return <Badge variant="outline" className="bg-purple-900/20 text-purple-400 border-purple-600/40">Pending</Badge>;
      case 'rejected': return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Document Verification</h1>
        <p className="text-purple-300 mt-1">Review and authenticate candidate uploads.</p>
      </div>

      <Card className="border-purple-900 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-purple-950/60">
              <TableRow>
                <TableHead>Candidate ID</TableHead>
                <TableHead>Document Type</TableHead>
                <TableHead>File Name</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc) => (
                <TableRow key={doc.id} className={doc.verificationStatus === 'pending' ? 'bg-purple-900/20/10' : ''}>
                  <TableCell className="font-mono text-xs text-purple-300">{doc.candidateId}</TableCell>
                  <TableCell>
                    <span className="text-sm font-medium text-white capitalize">{doc.type.replace(/_/g, ' ')}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-blue-600 cursor-pointer hover:underline">
                      <FileText className="w-4 h-4" /> {doc.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-purple-300">
                    {format(new Date(doc.uploadedAt), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>{getStatusBadge(doc.verificationStatus)}</TableCell>
                  <TableCell className="text-right">
                    {(doc.verificationStatus === 'pending' || doc.verificationStatus === 'under_review') ? (
                      <div className="flex justify-end items-center gap-2">
                        <Button size="icon" variant="outline" className="h-8 w-8 text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleVerify(doc.id, 'verified')} disabled={verifyDoc.isPending}>
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button size="icon" variant="outline" className="h-8 w-8 text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleVerify(doc.id, 'rejected')} disabled={verifyDoc.isPending}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button variant="ghost" size="sm" className="text-purple-400">
                        <Download className="w-4 h-4 mr-1.5" /> DL
                      </Button>
                    )}
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
