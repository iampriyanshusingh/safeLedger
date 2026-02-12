const mongoose = require("mongoose");

function connectDb() {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected to DB");
    })
    .catch((err) => {
      console.log(err.message);
      process.exit(1);
    });
}

module.exports = connectDb;
