import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import jwt from 'jwt-decode';

function CargarVehiculo() {
    const navigate = useNavigate();
    const [modelo, setModelo] = useState('');
    const [marca, setMarca] = useState('');
    const [transmision, setTransmision] = useState('');
    const [cantidadAsientos, setCantidadAsientos] = useState('');
    const [tipoCombustible, setTipoCombustible] = useState('');
    const [cuotaAlquiler, setCuotaAlquiler] = useState('');
    const [estado, setEstado] = useState('Disponible');
    const [categoria, setCategoria] = useState('');
    const [archivo, setArchivo] = useState(null);
    const [archivoBase64, setArchivoBase64] = useState('');
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
            if (decoded.role === 'E') navigate('/login');
        }

        // Agrega el token al encabezado de la solicitud
        const newHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };

        setHeaders(newHeaders);
    }, [navigate]);

    const handleCargarVehiculo = async () => {
        // Verifica si se ha llenado todos los campos
        if (!modelo || !marca || !transmision || !cantidadAsientos || !tipoCombustible || !cuotaAlquiler || !estado || !categoria || !archivo) {
            // Si falta algún campo, muestra un mensaje de error
            console.error('Debes completar todos los campos.');
            Swal.fire({
                icon: 'error',
                title: 'Error al cargar vehículo',
                text: 'Debes completar todos los campos.',
            });
            return;
        }

        // Verifica si se ha seleccionado un archivo
        if (!archivo) {
            console.error('Debes seleccionar un archivo.');
            Swal.fire({
                icon: 'error',
                title: 'Error al cargar vehiculo',
                text: 'Debes seleccionar un archivo.',
            });
            return;
        }

        try {
            // Leer el archivo y convertirlo en Base64
            const reader = new FileReader();
            reader.readAsDataURL(archivo);
            reader.onload = () => {
                const base64String = reader.result.split(',')[1];
                setArchivoBase64(base64String);
                enviarVehiculo();
            };
        } catch (error) {
            console.error('Error al leer el archivo:', error);
        }
    };

    const enviarVehiculo = async () => {
        // Crear un objeto FormData para enviar los datos y el archivo al servidor
        console.log(archivoBase64);
        const vehiculoData = {
            "Modelo": modelo,
            "Marca": marca,
            "Transmision": transmision,
            "Cantidad_asientos": cantidadAsientos,
            "Combustible": tipoCombustible,
            "Cuota_por_dia": cuotaAlquiler,
            "Estado": estado,
            "Categoria": categoria,
            "Foto": archivoBase64,
        };
        const vehiculoDataJSON = JSON.stringify(vehiculoData);
        console.log(vehiculoDataJSON);

        try {
            // Realiza una solicitud POST al servidor para enviar el vehiculo
            const response = await fetch('http://localhost:5000/agregar_vehiculo', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(vehiculoData),
            });

            if (response.ok) {
                // El archivo se subió con éxito
                console.log('Vehiculo subido con éxito.');

                // Mostrar una alerta de éxito con SweetAlert2
                Swal.fire({
                    icon: 'success',
                    title: 'Vehiculo subido con éxito',
                    text: 'El vehiculo se ha subido correctamente.',
                });

                // Puedes redirigir o hacer algo más después de una carga exitosa
            } else {
                console.error('Error al subir el vehiculo.');

                // Mostrar una alerta de error con SweetAlert2
                Swal.fire({
                    icon: 'error',
                    title: 'Error al subir el vehiculo.',
                    text: 'Ha ocurrido un error al subir el vehiculo.',
                });
            }
        } catch (error) {
            console.error('Error:', error);

            // Mostrar una alerta de error con SweetAlert2
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ha ocurrido un error en la solicitud.',
            });
        }
    };

    const handleArchivoSeleccionado = (e) => {
        const selectedFile = e.target.files[0];
        setArchivo(selectedFile);

        if (selectedFile) {
            // Leer el archivo y convertirlo en Base64
            const reader = new FileReader();
            reader.readAsDataURL(selectedFile);
            reader.onload = () => {
                const base64String = reader.result.split(',')[1]; // Obtener la parte de datos Base64
                setArchivoBase64(base64String); // Almacenar el archivo en Base64 en el estado

                // Verificar si se almacenó correctamente en archivoBase64
                console.log('archivoBase64:', archivoBase64);
            };
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "90vh" }}>
            <div className="col-lg-6">
                <br />
                <h2 className="text-center">Carga de Vehiculos</h2>
                <br />
                <form>
                    <div className="form-group">
                        <label>Modelo:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={modelo}
                            onChange={(e) => setModelo(e.target.value)}
                        />
                    </div>
                    <br />
                    <div className="form-group">
                        <label>Marca:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={marca}
                            onChange={(e) => setMarca(e.target.value)}
                        />
                    </div>
                    <br />
                    <div className="form-group">
                        <label>Transmision:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={transmision}
                            onChange={(e) => setTransmision(e.target.value)}
                        />
                    </div>
                    <br />
                    <div className="form-group">
                        <label>Cantidad de asientos:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={cantidadAsientos}
                            onChange={(e) => setCantidadAsientos(e.target.value)}
                        />
                    </div>
                    <br />
                    <div className="form-group">
                        <label>Tipo de combustible:</label>
                        <select
                            className="form-control"
                            value={tipoCombustible}
                            onChange={(e) => setTipoCombustible(e.target.value)}
                        >
                            <option value="">Selecciona una tipo de combustible</option>
                            <option value="Gasolina">Gasolina</option>
                            <option value="Diesel">Diesel</option>
                            <option value="Electrico">Electrico</option>
                        </select>
                    </div>
                    <br />
                    <div className="form-group">
                        <label>Cuota de alquiler por día:</label>
                        <input
                            type="text"
                            className="form-control"
                            value={cuotaAlquiler}
                            onChange={(e) => setCuotaAlquiler(e.target.value)}
                        />
                    </div>
                    <br />
                    <div className="form-group">
                        <label>Foto del vehiculo:</label>
                        <input
                            type="file"
                            className="form-control"
                            onChange={handleArchivoSeleccionado}
                        />
                    </div>
                    <br />
                    <div className="form-group">
                        <label>Estado:</label>
                        <select
                            className="form-control"
                            value={estado}
                            onChange={(e) => setEstado(e.target.value)}
                        >
                            <option value="Disponible">Disponible</option>
                            <option value="Reservado">Reservado</option>
                            <option value="Ocupado">Ocupado</option>
                        </select>
                    </div>
                    <br />
                    <div className="form-group">
                        <label>Categoría:</label>
                        <select
                            className="form-control"
                            value={categoria}
                            onChange={(e) => setCategoria(e.target.value)}
                        >
                            <option value="">Selecciona una categoría</option>
                            <option value="Sedan">Sedan</option>
                            <option value="Bus">Bus</option>
                            <option value="Camioneta">Camioneta</option>
                            <option value="Pickup">Pickup</option>
                            <option value="Panel">Panel</option>
                            <option value="Camion">Camion</option>
                        </select>
                    </div>
                    <br />
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleCargarVehiculo}
                    >
                        Cargar Vehiculo
                    </button>
                </form>
                <br />
            </div>
        </div>
    );
}

export default CargarVehiculo;