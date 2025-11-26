import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Shield, Clock, FileText, Smartphone, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';

const features = [
  {
    icon: FileText,
    title: 'Digital Health Records',
    description: 'Store and access all your medical records in one secure place.',
  },
  {
    icon: Shield,
    title: 'Privacy & Security',
    description: 'Your data is encrypted and protected with hospital-grade security.',
  },
  {
    icon: Clock,
    title: 'Medical Timeline',
    description: 'Visualize your complete health journey with an interactive timeline.',
  },
  {
    icon: Smartphone,
    title: 'QR Code Access',
    description: 'Share records instantly with doctors via secure QR codes.',
  },
  {
    icon: Heart,
    title: 'Emergency Profile',
    description: 'Critical health info accessible by first responders when needed.',
  },
  {
    icon: Activity,
    title: 'Health Insights',
    description: 'Track and understand your health patterns over time.',
  },
];

const Index: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-gradient opacity-5" />
        <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Activity className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Your Health, Digitized</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Your Medical Records,{' '}
              <span className="text-primary">Always Accessible</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              HealthLog securely stores your medical history, making it easy to share with healthcare providers and access in emergencies.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button variant="medical" size="lg">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button variant="medical" size="lg">
                      Get Started Free
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="lg">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A comprehensive platform designed to manage your complete medical journey.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                hover
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="medical-gradient overflow-hidden">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
                Take Control of Your Health Data
              </h2>
              <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
                Join thousands of patients who trust HealthLog for secure, accessible medical records.
              </p>
              <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                <Button
                  size="lg"
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                  {isAuthenticated ? 'Go to Dashboard' : 'Create Your Account'}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg medical-gradient flex items-center justify-center">
                <Activity className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">HealthLog</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 HealthLog. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
