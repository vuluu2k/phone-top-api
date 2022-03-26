import 'dotenv/config';
import mongoose from 'mongoose';

async function connect() {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.pay0f.mongodb.net/ShopTop?retryWrites=true&w=majority`,
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
