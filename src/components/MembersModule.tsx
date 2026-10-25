import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Member } from '../types';

export const MembersModule: React.FC = () => {
  const { members, flats, society, addMember, updateMember, deleteMember } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [viewingMember, setViewingMember] = useState<Member | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formFlatId, setFormFlatId] = useState<number | ''>('');
  const [formStatus, setFormStatus] = useState<'Active' | 'Inactive'>('Active');
  const [formError, setFormError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const resetForm = () => {
    setFormName('');
    setFormPhone('');
    setFormEmail('');
    setFormAddress('');
    setFormFlatId('');
    setFormStatus('Active');
    setFormError(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openEditModal = (m: Member) => {
    setEditingMember(m);
    setFormName(m.name);
    setFormPhone(m.phone);
    setFormEmail(m.email);
    setFormAddress(m.address || '');
    setFormFlatId(m.flat_id || '');
    setFormStatus(m.status as 'Active' | 'Inactive');
    setFormError(null);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim() || !formPhone.trim() || !formEmail.trim()) {
      setFormError('Please enter member name, phone number, and email.');
      return;
    }

    if (editingMember) {
      const res = updateMember(editingMember.member_id, {
        name: formName.trim(),
        phone: formPhone.trim(),
        email: formEmail.trim(),
        address: formAddress.trim(),
        flat_id: formFlatId ? Number(formFlatId) : null,
        status: formStatus,
      });
      if (!res.success) {
        setFormError(res.error || 'Failed to update member.');
        return;
      }
      setEditingMember(null);
      setActionSuccess('Member details successfully updated.');
    } else {
      const res = addMember({
        name: formName.trim(),
        phone: formPhone.trim(),
        email: formEmail.trim(),
        address: formAddress.trim(),
        flat_id: formFlatId ? Number(formFlatId) : null,
        society_id: society.society_id,
        status: formStatus,
      });
      if (!res.success) {
        setFormError(res.error || 'Failed to add member.');
        return;
      }
      setIsAddModalOpen(false);
      setActionSuccess('New member added successfully.');
    }

    resetForm();
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleDelete = (member_id: number) => {
    if (confirm('Are you sure you want to delete this member?')) {
      const res = deleteMember(member_id);
      if (!res.success) {
        alert(res.error);
      } else {
        setActionSuccess('Member record removed.');
        setTimeout(() => setActionSuccess(null), 3000);
      }
    }
  };

  const filteredMembers = members.filter((m) => {
    const flat = flats.find((f) => f.flat_id === m.flat_id);
    const flatStr = flat ? `${flat.block}-${flat.flat_no}` : '';
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone.includes(searchTerm) ||
      flatStr.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-3 text-xs">
      {/* Title & Action */}
      <div className="bg-white p-3 rounded border border-slate-300 flex justify-between items-center">
        <div>
          <h2 className="text-base font-bold text-slate-800 m-0">Member Management Module</h2>
          <p className="text-slate-500 m-0 text-[11px]">List and register society members and resident contact profiles</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
        >
          + Add Member
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
          placeholder="Search by name, email, phone, or flat..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-72 px-2.5 py-1 border border-slate-300 rounded"
        />

        <div className="flex items-center gap-1">
          <span className="text-slate-600 font-semibold">Filter:</span>
          {(['All', 'Active', 'Inactive'] as const).map((st) => (
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

      {/* Members Table */}
      <div className="bg-white rounded border border-slate-300 overflow-hidden shadow-2xs">
        <table className="w-full text-left">
          <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold text-[11px]">
            <tr>
              <th className="p-2.5">ID</th>
              <th className="p-2.5">Member Name</th>
              <th className="p-2.5">Assigned Flat</th>
              <th className="p-2.5">Contact (Phone & Email)</th>
              <th className="p-2.5">Status</th>
              <th className="p-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredMembers.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-slate-400">
                  No members found.
                </td>
              </tr>
            ) : (
              filteredMembers.map((m) => {
                const flat = flats.find((f) => f.flat_id === m.flat_id);
                return (
                  <tr key={m.member_id} className="hover:bg-slate-50">
                    <td className="p-2.5 font-mono text-slate-500">#{m.member_id}</td>
                    <td className="p-2.5 font-bold text-slate-800">
                      {m.name}
                      <div className="font-normal text-slate-400 text-[10px]">{m.address}</div>
                    </td>
                    <td className="p-2.5 text-slate-700">
                      {flat ? (
                        <span className="font-medium text-blue-900">
                          Flat {flat.block}-{flat.flat_no} ({flat.type})
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">None</span>
                      )}
                    </td>
                    <td className="p-2.5">
                      <div>{m.phone}</div>
                      <div className="text-slate-400 text-[10px]">{m.email}</div>
                    </td>
                    <td className="p-2.5">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          m.status === 'Active' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="p-2.5 text-right space-x-1">
                      <button
                        onClick={() => setViewingMember(m)}
                        className="px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => openEditModal(m)}
                        className="px-2 py-0.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(m.member_id)}
                        className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {(isAddModalOpen || editingMember) && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-3 z-50">
          <div className="bg-white rounded border border-slate-400 max-w-md w-full p-4 shadow space-y-3">
            <div className="border-b border-slate-200 pb-2 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingMember ? 'Edit Society Member' : 'Add New Member'}
              </h3>
              <button
                onClick={() => { setIsAddModalOpen(false); setEditingMember(null); }}
                className="text-slate-500 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-2 bg-red-100 border border-red-300 text-red-800 rounded">{formError}</div>
            )}

            <form onSubmit={handleSaveMember} className="space-y-2.5">
              <div>
                <label className="font-semibold text-slate-700 block mb-0.5">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-0.5">Phone *</label>
                  <input
                    type="text"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-0.5">Email *</label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-0.5">Assign Flat</label>
                  <select
                    value={formFlatId}
                    onChange={(e) => setFormFlatId(e.target.value ? Number(e.target.value) : '')}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                  >
                    <option value="">-- No Flat --</option>
                    {flats.map((f) => (
                      <option key={f.flat_id} value={f.flat_id}>
                        Flat {f.block}-{f.flat_no}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-0.5">Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-0.5">Permanent Address</label>
                <input
                  type="text"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setEditingMember(null); }}
                  className="px-3 py-1 bg-slate-200 text-slate-700 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details View Modal */}
      {viewingMember && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-3 z-50">
          <div className="bg-white rounded border border-slate-400 max-w-sm w-full p-4 shadow space-y-2">
            <h3 className="font-bold text-slate-900 text-sm border-b pb-1">Member Profile</h3>
            <div><strong>Name:</strong> {viewingMember.name}</div>
            <div><strong>Phone:</strong> {viewingMember.phone}</div>
            <div><strong>Email:</strong> {viewingMember.email}</div>
            <div>
              <strong>Flat:</strong>{' '}
              {flats.find((f) => f.flat_id === viewingMember.flat_id)
                ? `Flat ${flats.find((f) => f.flat_id === viewingMember.flat_id)?.block}-${flats.find((f) => f.flat_id === viewingMember.flat_id)?.flat_no}`
                : 'Not Assigned'}
            </div>
            <div><strong>Status:</strong> {viewingMember.status}</div>
            <div><strong>Registered Date:</strong> {viewingMember.created_at}</div>
            <div className="text-right pt-2 border-t">
              <button
                onClick={() => setViewingMember(null)}
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
