const mysql = require('mysql');

module.exports = mysql.createConnection({
    host     : '161.35.150.219',
    user     : 'hodaya',
    password : 'hodaya246',
    database : 'smartConnect',
    schema: 'logs'
    
  });