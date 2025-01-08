const ApiError = require("../utils/apiError");

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    envDev(err, res);
  } else {
    envProd(err, res);
  }
};

const envDev = (err, res) => {
  if (err.name === "TokenExpiredError") {
    err = tokenExpired();
  }
  if (err.name === "JsonWebTokenError") {
    err = tokenError();
  }
  res.status(400).json({
    status: err.statusCode,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const envProd = (err, res) => {
  if (err.name === "TokenExpiredError") {
    err = tokenExpired();
  }
  if (err.name === "JsonWebTokenError") {
    err = tokenError();
  }
  res.status(400).json({
    status: err.statusCode,
    message: err.message,
  });
};

const tokenExpired = () =>
  new ApiError("Token Expired, Please login again...", 401);

const tokenError = () =>
  new ApiError("Invalid Token , Please login again...", 401);

module.exports = errorHandler;
