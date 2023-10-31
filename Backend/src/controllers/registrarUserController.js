const conexion = require('../database/db');
const envioEmail  = require('../services/envio_email')

function verificacioncampos(usuario, callback) {
    const reg_text = /^[A-Za-zÁ-Úá-ú\s]+$/;
    const reg_email = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const reg_tel = /^\d{8}$/;
    const reg_licencia = /^\d{13}$/;
    const fechaActual = new Date();
    const fecha_nacimiento = new Date(usuario.fecha_nacimiento)
    const diferenciaAnios = fechaActual.getFullYear() - fecha_nacimiento.getFullYear();
        
    if (!reg_text.test(usuario.nombre)) {
        callback("ERROR al ingreso nombre",false)
        return;
    }
    if (!reg_text.test(usuario.apellido)) {
        callback("ERROR al ingreso apellido", false)
        return ;
    }
    if (!reg_email.test(usuario.coreo_electronico)) {
        callback("ERROR al ingreso correo", false)
        return ;
    }
    if (!reg_tel.test(usuario.numero_telefono)) {
        callback("ERROR al ingreso telefono", false)
        return;
    }
    if (usuario.rol == 'CLIENTE'){
        if (!reg_licencia.test(usuario.numero_licencia)) {
            callback("ERROR al ingresar numero de licencia", false)
            return;
        }
        if ((diferenciaAnios) < 18) {
            callback("ERROR no tiene mayoria de edad", false)
            return
        }
    }
    callback(null, true)
    return;
}



const postRegistrarcliente = (req,res) => {
    const jsonclientes = req.body
    insertarcliente(jsonclientes,(err, results) => {
        if (err) {
            res.status(400).json({ mensaje: err, estatus: false });
            return;
        }
        res.status(200).json({ mensaje: results, estatus: true });
    });    
};

const postRegistraEmpleado = (req, res) => {
    const jsonEmpleado = req.body
    insertarEmpleado(jsonEmpleado, (err, results) => {
        if (err) {
            res.status(400).json({ mensaje: err, estatus: false });
            return;
        }
        envioEmail.envioMensaje(jsonEmpleado.coreo_electronico, "Confirmacion de Registro Empleado", envioEmail.confirmacionhtml)
        res.status(200).json({ mensaje: results, estatus: true });
    });
};


const insertarcliente = (jsonclientes,callback) => {
    jsonclientes.rol ='CLIENTE';
    verificacioncampos(jsonclientes, (message, bandera) =>{
        if(!bandera){            
            callback(message, null)
            return;
        }else{
            conexion.query('INSERT INTO usuario SET ?', jsonclientes, function (error, result) {
                if (error) {
                    callback(error.message, null)
                    return;
                }
                if(result.length > 0){
                    callback(null, "Registro Exitoso Cliente ");
                }else{
                    callback("El resgistro no se pudo Realizar",null);
                }
                
                return;
            })
        }
    })
}

const insertarEmpleado = (jsonEmpleado,callback) => {
    jsonEmpleado.rol = 'EMPLEADO';
    verificacioncampos(jsonEmpleado,(message,bandera) => {
        if (!bandera){
            callback(message, null)
            return;
        }else{
            conexion.query('INSERT INTO usuario SET ?', jsonEmpleado, function (error,result) {
                if (error) {
                    callback(error.message, null)
                    return;
                }
                if (result.length > 0) {
                    callback(null, "Registro Exitoso Empleado ");
                } else {
                    callback("El resgistro no se pudo Realizar", null);
                }

                return;
            })
        }
    })
}

module.exports = {
    postRegistrarcliente,
    postRegistraEmpleado,
}
