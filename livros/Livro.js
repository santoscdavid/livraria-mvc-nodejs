const Sequelize = require('sequelize');
const connection = require('../config/db');

const Editora = require('../editoras/Editora');

const Livro = connection.define('livros', {

    cod_livro:{
        type: Sequelize.INTEGER,
        allowNull:false
    },
    nome:{
        type: Sequelize.STRING,
        allowNull:false
    },
    autor:{
        type: Sequelize.STRING,
        allowNull: false
    },
    quant:{
        type: Sequelize.INTEGER,
        allowNull:false
    },
    lancamento:{
        type: Sequelize.DATEONLY,
        allowNull: false
    }

});

Livro.sync({force:false});

Editora.hasMany(Livro); 
Livro.belongsTo(Editora); 

module.exports = Livro;