import mongoose from "mongoose";



const jobSchema = new mongoose.Schema({
  title: String,
  company: String,
  description: String,
  location: String,
  salary: Number,
  requirements: String,
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.model("Job", jobSchema);
