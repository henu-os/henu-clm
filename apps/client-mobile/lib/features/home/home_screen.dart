import 'package:flutter/material.dart';
import '../../core/constants/henu_colors.dart';
import '../../core/constants/henu_spacing.dart';
import '../../core/constants/henu_typography.dart';
import '../../core/utils/formatters.dart';
import '../../shared/models/mobile_home_config.dart';
import '../../shared/widgets/henu_app_bar.dart';
import '../../shared/widgets/henu_badge.dart';
import '../../shared/widgets/henu_button.dart';
import '../../shared/widgets/henu_card.dart';
import '../auth/auth_repository.dart';
import '../catalog/catalog_screen.dart';
import '../invoices/invoices_screen.dart';
import '../notifications/notifications_screen.dart';
import '../orders/orders_screen.dart';
import '../payments/payments_screen.dart';
import '../profile/profile_screen.dart';
import '../quotes/quotes_screen.dart';
import '../support/support_screen.dart';
import 'home_repository.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentTabIndex = 0;
  bool _isLoading = true;
  HomeDashboardData? _dashboardData;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadDashboard();
  }

  Future<void> _loadDashboard() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    final res = await HomeRepository.instance.fetchDashboard();
    if (!mounted) return;

    if (res.success && res.data != null) {
      setState(() {
        _dashboardData = res.data!;
        _isLoading = false;
      });
    } else {
      setState(() {
        _errorMessage = res.errorMessage ?? 'Failed to load mobile dashboard.';
        _isLoading = false;
      });
    }
  }

  void _navigateToTab(int tabIndex) {
    setState(() {
      _currentTabIndex = tabIndex;
    });
  }

  void _handleRouteNavigation(String route) {
    final cleanRoute = route.trim().toLowerCase();
    if (cleanRoute == '/quotes' || cleanRoute.contains('quote')) {
      Navigator.of(context).push(
        MaterialPageRoute(
          builder: (_) => Scaffold(
            appBar: AppBar(title: const Text('Quotes Workbench')),
            body: const QuotesScreen(),
          ),
        ),
      );
    } else if (cleanRoute == '/invoices' || cleanRoute.contains('invoice')) {
      _navigateToTab(3);
    } else if (cleanRoute == '/payments' || cleanRoute.contains('payment')) {
      Navigator.of(context).push(
        MaterialPageRoute(
          builder: (_) => Scaffold(
            appBar: AppBar(title: const Text('Payment Ledger')),
            body: const PaymentsScreen(),
          ),
        ),
      );
    } else if (cleanRoute == '/orders' || cleanRoute == '/delivery' || cleanRoute.contains('order')) {
      _navigateToTab(1);
    } else if (cleanRoute == '/catalog' || cleanRoute == '/services' || cleanRoute.contains('service')) {
      _navigateToTab(2);
    } else if (cleanRoute == '/support' || cleanRoute.contains('support')) {
      Navigator.of(context).push(
        MaterialPageRoute(
          builder: (_) => Scaffold(
            appBar: AppBar(title: const Text('Concierge Support')),
            body: const SupportScreen(),
          ),
        ),
      );
    } else if (cleanRoute == '/profile' || cleanRoute.contains('profile')) {
      _navigateToTab(4);
    } else if (cleanRoute == '/notifications') {
      Navigator.of(context).push(
        MaterialPageRoute(builder: (_) => const NotificationsScreen()),
      );
    }
  }

  IconData _resolveIcon(String iconName) {
    switch (iconName) {
      case 'request_quote_outlined':
      case 'quotes':
        return Icons.request_quote_outlined;
      case 'receipt_long_outlined':
      case 'invoices':
        return Icons.receipt_long_outlined;
      case 'credit_card_outlined':
      case 'payments':
        return Icons.credit_card_outlined;
      case 'folder_outlined':
      case 'orders':
      case 'portfolio':
        return Icons.folder_outlined;
      case 'assignment_outlined':
      case 'projects':
        return Icons.assignment_outlined;
      case 'support_agent_outlined':
      case 'support':
        return Icons.support_agent_outlined;
      case 'shopping_cart_outlined':
      case 'services':
      case 'catalog':
      case 'room_service_outlined':
        return Icons.room_service_outlined;
      case 'person_outline':
      case 'profile':
      case 'hub':
        return Icons.person_outline;
      case 'description_outlined':
      case 'documents':
        return Icons.description_outlined;
      case 'local_offer_outlined':
      case 'offers':
        return Icons.local_offer_outlined;
      case 'event_available':
      case 'calendar':
        return Icons.event_available;
      default:
        return Icons.grid_view_rounded;
    }
  }

  @override
  Widget build(BuildContext context) {
    final navItems = _dashboardData?.config.bottomNav.items.where((e) => e.isEnabled).toList() ?? [];

    final clientProfile = AuthRepository.instance.currentProfile;

    return Scaffold(
      backgroundColor: HenuColors.surfaceFolio,
      appBar: HenuAppBar(
        title: _getTabTitle(_currentTabIndex),
        subtitle: _getTabSubtitle(_currentTabIndex),
        avatarAsset: clientProfile?.avatarAssetPath,
        onNotificationTap: () {
          Navigator.of(context).push(
            MaterialPageRoute(builder: (_) => const NotificationsScreen()),
          );
        },
      ),
      body: _buildBody(),
      bottomNavigationBar: navItems.isNotEmpty
          ? Container(
              decoration: const BoxDecoration(
                color: HenuColors.surfaceContainerLowest,
                border: Border(top: BorderSide(color: Color(0x22C9C4D0))),
                boxShadow: HenuSpacing.cardShadow,
              ),
              child: SafeArea(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: navItems.asMap().entries.map((entry) {
                      final idx = entry.key;
                      final item = entry.value;
                      final isSelected = _currentTabIndex == idx;

                      return InkWell(
                        onTap: () => _navigateToTab(idx),
                        borderRadius: HenuSpacing.roundedLg,
                        child: Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          child: Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                _resolveIcon(item.icon),
                                size: 20,
                                color: isSelected ? HenuColors.primary : HenuColors.outline,
                              ),
                              const SizedBox(height: 3),
                              Text(
                                item.label,
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                                  color: isSelected ? HenuColors.primary : HenuColors.outline,
                                ),
                              ),
                            ],
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ),
            )
          : null,
    );
  }

  String _getTabTitle(int index) {
    switch (index) {
      case 0:
        return 'HENU OS';
      case 1:
        return 'Portfolio Deliverables';
      case 2:
        return 'Service Catalog';
      case 3:
        return 'Financial Ledger';
      case 4:
        return 'Client Hub';
      default:
        return 'HENU OS';
    }
  }

  String? _getTabSubtitle(int index) {
    switch (index) {
      case 0:
        return 'Client Lifecycle Management';
      case 1:
        return 'Active Project Milestones';
      case 2:
        return 'Advisory, Engineering & AI Suites';
      case 3:
        return 'Invoices & Reconciled Statements';
      case 4:
        return 'Concierge Desk & Security Folio';
      default:
        return null;
    }
  }

  Widget _buildBody() {
    switch (_currentTabIndex) {
      case 0:
        return _buildHomeTab();
      case 1:
        return const OrdersScreen();
      case 2:
        return const CatalogScreen();
      case 3:
        return const InvoicesScreen();
      case 4:
        return const ProfileScreen();
      default:
        return _buildHomeTab();
    }
  }

  Widget _buildHomeTab() {
    if (_isLoading) {
      return const SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            SkeletonCard(height: 140),
            SizedBox(height: 12),
            SkeletonCard(height: 160),
            SizedBox(height: 12),
            SkeletonCard(height: 120),
          ],
        ),
      );
    }

    if (_errorMessage != null) {
      return ErrorStateView(message: _errorMessage!, onRetry: _loadDashboard);
    }

    final data = _dashboardData!;
    final config = data.config;
    final orderedKeys = config.orderedSectionKeys;

    return RefreshIndicator(
      onRefresh: _loadDashboard,
      color: HenuColors.primary,
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Render sections in configured dynamic priority order
            for (final sectionKey in orderedKeys) ...[
              _buildSectionByKey(sectionKey, data),
              const SizedBox(height: 16),
            ],
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionByKey(String key, HomeDashboardData data) {
    switch (key) {
      case 'greeting':
        return _buildGreetingHeader(data);
      case 'hero_banner':
        return _buildHeroBanner(data);
      case 'primary_cta':
        return _buildPrimaryCta(data);
      case 'quick_actions':
        return _buildQuickActions(data);
      case 'offer_section':
        return _buildOfferSection(data);
      case 'recent_activity':
        return _buildRecentActivity(data);
      case 'upcoming':
        return _buildUpcomingSection(data);
      default:
        return const SizedBox.shrink();
    }
  }

  // 1. GREETING HEADER
  Widget _buildGreetingHeader(HomeDashboardData data) {
    final greetingConfig = data.config.greeting;
    if (!greetingConfig.enabled) return const SizedBox.shrink();

    final greetingPrefix = greetingConfig.customText.isNotEmpty
        ? greetingConfig.customText
        : data.dynamicTimeGreeting;

    final greetingTitle = greetingConfig.showClientName
        ? '$greetingPrefix, ${data.clientName}'
        : greetingPrefix;

    final align = greetingConfig.alignment == 'center'
        ? CrossAxisAlignment.center
        : (greetingConfig.alignment == 'right' ? CrossAxisAlignment.end : CrossAxisAlignment.start);

    final clientProfile = AuthRepository.instance.currentProfile;
    final avatarAsset = clientProfile?.avatarAssetPath ?? 'assets/images/maledp.png';

    return Column(
      crossAxisAlignment: align,
      children: [
        Row(
          mainAxisAlignment: greetingConfig.alignment == 'center'
              ? MainAxisAlignment.center
              : (greetingConfig.alignment == 'right' ? MainAxisAlignment.end : MainAxisAlignment.start),
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            if (greetingConfig.showAvatar) ...[
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(color: HenuColors.primary, width: 1.5),
                  boxShadow: HenuSpacing.cardShadow,
                ),
                child: ClipOval(
                  child: Image.asset(
                    avatarAsset,
                    fit: BoxFit.cover,
                    errorBuilder: (context, error, stackTrace) => Container(
                      color: HenuColors.surfaceContainerHigh,
                      child: const Icon(Icons.person, size: 24, color: HenuColors.primary),
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 12),
            ],
            Expanded(
              child: Column(
                crossAxisAlignment: align,
                children: [
                  Text(greetingTitle, style: HenuTypography.headlineMedium),
                  if (greetingConfig.subTitle.isNotEmpty) ...[
                    const SizedBox(height: 2),
                    Text(greetingConfig.subTitle, style: HenuTypography.bodyMedium),
                  ],
                ],
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),
        // Client ID Badge Pill
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: HenuColors.surfaceContainerLowest,
            borderRadius: HenuSpacing.roundedFull,
            border: Border.all(color: const Color(0x33C9C4D0)),
            boxShadow: HenuSpacing.cardShadow,
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 6,
                height: 6,
                decoration: const BoxDecoration(
                  color: HenuColors.secondary,
                  shape: BoxShape.circle,
                ),
              ),
              const SizedBox(width: 8),
              Text(data.clientId, style: HenuTypography.captionBold),
              const SizedBox(width: 6),
              const Icon(Icons.copy, size: 14, color: HenuColors.outline),
            ],
          ),
        ),
      ],
    );
  }

  // 2. HERO BANNER
  Widget _buildHeroBanner(HomeDashboardData data) {
    final hero = data.config.heroBanner;
    if (!hero.enabled || !hero.isActive) return const SizedBox.shrink();

    return HenuCard(
      padding: const EdgeInsets.all(18),
      backgroundColor: HenuColors.surfaceContainerLowest,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              if (hero.badgeText.isNotEmpty)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                  decoration: const BoxDecoration(
                    color: HenuColors.primaryFixed,
                    borderRadius: HenuSpacing.roundedFull,
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(width: 5, height: 5, decoration: const BoxDecoration(color: HenuColors.primary, shape: BoxShape.circle)),
                      const SizedBox(width: 6),
                      Text(hero.badgeText, style: HenuTypography.captionBold.copyWith(color: HenuColors.onPrimaryFixed, fontSize: 10)),
                    ],
                  ),
                ),
              const Text('Active Milestone', style: HenuTypography.caption),
            ],
          ),
          const SizedBox(height: 12),
          Text(hero.heading, style: HenuTypography.titleMedium),
          const SizedBox(height: 4),
          Text(hero.description, style: HenuTypography.bodyMedium),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: HenuButton(
                  text: hero.ctaText,
                  trailingIcon: Icons.arrow_forward,
                  onPressed: () => _handleRouteNavigation(hero.ctaRoute),
                ),
              ),
              if (hero.secondaryCtaText != null && hero.secondaryCtaText!.isNotEmpty) ...[
                const SizedBox(width: 8),
                HenuButton(
                  text: hero.secondaryCtaText!,
                  variant: HenuButtonVariant.secondary,
                  onPressed: () => _handleRouteNavigation(hero.secondaryCtaRoute ?? '/catalog'),
                ),
              ],
            ],
          ),
        ],
      ),
    );
  }

  // 3. PRIMARY CTA
  Widget _buildPrimaryCta(HomeDashboardData data) {
    final cta = data.config.primaryCta;
    if (!cta.enabled) return const SizedBox.shrink();

    final variant = cta.buttonStyle == 'secondary'
        ? HenuButtonVariant.secondary
        : (cta.buttonStyle == 'outline' ? HenuButtonVariant.outline : HenuButtonVariant.primary);

    return HenuCard(
      padding: const EdgeInsets.all(14),
      backgroundColor: HenuColors.surfaceContainerLowest,
      child: HenuButton(
        text: cta.label,
        leadingIcon: _resolveIcon(cta.icon),
        variant: variant,
        onPressed: () => _handleRouteNavigation(cta.destination),
      ),
    );
  }

  // 4. QUICK ACTIONS GRID
  Widget _buildQuickActions(HomeDashboardData data) {
    final quickActions = data.config.quickActions;
    if (!quickActions.enabled) return const SizedBox.shrink();

    final enabledActions = quickActions.actions.where((a) => a.isEnabled).toList();
    if (enabledActions.isEmpty) return const SizedBox.shrink();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              quickActions.title.toUpperCase(),
              style: HenuTypography.captionBold.copyWith(color: HenuColors.outline, letterSpacing: 0.8),
            ),
            Text('${enabledActions.length} Hubs', style: HenuTypography.caption),
          ],
        ),
        const SizedBox(height: 10),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 4,
            mainAxisSpacing: 10,
            crossAxisSpacing: 10,
            childAspectRatio: 0.85,
          ),
          itemCount: enabledActions.length,
          itemBuilder: (context, index) {
            final action = enabledActions[index];
            return _QuickActionButton(
              icon: _resolveIcon(action.icon),
              label: action.title,
              badgeText: action.badgeText,
              onTap: () => _handleRouteNavigation(action.route),
            );
          },
        ),
      ],
    );
  }

  // 5. OFFER / PROMOTIONAL SECTION
  Widget _buildOfferSection(HomeDashboardData data) {
    final offer = data.config.offerSection;
    if (!offer.shouldDisplay) return const SizedBox.shrink();

    return HenuCard(
      padding: const EdgeInsets.all(16),
      backgroundColor: HenuColors.surfaceContainerLowest,
      border: const Border(left: BorderSide(color: HenuColors.tertiary, width: 4)),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: HenuColors.tertiaryFixed,
                  borderRadius: HenuSpacing.roundedFull,
                ),
                child: Text(
                  offer.badge,
                  style: const TextStyle(color: HenuColors.onTertiaryFixed, fontSize: 10, fontWeight: FontWeight.bold),
                ),
              ),
              if (offer.expiryDate != null && offer.expiryDate!.isNotEmpty)
                const Row(
                  children: [
                    Icon(Icons.timer_outlined, size: 12, color: HenuColors.tertiary),
                    SizedBox(width: 4),
                    Text('Limited Time', style: TextStyle(color: HenuColors.tertiary, fontSize: 10, fontWeight: FontWeight.bold)),
                  ],
                ),
            ],
          ),
          const SizedBox(height: 10),
          Text(offer.title, style: HenuTypography.titleMedium),
          const SizedBox(height: 4),
          Text(offer.description, style: HenuTypography.bodyMedium),
          const SizedBox(height: 14),
          HenuButton(
            text: offer.ctaText,
            trailingIcon: Icons.arrow_outward,
            variant: HenuButtonVariant.secondary,
            height: 38,
            onPressed: () => _handleRouteNavigation(offer.ctaRoute),
          ),
        ],
      ),
    );
  }

  // 6. RECENT ACTIVITY
  Widget _buildRecentActivity(HomeDashboardData data) {
    final activityConfig = data.config.recentActivity;
    if (!activityConfig.enabled || !activityConfig.isActive) return const SizedBox.shrink();

    final logs = data.activityLogs.take(activityConfig.limit).toList();
    if (logs.isEmpty) return const SizedBox.shrink();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              activityConfig.title.toUpperCase(),
              style: HenuTypography.captionBold.copyWith(color: HenuColors.outline, letterSpacing: 0.8),
            ),
            const Text('Real-time Stream', style: HenuTypography.caption),
          ],
        ),
        const SizedBox(height: 10),
        HenuCard(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
          child: Column(
            children: logs.asMap().entries.map((entry) {
              final idx = entry.key;
              final log = entry.value;
              final isLast = idx == logs.length - 1;

              return InkWell(
                onTap: () {
                  if (log['route'] != null) {
                    _handleRouteNavigation(log['route'] as String);
                  }
                },
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  child: Column(
                    children: [
                      Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            width: 32,
                            height: 32,
                            decoration: BoxDecoration(
                              color: log['type'] == 'INVOICE'
                                  ? HenuColors.secondaryFixed.withOpacity(0.5)
                                  : (log['type'] == 'PAYMENT' ? HenuColors.tertiaryFixed : HenuColors.primaryFixed),
                              shape: BoxShape.circle,
                            ),
                            child: Icon(
                              log['type'] == 'INVOICE'
                                  ? Icons.receipt_long
                                  : (log['type'] == 'PAYMENT' ? Icons.payments : Icons.flag),
                              size: 16,
                              color: log['type'] == 'INVOICE'
                                  ? HenuColors.secondary
                                  : (log['type'] == 'PAYMENT' ? HenuColors.tertiary : HenuColors.primary),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(log['title'] as String, style: HenuTypography.labelMedium),
                                const SizedBox(height: 2),
                                Text(log['description'] as String, style: HenuTypography.caption),
                              ],
                            ),
                          ),
                          Text(log['time'] as String, style: HenuTypography.caption),
                        ],
                      ),
                      if (!isLast) const Padding(padding: EdgeInsets.only(top: 8), child: Divider(height: 1)),
                    ],
                  ),
                ),
              );
            }).toList(),
          ),
        ),
      ],
    );
  }

  // 7. UPCOMING SECTION
  Widget _buildUpcomingSection(HomeDashboardData data) {
    final upcomingConfig = data.config.upcoming;
    if (!upcomingConfig.enabled || !upcomingConfig.isActive) return const SizedBox.shrink();

    final items = data.upcomingItems.take(upcomingConfig.limit).toList();
    if (items.isEmpty) return const SizedBox.shrink();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              upcomingConfig.title.toUpperCase(),
              style: HenuTypography.captionBold.copyWith(color: HenuColors.outline, letterSpacing: 0.8),
            ),
            const Text('Action Schedule', style: HenuTypography.caption),
          ],
        ),
        const SizedBox(height: 10),
        HenuCard(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
          child: Column(
            children: items.asMap().entries.map((entry) {
              final idx = entry.key;
              final item = entry.value;
              final isLast = idx == items.length - 1;

              return InkWell(
                onTap: () {
                  if (item['route'] != null) {
                    _handleRouteNavigation(item['route'] as String);
                  }
                },
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 8),
                  child: Column(
                    children: [
                      Row(
                        children: [
                          Container(
                            width: 32,
                            height: 32,
                            decoration: const BoxDecoration(
                              color: HenuColors.surfaceContainer,
                              shape: BoxShape.circle,
                            ),
                            child: Icon(
                              item['type'] == 'MEETING'
                                  ? Icons.event_available
                                  : (item['type'] == 'PAYMENT' ? Icons.notification_important_outlined : Icons.check_circle_outline),
                              size: 16,
                              color: HenuColors.primary,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(item['title'] as String, style: HenuTypography.labelMedium),
                                const SizedBox(height: 2),
                                Text(item['time'] as String, style: HenuTypography.caption.copyWith(color: HenuColors.primary)),
                              ],
                            ),
                          ),
                          const Icon(Icons.chevron_right, size: 16, color: HenuColors.outline),
                        ],
                      ),
                      if (!isLast) const Padding(padding: EdgeInsets.only(top: 8), child: Divider(height: 1)),
                    ],
                  ),
                ),
              );
            }).toList(),
          ),
        ),
      ],
    );
  }
}

