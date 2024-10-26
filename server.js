const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json()); // To parse JSON request bodies

// Initialize the database
const db = new sqlite3.Database('./highscores.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        db.run(`CREATE TABLE IF NOT EXISTS highscores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            wins INTEGER NOT NULL
        )`);
    }
});

let currentNumber = 1000; // Starting number set to 1000

app.get('/api/roll', (req, res) => {
    const roll = Math.floor(Math.random() * currentNumber) + 1; // Roll between 1 and currentNumber
    currentNumber = roll; // Update currentNumber for the next player
    res.json({ result: roll, currentNumber });
});

// Reset the game with a specified starting number
app.get('/api/reset/:start?', (req, res) => {
    const start = parseInt(req.params.start);
    currentNumber = isNaN(start) ? 1000 : start; // Set to start number or default to 1000
    res.json({ message: 'Game reset!', currentNumber });
});

// Add a high score
app.post('/api/highscore', (req, res) => {
    const { name, wins } = req.body;
    db.run(`INSERT INTO highscores (name, wins) VALUES (?, ?)`, [name, wins], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID });
    });
});

// Get high scores
app.get('/api/highscores', (req, res) => {
    db.all(`SELECT * FROM highscores ORDER BY wins DESC`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
