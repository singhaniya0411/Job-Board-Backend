import mongoose from "mongoose";

const connectDB = async () => {
  try {
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
