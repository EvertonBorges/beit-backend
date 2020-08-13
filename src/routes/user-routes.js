const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const controller = require('../controller/user-controller');
const authMiddleware = require('../middlewares/auth-middleware');

const validationsCreateUser = [
    check('fullName').isLength({ min: 8, max: 120 }).withMessage('Nome precisa ter entre 8 e 120 caracteres.'),
    check('password').isLength({ min: 6, max: 32 }).withMessage('Senha deve ter entre 6 e 32 caracteres.'),
    check('email').isEmail().withMessage('E-mail inválido.'),
    check('birthDate').isISO8601().toDate().withMessage('Data de nascimento inválida.'),
];

const validationsAuthenticateUser = [
    check('password').isLength({ min: 6, max: 32 }).withMessage('Senha deve ter entre 6 e 32 caracteres.'),
    check('email').isEmail().withMessage('E-mail inválido.'),
];

const validationsUpdateuser = [
    check('fullName').optional().isLength({ min: 8, max: 120 }).withMessage('Nome precisa ter entre 8 e 120 caracteres.'),
    check('birthDate').optional().isISO8601().toDate().withMessage('Data de nascimento inválida.'),
];

const validationsUpdateUserPassword = [
    check('password').isLength({ min: 6, max: 32 }).withMessage('Senha deve ter entre 6 e 32 caracteres.'),
];

const validationsUpdateUserEmail = [
    check('email').isEmail().withMessage('E-mail inválido.'),
];

router.get('/', authMiddleware.authorize, controller.refreshToken);
router.post('/', validationsCreateUser, controller.create);
router.post('/login', validationsAuthenticateUser, controller.authenticate);
router.put('/:id', authMiddleware.authorize, validationsUpdateuser, controller.update);
router.put('/:id/password', authMiddleware.authorize, validationsUpdateUserPassword, controller.updatePassword);
router.put('/:id/email', authMiddleware.authorize, validationsUpdateUserEmail, controller.updateEmail);
router.delete('/delete', authMiddleware.authorize, controller.delete);

module.exports = router;