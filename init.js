/************************************************
   Yatzy game, Bootstrap version by Jarmo Mäkelä
   init.js   (Common initialization functions)
   Version 1.0, 2016-02-26
*************************************************/


//------------------------------------------------------------
// Initialization functions to be run when the page is loaded
//------------------------------------------------------------

function onloadInit() {
  $(document).ready(function() {
    
    createDices();
    
    // t is a global variable containing all UI texts in the selected language 
    t = textsFi;
    initDisplayTexts();
    infoText.emptyText(1);   // To create space for the info text area
    
    setDefaultValues();
    
    setOnClickFunctions();
    
    createPlayers();
    
    askPlayerInfo();
    
    // Get the current lowest points on high score list and set to a global variable
    getLowestHighScore();
  });
}


//--------------------------------
// Set default values for dialogs
//--------------------------------

function setDefaultValues() {
  document.getElementById("p1RadioName").checked = true;
  document.getElementById("p2RadioName").checked = true;
}


//------------------------------------------------------------
// Bind functions with the mouse clicks on the HTML elements.
// 'Onclick' event attributes in HTLM are not used because
// that would not work in Cordova.
//------------------------------------------------------------

function setOnClickFunctions() {

  // Navigation bar actions
  $("#navGame").on("click", function() { showGame(); });
  $("#navHighScore").on("click", function() { showHighScore(); });
  $("#navEnglish").on("click", function() { switchToEnglish(); });
  $("#navFinnish").on("click", function() { switchToFinnish(); });
  $("#navSwedish").on("click", function() { switchToSwedish(); });
  $("#navNewGame").on("click", function() { askPlayerInfo(); });
      
  // Player info modal dialog OK  
  $("#playerInfoOk").on("click", function() { updatePlayerInfo(); } );
  
  // High score note dialog close button
  $("#highScoreNoteClose").on("click", function() { highScoreNoteOn = false; } );

  // Throw dice buttons
  $("#p1GameButton").on("click", function() { roll(1, false); });
  $("#p2GameButton").on("click", function() { roll(2, false); });
    
  // Dice icons (lock / unlock toggle)
  $("#p1DiceResult1").on("click", function() { lockDice(1, 1, false); });
  $("#p1DiceResult2").on("click", function() { lockDice(2, 1, false); });
  $("#p1DiceResult3").on("click", function() { lockDice(3, 1, false); });
  $("#p1DiceResult4").on("click", function() { lockDice(4, 1, false); });
  $("#p1DiceResult5").on("click", function() { lockDice(5, 1, false); });
  $("#p2DiceResult1").on("click", function() { lockDice(1, 2, false); });
  $("#p2DiceResult2").on("click", function() { lockDice(2, 2, false); });
  $("#p2DiceResult3").on("click", function() { lockDice(3, 2, false); });
  $("#p2DiceResult4").on("click", function() { lockDice(4, 2, false); });
  $("#p2DiceResult5").on("click", function() { lockDice(5, 2, false); });
  
  // Add click handlers for the points labels.
  // For loop with 'let' keyword instead of 'var' would work in Firefox and Chrome
  // but not in Safari and in Cordova Android application. So, the loop 1..2
  // is written here "open".
  var i1 = 1;
  $(".p" + i1 + ".lOnes").on("click", function() { setPlayerPoints(i1, P1); });
  $(".p" + i1 + ".lTwos").on("click", function() { setPlayerPoints(i1, P2); });
  $(".p" + i1 + ".lThrees").on("click", function() { setPlayerPoints(i1, P3); });
  $(".p" + i1 + ".lFours").on("click", function() { setPlayerPoints(i1, P4); });
  $(".p" + i1 + ".lFives").on("click", function() { setPlayerPoints(i1, P5); });
  $(".p" + i1 + ".lSixes").on("click", function() { setPlayerPoints(i1, P6); });
  $(".p" + i1 + ".lOnePair").on("click", function() { setPlayerPoints(i1, P7); });
  $(".p" + i1 + ".lTwoPairs").on("click", function() { setPlayerPoints(i1, P8); });
  $(".p" + i1 + ".lThreeOfAKind").on("click", function() { setPlayerPoints(i1, P9); });
  $(".p" + i1 + ".lFourOfAKind").on("click", function() { setPlayerPoints(i1, P10); });
  $(".p" + i1 + ".lSmallStraight").on("click", function() { setPlayerPoints(i1, P11); });
  $(".p" + i1 + ".lLargeStraight").on("click", function() { setPlayerPoints(i1, P12); });
  $(".p" + i1 + ".lHouse").on("click", function() { setPlayerPoints(i1, P13); });
  $(".p" + i1 + ".lChance").on("click", function() { setPlayerPoints(i1, P14); });
  $(".p" + i1 + ".lYatzy").on("click", function() { setPlayerPoints(i1, P15); });

  var i2 = 2;
  $(".p" + i2 + ".lOnes").on("click", function() { setPlayerPoints(i2, P1); });
  $(".p" + i2 + ".lTwos").on("click", function() { setPlayerPoints(i2, P2); });
  $(".p" + i2 + ".lThrees").on("click", function() { setPlayerPoints(i2, P3); });
  $(".p" + i2 + ".lFours").on("click", function() { setPlayerPoints(i2, P4); });
  $(".p" + i2 + ".lFives").on("click", function() { setPlayerPoints(i2, P5); });
  $(".p" + i2 + ".lSixes").on("click", function() { setPlayerPoints(i2, P6); });
  $(".p" + i2 + ".lOnePair").on("click", function() { setPlayerPoints(i2, P7); });
  $(".p" + i2 + ".lTwoPairs").on("click", function() { setPlayerPoints(i2, P8); });
  $(".p" + i2 + ".lThreeOfAKind").on("click", function() { setPlayerPoints(i2, P9); });
  $(".p" + i2 + ".lFourOfAKind").on("click", function() { setPlayerPoints(i2, P10); });
  $(".p" + i2 + ".lSmallStraight").on("click", function() { setPlayerPoints(i2, P11); });
  $(".p" + i2 + ".lLargeStraight").on("click", function() { setPlayerPoints(i2, P12); });
  $(".p" + i2 + ".lHouse").on("click", function() { setPlayerPoints(i2, P13); });
  $(".p" + i2 + ".lChance").on("click", function() { setPlayerPoints(i2, P14); });
  $(".p" + i2 + ".lYatzy").on("click", function() { setPlayerPoints(i2, P15); });
}


