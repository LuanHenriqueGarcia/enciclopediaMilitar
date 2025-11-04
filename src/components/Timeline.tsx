import { useState, useEffect } from 'react';
import { supabase, Weapon } from '../utils/supabase';

function Timeline() {
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWeapons = async () => {
      const { data, error } = await supabase
        .from('weapons')
        .select('*')
        .order('year_introduced');
      if (!error && data) {
        setWeapons(data);
      }
      setLoading(false);
    };

    loadWeapons();
  }, []);

  if (loading) {
    return <div className="text-center text-white">Carregando linha do tempo...</div>;
  }

  const eras = [
    { name: 'Século XIX', range: [1800, 1900] },
    { name: 'Primeira Metade do Século XX', range: [1900, 1950] },
    { name: 'Segunda Metade do Século XX', range: [1950, 2000] },
    { name: 'Século XXI', range: [2000, 2100] },
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-white mb-8">Evolução Histórica das Armas</h2>

      {eras.map((era) => {
        const eraWeapons = weapons.filter(
          (w) => w.year_introduced >= era.range[0] && w.year_introduced < era.range[1]
        );

        if (eraWeapons.length === 0) return null;

        return (
          <div key={era.name}>
            <h3 className="text-2xl font-bold text-blue-300 mb-4">{era.name}</h3>

            <div className="relative space-y-4">
              <div className="absolute left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-slate-600"></div>

              {eraWeapons.map((weapon, index) => (
                <div key={weapon.id} className="pl-16">
                  <div className="absolute left-0 w-10 h-10 bg-blue-600 rounded-full border-4 border-slate-900 flex items-center justify-center">
                    <div className="w-3 h-3 bg-blue-300 rounded-full"></div>
                  </div>

                  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg p-4 hover:border-blue-500/50 transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-blue-400 font-semibold mb-1">{weapon.year_introduced}</p>
                        <h4 className="text-lg font-bold text-white mb-1">{weapon.name}</h4>
                        <p className="text-sm text-blue-200 mb-2">
                          {weapon.type} • {weapon.country}
                        </p>
                        <p className="text-sm text-slate-300">{weapon.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Timeline;
