import React, { useState, useEffect } from 'react';
import { Navbar, Button } from 'react-bootstrap';
import jwt from 'jwt-decode';

function CustomNavbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [decoded, setDecoded] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    const handleTokenChange = () => {
      if (token) {
        const decodedToken = jwt(token);
        setDecoded(decodedToken);
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setDecoded(null);
      }
    };

    // Llamar a handleTokenChange cuando cambia el token
    handleTokenChange();

    // Event listener para cambios futuros en el token
    window.addEventListener('storage', handleTokenChange);

    // Limpiar el event listener cuando el componente se desmonta
    return () => {
      window.removeEventListener('storage', handleTokenChange);
    };
  }, []); 

  const handleCerrarSesion = () => {
    // Limpia el localstorage y redirige a la página de inicio
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/';
  }

  return (
    <Navbar bg="dark" variant="dark" expand="s">
      <Navbar.Brand>AlquiMovil</Navbar.Brand>
      {isLoggedIn && (
        <div className="d-flex align-items-center ml-auto">
          <Button variant='success' className="mr-3">{decoded.username}</Button>
          <Button variant="danger" onClick={handleCerrarSesion}>X</Button>
        </div>
      )}
    </Navbar>
  );
}

export default CustomNavbar;
