const databaseUser = process.env.DATABASE_USER;
const databasePassword = process.env.DATABASE_PASSWORD;
const databaseName = process.env.DATABASE_NAME;

exports.databaseConnectionStringDefault = `mongodb+srv://${databaseUser}:${databasePassword}@cluster0.wdcmj.mongodb.net/${databaseName}?retryWrites=true&w=majority`;

exports.databaseConnectionString = (databaseName) => `mongodb+srv://${databaseUser}:${databasePassword}@cluster0.wdcmj.mongodb.net/${databaseName}?retryWrites=true&w=majority`;