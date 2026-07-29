'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface Unit {
  label: string
  factor: number  // multiply to get base unit
}

interface Category {
  name: string
  base: string
  units: Unit[]
}

const CATEGORIES: Category[] = [
  {
    name: 'Direnç',
    base: 'Ω',
    units: [
      { label: 'Ω',  factor: 1 },
      { label: 'kΩ', factor: 1e3 },
      { label: 'MΩ', factor: 1e6 },
      { label: 'GΩ', factor: 1e9 },
      { label: 'mΩ', factor: 1e-3 },
      { label: 'µΩ', factor: 1e-6 },
    ],
  },
  {
    name: 'Akım',
    base: 'A',
    units: [
      { label: 'A',  factor: 1 },
      { label: 'mA', factor: 1e-3 },
      { label: 'µA', factor: 1e-6 },
      { label: 'nA', factor: 1e-9 },
      { label: 'kA', factor: 1e3 },
    ],
  },
  {
    name: 'Voltaj',
    base: 'V',
    units: [
      { label: 'V',  factor: 1 },
      { label: 'mV', factor: 1e-3 },
      { label: 'µV', factor: 1e-6 },
      { label: 'kV', factor: 1e3 },
      { label: 'MV', factor: 1e6 },
    ],
  },
  {
    name: 'Güç',
    base: 'W',
    units: [
      { label: 'W',  factor: 1 },
      { label: 'mW', factor: 1e-3 },
      { label: 'µW', factor: 1e-6 },
      { label: 'kW', factor: 1e3 },
      { label: 'MW', factor: 1e6 },
      { label: 'GW', factor: 1e9 },
    ],
  },
  {
    name: 'Kapasite',
    base: 'F',
    units: [
      { label: 'F',  factor: 1 },
      { label: 'mF', factor: 1e-3 },
      { label: 'µF', factor: 1e-6 },
      { label: 'nF', factor: 1e-9 },
      { label: 'pF', factor: 1e-12 },
    ],
  },
  {
    name: 'Frekans',
    base: 'Hz',
    units: [
      { label: 'Hz',  factor: 1 },
      { label: 'kHz', factor: 1e3 },
      { label: 'MHz', factor: 1e6 },
      { label: 'GHz', factor: 1e9 },
      { label: 'THz', factor: 1e12 },
    ],
  },
]

function fmtNum(n: number): string {
  if (!isFinite(n) || isNaN(n)) return 'Hata'
  // Show up to 8 significant figures without trailing zeros
  const s = parseFloat(n.toPrecision(8)).toString()
  // Use exponential for very large or very small
  if (Math.abs(n) > 0 && (Math.abs(n) >= 1e12 || (Math.abs(n) < 1e-8 && Math.abs(n) > 0))) {
    return n.toExponential(4)
  }
  return s
}

export default function UnitConverter() {
  const [catIdx, setCatIdx] = useState(0)
  const [fromIdx, setFromIdx] = useState(0)
  const [toIdx, setToIdx]     = useState(1)
  const [value, setValue]     = useState('')

  const cat   = CATEGORIES[catIdx]
  const from  = cat.units[fromIdx]
  const to    = cat.units[toIdx]

  function convert(): string {
    const v = parseFloat(value)
    if (isNaN(v)) return '—'
    // Convert: value in 'from' → base → 'to'
    const base = v * from.factor
    return fmtNum(base / to.factor)
  }

  function swapUnits() {
    const tmp = fromIdx
    setFromIdx(toIdx)
    setToIdx(tmp)
  }

  const result = convert()

  return (
    <div className="max-w-lg mx-auto px-4 py-6 flex flex-col gap-5">
      {/* Category tabs */}
      <div className="flex flex-col gap-2">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Kategori:</p>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c, i) => (
            <button
              key={i}
              onClick={() => { setCatIdx(i); setFromIdx(0); setToIdx(1); setValue('') }}
              className={cn(
                'px-3 py-2 rounded-xl border text-sm font-semibold transition-all',
                catIdx === i
                  ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/30'
                  : 'bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Input card */}
      <div className="bg-card rounded-2xl border border-border p-4 shadow-xl">
        <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2 block">
          Değer
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="Sayı girin..."
            className="flex-1 bg-transparent text-2xl font-mono font-bold text-foreground outline-none placeholder:text-muted-foreground/40 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          />
          <span className="text-primary font-mono font-bold text-lg">{from.label}</span>
        </div>
      </div>

      {/* Unit pickers */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        {/* From */}
        <div className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Birim</p>
          <div className="flex flex-wrap gap-1.5">
            {cat.units.map((u, i) => (
              <button
                key={i}
                onClick={() => setFromIdx(i)}
                className={cn(
                  'px-2.5 py-1.5 rounded-lg border text-sm font-mono font-medium transition-all',
                  fromIdx === i
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-surface text-muted-foreground border-border hover:text-foreground'
                )}
              >
                {u.label}
              </button>
            ))}
          </div>
        </div>

        {/* Swap button */}
        <button
          onClick={swapUnits}
          className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-primary hover:bg-surface-2 transition-colors mt-5"
          aria-label="Birimleri değiştir"
        >
          <svg viewBox="0 0 20 20" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 8l-3 3 3 3M15 8l3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 11h16" strokeLinecap="round" />
          </svg>
        </button>

        {/* To */}
        <div className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Sonuç birimi</p>
          <div className="flex flex-wrap gap-1.5">
            {cat.units.map((u, i) => (
              <button
                key={i}
                onClick={() => setToIdx(i)}
                className={cn(
                  'px-2.5 py-1.5 rounded-lg border text-sm font-mono font-medium transition-all',
                  toIdx === i
                    ? 'bg-green-dim/20 text-primary border-primary shadow-sm'
                    : 'bg-surface text-muted-foreground border-border hover:text-foreground'
                )}
              >
                {u.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="bg-card rounded-2xl border border-primary/40 p-5 shadow-xl shadow-primary/10">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3">Sonuç</p>
        <div className="text-center">
          <div className="text-4xl font-bold font-mono text-primary glow-text">
            {result} <span className="text-2xl">{to.label}</span>
          </div>
          {value && isFinite(parseFloat(value)) && (
            <p className="text-sm text-muted-foreground mt-2">
              {value} {from.label} = {result} {to.label}
            </p>
          )}
        </div>
      </div>

      {/* Quick conversion table */}
      {value && isFinite(parseFloat(value)) && (
        <div className="bg-card rounded-2xl border border-border p-4">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3">
            {value} {from.label} — Tüm birimler
          </p>
          <div className="flex flex-col gap-2">
            {cat.units.map((u, i) => {
              const v = parseFloat(value)
              const base = v * from.factor
              const converted = fmtNum(base / u.factor)
              return (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
                  <span className="text-muted-foreground text-sm">{u.label}</span>
                  <span className={cn(
                    'font-mono text-sm font-semibold',
                    i === toIdx ? 'text-primary' : 'text-foreground'
                  )}>{converted}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
