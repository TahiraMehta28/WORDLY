import React from 'react';
import { X } from 'lucide-react';

interface InstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InstructionModal: React.FC<InstructionModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop">
      <div className="modal-content rounded-xl p-8 max-w-md mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
        
        <h2 className="text-2xl font-bold mb-6 text-center">How to Play Wordly</h2>
        
        <div className="space-y-4 text-sm">
          <div className="space-y-2">
            <p className="font-semibold">Objective:</p>
            <p>Guess the hidden 5-letter word in 6 attempts or less.</p>
          </div>
          
          <div className="space-y-2">
            <p className="font-semibold">How to play:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Type any valid 5-letter English word</li>
              <li>Press Enter to submit your guess</li>
              <li>Watch the tiles change color for clues</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <p className="font-semibold">Color meanings:</p>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-green-500 flex items-center justify-center text-white font-bold text-sm">
                  W
                </div>
                <span>Letter is correct and in the right position</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-yellow-500 flex items-center justify-center text-white font-bold text-sm">
                  O
                </div>
                <span>Letter is in the word but wrong position</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-gray-600 flex items-center justify-center text-white font-bold text-sm">
                  R
                </div>
                <span>Letter is not in the word</span>
              </div>
            </div>
          </div>
          
          <div className="pt-4 border-t border-white/20">
            <p className="text-xs text-center opacity-75">
              A new word is available every time you refresh!
            </p>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="w-full mt-6 py-3 bg-primary hover:bg-primary/80 rounded-lg font-semibold transition-colors"
        >
          Start Playing
        </button>
      </div>
    </div>
  );
};

export default InstructionModal;