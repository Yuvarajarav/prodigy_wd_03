const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const modeSelect = document.getElementById('mode');

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = 'X';
let gameActive = true;

const winConditions = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

cells.forEach(cell => cell.addEventListener('click', handleClick));

function handleClick(e) {
  const index = e.target.dataset.index;
  if (board[index] !== "" || !gameActive) return;

  makeMove(index, currentPlayer);

  if (modeSelect.value === 'one' && gameActive && currentPlayer === 'O') {
    setTimeout(botMove, 500);
  }
}

function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;

  if (checkWinner()) {
    statusText.textContent = `Player ${player} wins!`;
    gameActive = false;
    setTimeout(resetGame, 1500);
    return;
  }

  if (board.every(cell => cell !== "")) {
    statusText.textContent = "Game is a draw!";
    gameActive = false;
    setTimeout(resetGame, 1500);
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = `Player ${currentPlayer}'s turn`;
}

function checkWinner() {
  return winConditions.some(([a, b, c]) =>
    board[a] && board[a] === board[b] && board[a] === board[c]
  );
}

// ✅ SMART BOT
function botMove() {
  // 1. Win if possible
  let move = findBestMove('O');
  if (move !== null) {
    makeMove(move, 'O');
    return;
  }

  // 2. Block player from winning
  move = findBestMove('X');
  if (move !== null) {
    makeMove(move, 'O');
    return;
  }

  // 3. Take center
  if (board[4] === "") {
    makeMove(4, 'O');
    return;
  }

  // 4. Take any corner
  const corners = [0, 2, 6, 8];
  for (let i of corners) {
    if (board[i] === "") {
      makeMove(i, 'O');
      return;
    }
  }

  // 5. Take any side
  const sides = [1, 3, 5, 7];
  for (let i of sides) {
    if (board[i] === "") {
      makeMove(i, 'O');
      return;
    }
  }
}

// Check for winning or blocking opportunity
function findBestMove(player) {
  for (let [a, b, c] of winConditions) {
    const line = [board[a], board[b], board[c]];
    const indexes = [a, b, c];
    if (line.filter(v => v === player).length === 2 && line.includes("")) {
      return indexes[line.indexOf("")];
    }
  }
  return null;
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  cells.forEach(cell => cell.textContent = "");
  currentPlayer = 'X';
  gameActive = true;
  statusText.textContent = `Player ${currentPlayer}'s turn`;

  if (modeSelect.value === 'one') currentPlayer = 'X';
}
