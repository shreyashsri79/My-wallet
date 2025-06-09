import { View, Text, Alert, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
import { useUser } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { API_URL } from '@/constants/api_route'
import { styles } from '@/assets/styles/create.styles'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants/colors'

const CATEGORY_ICONS = [
  { name: "Food & Drinks", icon: "fast-food" },
  { name: "Shopping", icon: "cart" },
  { name: "Transportation", icon: "car" },
  { name: "Entertainment", icon: "film" },
  { name: "Bills", icon: "receipt" },
  { name: "Income", icon: "cash" },
  { name: "Other", icon: "ellipsis-horizontal" }
]


const Create = () => {
	const { user } = useUser();
	const router = useRouter();

	const [title, setTitle] = React.useState('');
	const [amount, setAmount] = React.useState('');
	const [isIncome, setIsIncome] = React.useState(false);
	const [loading, setLoading] = React.useState(false);

	const create = async () => {
		if (!user?.id) {
			setLoading(false);
			return Alert.alert('Error', 'User not found. Please sign in again.');
		}
		if (!amount || parseFloat(amount) <= 0) {
			setLoading(false);
			return Alert.alert('Error', 'Please enter a valid amount');
		}
		if (!title.trim()) {
			setLoading(false);
			return Alert.alert('Error', 'Please enter a title for the transaction');
		}
		setLoading(true);
		try {
			const response = await fetch(`${API_URL}/transactions`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					title,
					amount: amount,
					user_id: user.id,
					category : isIncome ? 'income' : 'expense',
				}),
			})
			if (!response.ok) {
				throw new Error('Failed to create transaction');
			}
			Alert.alert('Success', 'Transaction created successfully');
			router.back();
		} catch (error) {
			console.error('Error creating transaction:', error);
			Alert.alert('Error', 'An error occurred while creating the transaction. Please try again.');
		} finally {
			setLoading(false);
		}
	}
	  
  return (
		<View style={styles.container}>
			<View style={styles.header}>
				<TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
					<Ionicons name="arrow-back" size={24} color={COLORS.text} />
				</TouchableOpacity>
				<Text style={styles.headerTitle}>New Transaction</Text>
				<TouchableOpacity 
					style = {[styles.saveButtonContainer, loading && styles.disabledButton]}
					onPress={create}
					disabled={loading}
				>
					<Text style={styles.saveButton}>{loading ? 'Saving...' : 'Save'}</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.card}>
				<View style={styles.typeSelector}>
					<TouchableOpacity
						style={[styles.typeButton, !isIncome && styles.typeButtonActive]}
						onPress={() => setIsIncome(false)}
					>
						<Ionicons name = 'arrow-down-circle' size={24} color={!isIncome ? COLORS.white : COLORS.expense} style={styles.typeIcon} />
						<Text style={[styles.typeButtonText, !isIncome && styles.typeButtonActive]}>
							Expense
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[styles.typeButton, isIncome && styles.typeButtonActive]}
						onPress={() => setIsIncome(true)}
					>
						<Ionicons name = 'arrow-up-circle' size={24} color={isIncome ? COLORS.white : COLORS.income} style={styles.typeIcon} />
						<Text style={[styles.typeButtonText, isIncome && styles.typeButtonActive ]}>
							Income
						</Text>
					</TouchableOpacity>

				</View>

				<View style={styles.amountContainer}>
					<Text style={styles.currencySymbol}>₹</Text>
					<TextInput 
						style={styles.amountInput}
						placeholder='0.00'
						placeholderTextColor={COLORS.textLight}
						value={amount}
						onChangeText={setAmount}
						keyboardType='numeric'
					/>
				</View>

				<View style={styles.sectionTitle}>
					<Ionicons name ='pricetag'size={16} color={COLORS.text} style={{paddingRight : 10}}/>
					<Text style={styles.sectionTitle}>Category</Text>
				</View>

				<View style={styles.categoryGrid}>
					{CATEGORY_ICONS.map((category) => {
						return(
						<TouchableOpacity
							key={category.name}
							style={[styles.categoryButton, title === category.name && styles.categoryButtonActive]}
							onPress={() => setTitle(category.name)}
						>
							<Ionicons
								name={category.icon}
								size={20}
								color={title === category.name ? COLORS.white : COLORS.text}
							/>
							<Text style={[styles.categoryButtonText , title === category.name && styles.categoryButtonTextActive]}>{category.name}</Text>
						</TouchableOpacity>

					)})}
				</View>
			</View>
		</View>
  )
}

export default Create