/************************************************
   Yatzy game, Bootstrap version by Jarmo Mäkelä
   player.js
   Version 1.0, 2016-03-19
*************************************************/


//-------------------------
// Player class definition
//-------------------------

function Player() {
  this.name = "";
  this.plays = false;
  this.isComputer = false;
  this.subTotal = 0;   // points from 'Ones' ... 'Sixes'
  this.points = 0;     // excludes the bonus points
  this.bonus = 0;      // 50 if 'subTotal' >= 63, 0 otherwise
  this.details = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];   // target specific points
  
  //---------------------------------------------------
  // 'getTotal' returns the points including the bonus
  //---------------------------------------------------
  this.getTotal = function() {
    return (this.points + this.bonus);
  };
  
  //-------------------------------------------------
  // 'getDetails' returns an array of points targets
  //-------------------------------------------------
  this.getDetails = function() {
    return this.details;
  }
  
  //---------------------------------------------------
  // 'reset' returns default values for all properties
  //---------------------------------------------------
  this.reset = function() {
    this.name = "";
    this.plays = false;
    this.isComputer = false;
    this.subTotal = 0;
    this.points = 0;
    this.bonus = 0;
    this.details = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  };
}
 

//--------------------------------------------
// Global variable storing player information
//--------------------------------------------

var players = [];


//--------------------------------------------------
// One-time initialization function for the players
//--------------------------------------------------

function createPlayers() {

  for (var i = 0; i < MAX_PLAYERS; i++) {
    players[i] = new Player();
  }
}
