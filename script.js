let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset");
let mainMenuBtn = document.querySelector("#mainMenu-btn");
let textBox = document.querySelector("#text-box");

let startScreen = document.querySelector("#start-screen");
let gameScreen = document.querySelector("#game-screen");

let playerOInput = document.querySelector("#player-o");
let playerXInput = document.querySelector("#player-x");
let startBtn = document.querySelector("#start-game");
let backToMenuBtn = document.querySelector("#back-to-menu");
let aiTimeOut;
let aiBackBtn = document.querySelector("#ai-back-btn");

const backToMenuAI = document.querySelector("#back-to-menu-ai");
const difficultyBtns = document.querySelectorAll(".difficulty-btn");

const mainMenu = document.querySelector("#main-menu");
const humanVsHumanBtn = document.querySelector("#human-vs-human");
const humanVsAIBtn = document.querySelector("#human-vs-ai");
const themeToggle = document.querySelector("#theme-toggle");
const themeIcon = document.querySelector("#theme-icon");
const savedTheme = localStorage.getItem("theme");

let turnO = true; //player X, player O
let moveCount = 0;
let playerO = "";
let playerX = "";
let gameMode = "";
let aiDifficulty = "";
let aiThinking = false;

const screens = document.querySelectorAll(".screen");

const showScreen = (screenId) => {
    screens.forEach((screen) => {
        screen.classList.add("hide");
    });
    document.querySelector(`#${screenId}`).classList.remove("hide");
}

////////////// MAIN MENU ////////////////////////////

humanVsHumanBtn.addEventListener("click", () => {
    gameMode = "human";
    aiBackBtn.classList.add("hide");
    showScreen("start-screen");
});

humanVsAIBtn.addEventListener("click", () => {
    gameMode = "ai";
    showScreen("ai-screen");
});

//load saved theme
if(savedTheme === "dark"){
    document.body.classList.add("dark-mode");
    themeToggle.innerText = "☀️";
}

//toggle theme
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    if(document.body.classList.contains("dark-mode")){
        themeIcon.innerText = "☀️";
        localStorage.setItem("theme", "dark");
    } else {
        themeIcon.innerText = "🌙";
        localStorage.setItem("theme", "light");
    }
});

///////////////// START MENU FOR HUMAN V/S HUMAN ///////////////////////

//start game
const startGame = () => {
    playerO = playerOInput.value.trim();
    playerX = playerXInput.value.trim();

    if (playerO === "") {
        playerO = "Player O";
    }
    if (playerX === "") {
        playerX = "Player X";
    }

    showScreen("game-screen");

    resetGame();
};

startBtn.addEventListener("click", startGame);

const clearPlayerNames = () => {
    playerOInput.value = "";
    playerXInput.value = "";
    playerO = "";
    playerX = "";
}

//back to menu button
backToMenuBtn.addEventListener("click", () => {
    clearPlayerNames();
    aiBackBtn.classList.add("hide");
    showScreen("main-menu");
});

/////////////////// GAME SCREEN ////////////////////////////

//winning patterns
const winPatterns = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

//to get board state in javascript in form of an array
const getBoardState = () => {
    return Array.from(boxes).map(box => box.innerText);
};

//box click
boxes.forEach((box) => {
    box.addEventListener("click", () => {

        //Don't allow clicks while AI is thinking
        if (aiThinking) return;

        //Human vs AI
        if (gameMode === "ai") {
            //Human's turn
            if (!turnO) {
                box.innerText = "X";
                box.disabled = true;
                moveCount++;

                updateAIBackButton();

                turnO = true;
                textBox.innerText = "AI's Turn";
                const gameOver = checkWinner();

                //if game is still running, let AI move
                if (!gameOver) {
                    aiMove();
                }
                return;
            }
        }

        //Human vs Human
        if (turnO) { //playerO
            box.innerText = "O";
            turnO = false;
            textBox.innerText = `${playerX}'s Turn`;
        } else { //playerX
            box.innerText = "X";
            turnO = true;
            textBox.innerText = `${playerO}'s Turn`;
        }
        box.disabled = true;
        moveCount++;
        checkWinner();
    });
});

