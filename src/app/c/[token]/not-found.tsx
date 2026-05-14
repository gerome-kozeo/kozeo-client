export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 px-6 py-12 text-center">
      <span className="text-xs font-medium uppercase tracking-wider text-kozeo-vert-dark">
        Espace client Kozéo
      </span>
      <h1 className="text-3xl font-semibold text-kozeo-violet">Compte introuvable</h1>
      <p className="text-base text-kozeo-violet/70">
        Votre lien est valide mais aucun dossier client ne correspond. Contactez-nous,
        on régularise sous quelques minutes.
      </p>
      <a
        href="tel:0385947502"
        className="inline-flex h-11 items-center justify-center rounded-full bg-kozeo-vert px-5 text-base font-medium text-white hover:bg-kozeo-vert-dark"
      >
        📞 03 85 94 75 02
      </a>
    </main>
  );
}
