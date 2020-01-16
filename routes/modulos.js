var express = require('express');
var multer  = require('multer')
var upload = multer()
var router = express.Router();
var modulos = require('../api/modulos/gest_modulos')
var semestres = require('../api/semestres/gest_semestres')
var carreras = require('../api/carreras/gest_carreras')

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log('Entrada a la ruta /.get')
  res.redirect('/modulos/gest_modulos');
});
//Ruta para mostar todos los modulos
router.get('/gest_modulos', async (req, res, next) => {
  console.log('Entrada a la ruta /gest_modulos.get')
  let sem = await Promise.resolve(semestres.lis_semestres())
  res.locals.sem = sem.r
  let carr = await Promise.resolve(carreras.lis_carreras())
  res.locals.gpr = carr.r  
  modulos.lis_modulos().then(
      resolve => {
        res.status(200);
        res.render('modulos/gest_modulos', { title: 'modulos',r:resolve.r,s:res.locals.sem,c:res.locals.gpr });
      }).catch(err => {
      console.error(err);
      res.status(500).send(err);
    })
});
//Ruta para agregar modulo nuevo
router.post('/gest_modulos',upload.none(), function(req, res, next) {
  console.log('Entrada a la ruta /gest_modulos.post')
  var p = {modulo:req.body.modulo,
          fksemestre:req.body.pksemestre,
          fkcarrera:req.body.pkcarrera};
  modulos.new_modulo(p).then(
      resolve => {
        res.status(200);
        res.redirect('/modulos/gest_modulos')
  }).catch(err => {
      console.error(err);
      res.status(500).send(err);
  })
});
//middleware para todas las direcciones con id/edit, actualmente sin uso
router.param('id*', async (req, res,next) => {
    console.log('Entrada a la ruta: /gest_modulos/:id.param')
    try {

      next();
    }  catch (err) {
    // handle errors here
    }
})
//ruta para desplegar formulario de el modulo previo a editar
router.get('/gest_modulos/:id/edit', async (req, res,next) => {
  console.log('Entrada a la ruta /gest_modulos/id/edit.get')
  try {
    let sem = await Promise.resolve(semestres.lis_semestres())
    res.locals.sem = sem.r
    let carr = await Promise.resolve(carreras.lis_carreras())
    res.locals.carr = carr.r
    let p = {pkmodulo:req.params.id};
    const flags= await Promise.resolve(modulos.modulo(p));
    res.locals.resp = flags.r
    res.status(200);
    res.render('modulos/edit_modulo', { title: 'Editar modulo',r:res.locals.resp,s:res.locals.sem,c:res.locals.carr });
  }  catch (err) {
  // handle errors here
  }
});
//rutas para el manejo de modulos individuales
router.route("/gest_modulos/:id",upload.none())
  .all(upload.none(),async (req, res,next) => {
    console.log('Entrada a la ruta: /gest_modulos/:id.all')
      res.locals.pkmodulo = req.params.id;
      res.locals.modulo = req.body.modulo; 
      res.locals.fksemestre = req.body.pksemestre;
      res.locals.fkcarrera = req.body.pkcarrera;
      next();
  })
  .get(upload.none(),function(req,res,){
    console.log('Entrada a la ruta: /gest_modulos/:id.get')

  })
  .put(upload.none(),function(req,res,){
    let p = {pkmodulo:res.locals.pkmodulo,
            modulo:res.locals.modulo,
            fksemestre:res.locals.fksemestre,
            fkcarrera:res.locals.fkcarrera};
    modulos.editar_modulo(p).then(
      resolve => {
        res.status(200);
        res.redirect('/modulos/gest_modulos')
  }).catch(err => {
      console.error(err);
      res.status(500).send(err);
  })
  })
  .delete(function(req,res,){
    console.log('Entrada a la ruta: /gest_modulos/:id.delete')
    let p = {pkmodulo:res.locals.pkmodulo};
    modulos.borrar_modulo(p).then(
        resolve => {
          res.status(200);
          res.redirect('/modulos/gest_modulos')
    }).catch(err => {
        console.error(err);
        res.status(500).send(err);
    })
  })
module.exports = router;