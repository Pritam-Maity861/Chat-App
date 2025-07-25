import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import userRoute from "./routes/user.routes.js";
import cookieParser from "cookie-parser";
import messageRoute from "./routes/message.routes.js"

const app = express();


dotenv.config();

const allowedOrigins = [
  "http://localhost:5173",
  "https://golpogujob.netlify.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// root routes
app.get("/",(req,res) => {
  res.json("app deployed.")
}
)
app.use("/api/v1/user",userRoute);
app.use("/api/v1/message",messageRoute);




//error handler
app.use(notFound);  //handles undefined routes
app.use(errorHandler);  // handles global error



export default app;