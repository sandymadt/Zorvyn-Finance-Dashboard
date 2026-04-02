const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('❌ Error connecting to MongoDB:');
        console.error(error.message);
        console.warn('\n💡 Troubleshooting:');
        console.warn('1.  Ensure your local MongoDB service is running (e.g., "net start MongoDB" on Windows).');
        console.warn('2.  If you have Docker installed, try running: "docker-compose up -d".');
        console.warn('3.  Check if your MONGODB_URI in the ".env" file matches your environment.\n');
        process.exit(1);
    }
};

module.exports = connectDB;
