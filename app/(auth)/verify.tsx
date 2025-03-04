import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { useAuthContext } from '../../src/providers/AuthProvider';
import { router, useLocalSearchParams } from 'expo-router';
import { TEST_OTP_CODE } from '@env';

export default function Verify() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { verifyOTP } = useAuthContext();
  const { phoneNumber } = useLocalSearchParams<{ phoneNumber: string }>();

  const handleVerify = async () => {
    try {
      setError('');
      setLoading(true);
      await verifyOTP(phoneNumber, otp);
      router.replace('/(tabs)');
    } catch (error) {
      console.error(error);
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Development helper
  const fillTestOTP = () => {
    if (__DEV__) {
      setOtp(TEST_OTP_CODE);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Verify OTP</Text>
      <Text variant="bodyMedium" style={styles.subtitle}>
        Enter the code sent to {phoneNumber}
      </Text>
      <TextInput
        label="OTP Code"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        style={styles.input}
        maxLength={6}
        disabled={loading}
      />
      <HelperText type="error" visible={!!error}>
        {error}
      </HelperText>
      <Button
        mode="contained"
        onPress={handleVerify}
        loading={loading}
        disabled={loading || otp.length < 6}
        style={styles.button}
      >
        Verify
      </Button>

      {__DEV__ && (
        <Button
          mode="text"
          onPress={fillTestOTP}
          style={styles.devButton}
        >
          Fill Test OTP
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 24,
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