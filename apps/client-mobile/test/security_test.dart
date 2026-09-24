import 'package:flutter_test/flutter_test.dart';
import 'package:client_mobile/core/security/security_service.dart';

void main() {
  group('SecurityService Tests', () {
    test('masks secret strings with only trailing characters visible', () {
      expect(SecurityService.maskString('pay_rzp_live_938174829'), '••••••••4829');
      expect(SecurityService.maskString('1234'), '••••1234');
      expect(SecurityService.maskString(''), '••••');
      expect(SecurityService.maskString(null), '••••');
    });

    test('manages session state correctly', () {
      final security = SecurityService.instance;
      expect(security.hasValidSession, isFalse);

      security.saveSession(token: 'test_token_123', userId: 'user_001');
      expect(security.hasValidSession, isTrue);
      expect(security.currentUserId, 'user_001');

      security.clearSession();
      expect(security.hasValidSession, isFalse);
      expect(security.currentUserId, isNull);
    });
  });
}
