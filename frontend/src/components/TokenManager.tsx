import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Coins, Send, TrendingUp, Award, Zap } from 'lucide-react';

/**
 * Token Management component for ICP blockchain features
 */
const TokenManager: React.FC = () => {
  const { user } = useAuth();
  const [transferAmount, setTransferAmount] = useState('');
  const [transferRecipient, setTransferRecipient] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);

  const handleTransfer = async () => {
    if (!transferAmount || !transferRecipient) {
      alert('Please fill in all fields');
      return;
    }

    setIsTransferring(true);
    try {
      // In a real app, this would call the ICP canister
      console.log(`Transferring ${transferAmount} tokens to ${transferRecipient}`);

      // Simulate transfer
      await new Promise(resolve => setTimeout(resolve, 2000));

      alert('Transfer successful! (This would be a real blockchain transaction in production)');
      setTransferAmount('');
      setTransferRecipient('');
    } catch (error) {
      console.error('Transfer failed:', error);
      alert('Transfer failed. Please try again.');
    } finally {
      setIsTransferring(false);
    }
  };

  const tokenBalance = user?.studyTokens?.toString() || '0';
  const studyStreak = user?.studyStreak || 0;

  return (
    <div className="space-y-6">
      {/* Token Balance Card */}
      <div className="glass p-6 rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Study Tokens</h3>
          <Coins className="h-6 w-6 text-yellow-500" />
        </div>

        <div className="text-3xl font-bold text-gray-900 mb-2">
          {tokenBalance} <span className="text-lg text-gray-500">STK</span>
        </div>

        <p className="text-sm text-gray-600">
          Earn tokens by participating in study groups, uploading resources, and maintaining study streaks.
        </p>
      </div>

      {/* Token Transfer */}
      <div className="glass p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Send className="h-5 w-5 mr-2 text-indigo-500" />
          Transfer Tokens
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipient Principal ID
            </label>
            <input
              type="text"
              value={transferRecipient}
              onChange={(e) => setTransferRecipient(e.target.value)}
              placeholder="Enter recipient's Principal ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (STK)
            </label>
            <input
              type="number"
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              placeholder="Enter amount to transfer"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            onClick={handleTransfer}
            disabled={isTransferring}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center"
          >
            {isTransferring ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Transferring...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Transfer Tokens
              </>
            )}
          </button>
        </div>
      </div>

      {/* Study Streak & Achievements */}
      <div className="glass p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Zap className="h-5 w-5 mr-2 text-orange-500" />
          Study Streak
        </h3>

        <div className="text-2xl font-bold text-orange-600 mb-2">
          {studyStreak} days
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Maintain your study streak to earn bonus tokens and unlock achievements.
        </p>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
          <p className="text-sm text-orange-800">
            <strong>Next milestone:</strong> {7 - (studyStreak % 7)} days until next bonus
          </p>
        </div>
      </div>

      {/* Token Earning Opportunities */}
      <div className="glass p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
          Earn More Tokens
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div>
              <p className="font-medium text-green-900">Create Study Group</p>
              <p className="text-sm text-green-700">Start a new study group</p>
            </div>
            <div className="text-green-600 font-bold">+50 STK</div>
          </div>

          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div>
              <p className="font-medium text-blue-900">Upload Resource</p>
              <p className="text-sm text-blue-700">Share study materials</p>
            </div>
            <div className="text-blue-600 font-bold">+30 STK</div>
          </div>

          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <div>
              <p className="font-medium text-purple-900">Complete Study Session</p>
              <p className="text-sm text-purple-700">Participate in group sessions</p>
            </div>
            <div className="text-purple-600 font-bold">+40 STK</div>
          </div>

          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div>
              <p className="font-medium text-yellow-900">7-Day Streak Bonus</p>
              <p className="text-sm text-yellow-700">Maintain study consistency</p>
            </div>
            <div className="text-yellow-600 font-bold">+100 STK</div>
          </div>
        </div>
      </div>

      {/* ICP Integration Info */}
      <div className="glass p-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Award className="h-5 w-5 mr-2 text-indigo-500" />
          ICP Blockchain Features
        </h3>

        <div className="space-y-3 text-sm text-gray-700">
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
            <span>Study tokens are stored on the Internet Computer blockchain</span>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
            <span>All transactions are transparent and immutable</span>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
            <span>No gas fees for token transfers</span>
          </div>
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
            <span>Decentralized governance for platform decisions</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenManager;
