import React, { useState, useEffect, useCallback } from 'react';
import GameGrid from './GameGrid';
import InstructionModal from './InstructionModal';
import GameOverModal from './GameOverModal';
import { useToast } from '@/hooks/use-toast';

const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

// Common 5-letter words for fallback
const FALLBACK_WORDS = [
  'ABOUT', 'ABOVE', 'ABUSE', 'ACTOR', 'ACUTE', 'ADMIT', 'ADOPT', 'ADULT', 'AFTER', 'AGAIN',
  'AGENT', 'AGREE', 'AHEAD', 'ALARM', 'ALBUM', 'ALERT', 'ALIEN', 'ALIGN', 'ALIKE', 'ALIVE',
  'ALLOW', 'ALONE', 'ALONG', 'ALTER', 'AMONG', 'ANGER', 'ANGLE', 'ANGRY', 'APART', 'APPLE',
  'APPLY', 'ARENA', 'ARGUE', 'ARISE', 'ARRAY', 'ASIDE', 'ASSET', 'AUDIO', 'AUDIT', 'AVOID',
  'AWAKE', 'AWARD', 'AWARE', 'BADLY', 'BASIC', 'BEACH', 'BEGAN', 'BEGIN', 'BEING', 'BELOW',
  'BENCH', 'BILLY', 'BIRTH', 'BLACK', 'BLAME', 'BLANK', 'BLAST', 'BLIND', 'BLOCK', 'BLOOD',
  'BOARD', 'BOOST', 'BOOTH', 'BOUND', 'BRAIN', 'BRAND', 'BRAVE', 'BREAD', 'BREAK', 'BREED',
  'BRIEF', 'BRING', 'BROAD', 'BROKE', 'BROWN', 'BUILD', 'BUILT', 'BUYER', 'CABLE', 'CALIF',
  'CARRY', 'CATCH', 'CAUSE', 'CHAIN', 'CHAIR', 'CHAOS', 'CHARM', 'CHART', 'CHASE', 'CHEAP',
  'CHECK', 'CHEST', 'CHIEF', 'CHILD', 'CHINA', 'CHOSE', 'CIVIL', 'CLAIM', 'CLASS', 'CLEAN'
];

