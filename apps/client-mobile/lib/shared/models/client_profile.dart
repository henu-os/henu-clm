/// Client Profile Model
class ClientProfile {
  final String id;
  final String clientId;
  final String fullName;
  final String companyName;
  final String email;
  final String? phone;
  final String status;
  final String tier;
  final String gender; // 'male' or 'female'
  final DateTime createdAt;

  const ClientProfile({
    required this.id,
    required this.clientId,
    required this.fullName,
    required this.companyName,
    required this.email,
    this.phone,
    required this.status,
    required this.tier,
    this.gender = 'male',
    required this.createdAt,
  });

  String get avatarAssetPath => (gender.toLowerCase() == 'female')
      ? 'assets/images/femaldp.png'
      : 'assets/images/maledp.png';

  factory ClientProfile.fromJson(Map<String, dynamic> json) {
    return ClientProfile(
      id: json['id'] as String? ?? 'usr_001',
      clientId: json['client_id'] as String? ?? 'HENU-CL-000000',
      fullName: json['full_name'] as String? ?? 'Client User',
      companyName: json['company_name'] as String? ?? '',
      email: json['email'] as String? ?? '',
      phone: json['phone'] as String?,
      status: json['status'] as String? ?? 'ACTIVE',
      tier: json['tier'] as String? ?? 'Enterprise',
      gender: json['gender'] as String? ?? 'male',
      createdAt: DateTime.tryParse(json['created_at'] as String? ?? '') ?? DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'client_id': clientId,
        'full_name': fullName,
        'company_name': companyName,
        'email': email,
        'phone': phone,
        'status': status,
        'tier': tier,
        'gender': gender,
        'created_at': createdAt.toIso8601String(),
      };
}
