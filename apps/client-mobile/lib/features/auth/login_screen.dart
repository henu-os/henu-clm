import 'package:flutter/material.dart';
import '../../core/constants/henu_colors.dart';
import '../../core/constants/henu_spacing.dart';
import '../../core/constants/henu_typography.dart';
import '../../shared/widgets/henu_button.dart';
import '../../shared/widgets/henu_input.dart';
import 'auth_repository.dart';
import 'forgot_password_screen.dart';
import '../home/home_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController(text: 'siddharth@folio.enterprise');
  final _passwordController = TextEditingController(text: 'Password123!');
  bool _obscurePassword = true;
  bool _isLoading = false;
  String _selectedGender = 'male'; // 'male' or 'female'
  String? _errorMessage;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _handleLogin() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    final res = await AuthRepository.instance.login(
      email: _emailController.text,
      password: _passwordController.text,
      gender: _selectedGender,
    );

    if (!mounted) return;

    if (res.success) {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (_) => const HomeScreen()),
      );
    } else {
      setState(() {
        _isLoading = false;
        _errorMessage = res.errorMessage ?? 'Authentication failed. Please verify credentials.';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final avatarAsset = _selectedGender == 'female'
        ? 'assets/images/femaldp.png'
        : 'assets/images/maledp.png';

    return Scaffold(
      backgroundColor: HenuColors.surfaceFolio,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: HenuSpacing.maxMobileContentWidth),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Minimal Brand Security Header Pill
                  Center(
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                      decoration: BoxDecoration(
                        color: HenuColors.surfaceContainerLowest,
                        borderRadius: HenuSpacing.roundedFull,
                        border: Border.all(color: const Color(0x33C9C4D0)),
                        boxShadow: HenuSpacing.cardShadow,
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(
                            width: 6,
                            height: 6,
                            decoration: const BoxDecoration(
                              color: HenuColors.secondary,
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 8),
                          const Text('HENU OS', style: HenuTypography.captionBold),
                          const SizedBox(width: 4),
                          const Text('/', style: TextStyle(color: HenuColors.outline, fontSize: 12)),
                          const SizedBox(width: 4),
                          Text('CLM Enterprise', style: HenuTypography.caption.copyWith(color: HenuColors.onSurfaceVariant)),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Hero Card Enclosure matching Stitch
                  Container(
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      color: HenuColors.surfaceContainerLowest,
                      borderRadius: HenuSpacing.roundedXl,
                      border: Border.all(color: const Color(0x33C9C4D0)),
                      boxShadow: HenuSpacing.cardShadow,
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Dynamic Avatar DP Preview Based on Gender
                        Center(
                          child: Column(
                            children: [
                              Container(
                                width: 72,
                                height: 72,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  border: Border.all(color: HenuColors.primary, width: 2),
                                  boxShadow: HenuSpacing.cardShadow,
                                ),
                                child: ClipOval(
                                  child: Image.asset(
                                    avatarAsset,
                                    fit: BoxFit.cover,
                                    errorBuilder: (context, error, stackTrace) => Container(
                                      color: HenuColors.surfaceContainerHigh,
                                      child: Icon(
                                        _selectedGender == 'female' ? Icons.woman : Icons.man,
                                        size: 40,
                                        color: HenuColors.primary,
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(
                                _selectedGender == 'female' ? 'Client Profile: Female' : 'Client Profile: Male',
                                style: HenuTypography.captionBold.copyWith(color: HenuColors.outline),
                              ),
                            ],
                          ),
                        ),

                        const SizedBox(height: 16),

                        // Gender Selection Toggle
                        const Text('Select Profile Gender', style: HenuTypography.captionBold),
                        const SizedBox(height: 6),
                        Row(
                          children: [
                            Expanded(
                              child: InkWell(
                                onTap: () {
                                  setState(() {
                                    _selectedGender = 'male';
                                    _emailController.text = 'siddharth@folio.enterprise';
                                  });
                                },
                                borderRadius: HenuSpacing.roundedMd,
                                child: Container(
                                  padding: const EdgeInsets.symmetric(vertical: 10),
                                  decoration: BoxDecoration(
                                    color: _selectedGender == 'male'
                                        ? HenuColors.primary
                                        : HenuColors.surfaceContainer,
                                    borderRadius: HenuSpacing.roundedMd,
                                    border: Border.all(
                                      color: _selectedGender == 'male'
                                          ? HenuColors.primary
                                          : const Color(0x33C9C4D0),
                                    ),
                                  ),
                                  child: Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Icon(
                                        Icons.male,
                                        size: 18,
                                        color: _selectedGender == 'male'
                                            ? Colors.white
                                            : HenuColors.onSurface,
                                      ),
                                      const SizedBox(width: 6),
                                      Text(
                                        'Male (Siddharth)',
                                        style: HenuTypography.captionBold.copyWith(
                                          color: _selectedGender == 'male'
                                              ? Colors.white
                                              : HenuColors.onSurface,
                                          fontSize: 11,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                            const SizedBox(width: 10),
                            Expanded(
                              child: InkWell(
                                onTap: () {
                                  setState(() {
                                    _selectedGender = 'female';
                                    _emailController.text = 'priya@folio.enterprise';
                                  });
                                },
                                borderRadius: HenuSpacing.roundedMd,
                                child: Container(
                                  padding: const EdgeInsets.symmetric(vertical: 10),
                                  decoration: BoxDecoration(
                                    color: _selectedGender == 'female'
                                        ? HenuColors.primary
                                        : HenuColors.surfaceContainer,
                                    borderRadius: HenuSpacing.roundedMd,
                                    border: Border.all(
                                      color: _selectedGender == 'female'
                                          ? HenuColors.primary
                                          : const Color(0x33C9C4D0),
                                    ),
                                  ),
                                  child: Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Icon(
                                        Icons.female,
                                        size: 18,
                                        color: _selectedGender == 'female'
                                            ? Colors.white
                                            : HenuColors.onSurface,
                                      ),
                                      const SizedBox(width: 6),
                                      Text(
                                        'Female (Priya)',
                                        style: HenuTypography.captionBold.copyWith(
                                          color: _selectedGender == 'female'
                                              ? Colors.white
                                              : HenuColors.onSurface,
                                          fontSize: 11,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),

                        const SizedBox(height: 18),

                        const Text('Welcome back', style: HenuTypography.headlineLarge),
                        const SizedBox(height: 4),
                        const Text(
                          'Access your active advisory folios, milestones, and encrypted statements.',
                          style: HenuTypography.bodyMedium,
                        ),

                        if (_errorMessage != null) ...[
                          const SizedBox(height: 14),
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: HenuColors.errorContainer.withOpacity(0.5),
                              borderRadius: HenuSpacing.roundedMd,
                              border: Border.all(color: HenuColors.error.withOpacity(0.3)),
                            ),
                            child: Row(
                              children: [
                                const Icon(Icons.error_outline, color: HenuColors.error, size: 20),
                                const SizedBox(width: 10),
                                Expanded(
                                  child: Text(
                                    _errorMessage!,
                                    style: HenuTypography.caption.copyWith(color: HenuColors.onErrorContainer),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],

                        const SizedBox(height: 18),

                        // Email Input
                        HenuInput(
                          label: 'Email Address',
                          sublabel: 'Work profile',
                          hint: 'name@organization.com',
                          controller: _emailController,
                          keyboardType: TextInputType.emailAddress,
                          suffixIcon: const Icon(Icons.verified_user_outlined, color: HenuColors.secondary, size: 18),
                        ),

                        const SizedBox(height: 14),

                        // Password Input
                        HenuInput(
                          label: 'Password',
                          hint: 'Enter your password',
                          controller: _passwordController,
                          obscureText: _obscurePassword,
                          suffixIcon: IconButton(
                            icon: Icon(
                              _obscurePassword ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                              size: 18,
                              color: HenuColors.outline,
                            ),
                            onPressed: () {
                              setState(() {
                                _obscurePassword = !_obscurePassword;
                              });
                            },
                          ),
                        ),

                        const SizedBox(height: 6),

                        // Forgot Password Link
                        Align(
                          alignment: Alignment.centerRight,
                          child: TextButton(
                            onPressed: () {
                              Navigator.of(context).push(
                                MaterialPageRoute(builder: (_) => const ForgotPasswordScreen()),
                              );
                            },
                            child: Text(
                              'Forgot Password?',
                              style: HenuTypography.captionBold.copyWith(color: HenuColors.primary),
                            ),
                          ),
                        ),

                        const SizedBox(height: 14),

                        // Sign In CTA
                        HenuButton(
                          text: 'Sign In',
                          icon: Icons.lock_open,
                          isLoading: _isLoading,
                          onPressed: _handleLogin,
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Trust Indicator Strip
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.verified, size: 14, color: HenuColors.secondary),
                      const SizedBox(width: 6),
                      Text('SOC2 Attested', style: HenuTypography.caption.copyWith(color: HenuColors.onSurfaceVariant)),
                      const SizedBox(width: 16),
                      Container(width: 1, height: 12, color: HenuColors.outlineVariant),
                      const SizedBox(width: 16),
                      const Icon(Icons.shield, size: 14, color: HenuColors.primary),
                      const SizedBox(width: 6),
                      Text('256-bit Encrypted', style: HenuTypography.caption.copyWith(color: HenuColors.onSurfaceVariant)),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
