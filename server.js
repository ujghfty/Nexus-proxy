import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  const app = express();

  app.use(express.json());

  // API Route: Games JSON endpoint
  app.get('/api/games', (_req, res) => {
    try {
      const gamesPath = path.resolve(__dirname, 'public/data/games.json');
      if (fs.existsSync(gamesPath)) {
        const raw = fs.readFileSync(gamesPath, 'utf-8');
        res.setHeader('Content-Type', 'application/json');
        return res.send(raw);
      }
      return res.status(404).json({ error: 'Games database not found' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  // API Route: Nexus Web Search Aggregator (Fast, Unblocked, Never Refuses Connection)
  app.get('/api/search', async (req, res) => {
    const query = (req.query.q || '').trim();
    if (!query) {
      return res.json({ results: [], instant: null });
    }

    try {
      // Parallel fetch from Wikipedia API & DuckDuckGo Instant API
      const [wikiRes, ddgRes] = await Promise.allSettled([
        fetch(
          `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
            query
          )}&format=json&origin=*&utf8=1&srlimit=10`,
          {
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
            },
          }
        ),
        fetch(
          `https://api.duckduckgo.com/?q=${encodeURIComponent(
            query
          )}&format=json&no_html=1&skip_disambig=1`,
          {
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
            },
          }
        ),
      ]);

      let results = [];
      let instant = null;

      // Parse DuckDuckGo Instant Answer
      if (ddgRes.status === 'fulfilled') {
        try {
          const ddgData = await ddgRes.value.json();
          if (ddgData.Heading && (ddgData.AbstractText || ddgData.Abstract)) {
            instant = {
              heading: ddgData.Heading,
              text: ddgData.AbstractText || ddgData.Abstract,
              url: ddgData.AbstractURL || '',
              source: ddgData.AbstractSource || 'DuckDuckGo Instant',
              image: ddgData.Image || '',
            };
          }
          if (Array.isArray(ddgData.RelatedTopics)) {
            ddgData.RelatedTopics.forEach((topic) => {
              if (topic.Text && topic.FirstURL) {
                results.push({
                  title: topic.Text.split(' - ')[0] || topic.Text.slice(0, 50),
                  snippet: topic.Text,
                  url: topic.FirstURL,
                  source: 'Web Result',
                });
              }
            });
          }
        } catch (e) {}
      }

      // Parse Wikipedia Search
      if (wikiRes.status === 'fulfilled') {
        try {
          const wikiData = await wikiRes.value.json();
          if (wikiData.query && Array.isArray(wikiData.query.search)) {
            const wikiList = wikiData.query.search.map((item) => ({
              title: item.title,
              snippet: item.snippet.replace(/<\/?[^>]+(>|$)/g, ''),
              url: `https://en.wikipedia.org/wiki/${encodeURIComponent(
                item.title.replace(/ /g, '_')
              )}`,
              source: 'Wikipedia Encyclopedia',
            }));
            results = [...results, ...wikiList];
          }
        } catch (e) {}
      }

      return res.json({ query, instant, results });
    } catch (err) {
      return res.status(500).json({ error: err.message, results: [] });
    }
  });

  // API Route: High-Performance Web Proxy
  app.get('/api/proxy', async (req, res) => {
    let targetUrl = req.query.url;

    if (!targetUrl) {
      return res.status(400).send('Missing "url" query parameter');
    }

    targetUrl = targetUrl.trim();
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
    }

    try {
      const parsedUrl = new URL(targetUrl);
      const origin = parsedUrl.origin;

      const response = await fetch(targetUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          Accept:
            'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        redirect: 'follow',
      });

      const contentType = response.headers.get('content-type') || 'text/html';

      // Forward binary / non-HTML contents directly
      if (!contentType.includes('text/html')) {
        res.setHeader('Content-Type', contentType);
        res.setHeader('Access-Control-Allow-Origin', '*');
        const buffer = await response.arrayBuffer();
        return res.send(Buffer.from(buffer));
      }

      let html = await response.text();

      // Strip framing meta tags and restrictive CSP tags from the HTML
      html = html.replace(/<meta[^>]*http-equiv=["']?Content-Security-Policy["']?[^>]*>/gi, '');
      html = html.replace(/<meta[^>]*http-equiv=["']?X-Frame-Options["']?[^>]*>/gi, '');
      html = html.replace(/\sintegrity=["'][^"']*["']/gi, '');

      // Inject <base href="..."> and link rewriter
      const baseTag = `<base href="${origin}/">`;
      const clientScript = `
        <script>
          // Proxy link interceptor
          document.addEventListener('click', function(e) {
            const anchor = e.target.closest('a');
            if (anchor && anchor.href && !anchor.href.startsWith('javascript:') && !anchor.href.startsWith('#')) {
              e.preventDefault();
              window.location.href = '/api/proxy?url=' + encodeURIComponent(anchor.href);
            }
          }, true);
        </script>
      `;

      if (html.includes('<head>')) {
        html = html.replace('<head>', `<head>${baseTag}${clientScript}`);
      } else if (html.includes('<HEAD>')) {
        html = html.replace('<HEAD>', `<HEAD>${baseTag}${clientScript}`);
      } else {
        html = baseTag + clientScript + html;
      }

      // Remove all framing restriction response headers
      res.removeHeader('X-Frame-Options');
      res.removeHeader('Content-Security-Policy');
      res.removeHeader('Cross-Origin-Opener-Policy');
      res.removeHeader('Cross-Origin-Embedder-Policy');
      res.removeHeader('Cross-Origin-Resource-Policy');
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');

      return res.send(html);
    } catch (err) {
      return res.status(502).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Nexus Proxy</title>
          <style>
            body { font-family: system-ui, sans-serif; background: #0b1120; color: #f8fafc; padding: 40px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 80vh; text-align: center; }
            h2 { color: #f43f5e; font-size: 24px; margin-bottom: 12px; }
            p { color: #94a3b8; max-width: 500px; line-height: 1.6; margin-bottom: 20px; }
            .url { font-family: monospace; background: #1e293b; padding: 4px 10px; border-radius: 4px; color: #38bdf8; word-break: break-all; }
            a { color: #38bdf8; text-decoration: none; font-weight: bold; }
          </style>
        </head>
        <body>
          <h2>Failed to Reach Destination</h2>
          <p>The destination URL <span class="url">${targetUrl}</span> could not be loaded.</p>
          <p style="font-size: 13px; color: #64748b;">${err.message}</p>
          <a href="javascript:location.reload()">Retry Connection</a>
        </body>
        </html>
      `);
    }
  });

  // Serve static public assets
  app.use(express.static(path.resolve(__dirname, 'public')));

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
