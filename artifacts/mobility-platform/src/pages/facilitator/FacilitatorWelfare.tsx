import React from 'react';
import { useListWelfareTickets } from '@workspace/api-client-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { AlertTriangle, Clock } from 'lucide-react';

const mockTickets = [
  { id: 1, candidateId: 101, candidateName: 'Aarav Patel', category: 'accommodation', title: 'Need help finding permanent housing in Munich', priority: 'medium', status: 'open', createdAt: '2023-06-01T10:00:00Z' },
  { id: 2, candidateId: 102, candidateName: 'Priya Sharma', category: 'legal', title: 'Visa extension delay query', priority: 'high', status: 'in_progress', createdAt: '2023-06-02T10:00:00Z' },
  { id: 3, candidateId: 103, candidateName: 'Rahul Kumar', category: 'employer_grievance', title: 'Mismatch in contract hours', priority: 'urgent', status: 'open', createdAt: '2023-06-03T10:00:00Z' },
];

export function FacilitatorWelfare() {
  const { data: ticketsData } = useListWelfareTickets();
  const tickets = ticketsData || mockTickets;

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'urgent': return <Badge className="bg-red-600 hover:bg-red-700 border-transparent text-white">Urgent</Badge>;
      case 'high': return <Badge className="bg-orange-500 hover:bg-orange-600 border-transparent text-white">High</Badge>;
      case 'medium': return <Badge className="bg-amber-500 hover:bg-amber-600 border-transparent text-white">Medium</Badge>;
      default: return <Badge className="bg-slate-500 hover:bg-slate-600 border-transparent text-white">Low</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            Welfare Alerts
            <span className="bg-red-100 text-red-700 text-sm px-2.5 py-0.5 rounded-full font-bold">
              {tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length} Active
            </span>
          </h1>
          <p className="text-slate-500 mt-1">Manage support requests and emergency tickets from candidates.</p>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm border-t-4 border-t-red-500">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>Priority</TableHead>
                <TableHead>Issue / Subject</TableHead>
                <TableHead>Candidate</TableHead>
                <TableHead>Opened</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id} className={ticket.priority === 'urgent' ? 'bg-red-50/30' : ''}>
                  <TableCell>{getPriorityBadge(ticket.priority!)}</TableCell>
                  <TableCell>
                    <div className="font-medium text-slate-900 mb-1 flex items-center gap-2">
                      {ticket.priority === 'urgent' && <AlertTriangle className="w-4 h-4 text-red-600" />}
                      {ticket.title}
                    </div>
                    <div className="text-xs text-slate-500 capitalize bg-slate-100 px-2 py-0.5 rounded inline-block">
                      {ticket.category.replace('_', ' ')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium text-slate-700">{ticket.candidateName}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {format(new Date(ticket.createdAt), 'MMM d, HH:mm')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      ticket.status === 'open' ? 'bg-red-50 text-red-700 border-red-200' :
                      ticket.status === 'in_progress' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-green-50 text-green-700 border-green-200'
                    }>
                      <span className="capitalize">{ticket.status.replace('_', ' ')}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" className="bg-slate-900 text-white">Resolve Issue</Button>
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
