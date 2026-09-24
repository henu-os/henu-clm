import 'package:flutter/material.dart';
import '../../core/constants/henu_colors.dart';
import '../../core/constants/henu_spacing.dart';
import '../../core/constants/henu_typography.dart';
import '../../shared/widgets/henu_button.dart';
import '../../shared/widgets/henu_input.dart';
import 'auth_repository.dart';
import 'login_screen.dart';

class ResetPasswordScreen extends StatefulWidget {
  const ResetPasswordScreen({super.key});

  @override
  State<ResetPasswordScreen> createState() => _ResetPasswordScreenState();
}

class _ResetPasswordScreenState extends State<ResetPasswordScreen> {
  final _newPasswordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  bool _isLoading = false;
  bool _isSuccess = false;
  String? _errorMessage;

  @override
  void dispose() {
    _newPasswordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  Future<void> _handleReset() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    final res = await AuthRepository.instance.resetPassword(
      newPassword: _newPasswordController.text,
      confirmPassword: _confirmPasswordController.text,
    );

    if (!mounted) return;

    if (res.success) {
      setState(() {
        _isLoading = false;
        _isSuccess = true;
      });
    } else {
      setState(() {
        _isLoading = false;
        _errorMessage = res.errorMessage ?? 'Password reset failed.';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: HenuColors.surfaceFolio,
      appBar: AppBar(
        title: const Text('Set New Password'),
      ),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: HenuSpacing.maxMobileContentWidth),
              child: Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: HenuColors.surfaceContainerLowest,
                  borderRadius: HenuSpacing.roundedXl,
                  border: Border.all(color: const Color(0x33C9C4D0)),
                  boxShadow: HenuSpacing.cardShadow,
                ),
                child: _isSuccess
                    ? Column(
                        children: [
                          Container(
                            width: 56,
                            height: 56,
                            decoration: const BoxDecoration(
                              color: HenuColors.successContainer,
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(Icons.check, color: HenuColors.successGreen, size: 28),
                          ),
                          const SizedBox(height: 16),
                          const Text('Password Updated', style: HenuTypography.titleMedium),
                          const SizedBox(height: 8),
                          const Text(
                            'Your enterprise security credentials have been updated successfully.',
                            style: HenuTypography.bodyMedium,
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 24),
                          HenuButton(
                            text: 'Sign In with New Password',
                            onPressed: () {
                              Navigator.of(context).pushAndRemoveUntil(
                                MaterialPageRoute(builder: (_) => const LoginScreen()),
                                (route) => false,
                              );
                            },
                          ),
                        ],
                      )
                    : Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Create New Password', style: HenuTypography.headlineSmall),
                          const SizedBox(height: 6),
                          const Text(
                            'Choose a strong password with at least 8 characters.',
                            style: HenuTypography.bodyMedium,
                          ),
                          if (_errorMessage != null) ...[
                            const SizedBox(height: 16),
                            Text(_errorMessage!, style: HenuTypography.caption.copyWith(color: HenuColors.error)),
                          ],
                          const SizedBox(height: 20),
                          HenuInput(
                            label: 'New Password',
                            hint: 'Enter minimum 8 characters',
                            controller: _newPasswordController,
                            obscureText: true,
                          ),
                          const SizedBox(height: 16),
                          HenuInput(
                            label: 'Confirm Password',
                            hint: 'Re-enter your password',
                            controller: _confirmPasswordController,
                            obscureText: true,
                          ),
                          const SizedBox(height: 24),
                          HenuButton(
                            text: 'Confirm & Update',
                            isLoading: _isLoading,
                            onPressed: _handleReset,
                          ),
                        ],
                      ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
