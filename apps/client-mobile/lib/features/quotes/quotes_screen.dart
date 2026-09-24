import 'package:flutter/material.dart';
import '../../core/constants/henu_colors.dart';
import '../../core/constants/henu_typography.dart';
import '../../core/utils/formatters.dart';
import '../../shared/models/quote_item.dart';
import '../../shared/widgets/henu_badge.dart';
import '../../shared/widgets/henu_card.dart';
import '../../shared/widgets/state_views.dart';
import 'quote_detail_screen.dart';
import 'quotes_repository.dart';

class QuotesScreen extends StatefulWidget {
  const QuotesScreen({super.key});

  @override
  State<QuotesScreen> createState() => _QuotesScreenState();
}

class _QuotesScreenState extends State<QuotesScreen> {
  bool _isLoading = true;
  List<QuoteItem> _quotes = [];
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _loadQuotes();
  }

  Future<void> _loadQuotes() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    final res = await QuotesRepository.instance.getQuotes();
    if (!mounted) return;

    if (res.success && res.data != null) {
      setState(() {
        _quotes = res.data!;
        _isLoading = false;
      });
    } else {
      setState(() {
        _errorMessage = res.errorMessage ?? 'Failed to load quotes.';
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
            SizedBox(height: 12),
            SkeletonCard(height: 120),
          ],
        ),
      );
    }

    if (_errorMessage != null) {
      return ErrorStateView(
        message: _errorMessage!,
        onRetry: _loadQuotes,
      );
    }

    if (_quotes.isEmpty) {
      return const EmptyStateView(
        title: 'No Quotes Available',
        description: 'You currently have no active or historical quote proposals.',
        icon: Icons.request_quote_outlined,
      );
    }

    return RefreshIndicator(
      onRefresh: _loadQuotes,
      color: HenuColors.primary,
      child: ListView.separated(
        padding: const EdgeInsets.all(16),
        itemCount: _quotes.length,
        separatorBuilder: (_, __) => const SizedBox(height: 12),
        itemBuilder: (context, index) {
          final quote = _quotes[index];
          return HenuCard(
            onTap: () {
              Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (_) => QuoteDetailScreen(
                    quote: quote,
                    onStatusChanged: _loadQuotes,
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
                    Text(quote.quoteNumber, style: HenuTypography.captionBold),
                    HenuBadge.status(quote.status),
                  ],
                ),
                const SizedBox(height: 8),
                Text(quote.title, style: HenuTypography.labelMedium),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Valid: ${HenuFormatters.formatDate(quote.validUntil)}',
                      style: HenuTypography.caption,
                    ),
                    Text(
                      HenuFormatters.currency(quote.totalAmount),
                      style: HenuTypography.titleMedium.copyWith(color: HenuColors.primary, fontWeight: FontWeight.bold),
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
