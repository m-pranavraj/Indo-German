import React from 'react';
import { useListOffers } from '@workspace/api-client-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { FileSignature, CheckCircle2 } from 'lucide-react';

const mockOffers = [
  { id: 1, candidateId: 1, candidateName: 'Aarav Patel', vacancyTitle: 'Senior React Developer', salaryOffered: 75000, joiningDate: '2023-09-01', status: 'accepted', createdAt: '2023-06-20T10:00:00Z' },
  { id: 2, candidateId: 2, candidateName: 'Priya Sharma', vacancyTitle: 'Frontend Engineer', salaryOffered: 65000, joiningDate: '2023-10-01', status: 'issued', createdAt: '2023-06-25T10:00:00Z' },
];

export function EmployerOffers() {
  const { data: offersData } = useListOffers();
  const offers = offersData || mockOffers;

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'issued': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Pending Candidate</Badge>;
      case 'accepted': return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Accepted</Badge>;
      case 'rejected': return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Declined</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Employment Offers</h1>
          <p className="text-slate-500 mt-1">Track binding job offers sent to candidates.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">Create Offer</Button>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Joining Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {offers.map((offer) => (
                <TableRow key={offer.id}>
                  <TableCell className="font-medium text-slate-900">{offer.candidateName}</TableCell>
                  <TableCell className="text-sm text-slate-600">{offer.vacancyTitle}</TableCell>
                  <TableCell className="text-sm font-medium text-slate-900">€{offer.salaryOffered?.toLocaleString()}</TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {offer.joiningDate ? format(new Date(offer.joiningDate), 'MMM d, yyyy') : '-'}
                  </TableCell>
                  <TableCell>{getStatusBadge(offer.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-blue-600">
                      <FileSignature className="w-4 h-4 mr-1.5" /> View Contract
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {offers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                    No offers issued yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
