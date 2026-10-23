import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const Navbar = ({
  activeTab,
  setActiveTab,
  filterCategory,
  setFilterCategory,
  triggerPanic,
  closeActiveGame,
  hasActiveGame,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => {
            closeActiveGame();
            setActiveTab('games');
            setFilterCategory('All');
          }}
          className="text-lg font-bold tracking-tight text-white hover:text-sky-400 transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer"
        >
          Nexus Unblocked
        </button>

        {/* Zone 2: Single-line nav links */}
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => {
              closeActiveGame();
              setActiveTab('games');
              if (filterCategory === 'Favorites') setFilterCategory('All');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'games' && filterCategory !== 'Favorites' && !hasActiveGame
                ? 'text-white font-semibold underline underline-offset-8 decoration-sky-400 decoration-2'
                : 'hover:text-slate-200'
            }`}
          >
            Games
          </button>

          <button
            onClick={() => {
              closeActiveGame();
              setActiveTab('proxy');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'proxy'
                ? 'text-white font-semibold underline underline-offset-8 decoration-sky-400 decoration-2'
                : 'hover:text-slate-200'
            }`}
          >
            Proxy Browser
          </button>

          <button
            onClick={() => {
              closeActiveGame();
              setActiveTab('games');
              setFilterCategory('Favorites');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'games' && filterCategory === 'Favorites'
                ? 'text-white font-semibold underline underline-offset-8 decoration-sky-400 decoration-2'
                : 'hover:text-slate-200'
            }`}
          >
            Favorites
          </button>

          <button
            onClick={() => {
              setActiveTab('stealth');
            }}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'stealth'
                ? 'text-white font-semibold underline underline-offset-8 decoration-sky-400 decoration-2'
                : 'hover:text-slate-200'
            }`}
          >
            Tab Cloak
          </button>
        </nav>

        {/* Zone 3: Panic button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={triggerPanic}
            title="Emergency Panic Screen (Hotkey: Esc or ~)"
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-rose-300 bg-rose-950/60 border border-rose-800/80 rounded-md hover:bg-rose-900/80 hover:text-white transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Panic Key (Esc)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
