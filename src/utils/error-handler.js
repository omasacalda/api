const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const payload = {
    success: false,
    data: {
      message: err.message,
      code: status
    }
  }

  return res.status(status).json(payload);
}

module.exports = errorHandler
