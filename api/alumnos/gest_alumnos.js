const query = require('../db_conexion');

exports.lis_alumnos = async () =>{
  let r = {}
  r.r = await lista()
  return r
}
const lista = () => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT r.pkalumno,r.nom_alumno,r.fksemestre,r.fkgrupo, r.n_control, r.grupo, s.semestre FROM (SELECT a.pkalumno,a.nom_alumno,a.fksemestre,a.fkgrupo, a.n_control, g.grupo FROM public.alumnos AS a LEFT JOIN public.grupos AS g ON (a.fkgrupo = g.pkgrupo) ORDER BY nom_alumno) AS r LEFT JOIN public.semestres AS s ON (r.fksemestre = s.pksemestre)"
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
// busca una alumno por pkalumno y la devuelve
exports.alumno = async (p) =>{
  let r ={}
  r.r = await alum(p)
  return r
}
const alum = (p) => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT * FROM public.alumnos AS s WHERE s.pkalumno = $1"
    let params = [p.pkalumno];//1=processed
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
exports.new_alumno = async (p) =>{
  let r = {}
  r.r = await new_comprobar_parametros(p)
  r.r = await new_validar_alumno(p)
  r.r = await new_insertar_alumno(p)
  return r
}

const new_comprobar_parametros = (p) => {
  return new Promise ((resolve,reject) => {
      let params = [
          'nom_alumno',
          'n_control',
          'fksemestre',
          'fkgrupo'
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
const new_validar_alumno = (p) => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT * FROM public.alumnos AS s WHERE s.nom_alumno = $1 OR s.n_control = $2"
    let params = [p.nom_alumno,p.n_control];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err.message);
        else{
          if(result.rows.length < 1){
            resolve();
          }else{
            reject('El alumno o el numero de control ya existe');
          }
        }
    });
  })
}
const new_insertar_alumno = (p) => {
  return new Promise ((resolve,reject) => {
    let string ='INSERT INTO public.alumnos (nom_alumno,n_control,fksemestre,fkgrupo) VALUES ($1,$2,$3,$4)'
    let params = [p.nom_alumno,p.n_control,p.fksemestre,p.fkgrupo];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err);
        else{
            resolve('registro exitoso')
        }
    });
  })
}
exports.editar_alumno = async (p) =>{
  let r = {}
  r.r = await editar_comprobar_parametros(p)
  r.r = await editar_validar_alumno(p)
  r.r = await editar_alumno(p)
  return r
}

const editar_comprobar_parametros = (p) => {
  return new Promise ((resolve,reject) => {
      let params = [
          'pkalumno',
          'nom_alumno',
          'n_control',
          'fksemestre',
          'fkgrupo'
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
const editar_validar_alumno = (p) => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT * FROM public.alumnos AS s WHERE s.pkalumno = $1"
    let params = [p.pkalumno];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err.message);
        else{
          if(result.rowCount == 0){
            reject('El alumno no existe');
          }else{
            resolve();
          }
        }
    });
  })
}
const editar_alumno = (p) => {
  return new Promise ((resolve,reject) => {
    let string ='UPDATE public.alumnos SET pkalumno=$1, nom_alumno=$2,n_control=$3,fksemestre=$4,fkgrupo=$5 WHERE pkalumno = ($1);'
    let params = [p.pkalumno,p.nom_alumno,p.n_control,p.fksemestre,p.fkgrupo];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err);
        else{
            resolve('alumno actualizada')
        }
    });
  })
}
exports.borrar_alumno = async (p) =>{
  let r = {}
  r.r = await borrar_comprobar_parametros(p)
  r.r = await borrar_validar_alumno(p)
  r.r = await borrar_eliminar_alumno(p)
  return r
}

const borrar_comprobar_parametros = (p) => {
  return new Promise ((resolve,reject) => {
      let params = [
          'pkalumno'
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
const borrar_validar_alumno = (p) => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT * FROM public.alumnos AS s WHERE s.pkalumno = $1"
    let params = [p.pkalumno];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err.message);
        else{
          if(result.rowCount == 0){
            reject('EL alumno no existe');
          }else{
            resolve();
          }
        }
    });
  })
}
const borrar_eliminar_alumno = (p) => {
  return new Promise ((resolve,reject) => {
    let string ='DELETE FROM public.alumnos AS s WHERE s.pkalumno = ($1);'
    let params = [p.pkalumno];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err);
        else{
            resolve('alumno borrado')
        }
    });
  })
}
