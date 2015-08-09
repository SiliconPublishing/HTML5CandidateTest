var express = require('express'),
    bodyParser = require('body-parser'),
    parseXML = require('xml2js').parseString,
    fs = require('fs'),
    app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(express.static('public'));

app.use(function(req, res, next) {
    var oneof = false;
    if(req.headers.origin) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
        oneof = true;
    }
    if(req.headers['access-control-request-method']) {
        res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
        oneof = true;
    }
    if(req.headers['access-control-request-headers']) {
        res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
        oneof = true;
    }
    if(oneof) {
        res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
    }

    // intercept OPTIONS method
    if (oneof && req.method == 'OPTIONS') {
        res.send(200);
    }
    else {
        next();
    }
});

app.get('/manifest', function(req, res) {
    fs.readFile("data/manifest.xml", function(err, data) {
        readFileCallback(err, data, res);
    });
});

app.get('/layouts/:filename', function(req, res) {
    fs.readFile("data/" + req.params.filename, function(err, data) {
        readFileCallback(err, data, res);
    });
});

app.listen(3000);

function readFileCallback(err, data, res) {
    if (err) {
        res.status(404).send("Error: resource does not exist.");
        return;
    }
    xmlParser(data, res);
}

function xmlParser(data, res) {
    function cb(err, data) {
        if (err) {
            res.status(500).send("Error transforming resource to json");
            return;
        }

        sendResponse(data, 200, res);
    }

    parseXML(data, cb);
}

function sendResponse(data, status, res) {
    res.status(status).send(data);
}
