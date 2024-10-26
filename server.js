const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
