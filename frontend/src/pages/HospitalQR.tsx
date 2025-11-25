import React, { useState, useEffect } from 'react';
import { Building2 } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import Navbar from '@/components/layout/Navbar';
import QRCodeDisplay from '@/components/shared/QRCodeDisplay';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/shared/LoadingSkeleton';
import { qrAPI } from '@/services/api';
import { toast } from '@/hooks/use-toast';

const HospitalQR: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [qrData, setQrData] = useState('');
  const [expiresAt, setExpiresAt] = useState<number | null>(null);

  useEffect(() => {
    generateQR();
  }, []);

  const generateQR = async () => {
    setIsLoading(true);
    try {
      const response = await qrAPI.generateHospital();
      const { qrImage, expiresAt: expiry } = response.data;
      setQrData(qrImage);
      setExpiresAt(expiry);
    } catch (error: any) {
      toast({
        title: 'Failed to generate QR',
        description: error.response?.data?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    await generateQR();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageContainer
        title="Hospital Upload QR"
        subtitle="Let hospitals upload reports directly to your account"
        showBack
        backTo="/dashboard"
      >
        <div className="max-w-xl mx-auto space-y-6">
          {isLoading ? (
            <Card>
              <CardContent className="p-8 flex flex-col items-center">
                <Skeleton className="w-56 h-56 rounded-xl" />
                <Skeleton className="w-32 h-8 mt-6" />
              </CardContent>
            </Card>
          ) : (
            <QRCodeDisplay
              qrData={qrData}
              title="Hospital Upload QR"
              subtitle="Valid for 1 hour"
              expiresIn={expiresAt ? Math.floor((expiresAt - Date.now()) / 1000) : 3600}
              onRefresh={handleRefresh}
            />
          )}

          {/* Instructions */}
          <Card className="animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                  <Building2 className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    How to use
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Show this QR code to hospital staff</li>
                    <li>• Hospital scans the code to upload your reports</li>
                    <li>• Reports are automatically added to your records</li>
                    <li>• You'll receive a notification when uploads complete</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </div>
  );
};

export default HospitalQR;
