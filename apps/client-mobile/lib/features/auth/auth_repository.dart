import 'dart:async';
import '../../core/network/api_response.dart';
import '../../core/security/security_service.dart';
import '../../shared/models/client_profile.dart';

class AuthRepository {
  static final AuthRepository instance = AuthRepository._();
  AuthRepository._();

  final ClientProfile _currentProfile = ClientProfile(
    id: 'usr_clm_client_001',
    clientId: 'HENU-CL-2026-000001',
    fullName: 'Siddharth Rao',
    companyName: 'Aero Dynamics Global',
    email: 'siddharth@folio.enterprise',
    phone: '+1 (555) 019-2834',
    status: 'ACTIVE',
    tier: 'Enterprise VIP',
    createdAt: DateTime(2026, 1, 15),
  );

  ClientProfile? get currentProfile => _currentProfile;

  Future<ApiResponse<ClientProfile>> login({
    required String email,
    required String password,
  }) async {
    await Future.delayed(const Duration(milliseconds: 600));

    if (email.trim().isEmpty || password.isEmpty) {
      return const ApiResponse.error('Email and password are required.');
    }

    if (!email.contains('@')) {
      return const ApiResponse.error('Please enter a valid work email address.');
    }

    if (password.length < 6) {
      return const ApiResponse.error('Password must be at least 6 characters.');
    }

    // Authenticate & save secure session token
    SecurityService.instance.saveSession(
      token: 'clm_secure_client_token_${DateTime.now().millisecondsSinceEpoch}',
      userId: _currentProfile.id,
    );

    return ApiResponse.success(_currentProfile);
  }

  Future<ApiResponse<bool>> sendPasswordResetEmail(String email) async {
    await Future.delayed(const Duration(milliseconds: 500));
    if (email.trim().isEmpty || !email.contains('@')) {
      return const ApiResponse.error('Please enter a valid email address.');
    }
    return const ApiResponse.success(true);
  }

  Future<ApiResponse<bool>> resetPassword({
    required String newPassword,
    required String confirmPassword,
  }) async {
    await Future.delayed(const Duration(milliseconds: 500));
    if (newPassword != confirmPassword) {
      return const ApiResponse.error('Passwords do not match.');
    }
    if (newPassword.length < 8) {
      return const ApiResponse.error('Password must be at least 8 characters long.');
    }
    return const ApiResponse.success(true);
  }

  Future<void> logout() async {
    await Future.delayed(const Duration(milliseconds: 200));
    SecurityService.instance.clearSession();
  }
}
