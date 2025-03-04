import { useState, useEffect } from 'react';
import { analysisService } from '../services/analysis';
import { AnalysisReport } from '../types/analysis';
import { useFields } from './useFields';

export function useAnalysis() {
  const { selectedField } = useFields();
  const [reports, setReports] = useState<AnalysisReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedField) {
      loadAnalysis(selectedField.id);
    }
  }, [selectedField]);

  const loadAnalysis = async (fieldId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await analysisService.getAnalysis(fieldId);
      setReports(data);
    } catch (err) {
      console.error('Error loading analysis:', err);
      setError('Failed to load analysis');
    } finally {
      setLoading(false);
    }
  };

  const addReport = async (reportData: Omit<AnalysisReport, 'id'>) => {
    try {
      const newReport = await analysisService.saveAnalysis(reportData);
      setReports(prev => [newReport, ...prev]);
      return newReport;
    } catch (err) {
      console.error('Error adding report:', err);
      throw err;
    }
  };

  return {
    reports,
    loading,
    error,
    addReport,
    loadAnalysis,
  };
} 