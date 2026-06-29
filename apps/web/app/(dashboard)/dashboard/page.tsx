export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Récupérer l'organisation et les modules actifs
  const { data: membre } = await supabase
    .from('membres_organisation')
    .select('organisation_id, role, organisations(nom)')
    .eq('user_id', user.id)
    .single();

  if (!membre) redirect('/onboarding');

  const { data: modules } = await supabase
    .from('abonnements_modules')
    .select('module')
    .eq('organisation_id', membre.organisation_id)
    .eq('statut', 'actif');

  const activeModules = modules?.map(m => m.module) ?? [];

  const allModules = [
    { id: 'promoteur', icon: '📋', title: "Promoteur d'événements", desc: 'Rétroplanning et suivi de tâches', href: '/auraplan', color: 'teal' },
    { id: 'gerant_salle', icon: '🏛️', title: 'Gérant de salle', desc: 'Calendrier des réservations', href: '/spaceflow', color: 'blue' },
    { id: 'agenda', icon: '🗓️', title: 'Agenda personnel', desc: 'Programme et rappels 24h', href: '/agenda', color: 'purple' },
  ];

  const orgName = (membre.organisations as { nom: string } | null)?.nom ?? 'Mon organisation';

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Bonjour 👋</h1>
        <p className="text-slate-400">{orgName} · {activeModules.length} module{activeModules.length > 1 ? 's' : ''} actif{activeModules.length > 1 ? 's' : ''}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {allModules.map(({ id, icon, title, desc, href, color }) => {
          const isActive = activeModules.includes(id);
          const colors: Record<string, string> = { teal: 'border-teal-500/50 bg-teal-500/5 hover:bg-teal-500/10', blue: 'border-blue-500/50 bg-blue-500/5 hover:bg-blue-500/10', purple: 'border-purple-500/50 bg-purple-500/5 hover:bg-purple-500/10' };
          const textColors: Record<string, string> = { teal: 'text-teal-400', blue: 'text-blue-400', purple: 'text-purple-400' };

          if (!isActive) {
            return (
              <div key={id} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 opacity-50">
                <div className="text-4xl mb-3 grayscale">{icon}</div>
                <h3 className="text-lg font-bold text-slate-500 mb-1">{title}</h3>
                <p className="text-slate-600 text-sm mb-4">{desc}</p>
                <span className="text-xs text-slate-600 border border-slate-700 px-3 py-1 rounded-full">Non activé</span>
              </div>
            );
          }

          return (
            <Link key={id} href={href} className={`rounded-2xl border ${colors[color]} p-6 transition group`}>
              <div className="text-4xl mb-3">{icon}</div>
              <h3 className={`text-lg font-bold ${textColors[color]} mb-1`}>{title}</h3>
              <p className="text-slate-400 text-sm mb-4">{desc}</p>
              <span className={`text-xs ${textColors[color]} font-medium group-hover:underline`}>Accéder →</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
