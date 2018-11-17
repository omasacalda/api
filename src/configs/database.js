module.exports = {
  "development": {
    // "uri": "mysql://root:parola@127.0.0.1:3306/masacaldadb",
    "username": "root",
    "password": "parola",
    "database": "masacaldadb",
    "host": "database",
    "dialect": "mysql",
    "port": "3306"
  },
  "production": {
    "uri": "mysql://user:password@host:port/database",
    "username": "user",
    "password": "password",
    "database": "database",
    "host": "host",
    "dialect": "mysql",
    "port": "port"
  }
}
