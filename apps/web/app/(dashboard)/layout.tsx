import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import LogoutButton from '@/components/ui/LogoutButton';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold text-blue-400">Bookimo</h1>
          <p className="text-slate-500 text-xs mt-1">Plateforme événementielle</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
            AuraPlan
          </p>
          <Link
            href="/auraplan"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <span className="text-blue-400">📋</span> Rétroplanning
          </Link>

          <div className="pt-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
              SpaceFlow
            </p>
            <Link
              href="/spaceflow"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              <span className="text-teal-400">📅</span> Calendrier
            </Link>
            <Link
              href="/spaceflow/spaces"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              <span className="text-teal-400">🏛️</span> Mes salles
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <p className="text-xs text-slate-500 truncate mb-2">{user.email}</p>
          <LogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-slate-950">
        {children}
      </main>
    </div>
  );
}
