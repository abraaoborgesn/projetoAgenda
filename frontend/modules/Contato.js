// import { validate } from "webpack/node_modules/schema-utils"

import validator from 'validator'


export default class Contato {
    constructor(formClass) {
        this.form = document.querySelector(formClass)
    }

    init() {
        this.events()
        
    }

    events() {
        if (!this.form) return
        this.form.addEventListener('submit', e => {
            e.preventDefault()
            this.validate(e)
        })
    }

    validate(e) {
        const el = e.target

        const nomeInput = el.querySelector('input[name="nome"')
        // console.log(nomeInput.value)
        const emailInput = el.querySelector('input[name="email"]')
        const telefoneInput = el.querySelector('input[name="telefone"]')

        let error = false

        if (nomeInput.value.length === 0) {
            alert('Nome precisa ser preenchido')
            error = true
        }

        if (emailInput.value.length > 0 && !validator.isEmail(emailInput.value)) {
            alert('E-mail inválido')
            error = true
        }

        if (emailInput.value.length === 0 && telefoneInput.value.length === 0) {
            alert('Pelo menos um campo de contato precisa ser preenchido: e-mail ou telefone')
            error = true
        }

        if (!error) {
            el.submit()
        }

    }
}