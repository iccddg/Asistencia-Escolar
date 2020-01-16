const query = require('../db_conexion');
exports.lis_semestres = async () =>{
  let r = {}
  r.r = await lista()
  return r
}
const lista = () => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT * FROM listarsemestres()"
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
exports.semestre = async (p) =>{
  let r ={}
  r.r = await sem(p)
  return r
}
const sem = (p) => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT * FROM public.semestres AS s WHERE s.pksemestre = $1"
    let params = [p.pksemestre];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err.message);
        else{
          if(result.rows.length < 1 ){
            reject('La tabla esta bacia')
          }else{
            resolve(result.rows);
          }
        }
    });
  })
}
exports.new_semestre = async (p) =>{
  let r = {}
  r.r = await new_comprobar_parametros(p)
  r.r = await new_validar_semestre(p)
  r.r = await new_insertar_semestre(p)
  return r
}

const new_comprobar_parametros = (p) => {
  return new Promise ((resolve,reject) => {
      let params = [
          'semestre'
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
const new_validar_semestre = (p) => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT * FROM public.semestres AS s WHERE s.semestre = $1"
    let params = [p.semestre];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err.message);
        else{
          if(result.rowCount == 0){
            resolve();
          }else{
            reject('El semestre ya existe')
          }
        }
    });
  })
}
const new_insertar_semestre = (p) => {
  return new Promise ((resolve,reject) => {
    let string ='SELECT registrarsemestre($1);'
    let params = [p.semestre];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err);
        else{
          if(result.rows.length > 0){
            resolve('registro exitoso')
          }else{
            reject('Error while insert in db');
          }
        }
    });
  })
}
exports.borrar_semestre = async (p) =>{
  let r = {}
  r.r = await borrar_comprobar_parametros(p)
  r.r = await borrar_validar_semestre(p)
  r.r = await borrar_eliminar_semestre(p)
  return r
}

const borrar_comprobar_parametros = (p) => {
  return new Promise ((resolve,reject) => {
      let params = [
          'pksemestre'
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
const borrar_validar_semestre = (p) => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT * FROM public.semestres AS s WHERE s.pksemestre = $1"
    let params = [p.pksemestre];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err.message);
        else{
          if(result.rowCount == 0){
            reject('El semestre no existe');
          }else{
            resolve();
          }
        }
    });
  })
}
const borrar_eliminar_semestre = (p) => {
  return new Promise ((resolve,reject) => {
    let string ='DELETE FROM public.semestres AS s WHERE s.pksemestre = ($1);'
    let params = [p.pksemestre];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err);
        else{
            resolve('Semestre borrado')
        }
    });
  })
}
