const Sequelize = require('sequelize');
const connection = require('../config/db');

const Livro = require('../livros/Livro');
const Usuario = require('../usuarios/Usuario');

const Aluguel = connection.define('alugueis',{
    data_aluguel:{
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    previsao:{
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    devolucao:{
        type: Sequelize.DATEONLY,
        allowNull: true
    },
});

Aluguel.sync({force:false});

Aluguel.belongsTo(Livro);
Aluguel.belongsTo(Usuario);

module.exports = Aluguel;