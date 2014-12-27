var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


// connect to mongodb
mongoose.connect('mongodb://localhost/hotelbieze-dev');

// Add headers
app.use(function (req, res, next) {
// Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
// Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
// Request headers you wish to allow
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
// Set to true if you need the website to include cookies in the requests sent
// to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
// Pass to next layer of middleware
    next();
});

app.use(bodyParser.json());

// define model for reviews  =================
var Reviews = mongoose.model('hotelreviews', {
    stars: {type: Number, required: true},
    body: String,
    author: String
});

// get all reviews
app.get('/', function (req, res) {
    Reviews.find(function (err, reviews) {
        if (err)
            res.send(err)
        res.json(reviews);

    });
});

  // Find one review
  app.get('/:review_id', function(req, res) {
      Reviews.find({
        _id : req.params.review_id
      },
        function(err, review) {
        if (err)
          res.send(err)
        res.json(review);
    });
  });



// post new review
app.post('/', function (req, res) {
    console.log('POST' + JSON.stringify(req.body))
    Reviews.create({
        stars: req.body.stars,
        body: req.body.body,
        author: req.body.author
    }, function (err, review) {
        if (err)
            res.send(err);
    });
    res.send("review");

});

// delete review
app.delete('/:review_id', function (req, res) {
    Reviews.remove({
        _id: req.params.review_id
    }, function (err, review) {
        if (err)
            res.send(err);

        
            Reviews.find(function (err, reviews) {
        if (err)
            res.send(err)
        res.json(reviews);

    });
});
});

  // delete a guest
  app.delete('/api/wedding/:guest_id', function(req, res) {
    Guests.remove({
      _id : req.params.guest_id
    }, function(err, guest) {
      if (err)
        res.send(err);

      // get and return all the guests after you create another
      Guests.find(function(err, guests) {
        if (err)
          res.send(err)
        res.json(guests);
      });
    });
  });

// create webserver
var server = app.listen(3000, function () {

    var host = server.address().address
    var port = server.address().port

    console.log('hotelbieze api listening at http://%s:%s', host, port)

})