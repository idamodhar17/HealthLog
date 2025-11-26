import React from 'react';
import { FileText, Calendar, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface TimelineItemProps {
  date: string;
  title: string;
  description: string;
  type?: 'report' | 'note' | 'visit' | 'medication';
  isLast?: boolean;
  onClick?: () => void;
}

const TimelineItem: React.FC<TimelineItemProps> = ({
  date,
  title,
  description,
  type = 'report',
  isLast = false,
  onClick,
}) => {
  const typeColors = {
    report: 'bg-primary/10 text-primary border-primary/20',
    note: 'bg-success/10 text-success border-success/20',
    visit: 'bg-secondary/10 text-secondary border-secondary/20',
    medication: 'bg-warning/10 text-warning border-warning/20',
  };

  return (
    <div className="relative flex gap-4 md:gap-6">
      {/* Timeline Line */}
      <div className="flex flex-col items-center">
        <div className={cn(
          "w-4 h-4 rounded-full border-2 bg-card z-10",
          typeColors[type].replace('bg-', 'border-').replace('/10', '')
        )} />
        {!isLast && (
          <div className="w-0.5 flex-1 bg-border -mt-1" />
        )}
      </div>

      {/* Content */}
      <Card
        hover={!!onClick}
        className="flex-1 mb-4"
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full",
                  typeColors[type]
                )}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  {date}
                </div>
              </div>
              <h4 className="font-medium text-foreground mb-1">{title}</h4>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {description}
              </p>
            </div>
            {onClick && (
              <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TimelineItem;
