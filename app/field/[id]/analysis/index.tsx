import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ActivityIndicator } from 'react-native-paper';
import { AnalysisDashboard } from '../../../../src/components/AnalysisDashboard';
import { useAnalysis } from '../../../../src/hooks/useAnalysis';

export default function AnalysisScreen() {
  const { id } = useLocalSearchParams();
  const { soilData, cropData, loading } = useAnalysis();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const handleNewAnalysis = (type: 'soil' | 'crop') => {
    router.push({
      pathname: `/field/${id}/analysis/new`,
      params: { type }
    });
  };

  const handleViewHistory = (type: 'soil' | 'crop') => {
    router.push({
      pathname: `/field/${id}/analysis/history`,
      params: { type }
    });
  };

  return (
    <View style={styles.container}>
      <AnalysisDashboard
        soilData={soilData}
        cropData={cropData}
        onNewAnalysis={handleNewAnalysis}
        onViewHistory={handleViewHistory}
      />
    </View>
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
}); 