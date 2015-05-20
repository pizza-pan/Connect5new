/*jslint devel: true, indent: 2 */
/*jslint white: false */
/*global console */
//I have implemented a simple HTML UI in the test.html and you can test the game logic by actually play the game thru the UI
//The following code was tested and confirmed functionality by pasting and running in google chrome console
'use strict';
angular.module('myApp').service('gameLogic', function() {
function isEqual(object1, object2) {
return angular.equals(object1, object2);
}
function copyObject(object) {
return angular.copy(object);
}
//this method creates an empty board
function createNewBoard(){
	var newBoard = [];
	var i;
	for(i = 0; i < 15; i++) {
		newBoard[newBoard.length] = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
	}
	return newBoard;
}
//The following four method take the board, row, col and a coloy(X or O) as input
//Check all four possible directions from a position with a specific color and
//return the longest connecting sequence passing thru the given position for the given color
function checkHorizontal(board, row, col, color){
	var sameColors = [[row, col]];
	var i;
	for(i = 1; i < 15; i++){
		if (col + i <15 && board[row][col + i] === color){
			sameColors[sameColors.length] = [row, col + i];
		}
		else{
			break;
		}
	}
	for(i = 1; i < 15; i++){
		if(col - i >= 0 && board[row][col - i] === color){
			sameColors[sameColors.length] = [row, col - i];
		}
		else{
			break;
		}
	}
	return sameColors;
}
function checkBackSlash(board, row, col, color){
	var sameColors = [[row, col]];
	var i;
	for(i = 1; i < 15; i++){
		if (col + i <15 && row + i < 15 && board[row + i][col + i] === color){
			sameColors[sameColors.length] = [row + i, col + i];
		}
		else{
			break;
		}
	}
	for(i = 1; i < 15; i++){
		if(col - i >= 0 && row - i >= 0 && board[row - i][col - i] === color){
			sameColors[sameColors.length] = [row - i, col - i];
		}
		else{
			break;
		}
	}
	return sameColors;
}
function checkForwardSlash(board, row, col, color){
	var sameColors = [[row, col]];
	var i;
	for(i = 1; i < 15; i++){
		if (col - i >= 0 && row + i < 15 && board[row + i][col - i] === color){
			sameColors[sameColors.length] = [row + i, col - i];
		}
		else{
			break;
		}
	}
	for(i = 1; i < 15; i++){
		if(col + i < 15  && row - i >= 0 && board[row - i][col + i] === color){
			sameColors[sameColors.length] = [row - i, col + i];
		}
		else{
			break;
		}
	}
	return sameColors;
}
function checkVertical(board, row, col, color){
	var sameColors = [[row, col]];
	var i;
	for(i = 1; i < 15; i++){
		if (row + i <15 && board[row + i][col] === color){
			sameColors[sameColors.length] = [row + i, col];
		}
		else{
			break;
		}
	}
	for(i = 1; i < 15; i++){
		if(row - i >= 0 && board[row - i][col] === color){
			sameColors[sameColors.length] = [row - i, col];
		}
		else{
			break;
		}
	}
	return sameColors;
}


/** Return the winner (either 'X' or 'O') or '' if there is no winner. */
function getWinner(winningSequence){
	if(winningSequence.length > 0){
		return winningSequence[0];
	}
	else{
		return '';
	}
}
//This method check the four directions to see if any has a connecting sequence that has a length
//exactly equal to five, if yes, return the winning color and sequence
function getWinningSequence(board, row, col, color) {
	var winningSeuqnece = [];
if(checkHorizontal(board, row, col, color).length === 5)
{
	winningSeuqnece =[color, checkHorizontal(board, row, col, color)];
	return winningSeuqnece;
}
if(checkVertical(board, row, col, color).length === 5)
{
	winningSeuqnece =[color, checkHorizontal(board, row, col, color)];
	return winningSeuqnece;
}
if(checkBackSlash(board, row, col, color).length === 5)
{
	winningSeuqnece =[color, checkHorizontal(board, row, col, color)];
	return winningSeuqnece;
}
if(checkForwardSlash(board, row, col, color).length === 5)
{
	winningSeuqnece =[color, checkHorizontal(board, row, col, color)];
	return winningSeuqnece;
}
return winningSeuqnece;
}
/** Returns true if the game ended in a tie because there are no empty cells. */
function isTie(board) {
var i, j;
for (i = 0; i < 15; i++) {
for (j = 0; j < 15; j++) {
if (board[i][j] === '') {
// If there is an empty cell then we do not have a tie.
return false;
}
}
}
// No empty cells --> tie!
return true;
}
//The following two method:createMove and isMoveOk reused large portion of the code
//from the Professor's TicTacToe sample
/** 
   * Returns the move that should be performed when player 
   * with index turnIndexBeforeMove makes a move in cell row X col. 
   */
function createMove(board, row, col, turnIndexBeforeMove) {
	if (board === undefined) {
	      // Initially (at the beginning of the match), the board in state is undefined.
	      board = createNewBoard();
	    }
	if (board[row][col] !== '') {
	      throw new Error("One can only make a move in an empty position!");
	    }
var boardAfterMove = copyObject(board);
var turnColor = turnIndexBeforeMove === 0 ? 'X' : 'O';
boardAfterMove[row][col] = turnColor;
var winner = getWinner(getWinningSequence(boardAfterMove, row, col, turnColor));
var firstOperation;
if (winner !== '' || isTie(boardAfterMove)) {
// Game over.
firstOperation = {endMatch: {endMatchScores: 
(winner === 'X' ? [1, 0] : (winner === 'O' ? [0, 1] : [0, 0]))}};
} else {
// Game continues. Now it's the opponent's turn (the turn switches from 0 to 1 and 1 to 0).
firstOperation = {setTurn: {turnIndex: 1 - turnIndexBeforeMove}};
}
return [firstOperation,
{set: {key: 'board', value: boardAfterMove}},
{set: {key: 'delta', value: {row: row, col: col}}}];
}
function isMoveOk(params) {
var move = params.move; 
var turnIndexBeforeMove = params.turnIndexBeforeMove; 
var stateBeforeMove = params.stateBeforeMove; 
// The state and turn after move are not needed in TicTacToe (or in any game where all state is public).
//var turnIndexAfterMove = params.turnIndexAfterMove; 
//var stateAfterMove = params.stateAfterMove; 
// We can assume that turnIndexBeforeMove and stateBeforeMove are legal, and we need
// to verify that move is legal.
try {
// Example move:
// [{setTurn: {turnIndex : 1},
//  {set: {key: 'board', value: [['X', '', ''], ['', '', ''], ['', '', '']]}},
//  {set: {key: 'delta', value: {row: 0, col: 0}}}]
var deltaValue = move[2].set.value;
var row = deltaValue.row;
var col = deltaValue.col;
var board = stateBeforeMove.board;
var expectedMove = createMove(board, row, col, turnIndexBeforeMove);
if (!isEqual(move, expectedMove)) {
return false;
}
} catch (e) {
// if there are any exceptions then the move is illegal
return false;
}
return true;
}
function getExampleMoves(initialTurnIndex, initialState, arrayOfRowColComment) {
    var exampleMoves = [];
    var state = initialState;
    var turnIndex = initialTurnIndex;
    for (var i = 0; i < arrayOfRowColComment.length; i++) {
      var rowColComment = arrayOfRowColComment[i];
      var move = createMove(state.board, rowColComment.row, rowColComment.col, turnIndex);
      var stateAfterMove = {board : move[1].set.value, delta: move[2].set.value};
      exampleMoves.push({
        stateBeforeMove: state,
        stateAfterMove: stateAfterMove,
        turnIndexBeforeMove: turnIndex,
        turnIndexAfterMove: 1 - turnIndex,
        move: move,
        comment: {en: rowColComment.comment}});
        
      state = stateAfterMove;
      turnIndex = 1 - turnIndex;
    }
    return exampleMoves;
  }
function getRiddles() {
    return [
      getExampleMoves(0,
    	{board:
		    	  [['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', 'X', 'X', 'X', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', 'O', 'O', 'O', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '']], delta: {row: 3, col: 4}},
        [
        {row: 2, col: 5, comment: "Find the position for X where he could win in his next turn by having 5 connected Xs in one direction"},
        {row: 2, col: 1, comment: "O played to try to block X"},
        {row: 2, col: 6, comment: "X wins by having five Xs in one direction."}
      ]),
      getExampleMoves(1,
    		  {board:
		    	  [['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', 'X', 'X', 'X', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', 'O', 'O', 'O', 'X', '', '', '', '', '', '', '', ''],
		           ['', '', '', 'O', '', 'X', 'X', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', 'O', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '']], delta: {row: 3, col: 4}},
        [
        {row: 3, col: 2, comment: "O places here will lead to winning in 2 more rounds"},
        {row: 3, col: 1, comment: "X places here to avoid O from winning"},
        {row: 2, col: 1, comment: "O will win next round."},
        {row: 1, col: 2, comment: "X played to try to block O"},
        {row: 6, col: 5, comment: "O wins by having five Os in one direction."}
      ])
    ];
  }

  function getExampleGame() {
    return getExampleMoves(0, {}, [
      {row: 6, col: 6, comment: "X starts the game by placing near the middle of the board"},
      {row: 7, col: 6, comment: "O places next to the X's first move"},
      {row: 6, col: 7, comment: "X plces next to its first move"},
      {row: 7, col: 7, comment: "O places next to its original move"},
      {row: 8, col: 9, comment: "X places on 8, 9"},
      {row: 7, col: 8, comment: "O forms an open three on 7, 8"},
      {row: 7, col: 9, comment: "X blocks O by putting on 7, 9"},
      {row: 8, col: 6, comment: "O places on 8, 6"},
      {row: 6, col: 9, comment: "X places on 6,9 and forming two open threes, X will win"},
      {row: 6, col: 8, comment: "O trying to block X by placing on 6,8"},
      {row: 5, col: 9, comment: "X places on 5,9, forming an open four"},
      {row: 4, col: 9, comment: "O tring to block X by putting on 4, 9"},
      {row: 9, col: 9, comment: "X wins by placing at 9, 9"}
    ]);
  }
  this.createMove = createMove;
  this.isMoveOk = isMoveOk;
  this.getExampleGame = getExampleGame;
  this.getRiddles = getRiddles;
});
;'use strict';

window.touchElementId = "score-sheets";

angular.module('myApp', ['ngTouch'])
  .controller('Ctrl',['$rootScope','$window', '$scope', '$log', '$timeout',
      'aiService', 'gameService', 'gameLogic', 'resizeGameAreaService','dragAndDropService', function (
       $rootScope,$window, $scope, $log, $timeout,
      aiService, gameService, gameLogic, resizeGameAreaService,dragAndDropService) {

    resizeGameAreaService.setWidthToHeight(1);
    function updateUI(params) {
      $scope.board = params.stateAfterMove.board;
      $scope.delta = params.stateAfterMove.delta;
      if (params.stateAfterMove.delta){
      	$scope.newMove = [params.stateAfterMove.delta.row, params.stateAfterMove.delta.col]
      	}
      if ($scope.board === undefined) {
      	$scope.numOfMoves = 0;
      	$scope.isAiWorking = false;
        $scope.board = [['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           		['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           		['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           		['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           		['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           		['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           		['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           		['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           		['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           		['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           		['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           		['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           		['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           		['', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
		           		['', '', '', '', '', '', '', '', '', '', '', '', '', '', '']];
      } else {
        // Only play a sound if there was a move (i.e., state is not empty).
        $log.info(["sound played on Board:", $scope.board]);
      }
    	$scope.isYourTurn = params.turnIndexAfterMove >= 0 && // game is ongoing
        params.yourPlayerIndex === params.turnIndexAfterMove; // it's my turn
        $scope.turnIndex = params.turnIndexAfterMove;
    	updateAIStatues();
        if ($scope.isYourTurn && params.playersInfo[params.yourPlayerIndex].playerId === '') {
        // Wait 500 milliseconds until animation ends.
        	$log.info("computer turn");
        	$scope.isAiWorking = true;
        	$timeout(sendComputerMove, 600);
      	}
    }
    $scope.getIntegersTill = function (number) {
        var res = [];
        for (var i = 0; i < number; i++) {
          res.push(i);
        }
        return res;
      }
    function sendComputerMove() {
    	$log.info("computer moved");
        var aimove = [];
        if($scope.numOfMoves < 2){
        	aimove = firstAIMoveGenerator();
        }
        else{
        	aimove = aiServiceMakeMove();
        }
        $scope.newMove = aimove;
        gameService.makeMove(gameLogic.createMove($scope.board, aimove[0], aimove[1], $scope.turnIndex));
        aiService.informingComputer(aimove[0], aimove[1], 'white');
        $timeout(updateAIStatues, 500);
        $scope.numOfMoves++;
    }

  dragAndDropService.addDragListener("gameArea", handleDragEvent);
  function handleDragEvent(type, clientX, clientY){
    var draggingLines = document.getElementById("draggingLines");
    var horizontalDraggingLine = document.getElementById("horizontalDraggingLine");
    var verticalDraggingLine = document.getElementById("verticalDraggingLine");
    //var clickToDragPiece = document.getElementById("clickToDragPiece");
    var gameArea = document.getElementById("gameArea");
    
    // Center point in gameArea
        var x = clientX - gameArea.offsetLeft;
        var y = clientY - gameArea.offsetTop;
    // Is outside gameArea?
    var button = document.getElementById("button");

        if (x < 0 || x >= gameArea.clientWidth || y < 0 || y >= gameArea.clientHeight) {
          draggingLines.style.displagy = "none";
      clickToDragPiece.style.display = "none";
          return;
        }
    // Inside gameArea. Let's find the containing square's row and col
        var col = Math.floor(colsNum * x / gameArea.clientWidth);
        var row = Math.floor(rowsNum * y / gameArea.clientHeight);
    // if the cell is not empty, don't preview the piece, but still show the dragging lines
    if ($scope.board[row][col] === 'X' || $scope.board[row][col] === 'O') {
      return;
    }
    clickToDragPiece.style.display = "inline";
        draggingLines.style.display = "inline";
    var centerXY = getSquareCenterXY(row, col);
        verticalDraggingLine.setAttribute("x1", centerXY.x);
        verticalDraggingLine.setAttribute("x2", centerXY.x);
        horizontalDraggingLine.setAttribute("y1", centerXY.y);
        horizontalDraggingLine.setAttribute("y2", centerXY.y);
    // show the piece
    //var cell = document.getElementById('board' + row + 'x' + col).className = $scope.turnIndex === 0 ? 'black' : 'white';
    
    
        var topLeft = getSquareTopLeft(row, col);
    var circle = document.getElementById("circle");
    circle.setAttribute("fill", $scope.turnIndex === 0 ? 'black' : 'white');
        clickToDragPiece.style.left = topLeft.left + "px";
        clickToDragPiece.style.top = topLeft.top + "px";
        if (type === "touchend" || type === "touchcancel" || type === "touchleave" || type === "mouseup") {
          // drag ended
          clickToDragPiece.style.display = "none";
          draggingLines.style.display = "none";
          dragDone(row, col);
        }
  }
  function getSquareTopLeft(row, col) {
        var size = getSquareWidthHeight();
        return {top: row * size.height, left: col * size.width}
    }
    function getSquareWidthHeight() {
    var gameArea = document.getElementById("gameArea");
        return {
          width: gameArea.clientWidth / colsNum,
          height: gameArea.clientHeight / rowsNum
        };
    }
    function getSquareCenterXY(row, col) {
        var size = getSquareWidthHeight();
        return {
      x: col * size.width + size.width / 2,
      y: row * size.height + size.height / 2
        };
    }
    function dragDone(row, col) {
        $rootScope.$apply(function () {
          var msg = "Dragged to " + row + "x" + col;
          $log.info(msg);
          $scope.msg = msg;
          //cellClicked($parent.$index, $index)
          $scope.cellClicked(row, col);
        });
    }
    var rowsNum = 15;
    var colsNum = 15;
















    function updateAIStatues(){
        $scope.isAiWorking = false;
    }
    updateUI({stateAfterMove: {}, turnIndexAfterMove: 0, yourPlayerIndex: -2});
    function iniAiService(){
    	aiService.iniComputer();
    }
    iniAiService();
    function aiServiceMakeMove(){
    	return aiService.getMove();
    }
    function firstAIMoveGenerator(){
    	var moves=[
            [6,6],
            [6,7],
            [6,8],
            [7,6],
            [7,7],
            [7,8],
            [8,6],
            [8,7],
            [8,8]
        ];
        while(true){
            var ind=Math.floor(Math.random()*moves.length);
            if($scope.board[moves[ind][0]][moves[ind][1]] === ''){
                return [(moves[ind][0]),(moves[ind][1])];
            }else{
                moves.splice(ind,1);
            }
        }
    }
    $scope.placeDot  = function(str, row, col){
    if(str ===''){
    	return 'img/empty.png';
    	//return 0;
    }
    if(str === 'X'){
    	if(row === $scope.newMove[0] && col === $scope.newMove[1]){
    		return 'img/newblackStone.png';
    	}
    	return 'img/blackStone.png';
    }
    if(str === 'O'){
    	if(row === $scope.newMove[0] && col === $scope.newMove[1]){
    		return 'img/newwhiteStone.png';
    	}
    	return 'img/whiteStone.png'
    }
    }
    $scope.shouldSlowlyAppear = function (row, col) {
      return $scope.delta !== undefined
          && $scope.delta.row === row && $scope.delta.col === col;
    }
    $scope.cellClicked = function (row, col) {
      $log.info(["Clicked on cell:", row, col]);
      if (!$scope.isYourTurn) {
        return;
      }
      try {
        if(!$scope.isAiWorking){
        $scope.isAiWorking = true;
        var move = gameLogic.createMove($scope.board, row, col, $scope.turnIndex);
        $scope.newMove = [row, col];
        $scope.isYourTurn = false; // to prevent making another move
        gameService.makeMove(move);
        $scope.numOfMoves++;
        aiService.informingComputer(row, col, 'black');
        }
        else{
        	return false;
        }
      } catch (e) {
        $log.info(["Cell is already full in position:", row, col]);
        return;
      }
    };
    $scope.onStartCallback = function () {
        $log.info("onStart happened!", arguments);
      };

    gameService.setGame({
      gameDeveloperEmail: "punk0706@gmail.com",
      minNumberOfPlayers: 2,
      maxNumberOfPlayers: 2,
      //exampleGame: gameLogic.getExampleGame(),
      //riddles: gameLogic.getRiddles(),
      isMoveOk: gameLogic.isMoveOk,
      updateUI: updateUI
    });
  }]);
;'use strict';
angular.module('myApp').service('aiService', function() {
function mapPoint(r,c){
    this.r=r;
    this.c=c;
    this.set=false;
    this.score=0;
    this.valid=false;
    this.info=[[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
}
var ai={};
ai.sum=0;
ai.setNum=0;
ai.scoreMap=[];
ai.scorequeue=[];
ai.map=[];
for (var i=0;i<15;i++){
    var tmp=[];
    for(var j=0;j<15;j++){
        var a=new mapPoint(i,j);
        tmp.push(a);
        ai.scorequeue.push(a);
    }
    ai.map.push(tmp);
}

var boardBuf = new ArrayBuffer(255);
var boardBufArr = new Uint8Array(boardBuf);
function bufToString(){
    return String.fromCharCode.apply(null, boardBufArr);
}

ai.ini=function(mode,color){
    this.color=color;
    if(color=='black'){
        this.otc='white';
    }else{
        this.otc='black';
    }
    switch(mode){
        case 'easy':
        this.depth=5;
        this.totry=[12,8];
        break;
        case 'hard':
        this.depth=7;
        this.totry=[10,10];
        break;
        default:
        console.log('ini erro');
    }
    console.log('ini complete');
};
ai.watch=function(r,c,color){
    this.updateMap(r,c,color);
    if(color=='remove')this.setNum--;
    else this.setNum++;
    this.scorequeue.sort(this.sortMove);
};

ai.updateMap=function(r,c,color){
    var remove=false,num;
    if(color==this.color){
        num=1;
    }else if(color==this.otc){
        num=0;
    }else{
        remove=true;
        num=this.map[r][c].set-1;
    }
    return this._updateMap(r,c,num,remove);
};

ai.moves=[
        [-1,-1],
        [-1,0],
        [0,-1],
        [-1,1]
    ];
ai.coe=[-2,1];
ai.scores=[0,1,10,2000,4000,100000000000];

ai._updateMap=function(r,c,num,remove){
    var moves=this.moves,
        coe=this.coe,
        scores=this.scores,
        i=4,x,y,step,tmp,xx,yy,cur,changes=0,s,e;
    if(!remove){
        boardBufArr[r * 15 + c] = num + 2;
        this.map[r][c].set=num+1;
        while(i--){
            x=r;
            y=c;
            step=5;
            while( step-- && x>=0 && y>=0 && y<15 ){
                xx=x-moves[i][0]*4;
                yy=y-moves[i][1]*4;
                if(xx>=15 || yy<0 || yy>=15){
                    x+=moves[i][0];
                    y+=moves[i][1];
                    continue;
                }
                cur=this.map[x][y].info[i];
                if(cur[2]>0){
                    tmp=5;
                    xx=x;
                    yy=y;
                    s=scores[cur[2]];
                    changes-=s*cur[3];
                    while( tmp-- ){
                        this.map[xx][yy].score-=s;
                        xx-=moves[i][0];
                        yy-=moves[i][1];
                    }
                }
                cur[num]++;
                if(cur[1-num]>0){
                    cur[2]=0;
                }else{
                    cur[2]=cur[num];
                    e=coe[num];
                    cur[3]=e;
                    s=scores[cur[2]];
                    tmp=5;
                    xx=x;
                    yy=y;
                    changes+=s*cur[3];
                    while( tmp-- ){
                        this.map[xx][yy].score+=s;
                        xx-=moves[i][0];
                        yy-=moves[i][1];
                    }
                }
                x+=moves[i][0];
                y+=moves[i][1];
            }
        }
    }else{
        boardBufArr[r * 15 + c] = 0;
        this.map[r][c].set=false;
        while(i--){
            x=r;
            y=c;
            step=5;
            //others 0 i am 1-> sc=0
            //others 0 i am more than 1-> sc=1
            //i am >0 others >0 -> sc=-1
            while( step-- && x>=0 && y>=0 && y<15 ){
                xx=x-moves[i][0]*4;
                yy=y-moves[i][1]*4;
                if(xx>=15 || yy<0 || yy>=15){
                    x+=moves[i][0];
                    y+=moves[i][1];
                    continue;
                }
                cur=this.map[x][y].info[i];
                var sc=0;
                cur[num]--;
                if(cur[2]>0){
                    tmp=5;
                    xx=x;
                    yy=y;
                    s=scores[cur[2]];
                    changes-=s*cur[3];
                    while( tmp-- ){
                        this.map[xx][yy].score-=s;
                        xx-=moves[i][0];
                        yy-=moves[i][1];
                    }
                    cur[2]--;
                    if(cur[num]>0)sc=1;
                }else if(cur[1-num]>0 && !cur[num]){
                    sc=-1;
                }
                if(sc===1){
                    tmp=5;
                    s=scores[cur[2]];
                    xx=x;
                    yy=y;
                    changes+=s*cur[3];
                    while( tmp-- ){
                        this.map[xx][yy].score+=s;
                        //if(!this.map[xx][yy].set)changes+=s*cur[3];
                        xx-=moves[i][0];
                        yy-=moves[i][1];
                    }
                }else if(sc===-1){
                    cur[2]=cur[1-num];
                    tmp=5;
                    s=scores[cur[2]];
                    cur[3]=coe[1-num];
                    xx=x;
                    yy=y;
                    changes+=s*cur[3];
                    while( tmp-- ){
                        this.map[xx][yy].score+=s;
                        //if(!this.map[xx][yy].set)changes+=s*cur[3];
                        xx-=moves[i][0];
                        yy-=moves[i][1];
                    }
                }
                x+=moves[i][0];
                y+=moves[i][1];
            }
        }
    }
    this.sum+=changes;
};

ai.simulate=function(x,y,num){
    this.setNum++;
    this._updateMap(x,y,num,false);
};

ai.desimulate=function(x,y,num){
    this._updateMap(x,y,num,true);
    this.setNum--;
};

ai.sortMove=function(a,b){
    if(a.set)return 1;
    if(b.set)return -1;
    if(a.score<b.score){
        return 1;
    }
    else return -1;
};

ai.cache={};

ai.nega=function(x,y,depth,alpha,beta){
    var pt=this.map[x][y].info, i=4, num=depth%2;
    this.simulate(x,y,num);
    var bufstr = bufToString();
    if(this.cache[bufstr]){
        return this.cache[bufstr];
    }
    if(Math.abs(this.sum)>=10000000)return -1/0;
    if(this.setNum===225){
        return 0;
    }else if(depth===0){
        return this.sum;
    }
    this.scorequeue.sort(this.sortMove);
    var i=this.totry[num], tmp, tmpqueue=[], b=beta;
    while(i--){
        tmp=this.scorequeue[i];
        if(tmp.set) continue;
        tmpqueue.push(tmp.c);
        tmpqueue.push(tmp.r);
    }
    depth-=1;
    i=tmpqueue.length-1;
    x=tmpqueue[i];
    y=tmpqueue[--i];
    var score=-this.nega(x,y,depth,-b,-alpha);
    this.desimulate(x,y,depth%2);
    if(score>alpha){
        bufstr = bufToString();
        this.cache[bufstr] = score;
        alpha=score;
    }
    if(alpha>=beta){
        bufstr = bufToString();
        this.cache[bufstr] = beta;
        return alpha;
    }
    b=alpha+1;
    while(i--){
        x=tmpqueue[i];
        y=tmpqueue[--i];
        score=-this.nega(x,y,depth,-b,-alpha);
        this.desimulate(x,y,depth%2);
        if(alpha<score && score<beta){
            score=-this.nega(x,y,depth,-beta,-alpha);
            this.desimulate(x,y,depth%2);
        }
        if(score>alpha){
            alpha=score;
        }
        if(alpha>=beta){
            return alpha;
        }
        b=alpha+1;
    }
    return alpha;
};

ai.move=function(){
    ai.cache={};
    var alpha=-1/0, beta=1/0,bestmove=[this.scorequeue[0].r, this.scorequeue[0].c];
    var i=20, tmp, tmpqueue=[],depth=this.depth;
    while(i--){
        tmp=this.scorequeue[i];
        if(tmp.score.set)continue;
        tmpqueue.push(tmp.c);
        tmpqueue.push(tmp.r);
    }
    i=tmpqueue.length-1;
    var x,y,b=beta;         
    x=tmpqueue[i];
    y=tmpqueue[--i];
    var score=-this.nega(x,y,depth,-b,-alpha);
    this.desimulate(x,y,depth%2);
    if(score>alpha){
        alpha=score;
        bestmove=[x,y];
    }
    b=alpha+1;
    while(i--){
        x=tmpqueue[i];
        y=tmpqueue[--i];
        score=-this.nega(x,y,depth,-b,-alpha);
        this.desimulate(x,y,depth%2);
        if(alpha<score && score<beta){
            score=-this.nega(x,y,depth,-beta,-alpha);
            this.desimulate(x,y,depth%2);
        }
        if(score>alpha){
            alpha=score;
            bestmove=[x,y];
        }
        b=alpha+1;
    }
    return bestmove;
};
function iniComputer(d){
if(d === undefined){
ai.ini('hard', 'white');
}
else{
ai.ini(d,'white');
}
}
function informingComputer(r, c, color){
ai.watch(r, c, color);
}
function getMove(){
var bestmove = ai.move();
return bestmove;
}
this.iniComputer = iniComputer;
this.informingComputer = informingComputer;
this.getMove = getMove;
});
