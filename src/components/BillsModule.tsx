import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bill } from '../types';

export const BillsModule: React.FC = () => {
  const { bills, flats, addBill, recordBillPayment } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Paid'>('All');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [payingBill, setPayingBill] = useState<Bill | null>(null);

  // Form states
  const [formFlatId, setFormFlatId] = useState<number | ''>('');
  const [formAmount, setFormAmount] = useState<number | ''>(650);
  const [formDueDate, setFormDueDate] = useState('2026-11-15');
  const [formMonthYear, setFormMonthYear] = useState('November 2026');
  const [formBillType, setFormBillType] = useState('Water & Common Electricity');
  const [formError, setFormError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const [payMethod, setPayMethod] = useState<'UPI' | 'Cash' | 'Cheque' | 'Net Banking'>('UPI');
  const [payRef, setPayRef] = useState('');

  const handleCreateBill = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formFlatId || !formAmount || !formDueDate) {
      setFormError('Please select flat and enter amount and due date.');
      return;
    }

    const res = addBill({
      flat_id: Number(formFlatId),
      amount: Number(formAmount),
      due_date: formDueDate,
      status: 'Pending',
      month_year: formMonthYear,
      bill_type: formBillType,
      payment_date: null,
    });

    if (!res.success) {
      setFormError(res.error || 'Failed to create bill.');
      return;
    }

    setIsAddModalOpen(false);
    setActionSuccess('Utility bill generated.');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleConfirmBillPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingBill) return;

    const res = recordBillPayment({
      bill_id: payingBill.bill_id,
      amount: payingBill.amount,
      payment_method: payMethod,
      transaction_ref: payRef || `BILL-TXN-${Date.now().toString().slice(-4)}`,
    });

    if (res.success) {
      setPayingBill(null);
      setActionSuccess('Bill marked as Paid.');
      setTimeout(() => setActionSuccess(null), 3000);
    }
  };

  const filteredBills = bills.filter((b) => {
    const flat = flats.find((f) => f.flat_id === b.flat_id);
    const flatStr = flat ? `${flat.block}-${flat.flat_no}` : '';
    const matchesSearch =
      flatStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.month_year.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.bill_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-3 text-xs">
      {/* Title */}
      <div className="bg-white p-3 rounded border border-slate-300 flex justify-between items-center">
        <div>
          <h2 className="text-base font-bold text-slate-800 m-0">Utility & Sinking Fund Bills</h2>
          <p className="text-slate-500 m-0 text-[11px]">Generate and track flat-wise utility expenses, lift maintenance, and sinking fund</p>
        </div>
        <button
          onClick={() => { setFormError(null); setIsAddModalOpen(true); }}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
        >
          + Issue Utility Bill
        </button>
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
          placeholder="Search flat, month, bill type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-72 px-2.5 py-1 border border-slate-300 rounded"
        />

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

      {/* Table */}
      <div className="bg-white rounded border border-slate-300 overflow-hidden shadow-2xs">
        <table className="w-full text-left">
          <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold text-[11px]">
            <tr>
              <th className="p-2.5">Bill ID</th>
              <th className="p-2.5">Flat Number</th>
              <th className="p-2.5">Bill Type / Description</th>
              <th className="p-2.5">Month/Year</th>
              <th className="p-2.5">Due Date</th>
              <th className="p-2.5">Amount</th>
              <th className="p-2.5">Status</th>
              <th className="p-2.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredBills.length === 0 ? (
              <tr><td colSpan={8} className="p-4 text-center text-slate-400">No bills found.</td></tr>
            ) : (
              filteredBills.map((b) => {
                const flat = flats.find((f) => f.flat_id === b.flat_id);
                return (
                  <tr key={b.bill_id} className="hover:bg-slate-50">
                    <td className="p-2.5 font-mono text-slate-500">#{b.bill_id}</td>
                    <td className="p-2.5 font-bold text-slate-800">
                      Flat {flat ? `${flat.block}-${flat.flat_no}` : 'N/A'}
                    </td>
                    <td className="p-2.5 text-slate-700">{b.bill_type}</td>
                    <td className="p-2.5 text-slate-600">{b.month_year}</td>
                    <td className="p-2.5 text-slate-600">{b.due_date}</td>
                    <td className="p-2.5 font-bold text-slate-900">₹{Number(b.amount).toLocaleString('en-IN')}</td>
                    <td className="p-2.5">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          b.status === 'Paid' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="p-2.5 text-right">
                      {b.status === 'Pending' ? (
                        <button
                          onClick={() => {
                            setPayingBill(b);
                            setPayRef(`BILL-${b.bill_id}-${Date.now().toString().slice(-4)}`);
                          }}
                          className="px-2 py-0.5 bg-green-600 hover:bg-green-700 text-white rounded font-medium"
                        >
                          Mark Paid
                        </button>
                      ) : (
                        <span className="text-green-700 text-[11px]">Paid</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Issue Bill Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-3 z-50">
          <div className="bg-white rounded border border-slate-400 max-w-sm w-full p-4 shadow space-y-3">
            <div className="border-b border-slate-200 pb-2 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-sm">Issue Utility Bill</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-500 font-bold">✕</button>
            </div>

            {formError && (
              <div className="p-2 bg-red-100 border border-red-300 text-red-800 rounded">{formError}</div>
            )}

            <form onSubmit={handleCreateBill} className="space-y-2.5">
              <div>
                <label className="font-semibold text-slate-700 block mb-0.5">Target Flat *</label>
                <select
                  required
                  value={formFlatId}
                  onChange={(e) => setFormFlatId(Number(e.target.value))}
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
                <label className="font-semibold text-slate-700 block mb-0.5">Bill Head</label>
                <input
                  type="text"
                  required
                  value={formBillType}
                  onChange={(e) => setFormBillType(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
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
                <label className="font-semibold text-slate-700 block mb-0.5">Month & Year</label>
                <input
                  type="text"
                  value={formMonthYear}
                  onChange={(e) => setFormMonthYear(e.target.value)}
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

      {/* Record Bill Payment Modal */}
      {payingBill && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-3 z-50">
          <div className="bg-white rounded border border-slate-400 max-w-sm w-full p-4 shadow space-y-3">
            <div className="border-b border-slate-200 pb-2 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-sm">Record Utility Payment</h3>
              <button onClick={() => setPayingBill(null)} className="text-slate-500 font-bold">✕</button>
            </div>

            <form onSubmit={handleConfirmBillPayment} className="space-y-2.5">
              <div>
                <span className="text-slate-500">Bill: </span>
                <strong>#{payingBill.bill_id} · {payingBill.bill_type} · ₹{payingBill.amount}</strong>
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
                <label className="font-semibold text-slate-700 block mb-0.5">Transaction Ref</label>
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
                  onClick={() => setPayingBill(null)}
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
