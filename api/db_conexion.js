const pgsql = require("pg");

const pool = new pgsql.Pool({
user: 'postgres',
host: 'localhost',
database: 'postgres',
password: '12345',
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