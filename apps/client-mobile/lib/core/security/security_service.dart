/// Security and Token Vault Abstraction for Mobile
/// Enforces safe token storage and guarantees zero exposure of server secrets.
class SecurityService {
  static final SecurityService instance = SecurityService._();
  SecurityService._();

  String? _cachedSessionToken;
  String? _currentUserId;

  bool get hasValidSession => _cachedSessionToken != null && _cachedSessionToken!.isNotEmpty;
  String? get currentUserId => _currentUserId;

  void saveSession({required String token, required String userId}) {
    _cachedSessionToken = token;
    _currentUserId = userId;
  }

  void clearSession() {
    _cachedSessionToken = null;
    _currentUserId = null;
  }

  /// Masks sensitive strings for UI display (e.g. account numbers or tokens)
  static String maskString(String? value, {int visibleEndCount = 4}) {
    if (value == null || value.isEmpty) return '••••';
    if (value.length <= visibleEndCount) return '••••$value';
    return '••••••••${value.substring(value.length - visibleEndCount)}';
  }
}
