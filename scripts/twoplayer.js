const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

function createBoard(){
    context.fillRect(0,0,466,466);
    //top row
    context.clearRect(4,4,150,150);
    context.clearRect(158,4,150,150);
    context.clearRect(312,4,150,150);
    //middle row
    context.clearRect(4,158,150,150);
    context.clearRect(158,158,150,150);
    context.clearRect(312,158,150,150);
    //bottom row
    context.clearRect(4,312,150,150);
    context.clearRect(158,312,150,150);
    context.clearRect(312,312,150,150);
    
}

createBoard();