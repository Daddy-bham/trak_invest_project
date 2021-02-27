var express = require('express');
var router = express.Router();
const Records = require('../models/records');
var rabbitmq = new RabbitMQ('amqp://localhost');

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
    rabbitmq.publish('trak', {message: record._id});
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
