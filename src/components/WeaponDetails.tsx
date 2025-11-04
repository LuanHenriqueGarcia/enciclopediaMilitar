import { useState, useEffect } from 'react';
import { supabase, Weapon, WeaponSpec, WeaponHistory } from '../utils/supabase';
import { ArrowLeft } from 'lucide-react';

interface WeaponDetailsProps {
  weaponId: string;
  onBack: () => void;
}

function WeaponDetails({ weaponId, onBack }: WeaponDetailsProps) {
  const [weapon, setWeapon] = useState<Weapon | null>(null);
  const [specs, setSpecs] = useState<WeaponSpec | null>(null);
  const [history, setHistory] = useState<WeaponHistory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWeaponData = async () => {
      const { data: weaponData } = await supabase
        .from('weapons')
        .select('*')
        .eq('id', weaponId)
        .single();

      const { data: specsData } = await supabase
        .from('weapon_specs')
        .select('*')
        .eq('weapon_id', weaponId)
        .maybeSingle();

      const { data: historyData } = await supabase
        .from('weapon_history')
        .select('*')
        .eq('weapon_id', weaponId)
        .maybeSingle();

      if (weaponData) setWeapon(weaponData);
      if (specsData) setSpecs(specsData);
      if (historyData) setHistory(historyData);
      setLoading(false);
    };

    loadWeaponData();
  }, [weaponId]);

  if (loading) {
    return <div className="text-center text-white">Carregando...</div>;
  }

  if (!weapon) {
    return <div className="text-center text-white">Arma não encontrada</div>;
  }

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
      >
        <ArrowLeft size={20} />
        Voltar
      </button>

      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg overflow-hidden">
        <div className="h-64 bg-gradient-to-br from-blue-900/20 to-slate-900/20 flex items-center justify-center">
          <span className="text-blue-300 text-lg opacity-50">Visualização da Arma</span>
        </div>

        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{weapon.name}</h1>
              <p className="text-lg text-blue-300">{weapon.type}</p>
              <p className="text-slate-400 mt-2">
                Origem: {weapon.country} • Ano: {weapon.year_introduced}
              </p>
            </div>
          </div>

          <p className="text-slate-300 text-lg mb-8">{weapon.description}</p>

          {specs && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <div className="bg-slate-700/30 border border-blue-500/20 rounded p-4">
                <p className="text-blue-300 text-sm font-semibold mb-1">Calibre</p>
                <p className="text-white text-xl">{specs.caliber}</p>
              </div>
              <div className="bg-slate-700/30 border border-blue-500/20 rounded p-4">
                <p className="text-blue-300 text-sm font-semibold mb-1">Peso</p>
                <p className="text-white text-xl">{specs.weight} kg</p>
              </div>
              <div className="bg-slate-700/30 border border-blue-500/20 rounded p-4">
                <p className="text-blue-300 text-sm font-semibold mb-1">Comprimento</p>
                <p className="text-white text-xl">{specs.length} cm</p>
              </div>
              <div className="bg-slate-700/30 border border-blue-500/20 rounded p-4">
                <p className="text-blue-300 text-sm font-semibold mb-1">Alcance Efetivo</p>
                <p className="text-white text-xl">{specs.effective_range} m</p>
              </div>
              <div className="bg-slate-700/30 border border-blue-500/20 rounded p-4">
                <p className="text-blue-300 text-sm font-semibold mb-1">Taxa de Disparo</p>
                <p className="text-white text-xl">{specs.rate_of_fire} rpm</p>
              </div>
              <div className="bg-slate-700/30 border border-blue-500/20 rounded p-4">
                <p className="text-blue-300 text-sm font-semibold mb-1">Capacidade de Revista</p>
                <p className="text-white text-xl">{specs.magazine_capacity}</p>
              </div>
              <div className="bg-slate-700/30 border border-blue-500/20 rounded p-4">
                <p className="text-blue-300 text-sm font-semibold mb-1">Velocidade da Boca</p>
                <p className="text-white text-xl">{specs.muzzle_velocity} m/s</p>
              </div>
            </div>
          )}

          {history && (
            <div className="border-t border-blue-500/20 pt-6">
              <h2 className="text-2xl font-bold text-white mb-4">Contexto Histórico</h2>
              <div className="bg-slate-700/30 border border-blue-500/20 rounded p-4 space-y-3">
                <div>
                  <p className="text-blue-300 text-sm font-semibold">Era</p>
                  <p className="text-white">{history.era}</p>
                </div>
                <div>
                  <p className="text-blue-300 text-sm font-semibold">Conflitos</p>
                  <p className="text-white">{history.conflicts}</p>
                </div>
                <div>
                  <p className="text-blue-300 text-sm font-semibold">Notas</p>
                  <p className="text-white">{history.notes}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WeaponDetails;
