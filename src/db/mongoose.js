import mongoose from 'mongoose';

let isConnected = false;

export async function connectMongo(url) {
  if (isConnected) return;

  // Default Atlas URL (requires password replacement) - do not hardcode actual password
  const defaultAtlasUrl = 'mongodb+srv://coderback:<coderback123>@backend1-cluster.fw30jvi.mongodb.net/?appName=backend1-cluster';
  const envUrl = process.env.MONGO_URL;
  const password = process.env.MONGO_PASSWORD;

  // Prefer explicit MONGO_URL, otherwise use the bundled Atlas template
  let mongoUrl = url || envUrl || defaultAtlasUrl;

  // If using placeholder, and password is available, replace it
  if (mongoUrl.includes('<coderback123>')) {
    if (password) {
      mongoUrl = mongoUrl.replace('<coderback123>', encodeURIComponent(password));
    } else {
      console.warn('MONGO_PASSWORD not set; falling back to local mongodb://127.0.0.1:27017/ecommerce');
      mongoUrl = 'mongodb://127.0.0.1:27017/ecommerce';
    }
  }

  // If user explicitly provides env var, try to connect to it
  try {
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.warn('MongoDB connection failed:', err.message);
    if (!mongoUrl.startsWith('mongodb://127.0.0.1') && !mongoUrl.startsWith('mongodb://localhost')) {
      console.warn('Falling back to local MongoDB at mongodb://127.0.0.1:27017/ecommerce');
      await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } else {
      throw err;
    }
  }

  isConnected = true;
  console.log('Connected to MongoDB:', mongoUrl.replace(/:[^:@]+@/, ':*****@'));
}

export function disconnectMongo() {
  if (!isConnected) return;
  mongoose.disconnect();
  isConnected = false;
}
