const { CreateError } = require('../exceptions/error-handler');

const DUPLICATE_KEY = 11000;

function errorHandler11000(error) {
    const keys = Object.keys(error.keyValue);
    const length = keys.length;
    const values = Object.values(error.keyValue);

    if (length && length > 0) {
        const errorsHandled = { message: [] };
        for(let i = 0; i < length; i++) {
            const errorHandled = 
                CreateError(values[i], `Campo "${keys[i]}" duplicado.`, keys[i], 'database');
            errorsHandled.message.push(errorHandled);
        }

        return errorsHandled;
    }
}

exports.errorHandler = (error) => {
    if (error && error.name === 'MongoError') {
        switch(error.code) {
            case DUPLICATE_KEY: return errorHandler11000(error);
        }
    }

    return null;
}