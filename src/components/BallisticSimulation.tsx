import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import Canvas from './Canvas';
import ControlPanel from './ControlPanel';
import { calculateTrajectory, SimulationParams, TrajectoryPoint } from '../utils/physics';

function BallisticSimulation() {
  const [params, setParams] = useState<SimulationParams>({
    velocity: 50,
    angle: 45,
    height: 0,
    gravity: 9.81,
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [trajectory, setTrajectory] = useState<TrajectoryPoint[]>([]);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const newTrajectory = calculateTrajectory(params);
    setTrajectory(newTrajectory);
    setCurrentTime(0);
  }, [params]);

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = performance.now();

      const animate = (timestamp: number) => {
        const deltaTime = (timestamp - lastTimeRef.current) / 1000;
        lastTimeRef.current = timestamp;

        setCurrentTime((prevTime) => {
          const newTime = prevTime + deltaTime;
          const maxTime = trajectory[trajectory.length - 1]?.t || 0;

          if (newTime >= maxTime) {
            setIsPlaying(false);
            return maxTime;
          }

          return newTime;
        });

        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, trajectory]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const maxRange = trajectory[trajectory.length - 1]?.x || 100;
  const maxHeight = Math.max(...trajectory.map(p => p.y), params.height) || 50;

  return (
    <div className="min-h-screen flex flex-col p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Simulação de Queda Balística
        </h1>
        <p className="text-blue-200">
          Ajuste os parâmetros e observe a trajetória do projétil
        </p>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
          <Canvas
            trajectory={trajectory}
            currentTime={currentTime}
            maxRange={maxRange}
            maxHeight={maxHeight}
            initialHeight={params.height}
          />
        </div>

        <div className="lg:w-96">
          <ControlPanel params={params} setParams={setParams} trajectory={trajectory} />
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={handlePlayPause}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-lg"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          {isPlaying ? 'Pausar' : 'Iniciar'}
        </button>
        <button
          onClick={handleReset}
          className="bg-slate-600 hover:bg-slate-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-lg"
        >
          <RotateCcw size={20} />
          Reiniciar
        </button>
      </div>
    </div>
  );
}

export default BallisticSimulation;
