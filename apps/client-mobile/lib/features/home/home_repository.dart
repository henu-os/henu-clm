import '../../core/network/api_response.dart';
import '../../shared/models/invoice_item.dart';
import '../../shared/models/order_item.dart';

class HomeDashboardData {
  final String greeting;
  final String subGreeting;
  final String clientId;
  final String heroTitle;
  final String heroSubtitle;
  final OrderItem activeProject;
  final double totalInvoiced;
  final double pendingBalance;
  final InvoiceItem urgentInvoice;
  final List<Map<String, dynamic>> activityLogs;

  const HomeDashboardData({
    required this.greeting,
    required this.subGreeting,
    required this.clientId,
    required this.heroTitle,
    required this.heroSubtitle,
    required this.activeProject,
    required this.totalInvoiced,
    required this.pendingBalance,
    required this.urgentInvoice,
    required this.activityLogs,
  });
}

class HomeRepository {
  static final HomeRepository instance = HomeRepository._();
  HomeRepository._();

  Future<ApiResponse<HomeDashboardData>> fetchDashboard() async {
    await Future.delayed(const Duration(milliseconds: 400));

    final data = HomeDashboardData(
      greeting: 'Good morning, Siddharth',
      subGreeting: 'Simple systems. Real progress.',
      clientId: 'HENU-CL-2026-000001',
      heroTitle: 'Quarterly Growth Advisory & Systems Audit',
      heroSubtitle: 'Active strategic roadmap for Q2 2026',
      activeProject: OrderItem(
        id: 'ord_001',
        orderNumber: 'ORD-2026-0042',
        title: 'Enterprise Platform Transformation',
        status: 'IN_PROGRESS',
        progressPercent: 72,
        currentMilestone: 'Milestone 4 of 6: Staging Deployment · May 14',
        totalAmount: 48000,
        currency: 'USD',
        startDate: DateTime(2026, 3, 1),
        targetDeliveryDate: DateTime(2026, 5, 30),
        milestones: const [
          OrderMilestone(title: 'Discovery & Architecture', status: 'COMPLETED', targetDate: 'Mar 15', isCompleted: true),
          OrderMilestone(title: 'Core Engine Build', status: 'COMPLETED', targetDate: 'Apr 10', isCompleted: true),
          OrderMilestone(title: 'Integration & Security Audit', status: 'COMPLETED', targetDate: 'Apr 30', isCompleted: true),
          OrderMilestone(title: 'Staging Deployment', status: 'IN_PROGRESS', targetDate: 'May 14', isCompleted: false),
          OrderMilestone(title: 'User Acceptance & Hardening', status: 'PENDING', targetDate: 'May 22', isCompleted: false),
          OrderMilestone(title: 'Production Cutover', status: 'PENDING', targetDate: 'May 30', isCompleted: false),
        ],
      ),
      totalInvoiced: 48250,
      pendingBalance: 12500,
      urgentInvoice: InvoiceItem(
        id: 'inv_089',
        invoiceNumber: 'INV-2026-089',
        title: 'Custom Software Sprint 3',
        status: 'SENT',
        subtotal: 10593.22,
        tax: 1906.78,
        discount: 0,
        totalAmount: 12500,
        balanceDue: 12500,
        currency: 'USD',
        issueDate: DateTime(2026, 5, 1),
        dueDate: DateTime(2026, 5, 20),
      ),
      activityLogs: [
        {
          'title': 'Quote #QT-104 accepted',
          'description': 'Signed by Siddharth · Enterprise Tier',
          'time': '2h ago',
          'type': 'QUOTE',
        },
        {
          'title': 'Payment \$14,000 received',
          'description': 'Cleared via Wire · INV-2026-081',
          'time': 'Yesterday',
          'type': 'PAYMENT',
        },
        {
          'title': 'New milestone update posted',
          'description': 'Architecture Sprint Phase 3 signed off',
          'time': 'May 10',
          'type': 'ORDER',
        },
      ],
    );

    return ApiResponse.success(data);
  }
}
