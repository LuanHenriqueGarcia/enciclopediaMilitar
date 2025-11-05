import { useEffect, useRef } from 'react';

interface TrajectoryData {
  distances: number[];
  drops: number[];
  moaAdjustments: Record<string, number>;
  windDrift: number;
  timeToTarget: number;
}

interface BallisticTrajectoryProps {
  data: TrajectoryData;
  weaponName: string;
}

function BallisticTrajectory({ data, weaponName }: BallisticTrajectoryProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const padding = 40;
    const width = canvas.width - padding * 2;
    const height = canvas.height - padding * 2;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 10; i++) {
      const x = padding + (width / 10) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, canvas.height - padding);
      ctx.stroke();

      const y = padding + (height / 10) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(canvas.width - padding, y);
      ctx.stroke();
    }

    const maxDistance = Math.max(...data.distances);
    const minDrop = Math.min(...data.drops);

    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();

    data.distances.forEach((distance, index) => {
      const x = padding + (distance / maxDistance) * width;
      const drop = data.drops[index];
      const y = padding + height - ((drop - minDrop) / (0 - minDrop)) * height;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    ctx.fillStyle = '#60a5fa';
    data.distances.forEach((distance, index) => {
      const x = padding + (distance / maxDistance) * width;
      const drop = data.drops[index];
      const y = padding + height - ((drop - minDrop) / (0 - minDrop)) * height;

      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = '#e0e7ff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    for (let i = 0; i <= 10; i++) {
      const x = padding + (width / 10) * i;
      const distance = (maxDistance / 10) * i;
      ctx.fillText(`${Math.round(distance)}m`, x, canvas.height - padding + 20);
    }

    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let i = 0; i <= 10; i++) {
      const y = padding + (height / 10) * i;
      const drop = minDrop + ((0 - minDrop) / 10) * (10 - i);
      ctx.fillText(`${Math.round(drop)}"`, padding - 10, y);
    }

    ctx.fillStyle = '#93c5fd';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('Distância (metros)', padding, 10);

    ctx.save();
    ctx.translate(15, padding + height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Queda (polegadas)', 0, 0);
    ctx.restore();
  }, [data]);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white">Trajetória Balística - {weaponName}</h3>

      <div className="bg-slate-800/30 border border-blue-500/20 rounded-lg p-4 overflow-x-auto">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="w-full bg-slate-900 rounded"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-700/30 border border-blue-500/20 rounded p-3">
          <p className="text-blue-300 text-xs font-semibold mb-1">Alcance Máximo</p>
          <p className="text-white text-lg font-bold">{Math.max(...data.distances)} m</p>
        </div>
        <div className="bg-slate-700/30 border border-blue-500/20 rounded p-3">
          <p className="text-blue-300 text-xs font-semibold mb-1">Queda Máxima</p>
          <p className="text-white text-lg font-bold">{Math.abs(Math.min(...data.drops)).toFixed(1)}"</p>
        </div>
        <div className="bg-slate-700/30 border border-blue-500/20 rounded p-3">
          <p className="text-blue-300 text-xs font-semibold mb-1">Desvio por Vento</p>
          <p className="text-white text-lg font-bold">{data.windDrift.toFixed(2)}"</p>
        </div>
        <div className="bg-slate-700/30 border border-blue-500/20 rounded p-3">
          <p className="text-blue-300 text-xs font-semibold mb-1">Tempo no Ar (100m)</p>
          <p className="text-white text-lg font-bold">{data.timeToTarget.toFixed(3)}s</p>
        </div>
      </div>

      <div className="bg-slate-700/30 border border-blue-500/20 rounded p-4">
        <h4 className="text-white font-bold mb-3">Ajustes de MOA por Distância</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(data.moaAdjustments).map(([distance, moa]) => (
            <div key={distance} className="bg-slate-800/50 rounded p-2 text-center">
              <p className="text-blue-300 text-xs">{distance}</p>
              <p className="text-white font-semibold">{moa} MOA</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded p-4">
        <p className="text-blue-200 text-sm">
          Dados educacionais. Esta trajetória é uma representação visual dos padrões de queda de bala
          baseados em especificações de fabricante. Fatores como vento, temperatura e umidade podem
          afetar significativamente os resultados reais.
        </p>
      </div>
    </div>
  );
}

export default BallisticTrajectory;
