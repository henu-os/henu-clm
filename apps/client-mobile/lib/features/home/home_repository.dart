import 'dart:convert';
import '../../core/network/api_response.dart';
import '../../shared/models/invoice_item.dart';
import '../../shared/models/order_item.dart';
import '../../shared/models/mobile_home_config.dart';

class HomeDashboardData {
  final MobileHomeConfig config;
  final String clientName;
  final String clientId;
  final OrderItem? activeProject;
  final double totalInvoiced;
  final double pendingBalance;
  final InvoiceItem? urgentInvoice;
  final List<Map<String, dynamic>> activityLogs;
  final List<Map<String, dynamic>> upcomingItems;

  const HomeDashboardData({
    required this.config,
    required this.clientName,
    required this.clientId,
    this.activeProject,
    required this.totalInvoiced,
    required this.pendingBalance,
    this.urgentInvoice,
    required this.activityLogs,
    required this.upcomingItems,
  });

  /// Computes time-of-day greeting (Good Morning, Good Afternoon, Good Evening, Good Night)
  String get dynamicTimeGreeting {
    final hour = DateTime.now().hour;
    if (hour >= 5 && hour < 12) {
      return 'Good Morning';
    } else if (hour >= 12 && hour < 17) {
      return 'Good Afternoon';
    } else if (hour >= 17 && hour < 22) {
      return 'Good Evening';
    } else {
      return 'Good Night';
    }
  }
}

class HomeRepository {
  static final HomeRepository instance = HomeRepository._();
  HomeRepository._();

  MobileHomeConfig _cachedConfig = const MobileHomeConfig();
  MobileHomeConfig get cachedConfig => _cachedConfig;

  Future<ApiResponse<HomeDashboardData>> fetchDashboard() async {
    await Future.delayed(const Duration(milliseconds: 300));

    try {
      // In production / integration, fetches from mobile_home_configurations table
      // Falling back smoothly to active default configuration
      final config = _cachedConfig;

      final data = HomeDashboardData(
        config: config,
        clientName: 'Siddharth',
        clientId: 'HENU-CL-2026-000001',
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
            'id': 'act_1',
            'title': 'Invoice #INV-2026-089 generated',
            'description': 'Payment pending · Due in 6 days',
            'time': '2h ago',
            'type': 'INVOICE',
            'route': '/invoices',
          },
          {
            'id': 'act_2',
            'title': 'Payment of \$14,000 reconciled',
            'description': 'Cleared via Wire Transfer · INV-2026-081',
            'time': 'Yesterday',
            'type': 'PAYMENT',
            'route': '/payments',
          },
          {
            'id': 'act_3',
            'title': 'Order #ORD-2026-0042 milestone updated',
            'description': 'Core Engine Build marked complete',
            'time': 'May 10',
            'type': 'ORDER',
            'route': '/orders',
          },
        ],
        upcomingItems: [
          {
            'id': 'up_1',
            'title': 'Sprint Review & Architecture Meeting',
            'time': '25 Sep · 11:00 AM',
            'type': 'MEETING',
            'route': '/support',
          },
          {
            'id': 'up_2',
            'title': 'Payment Due: INV-2026-089 (\$12,500)',
            'time': '27 Sep · 05:00 PM',
            'type': 'PAYMENT',
            'route': '/invoices',
          },
          {
            'id': 'up_3',
            'title': 'Staging Environment UAT Signoff',
            'time': '30 Sep · 03:00 PM',
            'type': 'MILESTONE',
            'route': '/orders',
          },
        ],
      );

      return ApiResponse.success(data);
    } catch (e) {
      return ApiResponse.error(e.toString());
    }
  }

  void updateConfig(MobileHomeConfig newConfig) {
    _cachedConfig = newConfig;
  }
}
