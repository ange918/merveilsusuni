'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

type AgendaItem = {
  id: string;
  titre: string;
  description: string | null;
  date_heure: string;
  lieu: string | null;
  rappel_24h: boolean;
  couleur: string;
};

const COULEURS = ['#0F766E', '#2563EB', '#7C3AED', '#DC2626', '#D97706', '#059669'];

export default function AgendaPage() {
  const supabase = createClient();
  const [items, setItems] = useState<AgendaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ titre: '', description: '', date_heure: '', lieu: '', rappel_24h: true, couleur: '#0F766E' });
  const [orgId, setOrgId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: membre } = await supabase.from('membres_organisation').select('organisation_id').eq('user_id', user.id).single();
      if (membre) setOrgId(membre.organisation_id);

      const { data } = await supabase.from('agenda_items').select('*').eq('user_id', user.id).order('date_heure', { ascending: true });
      setItems(data ?? []);
      setLoading(false);
    };
    load();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgId) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase.from('agenda_items').insert({
      user_id: user.id,
      organisation_id: orgId,
      ...form,
    }).select().single();

    if (data) {
      setItems(prev => [...prev, data].sort((a, b) => a.date_heure.localeCompare(b.date_heure)));
      setShowForm(false);
      setForm({ titre: '', description: '', date_heure: '', lieu: '', rappel_24h: true, couleur: '#0F766E' });
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from('agenda_items').delete().eq('id', id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const isToday = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  };

  const isSoon = (iso: string) => {
    const diff = new Date(iso).getTime() - Date.now();
    return diff > 0 && diff <= 24 * 60 * 60 * 1000;
  };

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Mon Agenda</h1>
          <p className="text-slate-400 text-sm mt-1">Vos rendez-vous et rappels personnels</p>
        </div>
        <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg font-medium text-sm transition">
          + Ajouter
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-lg font-bold text-white mb-4">Nouveau rendez-vous</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Titre *</label>
                <input required value={form.titre} onChange={e => setForm(p => ({ ...p, titre: e.target.value }))} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-500" placeholder="Réunion, appel..." />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Date & heure *</label>
                <input required type="datetime-local" value={form.date_heure} onChange={e => setForm(p => ({ ...p, date_heure: e.target.value }))} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-500" />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Lieu</label>
                <input value={form.lieu} onChange={e => setForm(p => ({ ...p, lieu: e.target.value }))} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-500" placeholder="Adresse ou lien visio" />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={2} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-teal-500 resize-none" />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-2">Couleur</label>
                <div className="flex gap-2">
                  {COULEURS.map(c => (
                    <button key={c} type="button" onClick={() => setForm(p => ({ ...p, couleur: c }))}
                      className={`w-7 h-7 rounded-full border-2 transition ${form.couleur === c ? 'border-white scale-110' : 'border-transparent'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
                <input type="checkbox" checked={form.rappel_24h} onChange={e => setForm(p => ({ ...p, rappel_24h: e.target.checked }))} className="accent-teal-500" />
                Rappel par email 24h avant
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-slate-700 text-slate-400 py-2 rounded-lg text-sm hover:border-slate-500 transition">Annuler</button>
                <button type="submit" disabled={saving} className="flex-1 bg-teal-600 hover:bg-teal-500 text-white py-2 rounded-lg text-sm font-medium transition disabled:opacity-50">
                  {saving ? 'Sauvegarde...' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-slate-500 text-center py-12">Chargement...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl">
          <div className="text-5xl mb-4">🗓️</div>
          <p className="text-slate-400 font-medium">Aucun rendez-vous</p>
          <p className="text-slate-600 text-sm mt-1">Ajoutez votre premier événement</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="bg-slate-900 border border-slate-800 rounded-xl px-5 py-4 flex items-start gap-4 group hover:border-slate-700 transition">
              <div className="w-1 self-stretch rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: item.couleur }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-white text-sm">{item.titre}</span>
                  {isToday(item.date_heure) && <span className="text-xs bg-teal-500/20 text-teal-400 px-2 py-0.5 rounded-full">Aujourd&apos;hui</span>}
                  {isSoon(item.date_heure) && !isToday(item.date_heure) && <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">Dans 24h</span>}
                  {item.rappel_24h && <span className="text-xs text-slate-500">🔔</span>}
                </div>
                <p className="text-teal-400/80 text-xs mt-0.5 capitalize">{formatDate(item.date_heure)}</p>
                {item.lieu && <p className="text-slate-500 text-xs mt-0.5">📍 {item.lieu}</p>}
                {item.description && <p className="text-slate-400 text-xs mt-1">{item.description}</p>}
              </div>
              <button onClick={() => handleDelete(item.id)} className="text-slate-700 hover:text-red-400 transition opacity-0 group-hover:opacity-100 text-xs flex-shrink-0">
                Supprimer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
