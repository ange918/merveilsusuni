'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const MODULES = [
  { id: 'promoteur', icon: '📋', title: "Promoteur d'événements", desc: 'Rétroplanning, suivi de tâches, alertes J-7', color: 'teal' },
  { id: 'gerant_salle', icon: '🏛️', title: 'Gérant de salle', desc: 'Calendrier réservations, anti-chevauchement, factures PDF', color: 'blue' },
  { id: 'agenda', icon: '🗓️', title: 'Agenda personnel', desc: 'Programme, rappels 24h avant', color: 'purple' },
];

const colorMap: Record<string, { border: string; bg: string; text: string }> = {
  teal: { border: 'border-teal-500', bg: 'bg-teal-500/10', text: 'text-teal-400' },
  blue: { border: 'border-blue-500', bg: 'bg-blue-500/10', text: 'text-blue-400' },
  purple: { border: 'border-purple-500', bg: 'bg-purple-500/10', text: 'text-purple-400' },
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [nomOrg, setNomOrg] = useState('');
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleModule = (id: string) => {
    setSelectedModules(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    if (selectedModules.length === 0) {
      setError('Sélectionnez au moins un module.');
      return;
    }
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/login'); return; }

    // Créer l'organisation
    const { data: org, error: orgErr } = await supabase
      .from('organisations')
      .insert({ nom: nomOrg.trim(), proprietaire_id: user.id })
      .select()
      .single();

    if (orgErr || !org) {
      setError("Erreur lors de la création de l'organisation.");
      setLoading(false);
      return;
    }

    // Ajouter le créateur comme membre propriétaire
    await supabase.from('membres_organisation').insert({
      organisation_id: org.id,
      user_id: user.id,
      role: 'proprietaire',
    });

    // Activer les modules choisis
    const modulesData = selectedModules.map(module => ({
      organisation_id: org.id,
      module,
      statut: 'actif',
    }));
    await supabase.from('abonnements_modules').insert(modulesData);

    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <span className="text-3xl font-bold text-teal-400">Bookimo</span>
          <p className="text-slate-500 text-sm mt-1">Configuration de votre organisation</p>
        </div>

        {/* Étapes */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className={`flex items-center gap-2 text-sm font-medium ${step >= 1 ? 'text-teal-400' : 'text-slate-600'}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-teal-500 text-white' : 'bg-slate-800 text-slate-500'}`}>1</div>
            Organisation
          </div>
          <div className="w-12 h-px bg-slate-700" />
          <div className={`flex items-center gap-2 text-sm font-medium ${step >= 2 ? 'text-teal-400' : 'text-slate-600'}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-teal-500 text-white' : 'bg-slate-800 text-slate-500'}`}>2</div>
            Modules
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
          {step === 1 && (
            <>
              <h2 className="text-xl font-bold text-white mb-2">Créez votre organisation</h2>
              <p className="text-slate-400 text-sm mb-6">C&apos;est le nom de votre entreprise ou structure.</p>
              <label className="block text-sm text-slate-400 mb-1">Nom de l&apos;organisation</label>
              <input
                type="text"
                value={nomOrg}
                onChange={e => setNomOrg(e.target.value)}
                placeholder="Ex: Events Pro, Salle Prestige..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition mb-6"
              />
              <button
                onClick={() => { if (nomOrg.trim()) setStep(2); else setError('Entrez un nom.'); }}
                disabled={!nomOrg.trim()}
                className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition"
              >
                Continuer →
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-xl font-bold text-white mb-2">Choisissez vos modules</h2>
              <p className="text-slate-400 text-sm mb-6">Sélectionnez les modules dont vous avez besoin (10 000 FCFA/module/mois).</p>
              <div className="space-y-3 mb-6">
                {MODULES.map(({ id, icon, title, desc, color }) => {
                  const c = colorMap[color];
                  const selected = selectedModules.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleModule(id)}
                      className={`w-full text-left rounded-xl border p-4 transition ${selected ? `${c.border} ${c.bg}` : 'border-slate-700 hover:border-slate-500'}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{icon}</span>
                        <div className="flex-1">
                          <div className={`font-semibold text-sm ${selected ? c.text : 'text-white'}`}>{title}</div>
                          <div className="text-slate-500 text-xs mt-0.5">{desc}</div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${selected ? `${c.border} bg-teal-500` : 'border-slate-600'}`}>
                          {selected && <span className="text-white text-xs">✓</span>}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedModules.length > 0 && (
                <p className="text-sm text-slate-400 mb-4 text-center">
                  Total : <strong className="text-white">{selectedModules.length * 10000} FCFA / mois</strong>
                </p>
              )}

              {error && <p className="text-red-400 text-sm mb-4 bg-red-400/10 px-3 py-2 rounded-lg">{error}</p>}

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="px-4 py-3 border border-slate-700 text-slate-400 rounded-xl hover:border-slate-500 transition text-sm">
                  ← Retour
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading || selectedModules.length === 0}
                  className="flex-1 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white font-semibold py-3 rounded-xl transition text-sm"
                >
                  {loading ? 'Création...' : 'Lancer mon dashboard →'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
