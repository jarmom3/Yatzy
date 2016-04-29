/************************************************
   Yatzy game, Bootstrap version by Jarmo Mäkelä
   points.js   (Points calculation functions)
   Version 1.0, 2016-03-07
*************************************************/


//----------------------------------------------------------------
// Handles the points selections from the human players
// In parameters:
// - player: 1 or 2, according to which player clicked the label
// - target: selected points target ("Ones", "Twos", ... "Yatzy")
//----------------------------------------------------------------

function setPlayerPoints(player, target) {

  var points;

  // Do not accept the click if the target is already used
  if ($(".p" + pNbr + ".v" + target).html() != "-") {
    return;
  }
  
  if (dicesNotRolled) {
    return;
  }
  
  if (player != pNbr) {
    return;
  }
  
  // Do not accept the click if computer player is in turn
  if (players[pNbr - 1].isComputer) {
    return;
  }
  
  points = getPoints(player, target);
  
  // Show the points and remove the bold style from the label
  $(".p" + pNbr + ".v" + target).html(points);
  $(".p" + pNbr + ".l" + target).css("font-weight", "");
  
  if (target == P1 || target == P2 || target == P3 || target == P4 || target == P5 || target == P6) {
    updatePoints(points, true);
  }
  else {
    updatePoints(points, false);
  }
  
  updatePointsDetails(player, points, target);
}


//----------------------------------------------------------------
// Handles the points selections from the computer players
// In parameters:
// - player: 1 or 2, according to which player clicked the label
// - target: selected points target ("Ones", "Twos", ... "Yatzy")
//----------------------------------------------------------------

function setComputerPoints(player, target) {

  var points = getPoints(player, target);
  
  // Show the points and remove the bold style from the label
  $(".p" + pNbr + ".v" + target).html(points);
  $(".p" + pNbr + ".l" + target).css("font-weight", "");
  
  // Highlight the selected points target for a while
  $(".p" + pNbr + ".l" + target).addClass("mark");
  setTimeout(function() { $(".fLabel").removeClass("mark"); }, HIGHLIGHT_DELAY);
  
  
  if (target == P1 || target == P2 || target == P3 || target == P4 || target == P5 || target == P6) {
    updatePoints(points, true);
  }
  else {
    updatePoints(points, false);
  }
  
  updatePointsDetails(player, points, target);
}


//---------------------------------------------------------------
// Returns the number of points according to the selected target
//---------------------------------------------------------------

function getPoints(player, target) {
  
  switch (target) {
    case P1:
      return pointsOnes(player);
      break;
    case P2:
      return pointsTwos(player);
      break;
    case P3:
      return pointsThrees(player);
      break;
    case P4:
      return pointsFours(player);
      break;
    case P5:
      return pointsFives(player);
      break;
    case P6:
      return pointsSixes(player);
      break;
    case P7:
      return pointsOnePair(player);
      break;
    case P8:
      return pointsTwoPairs(player);
      break;
    case P9:
      return pointsThreeOfAKind(player);
      break;
    case P10:
      return pointsFourOfAKind(player);
      break;
    case P11:
      return pointsSmallStraight(player);
      break;
    case P12:
      return pointsLargeStraight(player);
      break;
    case P13:
      return pointsHouse(player);
      break;
    case P14:
      return pointsChance(player);
      break;
    case P15:
      return pointsYatzy(player);
      break;
    default:
      break;
  }
}


//---------------------------------------
// How many points if 'Ones' is selected
//---------------------------------------

function pointsOnes(player) {

  var diceCount = countDices(player);
  return diceCount[0];
}


//---------------------------------------
// How many points if 'Twos' is selected
//---------------------------------------

function pointsTwos(player) {

  var diceCount = countDices(player);
  return diceCount[1] * 2; 
}


//-----------------------------------------
// How many points if 'Threes' is selected
//-----------------------------------------

