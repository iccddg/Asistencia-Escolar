var express = require('express');
var multer  = require('multer');
var upload = multer();
var router = express.Router();
var grupos = require('../api/grupos/gest_grupos')

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log('Entrada a la ruta /.get')
  res.redirect('/grupos/gest_grupos');
});
//Ruta para mostar todos los grupos
router.get('/gest_grupos', function(req, res, next) {
  console.log('Entrada a la ruta /gest_grupos.get')
  grupos.lis_grupos().then(
      resolve => {
        res.status(200);
        res.render('grupos/gest_grupos', { title: 'Grupos',r:resolve.r });
  }).catch(err => {
      console.error(err);
      res.status(500).send(err);
  })
});
//Ruta para agregar grupo nuevo
router.post('/gest_grupos',upload.none(), function(req, res, next) {
  console.log('Entrada a la ruta /gest_grupos.post')
  var p = {grupo:req.body.grupo};
  grupos.new_grupo(p).then(
      resolve => {
        res.status(200);
        res.redirect('/grupos/gest_grupos')
  }).catch(err => {
      console.error(err);
      res.status(500).send(err);
  })
});
//middleware para todas las direcciones con id, actualmente sin uso
router.param('id', function(req, res, next) {
    console.log('Entrada a la ruta: /gest_grupos/:id.param')
    next();
})
//rutas para el manejo de semestres individuales
router.route("/gest_grupos/:id",upload.none())
  .all(function(req,res,next){
    console.log('Entrada a la ruta: /gest_grupos/:id.all')
    let p = {pkgrupo:req.params.id};
    grupos.grupo(p).then(
      resolve => {
      res.locals.pkgrupo = resolve.r[0].pkgrupo;
      res.locals.grupo = resolve.r[0].grupo;
      next();
    }).catch(err => {
      console.error(err);
      res.status(500).send(err);
    })
  })
  .delete(function(req,res,){
    console.log('Entrada a la ruta: /gest_grupos/:id.delete')
    let p = {pkgrupo:res.locals.pkgrupo};
    grupos.borrar_grupo(p).then(
        resolve => {
          res.status(200);
          res.redirect('/grupos/gest_grupos')
    }).catch(err => {
        console.error(err);
        res.status(500).send(err);
    })
  })
module.exports = router;