'use strict';

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
