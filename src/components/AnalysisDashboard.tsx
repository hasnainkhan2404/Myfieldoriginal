import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Card, Text, Button, ProgressBar, useTheme, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SoilAnalysis, CropAnalysis } from '../types/analysis';

type AnalysisDashboardProps = {
  soilData?: SoilAnalysis;
  cropData?: CropAnalysis;
  onNewAnalysis: (type: 'soil' | 'crop') => void;
  onViewHistory: (type: 'soil' | 'crop') => void;
};

export function AnalysisDashboard({ 
  soilData, 
  cropData, 
  onNewAnalysis, 
  onViewHistory 
}: AnalysisDashboardProps) {
  const theme = useTheme();

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Title 
          title="Soil Health" 
          right={(props) => (
            <IconButton 
              {...props} 
              icon="history" 
              onPress={() => onViewHistory('soil')} 
            />
          )}
        />
        <Card.Content>
          {soilData ? (
            <>
              <View style={styles.row}>
                <Text>Moisture</Text>
                <ProgressBar 
                  progress={soilData.moisture / 100} 
                  color={theme.colors.primary} 
                  style={styles.progress} 
                />
              </View>
              <View style={styles.row}>
                <Text>pH Level: {soilData.ph}</Text>
                <View style={styles.phScale}>
                  <View 
                    style={[
                      styles.phIndicator, 
                      { left: `${(soilData.ph / 14) * 100}%` }
                    ]} 
                  />
                </View>
              </View>
              <View style={styles.nutrients}>
                <Text style={styles.subtitle}>Nutrients</Text>
                <View style={styles.nutrientGrid}>
                  {Object.entries(soilData.nutrients).map(([key, value]) => (
                    <View key={key} style={styles.nutrientItem}>
                      <Text>{key}</Text>
                      <ProgressBar 
                        progress={value / 100} 
                        color={theme.colors.primary} 
                        style={styles.progress} 
                      />
                    </View>
                  ))}
                </View>
              </View>
            </>
          ) : (
            <Text>No soil analysis data available</Text>
          )}
          <Button 
            mode="contained" 
            onPress={() => onNewAnalysis('soil')}
            style={styles.button}
          >
            New Soil Analysis
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Title 
          title="Crop Health" 
          right={(props) => (
            <IconButton 
              {...props} 
              icon="history" 
              onPress={() => onViewHistory('crop')} 
            />
          )}
        />
        <Card.Content>
          {cropData ? (
            <>
              <View style={styles.healthScore}>
                <Text style={styles.scoreText}>
                  Health Score: {cropData.healthScore}%
                </Text>
                <ProgressBar 
                  progress={cropData.healthScore / 100} 
                  color={theme.colors.primary} 
                  style={styles.progress} 
                />
              </View>
              <View style={styles.growth}>
                <Text style={styles.subtitle}>Growth Metrics</Text>
                <Text>Height: {cropData.growth.height}cm</Text>
                <Text>Density: {cropData.growth.density} plants/m²</Text>
                <Text>Stage: {cropData.growth.stage}</Text>
              </View>
              {cropData.diseases.length > 0 && (
                <View style={styles.alerts}>
                  <Text style={styles.subtitle}>Disease Alerts</Text>
                  {cropData.diseases.map((disease, index) => (
                    <Text key={index} style={styles.alert}>
                      • {disease.name} (Severity: {disease.severity}%)
                    </Text>
                  ))}
                </View>
              )}
            </>
          ) : (
            <Text>No crop analysis data available</Text>
          )}
          <Button 
            mode="contained" 
            onPress={() => onNewAnalysis('crop')}
            style={styles.button}
          >
            New Crop Analysis
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 16,
  },
  row: {
    marginVertical: 8,
  },
  progress: {
    height: 8,
    borderRadius: 4,
  },
  phScale: {
    height: 8,
    backgroundColor: '#eee',
    borderRadius: 4,
    marginTop: 8,
  },
  phIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
    position: 'absolute',
  },
  nutrients: {
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  nutrientGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  nutrientItem: {
    flex: 1,
    minWidth: '45%',
  },
  healthScore: {
    marginBottom: 16,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  growth: {
    marginBottom: 16,
  },
  alerts: {
    marginTop: 16,
  },
  alert: {
    color: 'red',
    marginVertical: 4,
  },
  button: {
    marginTop: 16,
  },
}); 