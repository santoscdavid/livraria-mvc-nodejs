const Sequelize = require('sequelize');
const connection = require('../config/db');

const User = connection.define('usuarios',{
    nome:{
        type: Sequelize.TEXT,
        allowNull: false
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },
    endereco:{
        type: Sequelize.STRING,
        allowNull: false
    },
    cidade:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

User.sync({force:false});

module.exports = User;