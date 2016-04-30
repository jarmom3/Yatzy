/************************************************
   Yatzy game, Bootstrap version by Jarmo Mäkelä
   common.js   (Constants and global variables)
   Version 1.0, 2016-03-24
*************************************************/


// Constants
var MAX_PLAYERS = 2;      // The code currently does not support more than 2 players
var NBR_OF_DICES = 5;     // Number of dices
var NBR_OF_ROUNDS = 15;   // Number of rounds in one game
var HS_LIST_MAX = 15;     // Maximum number of items in the high score list
var POINTS_DELAY = 1500;      // Milliseconds, delay in computer player actions
var HIGHLIGHT_DELAY = 1200;   // Milliseconds, delay in highlighting the points selection
var ROLL_DELAY = 1500;        // Milliseconds, delay in rerolling the dices

// Points targets
var P1 = "Ones";
var P2 = "Twos";
var P3 = "Threes";
var P4 = "Fours";
var P5 = "Fives";
var P6 = "Sixes";
var P7 = "OnePair";
var P8 = "TwoPairs";
var P9 = "ThreeOfAKind";
var P10 = "FourOfAKind";
var P11 = "SmallStraight";
var P12 = "LargeStraight";
var P13 = "House";
var P14 = "Chance";
var P15 = "Yatzy";


// Global variables
var t;   // Contains all the user interface texts
var dicesNotRolled;    // True if the dice values are currently undefined
var round;    // Game has 15 rounds. The first round is 0. The game finishes when round is 15.
var repeat;   // Value between 0 - 2.  After the initial roll the user can repeat the roll twice.
var pNbr;     // 1 or 2, according to which player is currently active
var lowHighScore = 0;   // The smallest points number in the current High Score list
var highScoreNoteOn = false;   // Is the dialog about new high score results on display
