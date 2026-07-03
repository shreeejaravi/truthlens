import { AnalysisResult, AnalysisHistory, User, AnalysisFilter } from '../types';

// Simulated delay for API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Sophisticated fake URL detection algorithm
const generateTruthScore = (url: string): number => {
  const domain = new URL(url).hostname.toLowerCase();
  
  // Known fake/suspicious domain patterns
  const suspiciousPatterns = [
    /fake/i, /scam/i, /phishing/i, /malware/i, /virus/i,
    /clickbait/i, /hoax/i, /spam/i, /fraud/i, /deceptive/i,
    /misleading/i, /false/i, /unverified/i, /dubious/i
  ];
  
  // Known legitimate domains (whitelist)
  const legitimateDomains = [
    'bbc.com', 'cnn.com', 'reuters.com', 'ap.org', 'npr.org',
    'nytimes.com', 'washingtonpost.com', 'theguardian.com',
    'wsj.com', 'bloomberg.com', 'forbes.com', 'techcrunch.com',
    'wired.com', 'arstechnica.com', 'github.com', 'stackoverflow.com',
    'wikipedia.org', 'who.int', 'cdc.gov', 'nih.gov', 'nasa.gov',
    'google.com', 'microsoft.com', 'apple.com', 'amazon.com'
  ];
  
  // Suspicious TLDs
  const suspiciousTlds = ['.tk', '.ml', '.ga', '.cf', '.click', '.download'];
  
  // URL structure analysis
  const hasSuspiciousPattern = suspiciousPatterns.some(pattern => 
    domain.includes(pattern.source.replace(/[\/\^$]/g, '')) || 
    url.includes(pattern.source.replace(/[\/\^$]/g, ''))
  );
  
  const hasSuspiciousTld = suspiciousTlds.some(tld => domain.endsWith(tld));
  const isLegitimateDomain = legitimateDomains.some(legit => domain.includes(legit));
  
  // URL length and complexity analysis
  const urlLength = url.length;
  const hasLongPath = url.split('/').length > 6;
  const hasManySubdomains = domain.split('.').length > 3;
  const hasRandomString = /[a-z0-9]{20,}/i.test(domain);
  
  // Domain age simulation (based on domain characteristics)
  const hasNewDomainPattern = /[0-9]{4,}|[a-z]{1,3}[0-9]{3,}/i.test(domain);
  
  // Calculate base score
  let score = 50; // Start with neutral score
  
  // Apply penalties for suspicious indicators
  if (hasSuspiciousPattern) score -= 40;
  if (hasSuspiciousTld) score -= 30;
  if (hasLongPath) score -= 15;
  if (hasManySubdomains) score -= 10;
  if (hasRandomString) score -= 25;
  if (hasNewDomainPattern) score -= 20;
  
  // Apply bonuses for legitimate indicators
  if (isLegitimateDomain) score += 35;
  if (domain.includes('.edu') || domain.includes('.gov')) score += 25;
  if (domain.includes('.org')) score += 10;
  
  // Add some randomness but keep it realistic
  const randomFactor = (Math.random() - 0.5) * 10;
  score += randomFactor;
  
  // Ensure score is within realistic bounds
  return Math.max(5, Math.min(95, Math.round(score)));
};

// Generate sophisticated flag data based on truth score and URL analysis
const generateFlags = (url: string, truthScore: number) => {
  const flags = [];
  const domain = new URL(url).hostname.toLowerCase();
  
  // Domain credibility flags
  if (truthScore < 30) {
    flags.push({
      type: 'sourceCredibility' as const,
      severity: 'high' as const,
      description: 'This domain has been flagged for publishing false or misleading information.',
    });
  } else if (truthScore < 50) {
    flags.push({
      type: 'sourceCredibility' as const,
      severity: 'medium' as const,
      description: 'Source credibility is questionable - verify information with trusted sources.',
    });
  }
  
  // URL structure flags
  if (domain.split('.').length > 3) {
    flags.push({
      type: 'factualAccuracy' as const,
      severity: 'medium' as const,
      description: 'Complex subdomain structure may indicate suspicious activity.',
    });
  }
  
  // Content analysis flags
  if (truthScore < 40) {
    flags.push({
      type: 'biasedLanguage' as const,
      severity: 'high' as const,
      description: 'Content contains emotionally manipulative language and unsubstantiated claims.',
    });
  } else if (truthScore < 60) {
    flags.push({
      type: 'biasedLanguage' as const,
      severity: 'medium' as const,
      description: 'Content shows signs of bias and may present information selectively.',
    });
  }
  
  // Factual accuracy flags
  if (truthScore < 35) {
    flags.push({
      type: 'factualAccuracy' as const,
      severity: 'high' as const,
      description: 'Multiple factual errors detected - claims contradict verified sources.',
    });
  } else if (truthScore < 55) {
    flags.push({
      type: 'factualAccuracy' as const,
      severity: 'medium' as const,
      description: 'Some claims appear questionable and require verification.',
    });
  }
  
  // Image manipulation flags (for very low scores)
  if (truthScore < 25) {
    flags.push({
      type: 'imageManipulation' as const,
      severity: 'high' as const,
      description: 'Images appear to be digitally altered or taken out of context.',
    });
  }
  
  // TLD-based flags
  const suspiciousTlds = ['.tk', '.ml', '.ga', '.cf', '.click', '.download'];
  if (suspiciousTlds.some(tld => domain.endsWith(tld))) {
    flags.push({
      type: 'sourceCredibility' as const,
      severity: 'high' as const,
      description: 'Domain uses a suspicious top-level domain associated with malicious activity.',
    });
  }
  
  return flags;
};

