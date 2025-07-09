import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (err) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};


export const isEmployee = (req, res, next) => {
  console.log("Middleware: Checking if user is an employee...");
  console.log("User from token:", req.user); // Log user data

  if (!req.user) {
    console.log("No user found in request.");
    return res.status(401).json({ message: "Unauthorized: No user found" });
  }

  if (req.user.role !== "employee") {
    console.log(`Access Denied: User role is ${req.user.role}, not employee`);
    return res.status(403).json({ message: "Access Denied: Only employers can post jobs" });
  }
  console.log("✅ User is authorized as employee.");
  next();
};



export const isJobSeeker = (req, res, next) => {
  if (req.user && req.user.role == "jobseeker") {
    next();
  }
  else {
    res.status(403).json({ message: "Access denied: Job seekers only" });
  };
}