import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import UrlInput from '../components/analysis/UrlInput';
import TruthScore from '../components/analysis/TruthScore';
import AnalysisBreakdown from '../components/analysis/AnalysisBreakdown';
import { analyzeUrl } from '../lib/mockApi';
import { AnalysisResult } from '../types';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Analyze: React.FC = () => {
  const location = useLocation();
  const params = useParams<{ id?: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Extract URL from query parameters if provided
  useEffect(() => {
    const url = new URLSearchParams(location.search).get('url');
    if (url) {
      handleAnalyze(url);
    }
    // If we have an analysis ID in the URL params, we would fetch it
    // This would connect to a real backend in a production app
  }, [location.search, params.id]);
  
  const handleAnalyze = async (url: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const validUrl = url.startsWith('http') ? url : `https://${url}`;
      const result = await analyzeUrl(validUrl);
      setAnalysisResult(result);
    } catch (err) {
      setError('Failed to analyze the URL. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Content Analysis</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Enter a URL to fact-check any article, news site, or social media post.
        </p>
      </div>
      
      <UrlInput onAnalyze={handleAnalyze} isLoading={isLoading} />
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 rounded-md p-4 text-center"
        >
          {error}
        </motion.div>
      )}
      
      {isLoading && (
        <div className="mt-12 flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Analyzing content for accuracy and bias...
          </p>
        </div>
      )}
      
      {!isLoading && analysisResult && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-8"
        >
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 flex justify-center mb-8 md:mb-0">
                <TruthScore 
                  score={analysisResult.truthScore} 
                  status={analysisResult.status} 
                />
              </div>
              
              <div className="md:w-2/3 md:pl-8">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {analysisResult.title}
                </h2>
                
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-md p-4 mb-4 transition-colors">
                  <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-1">Source URL</h3>
                  <a 
                    href={analysisResult.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline break-all"
                  >
                    {analysisResult.url}
                  </a>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Analysis Summary</h3>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                      {analysisResult.summary}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">Content Status</h3>
                    <div className="mt-1">
                      {analysisResult.status === 'verified' && (
                        <div className="text-green-600 dark:text-green-400 flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                          This content appears to be accurate and from a credible source.
                        </div>
                      )}
                      
                      {analysisResult.status === 'mixed' && (
                        <div className="text-yellow-600 dark:text-yellow-400 flex items-center">
                          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                          This content contains a mix of accurate and potentially misleading information.
                        </div>
                      )}
                      
                      {analysisResult.status === 'refuted' && (
                        <div className="text-red-600 dark:text-red-400 flex items-center">
                          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                          This content contains significant inaccuracies or misleading information.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <AnalysisBreakdown analysis={analysisResult} />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Analyze;