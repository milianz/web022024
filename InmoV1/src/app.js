import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import passport from "./auth/auth.js";
import authRoutes from "./routes/authRoutes.js";
import publicationRoutes from "./routes/publicationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));

app.use(
  cors({
    origin: "http://localhost:5500",
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use("/publications", publicationRoutes);
app.use("/admin", adminRoutes);

export default app;
