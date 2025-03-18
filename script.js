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
            if (!isAI) {
                cell.addEventListener("click", () => playerAttack(x, y));
            }
            boardElement.appendChild(cell);
        }
    }
};

// Function to handle player attack
const playerAttack = (x, y) => {
    if (aiBoard[y][x] === "hit" || aiBoard[y][x] === "miss") return; // Prevent reselecting

    if (aiBoard[y][x] !== null) {
        aiBoard[y][x] = "hit";
    } else {
        aiBoard[y][x] = "miss";
    }
    updateBoardUI(document.getElementById("ai-board"), aiBoard);
    checkWin();
    aiAttack();
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
            cell.classList.add("hit");
        } else if (board[y][x] === "miss") {
            cell.classList.add("miss");
        }
    });
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

// Function to place a ship on the board
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

// AI randomly attacks
const aiAttack = () => {
    let x, y;
    do {
        x = Math.floor(Math.random() * GRID_SIZE);
        y = Math.floor(Math.random() * GRID_SIZE);
    } while (playerBoard[y][x] === "hit" || playerBoard[y][x] === "miss");
    playerBoard[y][x] = playerBoard[y][x] ? "hit" : "miss";
    updateBoardUI(document.getElementById("player-board"), playerBoard);
    checkWin();
};

// Initialize game
showInstructions();
placeAIShips();
const playerBoardElement = document.getElementById("player-board");
const aiBoardElement = document.getElementById("ai-board");
renderBoard(playerBoardElement, playerBoard);
renderBoard(aiBoardElement, aiBoard, true);
console.log("AI Board:", aiBoard);
