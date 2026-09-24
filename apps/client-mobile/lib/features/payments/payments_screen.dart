import 'package:flutter/material.dart';
import '../../core/constants/henu_colors.dart';
import '../../core/constants/henu_typography.dart';
import '../../core/security/security_service.dart';
import '../../core/utils/formatters.dart';
import '../../shared/models/payment_item.dart';
import '../../shared/widgets/henu_badge.dart';
import '../../shared/widgets/henu_card.dart';
import '../../shared/widgets/state_views.dart';
import 'payments_repository.dart';

class PaymentsScreen extends StatefulWidget {
  const PaymentsScreen({super.key});

  @override
  State<PaymentsScreen> createState() => _PaymentsScreenState();
}

class _PaymentsScreenState extends State<PaymentsScreen> {
  bool _isLoading = true;
  List<PaymentItem> _payments = [];
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadPayments();
  }

  Future<void> _loadPayments() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    final res = await PaymentsRepository.instance.getPayments();
    if (!mounted) return;

    if (res.success && res.data != null) {
      setState(() {
        _payments = res.data!;
        _isLoading = false;
      });
    } else {
      setState(() {
        _errorMessage = res.errorMessage ?? 'Failed to load payments.';
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
            SkeletonCard(height: 100),
            SizedBox(height: 12),
            SkeletonCard(height: 100),
          ],
        ),
      );
    }

    if (_errorMessage != null) {
      return ErrorStateView(message: _errorMessage!, onRetry: _loadPayments);
    }

    if (_payments.isEmpty) {
      return const EmptyStateView(
        title: 'No Transactions',
        description: 'You have no completed payment ledger records.',
        icon: Icons.credit_card_outlined,
      );
    }

    return RefreshIndicator(
      onRefresh: _loadPayments,
      color: HenuColors.primary,
      child: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: _payments.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          final payment = _payments[index];
          return HenuCard(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(payment.paymentNumber, style: HenuTypography.captionBold),
                    HenuBadge.status(payment.status),
                  ],
                ),
                const SizedBox(height: 8),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Invoice: ${payment.invoiceNumber}', style: HenuTypography.labelMedium),
                    Text(
                      HenuFormatters.currency(payment.amount),
                      style: HenuTypography.titleMedium.copyWith(color: HenuColors.successGreen, fontWeight: FontWeight.bold),
                    ),
                  ],
                ),
                const SizedBox(height: 10),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.shield_outlined, size: 14, color: HenuColors.secondary),
                        const SizedBox(width: 4),
                        Text(
                          '${payment.gateway} · ${SecurityService.maskString(payment.gatewayTransactionId)}',
                          style: HenuTypography.caption,
                        ),
                      ],
                    ),
                    Text(HenuFormatters.formatDate(payment.createdAt), style: HenuTypography.caption),
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
