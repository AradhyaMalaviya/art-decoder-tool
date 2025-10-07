import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

export const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = () => {
    signOut();
    toast({
      title: 'Signed out',
      description: 'Come back soon!',
    });
    navigate('/auth');
  };

  if (!user) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-foreground">
            Welcome, <span className="text-primary">{user.username}</span>
            {user.isGuest && <span className="text-muted-foreground text-sm ml-2">(Guest)</span>}
          </span>
        </div>
        
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleSignOut}
          className="gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </header>
  );
};