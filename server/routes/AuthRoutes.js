import { Router } from "express";
import multer from "multer";
import path from "path";
import {
  checkUser,
  generateToken,
  getAllUsers,
  onBoardUser,
  registerUser,
} from "../controllers/AuthController.js";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/resumes/"); // Save files to 'uploads/resumes/' directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post("/check-user", checkUser);
router.post("/onBoardUser", upload.single("resume"), onBoardUser);
router.post("/register", registerUser);
router.get("/get-contacts", getAllUsers);
router.get("/generate-token/:userId", generateToken);

export default router;
