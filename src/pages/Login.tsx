import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, BookOpen, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [studentCredentials, setStudentCredentials] = useState({ email: '', password: '' });
  const [teacherCredentials, setTeacherCredentials] = useState({ email: '', password: '' });

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Store user type in localStorage for demo
    localStorage.setItem('userType', 'student');
    localStorage.setItem('userName', 'Alex Johnson');
    localStorage.setItem('studentId', 'ST2024001');
    toast({
      title: "Login Successful",
      description: "Welcome back, Alex!",
    });
    navigate('/dashboard');
  };

  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('userType', 'teacher');
    localStorage.setItem('userName', 'Dr. Sarah Wilson');
    localStorage.setItem('teacherId', 'TCH2024001');
    toast({
      title: "Login Successful", 
      description: "Welcome back, Dr. Wilson!",
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4 lg:p-6">
      <div className="w-full max-w-7xl grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Hero Section */}
        <div className="text-center lg:text-left text-white animate-fade-in">
          <div className="flex items-center justify-center lg:justify-start gap-4 mb-8">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
              <GraduationCap className="h-16 w-16" />
            </div>
            <h1 className="text-5xl font-[Poppins-Bold]">EduTrack</h1>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-[Poppins-Bold] mb-6 lg:mb-8 leading-tight">
            Smart Attendance & 
            <span className="block text-white text-accent-light">Student Productivity</span>
          </h2>
          <p className="text-lg lg:text-xl font-[Poppins-Light] opacity-90 mb-8 lg:mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Streamline attendance tracking and boost student productivity with our intelligent platform.
          </p>
          <div className=" font-[Poppins-Light] flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
            <div className="flex items-center gap-4 text-white/90 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="p-2 bg-white/20 rounded-lg">
                <BookOpen className="h-6 w-6" />
              </div>
              <span className="font-[Poppins-Medium]">Real-time Tracking</span>
            </div>
            <div className="flex items-center gap-4 text-white/90 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
              <div className="p-2 bg-white/20 rounded-lg">
                <Users className="h-6 w-6" />
              </div>
              <span className="font-[Poppins-Medium]">Smart Analytics</span>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="w-full max-w-lg mx-auto animate-slide-up">
          <Card className="card-glass shadow-xl border-0">
            <CardHeader className="text-center pb-8">
              <CardTitle className="text-3xl font-[Poppins-Bold] text-foreground mb-3">
                Welcome Back
              </CardTitle>
              <p className="text-muted-foreground text-lg font-[Poppins-Light]">Choose your login type to continue</p>
            </CardHeader>
            <CardContent className="p-8 font-[Poppins-Light]">
              <Tabs defaultValue="student" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-muted/50">
                  <TabsTrigger value="student" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Student</TabsTrigger>
                  <TabsTrigger value="teacher" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Teacher</TabsTrigger>
                </TabsList>
                
                <TabsContent value="student">
                  <form onSubmit={handleStudentLogin} className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="student-email" className="text-base font-[Poppins-Medium]">Student ID / Email</Label>
                      <Input
                        id="student-email"
                        type="text"
                        placeholder="Enter your student ID"
                        value={studentCredentials.email}
                        onChange={(e) => setStudentCredentials({...studentCredentials, email: e.target.value})}
                        className="input-modern"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="student-password" className="text-base font-[Poppins-Medium]">Password</Label>
                      <Input
                        id="student-password"
                        type="password"
                        placeholder="Enter your password"
                        value={studentCredentials.password}
                        onChange={(e) => setStudentCredentials({...studentCredentials, password: e.target.value})}
                        className="input-modern"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full btn-primary-modern text-lg py-4">
                      Sign In as Student
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="teacher">
                  <form onSubmit={handleTeacherLogin} className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="teacher-email" className="text-base font-[Poppins-Medium]">Teacher ID / Email</Label>
                      <Input
                        id="teacher-email"
                        type="text"
                        placeholder="Enter your teacher ID"
                        value={teacherCredentials.email}
                        onChange={(e) => setTeacherCredentials({...teacherCredentials, email: e.target.value})}
                        className="input-modern"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="teacher-password" className="text-base font-[Poppins-Medium]">Password</Label>
                      <Input
                        id="teacher-password"
                        type="password"
                        placeholder="Enter your password"
                        value={teacherCredentials.password}
                        onChange={(e) => setTeacherCredentials({...teacherCredentials, password: e.target.value})}
                        className="input-modern"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full btn-secondary-modern text-lg py-4">
                      Sign In as Teacher
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
              
              <div className="mt-8 text-center">
                <div className="p-4 bg-muted/30 rounded-xl">
                  <p className="text-sm text-muted-foreground font-[Poppins-Medium]">
                    Demo credentials: any email/password combination works
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;