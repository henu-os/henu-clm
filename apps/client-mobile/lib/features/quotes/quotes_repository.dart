import '../../core/network/api_response.dart';
import '../../shared/models/quote_item.dart';

class QuotesRepository {
  static final QuotesRepository instance = QuotesRepository._();
  QuotesRepository._();

  final List<QuoteItem> _quotes = [
    QuoteItem(
      id: 'qt_104',
      quoteNumber: 'QT-2026-0104',
      title: 'Enterprise Architecture & Cloud Optimization',
      status: 'PENDING_APPROVAL',
      subtotal: 32000,
      tax: 5760,
      discount: 2000,
      totalAmount: 35760,
      currency: 'USD',
      validUntil: DateTime(2026, 6, 15),
      createdAt: DateTime(2026, 5, 2),
      items: const [
        QuoteLineItem(
          title: 'Cloud Architecture & Multi-tenant DB Design',
          description: 'High availability clustering & automated replication configuration',
          quantity: 1,
          unitPrice: 18000,
          total: 18000,
        ),
        QuoteLineItem(
          title: 'Zero-Trust Security & RBAC Matrix Audit',
          description: 'SOC2 Type II validation and penetration test compliance',
          quantity: 1,
          unitPrice: 14000,
          total: 14000,
        ),
      ],
    ),
    QuoteItem(
      id: 'qt_103',
      quoteNumber: 'QT-2026-0098',
      title: 'Mobile App Custom Development - Phase 1',
      status: 'APPROVED',
      subtotal: 24000,
      tax: 4320,
      discount: 0,
      totalAmount: 28320,
      currency: 'USD',
      validUntil: DateTime(2026, 5, 1),
      createdAt: DateTime(2026, 4, 10),
      items: const [
        QuoteLineItem(
          title: 'Cross-platform Mobile UI/UX Design System',
          description: 'Stitch tokens and interactive component library',
          quantity: 1,
          unitPrice: 10000,
          total: 10000,
        ),
        QuoteLineItem(
          title: 'Flutter Native Core Implementation',
          description: 'Offline sync, Biometric authentication, and state management',
          quantity: 1,
          unitPrice: 14000,
          total: 14000,
        ),
      ],
    ),
    QuoteItem(
      id: 'qt_102',
      quoteNumber: 'QT-2026-0082',
      title: 'AI Workflow Integration Suite',
      status: 'REJECTED',
      subtotal: 15000,
      tax: 2700,
      discount: 0,
      totalAmount: 17700,
      currency: 'USD',
      validUntil: DateTime(2026, 4, 15),
      createdAt: DateTime(2026, 3, 20),
      rejectionReason: 'Scope adjusted to prioritize Mobile App Sprint 1',
      items: const [
        QuoteLineItem(
          title: 'LLM Orchestration & Context Window Tuning',
          description: 'Server-side edge functions with OpenAI/Anthropic models',
          quantity: 1,
          unitPrice: 15000,
          total: 15000,
        ),
      ],
    ),
  ];

  Future<ApiResponse<List<QuoteItem>>> getQuotes() async {
    await Future.delayed(const Duration(milliseconds: 300));
    return ApiResponse.success(List.unmodifiable(_quotes));
  }

  Future<ApiResponse<QuoteItem>> approveQuote(String quoteId, {required String signatoryName}) async {
    await Future.delayed(const Duration(milliseconds: 600));
    final index = _quotes.indexWhere((q) => q.id == quoteId);
    if (index == -1) return const ApiResponse.error('Quote not found.');

    final current = _quotes[index];
    final updated = QuoteItem(
      id: current.id,
      quoteNumber: current.quoteNumber,
      title: current.title,
      status: 'APPROVED',
      subtotal: current.subtotal,
      tax: current.tax,
      discount: current.discount,
      totalAmount: current.totalAmount,
      currency: current.currency,
      validUntil: current.validUntil,
      createdAt: current.createdAt,
      items: current.items,
    );
    _quotes[index] = updated;
    return ApiResponse.success(updated);
  }

  Future<ApiResponse<QuoteItem>> rejectQuote(String quoteId, {required String reason}) async {
    await Future.delayed(const Duration(milliseconds: 600));
    final index = _quotes.indexWhere((q) => q.id == quoteId);
    if (index == -1) return const ApiResponse.error('Quote not found.');

    final current = _quotes[index];
    final updated = QuoteItem(
      id: current.id,
      quoteNumber: current.quoteNumber,
      title: current.title,
      status: 'REJECTED',
      subtotal: current.subtotal,
      tax: current.tax,
      discount: current.discount,
      totalAmount: current.totalAmount,
      currency: current.currency,
      validUntil: current.validUntil,
      createdAt: current.createdAt,
      items: current.items,
      rejectionReason: reason,
    );
    _quotes[index] = updated;
    return ApiResponse.success(updated);
  }
}
