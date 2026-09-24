import 'package:flutter/material.dart';
import '../../core/constants/henu_colors.dart';
import '../../core/constants/henu_spacing.dart';
import '../../core/constants/henu_typography.dart';

enum HenuButtonVariant { primary, secondary, outline, danger }

class HenuButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final IconData? icon;
  final IconData? trailingIcon;
  final bool isLoading;
  final HenuButtonVariant variant;
  final double? width;
  final double height;

  const HenuButton({
    super.key,
    required this.text,
    required this.onPressed,
    this.icon,
    this.trailingIcon,
    this.isLoading = false,
    this.variant = HenuButtonVariant.primary,
    this.width,
    this.height = 48,
  });

  @override
  Widget build(BuildContext context) {
    Color bgColor;
    Color fgColor;
    BorderSide? borderSide;
    List<BoxShadow>? shadow;

    switch (variant) {
      case HenuButtonVariant.primary:
        bgColor = HenuColors.primary;
        fgColor = HenuColors.onPrimary;
        shadow = HenuSpacing.buttonShadow;
        break;
      case HenuButtonVariant.secondary:
        bgColor = HenuColors.secondary;
        fgColor = HenuColors.onSecondary;
        shadow = HenuSpacing.cardShadow;
        break;
      case HenuButtonVariant.outline:
        bgColor = Colors.transparent;
        fgColor = HenuColors.onSurface;
        borderSide = const BorderSide(color: HenuColors.outlineVariant);
        break;
      case HenuButtonVariant.danger:
        bgColor = HenuColors.error;
        fgColor = HenuColors.onError;
        break;
    }

    return SizedBox(
      width: width ?? double.infinity,
      height: height,
      child: DecoratedBox(
        decoration: BoxDecoration(
          borderRadius: HenuSpacing.roundedFull,
          boxShadow: onPressed != null && !isLoading ? shadow : null,
        ),
        child: ElevatedButton(
          onPressed: isLoading ? null : onPressed,
          style: ElevatedButton.styleFrom(
            backgroundColor: bgColor,
            foregroundColor: fgColor,
            disabledBackgroundColor: bgColor.withOpacity(0.5),
            disabledForegroundColor: fgColor.withOpacity(0.7),
            elevation: 0,
            shape: RoundedRectangleBorder(
              borderRadius: HenuSpacing.roundedFull,
              side: borderSide ?? BorderSide.none,
            ),
            padding: const EdgeInsets.symmetric(horizontal: 20),
          ),
          child: isLoading
              ? SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    valueColor: AlwaysStoppedAnimation<Color>(fgColor),
                  ),
                )
              : Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    if (icon != null) ...[
                      Icon(icon, size: 18, color: fgColor),
                      const SizedBox(width: 8),
                    ],
                    Text(
                      text,
                      style: HenuTypography.labelMedium.copyWith(color: fgColor),
                    ),
                    if (trailingIcon != null) ...[
                      const SizedBox(width: 8),
                      Icon(trailingIcon, size: 18, color: fgColor),
                    ],
                  ],
                ),
        ),
      ),
    );
  }
}
