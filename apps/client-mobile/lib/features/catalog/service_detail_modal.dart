import 'package:flutter/material.dart';
import '../../core/constants/henu_colors.dart';
import '../../core/constants/henu_typography.dart';
import '../../core/utils/formatters.dart';
import '../../shared/models/service_item.dart';
import '../../shared/widgets/henu_button.dart';
import '../../shared/widgets/henu_card.dart';

class ServiceDetailModal extends StatefulWidget {
  final ServiceItem service;

  const ServiceDetailModal({super.key, required this.service});

  @override
  State<ServiceDetailModal> createState() => _ServiceDetailModalState();
}

class _ServiceDetailModalState extends State<ServiceDetailModal> {
  final Set<String> _selectedAddOnIds = {};

  double get _totalPrice {
    double total = widget.service.startingPrice;
    for (final addOn in widget.service.addOns) {
      if (_selectedAddOnIds.contains(addOn.id)) {
        total += addOn.price;
      }
    }
    return total;
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: MediaQuery.of(context).size.height * 0.85,
      decoration: const BoxDecoration(
        color: HenuColors.surfaceFolio,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        children: [
          // Drag Handle & Header
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
            decoration: const BoxDecoration(
              color: HenuColors.surfaceContainerLowest,
              borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
              border: Border(bottom: BorderSide(color: Color(0x26C9C4D0))),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(widget.service.code, style: HenuTypography.captionBold),
                    Text(widget.service.category, style: HenuTypography.caption.copyWith(color: HenuColors.secondary)),
                  ],
                ),
                IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: () => Navigator.of(context).pop(),
                ),
              ],
            ),
          ),

          // Scrollable Content
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(widget.service.name, style: HenuTypography.headlineSmall),
                  const SizedBox(height: 12),
                  Text(widget.service.fullDescription, style: HenuTypography.bodyMedium),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      const Icon(Icons.schedule, size: 16, color: HenuColors.secondary),
                      const SizedBox(width: 6),
                      Text('Typical Delivery: ${widget.service.deliveryDays}', style: HenuTypography.captionBold),
                    ],
                  ),
                  const SizedBox(height: 20),

                  // Deliverable Scope Features
                  Text('CORE DELIVERABLES', style: HenuTypography.captionBold.copyWith(color: HenuColors.outline, letterSpacing: 0.8)),
                  const SizedBox(height: 8),
                  ...widget.service.features.map(
                    (f) => Padding(
                      padding: const EdgeInsets.symmetric(vertical: 4),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Icon(Icons.check_circle, size: 16, color: HenuColors.secondary),
                          const SizedBox(width: 8),
                          Expanded(child: Text(f, style: HenuTypography.bodyMedium.copyWith(fontSize: 13))),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Add-ons Section
                  if (widget.service.addOns.isNotEmpty) ...[
                    Text('OPTIONAL ADD-ONS', style: HenuTypography.captionBold.copyWith(color: HenuColors.outline, letterSpacing: 0.8)),
                    const SizedBox(height: 8),
                    ...widget.service.addOns.map((addOn) {
                      final isSelected = _selectedAddOnIds.contains(addOn.id);
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: HenuCard(
                          padding: const EdgeInsets.all(12),
                          onTap: () {
                            setState(() {
                              if (isSelected) {
                                _selectedAddOnIds.remove(addOn.id);
                              } else {
                                _selectedAddOnIds.add(addOn.id);
                              }
                            });
                          },
                          backgroundColor: isSelected ? HenuColors.primaryFixed.withOpacity(0.3) : HenuColors.surfaceContainerLowest,
                          border: isSelected ? Border.all(color: HenuColors.primary, width: 1.5) : null,
                          child: Row(
                            children: [
                              Checkbox(
                                value: isSelected,
                                activeColor: HenuColors.primary,
                                onChanged: (val) {
                                  setState(() {
                                    if (val == true) {
                                      _selectedAddOnIds.add(addOn.id);
                                    } else {
                                      _selectedAddOnIds.remove(addOn.id);
                                    }
                                  });
                                },
                              ),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(addOn.title, style: HenuTypography.labelMedium),
                                    Text(addOn.description, style: HenuTypography.caption),
                                  ],
                                ),
                              ),
                              Text(
                                '+${HenuFormatters.currency(addOn.price)}',
                                style: HenuTypography.captionBold.copyWith(color: HenuColors.primary),
                              ),
                            ],
                          ),
                        ),
                      );
                    }),
                  ],
                ],
              ),
            ),
          ),

          // Bottom Fixed Action Bar
          Container(
            padding: const EdgeInsets.all(16),
            decoration: const BoxDecoration(
              color: HenuColors.surfaceContainerLowest,
              border: Border(top: BorderSide(color: Color(0x26C9C4D0))),
            ),
            child: SafeArea(
              child: Row(
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Text('Estimated Cost', style: HenuTypography.caption),
                      Text(
                        HenuFormatters.currency(_totalPrice),
                        style: HenuTypography.titleMedium.copyWith(color: HenuColors.primary, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                  const SizedBox(width: 20),
                  Expanded(
                    child: HenuButton(
                      text: 'Request Quote',
                      icon: Icons.add_circle_outline,
                      onPressed: () {
                        Navigator.of(context).pop();
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text('Quote request for "${widget.service.name}" submitted.'),
                            backgroundColor: HenuColors.primary,
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
