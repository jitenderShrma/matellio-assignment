module.exports = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT,
    dbDialect:process.env.DB_DIALECT || '',
    secret:process.env.SECRET || '',
    jwtExpireInNumberOfDays: process.env.JWT_EXPIRATION || '',
    dbURI:process.env.DB_URI
}