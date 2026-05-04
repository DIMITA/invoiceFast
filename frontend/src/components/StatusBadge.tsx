import { InvoiceStatus } from '@/lib/types';

const config: Record<InvoiceStatus, { label: string; className: string }> = {
  paid: { label: 'Payée', className: 'bg-green-100 text-green-700' },
  pending: { label: 'En attente', className: 'bg-yellow-100 text-yellow-700' },
  processing: { label: 'En cours', className: 'bg-blue-100 text-blue-700' },
  rejected: { label: 'Rejetée', className: 'bg-red-100 text-red-700' },
};

export default function StatusBadge({ status }: { status: InvoiceStatus }) {
  const { label, className } = config[status] ?? config.pending;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}
