class ChatMessage {
  final String id;
  final String senderType; // 'CLIENT' or 'AGENT'
  final String senderName;
  final String content;
  final DateTime createdAt;

  const ChatMessage({
    required this.id,
    required this.senderType,
    required this.senderName,
    required this.content,
    required this.createdAt,
  });

  bool get isClient => senderType == 'CLIENT';

  factory ChatMessage.fromJson(Map<String, dynamic> json) {
    return ChatMessage(
      id: json['id'] as String,
      senderType: json['sender_type'] as String? ?? 'CLIENT',
      senderName: json['sender_name'] as String? ?? 'Client User',
      content: json['content'] as String,
      createdAt: DateTime.tryParse(json['created_at'] as String? ?? '') ?? DateTime.now(),
    );
  }
}

class SupportThread {
  final String id;
  final String subject;
  final String status;
  final String priority;
  final String? assignedAgent;
  final DateTime createdAt;
  final DateTime updatedAt;
  final List<ChatMessage> messages;

  const SupportThread({
    required this.id,
    required this.subject,
    required this.status,
    required this.priority,
    this.assignedAgent,
    required this.createdAt,
    required this.updatedAt,
    required this.messages,
  });

  factory SupportThread.fromJson(Map<String, dynamic> json) {
    return SupportThread(
      id: json['id'] as String,
      subject: json['subject'] as String,
      status: json['status'] as String? ?? 'OPEN',
      priority: json['priority'] as String? ?? 'MEDIUM',
      assignedAgent: json['assigned_agent'] as String?,
      createdAt: DateTime.tryParse(json['created_at'] as String? ?? '') ?? DateTime.now(),
      updatedAt: DateTime.tryParse(json['updated_at'] as String? ?? '') ?? DateTime.now(),
      messages: (json['messages'] as List<dynamic>?)
              ?.map((e) => ChatMessage.fromJson(e as Map<String, dynamic>))
              .toList() ??
          [],
    );
  }
}
