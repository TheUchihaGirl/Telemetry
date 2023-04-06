const express = require('express');
const app = express();
const port = 10000;
var cors = require('cors');
app.use(cors());
app.use(express.json());
var sql = require("mssql");

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

app.post('/telemetry/button', (req, res) => {
    let buttonName = req.body['buttonName'];
    let user = req.body['userName'];
    console.log(buttonName, user);
    sql.connect(config, (err)=>{
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
        var query = "";
        // query to the database and get the records
        var selectQuery = "select click_count from FeatureDetails where userName = '"+user+"' and featureName = '"+ buttonName+"'";
        console.log(selectQuery);
        request.query(selectQuery, function (err, recordset) {
            if(err) console.log(err);
            //console.log(recordset);
            if(recordset.rowsAffected == 0){
                query = "Insert into FeatureDetails values ('" + user +"', '" + buttonName + "', 1 )"; 
            }else{
                let click_count = recordset.recordset[0].click_count;
                query = "Update FeatureDetails set click_count = "+ (click_count+1) +" where userName = '"+user+"' and featureName = '"+ buttonName+"'";
            }
        request.query(query,(err,recordset)=>{
            if(err) console.log(err);
            // else console.log(recordset);
        });        
        });
    });
    res.send("OK");

  });

app.post('/telemetry/component',(req,res)=>{
    let componentName = req.body["component"];
    let username = req.body["userName"]
    let duration = req.body["duration"];

    sql.connect(config, (err)=>{
        var request = new sql.Request();
        request.query(`Insert into FeatureDuration values ('${username}','${componentName}','${duration}`,(err, recordset)=>{
            if(err) console.log(err);
            else{
                console.log(recordset);
            }
        })
    })
});

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  });