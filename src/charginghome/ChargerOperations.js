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
  
    let chgName = req.params.name;
  
    if (!chgName) {
        return res.status(400).send({ error: true, message: 'Please provide profile id' });
    }
  
    dbConn.query('SELECT * FROM charger where name = ?', chgName, function (error, results, fields) {
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


// retrieve chargerLocations by name
router.get('/chargerTarrifs', function (req, res) {
  
    dbConn.query('SELECT '+
        ' ch.Name, ' +
    ' ch.status, ' +
    ' GROUP_CONCAT( ' +
    ' DISTINCT tP.name ' +
    '     ORDER BY cT.tarrifId) tarrifs ' +
    '  FROM ' +
    ' charger ch ' +
    ' INNER JOIN chargerTarrifs AS cT ' +
    ' ON cT.chargerId = ch.id ' +
    ' INNER JOIN tarrifPlans AS tP ' +
    ' ON tP.id = cT.tarrifId ' +
    ' GROUP BY ch.id ' +
    ' ORDER BY ch.name , ch.status', function (error, results, fields) {
        if (error) throw error;

        // check has data or not
        let message = "";
        if (results === undefined || results.length == 0)
            message = "Charger tarrif data not found";
        else
            message = "Successfully retrived profile data";

        return res.send({ error: false, data: results, message: message });
    });
});

/**
 * New charging history instance 
 */
 
/**
 * New charging history instance 
 */
router.post('/chargingHistory', function (req, res) {

    const chargerId = req.body.chargerId;
    const userId = req.body.userId;
    const carId = req.body.carId;
    const started = req.body.startedAt;
    const finished = req.body.finishedAt;
    const chargingMode = req.body.chargingMode;
    const startedDtParsed = Date.parse(started);
    
    // validation
    if (!chargerId || !userId)
        return res.status(400).send({ error:true, message: 'Please provide charging historydata' });

    // insert to db
    dbConn.query("INSERT INTO chargingHistory(userId, carId,startedAt,finishedAt,planUsed,chargerId,isActive) VALUES (?, ?, STR_TO_DATE(?,'%b %d, %Y %h:%i:%s %p'), ?, ?,?,?)", 
    [userId, carId, started,null, chargingMode, chargerId, 1], function (error, results, fields) {
        if (error) throw error;
        var successresult = "{}";
        return res.send({ error: false, data: results, message: 'Charging history added successfully' });
    });
});
/** 
 * 
*/
router.post('/fetchcharger', function (req, res) {

    const chargerId = req.body.lati;
    const userId = req.body.longi;
    const carId = req.body.within;
    
    // Fetch chargers
    dbConn.query('SELECT * FROM charger', function (error, results, fields) {
        if (error) throw error;

        // check has data or not
        let message = "";
        if (results === undefined || results.length == 0)
            message = "No charger found";
        else
            message = "Successfully retrived all chargers";

        return res.send({ error: false, data: results, message: message });
    });
});

router.post('/fetch', function (req, res) {

    const chargerId = req.body.lati;
    const userId = req.body.longi;
    const carId = req.body.within;
    
    // Fetch chargers
    dbConn.query('SELECT * FROM charger', function (error, results, fields) {
        if (error) throw error;

        // check has data or not
        let message = "";
        if (results === undefined || results.length == 0)
            message = "No charger found";
        else
            message = "Successfully retrived all chargers";

        return res.send({ error: false, data: results, message: message });
    });
});

router.put('/chargingHistory', function (req, res) {

    let finished = req.body.finishedAt;
    let historyId = req.body.historyId;
    var mydate = new Date(finished);
    
    // validation
    if (!finished || !historyId)
        return res.status(400).send({ error:true, message: 'Please provide charging historydata' });

    // insert to db
    dbConn.query("UPDATE chargingHistory SET finishedAt = ? WHERE id = ?", 
    [mydate, historyId], function (error, results, fields) {
        if (error) throw error;
        var successresult = "{}";
        return res.send({ error: false, data: results, message: 'Charging history updated successfully' });
    });
});
module.exports = router;