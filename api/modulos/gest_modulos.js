const query = require('../db_conexion');

exports.lis_modulos = async () =>{
  let r = {}
  r.r = await lista()
  return r
}
const lista = () => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT r.pkmodulo,r.modulo,r.fksemestre,r.semestre, r.fkcarrera, c.carrera FROM (SELECT mod.pkmodulo,mod.modulo,mod.fksemestre, mod.fkcarrera,s.semestre FROM public.modulos AS mod LEFT JOIN public.semestres AS s ON (mod.fksemestre = s.pksemestre) ORDER BY mod.modulo) AS r LEFT JOIN public.carreras AS c ON (r.fkcarrera = c.pkcarrera)"
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
// busca una modulo por pkmodulo y la devuelve
exports.modulo = async (p) =>{
  let r ={}
  r.r = await mod(p)
  return r
}
const mod = (p) => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT * FROM public.modulos AS s WHERE s.pkmodulo = $1"
    let params = [p.pkmodulo];//1=processed
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
exports.new_modulo = async (p) =>{
  let r = {}
  r.r = await new_comprobar_parametros(p)
  r.r = await new_validar_modulo(p)
  r.r = await new_insertar_modulo(p)
  return r
}

const new_comprobar_parametros = (p) => {
  return new Promise ((resolve,reject) => {
      let params = [
          'modulo',
          'fksemestre',
          'fkcarrera'
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
const new_validar_modulo = (p) => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT * FROM public.modulos AS s WHERE s.modulo = $1"
    let params = [p.modulo];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err.message);
        else{
          if(result.rows.length < 1){
            resolve();
          }else{
            reject('El modulo ya existe');
          }
        }
    });
  })
}
const new_insertar_modulo = (p) => {
  return new Promise ((resolve,reject) => {
    let string ='INSERT INTO public.modulos (modulo,fksemestre,fkcarrera) VALUES ($1,$2,$3)'
    let params = [p.modulo,p.fksemestre,p.fkcarrera];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err);
        else{
            resolve('registro exitoso')
        }
    });
  })
}
exports.editar_modulo = async (p) =>{
  let r = {}
  r.r = await editar_comprobar_parametros(p)
  r.r = await editar_validar_modulo(p)
  r.r = await editar_modulo(p)
  return r
}

const editar_comprobar_parametros = (p) => {
  return new Promise ((resolve,reject) => {
      let params = [
          'pkmodulo',
          'modulo',
          'fksemestre',
          'fkcarrera'
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
const editar_validar_modulo = (p) => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT * FROM public.modulos AS m WHERE m.pkmodulo = $1"
    let params = [p.pkmodulo];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err.message);
        else{
          if(result.rowCount == 0){
            reject('El modulo no existe');
          }else{
            resolve();
          }
        }
    });
  })
}
const editar_modulo = (p) => {
  return new Promise ((resolve,reject) => {
    let string ='UPDATE public.modulos SET modulo=$2,fksemestre=$3,fkcarrera=$4 WHERE pkmodulo = ($1);'
    let params = [p.pkmodulo,p.modulo,p.fksemestre,p.fkcarrera];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err);
        else{
            resolve('modulo actualizada')
        }
    });
  })
}
exports.borrar_modulo = async (p) =>{
  let r = {}
  r.r = await borrar_comprobar_parametros(p)
  r.r = await borrar_validar_modulo(p)
  r.r = await borrar_eliminar_modulo(p)
  return r
}

const borrar_comprobar_parametros = (p) => {
  return new Promise ((resolve,reject) => {
      let params = [
          'pkmodulo'
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
const borrar_validar_modulo = (p) => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT * FROM public.modulos AS s WHERE s.pkmodulo = $1"
    let params = [p.pkmodulo];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err.message);
        else{
          if(result.rowCount == 0){
            reject('EL modulo no existe');
          }else{
            resolve();
          }
        }
    });
  })
}
const borrar_eliminar_modulo = (p) => {
  return new Promise ((resolve,reject) => {
    let string ='DELETE FROM public.modulos AS s WHERE s.pkmodulo = ($1);'
    let params = [p.pkmodulo];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err);
        else{
            resolve('modulo borrado')
        }
    });
  })
}
