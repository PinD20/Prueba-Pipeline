const supertest = require('supertest');
const app = require('../src/app');
const api = supertest(app);

//Mocking with jest db
jest.mock('../src/database/db', () => {
    return {
        query: jest.fn(),
    }
});

describe('GET /', () => {
    it ('Should return "<h1>Bienvenido al Backend</h1>"', async() => {
        const response = await api.get('/');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({message: 'Bienvenido al Backend'});
    });
});