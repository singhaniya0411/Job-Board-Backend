import express from "express";

import { getAllJobs, createJobs, getJobById, applyForJob } from "../controllers/jobControllers.js";
import auth from "../middleware/auth.js";
import { protect, isEmployee, isJobSeeker } from "../middleware/restrictAuth.js";
import Job from "../models/job.js";
import upload from "../middleware/upload.js"

const router = express.Router();

router.get("/", getAllJobs);
router.post("/", auth, protect, isEmployee, createJobs);
router.get("/:id", getJobById);
router.post("/:id/apply", protect, isJobSeeker, upload.single("resume"), applyForJob);
router.get("/jobs", async (req, res) => {
  const { title } = req.query;

  try {
    let query = {};
    if (title) {
      query.title = { $regex: title, $options: "i" };
    }

    const jobs = await Job.find(query);
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error in fetching jobs", error);
    res.status(500).json({ message: "Internal server Error" });
  }
})

export default router;