require('dotenv').config({ path: require('find-config')('.env') });
const envioEmail  = require('../services/envio_email');
const db = require('../database/db');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;
let codigo = '';

const postLogin = (req, res) => {
  const { user, password } = req.body;
  verifyCredentials(user, password, (err, results) => {
    if (err) {
      res.status(400).json({ error: err.message});
      return;
    }
    res.status(200).json(results);
  });
};
  
const verifyCredentials = (usuario, password, callback) => {
  let sql;
  if(password == codigo && codigo !=''){
    sql = 'SELECT * FROM usuario WHERE usuario = ? AND contrasenia != ?';
  }else{
    sql = 'SELECT * FROM usuario WHERE usuario = ? AND contrasenia = ?';
  }
  const sql1 = 'SELECT * FROM usuario WHERE usuario = ?'
  db.query(sql, [usuario, password], (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }
    if (results.length > 0) {
      const user = results[0];
      const token = jwt.sign({ userId: user.idusuario, username: user.nombre, role: user.rol }, SECRET_KEY, { expiresIn: '1h' });
      codigo = '';
      callback(null, {token});
    } else {
      //callback(new Error('Error al verificar las credenciales'), null);
      db.query(sql1, [usuario], (err, results) => {
        if (err) {
          callback(err, null);
          return;
        }
        if (results.length > 0) {
          callback(new Error('Error al verificar la contraseña'), null);
        } else {
          callback(new Error('El usuario no existe'), null);
        }
      });
    }
  });
};


const sendCodigo = (req, res) => {
  try {
    const { user } = req.body;
    verifyCorreo(user, (err, results) => {
      if (err) {
        res.status(400).json({ error: err.message});
        return;
      }
      const correo = results;
      console.log(results)
      while (codigo.length < 10) {
        const numeroAleatorio = Math.floor(Math.random() * 10);
        codigo += numeroAleatorio;
      }
      envioEmail.envioMensaje(correo, 'Codigo de acceso: ' + codigo, envioEmail.codigohtml);
      res.status(200).json({ message: 'Código enviado exitosamente' });
    });
  } catch (error) {
    res.status(400).json({ error: 'Error al enviar el código por correo' });
  }
};

const verifyCorreo = (usuario, callback) => {
  const sql = 'SELECT * FROM usuario WHERE usuario = ?';
  db.query(sql, [usuario], (err, results) => {
    if (err) {
      callback(err, null);
      return;
    }
    if (results.length > 0) {
      callback(null, results[0].coreo_electronico);
    } else {
      callback(new Error('El usuario no existe'), null);
    }
  });
};


module.exports = {
  postLogin,
  sendCodigo,
};