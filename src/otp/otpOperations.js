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


router.post('/contact-us', function(req, res, next) {
    var f_name = req.body.f_name;
    var l_name = req.body.l_name;
    var email = req.body.email;
    var message = req.body.message;
   
    var sql = `INSERT INTO contacts (f_name, l_name, email, message, created_at) VALUES ("${f_name}", "${l_name}", "${email}", "${message}", NOW())`;
    db.query(sql, function(err, result) {
      if (err) throw err;
      console.log('record inserted');
      req.flash('success', 'Data added successfully!');
      res.redirect('/');
    });
  });

// Receives a phone num and generates a new OTP for phone and returns details.
router.get('/otpInstance/:phoneNum', function (req, res) {
  
    let phone = req.params.phoneNum;

  
    if (!phone) {
        return res.status(400).send({ error: true, message: 'Please provide valid phone no' });
    }
    var sql = `INSERT INTO CreatedOTPs (OTPId, CountryCode, PhoneNo, GeneratedTime, ExpiryTime) VALUES ('4444','91',"${phone}", NOW(),NOW())`;
    dbConn.query(sql, function(err, result) {
      if (err) throw err;
      console.log('record inserted');
      //req.flash('success', 'Data added successfully!');
      // res.redirect('/');
    });
    dbConn.query('SELECT * FROM CreatedOTPs where PhoneNo = ?', phone, function (error, results, fields) {
        if (error) throw error;

        // check has data or not
        let message = "";
        if (results === undefined || results.length == 0)
            message = "OTP Date not found";
        else
            message = "Successfully retrived OTP data for phone.";

        return res.send({ error: false, data: results[0], message: message });
    });
});

router.post('/otpInstance', function (req, res) {
  
    let phone = req.body.phoneNum;
    var otp = req.body.otp;
    var userId = req.body.userId;

  
    if (!phone || !otp || !userId) {
        return res.status(400).send({ error: true, message: 'Please provide valid data (phone,OTP,userId)'});
    }
    var sql = `INSERT INTO CreatedOTPs (OTPId, CountryCode, PhoneNo, GeneratedTime, ExpiryTime,userId) VALUES ("${otp}",'91',"${phone}", NOW(),NOW()+1,"${userId}")`;
    dbConn.query(sql, function(err, result) {
      if (err) throw err;
      console.log('record inserted');
      //req.flash('success', 'Data added successfully!');
      // res.redirect('/');
    });
    dbConn.query('SELECT * FROM CreatedOTPs where PhoneNo = ?', phone, function (error, results, fields) {
        if (error) throw error;

        // check has data or not
        let message = "";
        if (results === undefined || results.length == 0)
            message = "OTP Date not found";
        else
            message = "Successfully retrived OTP data for phone.";

        return res.send({ error: false, data: results[0], message: message });
    });
});


 
module.exports = router;