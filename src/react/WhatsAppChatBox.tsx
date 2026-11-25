"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, Send } from "lucide-react";
import { SITE_CONFIG, site } from "./cmsData";


const DEFAULT_MESSAGE = site.uiLabels.chatDefaultMessage;

function withPrefilledText(baseUrl: string, text: string) {
  const separator = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${separator}text=${encodeURIComponent(text)}`;
}

export function WhatsAppChatBox({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);

  const whatsappHref = useMemo(() => withPrefilledText(SITE_CONFIG.whatsappUrl, message || DEFAULT_MESSAGE), [message]);

  return (
    <div className={cn("fixed bottom-5 right-5 z-[90]", className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="mb-3 w-[min(340px,calc(100vw-2.5rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3">
              <div className="min-w-0">
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">WhatsApp support</p>
                <p className="truncate text-sm font-black text-[#1A284D]">Chat with us</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-white hover:text-slate-700"
                aria-label="Close WhatsApp chat box"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 p-4">
              <p className="text-xs font-medium leading-relaxed text-slate-600">
                Send a quick message and we&apos;ll reply on WhatsApp.
              </p>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-[#1A284D] outline-none ring-0 transition-colors placeholder:text-slate-400 focus:border-[#FF5C00]"
                placeholder="Type your message..."
              />

              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-black text-white shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99]"
              >
                <Send className="h-4 w-4" />
                Open WhatsApp Chat
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "group flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-3 shadow-xl transition-all hover:border-slate-300 hover:shadow-2xl",
          open && "bg-slate-50"
        )}
        aria-label={open ? "Close WhatsApp chat box" : "Open WhatsApp chat box"}
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white shadow-md shadow-emerald-200">
          <MessageCircle className="h-5 w-5" />
        </span>
        <span className="hidden pr-1 text-left sm:block">
          <span className="block text-xs font-black uppercase tracking-widest text-slate-400">Need help?</span>
          <span className="block text-sm font-black text-[#1A284D] group-hover:text-[#FF5C00]">Chat on WhatsApp</span>
        </span>
      </button>
    </div>
  );
}