export const analyzeUrl = async (url: string): Promise<AnalysisResult> => {
  await delay(2000); // Simulate API processing time
  
  const truthScore = generateTruthScore(url);
  const domain = new URL(url).hostname;
  
  let status: 'verified' | 'refuted' | 'mixed';
  if (truthScore >= 80) status = 'verified';
  else if (truthScore <= 25) status = 'refuted';
  else status = 'mixed';
  
  // Generate realistic category scores based on truth score
  // Higher truth score = lower bias/manipulation, higher credibility/accuracy
  const biasedLanguage = Math.max(5, Math.min(95, 100 - truthScore + (Math.random() - 0.5) * 10));
  const sourceCredibility = Math.max(5, Math.min(95, truthScore + (Math.random() - 0.5) * 8));
  const factualAccuracy = Math.max(5, Math.min(95, truthScore + (Math.random() - 0.5) * 6));
  const imageManipulation = Math.max(5, Math.min(95, 100 - truthScore + (Math.random() - 0.5) * 12));
  
  // Generate personalized summary based on the URL and score
  const summaries = [
    `This content from ${domain} contains multiple misleading claims and should be viewed with skepticism.`,
    `While some information appears accurate, this article from ${domain} contains several biased statements.`,
    `Our analysis indicates this content from ${domain} is largely factual with minor issues.`,
    `The information from ${domain} has been verified against multiple credible sources and appears accurate.`
  ];
  
  const summaryIndex = Math.min(3, Math.floor(truthScore / 25));
  
  return {
    id: `analysis-${Date.now()}`,
    url,
    title: `Analysis of content from ${domain}`,
    domain,
    truthScore,
    status,
    createdAt: new Date().toISOString(),
    categories: {
      biasedLanguage,
      sourceCredibility,
      factualAccuracy,
      imageManipulation
    },
    flags: generateFlags(url, truthScore),
    summary: summaries[summaryIndex]
  };
};

export const getUserHistory = async (userId: string, filters?: AnalysisFilter): Promise<AnalysisHistory> => {
  await delay(1000); // Simulate API call
  
  // Generate 10 random analyses
  const analyses = Array.from({ length: 10 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const fakeUrls = [
      'https://www.newssite.com/article/politics-2023',
      'https://www.technews.org/latest/ai-breakthrough',
      'https://www.scienceblog.com/discovery/health',
      'https://www.dailyreporter.net/world/events',
      'https://www.factstream.com/reports/economy'
    ];
    
    return analyzeUrl(fakeUrls[i % fakeUrls.length]);
  });
  
  // Resolve all the promises from analyzeUrl
  const recentAnalyses = await Promise.all(analyses);
  
  // Apply filters if provided
  let filteredAnalyses = recentAnalyses;
  if (filters) {
    if (filters.status) {
      filteredAnalyses = filteredAnalyses.filter(a => a.status === filters.status);
    }
    if (filters.minScore !== undefined) {
      filteredAnalyses = filteredAnalyses.filter(a => a.truthScore >= (filters.minScore || 0));
    }
    if (filters.maxScore !== undefined) {
      filteredAnalyses = filteredAnalyses.filter(a => a.truthScore <= (filters.maxScore || 100));
    }
  }
  
  const total = filteredAnalyses.length;
  const averageTruthScore = total > 0 
    ? Math.round(filteredAnalyses.reduce((sum, a) => sum + a.truthScore, 0) / total) 
    : 0;
  
  const distribution = {
    verified: filteredAnalyses.filter(a => a.status === 'verified').length,
    refuted: filteredAnalyses.filter(a => a.status === 'refuted').length,
    mixed: filteredAnalyses.filter(a => a.status === 'mixed').length
  };
  
  return {
    total,
    averageTruthScore,
    distribution,
    recentAnalyses: filteredAnalyses
  };
};

export const getCurrentUser = async (): Promise<User | null> => {
  // Check local storage for logged in state (in a real app, would verify with backend)
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    return null;
  }
  
  await delay(500);
  
  return {
    id: 'user-1',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    createdAt: '2023-01-15T08:30:00.000Z'
  };
};

export const loginUser = async (email: string, password: string): Promise<User> => {
  await delay(1000);
  
  // Simple validation
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  
  // In a real app, this would validate against a backend
  localStorage.setItem('isLoggedIn', 'true');
  
  return {
    id: 'user-1',
    name: 'Jane Smith',
    email,
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    createdAt: '2023-01-15T08:30:00.000Z'
  };
};

export const registerUser = async (name: string, email: string, password: string): Promise<User> => {
  await delay(1500);
  
  // Simple validation
  if (!name || !email || !password) {
    throw new Error('All fields are required');
  }
  
  // In a real app, this would register with a backend
  localStorage.setItem('isLoggedIn', 'true');
  
  return {
    id: 'user-1',
    name,
    email,
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
    createdAt: new Date().toISOString()
  };
};

export const logoutUser = async (): Promise<void> => {
  await delay(500);
  localStorage.removeItem('isLoggedIn');
};