import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Camera, CheckCircle2, QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const QRScanner = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [isScanned, setIsScanned] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false);
      setIsScanned(true);
      
      // Save attendance to localStorage for offline mode demo
      const attendanceData = {
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString(),
        status: 'present',
        studentId: localStorage.getItem('studentId'),
        studentName: localStorage.getItem('userName'),
      };
      
      const existingAttendance = JSON.parse(localStorage.getItem('attendanceHistory') || '[]');
      existingAttendance.push(attendanceData);
      localStorage.setItem('attendanceHistory', JSON.stringify(existingAttendance));
      
      toast({
        title: "Attendance Marked!",
        description: "Your attendance has been recorded successfully.",
      });
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }, 3000);
  };

  if (isScanned) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 animate-fade-in">
        <Card className="w-full max-w-md card-modern shadow-xl">
          <CardContent className="text-center p-8">
            <div className="mb-8">
              <div className="p-6 bg-success/10 rounded-2xl inline-block mb-6">
                <CheckCircle2 className="h-24 w-24 text-success" />
              </div>
              <h2 className="text-3xl font-[Poppins-Bold] text-success mb-3">
                Attendance Marked Successfully!
              </h2>
              <p className="text-muted-foreground text-lg">
                You have been marked present for today's class.
              </p>
            </div>
            <div className="bg-gradient-card rounded-xl p-6 mb-8 shadow-medium">
              <p className="text-sm text-muted-foreground mb-2">
                <span className="font-semibold">Time:</span> {new Date().toLocaleTimeString()}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">Date:</span> {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <p>Redirecting to dashboard...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-md border-b border-border/50 p-6 shadow-soft">
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-3 hover-lift"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <QrCode className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-[Poppins-Bold] text-gradient-primary">QR Code Scanner</h1>
          </div>
        </div>
      </div>

      {/* Scanner Interface */}
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)] p-4 lg:p-6">
        <Card className="w-full max-w-md lg:max-w-lg card-modern shadow-xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="flex items-center justify-center gap-3 text-2xl lg:text-3xl mb-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <QrCode className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
              </div>
              Scan QR Code
            </CardTitle>
            <p className="text-muted-foreground text-base lg:text-lg">
              Position the QR code within the frame to mark your attendance
            </p>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            {/* Camera Simulation */}
            <div className="relative">
              <div className="aspect-square bg-gradient-card rounded-2xl border-2 border-dashed border-border flex items-center justify-center shadow-medium">
                {isScanning ? (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto mb-6 shadow-medium"></div>
                    <p className="text-base font-medium text-foreground">Scanning...</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="p-6 bg-primary/10 rounded-2xl inline-block mb-6">
                      <Camera className="h-20 w-20 text-primary" />
                    </div>
                    <p className="text-base font-medium text-muted-foreground">Camera will appear here</p>
                  </div>
                )}
              </div>
              
              {/* Scanning Frame Overlay */}
              <div className="absolute inset-6 border-2 border-primary rounded-xl opacity-60">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl"></div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-gradient-card rounded-xl p-6 shadow-medium">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Instructions:
              </h3>
              <ul className="text-sm text-muted-foreground space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  Position your device camera over the QR code
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  Keep the code within the scanning frame
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-1 h-1 bg-primary rounded-full"></div>
                  Hold steady until scanning completes
                </li>
              </ul>
            </div>

            {/* Action Button */}
            <Button
              onClick={handleScan}
              disabled={isScanning}
              className="w-full btn-primary-modern text-lg py-4"
              size="lg"
            >
              {isScanning ? 'Scanning...' : 'Start Scanning'}
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Demo mode: Scan simulation will complete automatically
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QRScanner;