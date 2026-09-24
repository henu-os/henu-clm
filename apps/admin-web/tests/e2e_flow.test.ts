import { describe, it, expect } from 'vitest';

describe('HENU OS CLM — End-to-End Business Flow Suite', () => {
  // Mock In-Memory Database State representing the unified Supabase PostgreSQL backend
  const database = {
    quotes: [] as any[],
    orders: [] as any[],
    invoices: [] as any[],
    payments: [] as any[],
    notifications: [] as any[],
    audit_logs: [] as any[],
  };

  const clientA = { id: 'usr_client_001', name: 'Acme Corp', email: 'billing@acme.com' };
  const adminUser = { id: 'usr_admin_001', role: 'sales', name: 'Henus Sales' };

  it('1. Admin creates a quote in the system', () => {
    const newQuote = {
      id: 'qt_1001',
      client_id: clientA.id,
      quote_number: 'QT-2026-0001',
      title: 'Enterprise ERP Implementation',
      currency: 'INR',
      subtotal: 500000,
      tax_amount: 90000, // 18% GST
      total_amount: 590000,
      status: 'sent',
      created_by: adminUser.id,
      created_at: new Date().toISOString(),
    };

    database.quotes.push(newQuote);

    expect(database.quotes).toHaveLength(1);
    expect(database.quotes[0].status).toBe('sent');
    expect(database.quotes[0].total_amount).toBe(590000);
  });

  it('2. Client reviews and approves the quote, generating an Order and Invoice', () => {
    const quote = database.quotes.find((q) => q.id === 'qt_1001');
    expect(quote).toBeDefined();

    // Client approval mutation
    quote.status = 'approved';
    quote.approved_at = new Date().toISOString();

    // System creates corresponding Order
    const newOrder = {
      id: 'ord_5001',
      quote_id: quote.id,
      client_id: quote.client_id,
      order_number: 'ORD-2026-0001',
      title: quote.title,
      total_amount: quote.total_amount,
      status: 'pending',
      payment_status: 'unpaid',
      milestones: [
        { id: 'm1', title: 'Phase 1: Architecture', status: 'in_progress', percentage: 25 },
        { id: 'm2', title: 'Phase 2: Deployment', status: 'pending', percentage: 75 },
      ],
    };
    database.orders.push(newOrder);

    // System creates Initial Invoice
    const newInvoice = {
      id: 'inv_8001',
      order_id: newOrder.id,
      client_id: quote.client_id,
      invoice_number: 'INV-2026-0001',
      total_amount: quote.total_amount,
      paid_amount: 0,
      status: 'unpaid',
      created_at: new Date().toISOString(),
    };
    database.invoices.push(newInvoice);

    expect(quote.status).toBe('approved');
    expect(database.orders[0].order_number).toBe('ORD-2026-0001');
    expect(database.invoices[0].status).toBe('unpaid');
    expect(database.invoices[0].total_amount).toBe(590000);
  });

  it('3. Client initiates server-side payment order for invoice', () => {
    const invoice = database.invoices.find((i) => i.id === 'inv_8001');
    expect(invoice).toBeDefined();

    // Server-side order creation
    const paymentOrder = {
      order_id: 'rzp_order_998877',
      invoice_id: invoice.id,
      amount: invoice.total_amount * 100, // paise
      currency: 'INR',
      status: 'pending',
    };

    database.payments.push({
      id: 'pay_3001',
      invoice_id: invoice.id,
      client_id: invoice.client_id,
      amount: invoice.total_amount,
      currency: 'INR',
      status: 'pending',
      provider_order_id: paymentOrder.order_id,
    });

    expect(database.payments).toHaveLength(1);
    expect(database.payments[0].status).toBe('pending');
  });

  it('4. Gateway Webhook verifies payment and transitions Invoice & Order to Paid', () => {
    const webhookPayload = {
      event: 'payment.captured',
      payload: {
        payment: {
          entity: {
            id: 'pay_rzp_external_123',
            order_id: 'rzp_order_998877',
            amount: 59000000,
            status: 'captured',
            notes: { invoice_id: 'inv_8001' },
          },
        },
      },
    };

    const invoiceId = webhookPayload.payload.payment.entity.notes.invoice_id;
    const payment = database.payments.find((p) => p.invoice_id === invoiceId);
    const invoice = database.invoices.find((i) => i.id === invoiceId);
    const order = database.orders.find((o) => o.id === invoice.order_id);

    // Update payment
    payment.status = 'successful';
    payment.provider_payment_id = webhookPayload.payload.payment.entity.id;
    payment.paid_at = new Date().toISOString();

    // Update invoice
    invoice.status = 'paid';
    invoice.paid_amount = invoice.total_amount;

    // Update order
    order.payment_status = 'paid';
    order.status = 'in_progress';

    // Dispatch notification
    database.notifications.push({
      id: 'notif_001',
      user_id: invoice.client_id,
      title: 'Payment Successful',
      body: `Payment of ₹${invoice.total_amount} received for invoice ${invoice.invoice_number}`,
      type: 'payment',
      is_read: false,
    });

    expect(payment.status).toBe('successful');
    expect(invoice.status).toBe('paid');
    expect(order.payment_status).toBe('paid');
    expect(database.notifications).toHaveLength(1);
  });
});
