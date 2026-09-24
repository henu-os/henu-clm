import { describe, it, expect } from 'vitest';
import { CustomerFormSchema, ServiceFormSchema, QuoteApprovalSchema, QuoteRejectionSchema } from '@henu/shared';

describe('Zod Validation Schemas', () => {
  it('validates customer creation form', () => {
    const valid = CustomerFormSchema.safeParse({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      vip_tier: 'Enterprise',
      is_active: true,
    });
    expect(valid.success).toBe(true);

    const invalid = CustomerFormSchema.safeParse({
      first_name: 'J',
      last_name: '',
      email: 'not-an-email',
    });
    expect(invalid.success).toBe(false);
  });

  it('validates service creation form', () => {
    const valid = ServiceFormSchema.safeParse({
      title: 'Enterprise Architecture',
      slug: 'enterprise-architecture',
      description: 'Comprehensive system architecture design',
      category: 'Engineering',
      icon_name: 'hub',
      base_price: 2499,
      currency: 'USD',
      turnaround_time: '2-3 weeks',
      is_featured: true,
      status: 'published',
    });
    expect(valid.success).toBe(true);

    const invalidSlug = ServiceFormSchema.safeParse({
      title: 'Invalid Slug Service',
      slug: 'Invalid Slug!',
      description: 'Short',
      category: 'Engineering',
      icon_name: 'hub',
      base_price: -10,
      currency: 'USD',
      turnaround_time: '1 week',
      is_featured: false,
      status: 'published',
    });
    expect(invalidSlug.success).toBe(false);
  });

  it('validates quote approval and rejection requirements', () => {
    const validApproval = QuoteApprovalSchema.safeParse({
      quote_id: 'b2c5893a-8488-4c74-9f20-8e1215b2e31a',
      final_amount: 4126.46,
      admin_notes: 'Approved with standard terms',
    });
    expect(validApproval.success).toBe(true);

    const invalidRejection = QuoteRejectionSchema.safeParse({
      quote_id: 'b2c5893a-8488-4c74-9f20-8e1215b2e31a',
      rejection_reason: 'No', // Min 5 chars required
    });
    expect(invalidRejection.success).toBe(false);
  });
});
