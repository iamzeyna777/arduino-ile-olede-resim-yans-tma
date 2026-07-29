'use client'

import { useState, useCallback, useRef } from 'react'
import { Delete, Clock, Copy, Share2, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'

type BtnVariant = 'digit' | 'op' | 'fn' | 'eq' | 'clear' | 'special'

interface CalcButton {
  label: string
  action: string
  variant: BtnVariant
  wide?: boolean
}

const BUTTONS: CalcButton[] = [
  // Row 1 — functions
  { label: 'sin',  action: 'sin',   variant: 'fn' },
  { label: 'cos',  action: 'cos',   variant: 'fn' },
  { label: 'tan',  action: 'tan',   variant: 'fn' },
  { label: 'ln',   action: 'ln',    variant: 'fn' },
  { label: 'log',  action: 'log',   variant: 'fn' },
  // Row 2
  { label: 'asin', action: 'asin',  variant: 'fn' },
  { label: 'acos', action: 'acos',  variant: 'fn' },
  { label: 'atan', action: 'atan',  variant: 'fn' },
  { label: 'π',    action: 'pi',    variant: 'fn' },
  { label: 'e',    action: 'euler', variant: 'fn' },
  // Row 3
  { label: '√',    action: 'sqrt',  variant: 'fn' },
  { label: 'x²',   action: 'sq',    variant: 'fn' },
  { label: 'xʸ',   action: '^',     variant: 'fn' },
  { label: '10ˣ',  action: '10^',   variant: 'fn' },
  { label: 'eˣ',   action: 'exp',   variant: 'fn' },
  // Row 4
  { label: '|x|',  action: 'abs',   variant: 'fn' },
  { label: 'n!',   action: '!',     variant: 'fn' },
  { label: '1/x',  action: 'inv',   variant: 'fn' },
  { label: 'mod',  action: '%',     variant: 'fn' },
  { label: '(',    action: '(',     variant: 'special' },
  // Row 5 — standard calculator
  { label: 'AC',   action: 'AC',    variant: 'clear' },
  { label: 'CE',   action: 'CE',    variant: 'clear' },
  { label: '±',    action: 'negate',variant: 'special' },
  { label: '%',    action: 'percent',variant: 'op' },
  { label: ')',    action: ')',     variant: 'special' },
  // Row 6
  { label: '7',    action: '7',     variant: 'digit' },
  { label: '8',    action: '8',     variant: 'digit' },
  { label: '9',    action: '9',     variant: 'digit' },
  { label: '÷',    action: '/',     variant: 'op' },
  { label: '⌫',    action: 'del',   variant: 'clear' },
  // Row 7
  { label: '4',    action: '4',     variant: 'digit' },
  { label: '5',    action: '5',     variant: 'digit' },
  { label: '6',    action: '6',     variant: 'digit' },
  { label: '×',    action: '*',     variant: 'op' },
  { label: '',     action: '',      variant: 'digit' }, // placeholder
  // Row 8
  { label: '1',    action: '1',     variant: 'digit' },
  { label: '2',    action: '2',     variant: 'digit' },
  { label: '3',    action: '3',     variant: 'digit' },
  { label: '-',    action: '-',     variant: 'op' },
  { label: '',     action: '',      variant: 'digit' }, // placeholder
  // Row 9
  { label: '0',    action: '0',     variant: 'digit', wide: true },
  { label: '.',    action: '.',     variant: 'digit' },
  { label: '+',    action: '+',     variant: 'op' },
  { label: '=',    action: '=',     variant: 'eq' },
]

function formatNum(n: number): string {
  if (!isFinite(n)) return isNaN(n) ? 'Hata' : n > 0 ? 'Sonsuz' : '-Sonsuz'
  const s = n.toPrecision(12)
  // Remove trailing zeros after decimal
  if (s.includes('.') && !s.includes('e')) {
    return parseFloat(s).toString()
  }
  return s
}

function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n) || n > 170) return NaN
  let r = 1
  for (let i = 2; i <= n; i++) r *= i
  return r
}

function evaluate(expr: string): number {
  try {
    // Replace display operators with JS
    let e = expr
      .replace(/×/g, '*').replace(/÷/g, '/')
      .replace(/π/g, String(Math.PI))
      .replace(/Euler/g, String(Math.E))
    // eslint-disable-next-line no-new-func
    return Function('"use strict"; return (' + e + ')')()
  } catch {
    return NaN
  }
}

