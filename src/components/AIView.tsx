import React, { useRef, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, ExternalLink, ShieldAlert } from 'lucide-react';

interface AIViewProps {
  id: string;
  name: string;
  url: string;
  isActive: boolean;
  isElectron: boolean;
}

export const AIView: React.FC<AIViewProps> = ({ id, name, url, isActive, isElectron }) => {
  const webviewRef = useRef<any>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(url);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview) return;

    const handleStartLoading = () => setIsLoading(true);
    const handleStopLoading = () => {
      setIsLoading(false);
      if (webview.canGoBack) setCanGoBack(webview.canGoBack());
      if (webview.canGoForward) setCanGoForward(webview.canGoForward());
      setCurrentUrl(webview.getURL());
    };

    const handleNavigate = (e: any) => {
      setCurrentUrl(e.url);
    };

    webview.addEventListener('did-start-loading', handleStartLoading);
    webview.addEventListener('did-stop-loading', handleStopLoading);
    webview.addEventListener('did-navigate', handleNavigate);
    webview.addEventListener('did-navigate-in-page', handleNavigate);

    return () => {
      webview.removeEventListener('did-start-loading', handleStartLoading);
      webview.removeEventListener('did-stop-loading', handleStopLoading);
      webview.removeEventListener('did-navigate', handleNavigate);
      webview.removeEventListener('did-navigate-in-page', handleNavigate);
    };
  }, [isElectron]);

  const handleBack = () => {
    if (webviewRef.current && webviewRef.current.canGoBack()) {
      webviewRef.current.goBack();
    }
  };

  const handleForward = () => {
    if (webviewRef.current && webviewRef.current.canGoForward()) {
      webviewRef.current.goForward();
    }
  };

  const handleRefresh = () => {
    if (webviewRef.current) {
      webviewRef.current.reload();
    }
  };

  const handleOpenExternal = () => {
    if (isElectron) {
      // Expose to window's electron API
      (window as any).electronAPI.setAlwaysOnTop(false);
    }
    window.open(currentUrl, '_blank');
  };

  return (
    <div className={`ai-view-wrapper ${isActive ? 'active' : ''}`}>
      <div className="ai-header">
        <span className="ai-name">{name}</span>
        
        {isElectron && (
          <>
            <button 
              className="ai-nav-btn" 
              onClick={handleBack} 
              disabled={!canGoBack}
              title="Back"
            >
              <ArrowLeft size={14} />
            </button>
            <button 
              className="ai-nav-btn" 
              onClick={handleForward} 
              disabled={!canGoForward}
              title="Forward"
            >
              <ArrowRight size={14} />
            </button>
            <button 
              className="ai-nav-btn" 
              onClick={handleRefresh} 
              title="Refresh"
            >
              <RotateCw size={14} />
            </button>
            <div className="ai-url-bar" title={currentUrl}>
              {currentUrl}
            </div>
          </>
        )}

        <button 
          className="ai-nav-btn" 
          onClick={handleOpenExternal}
          title="Open in Browser"
          style={{ marginLeft: 'auto' }}
        >
          <ExternalLink size={14} />
        </button>
      </div>

      <div className={`ai-loader ${isLoading ? 'loading' : ''}`} />

      {isElectron ? (
        // Render webview dynamically via React.createElement to prevent TSX errors
        React.createElement('webview', {
          key: url,
          ref: webviewRef,
          src: url,
          useragent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          style: { flex: 1, width: '100%', height: '100%', border: 'none' },
          partition: `persist:${id}-session`,
          webpreferences: "allowRunningInsecureContent=no, javascript=yes"
        })
      ) : (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: 'hsl(var(--bg-secondary))',
          textAlign: 'center'
        }}>
          <ShieldAlert size={48} className="web-fallback-icon" style={{ marginBottom: '16px' }} />
          <h3 style={{ marginBottom: '8px', color: '#ffffff' }}>Desktop Client Required</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', maxWidth: '300px', lineHeight: '1.6', marginBottom: '20px' }}>
            External AI sites like {name} block loading within standard web browsers for security.
          </p>
          <a 
            href="#download" 
            className="landing-download-btn"
            style={{ textDecoration: 'none', display: 'inline-block' }}
          >
            Download FloatAI
          </a>
        </div>
      )}
    </div>
  );
};
