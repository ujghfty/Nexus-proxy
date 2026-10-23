import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Maximize2,
  RotateCcw,
  ExternalLink,
  Heart,
  Expand,
  Info,
  ShieldCheck,
} from 'lucide-react';

export const GamePlayer = ({
  game,
  onBack,
  isFavorite,
  onToggleFavorite,
}) => {
  const [isTheater, setIsTheater] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const containerRef = useRef(null);

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen();
      }
    }
  };

  const reloadGame = () => {
    setIframeKey((prev) => prev + 1);
  };

  const openAboutBlank = () => {
    try {
      const win = window.open('about:blank', '_blank');
      if (win) {
        const fullUrl = window.location.origin + game.iframeSrc;
        win.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Classes</title>
            <link rel="icon" href="https://ssl.gstatic.com/classroom/favicon.png">
            <style>
              body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #000; }
              iframe { border: none; width: 100%; height: 100%; }
            </style>
          </head>
          <body>
            <iframe src="${fullUrl}" allow="fullscreen; autoplay"></iframe>
          </body>
          </html>
        `);
      }
    } catch (e) {
      window.open(game.iframeSrc, '_blank');
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-7xl mx-auto px-4 py-4">
      {/* Player Header Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 rounded-lg hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Games</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">{game.title}</h2>
              <span className="text-xs text-slate-400">· {game.category}</span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">{game.controls}</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={reloadGame}
            title="Reload game"
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsTheater(!isTheater)}
            title="Toggle Theater Mode"
            className={`p-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              isTheater
                ? 'bg-sky-500 text-white'
                : 'text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700'
            }`}
          >
            <Expand className="w-4 h-4" />
          </button>

          <button
            onClick={handleFullscreen}
            title="Native Fullscreen"
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <button
            onClick={openAboutBlank}
            title="Launch in stealth about:blank window"
            className="flex items-center gap-1 px-2.5 py-1.5 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cloak Tab</span>
          </button>

          <button
            onClick={() => window.open(game.iframeSrc, '_blank')}
            title="Open direct iframe in new tab"
            className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => onToggleFavorite(game.id, e)}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className="p-2 text-slate-400 hover:text-rose-400 bg-slate-800/80 hover:bg-slate-700 rounded-lg text-xs font-medium transition-colors cursor-pointer"
          >
            <Heart
              className={`w-4 h-4 ${
                isFavorite ? 'fill-rose-500 text-rose-500' : ''
              }`}
            />
          </button>

          <button
            onClick={() => setShowInfo(!showInfo)}
            title="Controls & Instructions"
            className={`p-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              showInfo
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700'
            }`}
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Info panel if toggled */}
      {showInfo && (
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row justify-between gap-4 text-xs text-slate-300">
          <div>
            <h4 className="font-semibold text-white mb-1">How to Play</h4>
            <p className="text-slate-400">{game.controls}</p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-1">About {game.title}</h4>
            <p className="text-slate-400">{game.description}</p>
          </div>
          <div className="shrink-0">
            <h4 className="font-semibold text-white mb-1">Tags</h4>
            <div className="text-slate-400">
              {game.tags ? game.tags.join(' · ') : ''}
            </div>
          </div>
        </div>
      )}

      {/* Main Game Iframe */}
      <div
        ref={containerRef}
        className={`w-full mx-auto transition-all duration-300 rounded-xl overflow-hidden border-2 border-slate-800 bg-black shadow-2xl relative ${
          isTheater ? 'max-w-none' : 'max-w-5xl'
        }`}
        style={{
          height: isTheater ? '82vh' : '72vh',
          minHeight: '480px',
        }}
      >
        <iframe
          key={iframeKey}
          src={game.iframeSrc}
          title={game.title}
          className="w-full h-full border-0 block"
          allow="fullscreen; autoplay"
          sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-popups"
        />
      </div>
    </div>
  );
};
