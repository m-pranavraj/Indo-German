import React, { useState } from 'react';
import { useListBatches, useCreateBatch, useListCourses } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Plus, Users, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const mockBatches = [
  { id: 1, courseId: 1, courseName: 'Intensive A1 German', trainerName: 'Frau Schmidt', startDate: '2023-08-01', endDate: '2023-09-30', status: 'active', capacity: 30, enrolledCount: 28, attendancePercent: 92 },
  { id: 2, courseId: 2, courseName: 'B1 Professional German', trainerName: 'Herr Weber', startDate: '2023-09-15', endDate: '2023-12-15', status: 'upcoming', capacity: 25, enrolledCount: 15, attendancePercent: null },
];

export function TrainerBatches() {
  const { data: batchesData, refetch } = useListBatches();
  const { data: coursesData } = useListCourses();
  const createBatch = useCreateBatch();
  
  const batches = batchesData || mockBatches;
  const courses = coursesData || [{id: 1, name: 'Intensive A1 German'}, {id: 2, name: 'B1 Professional German'}];

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    courseId: '', startDate: '', endDate: '', capacity: '20', trainerName: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.courseId || !formData.startDate) return;

    createBatch.mutate({
      data: {
        courseId: parseInt(formData.courseId),
        startDate: formData.startDate,
        endDate: formData.endDate || undefined,
        capacity: parseInt(formData.capacity) || 20,
        trainerName: formData.trainerName || undefined
      }
    }, {
      onSuccess: () => {
        setIsOpen(false);
        refetch();
      }
    });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active': return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>;
      case 'upcoming': return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Upcoming</Badge>;
      case 'completed': return <Badge variant="outline" className="bg-purple-900/30 text-purple-200 border-purple-900">Completed</Badge>;
      case 'cancelled': return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Manage Batches</h1>
          <p className="text-purple-300 mt-1">Schedule and manage course batches.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Batch
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule New Batch</DialogTitle>
              <DialogDescription>Create a new training batch for an existing course.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="courseId">Course</Label>
                <Select value={formData.courseId} onValueChange={v => setFormData({...formData, courseId: v})} required>
                  <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                  <SelectContent>
                    {courses.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity (Students)</Label>
                  <Input id="capacity" type="number" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} required min="1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trainerName">Trainer Name</Label>
                  <Input id="trainerName" value={formData.trainerName} onChange={e => setFormData({...formData, trainerName: e.target.value})} placeholder="e.g. John Doe" />
                </div>
              </div>
              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white mt-4" disabled={createBatch.isPending}>
                {createBatch.isPending ? 'Creating...' : 'Create Batch'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-purple-900 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-purple-950/60">
              <TableRow>
                <TableHead>Course & Trainer</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Enrollment</TableHead>
                <TableHead className="text-right">Avg. Attendance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches.map((batch) => {
                const fillPercent = Math.round((batch.enrolledCount / batch.capacity) * 100);
                return (
                  <TableRow key={batch.id}>
                    <TableCell>
                      <div className="font-medium text-white">{batch.courseName}</div>
                      <div className="text-xs text-purple-300 mt-1 flex items-center gap-1">
                        <Users className="w-3 h-3" /> {batch.trainerName || 'Unassigned'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-sm text-purple-300">
                        <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Start: {format(new Date(batch.startDate), 'MMM d, yyyy')}</div>
                        {batch.endDate && <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 opacity-0" /> End: {format(new Date(batch.endDate), 'MMM d, yyyy')}</div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(batch.status)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-purple-300">
                          <span>{batch.enrolledCount} / {batch.capacity}</span>
                          <span>{fillPercent}%</span>
                        </div>
                        <Progress value={fillPercent} className="h-1.5 bg-purple-900/30" indicatorClassName={fillPercent >= 100 ? "bg-red-500" : "bg-teal-500"} />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={`font-medium ${batch.attendancePercent && batch.attendancePercent < 75 ? 'text-purple-400' : 'text-white'}`}>
                        {batch.attendancePercent ? `${batch.attendancePercent}%` : '-'}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
              {batches.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-purple-300">
                    No batches found.
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
