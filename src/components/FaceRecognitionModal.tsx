import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Camera, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FaceRecognitionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const FaceRecognitionModal = ({ isOpen, onClose, onSuccess }: FaceRecognitionModalProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState<'select' | 'camera' | 'upload' | 'processing' | 'success'>('select');

  const handleCameraCapture = () => {
    setStep('camera');
    // Simulate camera capture
    setTimeout(() => {
      setStep('processing');
      setTimeout(() => {
        setStep('success');
        setTimeout(() => {
          handleSuccess();
        }, 2000);
      }, 3000);
    }, 2000);
  };

  const handleFileUpload = () => {
    setStep('upload');
    // Simulate file upload
    setTimeout(() => {
      setStep('processing');
      setTimeout(() => {
        setStep('success');
        setTimeout(() => {
          handleSuccess();
        }, 2000);
      }, 3000);
    }, 1000);
  };

  const handleSuccess = () => {
    const attendanceData = {
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(),
      method: 'face_recognition',
      status: 'present'
    };

    const existingHistory = JSON.parse(localStorage.getItem('attendanceHistory') || '[]');
    existingHistory.push(attendanceData);
    localStorage.setItem('attendanceHistory', JSON.stringify(existingHistory));

    toast({
      title: "Face Match",
      description: "Attendance recorded successfully via Face Recognition",
    });

    onSuccess();
    onClose();
    setStep('select');
  };

  const handleClose = () => {
    onClose();
    setStep('select');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-card/95 backdrop-blur-md border border-border/50 shadow-xl">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Camera className="h-6 w-6 text-primary" />
            </div>
            Face Recognition Attendance
          </DialogTitle>
        </DialogHeader>

        {step === 'select' && (
          <div className="space-y-6 p-2">
            <p className="text-base text-muted-foreground text-center">
              Choose how you'd like to capture your face for attendance
            </p>
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={handleCameraCapture}
                className="h-24 flex flex-col items-center gap-3 hover-lift"
                variant="outline"
              >
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Camera className="h-8 w-8 text-primary" />
                </div>
                <span className="text-sm font-medium">Use Camera</span>
              </Button>
              <Button
                onClick={handleFileUpload}
                className="h-24 flex flex-col items-center gap-3 hover-lift"
                variant="outline"
              >
                <div className="p-3 bg-accent/10 rounded-xl">
                  <Upload className="h-8 w-8 text-accent" />
                </div>
                <span className="text-sm font-medium">Upload Photo</span>
              </Button>
            </div>
          </div>
        )}

        {step === 'camera' && (
          <div className="space-y-6 p-2">
            <div className="bg-gradient-card rounded-2xl p-8 text-center shadow-medium">
              <div className="p-4 bg-primary/10 rounded-2xl inline-block mb-4">
                <Camera className="h-20 w-20 text-primary" />
              </div>
              <p className="text-base font-medium text-foreground mb-2">Camera is active...</p>
              <p className="text-sm text-muted-foreground">Position your face in the frame</p>
            </div>
            <div className="flex justify-center">
              <div className="w-6 h-6 bg-gradient-primary rounded-full animate-pulse shadow-medium"></div>
            </div>
          </div>
        )}

        {step === 'upload' && (
          <div className="space-y-6 p-2">
            <div className="bg-gradient-card rounded-2xl p-8 text-center border-2 border-dashed border-border shadow-medium">
              <div className="p-4 bg-accent/10 rounded-2xl inline-block mb-4">
                <Upload className="h-20 w-20 text-accent" />
              </div>
              <p className="text-base font-medium text-foreground">Processing uploaded image...</p>
            </div>
            <div className="flex justify-center">
              <div className="w-6 h-6 bg-gradient-accent rounded-full animate-pulse shadow-medium"></div>
            </div>
          </div>
        )}

        {step === 'processing' && (
          <div className="space-y-6 p-2">
            <div className="bg-gradient-card rounded-2xl p-8 text-center shadow-medium">
              <div className="w-20 h-20 mx-auto mb-6 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-medium"></div>
              <p className="text-lg font-semibold text-foreground mb-2">Analyzing face...</p>
              <p className="text-sm text-muted-foreground">Matching with student database</p>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="space-y-6 p-2">
            <div className="bg-success/10 rounded-2xl p-8 text-center shadow-medium">
              <div className="p-4 bg-success/20 rounded-2xl inline-block mb-4">
                <CheckCircle2 className="h-20 w-20 text-success" />
              </div>
              <p className="text-xl font-bold text-success mb-2">Face Match Successful!</p>
              <p className="text-base text-muted-foreground">Attendance has been recorded</p>
            </div>
          </div>
        )}

        {step === 'select' && (
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={handleClose} className="hover-lift">
              Cancel
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FaceRecognitionModal;