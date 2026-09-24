import '../../core/network/api_response.dart';
import '../../shared/models/order_item.dart';

class OrdersRepository {
  static final OrdersRepository instance = OrdersRepository._();
  OrdersRepository._();

  final List<OrderItem> _orders = [
    OrderItem(
      id: 'ord_001',
      orderNumber: 'ORD-2026-0042',
      title: 'Enterprise Platform Transformation',
      status: 'IN_PROGRESS',
      progressPercent: 72,
      currentMilestone: 'Milestone 4 of 6: Staging Deployment · May 14',
      totalAmount: 48000,
      currency: 'USD',
      linkedQuoteId: 'qt_103',
      linkedInvoiceId: 'inv_089',
      startDate: DateTime(2026, 3, 1),
      targetDeliveryDate: DateTime(2026, 5, 30),
      milestones: const [
        OrderMilestone(title: 'Discovery & Architecture Blueprint', status: 'COMPLETED', targetDate: 'Mar 15', isCompleted: true),
        OrderMilestone(title: 'Core Backend & Database Provisioning', status: 'COMPLETED', targetDate: 'Apr 10', isCompleted: true),
        OrderMilestone(title: 'Integration & Security Audit', status: 'COMPLETED', targetDate: 'Apr 30', isCompleted: true),
        OrderMilestone(title: 'Staging Deployment & User Testing', status: 'IN_PROGRESS', targetDate: 'May 14', isCompleted: false),
        OrderMilestone(title: 'Performance & Hardening', status: 'PENDING', targetDate: 'May 22', isCompleted: false),
        OrderMilestone(title: 'Production Cutover & Launch', status: 'PENDING', targetDate: 'May 30', isCompleted: false),
      ],
    ),
    OrderItem(
      id: 'ord_002',
      orderNumber: 'ORD-2026-0038',
      title: 'AI Customer Service Engine',
      status: 'COMPLETED',
      progressPercent: 100,
      currentMilestone: 'Completed & Delivered',
      totalAmount: 22000,
      currency: 'USD',
      linkedQuoteId: 'qt_099',
      linkedInvoiceId: 'inv_081',
      startDate: DateTime(2026, 1, 10),
      targetDeliveryDate: DateTime(2026, 2, 28),
      milestones: const [
        OrderMilestone(title: 'Model Fine-Tuning & Knowledge Base', status: 'COMPLETED', targetDate: 'Jan 25', isCompleted: true),
        OrderMilestone(title: 'Edge Function Deployment', status: 'COMPLETED', targetDate: 'Feb 15', isCompleted: true),
        OrderMilestone(title: 'Client Sign-off & Production Delivery', status: 'COMPLETED', targetDate: 'Feb 28', isCompleted: true),
      ],
    ),
  ];

  Future<ApiResponse<List<OrderItem>>> getOrders() async {
    await Future.delayed(const Duration(milliseconds: 300));
    return ApiResponse.success(List.unmodifiable(_orders));
  }
}
