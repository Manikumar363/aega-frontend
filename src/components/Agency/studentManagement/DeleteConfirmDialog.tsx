"use client";

import React from "react";
import { X } from "lucide-react";

type DeleteConfirmDialogProps = {
  isOpen: boolean;
  studentName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
};

const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  isOpen,
  studentName,
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#14112E] border border-gray-700 rounded-lg p-8 w-full max-w-md mx-4">
        {/* Close Button */}
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-white text-2xl font-bold">Delete Student</h2>
        </div>

        {/* Message */}
        <div className="mb-8 space-y-3">
          <p className="text-white/90">
            Are you sure you want to delete <span className="font-semibold text-[#F68E2D]">{studentName}</span>?
          </p>
          <p className="text-white/60 text-sm">
            This action cannot be undone. All student data, including their profile information, educational records, and employment history will be permanently deleted from the system.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 bg-transparent border border-gray-600 text-white px-4 py-3 rounded-md transition-colors hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 bg-[#E03137] hover:bg-[#c82a30] text-white px-4 py-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmDialog;
