import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { InfoIcon, AlertTriangle, Shield, Image, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnalysisResult, Flag } from '../../types';

interface AnalysisBreakdownProps {
  analysis: AnalysisResult;
}

const AnalysisBreakdown: React.FC<AnalysisBreakdownProps> = ({ analysis }) => {
  const { categories, flags, summary, domain } = analysis;
  
  const categoryData = [
    {
      name: 'Source Credibility',
      value: categories.sourceCredibility,
      icon: <Shield className="h-5 w-5 text-blue-500" />,
      color: '#3B82F6' // blue-500
    },
    {
      name: 'Factual Accuracy',
      value: categories.factualAccuracy,
      icon: <InfoIcon className="h-5 w-5 text-green-500" />,
      color: '#10B981' // green-500
    },
    {
      name: 'Biased Language',
      value: categories.biasedLanguage,
      icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
      color: '#F59E0B' // amber-500
    },
    {
      name: 'Image Manipulation',
      value: categories.imageManipulation,
      icon: <Image className="h-5 w-5 text-purple-500" />,
      color: '#8B5CF6' // purple-500
    }
  ];
  
  const getSeverityColor = (severity: Flag['severity']) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  const getFlagIcon = (type: Flag['type']) => {
    switch (type) {
      case 'sourceCredibility': return <Shield className="h-4 w-4 mr-1" />;
      case 'factualAccuracy': return <InfoIcon className="h-4 w-4 mr-1" />;
      case 'biasedLanguage': return <AlertTriangle className="h-4 w-4 mr-1" />;
      case 'imageManipulation': return <Image className="h-4 w-4 mr-1" />;
      default: return <AlertTriangle className="h-4 w-4 mr-1" />;
    }
  };
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 shadow-md rounded-md border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white">{payload[0].name}</p>
          <p className="text-gray-700 dark:text-gray-300">Score: {payload[0].value}</p>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
            {payload[0].value >= 75 ? 'Good' : payload[0].value >= 50 ? 'Average' : 'Poor'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="mt-8">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Score Breakdown */}
        <motion.div variants={item} className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Category Scores</h3>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip content={customTooltip} />
                <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:justify-around sm:gap-0 text-xs">
            {categoryData.map((category, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-sm mr-1"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-gray-700 dark:text-gray-300">{category.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Flags Section */}
        <motion.div variants={item} className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 transition-colors">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Content Flags</h3>
          
          {flags.length > 0 ? (
            <div className="space-y-3">
              {flags.map((flag, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className={`rounded-md px-3 py-2 ${getSeverityColor(flag.severity)}`}
                >
                  <div className="flex items-center">
                    {getFlagIcon(flag.type)}
                    <span className="font-medium">{flag.type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                    <span className="ml-auto text-xs uppercase font-bold">{flag.severity}</span>
                  </div>
                  <p className="text-sm mt-1">{flag.description}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center h-48">
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <p className="mt-2 text-gray-700 dark:text-gray-300">No issues detected with this content.</p>
            </div>
          )}
        </motion.div>
        
        {/* Summary Section */}
        <motion.div 
          variants={item} 
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-5 lg:col-span-2 transition-colors"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Analysis Summary</h3>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
            <Globe className="h-4 w-4 mr-1" />
            <span>{domain}</span>
          </div>
          <p className="text-gray-700 dark:text-gray-300">{summary}</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Import missing Globe icon
const Globe = ({ className }: { className?: string }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
};

export default AnalysisBreakdown;