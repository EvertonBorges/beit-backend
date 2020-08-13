const databaseName = 'testIndex';

const request = require('supertest');
const server = require('../../src/app').listen(3001);
const { setupDB } = require('../test-setup');
const { databaseConnectionString } = require('../../config/constants');

setupDB(databaseConnectionString(databaseName));

afterAll(() => {
    server.close();
});

describe('Tests in MAIN route', () => {

    test('Check API description', async () => {
        const response = await request(server).get('/');
        expect(response.statusCode).toEqual(200);
        expect(response.body.title).toEqual('BeitCIMAPI');
        expect(response.body.version).toEqual('0.0.1');
    });

})