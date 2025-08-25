import React from 'react';
import { Calendar, Target, Music, Type, Clock, Trophy, Zap } from 'lucide-react';
import ColorGame from './components/ColorGame';
import MusicGame from './components/MusicGame';
import WordGame from './components/WordGame';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-blue-900">
      {/* Header */}
      <header className="bg-black/40 backdrop-blur-lg border-b border-gray-700/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-3">
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Rushly</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Três desafios únicos que testam suas habilidades. Uma chance por dia, resultados únicos.
            </p>
          </div>
        </div>
      </header>

      {/* How it Works Section */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-gray-800/50 to-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-700/30">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Como Funciona</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-400/30 group-hover:scale-110 transition-transform duration-300">
                <Clock size={24} className="text-blue-400" />
              </div>
              <h3 className="font-bold text-white mb-3 text-lg">Desafios Diários</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Novos desafios únicos todos os dias às 00:00. Cada dia traz uma experiência completamente diferente.
              </p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-purple-400/30 group-hover:scale-110 transition-transform duration-300">
                <Zap size={24} className="text-purple-400" />
              </div>
              <h3 className="font-bold text-white mb-3 text-lg">Uma Tentativa</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Apenas uma chance por jogo por dia. Concentre-se, pense bem e dê o seu melhor em cada tentativa.
              </p>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-green-400/30 group-hover:scale-110 transition-transform duration-300">
                <Trophy size={24} className="text-green-400" />
              </div>
              <h3 className="font-bold text-white mb-3 text-lg">Desafio Global</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Todos os jogadores enfrentam exatamente os mesmos desafios. Compare seus resultados com amigos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Games Section */}
      <main className="max-w-4xl mx-auto px-4 pb-12 space-y-8">
        {/* Color Game */}
        <div className="bg-gradient-to-r from-gray-800/60 to-slate-800/60 backdrop-blur-sm rounded-3xl overflow-hidden border border-gray-700/30 shadow-2xl">
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Target size={28} />
              <h2 className="text-2xl font-bold">Adivinhe a Cor</h2>
            </div>
            <p className="text-blue-100 opacity-90">Reproduza a cor exata usando o seletor. Precisão é fundamental.</p>
          </div>
          <div className="p-8">
            <ColorGame />
          </div>
        </div>

        {/* Music Game */}
        <div className="bg-gradient-to-r from-gray-800/60 to-slate-800/60 backdrop-blur-sm rounded-3xl overflow-hidden border border-gray-700/30 shadow-2xl">
          <div className="bg-gradient-to-r from-purple-600 to-purple-500 p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Music size={28} />
              <h2 className="text-2xl font-bold">Memória Musical</h2>
            </div>
            <p className="text-purple-100 opacity-90">Memorize e reproduza a sequência de notas na ordem exata.</p>
          </div>
          <div className="p-8">
            <MusicGame />
          </div>
        </div>

        {/* Word Game */}
        <div className="bg-gradient-to-r from-gray-800/60 to-slate-800/60 backdrop-blur-sm rounded-3xl overflow-hidden border border-gray-700/30 shadow-2xl">
          <div className="bg-gradient-to-r from-green-600 to-green-500 p-6 text-white">
            <div className="flex items-center gap-3 mb-2">
              <Type size={28} />
              <h2 className="text-2xl font-bold">Palavras Coloridas</h2>
            </div>
            <p className="text-green-100 opacity-90">Identifique a cor do texto, não o que a palavra significa.</p>
          </div>
          <div className="p-8">
            <WordGame />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-sm border-t border-gray-700/30 py-8">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            Desafie sua mente todos os dias. Volte amanhã para novos jogos.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;