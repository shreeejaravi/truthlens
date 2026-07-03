import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Shield, Eye, History, ArrowRight } from 'lucide-react';
import UrlInput from '../components/analysis/UrlInput';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  const navigate = useNavigate();
  
  const handleAnalyze = (url: string) => {
    // Redirect to analyze page with the URL as a query parameter
    navigate(`/analyze?url=${encodeURIComponent(url)}`);
  };
  
  const features = [
    {
      icon: <Search className="h-8 w-8 text-blue-600" />,
      title: 'URL Analysis',
      description: 'Check any article, social media post, or news website for misinformation and bias.'
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: 'Truth Score',
      description: 'Get a comprehensive trustworthiness score based on multiple verification factors.'
    },
    {
      icon: <Eye className="h-8 w-8 text-purple-600" />,
      title: 'Explainable AI',
      description: 'Understand exactly why content was flagged with detailed breakdowns and visual indicators.'
    },
    {
      icon: <History className="h-8 w-8 text-amber-600" />,
      title: 'Analysis History',
      description: 'Track your fact-checking history and monitor sources over time.'
    }
  ];
  
  const steps = [
    {
      number: '01',
      title: 'Enter a URL',
      description: 'Paste any news article, social media post, or website URL to analyze.'
    },
    {
      number: '02',
      title: 'Get Instant Analysis',
      description: 'Our AI evaluates content credibility, bias, and accuracy in seconds.'
    },
    {
      number: '03',
      title: 'Review the Breakdown',
      description: 'Explore detailed results showing exactly which elements were flagged and why.'
    }
  ];
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative pt-8 pb-16 sm:pt-16 sm:pb-24 lg:pb-32">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                <span className="block">Separate fact from fiction</span>
                <span className="block text-blue-600 dark:text-blue-400">with AI-powered analysis</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                TruthLens uses advanced artificial intelligence to analyze online content, 
                detect misinformation, and provide clear, explainable results.
              </p>
              
              <div className="mt-8 sm:mt-12">
                <UrlInput onAnalyze={handleAnalyze} isLoading={false} />
              </div>
              
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Try it with any news article or social media post
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-16 bg-white dark:bg-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              Advanced Fact-Checking, Simplified
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
              The tools you need to navigate the information landscape with confidence.
            </p>
          </div>
          
          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="pt-6"
                >
                  <div className="flow-root rounded-lg bg-gray-50 dark:bg-gray-900 px-6 pb-8 transition-colors">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-blue-500 dark:bg-blue-600 rounded-md shadow-lg">
                          {feature.icon}
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 dark:text-white tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="mt-5 text-base text-gray-500 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* How It Works */}
      <div className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
              How TruthLens Works
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
              Three simple steps to verify any online content.
            </p>
          </div>
          
          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {steps.map((step, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="group">
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-600 text-white text-xl font-bold">
                      {step.number}
                    </div>
                    <div className="ml-16 pt-1">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                        {step.description}
                      </p>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-12 right-0 transform translate-x-1/2">
                      <ArrowRight className="h-6 w-6 text-gray-300 dark:text-gray-700" />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link
              to="/analyze"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Try it now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
      
      {/* CTA */}
      <div className="bg-blue-600 dark:bg-blue-700 transition-colors">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to verify content?</span>
            <span className="block text-blue-200">Create an account to track your analyses.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors"
              >
                Sign up for free
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 hover:bg-blue-900 transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;