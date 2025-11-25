import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Calendar, Eye, Trash2, Search, Filter } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import EmptyState from '@/components/shared/EmptyState';
import { CardSkeleton } from '@/components/shared/LoadingSkeleton';
import { recordsAPI } from '@/services/api';
import { toast } from '@/hooks/use-toast';

interface Record {
  _id: string;
  fileUrl: string;
  fileType: string;
  extractedText: string;
  uploadDate: string;
  createdAt: string;
}

const Records: React.FC = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState<Record[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadRecords = async () => {
      try {
        const response = await recordsAPI.getAll();
        setRecords(response.data.records || []);
      } catch (error: any) {
        toast({
          title: 'Failed to load records',
          description: error.response?.data?.message || 'Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadRecords();
  }, []);

  const filteredRecords = records.filter(
    (record) =>
      record.extractedText?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.fileType?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeColor = (fileType: string) => {
    if (fileType?.includes('pdf')) return 'bg-primary/10 text-primary';
    if (fileType?.includes('image')) return 'bg-secondary/10 text-secondary';
    return 'bg-muted text-muted-foreground';
  };

  const getFileTypeLabel = (fileType: string) => {
    if (fileType?.includes('pdf')) return 'PDF';
    if (fileType?.includes('jpeg') || fileType?.includes('jpg')) return 'Image';
    if (fileType?.includes('png')) return 'Image';
    return 'Document';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageContainer
        title="My Records"
        subtitle="View and manage all your medical records"
        showBack
        backTo="/dashboard"
        headerAction={
          <Button variant="medical" onClick={() => navigate('/upload')}>
            Upload New
          </Button>
        }
      >
        {/* Search */}
        <div className="mb-6 animate-fade-in">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Records List */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : filteredRecords.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No records found"
            description={
              searchQuery
                ? 'Try adjusting your search query'
                : 'Upload your first medical record to get started'
            }
            actionLabel={searchQuery ? undefined : 'Upload Record'}
            onAction={searchQuery ? undefined : () => navigate('/upload')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecords.map((record, index) => (
              <Card
                key={record.id}
                hover
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${getTypeColor(
                        record.fileType
                      )}`}
                    >
                      {getFileTypeLabel(record.fileType)}
                    </span>
                  </div>

                  <h3 className="font-semibold text-foreground mb-1">
                    Medical Record
                  </h3>

                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                    <Calendar className="h-3 w-3" />
                    {new Date(record.uploadDate || record.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {record.extractedText || 'No text extracted yet. Use OCR to extract text.'}
                  </p>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => window.open(record.fileUrl, '_blank')}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </PageContainer>
    </div>
  );
};

export default Records;
