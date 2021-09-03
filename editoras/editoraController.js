const express = require('express');
const router = express.Router();
const adminAuth = require('../config/adminAuth');

const Editora = require('./Editora');

// Listar
router.get('/editoras', adminAuth, (req,res)=>{
    let idErro = req.flash('idErro');
    idErro = (idErro == undefined || idErro.length == 0 ) ? undefined : idErro ;

    Editora.findAll().then(editoras=>{
        res.render('admin/editoras/index', {editoras:editoras, idErro});
    });
});

// Criar
router.get('/editoras/criar', adminAuth, (req,res)=>{
    var nomeErro = req.flash('nomeErro');
    var cidadeErro = req.flash('cidadeErro');

    nomeErro = (nomeErro == undefined || nomeErro.lenght == 0) ? undefined : nomeErro
    cidadeErro = (cidadeErro == undefined || cidadeErro.lenght == 0) ? undefined : cidadeErro


    res.render('admin/editoras/novo', {nomeErro,cidadeErro});
});

router.post('/editoras/salvar', adminAuth, (req,res)=>{
    let nome = req.body.nome;
    let cidade = req.body.cidade;

    let nomeErro;
    let cidadeErro;
    
    if(nome == undefined || nome == ""){
        nomeErro = "Você precisa informar o nome da Editora."
    }
    if (cidade == undefined || cidade == ""){
        cidadeErro = "Você precisa informar a cidade da Editora."
    }
    
    if (nomeErro != undefined ||cidadeErro != undefined){
        req.flash('nomeErro', nomeErro);
        req.flash('cidadeErro', cidadeErro);

        res.redirect('/editoras/criar');
    }else{

        Editora.findOne({where:{nome:nome}}).then(editora=>{
            if(editora == undefined){
                Editora.create({
                    nome:nome,
                    cidade:cidade
                }).then(()=>{
                    res.redirect('/editoras');
                }).catch((erro)=>{
                    res.redirect('/editoras/criar');
                });
            }else{
                nomeErro = "Nome da Editora já existe.";
                req.flash('nomeErro', nomeErro);
                res.redirect('/editoras/criar');
            }
        });
    }
});

// Deletar
router.post('/editoras/apagar', adminAuth, (req,res)=>{
    let id = req.body.id;
    let idErro;

    if(id != undefined){
        if(!isNaN(id)){
            Editora.destroy({
                where:{id:id}
            }).then(()=>{
                res.redirect('/editoras/');
            });
        }else{
            idErro = "Editora não foi encontrada ou não existe";
            req.flash('idErro', idErro);

            res.redirect('/editoras');            
        }
    }else{
        idErro = "Editora não foi encontrada ou não existe";
        req.flash('idErro', idErro);

        res.redirect('/editoras');
    }
});

// Editar
router.get('/editoras/edit/:id', adminAuth, (req,res)=>{
    let id = req.params.id;
    let idErro;

    let nomeErro = req.flash('nomeErro');
    let cidadeErro = req.flash('cidadeErro');

    nomeErro = (nomeErro == undefined || nomeErro.lenght == 0) ? undefined : nomeErro
    cidadeErro = (cidadeErro == undefined || cidadeErro.lenght == 0) ? undefined : cidadeErro
    
    if(id != undefined){
        if(!isNaN(id)){
            Editora.findOne({
                where:{id:id}
            }).then(editora=>{
                res.render('admin/editoras/edit', {editora:editora, nomeErro, cidadeErro});
            });
        }else{
            idErro = "Editora não foi encontrada";
            req.flash('idErro', idErro);

            res.redirect('/editoras');            
        }
    }else{
        idErro = "Editora não foi encontrada";
        req.flash('idErro', idErro);

        res.redirect('/editoras');            
    }
});

router.post('/editoras/alterar', adminAuth, (req,res)=>{
    let id = req.body.id;
    let nome = req.body.nome;
    let cidade = req.body.cidade;

    let nomeErro;
    let cidadeErro;
    let idErro;
    
    if (id == undefined || id == ""){
        idErro = "Não foi possível alterar o item ";
    }
    if(nome == undefined || nome == ""){
        nomeErro = "Você precisa informar o nome da Editora.";
    }
    if (cidade == undefined || cidade == ""){
        cidadeErro = "Você precisa informar a cidade da Editora.";
    }
    
    if (nomeErro != undefined ||cidadeErro != undefined){
        req.flash('nomeErro', nomeErro);
        req.flash('cidadeErro', cidadeErro);

        res.redirect('/editoras/edit/'+id);
    }else if(idErro != undefined){
        req.flash('idErro', idErro);
        res.redirect('/editoras');

    }else{
        Editora.update({
            nome:nome,
            cidade:cidade
        },{
            where:{id:id}
        }).then(()=>{
            res.redirect('/editoras');
        });
    }
});

module.exports = router;