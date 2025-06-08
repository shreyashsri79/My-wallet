import { sql } from "../config/db.js";

export async function createTransactionController(req, res) {
  try {
	
		let { title, user_id, amount, category } = req.body;

		if (!title || !user_id || amount===undefined || !category) {
			return res.status(400).json({ error: "Missing required fields" });
		}

		if (category === 'expense') amount = -Math.abs(amount);
		if (category === 'income') amount = Math.abs(amount);

		const transaction = await sql`
			INSERT INTO transactions (title, user_id, amount, category)
			VALUES (${title}, ${user_id}, ${amount}, ${category})
			RETURNING *;
		`

		return res.status(201).json(transaction[0]);

	} 

	catch (error) {

		console.error("Error creating transaction:", error);
		return res.status(500).json({ error: "Internal Server Error" });

	}
}