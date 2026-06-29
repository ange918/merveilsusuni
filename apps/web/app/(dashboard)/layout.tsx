export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import LogoutButton from '@/components/ui/LogoutButton';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Récupérer les modules actifs de l'organisation
  const { data: membre } = await supabase
    .from('membres_organisation')
    .select('organisation_id, organisations(nom)')
    .eq('user_id', user.id)
    .single();

  if (!membre) redirect('/onboarding');

  const { data: modules } = await supabase
    .from('abonnements_modules')
    .select('module')
    .eq('organisation_id', membre.organisation_id)
    .eq('statut', 'actif');

  const activeModules = modules?.map(m => m.module) ?? [];
  const orgName = (membre.organisations as { nom: string } | null)?.nom ?? 'Mon organisation';

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-5 border-b border-slate-800">
          <Link href="/dashboard">
            <h1 className="text-xl font-bold text-teal-400">Bookimo</h1>
          </Link>
          <p className="text-slate-500 text-xs mt-0.5 truncate">{orgName}</p>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition text-sm">
            <span>🏠</span> Accueil
          </Link>

          {activeModules.includes('promoteur') && (
            <div className="pt-3">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-3 mb-1">Événements</p>
              <Link href="/auraplan" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition text-sm">
                <span className="text-teal-400">📋</span> Rétroplanning
              </Link>
            </div>
          )}

          {activeModules.includes('gerant_salle') && (
            <div className="pt-3">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-3 mb-1">Salle de fête</p>
              <Link href="/spaceflow" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition text-sm">
                <span className="text-blue-400">📅</span> Calendrier
              </Link>
              <Link href="/spaceflow/spaces" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition text-sm">
                <span className="text-blue-400">🏛️</span> Mes salles
              </Link>
            </div>
          )}

          {activeModules.includes('agenda') && (
            <div className="pt-3">
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-3 mb-1">Agenda</p>
              <Link href="/agenda" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition text-sm">
                <span className="text-purple-400">🗓️</span> Mon agenda
              </Link>
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <p className="text-xs text-slate-500 truncate mb-2">{user.email}</p>
          <LogoutButton />
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-slate-950">
        {children}
      </main>
    </div>
  );
}
