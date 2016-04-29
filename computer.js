/************************************************
   Yatzy game, Bootstrap version by Jarmo Mäkelä
   computer.js   (Computer play logic)
   Version 1.0, 2016-03-23
*************************************************/


var priority = [ 9,    // Ones
                 4,    // Twos
                 3,    // Threes
                 3,    // Fours
                 3,    // Fives
                 3,    // Sixes
                 4,    // One pair
                 2,    // Two pairs
                 2,    // Three of a kind
                 2,    // Four of a kind
                 10,   // Small straight
                 10,   // Large straight
                 5,    // House
                 1,    // Chance
                 10 ]; // Yatzy


//------------------------------------------------------
// Decides computer player actions after the first roll
//------------------------------------------------------

function computerLock1(playerNumber) {

  if (pointsReady(playerNumber)) {
    return;
  }
  
  lockDices(playerNumber);

  setTimeout(function() { computerRoll2(playerNumber); }, ROLL_DELAY);
}


//-------------------------------------------------------------
// The second dice rolling when the computer player is in turn
//-------------------------------------------------------------

function computerRoll2(playerNumber) {

  // Roll dices
  for (var i = 0; i < NBR_OF_DICES; i++) {
    if (dices[playerNumber - 1][i].locked == false) {
      dices[playerNumber - 1][i].roll();
    }
    // Unlock the previously locked dices
    dices[playerNumber - 1][i].unlock();
  }
  
  infoText.secondRoll(playerNumber);
  setTimeout(function() { computerLock2(playerNumber); }, ROLL_DELAY);
}


//-------------------------------------------------------
// Decides computer player actions after the second roll
//-------------------------------------------------------

function computerLock2(playerNumber) {

  if (pointsReady(playerNumber)) {
    return;
  }

  lockDices(playerNumber);

  setTimeout(function() { computerRoll3(playerNumber); }, ROLL_DELAY);
}


//------------------------------------------------------
// Decides computer player actions after the third roll
//------------------------------------------------------

function computerRoll3(playerNumber) {

  var targets = [P1, P2, P3, P4, P5, P6, P7, P8, P9, P10, P11, P12, P13, P14, P15];
  
  var bestResult = -1;
  var bestTarget;
  var thisResult;
  
  // Roll dices
  for (var i = 0; i < NBR_OF_DICES; i++) {
    if (dices[playerNumber - 1][i].locked == false) {
      dices[playerNumber - 1][i].roll();
    }
    // Unlock the previously locked dices
    dices[playerNumber - 1][i].unlock();
  }
  infoText.thirdRoll(playerNumber);
     
  // Decide where to put the points
  for (var i = 0; i < NBR_OF_ROUNDS; i++) {
    
    if ($(".p" + playerNumber + ".v" + targets[i])[0].innerHTML == "-") {
      thisResult = getPoints(playerNumber, targets[i]) * priority[i];
      
      if (thisResult > bestResult) {
        bestResult = thisResult;
        bestTarget = targets[i];
      }
    }
  } 
  
  setTimeout(function() { setComputerPoints(playerNumber, bestTarget); }, POINTS_DELAY);
}


//---------------------------------------------------
// Decides which dices to lock and rolls dices again
//---------------------------------------------------

function computerRollAgain(playerNumber) {

  // Roll dices
  for (var i = 0; i < NBR_OF_DICES; i++) {
    if (dices[playerNumber - 1][i].locked == false) {
      dices[playerNumber - 1][i].roll();
    }
    // Unlock the previously locked dices
    dices[playerNumber - 1][i].unlock();
  }
}


//-----------------------------------------------------------
// Check if ready for setting the points i.e. no roll again.
// Returns true if points were set.
//-----------------------------------------------------------

function pointsReady(playerNumber) {

  // Small straight is used always when possible
  if ((pointsSmallStraight(playerNumber) == 15) && 
     ($(".p" + playerNumber + ".v" + P11).html() == "-"))  {
    setTimeout(function() { setComputerPoints(playerNumber, P11); }, POINTS_DELAY);
    return true;
  }
  
  // Large straight is used always when possible
  if ((pointsLargeStraight(playerNumber) == 20)  && 
     ($(".p" + playerNumber + ".v" + P12).html() == "-")) {
    setTimeout(function() { setComputerPoints(playerNumber, P12); }, POINTS_DELAY);
    return true;
  }
  
  // Yatzy is used always when possible
  if ((pointsYatzy(playerNumber) == 50)  && 
     ($(".p" + playerNumber + ".v" + P15).html() == "-")) {
    setTimeout(function() { setComputerPoints(playerNumber, P15); }, POINTS_DELAY);
    return true;
  }
  
  return false;
}


//--------------------------------------------------------------
// Decide which dices are locked before rolling the dices again
//--------------------------------------------------------------

function lockDices(playerNumber) {

  var diceCount = countDices(playerNumber);
  var targetValue;

  // Try to have the same value in all dices?
  for (var i = 0; i <= 5; i++) {
    if (diceCount[i] >= 3) {
      targetValue = i + 1;
      // Lock all other dices
      for (var j = 0; j < NBR_OF_DICES; j++) {
        if (dices[playerNumber - 1][j].value == targetValue) {
          dices[playerNumber - 1][j].lock();
        }
      }
      return;
    }
  }

  // Lock dices
  for (var i = 0; i < NBR_OF_DICES; i++) {
    if (dices[playerNumber - 1][i].value > 3) {
      dices[playerNumber - 1][i].lock();
    }
  }
}
