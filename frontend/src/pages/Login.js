import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import jwt from 'jwt-decode';

function errorMessage(message) {
  Swal.fire({
    icon: 'error',
    text: message,
    confirmButtonText: 'Entendido'
  });
}

function Login() {
  const navigate = useNavigate();
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene la recarga de la página por defecto
    const data = {
      user: user.trim(),
      password: password.trim()
    };
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.status === 200) {
        response.json().then(data => {
          localStorage.setItem('token', data.token);
          setUser('');
          setPassword('');
          const decoded = jwt(data.token);
          if (decoded.role === 'C') navigate('/modulo-cliente');
          else if (decoded.role === 'E') navigate('/modulo-empleado');
          else if (decoded.role === 'A') navigate('/modulo-administrador');
          else console.log('Error: Rol no reconocido');
        });
      } else {
        response.json().then(data => {
          errorMessage(data.error);
        });
      }
    } catch (error) {
      // Maneja errores de red o excepciones aquí
      console.error('Error de red o excepción:', error);
    }
  };
  return (
    <div className="container mt-5">
      <div className="row justify-content-center" style={{marginTop:"14%"}}>
        <div className="col-md-8">
          <div className="card">
            <div className="card-header" style={{fontWeight:"500", textAlign:"center"}}>
              Ingresa a tu cuenta
            </div>
            <div className="card-body">
              <form id="loginForm" onSubmit={handleSubmit}>                   
                <div className="mb-3">
                  <label htmlFor="user" className="form-label">Usuario</label>
                  <input
                    maxLength={100}
                    type="text"
                    className="form-control"
                    id="user"
                    value={user}
                    onChange={(e) => setUser(e.target.value.toString())}
                    required
                    />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <input
                    maxLength={20}
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value.toString())}
                    required
                    />
                </div>
                <div className='mb-3' style={{textAlign:"right"}}>
                  <p className="mt-3">¿Eres nuevo? <span className="link">
                    <span className="text-primary" onClick={handleShowModal}>Regístrate</span></span>
                  </p>
                </div>
                <div style={{textAlign:"center"}}>
                  <button type="submit" className="btn btn-primary">Iniciar sesión</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton={false}>
          <center>
            <Modal.Title>Seleccione el tipo de Usuario</Modal.Title>
          </center>
        </Modal.Header>
        <Modal.Body>
          <center>
            <Link to="/registro-empleado"><Button variant="btn btn-info" className="mb-2">Empleado</Button></Link>
            <Link to="/registro-cliente" ><Button variant="btn btn-warning" style={{marginLeft:"20px", width:"100px"}} className="mb-2">Cliente</Button></Link>
          </center>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="btn btn-danger" onClick={handleCloseModal}>Cancelar</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Login;