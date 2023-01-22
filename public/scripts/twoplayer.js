const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const boardCells = 3; //value will be 3 for 3x3 grid
const cellWidth = 100; //cell length/width
const borderWidth = 5;
const boardSize = (((boardCells +1)*borderWidth)+ (boardCells * cellWidth));

let board = [];

const state = {
    PLAYING: 'playing',
    STOPPED: 'stopped',
    WON: 'won'
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
    turn: 'X'
}

function createBoard(){
    for (let y=1;y <=boardCells;y++){
        for (let x=1;x<=boardCells;x++){
            board.push({x:x,y:y,data:null});
        }
    }
    console.log(board)
    context.fillRect(0,0,boardSize,boardSize);
    //top row
    context.clearRect(borderWidth,borderWidth,cellWidth,cellWidth);
    context.clearRect((cellWidth + (2*borderWidth)),borderWidth,cellWidth,cellWidth);
    context.clearRect(((2*cellWidth) + (3*borderWidth)),borderWidth,cellWidth,cellWidth);
    //middle row
    context.clearRect(borderWidth,(cellWidth + (2*borderWidth)),cellWidth,cellWidth);
    context.clearRect((cellWidth + (2*borderWidth)),(cellWidth + (2*borderWidth)),cellWidth,cellWidth);
    context.clearRect(((2*cellWidth) + (3*borderWidth)),(cellWidth + (2*borderWidth)),cellWidth,cellWidth);
    //bottom row
    context.clearRect(borderWidth, ((2*cellWidth) + (3*borderWidth)),cellWidth,cellWidth);
    context.clearRect((cellWidth + (2*borderWidth)),((2*cellWidth) + (3*borderWidth)),cellWidth,cellWidth);
    context.clearRect(((2*cellWidth)+(3*borderWidth)),((2*cellWidth)+(3*borderWidth)),cellWidth,cellWidth);
    //     //add grid numbers
    //     context.font = "16pt sans-serif";
    //     context.fillText("0",140,25);
    //     context.fillText("1",295,25);
    //     context.fillText("2",450,25);
    //     context.fillText("3",140,180);
    //     context.fillText("4",295,180);
    //     context.fillText("5",450,180);
    //     context.fillText("6",140,335);
    //     context.fillText("7",295,335);
    //     context.fillText("8",450,335);
    context.font = "24pt sans-serif";
    context.fillText("Turn: " + game.turn, boardSize + 25, 25)
};


function areEqual(){
    for(let u=1;u<arguments.length;u++){
        if (arguments[u] === null || arguments[u] !== arguments[u-1]){
            return false;
        }
        return true;
    }
}

function checkWin(){
    //find all squares X has played in
    let xPlays = [];
    for (let g=0;g<board.length;g++){
        if (board[g].data == 'X'){
            xPlays.push({x:board[g].x,y:board[g].y});

        }
    }
    //find all squares Y has played in
    let yPlays = [];
    for (let h=0;h<board.length;h++){
        yPlays.push({x:board[h].x,y:board[h].y});
    }
    return false;
}

function addMark(c){
    if (game.state == state.PLAYING){ //only works when game is playing
        if (board[c].data == null){ //checks cell is empty before playing
            board[c].data = game.turn; // updates the board array with which player played
            context.font = "36pt sans-serif";
            context.textAlign = "center";
            if(game.turn == 'X'){
                context.fillText("X",(board[c].x * (borderWidth + cellWidth))-(cellWidth/2),(board[c].y * (borderWidth + cellWidth))-(cellWidth/2));
                game.turn = 'O'
                console.log('X played in cell',c)
            } else if (game.turn == 'O'){
                context.fillText(".",(board[c].x * (borderWidth + cellWidth))-(cellWidth/2),(board[c].y * (borderWidth + cellWidth))-(cellWidth/2));
                game.turn = 'X'
                console.log('O played in cell',c)
            }
            checkWin();
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
    //1 is added as the x&y coordinates start from one in the 'board array'
    console.log(cellx,celly);
    let index = board.findIndex(board => board.x == cellx && board.y == celly);
    console.log("cell",index);
    addMark(index);
},false);
