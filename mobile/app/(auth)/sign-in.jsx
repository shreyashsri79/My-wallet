import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants/colors'
import { styles } from '@/assets/styles/auth.styles'
import { Image } from 'expo-image'
import img from '@/assets/images/revenue-i3.png'

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return
    setError('')
    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      setError(err.errors?.[0]?.message || 'An error occurred during sign-in. Please try again.')
    }
  }

  return (
    <KeyboardAwareScrollView 
      style={{flex:1}}
      contentContainerStyle={{flexGrow:1}}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={120}
    >

      <View style={{...styles.container, alignItems : 'center', justifyContent : 'center'}}>

        <Image
          source={img}
          style={styles.illustration}
        />

        <Text style={styles.title}>Welcome Back</Text>
        {error &&
          <View style={styles.errorBox}>
            <Ionicons name='alert-circle' size={20} color={COLORS.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError('')}>
              <Ionicons name='close' size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          </View>
        }
        <TextInput
          autoCapitalize="none"
          autoComplete='email'
          autoCorrect={false}
          keyboardType="email-address"
          textContentType="emailAddress"
          returnKeyType="next"
          value={emailAddress}
          placeholder="Enter email"
          onChangeText={(email) => setEmailAddress(email)}
          style = {{width : "100%"  ,...styles.input, ...(error.email && styles.errorInput)}}
        />
        <TextInput
          autoCapitalize="none"
          autoComplete='password'
          autoCorrect={false}
          returnKeyType="done"
          value={password}
          placeholder="Enter password"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
          style = {{width : "100%"  ,...styles.input, ...(error.password && styles.errorInput)}}
        />

        <TouchableOpacity onPress={onSignInPress} style={{...styles.button, width : "100%"}}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

        <View style={{ display: 'flex', flexDirection: 'row', gap: 3, ...styles.footerContainer }}>
          <Link href="/sign-up">
            <Text style={styles.linkText}>Create Account</Text>
          </Link>
        </View>
      </View>
    </KeyboardAwareScrollView>
  )
}