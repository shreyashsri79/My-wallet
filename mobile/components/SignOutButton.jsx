import { useClerk } from '@clerk/clerk-expo'
import * as Linking from 'expo-linking'
import { Alert, Text, TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk()
  const handleSignOut = async () => {

    Alert.alert("Log Out", "Are you sure you want to log out?", [
      {text : "Cancel", style: "cancel"},
      {text : "Log Out", style: "destructive", onPress: async () => {
        await signOut()
        // Redirect to your desired page
        Linking.openURL(Linking.createURL('/'))
      }}
    ])
  }
  return (
    <TouchableOpacity onPress={handleSignOut}>
      <Ionicons name = 'log-out-outline' size={22} color='black' />
    </TouchableOpacity>
  )
}