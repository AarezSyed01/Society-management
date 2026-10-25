import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const VisitorsModule: React.FC = () => {
  const { visitors, flats, currentUser, currentFlat, addVisitor, markVisitorExit } = useApp();

  const isAdmin = currentUser?.role === 'admin';

  const [searchTerm, setSearchTerm] = useState('');
  const [filterActiveOnly, setFilterActiveOnly] = useState<'All' | 'Active' | 'Exited'>('All');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorPurpose, setVisitorPurpose] = useState('');
  const [targetFlatId, setTargetFlatId] = useState<number | ''>('');
  const [formError, setFormError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const accessibleVisitors = isAdmin
    ? visitors
    : currentFlat
    ? visitors.filter((v) => v.flat_id === currentFlat.flat_id)
    : [];

  const handleRecordEntry = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!visitorName.trim() || !visitorPurpose.trim() || !targetFlatId) {
      setFormError('Please enter visitor name, purpose, and destination flat.');
      return;
    }

    const res = addVisitor({
      visitor_name: visitorName.trim(),
      phone: visitorPhone.trim(),
      purpose: visitorPurpose.trim(),
      flat_id: Number(targetFlatId),
    });

    if (res.success) {
      setIsAddModalOpen(false);
      setVisitorName('');
      setVisitorPhone('');
      setVisitorPurpose('');
      setTargetFlatId('');
      setActionSuccess('Visitor entry recorded in gate register.');
      setTimeout(() => setActionSuccess(null), 3000);
    }
  };

  const handleMarkExit = (id: number) => {
    markVisitorExit(id);
    setActionSuccess('Visitor exit departure recorded.');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const filteredVisitors = accessibleVisitors.filter((v) => {
    const flat = flats.find((f) => f.flat_id === v.flat_id);
    const flatStr = flat ? `${flat.block}-${flat.flat_no}` : '';
    const matchesSearch =
      v.visitor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (v.phone || '').includes(searchTerm) ||
      v.purpose.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flatStr.toLowerCase().includes(searchTerm.toLowerCase());

    const isActive = !v.exit_time;
    const matchesStatus =
      filterActiveOnly === 'All' ||
      (filterActiveOnly === 'Active' && isActive) ||
      (filterActiveOnly === 'Exited' && !isActive);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-3 text-xs">
      {/* Title */}
      <div className="bg-white p-3 rounded border border-slate-300 flex justify-between items-center">
        <div>
          <h2 className="text-base font-bold text-slate-800 m-0">Visitor Management (Security Desk)</h2>
          <p className="text-slate-500 m-0 text-[11px]">Log visitor entry, destination flat, purpose, and record checkout exit time</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => { setFormError(null); setIsAddModalOpen(true); }}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
          >
            + Log Visitor Entry
          </button>
        )}
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
          placeholder="Search visitor name, phone, flat, purpose..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-72 px-2.5 py-1 border border-slate-300 rounded"
        />

        <div className="flex items-center gap-1">
          <span className="text-slate-600 font-semibold">Status:</span>
          {(['All', 'Active', 'Exited'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterActiveOnly(st)}
              className={`px-2 py-0.5 rounded font-medium ${
                filterActiveOnly === st ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {st === 'Active' ? 'Inside Campus' : st === 'Exited' ? 'Exited' : 'All'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded border border-slate-300 overflow-hidden shadow-2xs">
        <table className="w-full text-left">
          <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold text-[11px]">
            <tr>
              <th className="p-2.5">Pass #</th>
              <th className="p-2.5">Visitor Name</th>
              <th className="p-2.5">Contact</th>
              <th className="p-2.5">Destination Flat</th>
              <th className="p-2.5">Purpose of Visit</th>
              <th className="p-2.5">Entry Time</th>
              <th className="p-2.5">Exit Time</th>
              <th className="p-2.5 text-right">Status / Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredVisitors.length === 0 ? (
              <tr><td colSpan={8} className="p-4 text-center text-slate-400">No visitor records found.</td></tr>
            ) : (
              filteredVisitors.map((v) => {
                const flat = flats.find((f) => f.flat_id === v.flat_id);
                const isInside = !v.exit_time;
                return (
                  <tr key={v.visitor_id} className="hover:bg-slate-50">
                    <td className="p-2.5 font-mono text-slate-500">#{v.visitor_id}</td>
                    <td className="p-2.5 font-bold text-slate-800">{v.visitor_name}</td>
                    <td className="p-2.5 text-slate-600">{v.phone || 'N/A'}</td>
                    <td className="p-2.5 font-medium text-slate-700">
                      Flat {flat ? `${flat.block}-${flat.flat_no}` : 'N/A'}
                    </td>
                    <td className="p-2.5 text-slate-600 truncate max-w-xs">{v.purpose}</td>
                    <td className="p-2.5 font-mono text-[10px] text-slate-700">
                      {v.entry_time.substring(11, 16)} ({v.entry_time.substring(0, 10)})
                    </td>
                    <td className="p-2.5 font-mono text-[10px] text-slate-500">
                      {v.exit_time ? `${v.exit_time.substring(11, 16)} (${v.exit_time.substring(0, 10)})` : '-'}
                    </td>
                    <td className="p-2.5 text-right">
                      {isInside ? (
                        isAdmin ? (
                          <button
                            onClick={() => handleMarkExit(v.visitor_id)}
                            className="px-2 py-0.5 bg-purple-600 hover:bg-purple-700 text-white rounded font-medium"
                          >
                            Mark Exited
                          </button>
                        ) : (
                          <span className="px-1.5 py-0.5 bg-purple-100 text-purple-800 font-bold rounded">
                            Inside Flat
                          </span>
                        )
                      ) : (
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                          Departed
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Record Visitor Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-3 z-50">
          <div className="bg-white rounded border border-slate-400 max-w-sm w-full p-4 shadow space-y-3">
            <div className="border-b border-slate-200 pb-2 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-sm">Log Visitor Entry</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-500 font-bold">✕</button>
            </div>

            {formError && (
              <div className="p-2 bg-red-100 border border-red-300 text-red-800 rounded">{formError}</div>
            )}

            <form onSubmit={handleRecordEntry} className="space-y-2.5">
              <div>
                <label className="font-semibold text-slate-700 block mb-0.5">Visitor Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Gupta"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-0.5">Mobile Number</label>
                <input
                  type="text"
                  placeholder="+91 98200 00000"
                  value={visitorPhone}
                  onChange={(e) => setVisitorPhone(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-0.5">Visiting Flat *</label>
                <select
                  required
                  value={targetFlatId}
                  onChange={(e) => setTargetFlatId(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                >
                  <option value="">-- Choose Flat --</option>
                  {flats.map((f) => (
                    <option key={f.flat_id} value={f.flat_id}>
                      Flat {f.block}-{f.flat_no}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-0.5">Purpose *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Delivery, Guest, Technician"
                  value={visitorPurpose}
                  onChange={(e) => setVisitorPurpose(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1 bg-slate-200 text-slate-700 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
                >
                  Register Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
