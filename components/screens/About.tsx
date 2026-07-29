'use client'

import { Zap, Mail, Globe, Shield, Star, Code2, Cpu } from 'lucide-react'

const FEATURES = [
  { icon: <Cpu size={18} />,  label: 'Bilimsel Hesap Makinesi', desc: 'Trigonometri, logaritma, faktöriyel ve daha fazlası' },
  { icon: <Zap size={18} />,  label: "Ohm Kanunu",               desc: 'V, I, R — herhangi birini hesaplayın' },
  { icon: <Star size={18} />, label: 'Güç Hesabı',               desc: 'P = V × I formülü ile güç analizi' },
  { icon: <Code2 size={18} />,label: 'Direnç Renk Kodu',         desc: '4, 5 ve 6 bant direnç okuma' },
  { icon: <Globe size={18} />,label: 'Birim Dönüştürücü',         desc: 'Direnç, akım, voltaj, güç, kapasite, frekans' },
]

export default function About() {
  return (
    <div className="max-w-lg mx-auto px-4 py-6 flex flex-col gap-6">
      {/* App identity card */}
      <div className="bg-card rounded-2xl border border-border p-6 shadow-xl flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/40">
          <Zap size={40} className="text-primary-foreground" strokeWidth={2} />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">ElectroCalc</h1>
          <p className="text-muted-foreground text-sm mt-1">Profesyonel Elektronik Hesap Makinesi</p>
          <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full bg-primary/10 border border-primary/30">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-xs text-primary font-semibold">Sürüm 1.0.0</span>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-card rounded-2xl border border-border p-5 shadow-xl">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Özellikler</h2>
        <div className="flex flex-col gap-3">
          {FEATURES.map((f, i) => (
            <div key={i} className="flex items-start gap-3 py-2 border-b border-border/50 last:border-0">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                {f.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{f.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Developer info */}
      <div className="bg-card rounded-2xl border border-border p-5 shadow-xl">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Geliştirici</h2>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center text-muted-foreground">
              <Code2 size={16} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Geliştirici</p>
              <p className="text-sm font-medium text-foreground">ElectroCalc Team</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center text-muted-foreground">
              <Mail size={16} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">İletişim</p>
              <p className="text-sm font-medium text-foreground">info@electroplc.app</p>
            </div>
          </div>
        </div>
      </div>

      {/* Legal */}
      <div className="bg-card rounded-2xl border border-border p-5 shadow-xl">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Yasal</h2>
        <div className="flex flex-col gap-3">
          <button className="flex items-center gap-3 py-2 border-b border-border/50 w-full text-left">
            <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center text-muted-foreground">
              <Shield size={16} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Gizlilik Politikası</p>
              <p className="text-xs text-muted-foreground">Veri toplama ve kullanım politikamız</p>
            </div>
            <svg className="ml-auto text-muted-foreground" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button className="flex items-center gap-3 py-2 w-full text-left">
            <div className="w-8 h-8 rounded-lg bg-surface-2 flex items-center justify-center text-muted-foreground">
              <Globe size={16} />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Kullanım Koşulları</p>
              <p className="text-xs text-muted-foreground">Uygulama kullanım şartları</p>
            </div>
            <svg className="ml-auto text-muted-foreground" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Built with */}
      <div className="rounded-2xl border border-border/50 p-4 text-center">
        <p className="text-xs text-muted-foreground">
          Next.js &amp; Tailwind CSS ile geliştirilmiştir
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          &copy; 2025 ElectroCalc. Tüm hakları saklıdır.
        </p>
      </div>
    </div>
  )
}
