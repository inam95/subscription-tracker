import mongoose from 'mongoose';
import { env } from '../config/env';

const connectToDatabase = async () => {
  try {
    await mongoose.connect(env.DB_URI);
    console.log('🟢 The database is connected');
  } catch (error) {
    console.error('❌ Error connecting to the database');
    console.error(error);
    process.exit(1);
  }
};

export default connectToDatabase;
