
class GreetingConfig {
  final bool enabled;
  final int priority;
  final String title;
  final String subTitle;
  final bool showClientName;
  final bool showAvatar;
  final String customText;
  final String alignment;

  const GreetingConfig({
    this.enabled = true,
    this.priority = 1,
    this.title = 'Good Morning',
    this.subTitle = 'Welcome back!',
    this.showClientName = true,
    this.showAvatar = true,
    this.customText = '',
    this.alignment = 'left',
  });

  factory GreetingConfig.fromJson(Map<String, dynamic>? json) {
    if (json == null) return const GreetingConfig();
    return GreetingConfig(
      enabled: json['enabled'] as bool? ?? true,
      priority: json['priority'] as int? ?? 1,
      title: json['title'] as String? ?? 'Good Morning',
      subTitle: json['sub_title'] as String? ?? 'Welcome back!',
      showClientName: json['show_client_name'] as bool? ?? true,
      showAvatar: json['show_avatar'] as bool? ?? true,
      customText: json['custom_text'] as String? ?? '',
      alignment: json['alignment'] as String? ?? 'left',
    );
  }

  Map<String, dynamic> toJson() => {
    'enabled': enabled,
    'priority': priority,
    'title': title,
    'sub_title': subTitle,
    'show_client_name': showClientName,
    'show_avatar': showAvatar,
    'custom_text': customText,
    'alignment': alignment,
  };
}

class HeroBannerConfig {
  final bool enabled;
  final int priority;
  final String heading;
  final String description;
  final String imageUrl;
  final String badgeText;
  final String ctaText;
  final String ctaRoute;
  final String? secondaryCtaText;
  final String? secondaryCtaRoute;
  final String? startDate;
  final String? expiryDate;
  final bool isActive;

  const HeroBannerConfig({
    this.enabled = true,
    this.priority = 2,
    this.heading = 'Your business, managed smarter.',
    this.description = 'Manage your services, projects and payments from one place.',
    this.imageUrl = 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=800&auto=format&fit=crop',
    this.badgeText = 'Priority Milestone',
    this.ctaText = 'Review Deliverables',
    this.ctaRoute = '/orders',
    this.secondaryCtaText,
    this.secondaryCtaRoute,
    this.startDate,
    this.expiryDate,
    this.isActive = true,
  });

  factory HeroBannerConfig.fromJson(Map<String, dynamic>? json) {
    if (json == null) return const HeroBannerConfig();
    return HeroBannerConfig(
      enabled: json['enabled'] as bool? ?? true,
      priority: json['priority'] as int? ?? 2,
      heading: json['heading'] as String? ?? 'Your business, managed smarter.',
      description: json['description'] as String? ?? 'Manage your services, projects and payments from one place.',
      imageUrl: json['image_url'] as String? ?? 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=800&auto=format&fit=crop',
      badgeText: json['badge_text'] as String? ?? 'Priority Milestone',
      ctaText: json['cta_text'] as String? ?? 'Review Deliverables',
      ctaRoute: json['cta_route'] as String? ?? '/orders',
      secondaryCtaText: json['secondary_cta_text'] as String?,
      secondaryCtaRoute: json['secondary_cta_route'] as String?,
      startDate: json['start_date'] as String?,
      expiryDate: json['expiry_date'] as String?,
      isActive: json['is_active'] as bool? ?? true,
    );
  }

  Map<String, dynamic> toJson() => {
    'enabled': enabled,
    'priority': priority,
    'heading': heading,
    'description': description,
    'image_url': imageUrl,
    'badge_text': badgeText,
    'cta_text': ctaText,
    'cta_route': ctaRoute,
    'secondary_cta_text': secondaryCtaText,
    'secondary_cta_route': secondaryCtaRoute,
    'start_date': startDate,
    'expiry_date': expiryDate,
    'is_active': isActive,
  };
}

class PrimaryCtaConfig {
  final bool enabled;
  final int priority;
  final String label;
  final String icon;
  final String destination;
  final bool isExternal;
  final String buttonStyle;

  const PrimaryCtaConfig({
    this.enabled = true,
    this.priority = 3,
    this.label = 'Create Your Quote Now',
    this.icon = 'add_circle_outline',
    this.destination = '/quotes',
    this.isExternal = false,
    this.buttonStyle = 'primary',
  });

