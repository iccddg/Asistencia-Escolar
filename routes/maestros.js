var express = require('express');
var multer  = require('multer')
var upload = multer()
var router = express.Router();
var maestros = require('../api/maestros/gest_maestros')

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log('Entrada a la ruta /.get')
  res.redirect('/maestros/gest_maestros');
});
//Ruta para mostar todos los maestros
router.get('/gest_maestros', function(req, res, next) {
  console.log('Entrada a la ruta /gest_maestros.get')
  maestros.lis_maestros().then(
      resolve => {
        res.status(200);
        res.render('maestros/gest_maestros', { title: 'maestros',r:resolve.r });
  }).catch(err => {
      console.error(err);
      res.status(500).send(err);
  })
});
//Ruta para agregar maestro nuevo
router.post('/gest_maestros',upload.none(), function(req, res, next) {
  console.log('Entrada a la ruta /gest_maestros.post')
  var p = {nom_maestro:req.body.nom_maestro};
  maestros.new_maestro(p).then(
      resolve => {
        res.status(200);
        res.redirect('/maestros/gest_maestros')
  }).catch(err => {
      console.error(err);
      res.status(500).send(err);
  })
});
//middleware para todas las direcciones con id/edit, actualmente sin uso
router.param('id*', async (req, res,next) => {
    console.log('Entrada a la ruta: /gest_maestros/:id.param')
    try {

      next();
    }  catch (err) {
    // handle errors here
    }
})
//ruta para desplegar formulario de el maestro previo a editar
router.get('/gest_maestros/:id/edit', async (req, res,next) => {
  console.log('Entrada a la ruta /gest_maestros/id/edit.get')
  try {
    let p = {pkmaestro:req.params.id};
    const flags= await Promise.resolve(maestros.maestro(p));
    res.locals.pkmaestro = flags.r[0].pkmaestro;
    res.locals.nom_maestro = flags.r[0].nom_maestro;
    res.status(200);
    res.render('maestros/edit_maestro', { title: 'Editar maestro',r:res.locals });
  }  catch (err) {
  // handle errors here
  }
});
//rutas para el manejo de maestros individuales
router.route("/gest_maestros/:id",upload.none())
  .all(upload.none(),async (req, res,next) => {
    console.log('Entrada a la ruta: /gest_maestros/:id.all')
    try {
      let p = {pkmaestro:req.params.id,nom_maestro:req.body.nom_maestro};
      const flags= await Promise.resolve(maestros.maestro(p));
      res.locals.pkmaestro = flags.r[0].pkmaestro;
      //si llegamos desde la vista edit_maestro evitamos sobre escribir el nombre del maestro
      if(p.nom_maestro == undefined || p.nom_maestro == null)
        res.locals.nom_maestro = flags.r[0].nom_maestro;
      else{
        res.locals.nom_maestro = p.nom_maestro;
      }
      next();
    } catch (err) {
    // handle errors here
    }
  })
  .get(upload.none(),function(req,res,){
    console.log('Entrada a la ruta: /gest_maestros/:id.get')

  })
  .put(upload.none(),function(req,res,){
    console.log('Entrada a la ruta: /gest_maestros/:id.put')
    let p = {pkmaestro:res.locals.pkmaestro,nom_maestro:res.locals.nom_maestro};
    maestros.editar_maestro(p).then(
      resolve => {
        res.status(200);
        res.redirect('/maestros/gest_maestros')
  }).catch(err => {
      console.error(err);
      res.status(500).send(err);
  })
  })
  .delete(function(req,res,){
    console.log('Entrada a la ruta: /gest_maestros/:id.delete')
    let p = {pkmaestro:res.locals.pkmaestro};
    maestros.borrar_maestro(p).then(
        resolve => {
          res.status(200);
          res.redirect('/maestros/gest_maestros')
    }).catch(err => {
        console.error(err);
        res.status(500).send(err);
    })
  })
module.exports = router;