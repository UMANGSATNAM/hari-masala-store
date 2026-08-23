'use client'

import { Download, FileText, Sparkles, ShieldAlert, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Settings } from '@/lib/types'
import { toast } from 'sonner'

export function PriceListBanner({ settings }: { settings?: Settings | null }) {
  const pdfUrl = settings?.priceListPdf || '/Hari_Masala_Price_List.pdf'

  const handleDownload = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (typeof window === 'undefined' || typeof document === 'undefined') return
    toast.success('Downloading Hari Masala Price List PDF...')
    const link = document.createElement('a')
    link.href = pdfUrl
    link.download = 'Hari_Masala_Price_List.pdf'
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 my-6 sm:my-8">
      <div
        onClick={handleDownload}
        className="group relative cursor-pointer overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-900 via-red-900 to-amber-950 text-white p-5 sm:p-7 shadow-xl transition-all duration-300 hover:shadow-2xl hover:border-amber-400/60 hover:scale-[1.005]"
      >
        {/* Background decorative elements */}
        <div className="absolute -right-12 -bottom-12 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl group-hover:bg-amber-400/20 transition-all" />
        <div className="absolute top-0 right-1/4 h-24 w-24 rounded-full bg-red-500/10 blur-2xl" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
          {/* Left Info */}
          <div className="flex items-start gap-4 text-left">
            <div className="shrink-0 grid place-items-center h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-amber-500/20 border border-amber-400/30 text-amber-300 group-hover:scale-110 group-hover:bg-amber-500/30 transition-all duration-300">
              <FileText className="h-6 w-6 sm:h-7 sm:w-7" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                  <Sparkles className="h-3 w-3" /> Official Price List PDF
                </span>
                <span className="text-[10px] text-amber-200/80 font-medium">
                  Updated Catalog 2026
                </span>
              </div>

              <h3 className="text-lg sm:text-2xl font-black text-amber-100 group-hover:text-amber-300 transition-colors">
                Download Our Complete Price List <span lang="gu" className="text-base sm:text-xl font-bold opacity-90 ml-1.5">(દર પત્રક / Price List)</span>
              </h3>

              <p className="text-xs sm:text-sm text-amber-100/80 mt-1 max-w-2xl leading-relaxed">
                Get our full list of 75+ authentic whole spices, ground masalas, mukhwas & dry fruits with wholesale/retail rates directly in PDF format.
              </p>
            </div>
          </div>

          {/* Right Action CTA */}
          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto h-12 px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-extrabold text-sm shadow-lg group-hover:shadow-amber-500/20 transition-all duration-300"
            >
              <Download className="h-4 w-4 mr-2 group-hover:animate-bounce" />
              Download Price List (PDF)
              <ArrowRight className="h-4 w-4 ml-2 opacity-80 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
