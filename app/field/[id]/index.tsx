import React, { useEffect } from 'react';
import { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Card, Button, IconButton, useTheme, FAB } from 'react-native-paper';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import MapView, { Polygon, Marker } from 'react-native-maps';
import { useFields } from '../../../src/hooks/useFields';
import { format } from 'date-fns';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Field, FieldMarker } from '../../../src/types/field';

export default function FieldDetail() {
  const { id } = useLocalSearchParams();
  const { fields, markers, selectField } = useFields();
  const [field, setField] = useState<Field | null>(null);
  const theme = useTheme();

  useEffect(() => {
    const currentField = fields.find(f => f.id === id);
    if (currentField) {
      setField(currentField);
      selectField(currentField);
    }
  }, [id, fields]);

  if (!field) return null;

  const getStatusColor = (status: Field['status']) => {
    switch (status) {
      case 'active': return theme.colors.primary;
      case 'harvested': return theme.colors.secondary;
      case 'fallow': return theme.colors.error;
    }
  };

  const getMarkerColor = (type: FieldMarker['type']) => {
    switch (type) {
      case 'issue': return theme.colors.error;
      case 'note': return theme.colors.primary;
      case 'task': return '#FFA726';
    }
  };

  return (
    <>
      <Stack.Screen 
        options={{
          title: field.name,
          headerRight: () => (
            <IconButton 
              icon="pencil" 
              onPress={() => router.push(`/field/${id}/edit`)}
            />
          ),
        }} 
      />
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: field.boundaries[0].latitude,
            longitude: field.boundaries[0].longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Polygon
            coordinates={field.boundaries}
            fillColor={`${getStatusColor(field.status)}40`}
            strokeColor={getStatusColor(field.status)}
            strokeWidth={2}
          />
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={marker.coordinate}
              pinColor={getMarkerColor(marker.type)}
              onPress={() => {/* TODO: Show marker details */}}
            />
          ))}
        </MapView>

        <Card style={styles.infoCard}>
          <Card.Content>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="crop" size={24} color={theme.colors.primary} />
              <Text variant="bodyMedium" style={styles.infoText}>
                {field.cropType}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="ruler" size={24} color={theme.colors.primary} />
              <Text variant="bodyMedium" style={styles.infoText}>
                {field.area} hectares
              </Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="calendar" size={24} color={theme.colors.primary} />
              <Text variant="bodyMedium" style={styles.infoText}>
                Planted: {format(new Date(field.plantingDate), 'PP')}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="clipboard" size={24} color={theme.colors.primary} />
              <Text variant="bodyMedium" style={styles.infoText}>
                Last Inspection: {format(new Date(field.lastInspection), 'PP')}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => router.push(`/field/${id}/marker/new`)}
          label="Add Marker"
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  infoCard: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    right: 16,
    borderRadius: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
}); 