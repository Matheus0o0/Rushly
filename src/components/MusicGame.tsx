import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, XCircle } from 'lucide-react';
import { getDailyMusicSequence, hasPlayedToday, saveGameResult } from '../utils/gameUtils';

const MusicGame: React.FC = () => {
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameState, setGameState] = useState<'playing' | 'completed' | 'failed' | 'already-played'>('playing');
  const [hasPlayed, setHasPlayed] = useState(false);
  const [currentNote, setCurrentNote] = useState<number | null>(null);

  const notes = [
    { id: 0, name: 'C', frequency: 261.63, color: 'bg-red-400' },
    { id: 1, name: 'C#', frequency: 277.18, color: 'bg-red-500' },
    { id: 2, name: 'D', frequency: 293.66, color: 'bg-orange-400' },
    { id: 3, name: 'D#', frequency: 311.13, color: 'bg-orange-500' },
    { id: 4, name: 'E', frequency: 329.63, color: 'bg-yellow-400' },
    { id: 5, name: 'F', frequency: 349.23, color: 'bg-green-400' },
    { id: 6, name: 'F#', frequency: 369.99, color: 'bg-green-500' },
    { id: 7, name: 'G', frequency: 392.00, color: 'bg-blue-400' },
    { id: 8, name: 'A', frequency: 440.00, color: 'bg-indigo-400' },
    { id: 9, name: 'B', frequency: 493.88, color: 'bg-purple-400' },
  ];

  useEffect(() => {
    const dailySequence = getDailyMusicSequence();
    setSequence(dailySequence);
    
    const played = hasPlayedToday('music');
    setHasPlayed(played);
    if (played) {
      setGameState('already-played');
    }
  }, []);

  const playNote = (frequency: number) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const playSequence = async () => {
    if (isPlaying) return;
    
    setIsPlaying(true);
    for (let i = 0; i < sequence.length; i++) {
      const noteIndex = sequence[i];
      setCurrentNote(noteIndex);
      playNote(notes[noteIndex].frequency);
      await new Promise(resolve => setTimeout(resolve, 600));
      setCurrentNote(null);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    setIsPlaying(false);
  };

  const handleNoteClick = (noteIndex: number) => {
    if (hasPlayed || gameState !== 'playing' || isPlaying) return;

    playNote(notes[noteIndex].frequency);
    const newUserSequence = [...userSequence, noteIndex];
    setUserSequence(newUserSequence);

    // Check if the current note is correct
    if (newUserSequence[newUserSequence.length - 1] !== sequence[newUserSequence.length - 1]) {
      // Wrong note - game over
      saveGameResult('music', false);
      setGameState('failed');
      setHasPlayed(true);
      return;
    }

    // Check if sequence is complete
    if (newUserSequence.length === sequence.length) {
      saveGameResult('music', true);
      setGameState('completed');
      setHasPlayed(true);
    }
  };

  const renderResult = () => {
    if (gameState === 'already-played') {
      return (
        <div className="text-center bg-gray-800/50 rounded-xl p-6 border border-gray-600/30">
          <div className="text-4xl mb-3">⏰</div>
          <h3 className="text-lg font-bold text-white mb-2">Já jogou hoje!</h3>
          <p className="text-gray-300 text-sm">Volte amanhã para nova sequência.</p>
        </div>
      );
    }

    if (gameState === 'completed') {
      return (
        <div className="text-center bg-green-900/30 rounded-xl p-6 border border-green-500/30">
          <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-green-400 mb-2">Perfeito!</h3>
          <p className="text-green-300 text-sm">Sequência reproduzida corretamente!</p>
          <div className="mt-4">
            <p className="text-xs text-green-400 mb-2">Sequência correta:</p>
            <div className="flex justify-center gap-1">
              {sequence.map((noteIndex, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-full ${notes[noteIndex].color} flex items-center justify-center text-white font-bold text-xs`}
                >
                  {notes[noteIndex].name}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xs text-green-400 mb-2">Sua sequência:</p>
            <div className="flex justify-center gap-1">
              {userSequence.map((noteIndex, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-full ${notes[noteIndex].color} flex items-center justify-center text-white font-bold text-xs`}
                >
                  {notes[noteIndex].name}
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
          <p className="text-red-300 text-sm">Nota errada. Tente amanhã!</p>
          <div className="mt-4">
            <p className="text-xs text-red-400 mb-2">Sequência correta:</p>
            <div className="flex justify-center gap-1">
              {sequence.map((noteIndex, i) => (
                <div
                  key={i}
                  className={`w-6 h-6 rounded-full ${notes[noteIndex].color} flex items-center justify-center text-white font-bold text-xs`}
                >
                  {notes[noteIndex].name}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xs text-red-400 mb-2">Sua sequência:</p>
            <div className="flex justify-center gap-1">
            {userSequence.map((noteIndex, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-full ${notes[noteIndex].color} flex items-center justify-center text-white font-bold text-xs`}
              >
                {notes[noteIndex].name}
              </div>
            ))}
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
            <button
              onClick={playSequence}
              disabled={isPlaying}
              className={`flex items-center gap-2 mx-auto px-6 py-3 rounded-xl font-semibold transition-all ${
                isPlaying 
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 to-purple-500 text-white hover:from-purple-700 hover:to-purple-600 shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
              }`}
            >
              <Play size={16} />
              {isPlaying ? 'Tocando...' : 'Ouvir Sequência'}
            </button>
            <p className="text-xs text-gray-400 mt-2">
              {sequence.length} notas
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3 text-center">
              Clique nas notas na ordem correta
            </h4>
            <div className="grid grid-cols-5 gap-1 mb-4">
              {notes.map((note) => (
                <button
                  key={note.id}
                  onClick={() => handleNoteClick(note.id)}
                  disabled={isPlaying}
                  className={`aspect-square rounded-lg font-bold text-white text-xs transition-all hover:scale-105 active:scale-95 ${
                    currentNote === note.id ? 'scale-110 shadow-lg' : ''
                  } ${note.color} ${
                    isPlaying ? 'opacity-50 cursor-not-allowed' : 'shadow-md hover:shadow-lg border border-gray-600/30'
                  }`}
                >
                  {note.name}
                </button>
              ))}
            </div>

            {userSequence.length > 0 && (
              <div className="text-center">
                <p className="text-xs text-gray-400 mb-2">Sua sequência:</p>
                <div className="flex justify-center gap-1">
                  {userSequence.map((noteIndex, i) => (
                    <div
                      key={i}
                      className={`w-6 h-6 rounded-full ${notes[noteIndex].color} flex items-center justify-center text-white font-bold text-xs`}
                    >
                      {notes[noteIndex].name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {renderResult()}
    </div>
  );
};

export default MusicGame;