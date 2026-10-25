import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Maintenance } from '../types';

export const MaintenanceModule: React.FC = () => {
  const {
    maintenance,
    members,
    flats,
    addMaintenance,
    recordMaintenancePayment,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Paid'>('All');
  const [monthFilter, setMonthFilter] = useState<string>('All');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [payingRecord, setPayingRecord] = useState<Maintenance | null>(null);

  // Form: Create Maintenance Charge
  const [formMemberId, setFormMemberId] = useState<number | ''>('');
  const [formAmount, setFormAmount] = useState<number | ''>(2800);
  const [formDueDate, setFormDueDate] = useState('2026-11-10');
  const [formBillingMonth, setFormBillingMonth] = useState('November 2026');
  const [formDescription, setFormDescription] = useState('Monthly Maintenance Charges');
  const [formError, setFormError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Form: Record Payment Modal
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<'UPI' | 'Cash' | 'Cheque' | 'Net Banking'>('UPI');
  const [payRef, setPayRef] = useState('');

  // Metrics
  const totalAmount = maintenance.reduce((sum, m) => sum + Number(m.amount), 0);
  const paidAmount = maintenance
    .filter((m) => m.status === 'Paid')
    .reduce((sum, m) => sum + Number(m.amount), 0);
  const pendingAmount = maintenance
    .filter((m) => m.status === 'Pending')
    .reduce((sum, m) => sum + Number(m.amount), 0);

  const monthsAvailable = Array.from(new Set(maintenance.map((m) => m.billing_month)));

  const handleCreateCharge = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formMemberId || !formAmount || !formDueDate) {
      setFormError('Please select a member and enter both amount and due date.');
      return;
    }

    const selectedMember = members.find((m) => m.member_id === Number(formMemberId));
    const linkedFlatId = selectedMember?.flat_id || null;

    const res = addMaintenance({
      member_id: Number(formMemberId),
      flat_id: linkedFlatId,
      amount: Number(formAmount),
      due_date: formDueDate,
      status: 'Pending',
      payment_date: null,
      description: formDescription,
      billing_month: formBillingMonth,
    });

    if (!res.success) {
      setFormError(res.error || 'Failed to create maintenance charge.');
      return;
    }

    setIsAddModalOpen(false);
    setActionSuccess(`Maintenance bill issued to ${selectedMember?.name}.`);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const openPaymentModal = (m: Maintenance) => {
    setPayingRecord(m);
    setPayAmount(Number(m.amount));
    setPayMethod('UPI');
    setPayRef(`UPI/202610/${Math.floor(100000 + Math.random() * 900000)}`);
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingRecord) return;

    const res = recordMaintenancePayment({
      maintenance_id: payingRecord.maintenance_id,
      amount: payAmount,
      payment_method: payMethod,
      transaction_ref: payRef,
    });

    if (res.success) {
      setPayingRecord(null);
      setActionSuccess('Payment recorded successfully.');
      setTimeout(() => setActionSuccess(null), 3000);
    }
  };

  const filteredList = maintenance.filter((m) => {
    const member = members.find((mem) => mem.member_id === m.member_id);
    const flat = flats.find((f) => f.flat_id === m.flat_id);
    const matchesSearch =
      (member?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (flat ? `${flat.block}-${flat.flat_no}` : '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.billing_month.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    const matchesMonth = monthFilter === 'All' || m.billing_month === monthFilter;

    return matchesSearch && matchesStatus && matchesMonth;
  });

  return (
    <div className="space-y-3 text-xs">
      {/* Title */}
      <div className="bg-white p-3 rounded border border-slate-300 flex justify-between items-center">
        <div>
          <h2 className="text-base font-bold text-slate-800 m-0">Maintenance Management Module</h2>
          <p className="text-slate-500 m-0 text-[11px]">Generate monthly maintenance charges, monitor collections, and record receipts</p>
        </div>
        <button
          onClick={() => { setFormError(null); setIsAddModalOpen(true); }}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
        >
          + Create Maintenance Bill
        </button>
      </div>

      {actionSuccess && (
        <div className="p-2 bg-green-100 border border-green-300 text-green-800 rounded font-medium">
          {actionSuccess}
        </div>
      )}

      {/* Simple Stats Strip */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white p-2.5 rounded border border-slate-300 text-center">
          <div className="text-[11px] text-slate-500 font-semibold uppercase">Total Billed</div>
          <div className="text-base font-bold text-slate-800 mt-0.5">₹{totalAmount.toLocaleString('en-IN')}</div>
        </div>
        <div className="bg-white p-2.5 rounded border border-green-300 text-center">
          <div className="text-[11px] text-green-700 font-semibold uppercase">Total Collected</div>
          <div className="text-base font-bold text-green-700 mt-0.5">₹{paidAmount.toLocaleString('en-IN')}</div>
        </div>
        <div className="bg-white p-2.5 rounded border border-red-300 text-center">
          <div className="text-[11px] text-red-700 font-semibold uppercase">Total Pending</div>
          <div className="text-base font-bold text-red-700 mt-0.5">₹{pendingAmount.toLocaleString('en-IN')}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-2.5 rounded border border-slate-300 flex flex-col md:flex-row gap-2 justify-between items-center">
        <input
          type="text"
          placeholder="Search member, flat, month..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-64 px-2.5 py-1 border border-slate-300 rounded"
        />

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1">
            <span className="text-slate-600 font-semibold">Month:</span>
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="px-2 py-0.5 border border-slate-300 rounded bg-white"
            >
              <option value="All">All Months</option>
              {monthsAvailable.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-slate-600 font-semibold">Status:</span>
            {(['All', 'Pending', 'Paid'] as const).map((st) => (
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
      </div>

      {/* Maintenance Table */}
      <div className="bg-white rounded border border-slate-300 overflow-hidden shadow-2xs">
        <table className="w-full text-left">
          <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold text-[11px]">
            <tr>
              <th className="p-2.5">Bill ID</th>
              <th className="p-2.5">Member & Flat</th>
              <th className="p-2.5">Billing Month</th>
              <th className="p-2.5">Due Date</th>
              <th className="p-2.5">Amount</th>
              <th className="p-2.5">Payment Status</th>
              <th className="p-2.5 text-right">Payment Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredList.length === 0 ? (
              <tr><td colSpan={7} className="p-4 text-center text-slate-400">No records found.</td></tr>
            ) : (
              filteredList.map((m) => {
                const member = members.find((mem) => mem.member_id === m.member_id);
                const flat = flats.find((f) => f.flat_id === m.flat_id);
                return (
                  <tr key={m.maintenance_id} className="hover:bg-slate-50">
                    <td className="p-2.5 font-mono text-slate-500">#{m.maintenance_id}</td>
                    <td className="p-2.5 font-bold text-slate-800">
                      {member?.name || 'Unassigned'}
                      <div className="font-normal text-slate-500 text-[10px]">
                        {flat ? `Flat ${flat.block}-${flat.flat_no}` : 'No Flat'}
                      </div>
                    </td>
                    <td className="p-2.5 text-slate-700">{m.billing_month}</td>
                    <td className="p-2.5 text-slate-600">{m.due_date}</td>
                    <td className="p-2.5 font-bold text-slate-900">₹{Number(m.amount).toLocaleString('en-IN')}</td>
                    <td className="p-2.5">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          m.status === 'Paid' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="p-2.5 text-right">
                      {m.status === 'Pending' ? (
                        <button
                          onClick={() => openPaymentModal(m)}
                          className="px-2 py-0.5 bg-green-600 hover:bg-green-700 text-white rounded font-medium"
                        >
                          Record Payment
                        </button>
                      ) : (
                        <span className="text-green-700 text-[11px]">Paid on {m.payment_date}</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: Create Maintenance Charge */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-3 z-50">
          <div className="bg-white rounded border border-slate-400 max-w-sm w-full p-4 shadow space-y-3">
            <div className="border-b border-slate-200 pb-2 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-sm">Issue Maintenance Bill</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-500 font-bold">✕</button>
            </div>

            {formError && (
              <div className="p-2 bg-red-100 border border-red-300 text-red-800 rounded">{formError}</div>
            )}

            <form onSubmit={handleCreateCharge} className="space-y-2.5">
              <div>
                <label className="font-semibold text-slate-700 block mb-0.5">Select Member *</label>
                <select
                  required
                  value={formMemberId}
                  onChange={(e) => setFormMemberId(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                >
                  <option value="">-- Choose Member --</option>
                  {members.map((m) => {
                    const f = flats.find((fl) => fl.flat_id === m.flat_id);
                    return (
                      <option key={m.member_id} value={m.member_id}>
                        {m.name} {f ? `(Flat ${f.block}-${f.flat_no})` : ''}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-0.5">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formAmount}
                    onChange={(e) => setFormAmount(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-0.5">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-0.5">Billing Month</label>
                <input
                  type="text"
                  value={formBillingMonth}
                  onChange={(e) => setFormBillingMonth(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-0.5">Description</label>
                <input
                  type="text"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
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
                  Issue Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Record Payment */}
      {payingRecord && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-3 z-50">
          <div className="bg-white rounded border border-slate-400 max-w-sm w-full p-4 shadow space-y-3">
            <div className="border-b border-slate-200 pb-2 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-sm">Record Payment</h3>
              <button onClick={() => setPayingRecord(null)} className="text-slate-500 font-bold">✕</button>
            </div>

            <form onSubmit={handleConfirmPayment} className="space-y-2.5">
              <div>
                <span className="text-slate-500">Charge: </span>
                <strong>#{payingRecord.maintenance_id} · ₹{payingRecord.amount} ({payingRecord.billing_month})</strong>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-0.5">Amount Paid (₹) *</label>
                <input
                  type="number"
                  required
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-0.5">Payment Mode</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                >
                  <option value="UPI">UPI</option>
                  <option value="Net Banking">Net Banking</option>
                  <option value="Cash">Cash</option>
                  <option value="Cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-0.5">Reference / Cheque No.</label>
                <input
                  type="text"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPayingRecord(null)}
                  className="px-3 py-1 bg-slate-200 text-slate-700 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded font-semibold"
                >
                  Confirm Paid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
