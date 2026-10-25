/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { AuthPage } from './components/AuthPage';
import { AdminDashboard } from './components/AdminDashboard';
import { ResidentDashboard } from './components/ResidentDashboard';
import { MembersModule } from './components/MembersModule';
import { FlatsModule } from './components/FlatsModule';
import { MaintenanceModule } from './components/MaintenanceModule';
import { BillsModule } from './components/BillsModule';
import { ComplaintsModule } from './components/ComplaintsModule';
import { NoticesModule } from './components/NoticesModule';
import { VisitorsModule } from './components/VisitorsModule';
import { SocietyInfoModule } from './components/SocietyInfoModule';
import { ProjectDocsModule } from './components/ProjectDocsModule';
import { TestRunner } from './components/TestRunner';

const MainLayout: React.FC = () => {
  const { currentUser, activeTab, setActiveTab, society } = useApp();

  if (!currentUser) {
    return <AuthPage />;
  }

  const isAdmin = currentUser.role === 'admin';

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return isAdmin ? <AdminDashboard /> : <ResidentDashboard />;
      case 'resident-dues':
        return <ResidentDashboard />;
      case 'members':
        return isAdmin ? <MembersModule /> : <AccessDeniedWarning onRedirect={() => setActiveTab('dashboard')} />;
      case 'flats':
        return isAdmin ? <FlatsModule /> : <AccessDeniedWarning onRedirect={() => setActiveTab('dashboard')} />;
      case 'maintenance':
        return isAdmin ? <MaintenanceModule /> : <ResidentDashboard />;
      case 'bills':
        return isAdmin ? <BillsModule /> : <AccessDeniedWarning onRedirect={() => setActiveTab('dashboard')} />;
      case 'complaints':
        return <ComplaintsModule />;
      case 'notices':
        return <NoticesModule />;
      case 'visitors':
        return <VisitorsModule />;
      case 'society':
        return isAdmin ? <SocietyInfoModule /> : <AccessDeniedWarning onRedirect={() => setActiveTab('dashboard')} />;
      case 'project-docs':
        return <ProjectDocsModule />;
      case 'test-runner':
        return <TestRunner />;
      default:
        return isAdmin ? <AdminDashboard /> : <ResidentDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] flex flex-col text-slate-800 font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-4">
        {renderActiveModule()}
      </main>

      {/* College Project Footer */}
      <footer className="bg-slate-800 text-slate-300 text-xs py-3 mt-auto border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <div>
            <strong>{society.name}</strong> · Reg. No: {society.registration_no}
          </div>
          <div className="text-slate-400 text-[11px] flex flex-wrap items-center justify-center sm:justify-end gap-2">
            <span>BCA Capstone Final Year Project (2026–2027)</span>
            <span>·</span>
            <button
              onClick={() => setActiveTab('test-runner')}
              className="text-slate-300 hover:text-white underline cursor-pointer"
            >
              22 Test Scenarios
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('project-docs')}
              className="text-slate-300 hover:text-white underline cursor-pointer"
            >
              database.sql & Docs
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

const AccessDeniedWarning: React.FC<{ onRedirect: () => void }> = ({ onRedirect }) => (
  <div className="p-6 bg-white border border-slate-300 rounded text-center max-w-sm mx-auto space-y-2 mt-8">
    <h3 className="font-bold text-red-700 text-sm">Access Denied (403 Forbidden)</h3>
    <p className="text-xs text-slate-600">
      This management page requires Administrator / Committee Member privileges.
    </p>
    <button
      onClick={onRedirect}
      className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700"
    >
      Return to Dashboard
    </button>
  </div>
);

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
