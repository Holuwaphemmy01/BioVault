"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const User_1 = __importDefault(require("../models/User"));
const router = express_1.default.Router();
// @route   GET /api/users/:address
// @desc    Check if user exists
// @access  Public
router.get("/:address", async (req, res) => {
    try {
        const user = await User_1.default.findOne({ walletAddress: req.params.address });
        if (user) {
            res.json(user);
        }
        else {
            res.status(404).json({ message: "User not found" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
// @route   POST /api/users
// @desc    Register a new user
// @access  Public
router.post("/", async (req, res) => {
    const { walletAddress, role } = req.body;
    if (!walletAddress || !role) {
        res.status(400).json({ message: "Please provide wallet address and role" });
        return;
    }
    try {
        let user = await User_1.default.findOne({ walletAddress });
        if (user) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        user = new User_1.default({
            walletAddress,
            role,
        });
        await user.save();
        res.status(201).json(user);
    }
    catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});
exports.default = router;
//# sourceMappingURL=userRoutes.js.map