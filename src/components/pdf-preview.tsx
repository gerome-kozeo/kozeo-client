"use client";

import { useCallback, useEffect, useState } from "react";

type Props = {
  src: string;
  filename: string;
  label?: string;
  variant?: "primary" | "secondary";
  className?: string;
};

export function PdfPreview({ src, filename, label = "Voir le PDF", variant = "primary", className }: Props) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  const buttonBase =
    "inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition-all duration-200 active:scale-[0.98]";
  const buttonVariant =
    variant === "primary"
      ? "bg-kozeo-vert-accent text-white hover:bg-kozeo-vert-dark shadow-sm hover:shadow-md"
      : "bg-white text-kozeo-violet border border-kozeo-violet/15 hover:bg-kozeo-light";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={[buttonBase, buttonVariant, className].filter(Boolean).join(" ")}
      >
        <span aria-hidden>📄</span>
        <span>{label}</span>
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Aperçu ${filename}`}
          className="fixed inset-0 z-50 flex items-end justify-center bg-kozeo-violet/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="flex h-[92dvh] w-full max-w-4xl flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:h-[88dvh] sm:rounded-3xl">
            <header className="flex items-center justify-between gap-3 border-b border-kozeo-violet/10 bg-white px-4 py-3 sm:px-6">
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <span aria-hidden className="text-lg">📄</span>
                <p className="truncate text-sm font-medium text-kozeo-violet">{filename}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <a
                  href={`${src}${src.includes("?") ? "&" : "?"}dl=1`}
                  download={filename}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full bg-kozeo-vert-accent px-3 text-sm font-medium text-white hover:bg-kozeo-vert-dark"
                >
                  <span aria-hidden>⬇</span>
                  <span className="hidden sm:inline">Télécharger</span>
                </a>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Fermer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-kozeo-violet/60 hover:bg-kozeo-light hover:text-kozeo-violet"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </header>
            <div className="flex-1 overflow-hidden bg-kozeo-light">
              <iframe
                src={src}
                title={`Aperçu ${filename}`}
                className="h-full w-full"
                style={{ border: 0 }}
              />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
