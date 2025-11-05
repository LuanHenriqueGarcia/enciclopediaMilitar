export interface SimulationParams {
  velocity: number;
  angle: number;
  height: number;
  gravity: number;
}

export interface TrajectoryPoint {
  t: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  distance?: number;
  drop?: number;
}

export interface BallisticTrajectoryPoint {
  distance: number;
  drop: number;
  drop_inches: number;
  moa: number;
}

export function calculateTrajectory(params: SimulationParams): TrajectoryPoint[] {
  const { velocity, angle, height, gravity } = params;
  const angleRad = (angle * Math.PI) / 180;

  const vx = velocity * Math.cos(angleRad);
  const vy = velocity * Math.sin(angleRad);

  const timeStep = 0.02;
  const trajectory: TrajectoryPoint[] = [];

  let t = 0;
  let y = height;

  while (y >= 0) {
    const x = vx * t;
    y = height + vy * t - 0.5 * gravity * t * t;

    if (y < 0) y = 0;

    trajectory.push({
      t,
      x,
      y,
      vx,
      vy: vy - gravity * t,
    });

    if (y === 0 && t > 0) break;

    t += timeStep;

    if (t > 100) break;
  }

  return trajectory;
}

export function convertDropToMOA(dropInches: number, distanceMeters: number): number {
  const distanceInches = distanceMeters * 39.37;
  return (dropInches / distanceInches) * 2.909;
}
