import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Dumbbell } from 'lucide-react';

type AuthMode = 'welcome' | 'signup' | 'signin' | 'guest';

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('welcome');
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [guestName, setGuestName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signUp, signIn, continueAsGuest } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !phoneNumber.trim() || !password.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    const result = await signUp(username.trim(), phoneNumber.trim(), password);
    setLoading(false);

    if (result.success) {
      toast({
        title: 'Success!',
        description: 'Account created successfully. You can now sign in.',
      });
      setMode('signin');
      setPassword('');
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
    if (!username.trim() || !password.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    const result = await signIn(username.trim(), password);
    setLoading(false);

    if (result.success) {
      toast({
        title: 'Welcome back!',
        description: `Signed in successfully`,
      });
      navigate('/');
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
    navigate('/');
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
          </CardTitle>
          <CardDescription className="text-base">
            {mode === 'welcome' && 'Your fitness journey starts here!'}
            {mode === 'signup' && 'Join us and track your progress'}
            {mode === 'signin' && 'Welcome back! Enter your credentials'}
            {mode === 'guest' && 'Choose a temporary name'}
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
                <Label htmlFor="signup-phone">Phone Number</Label>
                <Input
                  id="signup-phone"
                  type="tel"
                  placeholder="e.g., +919876543210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
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
                <Label htmlFor="signin-username">Username</Label>
                <Input
                  id="signin-username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                onClick={() => {
                  toast({
                    title: 'Password Recovery',
                    description: 'Please contact support with your registered phone number to reset your password.',
                  });
                }}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;