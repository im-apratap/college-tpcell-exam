import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { ENV } from "../config/env.js";

export const registerUser = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      throw new ApiError(400, "User with email or username already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      username: username.toLowerCase(),
      email,
      password: hashedPassword,
      role: role || "user",
    });

    await user.save();

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken",
    );

    if (!createdUser) {
      throw new ApiError(
        500,
        "Something went wrong while registering the user",
      );
    }

    const payload = { userId: user._id, role: user.role };
    const token = jwt.sign(payload, ENV.JWT_SECRET, {
      expiresIn: ENV.JWT_SECRET_EXPIRY,
    });

    return res
      .status(201)
      .cookie("accessToken", token, { httpOnly: true, secure: true })
      .json(
        new ApiResponse(
          201,
          { user: createdUser, accessToken: token },
          "User registered successfully",
        ),
      );
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!(username || email)) {
      throw new ApiError(400, "username or email is required");
    }

    if (!password) {
      throw new ApiError(400, "password is required");
    }

    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (!user) {
      throw new ApiError(400, "Invalid Credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(400, "Invalid Credentials");
    }

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken",
    );

    const payload = { userId: user._id, role: user.role };
    const token = jwt.sign(payload, ENV.JWT_SECRET, {
      expiresIn: ENV.JWT_SECRET_EXPIRY,
    });

    return res
      .status(200)
      .cookie("accessToken", token, { httpOnly: true, secure: true })
      .json(
        new ApiResponse(
          200,
          { user: loggedInUser, accessToken: token },
          "User logged in successfully",
        ),
      );
  } catch (error) {
    next(error);
  }
};
