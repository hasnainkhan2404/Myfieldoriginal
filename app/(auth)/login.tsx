import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { useAuthContext } from '../../src/providers/AuthProvider';
import { router } from 'expo-router';
import { TEST_PHONE_NUMBER } from '@env';
import { mockAuth } from '../../src/services/mockAuth';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavBar } from '../../src/components/NavBar';

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuthContext();

  const handleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await signIn(phoneNumber);
      
      if (__DEV__) {
        // Show mock OTP in development
        alert(`Development Mode: Use OTP ${mockAuth.mockOTP}`);
      }
      
      router.push({
        pathname: '/verify',
        params: { phoneNumber }
      });
    } catch (error) {
      console.error(error);
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Development helper
  const fillTestNumber = () => {
    if (__DEV__) {
      setPhoneNumber(TEST_PHONE_NUMBER);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <NavBar title="Login" />
      <View style={styles.container}>
        <View style={styles.content}>
          <Text variant="headlineMedium" style={styles.title}>Welcome to MyField</Text>
          <TextInput
            label="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            style={styles.input}
            disabled={loading}
            placeholder="+1234567890"
          />
          <HelperText type="error" visible={!!error}>
            {error}
          </HelperText>
          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading || !phoneNumber}
            style={styles.button}
          >
            Send OTP
          </Button>
          
          {__DEV__ && (
            <Button
              mode="text"
              onPress={fillTestNumber}
              style={styles.devButton}
            >
              Fill Test Number
            </Button>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    marginTop: 44, // Height of navbar content
  },
  title: {
    textAlign: 'center',
    marginVertical: 8,
  },
  input: {
    marginVertical: 8,
  },
  button: {
    marginTop: 16,
  },
  devButton: {
    marginTop: 32,
  },
}); 