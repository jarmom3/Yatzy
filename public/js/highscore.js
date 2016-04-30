/*************************************************
   Yatzy game, Bootstrap version by Jarmo Mäkelä
   highscore.js   (High score handling functions)
   Version 1.0, 2016-03-14
**************************************************/


//------------------------------------------------------------
// Gets the high score list from the database and displays it
//------------------------------------------------------------

function getHighScoreList() {

  // Get the high score list from the server via an AJAX call
  $.get("/highscores/", function(data) {
    var scoreArray = JSON.parse(data);
  
    if (scoreArray.length > 0) {
      var tableElem = document.getElementById("highScoreTable");
      var tableRows = tableElem.getElementsByTagName('tr');
      var row;
      var cell;
    
      // Empty the previous content of the table
      for (var i = tableRows.length - 1; i > 0; i--) {
         tableElem.deleteRow(i);
      }
    
      // Add items row by row to the High Score list
      for (var i = 0; i < scoreArray.length; i++) {
        row = tableElem.insertRow(-1);
        cell = row.insertCell(-1);
        cell.innerHTML = i + 1 + ".";
        cell = row.insertCell(-1);
        if (scoreArray[i].isComputer == true) {
          cell.innerHTML = "(" + t.computer + ")";
        }
        else {
          cell.innerHTML = scoreArray[i].name;
        }
        cell = row.insertCell(-1);
        cell.innerHTML = scoreArray[i].points;
        cell = row.insertCell(-1);
        var d = new Date(scoreArray[i].timeMs);
        var dateStr = d.toLocaleDateString();
        cell.innerHTML = dateStr;
        
        // Use a separate function to set onclick function because the variable 'i'
        // value in parameters would otherwise be bound only after the loop.
        // Keyword 'let' instead of 'var' would solve the problem but it doesn't
        // work in Safari or in Cordova.
        setRowOnclicks(row, scoreArray[i]);
      }
    }
  });
}


//-----------------------------------------------------
// Add onclick functions for the points details dialog
//-----------------------------------------------------
function setRowOnclicks(row, scoreItem) {

  row.onclick = function() { showScoreDetails(scoreItem); };
}


//-----------------------------------------------------------------------
// Open a modal dialog showing the points details of the high score item
//-----------------------------------------------------------------------
function showScoreDetails(scoreItem) {

  var d = new Date(scoreItem.timeMs);
  var dateStr = d.toLocaleDateString();
  var name;
  if (scoreItem.isComputer == true) {
    name = "(" + t.computer + ")";
  }
  else {
    name = scoreItem.name;
  }
  
  $("#pointsDetailsHeader").html(name + ", " + dateStr);
  
  var subTotal = 0;
  for (var i = 0; i < 6; i++) {
    subTotal += Number(scoreItem.details[i]);
  }
  
  $("#detailsOnes").html(t.ones);
  $("#detailsTwos").html(t.twos);
  $("#detailsThrees").html(t.threes);
  $("#detailsFours").html(t.fours);
  $("#detailsFives").html(t.fives);
  $("#detailsSixes").html(t.sixes);
  $("#detailsSubTotal").html(t.subTotal);
  $("#detailsBonus").html(t.bonus);
  $("#detailsOnePair").html(t.onePair);
  $("#detailsTwoPairs").html(t.twoPairs);
  $("#detailsThreeOfAKind").html(t.threeOfAKind);
  $("#detailsFourOfAKind").html(t.fourOfAKind);
  $("#detailsSmallStraight").html(t.smallStraight);
  $("#detailsLargeStraight").html(t.largeStraight);
  $("#detailsHouse").html(t.house);
  $("#detailsChance").html(t.chance);
  $("#detailsYatzy").html(t.yatzy);
  $("#detailsTotal").html(t.total);
  
  $("#detailsOnesV").html(scoreItem.details[0]);
  $("#detailsTwosV").html(scoreItem.details[1]);
  $("#detailsThreesV").html(scoreItem.details[2]);
  $("#detailsFoursV").html(scoreItem.details[3]);
  $("#detailsFivesV").html(scoreItem.details[4]);
  $("#detailsSixesV").html(scoreItem.details[5]);
  
  $("#detailsSubTotalV").html(subTotal);
  if (subTotal >= 63) {
    $("#detailsBonusV").html("50");
  }
  else {
    $("#detailsBonusV").html("0");
  }
  
  $("#detailsOnePairV").html(scoreItem.details[6]);
  $("#detailsTwoPairsV").html(scoreItem.details[7]);
  $("#detailsThreeOfAKindV").html(scoreItem.details[8]);
  $("#detailsFourOfAKindV").html(scoreItem.details[9]);
  $("#detailsSmallStraightV").html(scoreItem.details[10]);
  $("#detailsLargeStraightV").html(scoreItem.details[11]);
  $("#detailsHouseV").html(scoreItem.details[12]);
  $("#detailsChanceV").html(scoreItem.details[13]);
  $("#detailsYatzyV").html(scoreItem.details[14]);
  
  $("#detailsTotalV").html(scoreItem.points);
  
  $("#pointsDetails").modal();
  //alert("Score details = " + JSON.stringify(scoreItem.details));
}


//---------------------------------------------------------
// Finds out the points of the last item on the high score
// list. The value is kept in a global variable.
// Value 0 means that the high score list is not yet full.
//---------------------------------------------------------

function getLowestHighScore() {

  // Get the number from the server via an AJAX call
  $.get("/lowest/", function(data) {
    lowHighScore = Number(data);
  });  
}


//---------------------------------------------------
// Add an item to the high score list.
// Returns: true, if the item was added on the list
//          false, if the result was not high enough
//---------------------------------------------------

function addHighScoreItem(iName, iIsComputer, iPoints, iDetails) {
    
  var newScore = {
    name: iName,
    isComputer: iIsComputer,
    //date: today,
    points: iPoints,
    details: iDetails
  };

  // Add the result to the list on the server via an AJAX call
  $.post("/addnew/", newScore, function(result) {
  
    var respData = JSON.parse(result);
    var str;
    
    if ((respData.added == true) && (newScore.isComputer == false)) {
    
      // Congratulate the player about getting the result to the high score list
      if (highScoreNoteOn) {
        // If the modal dialog is already open, add a new line to the congrats message
        str = $("#congratsMessage").html();
        str += "<br><strong>&nbsp;&nbsp;-&nbsp;&nbsp;" + newScore.name + ", " + 
               newScore.points + " " + t.points + "</strong>";
        $("#congratsMessage").html(str);
      }
      else {
        // Create the congratulations dialog
        $("#congratsTitle").html(t.congratsTitle);
        str = t.congratsMessage;
        str += "<br><strong>&nbsp;&nbsp;-&nbsp;&nbsp;" + newScore.name + ", " +
               newScore.points + " " + t.points + "</strong>";
      
        $("#congratsMessage").html(str);
        $("#highScoreNote").modal('show');
        highScoreNoteOn = true;
      }
    }
  });
}
