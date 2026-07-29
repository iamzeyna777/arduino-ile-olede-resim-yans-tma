'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

type BandMode = 4 | 5 | 6

interface ColorDef {
  name: string
  bg: string        // Tailwind bg class
  hex: string       // actual color for inline styles
  digit: number | null
  multiplier: number | null
  tolerance: string | null
  tempco: string | null
}

const COLORS: ColorDef[] = [
  { name: 'Siyah',      bg: 'bg-[#1a1a1a]', hex: '#1a1a1a',  digit: 0,  multiplier: 1,       tolerance: null,   tempco: '250 ppm/K' },
  { name: 'Kahverengi', bg: 'bg-[#8B4513]', hex: '#8B4513',  digit: 1,  multiplier: 10,      tolerance: '±1%',  tempco: '100 ppm/K' },
  { name: 'Kırmızı',   bg: 'bg-[#CC2200]', hex: '#CC2200',  digit: 2,  multiplier: 100,     tolerance: '±2%',  tempco: '50 ppm/K'  },
  { name: 'Turuncu',   bg: 'bg-[#FF6600]', hex: '#FF6600',  digit: 3,  multiplier: 1000,    tolerance: null,   tempco: '15 ppm/K'  },
  { name: 'Sarı',      bg: 'bg-[#FFD700]', hex: '#FFD700',  digit: 4,  multiplier: 10000,   tolerance: null,   tempco: '25 ppm/K'  },
  { name: 'Yeşil',     bg: 'bg-[#228B22]', hex: '#228B22',  digit: 5,  multiplier: 100000,  tolerance: '±0.5%',tempco: '20 ppm/K'  },
  { name: 'Mavi',      bg: 'bg-[#1E5FAD]', hex: '#1E5FAD',  digit: 6,  multiplier: 1000000, tolerance: '±0.25%',tempco:'10 ppm/K'  },
  { name: 'Mor',       bg: 'bg-[#7B2D8B]', hex: '#7B2D8B',  digit: 7,  multiplier: 1e7,     tolerance: '±0.1%',tempco: '5 ppm/K'   },
  { name: 'Gri',       bg: 'bg-[#808080]', hex: '#808080',  digit: 8,  multiplier: 1e8,     tolerance: '±0.05%',tempco: '1 ppm/K'  },
  { name: 'Beyaz',     bg: 'bg-[#F5F5F5]', hex: '#F5F5F5',  digit: 9,  multiplier: 1e9,     tolerance: null,   tempco: null        },
  { name: 'Altın',     bg: 'bg-[#CFB53B]', hex: '#CFB53B',  digit: null, multiplier: 0.1,   tolerance: '±5%',  tempco: null        },
  { name: 'Gümüş',    bg: 'bg-[#C0C0C0]', hex: '#C0C0C0',  digit: null, multiplier: 0.01,  tolerance: '±10%', tempco: null        },
]

function fmtResistance(ohm: number): string {
  if (!isFinite(ohm) || isNaN(ohm) || ohm <= 0) return 'Hata'
  if (ohm >= 1e9) return `${(ohm / 1e9).toPrecision(3)} GΩ`
  if (ohm >= 1e6) return `${(ohm / 1e6).toPrecision(3)} MΩ`
  if (ohm >= 1e3) return `${(ohm / 1e3).toPrecision(3)} kΩ`
  return `${ohm.toPrecision(3)} Ω`
}

