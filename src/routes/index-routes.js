const express = require('express');
const router = express.Router();

const appDescription = {
    title: 'BeitCIMAPI',
    version: '0.0.1'
};

router.get('/', (req, res) => res.status(200).send(appDescription));

module.exports = router;