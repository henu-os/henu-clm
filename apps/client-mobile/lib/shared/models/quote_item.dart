class QuoteLineItem {
  final String title;
  final String description;
  final int quantity;
  final double unitPrice;
  final double total;

  const QuoteLineItem({
    required this.title,
    required this.description,
    required this.quantity,
    required this.unitPrice,
    required this.total,
  });

  factory QuoteLineItem.fromJson(Map<String, dynamic> json) {
    return QuoteLineItem(
      title: json['title'] as String,
      description: json['description'] as String? ?? '',
      quantity: json['quantity'] as int? ?? 1,
      unitPrice: (json['unit_price'] as num?)?.toDouble() ?? 0.0,
      total: (json['total'] as num?)?.toDouble() ?? 0.0,
    );
  }
}

class QuoteItem {
  final String id;
  final String quoteNumber;
  final String title;
  final String status;
  final double subtotal;
  final double tax;
  final double discount;
  final double totalAmount;
  final String currency;
  final DateTime validUntil;
  final DateTime createdAt;
  final List<QuoteLineItem> items;
  final String? rejectionReason;

  const QuoteItem({
    required this.id,
    required this.quoteNumber,
    required this.title,
    required this.status,
    required this.subtotal,
    required this.tax,
    required this.discount,
    required this.totalAmount,
    required this.currency,
    required this.validUntil,
    required this.createdAt,
    required this.items,
    this.rejectionReason,
  });

  bool get isActionable => status == 'PENDING_APPROVAL' || status == 'DRAFT' || status == 'SENT';
  bool get isApproved => status == 'APPROVED' || status == 'CONVERTED';
  bool get isRejected => status == 'REJECTED';

  factory QuoteItem.fromJson(Map<String, dynamic> json) {
    return QuoteItem(
      id: json['id'] as String,
      quoteNumber: json['quote_number'] as String,
      title: json['title'] as String,
      status: json['status'] as String,
      subtotal: (json['subtotal'] as num?)?.toDouble() ?? 0.0,
      tax: (json['tax'] as num?)?.toDouble() ?? 0.0,
      discount: (json['discount'] as num?)?.toDouble() ?? 0.0,
      totalAmount: (json['total_amount'] as num?)?.toDouble() ?? 0.0,
      currency: json['currency'] as String? ?? 'USD',
      validUntil: DateTime.tryParse(json['valid_until'] as String? ?? '') ?? DateTime.now().add(const Duration(days: 30)),
      createdAt: DateTime.tryParse(json['created_at'] as String? ?? '') ?? DateTime.now(),
      items: (json['items'] as List<dynamic>?)
              ?.map((e) => QuoteLineItem.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
      rejectionReason: json['rejection_reason'] as String?,
    );
  }
}
