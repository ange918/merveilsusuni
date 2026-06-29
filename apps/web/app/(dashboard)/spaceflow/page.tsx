'use client';

import { useEffect, useRef, useState } from 'react';
import { reservationsApi, spacesApi } from '@/lib/api';
import Link from 'next/link';

// FullCalendar import dynamique pour éviter les erreurs SSR
import dynamic from 'next/dynamic';

const CalendarComponent = dynamic(
  () => import('@/components/spaceflow/CalendarView'),
  { ssr: false, loading: () => <div className="bg-slate-900 rounded-xl h-96 animate-pulse" /> },
);

export default function SpaceflowPage() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [spaces, setSpaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([reservationsApi.list(), spacesApi.list()])
      .then(([res, spc]) => {
        setReservations(res);
        setSpaces(spc);
      })
      .finally(() => setLoading(false));
  }, []);

  const events = reservations.map((r) => ({
    id: r.id,
    title: `${r.clients?.nom_complet ?? 'Client'} — ${r.espaces?.nom ?? 'Salle'}`,
    start: r.date_debut,
    end: r.date_fin,
    backgroundColor:
      r.statut_reservation === 'Confirme'
        ? '#DC2626'
        : r.statut_reservation === 'Option'
        ? '#3B82F6'
        : '#6B7280',
    borderColor: 'transparent',
  }));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">SpaceFlow</h1>
          <p className="text-slate-400 text-sm mt-1">Calendrier des réservations</p>
        </div>
        <div className="flex gap-3">
          <Link href="/spaceflow/spaces" className="border border-teal-500/40 text-teal-400 hover:bg-teal-500/10 px-4 py-2 rounded-lg text-sm transition">
            Gérer les salles
          </Link>
          <Link href="/spaceflow/reservations" className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
            + Réservation
          </Link>
        </div>
      </div>

      {/* Légende */}
      <div className="flex gap-4 mb-6">
        {[
          { label: 'Option', color: 'bg-blue-500' },
          { label: 'Confirmé', color: 'bg-red-500' },
          { label: 'Libre', color: 'bg-green-500' },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${item.color}`} />
            <span className="text-sm text-slate-400">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        {!loading && <CalendarComponent events={events} />}
      </div>
    </div>
  );
}
