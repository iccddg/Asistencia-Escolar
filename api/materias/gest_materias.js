const query = require('../db_conexion');

exports.lis_materias = async () =>{
  let r = {}
  r.r = await lista()
  return r
}
const lista = () => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT ma.pkmateria,ma.materia,ma.fksemestre,s.semestre FROM public.materias AS ma LEFT JOIN public.semestres AS s ON (ma.fksemestre = s.pksemestre) ORDER BY ma.materia"
    let params = [];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err.message);
        else{
          if(result.rows.length == null ){
            reject('La tabla esta bacia')
          }else{
            resolve(result.rows);
          }
        }
    });
  })
}
// busca una materia por pkmateria y la devuelve
exports.materia = async (p) =>{
  let r ={}
  r.r = await mat(p)
  return r
}
const mat = (p) => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT * FROM public.materias AS s WHERE s.pkmateria = $1"
    let params = [p.pkmateria];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err.message);
        else{
          if(result.rows.length < 1 ){
            reject('La materia no existe')
          }else{
            resolve(result.rows);
          }
        }
    });
  })
}
exports.new_materia = async (p) =>{
  let r = {}
  r.r = await new_comprobar_parametros(p)
  r.r = await new_validar_materia(p)
  r.r = await new_insertar_materia(p)
  return r
}

const new_comprobar_parametros = (p) => {
  return new Promise ((resolve,reject) => {
      let params = [
          'materia',
          'fksemestre'
      ]
      for(var i = 0;i<params.length;i++){
          if(p[params[i]] == '' || p[params[i]] == null || p[params[i]] == undefined){
              reject('Falta el parametro: '+params[i])
              return;
          }
      }
      resolve()
  })
}
const new_validar_materia = (p) => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT * FROM public.materias AS s WHERE s.materia = $1"
    let params = [p.materia];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err.message);
        else{
          if(result.rows.length < 1){
            resolve();
          }else{
            reject('La materia ya existe');
          }
        }
    });
  })
}
const new_insertar_materia = (p) => {
  return new Promise ((resolve,reject) => {
    let string ='INSERT INTO public.materias (materia,fksemestre) VALUES ($1,$2)'
    let params = [p.materia,p.fksemestre];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err);
        else{
            resolve('registro exitoso')
        }
    });
  })
}
exports.editar_materia = async (p) =>{
  let r = {}
  r.r = await editar_comprobar_parametros(p)
  r.r = await editar_validar_materia(p)
  r.r = await editar_materia(p)
  return r
}

const editar_comprobar_parametros = (p) => {
  return new Promise ((resolve,reject) => {
      let params = [
          'pkmateria',
          'materia',
          'fksemestre'
      ]
      for(var i = 0;i<params.length;i++){
          if(p[params[i]] == '' || p[params[i]] == null || p[params[i]] == undefined){
              reject('Falta el parametro: '+params[i])
              return;
          }
      }
      resolve()
  })
}
const editar_validar_materia = (p) => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT * FROM public.materias AS m WHERE m.pkmateria = $1"
    let params = [p.pkmateria];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err.message);
        else{
          if(result.rowCount == 0){
            reject('La materia no existe');
          }else{
            resolve();
          }
        }
    });
  })
}
const editar_materia = (p) => {
  return new Promise ((resolve,reject) => {
    let string ='UPDATE public.materias SET materia=$2,fksemestre=$3 WHERE pkmateria = ($1);'
    let params = [p.pkmateria,p.materia,p.fksemestre];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err);
        else{
            resolve('materia actualizado')
        }
    });
  })
}
exports.borrar_materia = async (p) =>{
  let r = {}
  r.r = await borrar_comprobar_parametros(p)
  r.r = await borrar_validar_materia(p)
  r.r = await borrar_eliminar_materia(p)
  return r
}

const borrar_comprobar_parametros = (p) => {
  return new Promise ((resolve,reject) => {
      let params = [
          'pkmateria'
      ]
      for(var i = 0;i<params.length;i++){
          if(p[params[i]] == '' || p[params[i]] == null || p[params[i]] == undefined){
              reject('Falta el parametro: '+params[i])
              return;
          }
      }
      resolve()
  })
}
const borrar_validar_materia = (p) => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT * FROM public.materias AS s WHERE s.pkmateria = $1"
    let params = [p.pkmateria];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err.message);
        else{
          if(result.rowCount == 0){
            reject('La materia no existe');
          }else{
            resolve();
          }
        }
    });
  })
}
const borrar_eliminar_materia = (p) => {
  return new Promise ((resolve,reject) => {
    let string ='DELETE FROM public.materias AS s WHERE s.pkmateria = ($1);'
    let params = [p.pkmateria];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err);
        else{
            resolve('materia borrada')
        }
    });
  })
}
