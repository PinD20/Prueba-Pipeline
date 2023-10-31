import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Modal, Pagination } from 'react-bootstrap';
import jwt from 'jwt-decode';
import moment from 'moment';
import 'moment/locale/es';
import axios from 'axios';
import Swal from 'sweetalert2';

const VerVehiculos = () => {
  const navigate = useNavigate();
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRentModal, setShowRentModal] = useState(false);
  const [selectedVehiculo, setselectedVehiculo] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const vehiculoPerPage = 6;
  const [vehiculosData, setVehiculosData] = useState([]);
  const [filteredVehiculos, setFilteredVehiculos] = useState([]);
  const [headers, setHeaders] = useState({});
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [fechaInicioError, setFechaInicioError] = useState('');
  const [fechaFinError, setFechaFinError] = useState('');
  const [userId, setUserId] = useState(null);

  // Función para manejar el envío del formulario de alquiler
  const handleSubmitAlquiler = async (e) => {
    e.preventDefault();

    // Limpia el mensaje de error si las fechas son válidas
    setFechaFinError('');
    setFechaInicioError('');

    // Validación de fechas
    const currentDate = moment();
    const startDate = moment(fechaInicio);
    const endDate = moment(fechaFin);

    if (startDate.isSameOrAfter(currentDate, 'day')) {
      setFechaInicioError('');
      if (endDate.isAfter(startDate, 'day')) {
        // Limpia el mensaje de error si las fechas son válidas
        setFechaFinError('');
        setFechaInicioError('');
        
        // Post al backend para enviar la solicitud de alquiler
        try {
          // Realiza una solicitud POST al backend para enviar la solicitud de alquiler
          const response = await axios.post('http://localhost:5000/solicitar_alquiler', {
            Fecha_inicio: startDate.format('YYYY-MM-DD'),
            Fecha_fin: endDate.format('YYYY-MM-DD'),
            Cuota_alquiler: selectedVehiculo.cuota_por_dia,
            Usuario_idusuario: userId,
            Vehiculo_id_vehiculo: selectedVehiculo.id_vehiculo,
          });

          if (response.status === 201) {
            Swal.fire({
              icon: 'success',
              title: 'Solicitud Exitosa',
              text: 'La solicitud de alquiler se ha realizado con éxito.',
            }).then(() => {
              // Cerrar el modal de alquiler después de una solicitud exitosa si es necesario
              handleCloseRent();
            });
          } else {
            // Maneja los errores de la solicitud aquí
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: `Error al enviar la solicitud de alquiler: ${response.data.mensaje}`,
              
            });
          }
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al enviar la solicitud de alquiler',
          });
        }

      } else {
        setFechaFinError('La fecha de fin debe ser mayor que la fecha de inicio.');
        setFechaInicioError('');
      }
    } else {
      setFechaInicioError('La fecha de inicio no puede ser anterior a la fecha actual.');
      setFechaFinError('');
    }
  };

  useEffect(() => {
    // Obtengo el token JWT almacenado en localStorage
    const token = localStorage.getItem('token');

    if (!token) {
      // En caso de no tener el token, redirige a la página de inicio de sesión
      console.error('Token no encontrado. Debes iniciar sesión.');
      navigate('/login');
    } else {
      const decoded = jwt(token);
      setUserId(decoded.userId);
    }

    // Agrega el token al encabezado de la solicitud
    const newHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    setHeaders(newHeaders);
  }, [navigate]);

  // Funciones para abrir y cerrar el modal de alquiler
  const handleShowRent = (vehiculo) => {
    setselectedVehiculo(vehiculo);
    setShowRentModal(true);
  };

  const handleCloseRent = () => {
    setShowRentModal(false);
  };

  // Funciones para abrir y cerrar el modal de detalle
  const handleShowDetail = (vehiculo) => {
    setselectedVehiculo(vehiculo);
    setShowDetailModal(true);
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
  };

  const renderVehiculoContent = () => {
    if (selectedVehiculo) {
      // Para imágenes (todos los tipos de imagen como jpeg, png, etc.)
      return (
        <img src={`data:${selectedVehiculo.tipo};base64,${selectedVehiculo.foto}`} alt={selectedVehiculo.Modelo} style={{ maxWidth: '100%' }} />
      );
    }
    return null;
  };

  const indexOfLastVehiculo = currentPage * vehiculoPerPage;
  const indexOfFirstVehiculo = indexOfLastVehiculo - vehiculoPerPage;

  useEffect(() => {
    const obtenerVehiculos = async () => {
      try {
        const response = await fetch('http://localhost:5000/obtener_vehiculos_disponibles', {
          method: 'GET',
          headers: headers,
        });

        if (!response.ok) {
          throw new Error('La solicitud no se completó correctamente.');
        }
        const data = await response.json();

        if (data && data.vehiculos && Array.isArray(data.vehiculos)) {
          setVehiculosData(data.vehiculos);
          console.log('Vehiculos obtenidos:', data.vehiculos[0].marca);
        } else {
          console.error('Los datos obtenidos no son un array:', data);
        }
      } catch (error) {
        console.error('Error al obtener vehículos:', error);
      }
    };

    obtenerVehiculos();
  }, [headers]);

  useEffect(() => {
    const filteredByCategory = selectedCategory
      ? vehiculosData.filter((vehiculo) => vehiculo.categoria === selectedCategory)
      : vehiculosData;

    const filteredByBrand = selectedBrand
      ? filteredByCategory.filter((vehiculo) =>
        vehiculo.marca.toLowerCase().includes(selectedBrand.toLowerCase())
      )
      : filteredByCategory;

    setFilteredVehiculos(filteredByBrand);
  }, [selectedCategory, selectedBrand, vehiculosData]);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="container mt-5">
        <h1 className="mb-4">Visualizacion de Vehiculos</h1>
        <div className="row mb-3">
          <div className="col-md-3">
            <h6>Filtrar por categoría:</h6>
            <select
              className="form-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Todas</option>
              <option value="Sedan">Sedan</option>
              <option value="Bus">Bus</option>
              <option value="Camioneta">Camioneta</option>
              <option value="Pickup">Pickup</option>
              <option value="Panel">Panel</option>
              <option value="Camion">Camion</option>
            </select>
          </div>
          <div className="col-md-3">
            <h6>Buscar por marca:</h6>
            <input
              type="text"
              className="form-control"
              placeholder="Buscar por marca"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
            />
          </div>
        </div>
        <br />
        <div className="row">
          {filteredVehiculos.slice(indexOfFirstVehiculo, indexOfLastVehiculo).map((vehiculo, index) => (
            <div className="col-md-4 mb-4" key={index}>
              <Card>
                <Card.Body>
                  <Card.Title>{vehiculo.marca + " " + vehiculo.modelo + " " + vehiculo.transmision}</Card.Title>
                  <Card.Subtitle>{"Cantidad de asientos: " + vehiculo.cantidad_asientos}</Card.Subtitle>
                  <Card.Subtitle>{"Tipo de combustible: " + vehiculo.combustible}</Card.Subtitle>
                  <Card.Subtitle>{"Cuota de alquiler por día: Q" + vehiculo.cuota_por_dia}</Card.Subtitle>
                  <Card.Subtitle>{"Categoria: " + vehiculo.categoria}</Card.Subtitle>
                  <Card.Subtitle style={{ color: vehiculo.estado === 'Disponible' ? 'green' : (vehiculo.estado === 'Reservado' ? 'darkorange' : 'red') }}>
                    {vehiculo.estado}
                  </Card.Subtitle>
                  <br />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                      variant="primary"
                      onClick={() => handleShowDetail(vehiculo)}
                      style={{ flex: 1, marginRight: '10px' }}
                    >
                      Ver Vehiculo
                    </Button>
                    <Button
                      variant="warning"
                      onClick={() => handleShowRent(vehiculo)}
                      style={{ flex: 1 }}
                    >
                      Alquilar Vehiculo
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
        <Pagination className="mt-3">
          {Array.from({ length: Math.ceil(filteredVehiculos.length / vehiculoPerPage) }).map((_, index) => (
            <Pagination.Item
              key={index}
              active={index + 1 === currentPage}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>

        {/* Modal de detalle */}
        <Modal show={showDetailModal} onHide={handleCloseDetail} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Foto del Vehiculo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {renderVehiculoContent()}
          </Modal.Body>
        </Modal>

        {/* Modal de alquiler */}
        <Modal show={showRentModal} onHide={handleCloseRent} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Alquilar Vehículo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form onSubmit={handleSubmitAlquiler}>
              <div className="mb-3">
                <label>ID del Vehículo:</label>
                <span>{selectedVehiculo ? selectedVehiculo.id_vehiculo : 'N/A'}</span>
              </div>
              <div className="mb-3">
                <label>ID del Usuario:</label>
                <span>{userId}</span>
              </div>
              <div className="mb-3">
                <label htmlFor="fechaInicio">Fecha de Inicio:</label>
                <input
                  type="date"
                  id="fechaInicio"
                  name="fechaInicio"
                  className="form-control"
                  value={fechaInicio}
                  onChange={e => setFechaInicio(e.target.value)}
                  required
                />
              </div>
              {fechaInicioError && <p className="text-danger">{fechaInicioError}</p>}
              <div className="mb-3">
                <label htmlFor="fechaFin">Fecha de Fin:</label>
                <input
                  type="date"
                  id="fechaFin"
                  name="fechaFin"
                  className="form-control"
                  value={fechaFin}
                  onChange={e => setFechaFin(e.target.value)}
                  required
                />
              </div>
              {fechaFinError && <p className="text-danger">{fechaFinError}</p>}
              <div className="mb-3">
                <label>Cuota de Alquiler por Día:</label>
                <span>{selectedVehiculo ? `Q${selectedVehiculo.cuota_por_dia}` : 'N/A'}</span>
              </div>
              <button type="submit" className="btn btn-success">Confirmar Alquiler</button>
            </form>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default VerVehiculos;
