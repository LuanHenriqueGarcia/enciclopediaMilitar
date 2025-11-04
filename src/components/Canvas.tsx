import { useEffect, useRef } from 'react';
import { TrajectoryPoint } from '../utils/physics';

interface CanvasProps {
  trajectory: TrajectoryPoint[];
  currentTime: number;
  maxRange: number;
  maxHeight: number;
  initialHeight: number;
}

function Canvas({ trajectory, currentTime, maxRange, maxHeight, initialHeight }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 60;

    ctx.clearRect(0, 0, width, height);

    const scaleX = (width - 2 * padding) / maxRange;
    const scaleY = (height - 2 * padding) / maxHeight;

    const toCanvasX = (x: number) => padding + x * scaleX;
    const toCanvasY = (y: number) => height - padding - y * scaleY;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 10; i++) {
      const x = padding + (i / 10) * (width - 2 * padding);
      ctx.beginPath();
      ctx.moveTo(x, padding);
      ctx.lineTo(x, height - padding);
      ctx.stroke();

      const y = padding + (i / 10) * (height - 2 * padding);
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.lineTo(width - padding, padding);
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    for (let i = 0; i <= 5; i++) {
      const distance = (maxRange / 5) * i;
      const x = toCanvasX(distance);
      ctx.fillText(`${distance.toFixed(0)}m`, x, height - padding + 20);
    }

    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
      const h = (maxHeight / 5) * i;
      const y = toCanvasY(h);
      ctx.fillText(`${h.toFixed(0)}m`, padding - 10, y + 4);
    }

    ctx.strokeStyle = 'rgba(100, 200, 255, 0.6)';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    trajectory.forEach((point, index) => {
      const x = toCanvasX(point.x);
      const y = toCanvasY(point.y);
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
    ctx.setLineDash([]);

    const currentIndex = trajectory.findIndex((p) => p.t >= currentTime);
    if (currentIndex > 0) {
      ctx.strokeStyle = 'rgba(59, 130, 246, 1)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let i = 0; i <= currentIndex; i++) {
        const point = trajectory[i];
        const x = toCanvasX(point.x);
        const y = toCanvasY(point.y);
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }

    if (currentIndex >= 0) {
      const t1 = trajectory[currentIndex - 1] || trajectory[0];
      const t2 = trajectory[currentIndex] || trajectory[trajectory.length - 1];
      const ratio = t2.t !== t1.t ? (currentTime - t1.t) / (t2.t - t1.t) : 0;
      const currentX = t1.x + (t2.x - t1.x) * ratio;
      const currentY = t1.y + (t2.y - t1.y) * ratio;

      const cx = toCanvasX(currentX);
      const cy = toCanvasY(currentY);

      ctx.shadowColor = 'rgba(255, 100, 100, 0.8)';
      ctx.shadowBlur = 20;
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = 'rgba(255, 100, 100, 0.5)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx, height - padding);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(padding, cy);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = 'white';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`x: ${currentX.toFixed(1)}m`, cx + 15, cy - 10);
      ctx.fillText(`y: ${currentY.toFixed(1)}m`, cx + 15, cy + 10);
    }

    if (initialHeight > 0) {
      ctx.fillStyle = 'rgba(100, 100, 100, 0.5)';
      ctx.fillRect(
        padding - 20,
        toCanvasY(initialHeight),
        20,
        height - padding - toCanvasY(initialHeight)
      );
    }
  }, [trajectory, currentTime, maxRange, maxHeight, initialHeight]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={500}
      className="w-full h-full"
      style={{ maxHeight: '500px' }}
    />
  );
}

export default Canvas;
