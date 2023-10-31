import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import jwt from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

function Modulo_administrador() {
    const navigate = useNavigate();

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
    }, [navigate]);
    
    return (
        <>
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '90vh' }}>
                <div>
                    <br />
                    <h1>Bienvenido, Administrador</h1>
                    <br />
                    <Row>
                        <Col>
                            <Card className="h-100">
                                <Card.Body>
                                    <Card.Title>Visualizador Administracion</Card.Title>
                                    <Card.Text>Explora los diferentes vehiculos en todos sus estados.</Card.Text>
                                    <Link to="/ver-vehiculos-administrador">
                                        <Button variant="primary">Ver Alquiler de Vehiculos</Button>
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col>
                            <Card className="h-100">
                                <Card.Body>
                                    <Card.Title>Alquiler de Vehiculos</Card.Title>
                                    <Card.Text>Explora los diferentes vehiculos disponibles y alquila aquellos que te interesen.</Card.Text>
                                    <Link to="/ver-vehiculos-clientes">
                                        <Button variant="primary">Ver Alquiler de Vehiculos</Button>
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col>
                            <Card className="h-100">
                                <Card.Body>
                                    <Card.Title>Sobre vehiculos</Card.Title>
                                    <Card.Text>Permite la carga de informacion de nuevos vehiculos.</Card.Text>
                                    <Link to="/cargar-vehiculo">
                                        <Button variant="primary">Ver Sobre vehiculos</Button>
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col>
                            <Card className="h-100">
                                <Card.Body>
                                    <Card.Title>Devolucion de Vehiculo</Card.Title>
                                    <Card.Text>Permite devolver el vehiculo para que pague la cuenta y cambie a disponble.</Card.Text>
                                    <Link to="/pendiente">
                                        <Button variant="primary">Ver Devolucion de Vehiculo</Button>
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col>
                            <Card className="h-100">
                                <Card.Body>
                                    <Card.Title>Gestion de Cuotas</Card.Title>
                                    <Card.Text>Permite cambiar la cuota del vehiculo en caso de ser necesario.</Card.Text>
                                    <Link to="/pendiente">
                                        <Button variant="primary">Ver Gestion de Cuotas</Button>
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col>
                            <Card className="h-100">
                                <Card.Body>
                                    <Card.Title>Aceptacion de Reservas</Card.Title>
                                    <Card.Text>Permite aceptar las solicitudes de alquiler que envian los clientes.</Card.Text>
                                    <Link to="/modulo-aceptar">
                                        <Button variant="primary">Ver Aceptacion de Reservas</Button>
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    <br />
                    <Row>
                        <Col>
                            <Card className="h-100">
                                <Card.Body>
                                    <Card.Title>Historial de Alquileres</Card.Title>
                                    <Card.Text>Permite visualizar el historial de alquileres realizados.</Card.Text>
                                    <Link to="/pendiente">
                                        <Button variant="primary">Ver Historial de Alquileres</Button>
                                    </Link>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col>
                        </Col>
                        <Col>
                        </Col>
                    </Row>
                </div>
            </Container>
        </>
    );
}

export default Modulo_administrador;
