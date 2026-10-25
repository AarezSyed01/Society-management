import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const ResidentDashboard: React.FC = () => {
  const {
    currentUser,
    currentMember,
    currentFlat,
    society,
    maintenance,
    bills,
    complaints,
    notices,
    visitors,
    addComplaint,
    recordMaintenancePayment,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'dues' | 'complaints' | 'notices' | 'visitors'>('dues');

  // New complaint form state
  const [complaintTitle, setComplaintTitle] = useState('');
  const [complaintDesc, setComplaintDesc] = useState('');
  const [complaintMsg, setComplaintMsg] = useState<string | null>(null);

  // Pay modal
  const [payingRecordId, setPayingRecordId] = useState<number | null>(null);
  const [payMethod, setPayMethod] = useState<'UPI' | 'Net Banking' | 'Cash' | 'Cheque'>('UPI');
  const [paySuccessMsg, setPaySuccessMsg] = useState<string | null>(null);

  const [readingNotice, setReadingNotice] = useState<any | null>(null);

  if (!currentMember) {
    return (
      <div className="bg-yellow-50 border border-yellow-300 p-4 rounded text-center text-xs">
        <h3 className="font-bold text-yellow-900">Account Pending Verification</h3>
        <p className="text-yellow-800 mt-1">
          Your resident account ({currentUser?.email}) is pending committee verification and flat mapping.
        </p>
      </div>
    );
  }

  const myMaintenance = maintenance.filter((m) => m.member_id === currentMember.member_id);
  const myBills = currentFlat ? bills.filter((b) => b.flat_id === currentFlat.flat_id) : [];
  const myComplaints = complaints.filter((c) => c.member_id === currentMember.member_id);
  const myVisitors = currentFlat ? visitors.filter((v) => v.flat_id === currentFlat.flat_id) : [];
  const publishedNotices = notices.filter((n) => n.publication_status === 'Published');

  const pendingDues = myMaintenance
    .filter((m) => m.status === 'Pending')
    .reduce((sum, m) => sum + Number(m.amount), 0);

  const handleComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintTitle.trim() || !complaintDesc.trim()) {
      alert('Please fill out both title and description.');
      return;
    }
    const res = addComplaint(complaintTitle, complaintDesc);
    if (res.success) {
      setComplaintMsg('Your complaint has been submitted to the society committee.');
      setComplaintTitle('');
      setComplaintDesc('');
      setTimeout(() => setComplaintMsg(null), 4000);
    }
  };

  const handlePayConfirm = (maintId: number, amount: number) => {
    recordMaintenancePayment({
      maintenance_id: maintId,
      amount: amount,
      payment_method: payMethod,
      transaction_ref: `UPI-${Date.now().toString().slice(-6)}`,
    });
    setPayingRecordId(null);
    setPaySuccessMsg('Payment of ₹' + amount + ' recorded successfully!');
    setTimeout(() => setPaySuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-4 text-xs">
      {/* 1. Simple Resident Profile Banner */}
      <div className="bg-white p-4 rounded border border-slate-300 shadow-2xs flex flex-col md:flex-row justify-between md:items-center gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-800 m-0">Resident Dashboard</h2>
          <div className="text-slate-600 mt-0.5">
            Resident: <strong>{currentMember.name}</strong> · Flat:{' '}
            <strong className="text-blue-700">
              {currentFlat ? `Wing ${currentFlat.block} - Flat ${currentFlat.flat_no} (${currentFlat.type})` : 'Unassigned'}
            </strong>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">{society.name}</div>
        </div>

        <div className="bg-slate-50 p-2.5 rounded border border-slate-200 flex items-center gap-4">
          <div>
            <div className="text-[11px] text-slate-500 font-semibold uppercase">Pending Dues</div>
            <div className={`text-base font-bold ${pendingDues > 0 ? 'text-red-700' : 'text-green-700'}`}>
              ₹{pendingDues.toLocaleString('en-IN')}
            </div>
          </div>
          {pendingDues > 0 && (
            <button
              onClick={() => setActiveTab('dues')}
              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded font-bold"
            >
              Pay Now
            </button>
          )}
        </div>
      </div>

      {paySuccessMsg && (
        <div className="p-2.5 bg-green-100 border border-green-300 text-green-800 rounded font-medium">
          {paySuccessMsg}
        </div>
      )}

      {/* 2. Simple Navigation Tabs for Resident */}
      <div className="bg-white rounded border border-slate-300 shadow-2xs overflow-hidden">
        <div className="flex border-b border-slate-300 bg-slate-100 px-3 pt-2 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dues')}
            className={`px-3 py-1.5 rounded-t font-bold whitespace-nowrap ${
              activeTab === 'dues' ? 'bg-white border-t-2 border-t-blue-600 text-blue-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Maintenance & Bills ({myMaintenance.length})
          </button>
          <button
            onClick={() => setActiveTab('complaints')}
            className={`px-3 py-1.5 rounded-t font-bold whitespace-nowrap ${
              activeTab === 'complaints' ? 'bg-white border-t-2 border-t-blue-600 text-blue-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. File a Complaint ({myComplaints.length})
          </button>
          <button
            onClick={() => setActiveTab('notices')}
            className={`px-3 py-1.5 rounded-t font-bold whitespace-nowrap ${
              activeTab === 'notices' ? 'bg-white border-t-2 border-t-blue-600 text-blue-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3. Notice Board ({publishedNotices.length})
          </button>
          <button
            onClick={() => setActiveTab('visitors')}
            className={`px-3 py-1.5 rounded-t font-bold whitespace-nowrap ${
              activeTab === 'visitors' ? 'bg-white border-t-2 border-t-blue-600 text-blue-700' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            4. Flat Visitors ({myVisitors.length})
          </button>
        </div>

        {/* Tab 1: Maintenance & Bills */}
        {activeTab === 'dues' && (
          <div className="p-3 space-y-3">
            <h3 className="font-bold text-slate-800 text-xs">My Society Maintenance Bills</h3>
            <div className="overflow-x-auto border border-slate-200 rounded">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                  <tr>
                    <th className="p-2">Month</th>
                    <th className="p-2">Due Date</th>
                    <th className="p-2">Amount</th>
                    <th className="p-2">Status</th>
                    <th className="p-2 text-right">Payment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myMaintenance.length === 0 ? (
                    <tr><td colSpan={5} className="p-3 text-center text-slate-400">No maintenance dues recorded.</td></tr>
                  ) : (
                    myMaintenance.map((m) => (
                      <tr key={m.maintenance_id} className="hover:bg-slate-50">
                        <td className="p-2 font-bold text-slate-800">{m.billing_month}</td>
                        <td className="p-2 text-slate-600">{m.due_date}</td>
                        <td className="p-2 font-bold text-slate-900">₹{Number(m.amount).toLocaleString('en-IN')}</td>
                        <td className="p-2">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            m.status === 'Paid' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'
                          }`}>
                            {m.status}
                          </span>
                        </td>
                        <td className="p-2 text-right">
                          {m.status === 'Pending' ? (
                            <button
                              onClick={() => setPayingRecordId(m.maintenance_id)}
                              className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white rounded font-bold"
                            >
                              Pay Now
                            </button>
                          ) : (
                            <span className="text-green-700 font-medium">Paid on {m.payment_date}</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Utility Bills Table */}
            {myBills.length > 0 && (
              <div className="pt-2">
                <h3 className="font-bold text-slate-800 text-xs mb-1.5">Apartment Utility Bills</h3>
                <div className="overflow-x-auto border border-slate-200 rounded">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                      <tr>
                        <th className="p-2">Bill Head</th>
                        <th className="p-2">Period</th>
                        <th className="p-2">Amount</th>
                        <th className="p-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {myBills.map((b) => (
                        <tr key={b.bill_id}>
                          <td className="p-2 font-medium text-slate-800">{b.bill_type}</td>
                          <td className="p-2 text-slate-600">{b.month_year}</td>
                          <td className="p-2 font-bold">₹{Number(b.amount).toLocaleString('en-IN')}</td>
                          <td className="p-2">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              b.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: File a Complaint */}
        {activeTab === 'complaints' && (
          <div className="p-3 space-y-3">
            {complaintMsg && (
              <div className="p-2 bg-green-100 border border-green-300 text-green-800 rounded font-medium">
                {complaintMsg}
              </div>
            )}

            {/* Simple Form */}
            <form onSubmit={handleComplaintSubmit} className="p-3 bg-slate-50 border border-slate-200 rounded space-y-2">
              <div className="font-bold text-slate-800 text-xs">Submit a New Complaint to Committee</div>
              <div>
                <label className="font-semibold text-slate-700 block mb-0.5">Subject / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Water tap leaking, corridor light not working"
                  value={complaintTitle}
                  onChange={(e) => setComplaintTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-0.5">Details *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Explain the problem clearly for the electrician/plumber..."
                  value={complaintDesc}
                  onChange={(e) => setComplaintDesc(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                />
              </div>
              <div className="text-right">
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold"
                >
                  Submit Complaint
                </button>
              </div>
            </form>

            {/* My Previous Complaints */}
            <div className="pt-1">
              <h4 className="font-bold text-slate-800 text-xs mb-1.5">My Submitted Complaints ({myComplaints.length})</h4>
              <div className="space-y-2">
                {myComplaints.length === 0 ? (
                  <div className="p-3 text-slate-400 text-center border border-dashed rounded">No complaints filed yet.</div>
                ) : (
                  myComplaints.map((c) => (
                    <div key={c.complaint_id} className="p-2.5 bg-white border border-slate-200 rounded">
                      <div className="flex justify-between items-start">
                        <strong className="text-slate-800 text-xs">{c.title}</strong>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          c.status === 'Resolved' ? 'bg-green-100 text-green-800 border border-green-300' : c.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' : 'bg-red-100 text-red-800 border border-red-300'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                      <p className="text-slate-600 mt-1 mb-0">{c.description}</p>
                      {c.resolution_notes && (
                        <div className="mt-1.5 p-1.5 bg-green-50 border border-green-200 rounded text-green-900 text-[11px]">
                          <strong>Committee Action:</strong> {c.resolution_notes}
                        </div>
                      )}
                      <div className="text-[10px] text-slate-400 mt-1">Date: {c.created_date}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Notice Board */}
        {activeTab === 'notices' && (
          <div className="p-3 space-y-2.5">
            <h3 className="font-bold text-slate-800 text-xs">Official Society Announcements</h3>
            {publishedNotices.length === 0 ? (
              <div className="p-4 text-center text-slate-400">No notices posted.</div>
            ) : (
              publishedNotices.map((n) => (
                <div key={n.notice_id} className="p-3 bg-slate-50 border border-slate-200 rounded">
                  <div className="flex justify-between items-start">
                    <strong className="text-slate-900 text-xs">{n.title}</strong>
                    <span className="text-[10px] text-slate-400">Date: {n.created_at.substring(0, 10)}</span>
                  </div>
                  <p className="text-slate-600 mt-1 mb-1 leading-relaxed">{n.description}</p>
                  <button
                    onClick={() => setReadingNotice(n)}
                    className="text-blue-700 hover:underline font-semibold text-[11px]"
                  >
                    View Notice Details →
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 4: Flat Visitors */}
        {activeTab === 'visitors' && (
          <div className="p-3 space-y-2.5">
            <h3 className="font-bold text-slate-800 text-xs">Security Gate Log for Flat {currentFlat?.block}-{currentFlat?.flat_no}</h3>
            {myVisitors.length === 0 ? (
              <div className="p-4 text-center text-slate-400">No visitors recorded at the main gate for your flat.</div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                    <tr>
                      <th className="p-2">Visitor Name</th>
                      <th className="p-2">Phone</th>
                      <th className="p-2">Purpose</th>
                      <th className="p-2">Entry Time</th>
                      <th className="p-2">Exit Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {myVisitors.map((v) => (
                      <tr key={v.visitor_id}>
                        <td className="p-2 font-bold text-slate-800">{v.visitor_name}</td>
                        <td className="p-2 text-slate-600">{v.phone || 'N/A'}</td>
                        <td className="p-2 text-slate-600">{v.purpose}</td>
                        <td className="p-2 font-mono text-[10px] text-slate-700">{v.entry_time.substring(11, 16)}</td>
                        <td className="p-2 font-mono text-[10px] text-slate-500">
                          {v.exit_time ? v.exit_time.substring(11, 16) : <span className="text-purple-700 font-bold">Inside</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pay Modal */}
      {payingRecordId && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-3 z-50">
          <div className="bg-white rounded border border-slate-400 max-w-xs w-full p-4 shadow space-y-3">
            <h3 className="font-bold text-slate-900 text-sm border-b pb-1">Make Maintenance Payment</h3>
            <div>
              <label className="font-semibold text-slate-700 block mb-0.5">Select Payment Mode</label>
              <select
                value={payMethod}
                onChange={(e) => setPayMethod(e.target.value as any)}
                className="w-full px-2 py-1 border border-slate-300 rounded bg-white"
              >
                <option value="UPI">UPI / Google Pay / PhonePe</option>
                <option value="Net Banking">Net Banking</option>
                <option value="Cash">Cash at Society Office</option>
              </select>
            </div>
            <div className="text-[11px] text-slate-500">
              Simulated payment for college demonstration. Status will immediately update to Paid.
            </div>
            <div className="pt-2 border-t flex justify-end gap-2">
              <button
                onClick={() => setPayingRecordId(null)}
                className="px-3 py-1 bg-slate-200 text-slate-700 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const target = myMaintenance.find((m) => m.maintenance_id === payingRecordId);
                  if (target) handlePayConfirm(payingRecordId, target.amount);
                }}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded font-bold"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notice Reader Modal */}
      {readingNotice && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-3 z-50">
          <div className="bg-white rounded border border-slate-400 max-w-md w-full p-4 shadow space-y-2">
            <h3 className="font-bold text-slate-900 text-sm border-b pb-1">{readingNotice.title}</h3>
            <p className="text-slate-700 whitespace-pre-line leading-relaxed m-0">{readingNotice.description}</p>
            <div className="text-right pt-2 border-t">
              <button
                onClick={() => setReadingNotice(null)}
                className="px-3 py-1 bg-slate-700 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
