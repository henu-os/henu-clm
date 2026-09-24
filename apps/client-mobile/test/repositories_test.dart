import 'package:flutter_test/flutter_test.dart';
import 'package:client_mobile/features/auth/auth_repository.dart';
import 'package:client_mobile/features/home/home_repository.dart';
import 'package:client_mobile/features/invoices/invoices_repository.dart';
import 'package:client_mobile/features/quotes/quotes_repository.dart';
import 'package:client_mobile/features/support/support_repository.dart';

void main() {
  group('Repository Integration Tests', () {
    test('AuthRepository authenticates valid credentials', () async {
      final res = await AuthRepository.instance.login(
        email: 'siddharth@folio.enterprise',
        password: 'Password123!',
      );
      expect(res.success, isTrue);
      expect(res.data?.email, 'siddharth@folio.enterprise');
    });

    test('AuthRepository rejects invalid email', () async {
      final res = await AuthRepository.instance.login(
        email: 'invalid-email',
        password: 'Password123!',
      );
      expect(res.success, isFalse);
    });

    test('HomeRepository fetches complete dashboard data structure', () async {
      final res = await HomeRepository.instance.fetchDashboard();
      expect(res.success, isTrue);
      expect(res.data?.clientId, 'HENU-CL-2026-000001');
      expect(res.data?.totalInvoiced, 48250);
      expect(res.data?.activityLogs.length, 3);
    });

    test('QuotesRepository approves quote and updates state', () async {
      final res = await QuotesRepository.instance.approveQuote(
        'qt_104',
        signatoryName: 'Siddharth Rao',
      );
      expect(res.success, isTrue);
      expect(res.data?.status, 'APPROVED');
    });

    test('InvoicesRepository completes mock payment and reconciles', () async {
      final res = await InvoicesRepository.instance.recordMockPayment('inv_089');
      expect(res.success, isTrue);
      expect(res.data?.status, 'PAID');
      expect(res.data?.balanceDue, 0.0);
    });

    test('SupportRepository sends message to thread', () async {
      final res = await SupportRepository.instance.sendMessage('sup_001', 'Test reply from client');
      expect(res.success, isTrue);
      expect(res.data?.content, 'Test reply from client');
      expect(res.data?.isClient, isTrue);
    });
  });
}
