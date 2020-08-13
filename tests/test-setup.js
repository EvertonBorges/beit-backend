const mongoose = require('mongoose');
const mongooseDatas = require('../config/default.json').mongoose;
mongoose.set('useCreateIndex', true);
mongoose.promise = global.Promise;

async function removeAllCollections() {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName];
        await collection.deleteMany();
    }
}

async function dropAllCollections() {
    const collections = Object.keys(mongoose.connection.collections)
    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName];
        try {
            await collection.drop();
        } catch (error) {
            if (error.message === 'ns not found') return;
            
            if (error.message.includes('a background operation is currently running')) return;

            console.log(error.message);
        }
    }
}

module.exports = {
    setupDB(databaseString) {
        beforeAll(async () => {
            await mongoose.connect(databaseString, mongooseDatas.configs);
        });

        afterEach(async () => {
            await removeAllCollections();
        });

        afterAll(async () => {
            await dropAllCollections();
            await mongoose.connection.close();
        });
    }
}