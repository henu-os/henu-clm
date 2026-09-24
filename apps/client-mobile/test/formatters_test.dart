import 'package:flutter_test/flutter_test.dart';
import 'package:client_mobile/core/utils/formatters.dart';

void main() {
  group('HenuFormatters Tests', () {
    test('formats standard currency correctly', () {
      expect(HenuFormatters.currency(12500), '\$12,500');
      expect(HenuFormatters.currency(48250.50), '\$48,250.50');
      expect(HenuFormatters.currency(0), '\$0');
      expect(HenuFormatters.currency(-500), '-\$500');
    });

    test('formats compact currency correctly', () {
      expect(HenuFormatters.compactCurrency(1200), '\$1.2k');
      expect(HenuFormatters.compactCurrency(1500000), '\$1.5M');
      expect(HenuFormatters.compactCurrency(450), '\$450');
    });

    test('formats dates correctly', () {
      final date = DateTime(2026, 5, 20);
      expect(HenuFormatters.formatDate(date), 'May 20, 2026');
    });

    test('formats relative time correctly', () {
      final now = DateTime.now();
      expect(HenuFormatters.formatRelativeTime(now.subtract(const Duration(seconds: 10))), 'Just now');
      expect(HenuFormatters.formatRelativeTime(now.subtract(const Duration(minutes: 5))), '5m ago');
      expect(HenuFormatters.formatRelativeTime(now.subtract(const Duration(hours: 3))), '3h ago');
      expect(HenuFormatters.formatRelativeTime(now.subtract(const Duration(days: 2))), '2d ago');
    });
  });
}
