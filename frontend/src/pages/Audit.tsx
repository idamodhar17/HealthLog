import React, { useState, useEffect } from 'react';
import { Shield, Clock, Globe, Eye, Search } from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import Navbar from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import EmptyState from '@/components/shared/EmptyState';
import { TableSkeleton } from '@/components/shared/LoadingSkeleton';
import { auditAPI } from '@/services/api';

interface AuditLog {
  id: string;
  timestamp: string;
  ipAddress: string;
  accessType: 'doctor' | 'hospital' | 'emergency' | 'self';
  tokenUsed: string;
  details: string;
}

// const mockLogs: AuditLog[] = [
//   {
//     id: '1',
//     timestamp: '2024-01-15T14:30:00',
//     ipAddress: '192.168.1.100',
//     accessType: 'doctor',
//     tokenUsed: 'doc_abc123',
//     details: 'Dr. Sarah Johnson viewed medical records',
//   },
//   {
//     id: '2',
//     timestamp: '2024-01-15T10:15:00',
//     ipAddress: '10.0.0.50',
//     accessType: 'hospital',
//     tokenUsed: 'hosp_xyz789',
//     details: 'City Hospital uploaded 2 lab reports',
//   },
//   {
//     id: '3',
//     timestamp: '2024-01-14T18:45:00',
//     ipAddress: '203.0.113.25',
//     accessType: 'self',
//     tokenUsed: 'N/A',
//     details: 'Self access - Viewed timeline',
//   },
//   {
//     id: '4',
//     timestamp: '2024-01-14T09:00:00',
//     ipAddress: '198.51.100.10',
//     accessType: 'emergency',
//     tokenUsed: 'ice_def456',
//     details: 'Emergency responder accessed ICE profile',
//   },
//   {
//     id: '5',
//     timestamp: '2024-01-13T16:20:00',
//     ipAddress: '192.168.1.100',
//     accessType: 'doctor',
//     tokenUsed: 'doc_ghi321',
//     details: 'Dr. Michael Chen added clinical note',
//   },
// ];

const Audit: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
  const loadLogs = async () => {
    try {
      setIsLoading(true);

      const response = await auditAPI.getLogs();

      const formatted = response.data.logs.map((log: any) => ({
        id: log._id,
        timestamp: log.accessedAt,
        ipAddress: log.ip,
        accessType: log.accessType || "doctor",
        tokenUsed: log.tokenUsed || "N/A",
        details: log.detailsViewed || "Accessed records",
      }));

      setLogs(formatted);

    } catch (error: any) {
      console.error("Audit Logs Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  loadLogs();
}, []);


  const filteredLogs = logs.filter(
    (log) =>
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.accessType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAccessTypeStyles = (type: string) => {
    switch (type) {
      case 'doctor':
        return 'bg-primary/10 text-primary';
      case 'hospital':
        return 'bg-secondary/10 text-secondary';
      case 'emergency':
        return 'bg-destructive/10 text-destructive';
      case 'self':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getAccessTypeIcon = (type: string) => {
    switch (type) {
      case 'doctor':
        return Eye;
      case 'hospital':
        return Globe;
      case 'emergency':
        return Shield;
      default:
        return Clock;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageContainer
        title="Audit Logs"
        subtitle="Track who accessed your medical records"
        showBack
        backTo="/dashboard"
      >
        {/* Search */}
        <div className="mb-6 animate-fade-in">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <TableSkeleton rows={5} />
        ) : filteredLogs.length === 0 ? (
          <EmptyState
            icon={Shield}
            title="No audit logs"
            description={
              searchQuery
                ? 'No logs match your search'
                : 'Access logs will appear here when someone views your records'
            }
          />
        ) : (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle>Access History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredLogs.map((log, index) => {
                  const Icon = getAccessTypeIcon(log.accessType);
                  return (
                    <div
                      key={log.id}
                      className="p-4 hover:bg-muted/50 transition-colors animate-fade-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getAccessTypeStyles(log.accessType)}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getAccessTypeStyles(log.accessType)}`}>
                              {log.accessType.charAt(0).toUpperCase() + log.accessType.slice(1)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(log.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-foreground mb-1">{log.details}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              {log.ipAddress}
                            </span>
                            {log.tokenUsed !== 'N/A' && (
                              <span>Token: {log.tokenUsed}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </PageContainer>
    </div>
  );
};

export default Audit;
