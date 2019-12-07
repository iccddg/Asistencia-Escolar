var express = require('express');
var multer  = require('multer')
var upload = multer()
var router = express.Router();
var semestres = require('../api/semestres/gest_semestres')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect('/semestres/gest_semestres');
});
//Ruta para mostar todos los semestres
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
//Ruta para agregar semestre nuevo
router.post('/gest_semestres',upload.none(), function(req, res, next) {
  console.log('Entrada a la ruta /gest_semestres.post')
  var p = {semestre:req.body.semestre};
  semestres.new_semestre(p).then(
      resolve => {
        res.status(200);
        res.redirect('/users/gest_semestres')
  }).catch(err => {
      console.error(err);
      res.status(500).send(err);
  })
});
//middleware para todas las direcciones con id, actualmente sin uso
router.param('id', async (req, res,next) => {
    console.log('Entrada a la ruta: /gest_semestres/:id.param')
    try {
      next()
    }  catch (err) {
    // handle errors here
    }
})
//rutas para el manejo de semestres individuales
router.route("/gest_semestres/:id",upload.none())
  .all(async (req, res,next) => {
    console.log('Entrada a la ruta: /gest_semestres/:id.all')
    try {
      let p = {pksemestre:req.params.id};
      const flags= await Promise.resolve(semestres.semestre(p));
      res.locals.pksemestre = flags.r[0].pksemestre;
      res.locals.semestre = flags.r[0].semestre;
      next();
    }  catch (err) {
    // handle errors here
    }
  })
  .delete(function(req,res,){
    console.log('Entrada a la ruta: /gest_semestres/:id.delete')
    let p = {pksemestre:res.locals.pksemestre};
    console.log(p);
    semestres.borrar_semestre(p).then(
        resolve => {
          res.status(200);
          res.redirect('/users/gest_semestres')
    }).catch(err => {
        console.error(err);
        res.status(500).send(err);
    })
  })
module.exports = router;