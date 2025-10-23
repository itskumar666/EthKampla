'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import CreatePoolForm from '@/components/CreatePoolForm';
import PoolsList from '@/components/PoolsList';
import AIChatbot from '@/components/AIChatbot';
import { Coins, Shield, Zap } from 'lucide-react';

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-2 rounded-xl">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                MicroSave AI
              </h1>
              <p className="text-xs text-gray-500">Powered by Base</p>
            </div>
          </div>
          <ConnectButton />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!isConnected ? (
          <div className="text-center py-20">
            <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl mx-auto">
              <div className="text-6xl mb-6">💰</div>
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Welcome to MicroSave AI
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                AI-powered micro-savings for African communities
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="flex flex-col items-center gap-2">
                  <Shield className="w-12 h-12 text-blue-600" />
                  <h3 className="font-semibold">Secure</h3>
                  <p className="text-sm text-gray-600 text-center">
                    Smart contracts on Base blockchain
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Zap className="w-12 h-12 text-purple-600" />
                  <h3 className="font-semibold">Low Fees</h3>
                  <p className="text-sm text-gray-600 text-center">
                    Minimal transaction costs
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <Coins className="w-12 h-12 text-pink-600" />
                  <h3 className="font-semibold">AI Powered</h3>
                  <p className="text-sm text-gray-600 text-center">
                    Smart financial assistant
                  </p>
                </div>
              </div>

              <p className="text-gray-700 mb-6">
                Connect your wallet to start saving with your community
              </p>
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <button
                    onClick={openConnectModal}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-xl transition-all duration-300"
                  >
                    Connect Wallet to Get Started
                  </button>
                )}
              </ConnectButton.Custom>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Your Savings Dashboard
              </h2>
              <p className="text-gray-600">
                Create pools, contribute to community goals, and grow your savings together
              </p>
            </div>

            <CreatePoolForm />

            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Active Savings Pools</h3>
              <PoolsList />
            </div>
          </div>
        )}
      </main>

      <AIChatbot />
    </div>
  );
}
