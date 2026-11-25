export function calculateKinematics(u: number, a: number, t: number) {
  const time = Math.max(0, t);
  const finalVelocity = u + a * time;
  const displacement = u * time + 0.5 * a * time * time;
  const averageVelocity = (u + finalVelocity) / 2;
  return { finalVelocity, displacement, averageVelocity };
}

export function solveSpeedDistanceTime(
  solveFor: 'speed' | 'distance' | 'time',
  speedMps: number,
  distanceM: number,
  timeS: number
) {
  if (solveFor === 'speed') {
    if (timeS <= 0) throw new Error('Time must be greater than zero.');
    return { speedMps: distanceM / timeS, distanceM, timeS };
  }
  if (solveFor === 'distance') {
    return { speedMps, distanceM: speedMps * timeS, timeS };
  }
  if (speedMps <= 0) throw new Error('Speed must be greater than zero.');
  return { speedMps, distanceM, timeS: distanceM / speedMps };
}

export function solveForce(
  solveFor: 'force' | 'mass' | 'acceleration',
  forceN: number,
  massKg: number,
  accelMs2: number
) {
  if (solveFor === 'force') {
    return { forceN: massKg * accelMs2, massKg, accelMs2 };
  }
  if (solveFor === 'mass') {
    if (accelMs2 === 0) throw new Error('Acceleration cannot be zero when solving for mass.');
    return { forceN, massKg: forceN / accelMs2, accelMs2 };
  }
  if (massKg <= 0) throw new Error('Mass must be greater than zero.');
  return { forceN, massKg, accelMs2: forceN / massKg };
}

export function solveDensity(
  solveFor: 'density' | 'mass' | 'volume',
  densityKgM3: number,
  massKg: number,
  volumeM3: number
) {
  if (solveFor === 'density') {
    if (volumeM3 <= 0) throw new Error('Volume must be greater than zero.');
    return { densityKgM3: massKg / volumeM3, massKg, volumeM3 };
  }
  if (solveFor === 'mass') {
    return { densityKgM3, massKg: densityKgM3 * volumeM3, volumeM3 };
  }
  if (densityKgM3 <= 0) throw new Error('Density must be greater than zero.');
  return { densityKgM3, massKg, volumeM3: massKg / densityKgM3 };
}

export function solvePressure(
  solveFor: 'pressure' | 'force' | 'area',
  pressurePa: number,
  forceN: number,
  areaM2: number
) {
  if (solveFor === 'pressure') {
    if (areaM2 <= 0) throw new Error('Area must be greater than zero.');
    return { pressurePa: forceN / areaM2, forceN, areaM2 };
  }
  if (solveFor === 'force') {
    return { pressurePa, forceN: pressurePa * areaM2, areaM2 };
  }
  if (pressurePa <= 0) throw new Error('Pressure must be greater than zero.');
  return { pressurePa, forceN, areaM2: forceN / pressurePa };
}

export function solveKineticEnergy(
  solveFor: 'energy' | 'mass' | 'velocity',
  energyJ: number,
  massKg: number,
  velocityMs: number
) {
  if (solveFor === 'energy') {
    return { energyJ: 0.5 * massKg * velocityMs * velocityMs, massKg, velocityMs };
  }
  if (solveFor === 'mass') {
    if (velocityMs === 0) throw new Error('Velocity cannot be zero when solving for mass.');
    return { energyJ, massKg: (2 * energyJ) / (velocityMs * velocityMs), velocityMs };
  }
  if (massKg <= 0 || energyJ < 0) throw new Error('Mass must be positive and energy non-negative.');
  return { energyJ, massKg, velocityMs: Math.sqrt((2 * energyJ) / massKg) };
}

export function solvePotentialEnergy(
  solveFor: 'energy' | 'mass' | 'height',
  energyJ: number,
  massKg: number,
  gravityMs2: number,
  heightM: number
) {
  if (solveFor === 'energy') {
    return { energyJ: massKg * gravityMs2 * heightM, massKg, gravityMs2, heightM };
  }
  if (solveFor === 'mass') {
    if (gravityMs2 * heightM === 0) throw new Error('Gravity and height must be non-zero.');
    return { energyJ, massKg: energyJ / (gravityMs2 * heightM), gravityMs2, heightM };
  }
  if (massKg * gravityMs2 === 0) throw new Error('Mass and gravity must be non-zero.');
  return { energyJ, massKg, gravityMs2, heightM: energyJ / (massKg * gravityMs2) };
}

export function solveOhmsLaw(inputs: {
  voltageV?: number | null;
  currentA?: number | null;
  resistanceOhm?: number | null;
  powerW?: number | null;
}) {
  const { voltageV: V, currentA: I, resistanceOhm: R, powerW: P } = inputs;
  const present = [
    V !== null && V !== undefined && !Number.isNaN(V),
    I !== null && I !== undefined && !Number.isNaN(I),
    R !== null && R !== undefined && !Number.isNaN(R),
    P !== null && P !== undefined && !Number.isNaN(P),
  ].filter(Boolean).length;

  if (present !== 2) {
    throw new Error('Provide exactly TWO known electrical quantities and leave the other two blank.');
  }

  if (V != null && I != null) {
    if (I === 0) throw new Error('Current cannot be zero when resistance is computed from V/I.');
    return { voltageV: V, currentA: I, resistanceOhm: V / I, powerW: V * I };
  }
  if (V != null && R != null) {
    if (R <= 0) throw new Error('Resistance must be greater than zero.');
    const cur = V / R;
    return { voltageV: V, currentA: cur, resistanceOhm: R, powerW: (V * V) / R };
  }
  if (V != null && P != null) {
    if (V === 0) throw new Error('Voltage cannot be zero when computing current from P/V.');
    const cur = P / V;
    if (cur === 0) throw new Error('Power cannot be zero when computing resistance.');
    return { voltageV: V, currentA: cur, resistanceOhm: (V * V) / P, powerW: P };
  }
  if (I != null && R != null) {
    if (R < 0) throw new Error('Resistance cannot be negative.');
    const volt = I * R;
    return { voltageV: volt, currentA: I, resistanceOhm: R, powerW: I * I * R };
  }
  if (I != null && P != null) {
    if (I === 0) throw new Error('Current cannot be zero.');
    return { voltageV: P / I, currentA: I, resistanceOhm: P / (I * I), powerW: P };
  }
  if (R != null && P != null) {
    if (R <= 0 || P < 0) throw new Error('Resistance must be positive and power non-negative.');
    const cur = Math.sqrt(P / R);
    return { voltageV: Math.sqrt(P * R), currentA: cur, resistanceOhm: R, powerW: P };
  }
  throw new Error('Provide exactly two known values.');
}

export function calculateVoltageDivider(vIn: number, r1Ohm: number, r2Ohm: number) {
  if (r1Ohm < 0 || r2Ohm < 0 || r1Ohm + r2Ohm <= 0) {
    throw new Error('Total resistance (R₁ + R₂) must be greater than zero.');
  }
  const vOut = vIn * (r2Ohm / (r1Ohm + r2Ohm));
  const totalCurrentA = vIn / (r1Ohm + r2Ohm);
  return { vOut, totalCurrentA, attenuationRatio: vIn !== 0 ? vOut / vIn : 0 };
}
