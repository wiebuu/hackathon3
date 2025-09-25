import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentDashboard from '@/components/StudentDashboard';
import TeacherDashboard from '@/components/TeacherDashboard';
import Navbar from '@/components/Navbar';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const storedUserType = localStorage.getItem('userType');
    const storedUserName = localStorage.getItem('userName');
    
    if (!storedUserType) {
      navigate('/');
      return;
    }

    setUserType(storedUserType);
    setUserName(storedUserName || '');
  }, [navigate]);

  if (!userType) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar userName={userName} userType={userType} />
      <main className="pt-20">
        {userType === 'student' ? <StudentDashboard /> : <TeacherDashboard />}
      </main>
    </div>
  );
};

export default Dashboard;