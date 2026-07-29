'use client'

import { AppShell } from '@/components/AppShell'
import ScientificCalculator from '@/components/screens/ScientificCalculator'
import OhmLaw from '@/components/screens/OhmLaw'
import PowerCalc from '@/components/screens/PowerCalc'
import ResistorColor from '@/components/screens/ResistorColor'
import UnitConverter from '@/components/screens/UnitConverter'
import About from '@/components/screens/About'
import type { Screen } from '@/components/AppShell'

export default function Home() {
  return (
    <AppShell>
      {(screen: Screen) => {
        switch (screen) {
          case 'calculator': return <ScientificCalculator />
          case 'ohm':        return <OhmLaw />
          case 'power':      return <PowerCalc />
          case 'resistor':   return <ResistorColor />
          case 'converter':  return <UnitConverter />
          case 'about':      return <About />
        }
      }}
    </AppShell>
  )
}
