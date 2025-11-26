import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Activity, Loader2, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { authAPI } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const email = location.state?.email || '';

  useEffect(() => {
    if (!email) {
      navigate('/register');
    }
    inputRefs.current[0]?.focus();
  }, [email, navigate]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);

    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      toast({
        title: 'Invalid OTP',
        description: 'Please enter all 6 digits',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.verifyEmail({ email, otp: otpCode });
      const { token, user } = response.data;

      login(token, user);

      toast({
        title: 'Email Verified!',
        description: 'Your account has been verified successfully.',
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Verification Failed',
        description: error.response?.data?.message || 'Invalid OTP code',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      await authAPI.resendOTP(email);
      toast({
        title: 'OTP Resent',
        description: 'A new verification code has been sent to your email.',
      });
    } catch (error: any) {
      toast({
        title: 'Failed to resend OTP',
        description: error.response?.data?.message || 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 medical-gradient-soft opacity-30" />
      
      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-xl medical-gradient flex items-center justify-center">
            <Activity className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-bold text-2xl text-foreground">HealthLog</span>
        </Link>

        <Card className="shadow-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Verify Your Email</CardTitle>
            <CardDescription>
              We've sent a 6-digit code to<br />
              <span className="font-medium text-foreground">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-12 h-14 text-center text-2xl font-semibold rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                ))}
              </div>

              <Button
                type="submit"
                variant="medical"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Verify Email
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Didn't receive the code?
              </p>
              <Button
                variant="ghost"
                onClick={handleResendOTP}
                disabled={isResending}
                className="text-primary"
              >
                {isResending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RotateCw className="h-4 w-4 mr-2" />
                )}
                Resend Code
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;
