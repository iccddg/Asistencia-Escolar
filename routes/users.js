var express = require('express');
var multer  = require('multer')
var upload = multer()
var router = express.Router();
var semestres = require('../api/semestres/gest_semestres')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/gest_semestres', function(req, res, next) {
  semestres.lis_semestres().then(
      resolve => {
        res.status(200);
        res.render('semestres/gest_semestres', { title: 'Semestres',r:resolve.r });
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
router.param('id', function (req, res, next, id) {
  console.log('CALLED ONLY ONCE')
  next()
})
router.route("/gest_semestres/:id",upload.none())
  .all(function (req, res, next) {
    
    next()
  }) 
  .delete(function(req,res,){
    var p = {pksemestre:req.params.id};
    console.log(p);
    semestres.borrar_semestre(p).then(
        resolve => {
          res.status(200);
          //res.render('users/gest_semestres', { title: 'Express',r:resolve.r });
          res.redirect('/users/gest_semestres')
    }).catch(err => {
        console.error(err);
        res.status(500).send(err);
    })
  })
module.exports = router;