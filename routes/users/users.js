var express = require('express');
var multer  = require('multer')
var upload = multer()
var router = express.Router();
var semestres = require('./gest_semestres')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/gest_semestres', function(req, res, next) {
  semestres.lis_semestres().then(
      resolve => {
        res.status(200);
        res.render('users/gest_semestres', { title: 'Express',r:resolve.r });
  }).catch(err => {
      console.error(err);
      res.status(500).send(err);
  })
});
router.post('/gest_semestres',upload.none(), function(req, res, next) {
  var p = {semestre:req.body.semestre};
  console.log(p);
  semestres.new_semestre(p).then(
      resolve => {
        res.status(200);
        //res.render('users/gest_semestres', { title: 'Express',r:resolve.r });
        res.redirect('/users/gest_semestres')
  }).catch(err => {
      console.error(err);
      res.status(500).send(err);
  })
});

module.exports = router;