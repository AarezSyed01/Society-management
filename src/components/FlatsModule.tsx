import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Flat } from '../types';

export const FlatsModule: React.FC = () => {
  const { flats, members, society, addFlat, updateFlat, deleteFlat } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [blockFilter, setBlockFilter] = useState<'All' | 'A' | 'B'>('All');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingFlat, setEditingFlat] = useState<Flat | null>(null);

  // Form states
  const [formFlatNo, setFormFlatNo] = useState('');
  const [formFloor, setFormFloor] = useState<number | ''>(1);
  const [formBlock, setFormBlock] = useState('A');
  const [formType, setFormType] = useState('2 BHK');
  const [formError, setFormError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const resetForm = () => {
    setFormFlatNo('');
    setFormFloor(1);
    setFormBlock('A');
    setFormType('2 BHK');
    setFormError(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openEditModal = (f: Flat) => {
    setEditingFlat(f);
    setFormFlatNo(f.flat_no);
    setFormFloor(f.floor);
    setFormBlock(f.block);
    setFormType(f.type);
    setFormError(null);
  };

  const handleSaveFlat = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formFlatNo.trim()) {
      setFormError('Please enter flat number.');
      return;
    }

    if (editingFlat) {
      const res = updateFlat(editingFlat.flat_id, {
        flat_no: formFlatNo.trim(),
        floor: Number(formFloor) || 1,
        block: formBlock.trim().toUpperCase(),
        type: formType,
      });
      if (!res.success) {
        setFormError(res.error || 'Failed to update flat.');
        return;
      }
      setEditingFlat(null);
      setActionSuccess('Flat specifications updated.');
    } else {
      const res = addFlat({
        flat_no: formFlatNo.trim(),
        floor: Number(formFloor) || 1,
        block: formBlock.trim().toUpperCase(),
        type: formType,
        society_id: society.society_id,
      });
      if (!res.success) {
        setFormError(res.error || 'Failed to add flat.');
        return;
      }
      setIsAddModalOpen(false);
      setActionSuccess(`Flat ${formBlock}-${formFlatNo} added.`);
    }

    resetForm();
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleDelete = (flat_id: number) => {
    if (confirm('Are you sure you want to delete this flat?')) {
      const res = deleteFlat(flat_id);
      if (!res.success) {
        alert(res.error);
      } else {
        setActionSuccess('Flat deleted.');
        setTimeout(() => setActionSuccess(null), 3000);
      }
    }
  };

  const filteredFlats = flats.filter((f) => {
    const matchesSearch =
      f.flat_no.includes(searchTerm) ||
      f.block.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBlock = blockFilter === 'All' || f.block.toUpperCase() === blockFilter;
    return matchesSearch && matchesBlock;
  });

  return (
    <div className="space-y-3 text-xs">
      {/* Title & Action */}
      <div className="bg-white p-3 rounded border border-slate-300 flex justify-between items-center">
        <div>
          <h2 className="text-base font-bold text-slate-800 m-0">Apartment & Flat Management</h2>
          <p className="text-slate-500 m-0 text-[11px]">Manage apartment units, wings, floor assignments, and current occupants</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
        >
          + Add Flat
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
          placeholder="Search flat number, block, type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-72 px-2.5 py-1 border border-slate-300 rounded"
        />

        <div className="flex items-center gap-1">
          <span className="text-slate-600 font-semibold">Wing:</span>
          {(['All', 'A', 'B'] as const).map((b) => (
            <button
              key={b}
              onClick={() => setBlockFilter(b)}
              className={`px-2 py-0.5 rounded font-medium ${
                blockFilter === b ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
            >
              {b === 'All' ? 'All Wings' : `Wing ${b}`}
            </button>
          ))}
        </div>
      </div>

      {/* Flats Table */}
      <div className="bg-white rounded border border-slate-300 overflow-hidden shadow-2xs">
        <table className="w-full text-left">
          <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold text-[11px]">
            <tr>
              <th className="p-2.5">Flat ID</th>
              <th className="p-2.5">Wing & Flat Number</th>
              <th className="p-2.5">Floor Level</th>
              <th className="p-2.5">Configuration</th>
              <th className="p-2.5">Current Occupant / Resident</th>
              <th className="p-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredFlats.length === 0 ? (
              <tr><td colSpan={6} className="p-4 text-center text-slate-400">No flats found.</td></tr>
            ) : (
              filteredFlats.map((f) => {
                const occupants = members.filter((m) => m.flat_id === f.flat_id);
                return (
                  <tr key={f.flat_id} className="hover:bg-slate-50">
                    <td className="p-2.5 font-mono text-slate-500">#{f.flat_id}</td>
                    <td className="p-2.5 font-bold text-slate-800">Wing {f.block} - Flat {f.flat_no}</td>
                    <td className="p-2.5 text-slate-600">Floor {f.floor}</td>
                    <td className="p-2.5 text-slate-700 font-medium">{f.type}</td>
                    <td className="p-2.5">
                      {occupants.length > 0 ? (
                        occupants.map((occ) => (
                          <div key={occ.member_id} className="text-slate-800">
                            <strong>{occ.name}</strong> <span className="text-slate-500">({occ.phone})</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-slate-400 italic">Vacant</span>
                      )}
                    </td>
                    <td className="p-2.5 text-right space-x-1">
                      <button
                        onClick={() => openEditModal(f)}
                        className="px-2 py-0.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(f.flat_id)}
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
      {(isAddModalOpen || editingFlat) && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-3 z-50">
          <div className="bg-white rounded border border-slate-400 max-w-sm w-full p-4 shadow space-y-3">
            <div className="border-b border-slate-200 pb-2 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingFlat ? 'Edit Apartment' : 'Add Apartment'}
              </h3>
              <button
                onClick={() => { setIsAddModalOpen(false); setEditingFlat(null); }}
                className="text-slate-500 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-2 bg-red-100 border border-red-300 text-red-800 rounded">{formError}</div>
            )}

            <form onSubmit={handleSaveFlat} className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-0.5">Wing / Block *</label>
                  <input
                    type="text"
                    required
                    value={formBlock}
                    onChange={(e) => setFormBlock(e.target.value.toUpperCase())}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded uppercase"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-0.5">Flat Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 101"
                    value={formFlatNo}
                    onChange={(e) => setFormFlatNo(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-0.5">Floor Level</label>
                  <input
                    type="number"
                    min={0}
                    max={50}
                    value={formFloor}
                    onChange={(e) => setFormFloor(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-0.5">Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                  >
                    <option value="1 BHK">1 BHK</option>
                    <option value="2 BHK">2 BHK</option>
                    <option value="3 BHK">3 BHK</option>
                    <option value="4 BHK">4 BHK</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setEditingFlat(null); }}
                  className="px-3 py-1 bg-slate-200 text-slate-700 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
                >
                  Save Flat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
