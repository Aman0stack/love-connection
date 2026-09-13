import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`[MongoDB] Connected to cluster: ${conn.connection.host}, database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('[MongoDB] Connection failed:', error.message);
    throw error;
  }
}
