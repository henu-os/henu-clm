import 'package:flutter/material.dart';
import '../constants/henu_colors.dart';
import '../constants/henu_spacing.dart';
import '../constants/henu_typography.dart';

class HenuTheme {
  HenuTheme._();

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      primaryColor: HenuColors.primary,
      scaffoldBackgroundColor: HenuColors.surfaceFolio,
      colorScheme: const ColorScheme.light(
        primary: HenuColors.primary,
        onPrimary: HenuColors.onPrimary,
        primaryContainer: HenuColors.primaryContainer,
        onPrimaryContainer: HenuColors.onPrimaryContainer,
        secondary: HenuColors.secondary,
        onSecondary: HenuColors.onSecondary,
        secondaryContainer: HenuColors.secondaryContainer,
        onSecondaryContainer: HenuColors.onSecondaryContainer,
        tertiary: HenuColors.tertiary,
        onTertiary: HenuColors.onTertiary,
        surface: HenuColors.surface,
        onSurface: HenuColors.onSurface,
        onSurfaceVariant: HenuColors.onSurfaceVariant,
        outline: HenuColors.outline,
        outlineVariant: HenuColors.outlineVariant,
        error: HenuColors.error,
        onError: HenuColors.onError,
        errorContainer: HenuColors.errorContainer,
        onErrorContainer: HenuColors.onErrorContainer,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: HenuColors.surface,
        foregroundColor: HenuColors.onSurface,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: HenuTypography.titleMedium,
        iconTheme: IconThemeData(color: HenuColors.onSurface),
      ),
      cardTheme: const CardTheme(
        color: HenuColors.surfaceContainerLowest,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: HenuSpacing.roundedLg,
          side: BorderSide(color: Color(0x33C9C4D0)),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
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
        errorBorder: const OutlineInputBorder(
          borderRadius: HenuSpacing.roundedMd,
          borderSide: BorderSide(color: HenuColors.error),
        ),
        hintStyle: HenuTypography.bodyMedium.copyWith(color: HenuColors.outline),
        labelStyle: HenuTypography.captionBold,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: HenuColors.primary,
          foregroundColor: HenuColors.onPrimary,
          elevation: 0,
          shape: const RoundedRectangleBorder(borderRadius: HenuSpacing.roundedFull),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          textStyle: HenuTypography.labelMedium.copyWith(color: HenuColors.onPrimary),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: HenuColors.onSurface,
          side: const BorderSide(color: HenuColors.outlineVariant),
          shape: const RoundedRectangleBorder(borderRadius: HenuSpacing.roundedFull),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          textStyle: HenuTypography.labelMedium,
        ),
      ),
      dividerTheme: const DividerThemeData(
        color: Color(0x26C9C4D0),
        thickness: 1,
        space: 1,
      ),
    );
  }
}
