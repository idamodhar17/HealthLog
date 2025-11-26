import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import Navbar from '@/components/layout/Navbar';
import TimelineItem from '@/components/timeline/TimelineItem';
import EmptyState from '@/components/shared/EmptyState';
import { Skeleton } from '@/components/shared/LoadingSkeleton';
import { timelineAPI } from '@/services/api';
import { toast } from '@/hooks/use-toast';

interface TimelineEvent {
  _id: string;
  date: string;
  summary: string;
  recordId?: {
    fileUrl?: string;
    fileType?: string;
    extractedText?: string;
  };
}

const Timeline: React.FC = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTimeline = async () => {
      try {
        const response = await timelineAPI.get();
        setEvents(response.data.timeline || []);
      } catch (error: any) {
        toast({
          title: 'Failed to load timeline',
          description: error.response?.data?.message || 'Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadTimeline();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageContainer
        title="Medical Timeline"
        subtitle="Your complete health journey at a glance"
        showBack
        backTo="/dashboard"
      >
        <div className="max-w-2xl mx-auto">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="w-4 h-4 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-24 w-full rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <EmptyState
              icon={Clock}
              title="No timeline events"
              description="Your medical history will appear here as you add records."
            />
          ) : (
            <div className="animate-fade-in">
              {events.map((event, index) => (
                <TimelineItem
                  key={event._id}
                  date={new Date(event.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                  title=""
                  description={event.summary}
                  type="report"
                  isLast={index === events.length - 1}
                  onClick={() => event.recordId?.fileUrl && window.open(event.recordId.fileUrl, '_blank')}
                />
              ))}
            </div>
          )}
        </div>
      </PageContainer>
    </div>
  );
};

export default Timeline;
