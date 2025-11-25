import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import Navbar from '@/components/layout/Navbar';
import TimelineItem from '@/components/timeline/TimelineItem';
import EmptyState from '@/components/shared/EmptyState';
import { Skeleton } from '@/components/shared/LoadingSkeleton';

interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'report' | 'note' | 'visit' | 'medication';
}

const mockTimeline: TimelineEvent[] = [
  {
    id: '1',
    date: '2024-01-15',
    title: 'Blood Test Results',
    description: 'Complete blood count and lipid profile results received from PathLab.',
    type: 'report',
  },
  {
    id: '2',
    date: '2024-01-10',
    title: 'Doctor Visit - Dr. Sarah Johnson',
    description: 'Annual checkup completed. All vitals normal. Recommended vitamin D supplements.',
    type: 'visit',
  },
  {
    id: '3',
    date: '2024-01-08',
    title: 'New Prescription',
    description: 'Prescribed antihistamine for seasonal allergies. 30-day supply.',
    type: 'medication',
  },
  {
    id: '4',
    date: '2024-01-05',
    title: 'Chest X-Ray',
    description: 'Routine chest X-ray completed. Results: No abnormalities detected.',
    type: 'report',
  },
  {
    id: '5',
    date: '2023-12-20',
    title: 'Doctor Note - Dr. Michael Chen',
    description: 'Follow-up appointment. Recovery progressing well. Continue current medication.',
    type: 'note',
  },
];

const Timeline: React.FC = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTimeline = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setEvents(mockTimeline);
      setIsLoading(false);
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
                  key={event.id}
                  date={new Date(event.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                  title={event.title}
                  description={event.description}
                  type={event.type}
                  isLast={index === events.length - 1}
                  onClick={() => {}}
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
