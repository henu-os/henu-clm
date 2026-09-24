import '../../core/network/api_response.dart';
import '../../shared/models/invoice_item.dart';

class InvoicesRepository {
  static final InvoicesRepository instance = InvoicesRepository._();
  InvoicesRepository._();

  final List<InvoiceItem> _invoices = [
    InvoiceItem(
      id: 'inv_089',
      invoiceNumber: 'INV-2026-089',
      title: 'Custom Software Sprint 3 Deliverable',
      status: 'SENT',
      subtotal: 10593.22,
      tax: 1906.78,
      discount: 0,
      totalAmount: 12500,
      balanceDue: 12500,
      currency: 'USD',
      issueDate: DateTime(2026, 5, 1),
      dueDate: DateTime(2026, 5, 20),
      pdfDownloadUrl: 'https://clm-project.supabase.co/storage/v1/object/public/invoices/INV-2026-089.pdf',
    ),
    InvoiceItem(
      id: 'inv_081',
      invoiceNumber: 'INV-2026-081',
      title: 'Enterprise Platform Kickoff & Discovery',
      status: 'PAID',
      subtotal: 11864.41,
      tax: 2135.59,
      discount: 0,
      totalAmount: 14000,
      balanceDue: 0,
      currency: 'USD',
      issueDate: DateTime(2026, 3, 1),
      dueDate: DateTime(2026, 3, 15),
      pdfDownloadUrl: 'https://clm-project.supabase.co/storage/v1/object/public/invoices/INV-2026-081.pdf',
    ),
    InvoiceItem(
      id: 'inv_074',
      invoiceNumber: 'INV-2026-074',
      title: 'Architecture & Cloud Optimization Retainer',
      status: 'PAID',
      subtotal: 18432.20,
      tax: 3317.80,
      discount: 0,
      totalAmount: 21750,
      balanceDue: 0,
      currency: 'USD',
      issueDate: DateTime(2026, 1, 15),
      dueDate: DateTime(2026, 1, 30),
      pdfDownloadUrl: 'https://clm-project.supabase.co/storage/v1/object/public/invoices/INV-2026-074.pdf',
    ),
  ];

  Future<ApiResponse<List<InvoiceItem>>> getInvoices() async {
    await Future.delayed(const Duration(milliseconds: 300));
    return ApiResponse.success(List.unmodifiable(_invoices));
  }

  Future<ApiResponse<InvoiceItem>> recordMockPayment(String invoiceId) async {
    await Future.delayed(const Duration(milliseconds: 800));
    final index = _invoices.indexWhere((i) => i.id == invoiceId);
    if (index == -1) return const ApiResponse.error('Invoice not found.');

    final current = _invoices[index];
    final updated = InvoiceItem(
      id: current.id,
      invoiceNumber: current.invoiceNumber,
      title: current.title,
      status: 'PAID',
      subtotal: current.subtotal,
      tax: current.tax,
      discount: current.discount,
      totalAmount: current.totalAmount,
      balanceDue: 0,
      currency: current.currency,
      issueDate: current.issueDate,
      dueDate: current.dueDate,
      pdfDownloadUrl: current.pdfDownloadUrl,
    );
    _invoices[index] = updated;
    return ApiResponse.success(updated);
  }
}
