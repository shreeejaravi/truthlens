export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
};

export type AnalysisResult = {
  id: string;
  url: string;
  title: string;
  domain: string;
  truthScore: number;
  status: 'verified' | 'refuted' | 'mixed';
  createdAt: string;
  categories: {
    biasedLanguage: number;
    sourceCredibility: number;
    factualAccuracy: number;
    imageManipulation: number;
  };
  flags: Flag[];
  summary: string;
};

export type Flag = {
  type: 'biasedLanguage' | 'sourceCredibility' | 'factualAccuracy' | 'imageManipulation';
  severity: 'low' | 'medium' | 'high';
  description: string;
  location?: string;
};

export type AnalysisHistory = {
  total: number;
  averageTruthScore: number;
  distribution: {
    verified: number;
    refuted: number;
    mixed: number;
  };
  recentAnalyses: AnalysisResult[];
};

export type AnalysisFilter = {
  status?: 'verified' | 'refuted' | 'mixed';
  dateRange?: 'today' | 'week' | 'month' | 'all';
  minScore?: number;
  maxScore?: number;
};

export type ThemeMode = 'light' | 'dark';