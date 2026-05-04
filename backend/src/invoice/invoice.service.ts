import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Invoice, InvoiceStatus } from './invoice.types';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { CustomerService } from '../customer/customer.service';

@Injectable()
export class InvoiceService {
  private invoices: Invoice[] = [
    {
      id: 'inv-001',
      customerId: 'cust-001',
      customerName: 'Dupont & Associés',
      amount: 12500,
      description: 'Prestation développement logiciel - Mars 2025',
      status: 'paid',
      date: '2025-03-01',
      dueDate: '2025-03-31',
      reference: 'SAP-2025-001',
    },
    {
      id: 'inv-002',
      customerId: 'cust-002',
      customerName: 'Renault Industries',
      amount: 45000,
      description: 'Consulting transformation digitale Q1',
      status: 'pending',
      date: '2025-04-01',
      dueDate: '2025-04-30',
      reference: 'SAP-2025-002',
    },
    {
      id: 'inv-003',
      customerId: 'cust-003',
      customerName: 'TotalEnergies',
      amount: 8750,
      description: 'Audit système SAP FI/CO',
      status: 'processing',
      date: '2025-04-10',
      dueDate: '2025-05-10',
      reference: 'SAP-2025-003',
    },
    {
      id: 'inv-004',
      customerId: 'cust-001',
      customerName: 'Dupont & Associés',
      amount: 3200,
      description: 'Support technique mensuel',
      status: 'rejected',
      date: '2025-02-01',
      dueDate: '2025-02-28',
      reference: 'SAP-2025-004',
    },
    {
      id: 'inv-005',
      customerId: 'cust-004',
      customerName: 'Airbus Group',
      amount: 125000,
      description: 'Migration SAP S/4HANA Phase 1',
      status: 'pending',
      date: '2025-04-15',
      dueDate: '2025-05-15',
      reference: 'SAP-2025-005',
    },
  ];

  constructor(private readonly customerService: CustomerService) {}

  findAll(search?: string, status?: InvoiceStatus): Invoice[] {
    let result = [...this.invoices];
    if (status) result = result.filter((i) => i.status === status);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.customerName.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.reference.toLowerCase().includes(q),
      );
    }
    return result.sort((a, b) => b.date.localeCompare(a.date));
  }

  findOne(id: string): Invoice | undefined {
    return this.invoices.find((i) => i.id === id);
  }

  create(dto: CreateInvoiceDto): Invoice {
    const customer = this.customerService.findOne(dto.customerId);
    const invoice: Invoice = {
      id: `inv-${uuidv4().slice(0, 8)}`,
      customerId: dto.customerId,
      customerName: customer?.name ?? 'Unknown',
      amount: dto.amount,
      description: dto.description,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      dueDate: dto.dueDate ?? new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      reference: `SAP-2025-${String(this.invoices.length + 1).padStart(3, '0')}`,
    };
    this.invoices.unshift(invoice);
    return invoice;
  }

  updateStatus(id: string, status: InvoiceStatus): Invoice | undefined {
    const invoice = this.invoices.find((i) => i.id === id);
    if (invoice) invoice.status = status;
    return invoice;
  }

  stats() {
    const total = this.invoices.reduce((sum, i) => sum + i.amount, 0);
    const paid = this.invoices.filter((i) => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
    const pending = this.invoices.filter((i) => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0);
    return {
      total,
      paid,
      pending,
      count: this.invoices.length,
      byStatus: {
        pending: this.invoices.filter((i) => i.status === 'pending').length,
        paid: this.invoices.filter((i) => i.status === 'paid').length,
        processing: this.invoices.filter((i) => i.status === 'processing').length,
        rejected: this.invoices.filter((i) => i.status === 'rejected').length,
      },
    };
  }
}
