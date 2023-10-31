import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Modal, Pagination, Collapse, ModalFooter } from 'react-bootstrap';
import jwt from 'jwt-decode';


function mostrarMensajeError(mensaje) {
    Swal.fire({
        icon: 'error', // Puedes usar 'success', 'error', 'warning', 'info', etc.
        title: mensaje,
        showConfirmButton: false,
        timer: 2000 // Tiempo en milisegundos para que el mensaje desaparezca automáticamente
    });
}

function mostrarMensajeSuccess(mensaje) {
    Swal.fire({
        icon: 'success', // Puedes usar 'success', 'error', 'warning', 'info', etc.
        title: mensaje,
        showConfirmButton: false,
        timer: 2000 // Tiempo en milisegundos para que el mensaje desaparezca automáticamente
    });
}


const VerVehiculos = () => {
    const navigate = useNavigate();
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedVehiculo, setselectedVehiculo] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const vehiculoPerPage = 6;
    const [vehiculosData, setVehiculosData] = useState([]);
    const [filteredVehiculos, setFilteredVehiculos] = useState([]);
    const [headers, setHeaders] = useState({});
    const [nuevacuota, setnuevacuota] = useState('');
    const [optionState, setOptionState] = useState('Reservado')


    const [collapseStates, setCollapseStates] = useState({});

    const handleInputChangeCuota = (e) => {
        const newValue = e.target.value.toString();
        const lettersOnly = newValue.replace(/[^0-9]/g, ''); // Eliminar todos los caracteres que no son letras
        setnuevacuota(lettersOnly);
    };

    const toggleCollap = (index) => {
        setCollapseStates((prevState) => ({
            ...prevState,
            [index]: !prevState[index] // Cambia el estado del colapso para la tarjeta con el índice "index"
        }));
    }

    useEffect(() => {
        // Obtengo el token JWT almacenado en localStorage
        const token = localStorage.getItem('token');

        /*if (!token) {
            // En caso de no tener el token, redirige a la página de inicio de sesión
            console.error('Token no encontrado. Debes iniciar sesión.');
            navigate('/login');
        } else {
            const decoded = jwt(token);
            if (decoded.role === 'A') navigate('/login');
            else if (decoded.role === 'E') navigate('/login');
        }*/

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

        const filteredByState = optionState
            ? filteredByBrand.filter((vehiculo) => vehiculo.estado === optionState)
            : filteredByBrand;

        setFilteredVehiculos(filteredByState);
    }, [selectedCategory, selectedBrand, vehiculosData, optionState]);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleSubmitVehiculoCuota = async (e) => {
        e.preventDefault();
        const data = {
            idvehiculo: selectedVehiculo.id_vehiculo,
            new_cuota: nuevacuota.trim()
        };
        console.log(data)
        try {
            const response = await fetch('http://localhost:5000/modificar_cuota_vehiculo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (response.status === 200) {
                response.json().then(data => {
                    console.log(data.mensaje);
                    handleCloseDetail();
                    mostrarMensajeSuccess(data.mensaje);
                    setnuevacuota('');
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000)
                })
            } else {
                response.json().then(data => {
                    mostrarMensajeError(data.mensaje)
                })
            }
        } catch {
            console.log('Error de red o excepcion')
        }
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
                    {/* <div className="col-md-3">
                        <h6>Filtrar por estado:</h6>
                        <select
                            className="form-select"
                            value={optionState}
                            onChange={(e) => setOptionState(e.target.value)}
                        >
                            <option value="Reservado">Todos</option>
                             <option value="Ocupado">Ocupado</option>
                            <option value="Disponible">Disponible</option>
                            <option value="Reservado">Reservado</option>

                        </select>
                    </div> */}
                </div>
                <br />
                <div className="row">
                    {filteredVehiculos.slice(indexOfFirstVehiculo, indexOfLastVehiculo).map((vehiculo, index) => (
                        <div className="col-md-4 mb-3" key={index}>
                            <Card style={{ width: '20rem' }} className='text-center'>
                                <Card.Body className='p-0'>
                                    <Card.Img className='rounded float-start' src={`data:${vehiculo.tipo};base64,${vehiculo.foto}`} style={{ maxWidth: '100%', maxHeight: '50%' }} />                                    <Card.Title>
                                        <div className='row p-1'>
                                            <h3 style={{ width: "100%", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }} onClick={() => toggleCollap(index)}>

                                                {vehiculo.marca}

                                            </h3>
                                        </div>
                                    </Card.Title>
                                    <Collapse in={collapseStates[index]} className='p-0 m-0'>
                                        <Card.Subtitle>

                                            <ul className="list-group list-group-flush">
                                                <li className="list-group-item"><strong>Modelo </strong> {vehiculo.modelo}</li>
                                                <li className="list-group-item"><strong>Tipo de Transmision </strong> {vehiculo.transmision}</li>
                                                <li className="list-group-item"><strong>Asiseto </strong> {vehiculo.cantidad_asientos}</li>
                                                <li className="list-group-item"><strong>Tipo de Combustible</strong> {vehiculo.combustible}</li>
                                                <li className="list-group-item"><strong>Cuota de alquiler por día: Q   </strong> {vehiculo.cuota_por_dia}</li>
                                                <li className="list-group-item"><strong>Categoria </strong> {vehiculo.categoria}</li>
                                                <li className="list-group-item"><strong>Tipo de Transmision </strong> {vehiculo.transmision}</li>

                                            </ul>
                                            <div className="card-footer">
                                                <Card.Subtitle style={{ color: vehiculo.estado === 'Disponible' ? 'green' : (vehiculo.estado === 'Reservado' ? 'darkorange' : 'red') }}>
                                                    {vehiculo.estado}
                                                </Card.Subtitle>
                                            </div>
                                            <div className="btn-group pb-2" role="group" aria-label="Basic mixed styles example" hidden={vehiculo.estado !== 'Reservado'}>
                                                <button type="button" className="btn btn-success">Aceptar</button>
                                                <button type="button" className="btn btn-danger">Rechazar</button>
                                            </div>

                                            <div className='pb-2'>
                                                <Button className='btn btn-secondary' onClick={() => handleShowDetail(vehiculo)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-gear" viewBox="0 0 16 16">
                                                        <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
                                                        <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
                                                    </svg>
                                                </Button>
                                            </div>
                                        </Card.Subtitle>

                                    </Collapse>
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
                <Modal show={showDetailModal} onHide={handleCloseDetail} centered>
                    <Modal.Header closeButton>
                        <Modal.Title className='modal-title fs-5'>Modificar Cuota Vehiculo  {selectedVehiculo.marca} {selectedVehiculo.modelo}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <h2 className="fs-5">Cuota de alquiler por día</h2>
                        <form>
                            <div className="mb-3">
                                <label for="recipient-name" className="col-form-label">Actual</label>
                                <input className="form-control" type="text" value={selectedVehiculo.cuota_por_dia} aria-label="Disabled input example" disabled readonly />
                            </div>
                            <div className="mb-3">
                                <label for="recipient-name" className="col-form-label">Nuevo</label>
                                <input type="text" className="form-control" id="new_couta" value={nuevacuota} onChange={handleInputChangeCuota} />
                            </div>
                        </form>
                    </Modal.Body>
                    <ModalFooter >
                        <div className='d-grid gap-2 col-6 mx-auto'>
                            <Button className="btn btn-secondary btn-lg" onClick={handleSubmitVehiculoCuota}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-floppy-fill" viewBox="0 0 16 16">
                                    <path d="M0 1.5A1.5 1.5 0 0 1 1.5 0H3v5.5A1.5 1.5 0 0 0 4.5 7h7A1.5 1.5 0 0 0 13 5.5V0h.086a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5H14v-5.5A1.5 1.5 0 0 0 12.5 9h-9A1.5 1.5 0 0 0 2 10.5V16h-.5A1.5 1.5 0 0 1 0 14.5v-13Z" />
                                    <path d="M3 16h10v-5.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5V16Zm9-16H4v5.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V0ZM9 1h2v4H9V1Z" />
                                </svg>
                                <span className='p-1'>
                                    Guardar
                                </span>
                            </Button>
                        </div>
                    </ModalFooter>
                </Modal>
            </div >
        </>
    );
};

export default VerVehiculos;
