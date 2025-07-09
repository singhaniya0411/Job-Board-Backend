import mongoose from 'mongoose';
import { type } from 'os';

const applicantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  resume: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "Accepted for interview", "Rejected"],
    default: "pending",
  },

}, { timestamps: true });

const Application = mongoose.model('Application', applicantSchema);

export default Application;
