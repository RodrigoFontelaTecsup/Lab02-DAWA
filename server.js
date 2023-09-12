const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  if (req.url === '/favicon.ico') {
    res.writeHead(204);
    res.end();
    return;
  }

  let filePath;
  if (req.url === '/' || req.url === '/index.html') {
    filePath = path.join(__dirname, 'public', 'index.html');
  } else if (req.url.startsWith('/img')) {
    filePath = path.join(__dirname, 'public', 'img', req.url.slice(4));
  } else if (req.url.startsWith('/node_modules/bootstrap')) {
    // Ajusta la ruta para Bootstrap
    filePath = path.join(__dirname, req.url);
  } else {
    filePath = path.join(__dirname, 'public', req.url);
  }

  if (fs.statSync(filePath).isDirectory()) {
    console.error('Se intentó leer un directorio:', filePath);
    res.writeHead(500, { 'Content-Type': 'text/html' });
    res.end('Error del servidor');
    return;
  }
  // Modificar la función readFile() para que también pueda leer archivos en la carpeta img
  fs.readFile(filePath, (err, content) => {
    if (err) {
      console.error('Error al leer el archivo:', err);
      if (err.code === 'ENOENT') {
        console.error('Archivo no encontrado:', filePath);
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('Archivo no encontrado');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('Error del servidor');
      }
    } else {
      const ext = path.extname(filePath);
      let contentType = 'text/html';
      switch (ext) {
        case '.js':
          contentType = 'text/javascript';
          break;
        case '.css':
          contentType = 'text/css';
          break;
        case '.json':
          contentType = 'application/json';
          break;
        case '.png':
        case '.jpg':
          contentType = 'image/' + ext;
          break;
      }

      console.log('Ruta del archivo solicitado:', filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en http://localhost:${PORT}`);
});
