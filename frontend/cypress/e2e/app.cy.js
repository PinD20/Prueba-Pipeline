/* global cy */
describe('TestLogin', function(){
    it('frontpage can be opened', function(){
        cy.visit('http://localhost:3000/login')
        cy.contains('Iniciar sesión')
        cy.contains('AlquiMovil')
        cy.contains('Ingresa a tu cuenta')
    })
})

describe('TestRegistroEmpleado', function(){
    it('frontpage can be opened', function(){
        cy.visit('http://localhost:3000/registro-empleado')
        cy.contains('Nombre')
        cy.contains('Registrarse')
        cy.contains('Número de Teléfono')
    })
})

describe('TestRegistroCliente', function(){
    it('frontpage can be opened', function(){
        cy.visit('http://localhost:3000/registro-cliente')
        cy.contains('Registro de Cliente')
        cy.contains('Registrarse')
        cy.contains('Apellido')
    })
})

describe('TestVisualizacionVehiculos', function(){
    it('frontpage can be opened', function(){
        cy.visit('http://localhost:3000/ver-vehiculo-empleado')
        cy.contains('Buscar por marca:')
        cy.contains('Filtrar por categoría:')
        cy.contains('AlquiMovil')
    })
})

// Tests con jwt obligatorio
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2OTg3MDE3ODksImV4cCI6MTczMDIzNzc4OSwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0.grQE21qM6WE3GfHDqbGlhq2tDFinINb11XG4zCcoYXw';

describe('TestVisualizacionVehiculosClientes', function(){
    it('frontpage can be opened', function(){
        // Simula un token JWT en el localStorage
        window.localStorage.setItem('token', token);

        cy.visit('http://localhost:3000/ver-vehiculos-clientes');
        cy.contains('Buscar por marca:');
        cy.contains('Filtrar por categoría:');
        cy.contains('AlquiMovil');
    });
});

describe('TestVisualizacionVehiculosAdministrador', function(){
    it('frontpage can be opened', function(){
        // Simula un token JWT en el localStorage
        window.localStorage.setItem('token', token);

        cy.visit('http://localhost:3000/ver-vehiculos-administrador');
        cy.contains('Buscar por marca:');
        cy.contains('Filtrar por categoría:');
        cy.contains('AlquiMovil');
    });
});

describe('TestCargarVehiculo', function(){
    it('frontpage can be opened', function(){
        // Simula un token JWT en el localStorage
        window.localStorage.setItem('token', token);

        cy.visit('http://localhost:3000/cargar-vehiculo');
        cy.contains('Carga de Vehiculos');
        cy.contains('Modelo:');
        cy.contains('Marca:');
        cy.contains('Transmision:');
        cy.contains('Cantidad de asientos:');
    });
});

describe('TestModuloAdministrador', function(){
    it('frontpage can be opened', function(){
        // Simula un token JWT en el localStorage
        window.localStorage.setItem('token', token);

        cy.visit('http://localhost:3000/modulo-administrador');
        cy.contains('Bienvenido, Administrador');
        cy.contains('Visualizador Administracion');
        cy.contains('Sobre vehiculos');
        cy.contains('Gestion de Cuotas');
    });
});

describe('TestModuloCliente', function(){
    it('frontpage can be opened', function(){
        // Simula un token JWT en el localStorage
        window.localStorage.setItem('token', token);

        cy.visit('http://localhost:3000/modulo-cliente');
        cy.contains('Bienvenido, Cliente');
        cy.contains('Alquiler de Vehiculos');
        cy.contains('Devolucion de Vehiculo');
        cy.contains('Historial de Alquileres');
    });
});

describe('TestModuloEmpleado', function(){
    it('frontpage can be opened', function(){
        // Simula un token JWT en el localStorage
        window.localStorage.setItem('token', token);

        cy.visit('http://localhost:3000/modulo-empleado');
        cy.contains('Bienvenido, Empleado');
        cy.contains('Alquiler de Vehiculos');
        cy.contains('Aceptacion de Reservas');
        cy.contains('Historial de Alquileres');
    });
});

describe('TestModuloAceptar', function(){
    it('frontpage can be opened', function(){
        // Simula un token JWT en el localStorage
        window.localStorage.setItem('token', token);

        cy.visit('http://localhost:3000/modulo-aceptar');
        cy.contains('Buscar por marca:');
        cy.contains('Filtrar por categoría:');
        cy.contains('AlquiMovil');
    });
});