import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const MONGO_URI = "mongodb+srv://vishalsinghaniya:RlMh6fV0uSTFTV9t@job-board-db.tf3vkap.mongodb.net/?retryWrites=true&w=majority&appName=job-board-db";

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