import React, { useState, useRef } from 'react';
import {
  Search,
  RotateCcw,
  ShieldCheck,
  Maximize2,
  ExternalLink,
  ArrowRight,
  ArrowLeft,
  Home,
  Globe,
  Loader2,
} from 'lucide-react';

export const ProxyBrowser = () => {
  const [viewState, setViewState] = useState('home'); // 'home' | 'results' | 'iframe'
  const [searchInput, setSearchInput] = useState('');
  const [currentQuery, setCurrentQuery] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [instantAnswer, setInstantAnswer] = useState(null);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [isLoadingIframe, setIsLoadingIframe] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const iframeContainerRef = useRef(null);

  // Check if string is a URL
  const isUrl = (str) => {
    const trimmed = str.trim();
    return (
      /^https?:\/\//i.test(trimmed) ||
      /^www\./i.test(trimmed) ||
      (!trimmed.includes(' ') && trimmed.includes('.') && trimmed.length > 3)
    );
  };

  const handleSearchSubmit = async (e) => {
    if (e) e.preventDefault();
    const query = searchInput.trim();
    if (!query) return;

    // If it's a direct URL, load it directly in the proxy iframe
    if (isUrl(query)) {
      navigateToUrl(query);
      return;
    }

    // Otherwise, perform Nexus Web Search
    setCurrentQuery(query);
    setIsLoadingSearch(true);
    setViewState('results');

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error('API not available');
      const data = await res.json();
      setSearchResults(data.results || []);
      setInstantAnswer(data.instant || null);
    } catch (err) {
      // Fallback for static GitHub Pages hosting
      try {
        const wikiRes = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
            query
          )}&format=json&origin=*&utf8=1&srlimit=10`
        );
        const wikiData = await wikiRes.json();
        if (wikiData.query && wikiData.query.search) {
          const fallbackList = wikiData.query.search.map((item) => ({
            title: item.title,
            snippet: item.snippet.replace(/<\/?[^>]+(>|$)/g, ''),
            url: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/ /g, '_'))}`,
            source: 'Wikipedia (Static Mode)',
          }));
          setSearchResults(fallbackList);
          setInstantAnswer(null);
        }
      } catch (clientErr) {
        setSearchResults([]);
        setInstantAnswer(null);
      }
    } finally {
      setIsLoadingSearch(false);
    }
  };

  const navigateToUrl = (target) => {
    let clean = target.trim();
    if (!/^https?:\/\//i.test(clean)) {
      clean = 'https://' + clean;
    }
    setCurrentUrl(clean);
    setSearchInput(clean);
    setIsLoadingIframe(true);
    setViewState('iframe');
    setIframeKey((prev) => prev + 1);
  };

  const handleFullscreen = () => {
    if (iframeContainerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        iframeContainerRef.current.requestFullscreen();
      }
    }
  };

  const openAboutBlank = () => {
    try {
      const win = window.open('about:blank', '_blank');
      if (win) {
        const fullProxyUrl =
          window.location.origin + `/api/proxy?url=${encodeURIComponent(currentUrl || 'https://en.wikipedia.org')}`;
        win.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Classes</title>
            <link rel="icon" href="https://ssl.gstatic.com/classroom/favicon.png">
            <style>
              body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #0b1120; }
              iframe { border: none; width: 100%; height: 100%; }
            </style>
          </head>
          <body>
            <iframe src="${fullProxyUrl}" allow="fullscreen; autoplay"></iframe>
          </body>
          </html>
        `);
      }
    } catch (e) {
      window.open(`/api/proxy?url=${encodeURIComponent(currentUrl)}`, '_blank');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-4">
      {/* Top Address / Search Omnibar */}
      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl flex items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2">
          {viewState !== 'home' && (
            <button
              onClick={() => {
                if (viewState === 'iframe' && currentQuery) {
                  setViewState('results');
                  setSearchInput(currentQuery);
                } else {
                  setViewState('home');
                  setSearchInput('');
                }
              }}
              title="Back"
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => {
              setViewState('home');
              setSearchInput('');
            }}
            title="Nexus Search Home"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-sky-400 bg-sky-950/60 border border-sky-800/80 hover:bg-sky-900/60 rounded-lg transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Nexus</span>
          </button>
        </div>

        {/* Input Field */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-3xl relative flex items-center">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search with Nexus or enter any URL..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-20 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-all"
          />
          <button
            type="submit"
            className="absolute right-1.5 px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-md transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>Search</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </form>

        {/* Quick Utilities */}
        <div className="flex items-center gap-2">
          {viewState === 'iframe' && (
            <>
              <button
                onClick={() => setIframeKey((p) => p + 1)}
                title="Reload"
                className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={openAboutBlank}
                title="Cloak in about:blank"
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 hover:bg-emerald-900/50 rounded-lg transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cloak</span>
              </button>
              <button
                onClick={handleFullscreen}
                title="Fullscreen"
                className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main View Area */}
      {viewState === 'home' ? (
        /* Nexus Search Home Screen */
        <div className="flex flex-col items-center justify-center py-20 px-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl min-h-[65vh]">
          {/* Prominent "Nexus" Title */}
          <div className="text-center mb-8">
            <h1 className="text-6xl sm:text-7xl font-extrabold tracking-tight text-white mb-3">
              Nexus
            </h1>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Fast, unblocked web search and proxy browser. Search any topic or browse any URL without connection blocks.
            </p>
          </div>

          {/* Centered Search Bar */}
          <form onSubmit={handleSearchSubmit} className="w-full max-w-xl relative flex items-center mb-8">
            <Search className="w-5 h-5 text-slate-500 absolute left-4 pointer-events-none" />
            <input
              type="text"
              autoFocus
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search with Nexus or type a website URL..."
              className="w-full bg-slate-950 border-2 border-slate-800 hover:border-slate-700 focus:border-sky-500 rounded-xl pl-12 pr-28 py-3.5 text-base text-slate-100 placeholder-slate-500 focus:outline-none shadow-xl transition-all"
            />
            <button
              type="submit"
              className="absolute right-2.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>Search</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Feature Highlights */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              <span>Unblocked Knowledge Search</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Bypasses Frame Locks & CSP</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              <span>100% Free & No Anomaly Verification</span>
            </div>
          </div>
        </div>
      ) : viewState === 'results' ? (
        /* Nexus Search Results Page */
        <div className="flex flex-col gap-5 max-w-4xl mx-auto w-full py-2">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
            <span>
              Search results for <span className="text-white font-semibold">"{currentQuery}"</span>
            </span>
            <span>{searchResults.length} results</span>
          </div>

          {isLoadingSearch ? (
            <div className="py-24 text-center flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-sky-400" />
              <span className="text-sm">Searching with Nexus...</span>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Instant Answer / Knowledge Box */}
              {instantAnswer && (
                <div className="bg-slate-900 border border-sky-800/40 p-5 rounded-xl shadow-md">
                  <div className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider mb-1">
                    {instantAnswer.source}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{instantAnswer.heading}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {instantAnswer.text}
                  </p>
                  {instantAnswer.url && (
                    <button
                      onClick={() => navigateToUrl(instantAnswer.url)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
                    >
                      <span>Read full article in Unblock Proxy</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}

              {/* Web Results List */}
              {searchResults.length === 0 && !instantAnswer ? (
                <div className="py-16 text-center text-slate-400 bg-slate-900/40 border border-slate-800 rounded-xl">
                  <p className="text-sm">No search results found for "{currentQuery}".</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Try searching for another keyword or enter a direct website address.
                  </p>
                </div>
              ) : (
                searchResults.map((result, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="truncate max-w-md">{result.url}</span>
                      <span>{result.source}</span>
                    </div>

                    <h4
                      onClick={() => navigateToUrl(result.url)}
                      className="text-base font-bold text-sky-400 hover:text-sky-300 hover:underline transition-colors cursor-pointer tracking-tight"
                    >
                      {result.title}
                    </h4>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {result.snippet}
                    </p>

                    <div className="pt-2 flex items-center gap-3">
                      <button
                        onClick={() => navigateToUrl(result.url)}
                        className="text-xs font-semibold text-sky-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        <span>Open in Proxy</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                      <a
                        href={result.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1"
                      >
                        <span>Direct Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      ) : (
        /* Unblocked Proxy Iframe Viewport */
        <div
          ref={iframeContainerRef}
          className="w-full h-[78vh] min-h-[520px] bg-white rounded-xl overflow-hidden border-2 border-slate-800 shadow-2xl relative"
        >
          {isLoadingIframe && (
            <div className="absolute top-0 left-0 right-0 h-1 bg-sky-500 animate-pulse z-10" />
          )}
          <iframe
            key={iframeKey}
            src={`/api/proxy?url=${encodeURIComponent(currentUrl)}`}
            title="Nexus Web Proxy"
            className="w-full h-full border-0 block bg-white"
            allow="fullscreen; autoplay; clipboard-read; clipboard-write"
            onLoad={() => setIsLoadingIframe(false)}
          />
        </div>
      )}
    </div>
  );
};
