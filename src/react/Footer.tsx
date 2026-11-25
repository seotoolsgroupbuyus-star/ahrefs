import { motion } from "motion/react";

import { Twitter, Facebook, Linkedin, ArrowRight } from "lucide-react";
import { SITE_CONFIG, site } from "./cmsData";

const social = [
  { Icon: Twitter, label: "Twitter", href: "#" },
  { Icon: Facebook, label: "Facebook", href: "#" },
  { Icon: Linkedin, label: "LinkedIn", href: "#" },
] as const;

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#1A284D] text-white">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"
        aria-hidden
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="grid gap-10 md:grid-cols-12 md:gap-12"
        >
          <div className="md:col-span-6 lg:col-span-5">
            <p className="text-xs font-black uppercase tracking-[0.24em] text-blue-300/90">
              {SITE_CONFIG.name}
            </p>
            <p className="mt-4 max-w-xl text-sm font-medium leading-relaxed text-white/70">
              {site.footerText}
            </p>
          </div>

          <div className="md:col-span-6 lg:col-span-7">
            <div className="grid gap-10 sm:grid-cols-2">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-blue-300/90">{site.uiLabels.footerPagesTitle}</p>
                <ul className="mt-4 space-y-3 text-sm font-semibold text-white/70">
                  {site.footerMenu.map(item=><li key={item.label}><a className="transition-colors hover:text-white" href={item.url}>{item.label}</a></li>)}
                </ul>
              </div>

              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-blue-300/90">{site.uiLabels.footerSupportTitle}</p>
                <p className="mt-4 text-sm font-medium leading-relaxed text-white/70">
                  {site.uiLabels.footerSupportDescription}
                </p>
                <a
                  href={SITE_CONFIG.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-black uppercase tracking-widest text-[#1A284D] shadow-xl transition-transform hover:-translate-y-0.5"
                >
                  {site.uiLabels.footerSupportLabel} <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-10 border-t border-white/10 pt-6">
          <div className="flex flex-col items-center justify-center gap-3 text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-white/45">
              © {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}