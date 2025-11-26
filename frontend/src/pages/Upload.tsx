import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, Loader2, CheckCircle } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FileUpload from '@/components/shared/FileUpload';
import { toast } from '@/hooks/use-toast';
import { recordsAPI } from '@/services/api';

const Upload: React.FC = () => {
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState('');

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

    try {
      // Upload first file (backend accepts single file)
      const formData = new FormData();
      formData.append('file', files[0]);

      await recordsAPI.upload(formData);

      setIsUploading(false);
      setIsSuccess(true);

      toast({
        title: 'Upload Successful',
        description: 'Your medical record has been uploaded.',
      });

      setTimeout(() => {
        navigate('/records');
      }, 1500);
    } catch (error: any) {
      setIsUploading(false);
      toast({
        title: 'Upload Failed',
        description: error.response?.data?.message || 'Failed to upload file. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <PageContainer>
          <div className="max-w-lg mx-auto text-center py-16 animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Upload Complete!
            </h2>
            <p className="text-muted-foreground mb-6">
              Your medical record has been securely stored.
            </p>
            <Button variant="medical" onClick={() => navigate('/records')}>
              View My Records
            </Button>
          </div>
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageContainer
        title="Upload Report"
        subtitle="Add new medical records to your health profile"
        showBack
        backTo="/dashboard"
      >
        <div className="max-w-2xl mx-auto">
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Upload Medical Document</CardTitle>
              <CardDescription>
                Supported formats: PDF, JPG, PNG (Max 10MB)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Document Title (Optional)</Label>
                <Input
                  id="title"
                  placeholder="e.g., Blood Test Report - January 2024"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <FileUpload
                onFileSelect={setFiles}
                multiple={false}
                accept=".pdf,.jpg,.jpeg,.png"
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
                    Upload Document
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    </div>
  );
};

export default Upload;
