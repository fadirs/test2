var express = require("express");
var server = require('http').createServer(app);
var mysql = require('mysql');
var app = express();
app.use(express.logger());
var str1 = 'UPDATE home SET room = "'
var str2 = 'TV'; 
var str3 = '" WHERE ID = "2"'
var data_f = str1.concat(str2, str3);
///var data_f = 'UPDATE home SET room ='+ new_data +' WHERE ID = "2"';
var db_config = {
  host     : 'us-cdbr-iron-east-01.cleardb.net',
  user     : 'b0cb1ef1838d5e',
  password : 'a26fe726',
  database : 'heroku_9e5a751b12d72df'
};

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

app.get('/', function(request, response) {
    connection.query(data_f , function(err, rows, fields) {
        if (err) {
            console.log('error: ', err);
            throw err;
        }
        response.send(['Hello World!!!! fadi!!!!', rows]);
    });
});


var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Listening on " + port);
});
