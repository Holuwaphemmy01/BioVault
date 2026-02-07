import express, { Request, Response } from "express";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { protect, researcher } from "../middleware/authMiddleware.js";

const router = express.Router();

// @route   POST /api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { walletAddress } = req.body;

  if (!walletAddress) {
    res.status(400).json({ message: "Wallet address is required" });
    return;
  }

  try {
    const user = await User.findOne({ walletAddress });

    if (user) {
      res.json({
        _id: user._id,
        walletAddress: user.walletAddress,
        role: user.role,
        token: generateToken(user._id.toString(), user.role),
      });
    } else {
      res.status(404).json({ message: "User not found. Please register." });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/users
// @desc    Register a new user
// @access  Public
router.post("/", async (req: Request, res: Response): Promise<void> => {
  const { walletAddress, role } = req.body;

  if (!walletAddress || !role) {
    res.status(400).json({ message: "Please provide wallet address and role" });
    return;
  }

  try {
    let user = await User.findOne({ walletAddress });

    if (user) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    user = new User({
      walletAddress,
      role,
    });

    const createdUser = await user.save();
    res.status(201).json({
      _id: createdUser._id,
      walletAddress: createdUser.walletAddress,
      role: createdUser.role,
      token: generateToken(createdUser._id.toString(), createdUser.role),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/users/protected-data
// @desc    Get all protected data (for researchers)
// @access  Private/Researcher
router.get("/protected-data", protect, researcher, async (req: Request, res: Response) => {
    // In a real application, you would fetch the actual protected data.
    // For this example, we'll return a mock list.
    const mockData = [
        { id: "1", name: "Genomic Sequence Alpha", owner: "Patient A" },
        { id: "2", name: "Cardiovascular History Beta", owner: "Patient B" },
        { id: "3", name: "Oncology Report Gamma", owner: "Patient C" },
    ];
    res.json(mockData);
});


export default router;
