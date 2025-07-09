import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  let token = req.header("Authorization");
  console.log("Auth Middleware - Token Received:", token);

  if (!token) {
    console.log(" No token provided");
    return res.status(401).json({ message: "Access denied! No token provided." });
  }

  try {
    token = token.replace(/^Bearer\s+/, "");
    console.log(token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    req.user = decoded;
    console.log("✅ Authenticated User:", req.user);
    next();
  } catch (error) {
    console.log("Invalid or expired token", error.message);
    res.status(403).json({ message: "Invalid or expired token" });
  }
};

export default auth;
