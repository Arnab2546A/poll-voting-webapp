import { useEffect, useMemo, useState } from "react";

export default function Alert({
  isOpen,
  message,
  type = "info",
  onClose,
  onConfirm,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const isConfirm = type === "confirm";

  useEffect(() => {
    let showTimer;
    let inTimer;
    let outTimer;
    let hideTimer;

    if (isOpen) {
      showTimer = setTimeout(() => setIsVisible(true), 0);
      inTimer = setTimeout(() => setIsAnimating(true), 10);

      if (!isConfirm) {
        outTimer = setTimeout(() => {
          setIsAnimating(false);
          hideTimer = setTimeout(() => {
            setIsVisible(false);
            onClose?.();
          }, 280);
        }, 3200);
      }
    } else {
      showTimer = setTimeout(() => setIsAnimating(false), 0);
      outTimer = setTimeout(() => {
        setIsVisible(false);
      }, 280);
    }

    return () => {
      clearTimeout(showTimer);
      clearTimeout(inTimer);
      clearTimeout(outTimer);
      clearTimeout(hideTimer);
    };
  }, [isOpen, isConfirm, onClose]);

  const variants = useMemo(
    () => ({
      info: {
        glow: "shadow-[0_16px_36px_rgba(37,99,235,0.28)]",
        bar: "bg-gradient-to-r from-blue-500 to-cyan-500",
        iconWrap: "bg-blue-100 text-blue-700",
        title: "Info",
      },
      success: {
        glow: "shadow-[0_16px_36px_rgba(5,150,105,0.26)]",
        bar: "bg-gradient-to-r from-emerald-500 to-teal-500",
        iconWrap: "bg-emerald-100 text-emerald-700",
        title: "Success",
      },
      warning: {
        glow: "shadow-[0_16px_36px_rgba(217,119,6,0.26)]",
        bar: "bg-gradient-to-r from-amber-500 to-orange-500",
        iconWrap: "bg-amber-100 text-amber-700",
        title: "Warning",
      },
      error: {
        glow: "shadow-[0_16px_36px_rgba(220,38,38,0.28)]",
        bar: "bg-gradient-to-r from-red-500 to-rose-500",
        iconWrap: "bg-red-100 text-red-700",
        title: "Error",
      },
      confirm: {
        glow: "shadow-[0_16px_36px_rgba(15,23,42,0.28)]",
        bar: "bg-gradient-to-r from-amber-500 to-orange-500",
        iconWrap: "bg-amber-100 text-amber-700",
        title: "Confirm Action",
      },
    }),
    []
  );

  const icons = {
    info: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    success: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86l-8.4 14.52A1 1 0 002.75 20h18.5a1 1 0 00.86-1.52l-8.4-14.52a1 1 0 00-1.72 0z" />
      </svg>
    ),
    error: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    confirm: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  if (!isVisible) return null;

  const selected = variants[type] || variants.info;

  if (!isConfirm) {
    return (
      <div className="fixed top-4 right-4 z-[70] pointer-events-none">
        <div
          className={`pointer-events-auto relative w-[min(92vw,420px)] overflow-hidden rounded-2xl border border-white/70 bg-white/90 backdrop-blur-md transition-all duration-300 ${selected.glow} ${
            isAnimating
              ? "translate-x-0 opacity-100"
              : "translate-x-8 opacity-0"
          }`}
          role="status"
          aria-live="polite"
        >
          <div className={`h-1.5 w-full ${selected.bar}`} />
          <div className="p-4 pr-12">
            <div className="flex items-start gap-3">
              <div className={`mt-0.5 rounded-full p-2 ${selected.iconWrap}`}>
                {icons[type] || icons.info}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900">{selected.title}</p>
                <p className="mt-0.5 text-sm text-slate-600 break-words">{message}</p>
              </div>
            </div>
          </div>
          <button
            type="button"
            aria-label="Dismiss notification"
            onClick={onClose}
            className="absolute right-3 top-3 rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 z-[70] flex items-center justify-center p-4 transition-all duration-300 ${
        isAnimating ? "bg-slate-900/40" : "bg-slate-900/0"
      }`}
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-md overflow-hidden rounded-2xl border border-white/80 bg-white/95 backdrop-blur-md transition-all duration-300 ${selected.glow} ${
          isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={`h-1.5 w-full ${selected.bar}`} />
        <div className="p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className={`rounded-full p-2 ${selected.iconWrap}`}>{icons.confirm}</div>
            <h3 className="text-lg font-semibold text-slate-900">{selected.title}</h3>
          </div>
          <p className="text-slate-600">{message}</p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="rounded-lg bg-gradient-to-r from-red-500 to-rose-600 px-4 py-2 font-semibold text-white hover:from-red-600 hover:to-rose-700 transition-all"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
