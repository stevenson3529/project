const canvas = document.getElementById('canvas'); // Get the canvas element from the DOM
const context = canvas.getContext('2d'); // Get the 2D rendering context of the canvas
const boardCells = 3; // Set the number of cells in each row and column of the game board
const cellWidth = 125; // Set the width and height of each individual cell on the game board
const borderWidth = 5; // Set the width of the border around each cell
// Calculate the size of the game board based on the number of cells and cell dimensions
const boardSize = (((boardCells +1)*borderWidth)+ (boardCells * cellWidth));
const difficulty = 1; // Set the game difficulty

let board = []; // Initialize the game board as an empty array

// Define game states as constants for easy reference
const state = {
    PLAYING: 'playing',
    STOPPED: 'stopped',
    WON: 'won',
}

// Define player objects with symbols and names
const player1 = {
    symbol: 'X',
    name: 'Human'
};
const player2 = {
    symbol: 'O',
    name: 'Computer'
};

// Initialize the game object with the current state, active player, and move count
const game = {
    state: state.PLAYING,
    turn: player1,
    moves: 0
}

// This function creates the game board by initializing the board array with empty data for each cell
function createBoard() {
    for (let y=1;y <=boardCells;y++) {
        for (let x=1;x<=boardCells;x++) {
            // Add a new object to the board array for each cell with its x and y coordinates and null data
            board.push({x:x, y:y, data:null});
        }
    }
    // Log the current state of the board array to the console
    console.log("board:",board)
    // draws a rectangle onto the cnavas with dimensions 'boardSize'
    context.fillRect(0,0,boardSize,boardSize);

    // This function is nested inside the createBoard() function and is used to draw individual cells on the board
    function drawSquares() {
        let v=null,
        h=null,
        a=null,
        b=null

        // Loop through each cell on the board and calculate its position on the canvas
        for(let i=0; i<=((boardCells**2)-1); i++) { //loops for the number of total cells
            const iModBC = i%boardCells
            const iDivBC = Math.floor(i/boardCells)
            a = iModBC +1;
            b = iModBC;
            v = iDivBC +1;
            h = iDivBC;

            // Clear the canvas at the calculated position to draw a cell
            context.clearRect(((a*borderWidth)+(b*cellWidth)),((v*borderWidth)+(h*cellWidth)),cellWidth,cellWidth)
        }
    }
    drawSquares(); // Call the drawSquares() function to draw all cells on the board
    turnIndicator(); // Call the turnIndicator() function to update the display for the active player's turn
};

// This function updates the display for the active player's turn
function turnIndicator() {
    // Clear the canvas area reserved for the turn indicator
    context.clearRect((boardSize+25),25,(boardSize+100),100);
    context.font = "24pt sans-serif";
    context.textAlign = "start"

    // Check the current game state and display appropriate text for the active player's turn
    if (game.state == state.PLAYING) {
        switch(game.turn) {
            case player1:
                context.fillText("Turn:" + game.turn.name, boardSize + 30, 50);
                break;
            case player2:
                context.fillText("Computer is thinking...", boardSize + 30, 50);
                break;
        }
    } else if (game.state == state.WON) {
        context.fillText(game.turn.name + " wins", boardSize + 30, 50)
    } else if (game.state == state.STOPPED) {
        context.fillText("No winner", boardSize + 30, 50)
    }
}

