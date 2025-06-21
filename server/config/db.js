const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const db = process.env.MONGO_URI;

const connectDB = async () => {
	try {
		await mongoose.connect(db, {}).then(() => {
			console.log("Connected to DB");
		});
	} catch (error) {
		console.error("Failed to connect to DB:", error.message);
		process.exit(1);
	}
};

module.exports = connectDB;
