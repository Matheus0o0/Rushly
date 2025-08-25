import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { getDailyWordSequence, hasPlayedToday, saveGameResult } from '../utils/gameUtils';

const WordGame: React.FC = () => {
  const [wordSequence, setWordSequence] = useState<Array<{word: string, color: string, colorName: string}>>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'completed' | 'failed' | 'already-played'>('ready');
  const [hasPlayed, setHasPlayed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const [score, setScore] = useState(0);

  const colors = [
    { name: 'vermelho', color: '#EF4444', bg: 'bg-red-500' },
    { name: 'azul', color: '#3B82F6', bg: 'bg-blue-500' },
    { name: 'verde', color: '#10B981', bg: 'bg-green-500' },
    { name: 'amarelo', color: '#F59E0B', bg: 'bg-yellow-500' },
    { name: 'roxo', color: '#8B5CF6', bg: 'bg-purple-500' },
    { name: 'laranja', color: '#F97316', bg: 'bg-orange-500' },
    { name: 'rosa', color: '#EC4899', bg: 'bg-pink-500' },
  ];

  useEffect(() => {
    const dailySequence = getDailyWordSequence();
    const sequence = dailySequence.map(item => {
      const wordColor = colors[item.wordColorIndex];
      const textColor = colors[item.textColorIndex];
      return {
        word: wordColor.name,
        color: textColor.color,
        colorName: textColor.name
      };
    });
    setWordSequence(sequence);
    
    const played = hasPlayedToday('word');
    setHasPlayed(played);
    if (played) {
      setGameState('already-played');
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (gameState === 'playing' && timeLeft === 0) {
      // Time's up, move to next word or end game
      if (currentWordIndex < wordSequence.length - 1) {
        setCurrentWordIndex(curr => curr + 1);
        setTimeLeft(5);
      } else {
        // Game completed successfully
        saveGameResult('word', true);
        setGameState('completed');
      }
    }

    return () => clearTimeout(timer);
  }, [gameState, timeLeft, currentWordIndex, wordSequence.length]);

  const startGame = () => {
    if (hasPlayed) return;
    setGameStarted(true);
    setGameState('playing');
    setCurrentWordIndex(0);
    setTimeLeft(5);
    setScore(0);
  };

  const handleColorClick = (clickedColorName: string) => {
    if (gameState !== 'playing') return;

    const currentWord = wordSequence[currentWordIndex];
    
    if (clickedColorName === currentWord.colorName) {
      // Correct!
      const newScore = score + 1;
      setScore(newScore);
      
      if (currentWordIndex < wordSequence.length - 1) {
        setCurrentWordIndex(curr => curr + 1);
        setTimeLeft(5);
      } else {
        // Game completed successfully
        saveGameResult('word', true);
        setGameState('completed');
      }
    } else {
      // Wrong color - game over
      saveGameResult('word', false);
      setGameState('failed');
      setHasPlayed(true);
    }
  };

  const renderResult = () => {
    if (gameState === 'already-played') {
      return (
        <div className="text-center bg-gray-800/50 rounded-xl p-6 border border-gray-600/30">
          <div className="text-4xl mb-3">⏰</div>
          <h3 className="text-lg font-bold text-white mb-2">Já jogou hoje!</h3>
          <p className="text-gray-300 text-sm">Volte amanhã para novas palavras.</p>
        </div>
      );
    }

    if (gameState === 'completed') {
      return (
        <div className="text-center bg-green-900/30 rounded-xl p-6 border border-green-500/30">
          <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-green-400 mb-2">Excelente!</h3>
          <p className="text-green-300 text-sm">Todas as cores corretas!</p>
          <p className="text-lg font-bold text-green-400 mt-2">
            {score}/{wordSequence.length}
          </p>
          <div className="mt-4">
            <p className="text-xs text-green-400 mb-2">Sequência completa:</p>
            <div className="space-y-2">
              {wordSequence.map((word, i) => (
                <div key={i} className="flex items-center justify-center gap-2 text-sm">
                  <span 
                    className="font-bold"
                    style={{ color: word.color }}
                  >
                    {word.word.toUpperCase()}
                  </span>
                  <span className="text-green-300">→</span>
                  <span className="text-green-400">{word.colorName}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (gameState === 'failed') {
      return (
        <div className="text-center bg-red-900/30 rounded-xl p-6 border border-red-500/30">
          <XCircle size={48} className="text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-red-400 mb-2">Ops!</h3>
          <p className="text-red-300 text-sm">Cor errada. Tente amanhã!</p>
          <p className="text-lg font-bold text-red-400 mt-2">
            {score}/{wordSequence.length}
          </p>
          <div className="mt-4">
            <p className="text-xs text-red-400 mb-2">Sequência completa:</p>
            <div className="space-y-2">
              {wordSequence.map((word, i) => (
                <div key={i} className="flex items-center justify-center gap-2 text-sm">
                  <span 
                    className="font-bold"
                    style={{ color: word.color }}
                  >
                    {word.word.toUpperCase()}
                  </span>
                  <span className="text-red-300">→</span>
                  <span className="text-red-400">{word.colorName}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const currentWord = wordSequence[currentWordIndex];

  return (
    <div className="space-y-6">
      {gameState === 'ready' && !hasPlayed && (
        <div className="text-center space-y-4">
          <div className="bg-green-900/20 rounded-xl p-4 border border-green-500/30">
            <h4 className="text-sm font-semibold text-green-400 mb-2">Como jogar:</h4>
            <ul className="text-xs text-green-300 space-y-1 text-left">
              <li>• {wordSequence.length} palavras, 5s cada</li>
              <li>• Clique na COR do texto</li>
              <li>• Não no que a palavra diz</li>
              <li>• Se errar, perde a chance</li>
            </ul>
          </div>
          
          <button
            onClick={startGame}
            className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            Começar Jogo
          </button>
        </div>
      )}

      {gameState === 'playing' && currentWord && (
        <div className="space-y-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Clock size={16} className="text-orange-500" />
              <span className="text-lg font-bold text-orange-500">{timeLeft}s</span>
              <span className="text-gray-500">|</span>
              <span className="text-sm text-gray-400">
                {currentWordIndex + 1}/{wordSequence.length}
              </span>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-8 mb-4 border border-gray-600/30">
              <div
                className="text-4xl font-bold"
                style={{ color: currentWord.color }}
              >
                {currentWord.word.toUpperCase()}
              </div>
            </div>

            <p className="text-sm text-gray-300 mb-4">Qual é a COR desta palavra?</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => handleColorClick(color.name)}
                className={`py-2 px-3 rounded-lg font-semibold text-white transition-all hover:scale-105 active:scale-95 ${color.bg} shadow-md hover:shadow-lg text-sm border border-gray-600/30`}
              >
                {color.name.charAt(0).toUpperCase() + color.name.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {renderResult()}
    </div>
  );
};

export default WordGame;