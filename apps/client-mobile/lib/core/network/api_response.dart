/// Generic API Envelope conforming to the HENU OS CLM standard envelope:
/// Success: { "success": true, "data": T, "metadata": {} }
/// Error: { "success": false, "error": { "code": "...", "message": "..." } }
class ApiResponse<T> {
  final bool success;
  final T? data;
  final String? errorMessage;
  final String? errorCode;
  final Map<String, dynamic>? metadata;

  const ApiResponse.success(this.data, {this.metadata})
      : success = true,
        errorMessage = null,
        errorCode = null;

  const ApiResponse.error(this.errorMessage, {this.errorCode = 'API_ERROR', this.metadata})
      : success = false,
        data = null;
}
