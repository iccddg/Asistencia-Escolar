const query = require('../db_conexion');

exports.lis_submodulos = async () =>{
  let r = {}
  r.r = await lista()
  return r
}
const lista = () => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT smod.pksubmodulo,smod.submodulo,smod.fkmodulo,m.modulo FROM public.submodulos AS smod LEFT JOIN public.modulos AS m ON (smod.fkmodulo = m.pkmodulo) ORDER BY smod.submodulo"
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
// busca una submodulo por pksubmodulo y la devuelve
exports.submodulo = async (p) =>{
  let r ={}
  r.r = await mod(p)
  return r
}
const mod = (p) => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT * FROM public.submodulos AS s WHERE s.pksubmodulo = $1"
    let params = [p.pksubmodulo];//1=processed
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
exports.new_submodulo = async (p) =>{
  let r = {}
  r.r = await new_comprobar_parametros(p)
  r.r = await new_validar_submodulo(p)
  r.r = await new_insertar_submodulo(p)
  return r
}

const new_comprobar_parametros = (p) => {
  return new Promise ((resolve,reject) => {
      let params = [
          'submodulo',
          'fkmodulo'
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
const new_validar_submodulo = (p) => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT * FROM public.submodulos AS s WHERE s.submodulo = $1"
    let params = [p.submodulo];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err.message);
        else{
          if(result.rows.length < 1){
            resolve();
          }else{
            reject('El submodulo ya existe');
          }
        }
    });
  })
}
const new_insertar_submodulo = (p) => {
  return new Promise ((resolve,reject) => {
    let string ='INSERT INTO public.submodulos (submodulo,fkmodulo) VALUES ($1,$2)'
    let params = [p.submodulo,p.fkmodulo];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err);
        else{
            resolve('registro exitoso')
        }
    });
  })
}
exports.editar_submodulo = async (p) =>{
  let r = {}
  r.r = await editar_comprobar_parametros(p)
  r.r = await editar_validar_submodulo(p)
  r.r = await editar_submodulo(p)
  return r
}

const editar_comprobar_parametros = (p) => {
  return new Promise ((resolve,reject) => {
      let params = [
          'pksubmodulo',
          'submodulo',
          'fkmodulo'
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
const editar_validar_submodulo = (p) => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT * FROM public.submodulos AS m WHERE m.pksubmodulo = $1"
    let params = [p.pksubmodulo];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err.message);
        else{
          if(result.rowCount == 0){
            reject('El submodulo no existe');
          }else{
            resolve();
          }
        }
    });
  })
}
const editar_submodulo = (p) => {
  return new Promise ((resolve,reject) => {
    let string ='UPDATE public.submodulos SET submodulo=$2,fkmodulo=$3 WHERE pksubmodulo = ($1);'
    let params = [p.pksubmodulo,p.submodulo,p.fkmodulo];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err);
        else{
            resolve('submodulo actualizado')
        }
    });
  })
}
exports.borrar_submodulo = async (p) =>{
  let r = {}
  r.r = await borrar_comprobar_parametros(p)
  r.r = await borrar_validar_submodulo(p)
  r.r = await borrar_eliminar_submodulo(p)
  return r
}

const borrar_comprobar_parametros = (p) => {
  return new Promise ((resolve,reject) => {
      let params = [
          'pksubmodulo'
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
const borrar_validar_submodulo = (p) => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT * FROM public.submodulos AS s WHERE s.pksubmodulo = $1"
    let params = [p.pksubmodulo];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err.message);
        else{
          if(result.rowCount == 0){
            reject('EL submodulo no existe');
          }else{
            resolve();
          }
        }
    });
  })
}
const borrar_eliminar_submodulo = (p) => {
  return new Promise ((resolve,reject) => {
    let string ='DELETE FROM public.submodulos AS s WHERE s.pksubmodulo = ($1);'
    let params = [p.pksubmodulo];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err);
        else{
            resolve('submodulo borrado')
        }
    });
  })
}
