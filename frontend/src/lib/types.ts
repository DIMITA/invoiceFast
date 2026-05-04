export type InvoiceStatus = 'pending' | 'paid' | 'rejected' | 'processing';

export interface Invoice {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  description: string;
  status: InvoiceStatus;
  date: string;
  dueDate: string;
  reference: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  vatNumber: string;
  country: string;
}

export interface InvoiceStats {
  total: number;
  paid: number;
  pending: number;
  count: number;
  byStatus: {
    pending: number;
    paid: number;
    processing: number;
    rejected: number;
  };
}

export interface ParsedInvoice {
  customerName: string;
  amount: number;
  description: string;
  confidence: number;
}
