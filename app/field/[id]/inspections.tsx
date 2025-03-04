import React, { useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, Card, Button, IconButton, Chip, useTheme } from 'react-native-paper';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useFields } from '../../../src/hooks/useFields';
import { format } from 'date-fns';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function FieldInspections() {
  const { id } = useLocalSearchParams();
  const { fields, inspections, loadInspections } = useFields();
  const field = fields.find(f => f.id === id);
  const theme = useTheme();

  useEffect(() => {
    if (field) {
      loadInspections(field.id);
    }
  }, [field]);

  if (!field) return null;

  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'low': return theme.colors.primary;
      case 'medium': return theme.colors.warning;
      case 'high': return theme.colors.error;
    }
  };

  const getTypeIcon = (type: 'growth' | 'pest' | 'disease' | 'other') => {
    switch (type) {
      case 'growth': return 'sprout';
      case 'pest': return 'bug';
      case 'disease': return 'virus';
      case 'other': return 'note';
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Inspection History',
          headerLeft: () => (
            <IconButton icon="arrow-left" onPress={() => router.back()} />
          ),
        }} 
      />
      <ScrollView style={styles.container}>
        {inspections.length === 0 ? (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="bodyLarge" style={styles.emptyText}>
                No inspections recorded yet
              </Text>
            </Card.Content>
          </Card>
        ) : (
          inspections.map((inspection) => (
            <Card key={inspection.id} style={styles.card}>
              <Card.Title 
                title={format(new Date(inspection.date), 'PP')}
                subtitle={`${inspection.observations.length} observations`}
              />
              <Card.Content>
                {inspection.observations.map((obs, index) => (
                  <View key={index} style={styles.observation}>
                    <View style={styles.observationHeader}>
                      <View style={styles.observationTitle}>
                        <MaterialCommunityIcons 
                          name={getTypeIcon(obs.type)}
                          size={24}
                          color={getSeverityColor(obs.severity)}
                        />
                        <Text variant="titleMedium" style={styles.observationType}>
                          {obs.type.charAt(0).toUpperCase() + obs.type.slice(1)}
                        </Text>
                      </View>
                      <Chip 
                        style={{ backgroundColor: getSeverityColor(obs.severity) }}
                      >
                        {obs.severity.toUpperCase()}
                      </Chip>
                    </View>
                    <Text variant="bodyMedium" style={styles.description}>
                      {obs.description}
                    </Text>
                  </View>
                ))}
                {inspection.notes && (
                  <View style={styles.notes}>
                    <Text variant="titleSmall">Additional Notes:</Text>
                    <Text variant="bodyMedium">{inspection.notes}</Text>
                  </View>
                )}
              </Card.Content>
              <Card.Actions>
                <Button 
                  onPress={() => router.push(`/field/${id}/inspection/${inspection.id}`)}
                >
                  View Details
                </Button>
              </Card.Actions>
            </Card>
          ))
        )}

        <Button
          mode="contained"
          icon="plus"
          onPress={() => router.push(`/field/${id}/inspection`)}
          style={styles.button}
        >
          New Inspection
        </Button>
      </ScrollView>
    </>
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
  observation: {
    marginBottom: 12,
  },
  observationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  observationTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  observationType: {
    marginLeft: 8,
  },
  description: {
    marginLeft: 32,
  },
  notes: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  button: {
    marginVertical: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
  },
}); 