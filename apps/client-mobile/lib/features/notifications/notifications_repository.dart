import '../../core/network/api_response.dart';
import '../../shared/models/notification_item.dart';

class NotificationsRepository {
  static final NotificationsRepository instance = NotificationsRepository._();
  NotificationsRepository._();

  final List<NotificationItem> _notifications = [
    NotificationItem(
      id: 'notif_01',
      title: 'Quote QT-2026-0104 Prepared',
      message: 'New advisory proposal ready for review and digital sign-off.',
      category: 'QUOTES',
      isRead: false,
      createdAt: DateTime.now().subtract(const Duration(hours: 2)),
    ),
    NotificationItem(
      id: 'notif_02',
      title: 'Payment Received: \$14,000.00',
      message: 'Settlement confirmed for invoice INV-2026-081.',
      category: 'BILLING',
      isRead: false,
      createdAt: DateTime.now().subtract(const Duration(days: 1)),
    ),
    NotificationItem(
      id: 'notif_03',
      title: 'Milestone 4 Update Posted',
      message: 'Staging deployment environment is live and verified.',
      category: 'ORDERS',
      isRead: true,
      createdAt: DateTime.now().subtract(const Duration(days: 3)),
    ),
  ];

  Future<ApiResponse<List<NotificationItem>>> getNotifications() async {
    await Future.delayed(const Duration(milliseconds: 200));
    return ApiResponse.success(List.unmodifiable(_notifications));
  }

  Future<ApiResponse<bool>> markAllAsRead() async {
    await Future.delayed(const Duration(milliseconds: 200));
    for (int i = 0; i < _notifications.length; i++) {
      final n = _notifications[i];
      _notifications[i] = NotificationItem(
        id: n.id,
        title: n.title,
        message: n.message,
        category: n.category,
        isRead: true,
        createdAt: n.createdAt,
      );
    }
    return const ApiResponse.success(true);
  }
}
