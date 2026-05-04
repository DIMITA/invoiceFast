import { Injectable } from '@nestjs/common';
import { Customer } from './customer.types';

@Injectable()
export class CustomerService {
  private customers: Customer[] = [
    { id: 'cust-001', name: 'Dupont & Associés', email: 'compta@dupont.fr', vatNumber: 'FR12345678901', country: 'FR' },
    { id: 'cust-002', name: 'Renault Industries', email: 'finance@renault.fr', vatNumber: 'FR98765432109', country: 'FR' },
    { id: 'cust-003', name: 'TotalEnergies', email: 'ap@totalenergies.com', vatNumber: 'FR11223344556', country: 'FR' },
    { id: 'cust-004', name: 'Airbus Group', email: 'invoice@airbus.com', vatNumber: 'FR55667788990', country: 'FR' },
    { id: 'cust-005', name: 'LVMH Groupe', email: 'comptabilite@lvmh.fr', vatNumber: 'FR99887766554', country: 'FR' },
    { id: 'cust-006', name: 'Société Générale', email: 'fournisseurs@sgcib.com', vatNumber: 'FR33221100998', country: 'FR' },
  ];

  findAll(search?: string): Customer[] {
    if (!search) return this.customers;
    const q = search.toLowerCase();
    return this.customers.filter((c) => c.name.toLowerCase().includes(q));
  }

  findOne(id: string): Customer | undefined {
    return this.customers.find((c) => c.id === id);
  }
}
