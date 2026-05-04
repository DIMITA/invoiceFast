'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const nav = [
  { label: 'Dashboard', href: '/dashboard', icon: '◎' },
  { label: 'Factures', href: '/dashboard/invoices', icon: '🧾' },
  { label: 'Clients', href: '/dashboard/customers', icon: '🏢' },
  { label: 'FastLane', href: '/dashboard/fastlane', icon: '⚡' },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-60 min-h-screen bg-slate-900 flex flex-col text-white">
      <div className="px-6 py-6 border-b border-slate-700">
        <span className="text-xl font-bold text-blue-400">invoice</span>
        <span className="text-xl font-bold text-white">Fast</span>
        <p className="text-xs text-slate-400 mt-1">SAP Simplifier</p>
      </div>
      <nav className="flex-1 py-4">
        {nav.map((item) => {
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                active ? 'bg-blue-600 text-white font-medium' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-6 py-4 border-t border-slate-700 text-xs text-slate-500">
        Phase 1 — Mock Data
      </div>
    </aside>
  );
}
