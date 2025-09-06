import React from 'react';
import { User, Stake, Transaction } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  user: User;
  stakes: Stake[];
  transactions: Transaction[];
  onSync: () => void;
  isLoading: boolean;
}

const StatCard: React.FC<{ title: string; value: string; color: string }> = ({ title, value, color }) => (
    <div className={`bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg`}>
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        <p className={`mt-2 text-3xl font-semibold ${color}`}>{value}</p>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ user, stakes, transactions, onSync, isLoading }) => {
    const totalStaked = stakes.filter(s => s.isActive).reduce((sum, stake) => sum + stake.amount, 0);
    const totalDividends = stakes.reduce((sum, stake) => sum + stake.dividendsPaid, 0);

    const generateChartData = () => {
        if(transactions.length === 0) return [{name: 'Start', value: 0}];
        let runningBalance = 0;
        const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        return sorted.map((t, i) => {
            if(t.type === 'Deposit' || t.type === 'Dividend Payout' || t.type === 'Stake Principal Return') {
                runningBalance += t.amount;
            } else if (t.type === 'Withdrawal' || t.type === 'Stake') {
                runningBalance -= t.amount;
            }
            return {
                name: `T${i+1}`,
                value: runningBalance,
            }
        });
    }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <button onClick={onSync} disabled={isLoading} className="flex items-center px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition duration-200 disabled:bg-indigo-800 disabled:cursor-not-allowed">
            {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : null}
            {isLoading ? 'Syncing...' : 'Sync Dividends'}
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Current Balance" value={`$${user.balance.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} color="text-green-400" />
          <StatCard title="Total Staked" value={`$${totalStaked.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} color="text-indigo-400" />
          <StatCard title="Total Dividends Paid" value={`$${totalDividends.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} color="text-yellow-400" />
          <StatCard title="Active Stakes" value={stakes.filter(s => s.isActive).length.toString()} color="text-blue-400" />
      </div>

      <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">Portfolio Growth</h2>
        <div style={{ width: '100%', height: 400 }}>
             <ResponsiveContainer>
                <LineChart
                    data={generateChartData()}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                    <XAxis dataKey="name" stroke="#A0AEC0" />
                    <YAxis stroke="#A0AEC0" />
                    <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }} />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#6366F1" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} name="Portfolio Value (USDT)" />
                </LineChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;