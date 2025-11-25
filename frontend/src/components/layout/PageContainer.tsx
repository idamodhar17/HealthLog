import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  backTo?: string;
  className?: string;
  headerAction?: React.ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({
  children,
  title,
  subtitle,
  showBack = false,
  backTo,
  className,
  headerAction,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
        {(showBack || title) && (
          <div className="mb-6 md:mb-8 animate-fade-in">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {showBack && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBack}
                    className="shrink-0"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                )}
                <div>
                  {title && (
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                      {title}
                    </h1>
                  )}
                  {subtitle && (
                    <p className="text-muted-foreground mt-1">{subtitle}</p>
                  )}
                </div>
              </div>
              {headerAction && <div>{headerAction}</div>}
            </div>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
