import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import userRoute from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import messageRoute from "./routes/message.routes.js"

const app = express();


dotenv.config();

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true 
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// root routes
app.use("/api/v1/user",userRoute);
app.use("/api/v1/message",messageRoute);


//error handler
app.use(notFound);  //handles undefined routes
app.use(errorHandler);  // handles global error



export default app;