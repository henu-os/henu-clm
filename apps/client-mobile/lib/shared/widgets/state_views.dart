import 'package:flutter/material.dart';
import '../../core/constants/henu_colors.dart';
import '../../core/constants/henu_spacing.dart';
import '../../core/constants/henu_typography.dart';
import 'henu_button.dart';

class EmptyStateView extends StatelessWidget {
  final String title;
  final String description;
  final IconData icon;
  final String? actionText;
  final VoidCallback? onAction;

  const EmptyStateView({
    super.key,
    required this.title,
    required this.description,
    this.icon = Icons.inbox_outlined,
    this.actionText,
    this.onAction,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 56,
              height: 56,
              decoration: const BoxDecoration(
                color: HenuColors.surfaceContainer,
                shape: BoxShape.circle,
              ),
              child: Icon(icon, size: 28, color: HenuColors.outline),
            ),
            const SizedBox(height: 16),
            Text(
              title,
              style: HenuTypography.titleMedium,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 6),
            Text(
              description,
              style: HenuTypography.bodyMedium,
              textAlign: TextAlign.center,
            ),
            if (actionText != null && onAction != null) ...[
              const SizedBox(height: 20),
              HenuButton(
                text: actionText!,
                onPressed: onAction,
                width: 180,
                height: 42,
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class ErrorStateView extends StatelessWidget {
  final String message;
  final VoidCallback? onRetry;

  const ErrorStateView({
    super.key,
    required this.message,
    this.onRetry,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 56,
              height: 56,
              decoration: const BoxDecoration(
                color: HenuColors.errorContainer,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.error_outline, size: 28, color: HenuColors.error),
            ),
            const SizedBox(height: 16),
            const Text(
              'Something went wrong',
              style: HenuTypography.titleMedium,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 6),
            Text(
              message,
              style: HenuTypography.bodyMedium.copyWith(color: HenuColors.onSurfaceVariant),
              textAlign: TextAlign.center,
            ),
            if (onRetry != null) ...[
              const SizedBox(height: 20),
              HenuButton(
                text: 'Retry',
                onPressed: onRetry,
                variant: HenuButtonVariant.outline,
                width: 140,
                height: 40,
                icon: Icons.refresh,
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class SkeletonCard extends StatelessWidget {
  final double height;
  final double? width;
  final BorderRadius? borderRadius;

  const SkeletonCard({
    super.key,
    this.height = 80,
    this.width,
    this.borderRadius,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: height,
      width: width ?? double.infinity,
      decoration: BoxDecoration(
        color: HenuColors.surfaceContainerHigh.withOpacity(0.5),
        borderRadius: borderRadius ?? HenuSpacing.roundedLg,
      ),
    );
  }
}
