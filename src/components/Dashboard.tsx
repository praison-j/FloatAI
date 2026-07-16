import React, { useState, useEffect } from 'react';
import { 
  Columns, 
  Grid, 
  Maximize2, 
  Square, 
  Minus, 
  X, 
  Pin, 
  EyeOff, 
  Sparkles,
  MessageSquare,
  Search,
  Brain,
  Zap
} from 'lucide-react';
import { AIView } from './AIView';

interface AIModel {
  id: string;
  name: string;
  url: string;
  icon: React.ReactNode;
}

const AI_MODELS: AIModel[] = [
  { id: 'chatgpt', name: 'ChatGPT', url: 'https://chatgpt.com', icon: <MessageSquare size={20} /> },
  { id: 'perplexity', name: 'Perplexity', url: 'https://perplexity.ai', icon: <Search size={20} /> },
  { id: 'gemini', name: 'Gemini', url: 'https://gemini.google.com', icon: <Sparkles size={20} /> },
  { id: 'claude', name: 'Claude', url: 'https://claude.ai', icon: <Brain size={20} /> },
  { id: 'deepseek', name: 'DeepSeek', url: 'https://chat.deepseek.com', icon: <Zap size={20} /> }
];

type LayoutType = 'single' | 'split-v' | 'split-h' | 'grid';

