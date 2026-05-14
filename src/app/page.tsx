export default function Landing() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center gap-6 px-6 py-12 text-center">
      <span className="text-xs font-medium uppercase tracking-wider text-kozeo-vert-dark">
        Espace client Kozéo
      </span>
      <h1 className="text-3xl font-semibold text-kozeo-navy">Cette page nécessite un lien personnel</h1>
      <p className="text-base text-kozeo-navy/70">
        Vous avez reçu un lien d'accès par mail après la signature de votre devis.
        Cliquez sur ce lien pour accéder à votre espace.
      </p>
      <p className="text-sm text-kozeo-navy/50">
        Lien introuvable ? Contactez-nous au{" "}
        <a href="tel:0385947502" className="font-medium text-kozeo-vert-dark underline">
          03 85 94 75 02
        </a>{" "}
        ou à{" "}
        <a href="mailto:contact@kozeo.fr" className="font-medium text-kozeo-vert-dark underline">
          contact@kozeo.fr
        </a>
        .
      </p>
    </main>
  );
}
