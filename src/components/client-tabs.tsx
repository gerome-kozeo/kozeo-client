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
        className="flex gap-1 overflow-x-auto rounded-full border border-kozeo-violet/10 bg-white p-1 shadow-card"
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
                "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-kozeo-vert-accent",
                isActive
                  ? "bg-kozeo-vert-accent text-white shadow-sm"
                  : "text-kozeo-violet/70 hover:text-kozeo-violet hover:bg-kozeo-light",
              )}
            >
              <span>{t.label}</span>
              <span
                className={cn(
                  "inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full px-1.5 text-xs font-semibold",
                  isActive ? "bg-white/20 text-white" : "bg-kozeo-violet/5 text-kozeo-violet/70",
                )}
              >
                {t.count}
              </span>
            </button>
          );
        })}
      </nav>

      <div role="tabpanel">
        {active === "interventions" && (
          <InterventionsList interventions={interventions} token={token} />
        )}
        {active === "devis" && <DevisList devis={devis} token={token} />}
        {active === "factures" && <BillsList bills={bills} token={token} />}
      </div>
    </div>
  );
}
