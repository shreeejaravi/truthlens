import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSummary from '../components/dashboard/DashboardSummary';
import AnalysisHistory from '../components/analysis/AnalysisHistory';
import AnalysisFilters from '../components/dashboard/AnalysisFilters';
import { getUserHistory } from '../lib/mockApi';
import { AnalysisHistory as HistoryType, AnalysisFilter } from '../types';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<AnalysisFilter>({});
  
  useEffect(() => {
    // If not logged in and auth check is complete, redirect to login
    if (!authLoading && !user) {
      navigate('/login');
      return;
    }
    
    // If logged in, fetch history
    if (user) {
      fetchHistory();
    }
  }, [user, authLoading, navigate]);
  
  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const result = await getUserHistory('user-1', filters);
      setHistory(result);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFilterChange = (newFilters: AnalysisFilter) => {
    setFilters(newFilters);
  };
  
  useEffect(() => {
    if (user) {
      fetchHistory();
    }
  }, [filters, user]);
  
  if (authLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex justify-center">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    );
  }
  
  if (!user) {
    return null; // Will redirect via useEffect
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Track your analyzed content and view insights.
          </p>
        </div>
        
        {isLoading && !history ? (
          <div className="py-16 flex justify-center">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          </div>
        ) : history ? (
          <>
            <DashboardSummary history={history} />
            
            <div className="mt-12">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Analyses</h2>
              </div>
              
              <AnalysisFilters onFilterChange={handleFilterChange} currentFilters={filters} />
              
              {isLoading ? (
                <div className="py-8 flex justify-center">
                  <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
                </div>
              ) : (
                <AnalysisHistory analyses={history.recentAnalyses} />
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400">No analysis history available.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;