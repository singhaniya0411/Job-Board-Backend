import express from "express";
import { registerUser, loginUser, getEmployerDashboard, getCandidateDashboard, updateApplicantStatus, getUserDetails } from "../controllers/userConrollers.js";
import { protect } from "../middleware/restrictAuth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/dashboard", protect, getEmployerDashboard);
router.get("/candidate-dashboard", protect, getCandidateDashboard);
router.get("/user-details", protect, getUserDetails);
router.put("/application/status/:applicationId", protect, updateApplicantStatus);

export default router;