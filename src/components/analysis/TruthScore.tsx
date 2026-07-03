import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Check, X, AlertCircle } from 'lucide-react';

interface TruthScoreProps {
  score: number;
  status: 'verified' | 'refuted' | 'mixed';
}

const TruthScore: React.FC<TruthScoreProps> = ({ score, status }) => {
  const circumference = 2 * Math.PI * 45; // 45 is the radius of the circle
  const progressRef = useRef<SVGCircleElement>(null);
  
  useEffect(() => {
    if (progressRef.current) {
      const progress = (100 - score) / 100 * circumference;
      progressRef.current.style.strokeDashoffset = `${progress}`;
    }
  }, [score, circumference]);

  const getColorClass = () => {
    if (status === 'verified') return 'text-green-500';
    if (status === 'refuted') return 'text-red-500';
    return 'text-yellow-500';
  };

  const getStatusIcon = () => {
    if (status === 'verified') return <Check className="h-6 w-6 text-white" />;
    if (status === 'refuted') return <X className="h-6 w-6 text-white" />;
    return <AlertCircle className="h-6 w-6 text-white" />;
  };

  const getStatusBackground = () => {
    if (status === 'verified') return 'bg-green-500';
    if (status === 'refuted') return 'bg-red-500';
    return 'bg-yellow-500';
  };

  const getStatusText = () => {
    if (status === 'verified') return 'Verified';
    if (status === 'refuted') return 'Refuted';
    return 'Mixed';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            className="text-gray-200 dark:text-gray-700 stroke-current"
            strokeWidth="8"
            cx="50"
            cy="50"
            r="45"
            fill="transparent"
          />
          
          {/* Progress circle */}
          <motion.circle
            ref={progressRef}
            className={`${getColorClass()} stroke-current`}
            strokeWidth="8"
            strokeLinecap="round"
            cx="50"
            cy="50"
            r="45"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: ((100 - score) / 100) * circumference }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            transform="rotate(-90 50 50)"
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 15 }}
            className="text-3xl font-bold text-gray-900 dark:text-white"
          >
            {score}%
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-sm text-gray-500 dark:text-gray-400 mt-1"
          >
            Truth Score
          </motion.div>
        </div>
      </div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-4 flex items-center"
      >
        <span className={`inline-flex items-center px-3 py-1 rounded-full ${getStatusBackground()} text-xs font-medium text-white`}>
          {getStatusIcon()}
          <span className="ml-1">{getStatusText()}</span>
        </span>
      </motion.div>
    </div>
  );
};

export default TruthScore;