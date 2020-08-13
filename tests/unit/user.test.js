const databaseName = 'testUserUnit';

const request = require('supertest');
const server = require('../../src/app').listen(3002);
const { setupDB } = require('../test-setup');
const { databaseConnectionString } = require('../../config/constants');

setupDB(databaseConnectionString(databaseName));

afterAll(() => {
    server.close();
});

describe('Unit Test for USER', () => {

    test('Create USER fail - fullName too small', async () => {
        const user = {
            fullName: 'Teste',
            birthDate: '2020-05-06',
            email: 'testeunitario@gmail.com',
            password: '123456'
        };

        expect(user.fullName.length).toBeLessThanOrEqual(7);

        const response = await request(server).post('/user/').send(user);

        const expectedBody = {
            "message": [
                {
                    "value": "Teste",
                    "msg": "Nome precisa ter entre 8 e 120 caracteres.",
                    "param": "fullName",
                    "location": "body"
                }
            ]
        };

        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(expectedBody);
    });

    test('Create USER fail - fullName lenght 7', async () => {
        const user = {
            fullName: 'abcdefg',
            birthDate: '2020-05-06',
            email: 'testeunitario@gmail.com',
            password: '123456'
        };

        expect(user.fullName.length).toEqual(7);

        const response = await request(server).post('/user/').send(user);

        const expectedBody = {
            "message": [
                {
                    "value": "abcdefg",
                    "msg": "Nome precisa ter entre 8 e 120 caracteres.",
                    "param": "fullName",
                    "location": "body"
                }
            ]
        };

        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(expectedBody);
    });

    test('Create USER fail - fullName lenght 121', async () => {
        const user = {
            fullName: 'abcdefghijklmnopqrstabcdefghijklmnopqrstabcdefghijklmnopqrstabcdefghijklmnopqrstabcdefghijklmnopqrstabcdefghijklmnopqrstz',
            birthDate: '2020-05-06',
            email: 'testeunitario@gmail.com',
            password: '123456'
        };

        expect(user.fullName.length).toEqual(121);

        const response = await request(server).post('/user/').send(user);

        const expectedBody = {
            "message": [
                {
                    "value": "abcdefghijklmnopqrstabcdefghijklmnopqrstabcdefghijklmnopqrstabcdefghijklmnopqrstabcdefghijklmnopqrstabcdefghijklmnopqrstz",
                    "msg": "Nome precisa ter entre 8 e 120 caracteres.",
                    "param": "fullName",
                    "location": "body"
                }
            ]
        };

        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(expectedBody);
    });

    test('Create USER fail - fullName too large', async () => {
        const user = {
            fullName: 'Teste as ad adasd ds as ads ds dadsa sa dsad asd asd sd ds sa dd sad sdas sd asa dsad sad as ddsa sda dsads dsasaddsa dsasd dsa dsadsadassdads dsasd dsa s sd das as dds adassad',
            birthDate: '2020-05-06',
            email: 'testeunitario@gmail.com',
            password: '123456'
        };

        expect(user.fullName.length).toBeGreaterThan(121);

        const response = await request(server).post('/user/').send(user);

        const expectedBody = {
            "message": [
                {
                    "value": "Teste as ad adasd ds as ads ds dadsa sa dsad asd asd sd ds sa dd sad sdas sd asa dsad sad as ddsa sda dsads dsasaddsa dsasd dsa dsadsadassdads dsasd dsa s sd das as dds adassad",
                    "msg": "Nome precisa ter entre 8 e 120 caracteres.",
                    "param": "fullName",
                    "location": "body"
                }
            ]
        };

        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(expectedBody);
    });

    test('Create USER fail - birthDate format problem', async () => {
        const user = {
            fullName: 'Teste unitário',
            birthDate: '06/05/2020',
            email: 'testeunitario@gmail.com',
            password: '123456'
        };

        const response = await request(server).post('/user/').send(user);
        
        const expectedBody = {
            "message": [
                {
                    "value": "06/05/2020",
                    "msg": "Data de nascimento inválida.",
                    "param": "birthDate",
                    "location": "body"
                }
            ]
        };

        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(expectedBody);
    });

    // test('Create USER fail - birthDate after or equals today', async () => {
    //     const user = {
    //         fullName: 'Teste unitário',
    //         birthDate: '2030-05-06',
    //         email: 'testeunitario@gmail.com',
    //         password: '123456'
    //     };

    //     const response = await request(server).post('/user/').send(user);
        
    //     const expectedBody = {
    //         "message": [
    //             {
    //                 "value": "2030-05-06",
    //                 "msg": "Data de nascimento inválida.",
    //                 "param": "birthDate",
    //                 "location": "body"
    //             }
    //         ]
    //     };

    //     expect(response.statusCode).toEqual(400);
    //     expect(response.body).toEqual(expectedBody);
    // });

    test('Create USER fail - email', async () => {
        const user = {
            fullName: 'Teste unitário',
            birthDate: '2020-05-06',
            email: 'testeunitario@m',
            password: '123456'
        };

        const response = await request(server).post('/user/').send(user);
        
        const expectedBody = {
            "message": [
                {
                    "value": "testeunitario@m",
                    "msg": "E-mail inválido.",
                    "param": "email",
                    "location": "body"
                }
            ]
        };

        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(expectedBody);
    });

    test('Create USER fail - password too small', async () => {
        const user = {
            fullName: 'Teste unitário',
            birthDate: '2020-05-06',
            email: 'testeunitario@gmail.com',
            password: '123'
        };

        expect(user.password.length).toBeLessThanOrEqual(5);

        const response = await request(server).post('/user/').send(user);
        
        const expectedBody = {
            "message": [
                {
                    "value": "123",
                    "msg": "Senha deve ter entre 6 e 32 caracteres.",
                    "param": "password",
                    "location": "body"
                }
            ]
        };

        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(expectedBody);
    });

    test('Create USER fail - password lenght 5', async () => {
        const user = {
            fullName: 'Teste unitário',
            birthDate: '2020-05-06',
            email: 'testeunitario@gmail.com',
            password: '12345'
        };

        expect(user.password.length).toEqual(5);

        const response = await request(server).post('/user/').send(user);
        
        const expectedBody = {
            "message": [
                {
                    "value": "12345",
                    "msg": "Senha deve ter entre 6 e 32 caracteres.",
                    "param": "password",
                    "location": "body"
                }
            ]
        };

        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(expectedBody);
    });

    test('Create USER fail - password lenght 33', async () => {
        const user = {
            fullName: 'Teste unitário',
            birthDate: '2020-05-06',
            email: 'testeunitario@gmail.com',
            password: '123456789012345678901234567890123'
        };

        expect(user.password.length).toEqual(33);

        const response = await request(server).post('/user/').send(user);
        
        const expectedBody = {
            "message": [
                {
                    "value": "123456789012345678901234567890123",
                    "msg": "Senha deve ter entre 6 e 32 caracteres.",
                    "param": "password",
                    "location": "body"
                }
            ]
        };

        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(expectedBody);
    });

    test('Create USER fail - password too large', async () => {
        const user = {
            fullName: 'Teste unitário',
            birthDate: '2020-05-06',
            email: 'testeunitario@gmail.com',
            password: '156565225195159195259287148518425184105'
        };

        expect(user.password.length).toBeGreaterThanOrEqual(33);

        const response = await request(server).post('/user/').send(user);
        
        const expectedBody = {
            "message": [
                {
                    "value": "156565225195159195259287148518425184105",
                    "msg": "Senha deve ter entre 6 e 32 caracteres.",
                    "param": "password",
                    "location": "body"
                }
            ]
        };

        expect(response.statusCode).toEqual(400);
        expect(response.body).toEqual(expectedBody);
    });

})