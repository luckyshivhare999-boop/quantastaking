import React, { useState, useEffect, useCallback } from 'react';
import { User, StoredUser, Stake, Transaction, TransactionType, ToastMessage, ToastType } from './types';
import { STAKING_PLAN } from './constants';

import LoginComponent from './components/Login';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Staking from './components/Staking';
import Wallet from './components/Wallet';
import History from './components/History';
import Toast from './components/Toast';

// In a real application, this would be handled by a secure backend and database.
// We simulate it here for demonstration.
const USERS_STORAGE_KEY = 'quantumleap_users';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [storedUsers, setStoredUsers] = useState<StoredUser[]>([]);
  
  const [activePage, setActivePage] = useState('dashboard');
  
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stakes, setStakes] = useState<Stake[]>([]);

  // Load persisted user accounts from localStorage on initial load
  useEffect(() => {
    try {
      const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);
      if (savedUsers) {
        setStoredUsers(JSON.parse(savedUsers));
      }
    } catch (error) {
      console.error("Failed to load users from localStorage", error);
    }
  }, []);

  const showToast = (message: string, type: ToastType = 'error') => {
    setToast({ message, type });
  };
  
  const addTransaction = useCallback((newTransaction: Omit<Transaction, 'id' | 'date'>) => {
    setTransactions(prev => [{ ...newTransaction, id: `T${Date.now()}`, date: new Date().toISOString() }, ...prev]);
  }, []);

  const fetchData = useCallback(async () => {
    if (!currentUser) return;
    setIsLoading(true);
    // BACKEND NOTE: In a real app, this would fetch all user data from your server.
    await new Promise(res => setTimeout(res, 500)); // Simulate network delay
    
    // Simulate fetching data for the logged-in user.
    // In a real app, you wouldn't need this filtering logic here.
    // For now, we just reset the state to avoid duplication.
    setTransactions([]);
    setStakes([]);
    
    addTransaction({ type: TransactionType.DEPOSIT, amount: currentUser.balance, status: 'Completed', details: 'Initial Balance'});
    setIsLoading(false);
  }, [currentUser, addTransaction]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn, fetchData]);


  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    // BACKEND NOTE: This would be a POST request to your '/api/auth/login' endpoint.
    // The backend would verify credentials against the database.
    await new Promise(res => setTimeout(res, 1000)); // Simulate API call

    const userExists = storedUsers.find(u => u.email === email && u.password === password);
    setIsLoading(false);
    
    if (userExists) {
      // The API would return a user object and a JWT token.
      const sessionUser: User = { email, balance: 5000 };
      setCurrentUser(sessionUser);
      setIsLoggedIn(true);
      return true;
    } else {
      showToast('Invalid email or password.', 'error');
      return false;
    }
  };

  const handleSignUp = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    // BACKEND NOTE: This would be a POST request to '/api/auth/signup'.
    // The backend would hash the password and create a new user in the database.
    await new Promise(res => setTimeout(res, 1000));

    const userExists = storedUsers.find(u => u.email === email);
    if (userExists) {
        showToast('An account with this email already exists.', 'error');
        setIsLoading(false);
        return false;
    }

    const newUser: StoredUser = { email, password };
    const updatedUsers = [...storedUsers, newUser];
    setStoredUsers(updatedUsers);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers)); // Simulating DB persistence
    
    setIsLoading(false);
    showToast('Account created successfully! Logging you in.', 'success');
    return await handleLogin(email, password);
  };


  const handleLogout = () => {
    // BACKEND NOTE: This would call '/api/auth/logout' to invalidate the session/token.
    setIsLoggedIn(false);
    setCurrentUser(null);
    setStakes([]);
    setTransactions([]);
    setActivePage('dashboard');
  };

  const handleDeposit = async (amount: number) => {
    setIsLoading(true);
    // BACKEND NOTE: This would be a POST request to '/api/wallet/confirm-deposit'.
    // The backend would then need to verify with a blockchain explorer API (like BSCScan)
    // that a transaction of that amount was actually sent to the company wallet from the user.
    // This is a complex but critical verification step.
    await new Promise(res => setTimeout(res, 1500));
    
    if (currentUser) {
      setCurrentUser({ ...currentUser, balance: currentUser.balance + amount });
      addTransaction({type: TransactionType.DEPOSIT, amount, status: 'Completed'});
      showToast('Deposit confirmed successfully!', 'success');
    }
    setIsLoading(false);
  };

  const handleWithdrawal = async (amount: number, address: string): Promise<boolean> => {
    if (!currentUser) return false;
    if (currentUser.balance < amount) {
        showToast('Withdrawal failed: Insufficient balance.', 'error');
        return false;
    }

    setIsLoading(true);
    // BACKEND NOTE: This POST to '/api/wallet/request-withdrawal' would be critical.
    // The backend would add this request to a queue for manual or semi-automated processing.
    // For security, the backend would then use a secure, air-gapped system to sign and broadcast
    // the real USDT transaction from the company's hot wallet to the user's `address`.
    await new Promise(res => setTimeout(res, 1500));

    setCurrentUser({ ...currentUser, balance: currentUser.balance - amount });
    addTransaction({
      type: TransactionType.WITHDRAWAL,
      amount,
      status: 'Pending',
      details: `To address: ${address}`,
    });
    showToast('Withdrawal request sent successfully!', 'success');
    setIsLoading(false);
    return true;
  };

  const handleStake = async (amount: number): Promise<boolean> => {
    if(!currentUser) return false;
    if (currentUser.balance < amount) {
        showToast('Stake failed: Insufficient balance.', 'error');
        return false;
    }
    
    setIsLoading(true);
    // BACKEND NOTE: A POST to '/api/stakes/create'. The backend would create a new stake
    // record in the database associated with the user's account.
    await new Promise(res => setTimeout(res, 1000));
    
    setCurrentUser({...currentUser, balance: currentUser.balance - amount});
    const newStake: Stake = {
        id: `S${Date.now()}`,
        amount,
        startDate: new Date().toISOString(),
        dividendsPaid: 0,
        isActive: true,
    };
    setStakes(prev => [...prev, newStake]);
    addTransaction({type: TransactionType.STAKE, amount, status: 'Completed'});
    showToast(`Successfully staked $${amount.toLocaleString()}`, 'success');
    setIsLoading(false);
    return true;
  };
  
    // This function simulates syncing dividend/stake updates from the backend
    const handleSyncDividends = async () => {
        setIsLoading(true);
        showToast('Syncing with server...', 'success');
        // BACKEND NOTE: A GET request to '/api/stakes/sync'. The backend would calculate all
        // dividends earned since the last sync for this user, update the database,
        // and return the new totals. This logic should be a CRON job on the server.
        await new Promise(res => setTimeout(res, 2000));

        let totalDividends = 0;
        const now = new Date();

        const updatedStakes = stakes.map(stake => {
          if (stake.isActive) {
            const monthsPassed = Math.floor((now.getTime() - new Date(stake.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30));
            const potentialDividends = (stake.amount * STAKING_PLAN.monthlyDividend) * Math.min(monthsPassed, STAKING_PLAN.durationMonths);
            const newDividends = potentialDividends - stake.dividendsPaid;
            
            if (newDividends > 0) {
              totalDividends += newDividends;
              return { ...stake, dividendsPaid: stake.dividendsPaid + newDividends };
            }
          }
          return stake;
        });

        if (totalDividends > 0) {
          setCurrentUser(prevUser => prevUser ? { ...prevUser, balance: prevUser.balance + totalDividends } : null);
          addTransaction({ type: TransactionType.DIVIDEND, amount: totalDividends, status: 'Completed' });
        }
        setStakes(updatedStakes);
        setIsLoading(false);
        showToast('Data synced!', 'success');
    }


  const renderContent = () => {
    if (!currentUser) return null;
    switch (activePage) {
      case 'dashboard':
        return <Dashboard user={currentUser} stakes={stakes} transactions={transactions} onSync={handleSyncDividends} isLoading={isLoading} />;
      case 'staking':
        return <Staking user={currentUser} stakes={stakes} onStake={handleStake} showToast={showToast} isLoading={isLoading} />;
      case 'wallet':
        return <Wallet user={currentUser} onDeposit={handleDeposit} onWithdrawal={handleWithdrawal} showToast={showToast} isLoading={isLoading} />;
      case 'history':
        return <History transactions={transactions} />;
      default:
        return <Dashboard user={currentUser} stakes={stakes} transactions={transactions} onSync={handleSyncDividends} isLoading={isLoading} />;
    }
  };
  
  if (!isLoggedIn) {
    return (
      <>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        <LoginComponent onLogin={handleLogin} onSignUp={handleSignUp} showToast={showToast} isLoading={isLoading} />
      </>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <Sidebar activePage={activePage} setActivePage={setActivePage} onLogout={handleLogout} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={currentUser} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900 p-4 sm:p-6 lg:p-8">
          <div key={activePage} className="animate-fadeIn">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}