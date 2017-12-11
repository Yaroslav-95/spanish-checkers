
var playerColor = "white";
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
        upperPieces = "piece black pawn";
        lowerPieces = "piece white pawn";
    }
    else {
        playerColor = "black";
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
}

$(document).on("click", ".square.piece", function(event){
    var piece = event.target;
    $(".square").removeClass("selected kill");
    $(".square").removeClass("move");
    $(event.target).addClass("selected");
    var pieceColor = "white";
    var pieceType = "pawn";
    if ($(piece).hasClass("black")){ pieceColor = "black"; }
    if ($(piece).hasClass("dame")){ pieceType = "dame"; }
    var pieceID = $(piece).attr("id");
    var pX = pieceID.charCodeAt(0)-96;
    var pY = parseInt(pieceID.charAt(1));
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
                }
                else if(pX < 7 && pY < 7 && $(moveID).hasClass("black")){
                    var victimID = moveID;
                    mX++;
                    mY++;
                    moveID = "#"+String.fromCharCode(mX+96)+mY;
                    if(!$(moveID).hasClass("piece")){
                        $(moveID).addClass("move kill");
                        $(moveID).attr("victim", victimID);
                    }
                }
            }
            if(pX > 1){
                var mY = pY+1;
                var mX = pX-1;
                var moveID = "#"+String.fromCharCode(mX+96)+mY;
                if(!$(moveID).hasClass("piece")){
                    $(moveID).addClass("move");
                }
                else if(pX > 2 && pY < 7 && $(moveID).hasClass("black")){
                    var victimID = moveID;
                    mX--;
                    mY++;
                    moveID = "#"+String.fromCharCode(mX+96)+mY;
                    if(!$(moveID).hasClass("piece")){
                        $(moveID).addClass("move kill");
                        $(moveID).attr("victim", victimID);
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
                }
                else if(pX < 7 && pY > 2 && $(moveID).hasClass("white")){
                    var victimID = moveID;
                    mX++;
                    mY--;
                    moveID = "#"+String.fromCharCode(mX+96)+mY;
                    if(!$(moveID).hasClass("piece")){
                        $(moveID).addClass("move kill");
                        $(moveID).attr("victim", victimID);
                    }
                }
            }
            if(pX > 1){
                var mY = pY-1;
                var mX = pX-1;
                var moveID = "#"+String.fromCharCode(mX+96)+mY;
                if(!$(moveID).hasClass("piece")){
                    $(moveID).addClass("move");
                }
                else if(pX > 2 && pY > 2 && $(moveID).hasClass("white")){
                    var victimID = moveID;
                    mX--;
                    mY--;
                    moveID = "#"+String.fromCharCode(mX+96)+mY;
                    if(!$(moveID).hasClass("piece")){
                        $(moveID).addClass("move kill");
                        $(moveID).attr("victim", victimID);
                    }
                }
            }
        }
    }
});

$(document).on("click", ".square.move", function(event){
    console.log("move");
    var mSquare = event.target;
    var pieceColor = "white";
    var pieceType = "pawn";
    if($(".selected").first().hasClass("black")){ pieceColor = "black"; }
    if($(".selected").first().hasClass("dame")){ pieceType = "dame"; }
    if ((pieceColor == "white" && $(mSquare).attr("id").charAt(1) == "8") || (pieceColor == "black" && $(mSquare).attr("id").charAt(1) == "1")){
        pieceType = "dame";
    }
    $(".selected").removeClass("piece black white pawn dame");
    $(mSquare).addClass("piece "+pieceColor+" "+pieceType);
    $(".square").removeClass("selected move");
    if($(mSquare).hasClass("kill")){
        $($(mSquare).attr("victim")).removeClass("piece white black pawn dame");
        $(mSquare).attr("victim", "");
    }
    $(".square").removeClass("kill");
});