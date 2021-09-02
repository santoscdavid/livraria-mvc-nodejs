const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const validator = require("email-validator");

const Admin = require('./Admin');

// Listar
router.get('/admin/', (req, res) => {
    let idErro = req.flash('idErro');
    idErro = (idErro == undefined || idErro.length == 0) ? undefined : idErro;

    Admin.findAll({
        order: [
            ['id', 'DESC']
        ]
    }).then(admin => {
        res.render('admin/admin/index', {
            admin: admin,
            idErro
        });
    });
});

// Criar
router.get('/admin/criar', (req, res) => {
    let nomeErro = req.flash('nomeErro');
    let emailErro = req.flash('emailErro');
    let senhaErro = req.flash('senhaErro');

    nomeErro = (nomeErro == undefined || nomeErro.length == 0) ? undefined : nomeErro;
    emailErro = (emailErro == undefined || emailErro.length == 0) ? undefined : emailErro;
    senhaErro = (senhaErro == undefined || senhaErro.length == 0) ? undefined : senhaErro;

    res.render('admin/admin/novo', {
        nomeErro,
        emailErro,
        senhaErro
    });
});

router.post('/admin/salvar', (req, res) => {
    let nome = req.body.nome;
    let email = req.body.email;
    let senha = req.body.senha;
    let nomeErro, emailErro, senhaErro;
    let emailCheck;

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
    if (senha == undefined || senha == "") {
        senhaErro = "Digite sua senha"
    }
    if (senha.lenght <= 6) {
        senhaErro = "Senha muito curta";
    }

    if (nomeErro != undefined || emailErro != undefined || senhaErro != undefined) {
        req.flash('nomeErro', nomeErro);
        req.flash('emailErro', emailErro);
        req.flash('senhaErro', senhaErro);
        console.log("erro")
        res.redirect('/admin/criar')
    } else {

        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(senha, salt);

        Admin.findOne({
            where: {
                email: email
            }
        }).then(admin => {
            if (admin == undefined) {
                Admin.create({
                    nome: nome,
                    email: email,
                    senha: hash
                }).then(() => {
                    res.redirect('/admin');
                });
            } else {
                emailErro = "Esse Email já existe";
                req.flash('emailErro', emailErro);
                res.redirect('/admin/criar');
            }
        }).catch((erro) => {
            emailErro = "Esse Email já existe";
            req.flash('emailErro', emailErro);
            console.log(erro);
            res.redirect('/admin/criar');
        });
    }
});

// Deletar
router.post('/admin/deletar', (req, res) => {
    let id = req.body.id;
    let idErro;

    if (id != undefined) {
        if (!isNaN(id)) {
            Admin.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect('/admin');
            });
        } else {
            idErro = "Admin não foi encontrado";
            req.flash('idErro', idErro);

            res.redirect('/admin');
        }
    } else {
        idErro = "Admin não foi encontrado";
        req.flash('idErro', idErro);

        res.redirect('/admin');
    }
});

// Autenticação
router.post('/autenticar', (req, res) => {
    var email = req.body.email;
    var senha = req.body.senha;

    Admin.findOne({
        where: {
            email: email
        }
    }).then(admin => {
        if (admin != undefined) {
            var correct = bcrypt.compareSync(senha, admin.senha);

            if (correct) {
                req.session.user = {
                    nome: admin.nome,
                    id: admin.id,
                    email: admin.email
                }
                res.redirect('/home');
            } else {
                res.redirect('/');
            }
        } else {
            res.redirect('/');
        }
    });
});

// Logout
router.get('/logout', (req, res) => {
    req.session.user = undefined;
    res.redirect('/');
});

module.exports = router;