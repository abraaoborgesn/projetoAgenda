const Login = require('../models/LoginModel')

exports.index = (req, res) => {
    if(req.session.user) return res.render('login-logado')
    res.render('login')
}

exports.register = async function (req, res) {

    try {
        const login = new Login(req.body)  // criando uma instancia da classe
        await login.register()

        if (login.errors.length > 0) {
            req.flash('errors', login.errors)
            req.session.save(function () {
                return res.redirect('back')
            })
            return
        }

        req.flash('success', 'Seu usuário foi criado com  sucesso')
        req.session.save(function () {
            return res.redirect('back')
        })

        // return res.send(login.errors)
    } catch (e) {
        console.log(e)
        return res.render('404')
    }

}

exports.login = async function (req, res) {
    
    try {
        const login = new Login(req.body)  // criando uma instancia da classe
        await login.login()

        if (login.errors.length > 0) {   // se ocorrer algum erro
            req.flash('errors', login.errors) // manda uma mensagem flash
            req.session.save(function () {  // se não, cria uma sessão
                return res.redirect('back')
            })
            return
        }

        req.flash('success', 'Você entrou no sistema.')
        req.session.user = login.user //logando o usuário no sistema
        req.session.save(function () {
            return res.redirect('back')
        })

        // return res.send(login.errors)
    } catch (e) {
        console.log(e)
        return res.render('404')
    }

}

exports.logout = function (req, res) {
    req.session.destroy()
    res.redirect('/')
}