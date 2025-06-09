import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { styles } from '@/assets/styles/home.styles'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants/colors'
import formatDate from '@/libs/utils'


const CATEGORY_ICONS = {
	"Food & Drinks" : 'fast-food',
	Shopping : 'cart',
	Transportation : 'car',
	Entertainment : 'film',
	Bills : 'receipt',
	Income : 'cash',
	Other : 'ellipsis-horizontal'
}

const Transactionitems = ({item, onDelete}) => {

	const isIncome = item.category === 'income'
	const iconName = CATEGORY_ICONS[item.title] || 'pricetag-outline'
	return (
		<View style={styles.transactionCard} key={item.id}>
			<TouchableOpacity style={styles.transactionContent}>
				<View style={styles.categoryIconContainer}>
					<Ionicons name={iconName} size={22} color={isIncome ? COLORS.income : COLORS.expense}/>
				</View>
				<View style={styles.transactionLeft}>
					<Text style={styles.transactionTitle}>{item.title}</Text>
				</View>
				<View style={styles.transactionRight}>
					<Text
						style={[styles.transactionAmount, {color : isIncome ? COLORS.income : COLORS.expense}]}
					>
						{isIncome ? '+' : "-"} ₹ {parseFloat(item.amount).toFixed(2)}
					</Text>
					<Text style={styles.transactionDate}>{formatDate(item.created_at)}</Text>
				</View>
			</TouchableOpacity>
			<TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(item.id)}>
				<Ionicons name='trash-bin-outline' size={20} color={COLORS.expense} />
			</TouchableOpacity>
		</View>
	)
}

export default Transactionitems

