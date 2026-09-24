import '../../core/network/api_response.dart';
import '../../shared/models/payment_item.dart';

class PaymentsRepository {
  static final PaymentsRepository instance = PaymentsRepository._();
  PaymentsRepository._();

  final List<PaymentItem> _payments = [
    PaymentItem(
      id: 'pay_001',
      paymentNumber: 'PAY-2026-0034',
      invoiceId: 'inv_081',
      invoiceNumber: 'INV-2026-081',
      amount: 14000,
      currency: 'USD',
      gateway: 'RAZORPAY',
      gatewayTransactionId: 'pay_rzp_live_938174829',
      status: 'COMPLETED',
      createdAt: DateTime(2026, 3, 2),
    ),
    PaymentItem(
      id: 'pay_002',
      paymentNumber: 'PAY-2026-0012',
      invoiceId: 'inv_074',
      invoiceNumber: 'INV-2026-074',
      amount: 21750,
      currency: 'USD',
      gateway: 'CASHFREE',
      gatewayTransactionId: 'cf_tx_live_849204817',
      status: 'COMPLETED',
      createdAt: DateTime(2026, 1, 16),
    ),
  ];

  Future<ApiResponse<List<PaymentItem>>> getPayments() async {
    await Future.delayed(const Duration(milliseconds: 300));
    return ApiResponse.success(List.unmodifiable(_payments));
  }
}
