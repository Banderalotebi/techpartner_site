import React from 'react';
import { useNavigate } from 'react-router-dom';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const navigate = useNavigate();

  console.log('AdminDashboard rendered');

  const handleLogout = () => {
    console.log('handleLogout called');
    onLogout();
    console.log('onLogout called');
    navigate('/login');
    console.log('navigate called');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ... rest of the code remains the same ... */}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default AdminDashboard;