function checkWin(endGameWhenWon,boardToCheck,playerToCheck) {
    // find all squares current player has played in
    let plays = []; // initialise an empty array to hold the indexes of all the cells a player has played in

    // checks through each cell and pushes its index to plays[] if it has been played in
    for (let g=0;g<boardToCheck.length;g++) {
        if (boardToCheck[g].data == playerToCheck) {
            plays.push(g);
        }
    }
    //console.log("checkwin -plays:", plays); // outputs plays array

    // loops through different directions to find winning conditions:
    for (let h=0;h<=plays.length;h++) { // for each item in the list of plays...
        for(let d=0;d<boardCells;d++) { // iterate over each cell on the board

            //checking horizontally:
            let indexes = (boardCells==3)? (plays[h] == 0|| plays[h] == 3|| plays[h] == 6) : (plays[h] == 0|| plays[h] == 4|| plays[h] == 8|| plays[h] == 12) //only checks from the start of each row
            
            if (indexes) {
                if(plays[h+1]-plays[h]==1) { // checks the next index in the lists array is consecutive -- this is to check if the player has played in a row.
                    if(plays[h+2]-plays[h+1]==1) { // checks the next index in the lists array
                        if(boardCells == 3 || plays[h+3]-plays[h+2]==1) { // if the board size is 3x3 and the player has played consecutively in a row for four cells, or if the board size is 4x4 and the player has played consecutively in a row for four cells
                            if(endGameWhenWon) {
                                currentPlayerWins("checkwin -won horizontally"); // announce that the current player has won horizontally
                            }
                            return true; // return true to indicate that the game has ended
                        }
                }
                }
            }

            //checking vertically:
            indexes = (boardCells==3)? (plays[h] == 0 || plays[h] == 1 || plays[h] == 2):(plays[h] == 0 || plays[h] == 1 || plays[h] == 2 || plays[h] == 3) //only checks from the top row
            if (indexes) {
                //The vertical check could not use the same iteration loop as the horizontal check, as the plays index is sorted by index. Therefore if the player played in (1,1), (2,1), and (1,2), the iterative loop would have only searched the horizontal loop first and met the break condition.
                if(plays.includes(plays[h]+boardCells)) { //checks if the player has played in the cell below
                    if(plays.includes(plays[h]+(2*boardCells))) {
                        if(boardCells == 3 || plays.includes(plays[h]+(3*boardCells))) {
                            if(endGameWhenWon) {
                                currentPlayerWins("vertically");
                            }
                            return true;
                        }
                    }
                }
            }

            //checks diagonally top left --> lower right
            if(plays[h] ==0) { //if play in the top left corner
                if(plays.includes(plays[h] + (boardCells+1))) { //if includes one cell diagonally south east
                    if(plays.includes((plays[h] + (2*boardCells)) + 2)) { //if includes the second cell diagonally south east
                        if(boardCells == 3 || plays.includes((plays[h] + (3*boardCells)) + 3)) {
                            if(endGameWhenWon) {
                                currentPlayerWins("diagonally TL -> BR");
                            }
                            return true;
                        }
                    }
                }
            }

            //checks diagonally top right --> lower left
            if(plays[h] == (boardCells-1)) { //if play in the top right corner
                if(plays.includes(plays[h] + (boardCells-1))) {//if includes one cell diagonally south west
                    if(plays.includes(plays[h] + (2*boardCells)-2)) { //if includes the second cell diagonally south west
                        if(boardCells == 3 || plays.includes(plays[h] + (3*boardCells)-3)) {
                            if(endGameWhenWon) {
                                currentPlayerWins("BL <- TR");
                            }
                            return true;
                        }
                    }
                }
            }

            if(boardCells==4) { //in 4x4, players can win by playing a square
                if(plays.includes(plays[h] + 1)) {
                    if(plays.includes(plays[h] + boardCells)) {
                        if(plays.includes((plays[h] + boardCells)+1)) {
                            if(endGameWhenWon) {
                                currentPlayerWins("as square");
                            }
                            return true;
                        }
                    }
                }

                if(plays.includes(plays[h] + (boardCells - 1))) { //check for a diamond pattern
                    if(plays.includes(plays[h] + (boardCells + 1))) { //check cell south east
                        if(plays.includes(plays[h] + (boardCells*2))) { //check cell 2 rows below
                            if(endGameWhenWon) {
                                currentPlayerWins("as diamond");
                            }
                            return true;
                        }
                    }
                }
            }
        }
    }


    game.moves++ //increments moves by one after checking game hasn't been won
    // If all moves have been played and there is no winner
    if(game.moves ==(boardCells**2)) {
        if(endGameWhenWon) {
            console.log("no winners");
            game.state = state.STOPPED;
            turnIndicator();
            return true;
        }
        // Returns "none" if endGameWhenWon flag is set to false
        return "none";
        
    }
    // returns 'false' if the game hasnt ended yet
    return false;
}

