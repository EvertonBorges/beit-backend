const jwt = require('jsonwebtoken');

exports.authorize = function (req, res, next) {
    const token = req.get('x-access-token') || req.get('Authorization');

    if (!token) {
        res.status(401).send({ message: 'Acesso Restrito' });
    } else {
        jwt.verify(token.substring(7), process.env.SECRET, function (error, decoded) {
            if (error) {
                res.status(401).send({ message: 'Token Inválido' });
            } else {
                next();
            }
        });
    }
};