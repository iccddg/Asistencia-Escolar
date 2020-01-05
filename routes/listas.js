var express = require('express');
var multer  = require('multer')
var upload = multer()
var router = express.Router();
var listas = require('../api/listas/gest_listas')
var semestres = require('../api/semestres/gest_semestres')
var grupos = require('../api/grupos/gest_grupos')
var materias = require('../api/materias/gest_materias')
var maestros = require('../api/maestros/gest_maestros')

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log('Entrada a la ruta /.get')
  res.redirect('/listas/gest_listas');
});
//Ruta para mostar todas las listas
router.get('/gest_listas', async (req, res, next) => {
  console.log('Entrada a la ruta /gest_listas.get')
  /*let sem = await Promise.resolve(semestres.lis_semestres())
  res.locals.sem = sem.r*/  
  listas.lis_listas().then(
      resolve => {
        res.status(200);
        res.render('listas/gest_listas', { title: 'listas',r:resolve.r,/*s:res.locals.sem*/ });
      }).catch(err => {
      console.error(err);
      res.status(500).send(err);
    })
});
//Ruta para mostrar el formulario para crear una lista nueva
router.get('/crear_lista', async (req, res, next) => {
  console.log('Entrada a la ruta /gest_listas.get')
  let sem = await Promise.resolve(semestres.lis_semestres())
  res.locals.sem = sem.r  
  let grp = await Promise.resolve(grupos.lis_grupos())
  res.locals.grp = grp.r
  let mat = await Promise.resolve(materias.lis_materias())
  res.locals.mat = mat.r
  let ma = await Promise.resolve(maestros.lis_maestros())
  res.locals.ma = ma.r   
  res.status(200);
  res.render('listas/crear_lista', { title: 'Crear Lista',s:res.locals.sem,g:res.locals.grp,mat:res.locals.mat,ma:res.locals.ma/*s:res.locals.sem*/ });
});
//Ruta para mostrar el formulario para registrar asistencias
router.get('/registro/:id', async (req, res, next) => {
  console.log('Entrada a la ruta /registro/id.get')
  let p = {pklista : req.params.id}
  let lis = await Promise.resolve(listas.lista(p))
  p = lis.r[0];
  res.locals.lis = lis.r[0];
  p={pksemestre: p.fksemestre,pkgrupo: p.fkgrupo,pkmateria: p.fkmateria,pkmaestro: p.fkmaestro}
  let sem = await Promise.resolve(semestres.semestre(p))  
  let grp = await Promise.resolve(grupos.grupo(p))
  let mat = await Promise.resolve(materias.materia(p))
  let ma = await Promise.resolve(maestros.maestro(p))
  semestre = sem.r[0].semestre;
  grupo = grp.r[0].grupo;
  materia = mat.r[0].materia;
  maestro = ma.r[0].nom_maestro;
  p={semestre:semestre,grupo:grupo,materia:materia,maestro:maestro}
  let reg = await Promise.resolve(listas.registroa(p)).catch(err => {
    res.status(500).send(err);
  })
  res.locals.r = reg.r;
  res.status(200);
  res.render('listas/registro_asistencia', { title: 'Registro de asistencia',r:res.locals.r,l:res.locals.lis});
});
//Ruta para consultar asistencias
router.get('/consulta/', async (req, res, next) => {
  console.log('Entrada a la ruta /consulta/id.get')
  let sem = await Promise.resolve(semestres.lis_semestres( ))  
  let grp = await Promise.resolve(grupos.lis_grupos())
  let mat = await Promise.resolve(materias.lis_materias())
  let ma = await Promise.resolve(maestros.lis_maestros())
  let reg = await Promise.resolve(listas.asistencias( ))
  res.locals.r = reg.r;
  res.status(200);
  res.render('listas/consulta_asistencia', { title: 'Listas de asistencia',r:res.locals.r,s:sem.r,g:grp.r,m:mat.r,ma:ma.r});
});
//Ruta para consultar asistencias con filtro
router.get('/consulta/filtro/', async (req, res, next) => {
  console.log('Entrada a la ruta /consulta/id.get')
  let reg = await Promise.resolve(listas.asistencias( ))
  res.locals.r = reg.r;
  console.log(res.locals.r);
  res.status(200);
  res.render('listas/consulta_asistencia', { title: 'Listas de asistencia',r:res.locals.r,l:res.locals.lis});
});
//Ruta para registrar las asistencias
router.post('/registroa',upload.none(), async (req, res, next) => {
  console.log('Entrada a la ruta /gest_listas.post')
  let f = req.body;
  let registros=(Object.keys(f).length - 6)/3;
  let registronuevo = 0;
  for(x=0;x<registros;x++){
    e="estado"+x;
    a="pkalumno"+x;
    p={fecha:f.fecha,
      sesion:f.sesion,
      estado:f[e],
      fkalumno:f[a],
      fkmaestro:f.fkmaestro,
      fkmateria:f.fkmateria,
      fksemestre:f.fksemestre,
      fkgrupo:f.fkgrupo};
      registronuevo = await Promise.resolve(listas.new_asistencia(p)).catch(err => {
        res.status(500).send(err);
    })
  }
  if(registronuevo.r = "registro exitoso"){
    res.status(200);
    res.redirect('/listas/gest_listas')
  }
});
//Ruta para agregar listas nuevas
router.post('/gest_listas',upload.none(), function(req, res, next) {
  console.log('Entrada a la ruta /gest_listas.post')
  var p = {nombre:req.body.nombre,
          fksemestre:req.body.pksemestre,
          fkgrupo:req.body.pkgrupo,
          fkmateria:req.body.pkmateria,
          fkmaestro:req.body.pkmaestro};
  listas.new_lista(p).then(
      resolve => {
        res.status(200);
        res.redirect('/listas/gest_listas')
  }).catch(err => {
      console.error(err);
      res.status(500).send(err);
  })
});
//middleware para todas las direcciones con id/edit, actualmente sin uso
router.param('id*', async (req, res,next) => {
    console.log('Entrada a la ruta: /gest_listas/:id.param')
    try {

      next();
    }  catch (err) {
    // handle errors here
    }
})
//ruta para desplegar formulario listas previo a editar
router.get('/gest_listas/:id/edit', async (req, res,next) => {
  console.log('Entrada a la ruta /gest_listas/id/edit.get')
  try {
    let sem = await Promise.resolve(semestres.lis_semestres())
    res.locals.sem = sem.r  
    let p = {pklista:req.params.id};
    const flags= await Promise.resolve(listas.lista(p));
    res.locals.resp = flags.r
    res.status(200);
    res.render('listas/edit_lista', { title: 'Editar listas',r:res.locals.resp,s:res.locals.sem });
  }  catch (err) {
  // handle errors here
  }
});
//rutas para el manejo de listas individuales
router.route("/gest_listas/:id",upload.none())
  .all(upload.none(),async (req, res,next) => {
    console.log('Entrada a la ruta: /gest_listas/:id.all')
      res.locals.pklista = req.params.id;
      res.locals.lista = req.body.lista; 
      res.locals.fksemestre = req.body.pksemestre;
      next();
  })
  .get(upload.none(),function(req,res,){
    console.log('Entrada a la ruta: /gest_listas/:id.get')

  })
  .put(upload.none(),function(req,res,){
    let p = {pklista:res.locals.pklista,
            lista:res.locals.lista,
            fksemestre:res.locals.fksemestre};
    listas.editar_lista(p).then(
      resolve => {
        res.status(200);
        res.redirect('/listas/gest_listas')
  }).catch(err => {
      console.error(err);
      res.status(500).send(err);
  })
  })
  .delete(function(req,res,){
    console.log('Entrada a la ruta: /gest_listas/:id.delete')
    let p = {pklista:res.locals.pklista};
    listas.borrar_lista(p).then(
        resolve => {
          res.status(200);
          res.redirect('/listas/gest_listas')
    }).catch(err => {
        console.error(err);
        res.status(500).send(err);
    })
  })
module.exports = router;