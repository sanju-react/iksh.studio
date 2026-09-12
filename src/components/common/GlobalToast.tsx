import React, { useState, useEffect } from 'react';
import { Mail, Check, ExternalLink, Copy, X, Sparkles } from 'lucide-react';
import { copyTextToClipboard } from '../../utils/contact';

interface ToastData {
  title: string;
  message: string;
  email?: string;
  gmailUrl?: string;
  mailtoUrl?: string;
  type?: 'success' | 'info';
}

export const GlobalToast: React.FC = () => {
  const [toast, setToast] = useState<ToastData | null>(null);
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent<ToastData>;
      if (customEvent.detail) {
        setToast(customEvent.detail);
        setIsVisible(true);
        setCopied(false);
      }
    };

    window.addEventListener('iksh-toast', handleToastEvent);
    return () => window.removeEventListener('iksh-toast', handleToastEvent);
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 7000);
    return () => clearTimeout(timer);
  }, [isVisible, toast]);

  if (!isVisible || !toast) return null;

  const handleCopyAgain = async () => {
    if (toast.email) {
      await copyTextToClipboard(toast.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-[9999] max-w-md w-[calc(100vw-2rem)] sm:w-auto animate-fadeIn select-none">
      <div className="relative overflow-hidden rounded-2xl bg-forest-950/95 border border-accent-gold/40 p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(216,195,158,0.15)] backdrop-blur-2xl text-ivory-100">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 rounded-full bg-accent-emerald/20 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-32 h-32 rounded-full bg-accent-gold/15 blur-2xl pointer-events-none" />

        <div className="flex items-start gap-3.5 relative z-10">
          {/* Icon Badge */}
          <div className="w-10 h-10 rounded-xl bg-accent-gold/15 border border-accent-gold/30 flex items-center justify-center flex-shrink-0 text-accent-gold">
            <Sparkles className="w-5 h-5" />
          </div>

          <div className="flex-1 min-w-0 pr-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent-gold">
                {toast.title}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-sage-200 mt-1 leading-relaxed">
              {toast.message}
            </p>

            {/* Quick Action Pills */}
            <div className="mt-3.5 flex flex-wrap items-center gap-2 pt-2 border-t border-sage-300/15">
              {toast.gmailUrl && (
                <a
                  href={toast.gmailUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-gold text-forest-950 hover:bg-ivory-100 font-mono text-[11px] font-semibold tracking-wider transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Open Gmail</span>
                </a>
              )}

              {toast.mailtoUrl && (
                <a
                  href={toast.mailtoUrl}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-forest-850 border border-sage-300/20 text-ivory-200 hover:text-accent-gold hover:border-accent-gold font-mono text-[11px] tracking-wider transition-colors cursor-pointer"
                >
                  <Mail className="w-3 h-3" />
                  <span>Mail App</span>
                </a>
              )}

              {toast.email && (
                <button
                  type="button"
                  onClick={handleCopyAgain}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-forest-900 border border-sage-300/15 text-sage-300 hover:text-ivory-200 font-mono text-[11px] tracking-wider transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy Email</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={() => setIsVisible(false)}
            aria-label="Close notification"
            className="absolute top-2 right-2 p-1.5 rounded-lg text-sage-400 hover:text-white hover:bg-forest-900/60 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Auto dismiss countdown bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-forest-800">
          <div className="h-full bg-gradient-to-r from-accent-gold to-accent-emerald animate-progress" />
        </div>
      </div>
    </div>
  );
};
