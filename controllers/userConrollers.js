import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import Job from "../models/job.js";
import Application from "../models/applicationModel.js";
import nodemailer from "nodemailer";

export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({
      name, email, password: hashedPassword, role
    });
    res.status(201).json({ message: "User registered ", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentilas" });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });


  res.json({ message: "Login Successfully", token, user: { email: user.email, role: user.role } });
}


export const getEmployerDashboard = async (req, res) => {
  try {
    console.log("Fetching dashboard for user: ", req.user);  // Log the user
    const jobs = await Job.find({ postedBy: req.user.id }).lean();

    if (!jobs) {
      return res.status(404).json({ message: "No jobs found" });
    }

    for (let job of jobs) {
      const applications = await Application.find({ job: job._id })
        .populate("user", "name email")
        .lean();

      job.applicants = applications.map(app => ({
        _id: app._id,
        user: app.user,
        resumeUrl: app.resume ? `${process.env.BASE_URL}/uploads/${path.basename(app.resume)}` : null,
        status: app.status,
        appliedAt: app.createdAt
      }));
    }



    res.json(jobs);
  } catch (error) {
    console.log("Error in getEmployerDashboard: ", error);  // Log the error
    res.status(500).json({ message: "Failed to fetch dashboard data." });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    console.log("Sending details of user to frontend");

    console.log(req.user.name);
    const userInfo = {
      name: req.user.name,
      email: req.user.email,
      role: req.user.role // or any other field you need
    };

    res.status(200).json(req.user);

  } catch (error) {
    console.error(error.message);
  }
}

export const getCandidateDashboard = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user.id }).populate("job", "title company location").lean();

    res.json(applications.map(app => ({
      _id: app._id,
      status: app.status,
      createdAt: app.createdAt,
      resume: app.resume,
      job: {
        _id: app.job?._id,
        title: app.job?.title,
        company: app.job?.company,
        location: app.job?.location,
      }
    })));
  } catch (error) {
    console.error("Error in candidate Dashboard:", error);
    res.status(500).json({ message: "Failed to load Dashboard" });
  }
}

export const updateApplicantStatus = async (req, res) => {
  const { applicationId } = req.params;
  const { userId, status } = req.body;

  try {
    // Find the application by ID
    const application = await Application.findById(applicationId).populate("user job");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    await application.save();


    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "noreply.jobboard000@gmail.com",
        pass: "cxkpwrqqmxuxyzeh"
      }
    });

    const mail = {
      from: process.env.EMAIL,
      to: application.user.email,
      subject: `Update on your application for ${application.job.title}`,
      text: `Hi ${application.user.name}, Your application status for the opportunity of ${application.job.title} at ${application.job.company} has been updated to : ${status}.
      
      We will keep you informed with further updates.
      
      Best Regards,
      
      ${application.job.company} Recruitment Team`
    };

    await transporter.sendMail(mail);

    res.status(200).json({ message: "Status updated and email sent successfully ." });
  } catch (error) {
    console.error("Error in updating application status : ", error);
    res.status(500).json({ message: "Failed to update status or send email" });
  }
};



