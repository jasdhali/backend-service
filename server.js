// https://shouts.dev/build-restful-api-crud-in-nodejs-with-expressjs-and-mysql
var express = require('express');
//var app = express();
var router = express.Router()
var bodyParser = require('body-parser');
var mysql = require('mysql');

// connection configurations
var dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'easypower',
    password: 'easypower',
    database: 'easypowerdb'
});
  
// connect to database
dbConn.connect();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

// homepage route
/*router.get('/', function (req, res) {
    return res.send({ error: false, message: "Welcome to 'Build RESTful CRUD API in Node.js with Express.js and MySQL' Tutorial", 
    writen_by: "Md Obydullah", published_on: "https://shouts.dev" })
});*/

router.post('/', function (req, res) {

    let name = req.body.name;
    let author = req.body.author;
    
    // validation
    if (!name || !author)
        return res.status(400).send({ error:true, message: 'Please provide book name and author' });

    // insert to db
    dbConn.query("INSERT INTO books (name, author) VALUES (?, ?)", [name, author ], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'Book successfully added' });
    });
});

// retrieve all books 
router.get('/', function (req, res) {
    dbConn.query('SELECT * FROM books', function (error, results, fields) {
        if (error) throw error;

        // check has data or not
        let message = "";
        if (results === undefined || results.length == 0)
            message = "Books table is empty";
        else
            message = "Successfully retrived all books";

        return res.send({ error: false, data: results, message: message });
    });
});

 
module.exports = router;