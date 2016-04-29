/************************************************
   Yatzy game, Bootstrap version by Jarmo Mäkelä
   dice.js
   Version 1.0, 2016-03-20
*************************************************/


//-----------------------
// Dice class definition
//-----------------------

function Dice() {
  this.value = 0;
  this.locked = false;
  this.elemStr = "";
  this.playerNumber = 0;
  
  //-----------------------------------------------------
  // 'reset' unlocks the dice and sets the value as zero
  //-----------------------------------------------------
  this.reset = function() {
    this.value = 0;
    this.locked = false;
    document.getElementById(this.elemStr).src = "img/dice0-p" + this.playerNumber + ".png";
    document.getElementById(this.elemStr).style.opacity = "1.0";
  };
  
  //---------------------------------------------------
  // 'lock' toggles between the lock and unlock states
  //---------------------------------------------------
  this.lock = function() {
    if (this.locked) {
      // Unlock the dice
      this.locked = false;
      document.getElementById(this.elemStr).style.opacity = "1.0";
    }
    else {
      // Lock the dice
      this.locked = true;
      document.getElementById(this.elemStr).style.opacity = "0.4";
    }
  };
  
  //---------------------------------------
  // 'unlock' always set the dice unlocked
  //---------------------------------------
  this.unlock = function() {
    this.locked = false;
    document.getElementById(this.elemStr).style.opacity = "1.0";
  };

  //-----------------------------------------------------------
  // 'roll' gives a random number between 1 and 6 for the dice
  //-----------------------------------------------------------
  this.roll = function() {

    var randomNumber = Math.floor((Math.random() * 6) + 1);
  
    if (this.locked == false) {
      this.value = randomNumber;
      document.getElementById(this.elemStr).src =
          "img/dice" + randomNumber + "-p" + this.playerNumber + ".png";
    }
  };
}


//------------------------------------------------------
// Global two dimensional array containing dice objects
//------------------------------------------------------

var dices = [];


//------------------------------------------------
// One-time initialization function for the dices
//------------------------------------------------

function createDices() {
  
  // Create a set of 5 dices for each player
  for (var i = 0; i < MAX_PLAYERS; i++) {
    dices[i] = [];
    for (var j = 0; j < NBR_OF_DICES; j++) {
      dices[i][j] = new Dice();
      dices[i][j].elemStr = "p" + (i + 1) + "DiceResult" + (j + 1);
      dices[i][j].playerNumber = i + 1;
    }
  }
}
