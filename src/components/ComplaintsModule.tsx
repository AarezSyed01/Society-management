import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Complaint } from '../types';

export const ComplaintsModule: React.FC = () => {
  const {
    complaints,
    members,
    flats,
    currentUser,
    currentMember,
    updateComplaintStatus,
  } = useApp();

  const isAdmin = currentUser?.role === 'admin';

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'In Progress' | 'Resolved'>('All');

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [updateStatusVal, setUpdateStatusVal] = useState<'Pending' | 'In Progress' | 'Resolved'>('Pending');
  const [resolutionNote, setResolutionNote] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const accessibleComplaints = isAdmin
    ? complaints
    : currentMember
    ? complaints.filter((c) => c.member_id === currentMember.member_id)
    : [];

  const filteredComplaints = accessibleComplaints.filter((c) => {
    const member = members.find((m) => m.member_id === c.member_id);
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const openReviewModal = (c: Complaint) => {
    setSelectedComplaint(c);
    setUpdateStatusVal(c.status);
    setResolutionNote(c.resolution_notes || '');
  };

  const handleUpdateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    updateComplaintStatus(selectedComplaint.complaint_id, updateStatusVal, resolutionNote);
    setSelectedComplaint(null);
    setActionSuccess('Complaint status and resolution notes updated.');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  return (
    <div className="space-y-3 text-xs">
      {/* Title */}
      <div className="bg-white p-3 rounded border border-slate-300 flex justify-between items-center">
        <div>
          <h2 className="text-base font-bold text-slate-800 m-0">
            {isAdmin ? 'Complaint Management Module' : 'My Complaints'}
          </h2>
          <p className="text-slate-500 m-0 text-[11px]">
            {isAdmin
              ? 'Review resident tickets, assign maintenance work, and update resolution remarks'
              : 'Track progress and committee updates for your submitted complaints'}
          </p>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-2 bg-green-100 border border-green-300 text-green-800 rounded font-medium">
          {actionSuccess}
        </div>
      )}

      {/* Filter and Search */}
      <div className="bg-white p-2.5 rounded border border-slate-300 flex flex-col sm:flex-row gap-2 justify-between items-center">
        <input
          type="text"
          placeholder="Search complaints..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-72 px-2.5 py-1 border border-slate-300 rounded"
        />

        <div className="flex items-center gap-1">
          <span className="text-slate-600 font-semibold">Status:</span>
          {(['All', 'Pending', 'In Progress', 'Resolved'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2 py-0.5 rounded font-medium ${
                statusFilter === st ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded border border-slate-300 overflow-hidden shadow-2xs">
        <table className="w-full text-left">
          <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold text-[11px]">
            <tr>
              <th className="p-2.5">Ticket #</th>
              <th className="p-2.5">Complaint Title & Description</th>
              <th className="p-2.5">Resident / Flat</th>
              <th className="p-2.5">Date</th>
              <th className="p-2.5">Status</th>
              <th className="p-2.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredComplaints.length === 0 ? (
              <tr><td colSpan={6} className="p-4 text-center text-slate-400">No complaints matching filter.</td></tr>
            ) : (
              filteredComplaints.map((c) => {
                const member = members.find((m) => m.member_id === c.member_id);
                const flat = member?.flat_id ? flats.find((f) => f.flat_id === member.flat_id) : null;
                return (
                  <tr key={c.complaint_id} className="hover:bg-slate-50">
                    <td className="p-2.5 font-mono text-slate-500">#{c.complaint_id}</td>
                    <td className="p-2.5">
                      <div className="font-bold text-slate-800">{c.title}</div>
                      <div className="text-slate-500 text-[11px] truncate max-w-sm">{c.description}</div>
                      {c.resolution_notes && (
                        <div className="text-green-800 text-[10px] font-medium mt-0.5">
                          Note: {c.resolution_notes}
                        </div>
                      )}
                    </td>
                    <td className="p-2.5 text-slate-700">
                      <div>{member?.name || 'Resident'}</div>
                      <div className="text-slate-400 text-[10px]">
                        {flat ? `Flat ${flat.block}-${flat.flat_no}` : ''}
                      </div>
                    </td>
                    <td className="p-2.5 text-slate-500">{c.created_date.substring(0, 10)}</td>
                    <td className="p-2.5">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          c.status === 'Resolved'
                            ? 'bg-green-100 text-green-800 border border-green-300'
                            : c.status === 'In Progress'
                            ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                            : 'bg-red-100 text-red-800 border border-red-300'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="p-2.5 text-right">
                      <button
                        onClick={() => openReviewModal(c)}
                        className="px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded font-medium"
                      >
                        {isAdmin ? 'Update Status' : 'View'}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Review / Update Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-3 z-50">
          <div className="bg-white rounded border border-slate-400 max-w-md w-full p-4 shadow space-y-3">
            <div className="border-b border-slate-200 pb-2 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-sm">Complaint #{selectedComplaint.complaint_id}</h3>
              <button onClick={() => setSelectedComplaint(null)} className="text-slate-500 font-bold">✕</button>
            </div>

            <div className="bg-slate-50 p-2.5 rounded border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900">{selectedComplaint.title}</div>
              <p className="text-slate-700 whitespace-pre-line m-0">{selectedComplaint.description}</p>
              <div className="text-[10px] text-slate-400 mt-1">
                Filed by: {members.find((m) => m.member_id === selectedComplaint.member_id)?.name} on {selectedComplaint.created_date}
              </div>
            </div>

            {isAdmin ? (
              <form onSubmit={handleUpdateStatus} className="space-y-2.5">
                <div>
                  <label className="font-semibold text-slate-700 block mb-0.5">Status *</label>
                  <select
                    value={updateStatusVal}
                    onChange={(e) => setUpdateStatusVal(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-0.5">Resolution Notes / Action Taken</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Electrician sent, replaced capacitor..."
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                  />
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedComplaint(null)}
                    className="px-3 py-1 bg-slate-200 text-slate-700 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
                  >
                    Save Status
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-2">
                <div><strong>Current Status:</strong> {selectedComplaint.status}</div>
                <div>
                  <strong>Committee Remarks:</strong>{' '}
                  {selectedComplaint.resolution_notes || 'No remarks added yet.'}
                </div>
                <div className="text-right pt-2 border-t">
                  <button
                    onClick={() => setSelectedComplaint(null)}
                    className="px-3 py-1 bg-slate-700 text-white rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
