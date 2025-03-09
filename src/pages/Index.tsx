
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the stocks page instead of chat page
    navigate('/stocks');
  }, [navigate]);
  
  return null;
};

export default Index;
