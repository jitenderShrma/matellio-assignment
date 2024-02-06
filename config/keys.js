module.exports = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT,
    dbDialect:process.env.DB_DIALECT || '',
    secret:process.env.SECRET || '',
    jwtAccessTokenExpiration: process.env.JWT_ACCESS_TOKEN_EXPIRATION || '',
    jwtRefreshTokenExpiration: process.env.JWT_REFRESH_TOKEN_EXPIRATION || '',
    dbURI:process.env.DB_URI
}