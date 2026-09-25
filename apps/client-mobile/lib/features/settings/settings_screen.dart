import 'package:flutter/material.dart';
import '../../core/constants/henu_spacing.dart';
import '../../core/constants/henu_typography.dart';
import '../../core/theme/theme_controller.dart';
import '../../shared/widgets/henu_button.dart';
import '../../shared/widgets/henu_card.dart';
import '../auth/auth_repository.dart';
import '../auth/login_screen.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _biometricEnabled = true;
  bool _pushNotifications = true;
  bool _emailSummaries = true;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final themeController = ThemeController.instance;

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        title: const Text('Settings & Preferences'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Appearance & Theme Selector
            Text('APPEARANCE & THEME', style: HenuTypography.captionBold.copyWith(color: theme.colorScheme.outline, letterSpacing: 0.8)),
            const SizedBox(height: 8),
            HenuCard(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Theme Mode', style: HenuTypography.labelMedium),
                  const SizedBox(height: 4),
                  const Text('Select your preferred interface appearance', style: HenuTypography.caption),
                  const SizedBox(height: 12),
                  Row(
                    children: [
                      _buildThemeOption(
                        context,
                        title: 'Light',
                        icon: Icons.light_mode_outlined,
                        mode: ThemeMode.light,
                        isSelected: themeController.themeMode == ThemeMode.light,
                      ),
                      const SizedBox(width: 8),
                      _buildThemeOption(
                        context,
                        title: 'Dark',
                        icon: Icons.dark_mode_outlined,
                        mode: ThemeMode.dark,
                        isSelected: themeController.themeMode == ThemeMode.dark,
                      ),
                      const SizedBox(width: 8),
                      _buildThemeOption(
                        context,
                        title: 'System',
                        icon: Icons.settings_brightness_outlined,
                        mode: ThemeMode.system,
                        isSelected: themeController.themeMode == ThemeMode.system,
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            Text('SECURITY & ACCESS', style: HenuTypography.captionBold.copyWith(color: theme.colorScheme.outline, letterSpacing: 0.8)),
            const SizedBox(height: 8),
            HenuCard(
              padding: EdgeInsets.zero,
              child: Column(
                children: [
                  SwitchListTile(
                    title: const Text('Biometric Authentication', style: HenuTypography.labelMedium),
                    subtitle: const Text('FaceID / TouchID for approvals and payments', style: HenuTypography.caption),
                    activeColor: theme.colorScheme.primary,
                    value: _biometricEnabled,
                    onChanged: (val) => setState(() => _biometricEnabled = val),
                  ),
                  const Divider(height: 1),
                  ListTile(
                    title: const Text('Change Account Password', style: HenuTypography.labelMedium),
                    trailing: const Icon(Icons.chevron_right, size: 18),
                    onTap: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: const Text('Password change verification token dispatched to your work email.'),
                          backgroundColor: theme.colorScheme.primary,
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            Text('NOTIFICATIONS & DISPATCH', style: HenuTypography.captionBold.copyWith(color: theme.colorScheme.outline, letterSpacing: 0.8)),
            const SizedBox(height: 8),
            HenuCard(
              padding: EdgeInsets.zero,
              child: Column(
                children: [
                  SwitchListTile(
                    title: const Text('Push Notifications', style: HenuTypography.labelMedium),
                    subtitle: const Text('Real-time milestone alerts and approval prompts', style: HenuTypography.caption),
                    activeColor: theme.colorScheme.primary,
                    value: _pushNotifications,
                    onChanged: (val) => setState(() => _pushNotifications = val),
                  ),
                  const Divider(height: 1),
                  SwitchListTile(
                    title: const Text('Weekly Digest & Financial Statement', style: HenuTypography.labelMedium),
                    subtitle: const Text('Consolidated ledger summary to authorized email', style: HenuTypography.caption),
                    activeColor: theme.colorScheme.primary,
                    value: _emailSummaries,
                    onChanged: (val) => setState(() => _emailSummaries = val),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            Text('LEGAL & FOLIO POLICIES', style: HenuTypography.captionBold.copyWith(color: theme.colorScheme.outline, letterSpacing: 0.8)),
            const SizedBox(height: 8),
            HenuCard(
              padding: EdgeInsets.zero,
              child: Column(
                children: [
                  ListTile(
                    title: const Text('Enterprise Terms of Service', style: HenuTypography.labelMedium),
                    trailing: const Icon(Icons.open_in_new, size: 16),
                    onTap: () {},
                  ),
                  const Divider(height: 1),
                  ListTile(
                    title: const Text('Zero-Knowledge Privacy Folio', style: HenuTypography.labelMedium),
                    trailing: const Icon(Icons.open_in_new, size: 16),
                    onTap: () {},
                  ),
                ],
              ),
            ),

            const SizedBox(height: 32),

            // Sign Out Button
            HenuButton(
              text: 'Sign Out of Folio Session',
              variant: HenuButtonVariant.outline,
              icon: Icons.logout,
              onPressed: () async {
                await AuthRepository.instance.logout();
                if (!mounted) return;
                Navigator.of(context).pushAndRemoveUntil(
                  MaterialPageRoute(builder: (_) => const LoginScreen()),
                  (route) => false,
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildThemeOption(
    BuildContext context, {
    required String title,
    required IconData icon,
    required ThemeMode mode,
    required bool isSelected,
  }) {
    final theme = Theme.of(context);

    return Expanded(
      child: InkWell(
        onTap: () {
          ThemeController.instance.setThemeMode(mode);
          setState(() {});
        },
        borderRadius: HenuSpacing.roundedMd,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: isSelected ? theme.colorScheme.primary.withOpacity(0.12) : theme.colorScheme.surface,
            borderRadius: HenuSpacing.roundedMd,
            border: Border.all(
              color: isSelected ? theme.colorScheme.primary : theme.colorScheme.outlineVariant,
              width: isSelected ? 1.5 : 1,
            ),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                icon,
                size: 20,
                color: isSelected ? theme.colorScheme.primary : theme.colorScheme.onSurfaceVariant,
              ),
              const SizedBox(height: 4),
              Text(
                title,
                style: HenuTypography.captionBold.copyWith(
                  color: isSelected ? theme.colorScheme.primary : theme.colorScheme.onSurface,
                  fontSize: 11,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
