import { useState, useEffect, useCallback, Alert } from 'react';
import { API_URL } from '@/constants/api_route';


const useTransaction = (userId) => {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({
        balance: 0,
        income: 0,
        expense: 0
    });
    const [loading, setLoading] = useState(true);


    //callback to fetch transaction summary it memoizes the function
    const fetchTransactions = useCallback(
        async () => {
        try {
            const response = await fetch(`${API_URL}/transactions/${userId}`);
            const data = await response.json();
            setTransactions(data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    },[userId])

    const fetchTransactionSummary = useCallback(
        async () => {
        try {
            const response = await fetch(`${API_URL}/transactions/summary/${userId}`);
            const data = await response.json();
            setSummary(data);
        } catch (error) {
            console.error('Error fetching transaction summary:', error);
        }
    },[userId])

    const loadData = useCallback(async () => {
        if (!userId) return;
        setLoading(true);
        
        try {
            // Fetch both transactions and summary concurrently
            await Promise.all([
                fetchTransactions(),
                fetchTransactionSummary()
            ]);
        } catch (error) {
            console.error('Error loading data:', error);
        } finally {
            setLoading(false);
        }

    }, [fetchTransactions, fetchTransactionSummary]);

    const deleteTransaction = useCallback(
        async (transactionId) => {
            try {
                const response = await fetch(`${API_URL}/transactions/${transactionId}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    throw new Error('Failed to delete transaction');
                }
                await loadData(); // Refresh data after deletion
                Alert.alert('Success', 'Transaction deleted successfully');
            } catch (error) {
                console.error('Error deleting transaction:', error);
            }
        }, [loadData]
    );
        
    return { transactions, summary, loading, loadData, deleteTransaction };

}

export default useTransaction;