class InvoiceItem {
  final String id;
  final String invoiceNumber;
  final String title;
  final String status;
  final double subtotal;
  final double tax;
  final double discount;
  final double totalAmount;
  final double balanceDue;
  final String currency;
  final DateTime issueDate;
  final DateTime dueDate;
  final String? pdfDownloadUrl;

  const InvoiceItem({
    required this.id,
    required this.invoiceNumber,
    required this.title,
    required this.status,
    required this.subtotal,
    required this.tax,
    required this.discount,
    required this.totalAmount,
    required this.balanceDue,
    required this.currency,
    required this.issueDate,
    required this.dueDate,
    this.pdfDownloadUrl,
  });

  bool get isPayable => status == 'SENT' || status == 'PARTIALLY_PAID' || status == 'OVERDUE';
  bool get isPaid => status == 'PAID';

  factory InvoiceItem.fromJson(Map<String, dynamic> json) {
    return InvoiceItem(
      id: json['id'] as String,
      invoiceNumber: json['invoice_number'] as String,
      title: json['title'] as String? ?? 'Enterprise Deliverables',
      status: json['status'] as String? ?? 'SENT',
      subtotal: (json['subtotal'] as num?)?.toDouble() ?? 0.0,
      tax: (json['tax'] as num?)?.toDouble() ?? 0.0,
      discount: (json['discount'] as num?)?.toDouble() ?? 0.0,
      totalAmount: (json['total_amount'] as num?)?.toDouble() ?? 0.0,
      balanceDue: (json['balance_due'] as num?)?.toDouble() ?? 0.0,
      currency: json['currency'] as String? ?? 'USD',
      issueDate: DateTime.tryParse(json['issue_date'] as String? ?? '') ?? DateTime.now(),
      dueDate: DateTime.tryParse(json['due_date'] as String? ?? '') ?? DateTime.now().add(const Duration(days: 14)),
      pdfDownloadUrl: json['pdf_download_url'] as String?,
    );
  }
}