function pointsThrees(player) {

  var diceCount = countDices(player);
  return diceCount[2] * 3;
}


//----------------------------------------
// How many points if 'Fours' is selected
//----------------------------------------

function pointsFours(player) {

  var diceCount = countDices(player);
  return diceCount[3] * 4;
}


//----------------------------------------
// How many points if 'Fives' is selected
//----------------------------------------

function pointsFives(player) {

  var diceCount = countDices(player);
  return diceCount[4] * 5;
}


//----------------------------------------
// How many points if 'Sixes' is selected
//----------------------------------------

function pointsSixes(player) {

  var diceCount = countDices(player);
  return diceCount[5] * 6;
}


//-------------------------------------------
// How many points if 'One pair' is selected
//-------------------------------------------

function pointsOnePair(player) {

  var diceCount = countDices(player);
  var points = 0;
  for (var i = 0; i < 6; i++) {
    if (diceCount[i] > 1) {
      points = 2 * (i + 1);
    }
  }
  return points;
}


//--------------------------------------------
// How many points if 'Two pairs' is selected
//--------------------------------------------

function pointsTwoPairs(player) {
     
  var diceCount = countDices(player); 
  var points = 0;
  var pair1 = 0;
  var pair2 = 0;
  
  for (var i = 0; i < 6; i++) {
    if (diceCount[i] > 1) {
      pair1 = i + 1;
    }
  }
  
  if (pair1 > 0) {
    diceCount[pair1 - 1] = diceCount[pair1 - 1] - 2;
    for (var i = 0; i < 6; i++) {
      if (diceCount[i] > 1) {
        pair2 = i + 1;
      }
    }
    if (pair2 > 0) {
      points = (2 * pair1) + (2 * pair2);
    }
  }
  
  return points;
}


//--------------------------------------------------
// How many points if 'Three of a kind' is selected
//--------------------------------------------------

function pointsThreeOfAKind(player) {

  var diceCount = countDices(player);
  var points = 0;  
  for (var i = 0; i < 6; i++) {
    if (diceCount[i] > 2) {
      points = 3 * (i + 1);
    }
  }
  
  return points;
}


//-------------------------------------------------
// How many points if 'Four of a kind' is selected
//-------------------------------------------------

function pointsFourOfAKind(player) {
  
  var diceCount = countDices(player);
  var points = 0;  
  for (var i = 0; i < 6; i++) {
    if (diceCount[i] > 3) {
      points = 4 * (i + 1);
    }
  }
  
  return points;
}


//-------------------------------------------------
// How many points if 'Small straight' is selected
//-------------------------------------------------

function pointsSmallStraight(player) {
  
  var diceCount = countDices(player);
  var points = 15;  
  for (var i = 0; i < 5; i++) {
    if (diceCount[i] != 1) {
      points = 0;
    }
  }
  
  return points;
}


//-------------------------------------------------
// How many points if 'Large straight' is selected
//-------------------------------------------------

function pointsLargeStraight(player) {
  
  var diceCount = countDices(player);
  var points = 20;  
  for (var i = 1; i < 6; i++) {
    if (diceCount[i] != 1) {
      points = 0;
    }
  }
  
  return points;
}


//----------------------------------------
// How many points if 'House' is selected
//----------------------------------------

function pointsHouse(player) {
  
  var diceCount = countDices(player);
  var points = 0;
  var threeOfAKind = 0;
  var pair = 0;
    
  for (var i=0; i < 6; i++) {
    if (diceCount[i] > 2) {
      threeOfAKind = i + 1;
    }
  }
  if (threeOfAKind > 0) {
    diceCount[threeOfAKind - 1] = diceCount[threeOfAKind -1] - 3;
    for (var i=0; i < 6; i++) {
      if (diceCount[i] > 1) {
        pair = i + 1;
      }
    }
    if (pair > 0) {
      points = (3 * threeOfAKind) + (2 * pair);
    }
  }
  
  return points;
}


