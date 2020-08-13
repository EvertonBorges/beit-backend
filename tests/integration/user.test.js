const databaseName = 'testUserIntegration';

const request = require('supertest');
const server = require('../../src/app').listen(3502);
const { setupDB } = require('../test-setup');
const authService = require('../../src/services/auth-service');
const dateService = require('../../src/services/date-service');

const { databaseConnectionString } = require('../../config/constants');

setupDB(databaseConnectionString(databaseName));

afterAll(() => {
    server.close();
});

describe('Integration Test for USER', () => {

    test('Create USER success', async () => {
        const user = {
            fullName: 'Teste de integração - CREATE',
            birthDate: '2020-05-06',
            email: 'testeintegracaocreate@gmail.com',
            password: '123456'
        };

        const response = await request(server).post('/user/').send(user);
        expect(response.statusCode).toEqual(201);
    });

    test('Update USER success', async () => {
        const user = {
            fullName: 'Teste de integração - UPDATE',
            birthDate: '2020-05-12',
            email: 'testeintegracaopdate@gmail.com',
            password: '123456'
        };

        const responseInsertion = await request(server).post('/user/').send(user);
        expect(responseInsertion.statusCode).toEqual(201);

        const loginCredentials = {
            email: 'testeintegracaopdate@gmail.com',
            password: '123456'
        };

        const responseLogin = await request(server).post('/user/login/').send(loginCredentials);
        expect(responseLogin.statusCode).toEqual(200);

        const token = responseLogin.get('token');
        const userDecoded = await authService.decodeToken(token);
        
        const userUpdate = {
            fullName: 'Teste de integração - UPDATED',
            birthDate: '2020-05-13'
        }

        const responseUpdate = 
            await request(server).put(`/user/${userDecoded.id}`)
                                .set('Authorization', `Bearer ${token}`)
                                .send(userUpdate);
        expect(responseUpdate.statusCode).toEqual(200);
    });

    test('Read USER success', async () => {
        const user = {
            fullName: 'Teste unitário - READ',
            birthDate: '2020-05-14',
            email: 'testeintegracaoread@gmail.com',
            password: '123456'
        };

        const responseInsertion = await request(server).post('/user/').send(user);
        expect(responseInsertion.statusCode).toEqual(201);

        const loginCredentials = {
            email: 'testeintegracaoread@gmail.com',
            password: '123456'
        };

        const responseLogin = await request(server).post('/user/login/').send(loginCredentials);
        expect(responseLogin.statusCode).toEqual(200);

        const token = responseLogin.get('token');

        const responseRead = 
            await request(server).get(`/user`)
                                .set('Authorization', `Bearer ${token}`)
                                .send();
        expect(responseRead.statusCode).toEqual(200);

        const userRead = responseRead.body;
        expect(userRead.fullName).toEqual(user.fullName);
        expect(new Date(userRead.birthDate)).toEqual(new Date(user.birthDate));
        expect(userRead.email).toEqual(user.email);
        expect(userRead.status).toBeTruthy();
    });

    test('Delete USER success', async () => {
        const user = {
            fullName: 'Teste unitário - DELETE',
            birthDate: '2020-05-18',
            email: 'testeintegracaodelete@gmail.com',
            password: '123456'
        };

        const response = await request(server).post('/user/').send(user);
        expect(response.statusCode).toEqual(201);

        const loginCredentials = {
            email: 'testeintegracaodelete@gmail.com',
            password: '123456'
        };

        const responseLogin = await request(server).post('/user/login/').send(loginCredentials);
        expect(responseLogin.statusCode).toEqual(200);

        const token = responseLogin.get('token');

        const responseDelete = 
            await request(server).delete(`/user/delete`)
                                .set('Authorization', `Bearer ${token}`)
                                .send();
        expect(responseDelete.statusCode).toEqual(200);
    });

})