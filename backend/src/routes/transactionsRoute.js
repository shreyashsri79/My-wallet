import express from 'express';
import { getTransactionsSummaryByUserID } from '../controllers/getTransactionSummaryController.js';
import { getTransactionsByUserID } from '../controllers/getTransactionByUserIdController.js';
import { createTransactionController } from '../controllers/createTransactionController.js';
import { deleteTransactionController } from '../controllers/deleteTransactions.js';

const router = express.Router();

router.get('/summary/:user_id', getTransactionsSummaryByUserID);

router.get('/:user_id', getTransactionsByUserID)

router.post('/', createTransactionController);

router.delete('/:id', deleteTransactionController);

export default router;