const WordlyGame: React.FC = () => {
  const [grid, setGrid] = useState<string[][]>(
    Array(MAX_ATTEMPTS).fill(null).map(() => Array(WORD_LENGTH).fill(''))
  );
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [targetWord, setTargetWord] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [evaluations, setEvaluations] = useState<string[][]>(
    Array(MAX_ATTEMPTS).fill(null).map(() => Array(WORD_LENGTH).fill(''))
  );
  const [showInstructions, setShowInstructions] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();

  // Fetch a random word from dictionary API
  const fetchRandomWord = useCallback(async (): Promise<string> => {
    try {
      // Try to get a random word from an API
      const response = await fetch('https://api.datamuse.com/words?sp=?????&max=100');
      const words = await response.json();
      
      if (words && words.length > 0) {
        const randomIndex = Math.floor(Math.random() * words.length);
        return words[randomIndex].word.toUpperCase();
      }
    } catch (error) {
      console.error('Failed to fetch word from API:', error);
    }
    
    // Fallback to predefined words
    const randomIndex = Math.floor(Math.random() * FALLBACK_WORDS.length);
    return FALLBACK_WORDS[randomIndex];
  }, []);

  // Validate word using dictionary API
  const validateWord = useCallback(async (word: string): Promise<boolean> => {
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
      return response.ok;
    } catch (error) {
      // If API fails, allow any 5-letter word with basic validation
      return /^[A-Za-z]{5}$/.test(word);
    }
  }, []);

  // Initialize game
  const initializeGame = useCallback(async () => {
    setIsLoading(true);
    const word = await fetchRandomWord();
    setTargetWord(word);
    setGrid(Array(MAX_ATTEMPTS).fill(null).map(() => Array(WORD_LENGTH).fill('')));
    setCurrentRow(0);
    setCurrentCol(0);
    setGameOver(false);
    setWon(false);
    setEvaluations(Array(MAX_ATTEMPTS).fill(null).map(() => Array(WORD_LENGTH).fill('')));
    setIsLoading(false);
  }, [fetchRandomWord]);

  // Evaluate guess
  const evaluateGuess = useCallback((guess: string, target: string) => {
    const result = Array(WORD_LENGTH).fill('absent');
    const targetChars = target.split('');
    const guessChars = guess.split('');
    
    // First pass: mark correct positions
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (guessChars[i] === targetChars[i]) {
        result[i] = 'correct';
        targetChars[i] = ''; // Mark as used
        guessChars[i] = ''; // Mark as used
      }
    }
    
    // Second pass: mark present letters
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (guessChars[i] && targetChars.includes(guessChars[i])) {
        result[i] = 'present';
        const targetIndex = targetChars.indexOf(guessChars[i]);
        targetChars[targetIndex] = ''; // Mark as used
      }
    }
    
    return result;
  }, []);

  // Handle key press
  const handleKeyPress = useCallback(async (key: string) => {
    if (gameOver || isLoading) return;

    if (key === 'Enter') {
      if (currentCol !== WORD_LENGTH) {
        toast({
          title: "Incomplete word",
          description: "Please enter a 5-letter word",
          variant: "destructive"
        });
        return;
      }

      const currentGuess = grid[currentRow].join('');
      
      // Validate word
      const isValid = await validateWord(currentGuess);
      if (!isValid) {
        toast({
          title: "Invalid word",
          description: "Please enter a valid English word",
          variant: "destructive"
        });
        return;
      }

      // Evaluate the guess
      const evaluation = evaluateGuess(currentGuess, targetWord);
      
      // Update evaluations
      const newEvaluations = [...evaluations];
      newEvaluations[currentRow] = evaluation;
      setEvaluations(newEvaluations);

      // Check if won
      if (evaluation.every(e => e === 'correct')) {
        setWon(true);
        setGameOver(true);
        toast({
          title: "Congratulations! 🎉",
          description: `You guessed it in ${currentRow + 1} attempts!`
        });
        return;
      }

      // Check if game over
      if (currentRow === MAX_ATTEMPTS - 1) {
        setGameOver(true);
        toast({
          title: "Game Over 😔",
          description: `The word was: ${targetWord}`
        });
        return;
      }

      // Move to next row
      setCurrentRow(currentRow + 1);
      setCurrentCol(0);
    } else if (key === 'Backspace') {
      if (currentCol > 0) {
        const newGrid = [...grid];
        newGrid[currentRow][currentCol - 1] = '';
        setGrid(newGrid);
        setCurrentCol(currentCol - 1);
      }
    } else if (/^[A-Za-z]$/.test(key) && currentCol < WORD_LENGTH) {
      const newGrid = [...grid];
      newGrid[currentRow][currentCol] = key.toUpperCase();
      setGrid(newGrid);
      setCurrentCol(currentCol + 1);
    }
  }, [currentRow, currentCol, grid, gameOver, targetWord, evaluations, validateWord, evaluateGuess, toast, isLoading]);

  // Keyboard event listener
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      if (key === 'Enter' || key === 'Backspace' || /^[A-Za-z]$/.test(key)) {
        event.preventDefault();
        handleKeyPress(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  // Initialize game on mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  return (
    <>
      <InstructionModal 
        isOpen={showInstructions} 
        onClose={() => setShowInstructions(false)} 
      />
      
      <GameOverModal
        isOpen={gameOver}
        won={won}
        targetWord={targetWord}
        attempts={currentRow + (won ? 1 : 0)}
        grid={grid}
        evaluations={evaluations}
        onRestart={() => {
          initializeGame();
          setShowInstructions(false);
        }}
      />

      <div className="flex-1 flex flex-col items-center justify-center min-h-screen p-4">
        {isLoading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading new word...</p>
          </div>
        ) : (
          <>
            <GameGrid 
              grid={grid} 
              currentRow={currentRow} 
              evaluations={evaluations} 
            />
            
            <div className="mt-8 text-center space-y-2">
              <p className="text-sm opacity-75">
                Attempt: {currentRow + 1}/{MAX_ATTEMPTS}
              </p>
              <p className="text-xs opacity-50">
                Type letters and press Enter to guess
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default WordlyGame;