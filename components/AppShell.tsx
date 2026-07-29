'use client'

import { useState, useEffect } from 'react'
import { X, Menu, Calculator, Zap, Battery, Palette, RefreshCw, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

export type Screen = 'calculator' | 'ohm' | 'power' | 'resistor' | 'converter' | 'about'

const NAV_ITEMS: { id: Screen; label: string; icon: React.ReactNode }[] = [
  { id: 'calculator', label: 'Bilimsel Hesap Makinesi', icon: <Calculator size={20} /> },
  { id: 'ohm',        label: 'Ohm Kanunu',              icon: <Zap size={20} /> },
  { id: 'power',      label: 'Güç Hesabı',              icon: <Battery size={20} /> },
  { id: 'resistor',   label: 'Direnç Renk Kodu',        icon: <Palette size={20} /> },
  { id: 'converter',  label: 'Birim Dönüştürücü',        icon: <RefreshCw size={20} /> },
  { id: 'about',      label: 'Hakkında',                 icon: <Info size={20} /> },
]

const SCREEN_TITLES: Record<Screen, string> = {
  calculator: 'Bilimsel Hesap Makinesi',
  ohm:        'Ohm Kanunu',
  power:      'Güç Hesabı',
  resistor:   'Direnç Renk Kodu',
  converter:  'Birim Dönüştürücü',
  about:      'Hakkında',
}

interface AppShellProps {
  children: (screen: Screen) => React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const [screen, setScreen] = useState<Screen>('calculator')
  const [menuOpen, setMenuOpen] = useState(false)
  const [prevScreen, setPrevScreen] = useState<Screen>('calculator')
  const [animKey, setAnimKey] = useState(0)

  function navigate(s: Screen) {
    if (s === screen) { setMenuOpen(false); return }
    setPrevScreen(screen)
    setScreen(s)
    setAnimKey(k => k + 1)
    setMenuOpen(false)
  }

  // Close menu on escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="min-h-screen bg-background pcb-bg flex flex-col select-none">
      {/* Top App Bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-background/90 backdrop-blur-md border-b border-border">
        {/* Logo + Title */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
            <Zap size={16} className="text-primary-foreground" strokeWidth={2.5} />
          </div>
          <div>
            <span className="text-sm font-bold text-foreground tracking-wide">ElectroCalc</span>
            <p className="text-xs text-muted-foreground leading-none mt-0.5">{SCREEN_TITLES[screen]}</p>
          </div>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Menüyü aç/kapat"
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface border border-border text-foreground hover:bg-surface-2 hover:text-primary transition-colors"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Drawer overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 fade-in"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Drawer panel */}
          <nav
            className="absolute top-0 right-0 h-full w-72 bg-surface border-l border-border flex flex-col py-6 px-4 gap-1 slide-in"
            onClick={e => e.stopPropagation()}
            aria-label="Ana Navigasyon"
          >
            {/* Drawer Header */}
            <div className="flex items-center gap-3 mb-6 px-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                <Zap size={18} className="text-primary-foreground" strokeWidth={2.5} />
              </div>
              <div>
                <p className="font-bold text-foreground text-base">ElectroCalc</p>
                <p className="text-xs text-muted-foreground">v1.0.0</p>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="ml-auto w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Menüyü kapat"
              >
                <X size={16} />
              </button>
            </div>

            {/* PCB divider */}
            <div className="h-px bg-border mb-4 mx-2" />

            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-150',
                  screen === item.id
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/30'
                    : 'text-muted-foreground hover:bg-surface-2 hover:text-foreground'
                )}
              >
                <span className={cn(screen === item.id ? 'text-primary-foreground' : 'text-primary')}>
                  {item.icon}
                </span>
                {item.label}
                {screen === item.id && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                )}
              </button>
            ))}
          </nav>
        </div>
      )}

      {/* Screen content */}
      <main className="flex-1 overflow-auto" key={animKey}>
        <div className="slide-in">
          {children(screen)}
        </div>
      </main>
    </div>
  )
}
