
const express = require("express");
const bodyParser = require("body-parser");

const restService = express();

///////////////////////////////////////////
var mysql = require('mysql');
var speech = '"fadishahroury"' ;
var str1 = 'UPDATE home SET room = ';
var str3 = ' WHERE ID = "2"';
var f_data = str1.concat(speech, str3);
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
   speech =
    req.body.queryResult&&
    req.body.queryResult.parameters &&
    req.body.queryResult.parameters.echoText.amount
      ? req.body.queryResult.parameters.echoText.amount
      : "Seems like some problem. Speak again and ask fadi.";
	var f_data = str1.concat(speech, str3);
	connection.query(f_data  , function(err, rows, fields) {
        if (err) {
            console.log('error: ', err);
            throw err;
        }
    });
	
	
	
  return res.json({
   // speech: speech,
    //displayText: speech,
    fulfillmentText: speech,
    source: "webhook-echo-sample"
  });
});


restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});