// outputs & displays which and how the player one
function currentPlayerWins(method) { // 'method' indicates how the player won, i.e. HORIZONTALLY, VERTICALLY, DIAGONALLY
    console.log(game.turn.symbol, " - wins - ", method); // outputs which player won and how
    game.state = state.WON; // updates the game state
    turnIndicator(); // updates the on screen text to show who has won
}

// adds the playerX.symbol to a cell when they play in it
function addMark(c) {
    //first, checks that the player can play in cell:
    if (game.state == state.PLAYING) { //only works when game is playing
        if (board[c].data == null) { //checks cell is empty before playing
            board[c].data = game.turn; // updates the board array with which player played

            //sets contexs values
            context.font = "36pt sans-serif";
            context.textAlign = "center";

            // performs code based on who plays:
            // PLAYER 1'S TURN
            if(game.turn == player1) {
                // sets the fillText to the playerX.symbol
                context.fillText(player1.symbol,(board[c].x * (borderWidth + cellWidth)) - (cellWidth/2), (board[c].y * (borderWidth + cellWidth)) - (cellWidth/2));
                
                console.log('human played in cell:',c); // outputs the play to console

                // checks if game has ended
                if(checkWin(true, board, game.turn) == false) {
                    game.turn = player2; // player 2's turn
                    turnIndicator(); // updates player turn on screen
                    setTimeout(() => { // adds an artificial pause
                        addMark(minimax(board, player2).index);
                      }, "300")
                }

            // PLAYER 2'S TURN
            } else if (game.turn == player2) {
                // sets the fillText to theplayerX.symbol
                context.fillText(player2.symbol,(board[c].x * (borderWidth + cellWidth))-(cellWidth/2),(board[c].y * (borderWidth + cellWidth))-(cellWidth/2));
                console.log('computer played in cell: ',c); // outputs the play to console

                // checks if game has ended
                if(!checkWin(true,board,game.turn)) {
                    game.turn = player1; // player 2's turn
                    turnIndicator(); // updates player turn on screen  
                }
            }

        } else { //when cell is not empty
            console.error('cell already played')
        }
    }
};
createBoard();


