// =============================================================================
// DBMS Normalization Platform - Local Development & Production Server
// Zero-dependency pure Node.js HTTP static server
// =============================================================================

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

let PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = '127.0.0.1';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  const urlParts = req.url.split('?');
  let pathname = decodeURIComponent(urlParts[0]);

  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  const filePath = path.join(__dirname, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <!DOCTYPE html>
        <html>
        <head><title>404 - Not Found</title></head>
        <body style="font-family:sans-serif;padding:2rem;text-align:center;">
          <h1>404 - File Not Found</h1>
          <p>The requested URL <code>${escapeHtml(pathname)}</code> was not found.</p>
          <a href="/">Go to Home</a>
        </body>
        </html>
      `);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache, must-revalidate'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

function escapeHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function startServer(portToTry) {
  server.listen(portToTry, HOST, () => {
    const url = `http://localhost:${portToTry}`;
    console.log('\n======================================================');
    console.log('   DBMS Normalization Practice Platform Server Live');
    console.log(`   URL: ${url}`);
    console.log('   Press Ctrl+C in this terminal to stop the server.');
    console.log('======================================================\n');

    // Auto-open browser if --open flag is provided
    if (process.argv.includes('--open')) {
      openBrowser(url);
    }
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${portToTry} is in use, attempting ${portToTry + 1}...`);
      startServer(portToTry + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

function openBrowser(targetUrl) {
  const startCmd = process.platform === 'win32'
    ? `start "" "${targetUrl}"`
    : process.platform === 'darwin'
    ? `open "${targetUrl}"`
    : `xdg-open "${targetUrl}"`;

  exec(startCmd, (err) => {
    if (err) {
      console.log(`Open your browser and navigate to: ${targetUrl}`);
    } else {
      console.log(`Successfully launched browser at: ${targetUrl}`);
    }
  });
}

startServer(PORT);
