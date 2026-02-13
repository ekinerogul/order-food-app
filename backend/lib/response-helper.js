module.exports = {
  sendError: (res, statusCode, message) => {
    return res.status(statusCode).json({
      success: false,
      message,
    });
  },
  sendSuccess: (res, data, message = null, statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      data,
      ...(message && { message }),
    });
  },
};
