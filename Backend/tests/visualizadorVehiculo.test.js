const supertest = require('supertest');
const app = require('../src/app');
const api = supertest(app);
const db = require('../src/database/db');

//Mocking with jest db
jest.mock('../src/database/db', () => {
    return {
        query: jest.fn(),
    }
});

//Vehículo "alamcenado en db" para consultas
const vehiculoEnDb = {
    modelo: 'RAV4',
    marca: 'Toyota',
    transmision: 'Automática',
    cantidad_asientos: 5,
    combustible: 'Gasolina',
    cuota_por_dia: 600,
    foto: Buffer.from('Base64', 'base64'),
    estado: 'Disponible',
    categoria: 'Camioneta'
};
//Vehículo "obtenido de la db" para consultas
const vehiculoExtraido = {
    modelo: 'RAV4',
    marca: 'Toyota',
    transmision: 'Automática',
    cantidad_asientos: 5,
    combustible: 'Gasolina',
    cuota_por_dia: 600,
    foto: 'Base6w==',
    estado: 'Disponible',
    categoria: 'Camioneta'
};

describe('POST /agregar_vehiculo', () => {
    const vehiculoNuevo = {
        Modelo: 'RAV4',
        Marca: 'Toyota',
        Transmision: 'Automática',
        Cantidad_asientos: 5,
        Combustible: 'Gasolina',
        Cuota_por_dia: 600,
        Foto: 'Base6w==',
        Estado: 'Disponible',
        Categoria: 'Camioneta'
    };

    it ('Inserción exitosa de vehículo, retorna status 201', async() => {
        db.query.mockImplementation((sql, values, callback) => {
            //Simula inserción exitosa
            callback(null, { insertId: 1 });
        });

        const response = await api
            .post('/agregar_vehiculo')
            .send(vehiculoNuevo);
        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual({mensaje: 'Vehículo agregado con éxito'});
    });

    it('Error durante la inserción de vehículo, retorna status 500', async () => {
        db.query.mockImplementation((sql, values, callback) => {
            // Simula un error en la inserción
            const err = new Error('Simulated error');
            callback(err, null);
        });

        const response = await api
            .post('/agregar_vehiculo')
            .send(vehiculoNuevo);
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({mensaje: 'Error al agregar el vehículo'});
    });
});

describe('GET /obtener_vehiculos', () => {
    it ('Obtención exitosa, retorna arreglo de vehículos', async() => {

        db.query.mockImplementation((sql, callback) => {
            // Simula una consulta exitosa
            callback( null, [vehiculoEnDb] );
        });

        const response = await api
            .get('/obtener_vehiculos');
        expect(response.body).toEqual({ vehiculos: [vehiculoExtraido]});
    });

    it('Error durante la obtención de vehículos, retorna status 500', async () => {
        db.query.mockImplementation((sql, callback) => {
            // Simula un error en la consulta
            const err = new Error('Simulated error');
            callback(err, null);
        });

        const response = await api
            .get('/obtener_vehiculos')
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({error: 'Error al obtener vehículos'});
    });
});

describe('GET /obtener_vehiculos_disponibles', () => {
    it ('Obtención exitosa, retorna arreglo de vehículos', async() => {
        db.query.mockImplementation((sql, callback) => {
            // Simula una consulta exitosa
            callback( null, [vehiculoEnDb] );
        });

        const response = await api
            .get('/obtener_vehiculos_disponibles');
        expect(response.body).toEqual({ vehiculos: [vehiculoExtraido]});
    });

    it('Error durante la obtención de vehículos, retorna status 500', async () => {
        db.query.mockImplementation((sql, callback) => {
            // Simula un error en la consulta
            const err = new Error('Simulated error');
            callback(err, null);
        });

        const response = await api
            .get('/obtener_vehiculos_disponibles')
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({error: 'Error al obtener vehículos'});
    });
});