import { SimulationParams, TrajectoryPoint } from '../utils/physics';

interface ControlPanelProps {
  params: SimulationParams;
  setParams: (params: SimulationParams) => void;
  trajectory: TrajectoryPoint[];
}

function ControlPanel({ params, setParams, trajectory }: ControlPanelProps) {
  const handleChange = (key: keyof SimulationParams, value: number) => {
    setParams({ ...params, [key]: value });
  };

  const maxRange = trajectory[trajectory.length - 1]?.x || 0;
  const maxHeight = Math.max(...trajectory.map(p => p.y), params.height) || 0;
  const flightTime = trajectory[trajectory.length - 1]?.t || 0;

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Parâmetros</h2>

      <div>
        <label className="block text-white font-semibold mb-2">
          Velocidade Inicial: {params.velocity} m/s
        </label>
        <input
          type="range"
          min="10"
          max="100"
          step="1"
          value={params.velocity}
          onChange={(e) => handleChange('velocity', parseFloat(e.target.value))}
          className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-white font-semibold mb-2">
          Ângulo: {params.angle}°
        </label>
        <input
          type="range"
          min="0"
          max="90"
          step="1"
          value={params.angle}
          onChange={(e) => handleChange('angle', parseFloat(e.target.value))}
          className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-white font-semibold mb-2">
          Altura Inicial: {params.height} m
        </label>
        <input
          type="range"
          min="0"
          max="50"
          step="1"
          value={params.height}
          onChange={(e) => handleChange('height', parseFloat(e.target.value))}
          className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div>
        <label className="block text-white font-semibold mb-2">
          Gravidade: {params.gravity} m/s²
        </label>
        <input
          type="range"
          min="1"
          max="20"
          step="0.1"
          value={params.gravity}
          onChange={(e) => handleChange('gravity', parseFloat(e.target.value))}
          className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-blue-200 mt-1">
          <span>Lua (1.6)</span>
          <span>Terra (9.81)</span>
          <span>Júpiter (24.8)</span>
        </div>
      </div>

      <div className="border-t border-white/20 pt-4 mt-6">
        <h3 className="text-xl font-bold text-white mb-3">Resultados</h3>
        <div className="space-y-2 text-white">
          <div className="flex justify-between">
            <span className="text-blue-200">Alcance Máximo:</span>
            <span className="font-semibold">{maxRange.toFixed(2)} m</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-200">Altura Máxima:</span>
            <span className="font-semibold">{maxHeight.toFixed(2)} m</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-200">Tempo de Voo:</span>
            <span className="font-semibold">{flightTime.toFixed(2)} s</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;
