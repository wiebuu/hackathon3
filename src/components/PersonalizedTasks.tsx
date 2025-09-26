import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, X, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface Task {
  title: string;
  type: 'Study' | 'Health' | 'Exercise' | 'Break' | 'Other';
  duration: string;
  priority: 'high' | 'medium' | 'low';
  description?: string;
}

const dummyTasks: Task[] = [
  {
    title: 'Revise Algebra',
    type: 'Study',
    duration: '30 min',
    priority: 'high',
    description: 'Go through algebra formulas and solve 5 practice problems.',
  },
  {
    title: 'Stretching Routine',
    type: 'Exercise',
    duration: '15 min',
    priority: 'medium',
    description: 'Do a light stretching session to relax muscles.',
  },
  {
    title: 'Read a Science Article',
    type: 'Study',
    duration: '20 min',
    priority: 'low',
    description: 'Pick any science-related article and summarize it.',
  },
  {
    title: 'Take a Break',
    type: 'Break',
    duration: '10 min',
    priority: 'medium',
    description: 'Step away from the screen and relax.',
  },
  {
    title: 'Drink Water',
    type: 'Health',
    duration: '5 min',
    priority: 'low',
    description: 'Hydrate yourself before resuming tasks.',
  },
];

const PersonalizedTasks = () => {
  const [tasks] = useState<Task[]>(dummyTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const navigate = useNavigate();
  const { subject = 'general' } = useParams<{ subject?: string }>();

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  // Disable background scroll when popup is open
  useEffect(() => {
    document.body.style.overflow = selectedTask ? 'hidden' : '';
  }, [selectedTask]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Back Button */}
      <div className="mb-4">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <Card className="card-modern">
        <CardHeader>
          <CardTitle className="text-2xl">
            {subject
              ? `${subject.charAt(0).toUpperCase() + subject.slice(1)} Study Tasks`
              : 'Personalized Tasks'}
          </CardTitle>
          <p className="text-muted-foreground">
            {subject
              ? `Tasks tailored for ${subject} studies`
              : 'Your personalized tasks'}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {tasks.map((task, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl hover:bg-muted/50 transition-all duration-300"
            >
              <div
                className={`w-2 h-16 rounded-full ${getPriorityColor(task.priority)}`}
              />
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-1">{task.title}</h4>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs px-2 py-0.5">
                    {task.type}
                  </Badge>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {task.duration}
                  </span>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedTask(task)}
              >
                Start
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Popup Modal */}
      {selectedTask && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/40 z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{selectedTask.title}</h3>
              <Button variant="ghost" size="icon" onClick={() => setSelectedTask(null)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Type:</span>
                <Badge variant="outline">{selectedTask.type}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Duration:</span>
                <span className="text-sm">{selectedTask.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Priority:</span>
                <span
                  className={`text-sm ${getPriorityColor(selectedTask.priority)} px-2 py-0.5 rounded-full text-white`}
                >
                  {selectedTask.priority}
                </span>
              </div>
              {selectedTask.description && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground">Description:</p>
                  <p className="text-sm mt-1">{selectedTask.description}</p>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedTask(null)}>
                Close
              </Button>
              <Button>Start Task</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalizedTasks;
