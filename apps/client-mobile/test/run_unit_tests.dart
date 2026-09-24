import 'package:client_mobile/core/security/security_service.dart';
import 'package:client_mobile/core/utils/formatters.dart';
import 'package:client_mobile/features/auth/auth_repository.dart';
import 'package:client_mobile/features/catalog/catalog_repository.dart';
import 'package:client_mobile/features/home/home_repository.dart';
import 'package:client_mobile/features/invoices/invoices_repository.dart';
import 'package:client_mobile/features/orders/orders_repository.dart';
import 'package:client_mobile/features/quotes/quotes_repository.dart';
import 'package:client_mobile/features/support/support_repository.dart';
import 'package:client_mobile/shared/models/client_profile.dart';
import 'package:client_mobile/shared/models/invoice_item.dart';
import 'package:client_mobile/shared/models/order_item.dart';
import 'package:client_mobile/shared/models/quote_item.dart';

void assertTrue(bool condition, String message) {
  if (!condition) {
    throw Exception('Assertion failed: $message');
  }
}

void assertEquals(dynamic actual, dynamic expected, String message) {
  if (actual != expected) {
    throw Exception('Assertion failed [$message]: expected "$expected", but got "$actual"');
  }
}

Future<void> main() async {
  print('=====================================================');
  print('HENU OS CLM — CLIENT MOBILE AUTOMATED TEST SUITE');
  print('=====================================================\n');

  int totalTests = 0;
  int passedTests = 0;

  void runTest(String name, void Function() testFn) {
    totalTests++;
    try {
      testFn();
      passedTests++;
      print('  [PASS] $name');
    } catch (e) {
      print('  [FAIL] $name: $e');
    }
  }

  Future<void> runAsyncTest(String name, Future<void> Function() testFn) async {
    totalTests++;
    try {
      await testFn();
      passedTests++;
      print('  [PASS] $name');
    } catch (e) {
      print('  [FAIL] $name: $e');
    }
  }

  print('1. Formatting Utilities:');
  runTest('Currency formatting standard and negative', () {
    assertEquals(HenuFormatters.currency(12500), '\$12,500', '12500 currency');
    assertEquals(HenuFormatters.currency(48250.50), '\$48,250.50', '48250.50 currency');
    assertEquals(HenuFormatters.currency(0), '\$0', '0 currency');
    assertEquals(HenuFormatters.currency(-500), '-\$500', '-500 currency');
  });

  runTest('Compact currency formatting', () {
    assertEquals(HenuFormatters.compactCurrency(1200), '\$1.2k', '1200 compact');
    assertEquals(HenuFormatters.compactCurrency(1500000), '\$1.5M', '1.5M compact');
  });

  runTest('Date formatting', () {
    final date = DateTime(2026, 5, 20);
    assertEquals(HenuFormatters.formatDate(date), 'May 20, 2026', 'May 20 date');
  });

  runTest('Relative time formatting', () {
    final now = DateTime.now();
    assertEquals(HenuFormatters.formatRelativeTime(now.subtract(const Duration(seconds: 10))), 'Just now', 'just now');
    assertEquals(HenuFormatters.formatRelativeTime(now.subtract(const Duration(minutes: 5))), '5m ago', '5m ago');
    assertEquals(HenuFormatters.formatRelativeTime(now.subtract(const Duration(hours: 3))), '3h ago', '3h ago');
    assertEquals(HenuFormatters.formatRelativeTime(now.subtract(const Duration(days: 2))), '2d ago', '2d ago');
  });

  print('\n2. Security & Token Isolation:');
  runTest('Sensitive string masking', () {
    assertEquals(SecurityService.maskString('pay_rzp_live_938174829'), '••••••••4829', 'mask transaction');
    assertEquals(SecurityService.maskString('1234'), '••••1234', 'mask short');
    assertEquals(SecurityService.maskString(''), '••••', 'mask empty');
  });

  runTest('Session lifecycle state management', () {
    final security = SecurityService.instance;
    security.clearSession();
    assertTrue(!security.hasValidSession, 'Initial session is false');

    security.saveSession(token: 'clm_token_test_abc', userId: 'usr_001');
    assertTrue(security.hasValidSession, 'Session valid after save');
    assertEquals(security.currentUserId, 'usr_001', 'User ID matches');

    security.clearSession();
    assertTrue(!security.hasValidSession, 'Session cleared');
  });

  print('\n3. Model Serialization & Logic:');
  runTest('ClientProfile JSON parsing', () {
    final profile = ClientProfile.fromJson({
      'id': 'usr_1',
      'client_id': 'HENU-CL-2026-000001',
      'full_name': 'Siddharth Rao',
      'company_name': 'Aero Dynamics',
      'email': 'siddharth@folio.enterprise',
      'phone': '+15550192834',
      'status': 'ACTIVE',
      'tier': 'Enterprise VIP',
      'created_at': '2026-01-15T00:00:00Z',
    });
    assertEquals(profile.id, 'usr_1', 'profile id');
    assertEquals(profile.clientId, 'HENU-CL-2026-000001', 'client id');
    assertEquals(profile.tier, 'Enterprise VIP', 'tier');
  });

  runTest('QuoteItem line item calculations & status', () {
    final quote = QuoteItem.fromJson({
      'id': 'qt_1',
      'quote_number': 'QT-2026-0104',
      'title': 'Enterprise Architecture',
      'status': 'PENDING_APPROVAL',
      'subtotal': 32000.0,
      'tax': 5760.0,
      'discount': 2000.0,
      'total_amount': 35760.0,
      'currency': 'USD',
      'valid_until': '2026-06-15T00:00:00Z',
      'created_at': '2026-05-02T00:00:00Z',
      'items': [
        {
          'title': 'Cloud Architecture',
          'description': 'HA clustering',
          'quantity': 1,
          'unit_price': 18000.0,
          'total': 18000.0,
        }
      ],
    });
    assertEquals(quote.quoteNumber, 'QT-2026-0104', 'quote number');
    assertTrue(quote.isActionable, 'quote is actionable');
    assertEquals(quote.items.length, 1, 'items count');
    assertEquals(quote.items.first.title, 'Cloud Architecture', 'line item title');
  });

  runTest('InvoiceItem payable vs paid status computation', () {
    final payable = InvoiceItem.fromJson({
      'id': 'inv_1',
      'invoice_number': 'INV-2026-089',
      'status': 'SENT',
      'total_amount': 12500.0,
      'balance_due': 12500.0,
    });
    assertTrue(payable.isPayable, 'payable is true');
    assertTrue(!payable.isPaid, 'paid is false');

    final paid = InvoiceItem.fromJson({
      'id': 'inv_2',
      'invoice_number': 'INV-2026-081',
      'status': 'PAID',
      'total_amount': 14000.0,
      'balance_due': 0.0,
    });
    assertTrue(!paid.isPayable, 'payable is false');
    assertTrue(paid.isPaid, 'paid is true');
  });

  runTest('OrderItem milestones progression parsing', () {
    final order = OrderItem.fromJson({
      'id': 'ord_1',
      'order_number': 'ORD-2026-0042',
      'title': 'Platform Transformation',
      'status': 'IN_PROGRESS',
      'progress_percent': 72,
      'milestones': [
        {'title': 'Discovery', 'status': 'COMPLETED', 'is_completed': true},
        {'title': 'Staging', 'status': 'IN_PROGRESS', 'is_completed': false},
      ],
    });
    assertEquals(order.progressPercent, 72, 'progress percent');
    assertEquals(order.milestones.length, 2, 'milestones count');
    assertTrue(order.milestones.first.isCompleted, 'first milestone is completed');
  });

  print('\n4. Repository & Service Integration:');
  await runAsyncTest('AuthRepository login success', () async {
    final res = await AuthRepository.instance.login(
      email: 'siddharth@folio.enterprise',
      password: 'Password123!',
    );
    assertTrue(res.success, 'Login success is true');
    assertEquals(res.data?.email, 'siddharth@folio.enterprise', 'Login email');
  });

  await runAsyncTest('AuthRepository login invalid validation', () async {
    final res = await AuthRepository.instance.login(
      email: 'not-an-email',
      password: '123',
    );
    assertTrue(!res.success, 'Login should fail for invalid email');
  });

  await runAsyncTest('HomeRepository dashboard fetch', () async {
    final res = await HomeRepository.instance.fetchDashboard();
    assertTrue(res.success, 'Dashboard fetch is true');
    assertEquals(res.data?.clientId, 'HENU-CL-2026-000001', 'Dashboard Client ID');
    assertEquals(res.data?.totalInvoiced, 48250.0, 'Dashboard total invoiced');
    assertEquals(res.data?.activityLogs.length, 3, 'Activity logs count');
  });

  await runAsyncTest('QuotesRepository approval workflow', () async {
    final res = await QuotesRepository.instance.approveQuote(
      'qt_104',
      signatoryName: 'Siddharth Rao',
    );
    assertTrue(res.success, 'Quote approval success');
    assertEquals(res.data?.status, 'APPROVED', 'Quote status is APPROVED');
  });

  await runAsyncTest('QuotesRepository rejection workflow with reason validation', () async {
    final res = await QuotesRepository.instance.rejectQuote(
      'qt_104',
      reason: 'Scope adjustments required for phase 2 timeline',
    );
    assertTrue(res.success, 'Quote rejection success');
    assertEquals(res.data?.status, 'REJECTED', 'Quote status is REJECTED');
  });

  await runAsyncTest('InvoicesRepository payment settlement', () async {
    final res = await InvoicesRepository.instance.recordMockPayment('inv_089');
    assertTrue(res.success, 'Payment settlement success');
    assertEquals(res.data?.status, 'PAID', 'Invoice status is PAID');
    assertEquals(res.data?.balanceDue, 0.0, 'Balance due is 0');
  });

  await runAsyncTest('CatalogRepository filtered services', () async {
    final res = await CatalogRepository.instance.getServices(category: 'ADVISORY');
    assertTrue(res.success, 'Catalog fetch is true');
    assertEquals(res.data?.length, 1, 'Advisory service count');
    assertEquals(res.data?.first.code, 'ARCH-ADV-01', 'Service code');
  });

  await runAsyncTest('SupportRepository message dispatch', () async {
    final res = await SupportRepository.instance.sendMessage('sup_001', 'Webhook signature verified.');
    assertTrue(res.success, 'Support message sent');
    assertEquals(res.data?.content, 'Webhook signature verified.', 'Message content');
    assertTrue(res.data?.isClient ?? false, 'Sender is client');
  });

  print('\n=====================================================');
  print('TEST SUMMARY: $passedTests / $totalTests PASSED');
  print('=====================================================');

  if (passedTests != totalTests) {
    throw Exception('Some tests failed.');
  }
}
