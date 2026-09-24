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
    defaultValue: 'https://tefgaqtrltpsccqzesmy.supabase.co',
  );

  static const String supabaseAnonKey = String.fromEnvironment(
    'SUPABASE_ANON_KEY',
    defaultValue: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlZmdhcXRybHRwc2NjcXplc215Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxOTgwNjYsImV4cCI6MjEwNTc3NDA2Nn0.WC3yPSSh2gGGx9tccj6xmAjMMArDlpOq8UNXV-64Jcs',
  );

  // Default Session Config
  static const int sessionTimeoutMinutes = 60;
  static const bool enableBiometricAuth = true;
}
