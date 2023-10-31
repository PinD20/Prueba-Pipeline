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

describe('POST /modificar_cuota_vehiculo', () => {
    const idVehiculo = {
        idvehiculo: 1,
        new_cuota: 500
    };

    it ('Actualización exitosa de cuota de vehículo, retorna status 200', async() => {
        db.query.mockImplementation((sql, values, callback) => {
            callback(null, { affectedRows: 1 });
        });

        const response = await api
            .post('/modificar_cuota_vehiculo')
            .send(idVehiculo);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({mensaje: 'Cuota modificada Exitosa', estatus: true});
    });

    it('Error durante la actualización de cuota de vehículo, retorna status 400', async () => {
        db.query.mockImplementation((sql, values, callback) => {
            // Simula un error en la inserción
            const err = new Error('Simulated error');
            callback(err, null);
        });

        const response = await api
            .post('/modificar_cuota_vehiculo')
            .send(idVehiculo);
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({message: 'Simulated error', estatus: false});
    });
});

describe('POST /modificar_cuota_vehiculo_marca', () => {
    const idVehiculo = {
        marca: 'Toyota',
        new_cuota: 600
    };

    it ('Actualización exitosa de cuota de vehículo mediante su marca, retorna status 200', async() => {
        db.query.mockImplementation((sql, values, callback) => {
            //Simula actualización exitosa en db
            callback(null, { affectedRows: 1 });
        });

        const response = await api
            .post('/modificar_cuota_vehiculo_marca')
            .send(idVehiculo);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({mensaje: 'Cuota modificada de la Toyota fueron Exitosa', estatus: true});
    });

    it ('Ningún registro actualiza su cuota de vehículo mediante su marca, retorna status 400', async() => {
        db.query.mockImplementation((sql, values, callback) => {
            //Simula actualización sin registros afectados en db
            callback(null, { affectedRows: 0 });
        });

        const response = await api
            .post('/modificar_cuota_vehiculo_marca')
            .send(idVehiculo);
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({message: 'Marca Toyota No existe', estatus: false});
    });

    it('Error durante la actualización de cuota de vehículo mediante su marca, retorna status 400', async () => {
        db.query.mockImplementation((sql, values, callback) => {
            // Simula un error en la inserción
            const err = new Error('Simulated error');
            callback(err, null);
        });

        const response = await api
            .post('/modificar_cuota_vehiculo_marca')
            .send(idVehiculo);
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({message: 'Simulated error', estatus: false});
    });
});

describe('POST /modificar_cuota_vehiculo_categoria', () => {
    const idVehiculo = {
        categoria: 'Bus',
        new_cuota: 1000
    };

    it ('Actualización exitosa de cuota de vehículo mediante su categoria, retorna status 200', async() => {
        db.query.mockImplementation((sql, values, callback) => {
            //Simula actualización exitosa en db
            callback(null, { affectedRows: 1 });
        });

        const response = await api
            .post('/modificar_cuota_vehiculo_categoria')
            .send(idVehiculo);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({mensaje: 'Cuota modificada de la Bus fueron Exitosa', estatus: true});
    });

    it ('Ningún registro actualiza su cuota de vehículo mediante su categoría, retorna status 400', async() => {
        db.query.mockImplementation((sql, values, callback) => {
            //Simula actualización sin registros afectados en db
            callback(null, { affectedRows: 0 });
        });

        const response = await api
            .post('/modificar_cuota_vehiculo_categoria')
            .send(idVehiculo);
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({message: 'Categoria Bus No existe', estatus: false});
    });

    it('Error durante la actualización de cuota de vehículo mediante su categoría, retorna status 400', async () => {
        db.query.mockImplementation((sql, values, callback) => {
            // Simula un error en la inserción
            const err = new Error('Simulated error');
            callback(err, null);
        });

        const response = await api
            .post('/modificar_cuota_vehiculo_categoria')
            .send(idVehiculo);
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({message: 'Simulated error', estatus: false});
    });
});

describe('POST /modificar_cuota_vehiculo_ambos', () => {
    const idVehiculo = {
        marca: 'Mitsubishi',
        categoria: 'Sedan',
        new_cuota: 450
    };

    it ('Actualización exitosa de cuota de vehículo mediante su categoria y marca, retorna status 200', async() => {
        db.query.mockImplementation((sql, values, callback) => {
            //Simula actualización exitosa en db
            callback(null, { affectedRows: 1 });
        });

        const response = await api
            .post('/modificar_cuota_vehiculo_ambos')
            .send(idVehiculo);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({mensaje: 'Cuota modificada de la Sedan Y Mitsubishi fueron Exitosa', estatus: true});
    });

    it ('Ningún registro actualiza su cuota de vehículo mediante su categoría y marca, retorna status 400', async() => {
        db.query.mockImplementation((sql, values, callback) => {
            //Simula actualización sin registros afectados en db
            callback(null, { affectedRows: 0 });
        });

        const response = await api
            .post('/modificar_cuota_vehiculo_ambos')
            .send(idVehiculo);
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({message: 'Filtro No existe vehiculo', estatus: false});
    });

    it('Error durante la actualización de cuota de vehículo mediante su categoría y marca, retorna status 400', async () => {
        db.query.mockImplementation((sql, values, callback) => {
            // Simula un error en la inserción
            const err = new Error('Simulated error');
            callback(err, null);
        });

        const response = await api
            .post('/modificar_cuota_vehiculo_ambos')
            .send(idVehiculo);
        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({message: 'Simulated error', estatus: false});
    });
});