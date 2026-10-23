import React, { useState } from 'react';
import { Shield, ExternalLink, Check, AlertTriangle } from 'lucide-react';

export const CLOAK_PRESETS = [
  {
    id: 'classroom',
    name: 'Google Classroom',
    title: 'Classes',
    icon: 'https://ssl.gstatic.com/classroom/favicon.png',
  },
  {
    id: 'docs',
    name: 'Google Docs',
    title: 'Untitled document - Google Docs',
    icon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico',
  },
  {
    id: 'drive',
    name: 'Google Drive',
    title: 'My Drive - Google Drive',
    icon: 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png',
  },
  {
    id: 'canvas',
    name: 'Canvas LMS',
    title: 'Dashboard',
    icon: 'https://du11hjcvx0uqb.cloudfront.net/br/dist/images/favicon-e10d657a73.ico',
  },
  {
    id: 'khan',
    name: 'Khan Academy',
    title: 'Dashboard | Khan Academy',
    icon: 'https://www.khanacademy.org/favicon.ico',
  },
];

export const StealthSettingsModal = ({
  currentCloak,
  onSelectCloak,
  onResetCloak,
  panicKey,
  setPanicKey,
}) => {
  const [listeningForKey, setListeningForKey] = useState(false);

  const openAboutBlankFull = () => {
    try {
      const win = window.open('about:blank', '_blank');
      if (win) {
        win.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Classes</title>
            <link rel="icon" href="https://ssl.gstatic.com/classroom/favicon.png">
            <style>
              body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #020617; }
              iframe { border: none; width: 100%; height: 100%; }
            </style>
          </head>
          <body>
            <iframe src="${window.location.href}" allow="fullscreen; autoplay"></iframe>
          </body>
          </html>
        `);
      }
    } catch (e) {
      alert('Popups may be blocked. Please allow popups for about:blank cloaking.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-8">
      {/* Overview Card */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-sky-400" />
            <h2 className="text-xl font-bold text-white tracking-tight">Tab Cloaking & Stealth</h2>
          </div>
          <p className="text-xs text-slate-400">
            Disguise your browser tab title and favicon to appear like educational tools, and configure your panic hotkey.
          </p>
        </div>

        <button
          onClick={openAboutBlankFull}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-md cursor-pointer shrink-0"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Launch in About:Blank</span>
        </button>
      </div>

      {/* Preset Pickers */}
      <div className="bg-slate-900/70 border border-slate-800 p-6 rounded-xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white">Select Tab Cloak</h3>
          <button
            onClick={onResetCloak}
            className="text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Reset to Default
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {CLOAK_PRESETS.map((preset) => {
            const isSelected = currentCloak === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectCloak(preset)}
                className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-sky-950/60 border-sky-500 text-white shadow-sm'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <img
                  src={preset.icon}
                  alt={preset.name}
                  className="w-6 h-6 rounded shrink-0 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white truncate">{preset.name}</div>
                  <div className="text-[11px] text-slate-400 truncate">Title: {preset.title}</div>
                </div>
                {isSelected && <Check className="w-4 h-4 text-sky-400 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Panic Key Settings */}
      <div className="bg-slate-900/70 border border-slate-800 p-6 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <h3 className="text-base font-semibold text-white">Emergency Panic Hotkey</h3>
          </div>
          <p className="text-xs text-slate-400">
            Pressing this key instantly hides games/proxy and displays an authentic Google Classroom view.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <kbd className="px-3 py-1.5 bg-slate-950 border border-slate-700 text-sky-400 font-mono font-bold text-sm rounded-md shadow-inner">
            {panicKey}
          </kbd>

          <button
            onClick={() => {
              setListeningForKey(true);
              const handler = (e) => {
                e.preventDefault();
                setPanicKey(e.key);
                setListeningForKey(false);
                window.removeEventListener('keydown', handler);
              };
              window.addEventListener('keydown', handler);
            }}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            {listeningForKey ? 'Press any key...' : 'Change Key'}
          </button>
        </div>
      </div>
    </div>
  );
};
