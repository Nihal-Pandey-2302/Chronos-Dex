import React, { useState, useEffect } from 'react';
import { ElectrumNetworkProvider, type Artifact } from 'cashscript';
import { createWalletFromWif } from './contractService';
import SwapPage from './components/SwapPage';
import PoolPage from './components/PoolPage';
import DashboardPage from './components/DashboardPage';

type Page = 'swap' | 'pool' | 'dashboard';

function App() {
  const [provider, setProvider] = useState<ElectrumNetworkProvider | null>(null);
  const [wallet, setWallet] = useState<any | null>(null);
  const [page, setPage] = useState<Page>('swap');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const providerInstance = new ElectrumNetworkProvider('chipnet');
    setProvider(providerInstance);
  }, []);

  const connectWallet = async () => {
    setError('');
    if (!provider) {
      setError('Network provider not initialized.');
      return;
    }

    try {
      const wif = import.meta.env.VITE_TESTER_WIF;
      if (!wif) {
        setError('VITE_TESTER_WIF not set in .env.local file.');
        return;
      }

      const mockWallet = await createWalletFromWif(wif);

      setWallet(mockWallet);
      console.log("Wallet connected:", mockWallet.address);

    } catch (e) {
      console.error(e);
      setError('Failed to connect wallet.');
    }
  };

  const renderPage = () => {
    switch (page) {
      case 'swap':
        return <SwapPage provider={provider} wallet={wallet} />;
      case 'pool':
        return <PoolPage provider={provider} wallet={wallet} />;
      case 'dashboard':
        return <DashboardPage provider={provider} wallet={wallet} />;
      default:
        return <SwapPage provider={provider} wallet={wallet} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
                Chronos DEX
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">First Layla-Ready AMM on Bitcoin Cash</p>
            </div>
          </div>

          {wallet ? (
            <div className="flex items-center space-x-3">
              <div className="px-4 py-2 bg-gray-800/80 backdrop-blur-xl rounded-xl border border-gray-700/50">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-white">Connected</span>
                </div>
                <p className="text-xs text-gray-400 mt-1 truncate max-w-[150px]" title={wallet?.address}>
                  {wallet.address.slice(0, 10)}...{wallet.address.slice(-8)}
                </p>
              </div>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="group relative px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-white overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50"
            >
              <span className="relative z-10">Connect Wallet</span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
          )}
        </header>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 backdrop-blur-xl border border-red-500/50 rounded-2xl animate-fade-in">
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-bold text-red-300">Error</p>
                <p className="text-sm text-red-200">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="mb-8 flex justify-center">
          <div className="inline-flex space-x-2 p-2 bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-xl">
            <button
              onClick={() => setPage('swap')}
              className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 ${page === 'swap'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50 scale-105'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
            >
              <span className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
                <span>Swap</span>
              </span>
            </button>
            <button
              onClick={() => setPage('pool')}
              className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 ${page === 'pool'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/50 scale-105'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
            >
              <span className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span>Pool</span>
              </span>
            </button>
            <button
              onClick={() => setPage('dashboard')}
              className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 ${page === 'dashboard'
                ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white shadow-lg shadow-yellow-500/50 scale-105'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
            >
              <span className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Dashboard</span>
              </span>
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="pb-12">
          {wallet ? (
            renderPage()
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-3xl blur-3xl"></div>
                <div className="relative p-12 bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/50 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl flex items-center justify-center">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Connect Your Wallet</h3>
                  <p className="text-gray-400 mb-6">Connect your Bitcoin Cash wallet to start trading</p>
                  <button
                    onClick={connectWallet}
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold text-white hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-purple-500/50"
                  >
                    Connect Wallet
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="text-center py-6 border-t border-gray-800/50">
          <p className="text-sm text-gray-500">
            🔒 Secured by Bitcoin Cash Smart Contracts • Built for BCH Blaze Hackathon 2025
          </p>
        </footer>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 20s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default App;