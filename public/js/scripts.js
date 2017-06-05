/* global $ */ //para que no alerte de los $ pues dice que no están definidos

var bnv = '<div id="bienVenue">'
      + '<div id="bienttl"></div>'
      + '<div id="chOneX" class="plCh"></div>'
      + '<div id="chTwoO" class="plCh"></div>'
    + '</div>';
var ttt = "<div id='board'><div id='sq00' class='sq'><div id='l00' class= 'lineV line'><div id='l01' class='lineV line'></div></div><div id='l10' class= 'lineH line'></div></div><!--"
    + "--><div id='sq01' class='sq'></div><!--"
    + "--><div id='sq02' class='sq'></div><!--"
    + "--><div id='sq10' class='sq'><div id='l10' class= 'lineH line'></div></div><!--"
    + "--><div id='sq11' class='sq'></div><!--"
    + "--><div id='sq12' class='sq'></div><!--"
    + "--><div id='sq20' class='sq'></div><!--"
    + "--><div id='sq21' class='sq'></div><!--"
    + "--><div id='sq22' class='sq'></div></div>";
//Animate CSS function , just do something once, wait effect, and erase class to use it again after
// call it by Ex: $('#yourElement').animateCss('bounce');
$.fn.extend({
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
        });
    }
});
//General variables
var circle = "<div class='circle played'></div>"; //html O
var equis = "<div class='equis played'></div>"; //html X
var oneOrTwo = false; //To know where are we, if 1 or 2 Players screen or somewhere else
var XYfirstSel = false; //To know where are we, if X or Y screen or somewhere else
var globalScore = [0, 0]; //Pl1 and Pl2/computer

var len = 3;
var maxMoves = len * len; //3 x 3 board
var humans = false; //see if its computer + player or 2 players
var turnsExp = 2; // = 2: es 1 jugador y la computadora, =1: son 2 jugadores
//best moves from the computer
var bestRow = -1;
var bestCol = -1;
//player variable designation
var player = -1; // 1 = computer = "X", -1 = player = "0"
var trackPlay = -1;
// initialize board
var board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
var moves = 0;

$(document).ready(function() {
  //buttons or Divs that are available from the begining
  $("#restart").on("click", function() { reset() });
  initScreens("One");
});

/*
  Function that manages the starting environnement
*/
function playersChoice(num) {
  //console.log($("#chOneX").text());
  if (oneOrTwo == false) { //chosen if one or two players
    $("#plOneTxt").animateCss('lightSpeedIn');
    $("#plTwoTxt").animateCss('lightSpeedIn');
    $(".turn").animateCss('flipInX');
    if (num == 1) {
      humans = false;
      turnsExp = 2;
      $("#plOneTxt").text("Player");
      $("#turn1").text("Player");
      $("#plTwoTxt").text("Computer");
      $("#turn2").text("Computer");
    } else { //num == 2
      humans = true;
      turnsExp = 1;
      $("#plOneTxt").text("Player 1");
      $("#plTwoTxt").text("Player 2");
      $("#turn1").text("Player 1");
      $("#turn2").text("Player 2");
    }
    initScreens("X");
    oneOrTwo = true;
  } else {
    console.log("paso por aquí")
    if (num == 1) { //X Selection
      player = 1;
      trackPlay = 1;
    }
    //take out actual divs, insert Tic Tac Toe environement
    $("#bienVenue").remove();
    tttenvironnement();
    controlTruns(1);
    XYfirstSel = true;
  }
};

/*
  Just add event handlers for every new div added.
*/
function tttenvironnement() {
  $(ttt).appendTo("#ttt");
  //On clicks assignation for each board section
  $("#sq00").on("click", function() { played(0, 0); });
  $("#sq01").on("click", function() { played(0, 1); });
  $("#sq02").on("click", function() { played(0, 2); });
  $("#sq10").on("click", function() { played(1, 0); });
  $("#sq11").on("click", function() { played(1, 1); });
  $("#sq12").on("click", function() { played(1, 2); });
  $("#sq20").on("click", function() { played(2, 0); });
  $("#sq21").on("click", function() { played(2, 1); });
  $("#sq22").on("click", function() { played(2, 2); });
}

