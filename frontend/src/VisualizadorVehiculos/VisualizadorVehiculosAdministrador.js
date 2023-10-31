import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Modal, Pagination } from 'react-bootstrap';
import jwt from 'jwt-decode';

const VerVehiculos = () => {
  const navigate = useNavigate();
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedVehiculo, setselectedVehiculo] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const vehiculoPerPage = 6;
  const [vehiculosData, setVehiculosData] = useState([]);
  const [filteredVehiculos, setFilteredVehiculos] = useState([]);
  const [headers, setHeaders] = useState({});

  useEffect(() => {
    // Obtengo el token JWT almacenado en localStorage
    const token = localStorage.getItem('token');

    if (!token) {
      // En caso de no tener el token, redirige a la página de inicio de sesión
      console.error('Token no encontrado. Debes iniciar sesión.');
      navigate('/login');
    } else {
      const decoded = jwt(token);
      if (decoded.role === 'C') navigate('/login');
    }

    // Agrega el token al encabezado de la solicitud
    const newHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    setHeaders(newHeaders);
  }, [navigate]);

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
        const response = await fetch('http://localhost:5000/obtener_vehiculos', {
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
                  <Button
                    variant="primary"
                    onClick={() => handleShowDetail(vehiculo)}
                  >
                    Ver Vehiculo
                  </Button>
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
        <Modal show={showDetailModal} onHide={handleCloseDetail} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Foto del Vehiculo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {renderVehiculoContent()}
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default VerVehiculos;
