const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const boardCells = 4; //value will be 3 for 3x3 grid
const cellWidth = 125; //cell length/width
const borderWidth = 5;
const boardSize = (((boardCells +1)*borderWidth)+ (boardCells * cellWidth));
const difficulty = 1;

let board = [];

const state = {
    PLAYING: 'playing',
    STOPPED: 'stopped',
    WON: 'won',
}

//player enums
let player1 = {
    symbol: 'X',
    name: 'Human'
};
const player2 = {
    symbol: 'O',
    name: 'Computer'
};
const game = {
    state: state.PLAYING,
    turn: player1,
    moves: 0
}

function createBoard(){
    for (let y=1;y <=boardCells;y++){
        for (let x=1;x<=boardCells;x++){
            board.push({x:x,y:y,data:null});
        }
    }
    console.log(board)
    context.fillRect(0,0,boardSize,boardSize);
    function drawSquares(){
        let v=null,
        h=null,
        a=null,
        b=null
        for(let i=0; i<=((boardCells**2)-1); i++){ //loops for the number of total cells
            const iModBC = i%boardCells
            const iDivBC = Math.floor(i/boardCells)
            a = iModBC +1;
            b = iModBC;
            v = iDivBC +1;
            h = iDivBC;
            context.clearRect(((a*borderWidth)+(b*cellWidth)),((v*borderWidth)+(h*cellWidth)),cellWidth,cellWidth)
        }
    }
    drawSquares();
    turnIndicator();
};
function turnIndicator(){
    context.clearRect((boardSize+25),25,(boardSize+100),100);
    context.font = "24pt sans-serif";
    context.textAlign = "start"
    if(game.state == state.PLAYING){
        switch(game.turn){
            case player1:
                context.fillText("Turn: " + game.turn.name, boardSize + 30, 50);
                break;
            case player2:
                context.fillText("Computer is thinking...", boardSize + 30, 50);
                break;
        }
    }else if(game.state == state.WON){
        context.fillText(game.turn.name + " wins", boardSize + 30, 50)
    }else if(game.state == state.STOPPED){
        context.fillText("No winner", boardSize + 30, 50)
    }
}

