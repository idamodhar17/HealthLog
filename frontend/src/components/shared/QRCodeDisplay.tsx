import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QRCodeDisplayProps {
  qrData: string;
  title: string;
  subtitle?: string;
  expiresIn?: number; // in seconds
  onRefresh?: () => void;
  onDownload?: () => void;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  qrData,
  title,
  subtitle,
  expiresIn = 1800, // 30 minutes default
  onRefresh,
  onDownload,
}) => {
  const [timeLeft, setTimeLeft] = useState(expiresIn);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresIn]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      // Default download behavior
      const link = document.createElement('a');
      link.href = qrData;
      link.download = `${title.replace(/\s+/g, '-').toLowerCase()}-qr.png`;
      link.click();
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{title}</CardTitle>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6">
        {/* QR Code */}
        <div className="relative">
          <div className="p-4 bg-card rounded-2xl shadow-card border">
            <img
              src={qrData || `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent('demo-qr-code')}`}
              alt="QR Code"
              className="w-48 h-48 md:w-56 md:h-56"
            />
          </div>
          {timeLeft <= 0 && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <p className="text-destructive font-medium">Expired</p>
            </div>
          )}
        </div>

        {/* Timer */}
        <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className={`font-mono font-medium ${timeLeft <= 60 ? 'text-destructive' : 'text-foreground'}`}>
            {timeLeft > 0 ? formatTime(timeLeft) : 'Expired'}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3 w-full">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onRefresh}
            disabled={timeLeft > 0}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant="medical"
            className="flex-1"
            onClick={handleDownload}
            disabled={timeLeft <= 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRCodeDisplay;
