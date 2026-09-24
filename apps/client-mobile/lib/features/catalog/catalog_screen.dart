import 'package:flutter/material.dart';
import '../../core/constants/henu_colors.dart';
import '../../core/constants/henu_spacing.dart';
import '../../core/constants/henu_typography.dart';
import '../../core/utils/formatters.dart';
import '../../shared/models/service_item.dart';
import '../../shared/widgets/henu_card.dart';
import '../../shared/widgets/state_views.dart';
import 'catalog_repository.dart';
import 'service_detail_modal.dart';

class CatalogScreen extends StatefulWidget {
  const CatalogScreen({super.key});

  @override
  State<CatalogScreen> createState() => _CatalogScreenState();
}

class _CatalogScreenState extends State<CatalogScreen> {
  String _selectedCategory = 'ALL';
  bool _isLoading = true;
  List<ServiceItem> _services = [];
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadServices();
  }

  Future<void> _loadServices() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    final res = await CatalogRepository.instance.getServices(category: _selectedCategory);
    if (!mounted) return;

    if (res.success && res.data != null) {
      setState(() {
        _services = res.data!;
        _isLoading = false;
      });
    } else {
      setState(() {
        _errorMessage = res.errorMessage ?? 'Failed to load services.';
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Category Filter Chips
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          child: Row(
            children: [
              _CategoryChip(
                label: 'All Services',
                isSelected: _selectedCategory == 'ALL',
                onTap: () {
                  setState(() => _selectedCategory = 'ALL');
                  _loadServices();
                },
              ),
              const SizedBox(width: 8),
              _CategoryChip(
                label: 'Advisory & Audit',
                isSelected: _selectedCategory == 'ADVISORY',
                onTap: () {
                  setState(() => _selectedCategory = 'ADVISORY');
                  _loadServices();
                },
              ),
              const SizedBox(width: 8),
              _CategoryChip(
                label: 'Engineering',
                isSelected: _selectedCategory == 'DEVELOPMENT',
                onTap: () {
                  setState(() => _selectedCategory = 'DEVELOPMENT');
                  _loadServices();
                },
              ),
              const SizedBox(width: 8),
              _CategoryChip(
                label: 'AI & Automations',
                isSelected: _selectedCategory == 'AI_SERVICES',
                onTap: () {
                  setState(() => _selectedCategory = 'AI_SERVICES');
                  _loadServices();
                },
              ),
            ],
          ),
        ),

        // Content
        Expanded(
          child: _isLoading
              ? const Padding(
                  padding: EdgeInsets.all(16),
                  child: Column(
                    children: [
                      SkeletonCard(height: 150),
                      SizedBox(height: 12),
                      SkeletonCard(height: 150),
                    ],
                  ),
                )
              : _errorMessage != null
                  ? ErrorStateView(message: _errorMessage!, onRetry: _loadServices)
                  : _services.isEmpty
                      ? const EmptyStateView(
                          title: 'No Services Found',
                          description: 'No services currently match your filter criteria.',
                          icon: Icons.inventory_2_outlined,
                        )
                      : ListView.separated(
                          padding: const EdgeInsets.all(16),
                          itemCount: _services.length,
                          separatorBuilder: (_, __) => const SizedBox(height: 12),
                          itemBuilder: (context, index) {
                            final service = _services[index];
                            return HenuCard(
                              onTap: () {
                                showModalBottomSheet(
                                  context: context,
                                  isScrollControlled: true,
                                  backgroundColor: Colors.transparent,
                                  builder: (_) => ServiceDetailModal(service: service),
                                );
                              },
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(service.code, style: HenuTypography.captionBold),
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                        decoration: BoxDecoration(
                                          color: HenuColors.secondaryContainer.withOpacity(0.5),
                                          borderRadius: HenuSpacing.roundedFull,
                                        ),
                                        child: Text(
                                          service.category,
                                          style: HenuTypography.captionBold.copyWith(
                                            color: HenuColors.secondary,
                                            fontSize: 10,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 8),
                                  Text(service.name, style: HenuTypography.labelMedium),
                                  const SizedBox(height: 6),
                                  Text(service.shortDescription, style: HenuTypography.bodyMedium),
                                  const SizedBox(height: 12),
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text(
                                        'From ${HenuFormatters.currency(service.startingPrice)}',
                                        style: HenuTypography.titleMedium.copyWith(
                                          color: HenuColors.primary,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      Row(
                                        children: [
                                          Text(
                                            'Customize',
                                            style: HenuTypography.captionBold.copyWith(color: HenuColors.primary),
                                          ),
                                          const Icon(Icons.chevron_right, size: 16, color: HenuColors.primary),
                                        ],
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            );
                          },
                        ),
        ),
      ],
    );
  }
}

class _CategoryChip extends StatelessWidget {
  final String label;
  final bool isSelected;
  final VoidCallback onTap;

  const _CategoryChip({
    required this.label,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: HenuSpacing.roundedFull,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected ? HenuColors.primary : HenuColors.surfaceContainerLowest,
          borderRadius: HenuSpacing.roundedFull,
          border: Border.all(color: isSelected ? HenuColors.primary : const Color(0x33C9C4D0)),
        ),
        child: Text(
          label,
          style: HenuTypography.captionBold.copyWith(
            color: isSelected ? HenuColors.onPrimary : HenuColors.onSurface,
          ),
        ),
      ),
    );
  }
}
