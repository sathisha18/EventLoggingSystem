import mongoose from "mongoose";

const ConnectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (err) {
    console.log("Error while Connectiong to DB");
    throw err;
  }
};

export default ConnectDB;
