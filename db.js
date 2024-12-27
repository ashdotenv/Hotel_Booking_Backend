import mongoose from "mongoose";

export const connectToDb = async () => {
  await mongoose
    .connect(process.env.DB_URI, {
      dbName: "Hotel_Booking",
    })
    .then((c) => {
      console.log("DB Connected to ", c.connection.host);
    })
    .catch((e) => {
      console.log(e.meesage);
    });
};
