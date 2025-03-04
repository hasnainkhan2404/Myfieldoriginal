import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, Avatar } from 'react-native-paper';

export default function Consult() {
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title
          title="Expert Consultation"
          subtitle="Connect with agricultural experts"
          left={(props) => <Avatar.Icon {...props} icon="account-tie" />}
        />
        <Card.Content>
          <Text variant="bodyMedium" style={styles.description}>
            Get expert advice on crop management, pest control, and farming techniques.
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={() => {/* TODO: Implement consultation */}}>
            Start Consultation
          </Button>
        </Card.Actions>
      </Card>

      <Card style={styles.card}>
        <Card.Title
          title="Community Forum"
          subtitle="Connect with other farmers"
          left={(props) => <Avatar.Icon {...props} icon="account-group" />}
        />
        <Card.Content>
          <Text variant="bodyMedium" style={styles.description}>
            Join discussions, share experiences, and learn from the farming community.
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained-tonal" onPress={() => {/* TODO: Implement forum */}}>
            Join Forum
          </Button>
        </Card.Actions>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  description: {
    marginBottom: 16,
  },
}); 