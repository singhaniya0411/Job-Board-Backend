import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;

    await mongoose.connect(MONGO_URI, {
      dbName: 'job-board',
    });
    console.log("MongoDB Connected");
  }
  catch (error) {
    console.error("MongoDB connection failed ,", error);
  }
};

export default connectDB;
