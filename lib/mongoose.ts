import mongoose, { Mongoose } from "mongoose";

import logger from "./logger";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

type MongooseCache = {
  conn: Mongoose | null;
  promose: Promise<Mongoose> | null;
};

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promose: null,
  };
}

const dbConnect = async (): Promise<Mongoose> => {
  if (cached.conn) {
    logger.info("Using existing mongoose connection");
    return cached.conn;
  }
  if (!cached.promose) {
    cached.promose = mongoose
      .connect(MONGODB_URI, { dbName: "devflow" })
      .then((result) => {
        logger.info("Connected to MongoDB");
        return result;
      })
      .catch((error) => {
        logger.error("Error connecting to MongoDB:", error);
        throw error;
      });
  }
  cached.conn = await cached.promose;
  return cached.conn;
};

export default dbConnect;
