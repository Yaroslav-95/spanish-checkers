/*
Created by Yaroslav de la Peña Smirnov
This software is provided under the 3-Clause BSD License

Copyright 2017 Yaroslav de la Peña Smirnov

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/*Game logic*/
var playerName = "";
var opponentName = "";
var playerColor = "white";
var opponentColor = "black";
var isTurn = false;
var ongoingGame = false;
var defaultSquareIDs  = [
    'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8',
    'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7',
    'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6',
    'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5',
    'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4',
    'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3',
    'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2',
    'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'
];
var squareIDs;
var upperPieces = "piece black pawn";
var lowerPieces = "piece white pawn";
function initBoard(player){
    if (player == 1){ 
        squareIDs = defaultSquareIDs;
        playerColor = "white";
        opponentColor = "black";
        upperPieces = "piece black pawn";
        lowerPieces = "piece white pawn";
    }
    else {
        playerColor = "black";
        opponentColor = "white";
        squareIDs = [];
        for (i = defaultSquareIDs.length - 1; i >= 0; i--){
            squareIDs.push(defaultSquareIDs[i]);
        }
        upperPieces = "piece white pawn";
        lowerPieces = "piece black pawn";
    }
    $("#board-container").html("<table id='board'></table>")
    var i = 0, j = 0, k = 0;
    var bc = "<tbody>";
    for (i = 0; i < 8; i++){
        bc += "<tr>";
        for(j = 0; j < 8; j++){
            bc += "<td id='"+squareIDs[k]+"' class='square ";
            if(((i+1) % 2 == 0 && (j+1) % 2 == 0) || ((i+1) % 2 != 0 && (j+1) % 2 != 0)){
                if(i < 3){
                    bc += upperPieces;
                }
                else if(i > 4){
                    bc += lowerPieces;
                }
            }
            bc += "'></td>\n";
            k++;
        }
        bc += "</tr>\n";
    }
    bc += "</tbody>\n";
    $("#board").html(bc);
    ongoingGame = true;
}

function checkBoardForMoves(pieceColor){
    for(var i = 0; i < squareIDs.length; i++){
        var id = "#"+squareIDs[i];
        console.log(id);
        if($(id).hasClass(pieceColor)){
            if(getMoves(id)){
                $(".square").removeClass("selected move");
                $(".square").removeClass("selected kill");
                return true;
            }
        }
    }
    console.log("there are no move for "+pieceColor+" player");
    $(".square").removeClass("selected move");
    $(".square").removeClass("selected kill");
    return false;
}

