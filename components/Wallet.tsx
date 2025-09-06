import React, { useState } from 'react';
import { User, ToastType } from '../types';
import { DEPOSIT_ADDRESS, ICONS } from '../constants';

interface WalletProps {
    user: User;
    onDeposit: (amount: number) => Promise<void>;
    onWithdrawal: (amount: number, address: string) => Promise<boolean>;
    showToast: (message: string, type: ToastType) => void;
    isLoading: boolean;
}

const Wallet: React.FC<WalletProps> = ({ user, onDeposit, onWithdrawal, showToast, isLoading }) => {
    const [depositAmount, setDepositAmount] = useState('');
    const [withdrawalAmount, setWithdrawalAmount] = useState('');
    const [withdrawalAddress, setWithdrawalAddress] = useState('');
    
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(DEPOSIT_ADDRESS).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };
    
    const handleDepositSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const amount = parseFloat(depositAmount);
        if (isNaN(amount) || amount <= 0) {
            showToast('Please enter a valid deposit amount.', 'error');
            return;
        }
        await onDeposit(amount);
        setDepositAmount('');
    };

    const handleWithdrawalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const amount = parseFloat(withdrawalAmount);
        if (isNaN(amount) || amount <= 0) {
            showToast('Please enter a valid withdrawal amount.', 'error');
            return;
        }
        if (!withdrawalAddress.startsWith('0x') || withdrawalAddress.length !== 42) {
            showToast('Please enter a valid BEP20 address.', 'error');
            return;
        }

        const success = await onWithdrawal(amount, withdrawalAddress);
        if (success) {
            setWithdrawalAmount('');
            setWithdrawalAddress('');
        }
    };

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Wallet</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Deposit Section */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
                    <h2 className="text-xl font-semibold text-white mb-4">Deposit USDT (BEP20)</h2>
                    <p className="text-gray-400 mb-4">Send funds to the address below. After sending, enter the amount to update your balance.</p>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300">Deposit Address</label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                            <input type="text" readOnly value={DEPOSIT_ADDRESS} className="flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-600 bg-gray-700 text-gray-300 p-2"/>
                            <button onClick={handleCopy} className="relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-600 text-sm font-medium rounded-r-md text-gray-300 bg-gray-600 hover:bg-gray-500">
                                {isCopied ? ICONS.check : ICONS.copy}
                                <span>{isCopied ? 'Copied!' : 'Copy'}</span>
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-center my-4">
                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${DEPOSIT_ADDRESS}`} alt="QR Code" className="rounded-lg"/>
                    </div>
                    <form onSubmit={handleDepositSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="deposit-amount" className="block text-sm font-medium text-gray-300">Amount Deposited (USDT)</label>
                            <input type="number" id="deposit-amount" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} disabled={isLoading} className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-50" placeholder="1000.00" />
                        </div>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className={`w-full text-white font-semibold py-2 px-4 rounded-md transition-all duration-300 flex justify-center items-center bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed`}
                        >
                            {isLoading ? 'Processing...' : 'Confirm Deposit'}
                        </button>
                    </form>
                </div>

                {/* Withdrawal Section */}
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
                    <h2 className="text-xl font-semibold text-white mb-4">Withdraw USDT (BEP20)</h2>
                    <p className="text-gray-400 mb-4">Withdrawals are processed within 48 hours. Your balance will be updated immediately.</p>
                     <p className="text-sm text-gray-300 mb-4">Your Balance: <span className="font-semibold text-white">${user.balance.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></p>
                    <form onSubmit={handleWithdrawalSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="withdrawal-amount" className="block text-sm font-medium text-gray-300">Amount (USDT)</label>
                            <input type="number" id="withdrawal-amount" value={withdrawalAmount} onChange={(e) => setWithdrawalAmount(e.target.value)} disabled={isLoading} className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-50" placeholder="500.00" />
                        </div>
                        <div>
                            <label htmlFor="withdrawal-address" className="block text-sm font-medium text-gray-300">Your USDT BEP20 Address</label>
                            <input type="text" id="withdrawal-address" value={withdrawalAddress} onChange={(e) => setWithdrawalAddress(e.target.value)} disabled={isLoading} className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-50" placeholder="0x..." />
                        </div>
                        <button
                          type="submit"
                          disabled={isLoading}
                          className={`w-full text-white font-semibold py-2 px-4 rounded-md transition-all duration-300 flex justify-center items-center bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 disabled:cursor-not-allowed`}
                        >
                            {isLoading ? 'Processing...' : 'Request Withdrawal'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Wallet;