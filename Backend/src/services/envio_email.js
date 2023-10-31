const nodemailer = require("nodemailer");
const fs = require('fs');

const path = require('path');
const confirmacionhtml = fs.readFileSync(path.join(__dirname, 'confirmacion.html'));
const codigohtml = fs.readFileSync(path.join(__dirname, 'codigo.html'));

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
        user: "analisisdisenogrupo2@gmail.com",
        pass: "lfxangseilyxhfas",
    }
});

//email 
async function envioMensaje(email, mensaje, htmlTemplateConfirmacion) {
    const info = await transporter.sendMail({
        from: '"AlquiMovil" <analisisdisenogrupo2@gmail.com>',
        to: email,
        subject: mensaje,
        html: htmlTemplateConfirmacion
    });
    console.log("Mensaaje sent : %S", info.messageId);
}

//envioMensaje().catch(console.error);






module.exports = { envioMensaje ,confirmacionhtml, codigohtml};