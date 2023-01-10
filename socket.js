//This Socket.IO script means that the game is hosted 'remotely' and pushed to each client

const http = require('http');
const sockets = require('socket.io');
const server = http.createServer();
const io = sockets(server, {
  cors: {
    origin: "",
    methods: ["GET", "POST"]
  }
});

server.listen(3000, function() {
  console.log("Listening on port 3000");
});

const Statuses = {
  WAITING: 'waiting',
  PLAYING: 'playing',
  DRAW: 'draw',
  WIN: 'win'
}

let gameState = {
  board: new Array(9).fill(null),
  currentPlayer: null,
  players: [],
  result: {
    status: Statuses.WAITING
  }
};

io.on('connection',function(connection){
    connection.on('addPlayer', addPlayer(connection.id));
    connection.on('action', action(connection.id));
    connection.on('rematch', rematch(connection.id));
    connection.on('disconnect',disconnect(connection.id));
});

function addPlayer(socketID){
    return (data)=>{
        const numberOfPlayers = gameState.players.length;
        if (numberOfPlayers >= 2){ //do not add more than 2 players, if game full then break
            return;
        };
        let nextSymbol = 'X';
        if (numberOfPlayers === 1){
            if (gameState.players[0].symbol === 'X'){ //If there is already a player in the game with X
                nextSymbol = 'O'; //Assign O to the new player
            }
        };
        const newPlayer = { //add new player
            playerName: data.playerName,
            id: socketID,
            symbol: nextSymbol
        };
        gameState.players.push(newPlayer);
        if (gameState.players.length === 2){
            gameState.result.status = Statuses.PLAYING;
            gameState.currentPlayer = newPlayer;
        };
        io.emit('gameState', gameState); //this sends the updated game state to all players connected
    }
}