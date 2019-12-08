const query = require('../db_conexion');
exports.lis_carreras = async () =>{
  let r = {}
  r.r = await lista()
  return r
}
const lista = () => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT * FROM public.carreras AS s ORDER BY s.carrera"
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
// busca una carrera por pkcarrera y la devuelve
exports.carrera = async (p) =>{
  let r ={}
  r.r = await carr(p)
  return r
}
const carr = (p) => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT * FROM public.carreras AS s WHERE s.pkcarrera = $1"
    let params = [p.pkcarrera];//1=processed
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
exports.new_carrera = async (p) =>{
  let r = {}
  r.r = await new_comprobar_parametros(p)
  r.r = await new_validar_carrera(p)
  r.r = await new_insertar_carrera(p)
  return r
}

const new_comprobar_parametros = (p) => {
  return new Promise ((resolve,reject) => {
      let params = [
          'carrera'
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
const new_validar_carrera = (p) => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT * FROM public.carreras AS s WHERE s.carrera = $1"
    let params = [p.carrera];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err.message);
        else{
          if(result.rowCount == 0){
            resolve();
          }else{
            reject('La carrera ya existe')
          }
        }
    });
  })
}
const new_insertar_carrera = (p) => {
  return new Promise ((resolve,reject) => {
    let string ='INSERT INTO public.carreras (carrera) VALUES ($1);'
    let params = [p.carrera];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err);
        else{
            resolve('registro exitoso')
        }
    });
  })
}
exports.editar_carrera = async (p) =>{
  let r = {}
  r.r = await editar_comprobar_parametros(p)
  r.r = await editar_validar_carrera(p)
  r.r = await editar_carrera(p)
  return r
}

const editar_comprobar_parametros = (p) => {
  return new Promise ((resolve,reject) => {
      let params = [
          'pkcarrera',
          'carrera'
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
const editar_validar_carrera = (p) => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT * FROM public.carreras AS s WHERE s.pkcarrera = $1"
    let params = [p.pkcarrera];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err.message);
        else{
          if(result.rowCount == 0){
            reject('La carrera no existe');
          }else{
            resolve();
          }
        }
    });
  })
}
const editar_carrera = (p) => {
  return new Promise ((resolve,reject) => {
    let string ='UPDATE public.carreras SET pkcarrera=$1, carrera=$2 WHERE pkcarrera = ($1);'
    let params = [p.pkcarrera,p.carrera];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err);
        else{
            resolve('carrera actualizada')
        }
    });
  })
}
exports.borrar_carrera = async (p) =>{
  let r = {}
  r.r = await borrar_comprobar_parametros(p)
  r.r = await borrar_validar_carrera(p)
  r.r = await borrar_eliminar_carrera(p)
  return r
}

const borrar_comprobar_parametros = (p) => {
  return new Promise ((resolve,reject) => {
      let params = [
          'pkcarrera'
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
const borrar_validar_carrera = (p) => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT * FROM public.carreras AS s WHERE s.pkcarrera = $1"
    let params = [p.pkcarrera];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err.message);
        else{
          if(result.rowCount == 0){
            reject('La carrera no existe');
          }else{
            resolve();
          }
        }
    });
  })
}
const borrar_eliminar_carrera = (p) => {
  return new Promise ((resolve,reject) => {
    let string ='DELETE FROM public.carreras AS s WHERE s.pkcarrera = ($1);'
    let params = [p.pkcarrera];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err);
        else{
            resolve('carrera borrada')
        }
    });
  })
}