/*
  Main Function for TicTacToe
*/
function played(r, c) {
  console.log("Human row: " + r + " and col : " + c + " and player " + player);
  var finish = 0;
  finish = repeatPlay(r, c, false);
  
  if (humans == false && finish < 2) {
    setTimeout(function() {
      repeatPlay(r, c, true);
    }, 1000);
  }
 
  function repeatPlay(r, c, machine) {
    var winner = 0;
    var legal = 0;
    bestRow = -1;
    bestCol = -1;
    
    //controlTruns(moves);
    //console.log("humans " + humans + " conteo " + dwncnt);
    if (machine == true) {
      if (moves < maxMoves - 1) {
        controlTruns(moves);
      }
      miniMax(board, player, true, moves, false, 0, true); //we pass "0" as alphaBeta value because i doesn't matter which we pass, it's restricted in the interior of minMax it's apeareance and take in account.
      r = bestRow;
      c = bestCol;
      console.log("machine row: " + r + " and col : " + c + " and it's player " + player);
    }
    //Legal move? if yes, put it in the board, if not exit function
    legal = readPlayerInp(r, c, player);
    if (legal == 0) {
      console.log("ilegal move");
      return 2; //exit function or tell player ilegal move
    }
    //Check for winner
    winner = checkWinner(board);
    console.log(winner + " " + board);
    if (winner != 0) {
      //tell who's the winner
      //reinitialize variables
      restart("win", winner);
      console.log("winner is :" + winner);
      return winner;
    }
    if (machine == false) {
      controlTruns(moves + 1);
    }
    //Check for a Tie (no winner detected and max turns, so...)
    if (moves == maxMoves) {
      restart("tie");
      console.log("tie");
      return 3;
    }
    return 0;
  }
}



function controlTruns(m) {
  if (m % 2 != 1) { //significa que es el jugador 1 que tira
    $("#turn2").css("opacity", "1");
    $("#turn1").css("opacity", "0.3");
  } else {
    $("#turn2").css("opacity", "0.3");
    $("#turn1").css("opacity", "1");
  }
}

function restart(txt, wn) {
  initTTTvar(false);
  controlTruns(1);
  $(".played").fadeOut("slow", function() {
    $(this).remove();
  });
  //What to do with query, winner or tie
  if (txt == "win") {
    var winner = whosWinner(wn);
    $("#add").text("Winner is " + winner + " !!");
    $("#add").fadeIn("slow", function() {
      setTimeout(function() {
        $("#add").fadeOut();
        controlTruns(1);
      }, 1000);
    });
    
  } else { //tie
    $("#add").text("It's a Tie!!");
    $("#add").fadeIn("slow", function() {
      setTimeout(function() {
        $("#add").fadeOut();
      }, 1000);
    });
  }
}

/*
  Just Check for winner and return "the name" of the winner
*/
function whosWinner(w) {
  var tck = trackPlay;
  var winner = "";
  //Who wins?
  if (tck == 1) {
    if (w == 1) { //Means player 1 or human wins
      if (humans == true) {
        winner = "Player 1";
      } else {
        winner = "Player";
      }
      globalScore[0] ++;
    } else { //Means player 2 or computer
      if (humans == true) {
        winner = "Player 2";
      } else {
        winner = "Computer";
      }
      globalScore[1] ++;
    }
  }
  else {
    if (w == 1) { //Means player 2 or computer
      if (humans == true) {
        winner = "Player 2";
      } else {
        winner = "Computer";
      }  
      globalScore[1] ++;
    } else { //Means player 1 or human wins
      if (humans == true) {
        winner = "Player 1";
      } else {
        winner = "Player";
      }
      globalScore[0] ++;
    }
  }
  $("#plOneScore").text(globalScore[0]);
  $("#plTwoScore").text(globalScore[1]);
  return winner;
}

/*
  just to change the "player pole" to adjust expected outputs form minMax
  and to reverse, in order to not having problems with the original array :
  IMPOSSIBLE TO CHANGE VALUES (even if passed array by value) because references in its interior elements continues. To slice an array, creates a new array but with same references to its interior elements.
*/
function positivePlayer (b) {
    for (var row = 0; row < len; row ++) {
      for (var col = 0; col < len; col ++) {
        if (b[row][col] != 0) {
          b[row][col] *= -1;
        } 
      }
    }
  return b;
}

