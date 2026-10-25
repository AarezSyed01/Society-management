import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const AuthPage: React.FC = () => {
  const { society, flats, login, register } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regFlatId, setRegFlatId] = useState<number | ''>('');
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Please enter both email and password.');
      return;
    }

    const res = login(loginEmail, loginPassword);
    if (!res.success) {
      setLoginError(res.error || 'Invalid credentials.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegSuccess(null);

    if (!regName.trim() || !regEmail.trim() || !regPhone.trim() || !regPassword.trim()) {
      setRegError('Please complete all required fields.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match.');
      return;
    }

    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters.');
      return;
    }

    if (!regFlatId) {
      setRegError('Please choose your assigned flat.');
      return;
    }

    const res = register({
      name: regName.trim(),
      email: regEmail.trim(),
      phone: regPhone.trim(),
      password: regPassword,
      flat_id: Number(regFlatId),
    });

    if (!res.success) {
      setRegError(res.error || 'Registration failed.');
      return;
    }

    setRegSuccess('Registration successful! You are now logged in as resident.');
  };

  const quickFillAdmin = () => {
    setLoginEmail('admin@society.org');
    setLoginPassword('admin123');
    setLoginError(null);
  };

  const quickFillResident = () => {
    setLoginEmail('amit@verma.com');
    setLoginPassword('resident123');
    setLoginError(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-8 px-4 text-xs">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Project Title Banner */}
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold text-slate-800 m-0">Society Management System</h1>
          <p className="text-slate-500 m-0 mt-0.5">
            BCA Capstone Project (Academic Year 2026–2027)
          </p>
          <div className="text-[11px] text-blue-700 font-semibold">{society.name}</div>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded border border-slate-300 shadow-sm overflow-hidden">
          {/* Card Header Tabs */}
          <div className="flex border-b border-slate-300 bg-slate-50">
            <button
              onClick={() => { setMode('login'); setLoginError(null); }}
              className={`flex-1 py-2.5 font-bold text-center border-b-2 transition-colors ${
                mode === 'login' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In (Login)
            </button>
            <button
              onClick={() => { setMode('register'); setRegError(null); }}
              className={`flex-1 py-2.5 font-bold text-center border-b-2 transition-colors ${
                mode === 'register' ? 'border-blue-600 text-blue-700 bg-white' : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Resident Registration
            </button>
          </div>

          <div className="p-5">
            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-3">
                {loginError && (
                  <div className="p-2 bg-red-100 border border-red-300 text-red-800 rounded font-medium">
                    {loginError}
                  </div>
                )}

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. admin@society.org"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Enter password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="pt-1">
                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold shadow-2xs"
                  >
                    Login to Society Portal
                  </button>
                </div>

                {/* Faculty Evaluation Preset Box */}
                <div className="mt-4 pt-3 border-t border-slate-200">
                  <div className="text-[11px] text-slate-500 font-semibold mb-1 text-center">
                    Examiner / Viva Quick Demo Logins:
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={quickFillAdmin}
                      className="py-1 px-2 border border-blue-300 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded font-semibold text-[11px]"
                    >
                      Login as Admin
                    </button>
                    <button
                      type="button"
                      onClick={quickFillResident}
                      className="py-1 px-2 border border-green-300 bg-green-50 hover:bg-green-100 text-green-800 rounded font-semibold text-[11px]"
                    >
                      Login as Resident
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-2.5">
                {regError && (
                  <div className="p-2 bg-red-100 border border-red-300 text-red-800 rounded font-medium">
                    {regError}
                  </div>
                )}
                {regSuccess && (
                  <div className="p-2 bg-green-100 border border-green-300 text-green-800 rounded font-medium">
                    {regSuccess}
                  </div>
                )}

                <div>
                  <label className="font-semibold text-slate-700 block mb-0.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Rohit Patil"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-0.5">Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="rohit@example.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-0.5">Mobile *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98200 00000"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-0.5">Select Apartment / Flat *</label>
                  <select
                    required
                    value={regFlatId}
                    onChange={(e) => setRegFlatId(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                  >
                    <option value="">-- Choose Flat --</option>
                    {flats.map((f) => (
                      <option key={f.flat_id} value={f.flat_id}>
                        Flat {f.block}-{f.flat_no} ({f.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-0.5">Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="Min 6 characters"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-0.5">Confirm Password *</label>
                    <input
                      type="password"
                      required
                      placeholder="Repeat password"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold shadow-2xs"
                  >
                    Register Resident Account
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="text-center mt-3 text-slate-400 text-[11px]">
          Society Management System · Python Flask & MySQL Backend Architecture
        </div>
      </div>
    </div>
  );
};
