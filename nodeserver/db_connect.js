var express = require('express');
var app = express();



// config for your database
var config = {
    user: 'sa',
    password: 'yourStrong(!)Password',
    server: 'localhost', 
    database: 'grafana' ,
    options: {
        trustServerCertificate: true,   
      }
};


app.get('/', function (req, res) {
   


    // connect to your database
    sql.connect(config, function (err) {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records
        request.query('select * from DeclineTask', function (err, recordset) {
            
            if (err) console.log(err)

            // send records as a response
            res.send(recordset);
            
        });
    });
});

var server = app.listen(10000, function () {
    console.log('Server is running..');
});