function checkWin(endGameWhenWon,boardToCheck,playerToCheck){
    //find all squares current player has played in
    let plays = [];
    for (let g=0;g<boardToCheck.length;g++){ //populates the array of cells the player has played in
        if (boardToCheck[g].data == playerToCheck){
            plays.push(g);
        }
    }
    console.log(plays);
    for (let h=0;h<=plays.length;h++){ //for each item in the list of plays...
        for(let d=0;d<boardCells;d++){
            //checking horizontally:
            let indexes = (boardCells==3)? (plays[h] == 0|| plays[h]==3|| plays[h] == 6):(plays[h] == 0|| plays[h]==4|| plays[h] == 8|| plays[h] == 12) //only checks from the start of each row
            if (indexes){
                if(plays[h+1]-plays[h]==1){ //checks the next index in the lists array is consecutive -- this is to check if the player has played in a row.
                    if(plays[h+2]-plays[h+1]==1){ //checks the next index in the lists array
                        if(boardCells == 3 || plays[h+3]-plays[h+2]==1){
                            if(endGameWhenWon){
                                currentPlayerWins("horizontally");
                            }
                            return true;
                        }
                }
                }
            }
            //checking vertically:
            indexes = (boardCells==3)? (plays[h] == 0 || plays[h] == 1 || plays[h] == 2):(plays[h] == 0 || plays[h] == 1 || plays[h] == 2 || plays[h] == 3) //only checks from the top row
            if (indexes){
                //The vertical check could not use the same iteration loop as the horizontal check, as the plays index is sorted by index. Therefore if the player played in (1,1), (2,1), and (1,2), the iterative loop would have only searched the horizontal loop first and met the break condition.
                if(plays.includes(plays[h]+boardCells)){ //checks if the player has played in the cell below
                    if(plays.includes(plays[h]+(2*boardCells))){
                        if(boardCells == 3 || plays.includes(plays[h]+(3*boardCells))){
                            if(endGameWhenWon){
                                currentPlayerWins("vertically");
                            }
                            return true;
                        }
                    }
                }
            }
            //checks diagonally top left --> lower right
            if(plays[h] ==0){ //if play in the top left corner
                if(plays.includes(plays[h]+(boardCells+1))){ //if includes one cell diagonally south east
                    if(plays.includes((plays[h]+(2*boardCells))+2)){ //if includes the second cell diagonally south east
                        if(boardCells == 3 || plays.includes((plays[h]+(3*boardCells))+3)){
                            if(endGameWhenWon){
                                currentPlayerWins("diagonally TL -> BR");
                            }
                            return true;
                        }
                    }
                }
            }
            //checks diagonally top right --> lower left
            if(plays[h] == (boardCells-1)){ //if play in the top right corner
                if(plays.includes(plays[h]+(boardCells-1))){//if includes one cell diagonally south west
                    if(plays.includes(plays[h]+(2*boardCells)-2)){ //if includes the second cell diagonally south west
                        if(boardCells == 3 || plays.includes(plays[h]+(3*boardCells)-3)){
                            if(endGameWhenWon){
                                currentPlayerWins("BL <- TR");
                            }
                            return true;
                        }
                    }
                }
            }
            if(boardCells==4){ //in 4x4, players can win by playing a square
                if(plays.includes(plays[h] + 1)){
                    if(plays.includes(plays[h] + boardCells)){
                        if(plays.includes((plays[h] + boardCells)+1)){
                            if(endGameWhenWon){
                                currentPlayerWins("as square");
                            }
                            return true;
                        }
                    }
                }
                if(plays.includes(plays[h] + (boardCells - 1))){ //check for a diamond pattern
                    if(plays.includes(plays[h] + (boardCells + 1))){ //check cell south east
                        if(plays.includes(plays[h] + (boardCells*2))){ //check cell 2 rows below
                            if(endGameWhenWon){
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
    if(game.moves ==(boardCells**2)){ //if all moves have been played and there is no winner
        if(endGameWhenWon){
            console.log("no winners");
            game.state = state.STOPPED;
            turnIndicator();
            return true;
        }
        return "none";
        
    }
    return false;
}
function currentPlayerWins(method){
    console.log(game.turn.symbol,"wins",method);
    game.state = state.WON;
    turnIndicator();
}

function addMark(c){
    if (game.state == state.PLAYING){ //only works when game is playing
        if (board[c].data == null){ //checks cell is empty before playing
            board[c].data = game.turn; // updates the board array with which player played
            context.font = "36pt sans-serif";
            context.textAlign = "center";
            if(game.turn == player1){
                context.fillText(player1.symbol,(board[c].x * (borderWidth + cellWidth))-(cellWidth/2),(board[c].y * (borderWidth + cellWidth))-(cellWidth/2));
                console.log('human played in cell',c);
                if(checkWin(true,board,game.turn) == false){
                    game.turn = player2;
                    turnIndicator();
                    setTimeout(() => {
                        minimax(board,player2);
                      }, "300")
                }
            } else if (game.turn == player2){
                context.fillText(player2.symbol,(board[c].x * (borderWidth + cellWidth))-(cellWidth/2),(board[c].y * (borderWidth + cellWidth))-(cellWidth/2));
                console.log('computer played in cell',c);
                if(!checkWin(true,board,game.turn)){
                    game.turn = player1;
                    turnIndicator();
                    
                }
            }
        }else{ //when cell is not empty
            console.log('cell already played!')
        }
    }
};

createBoard();


function minimax(tempBoard,tempPlayer){
    if(difficulty == 0){ //'easy' mode chooses a random move
        let moves = getPossibleMoves(tempBoard)
        let move = moves[Math.floor(Math.random() * moves.length)]
        console.log(move)
        addMark(move);
        return false;
    }
    if (checkWin(false,tempBoard,player1)){ //checks if the human wins
        return {score:-10};
    } else if (checkWin(false,tempBoard,player2)){ //checks if the computer wins
        return {score:10};
    } else if (checkWin(false,tempBoard,player1) == "none"){ //checks if the game ends with no winners
        return {score:0};
    }
    let movesConsidering = [];
    let thisPossMoves = getPossibleMoves(tempBoard);
    for (let j=0;j<=thisPossMoves.length;j++){
        let thisMove = {};
        thisMove.index = thisPossMoves[j];
        tempBoard[thisPossMoves[j]].data = tempPlayer.symbol;
        if(tempPlayer == player2){
            let nextMove = minimax(tempBoard,player1);
            thisMove.score = nextMove.score;
        }else if(tempPlayer == player1){
            let nextMove = minimax(tempBoard,player2);
            thisMove.score = nextMove.score;
        }
        console.log(tempBoard);
        movesConsidering.push(thisMove);
    }
    console.log(thisPossMoves,tempBoard)

    function getPossibleMoves(getBoard){
        let possibleMoves = []
        for(let m=0;m<getBoard.length;m++){
            if(getBoard[m].data === null){
                possibleMoves.push(m);
            }
        };
        return possibleMoves;
    }
}

canvas.addEventListener('click',function(event){
    let x = Math.round(event.clientX - canvas.getBoundingClientRect().left);
    let y = Math.round(event.clientY - canvas.getBoundingClientRect().top);
    let cellx = Math.floor((x-(borderWidth*(boardCells+1)))/cellWidth) + 1;
    let celly = Math.floor((y-(borderWidth*(boardCells+1)))/cellWidth) + 1;
    //1 is added as the x&y coordinates start from 1 in the 'board array'
    let index = board.findIndex(board => board.x == cellx && board.y == celly);
    switch(index){
        case -1:
            console.log("clicked outside board");
            break;
        default:
            console.log(cellx,celly);
            console.log("clicked on cell",index);
            if(game.turn == player1){
                addMark(index);
            }
    } ;
},false);