export default function ScientificCalculator() {
  const [display, setDisplay] = useState('0')
  const [expression, setExpression] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [justEvaled, setJustEvaled] = useState(false)

  const processAction = useCallback((action: string) => {
    setJustEvaled(false)

    if (action === 'AC') {
      setDisplay('0')
      setExpression('')
      return
    }
    if (action === 'CE') {
      setDisplay('0')
      return
    }
    if (action === 'del') {
      if (justEvaled) { setDisplay('0'); setExpression(''); return }
      setDisplay(d => d.length > 1 ? d.slice(0, -1) : '0')
      return
    }

    // Digits and dots
    if ('0123456789.'.includes(action)) {
      if (justEvaled) {
        setDisplay(action === '.' ? '0.' : action)
        setExpression('')
        setJustEvaled(false)
        return
      }
      setDisplay(d => {
        if (action === '.' && d.includes('.')) return d
        if (d === '0' && action !== '.') return action
        return d + action
      })
      return
    }

    // Operators that work on current display value
    if (['+', '-', '*', '/', '^', '%'].includes(action)) {
      setExpression(e => (e || display) + action)
      setDisplay('0')
      return
    }
    if (action === '(' || action === ')') {
      setExpression(e => e + action)
      return
    }
    if (action === 'percent') {
      const val = parseFloat(display)
      setDisplay(formatNum(val / 100))
      return
    }
    if (action === 'negate') {
      setDisplay(d => d.startsWith('-') ? d.slice(1) : (d === '0' ? '0' : '-' + d))
      return
    }

    // Scientific functions that transform current display
    const val = parseFloat(display)
    let result: number | null = null
    switch (action) {
      case 'sqrt':   result = Math.sqrt(val); break
      case 'sq':     result = val * val; break
      case 'ln':     result = Math.log(val); break
      case 'log':    result = Math.log10(val); break
      case 'sin':    result = Math.sin(val * Math.PI / 180); break
      case 'cos':    result = Math.cos(val * Math.PI / 180); break
      case 'tan':    result = Math.tan(val * Math.PI / 180); break
      case 'asin':   result = Math.asin(val) * 180 / Math.PI; break
      case 'acos':   result = Math.acos(val) * 180 / Math.PI; break
      case 'atan':   result = Math.atan(val) * 180 / Math.PI; break
      case 'exp':    result = Math.exp(val); break
      case '10^':    result = Math.pow(10, val); break
      case 'abs':    result = Math.abs(val); break
      case '!':      result = factorial(Math.round(val)); break
      case 'inv':    result = 1 / val; break
      case 'pi':
        setDisplay(formatNum(Math.PI)); return
      case 'euler':
        setDisplay(formatNum(Math.E)); return
    }
    if (result !== null) {
      const res = formatNum(result)
      setHistory(h => [`${action}(${val}) = ${res}`, ...h.slice(0, 49)])
      setDisplay(res)
      setExpression('')
      setJustEvaled(true)
      return
    }

    // Equals
    if (action === '=') {
      const fullExpr = expression + display
      const raw = evaluate(fullExpr)
      const res = formatNum(raw)
      setHistory(h => [`${fullExpr} = ${res}`, ...h.slice(0, 49)])
      setDisplay(res)
      setExpression('')
      setJustEvaled(true)
    }
  }, [display, expression, justEvaled])

  const variantClasses: Record<BtnVariant, string> = {
    digit:   'bg-surface text-foreground hover:bg-surface-2 border border-border',
    op:      'bg-surface-2 text-primary hover:bg-surface border border-primary/30',
    fn:      'bg-surface text-green-dim hover:bg-surface-2 border border-border text-xs',
    eq:      'bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/40',
    clear:   'bg-destructive/20 text-destructive hover:bg-destructive/30 border border-destructive/30',
    special: 'bg-surface-2 text-foreground hover:bg-surface border border-border',
  }

  return (
    <div className="flex flex-col h-full max-w-lg mx-auto px-3 py-4 gap-3">
      {/* Display */}
      <div className="bg-card rounded-2xl border border-border p-4 shadow-xl">
        {/* Expression */}
        <div className="text-muted-foreground text-sm font-mono text-right min-h-[22px] truncate">
          {expression || '\u00A0'}
        </div>
        {/* Main display */}
        <div className={cn(
          'text-right font-mono font-bold text-4xl text-foreground mt-1 truncate',
          display.length > 12 && 'text-2xl',
          display.length > 16 && 'text-xl',
        )}>
          {display}
        </div>
        {/* Actions */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
          <button
            onClick={() => setShowHistory(h => !h)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <Clock size={13} />
            Geçmiş ({history.length})
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => navigator.clipboard.writeText(display)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
              title="Kopyala"
            >
              <Copy size={13} />
            </button>
            <button
              onClick={() => {
                if (navigator.share) navigator.share({ text: display })
                else navigator.clipboard.writeText(display)
              }}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
              title="Paylaş"
            >
              <Share2 size={13} />
            </button>
          </div>
        </div>

        {/* History panel */}
        {showHistory && history.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border max-h-40 overflow-y-auto flex flex-col gap-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">Hesap Geçmişi</span>
              <button onClick={() => setHistory([])} className="text-xs text-destructive hover:underline flex items-center gap-1">
                <RotateCcw size={11} /> Temizle
              </button>
            </div>
            {history.map((h, i) => (
              <button
                key={i}
                onClick={() => {
                  const parts = h.split(' = ')
                  if (parts[1]) setDisplay(parts[1])
                }}
                className="text-right text-xs font-mono text-muted-foreground hover:text-foreground transition-colors py-0.5"
              >
                {h}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Button Grid */}
      <div className="grid grid-cols-5 gap-2">
        {BUTTONS.map((btn, i) => {
          if (!btn.label) return <div key={i} />
          const isWide = btn.wide
          return (
            <button
              key={i}
              onClick={() => processAction(btn.action)}
              className={cn(
                'calc-btn h-12 rounded-xl font-semibold text-sm flex items-center justify-center',
                variantClasses[btn.variant],
                isWide && 'col-span-2',
              )}
              aria-label={btn.label}
            >
              {btn.label === '⌫'
                ? <Delete size={17} />
                : btn.label}
            </button>
          )
        })}
      </div>

      <p className="text-center text-xs text-muted-foreground pb-2">
        Trigonometrik fonksiyonlar derece cinsinden hesaplanır
      </p>
    </div>
  )
}
