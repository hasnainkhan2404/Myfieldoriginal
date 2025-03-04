import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase/client';
import { mockAuth } from '../services/mockAuth';
import { Profile } from '../types/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuth = () => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();

    if (!__DEV__) {
      // Only set up Supabase listener in production
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          getProfile(session.user.id);
        } else {
          setUser(null);
        }
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const checkUser = async () => {
    try {
      if (__DEV__) {
        // In development, check if we have a mock session
        const mockSession = await AsyncStorage.getItem('mockSession');
        if (mockSession) {
          setUser(JSON.parse(mockSession));
        }
      } else {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await getProfile(session.user.id);
        }
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProfile = async (userId: string) => {
    if (__DEV__) return; // Skip in development

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUser(data);
    } catch (error) {
      console.error('Error getting profile:', error);
      setUser(null);
    }
  };

  const signIn = async (phoneNumber: string) => {
    if (__DEV__) {
      // Use mock auth in development
      return mockAuth.signIn(phoneNumber);
    }

    const { error } = await supabase.auth.signInWithOtp({
      phone: phoneNumber,
    });
    if (error) throw error;
  };

  const verifyOTP = async (phoneNumber: string, token: string) => {
    if (__DEV__) {
      // Use mock auth in development
      const result = await mockAuth.verifyOTP(phoneNumber, token);
      if (result.user) {
        const mockProfile = {
          id: '123',
          phone_number: phoneNumber,
          created_at: new Date().toISOString(),
          full_name: 'Test User',
          preferred_language: 'en',
          last_login: new Date().toISOString(),
          avatar_url: '',
          location: '',
          is_verified: false
        };
        setUser(mockProfile);
        await AsyncStorage.setItem('mockSession', JSON.stringify(mockProfile));
      }
      return result;
    }

    const { error } = await supabase.auth.verifyOtp({
      phone: phoneNumber,
      token: token,
      type: 'sms'
    });
    if (error) throw error;
  };

  const signOut = async () => {
    if (__DEV__) {
      // Clear mock session in development
      setUser(null);
      await AsyncStorage.removeItem('mockSession');
      return;
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    signIn,
    verifyOTP,
    signOut,
  };
}; 