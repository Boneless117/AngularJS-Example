/*
 | Set the requirements for the server
 | Needs:
 |  - SQL
 |  - Express
 |  - Parser
*/
var http        = require("http");
var express     = require('express');
var app         = express();
var mysql       = require('mysql');
var bodyParser  = require('body-parser');

/*
 | Set the MySQL connection settings
 | This server uses a personal MySQL host
*/

var host        = "127.0.0.1"; // Local address
var user        = "root";
var password    = "";
var database    = "db";

var connection = mysql.createConnection({
    host     : host,
    user     : user,
    password : password,
    database : database
});

/*
 | Attempt to connect to MySQL server
*/
connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected to the DB!");
});

/*
 | Set App settings
*/
app.use(express.static("./"));
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

/*
 | Start server settings
*/
var server = app.listen(3000, "127.0.0.1", function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Example app listening at http://%s:%s", host, port)
});

/*
 | RESTful API's
*/

/*
 | GET
*/
// Serve the basic html page
app.get("/", function(req, res) {
    res.sendFile("./index.html"); //index.html file of your angularjs application
});

// Get all posts
app.get('/news/get', function (req, res) {
    connection.query('select * from posts', function (error, results, fields) {
       if (error) throw error;
       // Console.log the results... just for checking the data...
       console.log(results);
       res.end(JSON.stringify(results));
     });
 });


/*
 | POST
*/
// Create a new posts
app.post('/news/create', function (req, res) {
    var params  = req.body;
    connection.query("INSERT INTO posts SET ?", params, function (error, result){
        if(error) throw error;
        console.log(error);
        console.log(result);
        res.end(JSON.stringify(result));
    });
 });