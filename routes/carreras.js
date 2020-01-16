var express = require('express');
var multer  = require('multer')
var upload = multer()
var router = express.Router();
var carreras = require('../api/carreras/gest_carreras')

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log('Entrada a la ruta /.get')
  res.redirect('/carreras/gest_carreras');
});
//Ruta para mostar todas las carreras
router.get('/gest_carreras', function(req, res, next) {
  console.log('Entrada a la ruta /gest_carreras.get')
  carreras.lis_carreras().then(
      resolve => {
        res.status(200);
        res.render('carreras/gest_carreras', { title: 'carreras',r:resolve.r });
  }).catch(err => {
      console.error(err);
      res.status(500).send(err);
  })
});
//Ruta para agregar carrera nueva
router.post('/gest_carreras',upload.none(), function(req, res, next) {
  console.log('Entrada a la ruta /gest_carreras.post')
  var p = {carrera:req.body.carrera};
  carreras.new_carrera(p).then(
      resolve => {
        res.status(200);
        res.redirect('/carreras/gest_carreras')
  }).catch(err => {
      console.error(err);
      res.status(500).send(err);
  })
});
//middleware para todas las direcciones con id/edit, actualmente sin uso
router.param('id', async (req, res,next) => {
    console.log('Entrada a la ruta: /gest_carreras/:id.param')
    try {

      next();
    }  catch (err) {
    // handle errors here
    }
})
//ruta para desplegar formulario de la carrera previo a editarla
router.get('/gest_carreras/:id/edit', async (req, res,next) => {
  console.log('Entrada a la ruta /gest_carreras/id/edit.get')
  try {
    let p = {pkcarrera:req.params.id};
    const flags= await Promise.resolve(carreras.carrera(p));
    res.locals.pkcarrera = flags.r[0].pkcarrera;
    res.locals.carrera = flags.r[0].carrera;
    res.status(200);
    res.render('carreras/edit_carrera', { title: 'Editar carrera',r:res.locals });
  }  catch (err) {
  // handle errors here
  }
});
//rutas para el manejo de semestres individuales
router.route("/gest_carreras/:id",upload.none())
  .all(upload.none(),async (req, res,next) => {
    console.log('Entrada a la ruta: /gest_carreras/:id.all')
    try {
      let p = {pkcarrera:req.params.id,carrera:req.body.carrera};
      const flags= await Promise.resolve(carreras.carrera(p));
      res.locals.pkcarrera = flags.r[0].pkcarrera;
      //si llegamos desde la vista edit_carrera evitamos sobre escribir el nombre de la carrera
      if(p.carrera == undefined || p.carrera == null)
        res.locals.carrera = flags.r[0].carrera;
      else{
        res.locals.carrera = p.carrera;
      }
      next();
    }  catch (err) {
    // handle errors here
    }
  })
  .get(upload.none(),function(req,res,){
    console.log('Entrada a la ruta: /gest_carreras/:id.get')

  })
  .put(upload.none(),function(req,res,){
    console.log('Entrada a la ruta: /gest_carreras/:id.put')
    let p = {pkcarrera:res.locals.pkcarrera,carrera:res.locals.carrera};
    carreras.editar_carrera(p).then(
      resolve => {
        res.status(200);
        res.redirect('/carreras/gest_carreras')
  }).catch(err => {
      console.error(err);
      res.status(500).send(err);
  })
  })
  .delete(function(req,res,){
    console.log('Entrada a la ruta: /gest_carreras/:id.delete')
    let p = {pkcarrera:res.locals.pkcarrera};
    carreras.borrar_carrera(p).then(
        resolve => {
          res.status(200);
          res.redirect('/carreras/gest_carreras')
    }).catch(err => {
        console.error(err);
        res.status(500).send(err);
    })
  })
module.exports = router;