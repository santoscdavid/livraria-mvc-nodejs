const Sequelize = require('sequelize');
const connection = new Sequelize(
    'Locadora',
    'root',
    'password',{
        host: 'localhost',
        dialect: 'mysql',
        timezone: '-03:00', // Para salvar as horas das tabela no horário de Brasília.
    }
);

module.exports = connection;