  factory PrimaryCtaConfig.fromJson(Map<String, dynamic>? json) {
    if (json == null) return const PrimaryCtaConfig();
    return PrimaryCtaConfig(
      enabled: json['enabled'] as bool? ?? true,
      priority: json['priority'] as int? ?? 3,
      label: json['label'] as String? ?? 'Create Your Quote Now',
      icon: json['icon'] as String? ?? 'add_circle_outline',
      destination: json['destination'] as String? ?? '/quotes',
      isExternal: json['is_external'] as bool? ?? false,
      buttonStyle: json['button_style'] as String? ?? 'primary',
    );
  }

  Map<String, dynamic> toJson() => {
    'enabled': enabled,
    'priority': priority,
    'label': label,
    'icon': icon,
    'destination': destination,
    'is_external': isExternal,
    'button_style': buttonStyle,
  };
}

class QuickActionTile {
  final String id;
  final String title;
  final String icon;
  final String route;
  final bool isEnabled;
  final String? badgeText;
  final bool isExternal;

  const QuickActionTile({
    required this.id,
    required this.title,
    required this.icon,
    required this.route,
    this.isEnabled = true,
    this.badgeText,
    this.isExternal = false,
  });

  factory QuickActionTile.fromJson(Map<String, dynamic> json) {
    return QuickActionTile(
      id: json['id'] as String? ?? '',
      title: json['title'] as String? ?? '',
      icon: json['icon'] as String? ?? 'grid_view',
      route: json['route'] as String? ?? '/home',
      isEnabled: json['is_enabled'] as bool? ?? true,
      badgeText: json['badge_text'] as String?,
      isExternal: json['is_external'] as bool? ?? false,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'icon': icon,
    'route': route,
    'is_enabled': isEnabled,
    'badge_text': badgeText,
    'is_external': isExternal,
  };
}

class QuickActionsConfig {
  final bool enabled;
  final int priority;
  final String title;
  final List<QuickActionTile> actions;

  const QuickActionsConfig({
    this.enabled = true,
    this.priority = 4,
    this.title = 'Quick Actions',
    this.actions = const [],
  });

  factory QuickActionsConfig.fromJson(Map<String, dynamic>? json) {
    if (json == null) return const QuickActionsConfig();
    final rawActions = json['actions'] as List<dynamic>? ?? [];
    return QuickActionsConfig(
      enabled: json['enabled'] as bool? ?? true,
      priority: json['priority'] as int? ?? 4,
      title: json['title'] as String? ?? 'Quick Actions',
      actions: rawActions.map((e) => QuickActionTile.fromJson(e as Map<String, dynamic>)).toList(),
    );
  }

  Map<String, dynamic> toJson() => {
    'enabled': enabled,
    'priority': priority,
    'title': title,
    'actions': actions.map((e) => e.toJson()).toList(),
  };
}

class OfferSectionConfig {
  final bool enabled;
  final int priority;
  final String title;
  final String description;
  final String badge;
  final String imageUrl;
  final String ctaText;
  final String ctaRoute;
  final String? startDate;
  final String? expiryDate;
  final bool showExpired;
  final String backgroundColor;
  final bool isActive;

  const OfferSectionConfig({
    this.enabled = true,
    this.priority = 5,
    this.title = 'Special Offer',
    this.description = 'Get your project started today with 15% off advisory packages.',
    this.badge = '15% DISCOUNT',
    this.imageUrl = '',
    this.ctaText = 'Claim Offer',
    this.ctaRoute = '/quotes',
    this.startDate,
    this.expiryDate,
    this.showExpired = false,
    this.backgroundColor = '#181A20',
    this.isActive = true,
  });

  bool get isExpired {
    if (expiryDate == null || expiryDate!.isEmpty) return false;
    try {
      final expiry = DateTime.parse(expiryDate!);
      return DateTime.now().isAfter(expiry);
    } catch (_) {
      return false;
    }
  }

  bool get shouldDisplay {
    if (!enabled || !isActive) return false;
    if (isExpired && !showExpired) return false;
    return true;
  }

  factory OfferSectionConfig.fromJson(Map<String, dynamic>? json) {
    if (json == null) return const OfferSectionConfig();
    return OfferSectionConfig(
      enabled: json['enabled'] as bool? ?? true,
      priority: json['priority'] as int? ?? 5,
      title: json['title'] as String? ?? 'Special Offer',
      description: json['description'] as String? ?? 'Get your project started today.',
      badge: json['badge'] as String? ?? 'SPECIAL OFFER',
      imageUrl: json['image_url'] as String? ?? '',
      ctaText: json['cta_text'] as String? ?? 'Create Quote',
      ctaRoute: json['cta_route'] as String? ?? '/quotes',
      startDate: json['start_date'] as String?,
      expiryDate: json['expiry_date'] as String?,
      showExpired: json['show_expired'] as bool? ?? false,
      backgroundColor: json['background_color'] as String? ?? '#181A20',
      isActive: json['is_active'] as bool? ?? true,
    );
  }

