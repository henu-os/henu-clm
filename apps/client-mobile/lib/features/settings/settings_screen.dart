import 'package:flutter/material.dart';
import '../../core/constants/henu_colors.dart';
import '../../core/constants/henu_typography.dart';
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
    return Scaffold(
      backgroundColor: HenuColors.surfaceFolio,
      appBar: AppBar(
        title: const Text('Settings & Security'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('SECURITY & ACCESS', style: HenuTypography.captionBold.copyWith(color: HenuColors.outline, letterSpacing: 0.8)),
            const SizedBox(height: 8),
            HenuCard(
              padding: EdgeInsets.zero,
              child: Column(
                children: [
                  SwitchListTile(
                    title: const Text('Biometric Authentication', style: HenuTypography.labelMedium),
                    subtitle: const Text('FaceID / TouchID for approvals and payments', style: HenuTypography.caption),
                    activeColor: HenuColors.primary,
                    value: _biometricEnabled,
                    onChanged: (val) => setState(() => _biometricEnabled = val),
                  ),
                  const Divider(height: 1),
                  ListTile(
                    title: const Text('Change Account Password', style: HenuTypography.labelMedium),
                    trailing: const Icon(Icons.chevron_right, size: 18),
                    onTap: () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Password change verification token dispatched to your work email.'),
                          backgroundColor: HenuColors.primary,
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            Text('NOTIFICATIONS & DISPATCH', style: HenuTypography.captionBold.copyWith(color: HenuColors.outline, letterSpacing: 0.8)),
            const SizedBox(height: 8),
            HenuCard(
              padding: EdgeInsets.zero,
              child: Column(
                children: [
                  SwitchListTile(
                    title: const Text('Push Notifications', style: HenuTypography.labelMedium),
                    subtitle: const Text('Real-time milestone alerts and approval prompts', style: HenuTypography.caption),
                    activeColor: HenuColors.primary,
                    value: _pushNotifications,
                    onChanged: (val) => setState(() => _pushNotifications = val),
                  ),
                  const Divider(height: 1),
                  SwitchListTile(
                    title: const Text('Weekly Digest & Financial Statement', style: HenuTypography.labelMedium),
                    subtitle: const Text('Consolidated ledger summary to authorized email', style: HenuTypography.caption),
                    activeColor: HenuColors.primary,
                    value: _emailSummaries,
                    onChanged: (val) => setState(() => _emailSummaries = val),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            Text('LEGAL & FOLIO POLICIES', style: HenuTypography.captionBold.copyWith(color: HenuColors.outline, letterSpacing: 0.8)),
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
}
