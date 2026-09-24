/// Public Client Application Configuration
/// NOTE: Never place secret keys (Service Role, Razorpay Secret, Cashfree Secret, AI keys) in this file.
class AppConfig {
  AppConfig._();

  static const String appName = 'HENU OS CLM';
  static const String appVersion = '1.0.0';
  static const String appEnv = String.fromEnvironment('APP_ENV', defaultValue: 'production');

  // Supabase Public Configuration (Safe for client apps)
  static const String supabaseUrl = String.fromEnvironment(
    'SUPABASE_URL',
    defaultValue: 'https://clm-project.supabase.co',
  );

  static const String supabaseAnonKey = String.fromEnvironment(
    'SUPABASE_ANON_KEY',
    defaultValue: 'public-anon-key-token-client-safe',
  );

  // Default Session Config
  static const int sessionTimeoutMinutes = 60;
  static const bool enableBiometricAuth = true;
}