//disable boxes
const disableBoxes = () => {
    for (let box of boxes) {
        box.disabled = true;
    }
};

//reset game
const resetGame = () => {
    if (aiTimeOut) {
        clearTimeout(aiTimeOut);
    }

    moveCount = 0;
    aiThinking = false;
    resetBoard();

    if (gameMode === "ai") {
        //Human is x and start
        turnO = false;
        textBox.innerText = "Your Turn";
    } else {
        //Human vs Human
        turnO = true;
        textBox.innerText = `${playerO}'s Turn`;
    }
};

//reset board
const resetBoard = () => {
    for (let box of boxes) {
        box.disabled = false;
        box.innerText = "";
        box.classList.remove("winner");
    }
};

//reset button
resetBtn.addEventListener("click", resetGame);

//redirect back to main menu
const redirectToMainMenu = () => {
    if(aiTimeOut){
        clearTimeout(aiTimeOut);
    }
    aiThinking = false;
    aiBackBtn.classList.add("hide");

    resetBoard();
    clearPlayerNames();
    showScreen("main-menu");
};

//main menu button
mainMenuBtn.addEventListener("click", redirectToMainMenu);

//highlight winner
const highlightWinner = (pattern) => {
    for (let index of pattern) {
        boxes[index].classList.add("winner");
    }
};

//show winner
const showWinner = (winner) => {

    //human vs AI win messages
    if (gameMode === "ai") {
        if (winner === "X") {
            textBox.innerText = "You Won!";
        } else {
            textBox.innerText = "AI Won!";
        }

        disableBoxes();
        aiBackBtn.classList.remove("hide");
    }

    //Human vs Human win messages
    else {
        let winnerName;

        if (winner === "O") {
            winnerName = playerO;
        } else {
            winnerName = playerX;
        }

        textBox.innerText = `Congratulations, Winner is ${winnerName}`;
        disableBoxes();
    }
};

//DRAW condition
const showDraw = () => {
    textBox.innerText = "It's a DRAW!!!!";
    disableBoxes();
    
    if(gameMode === "ai"){
        aiBackBtn.classList.remove("hide");
    }
};

//WINNER condition
const checkWinner = () => {
    for (let pattern of winPatterns) {
        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;

        if (pos1Val != "" && pos2Val != "" && pos3Val != "") {
            if (pos1Val === pos2Val && pos2Val === pos3Val) {
                highlightWinner(pattern);
                showWinner(pos1Val);
                return true;
            }
        }
    }
    if (moveCount === 9) {
        showDraw();
        return true;
    }
    return false;
};

//////////////////////// START MENU FOR HUMAN V/S AI //////////////////////////

backToMenuAI.addEventListener("click", () => {
    showScreen("main-menu");
});

difficultyBtns.forEach((button) => {
    button.addEventListener("click", () => {
        aiDifficulty = button.dataset.difficulty;
        showScreen("game-screen");
        resetGame();
        updateAIBackButton();
    });
});

//////////////// GAME FUNCTIONS OF HUMAN V/S AI ///////////////////////////////

//back button to redirect back to difficulty page
const updateAIBackButton = () => {
    if(gameMode === "ai" && moveCount === 0){
        aiBackBtn.classList.remove("hide");
    } else {
        aiBackBtn.classList.add("hide");
    }
}

aiBackBtn.addEventListener("click", () => {
    if(gameMode != "ai") return;

    if(aiTimeOut){
        clearTimeout(aiTimeOut);
    }

    aiThinking = false;
    moveCount = 0;
    resetBoard();
    aiBackBtn.classList.add("hide");
    showScreen("ai-screen");
});

//generate random moves
const getRandomMove = () => {
    const emptyBoxes = [];

    boxes.forEach((box, index) => {
        if (box.innerText === "") {
            emptyBoxes.push(index);
        }
    });

    if (emptyBoxes.length === 0) {
        return null;
    }

    const randomIndex = Math.floor(Math.random() * emptyBoxes.length);
    return emptyBoxes[randomIndex];
};

