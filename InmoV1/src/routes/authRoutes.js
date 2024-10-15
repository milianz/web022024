import express from "express";
import passport from "../auth/auth.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import User from "../models/userModel.js";

const router = express.Router();
router.use(cookieParser());

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400000,
    });
    res.redirect("http://localhost:5500/index.html");
  }
);

router.get("/check", (req, res) => {
  const token = req.cookies.token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          authenticated: false,
          message: "Token is invalid or expired",
        });
      }
      return res
        .status(200)
        .json({ authenticated: true, userId: decoded.id, token: token });
    });
  } else {
    return res
      .status(401)
      .json({ authenticated: false, message: "No token provided" });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});

router.get("/user", (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token is invalid or expired" });
    }

    try {
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json({
        name: user.name,
        email: user.email,
        picture: user.profilePicture,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
});

export default router;
