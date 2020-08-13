const dateMiddleware = (req, res, next) => {
    req.requestDate = Date.now();
    next();
};

module.exports = dateMiddleware