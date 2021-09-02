const Sequelize = require('sequelize');
const connection = require('../config/db');

const Editora = connection.define('editoras', {
    nome:{
        type: Sequelize.STRING,
        allowNull:false
    },
    cidade:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

Editora.sync({force:false})

module.exports = Editora;