//selects the move according to difficulty level
const getAIMove = () => {
    if (aiDifficulty === "easy") {
        return getRandomMove();
    }

    if (aiDifficulty === "moderate") {
        return getModerateMove();
    }

    if(aiDifficulty === "hard") {
        return getBestMove();
    }
    return null;
};

//general behavior of AI
const aiMove = () => {
    aiThinking = true;

    const selectedIndex = getAIMove();

    if (selectedIndex === null) {
        aiThinking = false;
        return;
    }

    //AI "thinking" delay
    aiTimeOut = setTimeout(() => {

        const selectedBox = boxes[selectedIndex];

        //safety check
        if (selectedIndex === null) {
            aiThinking = false;
            return;
        }

        selectedBox.innerText = "O";
        selectedBox.disabled = true;

        moveCount++;
        turnO = false;
        aiThinking = false;

        const gameOver = checkWinner();

        if (!gameOver) {
            textBox.innerText = "Your Turn";
        }
    }, 600);
};

//find winning move for moderate difficulty

const findWinningMove = (symbol) => {
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;

        const values = [
            boxes[a].innerText,
            boxes[b].innerText,
            boxes[c].innerText,
        ];

        const symbolCount = values.filter(value => value === symbol).length;

        const emptyCount = values.filter(value => value === "").length;

        //two symbols + one empty cell
        if (symbolCount === 2 && emptyCount === 1) {
            if (values[0] === "") return a;
            if (values[1] === "") return b;
            if (values[2] === "") return c;
        }
    }

    return null;
};

//moderate move selection
const getModerateMove = () => {
    //Can AI win???
    const winningMove = findWinningMove("O");
    if (winningMove !== null) {
        return winningMove;
    }

    //can the player win???
    const blockingMove = findWinningMove("X");
    if (blockingMove !== null) {
        return blockingMove;
    }

    //take center if available
    if (boxes[4].innerText === "") {
        return 4;
    }

    //prefer random available corner
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(index => boxes[index].innerText === "");

    if (availableCorners.length > 0) {
        const randomCorner = Math.floor(Math.random() * availableCorners.length);
        return availableCorners[randomCorner];
    }

    //temporary fallback
    return getRandomMove();
};

//separate function for minimax
const checkWinnerForBoard = (board) => {
    for (let pattern of winPatterns) {
        const [a, b, c] = pattern;

        if (
            board[a] != "" &&
            board[a] === board[b] &&
            board[b] === board[c]
        ) {
            return board[a];
        }
    }

    if (!board.includes("")) {
        return "draw";
    }

    return null;
};

//main engine to produce the best move
//minimax function for hard mode
const minimax = (board, isMaximizing, depth) => {
    const result = checkWinnerForBoard(board);

    //stop recursion if the game is over
    if (result === "O") {
        return 10 - depth;
    }

    if (result === "X") {
        return depth - 10;
    }

    if (result === "draw") {
        return 0;
    }

    //MAX - AI
    if (isMaximizing) {
        let bestScore = -Infinity;  //starting with the worst possible value

        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "O";
                const score = minimax(board, false, depth + 1);
                board[i] = "";
                bestScore = Math.max(bestScore, score);
            }
        }
        return bestScore;
    }

    //MIN - human
    if (!isMaximizing) {
        let bestScore = Infinity;

        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "X";
                const score = minimax(board, true, depth + 1);
                board[i] = "";
                bestScore = Math.min(bestScore, score);
            }
        }
        return bestScore;
    }
};

//to connect the abstract minimax algorithm and the existing getAIMove()
const getBestMove = () => {
    const board = getBoardState();

    let bestScore = -Infinity;
    let bestMove = null;

    for(let i = 0; i < board.length; i++){
        if(board[i] === ""){
            board[i] = "O";
            const score = minimax(board, false, 0);
            board[i] = "";
            
            if(score > bestScore){
                bestScore = score;
                bestMove = i;
            }
        }
    }
    return bestMove;
};