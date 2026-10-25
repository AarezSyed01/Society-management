import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const SocietyInfoModule: React.FC = () => {
  const { society, updateSociety, resetDatabase } = useApp();

  const [name, setName] = useState(society.name);
  const [address, setAddress] = useState(society.address);
  const [contactNo, setContactNo] = useState(society.contact_no);
  const [regNo, setRegNo] = useState(society.registration_no || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSociety({
      name,
      address,
      contact_no: contactNo,
      registration_no: regNo,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleReset = () => {
    if (confirm('Reset all society database records back to original demo state?')) {
      resetDatabase();
      alert('All records reset to initial state.');
    }
  };

  return (
    <div className="space-y-3 max-w-2xl text-xs">
      <div className="bg-white p-3 rounded border border-slate-300 flex justify-between items-center">
        <div>
          <h2 className="text-base font-bold text-slate-800 m-0">Society Information & Settings</h2>
          <p className="text-slate-500 m-0 text-[11px]">Society profile details and demonstration database controls</p>
        </div>
        <button
          onClick={handleReset}
          className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded font-semibold border border-slate-300"
        >
          Reset Demo Data
        </button>
      </div>

      {saveSuccess && (
        <div className="p-2 bg-green-100 border border-green-300 text-green-800 rounded font-medium">
          Society details updated successfully.
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded border border-slate-300 p-4 space-y-3">
        <div>
          <label className="font-semibold text-slate-700 block mb-0.5">Society Name *</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="font-semibold text-slate-700 block mb-0.5">Registration Number</label>
            <input
              type="text"
              value={regNo}
              onChange={(e) => setRegNo(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded font-mono"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-0.5">Office Phone *</label>
            <input
              type="text"
              required
              value={contactNo}
              onChange={(e) => setContactNo(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
            />
          </div>
        </div>

        <div>
          <label className="font-semibold text-slate-700 block mb-0.5">Address *</label>
          <textarea
            rows={2}
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
          />
        </div>

        <div className="pt-2 border-t border-slate-200 text-right">
          <button
            type="submit"
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-bold"
          >
            Save Society Profile
          </button>
        </div>
      </form>
    </div>
  );
};
