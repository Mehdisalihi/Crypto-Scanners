export interface TokenPair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceNative: string;
  priceUsd?: string;
  txns: {
    m5: { buys: number; sells: number };
    h1: { buys: number; sells: number };
    h6: { buys: number; sells: number };
    h24: { buys: number; sells: number };
  };
  volume: {
    h24: number;
    h6: number;
    h1: number;
    m5: number;
  };
  priceChange: {
    m5?: number;
    h1?: number;
    h6?: number;
    h24?: number;
  };
  liquidity?: {
    usd?: number;
    base?: number;
    quote?: number;
  };
  fdv?: number;
  pairCreatedAt?: number;
  isNewDiscovery?: boolean;
  discoveredAt?: number;
  listingType?: 'DEX' | 'CEX';
  listedExchanges?: string[];
  primaryExchange?: string;
  high24h?: number;
  low24h?: number;
  tradeCount24h?: number;
  info?: {
    imageUrl?: string;
    websites?: Array<{ label: string; url: string }>;
    socials?: Array<{ type: string; url: string }>;
  };
}

export interface PumpScoreMetrics {
  score: number; // 0-100
  rating: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'MOONSHOT';
  breakdown: {
    volumeSpike: number;       // 0-25
    buyPressure: number;       // 0-25
    liquidityDensity: number;  // 0-20
    socialMomentum: number;    // 0-15
    priceAction: number;       // 0-15
  };
  signals: string[]; // e.g. ["Volume spike detected", "High buy ratio", "Active socials"]
  geminiAnalysis?: string; // AI generated logic
}

export interface AppUser {
  uid: string;
  email: string;
  subscriptionStatus: 'free' | 'pro';
  proUntil: string | null;
  referralCode: string;
  referredBy: string | null;
  referralCount: number;
  createdAt: string;
}

export interface PriceAlert {
  id: string;
  uid: string;
  pairAddress: string;
  tokenAddress: string;
  symbol: string;
  name: string;
  chainId: string;
  targetPrice: number;
  initialPrice: number;
  condition: 'above' | 'below';
  status: 'active' | 'triggered';
  triggeredAt?: string | null;
  triggeredPrice?: number | null;
  createdAt: string;
}

export type Language = 'en' | 'ar' | 'fr';

export interface TranslationSet {
  title: string;
  subtitle: string;
  scanPlaceholder: string;
  scanButton: string;
  scanning: string;
  trendingTokens: string;
  pumpScore: string;
  signals: string;
  volume24h: string;
  liquidity: string;
  m5Volume: string;
  buySellRatio: string;
  proBadge: string;
  upgradePro: string;
  proFeatures: string;
  referralTitle: string;
  referralDesc: string;
  yourReferralLink: string;
  referralStats: string;
  referredCount: string;
  referralSuccess: string;
  loginRequired: string;
  loginButton: string;
  logoutButton: string;
  registerButton: string;
  chainFilter: string;
  scoreBreakdown: string;
  volumeSpike: string;
  buyPressure: string;
  liquidityDensity: string;
  socialMomentum: string;
  priceAction: string;
  moonshotChance: string;
  criticalPump: string;
  highPump: string;
  medPump: string;
  lowPump: string;
  proExclusiveAlert: string;
  copied: string;
  referralReward: string;
  recentScans: string;
  savedTokens: string;
  saveToken: string;
  unsaveToken: string;
  noSavedTokens: string;
  analyticsHeader: string;
  realtimeBanner: string;
}
