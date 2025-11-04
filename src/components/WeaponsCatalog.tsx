import { useState, useEffect } from 'react';
import { supabase, Weapon } from '../utils/supabase';
import { Search, Info, GitCompare } from 'lucide-react';

interface WeaponsCatalogProps {
  onSelectWeapon: (weaponId: string) => void;
  onCompare: (weaponId: string) => void;
}

function WeaponsCatalog({ onSelectWeapon, onCompare }: WeaponsCatalogProps) {
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');

  useEffect(() => {
    const loadWeapons = async () => {
      const { data, error } = await supabase.from('weapons').select('*').order('year_introduced');
      if (!error && data) {
        setWeapons(data);
      }
      setLoading(false);
    };

    loadWeapons();
  }, []);

  const types = Array.from(new Set(weapons.map((w) => w.type)));
  const countries = Array.from(new Set(weapons.map((w) => w.country)));

  const filteredWeapons = weapons.filter((weapon) => {
    const matchesSearch =
      weapon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      weapon.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || weapon.type === selectedType;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return <div className="text-center text-white">Carregando armas...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-blue-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nome ou país..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-700/50 border border-blue-500/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-2 bg-slate-700/50 border border-blue-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os Tipos</option>
          {types.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWeapons.map((weapon) => (
          <div
            key={weapon.id}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg overflow-hidden hover:border-blue-500/50 transition-all group"
          >
            <div className="h-48 bg-gradient-to-br from-blue-900/20 to-slate-900/20 flex items-center justify-center border-b border-blue-500/20">
              <div className="w-full h-full bg-gradient-to-br from-blue-600/10 to-slate-600/10 flex items-center justify-center">
                <span className="text-blue-300 text-sm opacity-50">Arma Militar</span>
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                {weapon.name}
              </h3>
              <p className="text-sm text-blue-200 mb-2">{weapon.type}</p>
              <p className="text-xs text-slate-400 mb-3">
                {weapon.country} • {weapon.year_introduced}
              </p>
              <p className="text-sm text-slate-300 mb-4 line-clamp-2">{weapon.description}</p>

              <div className="flex gap-2">
                <button
                  onClick={() => onSelectWeapon(weapon.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded transition-colors text-sm font-medium"
                >
                  <Info size={16} />
                  Detalhes
                </button>
                <button
                  onClick={() => onCompare(weapon.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded transition-colors text-sm font-medium"
                >
                  <GitCompare size={16} />
                  Comparar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredWeapons.length === 0 && (
        <div className="text-center py-12">
          <p className="text-blue-200">Nenhuma arma encontrada com esses critérios.</p>
        </div>
      )}
    </div>
  );
}

export default WeaponsCatalog;
