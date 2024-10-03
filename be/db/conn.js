const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config({
    path: '../.env'
});

// const dbconn = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
//     host: process.env.MYSQL_HOST,
//     dialect: 'mysql'
// });
const dbconn = new Sequelize(yourdb, youruser, yourpass, {
    host: 'localhost',
    dialect: 'mysql'
});

dbconn.authenticate()
    .then(() => console.log('Connection has been established successfully.'))
    .catch(err => console.error('Unable to connect to the database:', err));


module.exports = dbconn;