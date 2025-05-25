const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const dbPath = path.join(__dirname, 'DB', 'SoloLeveling.db');
const db = new sqlite3.Database(dbPath);

// For the images
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to get all characters
app.get('/characters', (req, res) => {
  db.all('SELECT * FROM CHARACTERS_SOLO_LEVELING', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server start : http://localhost:${PORT}`);
});

// Choose a character
const mysteryCharacterName = "Sung Jin-Woo";

app.get('/mystery', (req, res) => {
  db.get(
    'SELECT * FROM CHARACTERS_SOLO_LEVELING WHERE Name = ?',
    [mysteryCharacterName],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(row);
    }
  );
});