import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Alert, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native'
import { useState } from 'react'
import { SignOutButton } from '@/components/SignOutButton'
import  useTransaction from '@/hooks/useTransaction'
import { useEffect } from 'react'
import PageLoader from '@/components/PageLoader'
import { Redirect } from "expo-router";
import { styles } from '@/assets/styles/home.styles'
import { COLORS } from '@/constants/colors'
import { Image } from 'expo-image'
import logo from '@/assets/images/logo.png'
import { Ionicons } from '@expo/vector-icons'
import { BalanceCard } from '@/components/BalanceCard'
import Transactionitems from '@/components/Transactionitems'
import NoTransactionsFound from '@/components/NoTransactionsFound'

export default function Page() {

  const { user } = useUser()
  let { transactions, summary, loading, loadData, deleteTransaction } = useTransaction(user?.id)
  const router = useRouter()


  const [refreshing, setRefreshing] = useState(false)
  const refreshControl = async () => {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }

  const handleDelete = (id) => {
    Alert.alert("Delete Transaction", "Are you sure you want to delete the transaction ?",
      [
        {text : "Cancel", style : 'cancel'},
        {text : "Delete", style : 'destructive', onPress: () => deleteTransaction(id)}
      ]
    )
  } 

  useEffect(() => {
    loadData()
  },[loadData])

  if (!user) {
    return (
    <Redirect href={'/sign-in'} />
  )}

  if (loading) {
    return <PageLoader />
  }

  if (transactions.message === 'No transactions found') transactions = []

  console.log(user.id)
  return (
    <View style={styles.container}>
      <View style={styles.content}>


        <View style={styles.header}>

          <View style={styles.headerLeft}>
            <Image
              source={logo}
              style={styles.headerLogo}
            />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome</Text>
              <Text style={styles.usernameText}>
                {user.emailAddresses[0]?.emailAddress.split('@')[0] || user.firstName || 'User'}
              </Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.addButton} 
              onPress={() => router.push('/create')}
            >
              <Ionicons name='add' size={20} color='#fff' />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <SignOutButton />
          </View>

        </View>

        <BalanceCard summary={summary}/>

        {transactions && transactions.length > 0 &&
          <FlatList 
            contentContainerStyle={styles.transactionsListContent}
            data={transactions}
            horizontal={false}
            ListEmptyComponent={<NoTransactionsFound/>}
            refreshControl={<RefreshControl refreshing={refreshing} onRefrshing={refreshControl}/>}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => item.id?.toString() || index.toString()}
            renderItem={ ({item}) => {
              return(
                <Transactionitems item={item} onDelete={handleDelete}/>
              )
            }}
          />
        }
        
      </View>
    </View>
  )
}