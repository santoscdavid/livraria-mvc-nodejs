const express = require('express');
const router = express.Router();
const adminAuth = require('../config/adminAuth');

const validator = require("email-validator");
const User = require('./Usuario')

// Listar
router.get('/usuarios', adminAuth, (req, res) => {
    let idErro = req.flash('idErro');
    idErro = (idErro == undefined || idErro.length == 0) ? undefined : idErro;

    User.findAll({
        order: [
            ['id', 'DESC']
        ]
    }).then(user => {
        res.render('admin/usuarios/index', {
            user,
            idErro
        });
    });
});

//Criar
router.get('/usuarios/criar', adminAuth, (req, res) => {
    let emailErro = req.flash('emailErro');
    let cidadeErro = req.flash('cidadeErro');
    let nomeErro = req.flash('nomeErro');
    let enderecoErro = req.flash('enderecoErro');

    nomeErro = (nomeErro == undefined || nomeErro.length == 0) ? undefined : nomeErro;
    emailErro = (emailErro == undefined || emailErro.length == 0) ? undefined : emailErro;
    cidadeErro = (cidadeErro == undefined || cidadeErro.lenght == 0) ? undefined : cidadeErro;
    enderecoErro = (enderecoErro == undefined || enderecoErro.lenght == 0) ? undefined : enderecoErro

    res.render('admin/usuarios/novo', {
        emailErro,
        cidadeErro,
        nomeErro,
        enderecoErro
    });
});

router.post('/usuarios/salvar', adminAuth, (req, res) => {
    let nome = req.body.nome;
    let email = req.body.email;
    let endereco = req.body.endereco;
    let cidade = req.body.cidade;
    let nomeErro, emailErro, enderecoErro, cidadeErro;

    if (nome == undefined || nome == "") {
        nomeErro = "Digite o seu nome";
    }
    if (email == undefined || email == "") {
        emailErro = "Digite seu email";
    }
    if (email == undefined || email == "") {
        emailErro = "Digite seu email";
    }
    if (email != undefined) {
        emailCheck = validator.validate(email);
    }
    if (emailCheck == false) {
        emailErro = "Digite um email válido";
    }
    if (endereco == undefined || endereco == "") {
        enderecoErro = "Digite o endereço";
    }
    if (cidade == undefined || cidade == "") {
        cidadeErro = "Digite  a cidade";
    }
    if (cidade.lenght <= 2) {
        cidadeErro = "Coloque uma cidade válida"
    }

    if (nomeErro != undefined || emailErro != undefined || cidadeErro != undefined || enderecoErro != undefined) {
        req.flash('nomeErro', nomeErro);
        req.flash('emailErro', emailErro);
        req.flash('enderecoErro', enderecoErro);
        req.flash('cidadeErro', cidadeErro);

        res.redirect('/usuarios/criar');
    } else {
        User.findOne({
            where: {
                email: email
            }
        }).then(user => {
            if (user == undefined) {
                User.create({
                    nome: nome,
                    email: email,
                    endereco: endereco,
                    cidade: cidade,
                }).then(() => {
                    res.redirect('/usuarios');
                })
            } else {
                emailErro = "Esse email já existe";
                req.flash('emailErro', emailErro);
                res.redirect('/usuarios/criar')
            }
        });
    }
});

// Deletar
router.post('/usuarios/deletar', adminAuth, (req, res) => {
    let id = req.body.id;
    let idErro;

    if (id != undefined) {
        if (!isNaN(id)) {
            User.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/usuarios');
            });
        } else {
            idErro = "Usuário não foi encontrado";
            req.flash('idErro', idErro);

            res.redirect('/usuarios');
        }
    } else {
        idErro = "Usuário não foi encontrado";
        req.flash('idErro', idErro);

        res.redirect('/usuarios');
    }
});

// Editar
router.get('/usuarios/edit/:id', adminAuth, (req, res) => {
    let id = req.params.id;
    let idErro;

    let emailErro = req.flash('emailErro');
    let cidadeErro = req.flash('cidadeErro');
    let nomeErro = req.flash('nomeErro');
    let enderecoErro = req.flash('enderecoErro');

    nomeErro = (nomeErro == undefined || nomeErro.length == 0) ? undefined : nomeErro;
    emailErro = (emailErro == undefined || emailErro.length == 0) ? undefined : emailErro;
    cidadeErro = (cidadeErro == undefined || cidadeErro.lenght == 0) ? undefined : cidadeErro;
    enderecoErro = (enderecoErro == undefined || enderecoErro.lenght == 0) ? undefined : enderecoErro;

    if (id != undefined) {
        if (!isNaN(id)) {
            User.findOne({
                where: {
                    id: id
                }
            }).then(user => {
                res.render('admin/usuarios/edit', {
                    user: user,
                    emailErro,
                    cidadeErro,
                    nomeErro,
                    enderecoErro
                });
            })
        } else {
            idErro = "Usuário não foi encontrado";
            req.flash('idErro', idErro);

            res.redirect('/usuarios');
        }
    } else {
        idErro = "Usuário não foi encontrado";
        req.flash('idErro', idErro);

        res.redirect('/usuarios');
    }
});

router.post('/usuarios/alterar', adminAuth, (req, res) => {
    let id = req.body.id;
    let nome = req.body.nome;
    let email = req.body.email;
    let endereco = req.body.endereco;
    let cidade = req.body.cidade;
    let idErro, nomeErro, emailErro, enderecoErro, cidadeErro;

    if (id == undefined || id == "") {
        idErro = "Não foi possível alterar o Usuário";
    }
    if (nome == undefined || nome == "") {
        nomeErro = "Digite o seu nome";
    }
    if (email == undefined || email == "") {
        emailErro = "Digite seu email";
    }
    if (email == undefined || email == "") {
        emailErro = "Digite seu email";
    }
    if (email != undefined) {
        emailCheck = validator.validate(email);
    }
    if (emailCheck == false) {
        emailErro = "Digite um email válido";
    }
    if (endereco == undefined || endereco == "") {
        enderecoErro = "Digite o endereço";
    }
    if (cidade == undefined || cidade == "") {
        cidadeErro = "Digite  a cidade";
    }
    if (cidade.lenght <= 2) {
        cidadeErro = "Coloque uma cidade válida";
    }

    if (nomeErro != undefined || emailErro != undefined || cidadeErro != undefined || enderecoErro != undefined) {
        req.flash('nomeErro', nomeErro);
        req.flash('emailErro', emailErro);
        req.flash('enderecoErro', enderecoErro);
        req.flash('cidadeErro', cidadeErro);

        res.redirect('/usuarios/edit/' + id);
    } else if (idErro != undefined) {
        req.flash('idErro', idErro);
        
        res.redirect('/usuarios');
    } else {
        User.update({
            nome: nome,
            email: email,
            endereco: endereco,
            cidade: cidade,
        }, {
            where: {
                id: id
            }
        }).then(() => {
            res.redirect('/usuarios');
        });
    }
});

module.exports = router;