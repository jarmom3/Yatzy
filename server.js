/**************************************************
   Yatzy game, node.js server part by Jarmo Mäkelä
   server.js   (server functionality)
   Version 1.0, 2016-04-17
***************************************************/


// Database has one table: Score
// - name       : TEXT, player name
// - isComputer : INTEGER (1 if true, 0 if false)
// - points     : INTEGER
// - timeMs     : INTEGER (time in milliseconds since 1.1.1970)
// - details    : TEXT (points details array in JSON format)


// Common modules
var express = require("express");
var bodyParser = require("body-parser");
var fs = require("fs");

// Global variables
var app = express();
var HS_LIST_MAX = 15;   // Max number of items that are displayed from the high score list

// Add the express middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Provide the index.html file for the browser
app.use(express.static(__dirname + "/public"));


// Check if the database already exists. If not, create it.
var file = "yatzy.db";
var dbExists = fs.existsSync(file);

if (dbExists == false) {
  console.log("Create Yatzy database.");
  fs.openSync(file, "w");
}

// Read the database
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(file);

// Create the table if it doesn't exist yet
var str1 = "CREATE TABLE if not exists Score ";
var str2 = "(name TEXT, isComputer INTEGER, points INTEGER, timeMs INTEGER, details TEXT)";
db.run(str1 + str2);


app.listen(8080);
console.log("Yatzy server running on port 8080.");


//--------------------------------------------------------
// Provide the lowest high score list value (as a string)
// Returns "0" if the high score list is empty.
//--------------------------------------------------------
app.get("/lowest/", function (req, res) {
     
  var lowest = 0;
  var selStr = "SELECT points FROM Score ORDER BY points DESC LIMIT " + HS_LIST_MAX;
  
  db.all(selStr, function(err, row) {
    if (row.length < HS_LIST_MAX) {
      lowest = 0;
    }
    else {
      lowest = row[row.length - 1].points;
    }
    res.end(lowest.toString());
  });
});


//--------------------------------------------------------------------
// Add a new item to the high score list.
// 'added' field in returned item shows if the item was really added.
// req.body fields:
// - name: String
// - isComputer: Boolean (was the player a computer or a human)
// - points: Number
// - details: Array (target specific points results in an array)
//--------------------------------------------------------------------
app.post("/addnew/", function (req, res) {

  var returnValue = {
    message: "",
    added: true
  };
  var lowest = 0;

  // Check the current lowest score on the list
  var selStr = "SELECT points FROM Score ORDER BY points DESC LIMIT " + HS_LIST_MAX;
  
  db.all(selStr, function(err, row) {
    // If the list is full and the new score is not higher than the score
    // of the current last item, no addition is done
    if (row.length == HS_LIST_MAX) {
      lowest = row[row.length - 1].points;
      if (req.body.points <= lowest) {
        returnValue.added = false;
        res.send(JSON.stringify(returnValue));
      }
    }
    
    if (returnValue.added) {
      // Define the INSERT command
      var str1 = "INSERT INTO Score";
      var str2 = "(name, isComputer, points, timeMs, details) VALUES (?,?,?,?,?)";
  
      // Current time in milliseconds after 1.1.1970
      var timeAndDate = new Date();
      var timeMs = timeAndDate.getTime();
  
      // Points target information is stored in JSON format
      var details = JSON.stringify(req.body.details);
      
      var isComputer;
      if (req.body.isComputer == "true") {
        isComputer = 1;
      }
      else {
        isComputer = 0;
      }
  
      // Put the new score into the database
      var stmt = db.prepare(str1 + str2);
      stmt.run(req.body.name, isComputer, req.body.points, timeMs, details);
      stmt.finalize();
      console.log("New score added");
      
      // Delete the extra (too low) scores from the database
      str1 = "DELETE FROM Score WHERE points < " + lowest;
      var stmt2 = db.prepare(str1);
      stmt2.run();
      
      res.send(JSON.stringify(returnValue));
    }
  });
});


//----------------------------------------------
// Provide the high score list as a JSON string
//----------------------------------------------
app.get("/highscores/", function (req, res) {

  var dbItem = {
    name: "",
    isComputer: false,
    points: 0,
    timeMs: 0,
    details: ""
  };
  
  var outStr = "[";   // The list in JSON format is built into this variable 
  var first = true;   // Comma is put before each array item except the first one
  var dbItemStr = "";
  
  var selStr1 = "SELECT name, isComputer, points, timeMs, details FROM Score";
  var selStr2 = " ORDER BY points DESC, timeMs LIMIT " + HS_LIST_MAX;
  
  db.each(selStr1 + selStr2, function(err, row) {   // Row callback function
      dbItem.name = row.name;
      if (row.isComputer == 1) {
        dbItem.isComputer = true;
      }
      else {
        dbItem.isComputer = false;
      }
      dbItem.points = row.points;
      dbItem.timeMs = row.timeMs;
      dbItem.details = JSON.parse(row.details);
      
      if (first) {
        first = false;
      }
      else {
        outStr += ",";
      }
      dbItemStr = JSON.stringify(dbItem);
      outStr += dbItemStr;
    },
    function(err) {   // Completion callback function
       // Finalize the JSON string
       outStr += "]";
       res.send(outStr);
    }
  );
});
