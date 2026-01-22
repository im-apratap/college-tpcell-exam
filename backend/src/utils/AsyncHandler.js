const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    res.status(err.statusCode || err.status || 500).json({
      success: false,
      message: err.message,
    });
  }
};

export { asyncHandler };