class _QuickActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final String? badgeText;
  final VoidCallback onTap;

  const _QuickActionButton({
    required this.icon,
    required this.label,
    this.badgeText,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: HenuSpacing.roundedLg,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 4),
        decoration: BoxDecoration(
          color: HenuColors.surfaceContainerLowest,
          borderRadius: HenuSpacing.roundedLg,
          border: Border.all(color: const Color(0x33C9C4D0)),
          boxShadow: HenuSpacing.cardShadow,
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Stack(
              clipBehavior: Clip.none,
              children: [
                Container(
                  width: 34,
                  height: 34,
                  decoration: const BoxDecoration(
                    color: HenuColors.surfaceContainer,
                    shape: BoxShape.circle,
                  ),
                  child: Icon(icon, size: 18, color: HenuColors.onSurface),
                ),
                if (badgeText != null)
                  Positioned(
                    top: -4,
                    right: -4,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
                      decoration: BoxDecoration(
                        color: HenuColors.tertiary,
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        badgeText!,
                        style: const TextStyle(color: Colors.white, fontSize: 8, fontWeight: FontWeight.bold),
                      ),
                    ),
                  ),
              ],
            ),
            const SizedBox(height: 6),
            Text(
              label,
              style: HenuTypography.caption.copyWith(
                color: HenuColors.onSurface,
                fontSize: 11,
                fontWeight: FontWeight.w500,
              ),
              textAlign: TextAlign.center,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}
