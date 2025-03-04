import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button, FAB, useTheme, ActivityIndicator } from 'react-native-paper';
import { router } from 'expo-router';
import { useFields } from '../../src/hooks/useFields';
import { format } from 'date-fns';

export default function Fields() {
  const { fields, loading, error } = useFields();
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {loading ? (
          <ActivityIndicator style={styles.loader} />
        ) : error ? (
          <Text variant="bodyMedium" style={styles.errorText}>{error}</Text>
        ) : fields.length === 0 ? (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="bodyLarge" style={styles.emptyText}>
                No fields added yet
              </Text>
            </Card.Content>
          </Card>
        ) : (
          fields.map((field) => (
            <Card 
              key={field.id} 
              style={styles.card}
              onPress={() => router.push(`/field/${field.id}`)}
            >
              <Card.Title 
                title={field.name}
                subtitle={`${field.area} hectares • ${field.cropType}`}
              />
              <Card.Content>
                <View style={styles.fieldInfo}>
                  <Text variant="bodyMedium">
                    Planted: {format(new Date(field.plantingDate), 'PP')}
                  </Text>
                  <Text variant="bodyMedium">
                    Last Inspection: {format(new Date(field.lastInspection), 'PP')}
                  </Text>
                  <Text 
                    variant="bodyMedium"
                    style={{
                      color: field.status === 'active' ? theme.colors.primary : 
                             field.status === 'harvested' ? theme.colors.secondary :
                             theme.colors.error
                    }}
                  >
                    Status: {field.status.charAt(0).toUpperCase() + field.status.slice(1)}
                  </Text>
                </View>
              </Card.Content>
              <Card.Actions>
                <Button onPress={() => router.push(`/field/${field.id}/analysis`)}>
                  View Analysis
                </Button>
                <Button onPress={() => router.push(`/field/${field.id}/edit`)}>
                  Edit
                </Button>
              </Card.Actions>
            </Card>
          ))
        )}
      </ScrollView>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/field/new')}
        label="Add Field"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  fieldInfo: {
    gap: 4,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  loader: {
    marginTop: 32,
  },
  errorText: {
    marginTop: 16,
    color: 'red',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
  },
}); 