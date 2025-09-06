
import React from 'react';
import { Transaction, TransactionType } from '../types';

interface HistoryProps {
    transactions: Transaction[];
}

const getStatusBadge = (status: 'Completed' | 'Pending' | 'Failed') => {
    switch (status) {
        case 'Completed': return 'bg-green-500 text-green-900';
        case 'Pending': return 'bg-yellow-500 text-yellow-900';
        case 'Failed': return 'bg-red-500 text-red-900';
    }
};

const getAmountColor = (type: TransactionType) => {
    switch (type) {
        case TransactionType.DEPOSIT:
        case TransactionType.DIVIDEND:
        case TransactionType.STAKE_RETURN:
            return 'text-green-400';
        case TransactionType.WITHDRAWAL:
        case TransactionType.STAKE:
            return 'text-red-400';
        default:
            return 'text-gray-200';
    }
}

const History: React.FC<HistoryProps> = ({ transactions }) => {
    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-white">Transaction History</h1>
            <div className="bg-gray-800 rounded-lg border border-gray-700 shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-700">
                        <thead className="bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Type</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Details</th>
                            </tr>
                        </thead>
                        <tbody className="bg-gray-800 divide-y divide-gray-700">
                            {transactions.length > 0 ? transactions.map((tx) => (
                                <tr key={tx.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(tx.date).toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">{tx.type}</td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${getAmountColor(tx.type)}`}>
                                        {getAmountColor(tx.type) === 'text-green-400' ? '+' : '-'} ${tx.amount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(tx.status)}`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{tx.details}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-10 text-gray-400">No transactions yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default History;
