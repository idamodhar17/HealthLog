import React from 'react';
import {
  FileText,
  Upload,
  Clock,
  QrCode,
  Building2,
  Heart,
  Shield,
  LogOut,
} from 'lucide-react';
import PageContainer from '@/components/layout/PageContainer';
import Navbar from '@/components/layout/Navbar';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';

const dashboardItems = [
  {
    title: 'View My Records',
    description: 'Access and manage all your medical records in one place.',
    icon: FileText,
    to: '/records',
    gradient: true,
  },
  {
    title: 'Upload Report',
    description: 'Add new medical reports, prescriptions, or lab results.',
    icon: Upload,
    to: '/upload',
    gradient: false,
  },
  {
    title: 'Medical Timeline',
    description: 'View your complete health journey chronologically.',
    icon: Clock,
    to: '/timeline',
    gradient: true,
  },
  {
    title: 'Doctor QR Code',
    description: 'Generate a secure QR for doctors to access your records.',
    icon: QrCode,
    to: '/qr/doctor',
    gradient: false,
  },
  {
    title: 'Hospital Upload QR',
    description: 'Let hospitals upload reports directly to your account.',
    icon: Building2,
    to: '/qr/hospital',
    gradient: false,
  },
  {
    title: 'Emergency Profile',
    description: 'Set up critical info accessible by first responders.',
    icon: Heart,
    to: '/ice/profile',
    gradient: true,
  },
  {
    title: 'Emergency QR',
    description: 'Generate QR for emergency medical information access.',
    icon: Shield,
    to: '/ice/qr',
    gradient: false,
  },
  {
    title: 'Audit Logs',
    description: 'Track who accessed your medical records and when.',
    icon: Shield,
    to: '/audit',
    gradient: true,
  },
  {
  title: 'AI Health Summary',
  description: 'Generate an AI-powered summary of your medical reports.',
  icon: FileText,
  to: '/ai/summary',
  gradient: false,
},
];

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageContainer>
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <Card className="medical-gradient overflow-hidden">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
                    Welcome back, {user?.name?.split(' ')[0] || 'Patient'}!
                  </h1>
                  <p className="text-primary-foreground/80">
                    Manage your health records securely from your dashboard.
                  </p>
                </div>
                <div className="flex items-center gap-4 text-primary-foreground/70">
                  {/* <div className="text-right">
                    <p className="text-sm">Your Health Score</p>
                    <p className="text-3xl font-bold text-primary-foreground">95%</p>
                  </div> */}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dashboardItems.map((item, index) => (
            <div
              key={item.to}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <DashboardCard
                title={item.title}
                description={item.description}
                icon={item.icon}
                to={item.to}
                gradient={item.gradient}
              />
            </div>
          ))}
        </div>
      </PageContainer>
    </div>
  );
};

export default Dashboard;