interface DashboardProps {
  isElectron: boolean;
  onGoBackToLanding: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ isElectron, onGoBackToLanding }) => {
  const [layout, setLayout] = useState<LayoutType>('split-v');
  const [activeAIs, setActiveAIs] = useState<string[]>(['chatgpt', 'perplexity', 'gemini', 'claude']);
  const [activePaneIndex, setActivePaneIndex] = useState<number>(0);
  const [searchText, setSearchText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Electron Specific window states
  const [isPinned, setIsPinned] = useState(false);
  const [isSmartOpacity, setIsSmartOpacity] = useState(false);

  // Toggle Pinned status (Always on Top)
  const handleTogglePin = () => {
    const nextPinned = !isPinned;
    setIsPinned(nextPinned);
    if (isElectron && (window as any).electronAPI) {
      (window as any).electronAPI.setAlwaysOnTop(nextPinned);
    }
  };

  // Smart Opacity logic: when window is pinned and mouse leaves, fade.
  useEffect(() => {
    if (!isElectron || !(window as any).electronAPI) return;

    const handleMouseEnter = () => {
      if (isPinned && isSmartOpacity) {
        (window as any).electronAPI.setWindowOpacity(1.0);
      }
    };

    const handleMouseLeave = () => {
      if (isPinned && isSmartOpacity) {
        (window as any).electronAPI.setWindowOpacity(0.6);
      }
    };

    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Reset opacity when disabled
    if (!isSmartOpacity || !isPinned) {
      (window as any).electronAPI.setWindowOpacity(1.0);
    }

    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isPinned, isSmartOpacity, isElectron]);

  const handleMinimize = () => {
    if (isElectron && (window as any).electronAPI) {
      (window as any).electronAPI.minimizeWindow();
    }
  };

  const handleMaximize = () => {
    if (isElectron && (window as any).electronAPI) {
      (window as any).electronAPI.maximizeWindow();
    }
  };

  const handleClose = () => {
    if (isElectron && (window as any).electronAPI) {
      (window as any).electronAPI.closeWindow();
    }
  };

  const handleShrinkToIcon = () => {
    if (isElectron && (window as any).electronAPI) {
      (window as any).electronAPI.shrinkToIcon();
    }
  };

  const getSearchUrl = (id: string, query: string) => {
    const encoded = encodeURIComponent(query);
    switch (id) {
      case 'chatgpt':
        return query ? `https://chat.openai.com/?model=gpt-4o-mini&prompt=${encoded}` : 'https://chat.openai.com/';
      case 'perplexity':
        return query ? `https://www.perplexity.ai/search?q=${encoded}` : 'https://www.perplexity.ai';
      case 'gemini':
        return query ? `https://gemini.google.com/u/0/web?hl=en&q=${encoded}` : 'https://gemini.google.com/';
      case 'claude':
        return query ? `https://claude.ai/?query=${encoded}` : 'https://claude.ai/';
      case 'deepseek':
        return query ? `https://chat.deepseek.com/?q=${encoded}` : 'https://chat.deepseek.com/';
      default:
        return query ? `https://www.bing.com/search?q=${encoded}` : 'https://chat.openai.com/';
    }
  };

  const handleSearchSubmit = () => {
    const trimmed = searchText.trim();
    if (!trimmed) return;
    setSearchQuery(trimmed);
    setLayout('grid');
    setActiveAIs(['chatgpt', 'perplexity', 'gemini', 'claude']);
    setActivePaneIndex(0);
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSearchSubmit();
    }
  };

  const handleSelectModel = (modelId: string) => {
    const updated = [...activeAIs];
    updated[activePaneIndex] = modelId;
    setActiveAIs(updated);
  };

  const getPanesCount = () => {
    switch (layout) {
      case 'single': return 1;
      case 'split-v':
      case 'split-h': return 2;
      case 'grid': return 4;
      default: return 1;
    }
  };

  const panesCount = getPanesCount();

  return (
    <div className="app-container">
      {/* Title Bar / Header */}
      <div className="title-bar">
        <div className="title-bar-title" onClick={onGoBackToLanding} style={{ cursor: 'pointer' }}>
          <div className="logo-mark" style={{ width: 22, height: 22, fontSize: 12, borderRadius: 6 }}>F</div>
          <span>FloatAI Workspace</span>
        </div>

        <div className="title-bar-controls">
          {/* Always on Top Controls */}
          {isElectron && (
            <>
              <button 
                className={`window-control-btn ${isPinned ? 'active' : ''}`}
                onClick={handleTogglePin}
                title={isPinned ? 'Unpin Window' : 'Pin Always-on-Top'}
                style={{ color: isPinned ? 'hsl(var(--accent-blue))' : 'var(--text-muted)' }}
              >
                <Pin size={14} style={{ transform: isPinned ? 'rotate(45deg)' : 'none' }} />
              </button>
              
              <button 
                className={`window-control-btn ${isSmartOpacity ? 'active' : ''}`}
                onClick={() => setIsSmartOpacity(!isSmartOpacity)}
                disabled={!isPinned}
                title={isPinned ? (isSmartOpacity ? 'Disable Auto-Fade' : 'Enable Auto-Fade on Unhover') : 'Pin app first to enable Auto-Fade'}
                style={{ color: isSmartOpacity ? 'hsl(var(--accent-purple))' : 'var(--text-muted)' }}
              >
                <EyeOff size={14} />
              </button>
              
              <button className="window-control-btn" onClick={handleShrinkToIcon} title="Shrink to floating icon">
                <Zap size={14} />
              </button>
              
              <div style={{ width: 1, height: 16, background: 'var(--glass-border)', margin: '0 8px' }} />

              <button className="window-control-btn" onClick={handleMinimize} title="Minimize">
                <Minus size={14} />
              </button>
              <button className="window-control-btn" onClick={handleMaximize} title="Maximize">
                <Square size={12} />
              </button>
              <button className="window-control-btn close" onClick={handleClose} title="Close">
                <X size={14} />
              </button>
            </>
          )}

          {!isElectron && (
            <button 
              className="landing-download-btn"
              onClick={onGoBackToLanding}
              style={{ padding: '4px 12px', fontSize: '11px', borderRadius: '6px' }}
            >
              Back to Home
            </button>
          )}
        </div>
      </div>

      <div className="search-panel">
        <div className="search-panel-inner">
          <textarea
            className="search-textarea"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Type your query here and search all AI assistants at once..."
            rows={4}
          />
          <div className="search-actions">
            <button className="search-button primary" onClick={handleSearchSubmit}>
              Search all AIs
            </button>
            <button className="search-button secondary" onClick={handleShrinkToIcon}>
              Float as icon
            </button>
          </div>
          {searchQuery && (
            <div className="search-status">Searching "{searchQuery}" across all AI assistants...</div>
          )}
        </div>
      </div>

      <div className="main-content">
        {/* Sidebar */}
        <div className="sidebar">
          {AI_MODELS.map((model) => {
            const isAssignedToActivePane = activeAIs[activePaneIndex] === model.id;
            return (
              <button
                key={model.id}
                className={`sidebar-btn ${isAssignedToActivePane ? 'active' : ''}`}
                onClick={() => handleSelectModel(model.id)}
              >
                {model.icon}
                <div className="sidebar-btn-tooltip">
                  {model.name} {isAssignedToActivePane ? '(Active Pane)' : ''}
                </div>
              </button>
            );
          })}

          <div className="sidebar-divider" />

          {/* Layout Controls */}
          <div className="layout-toolbar">
            <button
              className={`layout-btn ${layout === 'single' ? 'active' : ''}`}
              onClick={() => { setLayout('single'); if (activePaneIndex >= 1) setActivePaneIndex(0); }}
              title="Single Pane"
            >
              <Maximize2 size={16} />
            </button>
            <button
              className={`layout-btn ${layout === 'split-v' ? 'active' : ''}`}
              onClick={() => { setLayout('split-v'); if (activePaneIndex >= 2) setActivePaneIndex(0); }}
              title="Split Vertical"
            >
              <Columns size={16} />
            </button>
            <button
              className={`layout-btn ${layout === 'split-h' ? 'active' : ''}`}
              onClick={() => { setLayout('split-h'); if (activePaneIndex >= 2) setActivePaneIndex(0); }}
              title="Split Horizontal"
            >
              <Columns size={16} style={{ transform: 'rotate(90deg)' }} />
            </button>
            <button
              className={`layout-btn ${layout === 'grid' ? 'active' : ''}`}
              onClick={() => setLayout('grid')}
              title="2x2 Grid"
            >
              <Grid size={16} />
            </button>
          </div>
        </div>

        {/* AI Panels Grid */}
        <div className={`workspace-grid layout-${layout}`}>
          {Array.from({ length: panesCount }).map((_, index) => {
            const modelId = activeAIs[index] || 'chatgpt';
            const model = AI_MODELS.find(m => m.id === modelId) || AI_MODELS[0];
            return (
              <div 
                key={index} 
                onClick={() => setActivePaneIndex(index)}
                style={{ height: '100%', width: '100%' }}
              >
                <AIView
                  id={model.id}
                  name={model.name}
                  url={searchQuery ? getSearchUrl(model.id, searchQuery) : model.url}
                  isActive={activePaneIndex === index}
                  isElectron={isElectron}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
