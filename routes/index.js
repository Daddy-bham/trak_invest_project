var express = require('express');
var router = express.Router();
const Records = require('../models/records');
var amqp = require('amqplib/callback_api');


function postMessage(message) {
  amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = 'trak';
    var msg = message;

    channel.assertQueue(queue, {
      durable: false
    });

    channel.sendToQueue(queue, Buffer.from(msg));
    console.log(" [x] Sent %s", msg);
  });
});

}

/* GET home page. */
router.get('/getRecord/:id', function(req, res, next) {
  if(req.params.id){
    Records.findById(req.params.id).then((record) => {
      res.status(200);
      res.send({
        name : record.name,
        email: record.email
      });
    }).catch((err) => {
      console.log(err);
      res.status(400);
      res.send({
        error : err
      })
    })
  }
});

router.post('/setRecord', function(req, res, next) {
  const {name,email} = req.body;
  console.log(req.body)
  const record = new Records({
    name: name,
    email: email
  });
  record.save().then((record) => {
    console.log("Record is created : ", record)
    res.status(200);
    postMessage(record._id.toString());
    res.send({
      id : record._id
    })
  }).catch((err) => {
    console.log(err);
    res.status(400);
    res.send({
      error : err
    })
  })
});

module.exports = router;
