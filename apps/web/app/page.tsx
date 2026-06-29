import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">

      {/* HEADER */}
      <header className="fixed top-0 w-full z-50 bg-slate-950/90 backdrop-blur-sm border-b border-slate-800/60">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-teal-400 tracking-tight">Bookimo</span>
          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            <a href="#fonctionnalites" className="hover:text-white transition">Fonctionnalités</a>
            <a href="#tarifs" className="hover:text-white transition">Tarifs</a>
            <a href="#faq" className="hover:text-white transition">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-sm text-slate-300 hover:text-white transition">
              Se connecter
            </Link>
            <Link href="/register" className="px-4 py-2 text-sm bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-medium transition">
              S&apos;inscrire
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-medium px-4 py-2 rounded-full mb-6">
            🚀 Plateforme tout-en-un pour l&apos;événementiel en Afrique de l&apos;Ouest
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6">
            Gérez vos événements,<br />
            <span className="text-teal-400">salles &amp; agenda</span><br />
            en un seul endroit
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Bookimo est la plateforme professionnelle qui centralise la gestion de vos événements,
            de vos réservations de salle et de votre emploi du temps personnel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-4 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl text-lg transition shadow-lg shadow-teal-500/20"
            >
              Commencer gratuitement →
            </Link>
            <a
              href="#fonctionnalites"
              className="px-8 py-4 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold rounded-xl text-lg transition"
            >
              Voir les fonctionnalités
            </a>
          </div>
          <p className="text-slate-500 text-sm mt-6">Pas de carte bancaire requise · 10 000 FCFA / module / mois</p>
        </div>
      </section>

      {/* MOCKUP DASHBOARD */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-2xl border border-slate-700/60 overflow-hidden shadow-2xl shadow-black/40">
            <div className="bg-slate-800 px-4 py-3 flex items-center gap-2 border-b border-slate-700">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <div className="ml-3 flex-1 bg-slate-700 rounded px-3 py-1 text-xs text-slate-400">
                app.bookimo.io/dashboard
              </div>
            </div>
            <div className="bg-slate-900 flex" style={{ minHeight: 320 }}>
              <div className="w-52 bg-slate-900 border-r border-slate-800 p-4 flex flex-col gap-3">
                <div className="text-teal-400 font-bold text-lg mb-2">Bookimo</div>
                <div className="space-y-1">
                  <div className="bg-teal-600/20 text-teal-400 rounded-lg px-3 py-2 text-xs font-medium">📋 Événements</div>
                  <div className="text-slate-400 rounded-lg px-3 py-2 text-xs">📅 Calendrier salle</div>
                  <div className="text-slate-400 rounded-lg px-3 py-2 text-xs">🗓️ Mon agenda</div>
                </div>
              </div>
              <div className="flex-1 p-6">
                <div className="mb-4">
                  <div className="h-5 bg-slate-700 rounded w-48 mb-2" />
                  <div className="h-3 bg-slate-800 rounded w-64" />
                </div>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {['bg-teal-500/20', 'bg-blue-500/20', 'bg-purple-500/20'].map((c, i) => (
                    <div key={i} className={`${c} rounded-xl p-4`}>
                      <div className="h-3 bg-slate-600 rounded w-16 mb-2" />
                      <div className="h-6 bg-slate-500 rounded w-10" />
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-slate-800 rounded-lg px-4 py-3 flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-teal-400 flex-shrink-0" />
                      <div className="h-3 bg-slate-600 rounded flex-1" />
                      <div className="h-3 bg-slate-700 rounded w-16" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-3">Comment ça marche</h2>
          <p className="text-slate-400 text-center mb-12">En 3 étapes, votre organisation est opérationnelle</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Créez votre compte', desc: 'Inscrivez-vous en 30 secondes. Aucune carte bancaire requise pour commencer.' },
              { step: '02', title: 'Configurez votre organisation', desc: 'Donnez un nom à votre organisation et choisissez les modules dont vous avez besoin.' },
              { step: '03', title: 'Gérez tout depuis le dashboard', desc: 'Événements, réservations, agenda — tout est centralisé en un seul endroit.' },
            ].map(({ step, title, desc }) => (
              <div key={step}>
                <div className="text-5xl font-black text-teal-500/20 mb-3">{step}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FONCTIONNALITÉS */}
      <section id="fonctionnalites" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-3">Trois modules, une plateforme</h2>
          <p className="text-slate-400 text-center mb-12">Activez uniquement ce dont vous avez besoin</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '📋', color: 'teal', title: "Promoteur d'événements",
                desc: "Planifiez vos événements de A à Z. Rétroplanning, suivi des tâches et alertes J-7 avant chaque échéance.",
                features: ['Rétroplanning intelligent', 'Suivi des tâches', 'Alertes J-7 par email', 'Tableau de bord'],
              },
              {
                icon: '🏛️', color: 'blue', title: 'Gérant de salle',
                desc: "Gérez votre calendrier de réservations sans chevauchement. Suivez les paiements et générez des factures PDF.",
                features: ['Calendrier visuel', 'Anti-chevauchement', 'Suivi des paiements', 'Factures PDF'],
              },
              {
                icon: '🗓️', color: 'purple', title: 'Agenda personnel',
                desc: "Ne manquez plus jamais un rendez-vous. Programmez vos réunions avec des rappels 24h avant.",
                features: ['Vue calendrier', 'Rappels 24h avant', 'Codes couleur', 'Multi-événements/jour'],
              },
            ].map(({ icon, color, title, desc, features }) => {
              const border: Record<string, string> = { teal: 'border-teal-500/30 bg-teal-500/5', blue: 'border-blue-500/30 bg-blue-500/5', purple: 'border-purple-500/30 bg-purple-500/5' };
              const badge: Record<string, string> = { teal: 'text-teal-400', blue: 'text-blue-400', purple: 'text-purple-400' };
              return (
                <div key={title} className={`rounded-2xl border ${border[color]} p-6 flex flex-col gap-4`}>
                  <div className="text-4xl">{icon}</div>
                  <h3 className="text-lg font-bold text-white">{title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
                  <ul className="space-y-1.5 mt-auto">
                    {features.map(f => (
                      <li key={f} className={`flex items-center gap-2 text-sm text-slate-300 ${badge[color]}`}>
                        <span>✓</span><span className="text-slate-300">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TARIFS */}
      <section id="tarifs" className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-3">Tarifs simples et transparents</h2>
          <p className="text-slate-400 text-center mb-12">10 000 FCFA par module, par mois. Pas de surprise.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '📋', title: 'Promoteur', price: '10 000', desc: "Gestion complète de vos événements et rétroplanning." },
              { icon: '🏛️', title: 'Gérant de salle', price: '10 000', desc: "Calendrier de réservations et suivi financier.", popular: true },
              { icon: '🗓️', title: 'Agenda', price: '10 000', desc: "Agenda personnel avec rappels automatiques." },
            ].map(({ icon, title, price, desc, popular }) => (
              <div key={title} className={`relative rounded-2xl border p-6 flex flex-col gap-4 ${popular ? 'border-teal-500 bg-teal-500/5' : 'border-slate-700 bg-slate-900'}`}>
                {popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-500 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                    Populaire
                  </div>
                )}
                <div className="text-3xl">{icon}</div>
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-white">{price}</span>
                  <span className="text-slate-400 text-sm">FCFA / mois</span>
                </div>
                <p className="text-slate-400 text-sm">{desc}</p>
                <Link href="/register" className={`mt-auto text-center py-2.5 rounded-lg font-medium text-sm transition ${popular ? 'bg-teal-600 hover:bg-teal-500 text-white' : 'border border-slate-600 hover:border-slate-400 text-slate-300'}`}>
                  Commencer →
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-slate-500 text-sm mt-8">
            Prenez les 3 modules pour <strong className="text-slate-300">30 000 FCFA/mois</strong> seulement
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Questions fréquentes</h2>
          <div className="space-y-4">
            {[
              { q: "Puis-je utiliser plusieurs modules en même temps ?", a: "Oui. Dans une organisation, vous pouvez activer jusqu'à 3 modules simultanément. Chaque module est facturé séparément à 10 000 FCFA/mois." },
              { q: "Combien de personnes peuvent accéder à mon organisation ?", a: "Jusqu'à 3 profils par organisation. Idéal pour une équipe restreinte ou une petite structure." },
              { q: "Comment payer mon abonnement ?", a: "Nous acceptons Wave, Orange Money et FedaPay. Le paiement est mensuel et sans engagement." },
              { q: "Mes données sont-elles sécurisées ?", a: "Oui. Bookimo est hébergé sur Supabase avec chiffrement et politiques de sécurité au niveau de chaque ligne de données." },
              { q: "Puis-je changer de modules en cours de route ?", a: "Absolument. Vous pouvez ajouter ou retirer des modules à tout moment depuis les paramètres de votre organisation." },
            ].map(({ q, a }) => (
              <details key={q} className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <summary className="px-6 py-4 text-white font-medium cursor-pointer hover:text-teal-400 transition list-none flex justify-between items-center">
                  <span>{q}</span>
                  <span className="text-slate-500 group-open:rotate-180 transition-transform duration-200 ml-4">↓</span>
                </summary>
                <p className="px-6 pb-4 text-slate-400 text-sm leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center bg-gradient-to-b from-teal-500/10 to-transparent border border-teal-500/20 rounded-3xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">Prêt à tout gérer depuis un seul endroit ?</h2>
          <p className="text-slate-400 mb-8">Créez votre organisation en 2 minutes et commencez dès aujourd&apos;hui.</p>
          <Link href="/register" className="inline-block px-10 py-4 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-lg transition shadow-lg shadow-teal-500/20">
            Créer mon compte →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-teal-400 font-bold text-xl">Bookimo</span>
          <p className="text-slate-500 text-sm">© 2026 Bookimo. Tous droits réservés.</p>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-300 transition">Confidentialité</a>
            <a href="#" className="hover:text-slate-300 transition">CGU</a>
            <Link href="/login" className="hover:text-slate-300 transition">Connexion</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
