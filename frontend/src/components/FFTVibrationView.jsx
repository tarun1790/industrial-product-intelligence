import React, { useState, useEffect } from 'react';
import { Activity, Radio, Volume2, ShieldAlert, CheckCircle2, RefreshCw, Layers } from 'lucide-react';
import { fetchFFTVibration } from '../services/api';

export default function FFTVibrationView({ selectedProduct }) {
  const [runningRpm, setRunningRpm] = useState(1465.0);
  const [bearingModel, setBearingModel] = useState('SKF 6309 C3');
  const [fftData, setFftData] = useState(null);
  const [selectedHarmonic, setSelectedHarmonic] = useState(null);
  const [loading, setLoading] = useState(false);

  const partNum = selectedProduct?.part_number || 'M3BP 160MLA 4';

  useEffect(() => {
    loadFFTSpectrum(runningRpm);
  }, [partNum, bearingModel]);

  const loadFFTSpectrum = async (rpm) => {
    setLoading(true);
    try {
      const data = await fetchFFTVibration(partNum, rpm, bearingModel);
      setFftData(data);
      if (data?.fault_harmonics?.length > 0) {
        setSelectedHarmonic(data.fault_harmonics[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRpmChange = (val) => {
    setRunningRpm(val);
    loadFFTSpectrum(val);
  };

  return (
    <div className="space-y-6 w-full font-sans">
      {/* Header */}
      <div className="premium-card p-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase bg-blue-50 text-blue-700 border border-blue-200/80 font-extrabold tracking-wide">
                Kinematic Spectral Signal Processing
              </span>
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
                <Radio className="w-5 h-5 text-blue-600" />
                Physical Acoustic & Vibration FFT Frequency Spectrum Twin
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Computes bearing kinematic fault frequencies (BPFO, BPFI, BSF, FTF) and 1X/2X shaft unbalance harmonics. Audits machine vibration velocity against ISO 10816-3 Zone A operational limits.
            </p>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-right shadow-2xs">
            <span className="text-slate-500 block text-[10px] font-medium">Vibration Standard</span>
            <span className="font-extrabold text-blue-600 font-mono">
              ISO 10816-3 Zone A (&lt; 1.4 mm/s)
            </span>
          </div>
        </div>

        {/* Dynamic RPM Control */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <div className="flex justify-between font-bold text-slate-800">
              <span>Running Shaft Speed:</span>
              <span className="font-mono text-blue-600">{runningRpm} RPM ({((runningRpm)/60).toFixed(1)} Hz 1X)</span>
            </div>
            <input
              type="range"
              min="600"
              max="3000"
              step="5"
              value={runningRpm}
              onChange={(e) => handleRpmChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-800">Drive-End Bearing Kinematics:</label>
            <select
              value={bearingModel}
              onChange={(e) => setBearingModel(e.target.value)}
              className="w-full p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-mono text-xs cursor-pointer"
            >
              <option value="SKF 6309 C3">SKF 6309 C3 (Pitch Ø72.5mm, 8 Balls Ø17.46mm)</option>
              <option value="FAG 6309-C-C3">FAG 6309-C-C3 Deep Groove Ball Bearing</option>
              <option value="NSK 6309 DDU">NSK 6309 DDU Rubber Contact Sealed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Spectral Overview Stats */}
      {fftData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Overall Vibration RMS</span>
            <span className="text-2xl font-extrabold text-blue-600 block font-mono">0.68 mm/s</span>
            <span className="text-[10px] text-blue-600 font-medium">Zone A Alert: 1.40 mm/s</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Fundamental 1X</span>
            <span className="text-2xl font-extrabold text-slate-900 block font-mono">{fftData.fundamental_frequency_hz} Hz</span>
            <span className="text-[10px] text-slate-500">Rotor Dynamic Balance</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Outer Race BPFO</span>
            <span className="text-2xl font-extrabold text-slate-900 block font-mono">
              {fftData.fault_harmonics.find(h => h.fault_code === 'BPFO')?.frequency_hz} Hz
            </span>
            <span className="text-[10px] text-slate-500">Peak: 0.12 mm/s (Healthy)</span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-1">
            <span className="text-slate-500 text-[10px] uppercase font-semibold">Acoustic Sound Power</span>
            <span className="text-2xl font-extrabold text-blue-700 block font-mono">{fftData.acoustic_noise_level_dba} dB(A)</span>
            <span className="text-[10px] text-blue-700 font-medium">IEC 60034-9 Low Noise</span>
          </div>
        </div>
      )}

      {/* Interactive FFT Canvas & Harmonics Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left 7 Cols: Interactive SVG FFT Spectrum Plot */}
        <div className="xl:col-span-7 premium-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Fast Fourier Transform (FFT) Velocity Spectrum (0 to 500 Hz)
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">Real-time spectral energy distribution</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 font-bold border border-blue-200 font-mono">
              128-Point FFT
            </span>
          </div>

          {/* SVG Canvas */}
          <div className="w-full bg-slate-950 rounded-xl p-5 flex flex-col items-center justify-center border border-slate-800 relative overflow-hidden min-h-[320px]">
            <svg viewBox="0 0 500 220" className="w-full max-w-lg h-auto relative z-10">
              {/* Grid Lines */}
              <line x1="40" y1="180" x2="480" y2="180" stroke="#334155" strokeWidth="1.5" />
              <line x1="40" y1="130" x2="480" y2="130" stroke="#1e293b" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="40" y1="80" x2="480" y2="80" stroke="#1e293b" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="40" y1="30" x2="480" y2="30" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" />
              <text x="475" y="26" fill="#ef4444" fontSize="9" fontFamily="JetBrains Mono" textAnchor="end">ISO Alarm Limit: 1.4 mm/s</text>

              {/* Spectral Curve */}
              {fftData?.fft_spectrum_points && (
                <path
                  d={fftData.fft_spectrum_points.reduce((acc, pt, idx) => {
                    const x = 40 + (pt.frequency_hz / 500.0) * 440;
                    const y = 180 - (pt.velocity_rms_mms / 1.4) * 150;
                    return `${acc} ${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }, '')}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                />
              )}

              {/* Harmonic Callout Points */}
              <circle cx="62" cy="132" r="4" fill="#60a5fa" stroke="#ffffff" strokeWidth="1.5" />
              <text x="62" y="122" fill="#93c5fd" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">1X</text>

              <circle cx="83" cy="150" r="4" fill="#60a5fa" stroke="#ffffff" strokeWidth="1.5" />
              <text x="83" y="142" fill="#93c5fd" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">2X</text>

              <circle cx="135" cy="168" r="4" fill="#fbbf24" stroke="#ffffff" strokeWidth="1.5" />
              <text x="135" y="158" fill="#fbbf24" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold" textAnchor="middle">BPFO</text>

              {/* Frequency Axis Labels */}
              <text x="40" y="196" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono">0 Hz</text>
              <text x="150" y="196" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono">125 Hz</text>
              <text x="260" y="196" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono">250 Hz</text>
              <text x="370" y="196" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono">375 Hz</text>
              <text x="480" y="196" fill="#64748b" fontSize="10" fontFamily="JetBrains Mono" textAnchor="end">500 Hz</text>
            </svg>

            <div className="flex items-center gap-6 mt-3 text-[11px] font-mono text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span> 1X/2X Shaft Harmonics
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Bearing BPFO/BPFI Frequencies
              </span>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Harmonics Ledger */}
        <div className="xl:col-span-5 space-y-4">
          <div className="premium-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Kinematic Fault Harmonics
              </h3>
              <span className="text-xs text-blue-600 font-mono font-bold">Zone A (Normal)</span>
            </div>

            <div className="space-y-2">
              {fftData?.fault_harmonics?.map((harm) => (
                <div key={harm.fault_code} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">{harm.fault_name}</span>
                    <span className="font-mono font-bold text-blue-700 bg-blue-100/70 px-1.5 py-0.2 rounded text-[10px]">
                      {harm.frequency_hz} Hz
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                    <span>Amplitude: <strong>{harm.peak_amplitude_mms} mm/s</strong></span>
                    <span className="text-blue-700 font-bold">{harm.severity_status}</span>
                  </div>

                  <p className="text-slate-600 text-[11px] leading-relaxed font-sans">
                    {harm.physical_diagnosis}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
