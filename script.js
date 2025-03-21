// Battleship Game - JavaScript

// Game Configuration
const GRID_SIZE = 10;
const SHIPS = [
    { name: "Destroyer", size: 2 },
    { name: "Submarine", size: 3 },
    { name: "Cruiser", size: 3 },
    { name: "Battleship", size: 4 },
    { name: "Carrier", size: 5 }
];

let turnTimer;
const TURN_TIME = 15; // 15 seconds per turn

// Function to create an empty board
const createEmptyBoard = () => {
    return Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
};

const playerBoard = createEmptyBoard();
const aiBoard = createEmptyBoard();

// Show game instructions on load
const showInstructions = () => {
    document.getElementById("instructions-modal").style.display = "block";
};

const closeInstructions = () => {
    document.getElementById("instructions-modal").style.display = "none";
};

// Function to render the boards
const renderBoard = (boardElement, board, isAI = false) => {
    boardElement.innerHTML = "";
    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.x = x;
            cell.dataset.y = y;
            if (isAI) {
                cell.addEventListener("click", () => playerAttack(x, y));
            }
            boardElement.appendChild(cell);
        }
    }
};

// Function to start the turn timer
const startTurnTimer = () => {
    clearInterval(turnTimer);
    let timeLeft = TURN_TIME;
    const timerElement = document.getElementById("turn-timer");
    timerElement.textContent = `Time Left: ${timeLeft}s`;
    timerElement.style.color = "green";
    
    turnTimer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `Time Left: ${timeLeft}s`;
        if (timeLeft <= 10) {
            timerElement.style.color = "red";
        }
        if (timeLeft <= 0) {
            clearInterval(turnTimer);
            aiAttack(); // If time runs out, AI takes its turn
        }
    }, 1000);
};

// Function to handle player attack on AI board
const playerAttack = (x, y) => {
    const cell = document.querySelector(`#ai-board .cell[data-x='${x}'][data-y='${y}']`);
    if (cell && !cell.classList.contains("clicked")) {
        if (aiBoard[y][x] !== null) {
            aiBoard[y][x] = "hit";
            cell.style.backgroundColor = "red"; // Hit turns red
        } else {
            aiBoard[y][x] = "miss";
            cell.style.backgroundColor = "lightgray"; // Miss turns light gray
        }
        cell.classList.add("clicked");
        checkWin();
        setTimeout(aiAttack, 1000); // AI attacks after 1s delay
    }
};

// Function to check if the player or AI has won
const checkWin = () => {
    const playerWin = !aiBoard.some(row => row.includes(null) || SHIPS.some(ship => row.includes(ship.name)));
    const aiWin = !playerBoard.some(row => row.includes(null) || SHIPS.some(ship => row.includes(ship.name)));
    
    if (playerWin) {
        alert("Congratulations! You sank all enemy ships! You win!");
        location.reload();
    } else if (aiWin) {
        alert("Game over! The AI sank all your ships. You lose.");
        location.reload();
    }
};

// Function to update the board UI
const updateBoardUI = (boardElement, board) => {
    const cells = boardElement.querySelectorAll(".cell");
    cells.forEach(cell => {
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);
        if (board[y][x] === "hit") {
            cell.style.backgroundColor = "red"; // AI hit turns red
        } else if (board[y][x] === "miss") {
            cell.style.backgroundColor = "grey"; // AI miss turns grey
        }
    });
};

const placeShip = (board, ship, x, y, direction) => {
    if (direction === "horizontal") {
        if (x + ship.size > GRID_SIZE) return false;
        for (let i = 0; i < ship.size; i++) {
            if (board[y][x + i] !== null) return false;
        }
        for (let i = 0; i < ship.size; i++) {
            board[y][x + i] = ship.name;
        }
    } else {
        if (y + ship.size > GRID_SIZE) return false;
        for (let i = 0; i < ship.size; i++) {
            if (board[y + i][x] !== null) return false;
        }
        for (let i = 0; i < ship.size; i++) {
            board[y + i][x] = ship.name;
        }
    }
    return true;
};

// Randomly place AI ships
const placeAIShips = () => {
    SHIPS.forEach(ship => {
        let placed = false;
        while (!placed) {
            const x = Math.floor(Math.random() * GRID_SIZE);
            const y = Math.floor(Math.random() * GRID_SIZE);
            const direction = Math.random() > 0.5 ? "horizontal" : "vertical";
            placed = placeShip(aiBoard, ship, x, y, direction);
        }
    });
};

// AI randomly attacks
const aiAttack = () => {
    let x, y;
    do {
        x = Math.floor(Math.random() * GRID_SIZE);
        y = Math.floor(Math.random() * GRID_SIZE);
    } while (playerBoard[y][x] === "hit" || playerBoard[y][x] === "miss");
    
    if (playerBoard[y][x] !== null) {
        playerBoard[y][x] = "hit";
    } else {
        playerBoard[y][x] = "miss";
    }
    
    updateBoardUI(document.getElementById("player-board"), playerBoard);
    checkWin();
    startTurnTimer(); // Restart the timer after AI attack
};

// Initialize game
showInstructions();
placeAIShips();
const playerBoardElement = document.getElementById("player-board");
const aiBoardElement = document.getElementById("ai-board");
renderBoard(playerBoardElement, playerBoard);
renderBoard(aiBoardElement, aiBoard, true);
document.body.insertAdjacentHTML("beforeend", '<div id="turn-timer" style="font-size: 20px; text-align: center; margin-top: 10px; color: green;">Time Left: 15s</div>');
startTurnTimer();
console.log("AI Board:", aiBoard);