function getMoves(piece){
    $(".square").removeClass("selected kill");
    $(".square").removeClass("move");
    $(piece).addClass("selected");
    var pieceColor = "white";
    var pieceType = "pawn";
    if ($(piece).hasClass("black")){ pieceColor = "black"; }
    if ($(piece).hasClass("dame")){ pieceType = "dame"; }
    var pieceID = $(piece).attr("id");
    var pX = pieceID.charCodeAt(0)-96;
    var pY = parseInt(pieceID.charAt(1));
    var canMove = false;
    if(pieceType == "dame"){
        var opponent = "black";
        if ($(piece).hasClass("black")){ opponent = "white"; }
        var mY = pY+1;
        var mRX = pX+1;
        var mLX = pX-1;
        while(mY < 9 && (mRX < 9 || mLX > 0)){
            if(mRX < 9){
            var moveRID = "#"+String.fromCharCode(mRX+96)+mY;
            if(!$(moveRID).hasClass("piece")){
                $(moveRID).addClass("move");
                mRX++;
                canMove = true;
            }
            else{
                if(mY<8 && mRX<8 && $(moveRID).hasClass(opponent)){
                    var victimID = moveRID;
                    var nmY = mY+1;
                    mRX++;
                    moveRID = "#"+String.fromCharCode(mRX+96)+nmY;
                    if(!$(moveRID).hasClass("piece")  && mRX < 9){
                        $(moveRID).addClass("move kill");
                        $(moveRID).attr("victim", victimID);
                        canMove = true;
                        findMoreMoves(pieceColor, pieceType, victimID, mRX, nmY);
                    }
                }
                mRX = 9;
            }
            }
            if(mLX > 0){
            var moveLID = "#"+String.fromCharCode(mLX+96)+mY;
            if(!$(moveLID).hasClass("piece")  && mLX > 0){
                $(moveLID).addClass("move");
                mLX--;
                canMove = true;
            }
            else{
                if(mY<8 && mLX>1 && $(moveLID).hasClass(opponent)){
                    var victimID = moveLID;
                    var nmY = mY+1;
                    mLX--;
                    moveLID = "#"+String.fromCharCode(mLX+96)+nmY;
                    if(!$(moveLID).hasClass("piece")){
                        $(moveLID).addClass("move kill");
                        $(moveLID).attr("victim", victimID);
                        canMove = true;
                        findMoreMoves(pieceColor, pieceType, victimID, mLX, nmY);
                    }
                }
                mLX = 0;
            }
            }
            mY++;
        }
        mY = pY-1;
        mRX = pX+1;
        mLX = pX-1;
        while(mY > 0 && (mRX < 9 || mLX > 0)){
            if(mRX < 9){
            var moveRID = "#"+String.fromCharCode(mRX+96)+mY;
            if(!$(moveRID).hasClass("piece")){
                $(moveRID).addClass("move");
                mRX++;
                canMove = true;
            }
            else{
                if(mY>1 && mRX<8 && $(moveRID).hasClass(opponent)){
                    var victimID = moveRID;
                    var nmY = mY-1;
                    mRX++;
                    moveRID = "#"+String.fromCharCode(mRX+96)+nmY;
                    if(!$(moveRID).hasClass("piece")){
                        $(moveRID).addClass("move kill");
                        $(moveRID).attr("victim", victimID);
                        canMove = true;
                        findMoreMoves(pieceColor, pieceType, victimID, mRX, nmY);
                    }
                }
                mRX = 9;
            }
            }
            if(mLX > 0){
            var moveLID = "#"+String.fromCharCode(mLX+96)+mY;
            if(!$(moveLID).hasClass("piece")){
                $(moveLID).addClass("move");
                mLX--;
                canMove = true;
            }
            else{
                if(mY>1 && mLX>1 && $(moveLID).hasClass(opponent)){
                    var victimID = moveLID;
                    var nmY = mY-1;
                    mLX--;
                    moveLID = "#"+String.fromCharCode(mLX+96)+nmY;
                    if(!$(moveLID).hasClass("piece")){
                        $(moveLID).addClass("move kill");
                        $(moveLID).attr("victim", victimID);
                        canMove = true;
                        findMoreMoves(pieceColor, pieceType, victimID, mLX, nmY);
                    }
                }
                mLX = 0;
            }
            }
            mY--;
        }
    }
    else if (pieceColor == "white"){        
        if(pY < 8){
            if(pX < 8){
                var mY = pY+1;
                var mX = pX+1;
                var moveID = "#"+String.fromCharCode(mX+96)+mY;
                if(!$(moveID).hasClass("piece")){
                    $(moveID).addClass("move");
                    canMove = true;
                }
                else if(pX < 7 && pY < 7 && $(moveID).hasClass("black")){
                    var victimID = moveID;
                    mX++;
                    mY++;
                    moveID = "#"+String.fromCharCode(mX+96)+mY;
                    if(!$(moveID).hasClass("piece")){
                        $(moveID).addClass("move kill");
                        $(moveID).attr("victim", victimID);
                        canMove = true;
                        findMoreMoves(pieceColor, pieceType, victimID, mX, mY);
                    }
                }
            }
            if(pX > 1){
                var mY = pY+1;
                var mX = pX-1;
                var moveID = "#"+String.fromCharCode(mX+96)+mY;
                if(!$(moveID).hasClass("piece")){
                    $(moveID).addClass("move");
                    canMove = true;
                }
                else if(pX > 2 && pY < 7 && $(moveID).hasClass("black")){
                    var victimID = moveID;
                    mX--;
                    mY++;
                    moveID = "#"+String.fromCharCode(mX+96)+mY;
                    if(!$(moveID).hasClass("piece")){
                        $(moveID).addClass("move kill");
                        $(moveID).attr("victim", victimID);
                        canMove = true;
                        findMoreMoves(pieceColor, pieceType, victimID, mX, mY);
                    }
                }
            }
        }
    }
    else{
        if(pY > 1){
            if(pX < 8){
                var mY = pY-1;
                var mX = pX+1;
                var moveID = "#"+String.fromCharCode(mX+96)+mY;
                if(!$(moveID).hasClass("piece")){
                    $(moveID).addClass("move");
                    canMove = true;
                }
                else if(pX < 7 && pY > 2 && $(moveID).hasClass("white")){
                    var victimID = moveID;
                    mX++;
                    mY--;
                    moveID = "#"+String.fromCharCode(mX+96)+mY;
                    if(!$(moveID).hasClass("piece")){
                        $(moveID).addClass("move kill");
                        $(moveID).attr("victim", victimID);
                        canMove = true;
                        findMoreMoves(pieceColor, pieceType, victimID, mX, mY);
                    }
                }
            }
            if(pX > 1){
                var mY = pY-1;
                var mX = pX-1;
                var moveID = "#"+String.fromCharCode(mX+96)+mY;
                if(!$(moveID).hasClass("piece")){
                    $(moveID).addClass("move");
                    canMove = true;
                }
                else if(pX > 2 && pY > 2 && $(moveID).hasClass("white")){
                    var victimID = moveID;
                    mX--;
                    mY--;
                    moveID = "#"+String.fromCharCode(mX+96)+mY;
                    if(!$(moveID).hasClass("piece")){
                        $(moveID).addClass("move kill");
                        $(moveID).attr("victim", victimID);
                        canMove = true;
                        findMoreMoves(pieceColor, pieceType, victimID, mX, mY);
                    }
                }
            }
        }
    }
    return canMove;
}

