/***********************************************************
   Yatzy game, Bootstrap version by Jarmo Mäkelä
   infotext.js   (Handling of the info texts for the users)
   Version 1.0, 2016-03-21
************************************************************/


var TEXT_START = 1;
var TEXT_ROLL = 2;
var TEXT_FIRST = 3;
var TEXT_SECOND = 4;
var TEXT_THIRD = 5;
var TEXT_FINISH = 6;
var TEXT_EMPTY = 7;


//---------------------------
// infoText class definition
//---------------------------

function infoTextClass() {
  this.currentTextId = 0;
  
  this.startGame = function(player) {
    updateInfoText(player, TEXT_START);
    this.currentTextId = TEXT_START;
  }
  
  this.rollDices = function(player) {
    updateInfoText(player, TEXT_ROLL);
    this.currentTextId = TEXT_ROLL;
  }
  
  this.firstRoll = function(player) {
    updateInfoText(player, TEXT_FIRST);
    this.currentTextId = TEXT_FIRST;
  }
  
  this.secondRoll = function(player) {
    updateInfoText(player, TEXT_SECOND);
    this.currentTextId = TEXT_SECOND;
  }
  
  this.thirdRoll = function(player) {
    updateInfoText(player, TEXT_THIRD);
    this.currentTextId = TEXT_THIRD;
  }
    
  // Game finish is always displayed in both panes
  this.gameFinish = function(player) {
    updateInfoText(player, TEXT_FINISH);
    this.currentTextId = TEXT_FINISH;
  }
  
  // Empty text is always displayed in both panes
  this.emptyText = function(player) {
    updateInfoText(player, TEXT_EMPTY);
    this.currentTextId = TEXT_EMPTY;
  }
  
  this.refresh = function(player) {
    // Refresh the text when the language is changed
    updateInfoText(player, this.currentTextId);
  }
}


//---------------------------------------
// Global object handling the info texts
//---------------------------------------

var infoText = new infoTextClass();


//--------------------------
// Put the texts on display
//--------------------------

function updateInfoText(playerNumber, infoTextId) {

  var str;
  var sameTextToBoth = false;
  
  switch (infoTextId) {
    case TEXT_START:
      str = t.infoStartGame;
      break;
    case TEXT_ROLL:
      str = t.infoRollDices;
      break;
    case TEXT_FIRST:
      str = t.infoFirstRoll;
      break;
    case TEXT_SECOND:
      str = t.infoSecondRoll;
      break;
    case TEXT_THIRD:
      str = t.infoThirdRoll;
      break;
    case TEXT_FINISH:
      str = t.infoGameFinish;
      sameTextToBoth = true;
      break;
    case TEXT_EMPTY:
      str = "&nbsp";
      sameTextToBoth = true;
      break;
  }

  if (sameTextToBoth) {
    $("#p1InfoText").html(str);
    $("#p2InfoText").html(str);
  }
  else if (playerNumber == 1) {
    $("#p1InfoText").html(str);
    $("#p2InfoText").html(t.infoWait);
  }
  else {
    $("#p1InfoText").html(t.infoWait);
    $("#p2InfoText").html(str);
  }
}
