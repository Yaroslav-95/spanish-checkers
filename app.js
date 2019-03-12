/*
Created by Yaroslav de la Peña Smirnov
This software is provided under the 3-Clause BSD License
Copyright 2017-2019 Yaroslav de la Peña Smirnov
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted (subject to the limitations in the disclaimer
below) provided that the following conditions are met:

    * Redistributions of source code must retain the above copyright notice,
    this list of conditions and the following disclaimer.

    * Redistributions in binary form must reproduce the above copyright
    notice, this list of conditions and the following disclaimer in the
    documentation and/or other materials provided with the distribution.

    * Neither the name of the copyright holder nor the names of its
    contributors may be used to endorse or promote products derived from this
    software without specific prior written permission.

NO EXPRESS OR IMPLIED LICENSES TO ANY PARTY'S PATENT RIGHTS ARE GRANTED BY
THIS LICENSE. THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND
CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR
CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR
BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.
*/

var express = require("express");
var app = express();
var http = require("http").Server(app);
var bodyParser = require("body-parser");
var io = require('socket.io')(http);

var gameIDs = [];
var games = [];

var generateGameId = function(){
    var gameID = Math.floor(Math.random()*100000);
    console.log(gameID);
    while(true){
        var i = gameIDs.indexOf(gameID);
        if (i < 0){
            return gameID;
        }
        gameID = Math.floor(Math.random()*100000);
    }
}

function getGameByID(IDKey){
    for(var i = 0; i < games.length; i++){
        if(games[i].id == IDKey){
            return games[i];
        }
    }
}

function getGameIDByID(IDKey){
    for(var i = 0; i < games.length; i++){
        if(games[i].id == IDKey){
            return i;
        }
    }
}

app.use("/static", express.static(__dirname + "/client"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get("/", function(req, res){
    res.sendFile(__dirname + "/client/index.html");
});

app.post("/start", function(req, res){
    res.sendFile(__dirname + "/client/no-js.html");
});

app.post("/join", function(req, res){
    res.sendFile(__dirname + "/client/no-js.html");
});

http.listen(8080, function(){
    console.log("Listening on http://127.0.0.1:8080/");
});

socket_list = {};

io.on("connection", function(socket){
    socket.id = Math.random();
    socket_list[socket.id] = socket;

    socket.on("gameid", function(data){
        socket.gameid = parseInt(data);
        console.log("connected to game: " + data);
    });

    socket.on("start game", function(form_data){
        socket.player = form_data.playername;
        socket.gameID = generateGameId();
        gameIDs.push(socket.gameID);
        var game = {id: socket.gameID, player1: socket, player2: null, bps: 12, wps: 12}
        games.push(game);
        socket_list[socket.id].emit("game started", socket.gameID);
    });

    socket.on("join game", function(form_data){
        socket.player = form_data.player2name;
        var gameID = parseInt(form_data.gameid);
        var i = gameIDs.indexOf(gameID);
        if(i < 0){
            socket_list[socket.id].emit("invalid game");
            console.log("Invalid game id: "+form_data.gameid);
            return;
        }
        var game = getGameByID(gameID)
        if(game.player2 != null){
            socket_list[socket.id].emit("full game");
            return;
        }
        socket.gameID = gameID;
        console.log("Player "+socket.player+" joined game "+gameID.toString());
        game.player2 = socket;
        socket_list[socket.id].emit("game joined", socket.gameID, game.player1.player);
        game.player1.emit("player joined", socket.player);
    });

    socket.on("piece moved", function(origin, target){
        var game = getGameByID(socket.gameID);
        if(game.player1.id == socket.id){
            game.player2.emit("move piece", origin, target);
            game.player1.emit("turn end");
            game.player2.emit("turn start");
        }
        else{
            game.player1.emit("move piece", origin, target);
            game.player2.emit("turn end");
            game.player1.emit("turn start");
        }
    });

    socket.on("piece removed", function(pieceRemoved, pieceColor){
        var game = getGameByID(socket.gameID);
        if(pieceColor == "white"){ game.wps--; }
        else { game.bps--; }
        if(game.player1.id == socket.id){
            game.player2.emit("remove piece", pieceRemoved);
        }
        else{
            game.player1.emit("remove piece", pieceRemoved);
        }
        if(game.bps == 0){
            game.player1.emit("you won");
            game.player2.emit("you lost");
        }
        if(game.wps == 0){
            game.player2.emit("you won");
            game.player1.emit("you lost");
        }
    });

    socket.on("request truce", function(){
        var game = getGameByID(socket.gameID);
        if(game.player1.id == socket.id){
            game.player2.emit("truce requested");
        }
        else{
            game.player1.emit("truce requested");
        }
    });

    socket.on("accept truce", function(){
        var game = getGameByID(socket.gameID);
        if(game.player1.id == socket.id){
            game.player2.emit("truce accepted");
        }
        else{
            game.player1.emit("truce accepted");
        }
    });

    socket.on("reject truce", function(){
        var game = getGameByID(socket.gameID);
        if(game.player1.id == socket.id){
            game.player2.emit("truce rejected");
        }
        else{
            game.player1.emit("truce rejected");
        }
    });

    socket.on("disconnect", function(){
        if("gameID" in socket){
            var game = getGameByID(socket.gameID);
            if (game.player1.id == socket.id){
                if(game.player2){
                    game.player2.emit("game disconnect", game.player1.player);
                    console.log("player1 disconnect");
                }
            }
            else{
                game.player1.emit("game disconnect", game.player2.player);
                console.log("player2 disconnect");
            }
            delete gameIDs[socket.gameID];
            delete games[game];
        }
        console.log("socket "+socket_list[socket.id].player+" disconnected");
        delete socket_list[socket.id];
    })
    console.log("user connected");
});
