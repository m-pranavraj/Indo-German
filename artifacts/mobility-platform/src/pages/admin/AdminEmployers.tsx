import React from 'react';
import { useListEmployers } from '@workspace/api-client-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building2, MapPin } from 'lucide-react';
import { format } from 'date-fns';

const mockEmployers = [
  { id: 1, userId: 201, companyName: 'TechCorp GmbH', country: 'Germany', city: 'Berlin', industry: 'Technology', contactName: 'Hans Müller', verificationStatus: 'verified', createdAt: '2023-01-05T10:00:00Z' },
  { id: 2, userId: 202, companyName: 'München Hospital', country: 'Germany', city: 'Munich', industry: 'Healthcare', contactName: 'Julia Bauer', verificationStatus: 'pending', createdAt: '2023-06-01T10:00:00Z' },
];

export function AdminEmployers() {
  const { data: employersData } = useListEmployers();
  const employers = employersData || mockEmployers;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">System Employers</h1>
        <p className="text-purple-300 mt-1">Manage and verify German employer accounts.</p>
      </div>

      <Card className="border-purple-900 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-purple-950/60">
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Location & Industry</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employers.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>
                    <div className="font-medium text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-purple-400" />
                      {emp.companyName}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-purple-200 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-purple-400" />
                      {emp.city || 'Germany'}
                    </div>
                    <div className="text-xs text-purple-300 mt-0.5">{emp.industry}</div>
                  </TableCell>
                  <TableCell className="text-sm text-purple-300">{emp.contactName}</TableCell>
                  <TableCell className="text-sm text-purple-300">
                    {format(new Date(emp.createdAt), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    {emp.verificationStatus === 'verified' ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Verified</Badge>
                    ) : (
                      <Badge variant="outline" className="bg-purple-900/20 text-purple-400 border-purple-600/40">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {emp.verificationStatus === 'pending' && (
                      <Button size="sm" className="bg-slate-900 text-white">Review</Button>
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
