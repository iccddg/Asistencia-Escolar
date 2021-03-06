var express = require('express');
var multer  = require('multer')
var upload = multer()
var router = express.Router();
var materias = require('../api/materias/gest_materias')
var semestres = require('../api/semestres/gest_semestres')

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log('Entrada a la ruta /.get')
  res.redirect('/materias/gest_materias');
});
//Ruta para mostar todos los materias
router.get('/gest_materias', async (req, res, next) => {
  console.log('Entrada a la ruta /gest_materias.get')
  let sem = await Promise.resolve(semestres.lis_semestres())
  res.locals.sem = sem.r  
  materias.lis_materias().then(
      resolve => {
        res.status(200);
        res.render('materias/gest_materias', { title: 'materias',r:resolve.r,s:res.locals.sem });
      }).catch(err => {
      console.error(err);
      res.status(500).send(err);
    })
});
//Ruta para agregar materias nuevo
router.post('/gest_materias',upload.none(), function(req, res, next) {
  console.log('Entrada a la ruta /gest_materias.post')
  var p = {materia:req.body.materia,
          fksemestre:req.body.pksemestre};
  materias.new_materia(p).then(
      resolve => {
        res.status(200);
        res.redirect('/materias/gest_materias')
  }).catch(err => {
      console.error(err);
      res.status(500).send(err);
  })
});
//middleware para todas las direcciones con id/edit, actualmente sin uso
router.param('id*', async (req, res,next) => {
    console.log('Entrada a la ruta: /gest_materias/:id.param')
    try {

      next();
    }  catch (err) {
    // handle errors here
    }
})
//ruta para desplegar formulario de el materias previo a editar
router.get('/gest_materias/:id/edit', async (req, res,next) => {
  console.log('Entrada a la ruta /gest_materias/id/edit.get')
  try {
    let sem = await Promise.resolve(semestres.lis_semestres())
    res.locals.sem = sem.r  
    let p = {pkmateria:req.params.id};
    const flags= await Promise.resolve(materias.materia(p));
    res.locals.resp = flags.r
    res.status(200);
    res.render('materias/edit_materia', { title: 'Editar materias',r:res.locals.resp,s:res.locals.sem });
  }  catch (err) {
  // handle errors here
  }
});
//rutas para el manejo de materias individuales
router.route("/gest_materias/:id",upload.none())
  .all(upload.none(),async (req, res,next) => {
    console.log('Entrada a la ruta: /gest_materias/:id.all')
      res.locals.pkmateria = req.params.id;
      res.locals.materia = req.body.materia; 
      res.locals.fksemestre = req.body.pksemestre;
      next();
  })
  .get(upload.none(),function(req,res,){
    console.log('Entrada a la ruta: /gest_materias/:id.get')

  })
  .put(upload.none(),function(req,res,){
    let p = {pkmateria:res.locals.pkmateria,
            materia:res.locals.materia,
            fksemestre:res.locals.fksemestre};
    materias.editar_materia(p).then(
      resolve => {
        res.status(200);
        res.redirect('/materias/gest_materias')
  }).catch(err => {
      console.error(err);
      res.status(500).send(err);
  })
  })
  .delete(function(req,res,){
    console.log('Entrada a la ruta: /gest_materias/:id.delete')
    let p = {pkmateria:res.locals.pkmateria};
    materias.borrar_materia(p).then(
        resolve => {
          res.status(200);
          res.redirect('/materias/gest_materias')
    }).catch(err => {
        console.error(err);
        res.status(500).send(err);
    })
  })
module.exports = router;