//-----------------------------------------
// How many points if 'Chance' is selected
//-----------------------------------------

function pointsChance(player) {

  var points = 0;
  for (var i = 0; i < 5; i++) {
    points = points + dices[player - 1][i].value;
  }
  
  return points;
}


//----------------------------------------
// How many points if 'Yatzy' is selected
//----------------------------------------

function pointsYatzy(player) {

  var diceCount = countDices(player);
  var points = 0;
  for (var i=0; i < 6; i++) {
    if (diceCount[i] > 4) {
      points = 50;
    }
  }
  
  return points;
}


//---------------------------------------------------------------------
// Returns an array how many ones, how many twos etc. the results have
//---------------------------------------------------------------------

function countDices(player) {
  
  var diceCount = [0, 0, 0, 0, 0, 0];

  // Do the check for each dice
  for (var i = 0; i < NBR_OF_DICES; i++) {
    // Where to put the value of this dice
    for (var j = 0; j < 6; j++) {
      if (dices[player - 1][i].value == (j + 1)) {
        diceCount[j]++;
      }
    }
  }
  return diceCount;
}


//---------------------------------------------
// Update the subtotal, bonus and total points
// Input parameters:
// - newPoints: int
// - partOfOnesToSixes: boolean
//---------------------------------------------

function updatePoints(newPoints, partOfOnesToSixes) {

  // Add points for the player, calculate subtotal and bonus  
  players[pNbr - 1].points += newPoints;
  if (partOfOnesToSixes) {
    players[pNbr -1].subTotal += newPoints;
    if (players[pNbr - 1].subTotal >= 63) {
      players[pNbr - 1].bonus = 50;
    }
  }
    
  // Update the points on display
  $(".p" + pNbr + ".vSubTotal").html(players[pNbr - 1].subTotal);
  $(".p" + pNbr + ".vBonus").html(players[pNbr - 1].bonus);
  $(".p" + pNbr + ".vTotal").html(players[pNbr - 1].getTotal());
  
  // Reset the dice values and images
  for (var i = 0; i < 5; i++) {
    dices[pNbr - 1][i].reset();
  }
  
  // Restore state variables
  dicesNotRolled = true;
  repeat = 0;
  
  // Increase the round counter if this round is complete
  if ((pNbr == 2) || (pNbr == 1 && players[MAX_PLAYERS - 1].plays == false)) {
    round++;
    
    // Game over
    if (round == NBR_OF_ROUNDS) {
      gameFinish();  
      return;
    }
  }
  
  changeCurrentPlayer();
  
  // Update the instructions on the screen
  infoText.rollDices(pNbr);
  
  // If the next player is computer, roll the dices
  if (players[pNbr - 1].isComputer) {
    roll(pNbr, true);
  }  
}


//------------------------------------------------------
// Update the points details array in the player object
//------------------------------------------------------
function updatePointsDetails(player, points, target) {

  var detailsIndex;

  switch (target) {
    case P1:
      detailsIndex = 0;
      break;
    case P2:
      detailsIndex = 1;
      break;
    case P3:
      detailsIndex = 2;
      break;
    case P4:
      detailsIndex = 3;
      break;
    case P5:
      detailsIndex = 4;
      break;
    case P6:
      detailsIndex = 5;
      break;
    case P7:
      detailsIndex = 6;
      break;
    case P8:
      detailsIndex = 7;
      break;
    case P9:
      detailsIndex = 8;
      break;
    case P10:
      detailsIndex = 9;
      break;
    case P11:
      detailsIndex = 10;
      break;
    case P12:
      detailsIndex = 11;
      break;
    case P13:
      detailsIndex = 12;
      break;
    case P14:
      detailsIndex = 13;
      break;
    case P15:
      detailsIndex = 14;
      break;
  }
  
  players[player - 1].details[detailsIndex] = points;
}
