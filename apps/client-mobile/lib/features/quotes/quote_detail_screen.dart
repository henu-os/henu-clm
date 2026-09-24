import 'package:flutter/material.dart';
import '../../core/constants/henu_colors.dart';
import '../../core/constants/henu_spacing.dart';
import '../../core/constants/henu_typography.dart';
import '../../core/utils/formatters.dart';
import '../../shared/models/quote_item.dart';
import '../../shared/widgets/henu_badge.dart';
import '../../shared/widgets/henu_button.dart';
import '../../shared/widgets/henu_card.dart';
import 'quotes_repository.dart';

class QuoteDetailScreen extends StatefulWidget {
  final QuoteItem quote;
  final VoidCallback? onStatusChanged;

  const QuoteDetailScreen({
    super.key,
    required this.quote,
    this.onStatusChanged,
  });

  @override
  State<QuoteDetailScreen> createState() => _QuoteDetailScreenState();
}

class _QuoteDetailScreenState extends State<QuoteDetailScreen> {
  late QuoteItem _currentQuote;
  bool _isProcessing = false;
  bool _agreedToTerms = false;

  @override
  void initState() {
    super.initState();
    _currentQuote = widget.quote;
  }

  void _showApprovalDialog() {
    final signatoryController = TextEditingController(text: 'Siddharth Rao');

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setModalState) => Container(
          padding: EdgeInsets.only(
            left: 20,
            right: 20,
            top: 24,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 24,
          ),
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
                  const Text('Approve & Sign Quote', style: HenuTypography.titleMedium),
                  IconButton(
                    icon: const Icon(Icons.close, size: 20),
                    onPressed: () => Navigator.of(ctx).pop(),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Text(
                'By signing, you accept the deliverables and terms for ${_currentQuote.quoteNumber} (${HenuFormatters.currency(_currentQuote.totalAmount)}).',
                style: HenuTypography.bodyMedium,
              ),
              const SizedBox(height: 16),
              TextField(
                controller: signatoryController,
                decoration: const InputDecoration(
                  labelText: 'Authorized Signatory Full Name',
                  hintText: 'Enter your full name',
                ),
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Checkbox(
                    value: _agreedToTerms,
                    activeColor: HenuColors.primary,
                    onChanged: (val) {
                      setModalState(() {
                        _agreedToTerms = val ?? false;
                      });
                      setState(() {
                        _agreedToTerms = val ?? false;
                      });
                    },
                  ),
                  Expanded(
                    child: Text(
                      'I confirm authority to bind the organization to this agreement.',
                      style: HenuTypography.caption.copyWith(color: HenuColors.onSurface),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              HenuButton(
                text: 'Confirm & Legally Bind',
                icon: Icons.check_circle_outline,
                isLoading: _isProcessing,
                onPressed: _agreedToTerms
                    ? () async {
                        Navigator.of(ctx).pop();
                        setState(() => _isProcessing = true);
                        final res = await QuotesRepository.instance.approveQuote(
                          _currentQuote.id,
                          signatoryName: signatoryController.text,
                        );
                        setState(() => _isProcessing = false);
                        if (res.success && res.data != null) {
                          setState(() => _currentQuote = res.data!);
                          widget.onStatusChanged?.call();
                          if (!mounted) return;
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Quote approved successfully! Order conversion initiated.'),
                              backgroundColor: HenuColors.successGreen,
                            ),
                          );
                        }
                      }
                    : null,
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showRejectionDialog() {
    final reasonController = TextEditingController();

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Decline Quote Proposal', style: HenuTypography.titleMedium),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Please specify the reason for declining this proposal so our advisory team can revise.',
              style: HenuTypography.bodyMedium,
            ),
            const SizedBox(height: 14),
            TextField(
              controller: reasonController,
              maxLines: 3,
              decoration: const InputDecoration(
                hintText: 'e.g. Budget constraints, scope changes...',
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: HenuColors.error),
            onPressed: () async {
              final reason = reasonController.text.trim();
              if (reason.isEmpty) return;
              Navigator.of(ctx).pop();
              setState(() => _isProcessing = true);
              final res = await QuotesRepository.instance.rejectQuote(_currentQuote.id, reason: reason);
              setState(() => _isProcessing = false);
              if (res.success && res.data != null) {
                setState(() => _currentQuote = res.data!);
                widget.onStatusChanged?.call();
              }
            },
            child: const Text('Decline Quote'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: HenuColors.surfaceFolio,
      appBar: AppBar(
        title: Text(_currentQuote.quoteNumber),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Status & Summary Card
            HenuCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      HenuBadge.status(_currentQuote.status),
                      Text(
                        'Valid until ${HenuFormatters.formatDate(_currentQuote.validUntil)}',
                        style: HenuTypography.caption,
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text(_currentQuote.title, style: HenuTypography.headlineSmall),
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: const BoxDecoration(
                      color: HenuColors.surfaceContainerLow,
                      borderRadius: HenuSpacing.roundedMd,
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Total Proposed Amount', style: HenuTypography.captionBold),
                        Text(
                          HenuFormatters.currency(_currentQuote.totalAmount),
                          style: HenuTypography.titleMedium.copyWith(color: HenuColors.primary, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Line Items Section
            Text('SCOPE & DELIVERABLES', style: HenuTypography.captionBold.copyWith(color: HenuColors.outline, letterSpacing: 0.8)),
            const SizedBox(height: 8),
            ..._currentQuote.items.map((item) => Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: HenuCard(
                    padding: const EdgeInsets.all(14),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Expanded(child: Text(item.title, style: HenuTypography.labelMedium)),
                            Text(HenuFormatters.currency(item.total), style: HenuTypography.labelMedium.copyWith(color: HenuColors.onSurface)),
                          ],
                        ),
                        if (item.description.isNotEmpty) ...[
                          const SizedBox(height: 4),
                          Text(item.description, style: HenuTypography.bodyMedium.copyWith(fontSize: 13)),
                        ],
                      ],
                    ),
                  ),
                )),

            const SizedBox(height: 16),

            // Pricing Summary Card
            HenuCard(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  _SummaryRow(label: 'Subtotal', value: HenuFormatters.currency(_currentQuote.subtotal)),
                  const SizedBox(height: 6),
                  if (_currentQuote.discount > 0) ...[
                    _SummaryRow(label: 'Special Discount', value: '-${HenuFormatters.currency(_currentQuote.discount)}', isHighlight: true),
                    const SizedBox(height: 6),
                  ],
                  _SummaryRow(label: 'Tax (18% GST / VAT)', value: HenuFormatters.currency(_currentQuote.tax)),
                  const Padding(
                    padding: EdgeInsets.symmetric(vertical: 8),
                    child: Divider(),
                  ),
                  _SummaryRow(
                    label: 'Total Net Value',
                    value: HenuFormatters.currency(_currentQuote.totalAmount),
                    isBold: true,
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Actions if Actionable
            if (_currentQuote.isActionable) ...[
              HenuButton(
                text: 'Approve & Sign Agreement',
                icon: Icons.check_circle_outline,
                isLoading: _isProcessing,
                onPressed: _showApprovalDialog,
              ),
              const SizedBox(height: 10),
              HenuButton(
                text: 'Request Changes / Decline',
                variant: HenuButtonVariant.outline,
                onPressed: _showRejectionDialog,
              ),
            ] else if (_currentQuote.isApproved) ...[
              Container(
                padding: const EdgeInsets.all(14),
                decoration: const BoxDecoration(
                  color: HenuColors.successContainer,
                  borderRadius: HenuSpacing.roundedMd,
                ),
                child: const Row(
                  children: [
                    Icon(Icons.verified, color: HenuColors.successGreen, size: 20),
                    SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        'Quote approved. Order conversion and staging deployment are active.',
                        style: TextStyle(color: HenuColors.successGreen, fontSize: 13, fontWeight: FontWeight.w600),
                      ),
                    ),
                  ],
                ),
              ),
            ],
            const SizedBox(height: 32),
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
  final bool isHighlight;

  const _SummaryRow({
    required this.label,
    required this.value,
    this.isBold = false,
    this.isHighlight = false,
  });

  @override
  Widget build(BuildContext context) {
    final style = isBold
        ? HenuTypography.titleMedium.copyWith(fontWeight: FontWeight.bold)
        : HenuTypography.bodyMedium.copyWith(
            color: isHighlight ? HenuColors.secondary : HenuColors.onSurfaceVariant,
            fontWeight: isHighlight ? FontWeight.w600 : FontWeight.w400,
          );

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(label, style: style),
        Text(value, style: style),
      ],
    );
  }
}
