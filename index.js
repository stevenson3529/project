const express = require('express');
const app = express();
const port = 80; //Default HTTP Port

app.get('/', (req, res) => res.sendFile(__dirname + '/menu.html'));
app.listen(port, () => console.log(`listening on port ${port}`))
app.use(express.static(__dirname + '/public'));

app.get('/game', (req,res) => {
    switch(req.query.mode){
        case "singleplayer":
            res.sendFile(__dirname + '/spgame.html');
            break;
        case "multiplayer":
            res.sendFile(__dirname + '/twgame.html');
            break;
        case "online":
            res.sendFile(__dirname + '/scgame.html');
            break;
        default:
            res.redirect('/')
    }
});
