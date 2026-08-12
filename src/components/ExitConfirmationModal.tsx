import React from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ExitConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExitConfirmationModal: React.FC<ExitConfirmationModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  if (!isOpen) return null;

  const handleConfirmExit = async () => {
    onClose();
    await signOut();
    navigate('/signin');
  };

  return ReactDOM.createPortal(
    <div
      className="exit-overlay fixed inset-0 w-full h-full bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-[99999] pointer-events-auto"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="exit-modal relative z-[100000] bg-[#12121e] border border-[#ff3366] max-w-md w-full p-6 rounded-xl shadow-2xl space-y-4 animate-in fade-in zoom-in duration-150">
        <div className="flex items-center gap-3 border-b border-[#2a2a3a] pb-3">
          <div className="w-10 h-10 bg-[#ff3366]/10 border border-[#ff3366] flex items-center justify-center rounded-lg">
            <LogOut className="w-5 h-5 text-[#ff3366]" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-bold text-white tracking-wide">EXIT ARENA</h3>
            <p className="text-xs text-[#8e8ea0]">Sign out of active parlour session</p>
          </div>
        </div>

        <p className="text-sm font-tech text-[#e0e0e0] py-2">
          Are you sure you want to leave ARENA?
        </p>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#2a2a3a]">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1e1e2d] hover:bg-[#2a2a3a] text-[#8e8ea0] hover:text-white text-xs font-tech font-bold rounded transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmExit}
            className="px-5 py-2 bg-[#ff3366] hover:bg-[#e02e5b] text-white text-xs font-tech font-bold rounded uppercase tracking-wider transition-all shadow-lg shadow-[#ff3366]/20 cursor-pointer"
          >
            Exit Arena
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
