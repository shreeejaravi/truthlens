import React, { useState } from 'react';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnalysisFilter } from '../../types';

interface AnalysisFiltersProps {
  onFilterChange: (filters: AnalysisFilter) => void;
  currentFilters: AnalysisFilter;
}

const AnalysisFilters: React.FC<AnalysisFiltersProps> = ({
  onFilterChange,
  currentFilters
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<AnalysisFilter>(currentFilters);
  
  const handleFilterChange = (key: keyof AnalysisFilter, value: any) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
  };
  
  const applyFilters = () => {
    onFilterChange(localFilters);
    setIsOpen(false);
  };
  
  const resetFilters = () => {
    const emptyFilters: AnalysisFilter = {};
    setLocalFilters(emptyFilters);
    onFilterChange(emptyFilters);
    setIsOpen(false);
  };

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        <Filter className="mr-2 h-4 w-4" />
        Filters
        {isOpen ? (
          <ChevronUp className="ml-2 h-4 w-4" />
        ) : (
          <ChevronDown className="ml-2 h-4 w-4" />
        )}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 transition-colors"
          >
            <div className="p-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select
                    value={localFilters.status || ''}
                    onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 dark:text-white sm:text-sm transition-colors"
                  >
                    <option value="">All Statuses</option>
                    <option value="verified">Verified</option>
                    <option value="mixed">Mixed</option>
                    <option value="refuted">Refuted</option>
                  </select>
                </div>
                
                {/* Date Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date Range
                  </label>
                  <select
                    value={localFilters.dateRange || ''}
                    onChange={(e) => handleFilterChange('dateRange', e.target.value || undefined)}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 dark:text-white sm:text-sm transition-colors"
                  >
                    <option value="">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">Past Week</option>
                    <option value="month">Past Month</option>
                  </select>
                </div>
                
                {/* Min Score Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Min Score
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={localFilters.minScore || ''}
                    onChange={(e) => handleFilterChange('minScore', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 dark:text-white sm:text-sm transition-colors"
                    placeholder="0"
                  />
                </div>
                
                {/* Max Score Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Max Score
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={localFilters.maxScore || ''}
                    onChange={(e) => handleFilterChange('maxScore', e.target.value ? parseInt(e.target.value) : undefined)}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 dark:text-white sm:text-sm transition-colors"
                    placeholder="100"
                  />
                </div>
              </div>
              
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={applyFilters}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md border border-transparent hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnalysisFilters;