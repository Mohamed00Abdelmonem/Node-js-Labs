const APIError = require('../utils/APIError')

const handleCastErrorDb = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new APIError(400, message);
};

const handleValidationErrorDb = (err) => {
    const errors = Object.values(err.errors).map((val) => val.message);
    const message = `Invalid input error. ${errors.join(". ")}`;
    return new APIError(400, message);
};
const handleDuplicateFieldsDb = (err) => {
    const message = `Duplicate field value: ${Object.values(err.keyValue).join(", ")}.please use another value`;
    return new APIError(400, message);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  let error = {
    ...err,
    name: err.name,
    message: err.message,
  };

  if (error.name === 'CastError') {
    error = handleCastErrorDb(error);
  }

  if (error.code === 11000) {
    error = handleDuplicateFieldsDb(error);
  }

  if (error.name === 'ValidationError') {
    error = handleValidationErrorDb(error);
  }
  console.error('Error:', error);
  res.status(error.statusCode || 500).json({
    status: 'error',
    message: error.message,
  });
};
