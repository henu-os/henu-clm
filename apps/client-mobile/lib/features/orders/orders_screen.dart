import 'package:flutter/material.dart';
import '../../core/constants/henu_colors.dart';
import '../../core/constants/henu_spacing.dart';
import '../../core/constants/henu_typography.dart';
import '../../core/utils/formatters.dart';
import '../../shared/models/order_item.dart';
import '../../shared/widgets/henu_badge.dart';
import '../../shared/widgets/henu_card.dart';
import '../../shared/widgets/state_views.dart';
import 'order_detail_screen.dart';
import 'orders_repository.dart';

class OrdersScreen extends StatefulWidget {
  const OrdersScreen({super.key});

  @override
  State<OrdersScreen> createState() => _OrdersScreenState();
}

class _OrdersScreenState extends State<OrdersScreen> {
  bool _isLoading = true;
  List<OrderItem> _orders = [];
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadOrders();
  }

  Future<void> _loadOrders() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    final res = await OrdersRepository.instance.getOrders();
    if (!mounted) return;

    if (res.success && res.data != null) {
      setState(() {
        _orders = res.data!;
        _isLoading = false;
      });
    } else {
      setState(() {
        _errorMessage = res.errorMessage ?? 'Failed to load projects.';
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            SkeletonCard(height: 140),
            SizedBox(height: 12),
            SkeletonCard(height: 140),
          ],
        ),
      );
    }

    if (_errorMessage != null) {
      return ErrorStateView(message: _errorMessage!, onRetry: _loadOrders);
    }

    if (_orders.isEmpty) {
      return const EmptyStateView(
        title: 'No Active Projects',
        description: 'You have no live deliverables currently in execution.',
        icon: Icons.folder_open_outlined,
      );
    }

    return RefreshIndicator(
      onRefresh: _loadOrders,
      color: HenuColors.primary,
      child: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: _orders.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          final order = _orders[index];
          return HenuCard(
            onTap: () {
              Navigator.of(context).push(
                MaterialPageRoute(builder: (_) => OrderDetailScreen(order: order)),
              );
            },
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(order.orderNumber, style: HenuTypography.captionBold),
                    HenuBadge.status(order.status),
                  ],
                ),
                const SizedBox(height: 8),
                Text(order.title, style: HenuTypography.labelMedium),
                const SizedBox(height: 6),
                Text(order.currentMilestone, style: HenuTypography.caption.copyWith(color: HenuColors.secondary)),
                const SizedBox(height: 12),
                // Progress Bar
                ClipRRect(
                  borderRadius: HenuSpacing.roundedFull,
                  child: LinearProgressIndicator(
                    value: order.progressPercent / 100.0,
                    backgroundColor: HenuColors.surfaceContainer,
                    valueColor: const AlwaysStoppedAnimation<Color>(HenuColors.secondary),
                    minHeight: 6,
                  ),
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('${order.progressPercent}% Complete', style: HenuTypography.captionBold),
                    Text(
                      HenuFormatters.currency(order.totalAmount),
                      style: HenuTypography.labelMedium.copyWith(color: HenuColors.primary, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
