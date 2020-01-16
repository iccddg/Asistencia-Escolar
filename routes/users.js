var express = require('express');
var multer  = require('multer')
var upload = multer()
var router = express.Router();
var semestres = require('../api/semestres/gest_semestres')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
module.exports = router;