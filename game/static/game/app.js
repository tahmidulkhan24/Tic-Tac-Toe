const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");
const restartBtn = document.getElementById("restart-btn");
const lvl = document.getElementById("diff");


let currentPlayer = "X";
let gameOver = false;


let board = ["", "", "", "", "", "", "", "", ""];


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



cells.forEach(cell => {
    cell.addEventListener("click", handleClick);
});


restartBtn.addEventListener("click", restartGame);
lvl.addEventListener("change", restartGame);




function handleClick() {

    if (gameOver) return;

    if (this.textContent !== "") return;


    const index = this.dataset.index;


    this.textContent = currentPlayer;
    this.style.color = "#ffffff";


    board[index] = "X";


    let winner = checkWinner();


    if (winner === "X") {
        statusText.textContent = "You Win!";
        gameOver = true;
        return;
    }


    if (!board.includes("")) {
        statusText.textContent = "Draw!";
        gameOver = true;
        return;
    }


    statusText.textContent = "AI Thinking...";


    fetch("/move/", {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
        },

        body: JSON.stringify({
            board: board,
            lvl: lvl.value
        })
    })

    .then(response => response.json())

    .then(data => {

        const aiMove = data.ai_move;


        if (aiMove === -1) {
            statusText.textContent = "Draw!";
            gameOver = true;
            return;
        }


        cells[aiMove].textContent = "O";
        cells[aiMove].style.color = "#ffffff";


        board[aiMove] = "O";


        winner = checkWinner();


        if (winner === "O") {
            statusText.textContent = "AI Wins!";
            gameOver = true;
            return;
        }


        if (!board.includes("")) {
            statusText.textContent = "Draw!";
            gameOver = true;
            return;
        }


        statusText.textContent = "Your Turn (X)";
    });

}




function checkWinner() {

    for (let pattern of winPatterns) {

        const [a, b, c] = pattern;


        if (
            board[a] &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {
            return board[a];
        }
    }


    return null;
}




function restartGame() {

    cells.forEach(cell => {
        cell.textContent = "";
    });


    board = ["", "", "", "", "", "", "", "", ""];


    gameOver = false;


    currentPlayer = "X";


    statusText.textContent = "Your Turn (X)";
}