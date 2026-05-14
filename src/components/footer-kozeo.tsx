export function FooterKozeo() {
  return (
    <footer className="overflow-hidden rounded-3xl border border-kozeo-violet/8 bg-white">
      <div className="bg-gradient-to-br from-kozeo-light to-white px-6 py-8 sm:px-10 sm:py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-kozeo-vert-dark">
              Votre interlocuteur Kozéo
            </span>
            <h3 className="text-2xl font-semibold text-kozeo-violet">
              Une question ? L'équipe vous répond.
            </h3>
            <p className="max-w-md text-sm text-kozeo-violet/70">
              Du lundi au vendredi, 8h-12h et 14h-18h. Une chaîne nationale,
              une équipe à Saint-Rémy. Pas de standard, on décroche.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row md:flex-col md:items-end">
            <a
              href="tel:0385947502"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-kozeo-vert-accent px-6 text-base font-semibold text-white shadow-sm transition-all hover:bg-kozeo-vert-dark hover:shadow-md active:scale-[0.98]"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              03 85 94 75 02
            </a>
            <a
              href="mailto:contact@kozeo.fr"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-kozeo-violet/15 bg-white px-6 text-base font-semibold text-kozeo-violet transition-all hover:border-kozeo-violet/30 hover:bg-kozeo-light"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 6-10 7L2 6" />
              </svg>
              contact@kozeo.fr
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 border-t border-kozeo-violet/[0.06] bg-white px-6 py-4 text-xs text-kozeo-violet/40 sm:flex-row sm:items-center sm:justify-between sm:px-10">
        <p>Kozéo · 4 rue de la Vigne, 71100 Saint-Rémy · SIRET 932 002 124 00018</p>
        <p>Mitsubishi Electric · Daikin · RGE QualiPAC</p>
      </div>
    </footer>
  );
}
