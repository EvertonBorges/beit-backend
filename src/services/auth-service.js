const jwt = require('jsonwebtoken');

exports.generateToken = async data => {
    return jwt.sign(data, process.env.SECRET, { expiresIn: '1d' });
}

exports.decodeToken = async token => {
    return jwt.verify(token, process.env.SECRET);
}