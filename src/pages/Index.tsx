import React, { useState, useEffect } from 'react';
import WordlyGame from '@/components/WordlyGame';

const Index = () => {
  const [titleText, setTitleText] = useState('');
  const [subtitleText, setSubtitleText] = useState('');
  const fullTitle = 'Wordly';
  const fullSubtitle = 'Dictionary Word Challenge';
  
  useEffect(() => {
    // First animate the title
    let currentIndex = 0;
    const titleTimer = setInterval(() => {
      if (currentIndex <= fullTitle.length) {
        setTitleText(fullTitle.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(titleTimer);
        
        // Then animate the subtitle after title is complete
        setTimeout(() => {
          let subtitleIndex = 0;
          const subtitleTimer = setInterval(() => {
            if (subtitleIndex <= fullSubtitle.length) {
              setSubtitleText(fullSubtitle.slice(0, subtitleIndex));
              subtitleIndex++;
            } else {
              clearInterval(subtitleTimer);
            }
          }, 50);
        }, 500);
      }
    }, 150);
    
    
    return () => {};
  }, []);

  return (
    <div className="min-h-screen animated-bg">
      {/* Floating particles */}
      <div className="particle particle-1"></div>
      <div className="particle particle-2"></div>
      <div className="particle particle-3"></div>
      
      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent mb-4">
            {titleText}
            {titleText.length < fullTitle.length && <span className="animate-pulse">|</span>}
          </h1>
          <div className="h-8 flex items-center justify-center">
            <span className="text-xl md:text-2xl opacity-75">
              {subtitleText}
              {subtitleText.length < fullSubtitle.length && subtitleText.length > 0 && <span className="animate-pulse">|</span>}
            </span>
          </div>
          
          <div className="flex items-center justify-center space-x-4 mt-6">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-sm opacity-75">Live Game</span>
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="relative z-10">
        <WordlyGame />
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center">
        <p className="text-sm opacity-50">
          Challenge your vocabulary • Share your results • Play daily
        </p>
      </footer>
    </div>
  );
};

export default Index;
