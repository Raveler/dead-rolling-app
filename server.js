const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/api/roll', (req, res) => {
    const roll = Math.floor(Math.random() * 6) + 1; // Roll a dice (1-6)
    res.json({ result: roll });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
