const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (like CSS, JS, images) from /public or root
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname)); // optional for backwards compatibility

// Route handler for HTML pages in src/pages
// Route handler for root and single-page routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'pages', 'index.html'));
});

app.get('/:page', (req, res) => {
  const filePath = path.join(__dirname, 'src', 'pages', `${req.params.page}.html`);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).sendFile(path.join(__dirname, 'src', 'pages', '404.html'));
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
