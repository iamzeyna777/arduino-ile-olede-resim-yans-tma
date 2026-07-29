'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

type Solve = 'V' | 'I' | 'R'

function formatResult(val: number, unit: string): string {
  if (!isFinite(val) || isNaN(val)) return 'Hata'
  if (Math.abs(val) >= 1e6) return `${(val / 1e6).toPrecision(4)} M${unit}`
  if (Math.abs(val) >= 1e3) return `${(val / 1e3).toPrecision(4)} k${unit}`
  if (Math.abs(val) >= 1)   return `${val.toPrecision(4)} ${unit}`
  if (Math.abs(val) >= 1e-3) return `${(val * 1e3).toPrecision(4)} m${unit}`
  if (Math.abs(val) >= 1e-6) return `${(val * 1e6).toPrecision(4)} µ${unit}`
  return `${val.toPrecision(4)} ${unit}`
}

export default function OhmLaw() {
  const [solve, setSolve] = useState<Solve>('V')
  const [a, setA] = useState('')
  const [b, setB] = useState('')

  const labels: Record<Solve, [string, string, string, string]> = {
    V: ['Akım (I)', 'A', 'Direnç (R)', 'Ω'],
    I: ['Voltaj (V)', 'V', 'Direnç (R)', 'Ω'],
    R: ['Voltaj (V)', 'V', 'Akım (I)', 'A'],
  }

  function compute(): string {
    const aVal = parseFloat(a)
    const bVal = parseFloat(b)
    if (isNaN(aVal) || isNaN(bVal)) return '—'
    switch (solve) {
      case 'V': return formatResult(aVal * bVal, 'V')  // V = I × R
      case 'I': return formatResult(aVal / bVal, 'A')  // I = V / R
      case 'R': return formatResult(aVal / bVal, 'Ω')  // R = V / I
    }
  }

  const result = compute()
  const [aLabel, aUnit, bLabel, bUnit] = labels[solve]

  const TABS: { id: Solve; label: string; formula: string }[] = [
    { id: 'V', label: 'Voltaj', formula: 'V = I × R' },
    { id: 'I', label: 'Akım',   formula: 'I = V / R' },
    { id: 'R', label: 'Direnç', formula: 'R = V / I' },
  ]

  return (
    <div className="max-w-lg mx-auto px-4 py-6 flex flex-col gap-6">
      {/* Formula diagram */}
      <div className="bg-card rounded-2xl border border-border p-5 shadow-xl">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="text-xl font-bold text-primary font-mono">V = I × R</div>
        </div>
        {/* Ohm's triangle */}
        <div className="flex justify-center">
          <div className="relative w-48 h-36">
            <svg viewBox="0 0 160 110" className="w-full h-full">
              {/* Triangle */}
              <polygon points="80,8 8,100 152,100" fill="none" stroke="oklch(0.72 0.21 145 / 0.6)" strokeWidth="2" />
              {/* Divider */}
              <line x1="8" y1="54" x2="152" y2="54" stroke="oklch(0.72 0.21 145 / 0.6)" strokeWidth="2" />
              {/* V */}
              <text x="80" y="48" textAnchor="middle" fill="oklch(0.72 0.21 145)" fontSize="22" fontWeight="bold" fontFamily="monospace">V</text>
              {/* I */}
              <text x="45" y="92" textAnchor="middle" fill="oklch(0.85 0.05 150)" fontSize="20" fontWeight="bold" fontFamily="monospace">I</text>
              {/* R */}
              <text x="115" y="92" textAnchor="middle" fill="oklch(0.85 0.05 150)" fontSize="20" fontWeight="bold" fontFamily="monospace">R</text>
            </svg>
          </div>
        </div>
      </div>

      {/* Solve for tabs */}
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
              <span className="font-mono text-lg leading-none mb-1">{t.id}</span>
              <span className="text-xs opacity-80">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Inputs */}
      <div className="flex flex-col gap-4">
        <div className="bg-card rounded-2xl border border-border p-4">
          <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2 block">
            {aLabel}
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={a}
              onChange={e => setA(e.target.value)}
              placeholder="Değer girin..."
              className="flex-1 bg-transparent text-2xl font-mono font-bold text-foreground outline-none placeholder:text-muted-foreground/40 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <span className="text-primary font-mono font-bold text-lg">{aUnit}</span>
          </div>
        </div>

        <div className="bg-card rounded-2xl border border-border p-4">
          <label className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-2 block">
            {bLabel}
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={b}
              onChange={e => setB(e.target.value)}
              placeholder="Değer girin..."
              className="flex-1 bg-transparent text-2xl font-mono font-bold text-foreground outline-none placeholder:text-muted-foreground/40 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <span className="text-primary font-mono font-bold text-lg">{bUnit}</span>
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="bg-card rounded-2xl border border-primary/40 p-5 shadow-xl shadow-primary/10">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-3">Sonuç</p>
        <div className="text-center">
          <div className="text-5xl font-bold font-mono text-primary glow-text">
            {result}
          </div>
          <div className="text-sm text-muted-foreground mt-2">
            {TABS.find(t => t.id === solve)?.formula}
          </div>
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
