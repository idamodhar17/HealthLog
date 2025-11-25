import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  to: string;
  gradient?: boolean;
  className?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  icon: Icon,
  to,
  gradient = false,
  className,
}) => {
  return (
    <Link to={to}>
      <Card hover className={cn("h-full overflow-hidden group", className)}>
        <CardContent className="p-0">
          <div
            className={cn(
              "p-4 transition-all duration-300",
              gradient
                ? "medical-gradient"
                : "bg-primary/5 group-hover:bg-primary/10"
            )}
          >
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
                gradient
                  ? "bg-primary-foreground/20"
                  : "bg-primary/10"
              )}
            >
              <Icon
                className={cn(
                  "h-6 w-6",
                  gradient ? "text-primary-foreground" : "text-primary"
                )}
              />
            </div>
          </div>
          <div className="p-5">
            <h3 className="font-semibold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default DashboardCard;
