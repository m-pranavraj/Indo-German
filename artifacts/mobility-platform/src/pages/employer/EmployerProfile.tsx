import React from 'react';
import { useGetMyEmployerProfile, useUpdateMyEmployerProfile } from '@workspace/api-client-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function EmployerProfile() {
  const { data: profile } = useGetMyEmployerProfile();
  
  // Fake profile for demo
  const employer = profile || {
    companyName: 'TechCorp GmbH',
    country: 'Germany',
    city: 'Berlin',
    industry: 'Technology / Software',
    contactName: 'Hans Müller',
    contactEmail: 'hr@techcorp.de',
    verificationStatus: 'verified'
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Company Profile</h1>
        <p className="text-purple-300 mt-1">Manage your employer details and verification status.</p>
      </div>

      <Card className="border-purple-900 shadow-sm">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Verification Status</CardTitle>
              <CardDescription>Your account standing in the Mobility Corridor platform.</CardDescription>
            </div>
            {employer.verificationStatus === 'verified' ? (
              <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> Verified Employer
              </div>
            ) : (
              <div className="bg-purple-900/20 text-purple-400 px-3 py-1 rounded-full text-sm font-medium border border-purple-600/40 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span> Verification Pending
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      <Card className="border-purple-900 shadow-sm">
        <CardHeader>
          <CardTitle>Company Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input defaultValue={employer.companyName} />
            </div>
            <div className="space-y-2">
              <Label>Industry</Label>
              <Input defaultValue={employer.industry || ''} />
            </div>
            <div className="space-y-2">
              <Label>Country</Label>
              <Input defaultValue={employer.country} disabled className="bg-purple-950/60" />
            </div>
            <div className="space-y-2">
              <Label>City</Label>
              <Input defaultValue={employer.city || ''} />
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-purple-900/50">
            <h3 className="text-sm font-medium text-white mb-4">Primary Contact</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Contact Name</Label>
                <Input defaultValue={employer.contactName || ''} />
              </div>
              <div className="space-y-2">
                <Label>Contact Email</Label>
                <Input defaultValue={employer.contactEmail || ''} />
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
