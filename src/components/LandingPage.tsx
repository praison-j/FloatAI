import React from 'react';
import { 
  Download, 
  Monitor, 
  Layers, 
  Eye, 
  ShieldAlert, 
  Sparkles
} from 'lucide-react';

interface LandingPageProps {
  onLaunchApp: () => void;
}

const WINDOWS_DOWNLOAD_URL =
  'https://github.com/praison-j/FloatAI/releases/download/v1.0.0/FloatAI-win32-x64.zip';

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchApp }) => {
  const handleDownload = () => {
    window.open(WINDOWS_DOWNLOAD_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="landing-container">
      {/* Header */}
      <header className="landing-header">
        <div className="logo-container">
          <div className="logo-mark">F</div>
          <span className="logo-text">FloatAI</span>
        </div>
        <nav className="landing-nav">
          <a href="#features" className="landing-nav-link">Features</a>
          <a href="#demo" className="landing-nav-link">Interactive Mockup</a>
          <button className="landing-download-btn" onClick={handleDownload}>
            Download App
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-tag">
          <Sparkles size={12} style={{ marginRight: 6, display: 'inline-block', verticalAlign: 'middle' }} />
          Introducing FloatAI v1.0
        </div>
        <h1 className="hero-title">
          Your Entire AI Workspace.<br />
          Floating & Split-Screen.
        </h1>
        <p className="hero-subtitle">
          Bring ChatGPT, Perplexity, Gemini, and Claude side-by-side into a single glowing workspace. Toggle a global floating pin, and fade the window when you work.
        </p>

        {/* Fallback Banner for standard web browsers */}
        <div className="web-fallback-banner">
          <ShieldAlert size={24} className="web-fallback-icon" />
          <div className="web-fallback-text">
            <h4>Running in Web Preview Mode</h4>
            <p>
              External AIs restrict framing in standard browsers. Download the desktop app to enable actual split-screen webviews, persistent logins, system pin, and smart fade.
            </p>
          </div>
        </div>

        <div className="hero-buttons">
          <button className="btn-primary" onClick={handleDownload}>
            <Download size={18} />
            Download for Windows
          </button>
          <button className="btn-secondary" onClick={onLaunchApp}>
            Try Web Demo Workspace
          </button>
        </div>

        {/* Mockup Preview */}
        <div className="mockup-container" id="demo">
          <div className="mockup-screen">
            <div className="mockup-header">
              <div className="mockup-dot active"></div>
              <div className="mockup-dot active-2"></div>
              <div className="mockup-dot active-3"></div>
              <div className="mockup-title">FloatAI Workspace (Split View Mode)</div>
              <div style={{ color: 'var(--text-muted)', display: 'flex', gap: 8, marginRight: 8 }}>
                <Layers size={12} style={{ color: '#6366f1' }} />
                <Eye size={12} />
              </div>
            </div>
            
            <div className="mockup-body">
              <div className="mockup-sidebar">
                <div className="mockup-item active"></div>
                <div className="mockup-item"></div>
                <div className="mockup-item"></div>
                <div style={{ flex: 1 }}></div>
                <div className="mockup-item" style={{ height: 20, width: 20, borderRadius: 4 }}></div>
              </div>
              
              <div className="mockup-grid">
                {/* ChatGPT pane */}
                <div className="mockup-pane">
                  <div className="mockup-pane-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div className="mockup-pane-avatar" style={{ background: '#10a37f' }}></div>
                      <div className="mockup-pane-bar"></div>
                    </div>
                    <div className="mockup-pane-bar" style={{ width: 30 }}></div>
                  </div>
                  <div className="mockup-pane-content">
                    <div className="mockup-line w-80"></div>
                    <div className="mockup-line w-90"></div>
                    <div className="mockup-line w-60"></div>
                    <div className="mockup-line w-80" style={{ background: 'rgba(99,102,241,0.1)' }}></div>
                    <div className="mockup-line w-40"></div>
                  </div>
                </div>

                {/* Perplexity pane */}
                <div className="mockup-pane">
                  <div className="mockup-pane-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div className="mockup-pane-avatar" style={{ background: '#22c55e' }}></div>
                      <div className="mockup-pane-bar" style={{ width: 60 }}></div>
                    </div>
                    <div className="mockup-pane-bar" style={{ width: 20 }}></div>
                  </div>
                  <div className="mockup-pane-content">
                    <div className="mockup-line w-90"></div>
                    <div className="mockup-line w-60"></div>
                    <div className="mockup-line w-80"></div>
                    <div className="mockup-line w-40"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="features-section" id="features">
        <div className="features-header">
          <h2 className="features-title">Designed for Developer Workflows</h2>
          <p className="features-subtitle">Premium layout control engineered for side-by-side AI referencing.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Layers size={24} />
            </div>
            <h3 className="feature-card-title">Split-Screen Layouts</h3>
            <p className="feature-card-desc">Compare answers across AIs side-by-side. Choose from Single, Vertical, Horizontal, or 2x2 grid configurations dynamically.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Monitor size={24} />
            </div>
            <h3 className="feature-card-title">Always-on-Top Floating</h3>
            <p className="feature-card-desc">Keep your AIs visible over your IDE or browser. Toggle the global floating pin in a single click in the window header.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Eye size={24} />
            </div>
            <h3 className="feature-card-title">Smart Opacity Fading</h3>
            <p className="feature-card-desc">Fades to 60% transparency when you move your cursor out of the window to keep your workspace clean. Restores instantly on hover.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-logo">
          <div className="logo-mark" style={{ width: 24, height: 24, fontSize: 13, borderRadius: 6 }}>F</div>
          <span>FloatAI Studio</span>
        </div>
        <p>© 2026 FloatAI Workspace. All rights reserved. Packaged for desktop scaling.</p>
      </footer>
    </div>
  );
};
