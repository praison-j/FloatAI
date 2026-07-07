import { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';

function App() {
  const [isElectron, setIsElectron] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    // Check if electronAPI is injected from the preload script
    const checkElectron = async () => {
      if ((window as any).electronAPI) {
        setIsElectron(true);
        setShowDashboard(true);
      }
    };
    checkElectron();
  }, []);

  if (showDashboard) {
    return (
      <Dashboard 
        isElectron={isElectron} 
        onGoBackToLanding={() => setShowDashboard(false)} 
      />
    );
  }

  return (
    <LandingPage 
      onLaunchApp={() => setShowDashboard(true)} 
    />
  );
}

export default App;
