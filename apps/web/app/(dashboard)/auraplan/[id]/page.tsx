'use client';

import { useEffect, useState } from 'react';
import { eventsApi, tasksApi } from '@/lib/api';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

type Task = {
  id: string;
  titre: string;
  description?: string;
  date_butoir: string;
  statut: 'À faire' | 'En cours' | 'Terminé';
  priorite: string;
};

type Event = {
  id: string;
  nom: string;
  date_evenement: string;
  lieu?: string;
  description?: string;
  statut: string;
  taches_plan_action: Task[];
};

const statutColors = {
  'À faire': 'border-slate-600 text-slate-400',
  'En cours': 'border-blue-500 text-blue-400',
  'Terminé': 'border-green-500 text-green-400',
};

const prioriteColors: Record<string, string> = {
  urgente: 'text-red-400',
  haute: 'text-orange-400',
  normale: 'text-slate-400',
  basse: 'text-slate-500',
};

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskForm, setTaskForm] = useState({
    titre: '',
    date_butoir: '',
    description: '',
    priorite: 'normale',
  });

  const loadData = async () => {
    const ev = await eventsApi.get(id);
    setEvent(ev);
    setTasks(ev.taches_plan_action ?? []);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [id]);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const task = await tasksApi.create({ ...taskForm, evenement_id: id });
    setTasks((prev) => [...prev, task]);
    setTaskForm({ titre: '', date_butoir: '', description: '', priorite: 'normale' });
    setShowTaskForm(false);
  };

  const updateTaskStatus = async (taskId: string, statut: string) => {
    await tasksApi.update(taskId, { statut });
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, statut: statut as Task['statut'] } : t)),
    );
  };

  const deleteEvent = async () => {
    if (!confirm('Supprimer cet événement et toutes ses tâches ?')) return;
    await eventsApi.delete(id);
    router.push('/auraplan');
  };

  const daysUntil = (d: string) => {
    const diff = Math.ceil(
      (new Date(d).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
    );
    if (diff < 0) return `${Math.abs(diff)}j dépassé`;
    if (diff === 0) return "Aujourd'hui";
    return `J-${diff}`;
  };

  if (loading) return <div className="p-8 text-slate-400">Chargement...</div>;
  if (!event) return <div className="p-8 text-red-400">Événement introuvable</div>;

  const tasksByStatus = {
    'À faire': tasks.filter((t) => t.statut === 'À faire'),
    'En cours': tasks.filter((t) => t.statut === 'En cours'),
    'Terminé': tasks.filter((t) => t.statut === 'Terminé'),
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Link href="/auraplan" className="text-slate-400 hover:text-white text-sm">
          ← AuraPlan
        </Link>
        <div className="flex items-start justify-between mt-2">
          <div>
            <h1 className="text-2xl font-bold text-white">{event.nom}</h1>
            <p className="text-slate-400 text-sm mt-1">
              📅 {new Date(event.date_evenement).toLocaleDateString('fr-FR', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
              })}
              {event.lieu && ` — 📍 ${event.lieu}`}
            </p>
          </div>
          <button onClick={deleteEvent} className="text-red-400 hover:text-red-300 text-sm transition">
            Supprimer
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {Object.entries(tasksByStatus).map(([statut, list]) => (
          <div key={statut} className={`bg-slate-900 border rounded-lg p-4 ${statutColors[statut as keyof typeof statutColors]}`}>
            <p className="text-2xl font-bold">{list.length}</p>
            <p className="text-sm">{statut}</p>
          </div>
        ))}
      </div>

      {/* Tasks */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Plan d&apos;action</h2>
        <button
          onClick={() => setShowTaskForm(!showTaskForm)}
          className="bg-orange-600 hover:bg-orange-500 text-white text-sm px-3 py-1.5 rounded-lg transition"
        >
          + Ajouter une tâche
        </button>
      </div>

      {showTaskForm && (
        <form onSubmit={addTask} className="bg-slate-900 border border-orange-500/30 rounded-xl p-5 mb-6 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Titre *</label>
              <input
                type="text"
                value={taskForm.titre}
                onChange={(e) => setTaskForm({ ...taskForm, titre: e.target.value })}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
                placeholder="Réserver la salle..."
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Date limite *</label>
              <input
                type="date"
                value={taskForm.date_butoir}
                onChange={(e) => setTaskForm({ ...taskForm, date_butoir: e.target.value })}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={taskForm.priorite}
              onChange={(e) => setTaskForm({ ...taskForm, priorite: e.target.value })}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-orange-500"
            >
              <option value="basse">Priorité basse</option>
              <option value="normale">Priorité normale</option>
              <option value="haute">Priorité haute</option>
              <option value="urgente">Urgente</option>
            </select>
            <button type="submit" className="ml-auto bg-orange-600 hover:bg-orange-500 text-white text-sm px-4 py-2 rounded-lg transition">
              Créer
            </button>
          </div>
        </form>
      )}

      {/* Task list */}
      <div className="space-y-2">
        {tasks.length === 0 ? (
          <p className="text-slate-500 text-center py-10">Aucune tâche — commencez par en ajouter une !</p>
        ) : (
          tasks
            .sort((a, b) => new Date(a.date_butoir).getTime() - new Date(b.date_butoir).getTime())
            .map((task) => (
              <div
                key={task.id}
                className={`flex items-center gap-4 bg-slate-900 border rounded-lg px-4 py-3 ${
                  task.statut === 'Terminé' ? 'border-slate-800 opacity-60' : 'border-slate-800'
                }`}
              >
                <select
                  value={task.statut}
                  onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-white focus:outline-none"
                >
                  <option>À faire</option>
                  <option>En cours</option>
                  <option>Terminé</option>
                </select>

                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm ${task.statut === 'Terminé' ? 'line-through text-slate-500' : 'text-white'}`}>
                    {task.titre}
                  </p>
                </div>

                <span className={`text-xs ${prioriteColors[task.priorite]}`}>
                  {task.priorite}
                </span>

                <span className="text-xs text-slate-400 whitespace-nowrap">
                  {daysUntil(task.date_butoir)}
                </span>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
