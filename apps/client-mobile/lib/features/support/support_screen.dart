import 'package:flutter/material.dart';
import '../../core/constants/henu_colors.dart';
import '../../core/constants/henu_spacing.dart';
import '../../core/constants/henu_typography.dart';
import '../../core/utils/formatters.dart';
import '../../shared/models/support_thread.dart';
import '../../shared/widgets/henu_badge.dart';
import '../../shared/widgets/state_views.dart';
import 'support_repository.dart';

class SupportScreen extends StatefulWidget {
  const SupportScreen({super.key});

  @override
  State<SupportScreen> createState() => _SupportScreenState();
}

class _SupportScreenState extends State<SupportScreen> {
  bool _isLoading = true;
  List<SupportThread> _threads = [];
  String? _errorMessage;
  SupportThread? _selectedThread;
  final _messageController = TextEditingController();
  bool _isSending = false;

  @override
  void initState() {
    super.initState();
    _loadThreads();
  }

  @override
  void dispose() {
    _messageController.dispose();
    super.dispose();
  }

  Future<void> _loadThreads() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    final res = await SupportRepository.instance.getThreads();
    if (!mounted) return;

    if (res.success && res.data != null) {
      setState(() {
        _threads = res.data!;
        _isLoading = false;
        if (_threads.isNotEmpty && _selectedThread == null) {
          _selectedThread = _threads.first;
        }
      });
    } else {
      setState(() {
        _errorMessage = res.errorMessage ?? 'Failed to load support threads.';
        _isLoading = false;
      });
    }
  }

  Future<void> _handleSendMessage() async {
    final text = _messageController.text.trim();
    if (text.isEmpty || _selectedThread == null) return;

    setState(() => _isSending = true);
    final res = await SupportRepository.instance.sendMessage(_selectedThread!.id, text);
    if (!mounted) return;

    if (res.success) {
      _messageController.clear();
      await _loadThreads();
    }
    setState(() => _isSending = false);
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            SkeletonCard(height: 100),
            SizedBox(height: 12),
            SkeletonCard(height: 200),
          ],
        ),
      );
    }

    if (_errorMessage != null) {
      return ErrorStateView(message: _errorMessage!, onRetry: _loadThreads);
    }

    if (_threads.isEmpty) {
      return const EmptyStateView(
        title: 'No Active Support Tickets',
        description: 'You currently have no open tickets with the Concierge desk.',
        icon: Icons.support_agent_outlined,
      );
    }

    final thread = _selectedThread ?? _threads.first;

    return Column(
      children: [
        // Thread Selector Pill Ribbon
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          color: HenuColors.surfaceContainerLowest,
          child: Row(
            children: [
              Expanded(
                child: SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: _threads.map((t) {
                      final isSelected = t.id == thread.id;
                      return Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: InkWell(
                          onTap: () => setState(() => _selectedThread = t),
                          borderRadius: HenuSpacing.roundedFull,
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                            decoration: BoxDecoration(
                              color: isSelected ? HenuColors.primaryFixed : HenuColors.surfaceContainerLow,
                              borderRadius: HenuSpacing.roundedFull,
                              border: Border.all(color: isSelected ? HenuColors.primary : const Color(0x26C9C4D0)),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text(
                                  t.subject,
                                  style: HenuTypography.captionBold.copyWith(
                                    color: isSelected ? HenuColors.onPrimaryFixed : HenuColors.onSurface,
                                    fontSize: 11,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ),
            ],
          ),
        ),

        // Conversation Header
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
          decoration: const BoxDecoration(
            color: HenuColors.surfaceFolio,
            border: Border(bottom: BorderSide(color: Color(0x26C9C4D0))),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(thread.subject, style: HenuTypography.labelMedium),
                    if (thread.assignedAgent != null)
                      Text('Assigned: ${thread.assignedAgent!}', style: HenuTypography.caption),
                  ],
                ),
              ),
              HenuBadge.status(thread.status),
            ],
          ),
        ),

        // Messages List
        Expanded(
          child: ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: thread.messages.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              final msg = thread.messages[index];
              final isClient = msg.isClient;

              return Align(
                alignment: isClient ? Alignment.centerRight : Alignment.centerLeft,
                child: ConstrainedBox(
                  constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.78),
                  child: Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: isClient ? HenuColors.primary : HenuColors.surfaceContainerLowest,
                      borderRadius: BorderRadius.only(
                        topLeft: const Radius.circular(16),
                        topRight: const Radius.circular(16),
                        bottomLeft: Radius.circular(isClient ? 16 : 4),
                        bottomRight: Radius.circular(isClient ? 4 : 16),
                      ),
                      border: isClient ? null : Border.all(color: const Color(0x33C9C4D0)),
                      boxShadow: HenuSpacing.cardShadow,
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              msg.senderName,
                              style: HenuTypography.captionBold.copyWith(
                                color: isClient ? HenuColors.onPrimary : HenuColors.secondary,
                                fontSize: 11,
                              ),
                            ),
                            const SizedBox(width: 8),
                            Text(
                              HenuFormatters.formatRelativeTime(msg.createdAt),
                              style: HenuTypography.caption.copyWith(
                                color: isClient ? HenuColors.onPrimary.withOpacity(0.7) : HenuColors.outline,
                                fontSize: 10,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 6),
                        Text(
                          msg.content,
                          style: HenuTypography.bodyMedium.copyWith(
                            color: isClient ? HenuColors.onPrimary : HenuColors.onSurface,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            },
          ),
        ),

        // Composer
        Container(
          padding: const EdgeInsets.all(12),
          decoration: const BoxDecoration(
            color: HenuColors.surfaceContainerLowest,
            border: Border(top: BorderSide(color: Color(0x26C9C4D0))),
          ),
          child: SafeArea(
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _messageController,
                    decoration: const InputDecoration(
                      hintText: 'Type your message to the desk...',
                      contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                IconButton(
                  icon: _isSending
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(strokeWidth: 2),
                        )
                      : const Icon(Icons.send, color: HenuColors.primary),
                  onPressed: _isSending ? null : _handleSendMessage,
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
