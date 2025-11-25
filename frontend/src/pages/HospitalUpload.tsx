import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Activity, Upload as UploadIcon, CheckCircle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FileUpload from '@/components/shared/FileUpload';
import { toast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/shared/LoadingSkeleton';

const HospitalUpload: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [patientName, setPatientName] = useState('');

  useEffect(() => {
    const validateToken = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsValid(true);
      setPatientName('John Doe');
      setIsLoading(false);
    };
    validateToken();
  }, [token]);

  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: 'No files selected',
        description: 'Please select at least one file to upload.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsUploading(false);
    setIsSuccess(true);

    toast({
      title: 'Upload Successful',
      description: 'Medical reports have been uploaded to patient records.',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="medical-gradient py-6">
          <div className="container mx-auto px-4">
            <Skeleton className="h-8 w-48 bg-primary-foreground/20" />
          </div>
        </div>
        <div className="container mx-auto px-4 py-8 max-w-xl">
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Invalid or Expired Link
            </h2>
            <p className="text-muted-foreground">
              This upload link is no longer valid. Please request a new QR code from the patient.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <div className="medical-gradient py-6">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                <Activity className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary-foreground">HealthLog</h1>
                <p className="text-sm text-primary-foreground/80">Hospital Upload Portal</p>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-16 max-w-xl">
          <div className="text-center animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Upload Complete!
            </h2>
            <p className="text-muted-foreground mb-6">
              {files.length} file(s) uploaded to {patientName}'s medical records.
            </p>
            <Button variant="outline" onClick={() => {
              setIsSuccess(false);
              setFiles([]);
            }}>
              Upload More Files
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="medical-gradient py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary-foreground">HealthLog</h1>
              <p className="text-sm text-primary-foreground/80">Hospital Upload Portal</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-xl">
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Upload Medical Reports</CardTitle>
            <CardDescription>
              Upload reports for patient: <span className="font-medium text-foreground">{patientName}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FileUpload
              onFileSelect={setFiles}
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              maxSize={10}
            />

            <Button
              variant="medical"
              className="w-full"
              onClick={handleUpload}
              disabled={isUploading || files.length === 0}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <UploadIcon className="h-4 w-4 mr-2" />
                  Upload to Patient Records
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HospitalUpload;
