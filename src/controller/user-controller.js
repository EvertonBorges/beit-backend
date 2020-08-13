const { validationResult } = require('express-validator');
const repository = require('../repositories/user-repository');
const authService = require('../services/auth-service');
const md5 = require('md5');
const { errorHandler } = require('../handlers/mongoose-handler');

function encodePassword(password) {
    return md5(password + process.env.SECRET);
}

function getUserToken(data) {
    return {
        id: data.id,
        email: data.email
    }
}

function getUserResponse(user) {
    return {
        fullName: user.fullName,
        birthDate: user.birthDate,
        email: user.email,
        status: user.status
    };
}

exports.create = async(req, res) => {
    const { errors } = validationResult(req);
    
    if (errors.length > 0) {
        return res.status(400).send({ message: errors });
    }

    try {
        await repository.create({
            fullName: req.body.fullName,
            birthDate: req.body.birthDate,
            email: req.body.email,
            password: encodePassword(req.body.password),
            status: true,
            date_insert: req.requestDate,
            date_update: req.requestDate,
            date_delete: null,
        });
        return res.status(201).send({message: 'Usuário cadastrado com sucesso!'});
    } catch (error) {
        const errorHandled = errorHandler(error);
        if (errorHandled) {
            return res.status(500).send(errorHandled);
        } else {
            console.log(`Error: ${error}`);
            console.log(error);
            return res.status(500).send({message: 'Falha ao cadastrar Usuário.'});
        }
    }
};

async function userAuthenticateIsUserRequest(req) {
    const token = (req.get('x-access-token') || req.get('Authorization')).substring(7);
    const userToken = await authService.decodeToken(token);

    return req.params.id === userToken.id;
}

exports.update = async (req, res) => {
    const { errors } = validationResult(req);
    
    if (errors.length > 0) {
        return res.status(400).send({ message: errors });
    }

    try {
        if (!userAuthenticateIsUserRequest(req)) {
            return res.status(401).send({ message: 'Usuário não autorizado!' });
        }

        await repository.update(req.params.id, {
            fullName: req.body.fullName,
            birthDate: req.body.birthDate,
            date_update: req.requestDate,
        });

        return res.status(200).send({ message: 'Usuário atualizado com sucesso!' });
    } catch (error) {
        return res.status(500).send({ message: 'Falha ao atualizar dados do Usuário.' });
    }
}

exports.updatePassword = async (req, res) => {
    const { errors } = validationResult(req);
    
    if (errors.length > 0) {
        return res.status(400).send({ message: errors });
    }

    try {
        if (!userAuthenticateIsUserRequest(req)) {
            return res.status(401).send({ message: 'Usuário não autorizado!' });
        }

        await repository.updatePassword(req.params.id, {
            password: encodePassword(req.body.password),
            date_update: req.requestDate,
        });
        return res.status(200).send({ message: 'Senha atualizada com sucesso!' });
    } catch (error) {
        return res.status(500).send({ message: 'Falha ao atualizar senha do Usuário.' });
    }
}

exports.updateEmail = async (req, res) => {
    const { errors } = validationResult(req);
    
    if (errors.length > 0) {
        return res.status(400).send({ message: errors });
    }

    try {
        if (!userAuthenticateIsUserRequest(req)) {
            return res.status(401).send({ message: 'Usuário não autorizado!' });
        }

        await repository.updateEmail(req.params.id, {
            email: req.body.email,
            date_update: req.requestDate,
        });
        return res.status(200).send({ message: 'E-mail atualizado com sucesso!' });
    } catch (error) {
        return res.status(500).send({ message: 'Falha ao atualizar e-mail do Usuário.' });
    }
}

exports.delete = async (req, res) => {
    try {
        if (!userAuthenticateIsUserRequest(req)) {
            return res.status(401).send({ message: 'Usuário não autorizado!' });
        }

        await repository.delete(req.params.id);
        return res.status(200).send({ message: 'Usuário removido com sucesso!' });
    } catch (error) {
        return res.status(500).send({ message: 'Falha ao remover Usuário.' });
    }
}

exports.authenticate = async (req, res) => {
    try {
        const data = { 
            email: req.body.email, 
            password: md5(req.body.password + process.env.SECRET)
        };

        const user = await repository.find(data);
        
        if (!user) {
            return res.status(404).send({ message: 'Login e/ou senha inválido(s)' });
        }

        const userToken = getUserToken(user);
        
        const token = await authService.generateToken(userToken);

        const userResponse = getUserResponse(user);

        res.set({ token });
        return res.status(200).send(userResponse);
    } catch (error) {
        return res.status(500).send({ message: 'Falha ao autenticar' });
    }
}

exports.refreshToken = async (req, res) => {
    try {
        const lastToken = (req.get('x-access-token') || req.get('Authorization')).substring(7);
        const data = await authService.decodeToken(lastToken);
        const userToken = getUserToken(data);
        const token = await authService.generateToken(userToken);

        const user = await repository.findById(data.id);

        const userResponse = getUserResponse(user);

        res.set({ token });
        return res.status(200).send(userResponse);
    } catch (error) {
        return res.status(500).send({ message: 'Falha ao authenticar', error: error });
    }
}