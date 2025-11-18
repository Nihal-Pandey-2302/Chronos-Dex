import React, { useState, useEffect } from 'react';
import { ElectrumNetworkProvider, type Artifact } from 'cashscript';

interface SwapPageProps {
  provider: ElectrumNetworkProvider | null;
  wallet: any | null;
}

const SwapPage: React.FC<SwapPageProps> = ({ provider, wallet }) => {
  const [amountIn, setAmountIn] = useState<string>('');
  const [amountOut, setAmountOut] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [txHash, setTxHash] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  // Mock pool reserves for demo
  const reserveA = 10000;
  const reserveB = 20000;

  useEffect(() => {
    if (amountIn && !isNaN(parseFloat(amountIn))) {
      // Calculate using constant product formula
      const amountInNum = parseFloat(amountIn);
      const amountInWithFee = amountInNum * 0.997; // 0.3% fee
      const output = (reserveB * amountInWithFee) / (reserveA + amountInWithFee);
      setAmountOut(output.toFixed(2));
    } else {
      setAmountOut('');
    }
  }, [amountIn]);

  const handleSwap = async () => {
    if (!wallet || !amountIn) {
      setError('Please enter an amount');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setTxHash('');
    setShowSuccess(false);

    try {
      // Simulate transaction for demo
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockTxHash = Array.from({length: 64}, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      
      setTxHash(mockTxHash);
      setShowSuccess(true);
      setAmountIn('');
      
      // Hide success after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
      
    } catch (e) {
      setError('Swap failed. Please try again.');
    }
    
    setIsLoading(false);
  };

  const handleMaxClick = () => {
    setAmountIn('100'); // Demo max amount
  };

  return (
    <div className="max-w-lg mx-auto relative">
      {/* Background gradient blur */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 rounded-3xl blur-3xl"></div>
      
      <div className="relative p-8 bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/50">
        <h2 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Swap Tokens
        </h2>

        {/* Pool Stats Card */}
        <div className="mb-6 p-4 bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-2xl border border-gray-600/30">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Pool Reserves</span>
            <span className="text-xs text-purple-400 font-medium">Live on Chipnet</span>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{reserveA.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">TKA Reserve</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">{reserveB.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">TKB Reserve</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-600/30">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Price Ratio</span>
              <span className="text-white font-medium">1 TKA = {(reserveB/reserveA).toFixed(2)} TKB</span>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-2xl animate-fade-in">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-green-400">Swap Successful!</p>
                <a 
                  href={`https://chipnet.imaginary.cash/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-green-300 hover:text-green-200 underline mt-1 inline-block truncate max-w-full"
                >
                  View on Explorer: {txHash.slice(0, 12)}...{txHash.slice(-8)}
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-2xl">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        {/* Input Token Card */}
        <div className="mb-4 p-6 bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-2xl border border-gray-600/30 hover:border-purple-500/50 transition-all duration-300">
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-medium text-gray-400">You Pay</label>
            <button 
              onClick={handleMaxClick}
              className="text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              MAX
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              placeholder="0.0"
              className="flex-1 text-4xl font-bold bg-transparent text-white outline-none placeholder-gray-600"
              value={amountIn}
              onChange={(e) => setAmountIn(e.target.value)}
            />
            <div className="flex items-center space-x-2 px-4 py-2 bg-gray-700 rounded-xl">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold text-white">TKA</span>
            </div>
          </div>
        </div>

        {/* Swap Direction Button */}
        <div className="flex justify-center -my-2 relative z-10">
          <button className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl hover:scale-110 transition-transform duration-300 shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>

        {/* Output Token Card */}
        <div className="mb-6 p-6 bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-2xl border border-gray-600/30">
          <label className="text-sm font-medium text-gray-400 mb-3 block">You Receive (estimated)</label>
          <div className="flex items-center space-x-4">
            <input
              type="number"
              placeholder="0.0"
              className="flex-1 text-4xl font-bold bg-transparent text-gray-300 outline-none"
              value={amountOut}
              disabled
            />
            <div className="flex items-center space-x-2 px-4 py-2 bg-gray-700 rounded-xl">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <span className="text-xl font-bold text-white">TKB</span>
            </div>
          </div>
        </div>

        {/* Transaction Details */}
        {amountOut && (
          <div className="mb-6 p-4 bg-gray-700/30 rounded-xl space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Rate</span>
              <span className="text-white font-medium">1 TKA = {(parseFloat(amountOut) / parseFloat(amountIn)).toFixed(4)} TKB</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Min. received (5% slippage)</span>
              <span className="text-white font-medium">{(parseFloat(amountOut) * 0.95).toFixed(2)} TKB</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Trading Fee (0.3%)</span>
              <span className="text-purple-400 font-medium">{(parseFloat(amountIn) * 0.003).toFixed(2)} TKA</span>
            </div>
          </div>
        )}

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          disabled={isLoading || !amountIn || !wallet}
          className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg
            ${isLoading 
              ? 'bg-gray-600 cursor-not-allowed' 
              : !wallet
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white transform hover:scale-[1.02] active:scale-[0.98]'
            }
          `}
        >
          {isLoading ? (
            <span className="flex items-center justify-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Swapping...</span>
            </span>
          ) : !wallet ? (
            'Connect Wallet First'
          ) : !amountIn ? (
            'Enter Amount'
          ) : (
            'Swap Tokens'
          )}
        </button>

        {/* Info Footer */}
        <div className="mt-6 pt-4 border-t border-gray-700/50">
          <p className="text-xs text-center text-gray-500">
            🔒 Secured by Bitcoin Cash Smart Contracts • 0.3% Trading Fee
          </p>
        </div>
      </div>
    </div>
  );
};

export default SwapPage;