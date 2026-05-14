"use client";

import { useState } from "react";
import { BillsList } from "@/components/bills-list";
import { DevisList } from "@/components/devis-list";
import { InterventionsList } from "@/components/interventions-list";
import type { Bill, Devis, Intervention } from "@/lib/types";
import { cn } from "@/lib/utils";

type Tab = "interventions" | "devis" | "factures";

type Props = {
  interventions: Intervention[];
  devis: Devis[];
  bills: Bill[];
  token: string;
};

const TAB_ICONS: Record<Tab, JSX.Element> = {
  interventions: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  devis: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M9 13h6M9 17h6" />
    </svg>
  ),
  factures: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
    </svg>
  ),
};

export function ClientTabs({ interventions, devis, bills, token }: Props) {
  const [active, setActive] = useState<Tab>("interventions");

  const tabs: Array<{ key: Tab; label: string; count: number }> = [
    { key: "interventions", label: "Interventions", count: interventions.length },
    { key: "devis", label: "Devis", count: devis.length },
    { key: "factures", label: "Factures", count: bills.length },
  ];

  return (
    <div className="flex flex-col gap-6">
      <nav
        role="tablist"
        aria-label="Vos documents"
        className="sticky top-3 z-10 flex gap-1 overflow-x-auto rounded-full border border-kozeo-violet/10 bg-white/90 p-1 shadow-card backdrop-blur"
      >
        {tabs.map((t) => {
          const isActive = active === t.key;
          return (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(t.key)}
              className={cn(
                "group relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kozeo-vert-accent",
                isActive
                  ? "bg-kozeo-violet text-white shadow-sm"
                  : "text-kozeo-violet/70 hover:bg-kozeo-light hover:text-kozeo-violet",
              )}
            >
              <span className={isActive ? "text-kozeo-vert-accent" : "text-kozeo-violet/40"}>
                {TAB_ICONS[t.key]}
              </span>
              <span>{t.label}</span>
              <span
                className={cn(
                  "inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-xs font-semibold transition-colors",
                  isActive
                    ? "bg-kozeo-vert-accent text-white"
                    : "bg-kozeo-violet/5 text-kozeo-violet/60 group-hover:bg-kozeo-violet/10",
                )}
              >
                {t.count}
              </span>
            </button>
          );
        })}
      </nav>

      <div role="tabpanel" className="animate-fade-in">
        {active === "interventions" && (
          <InterventionsList interventions={interventions} token={token} />
        )}
        {active === "devis" && <DevisList devis={devis} token={token} />}
        {active === "factures" && <BillsList bills={bills} token={token} />}
      </div>
    </div>
  );
}
