import React, { useState } from 'react';
import { useListInterviews, useScheduleInterview } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, Video, User, Briefcase, Plus } from 'lucide-react';
import { format } from 'date-fns';

const mockInterviews = [
  { id: 1, applicationId: 1, candidateId: 1, candidateName: 'Aarav Patel', employerId: 2, vacancyTitle: 'Senior React Developer', scheduledAt: '2023-06-15T14:00:00Z', meetingLink: 'https://meet.google.com/abc-defg-hij', status: 'scheduled', createdAt: '2023-06-10T10:00:00Z' },
  { id: 2, applicationId: 3, candidateId: 3, candidateName: 'Rahul Kumar', employerId: 2, vacancyTitle: 'Frontend Engineer', scheduledAt: '2023-06-16T10:30:00Z', meetingLink: 'https://zoom.us/j/123456789', status: 'scheduled', createdAt: '2023-06-11T10:00:00Z' },
  { id: 3, applicationId: 2, candidateId: 2, candidateName: 'Priya Sharma', employerId: 2, vacancyTitle: 'Senior React Developer', scheduledAt: '2023-05-25T15:00:00Z', status: 'completed', outcome: 'Passed to final round', createdAt: '2023-05-20T10:00:00Z' },
];

export function EmployerInterviews() {
  const { data: interviewsData, refetch } = useListInterviews();
  const scheduleInterview = useScheduleInterview();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ applicationId: '', date: '', time: '', link: '' });

  const interviews = interviewsData || mockInterviews;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.applicationId || !formData.date || !formData.time) return;

    const scheduledAt = new Date(`${formData.date}T${formData.time}`).toISOString();

    scheduleInterview.mutate({
      data: {
        applicationId: parseInt(formData.applicationId),
        scheduledAt: scheduledAt,
        meetingLink: formData.link
      }
    }, {
      onSuccess: () => {
        setIsOpen(false);
        refetch();
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Interviews</h1>
          <p className="text-purple-300 mt-1">Manage scheduled technical and cultural interviews.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Interview
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule an Interview</DialogTitle>
              <DialogDescription>Set up a meeting with a shortlisted candidate.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="applicationId">Application ID</Label>
                <Input id="applicationId" type="number" value={formData.applicationId} onChange={e => setFormData({...formData, applicationId: e.target.value})} placeholder="e.g. 1" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="link">Meeting Link (Optional)</Label>
                <Input id="link" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} placeholder="https://meet.google.com/..." />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4" disabled={scheduleInterview.isPending}>
                {scheduleInterview.isPending ? 'Scheduling...' : 'Schedule Interview'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {interviews.map(interview => (
          <Card key={interview.id} className="border-purple-900 shadow-sm relative overflow-hidden">
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${interview.status === 'scheduled' ? 'bg-purple-500' : interview.status === 'completed' ? 'bg-green-500' : 'bg-slate-300'}`} />
            <CardContent className="p-6 pl-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-purple-400" /> {interview.candidateName}
                  </h3>
                  <p className="text-sm text-purple-300 flex items-center gap-2 mt-1">
                    <Briefcase className="w-4 h-4 text-purple-400" /> {interview.vacancyTitle}
                  </p>
                </div>
                <Badge variant="outline" className={
                  interview.status === 'scheduled' ? 'bg-purple-900/20 text-purple-400 border-purple-600/40' :
                  interview.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                  'bg-purple-900/30 text-purple-300 border-purple-900'
                }>
                  <span className="capitalize">{interview.status}</span>
                </Badge>
              </div>

              <div className="flex flex-wrap gap-4 pt-4 border-t border-purple-900/50">
                <div className="flex items-center gap-1.5 text-sm font-medium text-purple-200 bg-purple-950/60 px-3 py-1.5 rounded-md border border-purple-900/50">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  {format(new Date(interview.scheduledAt), 'MMM d, yyyy')}
                </div>
                <div className="flex items-center gap-1.5 text-sm font-medium text-purple-200 bg-purple-950/60 px-3 py-1.5 rounded-md border border-purple-900/50">
                  <Clock className="w-4 h-4 text-blue-600" />
                  {format(new Date(interview.scheduledAt), 'h:mm a')}
                </div>
                
                {interview.meetingLink && interview.status === 'scheduled' && (
                  <Button variant="outline" size="sm" className="ml-auto text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100 h-8" asChild>
                    <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer">
                      <Video className="w-3.5 h-3.5 mr-1.5" /> Join Meeting
                    </a>
                  </Button>
                )}

                {interview.status === 'completed' && interview.outcome && (
                  <div className="w-full text-sm text-purple-300 mt-2 bg-purple-950/60 p-2 rounded italic">
                    " {interview.outcome} "
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
