import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Notice } from '../types';

export const NoticesModule: React.FC = () => {
  const { notices, currentUser, addNotice, updateNotice, deleteNotice } = useApp();

  const isAdmin = currentUser?.role === 'admin';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formStatus, setFormStatus] = useState<'Published' | 'Draft'>('Published');
  const [formError, setFormError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const resetForm = () => {
    setFormTitle('');
    setFormDescription('');
    setFormStatus('Published');
    setFormError(null);
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openEditModal = (n: Notice) => {
    setEditingNotice(n);
    setFormTitle(n.title);
    setFormDescription(n.description);
    setFormStatus(n.publication_status);
    setFormError(null);
  };

  const handleSaveNotice = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formTitle.trim() || !formDescription.trim()) {
      setFormError('Please enter title and description.');
      return;
    }

    if (editingNotice) {
      updateNotice(editingNotice.notice_id, formTitle, formDescription, formStatus);
      setEditingNotice(null);
      setActionSuccess('Notice updated.');
    } else {
      addNotice(formTitle, formDescription, formStatus);
      setIsAddModalOpen(false);
      setActionSuccess('Notice published.');
    }

    resetForm();
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleDelete = (id: number) => {
    if (confirm('Delete this notice?')) {
      deleteNotice(id);
      setActionSuccess('Notice deleted.');
      setTimeout(() => setActionSuccess(null), 3000);
    }
  };

  const displayNotices = notices.filter((n) => {
    if (!isAdmin && n.publication_status !== 'Published') return false;
    return (
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-3 text-xs">
      {/* Title */}
      <div className="bg-white p-3 rounded border border-slate-300 flex justify-between items-center">
        <div>
          <h2 className="text-base font-bold text-slate-800 m-0">Society Notice Board</h2>
          <p className="text-slate-500 m-0 text-[11px]">Official circulars, general meeting notices, and society announcements</p>
        </div>
        {isAdmin && (
          <button
            onClick={openAddModal}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
          >
            + Publish Notice
          </button>
        )}
      </div>

      {actionSuccess && (
        <div className="p-2 bg-green-100 border border-green-300 text-green-800 rounded font-medium">
          {actionSuccess}
        </div>
      )}

      {/* Search */}
      <div className="bg-white p-2 rounded border border-slate-300">
        <input
          type="text"
          placeholder="Search notices by keyword..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-72 px-2.5 py-1 border border-slate-300 rounded"
        />
      </div>

      {/* Notices Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {displayNotices.length === 0 ? (
          <div className="col-span-full p-4 bg-white rounded border border-slate-300 text-center text-slate-400">
            No notices posted.
          </div>
        ) : (
          displayNotices.map((n) => (
            <div key={n.notice_id} className="bg-white rounded border border-slate-300 p-3 flex flex-col justify-between shadow-2xs">
              <div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                  <span>Date: {n.created_at.substring(0, 10)}</span>
                  {isAdmin && (
                    <span className={`px-1 rounded font-bold ${
                      n.publication_status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {n.publication_status}
                    </span>
                  )}
                </div>
                <h4 className="font-bold text-slate-900 text-xs m-0">{n.title}</h4>
                <p className="text-slate-600 mt-1 line-clamp-3 text-[11px] leading-relaxed">
                  {n.description}
                </p>
              </div>

              <div className="pt-2 mt-3 border-t border-slate-200 flex justify-between items-center">
                <button
                  onClick={() => setSelectedNotice(n)}
                  className="text-blue-700 hover:underline font-semibold"
                >
                  Read Full Notice
                </button>

                {isAdmin && (
                  <div className="space-x-1">
                    <button
                      onClick={() => openEditModal(n)}
                      className="px-1.5 py-0.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-[10px]"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(n.notice_id)}
                      className="px-1.5 py-0.5 bg-red-600 hover:bg-red-700 text-white rounded text-[10px]"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reader Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-3 z-50">
          <div className="bg-white rounded border border-slate-400 max-w-md w-full p-4 shadow space-y-3">
            <div className="border-b border-slate-200 pb-2 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 text-sm m-0">{selectedNotice.title}</h3>
                <span className="text-[10px] text-slate-400">Date: {selectedNotice.created_at}</span>
              </div>
              <button onClick={() => setSelectedNotice(null)} className="text-slate-500 font-bold">✕</button>
            </div>
            <p className="text-slate-700 whitespace-pre-line leading-relaxed m-0">{selectedNotice.description}</p>
            <div className="text-right pt-2 border-t">
              <button
                onClick={() => setSelectedNotice(null)}
                className="px-3 py-1 bg-slate-700 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {(isAddModalOpen || editingNotice) && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-3 z-50">
          <div className="bg-white rounded border border-slate-400 max-w-md w-full p-4 shadow space-y-3">
            <div className="border-b border-slate-200 pb-2 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingNotice ? 'Edit Notice' : 'Publish Notice'}
              </h3>
              <button
                onClick={() => { setIsAddModalOpen(false); setEditingNotice(null); }}
                className="text-slate-500 font-bold"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-2 bg-red-100 border border-red-300 text-red-800 rounded">{formError}</div>
            )}

            <form onSubmit={handleSaveNotice} className="space-y-2.5">
              <div>
                <label className="font-semibold text-slate-700 block mb-0.5">Title / Subject *</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-0.5">Notice Content *</label>
                <textarea
                  rows={4}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-0.5">Publication Status</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded bg-white"
                >
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setEditingNotice(null); }}
                  className="px-3 py-1 bg-slate-200 text-slate-700 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
                >
                  Save Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
