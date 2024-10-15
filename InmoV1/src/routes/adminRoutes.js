import express from "express";
import User from "../models/userModel.js";
import Publication from "../models/publicationModel.js";

const router = express.Router();

async function isAdmin(req, res, next) {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "No autenticado" });
    }

    const user = await User.findById(req.user.id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({
        error: "Forbidden: Only admin users can access this resource",
      });
    }

    next();
  } catch (error) {
    console.error("Error en la verificación de admin:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

router.get("/users", isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error });
  }
});

router.get("/publications", isAdmin, async (req, res) => {
  try {
    const publications = await Publication.find();
    res.status(200).json(publications);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener publicaciones", error });
  }
});

export default router;
