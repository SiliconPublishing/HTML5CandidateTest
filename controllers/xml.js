var express = require('express')
    , router = express.Router();

// This will serve any xml file requested from the root directory of the project
// In production environment, nothing should be served from the root folder
// either use /public or another designated sub-folder
router.get('/:name', function (req, res) {
    // res.sendFile will read the file and send it to the client along with
    // the appropriate Content-Type and Cache-Control headers
    // TODO: do we want the client to cache this?
    res.sendFile('/' + req.params.name + '.xml',
        {
            root: __dirname + '/..'
        }, function (err) {
            // In case of error, print it out to console and respond to client with error status
            if (err) {
                console.error(err);
                res.status(err.status).end();
            }
        });
});

module.exports = router;
