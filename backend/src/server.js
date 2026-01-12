import express from 'express';
import notesRoutes from './routes/notesRoutes.js';
import connectDB from './config/db.js';
import connectRedis from './config/redisConnect.js';
import { simpleRateLimit } from './middleware/simpleRateLimit.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// connect to database
connectDB();

// connect to redis
connectRedis();

// use middleware to parse JSON request bodies
app.use(express.json());

// Custom logging middleware
app.use((req, res, next) => {
  console.log(`Request method is ${req.method} & Request URL is ${req.url}`);
  next();
});

// apply simple rate limiting middleware to all /api/ routes
app.use('/api/', simpleRateLimit);

app.use("/api/notes", notesRoutes);



app.listen(PORT, () => {
  console.log("Server is running on port:", PORT);
  console.log("Designed and developed by Pengchao Ma");
});

