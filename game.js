/************************************************
   Yatzy game, Bootstrap version by Jarmo Mäkelä
   game.js   ("Main" module, game functions)
   Version 1.0, 2016-02-28
*************************************************/


// Constants
var MAX_PLAYERS = 2;    // The code currently does not support more than 2 players
var NBR_OF_DICES = 5;   // Number of dices
var HS_LIST_MAX = 15;   // Maximum number of items in the high score list


// Global variables
var t;   // Contains all the user interface texts
var dicesNotRolled;    // True if the dice values are currently undefined
var round;    // Game has 15 rounds. The first round is 0. The game finishes when round is 15.
var repeat;   // Value between 0 - 2.  After the initial roll the user can repeat the roll twice.
var pNbr;     // 1 or 2, according to which player is currently active
var lowHighScore = 0;   // The smallest points number in the current High Score list


//---------------------------------------------------
// Show the game view i.e. the "main view" on screen
//---------------------------------------------------

function showGame() {

  // Update the highlight on the navbar
  $("#navHighScore").removeClass("active");
  $("#navGame").addClass("active");

  // Switch the view
  $("#highScoreView").hide();
  $("#gameView").show();
  
}


//------------------------------------
// Show the high score view on screen
//------------------------------------

function showHighScore() {

  // Update the highlight on the navbar
  $("#navGame").removeClass("active");
  $("#navHighScore").addClass("active");
  
  // Switch the view
  $("#gameView").hide();
  $("#highScoreView").show();
  
  // Get and show the high score list
  getHighScoreList();
}


//----------------------------------------------------------------
// Show a dialog where the names / types of the players are asked
//----------------------------------------------------------------

function askPlayerInfo() {

  // If the High Score view is open, switch to the game view
  showGame();
  
  $("#enterPlayerInfo").modal();
}


//--------------------------------------------------------------------------
// Update the player information (name, type, number).
// Show the player name(s) and hide the right side pane if only one player.
//--------------------------------------------------------------------------

function updatePlayerInfo() {

  var str;

  for (var i = 0; i < MAX_PLAYERS; i++) {
    players[i].reset();
  }
  
  // Nunber of players
  players[0].plays = true;   // There is always at least one player
  if ($("#p2RadioNone").prop("checked")) {
    players[1].plays = false;
    $("#player2Area").hide();
  }
  else {
    players[1].plays = true;
    $("#player2Area").show();
  }
  
  // Human players or computers. Show or hide the play buttons accordingly.
  for (var i = 0; i < MAX_PLAYERS; i++) {
    if ($("#p" + (i + 1) + "RadioComputer").prop("checked")) {
      players[i].isComputer = true;
      players[i].name = "(" + t.computer + ")";
      $("#p" + (i + 1) + "GameButton").hide();
    }
    else {
      players[i].isComputer = false;
      $("#p" + (i + 1) + "GameButton").show();
    }
  }
  
  // Names of the players. Use default name if no proper name is given.
  for (var i = 0; i < MAX_PLAYERS; i++) {
    if ($("#p" + (i + 1) + "RadioName").prop("checked")) {
       str = $("#player" + (i + 1) + "InputName").val();
       players[i].name = str.replace(/^\s+|\s+$|\s+(?=\s)/g, "");
       
       if (players[i].name == "") {
         players[i].name = t.player + " " + (i + 1);
       }
    }
  }
  
  // Show the player names on display
  for (var i = 0; i < MAX_PLAYERS; i++) {
    $("#player" + (i + 1) + "Name").html(players[i].name);
  }
  
  initGame();
}


//--------------------------------------------
// Initialize the global game state variables
// and reset the values on screen
//--------------------------------------------

function initGame() {

  // Reset state variables
  dicesNotRolled = true;
  round = 0;
  repeat = 0;
  pNbr = 1;
  
  // Reset the points and labels on display
  var labels = document.querySelectorAll(".fLabel");
  for (var i = 0; i < labels.length; i++) {
    labels[i].style.fontWeight = "bold";
  }
  
  var values = document.querySelectorAll(".fValue");
  for (var i = 0; i < values.length; i++) {
    values[i].innerHTML = "-";
  }
  
  var points = document.querySelectorAll(".fPoints");
  for (var i = 0; i < points.length; i++) {
    points[i].innerHTML = "-";
  }

  // Set the player 1 pane active
  $("#player1Panel").removeClass("panel-default");
  $("#player1Panel").addClass("panel-primary");
  $("#player2Panel").removeClass("panel-primary");
  $("#player2Panel").addClass("panel-default");
  
  // Set the player 1 game button active and player 2 game button non-active
  $("#p1GameButton").addClass("active");
  $("#p1GameButton").removeClass("disabled");
  $("#p2GameButton").removeClass("active");
  $("#p2GameButton").addClass("disabled");
  
  // Instruct player 1 to start the game
  infoText.startGame(1);
  
  // If the next player is computer, roll the dices
  if (players[pNbr - 1].isComputer) {
    roll(pNbr);
  }
}


