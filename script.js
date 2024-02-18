// global variables
let board = [0, 0, 0,
            0, 0, 0,
            0, 0, 0]
let turn = -1
let gameOver = false 
let xScore = 0
let oScore = 0
let catScore = 0

// on load
$(function() {
    createBoard()
    updateScoreBoard()
});

// createBoard
function createBoard () {
    
    // clear variables
    board = [0, 0, 0, 0, 0, 0, 0, 0, 0]
    // xIsHuman = true
    // oIsHuman = true
    gameOver = false

    // update dom board
    const boardDiv = $("#board")
    boardDiv.empty()
    for (row=0;row<3;row++) {
        rowDiv = $("<div>")
            .attr("class", "row")
        for (col=0;col<3;col++) {
            colDiv = $("<button>")
                .attr("class", "col")
                .attr("id", col+row*3) 
            rowDiv.append(colDiv)
        }
        boardDiv.append(rowDiv)
    }

    // trigger robot
    if ( (turn == -1 && xIsHuman == false) ||
    (turn == 1 && oIsHuman == false) ) {
        getRobotMove()
    }
}

// handle new game button
$("#newGame").on("click", function() {
    createBoard()
})

// handle click on cell
$("#board").on("click", "button", function() {
    let boardIndex = parseInt($(this).attr("id"))
    if (board[boardIndex] == 0) {
        selectCell(boardIndex)
    }
})

// handles human and robot selections (already verified that cell is available)
function selectCell(boardIndex) {
    if (gameOver === false) {

        // mark cell
        $(`#${boardIndex}`).text(turn == -1? "X": "O")
        board[boardIndex] = turn

        // check for win
        let winner = isWin(board);

        if (winner !== 0) {
            gameOver = true
            console.log("winner:", winner)

            // update scoreboard
            if (winner === -1) xScore+=1
            if (winner === 1) oScore+=1
            updateScoreBoard()
        
        // check if board is full
        } else if (!board.includes(0)) {
            gameOver = true
            catScore+=1
            updateScoreBoard()

        } else {
            // change turns
            turn = turn * -1

            // trigger robot
            if ( (turn == -1 && xIsHuman == false) ||
                (turn == 1 && oIsHuman == false) ) {
                getRobotMove()
            }
        }
    }
}

function isWin(boardToCheck) {
    let winner = 0
    const winningLines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]
    for (line of winningLines) {
        if (boardToCheck[line[0]] === boardToCheck[line[1]] && boardToCheck[line[1]] === boardToCheck[line[2]]) {
            winner = boardToCheck[line[0]]
        }
    }
    return winner
}


// scoreBoard
function updateScoreBoard(){
    $("#xScore").text(`X: ${xScore}`)
    $("#oScore").text(`O: ${oScore}`)
    $("#catScore").text(`Cat: ${catScore}`)
}

// robot buttons
let xIsHuman = true
$("#xIsHuman").on("click", function() {
    if ($(this).text() === "Human") {
        $(this).text("Robot");
        xIsHuman = false
        
        if (turn === -1) getRobotMove()
    } else {
        $(this).text("Human");
        xIsHuman = true
    }
})
let oIsHuman = true
$("#oIsHuman").on("click", function() {
    if ($(this).text() === "Human") {
        $(this).text("Robot");
        oIsHuman = false

        if (turn === 1) getRobotMove()
    } else {
        $(this).text("Human");
        oIsHuman = true
    }
})

// get robots and call selectCell(boardIndex)
function getRobotMove () {
    console.log("go robot")

    // get potential moves
    potentialMoves = board.flatMap((cell, index) => cell === 0 ? index : []);
    console.log(potentialMoves)

    robotMove = lookAheadOne(potentialMoves)
 
    // select
    selectCell(robotMove)
}

// stupid robot (completely random)
function stupidBot(potentialMoves) {
    randomIndex = Math.floor(Math.random() * (potentialMoves.length)) + 0;
    robotMove = potentialMoves[randomIndex]

    return robotMove
}

// look ahead one
function lookAheadOne(potentialMoves) {

    // if win, take (and early return)
    for (let i of potentialMoves) {
        // check if potentialMove would win
        let boardToCheck = JSON.parse(JSON.stringify(board))
        boardToCheck[i] = turn
        let winner = isWin(boardToCheck);
        if (winner === turn) {
            console.log("playing win", i)
            return i
        }
    }

    // if move would result in opponent winning, block it (and early return)
    for (let i of potentialMoves) {
        // check if potentialMove would win for opponent
        let boardToCheck = JSON.parse(JSON.stringify(board))
        boardToCheck[i] = turn * -1
        let winner = isWin(boardToCheck);
        if (winner === turn * -1) {
            console.log("playing to avoid loss", i)
            return i
        }
    }

    // else, random
    randomIndex = Math.floor(Math.random() * (potentialMoves.length)) + 0;
    robotMove = potentialMoves[randomIndex]
    console.log("playing random", robotMove)
    return robotMove
}