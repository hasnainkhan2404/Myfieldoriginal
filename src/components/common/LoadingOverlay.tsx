import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message = 'Processing...' }: LoadingOverlayProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator size="large" />
        <Text variant="bodyLarge" style={styles.message}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  message: {
    marginTop: 16,
  },
}); 