/*
  Min Max algorithm
  Explore the whole possible scenarios and give a score in order to decide which is best
  Recursive Function 
  "There are 2 players, Min and Max. So the MAX player will try to select
the move with highest value in the end. But the MIN player also has something to say about it and he will try to select
the moves that are better to him, thus minimizing MAX’s outcome."
  "myturn" wil indicate if it's max or min level .. True: MAX, False: MIN
*/
function miniMax(b, p, myturn, depth, fIt, ab, first) {
//we are playing with negative and positive numbers, giving negative numbers te possibility to win (winner could be "-1"), and we are adding comparative sections letting them disqualify this negative winner because of its nature. In order to leave it in it's actual stae, we just need an initial change, saying that, always, the "positive" player is the one that asks for the minMax function. (Ej, if in the last play the winner is -1, this iterative funtion will disqualify him because is less than the tie option "0", so he will choose row and column from tie)
  var trackPositiveness = false;
  if (first == true && p < 0) {
    console.log("1 " + b);
    b = positivePlayer (b);
    console.log("2 " + b);
    p *= -1;
    trackPositiveness = true;
  }
  //remember that arguments (not same rule for objects) are passed by value, so, no problem if changing their values in here
  //Prepare environnement
  var winner = 0;
  var moveR = -1; //To manage movements during this iteration/Sprint, row
  var moveC = -1; //To manage movements during this iteration/Sprint, column
  var score; //To store, in a sprint, the prefered score returned on each hypotetical legal move
  //2 variables to do te follow up to the AlhaBeta Optimization
  var firstItDone = false; //we need first set of leaves (a node) to be fully determined in order to have that first issued value as referal
  var alphaBeta; //referal variable
  //see if all chances have been explored
  //In this case, we don't need to limit the searching with a maxdDepth because the minmaxtree isn't very big, 
  //because of the nature of the game and the size (3x3), so we limit it to maxMoves, and when reached, it's a tie
  //"At depth n, the tree will have 3^n nodes"
  //*Even though, asticles say not clever to let it go further than 5, let's leave it for the moment with that constraint
  if (depth > maxMoves) { 
    console.log("depth returned at: " + depth);
    return 0;
  } 
  //First, player has donne his move, so let's check if he already won, or the recursive hypotetical player did
  winner = checkWinner(b);
  if (winner != 0) {
    if (trackPositiveness == true) {
      console.log("pasó por winner");
    }
    return winner;
  }
  //No winner yet?, asign score, let's put it as negative and positive 2
  //(pieces same value so, just to let comparisons of other variables (0 and 1/-1))
  if (myturn) {
    score = -2;
  } else {
    score = 2;
  }
  //For all possible moves
  for (var row = 0; row < len; row ++) {
    for (var col = 0; col < len; col ++) {
      if (b[row][col] == 0) { //if nothing is in that part of board
        b[row][col] = p; //put the move in the board
        //Score variable just available during this IF// just to modify general vaiable Score
        var thisScore = miniMax(b, p * (-1), !myturn, depth + 1, firstItDone, alphaBeta, false);
        //when temporary score is obtained, we will do stuff with it
        //We can optimize it, in order to avoid useless searching
        //Let's maximize or minimize the general score
        if (myturn) { //maximize
          if (thisScore > ab) { //Optimisation for "maximizer player"
            b[row][col] = 0;
            if (trackPositiveness == true) {
              b = positivePlayer (b);
            }
            bestRow = row;
            bestCol = col;
            return thisScore;
          }
          if (thisScore > score) {
            score = thisScore;
            moveR = row;
            moveC = col;
          }
        } else { //minimize
          if (thisScore < ab) { //Optimisation for "minimizer player"
            b[row][col] = 0;
            if (trackPositiveness == true) {
              b = positivePlayer (b);
            }
            bestRow = row;
            bestCol = col;
            return thisScore;
          }
          if (thisScore < score) {
            score = thisScore;
            moveR = row;
            moveC = col;
          }
        }
        b[row][col] = 0; //reset this place in board to permit further moves, simulating original hypotetical board, in this iteration
        firstItDone = true;
        alphaBeta = thisScore;
      }
    }
  }
  if (moveR == -1) return 0; //means that value has not been changed in this sprint, we have arrived to the maximum moves, so, it's a tie
  //assign row and column prefered in this sprint and return the score obtained
  if (trackPositiveness == true) {
    b = positivePlayer (b);
  }
  bestRow = moveR;
  bestCol = moveC;
  return score;
}
  
