import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, LogOut, Settings, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NavbarProps {
  userName: string;
  userType: string;
}

const Navbar = ({ userName, userType }: NavbarProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const handleLogout = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('userName');
    localStorage.removeItem('studentId');
    localStorage.removeItem('teacherId');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border/50 shadow-soft font-sans">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 hover-lift">
              <div className="p-2 bg-gradient-primary rounded-xl shadow-medium">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-gradient-primary">EduTrack</span>
            </div>
            <Badge 
              variant={userType === 'student' ? 'default' : 'secondary'} 
              className="ml-2 px-3 py-1 text-sm font-light shadow-soft hover:shadow-medium transition-all duration-300"
            >
              {userType === 'student' ? 'Student' : 'Teacher'}
            </Badge>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-6 font-light">
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-4 px-4 py-2 rounded-xl hover:bg-muted/50 transition-all duration-300 hover-lift">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{userName}</p>
                    <p className="text-xs text-muted-foreground font-light">
                      {userType === 'student' ? localStorage.getItem('studentId') : localStorage.getItem('teacherId')}
                    </p>
                  </div>
                  <Avatar className="h-10 w-10 ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-300">
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground text-sm font-semibold shadow-medium">
                      {getInitials(userName)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-2 bg-card/95 backdrop-blur-md border border-border/50 shadow-large rounded-xl">
                <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted/50 transition-all duration-200 cursor-pointer">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-light">Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-muted/50 transition-all duration-200 cursor-pointer">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Settings className="h-4 w-4 text-accent" />
                  </div>
                  <span className="font-light">Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-destructive/10 transition-all duration-200 cursor-pointer text-destructive focus:text-destructive"
                >
                  <div className="p-2 bg-destructive/10 rounded-lg">
                    <LogOut className="h-4 w-4 text-destructive" />
                  </div>
                  <span className="font-light">Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
