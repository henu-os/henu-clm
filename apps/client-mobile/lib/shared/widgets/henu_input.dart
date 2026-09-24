import 'package:flutter/material.dart';
import '../../core/constants/henu_colors.dart';
import '../../core/constants/henu_spacing.dart';
import '../../core/constants/henu_typography.dart';

class HenuInput extends StatelessWidget {
  final String? label;
  final String? sublabel;
  final String? hint;
  final TextEditingController? controller;
  final ValueChanged<String>? onChanged;
  final bool obscureText;
  final TextInputType keyboardType;
  final Widget? prefixIcon;
  final Widget? suffixIcon;
  final String? errorText;
  final bool enabled;
  final int maxLines;

  const HenuInput({
    super.key,
    this.label,
    this.sublabel,
    this.hint,
    this.controller,
    this.onChanged,
    this.obscureText = false,
    this.keyboardType = TextInputType.text,
    this.prefixIcon,
    this.suffixIcon,
    this.errorText,
    this.enabled = true,
    this.maxLines = 1,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (label != null) ...[
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                label!,
                style: HenuTypography.captionBold,
              ),
              if (sublabel != null)
                Text(
                  sublabel!,
                  style: HenuTypography.caption.copyWith(color: HenuColors.outline),
                ),
            ],
          ),
          const SizedBox(height: 6),
        ],
        TextField(
          controller: controller,
          onChanged: onChanged,
          obscureText: obscureText,
          keyboardType: keyboardType,
          enabled: enabled,
          maxLines: maxLines,
          style: HenuTypography.bodyMedium.copyWith(color: HenuColors.onSurface),
          decoration: InputDecoration(
            hintText: hint,
            errorText: errorText,
            prefixIcon: prefixIcon,
            suffixIcon: suffixIcon,
            filled: true,
            fillColor: HenuColors.surfaceContainerLowest,
            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
            border: const OutlineInputBorder(
              borderRadius: HenuSpacing.roundedMd,
              borderSide: BorderSide(color: HenuColors.outlineVariant),
            ),
            enabledBorder: const OutlineInputBorder(
              borderRadius: HenuSpacing.roundedMd,
              borderSide: BorderSide(color: HenuColors.outlineVariant),
            ),
            focusedBorder: const OutlineInputBorder(
              borderRadius: HenuSpacing.roundedMd,
              borderSide: BorderSide(color: HenuColors.primary, width: 1.5),
            ),
          ),
        ),
      ],
    );
  }
}
