import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const AdminDashboard: React.FC = () => {
  const {
    members,
    flats,
    maintenance,
    complaints,
    visitors,
    setActiveTab,
  } = useApp();

  const [activeSection, setActiveSection] = useState<'complaints' | 'maintenance' | 'visitors'>('complaints');

  // Core metrics
  const totalMembers = members.length;
  const totalFlats = flats.length;

  const totalCollected = maintenance
    .filter((m) => m.status === 'Paid')
    .reduce((sum, m) => sum + Number(m.amount), 0);

  const totalPending = maintenance
    .filter((m) => m.status === 'Pending')
    .reduce((sum, m) => sum + Number(m.amount), 0);

  const pendingComplaints = complaints.filter((c) => c.status !== 'Resolved').length;
  const activeVisitors = visitors.filter((v) => !v.exit_time).length;

  return (
    <div className="space-y-4 text-xs">
      {/* 1. Simple Welcome Banner */}
      <div className="bg-white p-4 rounded border border-slate-300 shadow-2xs flex flex-col sm:flex-row justify-between sm:items-center gap-2">
        <div>
          <h2 className="text-base font-bold text-slate-800 m-0">Admin Dashboard</h2>
          <p className="text-slate-500 m-0 mt-0.5 text-xs">
            Welcome to the Society Administration Portal. Overview of members, accounts, and complaints.
          </p>
        </div>
        <div className="text-slate-600 bg-slate-50 px-3 py-1.5 rounded border border-slate-200">
          Status: <strong className="text-green-700">Database Connected (MySQL)</strong>
        </div>
      </div>

      {/* 2. 4 Clean, Minimal Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Card 1: Members */}
        <div className="bg-white p-3.5 rounded border border-slate-300 shadow-2xs">
          <div className="text-slate-500 font-semibold uppercase text-[11px]">Society Members</div>
          <div className="text-2xl font-bold text-blue-700 mt-1">{totalMembers}</div>
          <div className="text-slate-400 text-[11px] mt-0.5">Total registered residents</div>
          <button
            onClick={() => setActiveTab('members')}
            className="mt-2.5 text-blue-700 hover:underline font-semibold block text-[11px]"
          >
            Manage Members →
          </button>
        </div>

        {/* Card 2: Flats */}
        <div className="bg-white p-3.5 rounded border border-slate-300 shadow-2xs">
          <div className="text-slate-500 font-semibold uppercase text-[11px]">Total Flats</div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{totalFlats}</div>
          <div className="text-slate-400 text-[11px] mt-0.5">Wings A & Wing B</div>
          <button
            onClick={() => setActiveTab('flats')}
            className="mt-2.5 text-blue-700 hover:underline font-semibold block text-[11px]"
          >
            Manage Flats →
          </button>
        </div>

        {/* Card 3: Maintenance Money */}
        <div className="bg-white p-3.5 rounded border border-slate-300 shadow-2xs">
          <div className="text-slate-500 font-semibold uppercase text-[11px]">Maintenance Funds</div>
          <div className="text-base font-bold text-green-700 mt-1">
            Collected: ₹{totalCollected.toLocaleString('en-IN')}
          </div>
          <div className="text-red-700 font-semibold text-[11px] mt-0.5">
            Pending: ₹{totalPending.toLocaleString('en-IN')}
          </div>
          <button
            onClick={() => setActiveTab('maintenance')}
            className="mt-1.5 text-blue-700 hover:underline font-semibold block text-[11px]"
          >
            View Maintenance Ledger →
          </button>
        </div>

        {/* Card 4: Complaints & Security */}
        <div className="bg-white p-3.5 rounded border border-slate-300 shadow-2xs">
          <div className="text-slate-500 font-semibold uppercase text-[11px]">Complaints & Gate</div>
          <div className="text-base font-bold text-amber-700 mt-1">
            {pendingComplaints} Pending Complaints
          </div>
          <div className="text-purple-700 font-semibold text-[11px] mt-0.5">
            {activeVisitors} Visitors Currently Inside
          </div>
          <button
            onClick={() => setActiveTab('complaints')}
            className="mt-1.5 text-blue-700 hover:underline font-semibold block text-[11px]"
          >
            Review Complaints →
          </button>
        </div>
      </div>

      {/* 3. Quick Action Buttons */}
      <div className="bg-white p-3 rounded border border-slate-300 shadow-2xs flex flex-wrap items-center justify-between gap-2">
        <span className="font-bold text-slate-700">Quick Actions:</span>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('members')}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium"
          >
            + Add New Member
          </button>
          <button
            onClick={() => setActiveTab('maintenance')}
            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded font-medium"
          >
            + Issue Maintenance Bill
          </button>
          <button
            onClick={() => setActiveTab('visitors')}
            className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded font-medium"
          >
            + Log Visitor Entry
          </button>
          <button
            onClick={() => setActiveTab('notices')}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white rounded font-medium"
          >
            + Post Notice
          </button>
        </div>
      </div>

      {/* 4. Simple Tabbed Activity View */}
      <div className="bg-white rounded border border-slate-300 overflow-hidden shadow-2xs">
        {/* Simple Tab Headers */}
        <div className="flex border-b border-slate-300 bg-slate-100 px-3 pt-2 gap-1">
          <button
            onClick={() => setActiveSection('complaints')}
            className={`px-3 py-1.5 rounded-t font-bold transition-colors ${
              activeSection === 'complaints'
                ? 'bg-white border-t-2 border-t-blue-600 text-blue-700'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending Complaints ({pendingComplaints})
          </button>
          <button
            onClick={() => setActiveSection('maintenance')}
            className={`px-3 py-1.5 rounded-t font-bold transition-colors ${
              activeSection === 'maintenance'
                ? 'bg-white border-t-2 border-t-blue-600 text-blue-700'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Recent Maintenance Records
          </button>
          <button
            onClick={() => setActiveSection('visitors')}
            className={`px-3 py-1.5 rounded-t font-bold transition-colors ${
              activeSection === 'visitors'
                ? 'bg-white border-t-2 border-t-blue-600 text-blue-700'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Gate Visitors Inside ({activeVisitors})
          </button>
        </div>

        {/* Tab 1: Complaints Content */}
        {activeSection === 'complaints' && (
          <div className="p-3">
            <div className="space-y-2">
              {complaints.filter((c) => c.status !== 'Resolved').length === 0 ? (
                <div className="p-4 text-center text-slate-400">All complaints have been resolved!</div>
              ) : (
                complaints
                  .filter((c) => c.status !== 'Resolved')
                  .slice(0, 4)
                  .map((c) => {
                    const member = members.find((m) => m.member_id === c.member_id);
                    return (
                      <div
                        key={c.complaint_id}
                        className="p-2.5 bg-slate-50 border border-slate-200 rounded flex flex-col sm:flex-row justify-between sm:items-center gap-2"
                      >
                        <div>
                          <div className="font-bold text-slate-800 text-xs">{c.title}</div>
                          <div className="text-slate-500 text-[11px] mt-0.5">
                            {c.description}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            Resident: {member?.name} · Filed on: {c.created_date}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              c.status === 'In Progress'
                                ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                                : 'bg-red-100 text-red-800 border border-red-300'
                            }`}
                          >
                            {c.status}
                          </span>
                          <button
                            onClick={() => setActiveTab('complaints')}
                            className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-[11px]"
                          >
                            Resolve
                          </button>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Maintenance Content */}
        {activeSection === 'maintenance' && (
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                <tr>
                  <th className="p-2.5">Member Name</th>
                  <th className="p-2.5">Month</th>
                  <th className="p-2.5">Due Date</th>
                  <th className="p-2.5">Amount</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {maintenance.slice(0, 5).map((m) => {
                  const member = members.find((mem) => mem.member_id === m.member_id);
                  return (
                    <tr key={m.maintenance_id} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-slate-800">{member?.name || 'Resident'}</td>
                      <td className="p-2.5 text-slate-600">{m.billing_month}</td>
                      <td className="p-2.5 text-slate-600">{m.due_date}</td>
                      <td className="p-2.5 font-bold text-slate-900">₹{Number(m.amount).toLocaleString('en-IN')}</td>
                      <td className="p-2.5">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            m.status === 'Paid'
                              ? 'bg-green-100 text-green-800 border border-green-300'
                              : 'bg-red-100 text-red-800 border border-red-300'
                          }`}
                        >
                          {m.status}
                        </span>
                      </td>
                      <td className="p-2.5 text-right">
                        <button
                          onClick={() => setActiveTab('maintenance')}
                          className="text-blue-700 hover:underline font-semibold"
                        >
                          View Ledger
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Visitors Content */}
        {activeSection === 'visitors' && (
          <div className="p-3">
            <div className="space-y-2">
              {visitors.filter((v) => !v.exit_time).length === 0 ? (
                <div className="p-4 text-center text-slate-400">No visitors currently inside.</div>
              ) : (
                visitors
                  .filter((v) => !v.exit_time)
                  .map((v) => {
                    const flat = flats.find((f) => f.flat_id === v.flat_id);
                    return (
                      <div
                        key={v.visitor_id}
                        className="p-2.5 bg-slate-50 border border-slate-200 rounded flex justify-between items-center"
                      >
                        <div>
                          <div className="font-bold text-slate-800">
                            {v.visitor_name} <span className="text-slate-500 font-normal">({v.phone || 'No phone'})</span>
                          </div>
                          <div className="text-[11px] text-slate-600">
                            Visiting: Flat {flat ? `${flat.block}-${flat.flat_no}` : 'N/A'} · Purpose: {v.purpose}
                          </div>
                          <div className="text-[10px] text-slate-400">Entry time: {v.entry_time}</div>
                        </div>
                        <button
                          onClick={() => setActiveTab('visitors')}
                          className="px-2.5 py-1 bg-purple-700 hover:bg-purple-800 text-white rounded font-medium text-[11px]"
                        >
                          Check Out
                        </button>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
