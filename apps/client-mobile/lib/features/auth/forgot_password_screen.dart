import 'package:flutter/material.dart';
import '../../core/constants/henu_colors.dart';
import '../../core/constants/henu_spacing.dart';
import '../../core/constants/henu_typography.dart';
import '../../shared/widgets/henu_button.dart';
import '../../shared/widgets/henu_input.dart';
import 'auth_repository.dart';
import 'reset_password_screen.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final _emailController = TextEditingController(text: 'siddharth@folio.enterprise');
  bool _isLoading = false;
  bool _isSent = false;
  String? _errorMessage;

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  Future<void> _handleSendReset() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    final res = await AuthRepository.instance.sendPasswordResetEmail(_emailController.text);

    if (!mounted) return;

    if (res.success) {
      setState(() {
        _isLoading = false;
        _isSent = true;
      });
    } else {
      setState(() {
        _isLoading = false;
        _errorMessage = res.errorMessage ?? 'Failed to send recovery instructions.';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: HenuColors.surfaceFolio,
      appBar: AppBar(
        title: const Text('Password Recovery'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.of(context).pop(),
        ),
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
                child: _isSent
                    ? Column(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        children: [
                          Container(
                            width: 56,
                            height: 56,
                            decoration: const BoxDecoration(
                              color: HenuColors.successContainer,
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(Icons.mark_email_read, color: HenuColors.successGreen, size: 28),
                          ),
                          const SizedBox(height: 16),
                          const Text('Recovery Email Dispatched', style: HenuTypography.titleMedium, textAlign: TextAlign.center),
                          const SizedBox(height: 8),
                          Text(
                            'We sent password reset instructions to ${_emailController.text}. Please check your inbox.',
                            style: HenuTypography.bodyMedium,
                            textAlign: TextAlign.center,
                          ),
                          const SizedBox(height: 24),
                          HenuButton(
                            text: 'Enter Verification Code',
                            onPressed: () {
                              Navigator.of(context).pushReplacement(
                                MaterialPageRoute(builder: (_) => const ResetPasswordScreen()),
                              );
                            },
                          ),
                          const SizedBox(height: 12),
                          TextButton(
                            onPressed: () => Navigator.of(context).pop(),
                            child: const Text('Return to Sign In', style: HenuTypography.captionBold),
                          ),
                        ],
                      )
                    : Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Reset your password', style: HenuTypography.headlineSmall),
                          const SizedBox(height: 6),
                          const Text(
                            'Enter your verified enterprise work email and we will dispatch a secure recovery token.',
                            style: HenuTypography.bodyMedium,
                          ),
                          if (_errorMessage != null) ...[
                            const SizedBox(height: 16),
                            Text(_errorMessage!, style: HenuTypography.caption.copyWith(color: HenuColors.error)),
                          ],
                          const SizedBox(height: 20),
                          HenuInput(
                            label: 'Work Email',
                            hint: 'name@organization.com',
                            controller: _emailController,
                            keyboardType: TextInputType.emailAddress,
                          ),
                          const SizedBox(height: 24),
                          HenuButton(
                            text: 'Send Recovery Link',
                            icon: Icons.send_outlined,
                            isLoading: _isLoading,
                            onPressed: _handleSendReset,
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
