const query = require('../db_conexion');
exports.lis_maestros = async () =>{
  let r = {}
  r.r = await lista()
  return r
}
const lista = () => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT * FROM public.maestros ORDER BY nom_maestro"
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
// busca una maestro por pkmaestro y la devuelve
exports.maestro = async (p) =>{
  let r ={}
  r.r = await maest(p)
  return r
}
const maest = (p) => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT * FROM public.maestros AS s WHERE s.pkmaestro = $1"
    let params = [p.pkmaestro];//1=processed
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
exports.new_maestro = async (p) =>{
  let r = {}
  r.r = await new_comprobar_parametros(p)
  r.r = await new_validar_maestro(p)
  r.r = await new_insertar_maestro(p)
  return r
}

const new_comprobar_parametros = (p) => {
  return new Promise ((resolve,reject) => {
      let params = [
          'nom_maestro'
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
const new_validar_maestro = (p) => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT * FROM public.maestros AS s WHERE s.nom_maestro = $1"
    let params = [p.nom_maestro];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err.message);
        else{
          if(result.rowCount == 0){
            resolve();
          }else{
            reject('La maestro ya existe')
          }
        }
    });
  })
}
const new_insertar_maestro = (p) => {
  return new Promise ((resolve,reject) => {
    let string ='INSERT INTO public.maestros (nom_maestro) VALUES ($1);'
    let params = [p.nom_maestro];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err);
        else{
            resolve('registro exitoso')
        }
    });
  })
}
exports.editar_maestro = async (p) =>{
  let r = {}
  r.r = await editar_comprobar_parametros(p)
  r.r = await editar_validar_maestro(p)
  r.r = await editar_maestro(p)
  return r
}

const editar_comprobar_parametros = (p) => {
  return new Promise ((resolve,reject) => {
      let params = [
          'pkmaestro',
          'nom_maestro'
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
const editar_validar_maestro = (p) => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT * FROM public.maestros AS s WHERE s.pkmaestro = $1"
    let params = [p.pkmaestro];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err.message);
        else{
          if(result.rowCount == 0){
            reject('La maestro no existe');
          }else{
            resolve();
          }
        }
    });
  })
}
const editar_maestro = (p) => {
  return new Promise ((resolve,reject) => {
    let string ='UPDATE public.maestros SET pkmaestro=$1, nom_maestro=$2 WHERE pkmaestro = ($1);'
    let params = [p.pkmaestro,p.nom_maestro];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err);
        else{
            resolve('maestro actualizada')
        }
    });
  })
}
exports.borrar_maestro = async (p) =>{
  let r = {}
  r.r = await borrar_comprobar_parametros(p)
  r.r = await borrar_validar_maestro(p)
  r.r = await borrar_eliminar_maestro(p)
  return r
}

const borrar_comprobar_parametros = (p) => {
  return new Promise ((resolve,reject) => {
      let params = [
          'pkmaestro'
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
const borrar_validar_maestro = (p) => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT * FROM public.maestros AS s WHERE s.pkmaestro = $1"
    let params = [p.pkmaestro];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err.message);
        else{
          if(result.rowCount == 0){
            reject('EL maestro no existe');
          }else{
            resolve();
          }
        }
    });
  })
}
const borrar_eliminar_maestro = (p) => {
  return new Promise ((resolve,reject) => {
    let string ='DELETE FROM public.maestros AS s WHERE s.pkmaestro = ($1);'
    let params = [p.pkmaestro];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err);
        else{
            resolve('maestro borrado')
        }
    });
  })
}