  Map<String, dynamic> toJson() => {
    'enabled': enabled,
    'priority': priority,
    'title': title,
    'description': description,
    'badge': badge,
    'image_url': imageUrl,
    'cta_text': ctaText,
    'cta_route': ctaRoute,
    'start_date': startDate,
    'expiry_date': expiryDate,
    'show_expired': showExpired,
    'background_color': backgroundColor,
    'is_active': isActive,
  };
}

class RecentActivityConfig {
  final bool enabled;
  final int priority;
  final String title;
  final int limit;
  final String displayType;
  final bool isActive;

  const RecentActivityConfig({
    this.enabled = true,
    this.priority = 6,
    this.title = 'Recent Activity',
    this.limit = 5,
    this.displayType = 'timeline',
    this.isActive = true,
  });

  factory RecentActivityConfig.fromJson(Map<String, dynamic>? json) {
    if (json == null) return const RecentActivityConfig();
    return RecentActivityConfig(
      enabled: json['enabled'] as bool? ?? true,
      priority: json['priority'] as int? ?? 6,
      title: json['title'] as String? ?? 'Recent Activity',
      limit: json['limit'] as int? ?? 5,
      displayType: json['display_type'] as String? ?? 'timeline',
      isActive: json['is_active'] as bool? ?? true,
    );
  }

  Map<String, dynamic> toJson() => {
    'enabled': enabled,
    'priority': priority,
    'title': title,
    'limit': limit,
    'display_type': displayType,
    'is_active': isActive,
  };
}

class UpcomingConfig {
  final bool enabled;
  final int priority;
  final String title;
  final int limit;
  final bool isActive;

  const UpcomingConfig({
    this.enabled = true,
    this.priority = 7,
    this.title = 'Upcoming',
    this.limit = 3,
    this.isActive = true,
  });

  factory UpcomingConfig.fromJson(Map<String, dynamic>? json) {
    if (json == null) return const UpcomingConfig();
    return UpcomingConfig(
      enabled: json['enabled'] as bool? ?? true,
      priority: json['priority'] as int? ?? 7,
      title: json['title'] as String? ?? 'Upcoming',
      limit: json['limit'] as int? ?? 3,
      isActive: json['is_active'] as bool? ?? true,
    );
  }

  Map<String, dynamic> toJson() => {
    'enabled': enabled,
    'priority': priority,
    'title': title,
    'limit': limit,
    'is_active': isActive,
  };
}

class BottomNavItem {
  final String id;
  final String label;
  final String icon;
  final String route;
  final bool isEnabled;

  const BottomNavItem({
    required this.id,
    required this.label,
    required this.icon,
    required this.route,
    this.isEnabled = true,
  });

  factory BottomNavItem.fromJson(Map<String, dynamic> json) {
    return BottomNavItem(
      id: json['id'] as String? ?? '',
      label: json['label'] as String? ?? '',
      icon: json['icon'] as String? ?? 'home_outlined',
      route: json['route'] as String? ?? '/home',
      isEnabled: json['is_enabled'] as bool? ?? true,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'label': label,
    'icon': icon,
    'route': route,
    'is_enabled': isEnabled,
  };
}

class BottomNavConfig {
  final List<BottomNavItem> items;

  const BottomNavConfig({this.items = const []});

  factory BottomNavConfig.fromJson(Map<String, dynamic>? json) {
    if (json == null) return const BottomNavConfig();
    final rawItems = json['items'] as List<dynamic>? ?? [];
    return BottomNavConfig(
      items: rawItems.map((e) => BottomNavItem.fromJson(e as Map<String, dynamic>)).toList(),
    );
  }

  Map<String, dynamic> toJson() => {
    'items': items.map((e) => e.toJson()).toList(),
  };
}

class MobileHomeConfig {
  final String id;
  final String name;
  final bool isActive;
  final GreetingConfig greeting;
  final HeroBannerConfig heroBanner;
  final PrimaryCtaConfig primaryCta;
  final QuickActionsConfig quickActions;
  final OfferSectionConfig offerSection;
  final RecentActivityConfig recentActivity;
  final UpcomingConfig upcoming;
  final BottomNavConfig bottomNav;

