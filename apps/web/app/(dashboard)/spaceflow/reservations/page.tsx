'use client';

import { useEffect, useState } from 'react';
import { reservationsApi, spacesApi } from '@/lib/api';

type Reservation = {
  id: string;
  date_debut: string;
  date_fin: string;
  statut_reservation: string;
  statut_paiement: string;
  montant_total: number;
  acompte_verse: number;
  clients?: { nom_complet: string; telephone: string };
  espaces?: { nom: string };
};

const statutColors: Record<string, string> = {
  Option: 'bg-blue-500/10 text-blue-400',
  Confirme: 'bg-red-500/10 text-red-400',
  Annule: 'bg-slate-500/10 text-slate-400',
};

const paiementColors: Record<string, string> = {
  'En attente': 'text-amber-400',
  'Acompte verse': 'text-blue-400',
  'Solde': 'text-green-400',
};

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [spaces, setSpaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    espace_id: '',
    date_debut: '',
    date_fin: '',
    montant_total: '',
    acompte_verse: '0',
    statut_reservation: 'Option',
    notes: '',
  });
  const [error, setError] = useState('');

  const load = async () => {
    const [res, spc] = await Promise.all([reservationsApi.list(), spacesApi.list()]);
    setReservations(res);
    setSpaces(spc);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await reservationsApi.create({
        ...form,
        montant_total: parseFloat(form.montant_total),
        acompte_verse: parseFloat(form.acompte_verse),
      });
      setShowForm(false);
      load();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Réservations</h1>
          <p className="text-slate-400 text-sm mt-1">Gérez toutes vos réservations</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          + Nouvelle réservation
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="bg-slate-900 border border-teal-500/30 rounded-xl p-6 mb-6 space-y-4">
          <h3 className="font-semibold text-teal-400">Nouvelle réservation</h3>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 px-3 py-2 rounded-lg">{error}</p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Salle *</label>
              <select
                value={form.espace_id}
                onChange={(e) => setForm({ ...form, espace_id: e.target.value })}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-teal-500"
              >
                <option value="">Sélectionner une salle</option>
                {spaces.map((s) => (
                  <option key={s.id} value={s.id}>{s.nom}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Statut</label>
              <select
                value={form.statut_reservation}
                onChange={(e) => setForm({ ...form, statut_reservation: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-teal-500"
              >
                <option value="Option">Option</option>
                <option value="Confirme">Confirmé</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Date de début *</label>
              <input
                type="datetime-local"
                value={form.date_debut}
                onChange={(e) => setForm({ ...form, date_debut: e.target.value })}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Date de fin *</label>
              <input
                type="datetime-local"
                value={form.date_fin}
                onChange={(e) => setForm({ ...form, date_fin: e.target.value })}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Montant total (FCFA) *</label>
              <input
                type="number"
                value={form.montant_total}
                onChange={(e) => setForm({ ...form, montant_total: e.target.value })}
                required
                min={0}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Acompte versé (FCFA)</label>
              <input
                type="number"
                value={form.acompte_verse}
                onChange={(e) => setForm({ ...form, acompte_verse: e.target.value })}
                min={0}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white text-sm transition">
              Annuler
            </button>
            <button type="submit" className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
              Créer la réservation
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-slate-900 rounded-xl h-20 animate-pulse" />
          ))}
        </div>
      ) : reservations.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">📅</p>
          <p className="text-slate-400">Aucune réservation pour le moment</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reservations.map((r) => (
            <div key={r.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statutColors[r.statut_reservation]}`}>
                    {r.statut_reservation}
                  </span>
                  <span className={`text-xs ${paiementColors[r.statut_paiement]}`}>
                    {r.statut_paiement}
                  </span>
                </div>
                <p className="font-medium text-white">{r.clients?.nom_complet ?? 'Client'}</p>
                <p className="text-slate-500 text-sm">{r.espaces?.nom}</p>
                <p className="text-slate-400 text-xs mt-1">
                  {formatDate(r.date_debut)} → {formatDate(r.date_fin)}
                </p>
              </div>

              <div className="text-right">
                <p className="text-white font-semibold">
                  {r.montant_total.toLocaleString('fr-FR')} FCFA
                </p>
                <p className="text-slate-400 text-xs">
                  Acompte : {r.acompte_verse.toLocaleString('fr-FR')} FCFA
                </p>
                <p className="text-amber-400 text-xs font-medium">
                  Reste : {(r.montant_total - r.acompte_verse).toLocaleString('fr-FR')} FCFA
                </p>
                <button
                  onClick={() => reservationsApi.downloadInvoice(r.id)}
                  className="text-teal-400 hover:text-teal-300 text-xs mt-1 transition"
                >
                  Télécharger facture
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