function findMoreMoves(pieceColor, pieceType, victimIDs, pX, pY){
    if(pieceType == "dame"){
        console.log("findmore dame start");
    }
    if(pY < 7 && (pieceColor == "white" || pieceType == "dame")){
        var vY = pY+1;
        if (pX < 7){
            console.log("up right start");
            var vX = pX+1;
            var victimID = "#"+String.fromCharCode(vX+96)+vY;
            if($(victimID).hasClass("piece") && ((pieceColor == "white" && $(victimID).hasClass("black")) || (pieceColor == "black" && $(victimID).hasClass("white")))){
                console.log("up right victim");
                var mY = vY+1;
                var mX = vX+1;
                var moveID = "#"+String.fromCharCode(mX+96)+mY;
                if(!$(moveID).hasClass("piece") && victimIDs.indexOf(victimID) < 0){
                    console.log("up right move");
                    $(moveID).addClass("move kill");
                    var nvictimIDs = victimIDs+","+victimID;
                    $(moveID).attr("victim", nvictimIDs);
                    findMoreMoves(pieceColor, pieceType, nvictimIDs, mX, mY);
                }
            }
        }
        if (pX > 2){
            console.log("up left start");
            var vX = pX-1;
            var victimID = "#"+String.fromCharCode(vX+96)+vY;
            if($(victimID).hasClass("piece") && ((pieceColor == "white" && $(victimID).hasClass("black")) || (pieceColor == "black" && $(victimID).hasClass("white")))){
                console.log("up left victim");
                var mY = vY+1;
                var mX = vX-1;
                var moveID = "#"+String.fromCharCode(mX+96)+mY;
                if(!$(moveID).hasClass("piece") && victimIDs.indexOf(victimID) < 0){
                    console.log("up left move");
                    $(moveID).addClass("move kill");
                    var nvictimIDs = victimIDs+","+victimID;
                    $(moveID).attr("victim", nvictimIDs);
                    findMoreMoves(pieceColor, pieceType, nvictimIDs, mX, mY);
                }
            }
        }
    }
    if(pY > 2 && (pieceColor == "black" || pieceType == "dame")){
        var vY = pY-1;
        if (pX < 7){
            console.log("down right start");
            var vX = pX+1;
            var victimID = "#"+String.fromCharCode(vX+96)+vY;
            if($(victimID).hasClass("piece") && ((pieceColor == "white" && $(victimID).hasClass("black")) || (pieceColor == "black" && $(victimID).hasClass("white")))){
                console.log("down right victim");
                var mY = vY-1;
                var mX = vX+1;
                var moveID = "#"+String.fromCharCode(mX+96)+mY;
                if(!$(moveID).hasClass("piece") && victimIDs.indexOf(victimID) < 0){
                    console.log("down right move");
                    $(moveID).addClass("move kill");
                    var nvictimIDs = victimIDs+","+victimID;
                    $(moveID).attr("victim", nvictimIDs);
                    findMoreMoves(pieceColor, pieceType, nvictimIDs, mX, mY);
                }
            }
        }
        if (pX > 2){
            console.log("down left start");
            var vX = pX-1;
            var victimID = "#"+String.fromCharCode(vX+96)+vY;
            if($(victimID).hasClass("piece") && ((pieceColor == "white" && $(victimID).hasClass("black")) || (pieceColor == "black" && $(victimID).hasClass("white")))){
                console.log("down left victim");
                var mY = vY-1;
                var mX = vX-1;
                var moveID = "#"+String.fromCharCode(mX+96)+mY;
                if(!$(moveID).hasClass("piece") && victimIDs.indexOf(victimID) < 0){
                    console.log("down left move");
                    $(moveID).addClass("move kill");
                    var nvictimIDs = victimIDs+","+victimID;
                    $(moveID).attr("victim", nvictimIDs);
                    findMoreMoves(pieceColor, pieceType, nvictimIDs, mX, mY);
                }
            }
        }
    }
}

