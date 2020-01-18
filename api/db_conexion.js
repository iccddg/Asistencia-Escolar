const pgsql = require("pg");

const pool = new pgsql.Pool({
user: 'noabandono',
host: '192.168.1.65',
database: 'asistenciaescolar',
password: 'abandonoescolar',
port: 5432,
});

exports.query = function(sqlstring, sqlvalues, cb){
    try{
      pool.connect(function(err, client, done){
          if(err){
              err.sqlstring = sqlstring;
              if(cb)
                cb(err,null);
              return;
          }
          client.query(sqlstring, sqlvalues, function(err,result){
              done();
              if(err){
                  err.sqlstring = sqlstring;
                  err.sqlvalues = sqlvalues;
                  if(cb)
                    cb(err,null);
                  return;
              }
              if(cb)
                  cb(null,result);
              return;
          });
      });
    } catch(ex){
      console.error(ex);
    }
  };
