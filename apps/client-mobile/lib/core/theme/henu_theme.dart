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

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      primaryColor: HenuColors.darkPrimary,
      scaffoldBackgroundColor: HenuColors.darkBackground,
      colorScheme: const ColorScheme.dark(
        primary: HenuColors.darkPrimary,
        onPrimary: HenuColors.darkOnPrimary,
        primaryContainer: HenuColors.darkPrimaryContainer,
        onPrimaryContainer: HenuColors.darkOnPrimaryContainer,
        secondary: HenuColors.darkSecondary,
        onSecondary: HenuColors.darkOnSecondary,
        secondaryContainer: HenuColors.darkSecondaryContainer,
        onSecondaryContainer: HenuColors.darkOnSecondaryContainer,
        tertiary: HenuColors.darkTertiary,
        onTertiary: HenuColors.darkOnTertiary,
        surface: HenuColors.darkSurface,
        onSurface: HenuColors.darkOnSurface,
        onSurfaceVariant: HenuColors.darkOnSurfaceVariant,
        outline: HenuColors.darkOutline,
        outlineVariant: HenuColors.darkOutlineVariant,
        error: HenuColors.darkError,
        onError: HenuColors.darkOnError,
        errorContainer: HenuColors.darkErrorContainer,
        onErrorContainer: HenuColors.darkOnSurface,
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: HenuColors.darkSurface,
        foregroundColor: HenuColors.darkOnSurface,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: HenuTypography.titleMedium,
        iconTheme: IconThemeData(color: HenuColors.darkOnSurface),
      ),
      cardTheme: const CardTheme(
        color: HenuColors.darkSurfaceContainerLowest,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: HenuSpacing.roundedLg,
          side: BorderSide(color: HenuColors.darkOutlineVariant),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: HenuColors.darkSurfaceContainerLow,
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        border: const OutlineInputBorder(
          borderRadius: HenuSpacing.roundedMd,
          borderSide: BorderSide(color: HenuColors.darkOutlineVariant),
        ),
        enabledBorder: const OutlineInputBorder(
          borderRadius: HenuSpacing.roundedMd,
          borderSide: BorderSide(color: HenuColors.darkOutlineVariant),
        ),
        focusedBorder: const OutlineInputBorder(
          borderRadius: HenuSpacing.roundedMd,
          borderSide: BorderSide(color: HenuColors.darkPrimary, width: 1.5),
        ),
        errorBorder: const OutlineInputBorder(
          borderRadius: HenuSpacing.roundedMd,
          borderSide: BorderSide(color: HenuColors.darkError),
        ),
        hintStyle: HenuTypography.bodyMedium.copyWith(color: HenuColors.darkOutline),
        labelStyle: HenuTypography.captionBold.copyWith(color: HenuColors.darkOnSurfaceVariant),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: HenuColors.darkPrimary,
          foregroundColor: HenuColors.darkOnPrimary,
          elevation: 0,
          shape: const RoundedRectangleBorder(borderRadius: HenuSpacing.roundedFull),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          textStyle: HenuTypography.labelMedium.copyWith(color: HenuColors.darkOnPrimary),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: HenuColors.darkOnSurface,
          side: const BorderSide(color: HenuColors.darkOutlineVariant),
          shape: const RoundedRectangleBorder(borderRadius: HenuSpacing.roundedFull),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          textStyle: HenuTypography.labelMedium.copyWith(color: HenuColors.darkOnSurface),
        ),
      ),
      dividerTheme: const DividerThemeData(
        color: Color(0x333D4359),
        thickness: 1,
        space: 1,
      ),
    );
  }
}
