import { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';

function App() {
  const [isElectron, setIsElectron] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [isIconMode, setIsIconMode] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'icon') {
      setIsIconMode(true);
      setShowDashboard(true);
    }

    const checkElectron = async () => {
      if ((window as any).electronAPI) {
        setIsElectron(true);
        setShowDashboard(true);
      }
    };
    checkElectron();
  }, []);

  const restoreFromIcon = () => {
    if ((window as any).electronAPI?.restoreMainWindow) {
      (window as any).electronAPI.restoreMainWindow();
    }
  };

  if (isIconMode) {
    return (
      <div className="icon-launcher" onClick={restoreFromIcon}>
        <div className="icon-bubble">F</div>
        <div className="icon-label">FloatAI</div>
      </div>
    );
  }

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
