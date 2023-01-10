const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.sendFile(__dirname + '/menu.html'));
app.listen(port, () => console.log(`listening on port ${port}`))

app.get('/game', (req,res) => {
    if (req.query.mode === 'singleplayer'){
        res.sendFile(__dirname + '/spgame.html')
    }else if (req.query.mode === 'multiplayer'){
        res.sendFile(__dirname + '/twgame.html')
    }else if (req.query.mode === 'online'){
        res.sendFile(__dirname + '/scgame.html')
    }
});