function movePiece(mSquare){
    if (!isTurn){ return; }
    var pieceColor = "white";
    var pieceType = "pawn";
    if($(".selected").first().hasClass("black")){ pieceColor = "black"; }
    if($(".selected").first().hasClass("dame")){ pieceType = "dame"; }
    if ((pieceColor == "white" && $(mSquare).attr("id").charAt(1) == "8") || (pieceColor == "black" && $(mSquare).attr("id").charAt(1) == "1")){
        pieceType = "dame";
    }
    var origin = $(".selected").first().attr("id");
    var target = $(mSquare).attr("id");
    $(".selected").removeClass("piece black white pawn dame");
    $(mSquare).addClass("piece "+pieceColor+" "+pieceType);
    $(".square").removeClass("selected move");
    socket.emit("piece moved", origin, target);
    if($(mSquare).hasClass("kill")){
        var victims = $(mSquare).attr("victim").split(",");
        victims.forEach(function(victim){
            var victimColor = "black";
            if($(victim).hasClass("white")){ victimColor = "white"; }
            $(victim).removeClass("piece white black pawn dame");
            var pieceRemoved = victim.slice(1);
            $(mSquare).attr("victim", "");
            socket.emit("piece removed", pieceRemoved, victimColor);
        });
    }
    $(".square").removeClass("kill last-move");
    $("#"+origin).addClass("last-move");
    $("#"+target).addClass("last-move");
}

$(document).on("click", ".square.piece", function(event){
    if(isTurn && $(event.target).hasClass(playerColor)){
        getMoves(event.target);
    }
});

$(document).on("click", ".square.move", function(event){
    if(isTurn){
        movePiece(event.target);
    }
});

$(document).on("click", "#btn-truce", function(event){
    socket.emit("request truce");
});

$(document).on("click", "#btn-truce-accept", function(event){
    socket.emit("accept truce");
    $("#message-box").html("<div class='alert alert-info'>You have accepted "+opponentName+"'s truce offer. The game is a tie. <a class='btn btn-info btn-sm' href='/'>New game</a>");
    ongoingGame = false;
    isTurn = false;
});

$(document).on("click", "#btn-truce-decline", function(event){
    socket.emit("reject truce");
    $("#message-box").html("<div class='alert alert-info alert-dismissable'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>You have declined "+opponentName+"'s truce offer.");
});

window.onbeforeunload = function(){
    if (ongoingGame){
        return "By closing this page you will be disconnected from the match and lose. Are you sure you want to leave?";
    }
    return undefined;
}

