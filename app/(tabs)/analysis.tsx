import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavBar } from '../../src/components/NavBar';

export default function Analysis() {
  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <NavBar title="Analysis" />
      <View style={styles.container}>
        <Text>Analysis Screen</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 44, // Height of navbar content
  },
}); 