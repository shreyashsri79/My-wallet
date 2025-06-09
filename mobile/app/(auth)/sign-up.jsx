import * as React from 'react'
import { Text, TextInput, TouchableOpacity, View} from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { styles } from '@/assets/styles/auth.styles.js'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants/colors.js'
import { Image } from 'expo-image'
import img from '@/assets/images/revenue-i1.png'

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')
  const [error, setError] = React.useState("")

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return
    setError('')
    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      setError(err.errors?.[0]?.message || 'An error occurred during sign-up. Please try again.')
    }
  }

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        setError('Verification failed. Please check your code and try again.')
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      setError(err.errors?.[0]?.message || 'An error occurred during verification. Please try again.')
    }
  }

  if (pendingVerification) {
    return (
      <View style={styles.verificationContainer}>

        <Text style={styles.verificationTitle}>Verify your email</Text>

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
          value={code}
          placeholder="Enter your verification code"
          onChangeText={(code) => setCode(code)}
          style={[styles.verificationInput , error && styles.errorInput]}
        />
        <TouchableOpacity onPress={onVerifyPress} style={styles.button}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (

    <KeyboardAwareScrollView 
      style={{flex:1}}
      contentContainerStyle={{flexGrow:1}}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={70}
      >
      <View style={{...styles.container, alignItems : 'center', justifyContent : 'center'}}>
        <Image
          source={img}
          style={styles.illustration}
        />
        <Text style={styles.title}>Create Account</Text>
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
        <TouchableOpacity onPress={onSignUpPress} style={{...styles.button, width : "100%"}}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
        <View style={{ display: 'flex', flexDirection: 'row', gap: 3, ...styles.footerContainer }}>
          <Text style={styles.footerText} >Already have an account?</Text>
          <Link href="/sign-in">
            <Text style={styles.linkText} >Sign in</Text>
          </Link>
        </View>
      </View>
    </KeyboardAwareScrollView>
  )
}