/*Socket handling*/
var socket;
function initializeEvents(){
    socket.on("invalid game", function(){
        $("#start-container").html("<div class='alert alert-danger'>Invalid game ID <a class='btn btn-danger btn-sm' href='/'>Go back</a></div>");
        socket.disconnect();
        socket = null;
    });
    socket.on("full game", function(){
        $("#start-container").html("<div class='alert alert-danger'>U wot m8? U trying to join a full game m8. Try joining a new game or start a new one yourself. <a class='btn btn-danger btn-sm' href='/'>Go back</a></div>");
        socket.disconnect();
        socket = null;
    });
    socket.on("game started", function(gameID){
        $("#start-container").html("<div class='panel panel-default'><div class='panel-heading'>Game ID: "+gameID.toString()+" <a id='btn-truce' class='btn btn-default' style='display:none'>Offer a draw</a></div></div><div id='message-box'></div><hr><div class='text-center'><h4 id='opponent-name' class='player-name'>Waiting for player...</h4><div id='board-container'></div><h4 id='local-name' class='player-name'>"+playerName+"</h4></div>");
        initBoard(1);
    });
    socket.on("game joined", function(gameID, opponent){
        $("#start-container").html("<div class='panel panel-default'><div class='panel-heading'>Game ID: "+gameID.toString()+" <a id='btn-truce' class='btn btn-default'>Offer a draw</a></div></div><div id='message-box'></div><hr><div class='text-center'><h4 id='opponent-name' class='player-name active'>"+opponent+"</h4><div id='board-container'></div><h4 id='local-name' class='player-name'>"+playerName+"</h4></div>");
        initBoard(2);
        opponentName = opponent;
        $("#btn-truce").css("display", "inline-block");
    });
    socket.on("player joined", function(player){
        $("#opponent-name").html(player);
        isTurn = true;
        $("#local-name").addClass("active");
        opponentName = player;
        $("#btn-truce").css("display", "inline-block");
    });
    socket.on("turn start", function(){
        isTurn = true;
        $("#local-name").addClass("active");
        $("#opponent-name").removeClass("active");
        if(!checkBoardForMoves(playerColor)){
            $("#message-box").html("<div class='alert alert-danger'>You ran out of moves, you lose. Victory goes to "+opponentName+". Better luck next time! <a class='btn btn-danger btn-sm' href='/'>New game</a>");
            ongoingGame = false;
            isTurn = false;
        }
    });
    socket.on("turn end", function(){
        isTurn = false;
        $("#local-name").removeClass("active");
        $("#opponent-name").addClass("active");
        if(!checkBoardForMoves(opponentColor)){
            $("#message-box").html("<div class='alert alert-success'>"+opponentName+" has run out of moves. You've won! <a class='btn btn-success btn-sm' href='/'>New game</a>");
            ongoingGame = false;
            isTurn = false;
        }
    });
    socket.on("move piece", function(origin, target){
        var pieceColor = "black";
        if(playerColor == "black") { pieceColor = "white"; }
        var pieceType = "pawn";
        if($("#"+origin).hasClass("dame")){ pieceType = "dame"; }
        $(".square").removeClass("last-move");
        $("#"+origin).removeClass("piece white black pawn dame");
        $("#"+origin).addClass("last-move");
        if((pieceColor == "black" && target.charAt(1) == "1") || (pieceColor == "white" && target.charAt(1) == "8")){ pieceType = "dame"; }
        $("#"+target).addClass("piece "+pieceColor+" "+pieceType+" last-move");
    });
    socket.on("remove piece", function(pieceRemoved){
        $("#"+pieceRemoved).removeClass("piece white black pawn dame");
    });
    socket.on("truce requested", function(){
        $("#message-box").html("<div class='alert alert-info'>"+opponentName+" wants to declare the game a draw. Do you accept their offer? <a id='btn-truce-accept' class='btn btn-info btn-sm'>Accept</a> <a id='btn-truce-decline' class='btn btn-info btn-sm'>Decline</a></div>");
    });
    socket.on("truce accepted", function(){
        $("#message-box").html("<div class='alert alert-info'>"+opponentName+" has accepted your draw offer. The game is a draw. <a class='btn btn-info btn-sm' href='/'>New game</a>");
        ongoingGame = false;
        isTurn = false;
    });
    socket.on("truce rejected", function(){
        $("#message-box").html("<div class='alert alert-warning alert-dismissable'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>"+opponentName+" has declined your truce offer.");
    });
    socket.on("you won", function(){
        $("#message-box").html("<div class='alert alert-success'>Way to go! You've won! <a class='btn btn-success btn-sm' href='/'>New game</a>");
        ongoingGame = false;
        isTurn = false;
    });
    socket.on("you lost", function(){
        $("#message-box").html("<div class='alert alert-danger'>You've lost, victory goes to "+opponentName+". Better luck next time! <a class='btn btn-danger btn-sm' href='/'>New game</a>");
        ongoingGame = false;
        isTurn = false;
    });
    socket.on("game message", function(data){
        $("#message-box").html("<p>"+data+"<p>");
    });
    socket.on("game disconnect", function(player){
        if(ongoingGame)
            $("#message-box").html("<div class='alert alert-warning'>Player <strong>"+player+"</strong> disconnected <a class='btn btn-warning btn-sm' href='/'>New game</a></div>");
        ongoingGame = false;
        isTurn = false;
    });
}
$(function(){
    $("#newgame").submit(function(event){
        socket = io();
        var form_data = $(this).serializeArray().reduce(function(obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});
        playerName = form_data.playername;
        initializeEvents();
        socket.emit("start game", form_data);
        $("#start-container").addClass("text-center");
        $("#start-container").html("<h2>Starting game...</h2><div id='message-box'></div>");
        return false;
    });
    $("#joingame").submit(function(event){
        socket = io();
        var form_data = $(this).serializeArray().reduce(function(obj, item) {
            obj[item.name] = item.value;
            return obj;
        }, {});
        playerName = form_data.player2name;
        initializeEvents();
        socket.emit("join game", form_data);
        $("#start-container").addClass("text-center");
        $("#start-container").html("<h2>Joining game...</h2><div id='message-box'></div>");
        return false;
    });
})