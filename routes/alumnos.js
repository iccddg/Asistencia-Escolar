var express = require('express');
var multer  = require('multer')
var upload = multer()
var router = express.Router();
var alumnos = require('../api/alumnos/gest_alumnos')
var semestres = require('../api/semestres/gest_semestres')
var grupos = require('../api/grupos/gest_grupos')

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log('Entrada a la ruta /.get')
  res.redirect('/alumnos/gest_alumnos');
});
//Ruta para mostar todos los alumnos
router.get('/gest_alumnos', async (req, res, next) => {
  console.log('Entrada a la ruta /gest_alumnos.get')
  let sem = await Promise.resolve(semestres.lis_semestres())
  res.locals.sem = sem.r
  let grp = await Promise.resolve(grupos.lis_grupos())
  res.locals.gpr = grp.r  
  alumnos.lis_alumnos().then(
      resolve => {
        res.status(200);
        res.render('alumnos/gest_alumnos', { title: 'alumnos',r:resolve.r,s:res.locals.sem,g:res.locals.gpr });
      }).catch(err => {
      console.error(err);
      res.status(500).send(err);
    })
});
//Ruta para agregar alumno nuevo
router.post('/gest_alumnos',upload.none(), function(req, res, next) {
  console.log('Entrada a la ruta /gest_alumnos.post')
  var p = {nom_alumno:req.body.nom_alumno,
          n_control:req.body.n_control,
          fksemestre:req.body.pksemestre,
          fkgrupo:req.body.pkgrupo};
  alumnos.new_alumno(p).then(
      resolve => {
        res.status(200);
        res.redirect('/alumnos/gest_alumnos')
  }).catch(err => {
      console.error(err);
      res.status(500).send(err);
  })
});
//middleware para todas las direcciones con id/edit, actualmente sin uso
router.param('id*', async (req, res,next) => {
    console.log('Entrada a la ruta: /gest_alumnos/:id.param')
    try {

      next();
    }  catch (err) {
    // handle errors here
    }
})
//ruta para desplegar formulario de el alumno previo a editar
router.get('/gest_alumnos/:id/edit', async (req, res,next) => {
  console.log('Entrada a la ruta /gest_alumnos/id/edit.get')
  try {
    console.log('Entrada a la ruta: /gest_alumnos/:id.put')
    let sem = await Promise.resolve(semestres.lis_semestres())
    res.locals.sem = sem.r
    let grp = await Promise.resolve(grupos.lis_grupos())
    res.locals.gpr = grp.r 
    let p = {pkalumno:req.params.id};
    const flags= await Promise.resolve(alumnos.alumno(p));
    res.locals.resp = flags.r
    res.status(200);
    res.render('alumnos/edit_alumno', { title: 'Editar alumno',r:res.locals.resp,s:res.locals.sem,g:res.locals.gpr });
  }  catch (err) {
  // handle errors here
  }
});
//rutas para el manejo de alumnos individuales
router.route("/gest_alumnos/:id",upload.none())
  .all(upload.none(),async (req, res,next) => {
    console.log('Entrada a la ruta: /gest_alumnos/:id.all')
      res.locals.pkalumno = req.params.id;
      res.locals.nom_alumno = req.body.nom_alumno; 
      res.locals.n_control = req.body.n_control;
      res.locals.fksemestre = req.body.pksemestre;
      res.locals.fkgrupo = req.body.pkgrupo;
      next();
  })
  .get(upload.none(),function(req,res,){
    console.log('Entrada a la ruta: /gest_alumnos/:id.get')

  })
  .put(upload.none(),function(req,res,){
    let p = {pkalumno:res.locals.pkalumno,
            nom_alumno:res.locals.nom_alumno,
            n_control:res.locals.n_control,
            fksemestre:res.locals.fksemestre,
            fkgrupo:res.locals.fkgrupo};
    alumnos.editar_alumno(p).then(
      resolve => {
        res.status(200);
        res.redirect('/alumnos/gest_alumnos')
  }).catch(err => {
      console.error(err);
      res.status(500).send(err);
  })
  })
  .delete(function(req,res,){
    console.log('Entrada a la ruta: /gest_alumnos/:id.delete')
    console.log(res.locals);
    let p = {pkalumno:res.locals.pkalumno};
    alumnos.borrar_alumno(p).then(
        resolve => {
          res.status(200);
          res.redirect('/alumnos/gest_alumnos')
    }).catch(err => {
        console.error(err);
        res.status(500).send(err);
    })
  })
module.exports = router;