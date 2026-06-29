'use client';

import { useEffect, useState } from 'react';
import { eventsApi } from '@/lib/api';
import Link from 'next/link';

type Event = {
  id: string;
  nom: string;
  date_evenement: string;
  lieu?: string;
  statut: string;
};

const statutColors: Record<string, string> = {
  actif: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  termine: 'bg-green-500/10 text-green-400 border-green-500/20',
  annule: 'bg-red-500/10 text-red-400 border-red-500/20',
};

export default function AuraplanPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventsApi.list().then(setEvents).finally(() => setLoading(false));
  }, []);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  const daysUntil = (d: string) => {
    const diff = Math.ceil(
      (new Date(d).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    if (diff < 0) return 'Passé';
    if (diff === 0) return "Aujourd'hui";
    return `J-${diff}`;
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">AuraPlan</h1>
          <p className="text-slate-400 text-sm mt-1">Gérez vos rétroplannings d&apos;événements</p>
        </div>
        <Link
          href="/auraplan/new"
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          + Nouvel événement
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-slate-900 rounded-xl h-40 animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">📋</p>
          <p className="text-slate-400">Aucun événement pour le moment</p>
          <Link href="/auraplan/new" className="text-blue-400 text-sm mt-2 inline-block hover:underline">
            Créer votre premier événement
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <Link
              key={event.id}
              href={`/auraplan/${event.id}`}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-blue-500/40 transition group"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-white group-hover:text-blue-300 transition line-clamp-1">
                  {event.nom}
                </h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full border ${statutColors[event.statut] ?? ''}`}
                >
                  {event.statut}
                </span>
              </div>

              <p className="text-slate-400 text-sm">{formatDate(event.date_evenement)}</p>
              {event.lieu && (
                <p className="text-slate-500 text-xs mt-1">📍 {event.lieu}</p>
              )}

              <div className="mt-4 pt-3 border-t border-slate-800">
                <span
                  className={`text-xs font-medium ${
                    daysUntil(event.date_evenement) === 'Passé'
                      ? 'text-slate-500'
                      : 'text-orange-400'
                  }`}
                >
                  {daysUntil(event.date_evenement)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
