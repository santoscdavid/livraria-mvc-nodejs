const express = require('express');
const router = express.Router();

const Aluguel = require('./Aluguel');
const Usuario = require('../usuarios/Usuario');
const Livro = require('../livros/Livro');

// Listar
router.get('/aluguel', (req, res) => {
    let idErro = req.flash('idErro');
    idErro = (idErro == undefined || idErro.length == 0) ? undefined : idErro;

    Aluguel.findAll({
        order: [
            ['id', 'DESC']
        ],
        include: [{
            model: Usuario,
            required: true
        }, {
            model: Livro,
            required: true
        }]
    }).then(aluguel => {
        res.render('admin/aluguel/index', {
            aluguel: aluguel,
            idErro
        });
    })
});

// Criar
router.get('/aluguel/novo', (req, res) => {
    let usuarioErro = req.flash('usuarioErro');
    let livroErro = req.flash('livroErro');
    let reservaErro = req.flash('reservaErro');
    let devolucaoErro = req.flash('devolucaoErro');

    usuarioErro = (usuarioErro == undefined || usuarioErro.length == 0) ? undefined : usuarioErro;
    livroErro = (livroErro == undefined || livroErro.length == 0) ? undefined : livroErro;
    reservaErro = (reservaErro == undefined || reservaErro.length == 0) ? undefined : reservaErro;
    devolucaoErro = (devolucaoErro == undefined || devolucaoErro.length == 0) ? undefined : devolucaoErro;


    Usuario.findAll().then(user => {
        Livro.findAll().then(livro => {
            res.render('admin/aluguel/novo', {
                user: user,
                livro: livro,
                usuarioErro,
                livroErro,
                reservaErro,
                devolucaoErro,
            });
        });
    });
});

router.post('/aluguel/salvar', (req, res) => {
    let usuario = req.body.usuario;
    let livro = req.body.livro;
    let data_aluguel = req.body.data_aluguel;
    let previsao = req.body.previsao;

    console.log(usuario, livro, data_aluguel, previsao);

    let usuarioErro, livroErro, reservaErro, devolucaoErro;

    if (usuario == undefined || usuario == "") {
        usuarioErro = "Informe o Usuário";
    }
    if (livro == undefined || livro == "") {
        livroErro = "Informe o Livro";
    }
    if (data_aluguel == undefined || data_aluguel == "") {
        reservaErro = "Informe a data do aluguel";
    }
    if (previsao == undefined || previsao == "") {
        devolucaoErro = "Informa a data de devolução"
    }
    if (usuarioErro != undefined || livroErro != undefined || reservaErro != undefined || devolucaoErro != undefined) {
        req.flash('usuarioErro', usuarioErro);
        req.flash('livroErro', livroErro);
        req.flash('reservaErro', reservaErro);
        req.flash('devolucaoErro', devolucaoErro);

        res.redirect('/aluguel/novo');
    } else {
        Aluguel.create({
            data_aluguel: data_aluguel,
            previsao: previsao,
            livroId: livro,
            usuarioId: usuario,
        }).then(() => {
            res.redirect('/aluguel');
        });
    }
});

// Deletar
router.post('/aluguel/deletar', (req, res) => {
    let id = req.body.id;
    let idErro;

    if (id != undefined) {
        if (!isNaN(id)) {
            Aluguel.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/aluguel');
            });
        } else {
            idErro = "Aluguel não foi encontrado";
            req.flash('idErro', idErro);

            res.redirect('/aluguel');
        }
    } else {
        idErro = "Aluguel não foi encontrado";
        req.flash('idErro', idErro);

        res.redirect('/aluguel');
    }
});

// Editar
router.get('/aluguel/edit/:id', (req, res) => {
    let id = req.params.id;
    let idErro = req.flash('idErro');
    let usuarioErro = req.flash('usuarioErro');
    let livroErro = req.flash('livroErro');
    let reservaErro = req.flash('reservaErro');
    let devolucaoErro = req.flash('devolucaoErro');

    idErro = (idErro == undefined || idErro.length == 0) ? undefined : idErro;
    usuarioErro = (usuarioErro == undefined || usuarioErro.length == 0) ? undefined : usuarioErro;
    livroErro = (livroErro == undefined || livroErro.length == 0) ? undefined : livroErro;
    reservaErro = (reservaErro == undefined || reservaErro.length == 0) ? undefined : reservaErro;
    devolucaoErro = (devolucaoErro == undefined || devolucaoErro.length == 0) ? undefined : devolucaoErro;

    if (id != undefined) {
        if (!isNaN(id)) {
            Aluguel.findOne({
                where: {
                    id:id
                },
                include: [{
                    model: Usuario,
                    required: true
                }, {
                    model: Livro,
                    required: true
                }]
            }).then(aluguel => {
                Usuario.findAll().then(user => {
                    Livro.findAll().then(livro => {
                        res.render('admin/aluguel/edit', {
                            aluguel:aluguel,
                            user: user,
                            livro: livro,
                            usuarioErro,
                            livroErro,
                            reservaErro,
                            devolucaoErro,
                        });
                    })
                })
            });
        } else {
            idErro = "Aluguel não foi encontrada";
            req.flash('idErro', idErro);

            res.redirect('/aluguel');
        }
    } else {
        idErro = "Aluguel não foi encontrada";
        req.flash('idErro', idErro);

        res.redirect('/aluguel');
    }
});

module.exports = router;