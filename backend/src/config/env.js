import "dotenv/config"

export const ENV = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_SECRET_EXPIRY: process.env.JWT_SECRET_EXPIRY,
};