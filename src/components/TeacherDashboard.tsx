import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  Clock,
  MapPin,
  TrendingUp,
  Eye,
  Bell,
  BarChart2,
  CheckCircle2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface Lecture {
  id: string;
  subject: string;
  time: string;
  room: string;
  status: 'upcoming' | 'current' | 'completed';
  enrolledStudents: number;
  attendanceRate?: number;
}

const TeacherDashboard = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [lectures] = useState<Lecture[]>([
    { id: 'L001', subject: 'Mathematics', time: '09:00 AM - 10:30 AM', room: 'Room 101', status: 'completed', enrolledStudents: 25, attendanceRate: 92 },
    { id: 'L002', subject: 'Physics', time: '10:30 AM - 12:00 PM', room: 'Lab 201', status: 'current', enrolledStudents: 28, attendanceRate: 89 },
    { id: 'L003', subject: 'Computer Science', time: '01:00 PM - 02:30 PM', room: 'Room 305', status: 'upcoming', enrolledStudents: 30 },
    { id: 'L004', subject: 'English Literature', time: '02:30 PM - 04:00 PM', room: 'Room 102', status: 'upcoming', enrolledStudents: 22 },
  ]);

  const currentLecture = lectures.find(l => l.status === 'current');

  const handleLectureClick = (lecture: Lecture) => {
    toast({
      title: "Lecture Selected",
      description: `Viewing real-time attendance for ${lecture.subject}`,
    });
    navigate(`/lecture/${lecture.id}`, { state: { lecture } });
  };

  return (
    <div className="container mx-auto p-4 lg:p-8 space-y-8 animate-fade-in">
      
      {/* Quick Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 hover-lift">
          <h3 className="text-sm text-muted-foreground">Total Students</h3>
          <p className="text-2xl font-bold mt-1">105</p>
        </Card>
        <Card className="p-4 hover-lift">
          <h3 className="text-sm text-muted-foreground">Today's Lectures</h3>
          <p className="text-2xl font-bold mt-1">{lectures.length}</p>
        </Card>
        <Card className="p-4 hover-lift">
          <h3 className="text-sm text-muted-foreground">Average Attendance</h3>
          <p className="text-2xl font-bold mt-1">91%</p>
        </Card>
        <Card className="p-4 hover-lift">
          <h3 className="text-sm text-muted-foreground">Upcoming Classes</h3>
          <p className="text-2xl font-bold mt-1">{lectures.filter(l => l.status === 'upcoming').length}</p>
        </Card>
      </div>

      {currentLecture && (
  <Card className="card-modern hover-lift animate-slide-up overflow-hidden">
    <CardHeader className="pb-2 border-b">
      <CardTitle className="flex items-center justify-between w-full text-xl font-semibold">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-6 w-6 text-success" />
          <span>Ongoing Lecture</span>
        </div>
        <Badge className="bg-success/10 text-success px-3 py-1 rounded-full text-xs">
          Live Now
        </Badge>
      </CardTitle>
    </CardHeader>

    <CardContent className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      {/* Left side lecture info */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{currentLecture.subject}</h3>
        <div className="flex items-center gap-4 text-muted-foreground text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            {currentLecture.time}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {currentLecture.room}
          </div>
        </div>
        <p className="text-sm mt-1 text-muted-foreground">
          <TrendingUp className="inline h-4 w-4 mr-1 text-primary" />
          {currentLecture.attendanceRate}% attendance
        </p>
      </div>

      {/* Right side action */}
      <div className="flex flex-col items-center gap-3">
        <button 
          onClick={() => handleLectureClick(currentLecture)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
        >
          View Attendance
        </button>
        <p className="text-xs text-muted-foreground">Monitor in real-time</p>
      </div>
    </CardContent>
  </Card>
)}


      {/* Today's Lectures */}
      <Card className="card-modern hover-lift animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <BookOpen className="h-6 w-6 text-primary" />
            Today's Lectures
          </CardTitle>
          <p className="text-muted-foreground text-base">
            Click on any lecture to view details and real-time attendance
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lectures.map((lecture) => (
              <div
                key={lecture.id}
                onClick={() => handleLectureClick(lecture)}
                className="p-6 rounded-xl border-2 border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer hover-lift"
              >
                <div className="flex items-center justify-between mb-4">
                  <Badge>{lecture.status}</Badge>
                  <Eye className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{lecture.subject}</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {lecture.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {lecture.room}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {lecture.enrolledStudents} students
                  </div>
                  {lecture.attendanceRate && (
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      {lecture.attendanceRate}% attendance
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>


      {/* Insights Section */}
      <Card className="card-modern hover-lift animate-slide-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <BarChart2 className="h-6 w-6 text-primary" />
            Engagement Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">✅ Highest attendance this week: Mathematics (92%)</p>
          <p className="text-sm">⚠️ Lowest attendance this week: English Literature (65%)</p>
        </CardContent>
      </Card>

    </div>
  );
};

export default TeacherDashboard;
