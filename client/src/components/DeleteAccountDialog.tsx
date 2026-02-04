import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteAccountDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  userName?: string;
}

export const DeleteAccountDialog = ({ isOpen, onClose, onConfirm }: DeleteAccountDialogProps) => {
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    if (confirmText.toLowerCase() !== 'delete') {
      setError('Please type "delete" to confirm');
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      await onConfirm();
      // Dialog will close and user will be redirected
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete account. Please try again.');
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      setConfirmText('');
      setError('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="surface-strong max-w-md w-full p-6 rounded-2xl shadow-xl">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Delete Account</h3>
              <p className="text-sm text-gray-600">This action cannot be undone</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isDeleting}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6 space-y-3">
          <p className="text-sm text-gray-700">
            Are you sure you want to permanently delete your account? This will:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1 ml-2">
            <li>Delete your profile and all personal information</li>
            <li>Delete all your cycle history and daily logs</li>
            <li>Remove all your data from our servers</li>
            <li>This action cannot be reversed</li>
          </ul>
        </div>

        <div className="mb-4">
          <label htmlFor="confirmDelete" className="block text-sm font-medium text-gray-700 mb-2">
            Type <span className="font-semibold text-red-600">"delete"</span> to confirm:
          </label>
          <input
            id="confirmDelete"
            type="text"
            value={confirmText}
            onChange={(e) => {
              setConfirmText(e.target.value);
              setError('');
            }}
            disabled={isDeleting}
            placeholder="Type 'delete' here"
            className="input-field disabled:opacity-50 disabled:cursor-not-allowed"
            autoFocus
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleConfirm}
            disabled={isDeleting || confirmText.toLowerCase() !== 'delete'}
            className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isDeleting ? 'Deleting...' : 'Delete Account Permanently'}
          </button>
          <button
            onClick={handleClose}
            disabled={isDeleting}
            className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
