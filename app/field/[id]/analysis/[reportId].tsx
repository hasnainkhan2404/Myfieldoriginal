import React from 'react';
import { View, ScrollView, StyleSheet, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Card, Text, Button, ProgressBar, useTheme, IconButton } from 'react-native-paper';
import { useAnalysis } from '../../../../src/hooks/useAnalysis';
import { format } from 'date-fns';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function AnalysisDetailScreen() {
  const { id, reportId } = useLocalSearchParams();
  const theme = useTheme();
  const { getReportById, deleteReport } = useAnalysis();
  const report = getReportById(reportId as string);

  if (!report) {
    return (
      <View style={styles.centered}>
        <Text>Report not found</Text>
      </View>
    );
  }

  const handleDelete = async () => {
    try {
      await deleteReport(reportId as string);
      router.back();
    } catch (error) {
      console.error('Error deleting report:', error);
      alert('Failed to delete report');
    }
  };

  const renderSoilAnalysis = () => (
    <Card style={styles.card}>
      <Card.Title title="Soil Analysis Results" />
      <Card.Content>
        <View style={styles.row}>
          <Text>Moisture Level</Text>
          <ProgressBar
            progress={report.soilAnalysis!.moisture / 100}
            color={theme.colors.primary}
            style={styles.progress}
          />
        </View>

        <View style={styles.row}>
          <Text>pH Level: {report.soilAnalysis!.ph}</Text>
          <View style={styles.phScale}>
            <View
              style={[
                styles.phIndicator,
                { left: `${(report.soilAnalysis!.ph / 14) * 100}%` }
              ]}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nutrients</Text>
          {Object.entries(report.soilAnalysis!.nutrients).map(([key, value]) => (
            <View key={key} style={styles.nutrientRow}>
              <Text>{key}</Text>
              <ProgressBar
                progress={value / 100}
                color={theme.colors.primary}
                style={styles.progress}
              />
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Soil Texture</Text>
          <View style={styles.textureChart}>
            {Object.entries(report.soilAnalysis!.texture).map(([key, value]) => (
              <View key={key} style={[styles.textureBar, { height: `${value}%` }]}>
                <Text style={styles.textureLabel}>{key}</Text>
              </View>
            ))}
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  const renderCropAnalysis = () => (
    <Card style={styles.card}>
      <Card.Title title="Crop Analysis Results" />
      <Card.Content>
        <View style={styles.healthScore}>
          <Text style={styles.scoreText}>
            Health Score: {report.cropAnalysis!.healthScore}%
          </Text>
          <ProgressBar
            progress={report.cropAnalysis!.healthScore / 100}
            color={theme.colors.primary}
            style={styles.progress}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Growth Metrics</Text>
          {Object.entries(report.cropAnalysis!.growth).map(([key, value]) => (
            <Text key={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
              {key === 'height' ? 'cm' : key === 'density' ? ' plants/m²' : ''}
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stress Factors</Text>
          {Object.entries(report.cropAnalysis!.stress).map(([key, value]) => (
            <View key={key} style={styles.stressRow}>
              <Text>{key}</Text>
              <ProgressBar
                progress={value / 100}
                color={value > 70 ? 'red' : value > 30 ? 'orange' : 'green'}
                style={styles.progress}
              />
            </View>
          ))}
        </View>

        {report.cropAnalysis!.diseases.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Diseases Detected</Text>
            {report.cropAnalysis!.diseases.map((disease, index) => (
              <View key={index} style={styles.diseaseRow}>
                <Text>{disease.name}</Text>
                <Text>Severity: {disease.severity}%</Text>
                <Text>Affected Area: {disease.affectedArea}%</Text>
              </View>
            ))}
          </View>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium">
          {format(new Date(report.date), 'MMMM d, yyyy')}
        </Text>
        <IconButton icon="delete" onPress={handleDelete} />
      </View>

      <View style={styles.imageGrid}>
        {report.images.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.image} />
        ))}
      </View>

      {report.type === 'soil' && report.soilAnalysis && renderSoilAnalysis()}
      {report.type === 'crop' && report.cropAnalysis && renderCropAnalysis()}

      <Card style={styles.card}>
        <Card.Title title="Recommendations" />
        <Card.Content>
          {report.recommendations.map((rec, index) => (
            <Text key={index} style={styles.recommendation}>• {rec}</Text>
          ))}
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={() => router.push(`/field/${id}/analysis/compare/${reportId}`)}
        style={styles.compareButton}
      >
        Compare with Other Reports
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    gap: 8,
  },
  image: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 8,
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
    marginTop: 4,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
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
  nutrientRow: {
    marginVertical: 4,
  },
  textureChart: {
    height: 200,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingTop: 20,
  },
  textureBar: {
    width: '30%',
    backgroundColor: '#2E7D32',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 8,
  },
  textureLabel: {
    color: 'white',
    marginBottom: 4,
  },
  healthScore: {
    marginBottom: 16,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  stressRow: {
    marginVertical: 4,
  },
  diseaseRow: {
    marginVertical: 8,
    padding: 8,
    backgroundColor: '#ffebee',
    borderRadius: 4,
  },
  recommendation: {
    marginVertical: 4,
  },
  compareButton: {
    margin: 16,
  },
}); 