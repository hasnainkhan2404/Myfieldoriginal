import { StyleSheet, ScrollView, View } from 'react-native';
import { TextInput, Button, Text, Avatar } from 'react-native-paper';
import { useState } from 'react';
import { useAuthContext } from '../../src/providers/AuthProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavBar } from '../../src/components/NavBar';

export default function Profile() {
  const { user, signOut } = useAuthContext();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [language, setLanguage] = useState(user?.preferred_language || 'en');

  const handleSave = async () => {
    // TODO: Implement profile update
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <NavBar title="Profile" />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Avatar.Text 
            size={80} 
            label={fullName?.[0]?.toUpperCase() || '?'} 
          />
          <Text variant="titleLarge" style={styles.phone}>
            {user?.phone_number}
          </Text>
        </View>

        <TextInput
          label="Full Name"
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
        />

        <TextInput
          label="Preferred Language"
          value={language}
          onChangeText={setLanguage}
          style={styles.input}
        />

        <Button 
          mode="contained" 
          onPress={handleSave}
          style={styles.button}
        >
          Save Changes
        </Button>

        <Button 
          mode="outlined" 
          onPress={signOut}
          style={styles.button}
        >
          Sign Out
        </Button>
      </ScrollView>
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
  contentContainer: {
    padding: 16,
    paddingTop: 64, // Navbar height + extra padding
  },
  header: {
    alignItems: 'center',
    marginVertical: 24,
  },
  phone: {
    marginTop: 8,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
}); 