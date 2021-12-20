var express = require('express');
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

// retrieve all payments 
router.get('/', function (req, res) {
    dbConn.query('SELECT * FROM account_balance', function (error, results, fields) {
        if (error) throw error;

        // check has data or not
        let message = "";
        if (results === undefined || results.length == 0)
            message = "Profile table is empty";
        else
            message = "Successfully retrived all profiles";

        //return res.send({ error: false, data: results, message: message });
        return res.send({ results });
    });
});

// add a new book  
router.post('/', function (req, res) {

    let fname = req.body.firstName;
    let lname = req.body.lastName;
    
    // validation
    if (!fname || !lname)
        return res.status(400).send({ error:true, message: 'Please provide first name and last name' });

    // insert to db
    dbConn.query("INSERT INTO account_balance (first_name,last_name,phone_no) VALUES (?, ?,'713.517.7075')", [fname, lname ], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'profile successfully created' });
    });
});

// retrieve balance by id 
router.get('/:id', function (req, res) {
  
    let id = req.params.id;
  
    if (!id) {
        return res.status(400).send({ error: true, message: 'Please provide profile id' });
    }
  
    dbConn.query('SELECT * FROM account_balance where user_id = ?', id, function (error, results, fields) {
        if (error) throw error;

        // check has data or not
        let message = "";
        if (results === undefined || results.length == 0)
            message = "Profile not found";
        else
            message = "Successfully retrived profile data";

        return res.send({ error: false, data: results[0], message: message });
    });
});
 
module.exports = router;