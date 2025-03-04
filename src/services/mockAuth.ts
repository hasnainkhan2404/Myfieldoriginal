import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock authentication service for development
export const mockAuth = {
  // Simulated delay to mimic real API calls
  delay: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

  // Mock phone numbers that are "registered"
  validPhones: [
    '+919876543210',
    '+911234567890',
    '+1234567890'
  ],

  // Mock OTP for development
  mockOTP: '123456',

  // Mock sign in
  signIn: async (phoneNumber: string) => {
    await mockAuth.delay(1000); // Simulate network delay
    
    if (!phoneNumber.match(/^\+[0-9]{10,12}$/)) {
      throw new Error('Invalid phone number format');
    }

    // For development, accept any valid phone number format
    return true;
  },

  // Mock verify OTP
  verifyOTP: async (phoneNumber: string, otp: string) => {
    await mockAuth.delay(1000); // Simulate network delay

    if (otp === mockAuth.mockOTP) {
      return {
        user: {
          id: 'mock-user-id',
          phone: phoneNumber,
          created_at: new Date().toISOString()
        }
      };
    }

    throw new Error('Invalid OTP');
  }
}; 