export interface User {
  email: string;
  balance: number;
}

export interface StoredUser {
  email: string;
  password: string;
}

export interface Stake {
  id: string;
  amount: number;
  startDate: string;
  dividendsPaid: number;
  isActive: boolean;
}

export enum TransactionType {
  DEPOSIT = 'Deposit',
  WITHDRAWAL = 'Withdrawal',
  STAKE = 'Stake',
  DIVIDEND = 'Dividend Payout',
  STAKE_RETURN = 'Stake Principal Return',
}

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  amount: number;
  status: 'Completed' | 'Pending' | 'Failed';
  details?: string;
}

export type ToastType = 'success' | 'error';

export interface ToastMessage {
  message: string;
  type: ToastType;
}