//----------------------------------------------------------------
// Roll dices, if it is currently allowed. Parameter fromComputer
// is true if the function is called by "computer player".
//----------------------------------------------------------------

function roll(playerNumber, fromComputer) {

  // Accept actions only from the current player
  if (playerNumber != pNbr) {
    return;
  }
  
  // Do not accept a roll if the previous result is not yet put on the table.
  if (repeat > 2) {
    return;
  }
  
  // Do not accept a roll from the user if the current player is computer
  if (players[pNbr - 1].isComputer && fromComputer == false) {
    return;
  }
  
  // Increase the counters
  repeat++;
  
  // Roll dices
  for (var i = 0; i < NBR_OF_DICES; i++) {
    if (dices[playerNumber - 1][i].locked == false) {
      dices[playerNumber - 1][i].roll();
    }
    // Unlock the previously locked dices
    dices[playerNumber - 1][i].unlock();
  }
  
  dicesNotRolled = false;
  
  // Update the instructions on the screen
  if (repeat == 1) {
    infoText.firstRoll(playerNumber);
  }
  else if (repeat == 2) {
    infoText.secondRoll(playerNumber);
  } else {
    infoText.thirdRoll(playerNumber);
  }
  
  // If the current player is computer, decide the actions.
  // A delay is set to show the dices before the next actions
  if (players[pNbr - 1].isComputer) {
    setTimeout(function() { computerLock1(pNbr); }, ROLL_DELAY);
  }
}


//--------------------------------------------------------------------
// Toggle between a locked and an unlocked dice. This function is
// called when a dice icon is clicked. Parameter fromComputer is true
// if the function is called by "computer player".
//--------------------------------------------------------------------

function lockDice(diceNumber, playerNumber, fromComputer) {

  // Only the dices of the current player can be locked
  if (playerNumber != pNbr) {
    return;
  }
  
  // Check if this is the time for dice locking
  if (repeat == 0) {
    return;
  }
  
  // Do not accept a click from the user if the current player is computer
  if (players[pNbr - 1].isComputer && fromComputer == false) {
    return;
  }
  
  dices[playerNumber - 1][diceNumber - 1].lock();
}


//-------------------------------------
// Set the current player number value
//--------------------------------------

function changeCurrentPlayer() {

  if (players[1].plays == false) {
    pNbr = 1;
  }
  else if (pNbr == 1) {
    pNbr = 2;
    $("#player1Panel").removeClass("panel-primary");
    $("#player1Panel").addClass("panel-default");
    $("#player2Panel").removeClass("panel-default");
    $("#player2Panel").addClass("panel-primary");
    $("#p1GameButton").removeClass("active");
    $("#p1GameButton").addClass("disabled");
    $("#p2GameButton").addClass("active");
    $("#p2GameButton").removeClass("disabled");
  }
  else {
    pNbr = 1;
    $("#player1Panel").removeClass("panel-default");
    $("#player1Panel").addClass("panel-primary");
    $("#player2Panel").removeClass("panel-primary");
    $("#player2Panel").addClass("panel-default");
    $("#p1GameButton").addClass("active");
    $("#p1GameButton").removeClass("disabled");
    $("#p2GameButton").removeClass("active");
    $("#p2GameButton").addClass("disabled");
  }
}


//--------------------------------------------------
// Game finishing functions (high score check etc.)
//--------------------------------------------------

function gameFinish() {
  
  var nbrOfPlayers = 1;
  if (players[1].plays) {
    nbrOfPlayers = 2;
  } 

  pNbr = 0;  
  infoText.gameFinish(pNbr);
    
  // Check if the result is good enough for the high score list. The addHighScoreItem
  // function will show a note if the result was actually added to the list.
  for (var i = 0; i < nbrOfPlayers; i++) {
    if (players[i].getTotal() >= lowHighScore) {
      addHighScoreItem(players[i].name,
                       players[i].isComputer,
                       players[i].getTotal(),
                       players[i].getDetails());
    }
  }
}
