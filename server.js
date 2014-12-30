var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');

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
    console.log('GET reviews');
    Reviews.find(function (err, reviews) {
        if (err)
            res.send(err)
        res.json(reviews);

    });
});

// Find one review
app.get('/:review_id', function (req, res) {
    Reviews.find({
            _id: req.params.review_id
        },
        function (err, review) {
            if (err)
                res.send(err)
            res.json(review);
        });
});


// post new review
app.post('/', function (req, res) {
    console.log('POST' + ' ' +JSON.stringify(req.body))
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
    console.log('Delete' + ' ' +  req.params.review_id)
    Reviews.remove({
        _id: req.params.review_id
    }, function (err, review) {
        if (err)
            res.send(err);
    });
});

// delete a guest
app.delete('/api/wedding/:guest_id', function (req, res) {
    Guests.remove({
        _id: req.params.guest_id
    }, function (err, guest) {
        if (err)
            res.send(err);

        // get and return all the guests after you create another
        Guests.find(function (err, guests) {
            if (err)
                res.send(err)
            res.json(guests);
        });
    });
});


app.post('/sendmail', function (req, res) {
    console.log('POST' + JSON.stringify(req.body))
// create reusable transporter object using SMTP transport
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'patricktuin78@gmail.com',
            pass: 'vriendin17'
        }
    });

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols
    var mailOptions = {
        from: req.body.name + '<' + req.body.address + '>', // sender address
        to: 'patricktuin78@gmail.com', // list of receivers
        subject: req.body.subject, // Subject line
        text: req.body.body // plaintext body
        //html: '<b>Hello world ✔</b>' // html body
    };

// send mail with defined transport object
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Message sent: ' + info.response);
        }
    });

});

// create webserver
var server = app.listen(3000, function () {

    var host = server.address().address
    var port = server.address().port

    console.log('hotelbieze api listening at http://%s:%s', host, port)

})