import React from 'react';
import { useListCourses, useListEnrollments } from '@workspace/api-client-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { BookOpen, MapPin, Clock, CheckCircle2 } from 'lucide-react';

const mockCourses = [
  { id: 1, name: 'Intensive A1 German', languageLevel: 'A1', providerName: 'Goethe-Institut', durationWeeks: 8, feeAmount: 25000, mode: 'hybrid', city: 'Delhi' },
  { id: 2, name: 'B1 Professional German', languageLevel: 'B1', providerName: 'Max Mueller Bhavan', durationWeeks: 12, feeAmount: 35000, mode: 'online' },
  { id: 3, name: 'A2 Fast Track', languageLevel: 'A2', providerName: 'German Academy', durationWeeks: 6, feeAmount: 20000, mode: 'offline', city: 'Mumbai' },
];

const mockEnrollments = [
  { id: 1, batchName: 'Intensive A1 German - Batch 2023-01', languageLevel: 'A1', status: 'passed', attendancePercent: 95, assessmentScore: 88, certificateIssued: true, enrolledAt: '2023-01-10T10:00:00Z' },
  { id: 2, batchName: 'A2 Fast Track - Evening', languageLevel: 'A2', status: 'attending', attendancePercent: 82, assessmentScore: null, certificateIssued: false, enrolledAt: '2023-03-15T10:00:00Z' },
];

export function CandidateTraining() {
  const { data: coursesData } = useListCourses();
  const { data: enrollmentsData } = useListEnrollments();

  const courses = coursesData || mockCourses;
  const enrollments = enrollmentsData || mockEnrollments;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Language Training</h1>
        <p className="text-slate-500 mt-1">Manage your German language courses and track progress.</p>
      </div>

      <Tabs defaultValue="my-learning" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="my-learning">My Learning</TabsTrigger>
          <TabsTrigger value="explore">Explore Courses</TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-learning" className="space-y-4">
          {enrollments.map(enrollment => (
            <Card key={enrollment.id} className="border-slate-200 shadow-sm overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="bg-slate-900 text-white p-6 flex flex-col justify-center items-center min-w-[150px]">
                  <span className="text-4xl font-bold text-amber-500">{enrollment.languageLevel}</span>
                  <Badge variant="outline" className="mt-2 bg-white/10 text-white border-white/20">
                    {enrollment.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">{enrollment.batchName}</h3>
                    <div className="flex gap-4 mt-2 text-sm text-slate-500">
                      <span>Enrolled: {new Date(enrollment.enrolledAt).toLocaleDateString()}</span>
                      {enrollment.certificateIssued && (
                        <span className="flex items-center text-green-600 font-medium">
                          <CheckCircle2 className="w-4 h-4 mr-1" /> Certificate Issued
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {enrollment.status === 'attending' && (
                    <div className="mt-6">
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-medium text-slate-700">Attendance</span>
                        <span className="text-slate-500">{enrollment.attendancePercent}%</span>
                      </div>
                      <Progress value={enrollment.attendancePercent || 0} className="h-2 bg-slate-100" indicatorClassName={enrollment.attendancePercent! >= 80 ? 'bg-green-500' : 'bg-amber-500'} />
                    </div>
                  )}

                  {enrollment.status === 'passed' && (
                    <div className="mt-6 flex gap-6">
                      <div>
                        <p className="text-sm text-slate-500">Final Score</p>
                        <p className="text-xl font-bold text-slate-800">{enrollment.assessmentScore}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Attendance</p>
                        <p className="text-xl font-bold text-slate-800">{enrollment.attendancePercent}%</p>
                      </div>
                      <div className="ml-auto flex items-end">
                        <Button variant="outline" className="border-slate-200">Download Certificate</Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="explore" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map(course => (
            <Card key={course.id} className="border-slate-200 shadow-sm flex flex-col">
              <CardHeader className="pb-3 border-b border-slate-100">
                <div className="flex justify-between items-start mb-2">
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-none">{course.languageLevel}</Badge>
                  <Badge variant="outline" className="text-slate-500 capitalize">{course.mode}</Badge>
                </div>
                <CardTitle className="text-lg leading-tight">{course.name}</CardTitle>
                <CardDescription className="text-slate-500 font-medium">{course.providerName}</CardDescription>
              </CardHeader>
              <CardContent className="py-4 space-y-3 flex-1">
                <div className="flex items-center text-sm text-slate-600">
                  <Clock className="w-4 h-4 mr-2 text-slate-400" />
                  {course.durationWeeks} Weeks
                </div>
                {course.city && (
                  <div className="flex items-center text-sm text-slate-600">
                    <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                    {course.city}
                  </div>
                )}
                <div className="flex items-center text-sm text-slate-600 font-medium mt-4">
                  ₹ {course.feeAmount?.toLocaleString('en-IN')}
                </div>
              </CardContent>
              <CardFooter className="pt-0 pb-4">
                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white">View Batches</Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
