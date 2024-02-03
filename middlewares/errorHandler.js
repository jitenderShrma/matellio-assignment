class ErrorHandler extends Error {
    constructor(statusCode, message) {
      super(message);
      this.statusCode = statusCode;
      this.message = message;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  const errorHandlerMiddleware = (err, req, res, next) => {
    if (err instanceof ErrorHandler) {
      return res.status(err.statusCode).json({
        status: 'error',
        statusCode: err.statusCode,
        message: err.message,
      });
    }
    console.error(err.stack);
    res.status(500).json({
      status: 'error',
      statusCode: 500,
      message: 'Internal Server Error',
    });
  };
  
  module.exports = { ErrorHandler, errorHandlerMiddleware };
  