let iter = 0;
function minimax(tempBoard,player) {

    // DIFFICULTY: 0, 'easy'
    // 'easy' mode chooses a random move
    if(difficulty == 0) {
        let moves = getPossibleMoves(tempBoard)
        let thisMove = moves[Math.floor(Math.random() * moves.length)]
        console.log(thisMove)
        addMark(thisMove);
        return false;
    }

    iter++;
    let array = getPossibleMoves(tempBoard); // gets an array of all possible moves
    
    // DIFFICULTY: 1, 'normal'
    // 'normal' mode uses the minimax algorithm
    if (checkWin(false, tempBoard, player1)) { //checks if the human wins
       return {score: -10};
    } else if (checkWin(false, tempBoard, player2)) { //checks if the computer wins
        return {score: 10};
    } else if (array.length === 0) { //checks if the game ends with no winners
        return {score: 0};
    }

    /**
     * This code is trying to evaluate the best possible move for a given player in the game using the minimax algorithm. 
     * It generates a list of possible moves, makes each move on a temporary board, 
     * calculates the minimax score for the next move, 
     * and stores the score and index of each move in an array.
     */
    let movesConsidering = []; // declare an empty array holding indexes of potential moves
    // loop through all possible moves
    for (let i = 0; i < array.length; i++) {
        let thisMove = {}; // create an empty object to hold information about this move
        thisMove.index = tempBoard[array[i]]; // set the index of this move in the board array
        tempBoard[array[i]].data = player; // make the move on the temporary board

        if(player == player2) { // if it is the humans turn
            let nextMove = minimax(tempBoard,player1); // calculate the minimax score for the next move (player 1's turn)
            thisMove.score = nextMove.score; // set the score for this move to be the score of the next move
        } else { // if it's player 1's turn
            let nextMove = minimax(tempBoard,player2); // calculate the minimax score for the next move (player 2's turn)
            thisMove.score = nextMove.score; // set the score for this move to be the score of the next move
        }
        console.log("minimax -thisMove: ",i ," temp board:", tempBoard); // log the temporary board to the console (for debugging purposes)
        tempBoard[array[i]].data = thisMove.index; // reset the board to empty for the next iteration
        movesConsidering.push(thisMove); // add this move to the array of potential moves
    }
    console.log("iteration:",iter, " possible moves:", array, " temp board:", tempBoard) // log the list of possible moves and the final state of the board (for debugging purposes)

    let bestMove;
    if (player == player2) { //if it is the computer turn
        let bestScore = -100000;
        for (let i = 0; i < movesConsidering.length; i++) { //Check every move that the algorithm is considering
            if (movesConsidering[i].score > bestScore) { //if the current score is better than the best score
                bestScore = movesConsidering[i].score; //save the best score
                bestMove = i; //remember which index the best move is at
            }
            if (bestScore === 10) { 
                break; // exit minimax if the best score is found
            }
        }
    } else { //if it is the human's turn
        let bestScore = 100000;
        for (let i = 0; i < movesConsidering.length; i++) {
            if (movesConsidering[i].score < bestScore) {
                bestScore = movesConsidering[i].score;
                bestMove = i;
            }
            if (bestScore === -10) { 
                break; // exit minimax if the best score is found
            }
        }
    }
    let index = (movesConsidering[bestMove].index.y - 1) * boardCells + (movesConsidering[bestMove].index.x - 1) //Converts the best move found in the algorithm to the index found in the main board array

    console.log("best move: (", movesConsidering[bestMove].index.x,",",movesConsidering[bestMove].index.y, ")");
    console.log("at index:", index);
    console.log("with score:",bestScore);
  
    return {score: bestScore, index: index};

}

function getPossibleMoves(possMovesBoard) { // define a function that takes a game board as input
    let possibleMoves = [] // create an empty array to hold the possible moves
    for(let m=0; m<possMovesBoard.length; m++) { // loop through each square on the board
        if(possMovesBoard[m].data === null) { // if the square is empty
            possibleMoves.push(m); // add the index of the square to the array of possible moves
        }
    };
    return possibleMoves; // return the array of possible moves
}

// Adds an event listener to the canvas that listens for clicks
canvas.addEventListener('click',function(event) {
    // Calculates the x and y position of the click relative to the canvas
    let x = Math.round(event.clientX - canvas.getBoundingClientRect().left);
    let y = Math.round(event.clientY - canvas.getBoundingClientRect().top);

    // Calculates the x and y position of the cell that was clicked
    let cellx = Math.floor((x-(borderWidth*(boardCells+1)))/cellWidth) + 1;
    let celly = Math.floor((y-(borderWidth*(boardCells+1)))/cellWidth) + 1;
    
    // Adds 1 to the x and y coordinates to match the 'board array'
    // Finds the index of the clicked cell in the 'board' array using its x and y coordinates
    let index = board.findIndex(board => board.x == cellx && board.y == celly);

    // A switch statement that executes different code based on the value of 'index'
    switch(index) {
        case -1:
            console.error("clicked outside board");
            break;
        default:
            console.warn("clicked on cell: (", cellx,",",celly, ")");
            console.warn("clicked on cell:", index);

            // If it's the human player's turn, call the addMark function with the clicked cell's index as an argument
            if(game.turn == player1) {
                addMark(index);
            }
    } ;
},false);
