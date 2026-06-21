import React, { useState } from 'react';
import { useListWelfareTickets, useCreateWelfareTicket } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LifeBuoy, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';

const mockTickets = [
  { id: 1, category: 'accommodation', title: 'Need help finding permanent housing in Munich', priority: 'medium', status: 'in_progress', createdAt: '2023-06-01T10:00:00Z' },
];

export function CandidateWelfare() {
  const { data: ticketsData, refetch } = useListWelfareTickets();
  const createTicket = useCreateWelfareTicket();
  
  const tickets = ticketsData || mockTickets;
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !title || !description) return;
    
    createTicket.mutate({
      data: { category, title, description, priority: 'medium' }
    }, {
      onSuccess: () => {
        setIsOpen(false);
        setCategory('');
        setTitle('');
        setDescription('');
        refetch();
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'open': return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Open</Badge>;
      case 'in_progress': return <Badge variant="outline" className="bg-purple-900/20 text-purple-400 border-purple-600/40">In Progress</Badge>;
      case 'resolved': 
      case 'closed': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Resolved</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Support & Welfare</h1>
          <p className="text-purple-300 mt-1">Get help with integration, housing, workplace issues, or general support.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-600 hover:bg-red-700 text-white shadow-sm">
              <LifeBuoy className="w-4 h-4 mr-2" />
              Raise Support Ticket
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Raise a Support Ticket</DialogTitle>
              <DialogDescription>Describe your issue so a welfare officer can assist you.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="category">Issue Category</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="accommodation">Accommodation / Housing</SelectItem>
                    <SelectItem value="employer_grievance">Employer Grievance</SelectItem>
                    <SelectItem value="exploitation">Exploitation / Harassment</SelectItem>
                    <SelectItem value="health">Health / Medical</SelectItem>
                    <SelectItem value="legal">Legal / Visa Issues</SelectItem>
                    <SelectItem value="general">General Integration Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Summary (Short Title)</Label>
                <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Issues with rental contract" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea 
                  id="description" 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  placeholder="Please provide as much detail as possible..." 
                  className="min-h-[120px]"
                  required 
                />
              </div>
              <div className="p-3 bg-red-50 text-red-800 text-sm rounded-md flex items-start gap-2 border border-red-100">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                <p>If this is an immediate emergency involving health or safety, please contact local authorities (112) directly.</p>
              </div>
              <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white mt-4" disabled={createTicket.isPending}>
                {createTicket.isPending ? 'Submitting...' : 'Submit Ticket'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {tickets.map(ticket => (
          <Card key={ticket.id} className="border-purple-900 shadow-sm">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(ticket.status)}
                    <span className="text-xs text-purple-300 bg-purple-900/30 px-2 py-0.5 rounded capitalize">
                      {ticket.category.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white">{ticket.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-purple-300">
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Opened: {format(new Date(ticket.createdAt), 'MMM d, yyyy')}</span>
                    <span className="flex items-center gap-1 font-medium capitalize">
                      Priority: <span className={
                        ticket.priority === 'high' || ticket.priority === 'urgent' ? 'text-red-600' : 
                        ticket.priority === 'medium' ? 'text-purple-400' : 'text-purple-300'
                      }>{ticket.priority}</span>
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm">View Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {tickets.length === 0 && (
          <div className="text-center py-12 bg-purple-950/60 rounded-lg border border-dashed border-purple-900">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-white">No active support tickets</h3>
            <p className="text-purple-300 mt-1">If you need assistance during your journey, raise a ticket here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
