import 'dotenv/config';
import mongoose from 'mongoose';

async function connect() {
  try {
    await mongoose.connect(
      process.env.MONGO_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log('Connect to DB success');
  } catch (e) {
    console.log('Fail Connect', e.message);
    process.exit(1);
  }
}

export { connect };
