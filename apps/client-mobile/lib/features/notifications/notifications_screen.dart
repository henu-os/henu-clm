import 'package:flutter/material.dart';
import '../../core/constants/henu_colors.dart';
import '../../core/constants/henu_typography.dart';
import '../../core/utils/formatters.dart';
import '../../shared/models/notification_item.dart';
import '../../shared/widgets/henu_card.dart';
import '../../shared/widgets/state_views.dart';
import 'notifications_repository.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  bool _isLoading = true;
  List<NotificationItem> _notifications = [];

  @override
  void initState() {
    super.initState();
    _loadNotifications();
  }

  Future<void> _loadNotifications() async {
    setState(() => _isLoading = true);
    final res = await NotificationsRepository.instance.getNotifications();
    if (!mounted) return;
    if (res.success && res.data != null) {
      setState(() {
        _notifications = res.data!;
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: HenuColors.surfaceFolio,
      appBar: AppBar(
        title: const Text('Notifications'),
        actions: [
          TextButton(
            onPressed: () async {
              await NotificationsRepository.instance.markAllAsRead();
              _loadNotifications();
            },
            child: const Text('Mark all read', style: HenuTypography.captionBold),
          ),
        ],
      ),
      body: _isLoading
          ? const Padding(
              padding: EdgeInsets.all(16),
              child: Column(
                children: [
                  SkeletonCard(height: 80),
                  SizedBox(height: 12),
                  SkeletonCard(height: 80),
                ],
              ),
            )
          : _notifications.isEmpty
              ? const EmptyStateView(
                  title: 'No Notifications',
                  description: 'You are all caught up on your advisory updates.',
                  icon: Icons.notifications_none,
                )
              : ListView.separated(
                  padding: const EdgeInsets.all(16),
                  itemCount: _notifications.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    final item = _notifications[index];
                    return HenuCard(
                      backgroundColor: item.isRead ? HenuColors.surfaceContainerLowest : HenuColors.primaryFixed.withOpacity(0.2),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            width: 36,
                            height: 36,
                            decoration: BoxDecoration(
                              color: item.isRead ? HenuColors.surfaceContainer : HenuColors.primaryFixed,
                              shape: BoxShape.circle,
                            ),
                            child: Icon(
                              item.category == 'BILLING'
                                  ? Icons.receipt_long
                                  : (item.category == 'QUOTES' ? Icons.request_quote : Icons.info_outline),
                              size: 18,
                              color: item.isRead ? HenuColors.outline : HenuColors.primary,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                  children: [
                                    Expanded(child: Text(item.title, style: HenuTypography.labelMedium)),
                                    Text(HenuFormatters.formatRelativeTime(item.createdAt), style: HenuTypography.caption),
                                  ],
                                ),
                                const SizedBox(height: 4),
                                Text(item.message, style: HenuTypography.bodyMedium),
                              ],
                            ),
                          ),
                        ],
                      ),
                    );
                  },
                ),
    );
  }
}
