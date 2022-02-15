require('dotenv').config()

const express = require('express')
const app = express()     // carregando o express
const mongoose = require('mongoose')

mongoose.connect(process.env.CONNECTIONSTRING, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    })
.then(() => {
    console.log('conectei à base de dados')
    app.emit('pronto')
})
.catch(e => console.log(e))

const session = require('express-session') // guardar informações nos cookies
const MongoStore = require('connect-mongo') // sessões vão ser salvas na base de dados, para não salvar em memória
const flash = require('connect-flash') // mensagens "auto-destrutivas". Mandar mensagens de erros e afins. Salvas em sessões tbm. Nãi funciona sem session


const routes = require('./routes')
const path = require('path')// mandando o caminho absoluto
// const helmet = require('helmet') // recomendação do próprio express
const csrf = require('csurf') // csrf tokens para nossos formulários. para nenhum site externo possa postar coisas na nossa aplicação

const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware') // trazendo os middlewares (funções para ser usadas entre rotas, por exemplo) para usar nas rotas mais embaixo.

// https://www.facebook.com/profiles/12345?campanha=googleads&nome_campanha=teste
//                                   "12345" = params   "?" "&" = query strings   

// app.use(helmet()) // chamando o helmet

app.use(express.urlencoded({ extended: true }))  // SERVE PARA RECEBER O CONTEUDO (POST) ENVIADO DO FORMULÁRIO E MANDADO PARA UM OBJETO
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'public'))) // todos arquivos estáticos na nossa aplicação e arquivos que devem ser acessados diretamente, tudo que tiver na pasta public pode ser acessado diretamente

const sessionOptions = session({
    secret: 'aoishd io haoidh oiahdsi()',
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 60 * 7,
        httpOnly: true
    }
})
app.use(sessionOptions)
app.use(flash())


app.set('views', path.resolve(__dirname, 'src', 'views')) //ou poderia mandar o caminho relativo: "./src/views"  OBS.: MAS NÃO É MUITO ACONSELHAVEL, PASSÍVEL DE ERROS
app.set('view engine', 'ejs') // qual o engine para renderizar o html através do ejs (BOM PQ É PARECIDO COM O JS)

// Nossos próprios Middlewares
// ESSES MIDDLES SÃO TIPO MAS PÁGINAS COM FUNÇÕES QUE VÃO SER UTILIZADAS EM QUALQUER ROTA DO NOSSO PROJETO, PODEMOS UTILIZAR PARA QUALQUER MOTIVO
app.use(csrf())
app.use(middlewareGlobal) // middleware sem rota. O middlewareGlobal está disponível em todas as rotas
app.use(checkCsrfError) // ESSE MIDDLEWARE SERVE PARA MANDAR UMA PAGINA DE ERRO SE O CSFR NÃO TIVER TOKEN
app.use(csrfMiddleware) 
app.use(routes)

app.on('pronto', () => {app.listen(3000, () => {
    console.log('Acessar http://localhost:3000')
    console.log('Servidor executando na porta 3000')
})
})
