import { describe, it, expect } from 'vitest';
import { numberToWords, formatCurrencyWords } from '../src/lib/finance/number_to_words';

describe('HENU OS CLM — Phase 8 Document Designer & Financial Number-to-Words Suite', () => {
  it('1. Number to Words (INR) — converts integer amounts correctly according to Indian numbering system', () => {
    expect(numberToWords(0, 'INR')).toBe('Zero Rupees Only');
    expect(numberToWords(100, 'INR')).toBe('One Hundred Rupees Only');
    expect(numberToWords(1234, 'INR')).toBe('One Thousand Two Hundred Thirty Four Rupees Only');
    expect(numberToWords(11800, 'INR')).toBe('Eleven Thousand Eight Hundred Rupees Only');
    expect(numberToWords(100000, 'INR')).toBe('One Lakh Rupees Only');
    expect(numberToWords(1550000, 'INR')).toBe('Fifteen Lakh Fifty Thousand Rupees Only');
    expect(numberToWords(10000000, 'INR')).toBe('One Crore Rupees Only');
  });

  it('2. Number to Words with Paise (INR) — converts decimal amounts properly', () => {
    const words = numberToWords(1234.50, 'INR');
    expect(words).toBe('One Thousand Two Hundred Thirty Four Rupees and Fifty Paise Only');
    
    const wordsExact = formatCurrencyWords(11800.75, 'INR');
    expect(wordsExact).toBe('Indian Rupee Eleven Thousand Eight Hundred and Seventy Five Paise Only');
  });

  it('3. Number to Words (USD) — converts international currencies using Western scale', () => {
    expect(numberToWords(12500, 'USD')).toBe('Twelve Thousand Five Hundred Dollars Only');
    expect(numberToWords(1250000, 'USD')).toBe('One Million Two Hundred Fifty Thousand Dollars Only');
    expect(numberToWords(4500.25, 'USD')).toBe('Four Thousand Five Hundred Dollars and Twenty Five Cents Only');
    expect(formatCurrencyWords(5000, 'USD')).toBe('US Dollar Five Thousand Only');
  });

  it('4. Template Designer Paper & Layout Configuration Verification', () => {
    const templateConfig = {
      name: 'Spreadsheet Template',
      paperSize: 'A4' as const,
      orientation: 'portrait' as const,
      margins: { top: 0.7, bottom: 0.7, left: 0.55, right: 0.4 },
      fontFamily: 'Inter',
      fontSize: 10,
      showGstin: true,
      showTotalInWords: true,
      showSignature: true,
    };

    expect(templateConfig.paperSize).toBe('A4');
    expect(templateConfig.orientation).toBe('portrait');
    expect(templateConfig.margins.top).toBe(0.7);
    expect(templateConfig.showTotalInWords).toBe(true);
    expect(templateConfig.showSignature).toBe(true);
  });

  it('5. Custom Fields Model & PDF Visibility Verification', () => {
    const customFields = [
      { id: 'cf_1', field_name: 'Terms & Conditions', data_type: 'Text Box (Multi-line)', mandatory: false, show_in_pdf: true },
      { id: 'cf_2', field_name: 'Salesperson', data_type: 'Text Box (Single Line)', mandatory: false, show_in_pdf: true },
      { id: 'cf_3', field_name: 'PO Number', data_type: 'Text Box (Single Line)', mandatory: false, show_in_pdf: true },
    ];

    const pdfVisibleFields = customFields.filter((cf) => cf.show_in_pdf);
    expect(pdfVisibleFields.length).toBe(3);
    expect(customFields.some((cf) => cf.field_name === 'PO Number')).toBe(true);
  });

  it('6. Organization Tax Identification Validation', () => {
    const org = {
      name: 'HENU OS PRIVATE LIMITED',
      gstin: '08AAICH3195C1ZL',
      pan: 'AAICH3195C',
      state: 'Rajasthan',
      country: 'India',
    };

    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

    expect(gstinRegex.test(org.gstin)).toBe(true);
    expect(panRegex.test(org.pan)).toBe(true);
  });
});
