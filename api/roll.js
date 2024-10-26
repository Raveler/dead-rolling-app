// api/roll.js
let players = [1, 2, 3, 4, 5]; // Example player list
let results = {};

export default function handler(req, res) {
  if (req.method === "GET") {
    // Generate random roll for each player
    const player = players[Math.floor(Math.random() * players.length)];
    const roll = Math.floor(Math.random() * 100) + 1;
    results[player] = roll;

    // Find lowest roll for elimination
    const lowestRoll = Math.min(...Object.values(results));
    const eliminatedPlayer = Object.keys(results).find(
      (p) => results[p] === lowestRoll
    );

    // Check for elimination and winning conditions
    let eliminated = null;
    let winner = null;
    if (eliminatedPlayer) {
      players = players.filter((p) => p != eliminatedPlayer);
      eliminated = eliminatedPlayer;
    }

    // If only one player remains, they are the winner
    if (players.length === 1) {
      winner = players[0];
      players = [1, 2, 3, 4, 5]; // Reset players
      results = {};
    }

    res.status(200).json({ player, roll, eliminated, winner });
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
