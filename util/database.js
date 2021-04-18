const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'abcdabcd', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
