const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const registrarUserController = require('../src/controllers/registrarUserController');

describe('RegistrarUserController', () =>  {
  it('debería registrar exitosamente client', async () => {
    // Simula los datos del cuerpo de la solicitud
    const req = {
      body: {
            "nombre": "Daniel",
            "apellido": "Minchez",
            "fecha_nacimiento": "2001-01-01",
            "numero_licencia": "1234567891234",
            "direccion": "Mixco",
            "coreo_electronico": "danielminchez@gmail.com",
            "numero_telefono": "35588601",
            "usuario": "admin",
            "contrasenia": "daniel123"
        },
    };

    // Simula el objeto de respuesta
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // Llama al controlador de registro de cliente
    await registrarUserController.postRegistrarcliente(req, res);
    // Verifica si la función "json" se llamó con el resultado esperado
    expect(res.json.calledWith({ mensaje: 'Registro Exitoso Cliente ', estatus: true })).to.be.false;
  });

});


describe('RegistrarUserController', () =>  {
    it('debería registrar exitosamente empleado', async () => {
      // Simula los datos del cuerpo de la solicitud
      const req = {
        body: {
            "nombre": "Chino2",
            "apellido": "S",
            "direccion": "456 Elm St",
            "coreo_electronico": "josuechoc4567@gmail.com",
            "numero_telefono": "12345678",
            "usuario": "janesmith2",
            "contrasenia": "password"
            },
      };
  
      // Simula el objeto de respuesta
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.stub(),
      };
  
      // Llama al controlador de registro de cliente
      await registrarUserController.postRegistraEmpleado(req, res);
      // Verifica si la función "json" se llamó con el resultado esperado
      expect(res.json.calledWith({ mensaje: 'Registro Exitoso Empleado ', estatus: true })).to.be.false;
    });
  
  });
// Repite el proceso para el controlador "postRegistraEmpleado" y otros controladores según sea necesario.
