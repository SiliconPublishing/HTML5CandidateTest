// Module dependencies
var express = require('express');

// Initialize Express
var app = express();

// Set up the port to listen on
app.set('port', 8080);

// Configure the routes
app.use(express.static(__dirname + '/public')); // Route for public resources: images/css/js
app.use(require('./controllers'));

// Start the listen server
app.listen(app.get('port'), function () {
    console.log('Server has been started on port ' + app.get('port'));
});