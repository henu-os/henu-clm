import 'package:flutter/material.dart';
import '../../core/constants/henu_colors.dart';
import '../../core/constants/henu_spacing.dart';
import '../../core/constants/henu_typography.dart';
import '../../shared/widgets/henu_card.dart';
import '../auth/auth_repository.dart';
import '../settings/settings_screen.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final profile = AuthRepository.instance.currentProfile;
    final avatarAsset = profile?.avatarAssetPath ?? 'assets/images/maledp.png';

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Profile Header Card with Dynamic Gender Avatar
          HenuCard(
            child: Row(
              children: [
                Container(
                  width: 60,
                  height: 60,
                  decoration: BoxDecoration(
                    color: HenuColors.primaryFixed,
                    shape: BoxShape.circle,
                    border: Border.all(color: HenuColors.primary, width: 2),
                    boxShadow: HenuSpacing.cardShadow,
                  ),
                  child: ClipOval(
                    child: Image.asset(
                      avatarAsset,
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) => Center(
                        child: Text(
                          profile != null && profile.fullName.isNotEmpty
                              ? profile.fullName.substring(0, 1)
                              : 'H',
                          style: HenuTypography.titleMedium.copyWith(
                            color: HenuColors.onPrimaryFixed,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(profile?.fullName ?? 'Siddharth Rao', style: HenuTypography.titleMedium),
                      const SizedBox(height: 2),
                      Text(profile?.companyName ?? 'Aero Dynamics Global', style: HenuTypography.bodyMedium),
                      const SizedBox(height: 6),
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: HenuColors.secondaryContainer.withOpacity(0.5),
                              borderRadius: HenuSpacing.roundedFull,
                            ),
                            child: Text(
                              profile?.tier ?? 'Enterprise VIP',
                              style: HenuTypography.captionBold.copyWith(color: HenuColors.secondary, fontSize: 10),
                            ),
                          ),
                          const SizedBox(width: 6),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: HenuColors.surfaceContainer,
                              borderRadius: HenuSpacing.roundedFull,
                            ),
                            child: Text(
                              profile?.gender.toUpperCase() ?? 'MALE',
                              style: HenuTypography.captionBold.copyWith(color: HenuColors.onSurfaceVariant, fontSize: 10),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // Client Identifier Card
          HenuCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('CLIENT IDENTIFIER', style: HenuTypography.caption),
                const SizedBox(height: 6),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(profile?.clientId ?? 'HENU-CL-2026-000001', style: HenuTypography.labelMedium),
                    const Icon(Icons.copy, size: 16, color: HenuColors.primary),
                  ],
                ),
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 8),
                  child: Divider(),
                ),
                const Text('PRIMARY WORK EMAIL', style: HenuTypography.caption),
                const SizedBox(height: 4),
                Text(profile?.email ?? 'siddharth@folio.enterprise', style: HenuTypography.bodyMedium),
                const Padding(
                  padding: EdgeInsets.symmetric(vertical: 8),
                  child: Divider(),
                ),
                const Text('AUTHORIZED PHONE', style: HenuTypography.caption),
                const SizedBox(height: 4),
                Text(profile?.phone ?? '+1 (555) 019-2834', style: HenuTypography.bodyMedium),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // Action Menu Card
          HenuCard(
            padding: EdgeInsets.zero,
            child: Column(
              children: [
                ListTile(
                  leading: const Icon(Icons.settings_outlined, color: HenuColors.primary),
                  title: const Text('Preferences & Security Settings', style: HenuTypography.labelMedium),
                  trailing: const Icon(Icons.chevron_right, size: 18),
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(builder: (_) => const SettingsScreen()),
                    );
                  },
                ),
                const Divider(height: 1),
                const ListTile(
                  leading: Icon(Icons.shield_outlined, color: HenuColors.secondary),
                  title: Text('Zero-Knowledge Security Certificate', style: HenuTypography.labelMedium),
                  subtitle: Text('SOC2 Type II Attested Node', style: HenuTypography.caption),
                  trailing: Icon(Icons.verified, color: HenuColors.secondary, size: 18),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
