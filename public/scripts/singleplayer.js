const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const boardCells = 3; //value will be 3 for 3x3 grid
const cellWidth = 85; //cell length/width
const borderWidth = 5;
const boardSize = (((boardCells +1)*borderWidth)+ (boardCells * cellWidth));

let board = [];

const state = {
    PLAYING: 'playing',
    STOPPED: 'stopped',
    WON: 'won',
}

//player enums
let player1 = {
    symbol: 'X',
    name: 'Player 1'
};
const player2 = {
    symbol: 'O',
    name: 'Player2'
};
const game = {
    state: state.PLAYING,
    turn: player1.symbol,
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
        context.fillText("Turn: " + game.turn, boardSize + 30, 50)
    }else if(game.state == state.WON){
        context.fillText(game.turn + " wins", boardSize + 30, 50)
    }else if(game.state == state.STOPPED){
        context.fillText("No winner", boardSize + 30, 50)
    }
}

function checkWin(){
    //find all squares current player has played in
    let plays = [];
    for (let g=0;g<board.length;g++){ //populates the array of cells the player has played in
        if (board[g].data == game.turn){
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
                            console.log(game.turn,'wins horizontally');
                            game.state = state.WON;
                            turnIndicator();
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
                            console.log(game.turn,'wins vertically');
                            game.state = state.WON;
                            turnIndicator();
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
                            console.log(game.turn,'wins diagonally TL -> BR');
                            game.state = state.WON;
                            turnIndicator();
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
                            console.log(game.turn,'wins diagonally TR -> BL');
                            game.state = state.WON;
                            turnIndicator();
                            return true;
                        }
                    }
                }
            }
        }
    }
    game.moves++ //increments moves by one after checking game hasn't been won
    if(game.moves ==(boardCells**2)){ //if all moves have been played and there is no winner
        console.log("no winners");
        game.state = state.STOPPED;
        turnIndicator();
        return true;
    }
    return false;
}

function addMark(c){
    if (game.state == state.PLAYING){ //only works when game is playing
        if (board[c].data == null){ //checks cell is empty before playing
            board[c].data = game.turn; // updates the board array with which player played
            context.font = "36pt sans-serif";
            context.textAlign = "center";
            if(game.turn == player1.symbol){
                context.fillText("X",(board[c].x * (borderWidth + cellWidth))-(cellWidth/2),(board[c].y * (borderWidth + cellWidth))-(cellWidth/2));
                console.log('X played in cell',c);
                if(checkWin() == false){
                    game.turn = player2.symbol;
                    turnIndicator();
                }
            } else if (game.turn == player2.symbol){
                context.fillText("O",(board[c].x * (borderWidth + cellWidth))-(cellWidth/2),(board[c].y * (borderWidth + cellWidth))-(cellWidth/2));
                console.log('O played in cell',c);
                if(!checkWin()){
                    game.turn = player1.symbol;
                    turnIndicator();
                }
            }
        }else{ //when cell is not empty
            console.log('cell already played!')
        }
    }
};

createBoard();

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
            addMark(index);
    } ;
},false);
