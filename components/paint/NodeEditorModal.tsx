"use client";

import React from 'react';

interface NodeEditorModalProps {
  open: boolean;
  node: any;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function NodeEditorModal({ open, node, onClose, onSave }: NodeEditorModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96">
        <h2 className="text-lg font-bold mb-4">Edit Node</h2>
        <div className="mb-4">
          <p className="text-sm text-gray-500">Editing: {node?.data?.label}</p>
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded">
            Cancel
          </button>
          <button
            onClick={() => onSave({ label: node?.data?.label + ' (Updated)' })}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
