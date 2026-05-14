import * as React from "react";
import { cn } from "@/lib/utils";

type Props = {
  title?: string;
  eyebrow?: string;
  children: React.ReactNode;
  className?: string;
};

export function Section({ title, eyebrow, children, className }: Props) {
  return (
    <section className={cn("flex flex-col gap-4", className)}>
      {(title || eyebrow) && (
        <header className="flex flex-col gap-1">
          {eyebrow && (
            <span className="text-xs font-medium uppercase tracking-wider text-kozeo-vert-dark">
              {eyebrow}
            </span>
          )}
          {title && (
            <h2 className="text-2xl font-semibold text-kozeo-violet md:text-3xl">{title}</h2>
          )}
        </header>
      )}
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}
