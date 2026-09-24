import 'package:flutter_test/flutter_test.dart';
import 'package:client_mobile/shared/models/client_profile.dart';
import 'package:client_mobile/shared/models/invoice_item.dart';
import 'package:client_mobile/shared/models/order_item.dart';
import 'package:client_mobile/shared/models/quote_item.dart';

void main() {
  group('Model Parsing Tests', () {
    test('ClientProfile parses from JSON', () {
      final json = {
        'id': 'usr_1',
        'client_id': 'HENU-CL-2026-000001',
        'full_name': 'Siddharth Rao',
        'company_name': 'Aero Dynamics',
        'email': 'siddharth@folio.enterprise',
        'phone': '+15550192834',
        'status': 'ACTIVE',
        'tier': 'Enterprise VIP',
        'created_at': '2026-01-15T00:00:00Z',
      };
      final profile = ClientProfile.fromJson(json);
      expect(profile.id, 'usr_1');
      expect(profile.clientId, 'HENU-CL-2026-000001');
      expect(profile.tier, 'Enterprise VIP');
    });

    test('QuoteItem parses from JSON with line items', () {
      final json = {
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
      };
      final quote = QuoteItem.fromJson(json);
      expect(quote.quoteNumber, 'QT-2026-0104');
      expect(quote.isActionable, isTrue);
      expect(quote.items.length, 1);
      expect(quote.items.first.title, 'Cloud Architecture');
    });

    test('InvoiceItem calculates payable state correctly', () {
      final payable = InvoiceItem.fromJson({
        'id': 'inv_1',
        'invoice_number': 'INV-2026-089',
        'status': 'SENT',
        'total_amount': 12500.0,
        'balance_due': 12500.0,
      });
      expect(payable.isPayable, isTrue);
      expect(payable.isPaid, isFalse);

      final paid = InvoiceItem.fromJson({
        'id': 'inv_2',
        'invoice_number': 'INV-2026-081',
        'status': 'PAID',
        'total_amount': 14000.0,
        'balance_due': 0.0,
      });
      expect(paid.isPayable, isFalse);
      expect(paid.isPaid, isTrue);
    });

    test('OrderItem parses milestones correctly', () {
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
      expect(order.progressPercent, 72);
      expect(order.milestones.length, 2);
      expect(order.milestones.first.isCompleted, isTrue);
    });
  });
}
