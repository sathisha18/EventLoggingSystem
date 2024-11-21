import express from "express";
import dotenv from "dotenv";
import cors from "cors";

const app = express();
dotenv.config();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    withCredentials: true,
  }),
);

// Routes
import eventRoute from "./routes/eventRoute.js";
import ConnectDB from "./db/connectDB.js";

app.use("/api/events", eventRoute);
app.get("/", (req, res) => {
  res.send("Hello Aman Meenia");
});

const PORT = process.env.PORT;
const startServer = async () => {
  try {
    await ConnectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database", error);
    process.exit(1);
  }
};

startServer();
