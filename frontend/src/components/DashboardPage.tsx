import React, { useState, useEffect } from 'react';
import { ElectrumNetworkProvider, type Artifact } from 'cashscript';

interface DashboardPageProps {
  provider: ElectrumNetworkProvider | null;
  wallet: any | null;
}

interface UserStats {
  xp: number;
  level: number;
  totalVolume: number;
  swapCount: number;
  achievements: { name: string; unlocked: boolean }[];
}

const ACHIEVEMENTS = [
  { name: 'First Swap', icon: '🎯', unlocked: true },
  { name: 'Degen Trader', icon: '🔥', unlocked: true },
  { name: 'LP Legend', icon: '💎', unlocked: true },
  { name: 'Speed Demon', icon: '⚡', unlocked: true },
  { name: 'Whale', icon: '🐋', unlocked: false },
  { name: 'Diamond Hands', icon: '💪', unlocked: false },
];

const LEADERBOARD = [
  { rank: 1, name: 'Alice', address: '0x...123', xp: 250000, badge: '👑' },
  { rank: 2, name: 'Bob', address: '0x...456', xp: 180000, badge: '🥈' },
  { rank: 3, name: 'You', address: '0x...789', xp: 12450, badge: '🥉', isYou: true },
  { rank: 4, name: 'Charlie', address: '0x...abc', xp: 5000, badge: '' },
  { rank: 5, name: 'Diana', address: '0x...def', xp: 3200, badge: '' },
];

const DashboardPage: React.FC<DashboardPageProps> = ({  }) => {
  const [stats, setStats] = useState<UserStats>({
    xp: 12450,
    level: 3,
    totalVolume: 12450000,
    swapCount: 47,
    achievements: ACHIEVEMENTS
  });

  const getLevelName = (level: number) => {
    const levels = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'];
    return levels[Math.min(level - 1, levels.length - 1)] || 'Bronze';
  };

  const getLevelColor = (level: number) => {
    const colors = [
      'from-orange-600 to-orange-400',
      'from-gray-400 to-gray-200',
      'from-yellow-600 to-yellow-400',
      'from-cyan-600 to-cyan-400',
      'from-purple-600 to-purple-400'
    ];
    return colors[Math.min(level - 1, colors.length - 1)] || colors[0];
  };

  const xpProgress = ((stats.xp % 5000) / 5000) * 100;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-3xl blur-3xl"></div>
        <div className="relative p-8 bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/50">
          <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
            Your Stats
          </h2>

          {/* Level Card */}
          <div className="mb-6 p-6 bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-2xl border border-gray-600/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getLevelColor(stats.level)} flex items-center justify-center shadow-lg`}>
                  <span className="text-3xl">🏆</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{getLevelName(stats.level)}</p>
                  <p className="text-sm text-gray-400">Level {stats.level}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                  {stats.xp.toLocaleString()}
                </p>
                <p className="text-sm text-gray-400">XP Points</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Progress to Level {stats.level + 1}</span>
                <span>{Math.floor(xpProgress)}%</span>
              </div>
              <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full transition-all duration-500 shadow-lg"
                  style={{ width: `${xpProgress}%` }}
                >
                  <div className="h-full w-full bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl border border-blue-500/30">
              <p className="text-sm text-gray-400 mb-1">Total Volume</p>
              <p className="text-2xl font-bold text-white">{(stats.totalVolume / 1000000).toFixed(2)}M</p>
              <p className="text-xs text-blue-400 mt-1">satoshis traded</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/30">
              <p className="text-sm text-gray-400 mb-1">Swaps Made</p>
              <p className="text-2xl font-bold text-white">{stats.swapCount}</p>
              <p className="text-xs text-purple-400 mt-1">successful trades</p>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/10 to-orange-600/10 rounded-3xl blur-3xl"></div>
        <div className="relative p-8 bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/50">
          <h3 className="text-2xl font-bold mb-6 text-white">
            Achievements ({ACHIEVEMENTS.filter(a => a.unlocked).length}/{ACHIEVEMENTS.length})
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {ACHIEVEMENTS.map((achievement, idx) => (
              <div 
                key={idx}
                className={`p-4 rounded-2xl border transition-all duration-300 ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50 hover:scale-105'
                    : 'bg-gray-700/30 border-gray-600/30 opacity-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{achievement.unlocked ? achievement.icon : '🔒'}</span>
                  <div className="flex-1">
                    <p className={`font-medium ${achievement.unlocked ? 'text-white' : 'text-gray-500'}`}>
                      {achievement.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {achievement.unlocked ? 'Unlocked!' : 'Locked'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 to-blue-600/10 rounded-3xl blur-3xl"></div>
        <div className="relative p-8 bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/50">
          <h3 className="text-2xl font-bold mb-6 text-white">Global Leaderboard</h3>
          <div className="space-y-3">
            {LEADERBOARD.map((entry) => (
              <div 
                key={entry.rank}
                className={`p-4 rounded-2xl border transition-all duration-300 ${
                  entry.isYou
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/50 ring-2 ring-purple-500/30'
                    : 'bg-gray-700/30 border-gray-600/30 hover:border-gray-500/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl font-bold text-gray-400 w-8">
                      {entry.badge || `#${entry.rank}`}
                    </span>
                    <div>
                      <p className={`font-bold ${entry.isYou ? 'text-purple-300' : 'text-white'}`}>
                        {entry.name}
                      </p>
                      <p className="text-xs text-gray-400">{entry.address}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-bold ${entry.isYou ? 'text-purple-400' : 'text-white'}`}>
                      {entry.xp.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">XP</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;