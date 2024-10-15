import Publication from "../models/publicationModel.js";
import passport from "passport";

export const createPublication = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const publicationData = req.body;
    const publication = new Publication({
      ...publicationData,
      seller: req.user._id,
    });
    await publication.save();
    res
      .status(201)
      .json({ message: "Publication created successfully", publication });
  } catch (error) {
    res.status(400).json({ message: "Failed to create publication", error });
  }
};
