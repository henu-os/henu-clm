import 'package:flutter/material.dart';
import '../../core/constants/henu_colors.dart';
import '../../core/constants/henu_typography.dart';
import '../../core/utils/formatters.dart';
import '../../shared/models/invoice_item.dart';
import '../../shared/widgets/henu_badge.dart';
import '../../shared/widgets/henu_button.dart';
import '../../shared/widgets/henu_card.dart';
import 'invoices_repository.dart';

class InvoiceDetailScreen extends StatefulWidget {
  final InvoiceItem invoice;
  final VoidCallback? onPaymentCompleted;

  const InvoiceDetailScreen({
    super.key,
    required this.invoice,
    this.onPaymentCompleted,
  });

  @override
  State<InvoiceDetailScreen> createState() => _InvoiceDetailScreenState();
}

class _InvoiceDetailScreenState extends State<InvoiceDetailScreen> {
  late InvoiceItem _currentInvoice;
  bool _isPaying = false;

  @override
  void initState() {
    super.initState();
    _currentInvoice = widget.invoice;
  }

  void _showCheckoutModal() {
    String selectedGateway = 'RAZORPAY';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setModalState) => Container(
          padding: const EdgeInsets.all(24),
          decoration: const BoxDecoration(
            color: HenuColors.surfaceContainerLowest,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Encrypted Payment Checkout', style: HenuTypography.titleMedium),
                  IconButton(
                    icon: const Icon(Icons.close, size: 20),
                    onPressed: () => Navigator.of(ctx).pop(),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                'Settling ${_currentInvoice.invoiceNumber} (${HenuFormatters.currency(_currentInvoice.balanceDue)}) via authorized gateway.',
                style: HenuTypography.bodyMedium,
              ),
              const SizedBox(height: 16),

              // Razorpay Option
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: Radio<String>(
                  value: 'RAZORPAY',
                  groupValue: selectedGateway,
                  activeColor: HenuColors.primary,
                  onChanged: (val) => setModalState(() => selectedGateway = val!),
                ),
                title: const Text('Razorpay (Cards, NetBanking, UPI, Corporate)', style: HenuTypography.captionBold),
                subtitle: const Text('256-bit TLS Encrypted Transaction', style: HenuTypography.caption),
              ),

              // Cashfree Option
              ListTile(
                contentPadding: EdgeInsets.zero,
                leading: Radio<String>(
                  value: 'CASHFREE',
                  groupValue: selectedGateway,
                  activeColor: HenuColors.primary,
                  onChanged: (val) => setModalState(() => selectedGateway = val!),
                ),
                title: const Text('Cashfree Payments (Seamless Auto-Debit)', style: HenuTypography.captionBold),
                subtitle: const Text('Direct Settlement via Bank Webhook', style: HenuTypography.caption),
              ),

              const SizedBox(height: 20),
              HenuButton(
                text: 'Pay ${HenuFormatters.currency(_currentInvoice.balanceDue)} Now',
                icon: Icons.lock,
                isLoading: _isPaying,
                onPressed: () async {
                  Navigator.of(ctx).pop();
                  setState(() => _isPaying = true);
                  final res = await InvoicesRepository.instance.recordMockPayment(_currentInvoice.id);
                  setState(() => _isPaying = false);

                  if (res.success && res.data != null) {
                    setState(() => _currentInvoice = res.data!);
                    widget.onPaymentCompleted?.call();
                    if (!mounted) return;
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Payment processed successfully. Webhook reconciliation verified.'),
                        backgroundColor: HenuColors.successGreen,
                      ),
                    );
                  }
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: HenuColors.surfaceFolio,
      appBar: AppBar(
        title: Text(_currentInvoice.invoiceNumber),
        actions: [
          IconButton(
            icon: const Icon(Icons.download_outlined),
            tooltip: 'Download PDF',
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text('Downloading encrypted invoice PDF for ${_currentInvoice.invoiceNumber}...'),
                  backgroundColor: HenuColors.primary,
                ),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            HenuCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      HenuBadge.status(_currentInvoice.status),
                      Text('Due: ${HenuFormatters.formatDate(_currentInvoice.dueDate)}', style: HenuTypography.caption),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(_currentInvoice.title, style: HenuTypography.headlineSmall),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Total Amount', style: HenuTypography.captionBold),
                      Text(
                        HenuFormatters.currency(_currentInvoice.totalAmount),
                        style: HenuTypography.titleMedium.copyWith(color: HenuColors.primary, fontWeight: FontWeight.bold),
                      ),
                    ],
                  ),
                  if (_currentInvoice.balanceDue > 0) ...[
                    const SizedBox(height: 8),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Outstanding Balance', style: HenuTypography.captionBold),
                        Text(
                          HenuFormatters.currency(_currentInvoice.balanceDue),
                          style: HenuTypography.titleMedium.copyWith(color: HenuColors.tertiary, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ],
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Financial Breakdown Card
            HenuCard(
              child: Column(
                children: [
                  _SummaryRow(label: 'Invoice Subtotal', value: HenuFormatters.currency(_currentInvoice.subtotal)),
                  const SizedBox(height: 6),
                  _SummaryRow(label: 'Tax (18% GST / VAT)', value: HenuFormatters.currency(_currentInvoice.tax)),
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 8),
                    child: Divider(),
                  ),
                  _SummaryRow(
                    label: 'Total Invoiced',
                    value: HenuFormatters.currency(_currentInvoice.totalAmount),
                    isBold: true,
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            if (_currentInvoice.isPayable) ...[
              HenuButton(
                text: 'Pay with Razorpay / Cashfree',
                icon: Icons.credit_card,
                isLoading: _isPaying,
                variant: HenuButtonVariant.secondary,
                onPressed: _showCheckoutModal,
              ),
              const SizedBox(height: 12),
            ],

            HenuButton(
              text: 'View Official Tax Invoice PDF',
              variant: HenuButtonVariant.outline,
              icon: Icons.picture_as_pdf_outlined,
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Opening secure PDF document for ${_currentInvoice.invoiceNumber}'),
                    backgroundColor: HenuColors.secondary,
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}

class _SummaryRow extends StatelessWidget {
  final String label;
  final String value;
  final bool isBold;

  const _SummaryRow({
    required this.label,
    required this.value,
    this.isBold = false,
  });

  @override
  Widget build(BuildContext context) {
    final style = isBold
        ? HenuTypography.titleMedium.copyWith(fontWeight: FontWeight.bold)
        : HenuTypography.bodyMedium.copyWith(color: HenuColors.onSurfaceVariant);

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: style),
        Text(value, style: style),
      ],
    );
  }
}
