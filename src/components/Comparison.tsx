import { useState, useEffect } from 'react';
import { supabase, Weapon, WeaponSpec } from '../utils/supabase';
import { ArrowLeft, X } from 'lucide-react';

interface ComparisonProps {
  baseWeaponId: string | null;
  onBack: () => void;
}

function Comparison({ baseWeaponId, onBack }: ComparisonProps) {
  const [allWeapons, setAllWeapons] = useState<Weapon[]>([]);
  const [selectedWeapons, setSelectedWeapons] = useState<string[]>(baseWeaponId ? [baseWeaponId] : []);
  const [specs, setSpecs] = useState<Map<string, WeaponSpec>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const { data: weaponsData } = await supabase.from('weapons').select('*').order('name');
      if (weaponsData) {
        setAllWeapons(weaponsData);
      }
      setLoading(false);
    };

    loadData();
  }, []);

  useEffect(() => {
    const loadSpecs = async () => {
      for (const weaponId of selectedWeapons) {
        const { data } = await supabase
          .from('weapon_specs')
          .select('*')
          .eq('weapon_id', weaponId)
          .maybeSingle();

        if (data) {
          setSpecs((prev) => new Map(prev).set(weaponId, data));
        }
      }
    };

    loadSpecs();
  }, [selectedWeapons]);

  const handleSelectWeapon = (weaponId: string) => {
    if (selectedWeapons.includes(weaponId)) {
      setSelectedWeapons(selectedWeapons.filter((id) => id !== weaponId));
    } else if (selectedWeapons.length < 4) {
      setSelectedWeapons([...selectedWeapons, weaponId]);
    }
  };

  if (loading) {
    return <div className="text-center text-white">Carregando...</div>;
  }

  const selectedWeaponData = allWeapons.filter((w) => selectedWeapons.includes(w.id));
  const specsList = selectedWeapons.map((id) => specs.get(id)).filter(Boolean);

  const specs_fields = [
    { label: 'Calibre', key: 'caliber' as keyof WeaponSpec },
    { label: 'Peso (kg)', key: 'weight' as keyof WeaponSpec },
    { label: 'Comprimento (cm)', key: 'length' as keyof WeaponSpec },
    { label: 'Alcance Efetivo (m)', key: 'effective_range' as keyof WeaponSpec },
    { label: 'Taxa de Disparo (rpm)', key: 'rate_of_fire' as keyof WeaponSpec },
    { label: 'Capacidade de Revista', key: 'magazine_capacity' as keyof WeaponSpec },
    { label: 'Velocidade da Boca (m/s)', key: 'muzzle_velocity' as keyof WeaponSpec },
  ];

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
      >
        <ArrowLeft size={20} />
        Voltar
      </button>

      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Comparar Armas</h2>
        <p className="text-blue-200 mb-4">Selecione até 4 armas para comparar especificações</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {allWeapons.map((weapon) => (
            <button
              key={weapon.id}
              onClick={() => handleSelectWeapon(weapon.id)}
              className={`p-3 rounded border transition-all text-left ${
                selectedWeapons.includes(weapon.id)
                  ? 'bg-blue-600 border-blue-400 text-white'
                  : 'bg-slate-700/30 border-blue-500/30 text-slate-300 hover:border-blue-500/60'
              } ${selectedWeapons.length >= 4 && !selectedWeapons.includes(weapon.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={selectedWeapons.length >= 4 && !selectedWeapons.includes(weapon.id)}
            >
              <p className="font-semibold">{weapon.name}</p>
              <p className="text-xs opacity-75">{weapon.country}</p>
            </button>
          ))}
        </div>
      </div>

      {selectedWeaponData.length > 0 && (
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-blue-500/20 rounded-lg overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-blue-500/20">
                <th className="px-6 py-4 text-left text-white font-bold sticky left-0 bg-slate-900/50">
                  Especificação
                </th>
                {selectedWeaponData.map((weapon) => (
                  <th key={weapon.id} className="px-6 py-4 text-left text-white font-bold min-w-max">
                    <div className="flex items-center justify-between gap-2">
                      <span>{weapon.name}</span>
                      <button
                        onClick={() =>
                          setSelectedWeapons(selectedWeapons.filter((id) => id !== weapon.id))
                        }
                        className="text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {specs_fields.map((field) => (
                <tr key={field.key} className="border-b border-blue-500/10 hover:bg-blue-500/5">
                  <td className="px-6 py-4 text-blue-300 font-semibold sticky left-0 bg-slate-900/50">
                    {field.label}
                  </td>
                  {specsList.map((spec, index) => (
                    <td key={index} className="px-6 py-4 text-white">
                      {spec && spec[field.key] !== null && spec[field.key] !== undefined
                        ? String(spec[field.key])
                        : '-'}
                    </td>
                  ))}
                </tr>
              ))}

              <tr className="border-b border-blue-500/10">
                <td className="px-6 py-4 text-blue-300 font-semibold sticky left-0 bg-slate-900/50">
                  Ano de Introdução
                </td>
                {selectedWeaponData.map((weapon) => (
                  <td key={weapon.id} className="px-6 py-4 text-white">
                    {weapon.year_introduced}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="px-6 py-4 text-blue-300 font-semibold sticky left-0 bg-slate-900/50">
                  País
                </td>
                {selectedWeaponData.map((weapon) => (
                  <td key={weapon.id} className="px-6 py-4 text-white">
                    {weapon.country}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {selectedWeaponData.length === 0 && (
        <div className="text-center text-blue-200 py-12">
          Selecione armas para começar a comparação
        </div>
      )}
    </div>
  );
}

export default Comparison;
