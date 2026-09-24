import 'package:flutter/material.dart';
import '../../core/constants/henu_colors.dart';
import '../../core/constants/henu_spacing.dart';
import '../../core/constants/henu_typography.dart';
import '../../core/utils/formatters.dart';
import '../../shared/models/order_item.dart';
import '../../shared/widgets/henu_badge.dart';
import '../../shared/widgets/henu_card.dart';

class OrderDetailScreen extends StatelessWidget {
  final OrderItem order;

  const OrderDetailScreen({super.key, required this.order});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: HenuColors.surfaceFolio,
      appBar: AppBar(
        title: Text(order.orderNumber),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Order Overview Card
            HenuCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      HenuBadge.status(order.status),
                      Text(
                        'Target: ${HenuFormatters.formatDate(order.targetDeliveryDate)}',
                        style: HenuTypography.caption,
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(order.title, style: HenuTypography.headlineSmall),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Total Contract Value', style: HenuTypography.captionBold),
                      Text(
                        HenuFormatters.currency(order.totalAmount),
                        style: HenuTypography.titleMedium.copyWith(color: HenuColors.primary, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  // Progress Bar matching Stitch
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('Overall Progress', style: HenuTypography.caption.copyWith(color: HenuColors.onSurfaceVariant)),
                          Text('${order.progressPercent}%', style: HenuTypography.captionBold.copyWith(color: HenuColors.secondary)),
                        ],
                      ),
                      const SizedBox(height: 6),
                      ClipRRect(
                        borderRadius: HenuSpacing.roundedFull,
                        child: LinearProgressIndicator(
                          value: order.progressPercent / 100.0,
                          backgroundColor: HenuColors.surfaceContainer,
                          valueColor: const AlwaysStoppedAnimation<Color>(HenuColors.secondary),
                          minHeight: 8,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Milestones Timeline
            Text(
              'DELIVERY MILESTONES',
              style: HenuTypography.captionBold.copyWith(color: HenuColors.outline, letterSpacing: 0.8),
            ),
            const SizedBox(height: 12),

            ...order.milestones.asMap().entries.map((entry) {
              final idx = entry.key;
              final milestone = entry.value;
              final isLast = idx == order.milestones.length - 1;

              return Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Column(
                    children: [
                      Container(
                        width: 24,
                        height: 24,
                        decoration: BoxDecoration(
                          color: milestone.isCompleted
                              ? HenuColors.secondary
                              : (milestone.status == 'IN_PROGRESS' ? HenuColors.tertiaryFixedDim : HenuColors.surfaceContainer),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          milestone.isCompleted ? Icons.check : (milestone.status == 'IN_PROGRESS' ? Icons.play_arrow : Icons.circle),
                          size: 14,
                          color: milestone.isCompleted ? HenuColors.onSecondary : HenuColors.onSurfaceVariant,
                        ),
                      ),
                      if (!isLast)
                        Container(
                          width: 2,
                          height: 40,
                          color: milestone.isCompleted ? HenuColors.secondary : HenuColors.outlineVariant,
                        ),
                    ],
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Padding(
                      padding: const EdgeInsets.only(bottom: 16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Expanded(
                                child: Text(
                                  milestone.title,
                                  style: HenuTypography.labelMedium.copyWith(
                                    fontWeight: milestone.isCompleted ? FontWeight.w600 : FontWeight.w500,
                                  ),
                                ),
                              ),
                              Text(milestone.targetDate, style: HenuTypography.caption),
                            ],
                          ),
                          const SizedBox(height: 2),
                          Text(
                            milestone.status.replaceAll('_', ' '),
                            style: HenuTypography.caption.copyWith(
                              color: milestone.isCompleted ? HenuColors.secondary : HenuColors.outline,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              );
            }),
          ],
        ),
      ),
    );
  }
}