/*
  Reads player move and determine if it's legal, 
  if it is, it put in the board the O or X
  It changes the turn (player *= -1) and counts moves
*/
function readPlayerInp(r, c, p) {
  //sanity check
  if (moves > maxMoves - 1) {
    return -1;
  }
  //Check for legal move, else, don't put anything in board
  if (board[r][c] == 0) {
    board[r][c] = player; //put the played move in the board
    if (player == -1) { // O
      $(circle).appendTo("#sq" + r + c);
      $(".played").fadeIn(200);
      //$(circle).appendTo("#sq" + r + c);
    } else { // X
      $(equis).appendTo("#sq" + r + c);
      $(".played").fadeIn(200);
    }
    player *= -1;
    moves ++;
    return player;
  } else {
    return 0;
  }
}

/*
  Iterates through every column and row ion order to find a winner, or not
*/
function checkWinner(b) {
  var init = 0;
  var winner = 0;
  //check on columns and rows
  for (var i = 0; i < len; i ++) {
    //check each column
    init = b[0][i];
    winner = init;
    for (var c = 1; c < len; c ++) {
      if (init != b[c][i]) { winner = 0; }
    }
    if (winner != 0) { return winner }
    //check each row
    init = b[i][0];
    winner = init;
    for (var r = 1; r < len; r ++) {
      if (init != b[i][r]) { winner = 0; }
    }
    if (winner != 0) { return winner }
  }
  //Check diagonals (just 2 diagonals possible)
  var left = b[0][0];
  var right = b[0][len - 1];
  var winnerR = right;
  winner = left;
  for (var i = 1; i < len; i ++) {
    if (winner != b[i][i]) {
      winner = 0;
    }
    if (winnerR != b[i][len - i - 1]) {
      winnerR = 0; 
    }
  }
  if (winner != 0) {return winner}
  if (winnerR != 0) {return winnerR}
  //No winner yet
  return 0;
}

/*
  Reset all variables and return to starting point: " 1 or 2 players screen"
*/
function reset() { //2 States: Already implemented TTT or not yet, and "bienvenue" screens
  //check which of the screens the game is, and act in consequence
  if ($("#bienVenue").length == 0) { //means element doesn't exist, and <board> does
    initTTTvar(true);
    $("#board").remove();
    $(bnv).appendTo("#ttt");
    initScreens("One");
    return;
  }
  if (oneOrTwo == true && XYfirstSel == false) { //So, X or Y Screen
    initTTTvar(true);
    initScreens("One");
    console.log("oneor: " + oneOrTwo);
  }
}

/*
  Text on Initial Screens
*/
function initScreens(txt) {
  $("#bienttl").animateCss('flipInX');
  $(".plCh").animateCss('rotateIn');
  if (txt == "X") {
    $("#bienttl").text('Would you like to be "X" or "O"? :)');
    $("#chOneX").text("X");
    $("#chTwoO").text("O");
    $(".plCh").css("font-size", "30px")
    $(".plCh").css("margin", "15px 30px")
  } else {
    //Reassign event handler, just if not already existant
    //IMPORTANT, IF DON'T take care of this part, DOM will be thinking it's 2 clicks, because 2 event handlers on same DIV, and us will be expecting the reaction to just 1 click. 
    if ($("#chOneX").text() != "X") {
      $("#chOneX").on("click", function() { playersChoice(1); })
      $("#chTwoO").on("click", function() { playersChoice(2); })
    }
    $("#bienttl").text('Play against ...');
    $("#chOneX").text("AI");
    $("#chTwoO").text("A partner");
    $(".plCh").css("font-size", "22px")
    $(".plCh").css("margin", "15px")
    //reinitialize score
    $("#plOneScore").text(globalScore[0]);
    $("#plTwoScore").text(globalScore[1]);
    //reinitialize who's who
    $("#plOneTxt").animateCss('lightSpeedIn');
    $("#plTwoTxt").animateCss('lightSpeedIn');
    $(".turn").animateCss('flipInX');
    $("#plOneTxt").text("- -");
    $("#plTwoTxt").text("- -");
    $("#turn2").text("Tic Tac Toe :)");
    $("#turn1").text("Tic Tac Toe !!");
  }
  $("#turn2").css("opacity", "0.3");
  $("#turn1").css("opacity", "0.3");
}

function initTTTvar(all) {
  moves = 0;
  board = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  bestRow = -1;
  bestCol = -1;
  if (trackPlay == 1) {
    player = 1;
  } else {
    player = -1;
  }
  if (all == true) {
    console.log("pasa por all");
    oneOrTwo = false;
    XYfirstSel = false;
    humans = false;
    player = -1;
    trackPlay = -1;
    globalScore = [0, 0];
  }
}