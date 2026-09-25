import 'package:flutter/material.dart';
import '../../core/constants/henu_colors.dart';
import '../../core/constants/henu_spacing.dart';
import '../../core/constants/henu_typography.dart';

/// Top App Bar matching approved Stitch mobile design with dynamic Avatar DP
class HenuAppBar extends StatelessWidget implements PreferredSizeWidget {
  final String title;
  final String? subtitle;
  final bool showLeadingAvatar;
  final String avatarInitials;
  final String? avatarAsset;
  final VoidCallback? onNotificationTap;
  final int unreadNotificationsCount;
  final List<Widget>? actions;

  const HenuAppBar({
    super.key,
    this.title = 'HENU OS',
    this.subtitle = 'Client Lifecycle Management',
    this.showLeadingAvatar = true,
    this.avatarInitials = 'HN',
    this.avatarAsset,
    this.onNotificationTap,
    this.unreadNotificationsCount = 2,
    this.actions,
  });

  @override
  Size get preferredSize => const Size.fromHeight(60);

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: HenuColors.surface,
        border: Border(
          bottom: BorderSide(color: Color(0x26C9C4D0), width: 1),
        ),
      ),
      child: SafeArea(
        bottom: false,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Row(
            children: [
              if (showLeadingAvatar) ...[
                Container(
                  width: 36,
                  height: 36,
                  decoration: BoxDecoration(
                    color: HenuColors.primaryFixed,
                    shape: BoxShape.circle,
                    border: Border.all(color: const Color(0x4DC9C4D0), width: 1),
                    boxShadow: HenuSpacing.cardShadow,
                  ),
                  child: ClipOval(
                    child: avatarAsset != null
                        ? Image.asset(
                            avatarAsset!,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) => Center(
                              child: Text(
                                avatarInitials,
                                style: HenuTypography.captionBold.copyWith(
                                  color: HenuColors.onPrimaryFixed,
                                ),
                              ),
                            ),
                          )
                        : Center(
                            child: Text(
                              avatarInitials,
                              style: HenuTypography.captionBold.copyWith(
                                color: HenuColors.onPrimaryFixed,
                              ),
                            ),
                          ),
                  ),
                ),
                const SizedBox(width: 12),
              ],
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      title,
                      style: HenuTypography.titleMedium.copyWith(height: 1.1),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    if (subtitle != null)
                      Text(
                        subtitle!,
                        style: HenuTypography.caption.copyWith(height: 1.2),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                  ],
                ),
              ),
              if (actions != null)
                ...actions!
              else if (onNotificationTap != null)
                Stack(
                  alignment: Alignment.topRight,
                  children: [
                    IconButton(
                      icon: const Icon(Icons.notifications_outlined, size: 22),
                      color: HenuColors.onSurfaceVariant,
                      onPressed: onNotificationTap,
                      splashRadius: 20,
                    ),
                    if (unreadNotificationsCount > 0)
                      Positioned(
                        top: 10,
                        right: 10,
                        child: Container(
                          width: 8,
                          height: 8,
                          decoration: BoxDecoration(
                            color: HenuColors.error,
                            shape: BoxShape.circle,
                            border: Border.all(color: HenuColors.surface, width: 1.5),
                          ),
                        ),
                      ),
                  ],
                ),
            ],
          ),
        ),
      ),
    );
  }
}
