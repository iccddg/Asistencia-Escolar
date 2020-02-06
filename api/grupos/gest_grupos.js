const query = require('../db_conexion');

/* debuelbe los grupos registrados en la tabla grupos
con una funcion de tipo SETOF*/
exports.lis_grupos = async () =>{
  let r = {}
  r.r = await lista()
  return r
}
const lista = () => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT * FROM public.grupos AS s ORDER BY s.grupo"
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
exports.grupo = async (p) =>{
  let r ={}
  r.r = await grup(p)
  return r
}
const grup = (p) => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT * FROM public.grupos AS s WHERE s.pkgrupo = $1"
    let params = [p.pkgrupo];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err.message);
        else{
          if(result.rows.length < '1' ){
            reject('La tabla esta bacia')
          }else{
            resolve(result.rows);
          }
        }
    });
  })
}
exports.new_grupo = async (p) =>{
  let r = {}
  r.r = await new_comprobar_parametros(p)
  r.r = await new_validar_grupo(p)
  r.r = await new_insertar_grupo(p)
  return r
}
const new_comprobar_parametros = (p) => {
  return new Promise ((resolve,reject) => {
      let params = [
          'grupo'
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
const new_validar_grupo = (p) => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT * FROM public.grupos AS s WHERE s.grupo = $1"
    let params = [p.grupo];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err.message);
        else{
          if(result.rowCount == 0){
            resolve();
          }else{
            reject('El grupo ya existe')
          }
        }
    });
  })
}
const new_insertar_grupo = (p) => {
  return new Promise ((resolve,reject) => {
    let string ='INSERT INTO public.grupos (grupo) VALUES ($1);'
    let params = [p.grupo];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err);
        else{
            resolve('registro exitoso')
        }
    });
  })
}
exports.borrar_grupo = async (p) =>{
  let r = {}
  r.r = await borrar_comprobar_parametros(p)
  r.r = await borrar_validar_grupo(p)
  r.r = await borrar_eliminar_grupo(p)
  return r
}
const borrar_comprobar_parametros = (p) => {
  return new Promise ((resolve,reject) => {
      let params = [
          'pkgrupo'
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
const borrar_validar_grupo = (p) => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT * FROM public.grupos AS s WHERE s.pkgrupo = $1"
    let params = [p.pkgrupo];//1=processed
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
const borrar_eliminar_grupo = (p) => {
  return new Promise ((resolve,reject) => {
    let string ='DELETE FROM public.grupos AS s WHERE s.pkgrupo = ($1);'
    let params = [p.pkgrupo];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err);
        else{
            resolve('grupo borrado')
        }
    });
  })
}
