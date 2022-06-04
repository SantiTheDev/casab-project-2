require('dotenv').config()
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken')
const smg = require('@sendgrid/mail')

// configuracion de los tokens para validar correos

const getToken = (payload) => {
    return jwt.sign({
        data: payload
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m'})
}

const getDataToken = (token) => {
    let data = null
    console.log(token)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decode)=>{
        if(err){
            console.log('error al obtener data')
            console.log(err)
        }else{
            data = decode
        }
    })
    return data;
}

const mail = {
    email: 'nonreplyblockchain@gmail.com',
    password: 'q1w2e3r4t1010'
}

smg.setApiKey('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')

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 456,
    secure: false,
    auth: {
        user: mail.email,
        pass: mail.password
    },
    tls: {
        rejectUnauthorized: false
    }
})
/*
const sendEmail = async(email, subject, html) => {
    try {
        await transporter.sendMail({
            from: `BlockChainAPP <${ mail.email }>`,
            to: email,
            subject,
            text: 'No responder a este email',
            html
        })
    } catch (error) {
        console.log(error)
    }
}
*/

const sendEmail = async(email, subject, html)=> {
    const msg = {
        to: email, // Change to your recipient
        from: mail.email, // Change to your verified sender
        subject: subject,
        text: 'and easy to do anywhere, even with Node.js',
        html: html,
      }
      smg
        .send(msg)
        .then(() => {
          console.log('Email sent')
        })
        .catch((error) => {
          console.error(error)
        })
}
const getTemplateCorreo = (name, token) => {
    return `
    <div class="email-content">
    <h2>Hi ${ name }</h2>
    <p>Para confirmar tu cuenta, has click en el siguiente texto</p>
    <a href="http://localhost:3000/api/user/activate/${token}">Confirmar cuenta</a>
</div>
    `
}
const getTemplateCode = (name, code) =>{
    return `
    <div class="email-content">
    <h2>Hi ${ name }</h2>
    <p>Este es tu codigo de inicio de sesion, no olvides que expira en 2minutos</p>
    <h1> ${code}</h1>
</div>
    `
}
const getTemplateRecovery = (name, token) => {
    return `
    <div class="email-content">
    <h2>Hi ${ name }</h2>
    <p>Has olvidado tu contrasenia, por lo tanto hemos enviado un link a este correo</p>
    <p>para que puedas recuperarla, si no has sido tu puedes ignorar este correo.</p>
    <a href="http://localhost:3000/api/user/activate/${token}">Confirmar cuenta</a>
</div>
    `
}


module.exports = {
    sendEmail,
    getTemplateCorreo,
    getTemplateCode,
    getDataToken,
    getToken,
    getTemplateRecovery
}