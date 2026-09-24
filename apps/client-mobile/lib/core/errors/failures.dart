/// Centralized failure & error model for client-safe messages
class Failure {
  final String message;
  final String code;
  final dynamic details;

  const Failure({
    required this.message,
    this.code = 'UNKNOWN_ERROR',
    this.details,
  });

  factory Failure.network() => const Failure(
        message: 'Network connection unavailable. Please check your internet connection.',
        code: 'NETWORK_ERROR',
      );

  factory Failure.auth(String message) => Failure(
        message: message,
        code: 'AUTH_ERROR',
      );

  factory Failure.permission() => const Failure(
        message: "You do not have permission to perform this action.",
        code: 'FORBIDDEN',
      );

  factory Failure.notFound(String resource) => Failure(
        message: '$resource could not be found.',
        code: 'NOT_FOUND',
      );

  factory Failure.server([String? message]) => Failure(
        message: message ?? 'An unexpected service error occurred. Please try again later.',
        code: 'SERVER_ERROR',
      );

  @override
  String toString() => 'Failure(code: $code, message: $message)';
}
