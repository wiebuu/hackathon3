import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  QrCode, 
  Target,
  TrendingUp,
  BookOpen,
  Coffee,
  Dumbbell,
  Brain,
  Wifi,
  Camera,
  History
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import FaceRecognitionModal from './FaceRecognitionModal';

type AttendanceRecord = {
  date: string;
  time: string;
  method: 'qr_code' | 'proximity' | 'face_recognition' | string;
  status: 'present' | 'absent' | string;
  lecture?: string;
};

type ScheduleItem = {
  time: string; // e.g. "09:00 AM"
  subject: string;
  room: string;
  status?: 'completed' | 'current' | 'upcoming' | string;
};

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [todayAttendance, setTodayAttendance] = useState(false);
  const [attendancePercentage] = useState(85);
  const [attendanceMethod, setAttendanceMethod] = useState('');
  const [showFaceModal, setShowFaceModal] = useState(false);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
  const [currentLecture, setCurrentLecture] = useState<ScheduleItem | null>(null);
  const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);

  const tasks = [
    { id: 1, title: 'Review Math Chapter 5', type: 'Study', duration: '30 min', priority: 'high', icon: Brain },
    { id: 2, title: 'Complete Physics Lab Report', type: 'Assignment', duration: '45 min', priority: 'high', icon: BookOpen },
    { id: 3, title: 'Take a 10-minute break', type: 'Break', duration: '10 min', priority: 'medium', icon: Coffee },
    { id: 4, title: 'Practice coding problems', type: 'Practice', duration: '25 min', priority: 'medium', icon: Target },
    { id: 5, title: 'Light exercise session', type: 'Health', duration: '20 min', priority: 'low', icon: Dumbbell },
  ];

  const schedule: ScheduleItem[] = [
    { time: '09:00 AM', subject: 'Mathematics', room: 'Room 101', status: 'completed' },
    { time: '10:30 AM', subject: 'Physics', room: 'Lab 201', status: 'current' },
    { time: '12:00 PM', subject: 'Free Period', room: '-', status: 'upcoming' },
    { time: '01:00 PM', subject: 'Computer Science', room: 'Room 305', status: 'upcoming' },
    { time: '02:30 PM', subject: 'English', room: 'Room 102', status: 'upcoming' },
  ];

  // Convert "hh:mm AM/PM" to minutes since midnight
  const parseTimeToMinutes = (timeStr: string) => {
    const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (!match) return null;
    let hour = parseInt(match[1], 10);
    const minute = parseInt(match[2], 10);
    const period = match[3].toUpperCase();
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;
    return hour * 60 + minute;
  };

  // Detect current lecture based on time
  const detectCurrentLecture = (sched: ScheduleItem[]) => {
    const nowMins = new Date().getHours() * 60 + new Date().getMinutes();
    const current = sched.find(item => {
      const start = parseTimeToMinutes(item.time);
      if (start === null) return false;
      return nowMins >= start && nowMins < start + 60; // default 60min
    });
    return current || null;
  };

  const markAttendance = (method: AttendanceRecord['method'], lecture?: string) => {
    const now = new Date();
    const record: AttendanceRecord = {
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString(),
      method,
      status: 'present',
      lecture,
    };

    const existingHistory: AttendanceRecord[] = JSON.parse(localStorage.getItem('attendanceHistory') || '[]');
    existingHistory.push(record);
    localStorage.setItem('attendanceHistory', JSON.stringify(existingHistory));

    setTodayAttendance(true);
    setAttendanceMethod(method);
    setAttendanceHistory(existingHistory.slice(-5));
    setTodayRecord(record);

    toast({ title: `Marked via ${getMethodName(method)}`, description: 'Attendance recorded successfully' });
  };

  const handleFaceRecognitionSuccess = () => {
    markAttendance('face_recognition', currentLecture?.subject);
    setShowFaceModal(false);
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'qr_code': return <QrCode className="h-4 w-4" />;
      case 'proximity': return <Wifi className="h-4 w-4" />;
      case 'face_recognition': return <Camera className="h-4 w-4" />;
      default: return <QrCode className="h-4 w-4" />;
    }
  };

  const getMethodName = (method: string) => {
    switch (method) {
      case 'qr_code': return 'QR Code';
      case 'proximity': return 'Proximity';
      case 'face_recognition': return 'Face Recognition';
      default: return 'Unknown';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive';
      case 'medium': return 'bg-warning';
      case 'low': return 'bg-success';
      default: return 'bg-muted';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'current': return 'text-primary';
      case 'upcoming': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  useEffect(() => {
    const storedHistory: AttendanceRecord[] = JSON.parse(localStorage.getItem('attendanceHistory') || '[]');
    const today = new Date().toISOString().split('T')[0];
    const todaysRecords = storedHistory.filter(r => r.date === today);
    const latestToday = todaysRecords[todaysRecords.length - 1] || null;

    setTodayAttendance(!!latestToday);
    setAttendanceMethod(latestToday?.method || '');
    setAttendanceHistory(storedHistory.slice(-5));
    setTodayRecord(latestToday);
    setCurrentLecture(detectCurrentLecture(schedule));
  }, []);

  const handleScanQrFromDashboard = () => {
    navigate('/qr-scanner', { state: { lecture: currentLecture }});
  };

  return (
    <div className="container mx-auto p-4 lg:p-8 space-y-6 lg:space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-hero rounded-2xl p-6 lg:p-8 text-white shadow-large hover-glow transition-all duration-500">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Calendar className="h-8 w-8" />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-3xl lg:text-4xl font-[Poppins-Bold] mb-2">
              Good morning, {localStorage.getItem('userName')?.split(' ')[0]}!
            </h1>
            <p className="text-white/90 text-base lg:text-lg">
              Ready to make today productive? Here's your personalized dashboard.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Attendance Section */}
        <div className="lg:col-span-1 space-y-8">
          {/* Current Lecture Attendance */}
          <Card className="card-modern font-[Poppins-Light] hover-lift animate-slide-up">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                Current Lecture
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6 text-center">
                {currentLecture && (
                  <div className="p-4 bg-muted/10 rounded-xl text-left">
                    <p className="text-xs text-muted-foreground">Now Running</p>
                    <h3 className="font-[Poppins-Bold] text-lg mt-1">{currentLecture.subject}</h3>
                    <p className="text-sm text-muted-foreground">{currentLecture.time} • {currentLecture.room}</p>
                  </div>
                )}
                <Button onClick={handleScanQrFromDashboard} className="w-full btn-primary-modern">
                  <QrCode className="h-5 w-5 mr-3" />
                  Scan QR to Mark Attendance
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Overview */}
          <Card className="font-[Poppins-Light] card-modern hover-lift animate-slide-up">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                Attendance Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="text-center">
                <div className="text-4xl font-[Poppins-Bold] text-gradient-primary mb-2">{attendancePercentage}%</div>
                <p className="text-sm text-muted-foreground font-[Poppins-Light]">Overall Attendance</p>
              </div>
              <Progress value={attendancePercentage} className="h-3 bg-muted" />
            </CardContent>
          </Card>

          {/* Attendance History */}
          <Card className="card-modern font-[Poppins-Light] hover-lift animate-slide-up">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <History className="h-6 w-6 text-secondary" />
                </div>
                Recent Attendance
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {attendanceHistory.length > 0 ? (
                <div className="space-y-3">
                  {attendanceHistory.map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">{getMethodIcon(record.method)}</div>
                        <div>
                          <span className="text-sm font-[Poppins-Light] block">{record.date}</span>
                          {record.lecture && <span className="text-xs text-muted-foreground block">{record.lecture}</span>}
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">{getMethodName(record.method)}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <History className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No attendance records yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="xl:col-span-2 space-y-6 lg:space-y-8">
          {/* Schedule */}
          <Card className="card-modern hover-lift font-[Poppins-Light] animate-slide-up">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Clock className="h-6 w-6 text-accent" />
                </div>
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {schedule.map((item, index) => {
                const nowMins = new Date().getHours() * 60 + new Date().getMinutes();
                const start = parseTimeToMinutes(item.time) ?? 0;
                const duration = 60;
                let computedStatus: ScheduleItem['status'] = 'upcoming';
                if (nowMins >= start && nowMins < start + duration) computedStatus = 'current';
                else if (nowMins >= start + duration) computedStatus = 'completed';

                return (
                  <div key={index} className="flex items-center gap-6 p-4 rounded-xl border border-border/50 hover:border-border hover:shadow-soft transition-all duration-300">
                    <div className="text-center min-w-24 p-3 bg-muted/30 rounded-xl">
                      <p className="text-sm font-semibold">{item.time}</p>
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold text-lg ${getStatusColor(computedStatus)}`}>{item.subject}</h4>
                      {item.room !== '-' && <p className="text-sm text-muted-foreground mt-1">{item.room}</p>}
                    </div>
                    <Badge variant={computedStatus === 'completed' ? 'default' : computedStatus === 'current' ? 'secondary' : 'outline'} className="capitalize px-4 py-2 text-sm font-[Poppins-Light]">{computedStatus}</Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Tasks */}
          <Card className="font-[Poppins-Light] card-modern hover-lift animate-slide-up">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                Personalized Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {tasks.map(task => (
                <div key={task.id} className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-all duration-300 hover-lift">
                  <div className={`w-2 h-16 rounded-full ${getPriorityColor(task.priority)} shadow-soft`}></div>
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <task.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-2">{task.title}</h4>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs px-3 py-1">{task.type}</Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-2"><Clock className="h-4 w-4" />{task.duration}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="hover-lift">Start</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Face Recognition Modal */}
      <FaceRecognitionModal 
        isOpen={showFaceModal}
        onClose={() => setShowFaceModal(false)}
        onSuccess={handleFaceRecognitionSuccess}
      />
    </div>
  );
};

export default StudentDashboard;
