'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Customer, ParsedInvoice } from '@/lib/types';

const examples = [
  'Facture 1200€ client Dupont pour prestation développement',
  'Invoice 45000 euros Renault consulting transformation digitale',
  'Facturer TotalEnergies 8750€ audit système SAP',
  'Facture Airbus 125000 euros migration S/4HANA',
];

export default function FastlanePage() {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [parsed, setParsed] = useState<ParsedInvoice | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [step, setStep] = useState<'input' | 'confirm'>('input');

  const parse = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setParsed(null);
    try {
      const result = await api.ai.fastlane(input);
      setParsed(result);
      const cList = await api.customers.list(result.customerName);
      setCustomers(cList);
      if (cList.length > 0) setSelectedCustomerId(cList[0].id);
      setStep('confirm');
    } catch {
      alert('Erreur de parsing. Backend disponible?');
    } finally {
      setLoading(false);
    }
  };

  const confirm = async () => {
    if (!parsed || !selectedCustomerId) return;
    setCreating(true);
    try {
      await api.invoices.create({
        customerId: selectedCustomerId,
        amount: parsed.amount,
        description: parsed.description,
      });
      router.push('/dashboard/invoices');
    } catch {
      alert('Erreur de création.');
      setCreating(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">⚡ Invoice FastLane</h1>
        <p className="text-gray-500 mt-1">Créez une facture en une phrase naturelle</p>
      </div>

      {step === 'input' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Décrivez votre facture
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && e.metaKey) parse(); }}
              rows={3}
              placeholder="Ex: Facture 1200€ client Dupont pour prestation développement..."
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs text-gray-400">⌘+Entrée pour valider</span>
              <button
                onClick={parse}
                disabled={loading || !input.trim()}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
              >
                {loading ? 'Analyse en cours...' : '⚡ Analyser'}
              </button>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider font-medium">Exemples</p>
            <div className="space-y-2">
              {examples.map((ex) => (
                <button
                  key={ex}
                  onClick={() => setInput(ex)}
                  className="w-full text-left text-sm px-4 py-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-600 hover:text-blue-700 transition-colors"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 'confirm' && parsed && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900">Facture détectée</h2>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                parsed.confidence > 0.8 ? 'bg-green-100 text-green-700' :
                parsed.confidence > 0.5 ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                Confiance: {Math.round(parsed.confidence * 100)}%
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Client détecté</label>
                <p className="text-gray-900 font-medium">{parsed.customerName}</p>
              </div>

              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Client SAP</label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionner...</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Montant</label>
                <p className="text-2xl font-bold text-gray-900">
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(parsed.amount)}
                </p>
              </div>

              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Description</label>
                <p className="text-gray-900">{parsed.description}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-700">
            Input original: <em>"{input}"</em>
          </div>

          <div className="flex gap-3">
            <button
              onClick={confirm}
              disabled={creating || !selectedCustomerId}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {creating ? 'Création...' : '✓ Confirmer et créer'}
            </button>
            <button
              onClick={() => { setStep('input'); setParsed(null); }}
              className="px-6 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Modifier
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
