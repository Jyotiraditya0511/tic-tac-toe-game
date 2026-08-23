# 🎮 Tic Tac Toe

A simple and interactive Tic Tac Toe game built using **HTML, CSS, and JavaScript**.

This project was created as a practice project to learn and implement basic **DOM manipulation, event handling, game logic, AI algorithms, Local Storage, and responsive UI design**.

## ✨ Features

- 👥 Human vs Human mode
- 🤖 Human vs AI mode
- 🎯 Three AI difficulty levels:
  - Easy
  - Moderate
  - Hard
- 🧠 Hard mode uses the **Minimax algorithm**
- 🏆 Win and draw detection
- 💡 Winner highlighting
- ⏳ AI thinking delay
- 🔙 Back navigation between screens
- 🌙 Dark mode
- 💾 Theme preference saved using Local Storage
- 📱 Responsive interface for different screen sizes

## 🧠 AI Difficulty Levels

### Easy

The AI selects a random available position on the board.

### Moderate

The AI follows a simple decision-making strategy:

1. Check if it can win.
2. Block the player's winning move.
3. Take the center if available.
4. Prefer a corner.
5. Otherwise, choose a random available position.

### Hard

The hard mode uses the **Minimax algorithm** to evaluate possible future game states and select the best available move.

The objective is to make the AI play optimally.

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript
- DOM Manipulation
- Local Storage
- Minimax Algorithm

## 📂 Project Structure

```text
tic-tac-toe/
│
├── index.html
├── style.css
├── script.js
└── README.md