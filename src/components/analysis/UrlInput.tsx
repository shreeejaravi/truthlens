import React, { useState } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface UrlInputProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

const UrlInput: React.FC<UrlInputProps> = ({ onAnalyze, isLoading }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const validateUrl = (input: string): boolean => {
    try {
      const parsedUrl = new URL(input);
      return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }
    
    if (!validateUrl(url)) {
      setError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }
    
    setError('');
    onAnalyze(url);
  };

  const handleClear = () => {
    setUrl('');
    setError('');
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          
          <input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError('');
            }}
            placeholder="Enter URL to fact-check (e.g., https://example.com/article)"
            className={`block w-full bg-white dark:bg-gray-800 pl-10 pr-16 py-3 border ${
              error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
            } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors`}
            disabled={isLoading}
          />
          
          {url && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-12 flex items-center pr-2"
            >
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
            </button>
          )}
          
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 text-white animate-spin" />
              ) : (
                <Search className="h-5 w-5 text-white" />
              )}
            </button>
          </div>
        </div>
        
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-red-600 dark:text-red-400"
          >
            {error}
          </motion.p>
        )}
      </form>
    </div>
  );
};

export default UrlInput;