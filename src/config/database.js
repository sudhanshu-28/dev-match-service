const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://sudhanshurai:vL1UBPdxTqZxnHMK@nodejsapp.id2v7.mongodb.net/NodeJSApp"
  );
};

module.exports = { connectDB };
