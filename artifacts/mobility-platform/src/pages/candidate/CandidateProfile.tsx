import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useGetMyCandidateProfile, useUpdateMyCandidateProfile } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

const profileSchema = z.object({
  occupation: z.string().min(1, 'Occupation is required'),
  educationLevel: z.string().min(1, 'Education level is required'),
  experienceYears: z.coerce.number().min(0, 'Experience must be 0 or more'),
  germanLanguageLevel: z.string(),
  passportAvailable: z.boolean(),
  district: z.string().min(1, 'District is required'),
  state: z.string().min(1, 'State is required'),
});

export function CandidateProfile() {
  const { user } = useAuth();
  const { data: profile } = useGetMyCandidateProfile();
  const updateProfile = useUpdateMyCandidateProfile();

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      occupation: profile?.occupation || '',
      educationLevel: profile?.educationLevel || '',
      experienceYears: profile?.experienceYears || 0,
      germanLanguageLevel: profile?.germanLanguageLevel || 'None',
      passportAvailable: profile?.passportAvailable || false,
      district: profile?.district || '',
      state: profile?.state || '',
    }
  });

  // Re-initialize form when data loads
  React.useEffect(() => {
    if (profile) {
      form.reset({
        occupation: profile.occupation || '',
        educationLevel: profile.educationLevel || '',
        experienceYears: profile.experienceYears || 0,
        germanLanguageLevel: profile.germanLanguageLevel || 'None',
        passportAvailable: profile.passportAvailable || false,
        district: profile.district || '',
        state: profile.state || '',
      });
    }
  }, [profile, form]);

  const onSubmit = (data: z.infer<typeof profileSchema>) => {
    updateProfile.mutate({ data });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">My Profile</h1>
        <p className="text-purple-300 mt-1">Manage your personal and professional details.</p>
      </div>

      <Card className="border-purple-900 shadow-sm">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Basic details used for identification.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <FormLabel>Full Name</FormLabel>
              <Input value={user?.name || ''} disabled className="bg-purple-950/60" />
            </div>
            <div className="space-y-2">
              <FormLabel>Email</FormLabel>
              <Input value={user?.email || ''} disabled className="bg-purple-950/60" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-purple-900 shadow-sm">
        <CardHeader>
          <CardTitle>Professional Profile</CardTitle>
          <CardDescription>This information determines your Germany readiness score.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Occupation</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Software Engineer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="experienceYears"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="educationLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Highest Education Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="High School">High School</SelectItem>
                          <SelectItem value="ITI / Vocational">ITI / Vocational Diploma</SelectItem>
                          <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
                          <SelectItem value="Master's Degree">Master's Degree</SelectItem>
                          <SelectItem value="PhD">PhD</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="germanLanguageLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>German Language Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="None">None</SelectItem>
                          <SelectItem value="A1">A1</SelectItem>
                          <SelectItem value="A2">A2</SelectItem>
                          <SelectItem value="B1">B1</SelectItem>
                          <SelectItem value="B2">B2</SelectItem>
                          <SelectItem value="C1">C1 or higher</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State (India)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Kerala" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>District</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Ernakulam" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="passportAvailable"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        I have a valid passport
                      </FormLabel>
                      <p className="text-sm text-purple-300">
                        Check this if your passport is valid for at least the next 2 years.
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit" disabled={updateProfile.isPending} className="bg-purple-500 hover:bg-purple-600 text-white font-medium px-8">
                  {updateProfile.isPending ? 'Saving...' : 'Save Profile'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
