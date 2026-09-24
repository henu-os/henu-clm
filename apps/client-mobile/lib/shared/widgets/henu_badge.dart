import 'package:flutter/material.dart';
import '../../core/constants/henu_colors.dart';
import '../../core/constants/henu_spacing.dart';
import '../../core/constants/henu_typography.dart';

class HenuBadge extends StatelessWidget {
  final String text;
  final Color? backgroundColor;
  final Color? textColor;
  final bool showDot;

  const HenuBadge({
    super.key,
    required this.text,
    this.backgroundColor,
    this.textColor,
    this.showDot = false,
  });

  factory HenuBadge.status(String status) {
    Color bg;
    Color fg;

    switch (status.toUpperCase()) {
      case 'APPROVED':
      case 'PAID':
      case 'COMPLETED':
      case 'ACTIVE':
      case 'CONVERTED':
        bg = HenuColors.successContainer;
        fg = HenuColors.successGreen;
        break;
      case 'PENDING':
      case 'PENDING_APPROVAL':
      case 'SENT':
      case 'IN_PROGRESS':
      case 'DRAFT':
        bg = HenuColors.tertiaryFixed;
        fg = HenuColors.onTertiaryFixed;
        break;
      case 'REJECTED':
      case 'OVERDUE':
      case 'CANCELLED':
      case 'FAILED':
        bg = HenuColors.errorContainer;
        fg = HenuColors.onErrorContainer;
        break;
      default:
        bg = HenuColors.primaryFixed;
        fg = HenuColors.onPrimaryFixed;
    }

    final displayLabel = status.replaceAll('_', ' ');

    return HenuBadge(
      text: displayLabel,
      backgroundColor: bg,
      textColor: fg,
      showDot: true,
    );
  }

  @override
  Widget build(BuildContext context) {
    final bg = backgroundColor ?? HenuColors.surfaceContainerHigh;
    final fg = textColor ?? HenuColors.onSurface;

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: HenuSpacing.roundedFull,
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          if (showDot) ...[
            Container(
              width: 5,
              height: 5,
              decoration: BoxDecoration(
                color: fg,
                shape: BoxShape.circle,
              ),
            ),
            const SizedBox(width: 5),
          ],
          Text(
            text,
            style: HenuTypography.captionBold.copyWith(
              color: fg,
              fontSize: 11,
              letterSpacing: 0.2,
            ),
          ),
        ],
      ),
    );
  }
}
