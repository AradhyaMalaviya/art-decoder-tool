import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Dumbbell } from 'lucide-react';

type AuthMode = 'welcome' | 'signup' | 'signin' | 'guest' | 'forgot';

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('welcome');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [guestName, setGuestName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signUp, signIn, resetPassword, continueAsGuest } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !fullName.trim() || !username.trim() || !password.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    const result = await signUp(email.trim(), fullName.trim(), username.trim(), password);
    setLoading(false);

    if (result.success) {
      toast({
        title: 'Welcome to FitBox! 🎉',
        description: 'Your account has been created successfully.',
      });
      navigate('/dashboard');
    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    const result = await signIn(email.trim(), password);
    setLoading(false);

    if (result.success) {
      toast({
        title: 'Welcome back!',
        description: `Signed in successfully`,
      });
      navigate('/dashboard');
    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    }
  };

  const handleGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a name',
        variant: 'destructive',
      });
      return;
    }

    continueAsGuest(guestName.trim());
    toast({
      title: 'Welcome! 🎉',
      description: `Continuing as ${guestName}`,
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-fitness-green/20 flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-2xl border-primary/20">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Dumbbell className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">
            {mode === 'welcome' && 'Welcome to FitBox'}
            {mode === 'signup' && 'Create Account'}
            {mode === 'signin' && 'Sign In'}
            {mode === 'guest' && 'Continue as Guest'}
            {mode === 'forgot' && 'Reset Password'}
          </CardTitle>
          <CardDescription className="text-base">
            {mode === 'welcome' && 'Your fitness journey starts here!'}
            {mode === 'signup' && 'Join us and track your progress'}
            {mode === 'signin' && 'Welcome back! Enter your credentials'}
            {mode === 'guest' && 'Choose a temporary name'}
            {mode === 'forgot' && 'Enter your registered email'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {mode === 'welcome' && (
            <div className="space-y-3">
              <Button 
                className="w-full h-12 text-lg" 
                onClick={() => setMode('signup')}
              >
                Sign Up
              </Button>
              <Button 
                className="w-full h-12 text-lg" 
                variant="outline"
                onClick={() => setMode('signin')}
              >
                Sign In
              </Button>
              <Button 
                className="w-full h-12 text-lg" 
                variant="secondary"
                onClick={() => setMode('guest')}
              >
                Continue as Guest
              </Button>
            </div>
          )}

          {mode === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-fullname">Full Name</Label>
                <Input
                  id="signup-fullname"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-username">Username</Label>
                <Input
                  id="signup-username"
                  type="text"
                  placeholder="Choose a username (3-30 characters)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Create a password (min 8 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2 pt-2">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full" 
                  onClick={() => setMode('welcome')}
                  disabled={loading}
                >
                  Back
                </Button>
              </div>
            </form>
          )}

          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <button
                type="button"
                className="text-sm text-primary hover:underline"
                onClick={() => setMode('forgot')}
              >
                Forgot password?
              </button>
              <div className="space-y-2 pt-2">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full" 
                  onClick={() => setMode('welcome')}
                  disabled={loading}
                >
                  Back
                </Button>
              </div>
            </form>
          )}

          {mode === 'guest' && (
            <form onSubmit={handleGuest} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="guest-name">Display Name</Label>
                <Input
                  id="guest-name"
                  type="text"
                  placeholder="What should we call you?"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Note: Your progress won't be saved as a guest
              </p>
              <div className="space-y-2 pt-2">
                <Button type="submit" className="w-full">
                  Continue
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="w-full" 
                  onClick={() => setMode('welcome')}
                >
                  Back
                </Button>
              </div>
            </form>
          )}

          {mode === 'forgot' && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!email.trim()) {
                  toast({
                    title: 'Error',
                    description: 'Please enter your email',
                    variant: 'destructive',
                  });
                  return;
                }
                setLoading(true);
                const result = await resetPassword(email.trim());
                setLoading(false);
                if (result.success) {
                  toast({
                    title: 'Check your inbox',
                    description: `We sent a password reset link to ${email.trim()}.`,
                  });
                  setMode('signin');
                } else {
                  toast({
                    title: 'Error',
                    description: result.error ?? 'Could not send reset email.',
                    variant: 'destructive',
                  });
                }
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="recovery-email">Email</Label>
                <Input
                  id="recovery-email"
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                We&apos;ll email you a link to choose a new password.
              </p>
              <div className="space-y-2 pt-2">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Sending...' : 'Send reset link'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => setMode('signin')}
                  disabled={loading}
                >
                  Back to Sign In
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;