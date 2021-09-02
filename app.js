const express = require('express');
const app = express();

const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser')

const connection = require('./config/db');

// Controllers
const adminController = require('./admin/adminController');
const editoraController = require('./editoras/editoraController');
const livroController = require('./livros/livroController');
const usuarioController = require('./usuarios/UsuarioController');
const aluguelController = require('./aluguel/aluguelController');

// Models
const Admin = require('./admin/Admin');
const Editoras = require('./editoras/Editora');
const Livro = require('./livros/Livro');
const Usuario = require('./usuarios/Usuario');
const Aluguel = require('./aluguel/Aluguel');

// Cookie Parser
app.use(cookieParser('Locadora'));

// Session
app.use(session({
    secret: "Locadora",
    resave: false,
    saveUninitialized: true,
    }));

app.use(flash());

// View Engine
app.set('view engine','ejs');

// Static
app.use(express.static('public'));

// Body Parser
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// Database
connection.authenticate().then(()=>{
    console.log("Conectado com o database");
}).catch((erro)=>{
    console.log(erro);
});

app.use('/', adminController);
app.use('/', editoraController);
app.use('/', livroController);
app.use('/', usuarioController);
app.use('/', aluguelController);

app.get('/', (req,res)=>{
    res.render('index');
});
app.get('/sobre', (req,res)=>{
    res.render('sobre');
})

const adminAuth = require('./config/adminAuth');

app.get('/home', (req,res)=>{
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

        res.render('home',{
            aluguel: aluguel,
        });
    })
});

app.listen(3000, ()=>{
    console.log("Servidor rodando na porta 3000");
});