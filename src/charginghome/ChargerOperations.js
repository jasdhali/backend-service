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

// retrieve chargerLocations by name
router.get('/:name', function (req, res) {
  
    let id = req.params.name;
  
    if (!id) {
        return res.status(400).send({ error: true, message: 'Please provide profile id' });
    }
  
    dbConn.query('SELECT * FROM chargerLocation where name = ?', id, function (error, results, fields) {
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