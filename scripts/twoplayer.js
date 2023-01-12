const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

function createBoard(){
    context.font = "16pt sans-serif";
    context.fillRect(0,0,466,466);
    //top row
    context.clearRect(4,4,150,150);
    context.fillText("0",140,25);
    context.clearRect(158,4,150,150);
    context.fillText("1",295,25);
    context.clearRect(312,4,150,150);
    context.fillText("2",450,25);
    //middle row
    context.clearRect(4,158,150,150);
    context.fillText("3",140,180);
    context.clearRect(158,158,150,150);
    context.fillText("4",295,180);
    context.clearRect(312,158,150,150);
    context.fillText("5",450,180);
    //bottom row
    context.clearRect(4,312,150,150);
    context.fillText("6",140,335);
    context.clearRect(158,312,150,150);
    context.fillText("7",295,335);
    context.clearRect(312,312,150,150);
    context.fillText("8",450,335);
    
}

createBoard();