//--------------------------
// Initialize display texts
//--------------------------

function initDisplayTexts() {

  // Points selection labels and (if a computer player), player names
  for (var i = 1; i <= MAX_PLAYERS; i++) {
    $(".p" + i + ".lOnes").html(t.ones);
    $(".p" + i + ".lTwos").html(t.twos);
    $(".p" + i + ".lThrees").html(t.threes);
    $(".p" + i + ".lFours").html(t.fours);
    $(".p" + i + ".lFives").html(t.fives);
    $(".p" + i + ".lSixes").html(t.sixes);
    $(".p" + i + ".lSubTotal").html(t.subTotal);
    $(".p" + i + ".lBonus").html(t.bonus);
    $(".p" + i + ".lOnePair").html(t.onePair);
    $(".p" + i + ".lTwoPairs").html(t.twoPairs);
    $(".p" + i + ".lThreeOfAKind").html(t.threeOfAKind);
    $(".p" + i + ".lFourOfAKind").html(t.fourOfAKind);
    $(".p" + i + ".lSmallStraight").html(t.smallStraight);
    $(".p" + i + ".lLargeStraight").html(t.largeStraight);
    $(".p" + i + ".lHouse").html(t.house);
    $(".p" + i + ".lChance").html(t.chance);
    $(".p" + i + ".lYatzy").html(t.yatzy);
    $(".p" + i + ".lTotal").html(t.total);
    
    // Do the change only if the players have been already created
    if (players.length > 0) {
      if (players[i - 1].isComputer) {
        $("#player" + (i) + "Name").html("(" + t.computer + ")");
      }
    }
  }
  
  // Navbar texts
  $("#tGame").text(t.game);
  $("#tHighScore").text(t.highScore);
  $("#tNewGame").text(t.newGame);
  
  // Game button texts
  $("#p1GameButton").html(t.rollDices);
  $("#p2GameButton").html(t.rollDices);
  
  // Player information dialog texts
  $("#playerInfo").html(t.playerInfo);
  $("#playerNbr1").html(t.player + " 1");
  $("#playerNbr2").html(t.player + " 2");
  $("label[for=p1RadioName]").html(t.name);
  $("label[for=p2RadioName]").html(t.name);
  $("label[for=p1RadioComputer]").html(t.computer);
  $("label[for=p2RadioComputer]").html(t.computer);
  $("label[for=p2RadioNone]").html(t.noOtherPlayer);
  
  // High score view texts
  $("#hsTitle").html(t.hsTitle);
  $("#hsPosition").html(t.hsPosition);
  $("#hsName").html(t.hsName);
  $("#hsScore").html(t.hsScore);
  $("#hsDate").html(t.hsDate);
  $("#pointsDetailsTitle").html(t.hsDetails);
}
