'use client';

import { useReadContract, useWriteContract, useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { SAVINGS_POOL_ABI, CONTRACT_ADDRESS } from '@/lib/contract';
import { Users, Target, TrendingUp, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Pool {
  name: string;
  creator: string;
  targetAmount: bigint;
  contributionAmount: bigint;
  totalContributed: bigint;
  memberCount: bigint;
  isActive: boolean;
}

export default function PoolsList() {
  const { address } = useAccount();
  const [contributingTo, setContributingTo] = useState<number | null>(null);

  const { data: poolCount } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: SAVINGS_POOL_ABI,
    functionName: 'getPoolCount',
  });

  const { writeContract, isPending, data: hash, reset } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        setContributingTo(null);
        reset(); // Reset transaction state
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, reset]);

  const handleContribute = (poolId: number, amount: bigint) => {
    setContributingTo(poolId);
    writeContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: SAVINGS_POOL_ABI,
      functionName: 'contribute',
      args: [BigInt(poolId)],
      value: amount,
    });
  };

  if (!CONTRACT_ADDRESS) {
    return (
      <div className="text-center py-12 bg-yellow-50 rounded-xl border border-yellow-200">
        <p className="text-yellow-800">⚠️ Contract not deployed yet. Deploy the smart contract first!</p>
      </div>
    );
  }

  const count = Number(poolCount || 0);

  if (count === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
        <div className="text-6xl mb-4">💰</div>
        <p className="text-gray-600 text-lg font-medium">No pools yet</p>
        <p className="text-gray-500 text-sm mt-2">Create the first savings pool to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <PoolCard 
          key={i} 
          poolId={i} 
          onContribute={handleContribute}
          isContributing={contributingTo === i && isPending}
          userAddress={address}
        />
      ))}
    </div>
  );
}

function PoolCard({ 
  poolId, 
  onContribute, 
  isContributing,
  userAddress 
}: { 
  poolId: number; 
  onContribute: (id: number, amount: bigint) => void;
  isContributing: boolean;
  userAddress?: string;
}) {
  const { data: poolData } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: SAVINGS_POOL_ABI,
    functionName: 'getPool',
    args: [BigInt(poolId)],
  });

  const { data: myContribution } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: SAVINGS_POOL_ABI,
    functionName: 'getMemberContribution',
    args: [BigInt(poolId), userAddress as `0x${string}`],
    query: { enabled: !!userAddress },
  });

  if (!poolData) return null;

  const [name, creator, targetAmount, contributionAmount, totalContributed, memberCount, isActive] = poolData as any;
  const progress = Number(totalContributed) / Number(targetAmount) * 100;

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-800">{name}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
        }`}>
          {isActive ? '🟢 Active' : '⚫ Closed'}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Target className="w-4 h-4" />
          <span>Target: {formatEther(targetAmount)} ETH</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <TrendingUp className="w-4 h-4" />
          <span>Contribution: {formatEther(contributionAmount)} ETH</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          <span>{Number(memberCount)} members</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Progress</span>
          <span className="font-semibold text-blue-600">{progress.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {formatEther(totalContributed)} / {formatEther(targetAmount)} ETH raised
        </p>
      </div>

      {myContribution && Number(myContribution) > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-blue-800">
            💎 Your contribution: <span className="font-semibold">{formatEther(myContribution)} ETH</span>
          </p>
        </div>
      )}

      {isActive && (
        <button
          onClick={() => onContribute(poolId, contributionAmount)}
          disabled={isContributing}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
        >
          {isContributing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Contributing...
            </>
          ) : (
            `Contribute ${formatEther(contributionAmount)} ETH`
          )}
        </button>
      )}
    </div>
  );
}
