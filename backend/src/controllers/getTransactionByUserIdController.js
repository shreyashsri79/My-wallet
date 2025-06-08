import { sql } from "../config/db.js";
export async function getTransactionsByUserID (req, res) {

	const {user_id} = req.params;

	if (!user_id) {
		return res.status(400).json({ error: "User ID is required" });
	}

	try {
		const transactions = await sql`
			SELECT * FROM transactions WHERE user_id = ${user_id} ORDER BY created_at DESC;		
		`

		if (transactions.length === 0) {
			return res.status(404).json({ message: "No transactions found" });
		}

		return res.status(200).json(transactions);

	} catch (error) {
		console.error("Error fetching transactions:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}

}