// LectureDetails.tsx
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Eye,
  Clock,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Student {
  id: string;
  name: string;
  status: 'present' | 'absent' | 'late';
  time?: string;
}

const LectureDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const lecture = state?.lecture;

  const [students] = useState<Student[]>([
    { id: 'ST2024001', name: 'Alex Johnson', status: 'present', time: '09:05 AM' },
    { id: 'ST2024002', name: 'Sarah Williams', status: 'present', time: '09:02 AM' },
    { id: 'ST2024003', name: 'Mike Chen', status: 'late', time: '09:08 AM' },
    { id: 'ST2024004', name: 'Emma Davis', status: 'absent' },
    { id: 'ST2024005', name: 'David Brown', status: 'absent' },
  ]);

  // Dummy QR state (just changes color every 7 seconds)
  const [qrColor, setQrColor] = useState(generateRandomColor());

  function generateRandomColor() {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A8', '#F3FF33'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Auto-change color every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setQrColor(generateRandomColor());
      toast({
        title: 'QR Updated',
        description: 'Dummy QR color changed',
      });
    }, 7000);

    return () => clearInterval(interval);
  }, []);

  const getStatusBadge = (status: Student['status']) => {
    switch (status) {
      case 'present':
        return <Badge className="bg-success/10 text-success px-3 py-1 rounded-full text-xs">Present</Badge>;
      case 'absent':
        return <Badge className="bg-destructive/10 text-destructive px-3 py-1 rounded-full text-xs">Absent</Badge>;
      case 'late':
        return <Badge className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs">Late</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-10 animate-fade-in font-sans">
      {/* Top bar with back + lecture info */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="text-right">
          <h1 className="text-2xl font-semibold">{lecture?.subject}</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-4 mt-1 justify-end">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" /> {lecture?.time}
            </span>
            <span>{lecture?.room}</span>
          </p>
        </div>
      </div>

      {/* Attendance Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="hover-lift text-center">
          <CardContent className="p-4">
            <Users className="h-6 w-6 mx-auto text-primary mb-1" />
            <p className="text-xl font-semibold">{students.length}</p>
            <p className="text-xs text-muted-foreground">Total Students</p>
          </CardContent>
        </Card>
        <Card className="hover-lift text-center">
          <CardContent className="p-4">
            <CheckCircle2 className="h-6 w-6 mx-auto text-success mb-1" />
            <p className="text-xl font-semibold">{students.filter(s => s.status === 'present').length}</p>
            <p className="text-xs text-muted-foreground">Present</p>
          </CardContent>
        </Card>
        <Card className="hover-lift text-center">
          <CardContent className="p-4">
            <XCircle className="h-6 w-6 mx-auto text-destructive mb-1" />
            <p className="text-xl font-semibold">{students.filter(s => s.status === 'absent').length}</p>
            <p className="text-xs text-muted-foreground">Absent</p>
          </CardContent>
        </Card>
      </div>

      {/* Dummy QR + Attendance List */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-0 shadow-md">
        <CardContent className="flex flex-col md:flex-row gap-10 p-8">
          {/* Left: Dummy QR */}
          <div className="flex flex-col justify-center items-center gap-6 md:w-1/3">
            <div
              className="w-80 h-80 rounded-2xl shadow-xl animate-pulse"
              style={{ backgroundColor: qrColor }}
            />
            <p className="text-xs text-muted-foreground mt-2">Auto-refreshing every 7 seconds</p>
          </div>

          {/* Right: Real-time Attendance */}
          <div className="flex-1">
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Eye className="h-5 w-5 text-primary" /> Real-time Attendance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {students.map(student => (
                    <div
                      key={student.id}
                      className="flex items-center justify-between p-4 rounded-xl border bg-white hover:border-primary/40 transition-all shadow-sm"
                    >
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-xs text-muted-foreground">{student.id}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {student.time && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {student.time}
                          </span>
                        )}
                        {getStatusBadge(student.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LectureDetails;
