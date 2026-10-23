import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar.jsx';
import { GameCard } from './components/GameCard.jsx';
import { GamePlayer } from './components/GamePlayer.jsx';
import { ProxyBrowser } from './components/ProxyBrowser.jsx';
import { StealthSettingsModal } from './components/StealthSettingsModal.jsx';
import { PanicScreen } from './components/PanicScreen.jsx';
import { Search, Gamepad2, ArrowUpDown } from 'lucide-react';

const FALLBACK_GAMES = [
  {
    id: 'slope',
    title: 'Slope 3D',
    category: 'Action',
    description: 'High-octane neon runner rolling down a twisting 3D slope. Dodge obstacles and jump speed ramps.',
    iframeSrc: './games/slope.html',
    aspectRatio: '16:9',
    controls: 'A / D or Left / Right arrow keys to steer.',
    tags: ['3D', 'Endless', 'High Speed'],
    rating: 4.9,
    playCount: 382400,
    badge: 'Popular',
  },
  {
    id: 'tetris',
    title: 'Tetris Matrix',
    category: 'Arcade',
    description: 'The definitive falling blocks puzzle. Clear lines, use hold queue and ghost piece projection.',
    iframeSrc: './games/tetris.html',
    aspectRatio: '4:3',
    controls: 'Arrow keys / WASD to move & rotate. Space to drop.',
    tags: ['Retro', 'Puzzle', 'Classic'],
    rating: 4.8,
    playCount: 295100,
    badge: 'Featured',
  },
  {
    id: '2048',
    title: '2048 Classic',
    category: 'Puzzle',
    description: 'Slide matching numbered tiles across the 4x4 grid. Reach the legendary 2048 tile.',
    iframeSrc: './games/2048.html',
    aspectRatio: '1:1',
    controls: 'Arrow keys, WASD, or swipe on touchscreen.',
    tags: ['Math', 'Strategy', 'Brain'],
    rating: 4.7,
    playCount: 184500,
    badge: 'Classic',
  },
  {
    id: 'pacman',
    title: 'Pac-Man Arcade',
    category: 'Arcade',
    description: 'Munch all pac-dots in the classic maze while outsmarting Blinky, Pinky, Inky, and Clyde.',
    iframeSrc: './games/pacman.html',
    aspectRatio: '4:3',
    controls: 'Arrow keys or WASD to navigate corridors.',
    tags: ['Retro', 'Arcade', 'Maze'],
    rating: 4.9,
    playCount: 420800,
    badge: 'Hot',
  },
  {
    id: 'snake',
    title: 'Neon Snake',
    category: 'Classic',
    description: 'Smooth retro cyber snake. Gobble glowing neon orbs and rare golden apples to extend your tail.',
    iframeSrc: './games/snake.html',
    aspectRatio: '1:1',
    controls: 'Arrow keys or WASD to change direction.',
    tags: ['Retro', 'Arcade', 'Fast'],
    rating: 4.6,
    playCount: 210900,
    badge: 'Classic',
  },
  {
    id: 'flappy',
    title: 'Flappy Bird',
    category: 'Arcade',
    description: 'Precision tap-to-fly arcade game. Navigate through narrow pipe openings with delicate timing.',
    iframeSrc: './games/flappy.html',
    aspectRatio: '3:4',
    controls: 'Spacebar or click/tap to flap wings.',
    tags: ['Skill', 'Arcade', 'Physics'],
    rating: 4.5,
    playCount: 312000,
    badge: 'Popular',
  },
  {
    id: 'asteroids',
    title: 'Asteroids 1979',
    category: 'Action',
    description: 'Authentic vector space shooter with inertia physics. Rotate, thrust across deep space, and blast asteroids.',
    iframeSrc: './games/asteroids.html',
    aspectRatio: '4:3',
    controls: 'Arrows to steer & thrust. Space to fire laser.',
    tags: ['Space', 'Shooter', 'Vector'],
    rating: 4.7,
    playCount: 167300,
    badge: 'Retro',
  },
  {
    id: 'breakout',
    title: 'Breakout Matrix',
    category: 'Arcade',
    description: 'Smash vibrant rows of brick clusters with bouncing balls. Collect paddle extenders and powerups.',
    iframeSrc: './games/breakout.html',
    aspectRatio: '4:3',
    controls: 'Mouse or Left / Right arrow keys to position paddle.',
    tags: ['Bricks', 'Powerups', 'Arcade'],
    rating: 4.6,
    playCount: 145200,
    badge: 'Featured',
  },
  {
    id: 'pong',
    title: 'Neon Pong',
    category: 'Sports',
    description: 'The grandfather of video games revitalized with neon glow aesthetics and curve spin physics.',
    iframeSrc: './games/pong.html',
    aspectRatio: '16:9',
    controls: 'P1: W/S or mouse. P2: Up/Down arrow keys.',
    tags: ['2 Player', 'Sports', 'Retro'],
    rating: 4.4,
    playCount: 98400,
    badge: 'Multiplayer',
  },
  {
    id: 'dino',
    title: 'T-Rex Dino Runner',
    category: 'Action',
    description: 'The beloved offline chrome runner. Leap over desert cacti and duck underneath flying pterodactyls.',
    iframeSrc: './games/dino.html',
    aspectRatio: '16:9',
    controls: 'Space / Up Arrow to jump. Down Arrow to duck.',
    tags: ['Endless', 'Runner', 'Pixel'],
    rating: 4.8,
    playCount: 289400,
    badge: 'Classic',
  },
  {
    id: 'minesweeper',
    title: 'Minesweeper Classic',
    category: 'Puzzle',
    description: 'Uncover numbers and logically deduce hidden mines without detonation.',
    iframeSrc: './games/minesweeper.html',
    aspectRatio: '1:1',
    controls: 'Left click to reveal. Right click to flag.',
    tags: ['Logic', 'Brain', 'Strategy'],
    rating: 4.6,
    playCount: 112000,
    badge: 'Logic',
  },
  {
    id: 'connect4',
    title: 'Connect 4',
    category: 'Puzzle',
    description: 'Classic vertical checker drop game. Strategically align 4 discs against smart AI or a friend.',
    iframeSrc: './games/connect4.html',
    aspectRatio: '4:3',
    controls: 'Click any column to drop a checker disc.',
    tags: ['Strategy', 'Board', '2 Player'],
    rating: 4.5,
    playCount: 139000,
    badge: 'Board',
  },
  {
    id: 'space-invaders',
    title: 'Space Invaders',
    category: 'Action',
    description: 'Descend into planetary defense. Blast relentless waves of marching alien armadas.',
    iframeSrc: './games/space-invaders.html',
    aspectRatio: '4:3',
    controls: 'Arrows / WASD to steer. Space to fire.',
    tags: ['Retro', 'Space', 'Defense'],
    rating: 4.7,
    playCount: 178900,
    badge: 'Retro',
  },
  {
    id: 'wordle',
    title: 'Word Quest',
    category: 'Puzzle',
    description: '5-letter word deduction game. Six guesses to discover the mystery word using colored letter feedback.',
    iframeSrc: './games/wordle.html',
    aspectRatio: '1:1',
    controls: 'Type on physical keyboard or click virtual keys.',
    tags: ['Word', 'Vocabulary', 'Brain'],
    rating: 4.8,
    playCount: 264300,
    badge: 'Popular',
  },
];

