import React, { useState } from 'react';
import { useListDocuments, useUploadDocument } from '@workspace/api-client-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, UploadCloud, CheckCircle2, AlertCircle, Clock, XCircle, File } from 'lucide-react';
import { format } from 'date-fns';

const mockDocs = [
  { id: 1, type: 'passport', name: 'Passport Copy', verificationStatus: 'verified', expiryDate: '2030-05-15', uploadedAt: '2023-01-10T10:00:00Z' },
  { id: 2, type: 'education_certificate', name: 'B.Tech Degree', verificationStatus: 'under_review', uploadedAt: '2023-02-20T14:30:00Z' },
  { id: 3, type: 'language_certificate', name: 'A1 Goethe Zertifikat', verificationStatus: 'verified', uploadedAt: '2023-03-05T09:15:00Z' },
  { id: 4, type: 'resume', name: 'Europass CV', verificationStatus: 'pending', uploadedAt: '2023-04-12T11:45:00Z' },
];

const docTypes = [
  { value: 'passport', label: 'Passport' },
  { value: 'aadhaar', label: 'Aadhaar / National ID' },
  { value: 'education_certificate', label: 'Degree / Diploma Certificate' },
  { value: 'marksheet', label: 'Transcripts / Marksheets' },
  { value: 'experience_letter', label: 'Experience Letter' },
  { value: 'resume', label: 'Curriculum Vitae (CV)' },
  { value: 'language_certificate', label: 'German Language Certificate' },
  { value: 'police_clearance', label: 'Police Clearance Certificate' },
  { value: 'medical_certificate', label: 'Medical Fitness Certificate' }
];

export function CandidateDocuments() {
  const { data: documentsData, refetch } = useListDocuments();
  const uploadDoc = useUploadDocument();
  const [isOpen, setIsOpen] = useState(false);
  const [uploadType, setUploadType] = useState('');
  const [uploadName, setUploadName] = useState('');

  const documents = documentsData || mockDocs;

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadType || !uploadName) return;
    
    uploadDoc.mutate({
      data: { type: uploadType, name: uploadName, fileUrl: 'https://example.com/fake.pdf' }
    }, {
      onSuccess: () => {
        setIsOpen(false);
        setUploadType('');
        setUploadName('');
        refetch();
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'verified': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle2 className="w-3 h-3 mr-1" /> Verified</Badge>;
      case 'under_review': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><Clock className="w-3 h-3 mr-1" /> Reviewing</Badge>;
      case 'pending': return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200"><AlertCircle className="w-3 h-3 mr-1" /> Pending Check</Badge>;
      case 'rejected': return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
      default: return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getIcon = (type: string) => {
    return <FileText className="w-8 h-8 text-slate-400" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Document Vault</h1>
          <p className="text-slate-500 mt-1">Securely store and verify your migration documents.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-amber-500 hover:bg-amber-600 text-slate-900">
              <UploadCloud className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Document</DialogTitle>
              <DialogDescription>Add a new document to your vault for verification.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpload} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="type">Document Type</Label>
                <Select value={uploadType} onValueChange={setUploadType} required>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    {docTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Document Name</Label>
                <Input id="name" value={uploadName} onChange={e => setUploadName(e.target.value)} placeholder="e.g. B.Tech Degree Certificate" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">File (PDF, JPG, PNG)</Label>
                <Input id="file" type="file" className="cursor-pointer" />
              </div>
              <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white mt-4" disabled={uploadDoc.isPending}>
                {uploadDoc.isPending ? 'Uploading...' : 'Upload to Vault'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {documents.map(doc => (
          <Card key={doc.id} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  {getIcon(doc.type)}
                </div>
                {getStatusBadge(doc.verificationStatus)}
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 truncate" title={doc.name}>{doc.name}</h3>
                <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">{docTypes.find(t => t.value === doc.type)?.label || doc.type}</p>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                <span>{format(new Date(doc.uploadedAt), 'MMM d, yyyy')}</span>
                {doc.expiryDate && (
                  <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded">Exp: {format(new Date(doc.expiryDate), 'MMM yyyy')}</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Placeholder for missing highly required doc */}
        <Card className="border-dashed border-2 border-slate-200 bg-slate-50 flex flex-col items-center justify-center p-6 text-center min-h-[200px]">
          <File className="w-10 h-10 text-slate-300 mb-3" />
          <h3 className="font-medium text-slate-600 mb-1">Police Clearance</h3>
          <p className="text-xs text-slate-400 mb-4">Required for visa readiness</p>
          <Button variant="outline" size="sm" className="bg-white" onClick={() => { setUploadType('police_clearance'); setIsOpen(true); }}>
            Upload Now
          </Button>
        </Card>
      </div>
    </div>
  );
}
