'use client';

import { useEffect, useState } from 'react';
import { spacesApi } from '@/lib/api';

type Space = {
  id: string;
  nom: string;
  capacite: number;
  tarif_base: number;
  adresse?: string;
  options?: Record<string, number>;
};

export default function SpacesPage() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nom: '',
    capacite: '',
    tarif_base: '',
    adresse: '',
  });

  const load = () =>
    spacesApi.list().then(setSpaces).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await spacesApi.create({
      nom: form.nom,
      capacite: parseInt(form.capacite),
      tarif_base: parseFloat(form.tarif_base),
      adresse: form.adresse,
    });
    setForm({ nom: '', capacite: '', tarif_base: '', adresse: '' });
    setShowForm(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Désactiver cette salle ?')) return;
    await spacesApi.delete(id);
    setSpaces((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Mes salles</h1>
          <p className="text-slate-400 text-sm mt-1">Gérez vos espaces de réception</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          + Ajouter une salle
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-slate-900 border border-teal-500/30 rounded-xl p-6 mb-6 space-y-4">
          <h3 className="font-semibold text-teal-400">Nouvelle salle</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Nom *</label>
              <input
                type="text"
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-teal-500"
                placeholder="Salle Prestige"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Adresse</label>
              <input
                type="text"
                value={form.adresse}
                onChange={(e) => setForm({ ...form, adresse: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-teal-500"
                placeholder="123 rue des fêtes"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Capacité (personnes) *</label>
              <input
                type="number"
                value={form.capacite}
                onChange={(e) => setForm({ ...form, capacite: e.target.value })}
                required
                min={1}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-teal-500"
                placeholder="200"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Tarif de base (FCFA) *</label>
              <input
                type="number"
                value={form.tarif_base}
                onChange={(e) => setForm({ ...form, tarif_base: e.target.value })}
                required
                min={0}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-teal-500"
                placeholder="150000"
              />
            </div>
          </div>
          <button type="submit" className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
            Créer la salle
          </button>
        </form>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-slate-900 rounded-xl h-32 animate-pulse" />
          ))}
        </div>
      ) : spaces.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">🏛️</p>
          <p className="text-slate-400">Aucune salle enregistrée</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {spaces.map((space) => (
            <div key={space.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-white">{space.nom}</h3>
                <button onClick={() => handleDelete(space.id)} className="text-slate-500 hover:text-red-400 text-xs transition">
                  Désactiver
                </button>
              </div>
              {space.adresse && (
                <p className="text-slate-500 text-sm mt-1">📍 {space.adresse}</p>
              )}
              <div className="flex gap-4 mt-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-teal-400">{space.capacite}</p>
                  <p className="text-xs text-slate-500">personnes</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-amber-400">
                    {space.tarif_base.toLocaleString('fr-FR')}
                  </p>
                  <p className="text-xs text-slate-500">FCFA / soirée</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
