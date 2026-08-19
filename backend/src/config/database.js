const mongoose = require("mongoose")

function connectToDb() {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("connect to database.")
    })
    .catch((err) => {
      console.log("error connecting to database", err)
    })
}


module.exports = connectToDb