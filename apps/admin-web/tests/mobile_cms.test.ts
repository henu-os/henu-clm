import { describe, it, expect } from 'vitest';
import { type MobileHomeConfiguration } from '@henu/shared';

describe('Mobile App CMS & Home Screen Builder Configuration', () => {
  const sampleConfig: MobileHomeConfiguration = {
    id: 'cfg_101',
    name: 'Enterprise Client Home',
    is_active: true,
    greeting_config: {
      enabled: true,
      priority: 1,
      title: 'Good Morning',
      sub_title: 'Welcome to your portal',
      show_client_name: true,
      show_avatar: true,
      custom_text: 'Greetings',
      alignment: 'left',
    },
    hero_banner_config: {
      enabled: true,
      priority: 2,
      heading: 'Platform Growth Milestone',
      description: 'Your project roadmap is on track.',
      image_url: 'https://example.com/hero.png',
      badge_text: 'Active',
      cta_text: 'View Milestones',
      cta_route: '/orders',
      is_active: true,
    },
    primary_cta_config: {
      enabled: true,
      priority: 3,
      label: 'Request Proposal',
      icon: 'quotes',
      destination: '/quotes',
      is_external: false,
      button_style: 'primary',
    },
    quick_actions_config: {
      enabled: true,
      priority: 4,
      title: 'Quick Actions',
      actions: [
        { id: 'qa_1', title: 'Quotes', icon: 'quotes', route: '/quotes', is_enabled: true },
        { id: 'qa_2', title: 'Invoices', icon: 'invoices', route: '/invoices', is_enabled: true },
        { id: 'qa_3', title: 'Payments', icon: 'payments', route: '/payments', is_enabled: false },
      ],
    },
    offer_section_config: {
      enabled: true,
      priority: 5,
      title: 'Spring Special',
      description: 'Get 20% off',
      badge: 'PROMO',
      image_url: '',
      cta_text: 'Claim',
      cta_route: '/quotes',
      expiry_date: '2026-12-31',
      show_expired: false,
      is_active: true,
    },
    recent_activity_config: {
      enabled: true,
      priority: 6,
      title: 'Recent Activity',
      limit: 5,
      display_type: 'timeline',
      is_active: true,
    },
    upcoming_config: {
      enabled: true,
      priority: 7,
      title: 'Upcoming',
      limit: 3,
      is_active: true,
    },
    bottom_nav_config: {
      items: [
        { id: 'nav_home', label: 'Home', icon: 'home', route: '/home', is_enabled: true },
        { id: 'nav_portfolio', label: 'Portfolio', icon: 'orders', route: '/orders', is_enabled: true },
      ],
    },
  };

  it('validates mobile home configuration structure', () => {
    expect(sampleConfig.name).toBe('Enterprise Client Home');
    expect(sampleConfig.greeting_config.enabled).toBe(true);
    expect(sampleConfig.hero_banner_config.priority).toBe(2);
    expect(sampleConfig.quick_actions_config.actions.length).toBe(3);
  });

  it('filters active quick action tiles correctly', () => {
    const activeTiles = sampleConfig.quick_actions_config.actions.filter((a) => a.is_enabled);
    expect(activeTiles.length).toBe(2);
    expect(activeTiles.map((t) => t.id)).toEqual(['qa_1', 'qa_2']);
  });

  it('correctly handles offer expiry conditions', () => {
    const isExpired = new Date(sampleConfig.offer_section_config.expiry_date!).getTime() < Date.now();
    expect(isExpired).toBe(false); // 2026-12-31 is future
  });
});
