const mongoose = require("mongoose");

const dbConnection = () => {
  mongoose
    .connect(process.env.DB_URI)
    .then((conn) => {
      console.log("Data Base is ready");
    })
    .catch((e) => {
      console.log("Error Data Base");
    });
};

module.exports = dbConnection;
