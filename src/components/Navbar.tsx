import React from 'react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { currentUser, currentFlat, society, activeTab, setActiveTab, logout, switchUser, users } = useApp();

  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="bg-[#1e3a8a] text-white shadow-sm border-b border-blue-900">
      {/* Main Navbar Title and Navigation Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between py-2.5">
          <div>
            <h1
              className="text-lg sm:text-xl font-bold tracking-tight cursor-pointer m-0 leading-tight"
              onClick={() => setActiveTab('dashboard')}
            >
              Society Management System
            </h1>
            <p className="text-xs text-blue-200 m-0">
              {society.name} · BCA Capstone Project
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            {/* Role Switcher */}
            <div className="flex items-center gap-1.5 bg-blue-950 px-2 py-1 rounded border border-blue-800">
              <span className="text-blue-200 text-[11px]">Role:</span>
              <select
                value={currentUser?.user_id || ''}
                onChange={(e) => switchUser(Number(e.target.value))}
                className="bg-white text-slate-900 text-xs px-1.5 py-0.5 rounded border border-slate-300 font-medium"
              >
                {users.map((u) => (
                  <option key={u.user_id} value={u.user_id}>
                    {u.role === 'admin' ? '[Admin]' : '[Resident]'} {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-right">
              <div className="font-semibold">{currentUser?.name}</div>
              <div className="text-blue-200 text-[11px]">
                <span className="font-bold uppercase text-yellow-300">{currentUser?.role}</span>
                {!isAdmin && currentFlat && ` (${currentFlat.block}-${currentFlat.flat_no})`}
                {' · '}
                <button
                  onClick={logout}
                  className="text-red-300 hover:text-red-100 underline text-xs ml-1"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs - Simple Bootstrap style */}
        <nav className="flex items-center gap-1 overflow-x-auto pb-2 text-xs font-medium border-t border-blue-800/80 pt-1.5">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
              activeTab === 'dashboard' ? 'bg-white text-blue-900 font-bold' : 'text-blue-100 hover:bg-blue-800'
            }`}
          >
            Dashboard
          </button>

          {isAdmin ? (
            <>
              <button
                onClick={() => setActiveTab('members')}
                className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
                  activeTab === 'members' ? 'bg-white text-blue-900 font-bold' : 'text-blue-100 hover:bg-blue-800'
                }`}
              >
                Members
              </button>
              <button
                onClick={() => setActiveTab('flats')}
                className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
                  activeTab === 'flats' ? 'bg-white text-blue-900 font-bold' : 'text-blue-100 hover:bg-blue-800'
                }`}
              >
                Flats
              </button>
              <button
                onClick={() => setActiveTab('maintenance')}
                className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
                  activeTab === 'maintenance' ? 'bg-white text-blue-900 font-bold' : 'text-blue-100 hover:bg-blue-800'
                }`}
              >
                Maintenance
              </button>
              <button
                onClick={() => setActiveTab('bills')}
                className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
                  activeTab === 'bills' ? 'bg-white text-blue-900 font-bold' : 'text-blue-100 hover:bg-blue-800'
                }`}
              >
                Utility Bills
              </button>
              <button
                onClick={() => setActiveTab('complaints')}
                className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
                  activeTab === 'complaints' ? 'bg-white text-blue-900 font-bold' : 'text-blue-100 hover:bg-blue-800'
                }`}
              >
                Complaints
              </button>
              <button
                onClick={() => setActiveTab('notices')}
                className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
                  activeTab === 'notices' ? 'bg-white text-blue-900 font-bold' : 'text-blue-100 hover:bg-blue-800'
                }`}
              >
                Notices
              </button>
              <button
                onClick={() => setActiveTab('visitors')}
                className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
                  activeTab === 'visitors' ? 'bg-white text-blue-900 font-bold' : 'text-blue-100 hover:bg-blue-800'
                }`}
              >
                Visitor Register
              </button>
              <button
                onClick={() => setActiveTab('society')}
                className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
                  activeTab === 'society' ? 'bg-white text-blue-900 font-bold' : 'text-blue-100 hover:bg-blue-800'
                }`}
              >
                Society Info
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('resident-dues')}
                className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
                  activeTab === 'resident-dues' ? 'bg-white text-blue-900 font-bold' : 'text-blue-100 hover:bg-blue-800'
                }`}
              >
                My Maintenance & Bills
              </button>
              <button
                onClick={() => setActiveTab('complaints')}
                className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
                  activeTab === 'complaints' ? 'bg-white text-blue-900 font-bold' : 'text-blue-100 hover:bg-blue-800'
                }`}
              >
                My Complaints
              </button>
              <button
                onClick={() => setActiveTab('notices')}
                className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
                  activeTab === 'notices' ? 'bg-white text-blue-900 font-bold' : 'text-blue-100 hover:bg-blue-800'
                }`}
              >
                Society Notices
              </button>
              <button
                onClick={() => setActiveTab('visitors')}
                className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
                  activeTab === 'visitors' ? 'bg-white text-blue-900 font-bold' : 'text-blue-100 hover:bg-blue-800'
                }`}
              >
                My Flat Visitors
              </button>
            </>
          )}

        </nav>
      </div>
    </header>
  );
};
