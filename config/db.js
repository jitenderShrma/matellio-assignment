const keys = require("./keys");
const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize({
//     dialect: keys.dbDialect,
//     username: keys.dbUsername,
//     password: keys.dbPassword,
//     database: keys.dbName,
//     host: keys.dbHost,
//     port: keys.dbPort
// });
const sequelize = new Sequelize(keys.dbURI, {
    dialect: 'postgres',
    logging: false, 
})

const dbConnection = async () => {
    
    try {
        await sequelize.authenticate();
        console.log("DB connected...");
    } catch (error) {
        console.log(`DB connection failed... `, error);
    }
}

module.exports = {dbConnection, sequelize}