import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { getDailyColor, hasPlayedToday, saveGameResult } from '../utils/gameUtils';

const ColorGame: React.FC = () => {
  const [targetColor, setTargetColor] = useState('#000000');
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [gameState, setGameState] = useState<'playing' | 'completed' | 'failed' | 'already-played'>('playing');
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    const dailyColor = getDailyColor();
    setTargetColor(dailyColor);
    
    const played = hasPlayedToday('color');
    setHasPlayed(played);
    if (played) {
      setGameState('already-played');
    }
  }, []);

  const handleSubmit = () => {
    if (hasPlayed || gameState !== 'playing') return;

    // Check if colors match (with small tolerance for precision)
    const tolerance = 5; // RGB tolerance
    const targetRGB = hexToRgb(targetColor);
    const selectedRGB = hexToRgb(selectedColor);
    
    const isMatch = targetRGB && selectedRGB && 
      Math.abs(targetRGB.r - selectedRGB.r) <= tolerance &&
      Math.abs(targetRGB.g - selectedRGB.g) <= tolerance &&
      Math.abs(targetRGB.b - selectedRGB.b) <= tolerance;

    const success = isMatch;
    saveGameResult('color', success);
    setGameState(success ? 'completed' : 'failed');
    setHasPlayed(true);
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const renderResult = () => {
    if (gameState === 'already-played') {
      return (
        <div className="text-center bg-gray-800/50 rounded-xl p-6 border border-gray-600/30">
          <div className="text-4xl mb-3">⏰</div>
          <h3 className="text-lg font-bold text-white mb-2">Já jogou hoje!</h3>
          <p className="text-gray-300 text-sm">Volte amanhã para um novo desafio.</p>
        </div>
      );
    }

    if (gameState === 'completed') {
      return (
        <div className="text-center bg-green-900/30 rounded-xl p-6 border border-green-500/30">
          <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-green-400 mb-2">Parabéns!</h3>
          <p className="text-green-300 text-sm mb-4">Você acertou a cor!</p>
          <div className="flex justify-center gap-3">
            <div className="text-center">
              <div className="text-xs text-green-400 mb-1">Alvo</div>
              <div 
                className="w-12 h-12 rounded-full border-2 border-gray-600 shadow-lg"
                style={{ backgroundColor: targetColor }}
              />
              <p className="text-xs text-green-400 font-mono mt-1">{targetColor.toUpperCase()}</p>
            </div>
            <div className="text-center">
              <div className="text-xs text-green-400 mb-1">Sua escolha</div>
              <div 
                className="w-12 h-12 rounded-full border-2 border-gray-600 shadow-lg"
                style={{ backgroundColor: selectedColor }}
              />
              <p className="text-xs text-green-400 font-mono mt-1">{selectedColor.toUpperCase()}</p>
            </div>
          </div>
        </div>
      );
    }

    if (gameState === 'failed') {
      return (
        <div className="text-center bg-red-900/30 rounded-xl p-6 border border-red-500/30">
          <XCircle size={48} className="text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-red-400 mb-2">Que pena!</h3>
          <p className="text-red-300 text-sm mb-4">Não foi exata. Tente amanhã!</p>
          <div className="flex justify-center gap-3">
            <div className="text-center">
              <div className="text-xs text-red-400 mb-1">Alvo</div>
              <div 
                className="w-12 h-12 rounded-full border-2 border-gray-600 shadow-lg"
                style={{ backgroundColor: targetColor }}
              />
              <p className="text-xs text-red-400 font-mono mt-1">{targetColor.toUpperCase()}</p>
            </div>
            <div className="text-center">
              <div className="text-xs text-red-400 mb-1">Sua escolha</div>
              <div 
                className="w-12 h-12 rounded-full border-2 border-gray-600 shadow-lg"
                style={{ backgroundColor: selectedColor }}
              />
              <p className="text-xs text-red-400 font-mono mt-1">{selectedColor.toUpperCase()}</p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      {gameState === 'playing' && (
        <>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-4">Cor do Dia</h3>
            <div 
              className="w-24 h-24 rounded-2xl border-4 border-gray-600 shadow-lg mx-auto mb-4"
              style={{ backgroundColor: targetColor }}
            />
            <p className="text-xs text-gray-400">Reproduza esta cor exatamente</p>
          </div>

          <div className="border-t border-gray-600/30 pt-6">
            <h4 className="text-md font-semibold text-white mb-4 text-center">Sua Tentativa</h4>
            <div className="flex flex-col items-center space-y-3">
              <div 
                className="w-24 h-24 rounded-2xl border-4 border-gray-600 shadow-lg"
                style={{ backgroundColor: selectedColor }}
              />
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-16 h-8 border-2 border-gray-600 rounded-lg cursor-pointer bg-gray-700"
              />
              <p className="text-xs text-gray-400 font-mono">{selectedColor.toUpperCase()}</p>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            Confirmar Cor
          </button>
        </>
      )}

      {renderResult()}
    </div>
  );
};

export default ColorGame;