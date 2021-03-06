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

// retrieve all books 
router.get('/', function (req, res) {
    dbConn.query('SELECT * FROM profile', function (error, results, fields) {
        if (error) throw error;

        // check has data or not
        let message = "";
        if (results === undefined || results.length == 0)
            message = "Profile table is empty";
        else
            message = "Successfully retrived all profiles";

        //return res.send({ error: false, data: results, message: message });
        return res.send({ error: false, data: results, message: message }); 
    });
});

// add a new book  
router.post('/', function (req, res) {

    let fname = req.body.firstName;
    let lname = req.body.lastName;
    let emailId = req.body.emailId;
    let userName = req.body.userName;
    let password = req.body.password;
    
    // validation
    if (!fname || !lname)
        return res.status(400).send({ error:true, message: 'Please provide first name and last name' });
    else if (!emailId)
        return res.status(400).send({ error:true, message: 'Please provide a valid emailId' });
    else if (!userName)
        return res.status(400).send({ error:true, message: 'Please provide a valid emailId' });
    else if (!password)
        return res.status(400).send({ error:true, message: 'Please provide a valid password' });        
    //Validate
    /*dbConn.query('SELECT * FROM profile where emailId = ? ', [id,id], function (error, results, fields) {
        if (error) throw error;

        // check has data or not
        let message = "";
        if (results === undefined || results.length == 0)
            message = "Profile not found";
        else
            message = "Successfully retrived profile data";

        return res.send({ error: false, data: results[0], message: message });
    });*/
    // insert to db
    dbConn.query("INSERT INTO profile (emailId,firstName,middleName,lastName,userName,phoneNo,password) VALUES (?,?,'singh',?,?,'0000000001',?)", 
    [emailId,fname, lname,userName, password ], function (error, results, fields) {
        if (error) {
            throw error;
        }
        return res.send({ error: false, data: results, message: 'profile successfully created' });
    });
});

/** API to update phone number */
router.put('/', function (req, res) {

    let phoneNo = req.body.phoneNo;
    let profileId = req.body.profileId;
    
    // validation
    if (!phoneNo )
        return res.status(400).send({ error:true, message: 'Please provide valid cell no to update' });

    // insert to db
    dbConn.query("UPDATE profile SET phoneNo = ? WHERE id = ?", 
    [phoneNo, profileId], function (error, results, fields) {
        if (error) throw error;
        var successresult = "{}";
        return res.send({ error: false, message: 'Profile updated successfully' });
    });
});

// retrieve profile by id 
router.get('/userid/:id', function (req, res) {
  
    let id = req.params.id;
  
    if (!id) {
        return res.status(400).send({ error: true, message: 'Please provide profile id' });
    }
  
    dbConn.query('SELECT * FROM profile where (emailId = ? OR id = ?)', [id,id], function (error, results, fields) {
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

// retrieve user profile by userName and password 
router.get('/username/:userId/:passphrase', function (req, res) {
  
    let id = req.params.userId;
    let passphrase = req.params.passphrase;
  
    if (!id) {
        return res.status(400).send({ error: true, message: 'Please provide userName' });
    }
    if (!passphrase) {
        return res.status(400).send({ error: true, message: 'Please provide valid passphrase' });
    }
    const search_val = mysql.raw("'"+id+"'")
    const pwd_val = mysql.raw("'"+passphrase+"'")

    dbConn.query('SELECT * FROM profile where (userName = ? or emailId =?) and password = ? ' , [search_val,search_val, pwd_val], function (error, results, fields) {
        if (error) throw error;

        // check has data or not
        let message = "";
        if (results === undefined || results.length == 0)
            message = "Userid or password wrong";
        else
            message = "Successfully retrived user data";

        return res.send({ error: false, data: results[0], message: message });
    });
});

// retrieve user profile by userName and password 
router.get('/username/:userId', function (req, res) {
  
    let id = req.params.userId;
  
    if (!id) {
        return res.status(400).send({ error: true, message: 'Please provide userName' });
    }
    const search_val = mysql.raw("'"+id+"'")

    console.log( search_val );
    dbConn.query('SELECT * FROM profile where (userName = ? or emailId =?) ' , [search_val,search_val ], function (error, results, fields) {
        if (error) throw error;

        // check has data or not
        let message = "";
        if (results === undefined || results.length == 0)
            message = "No data found";
        else
            message = "Successfully retrived user data";

        return res.send({ error: false, data: results[0], message: message });
    });
});

 
module.exports = router;