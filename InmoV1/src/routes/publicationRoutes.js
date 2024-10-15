import express from "express";
import { createPublication } from "../controllers/publicationController.js";
import passport from "../auth/auth.js";

const router = express.Router();

router.post(
  "/create",
  passport.authenticate("jwt", { session: false }),
  createPublication
);

export default router;
