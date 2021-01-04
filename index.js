const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'user01',
    password: 'pass01',
    database: 'SensorsDB',
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err) {
        console.log('DB connection succeded.');
    }
    else {
        console.log('DB connection failed. Error: ' + JSON.stringify(err, undefined, 2));
    }
});

app.listen(3000, () => console.log('Express server is running at port number 3000.'));

// Get all sensors:
app.get('/sensors', (req, res) => {
    mysqlConnection.query('SELECT * FROM Sensors', (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        }
        else {
            console.log(err);
        }
    });
});

// Get a sensor:
app.get('/sensors/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM Sensors WHERE SensorId = ?', [req.params.id], (err, rows, fields) => {
        if (!err) {
            res.send(rows);
        }
        else {
            console.log(err);
        }
    });
});

// Delete a sensor:
app.delete('/sensors/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM Sensors WHERE SensorId = ?', [req.params.id], (err, rows, fields) => {
        if (!err) {
            res.send('Deleted successfully.');
        }
        else {
            console.log(err);
        }
    });
});

// Insert a sensor:
app.post('/sensors/:id', (req, res) => {
    let snz = req.body;
    var sql = 'INSERT INTO Sensors VALUES (?, ?, ?); CALL sp_SensorAddOrEdit(@Id, @Name, @Description);'
    mysqlConnection.query(sql, [snz.id, snz.name, snz.description], (err, rows, fields) => {
        if (!err) {
            rows.forEach(element => {
                if (element.constructor == Array)
                res.send('Inserted sensor id: ' + element[0].id);
            });
        }
        else {
            console.log(err);
        }
    });
});

// Update a sensor:
app.put('/sensors/:id', (req, res) => {
    let snz = req.body;
    var sql = 'INSERT INTO Sensors VALUES (?, ?, ?); CALL sp_SensorAddOrEdit(@Id, @Name, @Description);'
    mysqlConnection.query(sql, [snz.id, snz.name, snz.description], (err, rows, fields) => {
        if (!err) {
            res.send('Updated successfully.');
        }
        else {
            console.log(err);
        }
    });
});