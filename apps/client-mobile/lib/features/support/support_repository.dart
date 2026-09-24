import '../../core/network/api_response.dart';
import '../../shared/models/support_thread.dart';

class SupportRepository {
  static final SupportRepository instance = SupportRepository._();
  SupportRepository._();

  final List<SupportThread> _threads = [
    SupportThread(
      id: 'sup_001',
      subject: 'Staging Deployment & SSL Pinning Review',
      status: 'OPEN',
      priority: 'HIGH',
      assignedAgent: 'Vikram Mehta (Principal Architect)',
      createdAt: DateTime(2026, 5, 10, 14, 30),
      updatedAt: DateTime(2026, 5, 10, 15, 12),
      messages: [
        ChatMessage(
          id: 'msg_01',
          senderType: 'CLIENT',
          senderName: 'Siddharth Rao',
          content: 'Hello Vikram, we reviewed the milestone 4 requirements for staging deployment. Do we need additional whitelisting for the webhook callback endpoints?',
          createdAt: DateTime(2026, 5, 10, 14, 30),
        ),
        ChatMessage(
          id: 'msg_02',
          senderType: 'AGENT',
          senderName: 'Vikram Mehta',
          content: 'Hi Siddharth, our edge function handles signature verification with zero-trust ingress. The sandbox URL is pre-whitelisted and ready for integration testing.',
          createdAt: DateTime(2026, 5, 10, 15, 12),
        ),
      ],
    ),
    SupportThread(
      id: 'sup_002',
      subject: 'Invoice & Corporate Tax Exemption Filing',
      status: 'RESOLVED',
      priority: 'MEDIUM',
      assignedAgent: 'Finance Desk',
      createdAt: DateTime(2026, 4, 15, 10, 0),
      updatedAt: DateTime(2026, 4, 15, 11, 45),
      messages: [
        ChatMessage(
          id: 'msg_03',
          senderType: 'CLIENT',
          senderName: 'Siddharth Rao',
          content: 'Could you share the tax residence certificate for the FY26 billing?',
          createdAt: DateTime(2026, 4, 15, 10, 0),
        ),
        ChatMessage(
          id: 'msg_04',
          senderType: 'AGENT',
          senderName: 'Finance Desk',
          content: 'The document has been uploaded to your secure client repository and attached to INV-2026-081.',
          createdAt: DateTime(2026, 4, 15, 11, 45),
        ),
      ],
    ),
  ];

  Future<ApiResponse<List<SupportThread>>> getThreads() async {
    await Future.delayed(const Duration(milliseconds: 300));
    return ApiResponse.success(List.unmodifiable(_threads));
  }

  Future<ApiResponse<ChatMessage>> sendMessage(String threadId, String content) async {
    await Future.delayed(const Duration(milliseconds: 400));
    final threadIndex = _threads.indexWhere((t) => t.id == threadId);
    if (threadIndex == -1) return const ApiResponse.error('Support thread not found.');

    final message = ChatMessage(
      id: 'msg_${DateTime.now().millisecondsSinceEpoch}',
      senderType: 'CLIENT',
      senderName: 'Siddharth Rao',
      content: content,
      createdAt: DateTime.now(),
    );

    final thread = _threads[threadIndex];
    final updatedMessages = List<ChatMessage>.from(thread.messages)..add(message);
    _threads[threadIndex] = SupportThread(
      id: thread.id,
      subject: thread.subject,
      status: thread.status,
      priority: thread.priority,
      assignedAgent: thread.assignedAgent,
      createdAt: thread.createdAt,
      updatedAt: DateTime.now(),
      messages: updatedMessages,
    );

    return ApiResponse.success(message);
  }
}
