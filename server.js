const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

let currentNumber = 10; // Starting number

app.get('/api/roll', (req, res) => {
    const roll = Math.floor(Math.random() * currentNumber) + 1; // Roll between 1 and currentNumber
    currentNumber = roll; // Update currentNumber for the next player
    res.json({ result: roll, currentNumber });
});

// Reset the game
app.get('/api/reset', (req, res) => {
    currentNumber = 10; // Reset to starting number
    res.json({ message: 'Game reset!', currentNumber });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
