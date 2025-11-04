import { useState } from 'react';
import { Target, Globe, Book, GitCompare } from 'lucide-react';
import WeaponsCatalog from './components/WeaponsCatalog';
import Timeline from './components/Timeline';
import WeaponDetails from './components/WeaponDetails';
import Comparison from './components/Comparison';

type View = 'catalog' | 'timeline' | 'details' | 'comparison';

function App() {
  const [currentView, setCurrentView] = useState<View>('catalog');
  const [selectedWeapon, setSelectedWeapon] = useState<string | null>(null);

  const handleSelectWeapon = (weaponId: string) => {
    setSelectedWeapon(weaponId);
    setCurrentView('details');
  };

  const handleCompare = (weaponId: string) => {
    setSelectedWeapon(weaponId);
    setCurrentView('comparison');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-black/40 backdrop-blur-md border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-8 h-8 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">Enciclopédia Militar</h1>
          </div>
          <p className="text-blue-200">Conhecimento educacional sobre história e especificações de armas militares</p>
        </div>
      </header>

      <nav className="bg-slate-800/50 backdrop-blur-sm border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 py-4">
            <button
              onClick={() => setCurrentView('catalog')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                currentView === 'catalog'
                  ? 'bg-blue-600 text-white'
                  : 'text-blue-200 hover:bg-slate-700'
              }`}
            >
              <Book size={18} />
              Catálogo
            </button>
            <button
              onClick={() => setCurrentView('timeline')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                currentView === 'timeline'
                  ? 'bg-blue-600 text-white'
                  : 'text-blue-200 hover:bg-slate-700'
              }`}
            >
              <Globe size={18} />
              Linha do Tempo
            </button>
            <button
              onClick={() => setCurrentView('comparison')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                currentView === 'comparison'
                  ? 'bg-blue-600 text-white'
                  : 'text-blue-200 hover:bg-slate-700'
              }`}
            >
              <GitCompare size={18} />
              Comparação
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {currentView === 'catalog' && (
          <WeaponsCatalog onSelectWeapon={handleSelectWeapon} onCompare={handleCompare} />
        )}
        {currentView === 'timeline' && <Timeline />}
        {currentView === 'details' && selectedWeapon && (
          <WeaponDetails weaponId={selectedWeapon} onBack={() => setCurrentView('catalog')} />
        )}
        {currentView === 'comparison' && (
          <Comparison
            baseWeaponId={selectedWeapon}
            onBack={() => setCurrentView('catalog')}
          />
        )}
      </main>
    </div>
  );
}

export default App;
