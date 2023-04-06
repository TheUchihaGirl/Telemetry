const mongo = require('mongoose');

const express = require('express');
const app = express();
const port = 10000;
var cors = require('cors');
app.use(express.json())
// const bodyParser = require('body-parser');
// app.use(bodyParser);

const client = require('prom-client');
const register = new client.Registry();
// // Add a default label which is added to all metrics
register.setDefaultLabels({
  app: 'example-nodejs-app'
})
//Create a count & histogram metric
const counter = new client.Counter({
  name: 'http_request_count',
  help: 'Counts get calls to default http endpoint',
});
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in microseconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});
const featureDeclineTaskHist = new client.Counter({
  name: 'http_feature_decline_task_hist',
  help: 'Histogram of decline task',
  labelNames:['user']
  //buckets: client.linearBuckets(1,1,20)
});


//Regiater the metrics
register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(counter);
register.registerMetric(featureDeclineTaskHist);


const end = httpRequestDurationMicroseconds.startTimer();
app.use(cors());

app.get('/', (req, res) => {
  counter.inc(); // Increment by 1
  end({ method: "/", code: res.statusCode, method: req.method});
  res.send('Hello World!');

});
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  end({
    method: "/metrics",
    code: res.statusCode,
    method: req.method
  });
  res.end(await register.metrics());
});
app.post('/telemetry/button', (req, res) => {
  //console.log(req);
  let buttonName = req.body['buttonName'];
  let user = req.body['userName'];

  // console.log("Name : " + user + "| Button : " + buttonName);
  // if (store[user] == null) {
  //   store[user] = {"buttonName":buttonName, "click_count":1}
  // }else{
  //   store[user].click_count +=1;
  // }
  featureDeclineTaskHist.inc({user})
  // console.log(store);
  // res.send("Hello");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

var store = {}
