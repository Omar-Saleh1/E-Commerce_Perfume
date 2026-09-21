import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce_db';
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host} / ${conn.connection.name}`);

    // Automatically clean legacy orderId unique index if present
    try {
      const ordersCollection = conn.connection.collection('orders');
      const indexes = await ordersCollection.indexes();
      const legacyIndex = indexes.find(
        (idx) => idx.name === 'orderId_1' || (idx.key && idx.key.orderId)
      );
      if (legacyIndex) {
        await ordersCollection.dropIndex(legacyIndex.name);
        console.log(`🧹 Dropped legacy index '${legacyIndex.name}' from orders collection`);
      }
    } catch {
      // Collection or index might not exist yet
    }
  } catch (error: any) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

