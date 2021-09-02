const express = require('express');
const router = express.Router();

const Editora = require('../editoras/Editora');
const Livro = require('./Livro');

// Listar
router.get('/livros', (req, res)=>{
    let idErro = req.flash('idErro')
    idErro = (idErro == undefined || idErro.length == 0 ) ? undefined : idErro ;

    Livro.findAll({
        order: [['id','DESC']],
        include: [{
            model: Editora,
            required: true
        }]
    }).then(livros=>{
        res.render('admin/livros/index', {livros:livros,idErro});
    });
});

//Criar
router.get('/livros/criar', (req,res)=>{
    let codErro = req.flash('codErro');
    let nomeErro = req.flash('nomeErro');
    let autorErro = req.flash('autorErro');
    let quantErro = req.flash('quantErro');
    let editoraErro = req.flash('editoraErro');
    let lancamentoErro = req.flash('lancamentoErro');

    codErro = (codErro == undefined || codErro.length == 0) ? undefined : codErro
    nomeErro = (nomeErro == undefined || nomeErro.length == 0) ? undefined : codErro
    autorErro = (autorErro == undefined || autorErro.length == 0) ? undefined : autorErro
    quantErro = (quantErro == undefined || quantErro.length == 0) ? undefined : quantErro
    editoraErro = (editoraErro == undefined || editoraErro.length == 0) ? undefined : editoraErro
    lancamentoErro = (lancamentoErro == undefined || lancamentoErro.length == 0) ? undefined : lancamentoErro

    Editora.findAll().then(editora=>{
        res.render('admin/livros/novo', {editora:editora,
            codErro,nomeErro,
            autorErro,quantErro,
            editoraErro,lancamentoErro
        });
    });
});

router.post('/livros/salvar', (req,res)=>{
    let cod_livro = req.body.codigo;
    let nome = req.body.nome;
    let autor = req.body.autor;
    let quant = req.body.quant;
    let editora = req.body.editora
    let lancamento = req.body.lancamento;

    let codErro,nomeErro,autorErro,quantErro,editoraErro,lancamentoErro;

    if(cod_livro == undefined || cod_livro == ""){
        codErro = "Você precisa por o código do livro."
    }
    if(nome == undefined || nome == ""){
        nomeErro = "Você precisa informar o nome do livro."
    }
    if(autor == undefined ||  autor == ""){
        autorErro = "Vocẽ precisa informar o nome do autor."
    }
    if(quant <= 0){
        quantErro = "Quantidade invalida"
    }
    if(editora == undefined || editora == ""){
        editoraErro = "Você precisa informar a editora"
    }
    if(lancamento == undefined || lancamento == ""){
        lancamentoErro = "informe a data de lançamento"
    }

    if (codErro != undefined || nomeErro != undefined || autorErro != undefined || quantErro != undefined || editoraErro != undefined || lancamentoErro != undefined) {
        req.flash('codErro', codErro);
        req.flash('nomeErro', nomeErro);
        req.flash('autorErro', autorErro);
        req.flash('quantErro', quantErro);
        req.flash('editoraErro', editoraErro);
        req.flash('lancamentoErro', lancamentoErro);
        
        res.redirect('/livros/criar');
    } else {

        Livro.create({
            nome:nome,
            cod_livro: cod_livro,
            autor:autor,
            quant:quant,
            lancamento:lancamento,
            editoraId:editora
        }).then(()=>{
            res.redirect('/livros');
        }).catch((erro)=>{
            res.redirect('/');
            console.log(erro);
        });        
    }
});

// Deletar
router.post('/livros/deletar', (req,res)=>{
    let id = req.body.id;
    let idErro;

    if(id != undefined){
        if(!isNaN(id)){
            Livro.destroy({
                where:{id:id}
            }).then(()=>{
                res.redirect('/livros/');
            });
        }else{
            idErro = "Livro não foi encontrada";
            req.flash('idErro', idErro);

            res.redirect('/livros');            
        }
    }else{
        idErro = "Livro não foi encontrada";
        req.flash('idErro', idErro);

        res.redirect('/livros');
    }
});

