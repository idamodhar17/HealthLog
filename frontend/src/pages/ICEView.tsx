import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Activity, Heart, Droplet, AlertTriangle, Pill, Phone, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/shared/LoadingSkeleton';

interface ICEData {
  name: string;
  bloodGroup: string;
  allergies: string[];
  medicalConditions: string;
  currentMedications: string;
  emergencyContacts: Array<{
    name: string;
    relation: string;
    phone: string;
  }>;
  lastUpdated: string;
}

const mockICEData: ICEData = {
  name: 'John Doe',
  bloodGroup: 'O+',
  allergies: ['Penicillin', 'Peanuts', 'Shellfish'],
  medicalConditions: 'Type 2 Diabetes, Hypertension, Asthma',
  currentMedications: 'Metformin 500mg (twice daily), Lisinopril 10mg (daily), Albuterol inhaler (as needed)',
  emergencyContacts: [
    { name: 'Jane Doe', relation: 'Spouse', phone: '+1 555-0123' },
    { name: 'Robert Doe', relation: 'Brother', phone: '+1 555-0456' },
  ],
  lastUpdated: '2024-01-15',
};

const ICEView: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<ICEData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setData(mockICEData);
      setIsLoading(false);
    };
    loadData();
  }, [token]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-destructive py-6">
          <div className="container mx-auto px-4">
            <Skeleton className="h-8 w-48 bg-destructive-foreground/20" />
          </div>
        </div>
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Skeleton className="h-40 rounded-xl mb-4" />
          <Skeleton className="h-32 rounded-xl mb-4" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Invalid Link
            </h2>
            <p className="text-muted-foreground">
              This emergency profile link is not valid.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Emergency Header */}
      <div className="bg-destructive py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-destructive-foreground/20 flex items-center justify-center">
              <Heart className="h-5 w-5 text-destructive-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-destructive-foreground">Emergency Profile</h1>
              <p className="text-sm text-destructive-foreground/80">Critical Medical Information</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Patient Name & Blood Group */}
        <Card className="mb-4 border-2 border-destructive/20 animate-fade-in">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Patient Name</p>
                <p className="text-2xl font-bold text-foreground">{data.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1">Blood Group</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/10">
                  <Droplet className="h-5 w-5 text-destructive" />
                  <span className="text-2xl font-bold text-destructive">{data.bloodGroup}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Allergies - Critical */}
        <Card className="mb-4 border-2 border-warning/20 bg-warning/5 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertTriangle className="h-5 w-5" />
              Allergies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.allergies.map((allergy) => (
                <span
                  key={allergy}
                  className="px-3 py-1 rounded-full bg-warning/20 text-warning font-medium"
                >
                  {allergy}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Medical Conditions */}
        <Card className="mb-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              Medical Conditions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground">{data.medicalConditions}</p>
          </CardContent>
        </Card>

        {/* Current Medications */}
        <Card className="mb-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5 text-success" />
              Current Medications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground whitespace-pre-line">{data.currentMedications}</p>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card className="mb-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-secondary" />
              Emergency Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.emergencyContacts.map((contact, index) => (
                <a
                  key={index}
                  href={`tel:${contact.phone.replace(/\s/g, '')}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                >
                  <div>
                    <p className="font-medium text-foreground">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">{contact.relation}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-primary">{contact.phone}</p>
                    <p className="text-xs text-muted-foreground">Tap to call</p>
                  </div>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Last Updated */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <Clock className="h-4 w-4" />
          <span>Last updated: {new Date(data.lastUpdated).toLocaleDateString()}</span>
        </div>

        {/* HealthLog Branding */}
        <div className="mt-8 pt-6 border-t text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Activity className="h-4 w-4" />
            <span className="text-sm">Powered by HealthLog</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ICEView;
