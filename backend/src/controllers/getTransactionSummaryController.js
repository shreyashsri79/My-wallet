import { sql } from "../config/db.js";
export async function getTransactionsSummaryByUserID (req, res) {

	const { user_id } = req.params;
    
	if (!user_id) {
		return res.status(400).json({ error: "User ID is required" });
	}
	
	try {

		const balance = await sql`
			SELECT COALESCE(SUM(amount), 0) as balance FROM transactions WHERE user_id = ${user_id}
		`
		const income = await sql`
			SELECT COALESCE(SUM(amount), 0) as income FROM transactions WHERE user_id = ${user_id} AND category = 'income'
		`
		const expense = await sql`
			SELECT COALESCE(SUM(amount), 0) as expense FROM transactions WHERE user_id = ${user_id} AND category = 'expense'
		`
		
		res.status(200).json({
			"balance": Math.abs(balance[0].balance),
			"income": Math.abs(income[0].income),
			"expense": Math.abs(expense[0].expense)
		})

	}
	
	catch (error) {
		console.error("Error fetching transaction summary:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}
    
}
