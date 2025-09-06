import React, { useState } from 'react';
import { ToastType } from '../types';

interface LoginComponentProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
  onSignUp: (email: string, password: string) => Promise<boolean>;
  showToast: (message: string, type?: ToastType) => void;
  isLoading: boolean;
}

const LoginComponent: React.FC<LoginComponentProps> = ({ onLogin, onSignUp, showToast, isLoading }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isOtpStep, setIsOtpStep] = useState(false);
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin(email, password);
    }
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        showToast('Passwords do not match.', 'error');
        return;
    }
    // OTP simulation remains a frontend step for demo purposes
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otpCode);
    setIsOtpStep(true);
    showToast(`For demo, your OTP is: ${otpCode}`, 'success');
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === generatedOtp) {
        onSignUp(email, password);
    } else {
        showToast('Invalid OTP. Please try again.', 'error');
    }
  }

  const renderForm = () => {
    if(isOtpStep) {
        return (
            <form className="mt-8 space-y-6" onSubmit={handleOtpSubmit}>
                <p className="text-center text-gray-300">An OTP has been sent to your email (simulated). Please enter it below.</p>
                <div>
                    <input
                        id="otp"
                        name="otp"
                        type="text"
                        required
                        disabled={isLoading}
                        className="appearance-none relative block w-full px-3 py-3 border border-gray-600 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:opacity-50"
                        placeholder="6-Digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                </div>
                <div>
                    <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 disabled:bg-indigo-800 disabled:cursor-not-allowed">
                    {isLoading ? 'Creating Account...' : 'Verify & Create Account'}
                    </button>
                </div>
            </form>
        )
    }

    if (mode === 'login') {
      return (
        <form className="mt-8 space-y-6" onSubmit={handleLoginSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div><input id="email-address" name="email" type="email" required disabled={isLoading} className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-600 bg-gray-700 text-gray-200 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm disabled:opacity-50" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div><input id="password" name="password" type="password" required disabled={isLoading} className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-600 bg-gray-700 text-gray-200 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm disabled:opacity-50" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          </div>
          <div className="flex items-center justify-end text-sm"><a href="#" className="font-medium text-indigo-400 hover:text-indigo-300">Forgot your password?</a></div>
          <div><button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 disabled:bg-indigo-800 disabled:cursor-not-allowed">{isLoading ? 'Signing in...' : 'Sign in'}</button></div>
        </form>
      );
    }

    return (
      <form className="mt-8 space-y-6" onSubmit={handleSignUpSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div><input id="email-address" name="email" type="email" required disabled={isLoading} className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-600 bg-gray-700 text-gray-200 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm disabled:opacity-50" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div><input id="password" name="password" type="password" required disabled={isLoading} className="appearance-none rounded-none relative block w-full px-3 py-3 border-t-0 border-b-0 border border-gray-600 bg-gray-700 text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm disabled:opacity-50" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
            <div><input id="confirm-password" name="confirm-password" type="password" required disabled={isLoading} className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-600 bg-gray-700 text-gray-200 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm disabled:opacity-50" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></div>
          </div>
          <div><button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-900 disabled:bg-indigo-800 disabled:cursor-not-allowed">Sign up</button></div>
      </form>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-2xl shadow-lg border border-gray-700">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">QuantumLeap Staking</h1>
          <p className="mt-2 text-gray-400">
            {isOtpStep ? "Verify Your Account" : (mode === 'login' ? 'Welcome back, Trader. Access your portfolio.' : 'Create your account to get started.')}
          </p>
        </div>
        
        {!isOtpStep && (
            <div className="flex border-b border-gray-700">
                <button onClick={() => setMode('login')} className={`flex-1 py-3 text-sm font-medium transition-colors ${mode === 'login' ? 'text-white border-b-2 border-indigo-500' : 'text-gray-400 hover:text-white'}`}>Sign In</button>
                <button onClick={() => setMode('signup')} className={`flex-1 py-3 text-sm font-medium transition-colors ${mode === 'signup' ? 'text-white border-b-2 border-indigo-500' : 'text-gray-400 hover:text-white'}`}>Sign Up</button>
            </div>
        )}

        {renderForm()}
      </div>
    </div>
  );
};

export default LoginComponent;