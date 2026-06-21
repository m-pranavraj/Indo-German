import React, { useState } from 'react';
import { useListVacancies, useCreateVacancy } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Briefcase, MapPin, Users, Plus } from 'lucide-react';
import { Link } from 'wouter';
import { format } from 'date-fns';

const mockVacancies = [
  { id: 101, title: 'Senior React Developer', occupation: 'Software Engineer', location: 'Berlin', salaryMin: 65000, salaryMax: 85000, languageLevel: 'B1', status: 'active', applicantsCount: 12, createdAt: '2023-05-01T10:00:00Z' },
  { id: 102, title: 'Frontend Engineer', occupation: 'Software Engineer', location: 'Munich', salaryMin: 55000, salaryMax: 70000, languageLevel: 'B2', status: 'active', applicantsCount: 8, createdAt: '2023-05-15T10:00:00Z' },
  { id: 103, title: 'Registered Nurse', occupation: 'Nurse', location: 'Hamburg', salaryMin: 40000, salaryMax: 50000, languageLevel: 'B2', status: 'paused', applicantsCount: 24, createdAt: '2023-04-10T10:00:00Z' },
];

export function EmployerVacancies() {
  const { data: vacanciesData, refetch } = useListVacancies();
  const createVacancy = useCreateVacancy();
  const vacancies = vacanciesData || mockVacancies;

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '', occupation: '', location: '', languageLevel: 'B1', salaryMin: '', salaryMax: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createVacancy.mutate({
      data: {
        title: formData.title,
        occupation: formData.occupation,
        location: formData.location,
        languageLevel: formData.languageLevel,
        salaryMin: parseInt(formData.salaryMin) || undefined,
        salaryMax: parseInt(formData.salaryMax) || undefined,
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
          <h1 className="text-3xl font-bold text-white tracking-tight">Manage Vacancies</h1>
          <p className="text-purple-300 mt-1">Create and manage your open positions to find qualified Indian talent.</p>
        </div>
        
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Post New Vacancy
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Post a New Vacancy</DialogTitle>
              <DialogDescription>Enter the details of the position you want to fill.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input id="title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Senior React Developer" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="occupation">Standard Occupation</Label>
                  <Select value={formData.occupation} onValueChange={v => setFormData({...formData, occupation: v})} required>
                    <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Software Engineer">Software Engineer</SelectItem>
                      <SelectItem value="Nurse">Registered Nurse</SelectItem>
                      <SelectItem value="Electrician">Electrician</SelectItem>
                      <SelectItem value="Mechanic">Mechanic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location (City)</Label>
                  <Input id="location" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="e.g. Berlin" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="salaryMin">Min Salary (€)</Label>
                  <Input id="salaryMin" type="number" value={formData.salaryMin} onChange={e => setFormData({...formData, salaryMin: e.target.value})} placeholder="45000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salaryMax">Max Salary (€)</Label>
                  <Input id="salaryMax" type="number" value={formData.salaryMax} onChange={e => setFormData({...formData, salaryMax: e.target.value})} placeholder="65000" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="languageLevel">Required German Level</Label>
                <Select value={formData.languageLevel} onValueChange={v => setFormData({...formData, languageLevel: v})}>
                  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="None">None required</SelectItem>
                    <SelectItem value="A1">A1 (Beginner)</SelectItem>
                    <SelectItem value="A2">A2 (Elementary)</SelectItem>
                    <SelectItem value="B1">B1 (Intermediate)</SelectItem>
                    <SelectItem value="B2">B2 (Upper Intermediate)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4" disabled={createVacancy.isPending}>
                {createVacancy.isPending ? 'Posting...' : 'Post Vacancy'}
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
                <TableHead>Job Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Requirements</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Applicants</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vacancies.map((vacancy) => (
                <TableRow key={vacancy.id}>
                  <TableCell>
                    <div className="font-medium text-white">{vacancy.title}</div>
                    <div className="text-xs text-purple-300">{vacancy.occupation}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm text-purple-300">
                      <MapPin className="w-3.5 h-3.5" />
                      {vacancy.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="bg-purple-900/30 text-purple-300 text-xs py-0">{vacancy.languageLevel} German</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      vacancy.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' :
                      vacancy.status === 'paused' ? 'bg-purple-900/20 text-purple-400 border-purple-600/40' :
                      'bg-purple-900/30 text-purple-300 border-purple-900'
                    }>
                      <span className="capitalize">{vacancy.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-medium text-sm">
                      <Users className="w-3.5 h-3.5" />
                      {vacancy.applicantsCount || 0}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/employer/vacancy/${vacancy.id}/matches`}>
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-50">
                        View Matches
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {vacancies.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-purple-300">
                    No vacancies posted yet.
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