// Editar
router.get('/livros/edit/:id', (req,res)=>{
    let id = req.params.id;
    
    let idErro = req.flash('idErro');
    let codErro = req.flash('codErro');
    let nomeErro = req.flash('nomeErro');
    let autorErro = req.flash('autorErro');
    let quantErro = req.flash('quantErro');
    let editoraErro = req.flash('editoraErro');
    let lancamentoErro = req.flash('lancamentoErro');

    idErro = (idErro == undefined || idErro.length == 0 ) ? undefined : idErro ;
    codErro = (codErro == undefined || codErro.length == 0) ? undefined : codErro;
    nomeErro = (nomeErro == undefined || nomeErro.length == 0) ? undefined : nomeErro ;
    autorErro = (autorErro == undefined || autorErro.length == 0) ? undefined : autorErro ;
    quantErro = (quantErro == undefined || quantErro.length == 0) ? undefined : quantErro ;
    editoraErro = (editoraErro == undefined || editoraErro.length == 0) ? undefined : editoraErro ;
    lancamentoErro = (lancamentoErro == undefined || lancamentoErro.length == 0) ? undefined : lancamentoErro ;
    
    if (id != undefined){
        if(!isNaN(id)){
            Livro.findOne({where:{id:id}}).then(livro =>{
                Editora.findAll().then(editora=>{
                    res.render('admin/livros/edit', {livro:livro, editora:editora,
                        idErro,codErro,
                        nomeErro,autorErro,
                        quantErro,editoraErro,
                        lancamentoErro
                    });
                })
            });
        }else{
            idErro = "Livro não foi encontrada";
            req.flash('idErro', idErro);
            // console.log('Erro');
            res.redirect('/livros');
        }
    }else{
        idErro = "Livro não foi encontrada";
        req.flash('idErro', idErro);
        console.log('Erro');
        res.redirect('/livros');            
    }
});

router.post('/livros/alterar', (req,res)=>{
    let id = req.body.id;
    let cod_livro = req.body.codigo;
    let nome = req.body.nome;
    let autor = req.body.autor;
    let quant = req.body.quant;
    let editora = req.body.editora
    let lancamento = req.body.lancamento;

    let codErro,nomeErro,autorErro,quantErro,editoraErro,lancamentoErro,idErro;;

    if (id == undefined || id == ""){
        idErro = "Livro não encontrado ou inexistente.";
    }
    if(cod_livro == undefined || cod_livro == ""){
        codErro = "Você precisa por o código do livro."
    }
    if(nome == undefined || nome == ""){
        nomeErro = "Você precisa informar o nome do livro."
    }
    if(autor == undefined ||  autor == ""){
        autorErro = "Vocẽ precisa informar o nome do autor."
    }
    if(quant <= 0){
        quantErro = "Quantidade inválida"
    }
    if(editora == undefined || editora == ""){
        editoraErro = "Você precisa informar a editora"
    }
    if(lancamento == undefined || lancamento == ""){
        lancamentoErro = "informe a data de lançamento"
    }

    if (codErro != undefined || nomeErro != undefined || autorErro != undefined || quantErro != undefined || editoraErro != undefined || lancamentoErro != undefined) {
        req.flash('codErro', codErro);
        req.flash('nomeErro', nomeErro);
        req.flash('autorErro', autorErro);
        req.flash('quantErro', quantErro);
        req.flash('editoraErro', editoraErro);
        req.flash('lancamentoErro', lancamentoErro);
        
        res.redirect('/livros/edit/'+id);
    } else if(idErro != undefined){
        
        req.flash('idErro', idErro);
        res.redirect('/livros');

    }else{
        Livro.update({
            nome:nome,
            cod_livro: cod_livro,
            autor:autor,
            quant:quant,
            lancamento:lancamento,
            editoraId:editora
        },{
            where: {id:id}
        }).then(()=>{
            res.redirect('/livros');
        });
    }
});

module.exports = router;