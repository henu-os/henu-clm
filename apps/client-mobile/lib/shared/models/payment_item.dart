class PaymentItem {
  final String id;
  final String paymentNumber;
  final String invoiceId;
  final String invoiceNumber;
  final double amount;
  final String currency;
  final String gateway;
  final String gatewayTransactionId;
  final String status;
  final DateTime createdAt;

  const PaymentItem({
    required this.id,
    required this.paymentNumber,
    required this.invoiceId,
    required this.invoiceNumber,
    required this.amount,
    required this.currency,
    required this.gateway,
    required this.gatewayTransactionId,
    required this.status,
    required this.createdAt,
  });

  factory PaymentItem.fromJson(Map<String, dynamic> json) {
    return PaymentItem(
      id: json['id'] as String,
      paymentNumber: json['payment_number'] as String,
      invoiceId: json['invoice_id'] as String,
      invoiceNumber: json['invoice_number'] as String? ?? 'INV-0000',
      amount: (json['amount'] as num?)?.toDouble() ?? 0.0,
      currency: json['currency'] as String? ?? 'USD',
      gateway: json['gateway'] as String? ?? 'RAZORPAY',
      gatewayTransactionId: json['gateway_transaction_id'] as String? ?? '',
      status: json['status'] as String? ?? 'COMPLETED',
      createdAt: DateTime.tryParse(json['created_at'] as String? ?? '') ?? DateTime.now(),
    );
  }
}
