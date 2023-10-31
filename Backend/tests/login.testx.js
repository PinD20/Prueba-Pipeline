const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const loginController = require('../src/controllers/login');
const db = require('../src/database/db');
const jwt = require('jsonwebtoken');

// Configura Sinon para simular llamadas a la base de datos
const sandbox = sinon.createSandbox();
const queryStub = sandbox.stub(db, 'query');

describe('Login Controller', () => {
  it('inicio de sesión correcto', async () => {
    queryStub.yields(null, [{ "Exito" : 1 }]);
    
    const jwtSignStub = sandbox.stub(jwt, 'sign');
    jwtSignStub.returns('fake_token');
    
    const req = {
      body: {
        user: 'janesmith',
        password: 'password',
      },
    };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };

    // Llama al controlador de inicio de sesión
    await loginController.postLogin(req, res);

    expect(res.json.calledWith({ token: 'fake_token' })).to.be.true;
  });
  
  // Después de cada prueba, restaura los stubs de Sinon
  afterEach(() => {
    sandbox.restore();
  });
});
