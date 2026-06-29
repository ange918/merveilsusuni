import { createClient } from './supabase/client';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function getAuthHeaders(): Promise<HeadersInit> {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/v1${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers ?? {}) },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Erreur réseau' }));
    throw new Error(err.message ?? 'Erreur serveur');
  }

  return res.json();
}

// AuraPlan - Events
export const eventsApi = {
  list: () => request<any[]>('/auraplan/events'),
  get: (id: string) => request<any>(`/auraplan/events/${id}`),
  create: (data: any) =>
    request<any>('/auraplan/events', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    request<any>(`/auraplan/events/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: string) =>
    request<any>(`/auraplan/events/${id}`, { method: 'DELETE' }),
};

// AuraPlan - Tasks
export const tasksApi = {
  listByEvent: (eventId: string) =>
    request<any[]>(`/auraplan/tasks/event/${eventId}`),
  create: (data: any) =>
    request<any>('/auraplan/tasks', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    request<any>(`/auraplan/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: string) =>
    request<any>(`/auraplan/tasks/${id}`, { method: 'DELETE' }),
};

// SpaceFlow - Spaces
export const spacesApi = {
  list: () => request<any[]>('/spaceflow/spaces'),
  get: (id: string) => request<any>(`/spaceflow/spaces/${id}`),
  create: (data: any) =>
    request<any>('/spaceflow/spaces', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    request<any>(`/spaceflow/spaces/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (id: string) =>
    request<any>(`/spaceflow/spaces/${id}`, { method: 'DELETE' }),
};

// SpaceFlow - Reservations
export const reservationsApi = {
  list: () => request<any[]>('/spaceflow/reservations'),
  listBySpace: (spaceId: string) =>
    request<any[]>(`/spaceflow/reservations/space/${spaceId}`),
  get: (id: string) => request<any>(`/spaceflow/reservations/${id}`),
  create: (data: any) =>
    request<any>('/spaceflow/reservations', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    request<any>(`/spaceflow/reservations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  cancel: (id: string) =>
    request<any>(`/spaceflow/reservations/${id}`, { method: 'DELETE' }),
  downloadInvoice: async (reservationId: string) => {
    const headers = await getAuthHeaders();
    const res = await fetch(
      `${API_URL}/api/v1/spaceflow/invoices/${reservationId}/pdf`,
      { headers },
    );
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `facture-${reservationId.slice(0, 8)}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  },
};
