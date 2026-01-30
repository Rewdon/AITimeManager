const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI;

        if (!uri) {
            console.error('Error: MONGO_URI is not defined in .env file');
            process.exit(1);
        }

        const conn = await mongoose.connect(uri);

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        if (error.message.includes('URI malformed')) {
            console.error('Error: MongoDB URI is malformed. Check for special characters in your password.');
            console.error('Hint: Use encodeURIComponent() for special characters or check your .env file syntax.');
        } else {
            console.error(`Error: ${error.message}`);
        }
        
        process.exit(1);
    }
};

module.exports = connectDB;