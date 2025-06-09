import express from "express";
import dotenv from "dotenv";
import rateLimiter from "./middleware/rateLimiter.js";
import transactionsRoutes from "./routes/transactionsRoute.js";
import { connectToDatabase } from "./config/db.js";
import job from "./config/cron.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT

if (process.env.NODE_ENV !== "production") {
	job.start();
}

app.use(rateLimiter);

app.use(express.json());

app.use("/api/transactions", transactionsRoutes);


app.get('/health', (req, res) => {
	res.status(200).json({ status: "OK", message: "Server is healthy" });
});


connectToDatabase().then(() => {
	app.listen(PORT, () => {
		console.log(`Server is running on port ${PORT}`);
	});
});