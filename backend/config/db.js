import mongoose from "mongoose";

const connectDB=async () => {
  try {
    const connectionInstance=await mongoose.connect(process.env.DB_URL);
    console.log(`mongodb connected successfully, DB Host :${connectionInstance.connection.host} `)
  } catch (error) {
    console.log("mongodb connection Failed!!!",error);
    process.exit(1);
  }
}

export default connectDB;
