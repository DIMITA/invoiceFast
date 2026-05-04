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
