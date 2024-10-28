import mongoose from "mongoose";

export const db_init = async () => {
  try {
    const db = await mongoose.connect("mongodb://localhost:27017", {
      dbName: "wallets_fishing",
    });
    console.log(`[INFO] MongoDB connected (${db.connection.host})`);
  } catch (e) {
    console.error(`[ERROR]: Unable to connect to MongoDB`, e);
  }
};

export const db_close = async () => {
  try {
    const db = await mongoose.disconnect();
    console.log(`[INFO] MongoDB disconnected`);
  } catch (e) {
    console.error(`[ERROR]: Unable to disconnect from MongoDB`, e);
  }
};
