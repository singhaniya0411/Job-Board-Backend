import Job from "../models/job.js";
import path from "path"
import Application from "../models/applicationModel.js";

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const createJobs = async (req, res) => {
  try {
    const { title, company, description, location, salary, requirements } = req.body;

    const job = await Job.create({ title, company, description, location, salary, requirements, postedBy: req.user.id });

    await job.save();
    res.status(201).json({ message: "Job posted successfully!", job });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const applyForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    console.log("user info from token: ", req.user);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const existingApplication = await Application.findOne({
      job: req.params.id,
      user: req.user.id,
    });

    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied for this job" });
    }

    //Resume Present or not
    if (!req.file) {
      return res.status(400).json({ message: "Please upload a resume" });
    }

    // new application with resume and other details
    const newApplication = new Application({
      job: req.params.id,
      user: req.user.id,
      resume: req.file.path,  //file path(resume)
      status: "pending",
    });

    // Save 
    await newApplication.save();

    res.json({ message: "Job application submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getJobsPostedByEmployee = async (req, res) => {
  try {

    const jobs = await Job.find({ postedBy: req.user.id }).lean();

    for (let job of jobs) {
      const applications = await Application.find({ job: job._id }).populate("user", "name email").lean();

      console.log(`${process.env.BASE_URL}/uploads/${path.basename(app.resume)}`);

      job.applicants = applications.map(app => ({
        user: app.user,
        resumeUrl: `${process.env.BASE_URL}/uploads/${path.basename(app.resume)}`,

        status: app.status,
        appliedAt: app.createdAt
      }));
    }

    res.json(jobs);

  }
  catch (err) {
    res.status(500).json({ message: err.message });
  }
}


