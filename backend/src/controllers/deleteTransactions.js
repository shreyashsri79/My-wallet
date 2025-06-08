import { sql } from "../config/db.js";

export const deleteTransactionController = async (req, res) => {
	const { id } = req.params;

	try {

		const result = await sql`
			DELETE FROM transactions WHERE id = ${id} RETURNING *;
		`;

		if (result.length === 0) {
			return res.status(404).json({ message: "Transaction not found" });
		}

		return res.status(200).json({ message: "Transaction deleted successfully" });

	} 
	
	catch (error) {
		console.error("Error deleting transaction:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	}

}