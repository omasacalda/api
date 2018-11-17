const access = (requiredRole) => (req, res, next) => {
  if (!req.user || !req.role) {
    return res.status(401).json({
      success: false,
      message: 'Access denied'
    });
  }

  if (req.role !== requiredRole) {
    return res.status(401).json({
      success: false,
      message: 'Access denied'
    });
  }

  next();
}

module.exports = access;
