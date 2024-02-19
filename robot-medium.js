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