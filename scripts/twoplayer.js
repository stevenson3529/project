const canvas = document.getElementById('#canvas');
const context = canvas.getContext('2d');

function createBoard(){
    context.strokeRect(0,0,450,450);
}

createBoard();