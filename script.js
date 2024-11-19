const settings = document.querySelector(".settings");
const game = document.querySelector(".game");
const playButton = document.querySelector(".play");
const gameInfo = document.querySelector(".game-info");
const boxes = document.querySelectorAll(".box");
const newGameButton = document.querySelector(".btn");
const settingButton = document.querySelector(".settingBtn");
const X_Button = document.querySelector(".X");
const O_Button = document.querySelector(".O");
const easy = document.querySelector(".easy");
const hard = document.querySelector(".hard");
const crackers = document.querySelector(".crackers");

let userChar = "X";
let aiChar = "O";
let difficulty = "easy";
let currentPlayer = "user";
let board = Array(9).fill(null);
X_Button.style.backgroundColor = "rgb(3, 53, 53)"
easy.style.backgroundColor = "rgb(3, 53, 53)"

X_Button.addEventListener("click", () => {
    userChar = "X";
    aiChar = "O";

    X_Button.style.backgroundColor = "rgb(3, 53, 53)"
    O_Button.style.backgroundColor = "";
});

O_Button.addEventListener("click", () => {
    userChar = "O";
    aiChar = "X";

    O_Button.style.backgroundColor = "rgb(3, 53, 53)"
    X_Button.style.backgroundColor = "";

});

easy.addEventListener("click", () => {
    difficulty = "easy";

    easy.style.backgroundColor = "rgb(3, 53, 53)"
    hard.style.backgroundColor = "";
});

hard.addEventListener("click", () => {
    difficulty = "hard";

    hard.style.backgroundColor = "rgb(3, 53, 53)"
    easy.style.backgroundColor = "";
});

playButton.addEventListener("click", startGame);

newGameButton.addEventListener("click", resetGame);
settingButton.addEventListener("click", () => {
    settings.style.display = "block";
    game.style.display = "none";
    crackers.style.display = "none";
});

boxes.forEach((box, index) => {
    box.addEventListener("click", () => userMove(index));
});

// Start Game
function startGame() {
    settings.style.display = "none";
    game.style.display = "block";
    crackers.style.display = "none";
    
    board.fill(null);

    boxes.forEach((box) => {
        box.textContent = "";
        box.style.backgroundColor = "";
    });

    gameInfo.textContent = "Your turn";
    currentPlayer = "user";
}

// User Move
function userMove(index) {
    if (board[index] || currentPlayer !== "user")
        return;

    board[index] = userChar;
    boxes[index].textContent = userChar;
    boxes[index].style.color = "yellow";

    const res = checkWin(userChar)
    if (res) {
        endGame("You Win", res);
    } else if (board.every((cell) => cell)) {
        endGame("Game Drawn");
    } else {
        currentPlayer = "ai";
        gameInfo.textContent = "AI's turn";
        setTimeout(aiMove, 1000);
    }
}

// AI Move
function aiMove() {
    let move;
    if (difficulty === "easy") {
        move = getRandomMove();
    } else {
        move = getBestMove();
    }

    board[move] = aiChar;
    boxes[move].textContent = aiChar;
    boxes[move].style.color = "orange";

    const res = checkWin(aiChar);
    if (res) {
        endGame("You Lose", res);
    } else if (board.every((cell) => cell)) {
        endGame("Game Drawn");
    } else {
        currentPlayer = "user";
        gameInfo.textContent = "Your turn";
    }
}

// Random Move (Easy Difficulty)
function getRandomMove() {
    const availableMoves = board.map((cell, index) => (cell ? null : index)).filter((cell) => cell !== null);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

// Minimax Algorithm (Hard Difficulty)
function getBestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
            board[i] = aiChar;
            let score = minimax(board, 0, false);
            board[i] = null;
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    if (checkWin(aiChar)) return 10 - depth;
    if (checkWin(userChar)) return depth - 10;
    if (board.every((cell) => cell)) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                board[i] = aiChar;
                let score = minimax(board, depth + 1, false);
                board[i] = null;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                board[i] = userChar;
                let score = minimax(board, depth + 1, true);
                board[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// Check Win
function checkWin(player) {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (const pattern of winPatterns) {
        if (pattern.every((index) => board[index] === player)) {
            return pattern;
        }
    }
    return false;
}


// End Game
function endGame(message, res) {

    if (message == "You Win") {
        res.forEach((index) => (boxes[index].style.backgroundColor = 'rgba(4, 110, 4, 0.7)'));
        crackers.style.display = "flex";
    }

    else if (message == "You Lose") {
        res.forEach((index) => (boxes[index].style.backgroundColor = 'rgb(151, 21, 21)'));
    }

    gameInfo.textContent = message;
    currentPlayer = null;
}

// Reset Game
function resetGame() {
    board.fill(null);
    crackers.style.display = "none";

    boxes.forEach((box) => {
        box.textContent = "";
        box.style.backgroundColor = ""
    });
    gameInfo.textContent = "Your turn!";
    currentPlayer = "user";
}
