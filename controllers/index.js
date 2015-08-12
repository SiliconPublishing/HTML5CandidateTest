var express = require('express')
    , router = express.Router();

// Include all the controllers
router.use('/api/xml', require('./xml'));

module.exports = router;