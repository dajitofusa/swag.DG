import React, { useState, useRef, useEffect } from 'react';
import { PortalItem } from '../types';
import { SIMULATION_ENGINES } from '../data/simulationEngines';
import { 
  X, 
  Maximize, 
  Minimize, 
  RotateCw, 
  ExternalLink, 
  Star, 
  Info, 
  Gamepad2,
  EyeOff
} from 'lucide-react';

interface PlayerModalProps {
  item: PortalItem;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onTriggerDisguise: () => void;
  panicKey: string;
}

export const PlayerModal: React.FC<PlayerModalProps> = ({
  item,
  onClose,
  isFavorite,
  onToggleFavorite,
  onTriggerDisguise,
  panicKey
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [aspectRatio, setAspectRatio] = useState<'16/9' | '4/3' | '1/1' | 'fill'>(
    (item.aspectRatio as any) || '16/9'
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Determine iframe source or srcDoc
  const builtInEngine = SIMULATION_ENGINES[item.id];
  const hasSrcDoc = !!builtInEngine || !!item.srcDoc;
  const directSrc = item.iframeSrc;

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleReload = () => {
    setIframeKey(k => k + 1);
  };

  const handlePopout = () => {
    if (builtInEngine) {
      const win = window.open('about:blank', '_blank');
      if (win) {
        win.document.write(builtInEngine);
        win.document.close();
      }
    } else if (directSrc) {
      window.open(directSrc, '_blank');
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        ref={containerRef}
        className="w-full max-w-6xl h-full max-h-[92vh] flex flex-col bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Top Header Control Bar */}
        <header className="bg-white border-b border-slate-200 px-5 py-3 flex items-center justify-between gap-3 select-none">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => onToggleFavorite(item.id)}
              className={`p-1.5 rounded-lg border transition-colors ${
                isFavorite 
                  ? 'bg-amber-50 border-amber-300 text-amber-500' 
                  : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700'
              }`}
              title={isFavorite ? 'Remove Favorite' : 'Save to Favorites'}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-900 text-base truncate">
                  {item.title}
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200 rounded uppercase tracking-wider">
                  {item.category}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate max-w-md hidden md:block">
                {item.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Aspect Ratio Picker */}
            <div className="hidden lg:flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200 text-[11px]">
              {(['16/9', '4/3', '1/1', 'fill'] as const).map(ratio => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`px-2 py-0.5 rounded font-bold uppercase transition-colors ${
                    aspectRatio === ratio
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>

            {/* Reload */}
            <button
              onClick={handleReload}
              className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Restart session"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Popout */}
            <button
              onClick={handlePopout}
              className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Launch in stealth tab / about:blank"
            >
              <ExternalLink className="w-4 h-4" />
            </button>

            {/* Info toggle */}
            <button
              onClick={() => setShowInfo(!showInfo)}
              className={`p-2 rounded-lg border transition-colors ${
                showInfo 
                  ? 'bg-blue-50 border-blue-300 text-blue-600' 
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Controls & Instructions"
            >
              <Info className="w-4 h-4" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>

            {/* Panic Key Disguise */}
            <button
              onClick={onTriggerDisguise}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 transition-colors text-xs font-bold"
              title={`Disguise Screen (HotKey: ${panicKey})`}
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Disguise</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors ml-1"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Iframe Viewport Area */}
        <div className="flex-1 relative bg-slate-950 flex items-center justify-center overflow-hidden">
          <div 
            className={`w-full h-full flex items-center justify-center p-2 ${
              aspectRatio === 'fill' ? 'max-w-none max-h-none' : ''
            }`}
          >
            <div 
              className={`w-full h-full relative transition-all duration-200 flex items-center justify-center ${
                aspectRatio === '16/9' ? 'max-w-5xl aspect-video' :
                aspectRatio === '4/3' ? 'max-w-4xl aspect-[4/3]' :
                aspectRatio === '1/1' ? 'max-w-xl aspect-square' :
                'w-full h-full'
              }`}
            >
              <iframe
                key={iframeKey}
                ref={iframeRef}
                title={item.title}
                srcDoc={hasSrcDoc ? (builtInEngine || item.srcDoc) : undefined}
                src={!hasSrcDoc ? directSrc : undefined}
                className="w-full h-full rounded-lg border border-slate-800 bg-slate-950 shadow-inner"
                allow="autoplay; fullscreen; keyboard-map; gamepad"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock allow-modals"
              />
            </div>
          </div>

          {/* Info & Controls Drawer Overlay */}
          {showInfo && (
            <div className="absolute top-4 right-4 w-80 bg-white border border-slate-200 rounded-xl p-4 shadow-xl z-20 animate-fade-in text-slate-800">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-blue-600" />
                  Controls & Instructions
                </h3>
                <button onClick={() => setShowInfo(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-500 block mb-1 font-bold uppercase text-[10px] tracking-wider">Description</span>
                  <p className="text-slate-700 leading-relaxed">{item.description}</p>
                </div>

                <div>
                  <span className="text-slate-500 block mb-1 font-bold uppercase text-[10px] tracking-wider">Input Controls</span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.controls.map((ctrl, i) => (
                      <span key={i} className="px-2 py-1 rounded bg-slate-100 border border-slate-200 font-mono text-[11px] text-slate-800">
                        {ctrl}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block mb-1 font-bold uppercase text-[10px] tracking-wider">Tags</span>
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((t, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Status bar */}
        <footer className="bg-white border-t border-slate-200 px-5 py-2.5 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-slate-700 font-semibold">Active Session Environment</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span>Panic Hotkey: <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-[10px] border border-slate-200 font-bold">{panicKey}</kbd></span>
          </div>
        </footer>
      </div>
    </div>
  );
};
