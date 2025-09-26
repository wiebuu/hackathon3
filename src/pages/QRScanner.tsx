import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, QrCode, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import QrScanner from 'react-qr-scanner';

const QRScanner = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isScanned, setIsScanned] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");

  const handleScan = async (result: any) => {
    if (result?.text && !isScanned) {
      setIsScanned(true);

      try {
        let studentId: string | null = null;
        let studentName: string | null = null;

        // Try parsing JSON
        try {
          const parsed = JSON.parse(result.text);
          if (parsed.studentId && parsed.studentName) {
            studentId = parsed.studentId;
            studentName = parsed.studentName;
          } else {
            throw new Error("Not a student QR");
          }
        } catch {
          // Fallback: plain string QR
          studentId = result.text;
          studentName = localStorage.getItem('userName') || 'Student';
        }

        if (!studentId || !studentName) throw new Error("Invalid QR code format");

        // Send attendance to backend
        const response = await fetch("http://localhost:9000/api/attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentId, studentName }),
        });

        const data = await response.json();

        if (data.success) {
          toast({
            title: 'Attendance Marked!',
            description: `You have been marked present.`,
          });

          // Show success briefly, then navigate back to dashboard
          setTimeout(() => navigate('/dashboard'), 1500);

        } else {
          throw new Error(data.message || "Failed to mark attendance");
        }
      } catch (err: any) {
        console.error(err);
        toast({
          title: 'Error',
          description: err.message || 'Invalid QR code',
          variant: 'destructive',
        });
        setIsScanned(false);
      }
    }
  };

  const handleError = (err: any) => {
    console.error(err);
    if (err.name === "OverconstrainedError") {
      toast({
        title: 'Back camera not available',
        description: 'Switching to front camera automatically.',
        variant: 'destructive',
      });
      setFacingMode("user");
    } else {
      toast({
        title: 'Camera Error',
        description: 'Unable to access camera. Check permissions.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-md border-b border-border/50 p-6 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <QrCode className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-[Poppins-Bold] text-gradient-primary">
            QR Code Scanner
          </h1>
        </div>
      </div>

      {/* Scanner */}
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
            <div className="relative rounded-xl overflow-hidden shadow-medium">
              <QrScanner
                delay={300}
                style={{ width: '100%' }}
                onError={handleError}
                onScan={handleScan}
                constraints={{ video: { facingMode: { ideal: facingMode } } }}
              />
            </div>
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFacingMode(facingMode === "user" ? "environment" : "user")}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Switch Camera
              </Button>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Camera active: Hold QR in front of your device
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success overlay */}
      {isScanned && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-4 animate-fade-in">
          <Card className="w-full max-w-md card-modern shadow-xl">
            <CardContent className="text-center p-8">
              <div className="mb-8">
                <div className="p-6 bg-success/10 rounded-2xl inline-block mb-6">
                  <CheckCircle2 className="h-24 w-24 text-success" />
                </div>
                <h2 className="text-3xl font-[Poppins-Bold] text-success mb-3">
                  Attendance Marked Successfully!
                </h2>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
