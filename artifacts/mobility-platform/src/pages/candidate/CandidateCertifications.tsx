import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GraduationCap, Wrench, Calendar, Upload, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const MOCK_CERTIFICATIONS = [
  {
    id: 1,
    name: "Goethe-Zertifikat B1",
    type: "Language",
    icon: GraduationCap,
    issuer: "Goethe-Institut Pune",
    level: "B1",
    issueDate: "2023-08-15",
    expiryDate: null,
    status: "obtained",
    documentUrl: "/docs/cert-b1.pdf"
  },
  {
    id: 2,
    name: "ITI Automotive Mechanic",
    type: "Education",
    icon: Wrench,
    issuer: "Govt. ITI Aundh",
    level: "Diploma",
    issueDate: "2019-06-30",
    expiryDate: null,
    equivalent: "Kfz-Mechatroniker (Teilanerkennung)",
    status: "obtained",
    documentUrl: "/docs/iti-diploma.pdf"
  },
  {
    id: 3,
    name: "High Voltage Systems Level 2",
    type: "Professional",
    icon: FileText,
    issuer: "TATA Motors Training",
    level: "Pro",
    issueDate: "2021-11-10",
    expiryDate: "2024-11-10", // Expires soon!
    status: "obtained",
    documentUrl: "/docs/hv-sys.pdf"
  },
  {
    id: 4,
    name: "Goethe-Zertifikat B2",
    type: "Language",
    icon: GraduationCap,
    issuer: "Goethe-Institut Pune",
    level: "B2",
    issueDate: null,
    expiryDate: null,
    status: "pending",
    documentUrl: null
  }
];

export function CandidateCertifications() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-navy tracking-tight">Certifications & Qualifications</h1>
          <p className="text-purple-300 mt-1">Manage your language, education, and professional certificates</p>
        </div>
        <Button className="bg-gold hover:bg-purple-600 text-navy font-medium">
          <Upload className="w-4 h-4 mr-2" />
          Add Certification
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_CERTIFICATIONS.map((cert) => {
          const Icon = cert.icon;
          const isPending = cert.status === 'pending';
          const isExpiringSoon = cert.expiryDate && new Date(cert.expiryDate) < new Date(Date.now() + 180 * 24 * 60 * 60 * 1000);

          return (
            <Card key={cert.id} className={`border-purple-900 shadow-sm flex flex-col ${isPending ? 'bg-purple-950/60' : 'bg-white'}`}>
              <CardContent className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl ${isPending ? 'bg-slate-200 text-purple-300' : 'bg-navy/5 text-navy'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {isPending ? (
                    <Badge variant="outline" className="bg-purple-900/30 text-purple-300 border-purple-800">
                      <Clock className="w-3 h-3 mr-1" /> Pending
                    </Badge>
                  ) : isExpiringSoon ? (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      <AlertCircle className="w-3 h-3 mr-1" /> Expiring Soon
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
                    </Badge>
                  )}
                </div>

                <div className="flex-1">
                  <div className="text-xs font-semibold text-gold uppercase tracking-wider mb-1">{cert.type} • {cert.level}</div>
                  <h3 className="text-lg font-bold text-navy mb-1 leading-tight">{cert.name}</h3>
                  <p className="text-sm text-purple-300">{cert.issuer}</p>
                  
                  {cert.equivalent && (
                    <div className="mt-3 p-2 bg-purple-900/30 rounded text-xs text-purple-200 border border-purple-900">
                      <span className="font-semibold block text-purple-300 mb-0.5">German Equivalent:</span>
                      {cert.equivalent}
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-purple-900/50 space-y-3">
                  {!isPending && (
                    <div className="flex justify-between text-xs text-purple-300">
                      <div className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Issued: {cert.issueDate ? format(new Date(cert.issueDate), 'MMM yyyy') : '-'}</div>
                      {cert.expiryDate && (
                        <div className={`flex items-center gap-1 ${isExpiringSoon ? 'text-red-600 font-medium' : ''}`}>
                          Exp: {format(new Date(cert.expiryDate), 'MMM yyyy')}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    {isPending ? (
                      <Button variant="outline" className="w-full border-dashed border-2 border-purple-800 text-purple-300">
                        <Upload className="w-4 h-4 mr-2" /> Upload Doc
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full text-navy border-purple-900 hover:bg-purple-950/60">
                        <FileText className="w-4 h-4 mr-2" /> View Document
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