export default function ResistorColor() {
  const [bands, setBands] = useState(4)
  const [selected, setSelected] = useState<(number | null)[]>([1, 0, 1, 10]) // indices into COLORS

  function setBand(bandIdx: number, colorIdx: number) {
    const next = [...selected]
    next[bandIdx] = colorIdx
    setSelected(next)
  }

  function compute(): { value: string; tolerance: string; tempco?: string } {
    if (bands === 4) {
      const [d1, d2, mul, tol] = selected
      if (d1 === null || d2 === null || mul === null || tol === null) return { value: '—', tolerance: '—' }
      const c1 = COLORS[d1], c2 = COLORS[d2], cm = COLORS[mul], ct = COLORS[tol]
      if (c1.digit === null || c2.digit === null || cm.multiplier === null || ct.tolerance === null)
        return { value: 'Hata', tolerance: 'Hata' }
      const ohm = (c1.digit * 10 + c2.digit) * cm.multiplier
      return { value: fmtResistance(ohm), tolerance: ct.tolerance }
    }
    if (bands === 5) {
      const [d1, d2, d3, mul, tol] = selected
      if (d1 === null || d2 === null || d3 === null || mul === null || tol === null) return { value: '—', tolerance: '—' }
      const c1 = COLORS[d1], c2 = COLORS[d2], c3 = COLORS[d3], cm = COLORS[mul], ct = COLORS[tol]
      if (c1.digit === null || c2.digit === null || c3.digit === null || cm.multiplier === null || ct.tolerance === null)
        return { value: 'Hata', tolerance: 'Hata' }
      const ohm = (c1.digit * 100 + c2.digit * 10 + c3.digit) * cm.multiplier
      return { value: fmtResistance(ohm), tolerance: ct.tolerance }
    }
    // 6 bands
    const [d1, d2, d3, mul, tol, tc] = selected
    if (d1 === null || d2 === null || d3 === null || mul === null || tol === null || tc === null)
      return { value: '—', tolerance: '—' }
    const c1 = COLORS[d1], c2 = COLORS[d2], c3 = COLORS[d3], cm = COLORS[mul], ct = COLORS[tol], cc = COLORS[tc]
    if (c1.digit === null || c2.digit === null || c3.digit === null || cm.multiplier === null || ct.tolerance === null)
      return { value: 'Hata', tolerance: 'Hata' }
    const ohm = (c1.digit * 100 + c2.digit * 10 + c3.digit) * cm.multiplier
    return { value: fmtResistance(ohm), tolerance: ct.tolerance, tempco: cc.tempco ?? '—' }
  }

  const result = compute()

  // Band config
  const bandConfigs = {
    4: [
      { label: '1. Bant', type: 'digit' },
      { label: '2. Bant', type: 'digit' },
      { label: 'Çarpan',  type: 'multiplier' },
      { label: 'Tolerans', type: 'tolerance' },
    ],
    5: [
      { label: '1. Bant', type: 'digit' },
      { label: '2. Bant', type: 'digit' },
      { label: '3. Bant', type: 'digit' },
      { label: 'Çarpan',  type: 'multiplier' },
      { label: 'Tolerans', type: 'tolerance' },
    ],
    6: [
      { label: '1. Bant', type: 'digit' },
      { label: '2. Bant', type: 'digit' },
      { label: '3. Bant', type: 'digit' },
      { label: 'Çarpan',  type: 'multiplier' },
      { label: 'Tolerans', type: 'tolerance' },
      { label: 'Sıcaklık Katsayısı', type: 'tempco' },
    ],
  }

  function filteredColors(type: string): ColorDef[] {
    if (type === 'digit')      return COLORS.filter(c => c.digit !== null)
    if (type === 'multiplier') return COLORS.filter(c => c.multiplier !== null)
    if (type === 'tolerance')  return COLORS.filter(c => c.tolerance !== null)
    if (type === 'tempco')     return COLORS.filter(c => c.tempco !== null)
    return COLORS
  }

  const currentBands = bandConfigs[bands as BandMode]
  const bandColors = selected.slice(0, bands).map(i => i !== null ? COLORS[i] : null)

  return (
    <div className="max-w-lg mx-auto px-4 py-6 flex flex-col gap-6">
      {/* Band count selector */}
      <div className="flex gap-2">
        {[4, 5, 6].map(n => (
          <button
            key={n}
            onClick={() => {
              setBands(n)
              if (n === 4) setSelected([1, 0, 1, 10])
              if (n === 5) setSelected([1, 0, 0, 1, 10])
              if (n === 6) setSelected([1, 0, 0, 1, 10, 0])
            }}
            className={cn(
              'flex-1 py-3 rounded-xl border text-sm font-semibold transition-all',
              bands === n
                ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/30'
                : 'bg-card text-muted-foreground border-border hover:border-primary/50'
            )}
          >
            {n} Bant
          </button>
        ))}
      </div>

      {/* Resistor visual */}
      <div className="bg-card rounded-2xl border border-border p-5 shadow-xl">
        <p className="text-xs text-muted-foreground text-center mb-4 uppercase tracking-wider">Direnç Önizleme</p>
        <div className="flex items-center justify-center gap-0">
          {/* Left lead */}
          <div className="w-8 h-1 bg-foreground/40 rounded" />
          {/* Body */}
          <div className="relative flex items-center h-10 bg-[#D4A843] rounded-lg px-2 gap-1.5 shadow-lg min-w-[160px] justify-center">
            {bandColors.map((c, i) => (
              <div
                key={i}
                className="w-3 h-8 rounded-sm shadow-inner"
                style={{ backgroundColor: c?.hex ?? '#888' }}
                title={c?.name}
              />
            ))}
          </div>
          {/* Right lead */}
          <div className="w-8 h-1 bg-foreground/40 rounded" />
        </div>

        {/* Result display */}
        <div className="mt-5 text-center">
          <div className="text-4xl font-bold font-mono text-primary glow-text">{result.value}</div>
          <div className="text-base text-foreground mt-1">Tolerans: <span className="text-primary font-semibold">{result.tolerance}</span></div>
          {result.tempco && (
            <div className="text-sm text-muted-foreground mt-0.5">Sıcaklık Katsayısı: <span className="text-foreground">{result.tempco}</span></div>
          )}
        </div>
      </div>

      {/* Band selectors */}
      <div className="flex flex-col gap-4">
        {currentBands.map((bandDef, bandIdx) => {
          const selIdx = selected[bandIdx]
          const selColor = selIdx !== null ? COLORS[selIdx] : null
          const available = filteredColors(bandDef.type)

          return (
            <div key={bandIdx} className="bg-card rounded-2xl border border-border p-4">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-4 h-6 rounded"
                  style={{ backgroundColor: selColor?.hex ?? '#888' }}
                />
                <p className="text-sm font-medium text-foreground">{bandDef.label}</p>
                <span className="ml-auto text-xs text-muted-foreground">
                  {selColor?.name ?? '—'}
                  {bandDef.type === 'digit' && selColor?.digit !== null && selColor?.digit !== undefined && ` (${selColor.digit})`}
                  {bandDef.type === 'tolerance' && selColor?.tolerance && ` ${selColor.tolerance}`}
                  {bandDef.type === 'tempco' && selColor?.tempco && ` ${selColor.tempco}`}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {available.map(c => {
                  const cIdx = COLORS.indexOf(c)
                  const isSelected = selIdx === cIdx
                  return (
                    <button
                      key={c.name}
                      onClick={() => setBand(bandIdx, cIdx)}
                      title={c.name}
                      className={cn(
                        'w-9 h-9 rounded-lg transition-all border-2',
                        isSelected ? 'border-primary scale-110 shadow-lg' : 'border-transparent hover:border-border',
                        c.hex === '#F5F5F5' && 'border-border'
                      )}
                      style={{ backgroundColor: c.hex }}
                      aria-label={c.name}
                      aria-pressed={isSelected}
                    />
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
