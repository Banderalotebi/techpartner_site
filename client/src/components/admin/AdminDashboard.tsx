import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';

interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user.email}!</p>
      <Button variant="primary" onClick={handleLogout}>
        Logout
      </Button>
      <Button variant="primary" onClick={() => navigate('/domain-hunter')}>
        Domain Hunter
      </Button>
    </div>
  );
};

export default AdminDashboard;
