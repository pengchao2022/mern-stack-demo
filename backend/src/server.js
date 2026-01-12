import express from 'express';
import notesRoutes from './routes/notesRoutes.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// connect to database
connectDB();

// use middleware to parse JSON request bodies
app.use(express.json());

// Custom logging middleware
app.use((req, res, next) => {
  console.log(`Request method is ${req.method} & Request URL is ${req.url}`);
  next();
});
app.use("/api/notes", notesRoutes);

app.listen(PORT, () => {
  console.log("Server is running on port:", PORT);
  console.log("Designed and developed by Pengchao Ma");
});

