import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

function mostrarMensajeSuccess(mensaje) {
  Swal.fire({
    icon: 'success', // Puedes usar 'success', 'error', 'warning', 'info', etc.
    title: mensaje,
    showConfirmButton: false,
    timer: 2000 // Tiempo en milisegundos para que el mensaje desaparezca automáticamente
  });
}

function mostrarMensajeError(mensaje) {
  Swal.fire({
    icon: 'error', // Puedes usar 'success', 'error', 'warning', 'info', etc.
    title: mensaje,
    showConfirmButton: false,
    timer: 2000 // Tiempo en milisegundos para que el mensaje desaparezca automáticamente
  });
}

function RegistroEmpleado() {
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [direccion, setDireccion] = useState('');
  const [correo, setEmail] = useState('');
  const [telefono, setNumtel] = useState('');
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');

  const handleInputChangeNombre = (e) => {
    const newValue = e.target.value;
    const lettersOnly = newValue.replace(/[^a-zA-Z]/g, ''); // Eliminar todos los caracteres que no son letras
    setNombre(lettersOnly);
  };

  const handleInputChangeApellido = (e) => {
    const newValue = e.target.value;
    const lettersOnly = newValue.replace(/[^a-zA-Z]/g, ''); // Eliminar todos los caracteres que no son letras
    setApellido(lettersOnly);
  };

  const handleInputChangeTelefono = (e) => {
    const newValue = e.target.value.toString();
    const lettersOnly = newValue.replace(/[^0-9]/g, ''); // Eliminar todos los caracteres que no son letras
    setNumtel(lettersOnly);
  };
  // Agrega más estados para otros campos del formulario aquí

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene la recarga de la página por defecto

    // Construye el objeto con los datos del formulario
    const data = {
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      direccion: direccion.trim(),
      coreo_electronico: correo.trim(),
      numero_telefono: telefono.trim(),
      usuario : usuario.trim(),
      contrasenia: password.trim()
      // Agrega más campos aquí
    };

    // Realiza la solicitud POST
    try {
      console.log(data)
      const response = await fetch('http://localhost:5000/registro_empleado', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log()
        // La solicitud fue exitosa, puedes hacer algo en respuesta aquí
        response.json().then(data => {
          // `data` contiene el JSON de respuesta
          console.log(data.mensaje);
          if (data.estatus) {
            setNombre('')
            setApellido('')
            setDireccion('');
            setEmail('')
            setNumtel('')
            setUsuario('')
            setPassword('')
            navigate('/');
            mostrarMensajeSuccess(data.mensaje);
          }
        });
      } else {
        response.json().then(data => {
          mostrarMensajeError(data.mensaje);
        });
      }
    } catch (error) {
      // Maneja errores de red o excepciones aquí
      console.error('Error de red o excepción:', error);
    }
  };
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              Registro de Empleados
            </div>
            <div className="card-body">
              <form id="registrationForm" onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">Nombre</label>
                  <input
                    maxLength={20}
                    type="text"
                    className="form-control"
                    id="nombre"
                    value={nombre}
                    onChange={handleInputChangeNombre}
                    required
                    />
                </div>
                <div className="mb-3">
                  <label htmlFor="apellido" className="form-label">Apellido</label>
                  <input
                    maxLength={20}
                    type="text"
                    className="form-control"
                    id="apellido"
                    value={apellido}
                    onChange={handleInputChangeApellido}
                    required
                    />
                </div>            
                <div className="mb-3">
                  <label htmlFor="direccion" className="form-label">Dirección</label>
                  <input
                    maxLength={50}
                    type="text"
                    className="form-control"
                    id="direccion"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value.toString())}
                    required
                    />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Dirección de correo electrónico</label>
                  <input
                    maxLength={30}
                    type="email"
                    className="form-control"
                    id="email"
                    value={correo}
                    onChange={(e) => setEmail(e.target.value.toString())}
                    required
                    />
                </div>                
                <div className="mb-3">
                  <label htmlFor="telefono" className="form-label">Número de Teléfono</label>
                  <input
                    maxLength={8}
                    type="tel"
                    className="form-control"
                    id="telefono"
                    value={telefono}
                    onChange={handleInputChangeTelefono}
                    required
                    />
                </div>                   
                <div className="mb-3">
                  <label htmlFor="usuario" className="form-label">Usuario</label>
                  <input
                    maxLength={100}
                    type="text"
                    className="form-control"
                    id="usuario"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value.toString())}
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
                <button type="submit" className="btn btn-primary">Registrarse</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistroEmpleado;
