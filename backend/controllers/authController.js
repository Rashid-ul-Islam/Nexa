import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Signs a JWT session token for the user.
 */
const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

/**
 * POST /api/auth/register
 * Creates a student account and returns token.
 */
export const register = async (req, res) => {
  try {
    const { email, password, displayName } = req.body;

    if (!email || !password || !displayName) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Email, password, and display name are required." },
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Password must be at least 8 characters long." },
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: { code: "EMAIL_ALREADY_REGISTERED", message: "Email is already registered." },
      });
    }

    const user = await User.create({
      email: email.toLowerCase().trim(),
      password,
      displayName: displayName.trim(),
    });

    const token = signToken(user._id);

    return res.status(201).json({
      success: true,
      message: "Account created successfully!",
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Registration failed. Please try again." },
    });
  }
};

/**
 * POST /api/auth/login
 * Validates credentials and returns JWT token.
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { code: "VALIDATION_ERROR", message: "Please provide email and password." },
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password." },
      });
    }

    // Update last login
    user.lastLoginAt = new Date();
    await user.save({ validateBeforeSave: false });

    const token = signToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Signed in successfully!",
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Login failed. Please try again." },
    });
  }
};

/**
 * GET /api/auth/me
 * Returns currently authenticated user.
 */
export const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user.toSafeObject(),
  });
};

/**
 * PUT /api/profile
 * Updates student profile details.
 */
export const updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      "educationLevel",
      "major",
      "majorFieldId",
      "university",
      "graduationYear",
      "country",
      "address",
      "experienceLevel",
      "remotePreference",
      "skillIds",
      "interestFieldIds",
      "preferredCategoryIds",
      "preferredLocations",
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[`profile.${field}`] = req.body[field];
      }
    }

    // Support location as either GeoJSON { type: 'Point', coordinates: [lng, lat] } or simple { lat, lng }
    if (req.body.location !== undefined) {
      if (req.body.location === null) {
        updates["profile.location"] = null;
      } else if (
        Array.isArray(req.body.location.coordinates) &&
        req.body.location.coordinates.length === 2
      ) {
        updates["profile.location"] = {
          type: "Point",
          coordinates: [
            Number(req.body.location.coordinates[0]),
            Number(req.body.location.coordinates[1]),
          ],
        };
      } else if (
        req.body.location.lat !== undefined &&
        req.body.location.lng !== undefined
      ) {
        updates["profile.location"] = {
          type: "Point",
          coordinates: [
            Number(req.body.location.lng),
            Number(req.body.location.lat),
          ],
        };
      }
    }

    if (req.body.displayName) {
      updates.displayName = req.body.displayName.trim();
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      user: user.toSafeObject(),
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to update profile." },
    });
  }
};
