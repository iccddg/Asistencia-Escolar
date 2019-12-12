var express = require('express');
var multer  = require('multer')
var upload = multer()
var router = express.Router();
var submodulos = require('../api/submodulos/gest_submodulos')
var modulos = require('../api/modulos/gest_modulos')

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log('Entrada a la ruta /.get')
  res.redirect('/submodulos/gest_submodulos');
});
//Ruta para mostar todos los submodulos
router.get('/gest_submodulos', async (req, res, next) => {
  console.log('Entrada a la ruta /gest_submodulos.get')
  let mod = await Promise.resolve(modulos.lis_modulos())
  res.locals.mod = mod.r  
  submodulos.lis_submodulos().then(
      resolve => {
        res.status(200);
        res.render('submodulos/gest_submodulos', { title: 'submodulos',r:resolve.r,m:res.locals.mod });
      }).catch(err => {
      console.error(err);
      res.status(500).send(err);
    })
});
//Ruta para agregar submodulos nuevo
router.post('/gest_submodulos',upload.none(), function(req, res, next) {
  console.log('Entrada a la ruta /gest_submodulos.post')
  var p = {submodulo:req.body.submodulo,
          fkmodulo:req.body.pkmodulo};
  submodulos.new_submodulo(p).then(
      resolve => {
        res.status(200);
        res.redirect('/submodulos/gest_submodulos')
  }).catch(err => {
      console.error(err);
      res.status(500).send(err);
  })
});
//middleware para todas las direcciones con id/edit, actualmente sin uso
router.param('id*', async (req, res,next) => {
    console.log('Entrada a la ruta: /gest_submodulos/:id.param')
    try {

      next();
    }  catch (err) {
    // handle errors here
    }
})
//ruta para desplegar formulario de el submodulos previo a editar
router.get('/gest_submodulos/:id/edit', async (req, res,next) => {
  console.log('Entrada a la ruta /gest_submodulos/id/edit.get')
  try {
    let mod = await Promise.resolve(modulos.lis_modulos())
    res.locals.mod = mod.r
    let p = {pksubmodulo:req.params.id};
    const flags= await Promise.resolve(submodulos.submodulo(p));
    res.locals.resp = flags.r
    res.status(200);
    res.render('submodulos/edit_submodulo', { title: 'Editar submodulos',r:res.locals.resp,m:res.locals.mod });
  }  catch (err) {
  // handle errors here
  }
});
//rutas para el manejo de submodulos individuales
router.route("/gest_submodulos/:id",upload.none())
  .all(upload.none(),async (req, res,next) => {
    console.log('Entrada a la ruta: /gest_submodulos/:id.all')
      res.locals.pksubmodulo = req.params.id;
      res.locals.submodulo = req.body.submodulo; 
      res.locals.fkmodulo = req.body.pkmodulo;
      next();
  })
  .get(upload.none(),function(req,res,){
    console.log('Entrada a la ruta: /gest_submodulos/:id.get')

  })
  .put(upload.none(),function(req,res,){
    let p = {pksubmodulo:res.locals.pksubmodulo,
            submodulo:res.locals.submodulo,
            fkmodulo:res.locals.fkmodulo};
    submodulos.editar_submodulo(p).then(
      resolve => {
        res.status(200);
        res.redirect('/submodulos/gest_submodulos')
  }).catch(err => {
      console.error(err);
      res.status(500).send(err);
  })
  })
  .delete(function(req,res,){
    console.log('Entrada a la ruta: /gest_submodulos/:id.delete')
    let p = {pksubmodulo:res.locals.pksubmodulo};
    submodulos.borrar_submodulo(p).then(
        resolve => {
          res.status(200);
          res.redirect('/submodulos/gest_submodulos')
    }).catch(err => {
        console.error(err);
        res.status(500).send(err);
    })
  })
module.exports = router;