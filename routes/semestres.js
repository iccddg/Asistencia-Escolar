var express = require('express');
var multer  = require('multer')
var upload = multer()
var router = express.Router();
var semestres = require('../api/semestres/gest_semestres')

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log('Entrada a la ruta /.get')
  res.redirect('/semestres/gest_semestres');
});


//Ruta para mostar todos los semestres
router.get('/gest_semestres', function(req, res, next) {
  console.log('Entrada a la ruta /gest_semestres.get')
  semestres.lis_semestres().then(
      resolve => {
        res.status(200);
        res.render('semestres/gest_semestres', { title: 'Semestres',r:resolve.r });
  }).catch(err => {
      console.error(err);
      res.status(500).send(err);
  })
});


//Ruta para agregar semestre nuevo
router.post('/gest_semestres',upload.none(), function(req, res, next) {
  console.log('Entrada a la ruta /gest_semestres.post')
  var p = {semestre:req.body.semestre};
  semestres.new_semestre(p).then(
      resolve => {
        res.status(200);
        res.redirect('/semestres/gest_semestres')
  }).catch(err => {
      console.error(err);
      res.status(500).send(err);
  })
});


//middleware para todas las direcciones con id, actualmente sin uso
router.param('id', function(req, res, next) {
  console.log('Entrada a la ruta: /gest_semestres/:id.param')
  next();
})


//rutas para el manejo de semestres individuales
router.route("/gest_semestres/:id",upload.none())
  .all(function(req,res,next){
    console.log('Entrada a la ruta: /gest_semestres/:id.all')
    let p = {pksemestre:req.params.id};
    semestres.semestre(p).then(
      resolve => {
      res.locals.pksemestre = resolve.r[0].pksemestre;
      res.locals.semestre = resolve.r[0].semestre;
      next();
    }).catch(err => {
      console.error(err);
      res.status(500).send(err);
    })
  })
  .delete(function(req,res,){
    console.log('Entrada a la ruta: /gest_semestres/:id.delete')
    let p = {pksemestre:res.locals.pksemestre};
    semestres.borrar_semestre(p).then(
        resolve => {
          res.status(200);
          res.redirect('/semestres/gest_semestres')
    }).catch(err => {
        console.error(err);
        res.status(500).send(err);
    })
  })
module.exports = router;