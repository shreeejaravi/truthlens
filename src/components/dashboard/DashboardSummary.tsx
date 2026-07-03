import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CheckCircle as CircleCheck, Circle as CircleX, CircleDot, FileText } from 'lucide-react';
import { AnalysisHistory } from '../../types';
import { motion } from 'framer-motion';

interface DashboardSummaryProps {
  history: AnalysisHistory;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ history }) => {
  const { total, averageTruthScore, distribution } = history;
  
  const pieData = [
    { name: 'Verified', value: distribution.verified, color: '#10B981' }, // green-500
    { name: 'Mixed', value: distribution.mixed, color: '#F59E0B' }, // amber-500
    { name: 'Refuted', value: distribution.refuted, color: '#EF4444' }, // red-500
  ];
  
  // Stats data for the summary cards
  const stats = [
    {
      name: 'Total Analyses',
      value: total,
      icon: <FileText className="h-6 w-6 text-blue-500" />,
      description: 'URLs analyzed to date',
    },
    {
      name: 'Average Score',
      value: `${averageTruthScore}%`,
      icon: <CircleDot className="h-6 w-6 text-purple-500" />,
      description: 'Truth score across all analyses',
    },
    {
      name: 'Verified',
      value: distribution.verified,
      icon: <CircleCheck className="h-6 w-6 text-green-500" />,
      description: 'Content confirmed as accurate',
    },
    {
      name: 'Refuted',
      value: distribution.refuted,
      icon: <CircleX className="h-6 w-6 text-red-500" />,
      description: 'Content identified as misleading',
    },
  ];
  
  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 shadow-md rounded-md border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white">{payload[0].name}</p>
          <p className="text-gray-700 dark:text-gray-300">{payload[0].value} URLs</p>
          <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
            {Math.round((payload[0].value / total) * 100)}% of total
          </p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg transition-colors"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">{stat.icon}</div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      {stat.name}
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900 dark:text-white">
                        {stat.value}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 px-5 py-3 transition-colors">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {stat.description}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Distribution Chart */}
      {total > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 shadow rounded-lg p-5 transition-colors"
        >
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Analysis Distribution</h3>
          <div className="flex flex-col md:flex-row items-center justify-center">
            <div className="h-64 w-full md:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    innerRadius={40}
                    fill="#8884d8"
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={customTooltip} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="md:w-1/2 flex flex-col items-center md:items-start mt-4 md:mt-0">
              <div className="grid grid-cols-1 gap-4">
                {pieData.map((entry, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className="w-4 h-4 rounded-full mr-2"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-gray-800 dark:text-gray-200 mr-2">{entry.name}:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {entry.value} ({total > 0 ? Math.round((entry.value / total) * 100) : 0}%)
                    </span>
                  </div>
                ))}
              </div>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">
                This distribution shows the verification status across all your analyzed content.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardSummary;