import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2, QrCode } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QrScanner from 'react-qr-scanner'; // ✅ correct package

const QRScanner = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isScanned, setIsScanned] = useState(false);

  const handleScan = (result: any) => {
    if (result?.text && !isScanned) {
      setIsScanned(true);

      try {
        // teacher's QR encodes lectureId & timestamp
        const parsed = JSON.parse(result.text);

        const attendanceData = {
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString(),
          status: 'present',
          studentId: localStorage.getItem('studentId'),
          studentName: localStorage.getItem('userName'),
          lectureId: parsed.lectureId,
        };

        // Save locally (demo mode)
        const existing = JSON.parse(localStorage.getItem('attendanceHistory') || '[]');
        existing.push(attendanceData);
        localStorage.setItem('attendanceHistory', JSON.stringify(existing));

        toast({
          title: 'Attendance Marked!',
          description: 'You have been marked present.',
        });

        setTimeout(() => navigate('/dashboard'), 2000);
      } catch (err) {
        toast({
          title: 'Invalid QR Code',
          description: 'This QR could not be processed.',
          variant: 'destructive',
        });
        setIsScanned(false);
      }
    }
  };

  const handleError = (err: any) => {
    console.error(err);
    toast({
      title: 'Camera Error',
      description: 'Unable to access camera. Check permissions.',
      variant: 'destructive',
    });
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
                You have been marked present for today&apos;s class.
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
            <h1 className="text-2xl font-[Poppins-Bold] text-gradient-primary">
              QR Code Scanner
            </h1>
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
            {/* Real QR Scanner */}
            <div className="relative rounded-xl overflow-hidden shadow-medium">
              <QrScanner
                delay={300}            // scan every 300ms
                style={{ width: '100%' }}
                onError={handleError}
                onScan={handleScan}
              />
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Camera active: Hold QR in front of your device
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QRScanner;
