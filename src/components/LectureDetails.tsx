import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, CheckCircle2, XCircle, ArrowLeft, Eye, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QRCode from 'react-qr-code';

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

  const [students, setStudents] = useState<Student[]>([]);
  const [qrValue, setQrValue] = useState('');

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

  const handleMarkAbsent = (id: string) => {
    setStudents(prev =>
      prev.map(student =>
        student.id === id ? { ...student, status: 'absent', time: undefined } : student
      )
    );
    toast({
      title: 'Attendance Updated',
      description: 'The student has been marked as absent.',
    });
  };

  const fetchAttendance = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/attendance`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (Array.isArray(data)) {
        const fetchedStudents: Student[] = data.map((r: any) => ({
          id: r.studentId,
          name: r.studentName,
          status: r.status,
          time: r.time,
        }));
  
        setStudents(fetchedStudents);
      }
    } catch (err: any) {
      console.error('Failed to fetch attendance:', err.message);
    }
  };
  
  

  // Refresh QR and attendance every 5 seconds
  useEffect(() => {
    fetchAttendance(); // Initial fetch
    const interval = setInterval(() => {
      // Update QR with timestamp to change every 5s
      setQrValue(JSON.stringify({ lectureId: lecture?.id, timestamp: new Date().getTime() }));

      // Refresh attendance list
      fetchAttendance();
    }, 5000);

    return () => clearInterval(interval);
  }, [lecture]);

  // Set initial QR
  useEffect(() => {
    setQrValue(JSON.stringify({ lectureId: lecture?.id, timestamp: new Date().getTime() }));
  }, [lecture]);

  return (
    <div className="container mx-auto p-6 space-y-10 animate-fade-in font-sans">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="text-right">
          <h1 className="text-2xl font-semibold">{lecture?.subject || 'Mathematics'}</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-4 mt-1 justify-end">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" /> {lecture?.time || '09:00 AM'}
            </span>
            <span>{lecture?.room || 'Room 101'}</span>
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

      {/* QR Code & Attendance List */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-0 shadow-md">
        <CardContent className="flex flex-col md:flex-row gap-10 p-8 items-center justify-center">
          <div className="flex flex-col justify-center items-center gap-6">
            <QRCode value={qrValue} size={240} className="rounded-2xl shadow-xl" />
            <p className="text-xs text-muted-foreground mt-2">
              Students scan this QR using their login to mark attendance
            </p>
          </div>

          {/* Right: Attendance List */}
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
                        {(student.status === 'present' || student.status === 'late') && (
                          <button
                            onClick={() => handleMarkAbsent(student.id)}
                            className="text-destructive hover:text-red-600 p-1 rounded-full transition text-lg"
                          >
                            ✕
                          </button>
                        )}
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
