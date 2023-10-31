const supertest = require('supertest');
const app = require('../src/app');
const api = supertest(app);
const db = require('../src/database/db');

//Mocking with jest db
jest.mock('../src/database/db', () => {
    return {
        beginTransaction: jest.fn(),
        query: jest.fn(),
        commit: jest.fn(),
        rollback: jest.fn(),
    }
});

describe('POST /solicitar_alquiler', () => {
    const solicitud = {
        Fecha_inicio: '2023-10-31',
        Fecha_fin: '2023-11-05',
        Cuota_alquiler: 500,
        Id_empleado: 2,
        Usuario_idusuario: 1,
        Vehiculo_id_vehiculo: 15
    };

    it ('Solicitud exitosa de alquiler, retorna status 201', async() => {
        db.beginTransaction.mockImplementation((callback) => callback(null));
        db.query.mockImplementation((sql, values, callback) => {
            if (sql.startsWith('INSERT INTO alquiler')) {
                // Simula la inserción en la tabla 'alquiler'
                callback(null, { insertId: 5 });
            } else if (sql.startsWith('UPDATE vehiculo')) {
                // Simula la actualización de estado en la tabla 'vehiculo'
                callback(null, { affectedRows: 1 });
            }
        });
        db.commit.mockImplementation((callback) => callback(null));

        const response = await api
            .post('/solicitar_alquiler')
            .send(solicitud);
        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual({mensaje: 'Solicitud de alquiler enviada'});
    });

    it('Error en creación de transacción en solicitud alquiler de vehículo, retorna status 500', async () => {
        //Simula error al iniciar transacción
        db.beginTransaction.mockImplementation((callback) => callback(new Error('Simulated error')));

        const response = await api
            .post('/solicitar_alquiler')
            .send(solicitud);
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({mensaje: 'Error Solicitud de alquiler no enviada'});
    });

    it('Error en inserción de nuevo alquiler en DB, retorna status 500', async () => {
        db.beginTransaction.mockImplementation((callback) => callback(null));
        db.query.mockImplementation((sql, values, callback) => {
            if (sql.startsWith('INSERT INTO alquiler')) {
                // Simula error al insertar en la tabla 'alquiler'
                callback(new Error('Simulated error'));
            }
        });
        db.rollback.mockImplementation((callback) => {
            //Simulación de rollback
            callback('Rollback');
        });
        const response = await api
            .post('/solicitar_alquiler')
            .send(solicitud);
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({mensaje: 'Error Solicitud de alquiler no enviada'});
    });

    it('Error en actualización de estado de vehículo por alquiler en DB, retorna status 500', async () => {
        db.beginTransaction.mockImplementation((callback) => callback(null));
        db.query.mockImplementation((sql, values, callback) => {
            if (sql.startsWith('INSERT INTO alquiler')) {
                // Simula la inserción en la tabla 'alquiler'
                callback(null, { insertId: 5 });
            } else if (sql.startsWith('UPDATE vehiculo')) {
                // Simula error durante actualización de estado en la tabla 'vehiculo'
                callback(new Error('Simulated error'));
            }
        });
        db.rollback.mockImplementation((callback) => {
            //Simulación de rollback
            callback('Rollback');
        });

        const response = await api
            .post('/solicitar_alquiler')
            .send(solicitud);
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({mensaje: 'Error Solicitud de alquiler no enviada'});
    });

    it ('Error durante commit de alquiler de vehículo, retorna status 500', async() => {
        db.beginTransaction.mockImplementation((callback) => callback(null));
        db.query.mockImplementation((sql, values, callback) => {
            if (sql.startsWith('INSERT INTO alquiler')) {
                // Simula la inserción en la tabla 'alquiler'
                callback(null, { insertId: 5 });
            } else if (sql.startsWith('UPDATE vehiculo')) {
                // Simula la actualización de estado en la tabla 'vehiculo'
                callback(null, { affectedRows: 1 });
            }
        });
        db.commit.mockImplementation((callback) => callback(new Error('Simulated Error')));
        db.rollback.mockImplementation((callback) => {
            //Simulación de rollback
            callback('Rollback');
        });

        const response = await api
            .post('/solicitar_alquiler')
            .send(solicitud);
        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual({mensaje: 'Error Solicitud de alquiler no enviada'});
    });
});