  const MobileHomeConfig({
    this.id = 'default',
    this.name = 'Default Mobile Home',
    this.isActive = true,
    this.greeting = const GreetingConfig(),
    this.heroBanner = const HeroBannerConfig(),
    this.primaryCta = const PrimaryCtaConfig(),
    this.quickActions = const QuickActionsConfig(
      actions: [
        QuickActionTile(id: 'qa_1', title: 'Quotes', icon: 'request_quote_outlined', route: '/quotes'),
        QuickActionTile(id: 'qa_2', title: 'Invoices', icon: 'receipt_long_outlined', route: '/invoices'),
        QuickActionTile(id: 'qa_3', title: 'Payments', icon: 'credit_card_outlined', route: '/payments'),
        QuickActionTile(id: 'qa_4', title: 'Orders', icon: 'folder_outlined', route: '/orders'),
        QuickActionTile(id: 'qa_5', title: 'Projects', icon: 'assignment_outlined', route: '/delivery'),
        QuickActionTile(id: 'qa_6', title: 'Support', icon: 'support_agent_outlined', route: '/support'),
        QuickActionTile(id: 'qa_7', title: 'Catalog', icon: 'shopping_cart_outlined', route: '/catalog'),
        QuickActionTile(id: 'qa_8', title: 'Profile', icon: 'person_outline', route: '/profile'),
      ],
    ),
    this.offerSection = const OfferSectionConfig(),
    this.recentActivity = const RecentActivityConfig(),
    this.upcoming = const UpcomingConfig(),
    this.bottomNav = const BottomNavConfig(
      items: [
        BottomNavItem(id: 'nav_home', label: 'Home', icon: 'home_outlined', route: '/home'),
        BottomNavItem(id: 'nav_portfolio', label: 'Portfolio', icon: 'folder_outlined', route: '/orders'),
        BottomNavItem(id: 'nav_services', label: 'Services', icon: 'room_service_outlined', route: '/catalog'),
        BottomNavItem(id: 'nav_finance', label: 'Finance', icon: 'receipt_long_outlined', route: '/invoices'),
        BottomNavItem(id: 'nav_profile', label: 'Hub', icon: 'person_outline', route: '/profile'),
      ],
    ),
  });

  factory MobileHomeConfig.fromJson(Map<String, dynamic> json) {
    return MobileHomeConfig(
      id: json['id'] as String? ?? 'default',
      name: json['name'] as String? ?? 'Default Mobile Home',
      isActive: json['is_active'] as bool? ?? true,
      greeting: GreetingConfig.fromJson(json['greeting_config'] as Map<String, dynamic>?),
      heroBanner: HeroBannerConfig.fromJson(json['hero_banner_config'] as Map<String, dynamic>?),
      primaryCta: PrimaryCtaConfig.fromJson(json['primary_cta_config'] as Map<String, dynamic>?),
      quickActions: QuickActionsConfig.fromJson(json['quick_actions_config'] as Map<String, dynamic>?),
      offerSection: OfferSectionConfig.fromJson(json['offer_section_config'] as Map<String, dynamic>?),
      recentActivity: RecentActivityConfig.fromJson(json['recent_activity_config'] as Map<String, dynamic>?),
      upcoming: UpcomingConfig.fromJson(json['upcoming_config'] as Map<String, dynamic>?),
      bottomNav: BottomNavConfig.fromJson(json['bottom_nav_config'] as Map<String, dynamic>?),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'is_active': isActive,
    'greeting_config': greeting.toJson(),
    'hero_banner_config': heroBanner.toJson(),
    'primary_cta_config': primaryCta.toJson(),
    'quick_actions_config': quickActions.toJson(),
    'offer_section_config': offerSection.toJson(),
    'recent_activity_config': recentActivity.toJson(),
    'upcoming_config': upcoming.toJson(),
    'bottom_nav_config': bottomNav.toJson(),
  };

  /// Returns sections ordered by priority
  List<String> get orderedSectionKeys {
    final list = [
      MapEntry('greeting', greeting.enabled ? greeting.priority : -1),
      MapEntry('hero_banner', heroBanner.enabled && heroBanner.isActive ? heroBanner.priority : -1),
      MapEntry('primary_cta', primaryCta.enabled ? primaryCta.priority : -1),
      MapEntry('quick_actions', quickActions.enabled ? quickActions.priority : -1),
      MapEntry('offer_section', offerSection.shouldDisplay ? offerSection.priority : -1),
      MapEntry('recent_activity', recentActivity.enabled && recentActivity.isActive ? recentActivity.priority : -1),
      MapEntry('upcoming', upcoming.enabled && upcoming.isActive ? upcoming.priority : -1),
    ];

    list.retainWhere((entry) => entry.value >= 0);
    list.sort((a, b) => a.value.compareTo(b.value));
    return list.map((e) => e.key).toList();
  }
}
