import 'package:flutter/material.dart';
import '../../core/constants/henu_colors.dart';
import '../../core/constants/henu_spacing.dart';
import '../../core/constants/henu_typography.dart';
import '../../core/utils/formatters.dart';
import '../../shared/widgets/henu_app_bar.dart';
import '../../shared/widgets/henu_badge.dart';
import '../../shared/widgets/henu_bottom_nav.dart';
import '../../shared/widgets/henu_button.dart';
import '../../shared/widgets/henu_card.dart';
import '../../shared/widgets/state_views.dart';
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
        _errorMessage = res.errorMessage ?? 'Failed to load home dashboard.';
        _isLoading = false;
      });
    }
  }

  void _navigateToTab(int tabIndex) {
    setState(() {
      _currentTabIndex = tabIndex;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: HenuColors.surfaceFolio,
      appBar: HenuAppBar(
        title: _getTabTitle(_currentTabIndex),
        subtitle: _getTabSubtitle(_currentTabIndex),
        onNotificationTap: () {
          Navigator.of(context).push(
            MaterialPageRoute(builder: (_) => const NotificationsScreen()),
          );
        },
      ),
      body: _buildBody(),
      bottomNavigationBar: HenuBottomNav(
        currentIndex: _currentTabIndex,
        onTap: _navigateToTab,
      ),
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
            SkeletonCard(height: 160),
            SizedBox(height: 12),
            SkeletonCard(height: 120),
            SizedBox(height: 12),
            SkeletonCard(height: 140),
          ],
        ),
      );
    }

    if (_errorMessage != null) {
      return ErrorStateView(message: _errorMessage!, onRetry: _loadDashboard);
    }

    final data = _dashboardData!;

    return RefreshIndicator(
      onRefresh: _loadDashboard,
      color: HenuColors.primary,
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // GREETING & IDENTITY STRIP
            Text(data.greeting, style: HenuTypography.headlineMedium),
            const SizedBox(height: 2),
            Text(data.subGreeting, style: HenuTypography.bodyMedium),
            const SizedBox(height: 10),

            // Client ID Pill
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

            const SizedBox(height: 16),

            // 1. EDITORIAL HERO CARD matching Stitch
            HenuCard(
              padding: const EdgeInsets.all(18),
              backgroundColor: HenuColors.surfaceContainerLowest,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
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
                            Text('Priority Milestone', style: HenuTypography.captionBold.copyWith(color: HenuColors.onPrimaryFixed, fontSize: 10)),
                          ],
                        ),
                      ),
                      const Text('Q2 Roadmap', style: HenuTypography.caption),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(data.heroTitle, style: HenuTypography.titleMedium),
                  const SizedBox(height: 4),
                  Text(data.heroSubtitle, style: HenuTypography.bodyMedium),
                  const SizedBox(height: 16),
                  HenuButton(
                    text: 'Review Deliverables',
                    trailingIcon: Icons.arrow_forward,
                    onPressed: () => _navigateToTab(1),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // 2. ACTIVE WORK / PROJECT PROGRESS
            HenuCard(
              padding: const EdgeInsets.all(18),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Container(width: 6, height: 6, decoration: const BoxDecoration(color: HenuColors.secondary, shape: BoxShape.circle)),
                          const SizedBox(width: 6),
                          Text('Milestone 4 of 6', style: HenuTypography.captionBold.copyWith(color: HenuColors.secondary)),
                        ],
                      ),
                      Text('${data.activeProject.progressPercent}%', style: HenuTypography.titleMedium.copyWith(color: HenuColors.secondary, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  const SizedBox(height: 6),
                  Text(data.activeProject.title, style: HenuTypography.labelMedium),
                  const SizedBox(height: 10),
                  ClipRRect(
                    borderRadius: HenuSpacing.roundedFull,
                    child: LinearProgressIndicator(
                      value: data.activeProject.progressPercent / 100.0,
                      backgroundColor: HenuColors.surfaceContainer,
                      valueColor: const AlwaysStoppedAnimation<Color>(HenuColors.secondary),
                      minHeight: 6,
                    ),
                  ),
                  const SizedBox(height: 10),
                  const Divider(),
                  const SizedBox(height: 6),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Row(
                        children: [
                          Icon(Icons.event_available, size: 14, color: HenuColors.secondary),
                          SizedBox(width: 4),
                          Text('Next: Staging Deployment · May 14', style: HenuTypography.caption),
                        ],
                      ),
                      InkWell(
                        onTap: () => _navigateToTab(1),
                        child: Row(
                          children: [
                            Text('Specs', style: HenuTypography.captionBold.copyWith(color: HenuColors.secondary)),
                            const Icon(Icons.chevron_right, size: 14, color: HenuColors.secondary),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // 3. DYNAMIC QUICK ACTIONS GRID (8 Hubs) matching Stitch
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('OPERATIONAL PORTALS', style: HenuTypography.captionBold.copyWith(color: HenuColors.outline, letterSpacing: 0.8)),
                const Text('8 Hubs', style: HenuTypography.caption),
              ],
            ),
            const SizedBox(height: 10),
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 4,
              mainAxisSpacing: 10,
              crossAxisSpacing: 10,
              children: [
                _QuickActionButton(
                  icon: Icons.request_quote_outlined,
                  label: 'Quotes',
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => Scaffold(
                          appBar: AppBar(title: const Text('Quotes Workbench')),
                          body: const QuotesScreen(),
                        ),
                      ),
                    );
                  },
                ),
                _QuickActionButton(
                  icon: Icons.receipt_long_outlined,
                  label: 'Invoices',
                  onTap: () => _navigateToTab(3),
                ),
                _QuickActionButton(
                  icon: Icons.credit_card_outlined,
                  label: 'Payments',
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => Scaffold(
                          appBar: AppBar(title: const Text('Payment Ledger')),
                          body: const PaymentsScreen(),
                        ),
                      ),
                    );
                  },
                ),
                _QuickActionButton(
                  icon: Icons.room_service_outlined,
                  label: 'Services',
                  onTap: () => _navigateToTab(2),
                ),
                _QuickActionButton(
                  icon: Icons.folder_outlined,
                  label: 'Portfolio',
                  onTap: () => _navigateToTab(1),
                ),
                _QuickActionButton(
                  icon: Icons.support_agent_outlined,
                  label: 'Support',
                  onTap: () {
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => Scaffold(
                          appBar: AppBar(title: const Text('Concierge Support')),
                          body: const SupportScreen(),
                        ),
                      ),
                    );
                  },
                ),
                _QuickActionButton(
                  icon: Icons.shopping_cart_outlined,
                  label: 'Software',
                  onTap: () => _navigateToTab(2),
                ),
                _QuickActionButton(
                  icon: Icons.add_circle_outline,
                  label: 'Request',
                  onTap: () => _navigateToTab(2),
                ),
              ],
            ),

            const SizedBox(height: 16),

            // 4. FINANCIAL SNAPSHOT & INVOICES
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('FINANCIAL SNAPSHOT', style: HenuTypography.captionBold.copyWith(color: HenuColors.outline, letterSpacing: 0.8)),
                const Row(
                  children: [
                    Icon(Icons.lock, size: 12, color: HenuColors.tertiary),
                    SizedBox(width: 4),
                    Text('Encrypted Ledger', style: TextStyle(color: HenuColors.tertiary, fontSize: 11, fontWeight: FontWeight.w600)),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 10),

            Row(
              children: [
                Expanded(
                  child: HenuCard(
                    padding: const EdgeInsets.all(14),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Total Invoiced', style: HenuTypography.caption),
                        const SizedBox(height: 4),
                        Text(HenuFormatters.currency(data.totalInvoiced), style: HenuTypography.titleMedium.copyWith(fontWeight: FontWeight.bold)),
                        const SizedBox(height: 2),
                        Text('Fiscal Year 2026', style: HenuTypography.caption.copyWith(fontSize: 10)),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: HenuCard(
                    padding: const EdgeInsets.all(14),
                    border: const Border(left: BorderSide(color: HenuColors.tertiaryFixedDim, width: 4)),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Pending Balance', style: HenuTypography.caption),
                        const SizedBox(height: 4),
                        Text(HenuFormatters.currency(data.pendingBalance), style: HenuTypography.titleMedium.copyWith(color: HenuColors.tertiary, fontWeight: FontWeight.bold)),
                        const SizedBox(height: 2),
                        Text('1 Action Required', style: HenuTypography.caption.copyWith(color: HenuColors.tertiary, fontSize: 10, fontWeight: FontWeight.w600)),
                      ],
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 10),

            // Urgent Invoice Card
            HenuCard(
              padding: const EdgeInsets.all(14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Text(data.urgentInvoice.invoiceNumber, style: HenuTypography.labelMedium),
                          const SizedBox(width: 8),
                          HenuBadge.status(data.urgentInvoice.status),
                        ],
                      ),
                      Text(
                        HenuFormatters.currency(data.urgentInvoice.totalAmount),
                        style: HenuTypography.titleMedium.copyWith(fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(data.urgentInvoice.title, style: HenuTypography.bodyMedium),
                      const Text('Due May 20', style: HenuTypography.caption),
                    ],
                  ),
                  const SizedBox(height: 10),
                  const Divider(),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      TextButton.icon(
                        icon: const Icon(Icons.visibility_outlined, size: 16),
                        label: const Text('View PDF', style: HenuTypography.captionBold),
                        onPressed: () => _navigateToTab(3),
                      ),
                      HenuButton(
                        text: 'Pay Now',
                        trailingIcon: Icons.arrow_outward,
                        variant: HenuButtonVariant.secondary,
                        width: 130,
                        height: 38,
                        onPressed: () => _navigateToTab(3),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // 5. RECENT ACTIVITY TIMELINE
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('AUDIT & ACTIVITY LOG', style: HenuTypography.captionBold.copyWith(color: HenuColors.outline, letterSpacing: 0.8)),
                const Text('Real-time Stream', style: HenuTypography.caption),
              ],
            ),
            const SizedBox(height: 10),
            HenuCard(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              child: Column(
                children: data.activityLogs.asMap().entries.map((entry) {
                  final idx = entry.key;
                  final log = entry.value;
                  final isLast = idx == data.activityLogs.length - 1;

                  return Padding(
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
                                color: log['type'] == 'QUOTE'
                                    ? HenuColors.secondaryFixed.withOpacity(0.5)
                                    : (log['type'] == 'PAYMENT' ? HenuColors.tertiaryFixed : HenuColors.primaryFixed),
                                shape: BoxShape.circle,
                              ),
                              child: Icon(
                                log['type'] == 'QUOTE'
                                    ? Icons.check_circle
                                    : (log['type'] == 'PAYMENT' ? Icons.payments : Icons.flag),
                                size: 16,
                                color: log['type'] == 'QUOTE'
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
                  );
                }).toList(),
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }
}

class _QuickActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;

  const _QuickActionButton({
    required this.icon,
    required this.label,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: HenuSpacing.roundedLg,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 4),
        decoration: BoxDecoration(
          color: HenuColors.surfaceContainerLowest,
          borderRadius: HenuSpacing.roundedLg,
          border: Border.all(color: const Color(0x33C9C4D0)),
          boxShadow: HenuSpacing.cardShadow,
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 36,
              height: 36,
              decoration: const BoxDecoration(
                color: HenuColors.surfaceContainer,
                shape: BoxShape.circle,
              ),
              child: Icon(icon, size: 18, color: HenuColors.onSurface),
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
