import React, { useState, useEffect } from 'react';
import { Heart, AlertCircle } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import Navbar from '@/components/layout/Navbar';
import QRCodeDisplay from '@/components/shared/QRCodeDisplay';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/shared/LoadingSkeleton';
import { iceAPI } from '@/services/api';
import { toast } from '@/hooks/use-toast';

const ICEQR: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [qrData, setQrData] = useState('');

  useEffect(() => {
    generateQR();
  }, []);

  const generateQR = async () => {
    setIsLoading(true);
    try {
      const response = await iceAPI.generateQR();
      const { qrImage } = response.data;
      setQrData(qrImage);
    } catch (error: any) {
      toast({
        title: 'Failed to generate QR',
        description: error.response?.data?.message || 'Please create an emergency profile first.',
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
        title="Emergency QR Code"
        subtitle="Scannable by first responders for instant access"
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
              title="Emergency (ICE) QR"
              subtitle="No expiration - Always accessible"
              expiresIn={999999}
              onRefresh={handleRefresh}
            />
          )}

          {/* Alert Card */}
          <Card className="border-destructive/20 bg-destructive/5 animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    Important Information
                  </h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• This QR provides access to critical health info only</li>
                    <li>• Print and keep in your wallet or on your phone</li>
                    <li>• First responders can scan without login</li>
                    <li>• Update your emergency profile regularly</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Heart className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">
                    How it helps
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    In an emergency, first responders can scan this QR to instantly access your critical health information including blood type, allergies, medical conditions, medications, and emergency contacts.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </div>
  );
};

export default ICEQR;
