'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

type Solve = 'P' | 'V' | 'I'

function fmtPower(w: number): string {
  if (!isFinite(w) || isNaN(w)) return 'Hata'
  if (Math.abs(w) >= 1e9) return `${(w / 1e9).toPrecision(4)} GW`
  if (Math.abs(w) >= 1e6) return `${(w / 1e6).toPrecision(4)} MW`
  if (Math.abs(w) >= 1e3) return `${(w / 1e3).toPrecision(4)} kW`
  if (Math.abs(w) >= 1)   return `${w.toPrecision(4)} W`
  if (Math.abs(w) >= 1e-3) return `${(w * 1e3).toPrecision(4)} mW`
  return `${w.toPrecision(4)} W`
}

function fmtVal(v: number, unit: string): string {
  if (!isFinite(v) || isNaN(v)) return 'Hata'
  if (Math.abs(v) >= 1e3) return `${(v / 1e3).toPrecision(4)} k${unit}`
  if (Math.abs(v) >= 1)   return `${v.toPrecision(4)} ${unit}`
  if (Math.abs(v) >= 1e-3) return `${(v * 1e3).toPrecision(4)} m${unit}`
  if (Math.abs(v) >= 1e-6) return `${(v * 1e6).toPrecision(4)} µ${unit}`
  return `${v.toPrecision(4)} ${unit}`
}

export default function PowerCalc() {
  const [solve, setSolve] = useState<Solve>('P')
  const [a, setA] = useState('')
  const [b, setB] = useState('')

  const config: Record<Solve, {
    aLabel: string; aUnit: string
    bLabel: string; bUnit: string
    formula: string
    compute: (a: number, b: number) => string
  }> = {
    P: {
      aLabel: 'Voltaj (V)', aUnit: 'V',
      bLabel: 'Akım (I)',   bUnit: 'A',
      formula: 'P = V × I',
      compute: (v, i) => fmtPower(v * i),
    },
    V: {
      aLabel: 'Güç (P)', aUnit: 'W',
      bLabel: 'Akım (I)', bUnit: 'A',
      formula: 'V = P / I',
      compute: (p, i) => fmtVal(p / i, 'V'),
    },
    I: {
      aLabel: 'Güç (P)', aUnit: 'W',
      bLabel: 'Voltaj (V)', bUnit: 'V',
      formula: 'I = P / V',
      compute: (p, v) => fmtVal(p / v, 'A'),
    },
  }

  const { aLabel, aUnit, bLabel, bUnit, formula, compute } = config[solve]

  const result = (() => {
    const aVal = parseFloat(a)
    const bVal = parseFloat(b)
    if (isNaN(aVal) || isNaN(bVal)) return '—'
    return compute(aVal, bVal)
  })()

  const TABS: { id: Solve; symbol: string; label: string }[] = [
    { id: 'P', symbol: 'P', label: 'Güç' },
    { id: 'V', symbol: 'V', label: 'Voltaj' },
    { id: 'I', symbol: 'I', label: 'Akım' },
  ]

  return (
    <div className="max-w-lg mx-auto px-4 py-6 flex flex-col gap-6">
      {/* Header card */}
      <div className="bg-card rounded-2xl border border-border p-5 shadow-xl">
        <p className="text-center text-xl font-bold text-primary font-mono">P = V × I</p>
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-surface rounded-xl p-3 text-center border border-border">
            <p className="text-2xl font-bold font-mono text-primary">P</p>
            <p className="text-xs text-muted-foreground mt-1">Güç</p>
            <p className="text-xs font-mono text-foreground">Watt (W)</p>
          </div>
          <div className="bg-surface rounded-xl p-3 text-center border border-border">
            <p className="text-2xl font-bold font-mono text-foreground">V</p>
            <p className="text-xs text-muted-foreground mt-1">Voltaj</p>
            <p className="text-xs font-mono text-foreground">Volt (V)</p>
          </div>
          <div className="bg-surface rounded-xl p-3 text-center border border-border">
            <p className="text-2xl font-bold font-mono text-foreground">I</p>
            <p className="text-xs text-muted-foreground mt-1">Akım</p>
            <p className="text-xs font-mono text-foreground">Amper (A)</p>
          </div>
        </div>
      </div>

      {/* Solve for */}
      <div>
        <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">Hesapla:</p>
        <div className="grid grid-cols-3 gap-2">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => { setSolve(t.id); setA(''); setB('') }}
              className={cn(
                'flex flex-col items-center py-3 px-2 rounded-xl border text-sm font-semibold transition-all',
                solve === t.id
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30'
                  : 'bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
              )}
            >
              <span className="font-mono text-xl leading-none mb-1">{t.symbol}</span>
              <span className="text-xs opacity-80">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Inputs */}
      <div className="flex flex-col gap-4">
        {[
          { label: aLabel, unit: aUnit, val: a, set: setA },
          { label: bLabel, unit: bUnit, val: b, set: setB },
        ].map(({ label, unit, val, set }, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border p-4">
            <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2 block">
              {label}
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={val}
                onChange={e => set(e.target.value)}
                placeholder="Değer girin..."
                className="flex-1 bg-transparent text-2xl font-mono font-bold text-foreground outline-none placeholder:text-muted-foreground/40 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              />
              <span className="text-primary font-mono font-bold text-lg">{unit}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Result */}
      <div className="bg-card rounded-2xl border border-primary/40 p-5 shadow-xl shadow-primary/10">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3">Sonuç</p>
        <div className="text-center">
          <div className="text-5xl font-bold font-mono text-primary glow-text">
            {result}
          </div>
          <div className="text-sm text-muted-foreground mt-2">{formula}</div>
        </div>
      </div>

      <button
        onClick={() => { setA(''); setB('') }}
        className="w-full py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors text-sm font-medium"
      >
        Temizle
      </button>
    </div>
  )
}
