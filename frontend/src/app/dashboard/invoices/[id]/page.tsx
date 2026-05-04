'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Invoice, InvoiceStatus } from '@/lib/types';
import StatusBadge from '@/components/StatusBadge';
import { useToast } from '@/components/Toast';

const TRANSITIONS: Record<InvoiceStatus, { label: string; next: InvoiceStatus; color: string }[]> = {
  pending: [
    { label: 'Approuver', next: 'processing', color: 'bg-blue-600 hover:bg-blue-700' },
    { label: 'Rejeter', next: 'rejected', color: 'bg-red-600 hover:bg-red-700' },
  ],
  processing: [
    { label: 'Marquer payée', next: 'paid', color: 'bg-green-600 hover:bg-green-700' },
    { label: 'Rejeter', next: 'rejected', color: 'bg-red-600 hover:bg-red-700' },
  ],
  paid: [],
  rejected: [
    { label: 'Remettre en attente', next: 'pending', color: 'bg-gray-600 hover:bg-gray-700' },
  ],
};

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.invoices.get(id).then(setInvoice).catch(() => router.replace('/dashboard/invoices')).finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (status: InvoiceStatus) => {
    if (!invoice) return;
    const updated = await api.invoices.updateStatus(invoice.id, status);
    setInvoice(updated);
    toast(`Statut mis à jour : ${status}`);
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);

  if (loading) return <div className="p-8 text-gray-400">Chargement...</div>;
  if (!invoice) return null;

  const actions = TRANSITIONS[invoice.status] ?? [];

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-gray-600 text-sm">← Retour</button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{invoice.reference}</h1>
            <StatusBadge status={invoice.status} />
          </div>
          <p className="text-gray-500 text-sm mt-1">{invoice.customerName}</p>
        </div>
        <p className="text-3xl font-bold text-gray-900">{fmt(invoice.amount)}</p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Détails</h2>
          <dl className="space-y-3">
            {[
              { label: 'Client', value: invoice.customerName },
              { label: 'Description', value: invoice.description },
              { label: 'Date', value: invoice.date },
              { label: 'Échéance', value: invoice.dueDate },
              { label: 'Référence SAP', value: invoice.reference },
            ].map(({ label, value }) => (
              <div key={label}>
                <dt className="text-xs text-gray-500 uppercase tracking-wider">{label}</dt>
                <dd className="text-sm text-gray-900 mt-0.5">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Workflow</h2>
          <div className="space-y-3 mb-6">
            {(['pending', 'processing', 'paid'] as InvoiceStatus[]).map((s) => {
              const reached =
                s === 'paid' ? invoice.status === 'paid' :
                s === 'processing' ? ['processing', 'paid'].includes(invoice.status) :
                true;
              const active = invoice.status === s;
              return (
                <div key={s} className={`flex items-center gap-3 text-sm ${reached ? (active ? 'text-blue-600 font-medium' : 'text-gray-400') : 'text-gray-200'}`}>
                  <span className={`w-2 h-2 rounded-full ${active ? 'bg-blue-600' : reached ? 'bg-gray-300' : 'bg-gray-100'}`} />
                  {{ pending: 'En attente', processing: 'En traitement', paid: 'Payée' }[s]}
                </div>
              );
            })}
            {invoice.status === 'rejected' && (
              <div className="flex items-center gap-3 text-sm text-red-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-red-600" />
                Rejetée
              </div>
            )}
          </div>

          {actions.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Actions</p>
              {actions.map((action) => (
                <button
                  key={action.next}
                  onClick={() => updateStatus(action.next)}
                  className={`w-full text-white py-2 rounded-lg text-sm font-medium transition-colors ${action.color}`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
