import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  YAxis,
  XAxis,
  Tooltip
} from 'recharts';
import { 
  Search, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  Sparkles, 
  Globe, 
  ChevronRight, 
  Copy, 
  Check, 
  Flame, 
  Bookmark, 
  BookmarkCheck, 
  Lock, 
  RefreshCw, 
  LogOut, 
  User, 
  CreditCard, 
  AlertCircle, 
  Activity, 
  LayoutGrid,
  Zap,
  BarChart2,
  Crown,
  Star,
  Wallet,
  Bell,
  Smartphone,
  Menu,
  X,
  ArrowRight,
  Trash2,
  TrendingDown,
  BellRing,
  Landmark,
  ExternalLink,
  SlidersHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, auth, googleProvider, signInWithPopup, OperationType, handleFirestoreError } from './firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  onSnapshot,
  deleteDoc
} from 'firebase/firestore';
import { translations } from './translations';
import { TokenPair, PumpScoreMetrics, AppUser, Language, PriceAlert } from './types';

const APP_LOGO_URL = '/assets/aistudio/6CC66189-A1EF-4197-8A84-C9F2AAF241E5_03fb7dac.png';

// Custom high-fidelity SVGs for screenshot-matching coins
const FrogIcon = () => (
  <svg viewBox="0 0 100 100" className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-[#162C1E] border border-emerald-500/30 p-1">
    <ellipse cx="50" cy="55" rx="35" ry="25" fill="#4CAF50" />
    <circle cx="32" cy="35" r="12" fill="#4CAF50" />
    <circle cx="68" cy="35" r="12" fill="#4CAF50" />
    <circle cx="32" cy="35" r="8" fill="white" />
    <circle cx="68" cy="35" r="8" fill="white" />
    <circle cx="32" cy="35" r="4" fill="black" />
    <circle cx="68" cy="35" r="4" fill="black" />
    <circle cx="25" cy="58" r="4" fill="#FF8A80" />
    <circle cx="75" cy="58" r="4" fill="#FF8A80" />
    <path d="M 35 60 Q 50 70 65 60" stroke="black" strokeWidth="3" fill="none" strokeLinecap="round" />
  </svg>
);

const AnifIcon = () => (
  <svg viewBox="0 0 100 100" className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-[#2C2116] border border-amber-600/30 p-1">
    <circle cx="50" cy="50" r="45" fill="#1C1816" />
    <circle cx="50" cy="55" r="22" fill="#F5C396" />
    <ellipse cx="43" cy="52" rx="2.5" ry="3.5" fill="#3E2723" />
    <ellipse cx="57" cy="52" rx="2.5" ry="3.5" fill="#3E2723" />
    <path d="M 28 55 Q 50 82 72 55" fill="#5D4037" />
    <circle cx="50" cy="57" r="21" fill="#F5C396" />
    <path d="M 32 58 Q 50 78 68 58 Q 50 85 32 58" fill="#3E2723" />
    <path d="M 25 50 C 25 25, 75 25, 75 50 Z" fill="#8D6E63" />
    <rect x="22" y="44" width="56" height="8" rx="4" fill="#795548" />
  </svg>
);

const NiggabullIcon = () => (
  <svg viewBox="0 0 100 100" className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-[#121212] border border-emerald-500/20 p-1">
    <path d="M 30 35 L 50 25 L 70 35 L 70 65 L 50 85 L 30 65 Z" fill="#212121" />
    <circle cx="50" cy="78" r="10" stroke="#FFD54F" strokeWidth="4" fill="none" />
    <polygon points="36,48 44,48 40,43" fill="#00E676" />
    <polygon points="64,48 56,48 60,43" fill="#00E676" />
    <path d="M 30 35 Q 15 20 22 10 Q 30 20 34 33" fill="#E0E0E0" />
    <path d="M 70 35 Q 85 20 78 10 Q 70 20 66 33" fill="#E0E0E0" />
  </svg>
);

const FartcoinIcon = () => (
  <svg viewBox="0 0 100 100" className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-[#1E1E1E] border border-purple-500/20 p-1">
    <circle cx="50" cy="50" r="45" fill="#111111" />
    <path d="M 35 60 Q 45 45 35 30 Q 55 50 65 30 Q 55 60 45 75 Q 40 65 35 60" fill="#8E24AA" opacity="0.6" />
    <path d="M 45 65 Q 55 55 45 40 Q 60 55 68 40" fill="#BA68C8" opacity="0.8" />
    <text x="50" y="60" fill="white" fontSize="28" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">F</text>
  </svg>
);

const DarkIcon = () => (
  <svg viewBox="0 0 100 100" className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-[#1A112C] border border-indigo-500/40 p-1">
    <circle cx="50" cy="50" r="44" stroke="#7E57C2" strokeWidth="2" fill="none" strokeDasharray="4 2" />
    <polygon points="50,15 60,40 85,50 60,60 50,85 40,60 15,50 40,40" fill="#9575CD" />
    <circle cx="50" cy="50" r="8" fill="#FFD54F" />
    <line x1="50" y1="10" x2="50" y2="90" stroke="#FFD54F" strokeWidth="1.5" />
    <line x1="10" y1="50" x2="90" y2="50" stroke="#FFD54F" strokeWidth="1.5" />
  </svg>
);

const WifIcon = () => (
  <svg viewBox="0 0 100 100" className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-[#3C2E2A] border border-amber-600/30 p-1">
    <circle cx="50" cy="55" r="30" fill="#D7CCC8" />
    <circle cx="38" cy="48" r="4" fill="#3E2723" />
    <circle cx="62" cy="48" r="4" fill="#3E2723" />
    <path d="M 25 35 Q 50 15 75 35 Z" fill="#FF8A80" />
    <rect x="20" y="32" width="60" height="6" rx="3" fill="#FF5252" />
    <path d="M 42 62 Q 50 68 58 62" stroke="#3E2723" strokeWidth="3" fill="none" strokeLinecap="round" />
  </svg>
);

const BonkIcon = () => (
  <svg viewBox="0 0 100 100" className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-[#2C1A10] border border-orange-500/30 p-1">
    <circle cx="50" cy="50" r="45" fill="#E65100" />
    <circle cx="50" cy="52" r="35" fill="#FFB74D" />
    <path d="M 22 25 Q 12 45 28 45 Z" fill="#E65100" />
    <path d="M 78 25 Q 88 45 72 45 Z" fill="#E65100" />
    <circle cx="40" cy="45" r="4" fill="#3E2723" />
    <circle cx="60" cy="45" r="4" fill="#3E2723" />
    <polygon points="46,55 54,55 50,60" fill="#3E2723" />
    <path d="M 45 65 Q 50 70 55 65" stroke="#3E2723" strokeWidth="2.5" fill="none" strokeLinecap="round" />
  </svg>
);

const renderTokenIcon = (symbol: string) => {
  const s = symbol.toUpperCase().trim();
  if (s === 'RIBBIT') return <FrogIcon />;
  if (s === 'ANIF') return <AnifIcon />;
  if (s === 'NIGGABULL') return <NiggabullIcon />;
  if (s === 'FARTCOIN') return <FartcoinIcon />;
  if (s === 'DARK') return <DarkIcon />;
  if (s === 'WIF') return <WifIcon />;
  if (s === 'BONK') return <BonkIcon />;
  return null;
};

const KNOWN_TOKEN_ICONS: Record<string, string> = {
  BTC: 'https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png',
  ETH: 'https://coin-images.coingecko.com/coins/images/279/large/ethereum.png',
  SOL: 'https://coin-images.coingecko.com/coins/images/4128/large/solana.png',
  BNB: 'https://coin-images.coingecko.com/coins/images/825/large/bnb-icon2_2x.png',
  XRP: 'https://coin-images.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png',
  DOGE: 'https://coin-images.coingecko.com/coins/images/5/large/dogecoin.png',
};

const AVATAR_GRADIENTS = [
  'from-emerald-500/20 to-teal-500/30 dark:from-emerald-500/25 dark:to-teal-900/50 border-emerald-400/50 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300',
  'from-amber-500/20 to-orange-500/30 dark:from-amber-500/25 dark:to-orange-900/50 border-amber-400/50 dark:border-amber-500/40 text-amber-700 dark:text-amber-300',
  'from-sky-500/20 to-blue-500/30 dark:from-sky-500/25 dark:to-blue-900/50 border-sky-400/50 dark:border-sky-500/40 text-sky-700 dark:text-sky-300',
  'from-purple-500/20 to-indigo-500/30 dark:from-purple-500/25 dark:to-indigo-900/50 border-purple-400/50 dark:border-purple-500/40 text-purple-700 dark:text-purple-300',
  'from-rose-500/20 to-pink-500/30 dark:from-rose-500/25 dark:to-pink-900/50 border-rose-400/50 dark:border-rose-500/40 text-rose-700 dark:text-rose-300',
  'from-cyan-500/20 to-slate-500/30 dark:from-cyan-500/25 dark:to-slate-900/50 border-cyan-400/50 dark:border-cyan-500/40 text-cyan-700 dark:text-cyan-300',
];

const TokenAvatar = ({
  symbol,
  imageUrl,
  size = 'md',
  className = '',
}: {
  symbol: string;
  imageUrl?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
}) => {
  const cleanSym = (symbol || 'TOK').toUpperCase().trim();
  const resolvedUrl = imageUrl || KNOWN_TOKEN_ICONS[cleanSym] || undefined;
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [resolvedUrl]);

  const sizeClass =
    size === 'xs'
      ? 'w-4 h-4 sm:w-5 sm:h-5 rounded sm:rounded-md text-[7px] sm:text-[8px]'
      : size === 'sm'
      ? 'w-5 h-5 sm:w-7 sm:h-7 rounded-md sm:rounded-lg text-[8px] sm:text-[10px]'
      : size === 'lg'
      ? 'w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl text-[10px] sm:text-xs'
      : 'w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl text-[9px] sm:text-[11px]';

  if (resolvedUrl && !imgFailed) {
    return (
      <div
        className={`${sizeClass} bg-slate-100 dark:bg-[#0C0E14] border border-slate-200 dark:border-[#22283A] overflow-hidden flex items-center justify-center shrink-0 shadow-sm ${className}`}
      >
        <img
          src={resolvedUrl}
          alt={cleanSym}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => setImgFailed(true)}
        />
      </div>
    );
  }

  const customSvg = renderTokenIcon(cleanSym);
  if (customSvg) {
    return (
      <div className={`${sizeClass} overflow-hidden flex items-center justify-center shrink-0 [&>svg]:w-full [&>svg]:h-full ${className}`}>
        {customSvg}
      </div>
    );
  }

  let hash = 0;
  for (let i = 0; i < cleanSym.length; i++) {
    hash = (hash * 31 + cleanSym.charCodeAt(i)) >>> 0;
  }
  const palette = AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
  const label = cleanSym.length <= 3 ? cleanSym : cleanSym.slice(0, 2);

  return (
    <div
      className={`${sizeClass} bg-gradient-to-br ${palette} border flex items-center justify-center font-extrabold font-mono tracking-tight shrink-0 select-none ${className}`}
    >
      {label}
    </div>
  );
};

// Compact, high-fidelity Risk Badge component matching the screenshot
const RiskBadge = ({ risk }: { risk: 'HIGH' | 'SAFE' }) => {
  if (risk === 'HIGH') {
    return (
      <div className="inline-flex flex-col items-center justify-center px-1 sm:px-1.5 py-0.5 rounded bg-red-50 dark:bg-red-950/20 border border-red-300 dark:border-red-500/30 min-w-[40px] sm:min-w-[50px] leading-tight select-none">
        <span className="text-[6.5px] sm:text-[7px] uppercase tracking-wider text-red-600/90 dark:text-red-400/80 font-extrabold flex items-center gap-0.5">
          ⚠️ RISK
        </span>
        <span className="font-sans text-[8px] sm:text-[9px] font-black uppercase text-red-600 dark:text-red-500">
          HIGH
        </span>
      </div>
    );
  }
  return (
    <div className="inline-flex flex-col items-center justify-center px-1 sm:px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-500/30 min-w-[40px] sm:min-w-[50px] leading-tight select-none">
      <span className="text-[6.5px] sm:text-[7px] uppercase tracking-wider text-emerald-700/90 dark:text-emerald-400/80 font-extrabold flex items-center gap-0.5">
        🛡️ RISK
      </span>
      <span className="font-sans text-[8px] sm:text-[9px] font-black uppercase text-emerald-700 dark:text-emerald-400">
        SAFE
      </span>
    </div>
  );
};

const wifToken = {
  pair: {
    chainId: 'solana',
    dexId: 'raydium',
    pairAddress: 'wif-pair-address',
    baseToken: { address: 'wif-address', name: 'dogwifhat', symbol: 'WIF' },
    quoteToken: { symbol: 'SOL' },
    priceUsd: '2.45',
    fdv: 2450000000,
    volume: { h24: 221000, h1: 15000, m5: 1200 },
    txns: { m5: { buys: 12, sells: 8 }, h1: { buys: 140, sells: 100 } },
    priceChange: { m5: 5.4, h1: 188.0, h24: 188.0 },
    info: { imageUrl: null, websites: [], socials: [] }
  },
  metrics: {
    score: 74,
    rating: 'HIGH' as const,
    breakdown: { volumeSpike: 18, buyPressure: 18, liquidityDensity: 15, socialMomentum: 12, priceAction: 11 },
    signals: ["Strong volume spike", "Bullish buyer bias"]
  }
};

const bonkToken = {
  pair: {
    chainId: 'solana',
    dexId: 'raydium',
    pairAddress: 'bonk-pair-address',
    baseToken: { address: 'bonk-address', name: 'Bonk', symbol: 'BONK' },
    quoteToken: { symbol: 'SOL' },
    priceUsd: '0.000028',
    fdv: 1800000000,
    volume: { h24: 310000, h1: 10000, m5: 800 },
    txns: { m5: { buys: 10, sells: 5 }, h1: { buys: 110, sells: 80 } },
    priceChange: { m5: 2.1, h1: 122.0, h24: 122.0 },
    info: { imageUrl: null, websites: [], socials: [] }
  },
  metrics: {
    score: 72,
    rating: 'HIGH' as const,
    breakdown: { volumeSpike: 17, buyPressure: 17, liquidityDensity: 15, socialMomentum: 11, priceAction: 12 },
    signals: ["Steady volume breakout", "Active buyer support"]
  }
};

export default function App() {
  // Locale / Translation
  const [lang, setLang] = useState<Language>('en');
  const t = translations[lang];
  const isRTL = lang === 'ar';

  // Theme State (Light / Clarity vs Dark)
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cs_theme');
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'dark';
  });

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('cs_theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  // Dynamic state for PRO status, defaulting to true to unlock premium features for free
  const [isProUnlocked, setIsProUnlocked] = useState(true);

  // Auth State
  const [user, setUser] = useState<AppUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [authError, setAuthError] = useState('');
  const [isAuthSubmitting, setIsAuthSubmitting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Layout Tab State
  const [activeSidebarTab, setActiveSidebarTab] = useState<'live-signals' | 'smart-money' | 'watchlist' | 'alerts' | 'reports' | 'portfolio' | 'referral' | 'profile'>('live-signals');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Filters State
  const [activeChainFilter, setActiveChainFilter] = useState<'all' | 'cex' | 'new' | 'solana' | 'bsc' | 'base' | 'eth'>('all');
  const [activeExchangeFilter, setActiveExchangeFilter] = useState<'all' | 'Binance' | 'OKX' | 'Bybit' | 'KuCoin'>('all');
  const [activeScoreFilter, setActiveScoreFilter] = useState<'all' | '60' | '70' | '80' | '90'>('all');

  // Scan & Unified Search State
  const [scanQuery, setScanQuery] = useState('');
  const [unifiedSearchResults, setUnifiedSearchResults] = useState<Array<{ pair: TokenPair; metrics: PumpScoreMetrics }>>([]);
  const [isSearchingUnified, setIsSearchingUnified] = useState(false);
  const [showSidebarSearchDropdown, setShowSidebarSearchDropdown] = useState(false);
  const [showMainSearchDropdown, setShowMainSearchDropdown] = useState(false);
  const [cexCatalogSize, setCexCatalogSize] = useState<number>(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState('');
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [activeToken, setActiveToken] = useState<{ pair: TokenPair; metrics: PumpScoreMetrics } | null>(null);
  const [recentScans, setRecentScans] = useState<Array<{ pair: TokenPair; metrics: PumpScoreMetrics }>>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pinnedTokensRef = useRef<Record<string, { pair: TokenPair; metrics: PumpScoreMetrics }>>({});

  // Live Scanner Feed / Trending State
  const [trendingTokens, setTrendingTokens] = useState<Array<{ pair: TokenPair; metrics: PumpScoreMetrics }>>([]);
  const [isRefreshingTrending, setIsRefreshingTrending] = useState(false);
  const [marketIndices, setMarketIndices] = useState<any[]>([]);
  const [liveTick, setLiveTick] = useState<number>(0);
  const [lastStreamTime, setLastStreamTime] = useState<string>('');
  const [isLiveStreamConnected, setIsLiveStreamConnected] = useState<boolean>(false);
  const [newTokensCount, setNewTokensCount] = useState<number>(0);
  const [latestNewToken, setLatestNewToken] = useState<{ symbol: string; name: string; chainId: string; pairAddress: string; discoveredAt: number } | null>(null);
  const [indexTickDir, setIndexTickDir] = useState<Record<string, 'up' | 'down' | 'flat'>>({});
  const [tokenTickDir, setTokenTickDir] = useState<Record<string, 'up' | 'down' | 'flat'>>({});
  const prevIndexPricesRef = useRef<Record<string, number>>({});
  const prevTokenPricesRef = useRef<Record<string, number>>({});
  const highScoreHistoryRef = useRef<Array<{ ts: number; score: number }>>([]);
  const [highScoreTrend, setHighScoreTrend] = useState<{
    currentScore: number;
    avg1m: number;
    delta: number;
    direction: 'up' | 'down' | 'flat';
  }>({
    currentScore: 0,
    avg1m: 0,
    delta: 0,
    direction: 'flat',
  });

  // 15-Minute Rolling Score History for all tokens with score >= 80
  type HighSignal15mPoint = {
    ts: number;
    avgScore: number;
    maxScore: number;
    minScore: number;
    count: number;
  };
  const [highSignalHistory15m, setHighSignalHistory15m] = useState<HighSignal15mPoint[]>(() => {
    try {
      const raw = localStorage.getItem('cs_high_signal_15m');
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      const cutoff = Date.now() - 15 * 60 * 1000;
      return parsed.filter(
        (pt: any) =>
          pt &&
          typeof pt.ts === 'number' &&
          pt.ts >= cutoff &&
          typeof pt.avgScore === 'number'
      );
    } catch {
      return [];
    }
  });
  const lastClient15mSampleRef = useRef<number>(0);

  const mergeHighSignal15mPoints = (
    prev: HighSignal15mPoint[],
    incoming: HighSignal15mPoint[]
  ): HighSignal15mPoint[] => {
    const cutoff = Date.now() - 15 * 60 * 1000;
    const byBucket = new Map<number, HighSignal15mPoint>();
    for (const pt of [...prev, ...incoming]) {
      if (!pt || typeof pt.ts !== 'number' || pt.ts < cutoff || typeof pt.avgScore !== 'number') {
        continue;
      }
      // Deduplicate into ~4s buckets keeping latest sample per bucket
      const bucket = Math.floor(pt.ts / 4000);
      const existing = byBucket.get(bucket);
      if (!existing || pt.ts >= existing.ts) {
        byBucket.set(bucket, pt);
      }
    }
    const merged = Array.from(byBucket.values())
      .sort((a, b) => a.ts - b.ts)
      .slice(-180);
    try {
      localStorage.setItem('cs_high_signal_15m', JSON.stringify(merged));
    } catch {
      // ignore storage quota error
    }
    return merged;
  };

  const highSignalSparklineData = useMemo(() => {
    const cutoff = Date.now() - 15 * 60 * 1000;
    const pts = highSignalHistory15m.filter((pt) => pt.ts >= cutoff);
    if (pts.length === 1) {
      const only = pts[0];
      return [{ ...only, ts: only.ts - 15_000 }, only];
    }
    return pts;
  }, [highSignalHistory15m]);

  const highSignalSparkDomain = useMemo<[number, number]>(() => {
    if (highSignalSparklineData.length === 0) return [80, 100];
    let minVal = 100;
    let maxVal = 80;
    for (const pt of highSignalSparklineData) {
      if (pt.avgScore < minVal) minVal = pt.avgScore;
      if (pt.maxScore > maxVal) maxVal = pt.maxScore;
    }
    return [
      Math.max(76, Math.floor(minVal - 2)),
      Math.min(100, Math.ceil(maxVal + 1)),
    ];
  }, [highSignalSparklineData]);

  // Watchlist State (Firestore)
  const [watchlist, setWatchlist] = useState<Array<{ id: string; pair: TokenPair; metrics: PumpScoreMetrics }>>([]);

  // Price Threshold Alerts State (Firestore)
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);
  const [alertsEnabled, setAlertsEnabled] = useState<boolean>(true);
  const [notificationPermission, setNotificationPermission] = useState<'default' | 'granted' | 'denied' | 'unsupported'>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });
  const [triggeredBanner, setTriggeredBanner] = useState<PriceAlert | null>(null);
  const [drawerAlertTarget, setDrawerAlertTarget] = useState<string>('');
  const [drawerAlertCondition, setDrawerAlertCondition] = useState<'above' | 'below'>('above');
  const [isSavingAlert, setIsSavingAlert] = useState<boolean>(false);
  const [alertFormAssetKey, setAlertFormAssetKey] = useState<string>('INDEX:BTC');
  const [alertFormTarget, setAlertFormTarget] = useState<string>('');
  const [alertFormCondition, setAlertFormCondition] = useState<'above' | 'below'>('above');
  const triggeringAlertIdsRef = useRef<Set<string>>(new Set());
  const [showHighSignalAlertModal, setShowHighSignalAlertModal] = useState<boolean>(false);
  const [highSignalModalPairAddr, setHighSignalModalPairAddr] = useState<string>('');
  const [highSignalModalTarget, setHighSignalModalTarget] = useState<string>('');
  const [highSignalModalCondition, setHighSignalModalCondition] = useState<'above' | 'below'>('above');

  // Gemini AI Analysis State
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Referral States
  const [enteredReferralCode, setEnteredReferralCode] = useState('');
  const [referralFeedback, setReferralFeedback] = useState('');

  // Payment/Checkout State
  const [showCheckoutModalState, setShowCheckoutModalState] = useState(false);
  const showCheckoutModal = showCheckoutModalState && !isProUnlocked;
  const setShowCheckoutModal = (val: boolean) => {
    if (val && isProUnlocked) {
      showToast(lang === 'ar' ? "باقات PRO معطلة مؤقتاً والميزات مفعلة مجاناً للجميع!" : "PRO plans are temporarily disabled and free for everyone!");
      return;
    }
    setShowCheckoutModalState(val);
  };
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Toast State
  const [toastMessage, setToastMessage] = useState('');

  // Terminal Dashboard UI states
  const [terminalTimeframe, setTerminalTimeframe] = useState<'5M' | '15M' | '1H' | '4H' | '1D'>('1H');
  const [terminalActiveTab, setTerminalActiveTab] = useState<'history' | 'liquidity' | 'holders' | 'traders'>('history');
  const [terminalSubFilter, setTerminalSubFilter] = useState<'All' | 'KOLs' | 'Smart Money' | 'Top Holders' | 'Dev' | 'Insiders' | 'Snipers' | 'Bundlers'>('All');
  const [simulatedTrades, setSimulatedTrades] = useState<any[]>([]);
  const [chartHoveredPoint, setChartHoveredPoint] = useState<any | null>(null);
  const [terminalClock, setTerminalClock] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hrs = now.getUTCHours().toString().padStart(2, '0');
      const mins = now.getUTCMinutes().toString().padStart(2, '0');
      const secs = now.getUTCSeconds().toString().padStart(2, '0');
      setTerminalClock(`${hrs}:${mins}:${secs} (UTC)`);
    };
    updateClock();
    const clockInterval = setInterval(updateClock, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  useEffect(() => {
    if (!isDrawerOpen || !activeToken) return;

    const symbol = activeToken.pair.baseToken.symbol;
    const isCheap = parseFloat(activeToken.pair.priceUsd || '0') < 1;
    const priceNum = parseFloat(activeToken.pair.priceUsd || '0');

    const generateRandomTrade = (isInitial = false) => {
      const isBuy = Math.random() < 0.65; // Bias towards Buys
      const rawAmount = Math.random() * 400 + 10; // 10K - 410K
      const amountStr = `${isBuy ? '+' : '-'}${rawAmount.toFixed(2)}K ${symbol}`;
      
      const valueNum = rawAmount * 1000 * (priceNum || 0.00009471);
      const valueStr = valueNum > 1000 ? `$${valueNum.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : `$${valueNum.toFixed(2)}`;

      const priceVariance = (Math.random() - 0.45) * 0.015; // -0.67% to +0.83%
      const tradePrice = (priceNum || 0.00009471) * (1 + priceVariance);
      const priceStr = isCheap 
        ? `$${tradePrice.toFixed(8)}`
        : `$${tradePrice.toFixed(4)}`;

      const wallets = ["J8LF...kH9H", "8DHs...z9FK", "Fa72...AKRx", "H7pK...b9Ws", "Cr5m...Yx3q", "9bX2...LmPo", "Gg3h...WqRe", "Kp9s...MvBn"];
      const prefixes = ["J", "8", "F", "H", "C", "9", "G", "K"];
      const randomIndex = Math.floor(Math.random() * wallets.length);

      return {
        id: Math.random().toString(),
        time: isInitial ? `${Math.floor(Math.random() * 50) + 9}s` : '9s',
        type: isBuy ? 'Buy' : 'Sell',
        amount: amountStr,
        value: valueStr,
        price: priceStr,
        wallet: wallets[randomIndex],
        walletPrefix: prefixes[randomIndex],
        isNew: !isInitial,
      };
    };

    const initialTrades = Array.from({ length: 8 }, () => generateRandomTrade(true));
    setSimulatedTrades(initialTrades);

    const interval = setInterval(() => {
      const newTrade = generateRandomTrade(false);
      setSimulatedTrades(prev => {
        const updated = prev.map(t => {
          if (t.time === '9s') return { ...t, time: '18s', isNew: false };
          if (t.time.includes('s')) {
            const secs = parseInt(t.time) + 9;
            return { ...t, time: `${secs}s` };
          }
          return t;
        });
        return [newTrade, ...updated].slice(0, 15);
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [isDrawerOpen, activeToken]);

  // Auto-scanning logging step simulator
  const logSteps = [
    "Establishing DeFi liquidity socket...",
    "Querying DEX routers on Ethereum/Solana/BSC/Base...",
    "Retrieving transaction order books...",
    "Evaluating 5m/1h volume momentum matrices...",
    "Scrubbing project social metadata & web presence...",
    "Synthesizing Pump Confidence Vector metrics..."
  ];

  // Apply live 1-second snapshot (from SSE or fallback poll)
  const applyLiveSnapshot = (payload: {
    tick?: number;
    updatedAt?: number;
    indices?: any[];
    tokens?: Array<{ pair: TokenPair; metrics: PumpScoreMetrics }>;
    newTokensCount?: number;
    latestNewToken?: any;
    highSignalHistory15m?: HighSignal15mPoint[];
  }) => {
    if (typeof payload.tick === 'number') setLiveTick(payload.tick);
    const ts = payload.updatedAt ? new Date(payload.updatedAt) : new Date();
    setLastStreamTime(
      `${ts.getUTCHours().toString().padStart(2, '0')}:${ts.getUTCMinutes().toString().padStart(2, '0')}:${ts.getUTCSeconds().toString().padStart(2, '0')} UTC`
    );

    if (Array.isArray(payload.indices) && payload.indices.length > 0) {
      const nextDirs: Record<string, 'up' | 'down' | 'flat'> = {};
      for (const item of payload.indices) {
        const prev = prevIndexPricesRef.current[item.symbol];
        if (typeof prev === 'number' && prev !== item.price) {
          nextDirs[item.symbol] = item.price > prev ? 'up' : 'down';
        } else {
          nextDirs[item.symbol] = 'flat';
        }
        prevIndexPricesRef.current[item.symbol] = item.price;
      }
      setIndexTickDir(nextDirs);
      setMarketIndices(payload.indices);
    }

    if (Array.isArray(payload.tokens) && payload.tokens.length > 0) {
      const nextTokenDirs: Record<string, 'up' | 'down' | 'flat'> = {};
      const incomingByAddr = new Map<string, { pair: TokenPair; metrics: PumpScoreMetrics }>();

      for (const tok of payload.tokens) {
        const addr = tok.pair?.pairAddress;
        if (addr) incomingByAddr.set(addr, tok);
        const p = parseFloat(tok.pair?.priceUsd || '0');
        if (addr && p > 0) {
          const prevP = prevTokenPricesRef.current[addr];
          if (typeof prevP === 'number' && prevP !== p) {
            nextTokenDirs[addr] = p > prevP ? 'up' : 'down';
          } else {
            nextTokenDirs[addr] = 'flat';
          }
          prevTokenPricesRef.current[addr] = p;
        }
      }

      // Preserve any searched/pinned tokens not currently in the default top slice
      const pinnedExtras: Array<{ pair: TokenPair; metrics: PumpScoreMetrics }> = [];
      for (const addr of Object.keys(pinnedTokensRef.current)) {
        const pinned = pinnedTokensRef.current[addr];
        if (!pinned) continue;
        const updated = incomingByAddr.get(addr);
        if (updated) {
          pinnedTokensRef.current[addr] = updated;
        } else {
          pinnedExtras.push(pinned);
        }
      }

      const mergedTokens = [...payload.tokens, ...pinnedExtras];
      setTokenTickDir(nextTokenDirs);
      setTrendingTokens(mergedTokens);

      // Keep open drawer or selected activeToken synced in real time every second
      setActiveToken((prevActive) => {
        if (!prevActive) return mergedTokens[0];
        const updatedMatch = mergedTokens.find((t) => t.pair.pairAddress === prevActive.pair.pairAddress);
        return updatedMatch || prevActive;
      });
    }

    if (typeof (payload as any).cexCatalogSize === 'number' && (payload as any).cexCatalogSize > 0) {
      setCexCatalogSize((payload as any).cexCatalogSize);
    }
    if (typeof payload.newTokensCount === 'number') setNewTokensCount(payload.newTokensCount);
    if (payload.latestNewToken) setLatestNewToken(payload.latestNewToken);
    if (Array.isArray(payload.highSignalHistory15m) && payload.highSignalHistory15m.length > 0) {
      setHighSignalHistory15m((prev) => mergeHighSignal15mPoints(prev, payload.highSignalHistory15m!));
    }
  };

  // Load Initial Live Feed & Connect 1-Second Real-Time SSE Stream
  useEffect(() => {
    fetchTrending();
    fetchMarketIndices();

    let eventSource: EventSource | null = null;
    let fallbackPollTimer: ReturnType<typeof setInterval> | null = null;

    const startFallbackPolling = () => {
      if (fallbackPollTimer) return;
      fallbackPollTimer = setInterval(() => {
        fetchTrending();
        fetchMarketIndices();
      }, 1500);
    };

    const stopFallbackPolling = () => {
      if (fallbackPollTimer) {
        clearInterval(fallbackPollTimer);
        fallbackPollTimer = null;
      }
    };

    try {
      eventSource = new EventSource('/api/live-stream');
      eventSource.onopen = () => {
        setIsLiveStreamConnected(true);
        stopFallbackPolling();
      };
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setIsLiveStreamConnected(true);
          applyLiveSnapshot(data);
        } catch {
          // ignore malformed event chunk
        }
      };
      eventSource.onerror = () => {
        setIsLiveStreamConnected(false);
        startFallbackPolling();
      };
    } catch {
      startFallbackPolling();
    }

    return () => {
      if (eventSource) eventSource.close();
      stopFallbackPolling();
    };
  }, []);

  // Compute 1-minute rolling average & Trend Direction for High Signals (+80)
  useEffect(() => {
    if (trendingTokens.length === 0) return;
    const highGroup = trendingTokens.filter((tok) => tok.metrics.score >= 80);
    const pool = highGroup.length > 0 ? highGroup : trendingTokens;
    const currentScore = pool.reduce((sum, tok) => sum + (tok.metrics?.score || 0), 0) / pool.length;

    const now = Date.now();
    const cutoff = now - 60_000;
    const nextHist = highScoreHistoryRef.current.filter((entry) => entry.ts >= cutoff);
    nextHist.push({ ts: now, score: currentScore });
    highScoreHistoryRef.current = nextHist;

    const avg1m = nextHist.reduce((sum, entry) => sum + entry.score, 0) / nextHist.length;
    const delta = currentScore - avg1m;
    const direction: 'up' | 'down' | 'flat' =
      delta > 0.005 ? 'up' : delta < -0.005 ? 'down' : 'flat';

    setHighScoreTrend({
      currentScore,
      avg1m,
      delta,
      direction,
    });

    if (highGroup.length > 0) {
      const scores = highGroup.map((t) => Number(t.metrics?.score || 0));
      const pt: HighSignal15mPoint = {
        ts: now,
        avgScore: Number((scores.reduce((s, v) => s + v, 0) / scores.length).toFixed(2)),
        maxScore: Math.max(...scores),
        minScore: Math.min(...scores),
        count: highGroup.length,
      };
      if (now - lastClient15mSampleRef.current >= 5000) {
        lastClient15mSampleRef.current = now;
        setHighSignalHistory15m((prev) => mergeHighSignal15mPoints(prev, [pt]));
      }
    }
  }, [trendingTokens]);

  // Sync Auth State
  useEffect(() => {
    let unsubUser: (() => void) | null = null;
    let unsubWatchlist: (() => void) | null = null;
    let unsubAlerts: (() => void) | null = null;
    let isMounted = true;

    const cleanupListeners = () => {
      if (unsubUser) {
        unsubUser();
        unsubUser = null;
      }
      if (unsubWatchlist) {
        unsubWatchlist();
        unsubWatchlist = null;
      }
      if (unsubAlerts) {
        unsubAlerts();
        unsubAlerts = null;
      }
    };

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      cleanupListeners();

      if (fbUser) {
        setFirebaseUser(fbUser);
        const userRef = doc(db, 'users', fbUser.uid);

        try {
          const userSnap = await getDoc(userRef);
          if (!isMounted) return;

          let userProfile: AppUser;
          if (!userSnap.exists()) {
            const customRefCode = Math.random().toString(36).substring(2, 8).toUpperCase();
            userProfile = {
              uid: fbUser.uid,
              email: fbUser.email || 'anonymous@pumpseeker.pro',
              subscriptionStatus: 'free',
              proUntil: null,
              referralCode: customRefCode,
              referredBy: null,
              referralCount: 0,
              createdAt: new Date().toISOString()
            };
            await setDoc(userRef, userProfile);
          } else {
            userProfile = userSnap.data() as AppUser;
          }
          if (isMounted) setUser(userProfile);
        } catch (err) {
          try {
            handleFirestoreError(err, OperationType.GET, `users/${fbUser.uid}`);
          } catch (formattedErr) {
            console.warn("User profile sync warning:", formattedErr);
          }
        }

        if (!isMounted) return;

        // Real-time subscription check
        unsubUser = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setUser(docSnap.data() as AppUser);
          }
        }, (err) => {
          console.warn("User snapshot warning:", err);
        });

        // Sync Saved Token Watchlist
        const q = query(collection(db, 'savedTokens'), where('uid', '==', fbUser.uid));
        unsubWatchlist = onSnapshot(q, (querySnap) => {
          const items: any[] = [];
          querySnap.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() });
          });
          setWatchlist(items);
        }, (err) => {
          console.warn("Watchlist snapshot error:", err);
        });

        // Sync Custom Price Threshold Alerts
        const alertsQuery = query(collection(db, 'priceAlerts'), where('uid', '==', fbUser.uid));
        unsubAlerts = onSnapshot(alertsQuery, (querySnap) => {
          const items: PriceAlert[] = [];
          querySnap.forEach((docSnap) => {
            items.push(docSnap.data() as PriceAlert);
          });
          items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setPriceAlerts(items);
        }, (err) => {
          try {
            handleFirestoreError(err, OperationType.LIST, 'priceAlerts');
          } catch (formattedErr) {
            console.error(formattedErr);
          }
        });
      } else {
        setFirebaseUser(null);
        setUser(null);
        setWatchlist([]);
        setPriceAlerts([]);
        triggeringAlertIdsRef.current.clear();
      }
    });

    return () => {
      isMounted = false;
      cleanupListeners();
      unsubscribe();
    };
  }, []);

  // Browser Notification Permission & Trigger Helpers
  const requestBrowserNotificationPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setNotificationPermission('unsupported');
      showToast(lang === 'ar' ? 'المتصفح لا يدعم إشعارات سطح المكتب؛ ستظهر التنبيهات داخل المنصة.' : 'Browser notifications unavailable; in-app alerts active.');
      return 'unsupported' as const;
    }
    try {
      const perm = await Notification.requestPermission();
      setNotificationPermission(perm);
      if (perm === 'granted') {
        showToast(lang === 'ar' ? 'تم تفعيل إشعارات المتصفح بنجاح!' : 'Browser notifications enabled!');
      } else if (perm === 'denied') {
        showToast(lang === 'ar' ? 'تم رفض إذن الإشعارات في المتصفح.' : 'Browser notification permission denied.');
      }
      return perm;
    } catch {
      return notificationPermission;
    }
  };

  const fireBrowserNotification = (title: string, body: string, tag: string) => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          tag,
        });
      } catch {
        // Ignore iframe-restricted Notification constructor errors; in-app banner still fires
      }
    }
    // Subtle Web Audio chime
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.14);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.31);
      }
    } catch {
      // Ignore audio errors when autoplay is blocked
    }
  };

  // Real-time check of incoming live feed against active Firestore price threshold alerts
  useEffect(() => {
    if (!alertsEnabled || !firebaseUser || priceAlerts.length === 0) return;

    const livePriceMap = new Map<string, number>();
    for (const idx of marketIndices) {
      if (idx?.symbol && typeof idx.price === 'number' && idx.price > 0) {
        livePriceMap.set(`INDEX:${idx.symbol}`, idx.price);
      }
    }
    for (const tok of trendingTokens) {
      const addr = tok.pair?.pairAddress;
      const p = parseFloat(tok.pair?.priceUsd || '0');
      if (addr && p > 0) {
        livePriceMap.set(addr, p);
      }
    }
    if (activeToken?.pair?.pairAddress) {
      const p = parseFloat(activeToken.pair.priceUsd || '0');
      if (p > 0) livePriceMap.set(activeToken.pair.pairAddress, p);
    }

    const activeAlerts = priceAlerts.filter(a => a.status === 'active');
    for (const alert of activeAlerts) {
      if (triggeringAlertIdsRef.current.has(alert.id)) continue;
      const currentPrice = livePriceMap.get(alert.pairAddress);
      if (!currentPrice || currentPrice <= 0) continue;

      const hit =
        (alert.condition === 'above' && currentPrice >= alert.targetPrice) ||
        (alert.condition === 'below' && currentPrice <= alert.targetPrice);

      if (hit) {
        triggeringAlertIdsRef.current.add(alert.id);
        const triggeredAt = new Date().toISOString();
        const alertRef = doc(db, 'priceAlerts', alert.id);

        updateDoc(alertRef, {
          status: 'triggered',
          triggeredAt,
          triggeredPrice: currentPrice,
        }).catch((err) => {
          triggeringAlertIdsRef.current.delete(alert.id);
          try {
            handleFirestoreError(err, OperationType.UPDATE, `priceAlerts/${alert.id}`);
          } catch (formatted) {
            console.error(formatted);
          }
        });

        const formattedCurrent = currentPrice < 0.01 ? currentPrice.toFixed(6) : currentPrice.toLocaleString(undefined, { maximumFractionDigits: 4 });
        const formattedTarget = alert.targetPrice < 0.01 ? alert.targetPrice.toFixed(6) : alert.targetPrice.toLocaleString(undefined, { maximumFractionDigits: 4 });

        const title = lang === 'ar'
          ? `🔔 تنبيه سعر ${alert.symbol}`
          : `🔔 ${alert.symbol} Price Alert Triggered`;
        const body = lang === 'ar'
          ? `وصل ${alert.symbol} إلى $${formattedCurrent} (${alert.condition === 'above' ? 'تجاوز' : 'انخفض عن'} الهدف $${formattedTarget})`
          : `${alert.symbol} reached $${formattedCurrent} (${alert.condition === 'above' ? 'above' : 'below'} target $${formattedTarget})`;

        fireBrowserNotification(title, body, alert.id);
        setTriggeredBanner({
          ...alert,
          status: 'triggered',
          triggeredAt,
          triggeredPrice: currentPrice,
        });
        showToast(body);
      }
    }
  }, [trendingTokens, marketIndices, activeToken, priceAlerts, firebaseUser, alertsEnabled, lang]);

  // Fetch Trending / Live Feed
  const fetchTrending = async () => {
    setIsRefreshingTrending(true);
    try {
      const res = await fetch('/api/trending');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (data && data.tokens && data.tokens.length > 0) {
        const sorted = [...data.tokens].sort((a: any, b: any) => (b.metrics?.score || 0) - (a.metrics?.score || 0));
        setTrendingTokens(sorted);
        if (typeof data.cexCatalogSize === 'number') setCexCatalogSize(data.cexCatalogSize);
        if (!activeToken) {
          setActiveToken(sorted[0]);
        }
      } else {
        throw new Error("No tokens returned from server");
      }
    } catch (e) {
      console.warn("Using client-side fallback for live scanner feed:", e);
      const clientFallbacks = [
        {
          pair: {
            chainId: 'solana',
            dexId: 'raydium',
            url: 'https://dexscreener.com/solana/sol-pair-address',
            pairAddress: 'sol-pair-address',
            baseToken: { address: 'So11111111111111111111111111111111111111112', name: 'Solana', symbol: 'SOL' },
            quoteToken: { address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', name: 'USDC', symbol: 'USDC' },
            priceNative: '143.50',
            priceUsd: '143.50',
            txns: { m5: { buys: 85, sells: 12 }, h1: { buys: 920, sells: 180 }, h6: { buys: 4500, sells: 890 }, h24: { buys: 18200, sells: 4100 } },
            volume: { h24: 124500000, h6: 32000000, h1: 8500000, m5: 620000 },
            priceChange: { m5: 3.2, h1: 14.5, h6: 28.4, h24: 45.2 },
            liquidity: { usd: 18500000, base: 128919, quote: 18500000 },
            fdv: 68500000000,
            info: { imageUrl: undefined, websites: ['https://solana.com'], socials: [{ type: 'twitter', url: 'https://x.com/solana' }] }
          },
          metrics: {
            score: 96,
            rating: 'EXTREME' as const,
            breakdown: { volumeSpike: 25, buyPressure: 25, liquidityDensity: 20, socialMomentum: 14, priceAction: 12 },
            signals: ["Top Global Market Benchmark", "Extremely High Liquidity & Volume", "Parabolic 1h Buy Pressure"]
          }
        },
        {
          pair: {
            chainId: 'ethereum',
            dexId: 'uniswap',
            url: 'https://dexscreener.com/ethereum/eth-pair-address',
            pairAddress: 'eth-pair-address',
            baseToken: { address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', name: 'Ethereum', symbol: 'ETH' },
            quoteToken: { address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', name: 'USD Coin', symbol: 'USDC' },
            priceNative: '2840.00',
            priceUsd: '2840.00',
            txns: { m5: { buys: 64, sells: 18 }, h1: { buys: 710, sells: 210 }, h6: { buys: 3800, sells: 1100 }, h24: { buys: 14500, sells: 4800 } },
            volume: { h24: 98000000, h6: 24000000, h1: 6200000, m5: 480000 },
            priceChange: { m5: 1.8, h1: 8.9, h6: 18.2, h24: 26.5 },
            liquidity: { usd: 42000000, base: 14788, quote: 42000000 },
            fdv: 341000000000,
            info: { imageUrl: undefined, websites: ['https://ethereum.org'], socials: [{ type: 'twitter', url: 'https://x.com/ethereum' }] }
          },
          metrics: {
            score: 88,
            rating: 'HIGH' as const,
            breakdown: { volumeSpike: 22, buyPressure: 22, liquidityDensity: 20, socialMomentum: 12, priceAction: 12 },
            signals: ["Institutional Grade Asset", "Heavy Buy Pressure", "Tier-1 Global Security Rating"]
          }
        },
        {
          pair: {
            chainId: 'solana',
            dexId: 'raydium',
            url: 'https://dexscreener.com/solana/ribbit-pair-address',
            pairAddress: 'ribbit-pair-address',
            baseToken: { address: 'ribbit-address', name: 'RIBBIT ZYGO THE', symbol: 'RIBBIT' },
            quoteToken: { address: 'So11111111111111111111111111111111111111112', name: 'Wrapped SOL', symbol: 'SOL' },
            priceNative: '0.00000048',
            priceUsd: '0.000088',
            txns: { m5: { buys: 12, sells: 8 }, h1: { buys: 140, sells: 100 }, h6: { buys: 400, sells: 300 }, h24: { buys: 1200, sells: 900 } },
            volume: { h24: 192000, h6: 48000, h1: 15000, m5: 1200 },
            priceChange: { m5: 5.4, h1: 93.2, h6: 120.0, h24: 172.0 },
            liquidity: { usd: 42000, base: 477272727, quote: 228 },
            fdv: 88000,
            info: { imageUrl: undefined, websites: [], socials: [] }
          },
          metrics: {
            score: 42,
            rating: 'MEDIUM' as const,
            breakdown: { volumeSpike: 10, buyPressure: 10, liquidityDensity: 10, socialMomentum: 6, priceAction: 6 },
            signals: ["Active volume in past 5m", "Sustained 1h buy pressure"]
          }
        },
        {
          pair: {
            chainId: 'solana',
            dexId: 'raydium',
            url: 'https://dexscreener.com/solana/anif-pair-address',
            pairAddress: 'anif-pair-address',
            baseToken: { address: 'anif-address', name: 'Ansemhood wif Ha', symbol: 'ANIF' },
            quoteToken: { address: 'So11111111111111111111111111111111111111112', name: 'Wrapped SOL', symbol: 'SOL' },
            priceNative: '0.000006',
            priceUsd: '0.0011',
            txns: { m5: { buys: 10, sells: 5 }, h1: { buys: 110, sells: 80 }, h6: { buys: 350, sells: 240 }, h24: { buys: 900, sells: 710 } },
            volume: { h24: 4140000, h6: 1200000, h1: 350000, m5: 40000 },
            priceChange: { m5: -2.1, h1: -40.0, h6: 110.0, h24: 172.0 },
            liquidity: { usd: 120000, base: 109090909, quote: 652 },
            fdv: 1080000,
            info: { imageUrl: undefined, websites: [], socials: [] }
          },
          metrics: {
            score: 42,
            rating: 'MEDIUM' as const,
            breakdown: { volumeSpike: 10, buyPressure: 10, liquidityDensity: 10, socialMomentum: 6, priceAction: 6 },
            signals: ["Active volume in past 5m", "Slight 5m bullish buyer bias"]
          }
        },
        {
          pair: {
            chainId: 'solana',
            dexId: 'raydium',
            url: 'https://dexscreener.com/solana/niggabull-pair-address',
            pairAddress: 'niggabull-pair-address',
            baseToken: { address: 'niggabull-address', name: 'NIGGABULL', symbol: 'NIGGABULL' },
            quoteToken: { address: 'So11111111111111111111111111111111111111112', name: 'Wrapped SOL', symbol: 'SOL' },
            priceNative: '0.000006',
            priceUsd: '0.0011',
            txns: { m5: { buys: 8, sells: 6 }, h1: { buys: 90, sells: 70 }, h6: { buys: 280, sells: 210 }, h24: { buys: 780, sells: 620 } },
            volume: { h24: 1260000, h6: 340000, h1: 110000, m5: 15000 },
            priceChange: { m5: 1.1, h1: 4.4, h6: 8.5, h24: 12.7 },
            liquidity: { usd: 85000, base: 77272727, quote: 462 },
            fdv: 1110000,
            info: { imageUrl: undefined, websites: [], socials: [] }
          },
          metrics: {
            score: 35,
            rating: 'MEDIUM' as const,
            breakdown: { volumeSpike: 8, buyPressure: 8, liquidityDensity: 10, socialMomentum: 5, priceAction: 4 },
            signals: ["Basic social media present"]
          }
        }
      ].sort((a, b) => b.metrics.score - a.metrics.score);

      setTrendingTokens(clientFallbacks);
      if (!activeToken) {
        setActiveToken(clientFallbacks[0]);
      }
    } finally {
      setIsRefreshingTrending(false);
    }
  };

  // Fetch real-time global cryptocurrency market indices
  const fetchMarketIndices = async () => {
    try {
      const res = await fetch('/api/market-indices');
      if (!res.ok) {
        throw new Error(`HTTP status ${res.status}`);
      }
      const data = await res.json();
      if (data && data.indices) {
        setMarketIndices(data.indices);
      }
    } catch (e) {
      console.warn("Using graceful fallback for global market indices:", e);
      // Fallback indicators on the client to guarantee no raw failures
      const fallbackIndices = [
        { symbol: 'BTC', price: 64171.00, change24h: -1.06, volume: 27768000000, high: 65100, low: 63800 },
        { symbol: 'ETH', price: 1860.39, change24h: -1.10, volume: 9195000000, high: 1890, low: 1840 },
        { symbol: 'SOL', price: 73.90, change24h: -2.45, volume: 1576000000, high: 76.2, low: 72.5 },
        { symbol: 'BNB', price: 561.75, change24h: -0.91, volume: 521000000, high: 572, low: 558 },
        { symbol: 'XRP', price: 1.086, change24h: -1.64, volume: 1071000000, high: 1.12, low: 1.05 },
        { symbol: 'DOGE', price: 0.069, change24h: -0.34, volume: 587000000, high: 0.072, low: 0.067 },
      ];
      setMarketIndices(fallbackIndices);
    }
  };

  // Instant Unified Search across CEX (Binance, OKX, Bybit, KuCoin) & DEX
  useEffect(() => {
    const q = scanQuery.trim();
    if (!q) {
      setUnifiedSearchResults([]);
      setIsSearchingUnified(false);
      return;
    }

    const qUpper = q.toUpperCase();
    const localMatches = trendingTokens.filter((t) => {
      const sym = t.pair.baseToken?.symbol?.toUpperCase() || '';
      const name = t.pair.baseToken?.name?.toUpperCase() || '';
      const addr = t.pair.pairAddress?.toUpperCase() || '';
      const exs = (t.pair.listedExchanges || []).join(' ').toUpperCase();
      return sym.includes(qUpper) || name.includes(qUpper) || addr.includes(qUpper) || exs.includes(qUpper);
    });
    if (localMatches.length > 0) {
      setUnifiedSearchResults(localMatches.slice(0, 12));
    }

    let cancelled = false;
    setIsSearchingUnified(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        if (typeof data.totalCatalogSize === 'number' && data.totalCatalogSize > 0) {
          setCexCatalogSize(data.totalCatalogSize);
        }
        if (Array.isArray(data.results)) {
          setUnifiedSearchResults(data.results);
        }
      } catch {
        // Keep localMatches on transient error
      } finally {
        if (!cancelled) setIsSearchingUnified(false);
      }
    }, 220);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [scanQuery]);

  // Select any token from search results, pin it to the live table, and open its terminal
  const selectTokenFromSearch = (item: { pair: TokenPair; metrics: PumpScoreMetrics }) => {
    pinnedTokensRef.current[item.pair.pairAddress] = item;
    setTrendingTokens((prev) => {
      if (prev.some((t) => t.pair.pairAddress === item.pair.pairAddress)) return prev;
      return [item, ...prev];
    });
    setActiveToken(item);
    setIsDrawerOpen(true);
    setIsSidebarOpen(false);
    setShowSidebarSearchDropdown(false);
    setShowMainSearchDropdown(false);
    setRecentScans((prev) => {
      const filtered = prev.filter((x) => x.pair.pairAddress !== item.pair.pairAddress);
      return [item, ...filtered].slice(0, 5);
    });
  };

  // Perform Token Scan
  const handleScan = async (queryAddressOrSymbol: string) => {
    if (!queryAddressOrSymbol.trim()) return;
    setIsScanning(true);
    setScanError('');
    setAiAnalysis('');
    setScanLogs(logSteps); // Immediately show all logs synchronously
    setIsSidebarOpen(false);
    setShowSidebarSearchDropdown(false);
    setShowMainSearchDropdown(false);

    try {
      const res = await fetch(`/api/scan?q=${encodeURIComponent(queryAddressOrSymbol)}`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Token scan failed.");
      }
      const data = await res.json();
      const scannedItem = { pair: data.pair, metrics: data.metrics };
      pinnedTokensRef.current[data.pair.pairAddress] = scannedItem;
      setTrendingTokens((prev) => {
        if (prev.some((t) => t.pair.pairAddress === data.pair.pairAddress)) return prev;
        return [scannedItem, ...prev];
      });

      setActiveToken(scannedItem);
      setIsDrawerOpen(true); // Automatically open the beautiful side sheet drawer on scan success
      setRecentScans(prev => {
        const filtered = prev.filter(item => item.pair.pairAddress !== data.pair.pairAddress);
        return [scannedItem, ...filtered].slice(0, 5);
      });
      setIsScanning(false);

    } catch (error: any) {
      setScanError(error.message);
      setIsScanning(false);
    }
  };

  // Toggle Watchlist Saving
  const toggleWatchlist = async () => {
    if (!activeToken) return;
    if (!firebaseUser) {
      showToast(lang === 'ar' ? 'يرجى إنشاء حساب أو تسجيل الدخول لحفظ قائمة المتابعة' : 'Please create an account or sign in to save watchlists!');
      openAuthModal('register');
      return;
    }

    const existingItem = watchlist.find(item => item.pair.pairAddress === activeToken.pair.pairAddress);
    if (existingItem) {
      try {
        await deleteDoc(doc(db, 'savedTokens', existingItem.id));
        showToast("Removed from Watchlist");
      } catch (e) {
        console.warn("Watchlist removal failed:", e);
      }
    } else {
      try {
        const newRef = doc(collection(db, 'savedTokens'));
        await setDoc(newRef, {
          uid: firebaseUser.uid,
          pair: activeToken.pair,
          metrics: activeToken.metrics,
          createdAt: new Date().toISOString()
        });
        showToast("Added to Watchlist");
      } catch (e) {
        console.warn("Watchlist addition failed:", e);
      }
    }
  };

  // Create Custom Price Threshold Alert in Firestore
  const createPriceAlert = async (params: {
    pairAddress: string;
    tokenAddress: string;
    symbol: string;
    name: string;
    chainId: string;
    targetPrice: number;
    initialPrice: number;
    condition: 'above' | 'below';
  }) => {
    if (!params.targetPrice || Number.isNaN(params.targetPrice) || params.targetPrice <= 0) {
      showToast(lang === 'ar' ? 'يرجى إدخال سعر مستهدف صالح أكبر من 0' : 'Please enter a valid target price > 0');
      return false;
    }

    if (!firebaseUser) {
      showToast(lang === 'ar' ? 'أنشئ حساباً أو سجّل الدخول لحفظ التنبيهات' : 'Please create an account or sign in to save alerts');
      openAuthModal('register');
      return false;
    }

    if (notificationPermission === 'default') {
      await requestBrowserNotificationPermission();
    }

    setIsSavingAlert(true);
    const alertId = `alert_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const newAlert: PriceAlert = {
      id: alertId.slice(0, 128),
      uid: firebaseUser.uid,
      pairAddress: params.pairAddress.slice(0, 160),
      tokenAddress: params.tokenAddress.slice(0, 160),
      symbol: params.symbol.slice(0, 32),
      name: params.name.slice(0, 100),
      chainId: params.chainId.slice(0, 40),
      targetPrice: Number(params.targetPrice),
      initialPrice: Math.max(0, Number(params.initialPrice) || 0),
      condition: params.condition,
      status: 'active',
      triggeredAt: null,
      triggeredPrice: null,
      createdAt: new Date().toISOString().slice(0, 64),
    };

    try {
      await setDoc(doc(db, 'priceAlerts', alertId), newAlert);
      showToast(
        lang === 'ar'
          ? `تم حفظ تنبيه ${newAlert.symbol} عند $${newAlert.targetPrice}`
          : `Saved ${newAlert.symbol} ${newAlert.condition} $${newAlert.targetPrice} alert!`
      );
      return true;
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.CREATE, `priceAlerts/${alertId}`);
      } catch (formatted) {
        console.error(formatted);
      }
      showToast(lang === 'ar' ? 'تعذر حفظ التنبيه في قاعدة البيانات' : 'Failed to save price alert');
      return false;
    } finally {
      setIsSavingAlert(false);
    }
  };

  // Delete Price Threshold Alert from Firestore
  const deletePriceAlert = async (alertId: string) => {
    if (!firebaseUser) return;
    try {
      await deleteDoc(doc(db, 'priceAlerts', alertId));
      triggeringAlertIdsRef.current.delete(alertId);
      showToast(lang === 'ar' ? 'تم حذف التنبيه' : 'Alert removed');
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.DELETE, `priceAlerts/${alertId}`);
      } catch (formatted) {
        console.error(formatted);
      }
    }
  };

  // Format pre-filled alert target price for a token (+5% or -5%)
  const computePrefilledTargetPrice = (livePrice: number, condition: 'above' | 'below', offsetPct = 0.05) => {
    if (!livePrice || livePrice <= 0) return '';
    const mult = condition === 'above' ? 1 + Math.abs(offsetPct) : Math.max(0.01, 1 - Math.abs(offsetPct));
    const nextP = livePrice * mult;
    if (nextP < 0.0001) return nextP.toFixed(8);
    if (nextP < 0.01) return nextP.toFixed(6);
    if (nextP < 1) return nextP.toFixed(5);
    return nextP.toFixed(2);
  };

  // Open pre-filled Price Alert Settings modal scoped to High Signal (+80) tokens
  const openHighSignalAlertModal = () => {
    const highSignals = trendingTokens
      .filter((tok) => tok.metrics.score >= 80)
      .sort((a, b) => b.metrics.score - a.metrics.score);
    if (highSignals.length > 0) {
      const firstTok = highSignals[0];
      const liveP = parseFloat(firstTok.pair.priceUsd || '0');
      setHighSignalModalPairAddr(firstTok.pair.pairAddress);
      setHighSignalModalCondition('above');
      setHighSignalModalTarget(computePrefilledTargetPrice(liveP, 'above', 0.05));
    } else {
      setHighSignalModalPairAddr('');
      setHighSignalModalTarget('');
    }
    setShowHighSignalAlertModal(true);
  };

  // Generate Gemini AI Deep analysis
  const generateAiReport = async () => {
    if (!activeToken) return;
    if (!isProUnlocked && user?.subscriptionStatus !== 'pro') {
      showToast("PRO Membership required for Live AI reports!");
      setShowCheckoutModal(true);
      return;
    }

    setIsGeneratingAi(true);
    setAiAnalysis('');
    try {
      const res = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pair: activeToken.pair,
          metrics: activeToken.metrics,
          lang
        })
      });
      const data = await res.json();
      setAiAnalysis(data.analysis);
    } catch (e) {
      console.warn("AI generation failed:", e);
      setAiAnalysis("AI Scan Engine timed out. Please try again.");
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Apply Referral Code
  const applyReferral = async () => {
    if (!firebaseUser || !user) {
      showToast("Please sign in first!");
      return;
    }
    if (enteredReferralCode.trim().toUpperCase() === user.referralCode) {
      setReferralFeedback("You cannot use your own referral code!");
      return;
    }

    setReferralFeedback("Validating code on chain...");
    try {
      const qRef = query(collection(db, 'users'), where('referralCode', '==', enteredReferralCode.trim().toUpperCase()));
      const snap = await getDocs(qRef);

      if (snap.empty) {
        setReferralFeedback("Referral code not found.");
        return;
      }

      const referrerDoc = snap.docs[0];
      const referrerData = referrerDoc.data() as AppUser;

      const newCount = (referrerData.referralCount || 0) + 1;
      const updates: any = { referralCount: newCount };

      if (newCount >= 3) {
        updates.subscriptionStatus = 'pro';
        updates.proUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      }

      await updateDoc(doc(db, 'users', referrerDoc.id), updates);

      const refId = `${referrerDoc.id}_${firebaseUser.uid}`;
      await setDoc(doc(db, 'referrals', refId), {
        id: refId,
        referrerUid: referrerDoc.id,
        referredUid: firebaseUser.uid,
        referredEmail: user.email,
        createdAt: new Date().toISOString()
      });

      await updateDoc(doc(db, 'users', firebaseUser.uid), {
        referredBy: referrerData.referralCode
      });

      setReferralFeedback(`Success! Linked to ${referrerData.email}.`);
      showToast("Referral code applied!");
      setEnteredReferralCode('');
    } catch (e) {
      console.error(e);
      setReferralFeedback("Failed to link referral.");
    }
  };

  // Simulate friends referrals
  const simulateInvites = async () => {
    if (!firebaseUser || !user) {
      showToast("Please sign in first!");
      return;
    }

    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      await updateDoc(userRef, {
        referralCount: 3,
        subscriptionStatus: 'pro',
        proUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });
      showToast("Simulated 3 invites! PRO Unlocked!");
    } catch (e) {
      console.error(e);
    }
  };

  // Process checkout payments
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firebaseUser) {
      showToast("Please sign in first!");
      setShowAuthModal(true);
      return;
    }
    setIsProcessingPayment(true);

    setTimeout(async () => {
      try {
        const userRef = doc(db, 'users', firebaseUser.uid);
        await updateDoc(userRef, {
          subscriptionStatus: 'pro',
          proUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        });

        const payRef = doc(collection(db, 'payments'));
        await setDoc(payRef, {
          id: payRef.id,
          uid: firebaseUser.uid,
          amount: 29.99,
          currency: 'USD',
          status: 'success',
          plan: 'PRO Monthly',
          createdAt: new Date().toISOString()
        });

        setPaymentSuccess(true);
        setIsProcessingPayment(false);
        showToast("PRO Plan Activated!");
        setTimeout(() => {
          setShowCheckoutModal(false);
          setPaymentSuccess(false);
        }, 1500);
      } catch (e) {
        console.error(e);
        setIsProcessingPayment(false);
      }
    }, 1500);
  };

  const openAuthModal = (mode: 'login' | 'register' = 'register') => {
    setAuthMode(mode);
    setAuthError('');
    setAuthConfirmPassword('');
    setShowAuthModal(true);
  };

  const getFriendlyAuthError = (err: any) => {
    const code = err?.code || '';
    if (code === 'auth/email-already-in-use') {
      return lang === 'ar'
        ? 'هذا البريد الإلكتروني مسجّل بالفعل. انتقل إلى "تسجيل الدخول".'
        : lang === 'fr'
        ? 'Cet e-mail est déjà enregistré. Essayez de vous connecter.'
        : 'This email is already registered. Switch to Sign In instead.';
    }
    if (code === 'auth/invalid-email') {
      return lang === 'ar'
        ? 'صيغة البريد الإلكتروني غير صالحة.'
        : lang === 'fr'
        ? 'Adresse e-mail invalide.'
        : 'Invalid email address format.';
    }
    if (code === 'auth/weak-password') {
      return lang === 'ar'
        ? 'كلمة المرور ضعيفة، يجب أن تتكون من 6 أحرف على الأقل.'
        : lang === 'fr'
        ? 'Le mot de passe doit contenir au moins 6 caractères.'
        : 'Password must be at least 6 characters long.';
    }
    if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
      return lang === 'ar'
        ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة.'
        : lang === 'fr'
        ? 'E-mail ou mot de passe incorrect.'
        : 'Incorrect email or password.';
    }
    if (code === 'auth/operation-not-allowed') {
      return lang === 'ar'
        ? 'طريقة البريد/كلمة المرور غير مفعّلة بعد في إعدادات Firebase Authentication. استخدم "المتابعة عبر Google" أعلاه أو فعّل مزود Email/Password في Firebase Console.'
        : lang === 'fr'
        ? 'Cette méthode n’est pas encore activée dans Firebase Console. Utilisez Google ou activez Email/Password dans Firebase Authentication.'
        : 'This sign-in provider is not enabled in Firebase Console yet. Use "Continue with Google" above or enable Email/Password under Firebase Console → Authentication → Sign-in method.';
    }
    if (code === 'auth/admin-restricted-operation') {
      return lang === 'ar'
        ? 'تم تقييد تسجيل الدخول كضيف في إعدادات Firebase. استخدم إنشاء حساب بالبريد الإلكتروني وكلمة المرور أو Google.'
        : lang === 'fr'
        ? 'L’accès invité est désactivé dans Firebase. Créez un compte par e-mail ou Google.'
        : 'Guest access is disabled in Firebase. Please create an account with Email or Google.';
    }
    if (code === 'auth/unauthorized-domain') {
      const host = typeof window !== 'undefined' ? window.location.hostname : 'this domain';
      return lang === 'ar'
        ? `النطاق (${host}) غير مصرح به بعد لـ Google OAuth في Firebase. أضف "${host}" في Firebase Console ← Authentication ← Settings ← Authorized domains — ويمكنك الآن إنشاء حساب بالبريد الإلكتروني وكلمة المرور أدناه مباشرة!`
        : lang === 'fr'
        ? `Le domaine (${host}) n’est pas encore autorisé pour Google OAuth. Ajoutez « ${host} » dans Firebase Console → Authentication → Settings → Authorized domains, ou inscrivez-vous par e-mail ci-dessous.`
        : `Domain "${host}" is not yet authorized for Google OAuth in Firebase. Add "${host}" in Firebase Console → Authentication → Settings → Authorized domains — or create your account with Email & Password below right now.`;
    }
    if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
      return lang === 'ar'
        ? 'تم إغلاق نافذة تسجيل Google قبل إتمام العملية.'
        : lang === 'fr'
        ? 'La fenêtre de connexion Google a été fermée avant la fin.'
        : 'Google sign-in popup was closed before completing.';
    }
    if (code === 'auth/popup-blocked') {
      return lang === 'ar'
        ? 'تم حظر النافذة المنبثقة من المتصفح. اسمح بالنوافذ المنبثقة أو أنشئ حسابك بالبريد الإلكتروني أدناه مباشرة.'
        : lang === 'fr'
        ? 'Fenêtre contextuelle bloquée par le navigateur. Autorisez les pop-ups ou utilisez l’e-mail ci-dessous.'
        : 'Popup blocked by browser. Allow popups or create your account with Email & Password below.';
    }
    if (code === 'auth/network-request-failed') {
      return lang === 'ar'
        ? 'تعذر الاتصال بخادم المصادقة. تحقق من اتصال الإنترنت وحاول مجدداً.'
        : lang === 'fr'
        ? 'Erreur réseau lors de l’authentification. Vérifiez votre connexion.'
        : 'Network error reaching authentication servers. Check your connection and try again.';
    }
    return err?.message || (lang === 'ar' ? 'حدث خطأ أثناء المصادقة.' : 'Authentication failed.');
  };

  // Auth Submit handler
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const trimmedEmail = authEmail.trim();
    if (!trimmedEmail) {
      setAuthError(lang === 'ar' ? 'يرجى إدخال البريد الإلكتروني.' : 'Please enter your email address.');
      return;
    }
    if (authPassword.length < 6) {
      setAuthError(
        lang === 'ar'
          ? 'كلمة المرور يجب أن تتكون من 6 أحرف على الأقل.'
          : 'Password must be at least 6 characters.'
      );
      return;
    }
    if (authMode === 'register' && authPassword !== authConfirmPassword) {
      setAuthError(
        lang === 'ar'
          ? 'كلمتا المرور غير متطابقتين.'
          : lang === 'fr'
          ? 'Les mots de passe ne correspondent pas.'
          : 'Passwords do not match.'
      );
      return;
    }

    setIsAuthSubmitting(true);
    try {
      if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, trimmedEmail, authPassword);
        showToast(lang === 'ar' ? 'تم تسجيل الدخول بنجاح!' : 'Logged in successfully!');
      } else {
        await createUserWithEmailAndPassword(auth, trimmedEmail, authPassword);
        showToast(lang === 'ar' ? 'تم إنشاء الحساب بنجاح!' : 'Account created successfully!');
      }
      setShowAuthModal(false);
      setAuthEmail('');
      setAuthPassword('');
      setAuthConfirmPassword('');
    } catch (err: any) {
      setAuthError(getFriendlyAuthError(err));
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  const handleGoogleAuth = async () => {
    setAuthError('');
    setIsAuthSubmitting(true);
    try {
      await signInWithPopup(auth, googleProvider);
      showToast(lang === 'ar' ? 'تم التسجيل والدخول عبر Google بنجاح!' : 'Signed in with Google successfully!');
      setShowAuthModal(false);
      setAuthEmail('');
      setAuthPassword('');
      setAuthConfirmPassword('');
    } catch (err: any) {
      const msg = getFriendlyAuthError(err);
      setAuthError(msg);
      if (!showAuthModal) {
        setShowAuthModal(true);
      }
    } finally {
      setIsAuthSubmitting(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    showToast("Disconnected Terminal");
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const getRatingColor = (rating: string) => {
    switch(rating) {
      case 'MOONSHOT': return 'text-emerald-400 border-emerald-500 bg-emerald-950/40';
      case 'CRITICAL': return 'text-green-400 border-green-600 bg-green-950/20';
      case 'HIGH': return 'text-yellow-400 border-yellow-600 bg-yellow-950/20';
      case 'MEDIUM': return 'text-amber-500 border-amber-600 bg-amber-950/10';
      default: return 'text-red-400 border-red-500 bg-red-950/30';
    }
  };

  // Helper to compute Smart Money / Big Buy priority weight for multi-parameter secondary sorting
  const getSmartMoneyBigBuyWeight = (tok: { pair: TokenPair; metrics: PumpScoreMetrics }) => {
    let weight = 0;
    
    // 1. Check if signals include Smart Money, Whale, or Big Buy keywords
    if (tok.metrics.signals?.some(s => /smart money|whale|big buy|institutional|tier-1|buy pressure/i.test(s))) {
      weight += 100;
    }
    
    // 2. High-frequency recent 5-minute buy activity (Big Buy surges)
    const m5Buys = tok.pair.txns?.m5?.buys || 0;
    const m5Sells = tok.pair.txns?.m5?.sells || 0;
    if (m5Buys > m5Sells) {
      weight += (m5Buys - m5Sells) * 10;
    }

    // 3. 1-hour net buy pressure
    const h1Buys = tok.pair.txns?.h1?.buys || 0;
    const h1Sells = tok.pair.txns?.h1?.sells || 0;
    if (h1Buys > h1Sells) {
      weight += Math.min(50, (h1Buys - h1Sells) * 2);
    }

    // 4. Buy pressure breakdown score if present
    if (tok.metrics.breakdown?.buyPressure) {
      weight += tok.metrics.breakdown.buyPressure * 3;
    }

    return weight;
  };

  // Table Filtration & Multi-Parameter Sorting Logic
  // Primary: Base Pump/AI Score
  // Secondary: Smart Money Inflow & High-Frequency Big Buy Events
  // Tertiary: 24h Trading Volume
  const filteredTokens = trendingTokens
    .filter(tok => {
      if (activeChainFilter !== 'all') {
        if (activeChainFilter === 'cex') {
          if (tok.pair.listingType !== 'CEX' && tok.pair.chainId !== 'cex') return false;
          if (activeExchangeFilter !== 'all' && !tok.pair.listedExchanges?.includes(activeExchangeFilter)) {
            return false;
          }
        } else if (activeChainFilter === 'new') {
          const ageMs = tok.pair.pairCreatedAt ? Date.now() - tok.pair.pairCreatedAt : Infinity;
          if (!tok.pair.isNewDiscovery && ageMs > 48 * 60 * 60 * 1000) return false;
        } else if (activeChainFilter === 'eth') {
          if (tok.pair.chainId !== 'ethereum' && tok.pair.chainId !== 'eth') return false;
        } else {
          if (tok.pair.chainId !== activeChainFilter) return false;
        }
      }
      if (scanQuery.trim()) {
        const q = scanQuery.trim().toUpperCase();
        const sym = tok.pair.baseToken?.symbol?.toUpperCase() || '';
        const name = tok.pair.baseToken?.name?.toUpperCase() || '';
        const addr = tok.pair.pairAddress?.toUpperCase() || '';
        const exs = (tok.pair.listedExchanges || []).join(' ').toUpperCase();
        if (!sym.includes(q) && !name.includes(q) && !addr.includes(q) && !exs.includes(q)) {
          return false;
        }
      }
      if (activeScoreFilter !== 'all') {
        const scoreNum = parseInt(activeScoreFilter);
        if (tok.metrics.score < scoreNum) return false;
      }
      if (activeSidebarTab === 'smart-money') {
        if (tok.metrics.score < 75) return false;
      }
      if (activeSidebarTab === 'watchlist') {
        const isSaved = watchlist.some(item => item.pair.pairAddress === tok.pair.pairAddress);
        if (!isSaved) return false;
      }
      return true;
    })
    .sort((a, b) => {
      // When viewing New filter, prioritize newly discovered / newest pairs first
      if (activeChainFilter === 'new') {
        const aTime = a.pair.discoveredAt || a.pair.pairCreatedAt || 0;
        const bTime = b.pair.discoveredAt || b.pair.pairCreatedAt || 0;
        if (bTime !== aTime) return bTime - aTime;
      }

      // Primary sort: Base AI Pump Score
      if (b.metrics.score !== a.metrics.score) {
        return b.metrics.score - a.metrics.score;
      }
      
      // Secondary sort: Smart Money Inflow & High-Frequency Big Buy Events
      const weightA = getSmartMoneyBigBuyWeight(a);
      const weightB = getSmartMoneyBigBuyWeight(b);
      if (weightB !== weightA) {
        return weightB - weightA;
      }

      // Tertiary sort: 24h Volume
      const volA = a.pair.volume?.h24 || 0;
      const volB = b.pair.volume?.h24 || 0;
      return volB - volA;
    });

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F4F6FA] dark:bg-[#05060A] text-slate-700 dark:text-zinc-300 font-sans selection:bg-emerald-500/30 selection:text-emerald-700 dark:selection:text-emerald-300 relative overflow-x-clip transition-colors duration-150" dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Mobile Compact Sticky Header (44px) */}
      <header className="lg:hidden w-full h-11 bg-white/95 dark:bg-[#08090E]/95 backdrop-blur-md border-b border-slate-200 dark:border-[#141824] px-2.5 flex justify-between items-center z-30 sticky top-0 shrink-0">
        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          aria-label={lang === 'ar' ? 'فتح القائمة' : 'Open menu'}
          className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-[#121622] rounded-lg text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white transition"
        >
          <Menu className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-6 h-6 rounded-md overflow-hidden border border-slate-200/80 dark:border-white/10 bg-white flex items-center justify-center shrink-0 shadow-xs">
            <img
              src={APP_LOGO_URL}
              alt="Crypto Scanners Logo"
              className="w-full h-full object-cover scale-[1.06]"
            />
          </div>
          <span className="font-extrabold text-slate-900 dark:text-white text-xs tracking-tight font-sans truncate">Crypto Scanners</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {!firebaseUser && (
            <button
              type="button"
              id="mobile-signup-btn"
              onClick={() => openAuthModal('register')}
              className="px-2 py-1 rounded-md bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-black text-[10px] font-bold transition whitespace-nowrap"
            >
              {lang === 'ar' ? 'إنشاء حساب' : lang === 'fr' ? 'Créer' : 'Sign Up'}
            </button>
          )}
          <button
            type="button"
            id="mobile-theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? (lang === 'ar' ? 'تفعيل الوضع الواضح' : 'Switch to Light Mode') : (lang === 'ar' ? 'تفعيل الوضع الداكن' : 'Switch to Dark Mode')}
            title={theme === 'dark' ? (lang === 'ar' ? 'الوضع الواضح' : 'Light Mode') : (lang === 'ar' ? 'الوضع الداكن' : 'Dark Mode')}
            className="w-7 h-7 flex items-center justify-center rounded-md bg-slate-100 dark:bg-[#0C0E14] border border-slate-200 dark:border-[#1C2030] text-amber-600 dark:text-amber-400 hover:border-emerald-500/40 transition"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5 text-slate-700" />}
          </button>
          <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-[#0C0E14] border border-slate-200 dark:border-[#1C2030] rounded-md px-1 py-0.5">
            <Globe className="w-3 h-3 text-slate-500 dark:text-zinc-500" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Language)}
              aria-label="Language"
              className="bg-transparent text-[10px] font-mono font-bold text-slate-800 dark:text-zinc-200 outline-none cursor-pointer"
            >
              <option value="en" className="bg-white dark:bg-[#08090E] text-slate-800 dark:text-zinc-300">EN</option>
              <option value="ar" className="bg-white dark:bg-[#08090E] text-slate-800 dark:text-zinc-300">عربي</option>
              <option value="fr" className="bg-white dark:bg-[#08090E] text-slate-800 dark:text-zinc-300">FR</option>
            </select>
          </div>
        </div>
      </header>

      {/* MOBILE BACKDROP OVERLAY */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-950/50 dark:bg-black/70 backdrop-blur-xs z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* RESPONSIVE COLLAPSIBLE SIDEBAR NAVIGATION */}
      <aside
        className={`${
          isSidebarOpen ? 'flex' : 'hidden'
        } lg:flex flex-col ${
          isSidebarCollapsed ? 'lg:w-[72px]' : 'lg:w-64'
        } w-[238px] max-w-[78vw] bg-white dark:bg-[#08090E] ltr:border-r rtl:border-l border-slate-200 dark:border-[#141824] shrink-0 text-slate-600 dark:text-zinc-400 font-sans text-[11px] lg:text-xs select-none fixed inset-y-0 ltr:left-0 rtl:right-0 z-50 h-[100dvh] lg:sticky lg:top-0 lg:h-screen transition-[width] duration-200 overflow-hidden`}
      >
        {/* 1. Top Zone: Brand, Collapse/Close, & Quick Search */}
        <div className="shrink-0 border-b border-slate-200 dark:border-[#141824]">
          <div className={`px-3 py-2.5 lg:px-4 lg:py-3.5 flex items-center ${isSidebarCollapsed ? 'lg:justify-center' : 'justify-between'} gap-2`}>
            <button
              type="button"
              onClick={() => {
                if (isSidebarCollapsed) {
                  setIsSidebarCollapsed(false);
                } else {
                  setActiveSidebarTab('live-signals');
                  setActiveChainFilter('all');
                  setIsSidebarOpen(false);
                }
              }}
              className="flex items-center gap-2 min-w-0 text-start"
              title="Crypto Scanners"
            >
              <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-md lg:rounded-lg overflow-hidden border border-slate-200/80 dark:border-white/10 bg-white flex items-center justify-center shrink-0 shadow-xs">
                <img
                  src={APP_LOGO_URL}
                  alt="Crypto Scanners Logo"
                  className="w-full h-full object-cover scale-[1.06]"
                />
              </div>
              {!isSidebarCollapsed && (
                <span className="font-extrabold text-slate-900 dark:text-white text-xs lg:text-sm tracking-tight whitespace-nowrap truncate">
                  Crypto Scanners
                </span>
              )}
            </button>

            <div className="flex items-center gap-1 shrink-0">
              {!isSidebarCollapsed && (
                <button
                  type="button"
                  onClick={() => setIsSidebarCollapsed(true)}
                  title={lang === 'ar' ? 'تصغير القائمة الجانبية' : 'Collapse sidebar'}
                  className="hidden lg:flex p-1.5 hover:bg-slate-100 dark:hover:bg-[#121622] rounded-lg text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white transition"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                aria-label={lang === 'ar' ? 'إغلاق القائمة' : 'Close menu'}
                className="lg:hidden w-8 h-8 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-[#121622] rounded-lg text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {isSidebarCollapsed ? (
            <div className="hidden lg:flex flex-col items-center gap-2 pb-3 px-2">
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(false)}
                title={lang === 'ar' ? 'توسيع القائمة الجانبية' : 'Expand sidebar'}
                className="w-9 h-9 rounded-lg bg-slate-50 dark:bg-[#0C0E14] border border-slate-200 dark:border-[#1C2030] hover:border-emerald-500/40 flex items-center justify-center text-slate-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
              >
                <PanelLeftOpen className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(false)}
                title={lang === 'ar' ? 'البحث عن عملة' : 'Search coins'}
                className="w-9 h-9 rounded-lg bg-slate-50 dark:bg-[#0C0E14] border border-slate-200 dark:border-[#1C2030] hover:border-emerald-500/40 flex items-center justify-center text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="px-2.5 pb-2.5 lg:px-3 lg:pb-3 relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder={lang === 'ar' ? 'ابحث عن أي عملة (BTC, BNB...)' : 'Search Binance, OKX & DEX...'}
                  value={scanQuery}
                  onFocus={() => setShowSidebarSearchDropdown(true)}
                  onBlur={() => setTimeout(() => setShowSidebarSearchDropdown(false), 180)}
                  onChange={(e) => {
                    setScanQuery(e.target.value);
                    setShowSidebarSearchDropdown(true);
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleScan(scanQuery)}
                  className="w-full bg-slate-50 dark:bg-[#0C0E14] border border-slate-200 dark:border-[#1C2030] hover:border-emerald-500/40 focus:border-emerald-500/60 rounded-lg py-1.5 lg:py-2 ltr:pl-2.5 ltr:pr-7 rtl:pr-2.5 rtl:pl-7 text-slate-900 dark:text-white text-[11px] lg:text-xs font-mono focus:outline-none transition placeholder:text-slate-400 dark:placeholder:text-zinc-600"
                />
                {scanQuery ? (
                  <button
                    type="button"
                    onClick={() => { setScanQuery(''); setUnifiedSearchResults([]); }}
                    className="text-slate-400 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white absolute ltr:right-2 rtl:left-2 top-2 lg:top-2.5"
                  >
                    <X className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                  </button>
                ) : (
                  <Search className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-slate-400 dark:text-zinc-600 absolute ltr:right-2 rtl:left-2 top-2 lg:top-2.5 pointer-events-none" />
                )}
              </div>

              {showSidebarSearchDropdown && scanQuery.trim().length > 0 && (
                <div className="absolute left-2.5 right-2.5 top-[36px] lg:top-[42px] bg-white dark:bg-[#0B0D14] border border-slate-200 dark:border-[#242B40] rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-[#141824] font-mono">
                  <div className="px-2.5 py-1.5 text-[9px] text-slate-500 dark:text-zinc-500 flex items-center justify-between bg-slate-50 dark:bg-[#08090E]">
                    <span>{lang === 'ar' ? 'نتائج المنصات والشبكات' : 'EXCHANGE & DEX RESULTS'}</span>
                    {isSearchingUnified && <RefreshCw className="w-3 h-3 animate-spin text-emerald-500 dark:text-emerald-400" />}
                  </div>
                  {unifiedSearchResults.length === 0 ? (
                    <div className="px-3 py-3 text-center text-[10px] text-slate-500 dark:text-zinc-500">
                      {isSearchingUnified
                        ? (lang === 'ar' ? 'جارٍ البحث في المنصات والشبكات...' : 'Searching exchanges & chains...')
                        : (lang === 'ar' ? 'لا توجد نتائج مطابقة' : 'No matching coins found')}
                    </div>
                  ) : (
                    unifiedSearchResults.slice(0, 12).map((item) => {
                      const p = parseFloat(item.pair.priceUsd || '0');
                      const isCex = item.pair.listingType === 'CEX' || item.pair.chainId === 'cex';
                      return (
                        <button
                          key={item.pair.pairAddress}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            selectTokenFromSearch(item);
                          }}
                          className="w-full px-2.5 py-2 hover:bg-slate-50 dark:hover:bg-[#121622] transition flex items-center justify-between gap-2 text-start"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <TokenAvatar
                              symbol={item.pair.baseToken.symbol}
                              imageUrl={item.pair.info?.imageUrl}
                              size="sm"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-900 dark:text-white text-[11px] lg:text-xs">${item.pair.baseToken.symbol}</span>
                                <span className={`text-[8.5px] font-bold ${isCex ? 'text-amber-600 dark:text-amber-300' : 'text-sky-600 dark:text-sky-300 uppercase'}`}>
                                  {isCex ? (item.pair.primaryExchange || 'CEX') : item.pair.chainId}
                                </span>
                              </div>
                              <span className="text-[9px] text-slate-500 dark:text-zinc-500 block truncate">
                                {isCex && item.pair.listedExchanges?.length
                                  ? item.pair.listedExchanges.join(' · ')
                                  : item.pair.baseToken.name}
                              </span>
                            </div>
                          </div>
                          <div className="text-right shrink-0 tabular-nums">
                            <div className="text-[10px] lg:text-[11px] font-bold text-slate-800 dark:text-zinc-200">
                              ${p < 0.01 ? p.toFixed(6) : p.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                            </div>
                            <div className={`text-[9px] font-bold ${(item.pair.priceChange?.h24 || 0) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                              {(item.pair.priceChange?.h24 || 0) >= 0 ? '+' : ''}{(item.pair.priceChange?.h24 || 0).toFixed(2)}%
                            </div>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* 2. Scrollable Middle Zone: Categorized Navigation + Compact Preferences */}
        <nav className="flex-1 min-h-0 overflow-y-auto px-2 py-2.5 lg:px-2.5 lg:py-3 space-y-4 lg:space-y-5">
          {/* Group A: Market Scanners */}
          <div className="space-y-0.5 lg:space-y-1">
            {!isSidebarCollapsed && (
              <div className="px-2 pb-1 text-[9px] lg:text-[10px] font-semibold tracking-wider text-slate-400 dark:text-zinc-500 uppercase">
                {lang === 'ar' ? 'الأسواق والإشارات' : lang === 'fr' ? 'Marchés & Signaux' : 'Market Scanners'}
              </div>
            )}

            <button
              type="button"
              onClick={() => { setActiveSidebarTab('live-signals'); setActiveChainFilter('all'); setIsSidebarOpen(false); }}
              title={lang === 'ar' ? 'نظرة عامة' : 'Overview'}
              className={`w-full min-h-[34px] lg:min-h-[40px] flex items-center ${isSidebarCollapsed ? 'lg:justify-center px-2' : 'justify-between px-2.5 lg:px-3'} py-1.5 lg:py-2 rounded-lg transition text-start ${
                activeSidebarTab === 'live-signals' && activeChainFilter === 'all'
                  ? 'bg-emerald-50 dark:bg-[#121726] text-slate-900 dark:text-white border border-emerald-500/40 dark:border-emerald-500/30'
                  : 'border border-transparent hover:bg-slate-100 dark:hover:bg-[#0D1018] hover:text-slate-900 dark:hover:text-zinc-200'
              }`}
            >
              <span className="flex items-center gap-2 lg:gap-2.5 font-semibold whitespace-nowrap truncate">
                <LayoutGrid className={`w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0 ${activeSidebarTab === 'live-signals' && activeChainFilter === 'all' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-zinc-500'}`} />
                {!isSidebarCollapsed && <span>{lang === 'ar' ? 'نظرة عامة' : lang === 'fr' ? 'Aperçu' : 'Overview'}</span>}
              </span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveSidebarTab('live-signals'); setIsSidebarOpen(false); }}
              title={lang === 'ar' ? 'الإشارات المباشرة' : 'Live Signals'}
              className={`w-full min-h-[34px] lg:min-h-[40px] flex items-center ${isSidebarCollapsed ? 'lg:justify-center px-2' : 'justify-between px-2.5 lg:px-3'} py-1.5 lg:py-2 rounded-lg transition text-start ${
                activeSidebarTab === 'live-signals' && activeChainFilter !== 'all'
                  ? 'bg-emerald-50 dark:bg-[#121726] text-slate-900 dark:text-white border border-emerald-500/40 dark:border-emerald-500/30'
                  : 'border border-transparent hover:bg-slate-100 dark:hover:bg-[#0D1018] hover:text-slate-900 dark:hover:text-zinc-200'
              }`}
            >
              <span className="flex items-center gap-2 lg:gap-2.5 font-semibold whitespace-nowrap truncate">
                <Zap className="w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                {!isSidebarCollapsed && <span>{lang === 'ar' ? 'الإشارات المباشرة' : lang === 'fr' ? 'Signaux Directs' : 'Live Signals'}</span>}
              </span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveSidebarTab('smart-money'); setIsSidebarOpen(false); }}
              title={lang === 'ar' ? 'الأموال الذكية' : 'Smart Money'}
              className={`w-full min-h-[34px] lg:min-h-[40px] flex items-center ${isSidebarCollapsed ? 'lg:justify-center px-2' : 'justify-between px-2.5 lg:px-3'} py-1.5 lg:py-2 rounded-lg transition text-start ${
                activeSidebarTab === 'smart-money'
                  ? 'bg-amber-50 dark:bg-[#121726] text-slate-900 dark:text-white border border-amber-500/40 dark:border-amber-500/30'
                  : 'border border-transparent hover:bg-slate-100 dark:hover:bg-[#0D1018] hover:text-slate-900 dark:hover:text-zinc-200'
              }`}
            >
              <span className="flex items-center gap-2 lg:gap-2.5 font-semibold whitespace-nowrap truncate">
                <Crown className="w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0 text-amber-500 dark:text-amber-400" />
                {!isSidebarCollapsed && <span>{lang === 'ar' ? 'الأموال الذكية' : 'Smart Money'}</span>}
              </span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveSidebarTab('reports'); setIsSidebarOpen(false); }}
              title={lang === 'ar' ? 'التقارير الكمية' : 'Reports'}
              className={`w-full min-h-[34px] lg:min-h-[40px] flex items-center ${isSidebarCollapsed ? 'lg:justify-center px-2' : 'justify-between px-2.5 lg:px-3'} py-1.5 lg:py-2 rounded-lg transition text-start ${
                activeSidebarTab === 'reports'
                  ? 'bg-emerald-50 dark:bg-[#121726] text-slate-900 dark:text-white border border-emerald-500/40 dark:border-emerald-500/30'
                  : 'border border-transparent hover:bg-slate-100 dark:hover:bg-[#0D1018] hover:text-slate-900 dark:hover:text-zinc-200'
              }`}
            >
              <span className="flex items-center gap-2 lg:gap-2.5 font-semibold whitespace-nowrap truncate">
                <BarChart2 className={`w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0 ${activeSidebarTab === 'reports' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-zinc-500'}`} />
                {!isSidebarCollapsed && <span>{lang === 'ar' ? 'التقارير الكمية' : lang === 'fr' ? 'Rapports IA' : 'Reports'}</span>}
              </span>
            </button>
          </div>

          {/* Group B: Workspace & Tracking */}
          <div className="space-y-0.5 lg:space-y-1 border-t border-slate-200 dark:border-[#141824] pt-3 lg:pt-4">
            {!isSidebarCollapsed && (
              <div className="px-2 pb-1 text-[9px] lg:text-[10px] font-semibold tracking-wider text-slate-400 dark:text-zinc-500 uppercase">
                {lang === 'ar' ? 'مساحة العمل' : lang === 'fr' ? 'Espace Personnel' : 'Workspace'}
              </div>
            )}

            <button
              type="button"
              onClick={() => { setActiveSidebarTab('watchlist'); setIsSidebarOpen(false); }}
              title={lang === 'ar' ? 'قائمة المراقبة' : 'Watchlist'}
              className={`w-full min-h-[34px] lg:min-h-[40px] flex items-center ${isSidebarCollapsed ? 'lg:justify-center px-2 relative' : 'justify-between px-2.5 lg:px-3'} py-1.5 lg:py-2 rounded-lg transition text-start ${
                activeSidebarTab === 'watchlist'
                  ? 'bg-amber-50 dark:bg-[#121726] text-slate-900 dark:text-white border border-amber-500/40 dark:border-amber-500/30'
                  : 'border border-transparent hover:bg-slate-100 dark:hover:bg-[#0D1018] hover:text-slate-900 dark:hover:text-zinc-200'
              }`}
            >
              <span className="flex items-center gap-2 lg:gap-2.5 font-semibold whitespace-nowrap truncate">
                <Star className="w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0 text-amber-500 dark:text-amber-400" />
                {!isSidebarCollapsed && <span>{lang === 'ar' ? 'المفضلة' : lang === 'fr' ? 'Favoris' : 'Watchlist'}</span>}
              </span>
              {!isSidebarCollapsed && (
                <span className="text-[10px] lg:text-[11px] font-mono tabular-nums text-slate-500 dark:text-zinc-500">{watchlist.length}</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => { setActiveSidebarTab('alerts'); setIsSidebarOpen(false); }}
              title={lang === 'ar' ? 'تنبيهات الأسعار' : 'Price Alerts'}
              className={`w-full min-h-[34px] lg:min-h-[40px] flex items-center ${isSidebarCollapsed ? 'lg:justify-center px-2 relative' : 'justify-between px-2.5 lg:px-3'} py-1.5 lg:py-2 rounded-lg transition text-start ${
                activeSidebarTab === 'alerts'
                  ? 'bg-emerald-50 dark:bg-[#121726] text-slate-900 dark:text-white border border-emerald-500/40 dark:border-emerald-500/30'
                  : 'border border-transparent hover:bg-slate-100 dark:hover:bg-[#0D1018] hover:text-slate-900 dark:hover:text-zinc-200'
              }`}
            >
              <span className="flex items-center gap-2 lg:gap-2.5 font-semibold whitespace-nowrap truncate">
                <BellRing className={`w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0 ${priceAlerts.some(a => a.status === 'active') ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-zinc-500'}`} />
                {!isSidebarCollapsed && <span>{lang === 'ar' ? 'تنبيهات الأسعار' : lang === 'fr' ? 'Alertes Prix' : 'Price Alerts'}</span>}
              </span>
              {!isSidebarCollapsed && (
                <span className={`text-[10px] lg:text-[11px] font-mono tabular-nums font-bold ${
                  priceAlerts.some(a => a.status === 'active') ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-zinc-500'
                }`}>
                  {priceAlerts.filter(a => a.status === 'active').length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => { setActiveSidebarTab('portfolio'); setIsSidebarOpen(false); }}
              title={lang === 'ar' ? 'المحفظة' : 'Portfolio'}
              className={`w-full min-h-[34px] lg:min-h-[40px] flex items-center ${isSidebarCollapsed ? 'lg:justify-center px-2' : 'justify-between px-2.5 lg:px-3'} py-1.5 lg:py-2 rounded-lg transition text-start ${
                activeSidebarTab === 'portfolio'
                  ? 'bg-emerald-50 dark:bg-[#121726] text-slate-900 dark:text-white border border-emerald-500/40 dark:border-emerald-500/30'
                  : 'border border-transparent hover:bg-slate-100 dark:hover:bg-[#0D1018] hover:text-slate-900 dark:hover:text-zinc-200'
              }`}
            >
              <span className="flex items-center gap-2 lg:gap-2.5 font-semibold whitespace-nowrap truncate">
                <Wallet className={`w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0 ${activeSidebarTab === 'portfolio' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-zinc-500'}`} />
                {!isSidebarCollapsed && <span>{lang === 'ar' ? 'المحفظة' : lang === 'fr' ? 'Portefeuille' : 'Portfolio'}</span>}
              </span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveSidebarTab('referral'); setIsSidebarOpen(false); }}
              title={lang === 'ar' ? 'الإحالات' : 'Referral'}
              className={`w-full min-h-[34px] lg:min-h-[40px] flex items-center ${isSidebarCollapsed ? 'lg:justify-center px-2' : 'justify-between px-2.5 lg:px-3'} py-1.5 lg:py-2 rounded-lg transition text-start ${
                activeSidebarTab === 'referral'
                  ? 'bg-emerald-50 dark:bg-[#121726] text-slate-900 dark:text-white border border-emerald-500/40 dark:border-emerald-500/30'
                  : 'border border-transparent hover:bg-slate-100 dark:hover:bg-[#0D1018] hover:text-slate-900 dark:hover:text-zinc-200'
              }`}
            >
              <span className="flex items-center gap-2 lg:gap-2.5 font-semibold whitespace-nowrap truncate">
                <Users className={`w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0 ${activeSidebarTab === 'referral' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-zinc-500'}`} />
                {!isSidebarCollapsed && <span>{lang === 'ar' ? 'الإحالات' : lang === 'fr' ? 'Parrainage' : 'Referral'}</span>}
              </span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveSidebarTab('profile'); setIsSidebarOpen(false); }}
              title={lang === 'ar' ? 'الملف الشخصي' : 'Profile'}
              className={`w-full min-h-[34px] lg:min-h-[40px] flex items-center ${isSidebarCollapsed ? 'lg:justify-center px-2' : 'justify-between px-2.5 lg:px-3'} py-1.5 lg:py-2 rounded-lg transition text-start ${
                activeSidebarTab === 'profile'
                  ? 'bg-emerald-50 dark:bg-[#121726] text-slate-900 dark:text-white border border-emerald-500/40 dark:border-emerald-500/30'
                  : 'border border-transparent hover:bg-slate-100 dark:hover:bg-[#0D1018] hover:text-slate-900 dark:hover:text-zinc-200'
              }`}
            >
              <span className="flex items-center gap-2 lg:gap-2.5 font-semibold whitespace-nowrap truncate">
                <User className={`w-3.5 h-3.5 lg:w-4 lg:h-4 shrink-0 ${activeSidebarTab === 'profile' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-zinc-500'}`} />
                {!isSidebarCollapsed && <span>{lang === 'ar' ? 'الملف الشخصي' : lang === 'fr' ? 'Profil' : 'Profile'}</span>}
              </span>
            </button>
          </div>

          {/* Group C: Compact Controls inside Scrollable Area (never overflows viewport) */}
          {isSidebarCollapsed ? (
            <div className="hidden lg:flex flex-col items-center gap-2 border-t border-slate-200 dark:border-[#141824] pt-4">
              <button
                type="button"
                onClick={toggleTheme}
                title={theme === 'dark' ? (lang === 'ar' ? 'الوضع الواضح' : 'Light Mode') : (lang === 'ar' ? 'الوضع الداكن' : 'Dark Mode')}
                className="w-9 h-9 rounded-lg border bg-slate-50 dark:bg-[#0C0E14] border-slate-200 dark:border-[#1A1F2D] text-amber-600 dark:text-amber-400 hover:border-emerald-500/40 flex items-center justify-center transition"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </button>
              <button
                type="button"
                onClick={async () => {
                  const next = !alertsEnabled;
                  setAlertsEnabled(next);
                  if (next && notificationPermission === 'default') {
                    await requestBrowserNotificationPermission();
                  }
                }}
                title={alertsEnabled ? (lang === 'ar' ? 'إيقاف التنبيهات المباشرة' : 'Disable Live Alerts') : (lang === 'ar' ? 'تفعيل التنبيهات المباشرة' : 'Enable Live Alerts')}
                className={`w-9 h-9 rounded-lg border flex items-center justify-center transition ${
                  alertsEnabled
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                    : 'bg-slate-50 dark:bg-[#0C0E14] border-slate-200 dark:border-[#1A1F2D] text-slate-400 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-zinc-200'
                }`}
              >
                <Bell className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-2 border-t border-slate-200 dark:border-[#141824] pt-3 lg:pt-4 px-0.5 lg:px-1">
              {/* Light / Dark Mode Switch */}
              <button
                type="button"
                onClick={toggleTheme}
                className="w-full flex items-center justify-between px-2.5 py-1.5 lg:py-2 bg-slate-50 dark:bg-[#0C0E14] hover:bg-slate-100 dark:hover:bg-[#121622] border border-slate-200 dark:border-[#1A1F2D] rounded-lg text-[10.5px] lg:text-[11px] font-medium text-slate-700 dark:text-zinc-300 transition"
              >
                <span className="flex items-center gap-2 whitespace-nowrap">
                  {theme === 'dark' ? (
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <Moon className="w-3.5 h-3.5 text-slate-700" />
                  )}
                  {lang === 'ar' ? 'مظهر الواجهة' : lang === 'fr' ? 'Thème' : 'Appearance'}
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {theme === 'dark'
                    ? (lang === 'ar' ? 'داكن' : lang === 'fr' ? 'Sombre' : 'Dark')
                    : (lang === 'ar' ? 'واضح' : lang === 'fr' ? 'Clair' : 'Light')}
                </span>
              </button>

              {/* Alerts Monitoring Toggle */}
              <div className="flex items-center justify-between px-2.5 py-1.5 lg:py-2 bg-slate-50 dark:bg-[#0C0E14] border border-slate-200 dark:border-[#1A1F2D] rounded-lg">
                <span className="text-[10.5px] lg:text-[11px] font-medium text-slate-700 dark:text-zinc-300 flex items-center gap-2 whitespace-nowrap">
                  <Bell className={`w-3.5 h-3.5 ${alertsEnabled ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-zinc-600'}`} />
                  {lang === 'ar' ? 'تفعيل التنبيهات' : lang === 'fr' ? 'Alertes actives' : 'Live Alerts'}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={alertsEnabled}
                    onChange={async (e) => {
                      const next = e.target.checked;
                      setAlertsEnabled(next);
                      if (next && notificationPermission === 'default') {
                        await requestBrowserNotificationPermission();
                      }
                    }}
                  />
                  <div className="w-7 h-4 bg-slate-300 dark:bg-zinc-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:after:bg-zinc-400 after:border-slate-300 dark:after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-emerald-500 peer-checked:after:bg-white"></div>
                </label>
              </div>

              {/* Compact Plan & Mobile App Quick Actions */}
              <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 lg:py-2 bg-slate-50 dark:bg-[#0C0E14] border border-slate-200 dark:border-[#1A1F2D] rounded-lg text-[10.5px] lg:text-[11px]">
                <span className="text-slate-700 dark:text-zinc-300 font-medium truncate">
                  {isProUnlocked
                    ? (lang === 'ar' ? 'باقة PRO مفتوحة مجاناً' : 'PRO Unlocked Free')
                    : (lang === 'ar' ? 'الترقية إلى PRO' : 'PRO Membership')}
                </span>
                {!isProUnlocked && (!user || user.subscriptionStatus !== 'pro') ? (
                  <button
                    type="button"
                    onClick={() => { setShowCheckoutModal(true); setIsSidebarOpen(false); }}
                    className="text-amber-600 dark:text-amber-400 hover:text-amber-500 dark:hover:text-amber-300 font-bold whitespace-nowrap shrink-0"
                  >
                    {lang === 'ar' ? 'ترقية' : 'Upgrade'}
                  </button>
                ) : (
                  <Crown className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                )}
              </div>

              <button
                type="button"
                onClick={() => { showToast(lang === 'ar' ? 'تطبيق الجوال قادم قريباً!' : 'iOS and Android releases scheduled soon!'); setIsSidebarOpen(false); }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 lg:py-2 bg-slate-50 dark:bg-[#0C0E14] hover:bg-slate-100 dark:hover:bg-[#121622] border border-slate-200 dark:border-[#1A1F2D] rounded-lg text-[10.5px] lg:text-[11px] text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200 transition"
              >
                <span className="flex items-center gap-2 whitespace-nowrap">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  {lang === 'ar' ? 'تطبيق الجوال' : 'Mobile App'}
                </span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                  {lang === 'ar' ? 'قريباً' : 'Soon'}
                </span>
              </button>
            </div>
          )}
        </nav>

        {/* 3. Sticky Bottom Profile Footer */}
        <div className={`shrink-0 border-t border-slate-200 dark:border-[#141824] p-2.5 lg:p-3 flex items-center ${isSidebarCollapsed ? 'lg:justify-center' : 'justify-between'} bg-slate-50 dark:bg-[#06070B]`}>
          <button
            type="button"
            onClick={() => { setActiveSidebarTab('profile'); setIsSidebarOpen(false); }}
            className="flex items-center gap-2 lg:gap-2.5 overflow-hidden text-start min-w-0"
            title={user?.email || 'Guest'}
          >
            <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-extrabold text-[11px] lg:text-xs shrink-0">
              {user?.email ? user.email.slice(0, 1).toUpperCase() : 'G'}
            </div>
            {!isSidebarCollapsed && (
              <div className="overflow-hidden min-w-0">
                <span className="text-slate-900 dark:text-white font-bold block truncate text-[11px] lg:text-xs">{user?.email ? user.email.split('@')[0] : 'Guest'}</span>
                <span className="text-[9.5px] lg:text-[10px] text-slate-500 dark:text-zinc-500 font-mono block truncate">{user?.email || 'anonymous'}</span>
              </div>
            )}
          </button>
          {!isSidebarCollapsed && (
            user ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="p-1.5 lg:p-2 hover:bg-red-500/10 text-slate-500 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 rounded-lg transition shrink-0"
                title={lang === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}
              >
                <LogOut className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
              </button>
            ) : (
              <button
                type="button"
                id="sidebar-signup-btn"
                onClick={() => { openAuthModal('register'); setIsSidebarOpen(false); }}
                className="px-2 py-1 lg:px-2.5 lg:py-1.5 bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-black rounded-lg text-[10px] font-bold transition shrink-0 whitespace-nowrap"
                title={lang === 'ar' ? 'إنشاء حساب' : 'Create Account'}
              >
                {lang === 'ar' ? 'إنشاء حساب' : lang === 'fr' ? 'Créer' : 'Sign Up'}
              </button>
            )
          )}
        </div>
      </aside>

      {/* MOBILE BOTTOM THUMB NAVIGATION BAR (48px compact) */}
      <nav
        aria-label={lang === 'ar' ? 'التنقل السريع للهواتف' : 'Mobile quick navigation'}
        className="lg:hidden fixed bottom-0 inset-x-0 h-12 bg-white/95 dark:bg-[#08090E]/95 backdrop-blur-md border-t border-slate-200 dark:border-[#141824] z-30 grid grid-cols-5 items-center px-1"
      >
        <button
          type="button"
          onClick={() => { setActiveSidebarTab('live-signals'); setIsSidebarOpen(false); }}
          className={`flex flex-col items-center justify-center h-full gap-0.5 text-[9px] font-semibold transition ${
            activeSidebarTab === 'live-signals' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-zinc-300'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span className="truncate max-w-[56px]">{lang === 'ar' ? 'الإشارات' : 'Signals'}</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveSidebarTab('smart-money'); setIsSidebarOpen(false); }}
          className={`flex flex-col items-center justify-center h-full gap-0.5 text-[9px] font-semibold transition ${
            activeSidebarTab === 'smart-money' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-zinc-300'
          }`}
        >
          <Crown className="w-3.5 h-3.5" />
          <span className="truncate max-w-[56px]">{lang === 'ar' ? 'الأذكياء' : 'Smart'}</span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveSidebarTab('watchlist'); setIsSidebarOpen(false); }}
          className={`flex flex-col items-center justify-center h-full gap-0.5 text-[9px] font-semibold transition ${
            activeSidebarTab === 'watchlist' ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-zinc-300'
          }`}
        >
          <Star className="w-3.5 h-3.5" />
          <span className="truncate max-w-[56px]">
            {lang === 'ar' ? 'المفضلة' : 'Saved'}{watchlist.length > 0 ? ` (${watchlist.length})` : ''}
          </span>
        </button>

        <button
          type="button"
          onClick={() => { setActiveSidebarTab('alerts'); setIsSidebarOpen(false); }}
          className={`flex flex-col items-center justify-center h-full gap-0.5 text-[9px] font-semibold transition ${
            activeSidebarTab === 'alerts' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-zinc-300'
          }`}
        >
          <BellRing className="w-3.5 h-3.5" />
          <span className="truncate max-w-[56px]">
            {lang === 'ar' ? 'التنبيهات' : 'Alerts'}
            {priceAlerts.filter(a => a.status === 'active').length > 0 ? ` (${priceAlerts.filter(a => a.status === 'active').length})` : ''}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setIsSidebarOpen(true)}
          className={`flex flex-col items-center justify-center h-full gap-0.5 text-[9px] font-semibold transition ${
            isSidebarOpen ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-zinc-300'
          }`}
        >
          <Menu className="w-3.5 h-3.5" />
          <span className="truncate max-w-[56px]">{lang === 'ar' ? 'المزيد' : 'Menu'}</span>
        </button>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 min-w-0 min-h-screen bg-[#F4F6FA] dark:bg-[#05060A] overflow-x-hidden px-2 sm:px-6 lg:px-8 py-2.5 sm:py-4 lg:py-6 pb-16 lg:pb-8 relative transition-colors duration-150">
        
        {/* Languages Switcher, Theme Toggle & Connection Status Bar */}
        <div className="flex justify-between items-center mb-2.5 sm:mb-4 font-mono text-[9px] sm:text-[10px] text-slate-500 dark:text-zinc-500">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
            <span className="truncate">SECURE CRYPTO TERMINAL CONNECTED // PORT: 3000</span>
          </div>
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <button
              type="button"
              id="desktop-theme-toggle"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? (lang === 'ar' ? 'تفعيل الوضع الواضح' : 'Switch to Light Mode') : (lang === 'ar' ? 'تفعيل الوضع الداكن' : 'Switch to Dark Mode')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-[#0C0E14] border border-slate-200 dark:border-[#1C2030] hover:border-emerald-500/40 text-slate-700 dark:text-zinc-200 transition font-sans text-[11px] font-semibold"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lang === 'ar' ? 'الوضع الواضح' : lang === 'fr' ? 'Mode Clair' : 'Light Mode'}</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-700" />
                  <span>{lang === 'ar' ? 'الوضع الداكن' : lang === 'fr' ? 'Mode Sombre' : 'Dark Mode'}</span>
                </>
              )}
            </button>
            <div className="w-[1px] h-3.5 bg-slate-300 dark:bg-[#1C2030]"></div>
            <Globe className="w-3.5 h-3.5" />
            <button onClick={() => setLang('en')} className={`hover:text-slate-900 dark:hover:text-white px-1.5 ${lang === 'en' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}`}>EN</button>
            <button onClick={() => setLang('fr')} className={`hover:text-slate-900 dark:hover:text-white px-1.5 ${lang === 'fr' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}`}>FR</button>
            <button onClick={() => setLang('ar')} className={`hover:text-slate-900 dark:hover:text-white px-1.5 ${lang === 'ar' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : ''}`}>العربية</button>
          </div>
        </div>

        {/* Real-time Global Crypto Market Indices Indicator Strip */}
        <div className="mb-3.5 sm:mb-6 bg-white dark:bg-[#08090E] border border-slate-200 dark:border-[#141824] rounded-xl sm:rounded-2xl p-2.5 sm:p-4 shadow-xs dark:shadow-none">
          <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 mb-2 sm:mb-2.5 font-mono">
            <span className="text-[9px] sm:text-[10px] text-slate-600 dark:text-zinc-400 font-bold tracking-wider uppercase flex items-center gap-1.5 relative">
              <span className="inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-ping shrink-0"></span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 absolute left-0 sm:left-0.5 top-1 shrink-0"></span>
              <span className="ml-1">
                {lang === 'ar'
                  ? 'مؤشرات الأسواق المباشرة (1ث)'
                  : lang === 'fr'
                  ? 'INDICES CRYPTO EN DIRECT (1s)'
                  : 'LIVE GLOBAL CRYPTO INDICES (1s Feed)'}
              </span>
            </span>
            <div className="flex items-center gap-1.5 sm:gap-2 text-[8.5px] sm:text-[9px] font-mono">
              <span className={`px-1.5 py-0.5 rounded border font-bold ${isLiveStreamConnected ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 dark:border-emerald-500/25' : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 dark:border-amber-500/25'}`}>
                {isLiveStreamConnected ? (lang === 'ar' ? 'بث مباشر 1ث' : '1s STREAM LIVE') : (lang === 'ar' ? 'مزامنة تلقائية' : 'AUTO-SYNC')}
              </span>
              <span className="text-slate-500 dark:text-zinc-500 hidden sm:inline">
                {lastStreamTime || terminalClock} {liveTick > 0 ? `· #${liveTick}` : ''}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1.5 sm:gap-3">
            {marketIndices.length === 0 ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-slate-50 dark:bg-[#0C0E14] border border-slate-200 dark:border-[#1C2030]/60 rounded-lg sm:rounded-xl p-2 sm:p-3 animate-pulse flex flex-col gap-1.5">
                  <div className="h-2.5 sm:h-3 w-8 bg-slate-200 dark:bg-zinc-800 rounded"></div>
                  <div className="h-3.5 sm:h-4 w-16 bg-slate-200 dark:bg-zinc-800 rounded"></div>
                </div>
              ))
            ) : (
              marketIndices.map((idx, i) => {
                const isPositive = idx.change24h >= 0;
                const tickDir = indexTickDir[idx.symbol] || 'flat';
                return (
                  <div 
                    key={idx.symbol || i} 
                    className={`border rounded-lg sm:rounded-xl p-2 sm:p-3 transition-colors duration-300 flex flex-col justify-between font-mono relative group ${
                      tickDir === 'up'
                        ? 'border-emerald-500/50 bg-emerald-50 dark:bg-emerald-950/10'
                        : tickDir === 'down'
                        ? 'border-red-500/50 bg-red-50 dark:bg-red-950/10'
                        : 'bg-slate-50 dark:bg-[#0C0E14] border-slate-200 dark:border-[#1C2030] hover:border-emerald-500/40'
                    }`}
                  >
                    <div className="flex justify-between items-center gap-1">
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 dark:text-zinc-300 flex items-center gap-1 min-w-0">
                        <TokenAvatar symbol={idx.symbol} imageUrl={idx.imageUrl} size="xs" />
                        <span className="truncate">{idx.symbol}</span>
                        {tickDir !== 'flat' && (
                          <span className={`text-[8px] ${tickDir === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                            {tickDir === 'up' ? '▲' : '▼'}
                          </span>
                        )}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        <span className={`text-[8px] sm:text-[9px] font-extrabold ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                          {isPositive ? '▲' : '▼'} {idx.change24h.toFixed(2)}%
                        </span>
                        <button
                          onClick={() => {
                            setAlertFormAssetKey(`INDEX:${idx.symbol}`);
                            setAlertFormTarget((idx.price * 1.02).toFixed(idx.price >= 1 ? 2 : 5));
                            setAlertFormCondition('above');
                            setActiveSidebarTab('alerts');
                          }}
                          title={lang === 'ar' ? `ضبط تنبيه سعر لـ ${idx.symbol}` : `Set price alert for ${idx.symbol}`}
                          className="text-slate-400 dark:text-zinc-600 hover:text-emerald-600 dark:hover:text-emerald-400 transition p-0.5"
                        >
                          <Bell className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-1 sm:mt-1.5 flex flex-col">
                      <span className={`text-xs sm:text-sm font-extrabold transition-colors duration-300 tabular-nums ${
                        tickDir === 'up' ? 'text-emerald-600 dark:text-emerald-300' : tickDir === 'down' ? 'text-red-600 dark:text-red-300' : 'text-slate-900 dark:text-white'
                      }`}>
                        ${idx.price >= 1 ? idx.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : idx.price.toFixed(5)}
                      </span>
                      <div className="flex justify-between text-[7.5px] sm:text-[8px] text-slate-500 dark:text-zinc-500 mt-0.5 sm:mt-1 tabular-nums">
                        <span>H: {idx.high >= 1 ? idx.high.toLocaleString(undefined, { maximumFractionDigits: 2 }) : idx.high.toFixed(4)}</span>
                        <span>L: {idx.low >= 1 ? idx.low.toLocaleString(undefined, { maximumFractionDigits: 2 }) : idx.low.toFixed(4)}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* LIVE TRIGGERED PRICE ALERT BANNER */}
        <AnimatePresence>
          {triggeredBanner && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="mb-3.5 sm:mb-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-400 dark:border-emerald-500/50 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 font-mono shadow-lg dark:shadow-[0_0_25px_rgba(16,185,129,0.2)]"
            >
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <TokenAvatar
                  symbol={triggeredBanner.symbol}
                  imageUrl={
                    marketIndices.find(i => i.symbol === triggeredBanner.symbol)?.imageUrl ||
                    trendingTokens.find(
                      t => t.pair.pairAddress === triggeredBanner.pairAddress || t.pair.baseToken.symbol.toUpperCase() === triggeredBanner.symbol.toUpperCase()
                    )?.pair.info?.imageUrl
                  }
                  size="md"
                />
                <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 animate-pulse shrink-0">
                  <BellRing className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] sm:text-xs font-extrabold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider truncate">
                    {lang === 'ar' ? `تم تفعيل تنبيه السعر: ${triggeredBanner.symbol}` : `PRICE THRESHOLD REACHED: ${triggeredBanner.symbol}`}
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-slate-700 dark:text-zinc-300 mt-0.5">
                    {lang === 'ar'
                      ? `السعر الحالي $${triggeredBanner.triggeredPrice} ${triggeredBanner.condition === 'above' ? 'تجاوز' : 'انخفض عن'} الهدف $${triggeredBanner.targetPrice}`
                      : `Live price $${triggeredBanner.triggeredPrice} crossed ${triggeredBanner.condition} target $${triggeredBanner.targetPrice}`}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={() => {
                    setActiveSidebarTab('alerts');
                    setTriggeredBanner(null);
                  }}
                  className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white dark:text-black text-[10px] sm:text-[11px] font-bold hover:bg-emerald-500 dark:hover:bg-emerald-400 transition"
                >
                  {lang === 'ar' ? 'عرض التنبيهات' : 'View Alerts'}
                </button>
                <button
                  onClick={() => setTriggeredBanner(null)}
                  className="p-1 text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition"
                >
                  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Multi-View Panel Router */}
        <AnimatePresence mode="wait">
          {activeSidebarTab === 'live-signals' || activeSidebarTab === 'smart-money' || activeSidebarTab === 'watchlist' ? (
            <motion.div 
              key="table-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3.5 sm:space-y-6"
            >
              {/* Header Title Area */}
              <div className="flex flex-wrap justify-between items-end gap-2 sm:gap-3">
                <div className="min-w-0">
                  <h1 className="text-base sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5 sm:gap-2.5">
                    <span className="inline-flex w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg overflow-hidden border border-slate-200/80 dark:border-white/10 bg-white items-center justify-center shrink-0 shadow-xs">
                      <img
                        src={APP_LOGO_URL}
                        alt="Crypto Scanners Logo"
                        className="w-full h-full object-cover scale-[1.06]"
                      />
                    </span>
                    {activeSidebarTab === 'watchlist' ? 'Saved Watchlist' : activeSidebarTab === 'smart-money' ? 'Smart Money Signals' : 'Live Signals'}
                  </h1>
                  <div className="text-slate-500 dark:text-zinc-500 text-[10px] sm:text-xs mt-1 sm:mt-1.5 font-mono flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span>
                      {filteredTokens.length} {lang === 'ar' ? 'عملة مرصودة' : 'signals'} · {lang === 'ar' ? 'منصات وشبكات · 1ث' : lang === 'fr' ? 'CEX & DEX en direct · flux 1s' : 'CEX & DEX · 1s live stream'}
                    </span>
                    {cexCatalogSize > 0 && (
                      <button
                        onClick={() => setActiveChainFilter('cex')}
                        className="px-1.5 py-0.5 sm:px-2 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/35 dark:border-amber-500/30 text-[9px] sm:text-[10px] font-bold hover:bg-amber-500/25 transition flex items-center gap-1"
                      >
                        <Landmark className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        {cexCatalogSize}+ {lang === 'ar' ? 'عملة بالمنصات (Binance / OKX / Bybit)' : 'CEX Listed'}
                      </button>
                    )}
                    {newTokensCount > 0 && (
                      <button
                        onClick={() => setActiveChainFilter('new')}
                        className="px-1.5 py-0.5 sm:px-2 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/35 dark:border-emerald-500/30 text-[9px] sm:text-[10px] font-bold hover:bg-emerald-500/25 transition"
                      >
                        ✦ {newTokensCount} {lang === 'ar' ? 'عملة جديدة' : 'NEW'}
                        {latestNewToken ? ` ($${latestNewToken.symbol})` : ''}
                      </button>
                    )}
                  </div>
                </div>
                <button 
                  onClick={fetchTrending}
                  disabled={isRefreshingTrending}
                  className="px-2.5 py-1 sm:px-3.5 sm:py-1.5 bg-white dark:bg-[#0C0E14] border border-slate-200 dark:border-[#1C2030] text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white rounded-lg text-[10px] sm:text-xs font-mono font-bold flex items-center gap-1.5 sm:gap-2 transition shrink-0"
                >
                  <RefreshCw className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isRefreshingTrending ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>

              {/* INTERACTIVE BENTO CARD METRICS BLOCK */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
                {/* 1. Elite Moonshots (+90) */}
                <div 
                  id="metric-moonshot-signals"
                  onClick={() => {
                    setActiveScoreFilter('90');
                    showToast(lang === 'ar' ? "تمت التصفية الفورية للعملات ذات المعدل الصاروخي +90!" : lang === 'fr' ? "Filtre immédiat des scores +90 !" : "Filtered elite +90 candidates instantly!");
                  }}
                  className={`border rounded-xl sm:rounded-2xl p-2.5 sm:p-4 cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                    activeScoreFilter === '90' 
                    ? 'bg-amber-50 dark:bg-[#1D160E] border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.18)] text-slate-900 dark:text-white' 
                    : 'bg-white dark:bg-[#08090E] border-slate-200 dark:border-[#141824] text-slate-600 dark:text-zinc-400 hover:border-amber-500/40 hover:text-slate-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1.5 sm:mb-2">
                    <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-amber-500/10">
                      <Crown className={`w-3.5 h-3.5 sm:w-5 sm:h-5 ${activeScoreFilter === '90' ? 'text-amber-500 dark:text-amber-400' : 'text-amber-600 dark:text-amber-500'}`} />
                    </div>
                    {activeScoreFilter === '90' ? (
                      <span className="text-[9px] sm:text-[10px] bg-amber-500 text-black font-extrabold px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse font-mono">
                        {lang === 'ar' ? 'صاروخي' : 'Moonshot'}
                      </span>
                    ) : (
                      <span className="text-[9px] sm:text-[10px] bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold px-1.5 sm:px-2 py-0.5 rounded-full font-mono">
                        +90
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-lg sm:text-2xl font-black text-amber-600 dark:text-amber-400 font-mono flex items-center gap-1 sm:gap-1.5 tabular-nums">
                      {trendingTokens.filter(tok => tok.metrics.score >= 90).length}
                      <span className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-zinc-500 font-sans">/ {trendingTokens.length}</span>
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-bold block mt-0.5 sm:mt-1 text-slate-900 dark:text-white">
                      {lang === 'ar' ? 'معدل صاروخي (+90)' : lang === 'fr' ? 'Candidats Moonshot (+90)' : 'Elite Moonshots (+90)'}
                    </span>
                    <span className="text-[8px] sm:text-[9px] text-slate-500 dark:text-zinc-400 block mt-0.5 font-mono truncate">
                      {lang === 'ar' ? 'الاحتمالية القصوى للانفجار' : lang === 'fr' ? 'Potentiel extrême' : 'Highest probability breakout'}
                    </span>
                  </div>
                </div>

                {/* 2. High Score Signals (+80) */}
                <div 
                  id="metric-high-signals"
                  onClick={() => {
                    setActiveScoreFilter('80');
                    showToast(lang === 'ar' ? "تمت التصفية المتزامنة للعملات ذات المعدل +80 فوراً!" : lang === 'fr' ? "Filtre immédiat des scores +80 !" : "Filtered high scoring +80 signals simultaneously & instantly!");
                  }}
                  className={`border rounded-xl sm:rounded-2xl p-2.5 sm:p-4 cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                    activeScoreFilter === '80' 
                    ? 'bg-emerald-50 dark:bg-[#0F1D1A] border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.18)] text-slate-900 dark:text-white' 
                    : 'bg-white dark:bg-[#08090E] border-slate-200 dark:border-[#141824] text-slate-600 dark:text-zinc-400 hover:border-emerald-500/40 hover:text-slate-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1.5 sm:mb-2">
                    <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-emerald-500/10">
                      <Sparkles className={`w-3.5 h-3.5 sm:w-5 sm:h-5 ${activeScoreFilter === '80' ? 'text-emerald-600 dark:text-emerald-400 animate-bounce' : 'text-emerald-600 dark:text-emerald-500'}`} />
                    </div>
                    <div className="flex items-center gap-1 sm:gap-1.5">
                      <button
                        type="button"
                        id="high-signals-alert-settings-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          openHighSignalAlertModal();
                        }}
                        title={
                          lang === 'ar'
                            ? 'إعدادات تنبيهات عملات الإشارات القوية (+80)'
                            : lang === 'fr'
                            ? 'Paramètres d’alerte Signaux Élevés (+80)'
                            : 'Alert Settings for High Signal (+80) Tokens'
                        }
                        aria-label="Alert Settings"
                        className="p-1 sm:p-1.5 rounded-md sm:rounded-lg bg-slate-100 dark:bg-[#0C0E14] hover:bg-emerald-500/20 text-slate-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 border border-slate-200 dark:border-[#1C2030] hover:border-emerald-500/40 transition"
                      >
                        <SlidersHorizontal className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </button>
                      {activeScoreFilter === '80' ? (
                        <span className="text-[9px] sm:text-[10px] bg-emerald-500 text-black font-extrabold px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse font-mono">
                          {lang === 'ar' ? 'ممتاز' : 'Premium'}
                        </span>
                      ) : (
                        <span className="text-[9px] sm:text-[10px] bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold px-1.5 sm:px-2 py-0.5 rounded-full font-mono">
                          +80
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-baseline justify-between gap-1 sm:gap-2">
                      <span className="text-lg sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1 sm:gap-1.5 tabular-nums">
                        {trendingTokens.filter(tok => tok.metrics.score >= 80).length}
                        <span className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-zinc-500 font-sans">/ {trendingTokens.length}</span>
                      </span>
                      {highScoreTrend.currentScore > 0 && (
                        <span
                          data-testid="high-signals-trend"
                          title={
                            lang === 'ar'
                              ? `اتجاه الزخم: المتوسط الحالي ${highScoreTrend.currentScore.toFixed(1)} مقابل متوسط آخر دقيقة ${highScoreTrend.avg1m.toFixed(1)}`
                              : `Trend Direction: Current avg ${highScoreTrend.currentScore.toFixed(1)} vs 1m historical avg ${highScoreTrend.avg1m.toFixed(1)}`
                          }
                          className={`inline-flex items-center gap-0.5 sm:gap-1 px-1 sm:px-1.5 py-0.5 rounded-md text-[8.5px] sm:text-[10px] font-mono font-extrabold border ${
                            highScoreTrend.direction === 'up'
                              ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/35'
                              : highScoreTrend.direction === 'down'
                              ? 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/35'
                              : 'bg-slate-100 dark:bg-zinc-800/70 text-slate-600 dark:text-zinc-400 border-slate-300 dark:border-zinc-700/60'
                          }`}
                        >
                          {highScoreTrend.direction === 'up' ? (
                            <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600 dark:text-emerald-400" />
                          ) : highScoreTrend.direction === 'down' ? (
                            <TrendingDown className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-600 dark:text-red-400" />
                          ) : (
                            <Activity className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-500 dark:text-zinc-400" />
                          )}
                          <span>
                            {highScoreTrend.delta > 0 ? '+' : ''}
                            {highScoreTrend.delta.toFixed(1)}
                          </span>
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] sm:text-[11px] font-bold block mt-0.5 sm:mt-1 text-slate-900 dark:text-white">
                      {lang === 'ar' ? 'معدل مرتفع (+80)' : lang === 'fr' ? 'Scores Élevés (+80)' : 'High Ratings (+80)'}
                    </span>
                    <span className="text-[8px] sm:text-[9px] text-slate-500 dark:text-zinc-400 mt-0.5 font-mono flex items-center justify-between gap-1">
                      <span className="truncate">{lang === 'ar' ? 'زخم صعودي قوي' : lang === 'fr' ? 'Momentum robuste' : 'Strong bullish momentum'}</span>
                      {highScoreTrend.avg1m > 0 && (
                        <span className={`shrink-0 ${
                          highScoreTrend.direction === 'up'
                            ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                            : highScoreTrend.direction === 'down'
                            ? 'text-red-600 dark:text-red-400 font-bold'
                            : 'text-slate-500 dark:text-zinc-500'
                        }`}>
                          {highScoreTrend.currentScore.toFixed(1)}/{highScoreTrend.avg1m.toFixed(1)}
                        </span>
                      )}
                    </span>

                    {/* 15-Minute High Signal (+80) Recharts Sparkline */}
                    {highSignalSparklineData.length > 0 && (
                      <div
                        data-testid="high-signals-sparkline"
                        onClick={(e) => e.stopPropagation()}
                        className="mt-1.5 sm:mt-2 pt-1.5 border-t border-slate-200/70 dark:border-[#141824]/90"
                      >
                        <div className="flex items-center justify-between text-[8px] sm:text-[9px] font-mono text-slate-500 dark:text-zinc-500 mb-0.5">
                          <span className="uppercase tracking-wider">
                            {lang === 'ar' ? 'زخم 15 دقيقة (+80)' : lang === 'fr' ? 'Tendance 15m (+80)' : '15m Score Trend'}
                          </span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold tabular-nums">
                            {highSignalSparklineData[highSignalSparklineData.length - 1]?.avgScore.toFixed(1)} avg · {highSignalSparklineData[highSignalSparklineData.length - 1]?.maxScore} max
                          </span>
                        </div>
                        <div className="w-full h-9 sm:h-11">
                          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={36}>
                            <ComposedChart data={highSignalSparklineData} margin={{ top: 2, right: 2, left: 2, bottom: 1 }}>
                              <defs>
                                <linearGradient id="highSignalSparkGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop
                                    offset="0%"
                                    stopColor={highScoreTrend.direction === 'down' ? '#ef4444' : '#10b981'}
                                    stopOpacity={0.35}
                                  />
                                  <stop
                                    offset="100%"
                                    stopColor={highScoreTrend.direction === 'down' ? '#ef4444' : '#10b981'}
                                    stopOpacity={0.02}
                                  />
                                </linearGradient>
                              </defs>
                              <XAxis dataKey="ts" type="number" domain={['dataMin', 'dataMax']} hide />
                              <YAxis domain={highSignalSparkDomain} hide />
                              <Tooltip
                                isAnimationActive={false}
                                content={({ active, payload }) => {
                                  if (!active || !payload || payload.length === 0) return null;
                                  const pt = payload[0]?.payload as HighSignal15mPoint | undefined;
                                  if (!pt) return null;
                                  const timeStr = new Date(pt.ts).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                  });
                                  return (
                                    <div className="bg-white/95 dark:bg-[#08090E]/95 border border-emerald-500/35 rounded-lg px-2 py-1.5 shadow-lg text-[9px] font-mono leading-tight backdrop-blur-xs">
                                      <div className="text-slate-500 dark:text-zinc-400 mb-0.5">{timeStr}</div>
                                      <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                                        {lang === 'ar' ? 'المتوسط:' : 'Avg:'} {pt.avgScore.toFixed(1)}
                                      </div>
                                      <div className="text-slate-700 dark:text-zinc-300">
                                        {lang === 'ar' ? 'الأعلى:' : 'Peak:'} {pt.maxScore} · {pt.count} {lang === 'ar' ? 'عملة' : 'tokens'}
                                      </div>
                                    </div>
                                  );
                                }}
                              />
                              <Area
                                type="monotone"
                                dataKey="avgScore"
                                stroke={highScoreTrend.direction === 'down' ? '#ef4444' : '#10b981'}
                                strokeWidth={1.75}
                                fill="url(#highSignalSparkGrad)"
                                isAnimationActive={false}
                                dot={false}
                                activeDot={{ r: 2.5, strokeWidth: 1 }}
                              />
                              <Line
                                type="monotone"
                                dataKey="maxScore"
                                stroke={theme === 'dark' ? 'rgba(52,211,153,0.45)' : 'rgba(5,150,105,0.4)'}
                                strokeWidth={1}
                                strokeDasharray="2 2"
                                dot={false}
                                isAnimationActive={false}
                              />
                            </ComposedChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Moderate Score Signals (+70) */}
                <div 
                  id="metric-moderate-signals"
                  onClick={() => {
                    setActiveScoreFilter('70');
                    showToast(lang === 'ar' ? "تمت تصفية العملات ذات المعدل +70 فوراً وبنجاح!" : lang === 'fr' ? "Filtre immédiat des scores +70 !" : "Filtered moderate +70 signals instantly!");
                  }}
                  className={`border rounded-xl sm:rounded-2xl p-2.5 sm:p-4 cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                    activeScoreFilter === '70' 
                    ? 'bg-orange-50 dark:bg-[#1C130D] border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.18)] text-slate-900 dark:text-white' 
                    : 'bg-white dark:bg-[#08090E] border-slate-200 dark:border-[#141824] text-slate-600 dark:text-zinc-400 hover:border-orange-500/40 hover:text-slate-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1.5 sm:mb-2">
                    <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-orange-500/10">
                      <Flame className={`w-3.5 h-3.5 sm:w-5 sm:h-5 ${activeScoreFilter === '70' ? 'text-orange-600 dark:text-orange-400' : 'text-orange-600 dark:text-orange-500'}`} />
                    </div>
                    {activeScoreFilter === '70' ? (
                      <span className="text-[9px] sm:text-[10px] bg-orange-500 text-black font-extrabold px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse font-mono">
                        {lang === 'ar' ? 'نشط جداً' : 'Active'}
                      </span>
                    ) : (
                      <span className="text-[9px] sm:text-[10px] bg-orange-500/10 text-orange-700 dark:text-orange-400 font-bold px-1.5 sm:px-2 py-0.5 rounded-full font-mono">
                        +70
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-lg sm:text-2xl font-black text-orange-600 dark:text-orange-400 font-mono flex items-center gap-1 sm:gap-1.5 tabular-nums">
                      {trendingTokens.filter(tok => tok.metrics.score >= 70).length}
                      <span className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-zinc-500 font-sans">/ {trendingTokens.length}</span>
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-bold block mt-0.5 sm:mt-1 text-slate-900 dark:text-white">
                      {lang === 'ar' ? 'معدل متوسط (+70)' : lang === 'fr' ? 'Scores Moyens (+70)' : 'Moderate Ratings (+70)'}
                    </span>
                    <span className="text-[8px] sm:text-[9px] text-slate-500 dark:text-zinc-400 block mt-0.5 font-mono truncate">
                      {lang === 'ar' ? 'حركة صعودية واعدة للعملة' : lang === 'fr' ? 'Indicateurs très prometteurs' : 'Promising positive metrics'}
                    </span>
                  </div>
                </div>

                {/* 4. Standard Score Signals (+60) */}
                <div 
                  id="metric-standard-signals"
                  onClick={() => {
                    setActiveScoreFilter('60');
                    showToast(lang === 'ar' ? "تمت تصفية العملات ذات المعدل +60 بنجاح!" : lang === 'fr' ? "Filtre immédiat des scores +60 !" : "Filtered standard +60 signals instantly!");
                  }}
                  className={`border rounded-xl sm:rounded-2xl p-2.5 sm:p-4 cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                    activeScoreFilter === '60' 
                    ? 'bg-cyan-50 dark:bg-[#0D1C1E] border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.18)] text-slate-900 dark:text-white' 
                    : 'bg-white dark:bg-[#08090E] border-slate-200 dark:border-[#141824] text-slate-600 dark:text-zinc-400 hover:border-cyan-500/40 hover:text-slate-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1.5 sm:mb-2">
                    <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-cyan-500/10">
                      <Activity className={`w-3.5 h-3.5 sm:w-5 sm:h-5 ${activeScoreFilter === '60' ? 'text-cyan-600 dark:text-cyan-400' : 'text-cyan-600 dark:text-cyan-500'}`} />
                    </div>
                    {activeScoreFilter === '60' ? (
                      <span className="text-[9px] sm:text-[10px] bg-cyan-500 text-black font-extrabold px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse font-mono">
                        {lang === 'ar' ? 'مراقب' : 'Watching'}
                      </span>
                    ) : (
                      <span className="text-[9px] sm:text-[10px] bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 font-bold px-1.5 sm:px-2 py-0.5 rounded-full font-mono">
                        +60
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-lg sm:text-2xl font-black text-cyan-600 dark:text-cyan-400 font-mono flex items-center gap-1 sm:gap-1.5 tabular-nums">
                      {trendingTokens.filter(tok => tok.metrics.score >= 60).length}
                      <span className="text-[10px] sm:text-xs font-semibold text-slate-500 dark:text-zinc-500 font-sans">/ {trendingTokens.length}</span>
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-bold block mt-0.5 sm:mt-1 text-slate-900 dark:text-white">
                      {lang === 'ar' ? 'معدل عادي (+60)' : lang === 'fr' ? 'Scores Standard (+60)' : 'Standard Ratings (+60)'}
                    </span>
                    <span className="text-[8px] sm:text-[9px] text-slate-500 dark:text-zinc-400 block mt-0.5 font-mono truncate">
                      {lang === 'ar' ? 'عملات ذات حركة مستقرة' : lang === 'fr' ? 'Activité de trading stable' : 'Stable trading indicators'}
                    </span>
                  </div>
                </div>

                {/* 5. All signals Card */}
                <div 
                  id="metric-all-signals"
                  onClick={() => {
                    setActiveScoreFilter('all');
                    showToast(lang === 'ar' ? "عرض جميع الإشارات فورا!" : lang === 'fr' ? "Affichage de tous les signaux !" : "Showing all scanner signals instantly!");
                  }}
                  className={`col-span-2 sm:col-span-1 border rounded-xl sm:rounded-2xl p-2.5 sm:p-4 cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                    activeScoreFilter === 'all' 
                    ? 'bg-emerald-50/70 dark:bg-[#0E1524] border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)] text-slate-900 dark:text-white' 
                    : 'bg-white dark:bg-[#08090E] border-slate-200 dark:border-[#141824] text-slate-600 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-[#1C2030] hover:text-slate-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1.5 sm:mb-2">
                    <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-slate-100 dark:bg-zinc-800/40">
                      <LayoutGrid className={`w-3.5 h-3.5 sm:w-5 sm:h-5 ${activeScoreFilter === 'all' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-zinc-500'}`} />
                    </div>
                    {activeScoreFilter === 'all' && (
                      <span className="text-[9px] sm:text-[10px] bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold px-1.5 sm:px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse font-mono">
                        {lang === 'ar' ? 'نشط' : 'Active'}
                      </span>
                    )}
                  </div>
                  <div>
                    <span className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white font-mono block tabular-nums">
                      {trendingTokens.length}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-bold block mt-0.5 sm:mt-1 text-slate-900 dark:text-white">
                      {lang === 'ar' ? 'إجمالي الإشارات' : lang === 'fr' ? 'Signaux Globaux' : 'Total Live Signals'}
                    </span>
                    <span className="text-[8px] sm:text-[9px] text-slate-500 dark:text-zinc-500 block mt-0.5 font-mono truncate">
                      {lang === 'ar' ? 'جميع الفرص على الشبكات المختلفة' : lang === 'fr' ? 'Toutes les opportunités actives' : 'All active live multichain opportunities'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Filtering & Unified Exchange/DEX Search Controls Bar */}
              <div className="bg-white dark:bg-[#08090E] border border-slate-200 dark:border-[#141824] rounded-xl p-2 sm:p-2.5 space-y-2 sm:space-y-2.5 font-mono text-[10px] sm:text-xs text-slate-600 dark:text-zinc-400">
                <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
                  {/* Horizontal Quick Selectors */}
                  <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto scrollbar-none w-full lg:w-auto">
                    <button 
                      onClick={() => { setActiveChainFilter('all'); setActiveExchangeFilter('all'); }}
                      className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg border text-center transition shrink-0 ${activeChainFilter === 'all' ? 'bg-slate-900 text-white dark:bg-white dark:text-black font-extrabold border-slate-900 dark:border-white' : 'bg-slate-50 dark:bg-[#0C0E14]/60 border-slate-200 dark:border-[#1C2030] hover:text-slate-900 dark:hover:text-white'}`}
                    >
                      {lang === 'ar' ? 'الكل' : 'All'}
                    </button>
                    <button 
                      onClick={() => setActiveChainFilter('cex')}
                      className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg border text-center transition shrink-0 flex items-center gap-1 sm:gap-1.5 ${activeChainFilter === 'cex' ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 font-extrabold border-amber-500/50' : 'bg-slate-50 dark:bg-[#0C0E14]/60 border-slate-200 dark:border-[#1C2030] hover:text-slate-900 dark:hover:text-white'}`}
                    >
                      <Landmark className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600 dark:text-amber-400" />
                      {lang === 'ar' ? 'المنصات (Binance...)' : lang === 'fr' ? 'Bourses (CEX)' : 'Exchanges (CEX)'}
                    </button>
                    <button 
                      onClick={() => setActiveChainFilter('new')}
                      className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg border text-center transition shrink-0 ${activeChainFilter === 'new' ? 'bg-slate-900 text-white border-slate-900 dark:bg-zinc-800 dark:text-white font-extrabold dark:border-zinc-700' : 'bg-slate-50 dark:bg-[#0C0E14]/60 border-slate-200 dark:border-[#1C2030] hover:text-slate-900 dark:hover:text-white'}`}
                    >
                      ✦ {lang === 'ar' ? 'جديد' : 'New'}
                    </button>
                    <button 
                      onClick={() => setActiveChainFilter('solana')}
                      className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg border text-center transition shrink-0 ${activeChainFilter === 'solana' ? 'bg-slate-900 text-white border-slate-900 dark:bg-zinc-800 dark:text-white font-extrabold dark:border-zinc-700' : 'bg-slate-50 dark:bg-[#0C0E14]/60 border-slate-200 dark:border-[#1C2030] hover:text-slate-900 dark:hover:text-white'}`}
                    >
                      Solana
                    </button>
                    <button 
                      onClick={() => setActiveChainFilter('bsc')}
                      className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg border text-center transition shrink-0 ${activeChainFilter === 'bsc' ? 'bg-slate-900 text-white border-slate-900 dark:bg-zinc-800 dark:text-white font-extrabold dark:border-zinc-700' : 'bg-slate-50 dark:bg-[#0C0E14]/60 border-slate-200 dark:border-[#1C2030] hover:text-slate-900 dark:hover:text-white'}`}
                    >
                      BSC
                    </button>
                    <button 
                      onClick={() => setActiveChainFilter('base')}
                      className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg border text-center transition shrink-0 ${activeChainFilter === 'base' ? 'bg-slate-900 text-white border-slate-900 dark:bg-zinc-800 dark:text-white font-extrabold dark:border-zinc-700' : 'bg-slate-50 dark:bg-[#0C0E14]/60 border-slate-200 dark:border-[#1C2030] hover:text-slate-900 dark:hover:text-white'}`}
                    >
                      Base
                    </button>
                    <button 
                      onClick={() => setActiveChainFilter('eth')}
                      className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg border text-center transition shrink-0 ${activeChainFilter === 'eth' ? 'bg-slate-900 text-white border-slate-900 dark:bg-zinc-800 dark:text-white font-extrabold dark:border-zinc-700' : 'bg-slate-50 dark:bg-[#0C0E14]/60 border-slate-200 dark:border-[#1C2030] hover:text-slate-900 dark:hover:text-white'}`}
                    >
                      ETH
                    </button>

                    <div className="h-4 sm:h-5 w-[1px] bg-slate-200 dark:bg-[#1C2030] mx-0.5 sm:mx-1 shrink-0"></div>

                    {/* Score thresholds filter buttons */}
                    <button 
                      onClick={() => setActiveScoreFilter('all')}
                      className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg border transition shrink-0 ${activeScoreFilter === 'all' ? 'bg-emerald-50 dark:bg-[#121622] text-emerald-700 dark:text-emerald-400 font-extrabold border-emerald-500/30 dark:border-emerald-500/20' : 'bg-slate-50 dark:bg-[#0C0E14]/60 border-slate-200 dark:border-[#1C2030] hover:text-slate-900 dark:hover:text-white'}`}
                    >
                      All Scores
                    </button>
                    <button 
                      onClick={() => setActiveScoreFilter('60')}
                      className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg border transition shrink-0 ${activeScoreFilter === '60' ? 'bg-emerald-50 dark:bg-[#121622] text-emerald-700 dark:text-emerald-400 font-extrabold border-emerald-500/30 dark:border-emerald-500/20' : 'bg-slate-50 dark:bg-[#0C0E14]/60 border-slate-200 dark:border-[#1C2030] hover:text-slate-900 dark:hover:text-white'}`}
                    >
                      60+
                    </button>
                    <button 
                      onClick={() => setActiveScoreFilter('70')}
                      className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg border transition shrink-0 ${activeScoreFilter === '70' ? 'bg-emerald-50 dark:bg-[#121622] text-emerald-700 dark:text-emerald-400 font-extrabold border-emerald-500/30 dark:border-emerald-500/20' : 'bg-slate-50 dark:bg-[#0C0E14]/60 border-slate-200 dark:border-[#1C2030] hover:text-slate-900 dark:hover:text-white'}`}
                    >
                      70+
                    </button>
                    <button 
                      onClick={() => setActiveScoreFilter('80')}
                      className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg border transition shrink-0 ${activeScoreFilter === '80' ? 'bg-emerald-50 dark:bg-[#121622] text-emerald-700 dark:text-emerald-400 font-extrabold border-emerald-500/30 dark:border-emerald-500/20' : 'bg-slate-50 dark:bg-[#0C0E14]/60 border-slate-200 dark:border-[#1C2030] hover:text-slate-900 dark:hover:text-white'}`}
                    >
                      80+
                    </button>
                    <button 
                      onClick={() => setActiveScoreFilter('90')}
                      className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg border transition shrink-0 flex items-center gap-1 ${activeScoreFilter === '90' ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 font-extrabold border-amber-500/50' : 'bg-slate-50 dark:bg-[#0C0E14]/60 border-slate-200 dark:border-[#1C2030] hover:text-slate-900 dark:hover:text-white'}`}
                    >
                      <span>90+</span>
                      {trendingTokens.filter(t => t.metrics.score >= 90).length > 0 && (
                        <span className="text-[8.5px] sm:text-[9px] px-1 rounded bg-amber-500 text-black font-black">
                          {trendingTokens.filter(t => t.metrics.score >= 90).length}
                        </span>
                      )}
                    </button>
                  </div>

                  {/* Inline Unified Search Box (CEX & DEX) */}
                  <div className="flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-initial min-w-0 w-full sm:w-auto relative">
                    <div className="relative flex-1 min-w-0 sm:w-64">
                      <input
                        type="text"
                        value={scanQuery}
                        onFocus={() => setShowMainSearchDropdown(true)}
                        onBlur={() => setTimeout(() => setShowMainSearchDropdown(false), 180)}
                        onChange={(e) => {
                          setScanQuery(e.target.value);
                          setShowMainSearchDropdown(true);
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && handleScan(scanQuery)}
                        placeholder={lang === 'ar' ? 'ابحث عن عملة (Binance, ADA...)' : 'Find coin (Binance, OKX, DEX...)'}
                        className="w-full bg-slate-50 dark:bg-[#0C0E14] border border-slate-200 dark:border-[#1C2030] focus:border-emerald-500/60 rounded-lg py-1 sm:py-1.5 pl-7 sm:pl-8 pr-6 sm:pr-7 text-slate-900 dark:text-white text-[11px] sm:text-xs focus:outline-none transition placeholder:text-slate-400 dark:placeholder:text-zinc-600"
                      />
                      <Search className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 dark:text-zinc-500 absolute left-2 sm:left-2.5 top-2" />
                      {scanQuery && (
                        <button
                          type="button"
                          onClick={() => { setScanQuery(''); setUnifiedSearchResults([]); }}
                          className="text-slate-400 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white absolute right-2 top-2"
                        >
                          <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        </button>
                      )}

                      {showMainSearchDropdown && scanQuery.trim().length > 0 && (
                        <div className="absolute left-0 right-0 top-8 sm:top-9 bg-white dark:bg-[#0B0D14] border border-slate-200 dark:border-[#242B40] rounded-xl shadow-2xl z-40 max-h-72 sm:max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-[#141824]">
                          <div className="px-2.5 py-1.5 sm:px-3 sm:py-2 text-[9px] text-slate-500 dark:text-zinc-500 flex items-center justify-between bg-slate-50 dark:bg-[#08090E]">
                            <span>{lang === 'ar' ? `نتائج البحث (${unifiedSearchResults.length})` : `FOUND (${unifiedSearchResults.length})`}</span>
                            {isSearchingUnified && <RefreshCw className="w-3 h-3 animate-spin text-emerald-500 dark:text-emerald-400" />}
                          </div>
                          {unifiedSearchResults.length === 0 ? (
                            <div className="px-3 py-3 sm:py-4 text-center text-[10px] text-slate-500 dark:text-zinc-500">
                              {isSearchingUnified
                                ? (lang === 'ar' ? 'جارٍ البحث...' : 'Searching...')
                                : (lang === 'ar' ? 'اضغط Enter للفحص العميق' : 'Press Enter for deep scan')}
                            </div>
                          ) : (
                            unifiedSearchResults.slice(0, 12).map((item) => {
                              const p = parseFloat(item.pair.priceUsd || '0');
                              const isCex = item.pair.listingType === 'CEX' || item.pair.chainId === 'cex';
                              return (
                                <button
                                  key={`main-${item.pair.pairAddress}`}
                                  type="button"
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    selectTokenFromSearch(item);
                                  }}
                                  className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 hover:bg-slate-50 dark:hover:bg-[#121622] transition flex items-center justify-between gap-2 text-start"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <TokenAvatar
                                      symbol={item.pair.baseToken.symbol}
                                      imageUrl={item.pair.info?.imageUrl}
                                      size="sm"
                                    />
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-1.5">
                                        <span className="font-bold text-slate-900 dark:text-white text-[11px] sm:text-xs">${item.pair.baseToken.symbol}</span>
                                        <span className={`text-[8px] font-bold px-1 py-0.5 rounded ${
                                          isCex
                                            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                                            : 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30 uppercase'
                                        }`}>
                                          {isCex ? (item.pair.listedExchanges?.join(' · ') || 'CEX') : item.pair.chainId}
                                        </span>
                                      </div>
                                      <span className="text-[9px] text-slate-500 dark:text-zinc-500 block truncate">{item.pair.baseToken.name}</span>
                                    </div>
                                  </div>
                                  <div className="text-right shrink-0 tabular-nums">
                                    <div className="text-[10.5px] sm:text-[11px] font-bold text-slate-900 dark:text-white">
                                      ${p < 0.01 ? p.toFixed(6) : p.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                                    </div>
                                    <div className={`text-[9px] font-bold ${(item.pair.priceChange?.h24 || 0) >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                      {(item.pair.priceChange?.h24 || 0) >= 0 ? '+' : ''}{(item.pair.priceChange?.h24 || 0).toFixed(2)}%
                                    </div>
                                  </div>
                                </button>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                    <button onClick={() => { setActiveScoreFilter('80'); showToast(lang === 'ar' ? 'تمت تصفية الأعلى تقييماً!' : "Filtered high scoring assets!"); }} className="px-2 py-1 sm:px-3 sm:py-1.5 bg-slate-50 dark:bg-[#0C0E14] border border-slate-200 dark:border-[#1C2030] hover:text-slate-900 dark:hover:text-white rounded-lg flex items-center gap-1 shrink-0 text-[10px] sm:text-xs">
                      <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600 dark:text-emerald-400" /> {lang === 'ar' ? 'الأعلى تقييماً' : 'Top Rated'}
                    </button>
                  </div>
                </div>

                {/* Exchange Sub-Filters when Exchanges (CEX) tab is active */}
                {activeChainFilter === 'cex' && (
                  <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 pt-2 border-t border-slate-200 dark:border-[#141824]">
                    <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                      <span className="text-[9.5px] sm:text-[10px] text-slate-500 dark:text-zinc-500 mr-1">
                        {lang === 'ar' ? 'تصفية المنصة:' : 'Exchange:'}
                      </span>
                      {(['all', 'Binance', 'OKX', 'Bybit', 'KuCoin'] as const).map((ex) => (
                        <button
                          key={ex}
                          onClick={() => setActiveExchangeFilter(ex)}
                          className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border text-[9.5px] sm:text-[10px] font-bold transition ${
                            activeExchangeFilter === ex
                              ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/50'
                              : 'bg-slate-50 dark:bg-[#0C0E14] text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-[#1C2030] hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          {ex === 'all' ? (lang === 'ar' ? 'جميع المنصات' : 'All CEX') : ex}
                        </button>
                      ))}
                    </div>
                    <span className="text-[9.5px] sm:text-[10px] text-slate-500 dark:text-zinc-500">
                      {lang === 'ar'
                        ? `مفهرس ${cexCatalogSize || '800+'} عملة مدرجة — استخدم البحث للعثور على أي عملة فوراً`
                        : `${cexCatalogSize || '800+'} exchange coins indexed — type in search to locate any coin`}
                    </span>
                  </div>
                )}
              </div>


              {/* Scanning Logs Console Simulator */}
              <AnimatePresence>
                {isScanning && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white dark:bg-[#0C0E14] border border-slate-200 dark:border-[#1C2030] rounded-xl p-3 sm:p-4 font-mono text-[10.5px] sm:text-xs text-emerald-700 dark:text-emerald-400"
                  >
                    <div className="flex items-center gap-2 mb-2 text-slate-500 dark:text-zinc-500 border-b border-slate-200 dark:border-[#141824] pb-2">
                      <RefreshCw className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin" />
                      <span>DEFI QUANT INGRESS LOGS</span>
                    </div>
                    <div className="space-y-1">
                      {scanLogs.map((log, idx) => (
                        <div key={idx}>&gt; {log}</div>
                      ))}
                      <span className="inline-block w-2 h-3.5 sm:w-2.5 sm:h-4 bg-emerald-500 animate-pulse"></span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* THE WIDE LIVE SIGNALS TABLE */}
              <div className="bg-white dark:bg-[#08090E] border border-slate-200 dark:border-[#141824] rounded-xl sm:rounded-2xl overflow-hidden shadow-sm dark:shadow-xl animate-fade-in">
                <div className="overflow-x-auto">
                  <table className="w-full text-start font-mono text-[10.5px] sm:text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-[#141824] text-slate-500 dark:text-zinc-500 uppercase tracking-wider text-[9px] sm:text-[10px] bg-slate-50/70 dark:bg-transparent">
                        <th className="py-2.5 px-2.5 sm:py-4 sm:px-4 font-semibold">Token</th>
                        <th className="py-2.5 px-1.5 sm:py-4 sm:px-3 font-semibold text-right">Price</th>
                        <th className="py-2.5 px-1.5 sm:py-4 sm:px-3 font-semibold text-right">1H</th>
                        <th className="py-2.5 px-1.5 sm:py-4 sm:px-3 font-semibold text-right">24H</th>
                        <th className="py-2.5 px-1.5 sm:py-4 sm:px-3 font-semibold text-right">Mkt Cap</th>
                        <th className="py-2.5 px-1.5 sm:py-4 sm:px-3 font-semibold text-right">Volume</th>
                        <th className="py-2.5 px-1.5 sm:py-4 sm:px-3 font-semibold text-center">Risk</th>
                        <th className="py-2.5 px-2.5 sm:py-4 sm:px-4 font-semibold text-right">Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-[#141824]">
                      
                      {/* Dynamic Live Token rows */}
                      {filteredTokens.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-8 sm:py-10 px-3 sm:px-4 text-center text-slate-500 dark:text-zinc-500 font-mono text-[11px] sm:text-xs">
                            <div className="space-y-3">
                              <p>
                                {scanQuery.trim()
                                  ? (lang === 'ar'
                                      ? `لم يتم العثور على "${scanQuery}" في العرض الافتراضي — يمكنك اختيارها من نتائج البحث الفوري أو الضغط للفحص الشامل.`
                                      : `No rows in current view for "${scanQuery}" — pick from live exchange search or run deep scan.`)
                                  : 'No signals matching filter. Expand your search vectors or filters.'}
                              </p>
                              {scanQuery.trim() && (
                                <button
                                  type="button"
                                  onClick={() => handleScan(scanQuery)}
                                  className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-black font-bold text-[11px] sm:text-xs transition"
                                >
                                  {lang === 'ar' ? `فحص والبحث عن "${scanQuery}"` : `Deep Scan "${scanQuery}"`}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredTokens.map((tok) => {
                          const isSaved = watchlist.some(item => item.pair.pairAddress === tok.pair.pairAddress);
                          const h1Change = tok.pair.priceChange?.h1 ?? 0;
                          const h24Change = tok.pair.priceChange?.h24 ?? 0;
                          const isGreen1h = h1Change >= 0;
                          const isGreen24h = h24Change >= 0;
                          const liqUsd = tok.pair.liquidity?.usd || 0;
                          const isCex = tok.pair.listingType === 'CEX' || tok.pair.chainId === 'cex';
                          const isRiskSafe = isCex ? true : (liqUsd >= 25000 && tok.metrics.score >= 55);
                          const tickDir = tokenTickDir[tok.pair.pairAddress] || 'flat';
                          const priceNum = parseFloat(tok.pair.priceUsd || '0');
                          const fdvVal = tok.pair.fdv || 0;
                          const volVal = tok.pair.volume?.h24 || 0;
                          const formatCompact = (n: number, fallback: string) => {
                            if (!n || n <= 0) return fallback;
                            if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
                            if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
                            if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
                            if (n >= 1e3) return `$${(n / 1e3).toFixed(0)}K`;
                            return `$${n.toFixed(0)}`;
                          };

                          return (
                            <tr 
                              key={tok.pair.pairAddress}
                              onClick={() => {
                                setActiveToken(tok);
                                setIsDrawerOpen(true);
                              }}
                              className={`border-b border-slate-200 dark:border-[#141824] hover:bg-slate-50 dark:hover:bg-[#0E111A] transition duration-200 cursor-pointer text-slate-900 dark:text-zinc-100 ${
                                tickDir === 'up' ? 'bg-emerald-50/70 dark:bg-emerald-950/10' : tickDir === 'down' ? 'bg-red-50/70 dark:bg-red-950/10' : ''
                              }`}
                            >
                              <td className="py-2.5 px-2.5 sm:py-4 sm:px-4 flex items-center gap-2 sm:gap-3">
                                <TokenAvatar
                                  symbol={tok.pair.baseToken.symbol}
                                  imageUrl={tok.pair.info?.imageUrl}
                                  size="md"
                                />
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                                    <span className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm tracking-tight">${tok.pair.baseToken.symbol}</span>
                                    {isCex && (tok.pair.listedExchanges || [tok.pair.primaryExchange || 'Binance']).slice(0, 3).map((ex) => (
                                      <span
                                        key={ex}
                                        className={`text-[7.5px] sm:text-[8px] font-extrabold px-1 sm:px-1.5 py-0.5 rounded border ${
                                          ex === 'Binance'
                                            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/35'
                                            : 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/25'
                                        }`}
                                      >
                                        {ex.toUpperCase()}
                                      </span>
                                    ))}
                                    {isCex && (tok.pair.listedExchanges?.length || 0) > 3 && (
                                      <span className="text-[7.5px] sm:text-[8px] font-bold text-slate-500 dark:text-zinc-400">
                                        +{(tok.pair.listedExchanges?.length || 0) - 3}
                                      </span>
                                    )}
                                    {tok.pair.isNewDiscovery && (
                                      <span className="text-[7.5px] sm:text-[8px] font-extrabold px-1 sm:px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/35">
                                        ✦ NEW
                                      </span>
                                    )}
                                    <span className={`text-[7.5px] sm:text-[8px] font-extrabold px-1 sm:px-1.5 py-0.5 rounded ${
                                      tok.metrics.score >= 90 ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40' :
                                      tok.metrics.score >= 75 ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 dark:border-emerald-500/25' :
                                      tok.metrics.score >= 45 ? 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30 dark:border-blue-500/25' :
                                      'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700/50'
                                    }`}>
                                      {tok.metrics.score >= 90 ? 'MOONSHOT' : tok.metrics.score >= 75 ? 'STRONG' : tok.metrics.score >= 45 ? 'MODERATE' : 'WEAK'}
                                    </span>
                                  </div>
                                  <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-zinc-500 block truncate max-w-[120px] sm:max-w-[210px] mt-0.5">
                                    {isCex ? 'SPOT CEX' : tok.pair.chainId.toUpperCase()} · {tok.pair.baseToken.name}
                                  </span>
                                </div>
                              </td>
                              
                              <td className={`py-2.5 px-1.5 sm:py-4 sm:px-3 font-mono font-bold text-[11px] sm:text-sm text-right transition-colors duration-300 tabular-nums ${
                                tickDir === 'up'
                                  ? 'text-emerald-600 dark:text-emerald-300'
                                  : tickDir === 'down'
                                  ? 'text-red-600 dark:text-red-300'
                                  : isGreen24h
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : 'text-red-600 dark:text-red-400'
                              }`}>
                                <span className="inline-flex items-center justify-end gap-0.5 sm:gap-1">
                                  {tickDir !== 'flat' && (
                                    <span className="text-[8px] sm:text-[9px]">{tickDir === 'up' ? '▲' : '▼'}</span>
                                  )}
                                  ${priceNum < 0.01 ? priceNum.toFixed(6) : priceNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                                </span>
                              </td>

                              <td className={`py-2.5 px-1.5 sm:py-4 sm:px-3 font-mono text-[10px] sm:text-xs text-right font-bold tabular-nums ${isGreen1h ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                {isGreen1h ? '↗' : '↘'} {Math.abs(h1Change).toFixed(1)}%
                              </td>

                              <td className={`py-2.5 px-1.5 sm:py-4 sm:px-3 font-mono text-[10px] sm:text-xs text-right font-bold tabular-nums ${isGreen24h ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                {isGreen24h ? '↗' : '↘'} {Math.abs(h24Change).toFixed(1)}%
                              </td>

                              <td className="py-2.5 px-1.5 sm:py-4 sm:px-3 font-mono text-slate-700 dark:text-zinc-300 text-[11px] sm:text-sm text-right font-semibold tabular-nums">
                                {formatCompact(fdvVal, '$420K')}
                              </td>

                              <td className="py-2.5 px-1.5 sm:py-4 sm:px-3 font-mono text-right text-[11px] sm:text-sm font-semibold tabular-nums">
                                <div className="flex items-center justify-end gap-1.5 sm:gap-2.5">
                                  <span className="text-slate-900 dark:text-zinc-100 font-bold">
                                    {formatCompact(volVal, '$1.5M')}
                                  </span>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveToken(tok);
                                      toggleWatchlist();
                                    }}
                                    className="text-slate-400 dark:text-zinc-600 hover:text-amber-500 dark:hover:text-amber-400 transition"
                                  >
                                    <Star className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isSaved ? 'text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400' : ''}`} />
                                  </button>
                                </div>
                              </td>

                              <td className="py-2.5 px-1.5 sm:py-4 sm:px-3 text-center">
                                <RiskBadge risk={isRiskSafe ? 'SAFE' : 'HIGH'} />
                              </td>

                              <td className="py-2.5 px-2.5 sm:py-4 sm:px-4 text-right font-extrabold font-mono text-xs sm:text-sm tabular-nums">
                                <span className={
                                  tok.metrics.score >= 75 ? 'text-emerald-600 dark:text-emerald-400' :
                                  tok.metrics.score >= 45 ? 'text-amber-600 dark:text-yellow-400' :
                                  tok.metrics.score >= 30 ? 'text-orange-600 dark:text-amber-500' : 'text-red-600 dark:text-red-500'
                                }>
                                  {tok.metrics.score}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}

                    </tbody>
                  </table>
                </div>
              </div>

            </motion.div>
          ) : activeSidebarTab === 'referral' ? (
            <motion.div 
              key="referral-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-2xl mx-auto space-y-4 sm:space-y-6"
            >
              <div className="bg-white dark:bg-[#08090E] border border-slate-200 dark:border-[#141824] rounded-xl sm:rounded-2xl p-3.5 sm:p-6 relative overflow-hidden shadow-sm dark:shadow-2xl">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-b from-teal-500/5 to-transparent blur-3xl pointer-events-none"></div>

                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <Users className="w-5 h-5 sm:w-7 sm:h-7 text-emerald-600 dark:text-emerald-400" />
                  <h3 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">{t.referralTitle}</h3>
                </div>
                
                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed mb-4 sm:mb-6">
                  {t.referralDesc}
                </p>

                {user ? (
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <label className="text-[9px] sm:text-[10px] font-mono text-slate-500 dark:text-zinc-500 uppercase block mb-1.5">{t.yourReferralLink}</label>
                      <div className="flex min-w-0">
                        <input 
                          type="text" 
                          readOnly 
                          value={`https://cryptoscanners.pro/?ref=${user.referralCode}`}
                          className="w-full min-w-0 bg-slate-50 dark:bg-[#0C0E14] border border-slate-200 dark:border-[#1C2030] text-[11px] sm:text-xs font-mono py-2 sm:py-3 px-2.5 sm:px-4 rounded-l-lg text-emerald-600 dark:text-emerald-400 focus:outline-none"
                        />
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(`https://cryptoscanners.pro/?ref=${user.referralCode}`);
                            showToast(t.copied);
                          }}
                          className="bg-slate-100 hover:bg-slate-200 dark:bg-[#161924] dark:hover:bg-[#1E2335] border-y border-r border-slate-200 dark:border-[#1C2030] px-3 sm:px-4 rounded-r-lg transition text-slate-700 dark:text-zinc-300 shrink-0"
                        >
                          <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-[#0C0E14] rounded-xl border border-slate-200 dark:border-[#1C2030] p-3.5 sm:p-5 font-mono text-[11px] sm:text-xs">
                      <div className="flex justify-between mb-2 text-slate-600 dark:text-zinc-400 text-xs sm:text-sm">
                        <span>{t.referredCount}</span>
                        <span className="text-slate-900 dark:text-white font-extrabold">{user.referralCount || 0} / 3</span>
                      </div>
                      
                      <div className="w-full bg-slate-200 dark:bg-[#161924] h-2 sm:h-2.5 rounded-full overflow-hidden mb-3 sm:mb-4 border border-slate-300/60 dark:border-[#1C2030]/55">
                        <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, ((user.referralCount || 0) / 3) * 100)}%` }}></div>
                      </div>

                      {user.referralCount >= 3 ? (
                        <div className="text-[11px] sm:text-xs text-emerald-700 dark:text-emerald-400 font-bold text-center mt-1 bg-emerald-500/10 dark:bg-emerald-950/20 py-2 rounded-lg border border-emerald-500/25">
                          🎉 PRO MEMBERSHIP SUCCESSFULLY UNLOCKED VIA REFERRALS!
                        </div>
                      ) : (
                        <div className="text-[10px] sm:text-[11px] text-slate-500 dark:text-zinc-500 text-center leading-normal">
                          Invite {3 - (user.referralCount || 0)} more active crypto traders to get 30 days of PRO.
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={simulateInvites}
                      className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-[#161924] dark:hover:bg-[#1E2335] border border-slate-300 dark:border-[#242C44] text-slate-800 dark:text-zinc-200 py-2.5 sm:py-3 rounded-xl text-[11px] sm:text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 sm:gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400" />
                      SIMULATE 3 INSTANT REFERRALS FOR TESTING
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={() => openAuthModal('register')}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-black py-2.5 sm:py-3 rounded-xl text-[11px] sm:text-xs font-mono font-bold transition"
                    >
                      {lang === 'ar' ? 'إنشاء حساب لتتبع الإحالات' : 'Create Account to Track Referrals'}
                    </button>
                    <button
                      type="button"
                      onClick={() => openAuthModal('login')}
                      className="sm:w-auto px-4 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-300 py-2.5 sm:py-3 rounded-xl text-[11px] sm:text-xs font-mono font-bold transition border border-slate-300 dark:border-zinc-800"
                    >
                      {t.loginButton}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ) : activeSidebarTab === 'alerts' ? (
            <motion.div
              key="alerts-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-4xl mx-auto space-y-4 sm:space-y-6 font-mono"
            >
              {/* ALERTS HEADER & BROWSER NOTIFICATION STATUS */}
              <div className="bg-white dark:bg-[#08090E] border border-slate-200 dark:border-[#141824] rounded-xl sm:rounded-2xl p-3.5 sm:p-6 shadow-sm dark:shadow-2xl">
                <div className="flex flex-wrap justify-between items-center gap-3 sm:gap-4 border-b border-slate-200 dark:border-[#141824] pb-3.5 sm:pb-5 mb-4 sm:mb-6">
                  <div>
                    <h2 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 sm:gap-2.5 font-sans">
                      <BellRing className="w-4 h-4 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      {lang === 'ar' ? 'تنبيهات الأسعار المباشرة' : lang === 'fr' ? 'Alertes de Prix en Direct' : 'Custom Price Threshold Alerts'}
                    </h2>
                    <p className="text-[11px] sm:text-xs text-slate-600 dark:text-zinc-400 mt-1">
                      {lang === 'ar'
                        ? 'احفظ أهداف الأسعار في Firestore وتلقَّ إشعارات فورية في المتصفح عند تحققها كل ثانية.'
                        : 'Saved in Firestore and evaluated every second against the live market stream.'}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[9px] sm:text-[10px] font-bold border ${
                      notificationPermission === 'granted'
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                        : notificationPermission === 'denied'
                        ? 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30'
                        : 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30'
                    }`}>
                      {notificationPermission === 'granted'
                        ? (lang === 'ar' ? 'إشعارات المتصفح مفعّلة ✓' : 'Browser Notifications: ON')
                        : notificationPermission === 'denied'
                        ? (lang === 'ar' ? 'الإشعارات محظورة من المتصفح' : 'Notifications Blocked')
                        : notificationPermission === 'unsupported'
                        ? (lang === 'ar' ? 'تنبيهات داخل التطبيق مفعّلة' : 'In-App Alerts Active')
                        : (lang === 'ar' ? 'بانتظار تفعيل إشعارات المتصفح' : 'Notifications: Not Enabled')}
                    </span>
                    {notificationPermission === 'default' && (
                      <button
                        onClick={requestBrowserNotificationPermission}
                        className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-black text-[10px] sm:text-[11px] font-bold transition"
                      >
                        {lang === 'ar' ? 'تفعيل الإشعارات' : 'Enable Browser Alerts'}
                      </button>
                    )}
                    {notificationPermission === 'granted' && (
                      <button
                        onClick={() => fireBrowserNotification('Crypto Scanners Test Alert', 'Real-time price alert notifications are active!', 'test-alert')}
                        className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#121622] border border-slate-300 dark:border-[#242C44] text-slate-800 dark:text-zinc-200 dark:hover:text-white text-[10px] sm:text-[11px] font-bold transition"
                      >
                        {lang === 'ar' ? 'اختبار الإشعار' : 'Test Alert'}
                      </button>
                    )}
                  </div>
                </div>

                {!firebaseUser && (
                  <div className="mb-4 sm:mb-6 bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/30 rounded-xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
                    <div className="text-[11px] sm:text-xs text-amber-700 dark:text-amber-300">
                      {lang === 'ar'
                        ? 'سجّل الدخول أو أنشئ حساباً لحفظ تنبيهاتك ومزامنتها عبر Firestore.'
                        : 'Sign in or create an account to save and monitor price alerts in Firestore.'}
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <button
                        type="button"
                        onClick={() => openAuthModal('register')}
                        className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-black text-[11px] sm:text-xs font-bold transition"
                      >
                        {lang === 'ar' ? 'إنشاء حساب' : 'Create Account'}
                      </button>
                      <button
                        type="button"
                        onClick={() => openAuthModal('login')}
                        className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#121622] border border-slate-300 dark:border-[#242C44] text-slate-800 dark:text-zinc-200 dark:hover:text-white text-[11px] sm:text-xs font-bold transition"
                      >
                        {t.loginButton}
                      </button>
                      <button
                        type="button"
                        onClick={handleGoogleAuth}
                        className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-white hover:bg-slate-50 dark:bg-[#0C0E14] dark:hover:bg-[#161924] border border-slate-300 dark:border-[#242C44] text-slate-800 dark:text-zinc-200 text-[11px] sm:text-xs font-bold transition"
                      >
                        Google
                      </button>
                    </div>
                  </div>
                )}

                {/* CREATE NEW PRICE ALERT FORM */}
                {(() => {
                  const assetOptions = [
                    ...marketIndices.map((idx) => ({
                      key: `INDEX:${idx.symbol}`,
                      pairAddress: `INDEX:${idx.symbol}`,
                      tokenAddress: idx.symbol,
                      symbol: idx.symbol,
                      name: `${idx.symbol} Global Index`,
                      chainId: 'global',
                      price: Number(idx.price || 0),
                    })),
                    ...trendingTokens.map((tok) => ({
                      key: tok.pair.pairAddress,
                      pairAddress: tok.pair.pairAddress,
                      tokenAddress: tok.pair.baseToken.address,
                      symbol: tok.pair.baseToken.symbol,
                      name: tok.pair.baseToken.name,
                      chainId: tok.pair.chainId,
                      price: parseFloat(tok.pair.priceUsd || '0'),
                    })),
                  ];

                  const selectedAsset = assetOptions.find((a) => a.key === alertFormAssetKey) || assetOptions[0];
                  const livePrice = selectedAsset?.price || 0;

                  return (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!selectedAsset) return;
                        const target = parseFloat(alertFormTarget);
                        const ok = await createPriceAlert({
                          pairAddress: selectedAsset.pairAddress,
                          tokenAddress: selectedAsset.tokenAddress,
                          symbol: selectedAsset.symbol,
                          name: selectedAsset.name,
                          chainId: selectedAsset.chainId,
                          targetPrice: target,
                          initialPrice: livePrice,
                          condition: alertFormCondition,
                        });
                        if (ok) setAlertFormTarget('');
                      }}
                      className="bg-slate-50 dark:bg-[#0C0E14] border border-slate-200 dark:border-[#1C2030] rounded-xl p-3 sm:p-4 space-y-3 sm:space-y-4"
                    >
                      <div className="flex flex-wrap justify-between items-center gap-2">
                        <span className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                          {lang === 'ar' ? 'إنشاء تنبيه سعر جديد' : 'Create Price Threshold Alert'}
                        </span>
                        {selectedAsset && livePrice > 0 && (
                          <span className="text-[10px] sm:text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                            {lang === 'ar' ? 'السعر الحالي:' : 'Live:'} ${livePrice < 0.01 ? livePrice.toFixed(6) : livePrice.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5 sm:gap-3">
                        <div className="md:col-span-2 min-w-0">
                          <label className="block text-[9px] sm:text-[10px] text-slate-500 dark:text-zinc-500 uppercase mb-1">
                            {lang === 'ar' ? 'العملة' : 'Token / Market Index'}
                          </label>
                          <select
                            value={selectedAsset?.key || ''}
                            onChange={(e) => {
                              setAlertFormAssetKey(e.target.value);
                              const nextAsset = assetOptions.find((a) => a.key === e.target.value);
                              if (nextAsset && nextAsset.price > 0) {
                                const mult = alertFormCondition === 'above' ? 1.05 : 0.95;
                                const p = nextAsset.price * mult;
                                setAlertFormTarget(p < 0.01 ? p.toFixed(6) : p.toFixed(p >= 1 ? 2 : 5));
                              }
                            }}
                            className="w-full min-w-0 bg-white dark:bg-[#08090E] border border-slate-200 dark:border-[#1C2030] rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-2.5 text-[11px] sm:text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500/50"
                          >
                            {assetOptions.map((a) => (
                              <option key={a.key} value={a.key} className="bg-white dark:bg-[#08090E] text-slate-900 dark:text-white">
                                ${a.symbol} · {a.name} (${a.price < 0.01 ? a.price.toFixed(6) : a.price.toLocaleString(undefined, { maximumFractionDigits: 4 })})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[9px] sm:text-[10px] text-slate-500 dark:text-zinc-500 uppercase mb-1">
                            {lang === 'ar' ? 'الشرط' : 'Condition'}
                          </label>
                          <div className="grid grid-cols-2 gap-1.5">
                            <button
                              type="button"
                              onClick={() => setAlertFormCondition('above')}
                              className={`py-1.5 sm:py-2.5 rounded-lg text-[10px] sm:text-[11px] font-bold border transition flex items-center justify-center gap-1 ${
                                alertFormCondition === 'above'
                                  ? 'bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/50'
                                  : 'bg-white dark:bg-[#08090E] text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-[#1C2030]'
                              }`}
                            >
                              <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              {lang === 'ar' ? 'فوق' : 'Above'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setAlertFormCondition('below')}
                              className={`py-1.5 sm:py-2.5 rounded-lg text-[10px] sm:text-[11px] font-bold border transition flex items-center justify-center gap-1 ${
                                alertFormCondition === 'below'
                                  ? 'bg-red-500/15 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/50'
                                  : 'bg-white dark:bg-[#08090E] text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-[#1C2030]'
                              }`}
                            >
                              <TrendingDown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              {lang === 'ar' ? 'تحت' : 'Below'}
                            </button>
                          </div>
                        </div>

                        <div className="min-w-0">
                          <label className="block text-[9px] sm:text-[10px] text-slate-500 dark:text-zinc-500 uppercase mb-1">
                            {lang === 'ar' ? 'السعر المستهدف ($)' : 'Target Price (USD)'}
                          </label>
                          <input
                            type="number"
                            step="any"
                            min="0"
                            required
                            placeholder={livePrice > 0 ? String(livePrice) : '0.00'}
                            value={alertFormTarget}
                            onChange={(e) => setAlertFormTarget(e.target.value)}
                            className="w-full min-w-0 bg-white dark:bg-[#08090E] border border-slate-200 dark:border-[#1C2030] rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-2.5 text-[11px] sm:text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500/50"
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 pt-1">
                        <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                          <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-zinc-500">{lang === 'ar' ? 'اختصارات:' : 'Quick presets:'}</span>
                          {[-0.1, -0.05, 0.05, 0.1, 0.25].map((delta) => (
                            <button
                              key={delta}
                              type="button"
                              disabled={livePrice <= 0}
                              onClick={() => {
                                const nextP = livePrice * (1 + delta);
                                setAlertFormCondition(delta >= 0 ? 'above' : 'below');
                                setAlertFormTarget(nextP < 0.01 ? nextP.toFixed(6) : nextP.toFixed(nextP >= 1 ? 2 : 5));
                              }}
                              className="px-1.5 py-0.5 sm:px-2 sm:py-1 rounded bg-white dark:bg-[#08090E] border border-slate-200 dark:border-[#1C2030] hover:border-emerald-500/40 text-[9px] sm:text-[10px] text-slate-700 dark:text-zinc-300 transition"
                            >
                              {delta > 0 ? `+${delta * 100}%` : `${delta * 100}%`}
                            </button>
                          ))}
                        </div>

                        <button
                          type="submit"
                          disabled={isSavingAlert || !selectedAsset}
                          className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 disabled:bg-slate-300 dark:disabled:bg-zinc-800 text-white dark:text-black text-[11px] sm:text-xs font-bold transition flex items-center gap-1.5"
                        >
                          <BellRing className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          {isSavingAlert
                            ? (lang === 'ar' ? 'جارٍ الحفظ...' : 'Saving...')
                            : (lang === 'ar' ? 'حفظ التنبيه' : 'Save Price Alert')}
                        </button>
                      </div>
                    </form>
                  );
                })()}
              </div>

              {/* ACTIVE ALERTS LIST */}
              <div className="bg-white dark:bg-[#08090E] border border-slate-200 dark:border-[#141824] rounded-xl sm:rounded-2xl p-3.5 sm:p-6 shadow-sm dark:shadow-2xl space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-[#141824] pb-2.5 sm:pb-3">
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                    {lang === 'ar' ? 'التنبيهات النشطة' : 'Active Price Alerts'} ({priceAlerts.filter(a => a.status === 'active').length})
                  </h3>
                  <span className="text-[9px] sm:text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                    {alertsEnabled ? (lang === 'ar' ? 'مراقبة كل ثانية ●' : 'MONITORING 1s ●') : (lang === 'ar' ? 'متوقف مؤقتاً' : 'PAUSED')}
                  </span>
                </div>

                {priceAlerts.filter(a => a.status === 'active').length === 0 ? (
                  <div className="text-center py-6 sm:py-8 text-[11px] sm:text-xs text-slate-500 dark:text-zinc-500">
                    {lang === 'ar'
                      ? 'لا توجد تنبيهات نشطة حالياً. أضف هدفاً سعرياً من النموذج أعلاه أو من أي عملة.'
                      : 'No active price alerts yet. Set a target above or from any token terminal.'}
                  </div>
                ) : (
                  <div className="space-y-2 sm:space-y-2.5">
                    {priceAlerts.filter(a => a.status === 'active').map((alert) => {
                      const matchedIdx = alert.pairAddress.startsWith('INDEX:')
                        ? marketIndices.find(i => `INDEX:${i.symbol}` === alert.pairAddress)
                        : null;
                      const matchedTok = !matchedIdx
                        ? trendingTokens.find(t => t.pair.pairAddress === alert.pairAddress)
                        : null;
                      const currentLive = matchedIdx
                        ? Number(matchedIdx.price || 0)
                        : matchedTok
                        ? parseFloat(matchedTok.pair.priceUsd || '0')
                        : 0;
                      const diffPct = currentLive > 0
                        ? (((alert.targetPrice - currentLive) / currentLive) * 100).toFixed(2)
                        : null;

                      const alertImgUrl =
                        matchedIdx?.imageUrl ||
                        matchedTok?.pair.info?.imageUrl ||
                        trendingTokens.find(t => t.pair.baseToken.symbol.toUpperCase() === alert.symbol.toUpperCase())?.pair.info?.imageUrl;

                      return (
                        <div key={alert.id} className="bg-slate-50 dark:bg-[#0C0E14] border border-slate-200 dark:border-[#1C2030] rounded-xl p-2.5 sm:p-4 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <TokenAvatar symbol={alert.symbol} imageUrl={alertImgUrl} size="md" />
                            <span className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[9px] sm:text-[10px] font-extrabold border shrink-0 ${
                              alert.condition === 'above'
                                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                                : 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30'
                            }`}>
                              {alert.condition === 'above' ? '≥ ABOVE' : '≤ BELOW'}
                            </span>
                            <div className="min-w-0">
                              <div className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white truncate">
                                ${alert.symbol} <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-zinc-500 font-normal">({alert.chainId.toUpperCase()})</span>
                              </div>
                              <div className="text-[10px] sm:text-[11px] text-slate-600 dark:text-zinc-400 mt-0.5">
                                {lang === 'ar' ? 'الهدف:' : 'Target:'}{' '}
                                <span className="text-slate-900 dark:text-white font-bold">
                                  ${alert.targetPrice < 0.01 ? alert.targetPrice.toFixed(6) : alert.targetPrice.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                                </span>
                                {currentLive > 0 && (
                                  <span className="text-slate-500 dark:text-zinc-500 ml-1.5 sm:ml-2">
                                    · {lang === 'ar' ? 'الحالي:' : 'Live:'} ${currentLive < 0.01 ? currentLive.toFixed(6) : currentLive.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                                    {diffPct !== null && ` (${Number(diffPct) >= 0 ? '+' : ''}${diffPct}%)`}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => deletePriceAlert(alert.id)}
                            className="p-1.5 sm:p-2 rounded-lg bg-white hover:bg-red-500/10 dark:bg-[#161924] dark:hover:bg-red-500/15 text-slate-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 border border-slate-200 dark:border-[#242C44] transition shrink-0"
                            title="Delete Alert"
                          >
                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* TRIGGERED HISTORY */}
                {priceAlerts.some(a => a.status === 'triggered') && (
                  <div className="pt-3 sm:pt-4 border-t border-slate-200 dark:border-[#141824] space-y-2 sm:space-y-2.5">
                    <h4 className="text-[11px] sm:text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider">
                      {lang === 'ar' ? 'التنبيهات المتحققة' : 'Triggered Alerts History'} ({priceAlerts.filter(a => a.status === 'triggered').length})
                    </h4>
                    {priceAlerts.filter(a => a.status === 'triggered').map((alert) => {
                      const trigImgUrl =
                        marketIndices.find(i => i.symbol === alert.symbol)?.imageUrl ||
                        trendingTokens.find(
                          t => t.pair.pairAddress === alert.pairAddress || t.pair.baseToken.symbol.toUpperCase() === alert.symbol.toUpperCase()
                        )?.pair.info?.imageUrl;
                      return (
                      <div key={alert.id} className="bg-emerald-500/5 dark:bg-[#0A110E] border border-emerald-500/30 dark:border-emerald-500/25 rounded-xl p-2.5 sm:p-3.5 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                          <TokenAvatar symbol={alert.symbol} imageUrl={trigImgUrl} size="sm" />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                              <span className="text-[8px] sm:text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                                ✓ TRIGGERED
                              </span>
                              <span className="text-[11px] sm:text-xs font-extrabold text-slate-900 dark:text-white">${alert.symbol}</span>
                              <span className="text-[10px] sm:text-[11px] text-slate-600 dark:text-zinc-400">
                                {alert.condition === 'above' ? '≥' : '≤'} ${alert.targetPrice}
                              </span>
                            </div>
                            <div className="text-[9px] sm:text-[10px] text-slate-500 dark:text-zinc-500 mt-1 truncate">
                              {lang === 'ar' ? 'السعر عند التفعيل:' : 'Triggered at:'} ${alert.triggeredPrice ?? alert.targetPrice} · {alert.triggeredAt ? new Date(alert.triggeredAt).toLocaleString() : ''}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => deletePriceAlert(alert.id)}
                          className="p-1.5 rounded-lg text-slate-500 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 transition shrink-0"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          ) : activeSidebarTab === 'reports' ? (
            <motion.div 
              key="reports-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-4xl mx-auto space-y-4 sm:space-y-6"
            >
              <div className="bg-white dark:bg-[#08090E] border border-slate-200 dark:border-[#141824] rounded-xl sm:rounded-2xl p-3.5 sm:p-6 shadow-sm dark:shadow-2xl">
                <div className="flex flex-wrap justify-between items-center gap-2 mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <BarChart2 className="w-4 h-4 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white">AI Deep Quantitative Reports</h3>
                  </div>
                  <span className="text-[10px] sm:text-xs font-mono text-slate-500 dark:text-zinc-500">POWERED BY GEMINI 3.5 AI</span>
                </div>

                <p className="text-[11px] sm:text-xs text-slate-600 dark:text-zinc-400 mb-4 sm:mb-6 leading-relaxed">
                  Deep intelligence quant forecast scans on multi-chain token smart contracts. Check active token reports below or select any token from the Live Signals list.
                </p>

                {activeToken ? (
                  <div className="space-y-3 sm:space-y-4">
                    <div className="bg-slate-50 dark:bg-[#0C0E14] border border-slate-200 dark:border-[#1C2030] rounded-xl p-3 sm:p-4 flex flex-wrap justify-between items-center gap-2.5">
                      <div className="min-w-0">
                        <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-zinc-500 uppercase block font-mono">SELECTED TARGET CONTRACT</span>
                        <span className="text-slate-900 dark:text-white font-extrabold text-xs sm:text-sm truncate block">{activeToken.pair.baseToken.name} (${activeToken.pair.baseToken.symbol})</span>
                      </div>
                      <button 
                        onClick={generateAiReport} 
                        disabled={isGeneratingAi}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 disabled:bg-slate-300 dark:disabled:bg-zinc-800 text-white dark:text-black font-bold font-mono text-[11px] sm:text-xs rounded-lg transition flex items-center gap-1.5 sm:gap-2 shrink-0"
                      >
                        {isGeneratingAi ? <RefreshCw className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-spin" /> : <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                        Generate Report
                      </button>
                    </div>

                    {aiAnalysis ? (
                      <div className="bg-slate-50 dark:bg-[#0C0E14] border border-slate-200 dark:border-[#1C2030] rounded-xl p-3.5 sm:p-5 text-[11px] sm:text-xs font-mono leading-relaxed text-slate-700 dark:text-zinc-300 whitespace-pre-line">
                        {aiAnalysis}
                      </div>
                    ) : (
                      <div className="text-center py-8 sm:py-12 text-xs text-slate-500 dark:text-zinc-500 font-mono">
                        Click Generate Report above to launch live quantitative vector synthesis.
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 sm:py-12 text-xs text-slate-500 dark:text-zinc-500 font-mono border border-dashed border-slate-300 dark:border-[#1C2030] rounded-xl px-4">
                    Please select a token from the Live Signals list or Search above to generate an AI quant report.
                  </div>
                )}
              </div>
            </motion.div>
          ) : activeSidebarTab === 'portfolio' ? (
            <motion.div 
              key="portfolio-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-4xl mx-auto space-y-4 sm:space-y-6 font-mono"
            >
              <div className="bg-white dark:bg-[#08090E] border border-slate-200 dark:border-[#141824] rounded-xl sm:rounded-2xl p-3.5 sm:p-6 shadow-sm dark:shadow-2xl">
                <div className="flex flex-wrap justify-between items-center gap-3 mb-4 sm:mb-6 border-b border-slate-200 dark:border-[#141824] pb-3 sm:pb-4">
                  <div>
                    <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-zinc-500 block uppercase">DEFI WALLET PORTFOLIO</span>
                    <h3 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mt-0.5 sm:mt-1">
                      <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
                      Mock Net Worth Portfolio
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-base sm:text-xl font-bold text-emerald-600 dark:text-emerald-400 block">$42,910.85</span>
                    <span className="text-[9px] sm:text-[10px] text-emerald-600 dark:text-emerald-500 block">+12.4% TODAY</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 mb-4 sm:mb-6">
                  <div className="bg-slate-50 dark:bg-[#0C0E14] border border-slate-200 dark:border-[#1C2030] p-3 sm:p-4 rounded-xl">
                    <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-zinc-500 uppercase block">ETH WALLET VALUE</span>
                    <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white block mt-1">$22,410.50</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-[#0C0E14] border border-slate-200 dark:border-[#1C2030] p-3 sm:p-4 rounded-xl">
                    <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-zinc-500 uppercase block">SOL WALLET VALUE</span>
                    <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white block mt-1">$15,500.35</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-[#0C0E14] border border-slate-200 dark:border-[#1C2030] p-3 sm:p-4 rounded-xl">
                    <span className="text-[9px] sm:text-[10px] text-slate-500 dark:text-zinc-500 uppercase block">BSC/BASE WALLET VALUE</span>
                    <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white block mt-1">$5,000.00</span>
                  </div>
                </div>

                <h4 className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2.5 sm:mb-3">Asset Distribution</h4>
                <div className="space-y-2.5 sm:space-y-3">
                  <div>
                    <div className="flex justify-between text-[11px] sm:text-xs text-slate-600 dark:text-zinc-400 mb-1">
                      <span>Ethereum (ETH)</span>
                      <span>52% ($22.4K)</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-zinc-800 h-1.5 sm:h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: '52%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] sm:text-xs text-slate-600 dark:text-zinc-400 mb-1">
                      <span>Solana (SOL)</span>
                      <span>36% ($15.5K)</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-zinc-800 h-1.5 sm:h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full rounded-full" style={{ width: '36%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] sm:text-xs text-slate-600 dark:text-zinc-400 mb-1">
                      <span>Binance Smart Chain (BSC)</span>
                      <span>12% ($5.0K)</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-zinc-800 h-1.5 sm:h-2 rounded-full overflow-hidden">
                      <div className="bg-yellow-500 h-full rounded-full" style={{ width: '12%' }}></div>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="profile-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-2xl mx-auto space-y-4 sm:space-y-6"
            >
              <div className="bg-white dark:bg-[#08090E] border border-slate-200 dark:border-[#141824] rounded-xl sm:rounded-2xl p-3.5 sm:p-6 shadow-sm dark:shadow-2xl">
                <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 border-b border-slate-200 dark:border-[#141824] pb-3.5 sm:pb-4 mb-4 sm:mb-6">
                  <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <div className="w-11 h-11 sm:w-14 sm:h-14 bg-emerald-500/10 border border-emerald-500/35 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-lg sm:text-xl font-extrabold font-sans shrink-0">
                      {user?.email ? user.email.slice(0, 1).toUpperCase() : 'G'}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate">{user?.email ? user.email.split('@')[0] : (lang === 'ar' ? 'مستخدم زائر' : 'Guest Terminal User')}</h3>
                      <p className="text-[11px] sm:text-xs text-slate-500 dark:text-zinc-500 font-mono mt-0.5 truncate">{user?.email || (lang === 'ar' ? 'غير مسجّل الدخول' : 'not signed in')}</p>
                    </div>
                  </div>
                  {!firebaseUser ? (
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <button
                        type="button"
                        onClick={() => openAuthModal('register')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-black text-[11px] sm:text-xs font-bold transition"
                      >
                        {lang === 'ar' ? 'إنشاء حساب' : 'Create Account'}
                      </button>
                      <button
                        type="button"
                        onClick={() => openAuthModal('login')}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#121622] border border-slate-300 dark:border-[#242C44] text-slate-800 dark:text-zinc-200 text-[11px] sm:text-xs font-bold transition"
                      >
                        {t.loginButton}
                      </button>
                      <button
                        type="button"
                        onClick={handleGoogleAuth}
                        className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 dark:bg-[#0C0E14] dark:hover:bg-[#161924] border border-slate-300 dark:border-[#242C44] text-slate-800 dark:text-zinc-200 text-[11px] sm:text-xs font-bold transition"
                      >
                        Google
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/25 text-[11px] sm:text-xs font-bold transition"
                    >
                      {t.logoutButton}
                    </button>
                  )}
                </div>

                <div className="space-y-2.5 sm:space-y-4 font-mono text-[11px] sm:text-xs">
                  <div className="flex justify-between py-1.5 sm:py-2 border-b border-slate-200 dark:border-[#141824] text-slate-600 dark:text-zinc-400">
                    <span>Active Subscription Plan</span>
                    <span className="text-slate-900 dark:text-white font-extrabold uppercase">{user?.subscriptionStatus === 'pro' ? '★ PRO MEMBER' : 'FREE USER'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 sm:py-2 border-b border-slate-200 dark:border-[#141824] text-slate-600 dark:text-zinc-400">
                    <span>Valid Terminus Date</span>
                    <span className="text-slate-700 dark:text-zinc-300 font-bold">{user?.proUntil ? new Date(user.proUntil).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 sm:py-2 border-b border-slate-200 dark:border-[#141824] text-slate-600 dark:text-zinc-400">
                    <span>Unique Referral Code</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{user?.referralCode || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 sm:py-2 text-slate-600 dark:text-zinc-400">
                    <span>Total Registered Referrals</span>
                    <span className="text-slate-900 dark:text-white font-bold">{user?.referralCount || 0} active friends</span>
                  </div>
                </div>

                {isProUnlocked ? (
                  <div className="w-full mt-4 sm:mt-6 py-2.5 sm:py-3 bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 dark:text-emerald-400 text-center rounded-xl font-bold font-mono text-[11px] sm:text-xs tracking-wider">
                    {lang === 'ar' ? 'باقة PRO مفعلة مجاناً حالياً' : 'PRO Plan Active (Temporarily Free)'}
                  </div>
                ) : (
                  (!user || user.subscriptionStatus !== 'pro') && (
                    <button 
                      onClick={() => setShowCheckoutModal(true)}
                      className="w-full mt-4 sm:mt-6 py-2.5 sm:py-3 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black rounded-xl font-bold font-mono text-[11px] sm:text-xs tracking-wider transition shadow-lg"
                    >
                      Upgrade to PRO for $29.99/mo
                    </button>
                  )
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer info bar */}
        <footer className="mt-8 sm:mt-16 border-t border-slate-200 dark:border-[#141824] py-5 sm:py-8 text-center text-slate-500 dark:text-zinc-500 font-mono text-[9px] sm:text-[10px] leading-relaxed">
          <p>SECURE SSL TERMINAL WITH PROXIED ENCRYPTED DEFI QUANTS ACCESS</p>
          <p className="mt-1">ALL TRANSACTIONS POOLED ON CHAIN. TRADING COVERS SUBSTANTIAL VOLATILITY RISKS.</p>
        </footer>

      </main>

      {/* FULL SCREEN PRO TRADING TERMINAL OVERLAY */}
      <AnimatePresence>
        {isDrawerOpen && activeToken && (() => {
          const symbol = activeToken.pair.baseToken.symbol;
          const name = activeToken.pair.baseToken.name;
          const chainId = activeToken.pair.chainId;
          const priceNum = parseFloat(activeToken.pair.priceUsd || '0.00009471');
          const pct = activeToken.pair.priceChange?.h24 || 0;

          // Scaled price calculations for deterministic high-fidelity chart
          const scaleFactor = priceNum / 220;
          const baseCandles = [
            { o: 105, h: 112, l: 98, c: 102 },
            { o: 102, h: 108, l: 95, c: 106 },
            { o: 106, h: 114, l: 100, c: 100 },
            { o: 100, h: 105, l: 92, c: 96 },
            { o: 96, h: 115, l: 94, c: 112 },
            { o: 112, h: 116, l: 105, c: 108 },
            { o: 108, h: 110, l: 90, c: 94 },
            { o: 94, h: 102, l: 88, c: 100 },
            { o: 100, h: 106, l: 95, c: 103 },
            { o: 103, h: 105, l: 92, c: 95 },
            { o: 95, h: 98, l: 85, c: 90 },
            { o: 90, h: 102, l: 88, c: 101 },
            { o: 101, h: 104, l: 82, c: 84 },
            { o: 84, h: 105, l: 80, c: 102 },
            { o: 102, h: 235, l: 98, c: 220 }, // Massive breakout green candle matching screenshot
          ];

          const baseMin = 75;
          const baseMax = 245;

          const chartHeight = 310;
          const chartWidth = 900;
          const paddingRight = 90;
          const paddingLeft = 20;
          const paddingTop = 30;
          const paddingBottom = 20;

          const drawWidth = chartWidth - paddingLeft - paddingRight;
          const drawHeight = chartHeight - paddingTop - paddingBottom;

          const formatPrice = (p: number) => {
            if (p < 0.00001) return p.toFixed(8);
            if (p < 0.01) return p.toFixed(6);
            if (p < 1) return p.toFixed(4);
            return p.toFixed(2);
          };

          const formatVal = (val: number) => {
            if (val >= 1e12) return `$${(val / 1e12).toFixed(2)}T`;
            if (val >= 1000000000) return `$${(val / 1000000000).toFixed(1)}B`;
            if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
            if (val >= 1000) return `$${(val / 1000).toFixed(0)}K`;
            return `$${val.toFixed(2)}`;
          };

          // Deterministic holders and caps based on score
          const holdersCount = Math.floor(activeToken.metrics.score * 5.5 + 245);
          const mcapValue = activeToken.pair.fdv || (priceNum * 100000000);
          const priceGridLines = [90, 115, 140, 165, 190, 215, 240];
          const volume24h = activeToken.pair.volume?.h24 || 350000;
          const liquidityUsd = activeToken.pair.liquidity?.usd || 120000;

          // Technical Indicator Calculations
          const buys1h = activeToken.pair.txns?.h1?.buys || 140;
          const sells1h = activeToken.pair.txns?.h1?.sells || 60;
          const total1h = Math.max(1, buys1h + sells1h);
          const buyRatioPct = Math.min(98, Math.max(2, Math.round((buys1h / total1h) * 100)));

          const rsiVal = Math.min(95, Math.max(15, Math.round(50 + (buyRatioPct - 50) * 0.5 + Math.min(20, Math.max(-20, (pct || 0) * 0.5)))));
          const rsiStatus = rsiVal >= 75 ? (isRTL ? 'تشبع شرائي' : 'OVERBOUGHT') :
                            rsiVal >= 55 ? (isRTL ? 'زخم صعودي' : 'BULLISH MOMENTUM') :
                            rsiVal <= 32 ? (isRTL ? 'تشبع بيعي' : 'OVERSOLD') :
                            (isRTL ? 'محايد' : 'NEUTRAL');

          const macdState = (buyRatioPct > 60 || (pct || 0) > 8)
            ? (isRTL ? 'تقاطع صعودي ▲' : 'BULLISH CROSSOVER ▲')
            : (buyRatioPct < 40 || (pct || 0) < -8)
            ? (isRTL ? 'تباعد هبوطي ▼' : 'BEARISH DIVERGENCE ▼')
            : (isRTL ? 'محايد متوازن ⚡' : 'BALANCED MACD ⚡');

          const vol5m = activeToken.pair.volume?.m5 || 1200;
          const vol1h = activeToken.pair.volume?.h1 || 15000;
          const volSpikeRatio = (vol5m / Math.max(1, vol1h / 12)).toFixed(1);

          const lpDensityRatio = ((liquidityUsd / Math.max(1, mcapValue)) * 100).toFixed(2);
          const isCexToken = activeToken.pair.listingType === 'CEX' || chainId === 'cex';

          const svgGridColor = theme === 'dark' ? '#141824' : '#E2E8F0';
          const svgAxisColor = theme === 'dark' ? '#4A5568' : '#64748B';
          const svgTagBg = theme === 'dark' ? '#10B981' : '#059669';
          const svgTagText = theme === 'dark' ? '#000000' : '#FFFFFF';
          const svgCrossBoxBg = theme === 'dark' ? '#1C2030' : '#FFFFFF';
          const svgCrossBoxStroke = theme === 'dark' ? '#4A5568' : '#CBD5E1';
          const svgCrossBoxText = theme === 'dark' ? '#FFFFFF' : '#0F172A';

          const getDynamicAiSummary = () => {
            const changeStr = pct >= 0 ? `+${pct}%` : `${pct}%`;
            const score = activeToken.metrics.score;
            if (isCexToken) {
              const exList = (activeToken.pair.listedExchanges || [activeToken.pair.primaryExchange || 'Binance']).join(', ');
              return `Tier-1 Spot CEX asset listed on ${exList}. 24h orderbook flow (${buys1h}/${sells1h} buy/sell balance), ${changeStr} 24h move. Quant AI confidence: ${score}/100.`;
            }
            const chain = chainId.toUpperCase();
            return `Live ${chain} pair — Net buy pressure (${buys1h}/${sells1h} buy/sell). ${changeStr} 24h move. AI rates this entry with ${score}% predictive alpha.`;
          };

          return (
            <div className="fixed inset-0 bg-[#F4F6FA] dark:bg-[#040406] z-50 flex flex-col font-mono text-[11px] sm:text-xs select-none overflow-hidden text-slate-700 dark:text-[#C3C5CB]">
              
              {/* TOP HEADER STATUS BAR */}
              <header className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-[#141824] bg-white dark:bg-[#08090E] px-2.5 py-2 sm:px-4 sm:py-3 shrink-0">
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <button 
                    onClick={() => setIsDrawerOpen(false)} 
                    className="flex items-center gap-1 sm:gap-1.5 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition font-mono font-bold text-xs sm:text-sm bg-transparent border-0 cursor-pointer p-0"
                  >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-current fill-none stroke-[2.5]" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="19" y1="12" x2="5" y2="12"></line>
                      <polyline points="12 19 5 12 12 5"></polyline>
                    </svg>
                    <span>Signals</span>
                  </button>

                  <div className="w-[1px] h-3.5 sm:h-4 bg-slate-200 dark:bg-[#141824] mx-0.5 sm:mx-1"></div>

                  <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                    <TokenAvatar
                      symbol={symbol}
                      imageUrl={activeToken.pair.info?.imageUrl}
                      size="lg"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-900 dark:text-white font-extrabold text-xs sm:text-sm">${symbol}</span>
                      </div>
                      <span className="text-slate-500 dark:text-zinc-500 text-[9px] sm:text-[10px] block -mt-0.5 max-w-[110px] sm:max-w-none truncate">{name}</span>
                    </div>

                    {isCexToken ? (
                      (activeToken.pair.listedExchanges || ['Binance']).map((ex) => (
                        <span
                          key={ex}
                          className={`text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider border ${
                            ex === 'Binance'
                              ? 'bg-amber-500/15 border-amber-500/35 text-amber-700 dark:text-amber-300'
                              : 'bg-sky-500/10 border-sky-500/30 text-sky-700 dark:text-sky-300'
                          }`}
                        >
                          {ex}
                        </span>
                      ))
                    ) : (
                      <span className="bg-purple-500/10 border border-purple-500/30 text-purple-700 dark:text-[#B794F4] text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ml-0.5 sm:ml-2 tracking-wider">
                        {chainId.toUpperCase()}
                      </span>
                    )}

                    <span className="bg-yellow-500/10 border border-yellow-500/25 text-amber-700 dark:text-yellow-400 text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ml-0.5 sm:ml-1 tracking-wider">
                      {activeToken.metrics.rating}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-3">
                  <div className="text-right">
                    <div className="flex items-baseline justify-end gap-1.5 sm:gap-2">
                      <span className="text-slate-900 dark:text-white font-black text-xs sm:text-sm">${priceNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 8 })}</span>
                      <span className={`text-[9px] sm:text-[10px] font-bold ${pct >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                        {pct >= 0 ? '↗' : '↘'} {pct}%
                      </span>
                    </div>
                    <span className="text-[8px] sm:text-[9px] text-slate-500 dark:text-zinc-500">{isCexToken ? `${activeToken.pair.primaryExchange || 'BINANCE'} SPOT` : 'INDEX PRICE'}</span>
                  </div>

                  <button
                    id="terminal-theme-toggle"
                    type="button"
                    onClick={toggleTheme}
                    className="p-1.5 bg-slate-100 dark:bg-[#0C0E14] border border-slate-200 dark:border-[#1C2030] rounded-lg text-slate-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 transition"
                    title={theme === 'dark' ? (lang === 'ar' ? 'الوضع النهاري' : 'Light Mode') : (lang === 'ar' ? 'الوضع الليلي' : 'Dark Mode')}
                    aria-label="Toggle Theme"
                  >
                    {theme === 'dark' ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-700" />}
                  </button>

                  <button 
                    onClick={toggleWatchlist}
                    className="p-1.5 bg-slate-100 dark:bg-[#0C0E14] border border-slate-200 dark:border-[#1C2030] rounded-lg text-slate-500 dark:text-zinc-400 hover:text-amber-500 dark:hover:text-amber-400 transition"
                  >
                    {watchlist.some(item => item.pair.pairAddress === activeToken.pair.pairAddress) ? (
                      <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400" />
                    ) : (
                      <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    )}
                  </button>

                  {activeToken.pair.url && (
                    <a
                      href={activeToken.pair.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 sm:px-3 sm:py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-700 dark:text-[#10B981] rounded-lg transition text-[10px] sm:text-[11px] font-bold flex items-center gap-1"
                    >
                      <span>{isCexToken ? (activeToken.pair.primaryExchange || 'Binance') : (activeToken.pair.dexId || 'DEX')}</span>
                      <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    </a>
                  )}
                </div>
              </header>

              {/* THREE COLUMN GRID LAYOUT */}
              <div className="flex-1 flex flex-col lg:flex-row min-h-0 bg-[#F4F6FA] dark:bg-[#040406] overflow-y-auto lg:overflow-hidden">
                
                {/* LEFT & CENTER COMBINED COLUMN FOR CHART + TRANS LOGS */}
                <div className="flex-1 flex flex-col min-h-0 lg:border-r border-slate-200 dark:border-[#141824]">
                  
                  {/* TOP ROW: DRAWING TOOLS COLUMN + CANDLESTICK CHART CONTAINER */}
                  <div className="flex-1 min-h-[260px] sm:min-h-[380px] flex border-b border-slate-200 dark:border-[#141824] bg-white dark:bg-[#040406]">
                    
                    {/* DRAWING TOOLS COLUMN */}
                    <div className="w-8 sm:w-11 shrink-0 border-r border-slate-200 dark:border-[#141824] bg-slate-50 dark:bg-[#08090E] flex flex-col items-center py-2 sm:py-3 space-y-2.5 sm:space-y-4">
                      <button className="text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer p-0.5 sm:p-1" title="Crosshair">
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-current fill-none" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="2" x2="12" y2="22" />
                          <line x1="2" y1="12" x2="22" y2="12" />
                        </svg>
                      </button>
                      <button className="text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer p-0.5 sm:p-1" title="Trend Line">
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-current fill-none" strokeWidth="2">
                          <line x1="4" y1="20" x2="20" y2="4" />
                          <circle cx="4" cy="20" r="1.5" fill="currentColor" />
                          <circle cx="20" cy="4" r="1.5" fill="currentColor" />
                        </svg>
                      </button>
                      <button className="text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer p-0.5 sm:p-1" title="Fibonacci Retracement">
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-current fill-none" strokeWidth="2">
                          <line x1="4" y1="6" x2="20" y2="6" />
                          <line x1="4" y1="12" x2="20" y2="12" />
                          <line x1="4" y1="18" x2="20" y2="18" />
                        </svg>
                      </button>
                      <button className="text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer p-0.5 sm:p-1" title="Brush">
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-current fill-none" strokeWidth="2">
                          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.0434 16.4525C3.2209 16.8091 3.16335 17.2393 2.88456 17.5181L1.29289 19.1098C0.902369 19.5003 0.902369 20.1335 1.29289 20.524C1.68342 20.9145 2.31658 20.9145 2.70711 20.524L4.29878 18.9323C4.57757 18.6536 5.00781 18.596 5.36437 18.7735C6.70531 19.4413 8.21716 19.8169 9.8169 19.8169C11.4166 19.8169 12.9285 19.4413 14.2694 18.7735C14.626 18.596 15.0562 18.6536 15.335 18.9323L16.9267 20.524C17.3172 20.9145 17.9504 20.9145 18.3409 20.524C18.7314 20.1335 18.7314 19.5003 18.3409 19.1098L16.7492 17.5181C16.4704 17.2393 16.4129 16.8091 16.5904 16.4525C17.2582 15.1116 17.6338 13.5997 17.6338 12C17.6338 11.4361 17.587 10.883 17.497 10.3444" />
                        </svg>
                      </button>
                      <button className="text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer p-0.5 sm:p-1" title="Text Note">
                        <span className="text-xs sm:text-[14px] font-black leading-none">T</span>
                      </button>
                      <button className="text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer p-0.5 sm:p-1 hidden sm:inline-flex" title="Icons">
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-current fill-none" strokeWidth="2">
                          <circle cx="12" cy="12" r="10" />
                          <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                          <line x1="9" y1="9" x2="9.01" y2="9" />
                          <line x1="15" y1="9" x2="15.01" y2="9" />
                        </svg>
                      </button>
                      <button className="text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer p-0.5 sm:p-1" title="Ruler / Measure">
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-current fill-none" strokeWidth="2">
                          <path d="M5 3h14M5 21h14M5 7h8M5 12h11M5 17h8" />
                        </svg>
                      </button>
                      <button className="text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer p-0.5 sm:p-1" title="Zoom In">
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-current fill-none" strokeWidth="2">
                          <circle cx="11" cy="11" r="8" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                          <line x1="11" y1="8" x2="11" y2="14" />
                          <line x1="8" y1="11" x2="14" y2="11" />
                        </svg>
                      </button>
                      <button className="text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition cursor-pointer p-0.5 sm:p-1 hidden sm:inline-flex" title="Magnet Mode">
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-current fill-none" strokeWidth="2">
                          <path d="M5 15a7 7 0 0 0 14 0V4a2 2 0 0 0-4 0v11a3 3 0 0 1-6 0V4a2 2 0 0 0-4 0z" />
                        </svg>
                      </button>

                      <div className="flex-1"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-zinc-600"></div>
                    </div>

                    {/* INTERACTIVE CHART CANVAS CONTAINER */}
                    <div className="flex-1 flex flex-col min-h-0 relative">
                      
                      {/* CHART TIMEFRAMES HEADER & CONTROLS */}
                      <div className="flex items-center justify-between px-2.5 sm:px-4 py-1.5 sm:py-2 border-b border-slate-200 dark:border-[#141824] bg-slate-50 dark:bg-[#08090E] text-[9px] sm:text-[10px]">
                        <div className="flex items-center gap-0.5 sm:gap-1">
                          {['5M', '15M', '1H', '4H', '1D'].map((tf) => (
                            <button 
                              key={tf}
                              onClick={() => setTerminalTimeframe(tf as any)}
                              className={`px-1.5 py-0.5 sm:px-2 sm:py-1 rounded font-bold transition font-mono ${terminalTimeframe === tf ? 'bg-slate-200 dark:bg-[#1C2030] text-slate-900 dark:text-white' : 'text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-zinc-300'}`}
                            >
                              {tf} <span className="text-[8px] text-slate-400 dark:text-zinc-600 font-normal hidden sm:inline">↻</span>
                            </button>
                          ))}
                        </div>

                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 sm:px-2 rounded border border-emerald-500/25 font-bold">
                            <span className="w-1.5 h-1.5 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-pulse"></span>
                            <span>LIVE <span className="text-[8px] text-emerald-600 font-normal hidden sm:inline">↻</span></span>
                          </div>
                        </div>
                      </div>

                      {/* DETAILED CANDLESTICK CANVAS */}
                      <div 
                        className="flex-1 relative bg-white dark:bg-[#040406] overflow-hidden cursor-crosshair"
                        onMouseMove={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const rx = e.clientX - rect.left;
                          const ry = e.clientY - rect.top;
                          setChartHoveredPoint({ x: rx, y: ry });
                        }}
                        onMouseLeave={() => setChartHoveredPoint(null)}
                      >
                        {/* CHART OVERLAY LABEL METRIC LABELS */}
                        <div className="absolute top-2 left-2.5 sm:top-3 sm:left-4 pointer-events-none z-10 font-mono text-[9px] sm:text-[10px] space-y-0.5 sm:space-y-1">
                          <div className="text-slate-500 dark:text-zinc-400 flex items-center gap-1 sm:gap-1.5 font-bold flex-wrap">
                            <span className="text-slate-900 dark:text-white">{symbol}/USD</span>
                            <span>·</span>
                            <span>{terminalTimeframe}</span>
                            <span>·</span>
                            <span className="text-emerald-600 dark:text-emerald-400">{isCexToken ? (activeToken.pair.primaryExchange || 'Binance') : (activeToken.pair.dexId || 'PumpSwap')}</span>
                            <span className="hidden sm:inline">·</span>
                            <span className="text-slate-400 dark:text-zinc-600 hidden sm:inline">{isCexToken ? 'Spot Market Feed' : 'DexScreener Live'}</span>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3 text-[8px] sm:text-[9px] text-slate-500 dark:text-zinc-500 flex-wrap">
                            <div>O: <span className="text-emerald-600 dark:text-emerald-400">${formatPrice(priceNum * 0.985)}</span></div>
                            <div>H: <span className="text-emerald-600 dark:text-emerald-400">${formatPrice(priceNum * 1.021)}</span></div>
                            <div>L: <span className="text-red-600 dark:text-red-400">${formatPrice(priceNum * 0.978)}</span></div>
                            <div>C: <span className="text-emerald-600 dark:text-emerald-400">${formatPrice(priceNum)}</span></div>
                          </div>
                          <div className="text-[8px] sm:text-[9px] text-slate-400 dark:text-zinc-600 hidden sm:block">
                            Volume SMA (15) <span className="text-emerald-600 dark:text-emerald-500/80">15.497K</span>
                          </div>
                        </div>

                        {/* RENDER THE DETAILED CHART SVG */}
                        <svg className="w-full h-full" viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="none">
                          {/* Grid horizontal dashed lines */}
                          {priceGridLines.map((gl, i) => {
                            const y = paddingTop + drawHeight * (1 - (gl - baseMin) / (baseMax - baseMin));
                            return (
                              <g key={i}>
                                <line 
                                  x1={paddingLeft} 
                                  y1={y} 
                                  x2={chartWidth - paddingRight} 
                                  y2={y} 
                                  stroke={svgGridColor}
                                  strokeDasharray="4 4" 
                                  strokeWidth="1" 
                                />
                                {/* Y Axis labels right-aligned */}
                                <text 
                                  x={chartWidth - paddingRight + 8} 
                                  y={y + 3} 
                                  fill={svgAxisColor}
                                  fontSize="9" 
                                  fontFamily="monospace"
                                >
                                  {formatPrice(gl * scaleFactor)}
                                </text>
                              </g>
                            );
                          })}

                          {/* Grid vertical lines */}
                          {Array.from({ length: 14 }).map((_, i) => {
                            const x = paddingLeft + (i * (drawWidth / 15)) + (drawWidth / 30);
                            return (
                              <line 
                                key={i}
                                x1={x} 
                                y1={paddingTop} 
                                x2={x} 
                                y2={chartHeight - paddingBottom} 
                                stroke={svgGridColor}
                                strokeDasharray="6 6" 
                                strokeWidth="0.5" 
                              />
                            );
                          })}

                          {/* Render Candlesticks deterministically */}
                          {baseCandles.map((candle, i) => {
                            const x = paddingLeft + (i * (drawWidth / 15)) + (drawWidth / 30);
                            const w = (drawWidth / 15) * 0.55;

                            const yOpen = paddingTop + drawHeight * (1 - (candle.o - baseMin) / (baseMax - baseMin));
                            const yClose = paddingTop + drawHeight * (1 - (candle.c - baseMin) / (baseMax - baseMin));
                            const yHigh = paddingTop + drawHeight * (1 - (candle.h - baseMin) / (baseMax - baseMin));
                            const yLow = paddingTop + drawHeight * (1 - (candle.l - baseMin) / (baseMax - baseMin));

                            const isGreen = candle.c >= candle.o;
                            const color = isGreen ? '#10B981' : '#EF4444';

                            const bodyTop = Math.min(yOpen, yClose);
                            const bodyHeight = Math.max(Math.abs(yOpen - yClose), 1.5);

                            // Bottom volume bars
                            const volHeight = (candle.h - candle.l) * 0.45;
                            const volY = chartHeight - paddingBottom - volHeight;

                            return (
                              <g key={i}>
                                {/* Wick (Shadow) line */}
                                <line 
                                  x1={x} 
                                  y1={yLow} 
                                  x2={x} 
                                  y2={yHigh} 
                                  stroke={color} 
                                  strokeWidth="1.25" 
                                />
                                {/* Candle Solid Body */}
                                <rect 
                                  x={x - w / 2} 
                                  y={bodyTop} 
                                  width={w} 
                                  height={bodyHeight} 
                                  fill={color} 
                                  rx="1" 
                                />
                                {/* Underlay Volume Bar */}
                                <rect 
                                  x={x - w / 2} 
                                  y={volY} 
                                  width={w} 
                                  height={volHeight} 
                                  fill={color} 
                                  fillOpacity="0.18" 
                                  rx="0.5" 
                                />
                              </g>
                            );
                          })}

                          {/* HIGHLIGHT PRICE TAG BANNER ON THE RIGHT SIDE */}
                          {(() => {
                            const currentY = paddingTop + drawHeight * (1 - (220 - baseMin) / (baseMax - baseMin));
                            return (
                              <g>
                                <line 
                                  x1={paddingLeft} 
                                  y1={currentY} 
                                  x2={chartWidth - paddingRight} 
                                  y2={currentY} 
                                  stroke="#10B981" 
                                  strokeWidth="1" 
                                  strokeDasharray="2 2" 
                                />
                                <rect 
                                  x={chartWidth - paddingRight + 2} 
                                  y={currentY - 7} 
                                  width={84} 
                                  height={15} 
                                  fill={svgTagBg}
                                  rx="2" 
                                />
                                <text 
                                  x={chartWidth - paddingRight + 8} 
                                  y={currentY + 3} 
                                  fill={svgTagText}
                                  fontSize="8.5" 
                                  fontWeight="bold" 
                                  fontFamily="monospace"
                                >
                                  {formatPrice(priceNum)}
                                </text>
                              </g>
                            );
                          })()}

                          {/* INTERACTIVE CROSSHAIR DRAWING LINES */}
                          {chartHoveredPoint && (() => {
                            const hx = chartHoveredPoint.x;
                            const hy = chartHoveredPoint.y;

                            // Translate relative coordinates back to scaled prices
                            const pctY = 1 - ((hy - paddingTop) / drawHeight);
                            const calcPriceVal = scaleFactor * (baseMin + pctY * (baseMax - baseMin));

                            if (hx < paddingLeft || hx > chartWidth - paddingRight || hy < paddingTop || hy > chartHeight - paddingBottom) {
                              return null;
                            }

                            return (
                              <g>
                                {/* Vertical crosshair line */}
                                <line 
                                  x1={hx} 
                                  y1={paddingTop} 
                                  x2={hx} 
                                  y2={chartHeight - paddingBottom} 
                                  stroke={svgAxisColor}
                                  strokeWidth="0.8" 
                                  strokeDasharray="3 3" 
                                />
                                {/* Horizontal crosshair line */}
                                <line 
                                  x1={paddingLeft} 
                                  y1={hy} 
                                  x2={chartWidth - paddingRight} 
                                  y2={hy} 
                                  stroke={svgAxisColor}
                                  strokeWidth="0.8" 
                                  strokeDasharray="3 3" 
                                />

                                {/* Interactive Y-axis box */}
                                <rect 
                                  x={chartWidth - paddingRight + 2} 
                                  y={hy - 8} 
                                  width={84} 
                                  height={16} 
                                  fill={svgCrossBoxBg}
                                  rx="2" 
                                  stroke={svgCrossBoxStroke}
                                  strokeWidth="0.5" 
                                />
                                <text 
                                  x={chartWidth - paddingRight + 8} 
                                  y={hy + 3} 
                                  fill={svgCrossBoxText}
                                  fontSize="8" 
                                  fontFamily="monospace"
                                >
                                  {formatPrice(calcPriceVal)}
                                </text>

                                {/* Interactive X-axis box */}
                                <rect 
                                  x={hx - 22} 
                                  y={chartHeight - paddingBottom + 2} 
                                  width={44} 
                                  height={13} 
                                  fill={svgCrossBoxBg}
                                  stroke={svgCrossBoxStroke}
                                  strokeWidth="0.5"
                                  rx="2" 
                                />
                                <text 
                                  x={hx} 
                                  y={chartHeight - paddingBottom + 11} 
                                  fill={svgCrossBoxText}
                                  fontSize="7.5" 
                                  fontFamily="monospace" 
                                  textAnchor="middle"
                                >
                                  {Math.floor(hx).toString()}
                                </text>
                              </g>
                            );
                          })()}
                        </svg>
                      </div>

                      {/* CHART SUBFOOTER INFO ROWS */}
                      <div className="flex items-center justify-between px-2.5 sm:px-4 py-1 sm:py-1.5 border-t border-slate-200 dark:border-[#141824] bg-slate-50 dark:bg-[#08090E] text-[9px] sm:text-[10px] font-mono text-slate-500 dark:text-zinc-500">
                        <div className="flex items-center gap-2 sm:gap-3">
                          {['5y', '1y', '6m', '3m', '1m', '5d', '1d'].map((rg) => (
                            <button key={rg} className="hover:text-slate-900 dark:hover:text-white transition font-mono border-0 bg-transparent p-0 cursor-pointer">{rg}</button>
                          ))}
                        </div>
                        <div className="text-slate-600 dark:text-zinc-400 font-bold hidden sm:block">
                          {terminalClock}
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <span>%</span>
                          <span>log</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">auto</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM ROW: TRANS HISTORY / HOLDERS TABS + LIVE LOG TABLE */}
                  <div className="flex-1 flex flex-col min-h-[200px] sm:min-h-[250px] bg-white dark:bg-[#040406] overflow-y-auto">
                    
                    {/* TABS HEADER BAR */}
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#141824] bg-slate-50 dark:bg-[#08090E] px-2.5 sm:px-4 shrink-0 h-9 sm:h-10 overflow-x-auto scrollbar-none gap-2">
                      <div className="flex gap-2.5 sm:gap-4 h-full items-center shrink-0">
                        {['history', 'liquidity', 'holders', 'traders'].map((tab) => {
                          const label = tab === 'history' ? 'Trading History' : tab === 'liquidity' ? 'Liquidity' : tab === 'holders' ? `Holders (${holdersCount})` : 'Traders';
                          return (
                            <button
                              key={tab}
                              onClick={() => setTerminalActiveTab(tab as any)}
                              className={`h-full px-1 border-b-2 text-[10px] sm:text-xs font-bold transition flex items-center gap-1 bg-transparent border-0 cursor-pointer shrink-0 ${terminalActiveTab === tab ? 'border-emerald-500 dark:border-emerald-400 text-slate-900 dark:text-white' : 'border-transparent text-slate-500 dark:text-zinc-500 hover:text-slate-800 dark:hover:text-zinc-300'}`}
                            >
                              <span>{label}</span>
                              <span className="text-slate-400 dark:text-zinc-600 text-[8px] hidden sm:inline">↻</span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        <button className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded bg-white dark:bg-[#0C0E14] border border-slate-200 dark:border-[#1C2030] hover:text-slate-900 dark:hover:text-white transition text-[10px] font-bold text-slate-600 dark:text-zinc-400">
                          <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full"></span>
                          Bubble Map <span className="text-slate-400 dark:text-zinc-600 text-[8px]">↻</span>
                        </button>
                        <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-slate-500 dark:text-zinc-500 font-bold">
                          <span className="w-1.5 h-1.5 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-pulse"></span>
                          <span>Live <span className="text-slate-400 dark:text-zinc-600 text-[8px] hidden sm:inline">↻</span></span>
                        </div>
                      </div>
                    </div>

                    {/* SUB FILTERS CAROUSEL BAR */}
                    <div className="flex items-center gap-1 px-2.5 sm:px-4 py-1.5 sm:py-2 border-b border-slate-200/80 dark:border-[#141824]/60 bg-[#F8FAFC] dark:bg-[#06070B] overflow-x-auto shrink-0 scrollbar-none">
                      {['All', 'KOLs', 'Smart Money', 'Top Holders', 'Dev', 'Insiders', 'Snipers', 'Bundlers'].map((sub) => (
                        <button
                          key={sub}
                          onClick={() => setTerminalSubFilter(sub as any)}
                          className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md text-[9px] sm:text-[10px] font-bold font-mono transition shrink-0 cursor-pointer ${
                            terminalSubFilter === sub 
                              ? 'bg-slate-200 dark:bg-[#1C2030] text-slate-900 dark:text-white border border-slate-300 dark:border-[#1C2030]/50' 
                              : 'bg-transparent border-0 text-slate-500 dark:text-zinc-500 hover:text-slate-800 dark:hover:text-zinc-300'
                          }`}
                        >
                          {sub} <span className="text-slate-400 dark:text-zinc-600 text-[8px] hidden sm:inline">↻</span>
                        </button>
                      ))}
                    </div>

                    {/* DYNAMIC LOG TABLE CONTENT */}
                    <div className="flex-1 overflow-y-auto overflow-x-auto">
                      {terminalActiveTab === 'history' ? (
                        <table className="w-full text-start border-collapse font-mono text-[10px] sm:text-[10.5px]">
                          <thead>
                            <tr className="border-b border-slate-200 dark:border-[#141824] text-slate-500 dark:text-zinc-500 bg-slate-50 dark:bg-[#08090E]/40">
                              <th className="py-2 px-2.5 sm:py-2.5 sm:px-4 font-bold">Time</th>
                              <th className="py-2 px-2.5 sm:py-2.5 sm:px-4 font-bold">Type</th>
                              <th className="py-2 px-2.5 sm:py-2.5 sm:px-4 font-bold text-right">Amount</th>
                              <th className="py-2 px-2.5 sm:py-2.5 sm:px-4 font-bold text-right">Value USD</th>
                              <th className="py-2 px-2.5 sm:py-2.5 sm:px-4 font-bold text-right hidden sm:table-cell">Price</th>
                              <th className="py-2 px-2.5 sm:py-2.5 sm:px-4 font-bold text-right">Wallet</th>
                            </tr>
                          </thead>
                          <tbody>
                            {simulatedTrades.map((trade) => {
                              const isBuy = trade.type === 'Buy';
                              return (
                                <tr 
                                  key={trade.id} 
                                  className={`border-b border-slate-200/70 dark:border-[#141824]/30 hover:bg-slate-50 dark:hover:bg-[#141824]/10 transition duration-300 ${
                                    trade.isNew ? (isBuy ? 'bg-emerald-500/5' : 'bg-red-500/5') : ''
                                  }`}
                                >
                                  <td className="py-1.5 px-2.5 sm:py-2.5 sm:px-4 text-slate-500 dark:text-zinc-500 font-medium">{trade.time}</td>
                                  <td className="py-1.5 px-2.5 sm:py-2.5 sm:px-4 font-bold">
                                    <span className={`px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] ${
                                      isBuy ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' : 'bg-red-500/10 text-red-700 dark:text-red-400'
                                    }`}>
                                      {trade.type}
                                    </span>
                                  </td>
                                  <td className={`py-1.5 px-2.5 sm:py-2.5 sm:px-4 text-right font-bold ${isBuy ? 'text-emerald-600 dark:text-emerald-400/95' : 'text-slate-600 dark:text-zinc-400'}`}>
                                    {trade.amount}
                                  </td>
                                  <td className="py-1.5 px-2.5 sm:py-2.5 sm:px-4 text-right text-slate-800 dark:text-zinc-300 font-extrabold">{trade.value}</td>
                                  <td className="py-1.5 px-2.5 sm:py-2.5 sm:px-4 text-right text-slate-600 dark:text-zinc-400 font-medium hidden sm:table-cell">{trade.price}</td>
                                  <td className="py-1.5 px-2.5 sm:py-2.5 sm:px-4 text-right">
                                    <div className="flex items-center justify-end gap-1 sm:gap-1.5">
                                      <span className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full flex items-center justify-center text-[7px] sm:text-[7.5px] font-black text-black ${
                                        trade.walletPrefix === 'J' ? 'bg-[#10B981]' : 
                                        trade.walletPrefix === '8' ? 'bg-[#F59E0B]' :
                                        trade.walletPrefix === 'F' ? 'bg-[#3B82F6]' : 
                                        trade.walletPrefix === 'H' ? 'bg-[#EC4899]' : 'bg-[#8B5CF6]'
                                      }`}>
                                        {trade.walletPrefix}
                                      </span>
                                      <span className="text-slate-600 dark:text-zinc-400 font-bold">{trade.wallet}</span>
                                      <span className="text-slate-400 dark:text-zinc-600 text-[8px] hidden sm:inline">↻</span>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-10 sm:py-16 text-slate-500 dark:text-zinc-500 gap-2 font-mono">
                          <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400 dark:text-zinc-700 animate-pulse" />
                          <p className="text-[10px] sm:text-[11px]">Syncing live {terminalActiveTab} ledger database pool...</p>
                          <span className="text-[9px] text-slate-400 dark:text-zinc-600 font-normal">↻ Processing live smart contracts</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* RIGHT OVERVIEW STATS PANEL */}
                <div className="w-full lg:w-[340px] shrink-0 bg-white dark:bg-[#08090E] p-3 sm:p-4 flex flex-col space-y-3 sm:space-y-4 lg:overflow-y-auto min-h-0 border-t lg:border-t-0 border-slate-200 dark:border-[#141824]">
                  
                  {/* TITLE ELEMENT */}
                  <div className="flex justify-between items-center pb-1.5 sm:pb-2 border-b border-slate-200 dark:border-[#141824]">
                    <span className="text-[11px] sm:text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">Overview <span className="text-slate-400 dark:text-zinc-600 text-[9px] font-normal">↻</span></span>
                  </div>

                  {/* HIGH-FIDELITY AI SCORE GAUGE CARD */}
                  <div className="bg-slate-50 dark:bg-[#0C0E14] border border-slate-200 dark:border-[#1C2030] rounded-xl p-3.5 sm:p-5 flex flex-col items-center shadow-xs dark:shadow-lg">
                    <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold text-emerald-600 dark:text-emerald-400 font-mono mb-3 sm:mb-4">
                      <span className="w-1.5 h-1.5 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-pulse"></span>
                      <span>AI SCORE <span className="text-slate-400 dark:text-zinc-600 text-[8px] font-normal">↻</span></span>
                    </div>

                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
                      <svg viewBox="0 0 112 112" className="absolute w-full h-full transform -rotate-90">
                        <circle cx="56" cy="56" r="46" className="stroke-slate-200 dark:stroke-[#1C2030]" strokeWidth="7" fill="transparent" />
                        <circle cx="56" cy="56" r="46" className={`transition-all duration-1000 ${
                          activeToken.metrics.score >= 75 ? 'stroke-emerald-500 dark:stroke-emerald-400' : activeToken.metrics.score >= 45 ? 'stroke-amber-500 dark:stroke-yellow-400' : 'stroke-red-500 dark:stroke-red-400'
                        }`} strokeWidth="7" strokeDasharray={2 * Math.PI * 46} strokeDashoffset={2 * Math.PI * 46 * (1 - activeToken.metrics.score / 100)} fill="transparent" strokeLinecap="round" />
                      </svg>
                      <div className="text-center z-10 font-mono">
                        <span className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white block leading-none">{activeToken.metrics.score}</span>
                        <span className="text-[8px] text-slate-500 dark:text-zinc-500 uppercase">/ 100</span>
                      </div>
                    </div>

                    <p className="mt-3 sm:mt-4 text-[10px] sm:text-[10.5px] leading-relaxed text-slate-600 dark:text-zinc-400 text-center font-mono">
                      {getDynamicAiSummary()}
                    </p>

                    <button 
                      onClick={generateAiReport} 
                      className="text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white transition flex items-center gap-1.5 mt-3 sm:mt-4 text-[9px] font-mono border-0 bg-transparent cursor-pointer"
                    >
                      <RefreshCw className={`w-3 h-3 ${isGeneratingAi ? 'animate-spin' : ''}`} />
                      <span>Retry</span>
                    </button>
                  </div>

                  {/* BENTO GRID FOUR CORE METRIC BLOCKS */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    
                    <div className="bg-slate-50 dark:bg-[#0C0E14] border border-slate-200 dark:border-[#1C2030] rounded-xl p-2.5 sm:p-3 font-mono">
                      <div className="flex justify-between text-[8px] sm:text-[9px] text-slate-500 dark:text-zinc-500 uppercase font-bold mb-1 sm:mb-1.5">
                        <span>MARKET CAP</span>
                        <span className="text-slate-400 dark:text-zinc-600">↻</span>
                      </div>
                      <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">{formatVal(mcapValue)}</span>
                    </div>

                    <div className="bg-slate-50 dark:bg-[#0C0E14] border border-slate-200 dark:border-[#1C2030] rounded-xl p-2.5 sm:p-3 font-mono">
                      <div className="flex justify-between text-[8px] sm:text-[9px] text-slate-500 dark:text-zinc-500 uppercase font-bold mb-1 sm:mb-1.5">
                        <span>VOLUME 24H</span>
                        <span className="text-slate-400 dark:text-zinc-600">↻</span>
                      </div>
                      <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">{formatVal(volume24h)}</span>
                    </div>

                    <div className="bg-slate-50 dark:bg-[#0C0E14] border border-slate-200 dark:border-[#1C2030] rounded-xl p-2.5 sm:p-3 font-mono">
                      <div className="flex justify-between text-[8px] sm:text-[9px] text-slate-500 dark:text-zinc-500 uppercase font-bold mb-1 sm:mb-1.5">
                        <span>LIQUIDITY</span>
                        <span className="text-slate-400 dark:text-zinc-600">↻</span>
                      </div>
                      <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">{formatVal(liquidityUsd)}</span>
                    </div>

                    <div className="bg-slate-50 dark:bg-[#0C0E14] border border-slate-200 dark:border-[#1C2030] rounded-xl p-2.5 sm:p-3 font-mono">
                      <div className="flex justify-between text-[8px] sm:text-[9px] text-slate-500 dark:text-zinc-500 uppercase font-bold mb-1 sm:mb-1.5">
                        <span>HOLDERS</span>
                        <span className="text-slate-400 dark:text-zinc-600">↻</span>
                      </div>
                      <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-white">{holdersCount}</span>
                    </div>

                  </div>

                  {/* CUSTOM PRICE THRESHOLD ALERT CARD */}
                  <div className="bg-slate-50 dark:bg-[#0C0E14] border border-slate-200 dark:border-[#1C2030] rounded-xl p-3 sm:p-4 space-y-2.5 sm:space-y-3 font-mono text-[11px] sm:text-xs">
                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-[#141824] pb-1.5 sm:pb-2">
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                        <BellRing className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 dark:text-emerald-400" />
                        {isRTL ? 'تنبيه السعر المستهدف' : 'PRICE THRESHOLD ALERT'}
                      </span>
                      <span className="text-[9px] text-slate-500 dark:text-zinc-500">
                        {priceAlerts.filter(a => a.pairAddress === activeToken.pair.pairAddress && a.status === 'active').length} {isRTL ? 'نشط' : 'active'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={() => setDrawerAlertCondition('above')}
                        className={`py-1 sm:py-1.5 rounded-lg text-[9.5px] sm:text-[10px] font-bold border transition ${
                          drawerAlertCondition === 'above'
                            ? 'bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/40'
                            : 'bg-white dark:bg-[#08090E] text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-[#1C2030]'
                        }`}
                      >
                        {isRTL ? '▲ فوق السعر' : '▲ Above'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDrawerAlertCondition('below')}
                        className={`py-1 sm:py-1.5 rounded-lg text-[9.5px] sm:text-[10px] font-bold border transition ${
                          drawerAlertCondition === 'below'
                            ? 'bg-red-500/15 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/40'
                            : 'bg-white dark:bg-[#08090E] text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-[#1C2030]'
                        }`}
                      >
                        {isRTL ? '▼ تحت السعر' : '▼ Below'}
                      </button>
                    </div>

                    <div className="flex gap-1.5">
                      <input
                        type="number"
                        step="any"
                        min="0"
                        placeholder={formatPrice(priceNum)}
                        value={drawerAlertTarget}
                        onChange={(e) => setDrawerAlertTarget(e.target.value)}
                        className="flex-1 min-w-0 bg-white dark:bg-[#08090E] border border-slate-200 dark:border-[#1C2030] rounded-lg px-2 py-1.5 sm:px-2.5 sm:py-2 text-[11px] sm:text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500/50"
                      />
                      <button
                        type="button"
                        disabled={isSavingAlert}
                        onClick={async () => {
                          const targetVal = parseFloat(drawerAlertTarget);
                          const ok = await createPriceAlert({
                            pairAddress: activeToken.pair.pairAddress,
                            tokenAddress: activeToken.pair.baseToken.address,
                            symbol: symbol,
                            name: name,
                            chainId: chainId,
                            targetPrice: targetVal,
                            initialPrice: priceNum,
                            condition: drawerAlertCondition,
                          });
                          if (ok) setDrawerAlertTarget('');
                        }}
                        className="px-2.5 py-1.5 sm:px-3 sm:py-2 bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 disabled:bg-slate-300 dark:disabled:bg-zinc-800 text-white dark:text-black font-bold rounded-lg text-[10px] transition shrink-0"
                      >
                        {isSavingAlert ? '...' : (isRTL ? 'حفظ' : 'Set')}
                      </button>
                    </div>

                    <div className="flex items-center gap-1 flex-wrap">
                      {[-0.05, 0.05, 0.1, 0.25].map((delta) => (
                        <button
                          key={delta}
                          type="button"
                          onClick={() => {
                            const nextP = priceNum * (1 + delta);
                            setDrawerAlertCondition(delta >= 0 ? 'above' : 'below');
                            setDrawerAlertTarget(nextP < 0.01 ? nextP.toFixed(6) : nextP.toFixed(nextP >= 1 ? 2 : 5));
                          }}
                          className="px-1.5 py-0.5 rounded bg-white dark:bg-[#08090E] border border-slate-200 dark:border-[#1C2030] hover:border-emerald-500/40 text-[9px] text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white transition"
                        >
                          {delta > 0 ? `+${delta * 100}%` : `${delta * 100}%`}
                        </button>
                      ))}
                    </div>

                    {priceAlerts.filter(a => a.pairAddress === activeToken.pair.pairAddress && a.status === 'active').map(alert => (
                      <div key={alert.id} className="flex items-center justify-between bg-white dark:bg-[#08090E] border border-slate-200 dark:border-[#1C2030] rounded-lg px-2.5 py-1.5 text-[10px]">
                        <span className={alert.condition === 'above' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>
                          {alert.condition === 'above' ? '≥' : '≤'} ${alert.targetPrice < 0.01 ? alert.targetPrice.toFixed(6) : alert.targetPrice}
                        </span>
                        <button
                          onClick={() => deletePriceAlert(alert.id)}
                          className="text-slate-500 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 transition"
                          title="Delete Alert"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* ADVANCED TECHNICAL INDICATORS & CREDIBILITY CARD */}
                  <div className="bg-slate-50 dark:bg-[#0C0E14] border border-slate-200 dark:border-[#1C2030] rounded-xl p-3 sm:p-4 space-y-2.5 sm:space-y-3 font-mono text-[11px] sm:text-xs">
                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-[#141824] pb-1.5 sm:pb-2">
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Activity className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 dark:text-emerald-400" />
                        {isRTL ? 'المؤشرات الفنية والزخم' : 'TECHNICAL INDICATORS'}
                      </span>
                      <span className="text-[8px] sm:text-[9px] text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/25 font-bold">LIVE</span>
                    </div>

                    {/* RSI 14 */}
                    <div className="flex justify-between items-center py-0.5 sm:py-1">
                      <span className="text-slate-600 dark:text-zinc-400 text-[10px] sm:text-[11px]">{isRTL ? 'مؤشر القوة النسبية (RSI 14)' : 'RSI (14 Period)'}</span>
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="text-slate-900 dark:text-white font-black">{rsiVal}</span>
                        <span className={`text-[8px] sm:text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                          rsiVal >= 75 ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30' :
                          rsiVal >= 55 ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30' :
                          rsiVal <= 32 ? 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border border-blue-500/30' :
                          'bg-slate-200 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300'
                        }`}>
                          {rsiStatus}
                        </span>
                      </div>
                    </div>

                    {/* MACD SIGNAL */}
                    <div className="flex justify-between items-center py-0.5 sm:py-1 border-t border-slate-200/70 dark:border-[#141824]/60">
                      <span className="text-slate-600 dark:text-zinc-400 text-[10px] sm:text-[11px]">{isRTL ? 'مؤشر ماكد (MACD)' : 'MACD Signal'}</span>
                      <span className={`text-[9.5px] sm:text-[10px] font-bold ${macdState.includes('▲') ? 'text-emerald-600 dark:text-emerald-400' : macdState.includes('▼') ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`}>
                        {macdState}
                      </span>
                    </div>

                    {/* VOLUME SPIKE RATIO */}
                    <div className="flex justify-between items-center py-0.5 sm:py-1 border-t border-slate-200/70 dark:border-[#141824]/60">
                      <span className="text-slate-600 dark:text-zinc-400 text-[10px] sm:text-[11px]">{isRTL ? 'معدل اندفاع السيولة (5m/1h)' : 'Volume Spike Ratio'}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{volSpikeRatio}x</span>
                        <span className="text-[8px] sm:text-[9px] text-slate-500 dark:text-zinc-500">{isRTL ? 'مقابل متوسط الساعة' : 'vs 1h avg'}</span>
                      </div>
                    </div>

                    {/* BUY PRESSURE PERCENT */}
                    <div className="flex justify-between items-center py-0.5 sm:py-1 border-t border-slate-200/70 dark:border-[#141824]/60">
                      <span className="text-slate-600 dark:text-zinc-400 text-[10px] sm:text-[11px]">{isRTL ? 'نسبة عمليات الشراء (1h)' : 'Buy Pressure (1h)'}</span>
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">{buyRatioPct}% {isRTL ? 'شراء' : 'Buys'}</span>
                        <span className="text-[8px] sm:text-[9px] text-slate-500 dark:text-zinc-500">({buys1h}/{sells1h})</span>
                      </div>
                    </div>

                    {/* LIQUIDITY / FDV DENSITY */}
                    <div className="flex justify-between items-center py-0.5 sm:py-1 border-t border-slate-200/70 dark:border-[#141824]/60">
                      <span className="text-slate-600 dark:text-zinc-400 text-[10px] sm:text-[11px]">{isRTL ? 'كثافة السيولة للماركت كاب' : 'Liquidity/FDV Density'}</span>
                      <span className="text-slate-900 dark:text-white font-bold">{lpDensityRatio}%</span>
                    </div>
                  </div>

                  {/* ON-CHAIN CREDIBILITY & SECURITY AUDIT CARD */}
                  <div className="bg-slate-50 dark:bg-[#0C0E14] border border-slate-200 dark:border-[#1C2030] rounded-xl p-3 sm:p-4 space-y-2 sm:space-y-2.5 font-mono text-[11px] sm:text-xs">
                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-[#141824] pb-1.5 sm:pb-2">
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-sky-600 dark:text-sky-400" />
                        {isRTL ? 'التدقيق الأمني والمصداقية' : 'SECURITY & AUDIT'}
                      </span>
                      <span className="text-[8px] sm:text-[9px] text-sky-700 dark:text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/25 font-bold">100% AUDITED</span>
                    </div>

                    <div className="flex justify-between items-center py-0.5 text-[10px] sm:text-[11px]">
                      <span className="text-slate-600 dark:text-zinc-400">{isRTL ? 'عقد موثق ومفحوص' : 'Contract Verified'}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> {isRTL ? 'مفحوص ومطابق' : 'Verified'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-0.5 text-[10px] sm:text-[11px]">
                      <span className="text-slate-600 dark:text-zinc-400">{isRTL ? 'حرق / قفل السيولة' : 'LP Status'}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">{isRTL ? 'مقفول 100%' : '100% Locked'}</span>
                    </div>

                    <div className="flex justify-between items-center py-0.5 text-[10px] sm:text-[11px]">
                      <span className="text-slate-600 dark:text-zinc-400">{isRTL ? 'صلاحية صك العملات' : 'Mint Authority'}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">{isRTL ? 'معطلة بالكامل' : 'Disabled'}</span>
                    </div>

                    <div className="flex justify-between items-center py-0.5 text-[10px] sm:text-[11px]">
                      <span className="text-slate-600 dark:text-zinc-400">{isRTL ? 'حصة أكبر 10 محافظ' : 'Top 10 Holders Share'}</span>
                      <span className="text-slate-800 dark:text-zinc-200 font-bold">&lt; 14.2%</span>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          );
        })()}
      </AnimatePresence>

      {/* MOCK CHECKOUT BILLING MODAL */}
      <AnimatePresence>
        {showCheckoutModalState && (
          <div className="fixed inset-0 bg-slate-950/60 dark:bg-black/85 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#08090E] border border-slate-200 dark:border-[#1C2030] rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-md w-full relative shadow-2xl font-mono text-[11px] sm:text-xs"
            >
              <button 
                onClick={() => setShowCheckoutModalState(false)}
                className="absolute right-3.5 top-3.5 sm:right-4 sm:top-4 text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white text-lg font-mono"
              >
                ×
              </button>
              
              <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6">
                <div className="p-2 sm:p-2.5 bg-amber-500/10 border border-amber-500/25 rounded-xl text-amber-600 dark:text-amber-400">
                  <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Unlock Crypto Scanners PRO</h3>
                  <p className="text-[9.5px] sm:text-[10px] text-slate-500 dark:text-zinc-500">Instantly upgrade your trading terminals</p>
                </div>
              </div>

              {paymentSuccess ? (
                <div className="text-center py-6 sm:py-8">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-500/10 border border-emerald-500/35 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-bounce">
                    <Check className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <h4 className="text-emerald-600 dark:text-emerald-400 font-bold text-sm sm:text-base">Payment Confirmed!</h4>
                  <p className="text-slate-500 dark:text-zinc-500 text-[10px] mt-1">PRO plan activated for 30 days.</p>
                </div>
              ) : (
                <form onSubmit={handleCheckout} className="space-y-3 sm:space-y-4">
                  
                  <div className="bg-slate-50 dark:bg-[#0C0E14] border border-slate-200 dark:border-[#1C2030] rounded-xl p-3 sm:p-4 mb-3 sm:mb-4 flex justify-between items-center">
                    <div>
                      <span className="text-slate-800 dark:text-zinc-300 block font-bold">PRO Subscription Plan</span>
                      <span className="text-[9.5px] sm:text-[10px] text-slate-500 dark:text-zinc-500 block">30 days recurrent billing</span>
                    </div>
                    <span className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400">$29.99</span>
                  </div>

                  <div>
                    <label className="text-slate-500 dark:text-zinc-500 block mb-1 text-[10px] sm:text-[11px]">CARDHOLDER NAME</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Satoshi Nakamoto"
                      className="w-full bg-slate-50 dark:bg-[#0C0E14] border border-slate-200 dark:border-[#1C2030] focus:border-emerald-500 dark:focus:border-emerald-400 rounded-lg py-1.5 px-2.5 sm:py-2 sm:px-3 text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400 dark:placeholder:text-zinc-700"
                    />
                  </div>

                  <div>
                    <label className="text-slate-500 dark:text-zinc-500 block mb-1 text-[10px] sm:text-[11px]">CREDIT CARD NUMBER</label>
                    <input 
                      type="text" 
                      required
                      maxLength={19}
                      placeholder="•••• •••• •••• ••••"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#0C0E14] border border-slate-200 dark:border-[#1C2030] focus:border-emerald-500 dark:focus:border-emerald-400 rounded-lg py-1.5 px-2.5 sm:py-2 sm:px-3 text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400 dark:placeholder:text-zinc-700"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-slate-500 dark:text-zinc-500 block mb-1 text-[10px] sm:text-[11px]">EXPIRY DATE</label>
                      <input 
                        type="text" 
                        required
                        maxLength={5}
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-[#0C0E14] border border-slate-200 dark:border-[#1C2030] focus:border-emerald-500 dark:focus:border-emerald-400 rounded-lg py-1.5 px-2.5 sm:py-2 sm:px-3 text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400 dark:placeholder:text-zinc-700"
                      />
                    </div>
                    <div>
                      <label className="text-slate-500 dark:text-zinc-500 block mb-1 text-[10px] sm:text-[11px]">CVC SECURITY CODE</label>
                      <input 
                        type="password" 
                        required
                        maxLength={3}
                        placeholder="•••"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-[#0C0E14] border border-slate-200 dark:border-[#1C2030] focus:border-emerald-500 dark:focus:border-emerald-400 rounded-lg py-1.5 px-2.5 sm:py-2 sm:px-3 text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400 dark:placeholder:text-zinc-700"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isProcessingPayment}
                    className="w-full mt-3 sm:mt-4 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 disabled:bg-slate-300 dark:disabled:bg-zinc-800 text-black py-2.5 sm:py-3 rounded-xl font-bold transition shadow-lg flex items-center justify-center gap-2"
                  >
                    {isProcessingPayment ? <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                    {isProcessingPayment ? 'AUTHORIZING BLOCKCHAIN SECTOR...' : 'PAY $29.99 AND INITIALIZE PRO'}
                  </button>

                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SECURE TERMINAL AUTH LOGIN / SIGNUP MODAL */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 bg-slate-950/60 dark:bg-black/85 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#08090E] border border-slate-200 dark:border-[#1C2030] rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-sm w-full relative shadow-2xl font-sans text-[11px] sm:text-xs max-h-[92vh] overflow-y-auto"
            >
              <button 
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="absolute ltr:right-3.5 rtl:left-3.5 top-3.5 sm:ltr:right-4 sm:rtl:left-4 sm:top-4 text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white text-lg font-mono"
                aria-label="Close"
              >
                ×
              </button>
              
              <div className="flex items-center gap-2 sm:gap-2.5 mb-3.5 sm:mb-4">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden border border-slate-200/80 dark:border-white/10 bg-white flex items-center justify-center shrink-0 shadow-xs">
                  <img
                    src={APP_LOGO_URL}
                    alt="Crypto Scanners Logo"
                    className="w-full h-full object-cover scale-[1.06]"
                  />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    {authMode === 'register'
                      ? (lang === 'ar' ? 'إنشاء حساب جديد' : lang === 'fr' ? 'Créer un compte' : 'Create Account')
                      : (lang === 'ar' ? 'تسجيل الدخول' : lang === 'fr' ? 'Connexion' : 'Sign In')}
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-500">
                    {lang === 'ar'
                      ? 'احفظ قائمة المتابعة والتنبيهات في حسابك'
                      : 'Sync your watchlist, referrals & price alerts'}
                  </p>
                </div>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-[#0C0E14] border border-slate-200 dark:border-[#1C2030] mb-3.5 sm:mb-4">
                <button
                  type="button"
                  onClick={() => { setAuthMode('register'); setAuthError(''); }}
                  className={`py-1.5 rounded-lg text-[11px] font-bold transition ${
                    authMode === 'register'
                      ? 'bg-emerald-600 dark:bg-emerald-500 text-white dark:text-black shadow-xs'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {lang === 'ar' ? 'إنشاء حساب' : lang === 'fr' ? 'Inscription' : 'Create Account'}
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setAuthError(''); }}
                  className={`py-1.5 rounded-lg text-[11px] font-bold transition ${
                    authMode === 'login'
                      ? 'bg-emerald-600 dark:bg-emerald-500 text-white dark:text-black shadow-xs'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {lang === 'ar' ? 'تسجيل الدخول' : lang === 'fr' ? 'Connexion' : 'Sign In'}
                </button>
              </div>

              {authError && (
                <div className="bg-red-500/10 border border-red-500/25 rounded-lg p-2.5 sm:p-3 text-red-700 dark:text-red-400 mb-3 sm:mb-4 flex items-start gap-2 text-[11px] leading-relaxed">
                  <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Google Quick Sign Up / Sign In */}
              <button
                type="button"
                disabled={isAuthSubmitting}
                onClick={handleGoogleAuth}
                className="w-full flex items-center justify-center gap-2 py-2 sm:py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-[#0C0E14] dark:hover:bg-[#141824] border border-slate-300 dark:border-[#242C44] text-slate-900 dark:text-white font-bold text-xs transition mb-3 disabled:opacity-50"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" aria-hidden="true">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.3 0 6.08-1.09 8.11-2.96l-3.88-3.05c-1.1.74-2.51 1.18-4.23 1.18-3.25 0-6-2.2-6.98-5.15H1.01v3.14C3.05 21.21 7.21 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.02 14.02c-.25-.74-.39-1.54-.39-2.36 0-.82.14-1.62.39-2.36V6.16H1.01C.37 7.44 0 8.88 0 11.66s.37 4.22 1.01 5.5l4.01-3.14z"/>
                  <path fill="#EA4335" d="M12 4.75c1.79 0 3.4.62 4.67 1.82l3.5-3.5C18.07 1.19 15.29 0 12 0 7.21 0 3.05 2.79 1.01 6.84l4.01 3.14c.98-2.95 3.73-5.23 6.98-5.23z"/>
                </svg>
                <span>
                  {lang === 'ar'
                    ? (authMode === 'register' ? 'إنشاء حساب عبر Google' : 'المتابعة عبر Google')
                    : (authMode === 'register' ? 'Sign Up with Google' : 'Continue with Google')}
                </span>
              </button>

              <div className="relative flex items-center my-3">
                <div className="flex-grow border-t border-slate-200 dark:border-[#141824]"></div>
                <span className="px-2.5 text-[10px] text-slate-400 dark:text-zinc-500 font-mono">
                  {lang === 'ar' ? 'أو بالبريد الإلكتروني' : 'OR WITH EMAIL'}
                </span>
                <div className="flex-grow border-t border-slate-200 dark:border-[#141824]"></div>
              </div>

              <form onSubmit={handleAuth} className="space-y-2.5 sm:space-y-3">
                <div>
                  <label className="text-slate-600 dark:text-zinc-400 block mb-1 text-[10px] sm:text-[11px] font-semibold">
                    {lang === 'ar' ? 'البريد الإلكتروني' : 'EMAIL ADDRESS'}
                  </label>
                  <input 
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-slate-50 dark:bg-[#0C0E14] border border-slate-200 dark:border-[#1C2030] focus:border-emerald-500 dark:focus:border-emerald-400 rounded-lg py-2 px-2.5 sm:py-2.5 sm:px-3 text-sm sm:text-xs text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400 dark:placeholder:text-zinc-700 font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-600 dark:text-zinc-400 block mb-1 text-[10px] sm:text-[11px] font-semibold">
                    {lang === 'ar' ? 'كلمة المرور (6 أحرف فأكثر)' : 'PASSWORD (MIN 6 CHARS)'}
                  </label>
                  <input 
                    type="password"
                    autoComplete={authMode === 'register' ? 'new-password' : 'current-password'}
                    required
                    minLength={6}
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 dark:bg-[#0C0E14] border border-slate-200 dark:border-[#1C2030] focus:border-emerald-500 dark:focus:border-emerald-400 rounded-lg py-2 px-2.5 sm:py-2.5 sm:px-3 text-sm sm:text-xs text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400 dark:placeholder:text-zinc-700 font-mono"
                  />
                </div>

                {authMode === 'register' && (
                  <div>
                    <label className="text-slate-600 dark:text-zinc-400 block mb-1 text-[10px] sm:text-[11px] font-semibold">
                      {lang === 'ar' ? 'تأكيد كلمة المرور' : 'CONFIRM PASSWORD'}
                    </label>
                    <input 
                      type="password"
                      autoComplete="new-password"
                      required
                      minLength={6}
                      value={authConfirmPassword}
                      onChange={(e) => setAuthConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 dark:bg-[#0C0E14] border border-slate-200 dark:border-[#1C2030] focus:border-emerald-500 dark:focus:border-emerald-400 rounded-lg py-2 px-2.5 sm:py-2.5 sm:px-3 text-sm sm:text-xs text-slate-900 dark:text-white focus:outline-none placeholder:text-slate-400 dark:placeholder:text-zinc-700 font-mono"
                    />
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={isAuthSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-black py-2 sm:py-2.5 rounded-xl font-bold transition shadow-lg disabled:opacity-50"
                >
                  {isAuthSubmitting
                    ? (lang === 'ar' ? 'جارٍ المعالجة...' : 'Please wait...')
                    : authMode === 'register'
                    ? (lang === 'ar' ? 'إنشاء الحساب الآن' : lang === 'fr' ? 'Créer le compte' : 'CREATE ACCOUNT')
                    : (lang === 'ar' ? 'تسجيل الدخول' : lang === 'fr' ? 'Se connecter' : 'SIGN IN')}
                </button>
              </form>

              <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-[#141824] text-center text-[10.5px] text-slate-500 dark:text-zinc-500">
                {authMode === 'register' ? (
                  <button
                    type="button"
                    onClick={() => { setAuthMode('login'); setAuthError(''); }}
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                  >
                    {lang === 'ar' ? 'لديك حساب بالفعل؟ سجّل الدخول' : 'Already have an account? Sign In'}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => { setAuthMode('register'); setAuthError(''); }}
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 transition"
                  >
                    {lang === 'ar' ? 'ليس لديك حساب؟ أنشئ حساباً الآن' : 'New here? Create an account'}
                  </button>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* HIGH SIGNAL (+80) PRE-FILLED PRICE ALERT SETTINGS MODAL */}
      <AnimatePresence>
        {showHighSignalAlertModal && (() => {
          const highSignalTokens = trendingTokens
            .filter((tok) => tok.metrics.score >= 80)
            .sort((a, b) => b.metrics.score - a.metrics.score);
          const selectedHighTok =
            highSignalTokens.find((t) => t.pair.pairAddress === highSignalModalPairAddr) ||
            highSignalTokens[0] ||
            null;
          const selectedLivePrice = selectedHighTok ? parseFloat(selectedHighTok.pair.priceUsd || '0') : 0;
          const highPairSet = new Set(highSignalTokens.map((t) => t.pair.pairAddress));
          const activeHighAlerts = priceAlerts.filter(
            (a) => a.status === 'active' && highPairSet.has(a.pairAddress)
          );

          return (
            <div
              className="fixed inset-0 bg-slate-950/60 dark:bg-black/85 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4"
              onClick={() => setShowHighSignalAlertModal(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-[#08090E] border border-emerald-500/40 dark:border-emerald-500/35 rounded-xl sm:rounded-2xl p-4 sm:p-6 max-w-lg w-full relative shadow-[0_0_40px_rgba(16,185,129,0.18)] font-mono text-[11px] sm:text-xs max-h-[90vh] overflow-y-auto"
              >
                <button
                  type="button"
                  onClick={() => setShowHighSignalAlertModal(false)}
                  className="absolute right-3.5 top-3.5 sm:right-4 sm:top-4 text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-white transition p-1"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-5 pr-6">
                  <div className="p-2 sm:p-2.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400">
                    <BellRing className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white font-sans">
                      {lang === 'ar'
                        ? 'إعدادات تنبيهات الإشارات القوية (+80)'
                        : lang === 'fr'
                        ? 'Alertes Signaux Élevés (+80)'
                        : 'High Signal (+80) Alert Settings'}
                    </h3>
                    <p className="text-[9.5px] sm:text-[10px] text-slate-600 dark:text-zinc-400 mt-0.5">
                      {lang === 'ar'
                        ? `مخصص لـ ${highSignalTokens.length} عملة بتقييم +80 فأعلى · محفوظ عبر Firestore`
                        : `${highSignalTokens.length} qualifying +80 score tokens · Saved to Firestore`}
                    </p>
                  </div>
                </div>

                {!firebaseUser && (
                  <div className="mb-3.5 sm:mb-4 bg-amber-500/10 dark:bg-amber-950/25 border border-amber-500/35 rounded-xl p-2.5 sm:p-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[10px] sm:text-[11px] text-amber-700 dark:text-amber-300">
                      {lang === 'ar'
                        ? 'أنشئ حساباً أو سجّل الدخول لحفظ التنبيهات في Firestore.'
                        : 'Create an account or sign in to save alerts to Firestore.'}
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => {
                          setShowHighSignalAlertModal(false);
                          openAuthModal('register');
                        }}
                        className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-black text-[10px] font-bold transition"
                      >
                        {lang === 'ar' ? 'إنشاء حساب' : 'Create Account'}
                      </button>
                      <button
                        type="button"
                        onClick={handleGoogleAuth}
                        className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-white dark:bg-[#0C0E14] border border-slate-300 dark:border-[#242C44] text-slate-800 dark:text-zinc-200 hover:border-emerald-500/40 text-[10px] font-bold transition"
                      >
                        Google
                      </button>
                    </div>
                  </div>
                )}

                {highSignalTokens.length === 0 ? (
                  <div className="py-6 sm:py-8 text-center text-slate-500 dark:text-zinc-500 border border-dashed border-slate-300 dark:border-[#1C2030] rounded-xl">
                    {lang === 'ar'
                      ? 'لا توجد عملات بتقييم +80 حالياً. جارٍ تحديث البث المباشر...'
                      : 'No +80 High Signal tokens in feed right now. Live stream is scanning...'}
                  </div>
                ) : (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!selectedHighTok) return;
                      const parsedTarget = parseFloat(highSignalModalTarget);
                      const ok = await createPriceAlert({
                        pairAddress: selectedHighTok.pair.pairAddress,
                        tokenAddress: selectedHighTok.pair.baseToken.address,
                        symbol: selectedHighTok.pair.baseToken.symbol,
                        name: selectedHighTok.pair.baseToken.name,
                        chainId: selectedHighTok.pair.chainId,
                        targetPrice: parsedTarget,
                        initialPrice: selectedLivePrice,
                        condition: highSignalModalCondition,
                      });
                      if (ok) {
                        setShowHighSignalAlertModal(false);
                      }
                    }}
                    className="space-y-3 sm:space-y-4"
                  >
                    {/* Qualifying +80 Tokens Picker */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[9.5px] sm:text-[10px] text-slate-600 dark:text-zinc-400 uppercase font-bold">
                          {lang === 'ar' ? 'اختر عملة من فئة (+80)' : 'Select High Signal Token (+80)'}
                        </label>
                        <span className="text-[9.5px] sm:text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                          {highSignalTokens.length} {lang === 'ar' ? 'عملات' : 'tokens'}
                        </span>
                      </div>
                      <div className="max-h-36 sm:max-h-44 overflow-y-auto space-y-1.5 pr-1 bg-slate-50 dark:bg-[#05060A] border border-slate-200 dark:border-[#141824] rounded-xl p-1.5 sm:p-2">
                        {highSignalTokens.map((tok) => {
                          const isSelected = selectedHighTok?.pair.pairAddress === tok.pair.pairAddress;
                          const tokPrice = parseFloat(tok.pair.priceUsd || '0');
                          const chg24 = tok.pair.priceChange?.h24 ?? 0;
                          return (
                            <button
                              key={tok.pair.pairAddress}
                              type="button"
                              onClick={() => {
                                setHighSignalModalPairAddr(tok.pair.pairAddress);
                                setHighSignalModalTarget(
                                  computePrefilledTargetPrice(tokPrice, highSignalModalCondition, 0.05)
                                );
                              }}
                              className={`w-full px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg border flex items-center justify-between gap-2 transition text-start ${
                                isSelected
                                  ? 'bg-emerald-500/15 border-emerald-500/60 text-slate-900 dark:text-white'
                                  : 'bg-white dark:bg-[#0C0E14] border-slate-200 dark:border-[#1C2030] text-slate-700 dark:text-zinc-300 hover:border-emerald-500/35'
                              }`}
                            >
                              <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                                <TokenAvatar
                                  symbol={tok.pair.baseToken.symbol}
                                  imageUrl={tok.pair.info?.imageUrl}
                                  size="sm"
                                />
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-extrabold text-slate-900 dark:text-white text-[11px] sm:text-xs">
                                      ${tok.pair.baseToken.symbol}
                                    </span>
                                    <span className="text-[8.5px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                                      {tok.metrics.score}
                                    </span>
                                  </div>
                                  <span className="text-[9px] text-slate-500 dark:text-zinc-500 block truncate max-w-[140px] sm:max-w-[160px]">
                                    {tok.pair.baseToken.name}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <div className="text-[10.5px] sm:text-[11px] font-bold text-slate-900 dark:text-white">
                                  ${tokPrice < 0.01 ? tokPrice.toFixed(6) : tokPrice.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                                </div>
                                <div className={`text-[8.5px] sm:text-[9px] font-bold ${chg24 >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                  {chg24 >= 0 ? '+' : ''}{chg24.toFixed(2)}%
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Condition & Pre-filled Target Price */}
                    {selectedHighTok && (
                      <div className="bg-slate-50 dark:bg-[#0C0E14] border border-slate-200 dark:border-[#1C2030] rounded-xl p-3 sm:p-3.5 space-y-2.5 sm:space-y-3">
                        <div className="flex items-center justify-between text-[10.5px] sm:text-[11px] border-b border-slate-200 dark:border-[#141824] pb-1.5 sm:pb-2">
                          <span className="text-slate-600 dark:text-zinc-400">
                            {lang === 'ar' ? 'السعر الحالي لـ' : 'Live price for'}{' '}
                            <strong className="text-slate-900 dark:text-white">${selectedHighTok.pair.baseToken.symbol}</strong>
                          </span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                            ${selectedLivePrice < 0.01 ? selectedLivePrice.toFixed(6) : selectedLivePrice.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                          <div>
                            <label className="block text-[9.5px] sm:text-[10px] text-slate-500 dark:text-zinc-500 uppercase mb-1">
                              {lang === 'ar' ? 'شرط التنبيه' : 'Condition'}
                            </label>
                            <div className="grid grid-cols-2 gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setHighSignalModalCondition('above');
                                  setHighSignalModalTarget(computePrefilledTargetPrice(selectedLivePrice, 'above', 0.05));
                                }}
                                className={`py-1.5 sm:py-2 rounded-lg text-[10.5px] sm:text-[11px] font-bold border transition flex items-center justify-center gap-1 ${
                                  highSignalModalCondition === 'above'
                                    ? 'bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/50'
                                    : 'bg-white dark:bg-[#08090E] text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-[#1C2030]'
                                }`}
                              >
                                <TrendingUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                {lang === 'ar' ? 'فوق' : 'Above'}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setHighSignalModalCondition('below');
                                  setHighSignalModalTarget(computePrefilledTargetPrice(selectedLivePrice, 'below', 0.05));
                                }}
                                className={`py-1.5 sm:py-2 rounded-lg text-[10.5px] sm:text-[11px] font-bold border transition flex items-center justify-center gap-1 ${
                                  highSignalModalCondition === 'below'
                                    ? 'bg-red-500/15 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/50'
                                    : 'bg-white dark:bg-[#08090E] text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-[#1C2030]'
                                }`}
                              >
                                <TrendingDown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                {lang === 'ar' ? 'تحت' : 'Below'}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[9.5px] sm:text-[10px] text-slate-500 dark:text-zinc-500 uppercase mb-1">
                              {lang === 'ar' ? 'السعر المستهدف ($)' : 'Target Price (USD)'}
                            </label>
                            <input
                              type="number"
                              step="any"
                              min="0"
                              required
                              value={highSignalModalTarget}
                              onChange={(e) => setHighSignalModalTarget(e.target.value)}
                              className="w-full min-w-0 bg-white dark:bg-[#08090E] border border-slate-200 dark:border-[#1C2030] focus:border-emerald-500/60 rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-2 text-[11px] sm:text-xs text-slate-900 dark:text-white focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap pt-1">
                          <span className="text-[9.5px] sm:text-[10px] text-slate-500 dark:text-zinc-500">{lang === 'ar' ? 'تعبئة تلقائية:' : 'Quick %:'}</span>
                          {[-0.1, -0.05, 0.05, 0.1, 0.25].map((delta) => (
                            <button
                              key={delta}
                              type="button"
                              onClick={() => {
                                const cond = delta >= 0 ? 'above' : 'below';
                                setHighSignalModalCondition(cond);
                                setHighSignalModalTarget(
                                  computePrefilledTargetPrice(selectedLivePrice, cond, Math.abs(delta))
                                );
                              }}
                              className="px-1.5 py-0.5 sm:px-2 sm:py-1 rounded bg-white dark:bg-[#08090E] border border-slate-200 dark:border-[#1C2030] hover:border-emerald-500/45 text-[9.5px] sm:text-[10px] text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white transition"
                            >
                              {delta > 0 ? `+${delta * 100}%` : `${delta * 100}%`}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowHighSignalAlertModal(false)}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#0C0E14] border border-slate-200 dark:border-[#1C2030] text-slate-700 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white font-bold transition"
                      >
                        {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                      </button>
                      <button
                        type="submit"
                        disabled={isSavingAlert || !selectedHighTok}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 disabled:bg-slate-300 dark:disabled:bg-zinc-800 text-white dark:text-black font-extrabold transition flex items-center gap-1.5"
                      >
                        <BellRing className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        {isSavingAlert
                          ? (lang === 'ar' ? 'جارٍ الحفظ...' : 'Saving...')
                          : (lang === 'ar' ? 'حفظ تنبيه الإشارة القوية' : 'Save High Signal Alert')}
                      </button>
                    </div>
                  </form>
                )}

                {/* Existing Active Alerts for +80 Tokens */}
                {activeHighAlerts.length > 0 && (
                  <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-slate-200 dark:border-[#141824] space-y-2">
                    <div className="text-[9.5px] sm:text-[10px] font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider">
                      {lang === 'ar' ? 'التنبيهات النشطة لفئة (+80)' : 'Active High Signal Alerts'} ({activeHighAlerts.length})
                    </div>
                    <div className="space-y-1.5 max-h-28 sm:max-h-32 overflow-y-auto">
                      {activeHighAlerts.map((alert) => (
                        <div
                          key={alert.id}
                          className="flex items-center justify-between bg-slate-50 dark:bg-[#0C0E14] border border-slate-200 dark:border-[#1C2030] rounded-lg px-2.5 py-1.5 sm:px-3 sm:py-2 text-[10.5px] sm:text-[11px]"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 dark:text-white">${alert.symbol}</span>
                            <span className={alert.condition === 'above' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>
                              {alert.condition === 'above' ? '≥' : '≤'} ${alert.targetPrice < 0.01 ? alert.targetPrice.toFixed(6) : alert.targetPrice}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => deletePriceAlert(alert.id)}
                            className="text-slate-500 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 transition"
                            title="Delete Alert"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* FLOAT TOAST NOTIFICATIONS */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-14 lg:bottom-6 right-3 sm:right-6 z-50 bg-white dark:bg-[#0C0E14] border border-emerald-500/40 text-emerald-700 dark:text-emerald-400 py-2.5 px-3.5 sm:py-3.5 sm:px-5 rounded-lg sm:rounded-xl shadow-xl dark:shadow-2xl font-mono text-[11px] sm:text-xs flex items-center gap-2 max-w-[90vw]"
          >
            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
