import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "manager"],
      default: "user",
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true },
);

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      userId: this._id,
      email: this.email,
      username: this.username,
      role: this.role,
    },
    ENV.ACCESS_TOKEN_SECRET,
    {
      expiresIn: ENV.ACCESS_TOKEN_EXPIRY,
    },
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      userId: this._id,
    },
    ENV.REFRESH_TOKEN_SECRET,
    {
      expiresIn: ENV.REFRESH_TOKEN_EXPIRY,
    },
  );
};

export const User = mongoose.model("User", userSchema);
