import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, ActivityIndicator, FAB } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useFields } from '../../src/hooks/useFields';
import { format } from 'date-fns';

export default function FieldList() {
  const router = useRouter();
  const { fields, loading, error, loadFields } = useFields();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text variant="bodyLarge" style={styles.error}>{error}</Text>
        <Button onPress={loadFields}>Retry</Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        {fields.length === 0 ? (
          <View style={styles.centered}>
            <Text variant="bodyLarge">No fields added yet</Text>
            <Button 
              mode="contained" 
              onPress={() => router.push('/field/new')}
              style={styles.addButton}
            >
              Add Your First Field
            </Button>
          </View>
        ) : (
          fields.map(field => (
            <Card 
              key={field.id} 
              style={styles.card}
              onPress={() => router.push(`/field/${field.id}`)}
            >
              <Card.Title 
                title={field.name}
                subtitle={`${field.cropType} - ${field.area} hectares`}
              />
              <Card.Content>
                <Text>Soil Type: {field.soilType}</Text>
                <Text>Irrigation: {field.irrigationMethod}</Text>
                <Text>
                  Planted: {format(new Date(field.plantingDate), 'PP')}
                </Text>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/field/new')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginBottom: 16,
  },
  addButton: {
    marginTop: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
}); 