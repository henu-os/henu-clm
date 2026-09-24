class OrderMilestone {
  final String title;
  final String status;
  final String targetDate;
  final bool isCompleted;

  const OrderMilestone({
    required this.title,
    required this.status,
    required this.targetDate,
    required this.isCompleted,
  });

  factory OrderMilestone.fromJson(Map<String, dynamic> json) {
    return OrderMilestone(
      title: json['title'] as String,
      status: json['status'] as String? ?? 'PENDING',
      targetDate: json['target_date'] as String? ?? '',
      isCompleted: json['is_completed'] as bool? ?? false,
    );
  }
}

class OrderItem {
  final String id;
  final String orderNumber;
  final String title;
  final String status;
  final int progressPercent;
  final String currentMilestone;
  final double totalAmount;
  final String currency;
  final String? linkedQuoteId;
  final String? linkedInvoiceId;
  final DateTime startDate;
  final DateTime targetDeliveryDate;
  final List<OrderMilestone> milestones;

  const OrderItem({
    required this.id,
    required this.orderNumber,
    required this.title,
    required this.status,
    required this.progressPercent,
    required this.currentMilestone,
    required this.totalAmount,
    required this.currency,
    this.linkedQuoteId,
    this.linkedInvoiceId,
    required this.startDate,
    required this.targetDeliveryDate,
    required this.milestones,
  });

  factory OrderItem.fromJson(Map<String, dynamic> json) {
    return OrderItem(
      id: json['id'] as String,
      orderNumber: json['order_number'] as String,
      title: json['title'] as String,
      status: json['status'] as String? ?? 'IN_PROGRESS',
      progressPercent: json['progress_percent'] as int? ?? 0,
      currentMilestone: json['current_milestone'] as String? ?? 'Phase 1',
      totalAmount: (json['total_amount'] as num?)?.toDouble() ?? 0.0,
      currency: json['currency'] as String? ?? 'USD',
      linkedQuoteId: json['linked_quote_id'] as String?,
      linkedInvoiceId: json['linked_invoice_id'] as String?,
      startDate: DateTime.tryParse(json['start_date'] as String? ?? '') ?? DateTime.now(),
      targetDeliveryDate: DateTime.tryParse(json['target_delivery_date'] as String? ?? '') ?? DateTime.now().add(const Duration(days: 60)),
      milestones: (json['milestones'] as List<dynamic>?)
              ?.map((e) => OrderMilestone.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }
}
