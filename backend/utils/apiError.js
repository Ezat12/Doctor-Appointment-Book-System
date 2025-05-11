class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    // this.statue = { statusCode }.startsWith(4) ? "fail" : "error";
  }
}

module.exports = ApiError;
