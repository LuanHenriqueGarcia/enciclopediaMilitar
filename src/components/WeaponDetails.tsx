import { useState, useEffect } from 'react';
import { supabase, Weapon, WeaponSpec, WeaponHistory } from '../utils/supabase';
import { ArrowLeft, Flame, Wrench } from 'lucide-react';
import BallisticTrajectory from './BallisticTrajectory';
import MaintenanceGuide from './MaintenanceGuide';

interface TrajectoryData {
  distances: number[];
  drops: number[];
  moaAdjustments: Record<string, number>;
  windDrift: number;
  timeToTarget: number;
}

interface MaintenanceGuideData {
  id: string;
  title: string;
  description: string;
  steps: Array<{ step: string }>;
  tools_required: string[];
  frequency: string;
  difficulty_level: string;
}

interface WeaponDetailsProps {
  weaponId: string;
  onBack: () => void;
}

function WeaponDetails({ weaponId, onBack }: WeaponDetailsProps) {
  const [weapon, setWeapon] = useState<Weapon | null>(null);
  const [specs, setSpecs] = useState<WeaponSpec | null>(null);
  const [history, setHistory] = useState<WeaponHistory | null>(null);
  const [trajectory, setTrajectory] = useState<TrajectoryData | null>(null);
  const [maintenanceGuides, setMaintenanceGuides] = useState<MaintenanceGuideData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'ballistics' | 'maintenance'>('overview');

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

      const { data: trajectoryData } = await supabase
        .from('ballistic_trajectories')
        .select('*')
        .eq('weapon_id', weaponId)
        .maybeSingle();

      const { data: maintenanceData } = await supabase
        .from('maintenance_guides')
        .select('*')
        .eq('weapon_id', weaponId);

      if (weaponData) setWeapon(weaponData);
      if (specsData) setSpecs(specsData);
      if (historyData) setHistory(historyData);

      if (trajectoryData) {
        setTrajectory({
          distances: trajectoryData.distance_meters || [],
          drops: trajectoryData.drop_inches || [],
          moaAdjustments: trajectoryData.moa_adjustments || {},
          windDrift: trajectoryData.wind_drift || 0,
          timeToTarget: trajectoryData.time_to_target || 0,
        });
      }

      if (maintenanceData) {
        setMaintenanceGuides(
          maintenanceData.map((guide: any) => ({
            id: guide.id,
            title: guide.title,
            description: guide.description,
            steps: (guide.steps || []).map((step: any) => ({
              step: typeof step === 'string' ? step : step.step || '',
            })),
            tools_required: guide.tools_required || [],
            frequency: guide.frequency,
            difficulty_level: guide.difficulty_level,
          }))
        );
      }

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

          <div className="flex gap-2 border-b border-blue-500/20 mb-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-white'
                  : 'border-transparent text-blue-300 hover:text-white'
              }`}
            >
              Visão Geral
            </button>
            {trajectory && (
              <button
                onClick={() => setActiveTab('ballistics')}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
                  activeTab === 'ballistics'
                    ? 'border-blue-500 text-white'
                    : 'border-transparent text-blue-300 hover:text-white'
                }`}
              >
                <Flame size={18} />
                Balística
              </button>
            )}
            {maintenanceGuides.length > 0 && (
              <button
                onClick={() => setActiveTab('maintenance')}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
                  activeTab === 'maintenance'
                    ? 'border-blue-500 text-white'
                    : 'border-transparent text-blue-300 hover:text-white'
                }`}
              >
                <Wrench size={18} />
                Manutenção
              </button>
            )}
          </div>

          {activeTab === 'overview' && (
            <>
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
            </>
          )}

          {activeTab === 'ballistics' && trajectory && (
            <div className="py-6">
              <BallisticTrajectory data={trajectory} weaponName={weapon.name} />
            </div>
          )}

          {activeTab === 'maintenance' && maintenanceGuides.length > 0 && (
            <div className="py-6">
              <MaintenanceGuide guides={maintenanceGuides} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WeaponDetails;
