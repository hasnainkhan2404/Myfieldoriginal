import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Avatar } from 'react-native-paper';

export default function News() {
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title
          title="Agricultural Updates"
          subtitle="Latest farming news and updates"
          left={(props) => <Avatar.Icon {...props} icon="newspaper" />}
        />
        <Card.Content>
          <Text variant="bodyMedium">
            Stay informed about the latest agricultural news, market trends, and farming techniques.
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title
          title="Weather Forecast"
          subtitle="Weekly weather updates"
          left={(props) => <Avatar.Icon {...props} icon="weather-partly-cloudy" />}
        />
        <Card.Content>
          <Text variant="bodyMedium">
            Get detailed weather forecasts and agricultural advisories.
          </Text>
        </Card.Content>
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
}); 