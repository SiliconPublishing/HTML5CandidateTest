var express = require('express'),
    bodyParser = require('body-parser'),
    parseXML = require('xml2js').parseString,
    fs = require('fs'),
    app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(express.static('public'));
app.res = {};

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

app.get('/manifest', function(req, res, next) {
    app.res = res;

    fs.readFile("data/manifest.xml", readFileCallback);
});

app.get('/layout', function(req, res) {
    app.res = res;

    fs.readFile("data/layout_1.xml", readFileCallback);
});

app.listen(3000);


function readFileCallback(err, data) {
    if (err) {
        app.res.status(500).send(err);
        throw err;
    }
    parseXML(data, xmlParseCB);
}

function xmlParseCB(err, data) {
    if (err) throw err;

    sendResponse(data, 200);
}

function sendResponse(data, status) {
    app.res.status(status).send(data);
}


