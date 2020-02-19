var express = require('express');
var multer  = require('multer')
var upload = multer()
var router = express.Router();
var modulos = require('../api/modulos/gest_modulos')
var semestres = require('../api/semestres/gest_semestres')
var carreras = require('../api/carreras/gest_carreras')
const fs = require('fs');
const csv = require('csv-parser');

var upload = multer({ dest: 'tempFile/' })

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
//Ruta para carga masiva de modulos
router.post('/gest_modulos/cargamasiva',upload.single('modulos'), function(req, res, next) {
  console.log('Entrada a la ruta /gest_modulos/cargamasiva.post');
  let p =[];
  let valores = [];
  var archivo = req.file.filename;
  let falla="";
  // con la funcion carga obtenemos los datos del archivo materias
  let carga =  new Promise ((reso,reje) => {
    fs.createReadStream('tempFile/'+ archivo) // Abrir archivo 
    .pipe(csv()) 
    .on('data', function(data){ 
      try {
        p.push(data); 
        //perform the operation 
      } catch(err) { 
        reje(err);
        //error handler 
      } 
    }) 
    .on('end', function(){ 
      //some final operation
      reso(p);
    });
  })
  //guardamos en sem la lista de semestres con su llave primaria
  let sem=semestres.lis_semestres();
  let carr=carreras.lis_carreras();
  // resolvemos las tres promesas
  Promise.all([carga,sem,carr])
    .then(resultados=>{
      console.log(resultados);
      let modu=resultados[0];
      console.log(modu);
      let seme=resultados[1].r;
      let carre=resultados[2].r;
      compara(modu,seme);
      if(falla !== ""){
        console.log("se termino");
      }else{
        compara2(modu,carre);
        if(falla !== ""){
          console.log("se termino");
        }else{
          valores.forEach((value,key,valores)=>{
            console.log(value);
            modulos.new_modulo(value).then(
              resolve => {
                console.log(resolve);
                if(Object.is(valores.length - 1, key)){
                  console.log('es el utlimo'+value);
                  res.status(200);
                  res.redirect('/modulos/gest_modulos')
                }
            }).catch(err => {
              console.error(err);
              res.status(500).send(err);
            })
           })
        }
     };
    }).catch(err => {
              console.error(err);
              res.status(500).send(err);
    });
    //compara los dos arreglos y si encuentra en mate un 
    //semestre que exista en seme, le asigna el pk de ese
    //semestre en un campo fksemestre
    function compara(modu,seme){
      modu.forEach((value,index,modu)=>{
        let pksemestre = seme.findIndex((val,ind,seme)=>{
          return val.semestre == value.semestre;
        })
        if (pksemestre == -1){
          falla="ocurrio un error en la linea "+(index+2) +" El semestre no existe en la base de datos";
          console.error(falla);
          res.status(500).send(falla);
        }else{
          valores.push({modulo:value.modulo,fksemestre:seme[pksemestre].pksemestre});
          console.log(valores);
        };
      return;
      })
      return;
    };
    //compara los dos arreglos y si encuentra en mate una 
    //carrera que exista en seme, le asigna el pk de ese
    //semestre en un campo fksemestre
    function compara2(modu,carre){
      console.log(modu);
      console.log(valores);
      modu.forEach((value,index,modu)=>{
        let pkcarrera = carre.findIndex((val,ind,carre)=>{
          return val.carrera === value.carrera;
        })
        if (pkcarrera == -1){
          falla="ocurrio un error en la linea "+(index+2) +" la carrera no existe en la base de datos";
          console.error(falla);
          res.status(500).send(falla);
        }else{
          valores[index]={modulo:valores[index].modulo,fksemestre:valores[index].fksemestre,fkcarrera:carre[pkcarrera].pkcarrera};
        };
      return;
      })
      return;
    };
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