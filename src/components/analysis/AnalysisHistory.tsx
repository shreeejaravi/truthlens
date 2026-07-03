import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ChevronRight } from 'lucide-react';
import { AnalysisResult } from '../../types';
import { motion } from 'framer-motion';

interface AnalysisHistoryProps {
  analyses: AnalysisResult[];
  limit?: number;
}

const AnalysisHistory: React.FC<AnalysisHistoryProps> = ({ analyses, limit }) => {
  const displayedAnalyses = limit ? analyses.slice(0, limit) : analyses;
  
  const getStatusBadge = (status: AnalysisResult['status']) => {
    switch (status) {
      case 'verified':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">Verified</span>;
      case 'refuted':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">Refuted</span>;
      case 'mixed':
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">Mixed</span>;
      default:
        return null;
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  if (displayedAnalyses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No analysis history available.</p>
      </div>
    );
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="overflow-hidden bg-white dark:bg-gray-800 shadow sm:rounded-md transition-colors"
    >
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {displayedAnalyses.map((analysis, index) => (
          <motion.li 
            key={analysis.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link 
              to={`/analyze/${analysis.id}`} 
              className="block hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="truncate">
                    <div className="flex text-sm">
                      <p className="font-medium text-blue-600 dark:text-blue-400 truncate">{analysis.title}</p>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span className="truncate">{analysis.domain}</span>
                      <ExternalLink className="ml-1 h-3 w-3 flex-shrink-0" />
                    </div>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex items-center">
                    {getStatusBadge(analysis.status)}
                    <div className="ml-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <div className="w-8 text-right">{analysis.truthScore}<span className="text-xs">%</span></div>
                      <ChevronRight className="ml-1 h-5 w-5" />
                    </div>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      {analysis.flags.length > 0 ? (
                        <span>{analysis.flags.length} flag{analysis.flags.length !== 1 ? 's' : ''} detected</span>
                      ) : (
                        <span>No issues detected</span>
                      )}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
                    <p>Analyzed on {formatDate(analysis.createdAt)}</p>
                  </div>
                </div>
              </div>
            </Link>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default AnalysisHistory;