import 'package:flutter/material.dart';
import '../../core/constants/henu_colors.dart';
import '../../core/constants/henu_typography.dart';
import '../../core/utils/formatters.dart';
import '../../shared/models/invoice_item.dart';
import '../../shared/widgets/henu_badge.dart';
import '../../shared/widgets/henu_card.dart';
import '../../shared/widgets/state_views.dart';
import 'invoice_detail_screen.dart';
import 'invoices_repository.dart';

class InvoicesScreen extends StatefulWidget {
  const InvoicesScreen({super.key});

  @override
  State<InvoicesScreen> createState() => _InvoicesScreenState();
}

class _InvoicesScreenState extends State<InvoicesScreen> {
  bool _isLoading = true;
  List<InvoiceItem> _invoices = [];
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadInvoices();
  }

  Future<void> _loadInvoices() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    final res = await InvoicesRepository.instance.getInvoices();
    if (!mounted) return;

    if (res.success && res.data != null) {
      setState(() {
        _invoices = res.data!;
        _isLoading = false;
      });
    } else {
      setState(() {
        _errorMessage = res.errorMessage ?? 'Failed to load invoices.';
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            SkeletonCard(height: 120),
            SizedBox(height: 12),
            SkeletonCard(height: 120),
          ],
        ),
      );
    }

    if (_errorMessage != null) {
      return ErrorStateView(message: _errorMessage!, onRetry: _loadInvoices);
    }

    if (_invoices.isEmpty) {
      return const EmptyStateView(
        title: 'No Invoices Found',
        description: 'You have no historical or outstanding invoices.',
        icon: Icons.receipt_long_outlined,
      );
    }

    return RefreshIndicator(
      onRefresh: _loadInvoices,
      color: HenuColors.primary,
      child: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: _invoices.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          final invoice = _invoices[index];
          return HenuCard(
            onTap: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (_) => InvoiceDetailScreen(
                    invoice: invoice,
                    onPaymentCompleted: _loadInvoices,
                  ),
                ),
              );
            },
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(invoice.invoiceNumber, style: HenuTypography.captionBold),
                    HenuBadge.status(invoice.status),
                  ],
                ),
                const SizedBox(height: 8),
                Text(invoice.title, style: HenuTypography.labelMedium),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Due: ${HenuFormatters.formatDate(invoice.dueDate)}',
                      style: HenuTypography.caption,
                    ),
                    Text(
                      HenuFormatters.currency(invoice.totalAmount),
                      style: HenuTypography.titleMedium.copyWith(
                        color: invoice.isPayable ? HenuColors.tertiary : HenuColors.onSurface,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}
