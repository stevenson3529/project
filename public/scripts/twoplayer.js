const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const boardCells = 3; //value will be 3 for 3x3 grid
const cellWidth = 165; //cell length/width
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
    if(
        areEqual(board[0].data,board[1].data,board[2].data)
        || areEqual(board[3].data,board[4].data,board[5].data)
        || areEqual(board[6].data,board[7].data,board[8].data)
        || areEqual(board[0].data,board[3].data,board[6].data)
        || areEqual(board[1].data,board[4].data,board[7].data)
        || areEqual(board[2].data,board[5].data,board[8].data)
        || areEqual(board[0].data,board[4].data,board[8].data)
        || areEqual(board[2].data,board[4].data,board[8].data)
    ){
        console.log("Win");
        return true;
    }
    return false;
}

function addMark(c){
    if (game.state == state.PLAYING){
        if (board[c].data === null){
            board[c].data = game.turn;
            if(game.turn == 'X'){
                context.font = "36pt sans-serif"
                context.fillText("X",((board[c].x * borderWidth)),((board[c].y * borderWidth)));
                game.turn = 'O'
            } else if (game.turn == 'O'){
                context.font = "36pt sans-serif"
                context.fillText("O",(+(board[c].x * borderWidth)),((board[c].y * borderWidth)));
                game.turn = 'X'
            }
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



//     let cellx = Math.floor((x-16)/150) + 1;
//     let celly = Math.floor((y-16)/150) + 1;
//     console.log(cellx,celly);
//     let index = board.findIndex(b => b.x == cellx && b.y == celly);
//     console.log("cell",index);
    // addMark(index)