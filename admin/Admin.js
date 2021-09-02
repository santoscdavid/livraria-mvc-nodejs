const Sequelize = require('sequelize');
const connection = require('../config/db');

const Admin = connection.define('admin',{
    nome:{
        type: Sequelize.STRING,
        allowNull: false
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },
    senha:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

Admin.sync({force:false});

module.exports = Admin;