import express, { Request, Response } from "express";
import User from "../models/User.js";

const router = express.Router();

// @route   GET /api/users/:address
// @desc    Check if user exists
// @access  Public
router.get("/:address", async (req: Request, res: Response): Promise<void> => {
  try {
    const address = req.params.address;
    if (!address) {
      res.status(400).json({ message: "Address is required" });
      return;
    }
    const user = await User.findOne({ walletAddress: address });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
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

    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
