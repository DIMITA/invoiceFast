'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { InvoiceStats } from '@/lib/types';
import StatusBadge from '@/components/StatusBadge';

export default function DashboardPage() {
  const [stats, setStats] = useState<InvoiceStats | null>(null);
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    api.invoices.stats().then(setStats).catch(console.error);
    api.invoices.list().then((list) => setRecent(list.slice(0, 5))).catch(console.error);
  }, []);

  const fmt = (n: number) =>
    new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(n);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Vue d'ensemble de votre activité facturation</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Volume total', value: stats ? fmt(stats.total) : '—', sub: `${stats?.count ?? 0} factures` },
          { label: 'Payées', value: stats ? fmt(stats.paid) : '—', sub: `${stats?.byStatus.paid ?? 0} factures`, green: true },
          { label: 'En attente', value: stats ? fmt(stats.pending) : '—', sub: `${stats?.byStatus.pending ?? 0} factures`, yellow: true },
          { label: 'En traitement', value: stats?.byStatus.processing ?? '—', sub: 'factures', blue: true },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.green ? 'text-green-600' : s.yellow ? 'text-yellow-600' : s.blue ? 'text-blue-600' : 'text-gray-900'}`}>
              {s.value}
            </p>
            <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* FastLane CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">⚡ Invoice FastLane</h2>
            <p className="text-blue-200 mt-1">Créez une facture en une phrase</p>
            <p className="text-sm text-blue-300 mt-1 italic">"Facture 1200€ client Dupont pour prestation dev"</p>
          </div>
          <Link href="/dashboard/fastlane" className="bg-white text-blue-700 font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-50 transition-colors">
            Ouvrir FastLane →
          </Link>
        </div>
      </div>

      {/* Recent invoices */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-semibold text-gray-900">Factures récentes</h2>
          <Link href="/dashboard/invoices" className="text-sm text-blue-600 hover:text-blue-700">Voir tout →</Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recent.map((inv) => (
            <div key={inv.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
              <div>
                <p className="font-medium text-gray-900">{inv.customerName}</p>
                <p className="text-sm text-gray-500">{inv.description}</p>
              </div>
              <div className="text-right flex items-center gap-4">
                <StatusBadge status={inv.status} />
                <p className="font-semibold text-gray-900">{fmt(inv.amount)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
