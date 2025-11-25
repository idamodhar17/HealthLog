import React, { useState, useEffect } from 'react';
import { QrCode, Stethoscope } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import Navbar from '@/components/layout/Navbar';
import QRCodeDisplay from '@/components/shared/QRCodeDisplay';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/shared/LoadingSkeleton';

const DoctorQR: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [qrData, setQrData] = useState('');

  useEffect(() => {
    const generateQR = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setQrData(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent('healthlog-doctor-access-token-demo')}`);
      setIsLoading(false);
    };
    generateQR();
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setQrData(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent('healthlog-doctor-access-token-' + Date.now())}`);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageContainer
        title="Doctor Access QR"
        subtitle="Share this QR code with your doctor for secure access"
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
              title="Doctor Access QR"
              subtitle="Valid for 30 minutes"
              expiresIn={1800}
              onRefresh={handleRefresh}
            />
          )}

          {/* Instructions */}
          <Card className="animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Stethoscope className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    How to use
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Show this QR code to your doctor during consultation</li>
                    <li>• Doctor scans the code to access your medical records</li>
                    <li>• Access is temporary and limited to current session</li>
                    <li>• All access is logged for your security</li>
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

export default DoctorQR;
