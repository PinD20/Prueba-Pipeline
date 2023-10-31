import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'; // Importa BrowserRouter correctamente

import RegistroEmpleado from './Registro/RegistroEmpleado';
import RegistroCliente from './Registro/RegistroCliente';
import Login from "./pages/Login";
import VerVehiculosClientes from './VisualizadorVehiculos/VisualizadorVehiculosClientes';
import VerVehiculosAdministrador from './VisualizadorVehiculos/VisualizadorVehiculosAdministrador';
import CargarVehiculo from './CargaVehiculos/CargarVehiculos';
import VerVehiculosEmpleado from './VisualizadorVehiculos/VisualizadorVehiculosEmpleado';
import Modulo_administrador from './Modulos/administrador';
import Modulo_cliente from './Modulos/cliente';
import Modulo_empleado from './Modulos/empleado';
import AceptarReservar from './VisualizadorVehiculos/VisualizadorVehiculosEmpleadoAceptar'
import Devolucion from './Devolucion/Devolucion';

function App() {
  return ( 
    <BrowserRouter> {/* Usa BrowserRouter aquí */}
      <Routes>
        <Route path="/" element={<Navigate to="/login"/>}/>
        <Route path="/login" element={<Login/>} />
        <Route path="/registro-empleado" element={<RegistroEmpleado/>} />
        <Route path="/registro-cliente" element={<RegistroCliente/>} />
        <Route path="/ver-vehiculos-clientes" element={<VerVehiculosClientes/>} />
        <Route path="/ver-vehiculos-administrador" element={<VerVehiculosAdministrador/>} />
        <Route path="/cargar-vehiculo" element={<CargarVehiculo/>} />
        <Route path='/ver-vehiculo-empleado' element={<VerVehiculosEmpleado/>}/>
        <Route path='/modulo-administrador' element={<Modulo_administrador/>}/>
        <Route path='/modulo-cliente' element={<Modulo_cliente/>}/>
        <Route path='/modulo-empleado' element={<Modulo_empleado/>}/>
        <Route path='/modulo-aceptar' element={<AceptarReservar/>}/>
        <Route path='/devolver' element={<Devolucion/>}/>
        
        {/* Otras rutas si es necesario */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
