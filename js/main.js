let board = null;
let score = 0;
let startTile = 2;
let size = 4;
let tileContainer = document.querySelector(".tile-container");

window.onload = function () {
    newGame();
}

function newGame() {
    init();
    stopListen();
    let msg = document.querySelector('.game-message');
    msg.style.display = 'none';
    for (let i = 0; i < startTile; i++) {
        generateOneRandomTile(board);
    }
    listen(); 
}

function stopListen() {
    document.removeEventListener('keydown', handleKeyboardInput);
}

function handleKeyboardInput (event) {
    switch(event.key) {
        case "ArrowLeft" :
            if (slideLeft()) {
                generateOneRandomTile(board);
                setTimeout(() => {
                    isGameOver();
                }, 200);
            }
            break;
        case "ArrowRight" :
            if (slideRight()) {
                generateOneRandomTile(board);
                setTimeout(() => {
                    isGameOver();
                }, 200);
            }
            break;
        case "ArrowDown" :
            if (slideDown()) {
                generateOneRandomTile(board);
                setTimeout(() => {
                    isGameOver();
                }, 200);
            }
            break;
        case "ArrowUp" :
            if (slideUp()) {
                generateOneRandomTile(board);
                setTimeout(() => {
                    isGameOver();
                }, 200);
            }
            break;
        default:
            break;
    }
}

function listen() {
    document.addEventListener('keydown', handleKeyboardInput);
}

function isGameOver() {
    if (noAvailableCell(board) && noMove(board)) {
        gameOver();
    }
}

function gameOver() {
    stopListen();
    let msg = document.querySelector('.game-message');
    msg.style.display = 'block';
}

function init() {
   board = new Array(size).fill(0).map(() => new Array(size).fill(0));
   score = 0;
   clearTileContainer();
   resetScore();
}

function clearTileContainer() {
    while (tileContainer.firstChild) {
        tileContainer.removeChild(tileContainer.firstChild);
    }
}

function resetScore() {
    let scoreNode = document.getElementById('score');
    scoreNode.innerHTML = "0";
}

function updateScoreView() {
    let scoreNode = document.getElementById('score');
    scoreNode.innerHTML = score + '';
}

function generateOneRandomTile(board) {
    if (noAvailableCell(board)) {
        return false;
    }
    let [row, col] = getOneRandomTilePosition(board);
    let value = Math.random() < 0.5 ? 2 : 4;
    board[row][col] = value;
    createOneNewTile(row, col, value, true);
    return true;
}

function getAvailableCells(board) {
    let availableCells = [];
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] === 0) {
                availableCells.push([i, j]);
            }
        }
    }
    return availableCells;
}

function noAvailableCell(board) {
    return !(getAvailableCells(board).length);
}

function getOneRandomTilePosition(board) {
    let cells = getAvailableCells(board);
    if (noAvailableCell(board)) {
        return null;
    }   
    return cells[parseInt(Math.floor(Math.random() * cells.length))];
}

function createOneNewTile(row, col, value, isNew) {
    let wrapper = document.createElement("div");
    let inner = document.createElement("div");
    let positionClass = "tile-position-" + (col + 1) + "-" + (row + 1);
    let classes = ["tile", "tile-" + value, positionClass];
    if (isNew) {
        classes.push("tile-new");
    }
    wrapper.setAttribute("class", classes.join(" "));
    inner.classList.add("tile-inner");
    inner.textContent = value + '';
    wrapper.appendChild(inner);
    tileContainer.append(wrapper);
}

function slideLeft() {
    if (!canSlideLeft(board)) {
        return false;
    }
    for (let i = 0; i < size; i++) {
        let vec = board[i];
        board[i] = slide(vec);
    }
    updateBoardView();
    updateScoreView();
    return true;
}

function slideRight() {
    if (!canSlideRight(board)) {
        return false;
    }
    for (let i = 0; i < size; i++) {
        let vec = board[i].reverse();
        board[i] = slide(vec).reverse();
    }
    updateBoardView();
    updateScoreView();
    return true;
}

function slideUp() {
    if (!canSlideUp(board)) {
        return false;
    }
    for (let j = 0; j < size; j++) {
        let vec = [];
        for (let i = 0; i < size; i++) {
            vec.push(board[i][j]);
        }
        vec = slide(vec);
        for (let i = 0; i < size; i++) {
            board[i][j] = vec[i];
        }
    }
    updateBoardView();
    updateScoreView();
    return true;
}

function slideDown() {
    if (!canSlideDown(board)) {
        return false;
    }
    for (let j = 0; j < size; j++) {
        let vec = [];
        for (let i = size - 1; i >= 0; i--) {
            vec.push(board[i][j]);
        }
        vec = slide(vec);
        let k = 0;
        for (let i = size - 1; i >= 0; i--) {
            board[i][j] = vec[k++];
        }
    }
    updateBoardView();
    updateScoreView();
    return true;
}

function slide(row) {
    newRow = moveZeros(row);
    for (let i = 0; i < size - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
            newRow[i] *= 2;
            newRow[i + 1] = 0;
            score += newRow[i];
        }
    }
    newRow = moveZeros(newRow);
    return newRow;
}

function moveZeros(row) {
    let left = 0;
    for (let right = 0; right < size; right++) {
        if (row[right] !== 0) {
            let temp = row[right];
            row[right] = row[left];
            row[left++] = temp;
        }
    }
    return row;
}

function canSlideLeft(board) {
    for (let i = 0; i < size; i++) {
        for (let j = 1; j < size; j++) {
            if (board[i][j] !== 0) {
                if (board[i][j - 1] === 0 || board[i][j - 1] == board[i][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function canSlideRight(board) {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size - 1; j++) {
            if (board[i][j] !== 0) {
                if (board[i][j + 1] === 0 || board[i][j + 1] === board[i][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function canSlideUp(board) {
    for (let i = 1; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] !== 0) {
                if (board[i - 1][j] === 0 || board[i - 1][j] === board[i][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function canSlideDown(board) {
    for (let i = 0; i < size - 1; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] !== 0) {
                if (board[i + 1][j] === 0 || board[i + 1][j] === board[i][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function updateBoardView() {
    clearTileContainer();
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] !== 0) {
                createOneNewTile(i, j, board[i][j], false);
            }
        }
    }
}

function noMove(board) {
    if (canSlideLeft(board) || canSlideRight(board) || canSlideUp(board) || canSlideDown(board)) {
        return false;
    }
    return true;
}