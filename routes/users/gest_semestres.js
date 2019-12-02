const query = require('../db_conexion');
exports.lis_semestres = async () =>{
  let r = {}
  r.r = await lista()
  return r
}
const lista = () => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT * FROM public.semestres"
    let params = [];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err.message);
        else{
          if(result.rows[0].pksemestre == null ){
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
  r.r = await comprobar_parametros(p)
  r.r = await validar_semestre(p)
  r.r = await insertar_semestre(p)
  return r
}

const comprobar_parametros = (p) => {
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
const validar_semestre = (p) => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT * FROM public.semestres AS s WHERE s.semestre = $1"
    let params = [p.semestre];//1=processed
    console.log(params);
    query.query(string,params,function (err, result) {
      console.log(result.rowCount);
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
const insertar_semestre = (p) => {
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
