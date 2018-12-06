
const express = require("express");
const bodyParser = require("body-parser");

const restService = express();

///////////////////////////////////////////
var mysql = require('mysql');
var turn= '' ;
var room = '';
var str1 = 'UPDATE home SET room = ';
var str3 = ' WHERE turn= ';   
var db_config = {                    ////////  MySQL connection Information 
  host     : 'us-cdbr-iron-east-01.cleardb.net',
  user     : 'b0cb1ef1838d5e',
  password : 'a26fe726',
  database : 'heroku_9e5a751b12d72df'
};


/////////////////////////////////////////////////////////////////  Connection Protocol for MySQL

var connection;

function handleDisconnect() {
    console.log('1. connecting to db:');
    connection = mysql.createConnection(db_config); // Recreate the connection, since
													// the old one cannot be reused.

    connection.connect(function(err) {              	// The server is either down
        if (err) {                                     // or restarting (takes a while sometimes).
            console.log('2. error when connecting to db:', err);
            setTimeout(handleDisconnect, 1000); // We introduce a delay before attempting to reconnect,
        }                                     	// to avoid a hot loop, and to allow our node script to
    });                                     	// process asynchronous requests in the meantime.
    											// If you're also serving http, display a 503 error.
    connection.on('error', function(err) {
        console.log('3. db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { 	// Connection to the MySQL server is usually
            handleDisconnect();                      	// lost due to either server restart, or a
        } else {                                      	// connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}

handleDisconnect();


//////////////////////////////////////////////////////////////
restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);

restService.use(bodyParser.json());

restService.post("/echo", function(req, res) {
  
 
	room=
	req.body.queryResult&&
    req.body.queryResult.parameters &&
    req.body.queryResult.parameters.room 
      ? req.body.queryResult.parameters.room 
      : "whcih room?";
	
	
	turn=
	req.body.queryResult&&
    req.body.queryResult.parameters &&
    req.body.queryResult.parameters.turn
      ?req.body.queryResult.parameters.turn
      : "Do you want it to turn on or off?";
	
	
	
	
	var f_data = str1.concat(room, str3, turn);
	connection.query(f_data  , function(err, rows, fields) {
        if (err) {
            console.log('error: ', err);
            throw err;
        }
    });
var speech = "The".concat(room, "is truned", turn);
	
  return res.json({
   // speech: speech,
    //displayText: speech,
    fulfillmentText: f_data,
    source: "webhook-echo-sample"
  });
});


restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});
