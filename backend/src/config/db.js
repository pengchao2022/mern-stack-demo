// db/connectDB.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    // Get MongoDB connection string from environment variables
    const mongoURI = process.env.MONGO_URI;
    
    await mongoose.connect(mongoURI, {
      dbName: 'mydatabase'  
    });
    
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // exit with failure
  }
};

export default connectDB;