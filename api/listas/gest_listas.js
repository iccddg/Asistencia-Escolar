const query = require('../db_conexion');
//devuelbe las listas creadas en la tabla listas
exports.lis_listas = async () =>{
  let r = {}
  r.r = await lista()
  return r
}
const lista = () => {
  return new Promise ((resolve,reject) => {
    //let string = "SELECT ma.pklista,ma.lista,ma.fksemestre,s.semestre FROM public.listas AS ma LEFT JOIN public.semestres AS s ON (ma.fksemestre = s.pksemestre) ORDER BY ma.lista"
    let string = "SELECT * FROM public.listas AS l ORDER BY l.nombre"
    let params = [];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err.message);
        else{
            resolve(result.rows);
          }
        });
  })
}
// busca una lista por pklista y la devuelve
exports.lista = async (p) =>{
  let r ={}
  r.r = await list(p)
  return r
}
const list = (p) => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT * FROM public.listas AS s WHERE s.pklista = $1"
    let params = [p.pklista];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err.message);
        else{
          if(result.rows.length < 1 ){
            reject('La lista no existe')
          }else{
            resolve(result.rows);
          }
        }
    });
  })
}
//crea una lista nueva en la tabal listas
exports.new_lista = async (p) =>{
  let r = {}
  r.r = await new_comprobar_parametros(p)
  r.r = await new_validar_lista(p)
  r.r = await new_insertar_lista(p)
  return r
}
const new_comprobar_parametros = (p) => {
  return new Promise ((resolve,reject) => {
      let params = [
          'nombre',
          'fksemestre',
          'fkgrupo',
          'fkmateria',
          'fkmaestro'
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
const new_validar_lista = (p) => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT * FROM public.listas AS s WHERE s.nombre = $1"
    let params = [p.nombre];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err.message);
        else{
          if(result.rows.length < 1){
            resolve();
          }else{
            reject('La lista ya existe');
          }
        }
    });
  })
}
const new_insertar_lista = (p) => {
  return new Promise ((resolve,reject) => {
    let string ='INSERT INTO public.listas (nombre,fksemestre,fkgrupo,fkmateria,fkmaestro) VALUES ($1,$2,$3,$4,$5)'
    let params = [p.nombre,p.fksemestre,p.fkgrupo,p.fkmateria,p.fkmaestro];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err);
        else{
            resolve('registro exitoso')
        }
    });
  })
}
//Actualiza los datos de una lista ya creada
exports.editar_lista = async (p) =>{
  let r = {}
  r.r = await editar_comprobar_parametros(p)
  r.r = await editar_validar_lista(p)
  r.r = await editar_lista(p)
  return r
}
const editar_comprobar_parametros = (p) => {
  return new Promise ((resolve,reject) => {
      let params = [
          'pklista',
          'lista',
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
const editar_validar_lista = (p) => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT * FROM public.listas AS m WHERE m.pklista = $1"
    let params = [p.pklista];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err.message);
        else{
          if(result.rowCount == 0){
            reject('La lista no existe');
          }else{
            resolve();
          }
        }
    });
  })
}
const editar_lista = (p) => {
  return new Promise ((resolve,reject) => {
    let string ='UPDATE public.listas SET lista=$2,fksemestre=$3 WHERE pklista = ($1);'
    let params = [p.pklista,p.lista,p.fksemestre];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err);
        else{
            resolve('lista actualizado')
        }
    });
  })
}
//borra una una lista de la tabla listas por pklista
exports.borrar_lista = async (p) =>{
  let r = {}
  r.r = await borrar_comprobar_parametros(p)
  r.r = await borrar_validar_lista(p)
  r.r = await borrar_eliminar_lista(p)
  return r
}
const borrar_comprobar_parametros = (p) => {
  return new Promise ((resolve,reject) => {
      let params = [
          'pklista'
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
const borrar_validar_lista = (p) => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT * FROM public.listas AS s WHERE s.pklista = $1"
    let params = [p.pklista];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err.message);
        else{
          if(result.rowCount == 0){
            reject('La lista no existe');
          }else{
            resolve();
          }
        }
    });
  })
}
const borrar_eliminar_lista = (p) => {
  return new Promise ((resolve,reject) => {
    let string ='DELETE FROM public.listas AS s WHERE s.pklista = ($1);'
    let params = [p.pklista];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err);
        else{
            resolve('lista borrada')
        }
    });
  })
}
//selecciona alumnos por semestre, grupo, materia y maestro para registrar asistencia
exports.registroa = async (p) =>{
  let r ={}
  r.r = await registroa_comprobar_parametros(p)
  r.r = await registro(p)
  return r
}
const registroa_comprobar_parametros = (p) => {
  return new Promise ((resolve,reject) => {
      let params = [
          'semestre',
          'grupo',
          'materia',
          'maestro'
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
const registro = (p) => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT * FROM(SELECT * FROM	(SELECT * FROM (SELECT * FROM public.alumnos AS a JOIN public.semestres AS s ON (a.fksemestre = s.pksemestre and s.semestre =$1 )) AS r JOIN public.grupos AS g ON (r.fkgrupo = g.pkgrupo and g.grupo=$2)) AS rr JOIN public.materias AS m ON (m.materia = $3)) AS rrr JOIN public.maestros AS ma ON (ma.nom_maestro = $4)"
    let params = [p.semestre,p.grupo,p.materia,p.maestro];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err.message);
        else{
          if(result.rows.length < 1 ){
            reject('La lista para registro no existe')
          }else{
            resolve(result.rows);
          }
        }
    });
  })
}
exports.new_asistencia = async (p) =>{
  let r = {}
  r.r = await newasistencia_comprobar_parametros(p)
  r.r = await newasistencia_validar_lista(p)
  r.r = await newasistencia_insertar_lista(p)
  return r
}
//registra en la tabla asistencias los datos de la vista registro_asistencia
const newasistencia_comprobar_parametros = (p) => {
  return new Promise ((resolve,reject) => {
      let params = [
          'fecha',
          'sesion',
          'estado',
          'fkalumno',
          'fkmaestro',
          'fkmateria',
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
const newasistencia_validar_lista = (p) => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT * FROM public.asistencias AS a WHERE a.fecha = $1 AND a.sesion=$2 AND a.fkalumno=$3"
    let params = [p.fecha,p.sesion,p.fkalumno];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err.message);
        else{
          if(result.rows.length < 1){
            resolve();
          }else{
            reject('La asistencia ya existe');
          }
        }
    });
  })
}
const newasistencia_insertar_lista = (p) => {
  return new Promise ((resolve,reject) => {
    let string ='INSERT INTO public.asistencias (fecha,sesion,estado,fkalumno,fkmaestro,fkmateria,fksemestre,fkgrupo) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)'
    let params = [p.fecha,p.sesion,p.estado,p.fkalumno,p.fkmaestro,p.fkmateria,p.fksemestre,p.fkgrupo];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err);
        else{
            resolve('registro exitoso')
        }
    });
  })
}
//devuelbe todas las asistencias registradas en la tabla asistencias
exports.asistencias = async () =>{
  let r = {}
  r.r = await lista_asistencias()
  return r
}
const lista_asistencias = () => {
  return new Promise ((resolve,reject) => {
    let string = "SELECT to_char(rrrr.fecha,'DD/MM/YY') as fecha, al.n_control, al.nom_alumno,rrrr.sesion, rrrr.estado, rrrr.semestre, rrrr.grupo, rrrr.nom_maestro, rrrr.materia FROM(SELECT * FROM(SELECT * FROM	(SELECT * FROM (SELECT * FROM public.asistencias AS a JOIN public.semestres AS s ON (a.fksemestre = s.pksemestre)) AS r JOIN public.grupos AS g ON (r.fkgrupo = g.pkgrupo)) AS rr JOIN public.materias AS m ON (rr.fkmateria = m.pkmateria)) AS rrr JOIN public.maestros AS ma ON (rrr.fkmaestro = ma.pkmaestro)) AS rrrr JOIN public.alumnos AS al ON (rrrr.fkalumno = al.pkalumno) ORDER BY rrrr.fecha, rrrr.semestre, rrrr.grupo,rrrr.sesion,al.nom_alumno"
    let params = [];//1=processed
    query.query(string,params,function (err, result) {
        if(err)
        reject(err.message);
        else{
            resolve(result.rows);
          }
        });
  })
}
