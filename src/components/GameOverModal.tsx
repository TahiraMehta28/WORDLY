import React, { useState } from 'react';
import { Copy, RefreshCw, Check } from 'lucide-react';

interface GameOverModalProps {
  isOpen: boolean;
  won: boolean;
  targetWord: string;
  attempts: number;
  grid: string[][];
  evaluations: string[][];
  onRestart: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  won,
  targetWord,
  attempts,
  grid,
  evaluations,
  onRestart
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generateShareText = () => {
    const title = `Wordly ${won ? attempts : 'X'}/6`;
    const emojiGrid = evaluations
      .filter(row => row.some(cell => cell !== ''))
      .map(row => 
        row.map(cell => {
          if (cell === 'correct') return '🟩';
          if (cell === 'present') return '🟨';
          if (cell === 'absent') return '⬛';
          return '';
        }).join('')
      )
      .join('\n');
    
    return `${title}\n\n${emojiGrid}\n\nPlay Wordly at: wordly.game`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateShareText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = generateShareText();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop">
      <div className="modal-content rounded-2xl p-6 max-w-sm mx-4 text-center shadow-2xl">
        <div className="mb-6">
          <div className="text-4xl mb-3">
            {won ? '🎉' : '😔'}
          </div>
          <h2 className="text-2xl font-bold mb-2">
            {won ? 'Congratulations!' : 'Game Over!'}
          </h2>
          <p className="text-base opacity-90">
            {won 
              ? `You solved it in ${attempts} attempt${attempts !== 1 ? 's' : ''}!`
              : `The word was:`
            }
          </p>
          {!won && (
            <p className="text-2xl font-bold mt-2 text-blue-400">
              {targetWord.toUpperCase()}
            </p>
          )}
        </div>

        <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/10">
          <h3 className="font-semibold mb-4 text-sm opacity-75">Your Game:</h3>
          <div className="space-y-1.5">
            {evaluations
              .filter(row => row.some(cell => cell !== ''))
              .map((row, index) => (
                <div key={index} className="flex justify-center gap-1.5">
                  {row.map((cell, cellIndex) => {
                    let bgColor = 'bg-gray-600';
                    if (cell === 'correct') bgColor = 'bg-green-500';
                    else if (cell === 'present') bgColor = 'bg-yellow-500';
                    
                    return (
                      <div 
                        key={cellIndex} 
                        className={`w-8 h-8 ${bgColor} rounded-md`}
                      />
                    );
                  })}
                </div>
              ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={copyToClipboard}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            {copied ? (
              <>
                <Check size={18} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={18} />
                Share
              </>
            )}
          </button>
          <button
            onClick={onRestart}
            className="flex-1 flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <RefreshCw size={18} />
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;