import { useState } from 'react';
import {
  calculateKinematics,
  calculateVoltageDivider,
  solveDensity,
  solveForce,
  solveKineticEnergy,
  solveOhmsLaw,
  solvePotentialEnergy,
  solvePressure,
  solveSpeedDistanceTime,
} from '../../../lib/calculators/science.ts';
import {
  CalcSplitLayout,
  ErrorAlert,
  NumberInput,
  ResultHero,
  SegmentedControl,
  SelectInput,
  StatTile,
  fmtNum,
} from './FormPrimitives.tsx';
import { ResultActions } from '../ResultActions.tsx';
import { useAppContext } from '../../../context/AppContext.tsx';

export function ScienceWidget({ slug }: { slug: string }) {
  const { lang } = useAppContext();
  const isAr = lang === 'ar';
  // Physics kinematics
  const [uVel, setUVel] = useState('0');
  const [accel, setAccel] = useState('9.80665');
  const [timeSec, setTimeSec] = useState('5');

  // Speed/Dist/Time
  const [sdtSolve, setSdtSolve] = useState<'speed' | 'distance' | 'time'>('time');
  const [sdtSpeed, setSdtSpeed] = useState('60');
  const [sdtSpeedUnit, setSdtSpeedUnit] = useState('mph');
  const [sdtDist, setSdtDist] = useState('240');
  const [sdtDistUnit, setSdtDistUnit] = useState('mi');
  const [sdtTime, setSdtTime] = useState('4');
  const [sdtTimeUnit, setSdtTimeUnit] = useState('hr');

  // Force
  const [forceSolve, setForceSolve] = useState<'force' | 'mass' | 'acceleration'>('force');
  const [forceVal, setForceVal] = useState('1000');
  const [massVal, setMassVal] = useState('1200');
  const [accVal, setAccVal] = useState('2.5');

  // Density
  const [densSolve, setDensSolve] = useState<'density' | 'mass' | 'volume'>('density');
  const [densVal, setDensVal] = useState('2700');
  const [densMassKg, setDensMassKg] = useState('5.4');
  const [densVolM3, setDensVolM3] = useState('0.002');

  // Pressure
  const [presSolve, setPresSolve] = useState<'pressure' | 'force' | 'area'>('pressure');
  const [presPa, setPresPa] = useState('250000');
  const [presForceN, setPresForceN] = useState('5000');
  const [presAreaM2, setPresAreaM2] = useState('0.02');

  // KE
  const [keSolve, setKeSolve] = useState<'energy' | 'mass' | 'velocity'>('energy');
  const [keJ, setKeJ] = useState('300000');
  const [keMass, setKeMass] = useState('1500');
  const [keVel, setKeVel] = useState('20');

  // PE
  const [peSolve, setPeSolve] = useState<'energy' | 'mass' | 'height'>('energy');
  const [peJ, setPeJ] = useState('5884');
  const [peMass, setPeMass] = useState('50');
  const [peHeight, setPeHeight] = useState('12');
  const [pePlanet, setPePlanet] = useState('9.80665');

  // Ohm's law
  const [ohmV, setOhmV] = useState('12');
  const [ohmI, setOhmI] = useState('');
  const [ohmR, setOhmR] = useState('470');
  const [ohmP, setOhmP] = useState('');

  // Voltage
  const [voltMode, setVoltMode] = useState<'ohm' | 'divider'>('divider');
  const [vIn, setVIn] = useState('5');
  const [r1, setR1] = useState('1700');
  const [r2, setR2] = useState('3300');
  const [vCur, setVCur] = useState('0.5');
  const [vRes, setVRes] = useState('24');

  // Power
  const [powMode, setPowMode] = useState<'work_time' | 'force_vel' | 'elec'>('force_vel');
  const [powA, setPowA] = useState('8000');
  const [powB, setPowB] = useState('1.5');

  if (slug === 'physics-calculator') {
    const res = calculateKinematics(parseFloat(uVel) || 0, parseFloat(accel) || 0, parseFloat(timeSec) || 0);
    return (
      <CalcSplitLayout
        inputs={
          <>
            <NumberInput label="Initial Velocity (u)" suffix="m/s" value={uVel} onChange={setUVel} />
            <NumberInput label="Constant Acceleration (a)" suffix="m/s²" value={accel} onChange={setAccel} />
            <NumberInput label="Elapsed Time (t)" suffix="s" value={timeSec} onChange={setTimeSec} min={0} />
          </>
        }
        results={
          <>
            <ResultHero
              label="Displacement (s)"
              value={`${fmtNum(res.displacement, 4)} m`}
              subtext={
                isAr
                  ? `السرعة النهائية v = ${fmtNum(res.finalVelocity, 4)} م/ث (${fmtNum(res.finalVelocity * 3.6, 2)} كم/س)`
                  : `Final velocity v = ${fmtNum(res.finalVelocity, 4)} m/s (${fmtNum(res.finalVelocity * 3.6, 2)} km/h)`
              }
            />
            <div className="grid grid-cols-3 gap-3">
              <StatTile label="Final Velocity" value={`${fmtNum(res.finalVelocity, 3)} m/s`} />
              <StatTile label="Average Velocity" value={`${fmtNum(res.averageVelocity, 3)} m/s`} />
              <StatTile label="Final Speed (mph)" value={`${fmtNum(res.finalVelocity * 2.23694, 2)} mph`} />
            </div>
            <ResultActions
              copyText={`Kinematics: s = ${fmtNum(res.displacement, 4)} m, v = ${fmtNum(res.finalVelocity, 4)} m/s`}
            />
          </>
        }
      />
    );
  }

  if (slug === 'speed-distance-time-calculator') {
    const speedMult = sdtSpeedUnit === 'mph' ? 0.44704 : sdtSpeedUnit === 'kmh' ? 1 / 3.6 : 1;
    const distMult = sdtDistUnit === 'mi' ? 1609.344 : sdtDistUnit === 'km' ? 1000 : 1;
    const timeMult = sdtTimeUnit === 'hr' ? 3600 : sdtTimeUnit === 'min' ? 60 : 1;

    let err: string | null = null;
    let res: ReturnType<typeof solveSpeedDistanceTime> | null = null;
    try {
      res = solveSpeedDistanceTime(
        sdtSolve,
        (parseFloat(sdtSpeed) || 0) * speedMult,
        (parseFloat(sdtDist) || 0) * distMult,
        (parseFloat(sdtTime) || 0) * timeMult
      );
    } catch (e) {
      err = e instanceof Error ? e.message : 'Invalid inputs';
    }

    const outVal = res
      ? sdtSolve === 'speed'
        ? `${fmtNum(res.speedMps / speedMult, 4)} ${sdtSpeedUnit}`
        : sdtSolve === 'distance'
        ? `${fmtNum(res.distanceM / distMult, 4)} ${sdtDistUnit}`
        : `${fmtNum(res.timeS / timeMult, 4)} ${sdtTimeUnit}`
      : '—';

    return (
      <CalcSplitLayout
        inputs={
          <>
            <SegmentedControl
              label="Solve For"
              value={sdtSolve}
              onChange={setSdtSolve}
              options={[
                { value: 'speed', label: 'Speed' },
                { value: 'distance', label: 'Distance' },
                { value: 'time', label: 'Time' },
              ]}
            />
            {sdtSolve !== 'distance' && (
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <NumberInput label="Distance" value={sdtDist} onChange={setSdtDist} min={0} />
                </div>
                <SelectInput
                  label="Unit"
                  value={sdtDistUnit}
                  onChange={setSdtDistUnit}
                  options={[
                    { value: 'mi', label: 'mi' },
                    { value: 'km', label: 'km' },
                    { value: 'm', label: 'm' },
                  ]}
                />
              </div>
            )}
            {sdtSolve !== 'speed' && (
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <NumberInput label="Speed" value={sdtSpeed} onChange={setSdtSpeed} min={0} />
                </div>
                <SelectInput
                  label="Unit"
                  value={sdtSpeedUnit}
                  onChange={setSdtSpeedUnit}
                  options={[
                    { value: 'mph', label: 'mph' },
                    { value: 'kmh', label: 'km/h' },
                    { value: 'mps', label: 'm/s' },
                  ]}
                />
              </div>
            )}
            {sdtSolve !== 'time' && (
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <NumberInput label="Time" value={sdtTime} onChange={setSdtTime} min={0} />
                </div>
                <SelectInput
                  label="Unit"
                  value={sdtTimeUnit}
                  onChange={setSdtTimeUnit}
                  options={[
                    { value: 'hr', label: 'hr' },
                    { value: 'min', label: 'min' },
                    { value: 's', label: 's' },
                  ]}
                />
              </div>
            )}
          </>
        }
        results={
          err || !res ? (
            <ErrorAlert message={err || 'Invalid input'} />
          ) : (
            <>
              <ResultHero
                label={
                  sdtSolve === 'speed'
                    ? isAr
                      ? 'السرعة المحسوبة'
                      : 'Calculated SPEED'
                    : sdtSolve === 'distance'
                    ? isAr
                      ? 'المسافة المحسوبة'
                      : 'Calculated DISTANCE'
                    : isAr
                    ? 'الزمن المحسوب'
                    : 'Calculated TIME'
                }
                value={outVal}
              />
              <div className="grid grid-cols-3 gap-3">
                <StatTile label="Speed (m/s)" value={`${fmtNum(res.speedMps, 2)} m/s`} />
                <StatTile label="Distance (km)" value={`${fmtNum(res.distanceM / 1000, 3)} km`} />
                <StatTile label="Time (min)" value={`${fmtNum(res.timeS / 60, 2)} min`} />
              </div>
              <ResultActions copyText={`Solved ${sdtSolve}: ${outVal}`} />
            </>
          )
        }
      />
    );
  }

  if (slug === 'force-calculator') {
    let err: string | null = null;
    let res: ReturnType<typeof solveForce> | null = null;
    try {
      res = solveForce(forceSolve, parseFloat(forceVal) || 0, parseFloat(massVal) || 0, parseFloat(accVal) || 0);
    } catch (e) {
      err = e instanceof Error ? e.message : 'Invalid input';
    }
    return (
      <CalcSplitLayout
        inputs={
          <>
            <SegmentedControl
              label="Solve For"
              value={forceSolve}
              onChange={setForceSolve}
              options={[
                { value: 'force', label: 'Force (F)' },
                { value: 'mass', label: 'Mass (m)' },
                { value: 'acceleration', label: 'Accel (a)' },
              ]}
            />
            {forceSolve !== 'force' && (
              <NumberInput label="Force (F)" suffix="N" value={forceVal} onChange={setForceVal} />
            )}
            {forceSolve !== 'mass' && (
              <NumberInput label="Mass (m)" suffix="kg" value={massVal} onChange={setMassVal} min={0.0001} />
            )}
            {forceSolve !== 'acceleration' && (
              <NumberInput label="Acceleration (a)" suffix="m/s²" value={accVal} onChange={setAccVal} />
            )}
          </>
        }
        results={
          err || !res ? (
            <ErrorAlert message={err || 'Invalid input'} />
          ) : (
            <>
              <ResultHero
                label={forceSolve === 'force' ? 'Net Force' : forceSolve === 'mass' ? 'Mass' : 'Acceleration'}
                value={
                  forceSolve === 'force'
                    ? `${fmtNum(res.forceN, 4)} N`
                    : forceSolve === 'mass'
                    ? `${fmtNum(res.massKg, 4)} kg`
                    : `${fmtNum(res.accelMs2, 4)} m/s²`
                }
                subtext={`Force = ${fmtNum(res.forceN / 1000, 4)} kN (${fmtNum(res.forceN * 0.224809, 2)} lbf)`}
              />
              <ResultActions copyText={`F = ${res.forceN} N, m = ${res.massKg} kg, a = ${res.accelMs2} m/s²`} />
            </>
          )
        }
      />
    );
  }

  if (slug === 'density-calculator') {
    let err: string | null = null;
    let res: ReturnType<typeof solveDensity> | null = null;
    try {
      res = solveDensity(densSolve, parseFloat(densVal) || 0, parseFloat(densMassKg) || 0, parseFloat(densVolM3) || 0);
    } catch (e) {
      err = e instanceof Error ? e.message : 'Invalid input';
    }
    return (
      <CalcSplitLayout
        inputs={
          <>
            <SegmentedControl
              label="Solve For"
              value={densSolve}
              onChange={setDensSolve}
              options={[
                { value: 'density', label: 'Density (ρ)' },
                { value: 'mass', label: 'Mass (m)' },
                { value: 'volume', label: 'Volume (V)' },
              ]}
            />
            {densSolve !== 'density' && (
              <NumberInput label="Density (ρ)" suffix="kg/m³" value={densVal} onChange={setDensVal} min={0.0001} />
            )}
            {densSolve !== 'mass' && (
              <NumberInput label="Mass (m)" suffix="kg" value={densMassKg} onChange={setDensMassKg} min={0} />
            )}
            {densSolve !== 'volume' && (
              <NumberInput label="Volume (V)" suffix="m³" value={densVolM3} onChange={setDensVolM3} min={0.000001} />
            )}
          </>
        }
        results={
          err || !res ? (
            <ErrorAlert message={err || 'Invalid input'} />
          ) : (
            <>
              <ResultHero
                label={densSolve === 'density' ? 'Density' : densSolve === 'mass' ? 'Mass' : 'Volume'}
                value={
                  densSolve === 'density'
                    ? `${fmtNum(res.densityKgM3, 3)} kg/m³`
                    : densSolve === 'mass'
                    ? `${fmtNum(res.massKg, 4)} kg`
                    : `${fmtNum(res.volumeM3, 6)} m³`
                }
                subtext={`Specific gravity (vs water): ${(res.densityKgM3 / 1000).toFixed(4)} (${(res.densityKgM3 / 1000).toFixed(4)} g/cm³)`}
              />
              <ResultActions copyText={`Density: ${res.densityKgM3} kg/m³ | Mass: ${res.massKg} kg | Volume: ${res.volumeM3} m³`} />
            </>
          )
        }
      />
    );
  }

  if (slug === 'pressure-calculator') {
    let err: string | null = null;
    let res: ReturnType<typeof solvePressure> | null = null;
    try {
      res = solvePressure(presSolve, parseFloat(presPa) || 0, parseFloat(presForceN) || 0, parseFloat(presAreaM2) || 0);
    } catch (e) {
      err = e instanceof Error ? e.message : 'Invalid input';
    }
    return (
      <CalcSplitLayout
        inputs={
          <>
            <SegmentedControl
              label="Solve For"
              value={presSolve}
              onChange={setPresSolve}
              options={[
                { value: 'pressure', label: 'Pressure (P)' },
                { value: 'force', label: 'Force (F)' },
                { value: 'area', label: 'Area (A)' },
              ]}
            />
            {presSolve !== 'pressure' && (
              <NumberInput label="Pressure (P)" suffix="Pa" value={presPa} onChange={setPresPa} min={0.001} />
            )}
            {presSolve !== 'force' && (
              <NumberInput label="Force (F)" suffix="N" value={presForceN} onChange={setPresForceN} />
            )}
            {presSolve !== 'area' && (
              <NumberInput label="Contact Area (A)" suffix="m²" value={presAreaM2} onChange={setPresAreaM2} min={0.000001} />
            )}
          </>
        }
        results={
          err || !res ? (
            <ErrorAlert message={err || 'Invalid input'} />
          ) : (
            <>
              <ResultHero
                label={presSolve === 'pressure' ? 'Pressure' : presSolve === 'force' ? 'Force' : 'Contact Area'}
                value={
                  presSolve === 'pressure'
                    ? `${fmtNum(res.pressurePa / 1000, 3)} kPa`
                    : presSolve === 'force'
                    ? `${fmtNum(res.forceN, 3)} N`
                    : `${fmtNum(res.areaM2, 5)} m²`
                }
                subtext={`${fmtNum(res.pressurePa, 1)} Pa · ${(res.pressurePa / 100000).toFixed(4)} bar · ${(res.pressurePa / 6894.757).toFixed(3)} psi`}
              />
              <ResultActions copyText={`P = ${res.pressurePa} Pa (${(res.pressurePa / 6894.757).toFixed(2)} psi)`} />
            </>
          )
        }
      />
    );
  }

  if (slug === 'kinetic-energy-calculator') {
    let err: string | null = null;
    let res: ReturnType<typeof solveKineticEnergy> | null = null;
    try {
      res = solveKineticEnergy(keSolve, parseFloat(keJ) || 0, parseFloat(keMass) || 0, parseFloat(keVel) || 0);
    } catch (e) {
      err = e instanceof Error ? e.message : 'Invalid input';
    }
    return (
      <CalcSplitLayout
        inputs={
          <>
            <SegmentedControl
              label="Solve For"
              value={keSolve}
              onChange={setKeSolve}
              options={[
                { value: 'energy', label: 'Energy (KE)' },
                { value: 'mass', label: 'Mass (m)' },
                { value: 'velocity', label: 'Velocity (v)' },
              ]}
            />
            {keSolve !== 'energy' && (
              <NumberInput label="Kinetic Energy" suffix="J" value={keJ} onChange={setKeJ} min={0} />
            )}
            {keSolve !== 'mass' && (
              <NumberInput label="Mass (m)" suffix="kg" value={keMass} onChange={setKeMass} min={0.0001} />
            )}
            {keSolve !== 'velocity' && (
              <NumberInput label="Velocity (v)" suffix="m/s" value={keVel} onChange={setKeVel} />
            )}
          </>
        }
        results={
          err || !res ? (
            <ErrorAlert message={err || 'Invalid input'} />
          ) : (
            <>
              <ResultHero
                label={keSolve === 'energy' ? 'Kinetic Energy' : keSolve === 'mass' ? 'Mass' : 'Velocity'}
                value={
                  keSolve === 'energy'
                    ? `${fmtNum(res.energyJ, 2)} J`
                    : keSolve === 'mass'
                    ? `${fmtNum(res.massKg, 4)} kg`
                    : `${fmtNum(res.velocityMs, 4)} m/s`
                }
                subtext={`${fmtNum(res.energyJ / 1000, 4)} kJ · ${fmtNum(res.energyJ / 4184, 4)} kcal`}
              />
              <ResultActions copyText={`KE = ${res.energyJ} J, m = ${res.massKg} kg, v = ${res.velocityMs} m/s`} />
            </>
          )
        }
      />
    );
  }

  if (slug === 'potential-energy-calculator') {
    let err: string | null = null;
    let res: ReturnType<typeof solvePotentialEnergy> | null = null;
    try {
      res = solvePotentialEnergy(
        peSolve,
        parseFloat(peJ) || 0,
        parseFloat(peMass) || 0,
        parseFloat(pePlanet) || 9.80665,
        parseFloat(peHeight) || 0
      );
    } catch (e) {
      err = e instanceof Error ? e.message : 'Invalid input';
    }
    return (
      <CalcSplitLayout
        inputs={
          <>
            <SegmentedControl
              label="Solve For"
              value={peSolve}
              onChange={setPeSolve}
              options={[
                { value: 'energy', label: 'Energy (PE)' },
                { value: 'mass', label: 'Mass (m)' },
                { value: 'height', label: 'Height (h)' },
              ]}
            />
            <SelectInput
              label="Gravitational Field (g)"
              value={pePlanet}
              onChange={setPePlanet}
              options={[
                { value: '9.80665', label: 'Earth (9.80665 m/s²)' },
                { value: '1.62', label: 'Moon (1.62 m/s²)' },
                { value: '3.72', label: 'Mars (3.72 m/s²)' },
                { value: '24.79', label: 'Jupiter (24.79 m/s²)' },
              ]}
            />
            {peSolve !== 'energy' && <NumberInput label="Potential Energy" suffix="J" value={peJ} onChange={setPeJ} />}
            {peSolve !== 'mass' && <NumberInput label="Mass (m)" suffix="kg" value={peMass} onChange={setPeMass} />}
            {peSolve !== 'height' && <NumberInput label="Height (h)" suffix="m" value={peHeight} onChange={setPeHeight} />}
          </>
        }
        results={
          err || !res ? (
            <ErrorAlert message={err || 'Invalid input'} />
          ) : (
            <>
              <ResultHero
                label={peSolve === 'energy' ? 'Gravitational Potential Energy' : peSolve === 'mass' ? 'Mass' : 'Height'}
                value={
                  peSolve === 'energy'
                    ? `${fmtNum(res.energyJ, 2)} J`
                    : peSolve === 'mass'
                    ? `${fmtNum(res.massKg, 4)} kg`
                    : `${fmtNum(res.heightM, 4)} m`
                }
                subtext={`${fmtNum(res.energyJ / 1000, 4)} kJ`}
              />
              <ResultActions copyText={`PE = ${res.energyJ.toFixed(2)} J (m=${res.massKg}kg, g=${res.gravityMs2}, h=${res.heightM}m)`} />
            </>
          )
        }
      />
    );
  }

  if (slug === 'ohms-law-calculator') {
    const parseOpt = (s: string) => (s.trim() === '' ? null : parseFloat(s));
    let err: string | null = null;
    let res: ReturnType<typeof solveOhmsLaw> | null = null;
    try {
      res = solveOhmsLaw({
        voltageV: parseOpt(ohmV),
        currentA: parseOpt(ohmI),
        resistanceOhm: parseOpt(ohmR),
        powerW: parseOpt(ohmP),
      });
    } catch (e) {
      err = e instanceof Error ? e.message : 'Invalid inputs';
    }
    return (
      <CalcSplitLayout
        inputs={
          <>
            <p className="text-xs text-[#64748B]">
              {isAr ? (
                <>
                  أدخل أي <strong>قيمتين</strong> واترك الحقلين الآخرين فارغين.
                </>
              ) : (
                <>
                  Enter any <strong>two</strong> values and leave the other two fields blank.
                </>
              )}
            </p>
            <NumberInput label="Voltage (V)" suffix="V" value={ohmV} onChange={setOhmV} placeholder="Leave blank if unknown" />
            <NumberInput label="Current (I)" suffix="A" value={ohmI} onChange={setOhmI} placeholder="Leave blank if unknown" />
            <NumberInput label="Resistance (R)" suffix="Ω" value={ohmR} onChange={setOhmR} placeholder="Leave blank if unknown" />
            <NumberInput label="Power (P)" suffix="W" value={ohmP} onChange={setOhmP} placeholder="Leave blank if unknown" />
            <button
              type="button"
              onClick={() => {
                setOhmV('');
                setOhmI('');
                setOhmR('');
                setOhmP('');
              }}
              className="text-xs font-semibold text-[#2563EB] hover:underline"
            >
              {isAr ? 'مسح جميع الحقول' : 'Clear All Fields'}
            </button>
          </>
        }
        results={
          err || !res ? (
            <ErrorAlert message={err || 'Provide two known electrical quantities.'} />
          ) : (
            <>
              <ResultHero
                label="Solved Circuit State"
                value={`${fmtNum(res.voltageV, 4)} V · ${fmtNum(res.currentA, 4)} A`}
                subtext={`Resistance: ${fmtNum(res.resistanceOhm, 3)} Ω · Power: ${fmtNum(res.powerW, 4)} W`}
              />
              <div className="grid grid-cols-2 gap-3">
                <StatTile label="Voltage (V)" value={`${fmtNum(res.voltageV, 5)} V`} />
                <StatTile label="Current (I)" value={`${fmtNum(res.currentA, 5)} A (${fmtNum(res.currentA * 1000, 2)} mA)`} />
                <StatTile label="Resistance (R)" value={`${fmtNum(res.resistanceOhm, 4)} Ω`} />
                <StatTile label="Power (P)" value={`${fmtNum(res.powerW, 5)} W (${fmtNum(res.powerW * 1000, 2)} mW)`} />
              </div>
              <ResultActions
                copyText={`V=${res.voltageV.toFixed(4)}V, I=${res.currentA.toFixed(5)}A, R=${res.resistanceOhm.toFixed(3)}Ω, P=${res.powerW.toFixed(4)}W`}
              />
            </>
          )
        }
      />
    );
  }

  if (slug === 'voltage-calculator') {
    let err: string | null = null;
    let divRes: ReturnType<typeof calculateVoltageDivider> | null = null;
    const ohmRes = (parseFloat(vCur) || 0) * (parseFloat(vRes) || 0);
    if (voltMode === 'divider') {
      try {
        divRes = calculateVoltageDivider(parseFloat(vIn) || 0, parseFloat(r1) || 0, parseFloat(r2) || 0);
      } catch (e) {
        err = e instanceof Error ? e.message : 'Invalid resistor values';
      }
    }
    return (
      <CalcSplitLayout
        inputs={
          <>
            <SegmentedControl
              label="Calculation Mode"
              value={voltMode}
              onChange={setVoltMode}
              options={[
                { value: 'divider', label: 'Voltage Divider' },
                { value: 'ohm', label: "Ohm's Law (V = I·R)" },
              ]}
            />
            {voltMode === 'divider' ? (
              <>
                <NumberInput label="Input Voltage (Vin)" suffix="V" value={vIn} onChange={setVIn} />
                <NumberInput label="Top Resistor (R1)" suffix="Ω" value={r1} onChange={setR1} min={0} />
                <NumberInput label="Bottom Resistor (R2)" suffix="Ω" value={r2} onChange={setR2} min={0} />
              </>
            ) : (
              <>
                <NumberInput label="Current (I)" suffix="A" value={vCur} onChange={setVCur} />
                <NumberInput label="Resistance (R)" suffix="Ω" value={vRes} onChange={setVRes} min={0} />
              </>
            )}
          </>
        }
        results={
          voltMode === 'divider' ? (
            err || !divRes ? (
              <ErrorAlert message={err || 'Invalid inputs'} />
            ) : (
              <>
                <ResultHero
                  label="Output Voltage (Vout)"
                  value={`${fmtNum(divRes.vOut, 4)} V`}
                  subtext={`Divider Current: ${(divRes.totalCurrentA * 1000).toFixed(3)} mA · Ratio: ${(divRes.attenuationRatio * 100).toFixed(2)}%`}
                />
                <ResultActions copyText={`Voltage Divider: Vin=${vIn}V, R1=${r1}Ω, R2=${r2}Ω => Vout=${divRes.vOut.toFixed(4)}V`} />
              </>
            )
          ) : (
            <>
              <ResultHero label="Voltage (V = I × R)" value={`${fmtNum(ohmRes, 4)} V`} />
              <ResultActions copyText={`V = ${vCur}A × ${vRes}Ω = ${ohmRes.toFixed(4)}V`} />
            </>
          )
        }
      />
    );
  }

  // Power Calculator
  const aVal = parseFloat(powA) || 0;
  const bVal = parseFloat(powB) || 0;
  let wattsOut = 0;
  let powErr: string | null = null;
  if (powMode === 'work_time') {
    if (bVal <= 0) powErr = 'Time must be greater than zero.';
    else wattsOut = aVal / bVal;
  } else {
    wattsOut = aVal * bVal;
  }

  return (
    <CalcSplitLayout
      inputs={
        <>
          <SegmentedControl
            label="Power Formula"
            value={powMode}
            onChange={setPowMode}
            options={[
              { value: 'force_vel', label: 'P = F · v' },
              { value: 'work_time', label: 'P = W / t' },
              { value: 'elec', label: 'P = V · I' },
            ]}
          />
          <NumberInput
            label={powMode === 'force_vel' ? 'Force (N)' : powMode === 'work_time' ? 'Work (J)' : 'Voltage (V)'}
            value={powA}
            onChange={setPowA}
          />
          <NumberInput
            label={powMode === 'force_vel' ? 'Velocity (m/s)' : powMode === 'work_time' ? 'Time (s)' : 'Current (A)'}
            value={powB}
            onChange={setPowB}
          />
        </>
      }
      results={
        powErr ? (
          <ErrorAlert message={powErr} />
        ) : (
          <>
            <ResultHero
              label="Calculated Power"
              value={`${fmtNum(wattsOut, 3)} W`}
              subtext={`${fmtNum(wattsOut / 1000, 4)} kW · ${fmtNum(wattsOut / 745.699872, 4)} hp (mechanical)`}
            />
            <div className="grid grid-cols-3 gap-3">
              <StatTile label="Watts (W)" value={fmtNum(wattsOut, 2)} />
              <StatTile label="Kilowatts (kW)" value={fmtNum(wattsOut / 1000, 4)} />
              <StatTile label="Horsepower (hp)" value={fmtNum(wattsOut / 745.699872, 4)} />
            </div>
            <ResultActions copyText={`Power = ${wattsOut.toFixed(2)} W (${(wattsOut / 1000).toFixed(3)} kW)`} />
          </>
        )
      }
    />
  );
}