export default function App() {
  const [games, setGames] = useState(FALLBACK_GAMES);
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState('games');
  const [activeGame, setActiveGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [isPanicked, setIsPanicked] = useState(false);
  const [panicKey, setPanicKey] = useState('Escape');
  const [currentCloak, setCurrentCloak] = useState('default');

  // Load games from ./data/games.json or fallback
  useEffect(() => {
    fetch('./data/games.json')
      .then((res) => {
        if (!res.ok) throw new Error('Not ok');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setGames(data);
        }
      })
      .catch(() => {});

    try {
      const favs = localStorage.getItem('nexus_favorites');
      if (favs) setFavorites(JSON.parse(favs));
    } catch (e) {}

    const pk = localStorage.getItem('nexus_panic_key');
    if (pk) setPanicKey(pk);
  }, []);

  // Toggle Favorite
  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem('nexus_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  // Tab Cloaking
  const applyCloak = (preset) => {
    setCurrentCloak(preset.id);
    document.title = preset.title;
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = preset.icon;
  };

  const resetCloak = () => {
    setCurrentCloak('default');
    document.title = 'Nexus Games & Web Proxy';
    const link = document.querySelector("link[rel~='icon']");
    if (link) {
      link.href = '/favicon.ico';
    }
  };

  // Global Panic Key Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === panicKey || (panicKey === 'Escape' && e.code === 'Escape') || e.key === '`') {
        e.preventDefault();
        setIsPanicked((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [panicKey]);

  // Filtered & Sorted games
  const displayedGames = useMemo(() => {
    return games
      .filter((g) => {
        if (filterCategory === 'Favorites') {
          if (!favorites.includes(g.id)) return false;
        } else if (filterCategory !== 'All' && g.category !== filterCategory) {
          return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = g.title.toLowerCase().includes(q);
          const matchDesc = g.description.toLowerCase().includes(q);
          const matchTag = g.tags && g.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchTitle && !matchDesc && !matchTag) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'popular') return b.playCount - a.playCount;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'name') return a.title.localeCompare(b.title);
        return 0;
      });
  }, [games, filterCategory, searchQuery, sortBy, favorites]);

  const categories = [
    'All',
    'Action',
    'Arcade',
    'Puzzle',
    'Classic',
    'Sports',
    'Favorites',
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Panic Screen Override */}
      {isPanicked && (
        <PanicScreen onExit={() => setIsPanicked(false)} panicKey={panicKey} />
      )}

      {/* Top Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        triggerPanic={() => setIsPanicked(true)}
        closeActiveGame={() => setActiveGame(null)}
        hasActiveGame={!!activeGame}
      />

      {/* Main View Content */}
      <main className="flex-1 w-full pb-16">
        {activeGame ? (
          /* Active Game Player */
          <GamePlayer
            game={activeGame}
            onBack={() => setActiveGame(null)}
            isFavorite={favorites.includes(activeGame.id)}
            onToggleFavorite={toggleFavorite}
          />
        ) : activeTab === 'proxy' ? (
          /* Proxy Browser View */
          <ProxyBrowser />
        ) : activeTab === 'stealth' ? (
          /* Stealth & Tab Cloaker View */
          <StealthSettingsModal
            currentCloak={currentCloak}
            onSelectCloak={applyCloak}
            onResetCloak={resetCloak}
            panicKey={panicKey}
            setPanicKey={(k) => {
              setPanicKey(k);
              localStorage.setItem('nexus_panic_key', k);
            }}
          />
        ) : (
          /* Games Catalog View */
          <div className="max-w-7xl mx-auto px-6 pt-8 flex flex-col gap-6">
            {/* Hero Intro */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
                  Unblocked Games Directory
                </h1>
                <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
                  Browse {games.length} self-contained HTML5 games stored as JSON
                  iframes with zero external tracking, instant loading, and fullscreen play.
                </p>
              </div>

              {/* Quick Search */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search games or tags..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                />
              </div>
            </div>

            {/* Filter Controls Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Category Segmented Control */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 p-1 bg-slate-900/80 border border-slate-800/80 rounded-lg">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                      filterCategory === cat
                        ? 'bg-sky-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {cat}
                    {cat === 'Favorites' && favorites.length > 0 && ` (${favorites.length})`}
                  </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
                <span>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-slate-200 rounded-md px-2.5 py-1 focus:outline-none focus:border-sky-500 cursor-pointer"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Top Rated</option>
                  <option value="name">Alphabetical</option>
                </select>
              </div>
            </div>

            {/* Games Grid */}
            {displayedGames.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center justify-center">
                <Gamepad2 className="w-12 h-12 text-slate-700 mb-3" />
                <h3 className="text-base font-semibold text-slate-300">No games found</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  {filterCategory === 'Favorites'
                    ? "You haven't bookmarked any games yet. Click the heart icon on any game card to add it to your favorites."
                    : 'Try clearing your search query or switching to another category.'}
                </p>
                {(searchQuery || filterCategory !== 'All') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilterCategory('All');
                    }}
                    className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-lg transition-colors cursor-pointer"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {displayedGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    isFavorite={favorites.includes(game.id)}
                    onToggleFavorite={toggleFavorite}
                    onSelectGame={(g) => setActiveGame(g)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-900 py-6 text-center text-xs text-slate-600">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Nexus Games & Web Proxy · High-performance unblocked games portal</span>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Panic Hotkey: {panicKey}</span>
            <span aria-hidden="true">·</span>
            <span>All games stored as iframes in games.json</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
