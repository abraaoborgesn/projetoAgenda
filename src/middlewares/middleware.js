exports.middlewareGlobal = (req, res, next) => {
    res.locals.errors = req.flash('errors')   // capturando os flash errors 
    res.locals.success = req.flash('success')   // capturando os flash errors 
    res.locals.user = req.session.user
    next()
}

exports.outroMiddleware = (req, res, next) => {
    next()
}

exports.checkCsrfError = (err, req, res, next) => {
    if (err) {
        return res.render('404')
    }

    next()
}

exports.csrfMiddleware = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken()
    next()
}

exports.loginRequired = (req, res, next) => {   // testando se o usuuário está logado
    if (!req.session.user) {                // se não tiver
        req.flash('errors', 'Você precisa fazer login') // manda uma mensagem de erro
        req.session.save(() => res.redirect('/')) // importante que sempre precisa salvar a sessão, quando for redirecionar a página
        return
    }

    next()
}