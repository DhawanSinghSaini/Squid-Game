import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

// Serve about.html
app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "about.html"));
});

// Serve rules.html
app.get("/rules", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "rules.html"));
});

// Define game-specific routes
app.get("/game", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "home.html")); // Serve the game HTML file
});

// Handle form submission
app.post("/submit", (req, res) => {
  const { name, birthYear } = req.body;
  const userName = name;
  const userBirthYear = birthYear;
  console.log(`Name: ${userName}, Birth Year: ${userBirthYear}`);
  res.redirect("/game1"); // Redirect to game1.html
});

// Serve game1.html
app.get("/game1", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "game1.html"));
});

// Handle game1 outcome
app.post("/proceed1", (req, res) => {
  console.log("Player 456 passed game1");
  res.redirect("/game2"); // Redirect to the next game
});

// Handle game2 outcome
app.post("/proceed2", (req, res) => {
  console.log("Player 456 passed game2");
  res.redirect("/game3"); // Redirect to the next game
});

// Handle game3 outcome
app.post("/proceed3", (req, res) => {
  console.log("Player 456 passed game3");
  res.redirect("/game"); // Redirect to the home screen
});

app.post("/lost", (req, res) => {
  console.log("Player 456 lost");
  res.redirect("/"); // Redirect to the home screen
});

// Serve game2.html
app.get("/game2", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "game2.html"));
});

// Serve game3.html
app.get("/game3", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "game3.html"));
});

// Start the server
app.listen(port, () => {
  console.log(`Game server is running on http://localhost:${port}`);
});
