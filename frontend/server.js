const path = require('path');
const express = require('express');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.static(__dirname));

app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Static server running at http://localhost:${port}`);
});