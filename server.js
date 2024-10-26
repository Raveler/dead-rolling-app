const express = require('express');
const { Pool } = require('pg'); // Import PostgreSQL client
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json()); // To parse JSON request bodies

// Set up PostgreSQL connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Use Render's DATABASE_URL environment variable
    ssl: {
        rejectUnauthorized: false, // Use SSL connection
    },
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
app.post('/api/highscore', async (req, res) => {
    const { name, wins } = req.body;
    try {
        const result = await pool.query('INSERT INTO highscores (name, wins) VALUES ($1, $2) RETURNING id', [name, wins]);
        res.status(201).json({ id: result.rows[0].id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Get high scores grouped by name
app.get('/api/highscores', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT name, COUNT(*) as total_losses
            FROM highscores
            GROUP BY name
            ORDER BY total_losses DESC
        `);
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// Initialize the database (Create the table if it doesn't exist)
app.listen(PORT, async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS highscores (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                wins INTEGER NOT NULL
            )
        `);
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.error(error);
    }
});
