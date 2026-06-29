'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { eventsApi } from '@/lib/api';
import Link from 'next/link';

export default function NewEventPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nom: '',
    date_evenement: '',
    lieu: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const event = await eventsApi.create(form);
      router.push(`/auraplan/${event.id}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-xl">
      <div className="mb-6">
        <Link href="/auraplan" className="text-slate-400 hover:text-white text-sm">
          ← Retour
        </Link>
        <h1 className="text-2xl font-bold text-white mt-2">Nouvel événement</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm text-slate-400 mb-1">Nom de l&apos;événement *</label>
          <input
            type="text"
            value={form.nom}
            onChange={(e) => setForm({ ...form, nom: e.target.value })}
            required
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition"
            placeholder="Concert Hip-Hop 2025"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1">Date de l&apos;événement *</label>
          <input
            type="date"
            value={form.date_evenement}
            onChange={(e) => setForm({ ...form, date_evenement: e.target.value })}
            required
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1">Lieu</label>
          <input
            type="text"
            value={form.lieu}
            onChange={(e) => setForm({ ...form, lieu: e.target.value })}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition"
            placeholder="Palais des Sports, Paris"
          />
        </div>

        <div>
          <label className="block text-sm text-slate-400 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition resize-none"
            placeholder="Description de l'événement..."
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm bg-red-400/10 px-3 py-2 rounded-lg">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition"
        >
          {loading ? 'Création...' : 'Créer l\'événement'}
        </button>
      </form>
    </div>
  );
}
