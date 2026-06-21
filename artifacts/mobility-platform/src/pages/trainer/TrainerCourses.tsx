import React, { useState } from 'react';
import { useListCourses, useCreateCourse } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, MapPin, Clock } from 'lucide-react';

const mockCourses = [
  { id: 1, name: 'Intensive A1 German', languageLevel: 'A1', providerName: 'Goethe-Institut', durationWeeks: 8, feeAmount: 25000, mode: 'hybrid', city: 'Delhi', enrolledCount: 150, createdAt: '2023-01-01T00:00:00Z' },
  { id: 2, name: 'B1 Professional German', languageLevel: 'B1', providerName: 'Max Mueller Bhavan', durationWeeks: 12, feeAmount: 35000, mode: 'online', city: null, enrolledCount: 85, createdAt: '2023-01-01T00:00:00Z' },
];

export function TrainerCourses() {
  const { data: coursesData, refetch } = useListCourses();
  const createCourse = useCreateCourse();
  const courses = coursesData || mockCourses;

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '', languageLevel: 'A1', durationWeeks: '', feeAmount: '', mode: 'online', city: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCourse.mutate({
      data: {
        name: formData.name,
        languageLevel: formData.languageLevel,
        durationWeeks: parseInt(formData.durationWeeks) || undefined,
        feeAmount: parseInt(formData.feeAmount) || undefined,
        mode: formData.mode,
        city: formData.city || undefined
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
          <h1 className="text-3xl font-bold text-white tracking-tight">Manage Courses</h1>
          <p className="text-purple-300 mt-1">Define language courses offered by your institute.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Course</DialogTitle>
              <DialogDescription>Add a new German language course to your catalog.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Course Name</Label>
                <Input id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Intensive A1 German" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="languageLevel">Language Level</Label>
                  <Select value={formData.languageLevel} onValueChange={v => setFormData({...formData, languageLevel: v})} required>
                    <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A1">A1</SelectItem>
                      <SelectItem value="A2">A2</SelectItem>
                      <SelectItem value="B1">B1</SelectItem>
                      <SelectItem value="B2">B2</SelectItem>
                      <SelectItem value="C1">C1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mode">Mode</Label>
                  <Select value={formData.mode} onValueChange={v => setFormData({...formData, mode: v})} required>
                    <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                      <SelectItem value="hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (Weeks)</Label>
                  <Input id="duration" type="number" value={formData.durationWeeks} onChange={e => setFormData({...formData, durationWeeks: e.target.value})} placeholder="8" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fee">Fee (INR)</Label>
                  <Input id="fee" type="number" value={formData.feeAmount} onChange={e => setFormData({...formData, feeAmount: e.target.value})} placeholder="25000" />
                </div>
              </div>
              {formData.mode !== 'online' && (
                <div className="space-y-2">
                  <Label htmlFor="city">City (For offline/hybrid)</Label>
                  <Input id="city" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} placeholder="e.g. Delhi" required={formData.mode !== 'online'} />
                </div>
              )}
              <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white mt-4" disabled={createCourse.isPending}>
                {createCourse.isPending ? 'Creating...' : 'Create Course'}
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
                <TableHead>Course Name</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Mode & Location</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead className="text-right">Total Students</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>
                    <div className="font-medium text-white">{course.name}</div>
                    <div className="text-xs text-purple-300 mt-1">
                      <Badge variant="outline" className="bg-purple-900/20 text-purple-400 border-none font-medium px-2 py-0">{course.languageLevel}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm text-purple-300">
                      <Clock className="w-3.5 h-3.5" />
                      {course.durationWeeks} Weeks
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium capitalize text-purple-200">{course.mode}</div>
                    {course.city && (
                      <div className="flex items-center gap-1 text-xs text-purple-300 mt-0.5">
                        <MapPin className="w-3 h-3" /> {course.city}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-white">
                    {course.feeAmount ? `₹${course.feeAmount.toLocaleString('en-IN')}` : 'Free'}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center justify-center bg-purple-900/30 text-purple-200 rounded-full px-2.5 py-1 text-sm font-medium">
                      {course.enrolledCount || 0}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {courses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center text-purple-300">
                    No courses available.
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
