import React, { useState } from 'react';
import { User, Mail, Calendar, Camera, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const ProfileCard: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!user) {
    return null;
  }
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, update user data
    // await updateProfile({ name });
    
    setIsSubmitting(false);
    setIsEditing(false);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden transition-colors"
    >
      {/* Cover photo */}
      <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
      
      <div className="relative px-6 pb-6">
        {/* Avatar */}
        <div className="absolute -top-16 left-6">
          <div className="relative">
            <img
              className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 shadow-md object-cover transition-colors"
              src={user.avatar}
              alt={user.name}
            />
            <button className="absolute bottom-0 right-0 rounded-full bg-blue-600 p-2 text-white shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
              <Camera className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="pt-20">
          {isEditing ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white sm:text-sm transition-colors"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-md border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md border border-transparent hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition-colors"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                  <div className="mt-1 flex items-center text-gray-500 dark:text-gray-400">
                    <Mail className="h-4 w-4 mr-1" />
                    <span>{user.email}</span>
                  </div>
                  <div className="mt-1 flex items-center text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Joined {formatDate(user.createdAt)}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Edit Profile
                </button>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 text-center transition-colors">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">28</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Analyses</div>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4 text-center transition-colors">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">82%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Avg. Truth Score</div>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4 text-center transition-colors">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">12</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Saved Articles</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;