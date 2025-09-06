import React, { useState } from 'react';
import { User, Stake, ToastType } from '../types';
import { STAKING_PLAN } from '../constants';

interface StakingProps {
    user: User;
    stakes: Stake[];
    onStake: (amount: number) => Promise<boolean>;
    showToast: (message: string, type: ToastType) => void;
    isLoading: boolean;
}

const Staking: React.FC<StakingProps> = ({ user, stakes, onStake, showToast, isLoading }) => {
    const [amount, setAmount] = useState('');

    const handleStake = async (e: React.FormEvent) => {
        e.preventDefault();
        const stakeAmount = parseFloat(amount);
        if(isNaN(stakeAmount) || stakeAmount <= 0) {
            showToast('Please enter a valid amount.', 'error');
            return;
        }
        
        const success = await onStake(stakeAmount);
        if (success) {
            setAmount('');
        }
    };

    const getProgress = (startDate: string) => {
        const start = new Date(startDate).getTime();
        const now = new Date().getTime();
        const monthsPassed = (now - start) / (1000 * 60 * 60 * 24 * 30);
        return Math.min((monthsPassed / STAKING_PLAN.durationMonths) * 100, 100);
    }
    
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Staking</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
                        <h2 className="text-xl font-semibold text-white">The QuantumLeap Plan</h2>
                        <ul className="mt-4 space-y-3 text-gray-300">
                            <li className="flex justify-between"><span>Monthly Dividend:</span> <span className="font-semibold text-green-400">{STAKING_PLAN.monthlyDividend * 100}%</span></li>
                            <li className="flex justify-between"><span>Duration:</span> <span className="font-semibold">{STAKING_PLAN.durationMonths} Months</span></li>
                            <li className="flex justify-between"><span>Principal Return:</span> <span className="font-semibold text-indigo-400">{STAKING_PLAN.returnMultiplier}x</span></li>
                        </ul>
                    </div>
                    <form onSubmit={handleStake} className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
                        <h3 className="text-lg font-medium text-white">Create New Stake</h3>
                        <p className="text-sm text-gray-400 mt-1 mb-4">Your Balance: ${user.balance.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                        <div>
                            <label htmlFor="stake-amount" className="block text-sm font-medium text-gray-300">Amount (USDT)</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-400 sm:text-sm">$</span>
                                </div>
                                <input 
                                    type="number"
                                    id="stake-amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    disabled={isLoading}
                                    className="appearance-none block w-full px-3 py-3 pl-7 pr-12 border border-gray-600 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-50"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                        <button type="submit" disabled={isLoading} className="mt-4 w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200 disabled:bg-indigo-800 disabled:cursor-not-allowed">
                            {isLoading ? 'Processing...' : 'Stake Now'}
                        </button>
                    </form>
                </div>
                <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
                    <h2 className="text-xl font-semibold text-white mb-4">Your Stakes</h2>
                    <div className="space-y-4">
                        {stakes.length > 0 ? stakes.map(stake => (
                            <div key={stake.id} className="bg-gray-700 p-4 rounded-md">
                                <div className="flex justify-between items-center">
                                    <p className="font-semibold text-lg text-white">${stake.amount.toLocaleString()}</p>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${stake.isActive ? 'bg-green-500 text-green-900' : 'bg-gray-500 text-gray-900'}`}>{stake.isActive ? 'Active' : 'Completed'}</span>
                                </div>
                                <div className="mt-2">
                                    <div className="flex justify-between text-sm text-gray-300 mb-1">
                                        <span>Progress</span>
                                        <span>{getProgress(stake.startDate).toFixed(0)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-600 rounded-full h-2.5">
                                        <div className="bg-indigo-500 h-2.5 rounded-full" style={{width: `${getProgress(stake.startDate)}%`}}></div>
                                    </div>
                                </div>
                                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                                    <p className="text-gray-400">Start Date: <span className="text-gray-200">{new Date(stake.startDate).toLocaleDateString()}</span></p>
                                    <p className="text-gray-400">Dividends Paid: <span className="text-green-400">${stake.dividendsPaid.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></p>
                                </div>
                            </div>
                        )) : <p className="text-gray-400">You have no active stakes.</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Staking;