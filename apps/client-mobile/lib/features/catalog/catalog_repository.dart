import '../../core/network/api_response.dart';
import '../../shared/models/service_item.dart';

class CatalogRepository {
  static final CatalogRepository instance = CatalogRepository._();
  CatalogRepository._();

  final List<ServiceItem> _services = [
    const ServiceItem(
      id: 'srv_001',
      name: 'Strategic Systems Architecture & Audit',
      code: 'ARCH-ADV-01',
      category: 'ADVISORY',
      shortDescription: 'High-availability infrastructure design, security hardening, and SOC2 compliance mapping.',
      fullDescription: 'Comprehensive systems discovery, microservices decomposition, multi-region database topology, zero-trust security audit, and 12-month technical roadmap.',
      startingPrice: 18000,
      currency: 'USD',
      deliveryDays: '14-21 Days',
      features: [
        'Multi-tenant Supabase / PostgreSQL schema optimization',
        'Zero-trust RBAC and security boundaries',
        'High-throughput caching & edge function routing',
        'Executive roadmap & compliance certification blueprint',
      ],
      addOns: [
        ServiceAddOn(
          id: 'add_001',
          title: 'Live 24/7 SRE Incident Response Standby',
          description: '15-minute SLA dedicated escalation response unit',
          price: 4500,
          billingType: 'MONTHLY',
        ),
        ServiceAddOn(
          id: 'add_002',
          title: 'Automated Disaster Recovery Replication',
          description: 'Sub-minute RPO/RTO cross-region replica configuration',
          price: 6000,
          billingType: 'ONE_TIME',
        ),
      ],
    ),
    const ServiceItem(
      id: 'srv_002',
      name: 'Custom Mobile & Web Application Engineering',
      code: 'DEV-FULL-02',
      category: 'DEVELOPMENT',
      shortDescription: 'Enterprise Flutter mobile applications and Next.js 14 Web Portals with bespoke Stitch design.',
      fullDescription: 'Turnkey full-stack product development including design system translation, state machines, offline-first caching, biometrics, and payment gateway bridges.',
      startingPrice: 28000,
      currency: 'USD',
      deliveryDays: '30-45 Days',
      features: [
        'Pixel-perfect Stitch Design System implementation',
        'Cross-platform iOS & Android Flutter codebase',
        'Next.js 14 App Router Admin Web Portal',
        'Native Razorpay & Cashfree payment checkouts',
      ],
      addOns: [
        ServiceAddOn(
          id: 'add_003',
          title: 'App Store & Play Store Accelerated Publication',
          description: 'Full submission, review management, and compliance approval',
          price: 2500,
          billingType: 'ONE_TIME',
        ),
      ],
    ),
    const ServiceItem(
      id: 'srv_003',
      name: 'Autonomous AI Agent & Workflow Engine',
      code: 'AI-ENG-03',
      category: 'AI_SERVICES',
      shortDescription: 'Enterprise LLM orchestration with secure server-side key vaulting and context preservation.',
      fullDescription: 'Private LLM agents, RAG pipelines, fine-tuned semantic retrieval, automated workflow triggers, and customer assistance intelligence.',
      startingPrice: 15000,
      currency: 'USD',
      deliveryDays: '14-20 Days',
      features: [
        'Secure Vault for OpenAI/Anthropic/Gemini keys',
        'Semantic vector embeddings & knowledge base',
        'Rate limiting, request timeouts & context token trimming',
        'Real-time streaming agent response channels',
      ],
      addOns: [
        ServiceAddOn(
          id: 'add_004',
          title: 'Custom Domain Fine-Tuned Model Weights',
          description: 'Specialized enterprise dataset training & validation',
          price: 8000,
          billingType: 'ONE_TIME',
        ),
      ],
    ),
  ];

  Future<ApiResponse<List<ServiceItem>>> getServices({String? category}) async {
    await Future.delayed(const Duration(milliseconds: 300));
    if (category != null && category != 'ALL') {
      return ApiResponse.success(_services.where((s) => s.category == category).toList());
    }
    return ApiResponse.success(List.unmodifiable(_services));
  }
}
